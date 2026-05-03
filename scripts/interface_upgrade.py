#!/usr/bin/env python3
"""Apply repeatable interface polish across public static HTML pages."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


PUBLIC_PAGES = {
    "404.html": {"main": "Page Not Found", "current_href": "index.html"},
    "index.html": {"main": "Home", "current_href": "#home"},
    "labs.html": {"main": "Featured Labs", "current_href": "#labs"},
    "lab-details.html": {"main": "Labs", "current_href": "lab-details.html"},
    "projects.html": {"main": "Personal Projects", "current_href": "projects.html"},
    "soc-automation-lab.html": {"main": "SOC Automation Lab", "current_href": "lab-details.html"},
    "security-plus.html": {"main": "Security+ Certification", "current_href": "index.html#credentials"},
    "itil4.html": {"main": "ITIL 4 Certification", "current_href": "index.html#credentials"},
}

ENHANCEMENT_CSS = """

    /* interface-upgrade:start */
    ::selection {
      background: rgba(105, 230, 161, 0.28);
      color: var(--text);
    }

    :focus-visible {
      outline: 2px solid var(--green);
      outline-offset: 4px;
    }

    .skip-link {
      position: fixed;
      left: 16px;
      top: 16px;
      z-index: 100;
      transform: translateY(-140%);
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--green);
      color: var(--ink, #07110f);
      font-weight: 700;
      padding: 10px 14px;
      transition: transform 180ms ease;
    }

    .skip-link:focus {
      transform: translateY(0);
    }

    .signal-bar {
      position: sticky;
      top: 78px;
      z-index: 19;
      height: 2px;
      overflow: hidden;
      background: rgba(202, 238, 222, 0.08);
    }

    .signal-bar span {
      display: block;
      width: 42%;
      height: 100%;
      background: linear-gradient(90deg, transparent, var(--green), var(--amber, #facc6b), transparent);
      animation: signalSweep 5.5s linear infinite;
    }

    nav a[aria-current="page"] {
      color: var(--green);
    }

    nav a[aria-current="page"]::after {
      content: "";
      display: block;
      height: 2px;
      margin-top: 4px;
      border-radius: 999px;
      background: var(--green);
    }

    .command-panel,
    .lab-card,
    .lab-detail-card,
    .panel,
    .briefing,
    .about-panel,
    .project-card,
    .detail-card,
    .credential-card,
    .contact-box,
    .cert-image-wrapper {
      position: relative;
      isolation: isolate;
    }

    .command-panel::after,
    .lab-card::after,
    .lab-detail-card::after,
    .panel::after,
    .briefing::after,
    .about-panel::after,
    .project-card::after,
    .detail-card::after,
    .credential-card::after,
    .contact-box::after,
    .cert-image-wrapper::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(105, 230, 161, 0.08), transparent 42%, rgba(250, 204, 107, 0.06));
      opacity: 0.72;
      pointer-events: none;
    }

    .section {
      position: relative;
    }

    .section::before {
      content: "";
      display: block;
      width: min(100%, 1120px);
      height: 1px;
      margin: 0 auto 42px;
      background: linear-gradient(90deg, transparent, rgba(202, 238, 222, 0.18), transparent);
    }

    .hero + .section::before,
    main > .section:first-child::before {
      display: none;
    }

    @keyframes signalSweep {
      from {
        transform: translateX(-110%);
      }

      to {
        transform: translateX(260%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.001ms !important;
      }
    }

    @media (max-width: 640px) {
      .signal-bar {
        top: 70px;
      }
    }
    /* interface-upgrade:end */
"""


def inject_css(html: str) -> str:
    html = re.sub(
        r"\n\s*/\* interface-upgrade:start \*/.*?/\* interface-upgrade:end \*/",
        "",
        html,
        flags=re.DOTALL,
    )
    return html.replace("\n  </style>", f"{ENHANCEMENT_CSS}\n  </style>", 1)


def add_skip_link(html: str) -> str:
    html = re.sub(r'\n\s*<a class="skip-link" href="#main-content">Skip to content</a>', "", html)
    return re.sub(
        r"(<body[^>]*>)",
        r'\1\n  <a class="skip-link" href="#main-content">Skip to content</a>',
        html,
        count=1,
    )


def add_signal_bar(html: str) -> str:
    html = re.sub(
        r'\n\s*<div class="signal-bar" aria-hidden="true"><span></span></div>',
        "",
        html,
    )
    return html.replace(
        "\n  <main",
        '\n  <div class="signal-bar" aria-hidden="true"><span></span></div>\n\n  <main',
        1,
    )


def add_main_id(html: str) -> str:
    html = re.sub(r"<main([^>]*)\s+id=\"main-content\"([^>]*)>", r"<main\1\2>", html, count=1)
    return re.sub(r"<main(?![^>]*\bid=)([^>]*)>", r'<main id="main-content"\1>', html, count=1)


def update_current_nav(html: str, current_href: str) -> str:
    html = re.sub(r'\s+aria-current="page"', "", html)
    pattern = re.compile(rf'(<a href="{re.escape(current_href)}")')
    return pattern.sub(r'\1 aria-current="page"', html, count=1)


def upgrade_page(path: Path, current_href: str) -> bool:
    original = path.read_text(encoding="utf-8")
    html = original
    html = inject_css(html)
    html = add_skip_link(html)
    html = add_signal_bar(html)
    html = add_main_id(html)
    html = update_current_nav(html, current_href)

    if html == original:
        return False

    path.write_text(html, encoding="utf-8")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", help="site root to upgrade")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    changed = []

    for filename, config in PUBLIC_PAGES.items():
        path = root / filename
        if not path.exists():
            continue
        if upgrade_page(path, config["current_href"]):
            changed.append(filename)

    if changed:
        print("upgraded: " + ", ".join(changed))
    else:
        print("interface already up to date")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
