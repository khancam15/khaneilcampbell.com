#!/usr/bin/env python3
"""Stamp the shared header and footer from _partials/ into every page.

The site has no build step, so each page carries its own copy of the shell
between marker comments:

    <!-- shell:header current="about.html" -->
    ...
    <!-- /shell:header -->

    <!-- shell:footer -->
    ...
    <!-- /shell:footer -->

Edit _partials/header.html or _partials/footer.html, then run this script to
rewrite every copy. `current` names the nav link that gets aria-current="page";
leave it out on pages that belong to no section (home, 404).

A page without markers (for example a newly added one) is adopted: its
existing skip link and <header class="nav"> block, and its <footer class="foot">
block, are wrapped in markers, keeping whichever nav link it already marked
as current.

    python3 scripts/apply_shell.py .          rewrite pages in place
    python3 scripts/apply_shell.py . --check  exit 1 if any page has drifted
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


HEADER_BLOCK = re.compile(
    r'<!-- shell:header(?: current="(?P<current>[^"]*)")? -->\n.*?<!-- /shell:header -->',
    re.DOTALL,
)
FOOTER_BLOCK = re.compile(r"<!-- shell:footer -->\n.*?<!-- /shell:footer -->", re.DOTALL)

# Unmarked shell, as written by hand before this script existed.
LEGACY_HEADER = re.compile(
    r'<a class="skip-link" href="#main">.*?</header>', re.DOTALL
)
LEGACY_FOOTER = re.compile(r'<footer class="foot">.*?</footer>', re.DOTALL)
LEGACY_CURRENT = re.compile(r'<a href="([^"]+)" aria-current="page">')


def render_header(partial: str, current: str) -> str:
    body = partial.rstrip("\n")
    if current:
        link = f'<li><a href="{current}">'
        if link not in body:
            raise ValueError(f'current="{current}" matches no nav link in the header')
        body = body.replace(link, f'<li><a href="{current}" aria-current="page">', 1)
    attr = f' current="{current}"' if current else ""
    return f"<!-- shell:header{attr} -->\n{body}\n<!-- /shell:header -->"


def render_footer(partial: str) -> str:
    return f"<!-- shell:footer -->\n{partial.rstrip(chr(10))}\n<!-- /shell:footer -->"


def apply(html: str, header: str, footer: str, name: str) -> str:
    match = HEADER_BLOCK.search(html)
    if match:
        current = match.group("current") or ""
        html = html[: match.start()] + render_header(header, current) + html[match.end() :]
    else:
        legacy = LEGACY_HEADER.search(html)
        if not legacy:
            raise ValueError(f"{name}: no shell:header markers and no skip link + header to adopt")
        found = LEGACY_CURRENT.search(legacy.group(0))
        current = found.group(1) if found else ""
        html = html[: legacy.start()] + render_header(header, current) + html[legacy.end() :]

    match = FOOTER_BLOCK.search(html)
    if not match:
        match = LEGACY_FOOTER.search(html)
        if not match:
            raise ValueError(f'{name}: no shell:footer markers and no <footer class="foot"> to adopt')
    return html[: match.start()] + render_footer(footer) + html[match.end() :]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("root", nargs="?", default=".", type=Path)
    parser.add_argument("--check", action="store_true", help="report drift without writing")
    args = parser.parse_args()

    root = args.root
    header = (root / "_partials" / "header.html").read_text(encoding="utf-8")
    footer = (root / "_partials" / "footer.html").read_text(encoding="utf-8")

    stale: list[str] = []
    for page in sorted(root.glob("*.html")):
        original = page.read_text(encoding="utf-8")
        try:
            updated = apply(original, header, footer, page.name)
        except ValueError as error:
            print(f"FAIL: {error}")
            return 1
        if updated != original:
            stale.append(page.name)
            if not args.check:
                page.write_text(updated, encoding="utf-8")

    if args.check:
        for name in stale:
            print(f"FAIL: {name} does not match _partials/; run python3 scripts/apply_shell.py")
        if not stale:
            print("PASS: every page uses the shared shell")
        return 1 if stale else 0

    for name in stale:
        print(f"updated {name}")
    if not stale:
        print("every page already matches _partials/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
