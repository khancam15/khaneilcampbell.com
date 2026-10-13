# Khaneil Campbell — AI & Technology Portfolio

Static portfolio for Khaneil Campbell, AI and technology professional: AI workflows,
cybersecurity, and enterprise IT. Hosted on GitHub Pages at `khaneilcampbell.com`.

The brand positioning and the goals every page answers to are set out in
[docs/VISION.md](docs/VISION.md).

## Design

Blue and white, carried by a high-contrast serif display face, generous spacing,
letterspaced small-caps micro-type and full-bleed navy bands. Panels lift off the
ground; a diagram leads each entry and sits beside its text on wide screens.

The homepage opens on a CSS-only intro: the name resolves out of a wide tracking
over a drifting blueprint grid and two slow blue glows, then the disciplines,
tagline and supporting statement follow in sequence. All motion stops under
`prefers-reduced-motion`, and the content is fully visible if animation never runs.

| | |
|---|---|
| Ground | Cool blue-white `#f2f6fb`, panels `#ffffff`, wash `#e7eff9` |
| Ink | `#0d1521` (18.2:1), body `#44505e` (7.9:1) |
| Blue | `#1470af` (5.3:1) — sampled from the reference; links use `#0f5586` (7.9:1) |
| Navy bands | `#0a1a2b` gradient, accent `#5aa9e6` (6.9:1 on navy) |
| Display | Instrument Serif |
| Body | Inter 400/500/600 |
| Radius | 4px — square-ish, following the reference |

The ground is **tinted rather than pure white on purpose**: panels are white, so
a white ground would collapse the elevation that separates them. Elevation
shadows carry a blue cast for the same reason.

Two section devices carry the blue rhythm: `.section--tint` for a light wash and
`.band-navy` for a full-bleed dark gradient. Both break out of the container.

### Diagrams

The references this design follows are photography-led; this site has no
photography beyond one portrait. The visual weight is carried instead by four
SVG diagrams in `images/diagrams/`, generated to a single visual language so
they read as a set: four stages across, one highlighted as the step that
matters, a supporting layer underneath, and a one-line note.

Each diagram ships in **two variants**, swapped by `<picture>` with no JavaScript:

| variant | canvas | used | why |
|---|---|---|---|
| `-sm` | 360 wide, stacked | at or below 700px | a wide banner scales to 0.27 on a phone, rendering its labels under 5px |
| `-md` | 700 wide, two by two | above 700px | the piece column caps near 646px, where a 1200px banner renders labels at 9.4px |

A 1200px banner variant existed earlier. It has no context left where it renders
better, so it was retired rather than kept as a third file.

Two things to know before editing them:

- They fall back to a **system font**. An SVG loaded through `<img>` cannot fetch
  a web font, so it renders in Helvetica or Arial. Matching the page type exactly
  would mean inlining each SVG into every page that shows it.
- They carry **no title**, deliberately. The page caption names each piece, and
  having both read as a duplicate.

## Conventions

- **No JavaScript.** The site ships none, so the CSP has no `script-src` at all —
  `default-src 'none'` covers it. JSON-LD blocks are data, not executed scripts,
  so they are unaffected. Keep it that way: the nav wraps rather than collapsing
  into a menu, and nothing depends on scroll handlers.
- **No inline `style` or `on*` attributes.** `style-src` stays at `'self'` with no
  `'unsafe-inline'`, so inline styles silently fail — use the `.mt-s` / `.mt-m` /
  `.mt-l` / `.cols-1` utilities instead.
- **Fonts** come from Google Fonts and are the only external origin the CSP allows.
- **The stylesheet URL carries a content hash** (`assets/site.css?v=…`). The host
  caches HTML and CSS separately for ten minutes with no version in the path, so
  a browser can otherwise pair fresh markup with a stale stylesheet. Recompute the
  hash whenever `assets/site.css` changes:

  ```bash
  python3 -c "import hashlib;print(hashlib.sha256(open('assets/site.css','rb').read()).hexdigest()[:8])"
  ```
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
index.html               Home — intro, selected work, about, contact
docs/VISION.md           Brand vision and positioning
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
images/diagrams/         Work diagrams, two size variants each
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

The domain is registered on Cloudflare, which manages DNS and Email Routing. GitHub Pages serves the site from `main` with the domain set by `CNAME`.
The `security-check.yml` workflow runs on every push and pull request. Changes reach `main` through squash merged pull requests; see [CONTRIBUTING.md](CONTRIBUTING.md).

## Built with AI Assistance

This site was designed and built with Claude as a working partner. Claude helped with layout and visual design, HTML and CSS, copy edits, and the Python audit scripts in `scripts/`. I set the direction, made the design and content decisions, and reviewed every change on the live site before publishing it.
