# Khaneil Campbell — AI & Technology Portfolio

Static portfolio for Khaneil Campbell: AI solutions, intelligent automation,
cybersecurity and enterprise systems. Live at [khaneilcampbell.com](https://khaneilcampbell.com),
served by GitHub Pages from `main`.

> *Designing systems. Engineering what's next.*

- Positioning and principles: [docs/VISION.md](docs/VISION.md)
- Plan, verified content and open decisions: [docs/PORTFOLIO-PLAN.md](docs/PORTFOLIO-PLAN.md)

## Current production

| Area | State |
|---|---|
| Design | Atelier, from 23 Oct 2026 (replaces Mist and glass) |
| Homepage | Midnight hero with name, role, one call to action and the portrait; experience and credentials strip; two case studies; "How I work"; closing call to action |
| About | Portrait hero, the thread of the work, career timeline, six-area capability map |
| Work | Multi-agent commerce pipeline and SOC brute-force lab as full case studies (problem, role, tools, results); phishing and access-control case files (in progress) |
| Résumé | `assets/khaneil-campbell-resume.pdf`, a public copy with the phone number removed |
| Links | [LinkedIn](https://www.linkedin.com/in/khaneil-campbell) · [GitHub](https://github.com/khaneilcampbell) · contact@khaneilcampbell.com |
| Privacy | `privacy.html`: no cookies, analytics or third-party requests; copyright and trademark notices. Linked from every footer |
| Not yet published | The Benjaire case study, pending decision D1 in the plan |

## Design

**Atelier.** A founder's studio rather than a template: midnight and porcelain
bands, a large Instrument Serif, brass detail, and the KC monogram (F2, Gilda
weave) in the nav and footer. Fewer words, more presence, with every case study
still set out as problem, role, tools and results.

| | |
|---|---|
| Ground | Porcelain `#F3F0EA`; sand `#E7E1D6`; midnight bands `#0E1622` |
| Text | Ink `#191D24`, body `#4A505A` (7.1:1); on midnight, porcelain and `#A9B0BB` (8.3:1) |
| Accent | Brass `#CDAE76` on midnight (8.6:1); deep brass `#7A5A24` on porcelain (5.6:1) |
| Type | Instrument Serif for display (italic for emphasis), Instrument Sans for text |
| Brand | `images/brand/` monogram SVGs and `og-image.png`; favicons and `site.webmanifest` at the root |

### Motion and interaction

Every page is complete with no JavaScript; `assets/site.js` adds the layer
below, and `prefers-reduced-motion` switches all of it off.

| Feature | Where | Without JS |
|---|---|---|
| Portrait unveils with a clip-path reveal (CSS) | Home | Same, static under reduced motion |
| Sections rise in as they enter the viewport | All | Visible at rest |
| Magnetic call-to-action buttons on pointer devices | All | Normal buttons |
| Full-screen menu below 860px | All | Links reachable in the footer |
| Architecture diagrams: select a component to open its detail in one inspector panel; arrow keys, Home and End move between components; the data-flow dashes move only while on screen | Both case studies | Every component links to its detail card, all listed below the diagram |

Each case study's "30-second version" is an architecture diagram (`.ad` in
`assets/site.css`): plain HTML lists of stages and components, inline SVG icons,
CSS connectors, and a detail card per component. Every fact in a diagram is
checked against that project's public repository; gates, items not yet live and
the lab boundary are labeled in text, not by color alone.

Case study covers are inline SVG drawn in the palette, so they need no image
requests and stay sharp at any size.

## Conventions

- **One first-party script, as enhancement only.** `assets/site.js` is the only
  script, and the CSP allows exactly that: `script-src 'self'`, no inline code, no
  third-party origins, no network calls. Nothing may depend on it: content,
  navigation and links must work with JavaScript off.
- **No inline `style` or `on*` attributes.** `style-src` stays at `'self'` with no
  `'unsafe-inline'`, so inline styles silently fail; add a class to `assets/site.css` instead. Scripts may still set styles through the CSSOM
  (`el.style.setProperty`), which the CSP allows.
- **Fonts are self-hosted** in `assets/fonts/` (Instrument Sans and Instrument
  Serif, Latin subset, SIL OFL 1.1). The two upright faces are preloaded. The site
  makes no requests to any other origin, and the CSP (`font-src 'self'`) keeps it that way.
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
- Homepage title: *Khaneil Campbell | AI, Automation & Technology Portfolio*.
- Known gap: there is no writing or articles section, so the site competes mainly
  on the owner's name. Adding genuinely useful write-ups is the highest-value next step.

## Project structure

```
index.html               Home: hero, credentials strip, two case studies, how I work, contact
about.html               Background, capabilities, toolset, credentials
projects.html            Work index: case studies and case files
commerce-pipeline.html   Case study: multi-agent commerce pipeline
labs.html                Lab index and the case standard
lab-details.html         Expanded case file per lab
soc-automation-lab.html  Case study: SOC brute-force detection lab (Splunk)
contact.html             Contact routes
security-plus.html       CompTIA Security+ credential page
itil4.html               ITIL 4 Foundation credential page
hdi-kcs.html             HDI KCS Foundation credential page
hdi-csr.html             HDI Customer Service Representative credential page
privacy.html             Privacy and site notice
404.html                 Not-found page

assets/site.css          The entire design system
assets/site.js           Enhancement layer: reveals, mobile menu, magnetic buttons
assets/fonts/            Self-hosted Instrument Sans and Serif (woff2) and their OFL license
assets/khaneil-campbell-resume.pdf   Public résumé (no phone number)
docs/VISION.md           Positioning and principles
docs/PORTFOLIO-PLAN.md   Plan, verified content, decisions
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

`site_audit.py` flags credential-shaped values (for example `secret: …` or
`api_key=…`), images with no `alt` attribute (`alt=""` is fine for decoration),
insecure or unprotected links, and local links that do not resolve.

## Deployment

The domain is registered on Cloudflare, which manages DNS and Email Routing. GitHub Pages serves the site from `main` with the domain set by `CNAME`.
The `security-check.yml` workflow runs on every push and pull request. Changes reach `main` through squash merged pull requests; see [CONTRIBUTING.md](CONTRIBUTING.md).

## Built with AI Assistance

This site was designed and built with Claude as a working partner. Claude helped with layout and visual design, HTML and CSS, copy edits, and the Python audit scripts in `scripts/`. I set the direction, made the design and content decisions, and reviewed every change on the live site before publishing it. The planning documents in `docs/` record those decisions and what each claim on the site rests on.
