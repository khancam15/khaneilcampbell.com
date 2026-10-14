# Khaneil Campbell — AI & Technology Portfolio

Static portfolio for Khaneil Campbell, AI and technology professional: AI workflows,
cybersecurity, and enterprise IT. Hosted on GitHub Pages at `khaneilcampbell.com`.

The brand positioning and the goals every page answers to are set out in
[docs/VISION.md](docs/VISION.md).

## Design

**Mist and glass.** Premium architectural technology, built around one image: a
white terraced pavilion of four levels over still water in morning mist. The
homepage draws it as layered SVG, with the levels labelled Enterprise IT,
Security, Automation and AI. Colours are sampled from that scene.

| | |
|---|---|
| Ground | Mist `#eef1f3`; stone bands `#e7e5e0`; white panels; one charcoal surface `#16191e` |
| Ink | `#12151a` (15.2:1 worst case), body `#454b54` (7.3:1), labels `#59606a` (5.4:1) |
| Accent | Lit-glass blue `#2a64a8` (5.1:1 on stone); links `#1f4f87` (7.2:1) |
| Type | Geist for display and body, Geist Mono for labels |
| Surfaces | Frosted glass panels, hairlines, 20px radius, pill buttons and nav |

### Motion and interaction

Every page is complete with no JavaScript; `assets/site.js` adds the layer
below, and `prefers-reduced-motion` switches all of it off.

| Feature | Where | Without JS |
|---|---|---|
| Pavilion scene: layers drift against the pointer, labels settle in | Home | Mist gradient; all text present |
| "How I build" steps as tabs with one detail panel | Home | A numbered list with every step written out |
| Scroll reveals, 3D tilt and a pointer spotlight on cards and panels | All | Static |
| Career timeline that fills with scroll | About | Full rail, all nodes lit |
| Skill map tabs whose dots form a where-used matrix | About | Six cards |
| Reading progress in the nav; cross-document page transitions | All (CSS) | Normal navigation |

### Diagrams

The references this design follows are photography-led; this site has no
photography beyond one portrait. The visual weight is carried instead by four
SVG diagrams in `images/diagrams/`, generated to a single visual language so
they read as a set (recoloured to the Mist and glass palette): four stages across, one highlighted as the step that
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
assets/site.js           Motion layer: pavilion scene, reveals, timeline, skill map
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
