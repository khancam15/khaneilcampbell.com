# Khaneil Campbell — AI & Technology Portfolio

Static portfolio for Khaneil Campbell, AI and technology professional: AI workflows,
cybersecurity, and enterprise IT. Hosted on GitHub Pages at `khaneilcampbell.com`.

The brand positioning and the goals every page answers to are set out in
[docs/VISION.md](docs/VISION.md).

## Design

Dark premium: a sophisticated technology company meets an interactive portfolio,
not a cyberpunk set. A near-black ground, charcoal bands, one electric blue accent,
a modern grotesque throughout and editorial spacing. Panels are hairline-bordered
and lit from within rather than lifted by shadow.

| | |
|---|---|
| Ground | Near-black `#07090c`; charcoal bands `#0e1116`; panels `#141820` |
| Ink | `#f2f5f9` (15.1:1 worst case), body `#aab4c2` (7.9:1), labels `#8f9aaa` (5.8:1) |
| Accent | Electric blue `#3d9bff` (5.8:1); links `#6db4ff` (7.6:1); button text `#07090c` on blue (7.0:1) |
| Display and body | Geist, 300 to 700 |
| Micro-type | Geist Mono, uppercase, 0.12 to 0.16em tracking |
| Radius | 14px panels, full pill for the nav and buttons |

Ratios are measured against the lightest ground each colour sits on, so they hold
on every surface.

### Immersive layer

Every page is complete with no JavaScript. `assets/site.js` adds the motion layer
on top, and `prefers-reduced-motion` switches all of it off.

| Feature | How | Without JS |
|---|---|---|
| Cinematic loader | `KC` mark and a drawn line, first homepage visit per session, ~0.9s | not shown |
| Animated typography | hero name split into letters that rise in sequence | the whole name animates in CSS |
| 3D particles | a rotating constellation on a canvas, tilted by the pointer, paused off screen | grid and glow only |
| Scroll reveals | `IntersectionObserver` adds `.is-in`; siblings stagger | everything visible |
| Magnetic hover | buttons and nav lean toward the pointer (fine pointers only) | normal hover |
| 3D tilt and spotlight | work panels tilt and light up under the pointer | normal hover |
| Floating nav | pill nav tightens once the page is scrolled | static pill |
| Reading progress | CSS scroll-driven animation in the nav | — |
| Page transitions | CSS cross-document view transitions; the nav holds still | normal navigation |
| Career timeline (About) | rail fills with scroll progress; each node lights as the fill reaches it | full rail, all nodes lit |
| Skill map (About) | six areas become tabs; each tab's dots mark where the area was used, forming a matrix | six cards, all visible (also on phones) |

Speed rules: animation is transform and opacity only, the canvas caps its pixel
ratio at 2 and its point count by area, edges are computed once (rotation keeps
distances), and the loop stops when the hero leaves the screen or the tab hides.
The script is under 4 KB gzipped with no dependencies.

The loader is drawn on `html::before` and `html::after` so it exists before the
body parses. A CSS timeout clears it at 2.4s even if the script never finishes.

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

- **One first-party script, as enhancement only.** `assets/site.js` is the only
  script, and the CSP allows exactly that: `script-src 'self'`, no inline code, no
  third-party origins, no network calls. Nothing may depend on it: content,
  navigation and links must work with JavaScript off.
- **No inline `style` or `on*` attributes.** `style-src` stays at `'self'` with no
  `'unsafe-inline'`, so inline styles silently fail — use the `.mt-s` / `.mt-m` /
  `.mt-l` / `.cols-1` utilities instead.
- **Fonts** come from Google Fonts and are the only external origin the CSP allows.
- **The stylesheet and script URLs carry a content hash** (`assets/site.css?v=…`,
  `assets/site.js?v=…`). The host caches HTML and assets separately for ten minutes
  with no version in the path, so a browser can otherwise pair fresh markup with a
  stale file. Recompute the hash whenever either file changes:

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

assets/site.css          The entire design system
assets/site.js           Motion layer: loader, particles, reveals, hover effects
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
