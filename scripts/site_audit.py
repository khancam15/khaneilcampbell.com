#!/usr/bin/env python3
"""Audit static HTML pages for security, accessibility, and link hygiene."""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse


REQUIRED_HEADERS = {
    "Content-Security-Policy",
    "Permissions-Policy",
    "Referrer-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
}

# Credential-shaped values (a keyword followed by = or :), not prose that
# merely mentions secrets or passwords.
SENSITIVE_PATTERN = re.compile(
    r"(?:api[_-]?key|password|passwd|secret|private[_-]?key|access[_-]?token)\s*[:=]\s*\S",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class Issue:
    severity: str
    file: str
    message: str


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.lang = ""
        self.meta: list[dict[str, str]] = []
        self.links: list[dict[str, str]] = []
        self.images: list[dict[str, str]] = []
        self.inline_handlers: list[str] = []
        self.csp = ""
        self._in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {name.lower(): value or "" for name, value in attrs}

        if tag == "html":
            self.lang = attr_map.get("lang", "")
        elif tag == "title":
            self._in_title = True
        elif tag == "meta":
            self.meta.append(attr_map)
            if attr_map.get("http-equiv", "").lower() == "content-security-policy":
                self.csp = attr_map.get("content", "")
        elif tag == "a":
            self.links.append(attr_map)
        elif tag == "img":
            self.images.append(attr_map)

        self.inline_handlers.extend(name for name in attr_map if name.startswith("on"))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data.strip()


def find_html_files(root: Path) -> list[Path]:
    return sorted(path for path in root.glob("*.html") if path.is_file())


def has_meta(meta: Iterable[dict[str, str]], key: str, value: str) -> bool:
    return any(item.get(key, "").lower() == value.lower() for item in meta)


def has_csp(meta: Iterable[dict[str, str]]) -> bool:
    return any(
        item.get("http-equiv", "").lower() == "content-security-policy"
        for item in meta
    )


def csp_directives(policy: str) -> dict[str, str]:
    directives = {}
    for part in policy.split(";"):
        name, _, value = part.strip().partition(" ")
        if name:
            directives[name.lower()] = " ".join(value.split())
    return directives


def audit_page(root: Path, path: Path, header_csp: str) -> list[Issue]:
    parser = PageParser()
    relative = path.relative_to(root).as_posix()
    text = path.read_text(encoding="utf-8")
    parser.feed(text)

    issues: list[Issue] = []

    if not parser.lang:
        issues.append(Issue("fail", relative, "missing lang attribute on <html>"))
    if not parser.title:
        issues.append(Issue("fail", relative, "missing <title>"))
    if not has_csp(parser.meta):
        issues.append(Issue("fail", relative, "missing CSP meta tag"))
    elif header_csp:
        # The header and the meta tag are both enforced, so they must agree.
        # frame-ancestors only works as a header; browsers ignore it in meta.
        meta = csp_directives(parser.csp)
        header = csp_directives(header_csp)
        header.pop("frame-ancestors", None)
        if "frame-ancestors" in meta:
            issues.append(Issue("fail", relative, "frame-ancestors has no effect in a CSP meta tag"))
            meta.pop("frame-ancestors")
        if meta != header:
            issues.append(Issue("fail", relative, "CSP meta tag differs from the _headers policy"))
    if not has_meta(parser.meta, "name", "referrer"):
        issues.append(Issue("fail", relative, "missing referrer meta tag"))
    if not has_meta(parser.meta, "name", "robots"):
        issues.append(Issue("warn", relative, "missing robots meta tag"))
    if parser.inline_handlers:
        handlers = ", ".join(sorted(set(parser.inline_handlers)))
        issues.append(Issue("warn", relative, f"inline event handlers found: {handlers}"))

    for image in parser.images:
        # alt="" is valid for decorative images; only a missing attribute fails.
        if "alt" not in image:
            src = image.get("src", "unknown image")
            issues.append(Issue("fail", relative, f"image missing alt text: {src}"))

    for link in parser.links:
        href = link.get("href", "")
        target = link.get("target", "")
        rel_tokens = set(link.get("rel", "").split())

        if href.startswith("http://"):
            issues.append(Issue("fail", relative, f"insecure HTTP link: {href}"))
        if target == "_blank" and not {"noopener", "noreferrer"}.issubset(rel_tokens):
            issues.append(Issue("fail", relative, f"target=_blank missing rel protections: {href}"))
        if href and not is_resolvable_link(root, path, href):
            issues.append(Issue("fail", relative, f"local link target not found: {href}"))

    for match in SENSITIVE_PATTERN.finditer(text):
        issues.append(Issue("fail", relative, f"possible sensitive keyword: {match.group(0)}"))

    return issues


def is_resolvable_link(root: Path, source: Path, href: str) -> bool:
    parsed = urlparse(href)
    if parsed.scheme in {"http", "https", "mailto", "tel"}:
        return True
    if href.startswith("#") or href == "":
        return True

    target = href.split("#", 1)[0].split("?", 1)[0]
    if not target:
        return True

    base = root if target.startswith("/") else source.parent
    candidate = (base / target.lstrip("/")).resolve()
    try:
        candidate.relative_to(root.resolve())
    except ValueError:
        return False
    return candidate.exists()


def header_csp(root: Path) -> str:
    header_file = root / "_headers"
    if not header_file.exists():
        return ""
    for line in header_file.read_text(encoding="utf-8").splitlines():
        name, _, value = line.strip().partition(":")
        if name == "Content-Security-Policy":
            return value.strip()
    return ""


def audit_headers(root: Path) -> list[Issue]:
    header_file = root / "_headers"
    if not header_file.exists():
        return [Issue("fail", "_headers", "missing _headers file")]

    text = header_file.read_text(encoding="utf-8")
    return [
        Issue("fail", "_headers", f"missing required header: {header}")
        for header in sorted(REQUIRED_HEADERS)
        if header not in text
    ]


def print_report(issues: list[Issue], page_count: int) -> int:
    failures = [issue for issue in issues if issue.severity == "fail"]
    warnings = [issue for issue in issues if issue.severity == "warn"]

    print("khaneilcampbell.com site audit")
    print(f"pages checked: {page_count}")
    print(f"failures: {len(failures)}")
    print(f"warnings: {len(warnings)}")

    for issue in issues:
        label = issue.severity.upper()
        print(f"{label}: {issue.file}: {issue.message}")

    if failures:
        return 1
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", help="site root to audit")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    pages = find_html_files(root)
    issues = audit_headers(root)
    policy = header_csp(root)

    for page in pages:
        issues.extend(audit_page(root, page, policy))

    return print_report(issues, len(pages))


if __name__ == "__main__":
    sys.exit(main())
