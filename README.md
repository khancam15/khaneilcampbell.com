# Khaneil Campbell — IT Professional Portfolio

Static portfolio for Khaneil Campbell: enterprise IT support, systems and identity
administration, IT service management, and automation. Hosted on GitHub Pages at
`khaneilcampbell.com`.

## Design

A minimal portfolio. One centred measure, two typefaces, very few rules, and a lot
of air — the previous build's problem was density, not decoration, so the fix was
space rather than more styling.

Removed in this build: page-frame hairlines, the scroll rail, inverted dark bands,
three-tone outlined headlines, mono micro-labels, status chips, evidence rails,
figure bands, the full-bleed ruled grid, and all JavaScript.

| | |
|---|---|
| Ground | Warm white `#fdfdfc` |
| Ink | `#141414` (16.4:1), body `#3f3f3f` (10.5:1) |
| Accent | Slate teal `#1a5471` (8.1:1), on links and the primary action only |
| Display | Archivo 500/600 |
| Body | Inter 400/500/600 |
| Measure | 1060px centred |

Every colour is a token at the top of `assets/site.css`; retinting means editing
those values alone.

## Conventions

- **No JavaScript.** The site ships none, so the CSP has no `script-src` at all —
  `default-src 'none'` covers it. Keep it that way: the nav wraps rather than
  collapsing into a menu, and nothing depends on scroll handlers.
- **No inline `style` or `on*` attributes.** `style-src` stays at `'self'` with no
  `'unsafe-inline'`, so inline styles silently fail — use the `.mt-s` / `.mt-m` /
  `.mt-l` / `.cols-1` utilities instead.
- **Fonts** come from Google Fonts and are the only external origin the CSP allows.
- **Every page** carries a CSP meta tag, a referrer policy, canonical and Open Graph
  tags, JSON-LD, and `rel="noopener noreferrer"` on any `target="_blank"` link.
  The first, second and last are enforced by the GitHub Actions security check.

## SEO

- Titles are kept under 60 characters, meta descriptions under 160, so neither
  truncates in results.
- Every page except the 404 carries JSON-LD: a `WebPage` tied to the site-wide
  `Person`, plus a `BreadcrumbList`.
- Known gap: total indexable copy is roughly 5,000 words across 10 pages, and
  there is no writing or articles section. The site currently competes only on the
  owner's name. Adding genuinely useful write-ups is the highest-value next step.

## Project structure

```
index.html               Home — hero, selected work, about, contact
about.html               Background, capabilities, toolset, credentials
projects.html            AI product pipeline — flow, guardrails, stack
labs.html                Lab index and the case standard
lab-details.html         Expanded case file per lab
soc-automation-lab.html  Published deep dive: log analysis with Splunk
contact.html             Contact routes
security-plus.html       CompTIA Security+ credential page
itil4.html               ITIL 4 Foundation credential page
404.html                 Not-found page

assets/site.css          The entire design system — one file, no JS
images/                  Portrait and certificate assets
_headers                 HTTP security headers
robots.txt sitemap.xml   Crawler directives and URL index
CNAME                    Custom domain for GitHub Pages
scripts/                 Dependency-free audit and inventory tooling
```

## Local development

Edit any `.html` file directly — there is no build step.

```bash
python3 -m http.server 3000
```

Checks before committing:

```bash
python3 scripts/site_audit.py .
bash scripts/security-check.sh .
```

Note: `site_audit.py` flags the bare words `password`, `secret`, and `api key`
anywhere in page text, not just in credential-shaped values.

## Deployment

Push to `main`; GitHub Pages serves from that branch with the domain set by `CNAME`.
The `security-check.yml` workflow runs on every push and pull request.
