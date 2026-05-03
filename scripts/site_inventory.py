#!/usr/bin/env python3
"""Generate a JSON inventory for the static portfolio site."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path


@dataclass
class PageInventory:
    path: str
    title: str = ""
    description: str = ""
    headings: list[str] = field(default_factory=list)
    links: list[dict[str, str]] = field(default_factory=list)
    images: list[dict[str, str]] = field(default_factory=list)


class InventoryParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.description = ""
        self.headings: list[str] = []
        self.links: list[dict[str, str]] = []
        self.images: list[dict[str, str]] = []
        self._text_target: str | None = None
        self._pending_link: dict[str, str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {name.lower(): value or "" for name, value in attrs}

        if tag == "title":
            self._text_target = "title"
        elif tag in {"h1", "h2", "h3"}:
            self._text_target = "heading"
        elif tag == "meta" and attr_map.get("name", "").lower() == "description":
            self.description = attr_map.get("content", "")
        elif tag == "a":
            self._pending_link = {
                "href": attr_map.get("href", ""),
                "text": "",
                "external": str(attr_map.get("href", "").startswith(("http://", "https://"))).lower(),
            }
        elif tag == "img":
            self.images.append({
                "src": attr_map.get("src", ""),
                "alt": attr_map.get("alt", ""),
            })

    def handle_endtag(self, tag: str) -> None:
        if tag in {"title", "h1", "h2", "h3"}:
            self._text_target = None
        elif tag == "a" and self._pending_link is not None:
            self._pending_link["text"] = " ".join(self._pending_link["text"].split())
            self.links.append(self._pending_link)
            self._pending_link = None

    def handle_data(self, data: str) -> None:
        text = " ".join(data.split())
        if not text:
            return

        if self._text_target == "title":
            self.title += text
        elif self._text_target == "heading":
            self.headings.append(text)

        if self._pending_link is not None:
            self._pending_link["text"] += f" {text}"


def inventory_page(root: Path, path: Path) -> PageInventory:
    parser = InventoryParser()
    parser.feed(path.read_text(encoding="utf-8"))

    return PageInventory(
        path=path.relative_to(root).as_posix(),
        title=parser.title,
        description=parser.description,
        headings=parser.headings,
        links=parser.links,
        images=parser.images,
    )


def build_inventory(root: Path) -> dict[str, object]:
    pages = [
        inventory_page(root, path)
        for path in sorted(root.glob("*.html"))
        if path.is_file()
    ]

    assets = [
        path.relative_to(root).as_posix()
        for path in sorted((root / "images").glob("*"))
        if path.is_file() and not path.name.startswith(".")
    ]

    return {
        "site": root.name,
        "page_count": len(pages),
        "asset_count": len(assets),
        "pages": [page.__dict__ for page in pages],
        "assets": assets,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", help="site root to inventory")
    parser.add_argument("--output", "-o", help="write JSON to a file instead of stdout")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    inventory = build_inventory(root)
    payload = json.dumps(inventory, indent=2)

    if args.output:
        Path(args.output).write_text(payload + "\n", encoding="utf-8")
        print(f"wrote {args.output}")
    else:
        print(payload)

    return 0


if __name__ == "__main__":
    sys.exit(main())
