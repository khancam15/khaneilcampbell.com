# Khaneil Campbell — IT Professional Portfolio

Static portfolio for Khaneil Campbell: enterprise IT support, systems and identity
administration, IT service management, and automation. Hosted on GitHub Pages at
`khaneilcampbell.com`.

## Design

Blue and white, in the register of [daxnyc.ai](https://www.daxnyc.ai): geometric
display type, square corners, a saturated brand blue, and full-bleed navy bands
breaking up the light sections. The structure underneath is unchanged from the
work-led pass — panels lifting off the ground, a visual leading each entry.

The homepage leads with the work, not with the person.

| | |
|---|---|
| Ground | Cool blue-white `#f2f6fb`, panels `#ffffff`, wash `#e7eff9` |
| Ink | `#0d1521` (18.2:1), body `#44505e` (7.9:1) |
| Blue | `#1470af` (5.3:1) — sampled from the reference; links use `#0f5586` (7.9:1) |
| Navy bands | `#0a1a2b` gradient, accent `#5aa9e6` (6.9:1 on navy) |
| Display | Poppins 500/600/700 |
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

They are 1200×474 and about 5KB each — 32KB for all four, against 1.9MB for the
single portrait photo.

Two things to know before editing them:

- They fall back to a **system font**. The stack names Poppins first, but an SVG
  loaded through `<img>` cannot fetch a web font, so it renders in Helvetica or
  Arial. Matching the page type exactly would mean inlining each SVG into every
  page that shows it.
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
images/diagrams/         Four generated SVG work diagrams
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
