# Khaneil Campbell — IT Professional Portfolio

Static portfolio for Khaneil Campbell: enterprise IT support, systems and identity
administration, IT service management, and automation work. Hosted on GitHub Pages
at `khaneilcampbell.com`.

## Design system

The site shares a visual family with [benjaire.com](https://benjaire.com) —
white ground, hairline-ruled full-bleed grids, flat surfaces, no radii or shadows,
wide-tracked uppercase micro-labels — while keeping its own identity:

| | khaneilcampbell.com | benjaire.com |
|---|---|---|
| Display type | Archivo, sentence case, negative tracking | Bebas Neue, condensed uppercase |
| Label voice | JetBrains Mono for every label, index, and figure | Inter |
| Accent | Evergreen `#14594a` | Navy `#1b3a6b` |
| Primary pattern | Numbered full-bleed case rows | Image card grid |
| Hero | Left-aligned, asymmetric, with a mono meta rail | Centred, full-height |
| Contrast device | Inverted near-black bands and footer | Light throughout |
| Scroll indicator | Right-edge vertical rule | Top progress bar |

All colour comes from the `--accent*` tokens at the top of `assets/site.css`, so
re-tinting the site means editing those values alone. Adding `.invert` to any
section flips it to the dark palette — no component-level overrides needed.

## Project structure

```
index.html               Home — hero, figures, practice, selected work, method, about, credentials
about.html               Full background, capabilities, toolset, credentials
labs.html                Filterable lab board with the case standard
lab-details.html         Expanded case file per lab
soc-automation-lab.html  Published deep dive: authentication log analysis with Splunk
projects.html            AI product pipeline — flow, stack, controls, skills
contact.html             Contact routes and fit (no form; mailto only)
security-plus.html       CompTIA Security+ credential page
itil4.html               ITIL 4 Foundation credential page
404.html                 Inverted not-found page

assets/site.css          Shared stylesheet — tokens, components, responsive, print
assets/site.js           Shared behaviour — menu, scroll rule, filter, reveal
images/                  Portrait and certificate assets
_headers                 HTTP security headers (Netlify / Cloudflare Pages)
robots.txt sitemap.xml   Crawler directives and URL index
CNAME                    Custom domain for GitHub Pages
scripts/                 Dependency-free audit and inventory tooling
```

## Conventions

- **No inline `style` or `on*` attributes.** The CSP keeps `script-src` and
  `style-src` at `'self'`, so stagger delays use the `.dl1`–`.dl6` utility
  classes rather than inline `transition-delay`.
- **Progressive enhancement.** `assets/site.js` adds `.js` to `<html>`; the
  `.reveal` animation is only armed once that class exists, so a blocked or
  failed script leaves every section fully visible.
- **Fonts** come from Google Fonts (Archivo, Inter, JetBrains Mono) and are the
  only external origin the CSP allows.
- **Every page** carries a CSP meta tag, a referrer policy, canonical and
  Open Graph tags, and `rel="noopener noreferrer"` on any `target="_blank"` link —
  all four are enforced by the GitHub Actions security check.

## Local development

Edit any `.html` file directly — there is no build step.

```bash
python3 -m http.server 3000
```

Run the checks before committing:

```bash
python3 scripts/site_audit.py .
python3 scripts/site_inventory.py .
bash scripts/security-check.sh .
```

Note: `site_audit.py` flags the bare words `password`, `secret`, and `api key`
anywhere in page text, not just in credential-shaped values — prose that needs
those words should be reworded, or the pattern narrowed.

## Deployment

Push to `main`; GitHub Pages serves from that branch with the domain set by
`CNAME`. The `security-check.yml` workflow runs on every push and pull request.
