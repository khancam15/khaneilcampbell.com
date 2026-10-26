#!/usr/bin/env python3
"""Stamp the shared head, header and footer from _partials/ into every page.

GitHub Pages serves the repository as is, so the pages stay plain HTML and
each one carries its own copy of the shared blocks between marker comments:

    <!-- shell:head -->            charset, viewport, CSP, referrer, theme color
    <!-- shell:assets -->          icons, manifest, font preloads, CSS and JS
    <!-- shell:header current="about.html" -->   skip link and nav
    <!-- shell:footer -->          site footer

Each block ends with <!-- /shell:NAME -->. Edit the partial in _partials/,
then run this script to rewrite every copy. Partials can use:

    {{root}}           "" by default; root="/" on a marker gives absolute
                       paths (the 404 page is served from any URL)
    {{hash FILE}}      first 8 hex digits of the file's SHA-256, so the
                       ?v= cache buster can never go stale

On the header, `current` names the nav link that gets aria-current="page";
leave it out on pages that belong to no section.

    python3 scripts/build.py .          rewrite pages in place
    python3 scripts/build.py . --check  exit 1 if any page has drifted
"""

from __future__ import annotations

import argparse
import hashlib
import re
import sys
from pathlib import Path


BLOCKS = ("head", "assets", "header", "footer")
BLOCK = re.compile(
    r"<!-- shell:(?P<name>[a-z]+)(?P<attrs>(?: [a-z]+=\"[^\"]*\")*) -->\n"
    r".*?<!-- /shell:(?P=name) -->",
    re.DOTALL,
)
ATTR = re.compile(r'([a-z]+)="([^"]*)"')
HASH = re.compile(r"\{\{hash ([^}]+)\}\}")


def render(name: str, attrs: dict[str, str], partial: str, root: Path) -> str:
    prefix = attrs.get("root", "")
    body = partial.rstrip("\n").replace("{{root}}", prefix)
    body = HASH.sub(
        lambda m: hashlib.sha256((root / m.group(1)).read_bytes()).hexdigest()[:8], body
    )
    current = attrs.get("current")
    if name == "header" and current:
        link = f'<li><a href="{prefix}{current}">'
        if link not in body:
            raise ValueError(f'current="{current}" matches no nav link in the header')
        body = body.replace(link, f'<li><a href="{prefix}{current}" aria-current="page">', 1)
    attr_text = "".join(f' {key}="{value}"' for key, value in attrs.items())
    return f"<!-- shell:{name}{attr_text} -->\n{body}\n<!-- /shell:{name} -->"


def build(html: str, partials: dict[str, str], root: Path, page: str) -> str:
    seen: list[str] = []

    def replace(match: re.Match[str]) -> str:
        name = match.group("name")
        if name not in partials:
            raise ValueError(f"{page}: unknown block shell:{name}")
        seen.append(name)
        attrs = dict(ATTR.findall(match.group("attrs")))
        return render(name, attrs, partials[name], root)

    html = BLOCK.sub(replace, html)
    missing = [name for name in BLOCKS if name not in seen]
    if missing:
        raise ValueError(f"{page}: missing shell markers for {', '.join(missing)}")
    if len(seen) != len(set(seen)):
        raise ValueError(f"{page}: a shell block appears more than once")
    return html


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("root", nargs="?", default=".", type=Path)
    parser.add_argument("--check", action="store_true", help="report drift without writing")
    args = parser.parse_args()

    root = args.root
    partials = {
        name: (root / "_partials" / f"{name}.html").read_text(encoding="utf-8")
        for name in BLOCKS
    }

    stale: list[str] = []
    for page in sorted(root.glob("*.html")):
        original = page.read_text(encoding="utf-8")
        try:
            updated = build(original, partials, root, page.name)
        except ValueError as error:
            print(f"FAIL: {error}")
            return 1
        if updated != original:
            stale.append(page.name)
            if not args.check:
                page.write_text(updated, encoding="utf-8")

    if args.check:
        for name in stale:
            print(f"FAIL: {name} does not match _partials/; run python3 scripts/build.py .")
        if not stale:
            print("PASS: every page matches _partials/")
        return 1 if stale else 0

    for name in stale:
        print(f"updated {name}")
    if not stale:
        print("every page already matches _partials/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
