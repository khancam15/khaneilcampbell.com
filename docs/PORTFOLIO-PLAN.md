# khaneilcampbell.com: Portfolio Development Plan (v0.1)

| | |
|---|---|
| **Status** | **Draft for owner approval.** No implementation starts until this plan, and the decisions in §12, are approved. |
| **Date** | 2026-10-14 |
| **Product** | khaneilcampbell.com, the personal engineering portfolio of Khaneil Campbell |
| **Headline** | Designing systems. Engineering what's next. |
| **Sources reviewed** | This repository; `khancam15/benjaire.com` (source, docs, a local build of `site/`); `khancam15/multi-agent-commerce-pipeline`; `khancam15/soc-automation-splunk-bruteforce-lab`; `khancam15/khancam15` (profile README); the résumé supplied 2026-10-13 (`K.Campbell_Resume.pdf`) |

## How to read this document

This plan uses the same labels as the Benjaire PRD.

| Label | Meaning |
|---|---|
| **[VERIFIED]** | Backed by the résumé, a repository, or a document in a repository. The source is named. |
| **[CONFIRMED]** | Stated by you in the brief. |
| **[PROPOSED]** | My recommendation. Not adopted until you approve it. |
| **[NEEDS EVIDENCE]** | A claim or piece of content that cannot be published until you supply evidence or confirm it. |
| **[DECISION]** | A choice only you can make. These are collected in §12. |

Nothing labelled PROPOSED, NEEDS EVIDENCE or DECISION should be treated as fact.

---

## 0. Discovery findings

### 0.1 What exists today

| Area | Finding | Source |
|---|---|---|
| Portfolio stack | Ten hand-written HTML pages, one stylesheet, one enhancement script, GitHub Pages, Cloudflare DNS | This repo |
| Portfolio state | `main` is the blue-and-white serif design. Branch `claude/stoic-hypatia-1bo10a` (unmerged) adds the AI positioning, a dark theme, a career timeline and a skill map built from the résumé | This repo |
| Benjaire stack | Astro 7 (static), TypeScript, Content Collections, plain CSS tokens, self-hosted fonts, one Cloudflare Worker for the contact form (Turnstile, Email Routing), GitHub Actions CI | `benjaire.com/site`, ADR-0001 to 0004 |
| Benjaire process | A PRD with approval labels, four ADRs, milestone gates M0 to M7, a launch cutover runbook | `benjaire.com/docs` |
| Benjaire design | v0.3 "Pavilion": pearl ground, charcoal ink, matte black bands, wide variable Archivo, Inter, IBM Plex Mono, frosted glass panels, annotation pins, pre-rendered architectural stills with interface layers drifting over them | `docs/design-system.md`, local build |
| Benjaire quality | Lighthouse mobile 100 on Home, About, Brands and Contact (recorded 2026-10-13); CI runs `astro check`, Worker unit tests, link and SEO checks; Playwright with axe for accessibility | `docs/runbooks/launch-cutover.md`, `site/package.json` |
| Benjaire launch | Cutover checklist still open: copy approval (A1), production deploy (A5) and Turnstile hostnames (A7) are unchecked | `docs/runbooks/launch-cutover.md` |
| Authorship | All 50 recent Benjaire commits are authored by you, with Claude as co-author | `git log` |
| Public repos | Five: `benjaire.com`, `khaneilcampbell.com`, `multi-agent-commerce-pipeline`, `soc-automation-splunk-bruteforce-lab`, `khancam15` (profile) | GitHub |

### 0.2 Conflicts that need a decision before work starts

1. **Benjaire's own rules forbid this case study as written.** The Benjaire PRD §3.2 is marked CONFIRMED: *"No founder name, personal photographs, biographies… The site must stay separate from any personal or professional portfolio sites (no cross-links)."* The Benjaire README repeats it: *"Benjaire stays anonymous by design."* A flagship case study on khaneilcampbell.com publicly names you as the person behind Benjaire. That reverses an earlier decision of yours, so it is §12 decision D1.
2. **The visual direction changes again.** This brief asks for white, off-white and stone with charcoal text. The branch currently carries the near-black theme from step 02. This plan follows the brief, which is the newer instruction. The dark theme would be retired, but its timeline, skill map and motion patterns carry over.
3. **The brief and the résumé disagree in three places.** The plan follows the résumé, which the brief names as the source of truth, until you confirm otherwise:
   - **HDI KCS Foundation:** listed on the résumé, missing from the brief.
   - **Mentorship scope:** the résumé says *"data privacy, risk, and responsible AI use"*. The brief says SIEM, incident response, endpoint investigation, security tickets and scripting.
   - **Two metrics:** 85% customer survey and 2.41% abandoned-call rate appear only in the brief, not on the résumé.

---

## 1. Professional positioning strategy

**Positioning [PROPOSED]:** an enterprise IT professional with four years inside Columbia University's IT operation, moving into AI solutions and automation engineering, who already builds and ships real systems with AI as a structured development partner.

The story has three verified layers, and the site presents them in this order:

| Layer | What it proves | Evidence |
|---|---|---|
| **Foundation: enterprise operations** | Works inside a large institution under real service standards | Résumé: Columbia since Jul 2022; ~180 incidents and requests a month; 96% call quality; 100% ticket review quality **[VERIFIED]** |
| **Practice: security and systems** | Understands detection, identity and access, and service management | Security+, ITIL 4, HDI KCS, HDI CSR; SOC lab repo **[VERIFIED]** |
| **Direction: AI and automation engineering** | Designs, specifies and ships AI-assisted systems end to end | Benjaire (PRD, ADRs, CI, Worker), the commerce pipeline, this site **[VERIFIED in repos]** |

**Rules for wording:**
- Job titles are stated exactly as the résumé gives them (Service Desk Technician). The site never says "AI Solutions Engineer" or "Cybersecurity Engineer" as a title. Those appear only as *target roles* ("moving toward…", "open to roles in…").
- Every project carries a status: **Completed**, **Working prototype**, **Experiment** or **In development**. A project that is only a draft is not published.
- AI assistance is stated plainly on every project, as the commerce pipeline README already does: you set the requirements, made the decisions and reviewed and tested the code; Claude drafted and implemented under that direction.

**Headline [CONFIRMED]:** *Designing systems. Engineering what's next.*
**Supporting line [CONFIRMED]:** *Technology professional specializing in AI solutions, intelligent automation, cybersecurity, and digital systems. I combine technical expertise with strategic thinking to develop practical solutions for modern organizations.*

## 2. Target audience

| Audience | What they need in 30 seconds | Where the site answers it |
|---|---|---|
| Technical hiring managers, engineering leaders | Can this person design and ship? How do they use AI? | Home hero, Benjaire case study, "How I build with AI" |
| AI and automation teams | Real agent, MCP and API work, not prompts alone | Commerce pipeline case study, Expertise |
| Technology recruiters | Title, experience, certifications, résumé, contact | Experience page, Résumé, nav button, footer |
| Enterprise IT organizations | Operational maturity, ITSM, security fundamentals | Experience, Expertise, SOC lab |
| Collaborators, founders (secondary) | What kind of work, and how to reach him | About, Contact |

## 3. Recommended sitemap

**Navigation [PROPOSED]:** Logo (Home) · About · Projects · Expertise · Experience · Contact, plus a **Résumé** pill button. That is five links and one button, with Home on the logo. If it feels crowded on a phone, Expertise folds into About (D8).

| URL | Page | Content | Replaces |
|---|---|---|---|
| `/` | Home | See §4 | `index.html` |
| `/about` | About | Who I am, how I work, technical interests, career direction, education | `about.html` (part) |
| `/projects` | Projects | Index with category and status filters | `projects.html`, `labs.html` |
| `/projects/benjaire` | Case study | Flagship, see §8 (pending D1) | — |
| `/projects/multi-agent-commerce-pipeline` | Case study | CrewAI, Claude, Canva MCP, Shopify | `projects.html` section |
| `/projects/soc-brute-force-lab` | Case study | Kali, Splunk, Event ID 4625, Python | `soc-automation-lab.html` |
| `/projects/portfolio` | Short case study | This site, built with Claude | — |
| `/expertise` | Expertise | Skill map (six areas, where each was used), stack, engineering interests | skill map on About |
| `/experience` | Experience | Career timeline, metrics, certifications with certificate images, education, development | `security-plus.html`, `itil4.html`, timeline on About |
| `/contact` | Contact | Email, LinkedIn, GitHub, what I'm open to | `contact.html` |
| `/resume` | Résumé | Web version plus PDF download (pending D6) | — |
| `/404` | Not found | — | `404.html` |

**Retired [PROPOSED]:** `labs.html` and `lab-details.html`. Both publish two case files marked "In progress" (phishing response, access control workflows) that have no repository or screenshots behind them. Under the brief's evidence rule they become unpublished drafts until evidence exists (D9). Every old URL gets a redirect page so existing links and search results keep working.

## 4. Homepage content structure

| # | Section | Content | Status |
|---|---|---|---|
| 1 | **Hero** | Name, headline, supporting line, two actions (View projects, Résumé). An original architectural visual, with frosted annotation pins labelling real things (see §5.3) | Copy CONFIRMED; visual PROPOSED |
| 2 | **Proof strip** | 4+ years at Columbia University · ~180 tickets a month · 96% call quality · CompTIA Security+ | VERIFIED (résumé) |
| 3 | **Flagship case study** | Benjaire: one large panel with a real screenshot, role, stack and a link to the full case study | Pending D1 |
| 4 | **Selected work** | Commerce pipeline and SOC lab cards, each with status, stack and repo link | VERIFIED |
| 5 | **How I build with AI** | The repeatable workflow behind the projects: requirements, decision records, AI implementation, review, automated checks, release. Drawn from the Benjaire process, which is documented | VERIFIED (Benjaire docs) |
| 6 | **Capabilities** | Six areas from the résumé, linking to Expertise | VERIFIED |
| 7 | **Experience snapshot** | Current role, a short timeline, certifications, linking to Experience | VERIFIED |
| 8 | **Contact band** | Matte charcoal band: open to roles in AI solutions, automation and systems engineering; email, LinkedIn, Résumé | PROPOSED |

## 5. Visual design direction

### 5.1 Direction: "Premium architectural technology" [CONFIRMED by brief]

Intelligent, precise, architectural, modern. White and stone surfaces, charcoal type, one restrained accent, editorial typography and depth from layering, not from gradients.

### 5.2 Tokens [PROPOSED]

The structure (naming, fluid type scale, spacing scale, contrast notes beside every colour) comes from Benjaire's `global.css`. The values are the portfolio's own, so the two sites never look like one brand.

| Token | Benjaire | Portfolio [PROPOSED] | Why it differs |
|---|---|---|---|
| Ground | Warm pearl `#f3f3f1` | Cool off-white `#f6f7f8` | Cooler, more instrument-like |
| Band | Pearl gray `#e4e5e3` | Stone `#eceae6` | Neutral stone, per the brief |
| Panel | White | White | Shared, so the glass treatment works |
| Ink | Charcoal `#1f2124` | Near-black `#14161a` | Higher contrast for long case studies |
| Accent | Charcoal (none) | One restrained **signal blue**, `#2453d4` (about 6.5:1 on white), used only for status, links, the active state and diagram highlights | A thread from the current site, and a clear difference from Benjaire's monochrome (D7) |
| Dark band | Matte black `#121315` | Charcoal `#1a1c20` | — |
| Display | Archivo Variable, wide | **Geist**, tight tracking | Distinct letterforms from Benjaire's wide display face |
| Body | Inter | Geist | One family, quieter |
| Labels | IBM Plex Mono | **Geist Mono** | Distinct |

Exact values are tuned to WCAG 2.2 AA on every surface during M2, and recorded with their ratios as both sites already do.

### 5.3 Imagery: technical artifacts first [PROPOSED]

The brief rules out padlocks, matrix code, glowing brains and robot heads, and asks for meaningful visuals. Benjaire's Pavilion renders are Benjaire's identity and are **not** reused, except as screenshots inside its own case study.

1. **Hero visual: an original axonometric structure** in white and stone: a layered, architectural "stack" whose levels are labelled by frosted pins with real things (*Enterprise IT · Security · Automation · AI*). It is built as SVG, not WebGL, so it is light, sharp and readable at any size. The pins drift against the drawing on pointer movement, as in Benjaire's hero (D5 offers a rendered alternative).
2. **Case-study visuals are evidence:** real screenshots (Benjaire builds, Splunk searches from the SOC lab's eight screenshots, pipeline outputs) and architecture diagrams redrawn in the new system.
3. **Diagrams become interactive** where that explains something: hovering or focusing a stage highlights it and shows its detail, with keyboard support. No diagram is decoration.

### 5.4 Components [PROPOSED]

Reused from Benjaire as patterns, restyled: pill buttons, one frosted glass panel per view, annotation pins, an index list with one active row driving a detail card, a fact list, a title-block footer, the dark contact band, the eyebrow with a short rule.

New for the portfolio: project card (status, category, stack, repo), case-study header (role, timeframe, stack, links), "evidence" figure (screenshot plus caption plus source), status badge, interactive diagram, the career timeline and skill map (ported from the current branch).

### 5.5 Motion [PROPOSED]

Benjaire's rules, which this site already follows: all content is present without JavaScript, and everything stops under reduced motion.

| Keep | Drop |
|---|---|
| Hero settle and staggered reveal; pin parallax; scroll reveals; timeline fill; sticky step crossfade for the "How I build" sequence; view transitions between pages | The particle constellation, the loader and the magnetic buttons from step 02. They were decorative, which the brief rules out |

## 6. Benjaire design reuse strategy

| Reuse directly (pattern or code) | Adapt | Do not reuse |
|---|---|---|
| Astro static architecture, `Base` layout with meta, canonical, Open Graph and JSON-LD in one place | Token structure, with new values (§5.2) | Benjaire copy, voice ("we") and positioning |
| Content Collections with a schema, so a bad project entry fails the build | The Build/Operate/Grow sticky sequence becomes "How I build with AI" | The B monogram, lockups and Pavilion renders (screenshots in the case study only) |
| `sitemap.xml.ts`, `check-seo.mjs`, `check-links.mjs`, `a11y.mjs` (Playwright and axe), the CI workflow | Hero composition: visual plus frosted pins, with the portfolio's own visual | The contact-form Worker, Turnstile and Email Routing: a portfolio needs no form backend (§9) |
| Accessible nav with an Escape-to-close menu; skip link; focus styles | Footer title block, with personal links | The brand content model (replaced by a project model) |
| Docs practice: plan with labels, ADRs, milestone gates, runbook | The `security-headers.mjs` CSP-hash step, if hosting moves to Cloudflare (D4) | Anything confidential: DNS details, Worker variables, unpublished business plans |

## 7. Featured project recommendations

| Project | Repo | Evidence | Status label | Recommendation |
|---|---|---|---|---|
| **Benjaire** | `benjaire.com` | PRD, 4 ADRs, runbook, CI, Worker with unit tests, design system v0.2 to v0.3, before/after proposal screenshots, recorded Lighthouse scores | **In development** (cutover open) | **Flagship**, pending D1 and D2 |
| **Multi-agent commerce pipeline** | `multi-agent-commerce-pipeline` | README, implementation docs, threat model, tests, CI (gitleaks, pip-audit), systemd service | **Completed implementation** (Apr to Jul 2026, résumé) | **Feature** |
| **SOC brute-force detection lab** | `soc-automation-splunk-bruteforce-lab` | README, walkthrough, eight screenshots, SPL queries, Python script | **Completed lab** | **Feature** |
| **This portfolio** | `khaneilcampbell.com` | Repo, CI security check, audit scripts | **Live, ongoing** | Short case study |
| n8n and CrewAI agent experiments | None found | n8n appears only in skill lists; CrewAI is evidenced by the pipeline | — | **Draft, unpublished** until a repo, screenshots or a write-up exists (D10) |
| Phishing response walkthrough | None found | Case file text only, marked "In progress" | — | **Draft, unpublished** (D9) |
| Access control workflows | None found | Case file text only, marked "In progress" | — | **Draft, unpublished** (D9) |
| `khancam15` profile | Profile README | — | — | Not a project; linked from Contact |

**Project content model [PROPOSED]:** one file per project with `title`, `slug`, `category` (AI & Automation · Cybersecurity · Systems · Web Development · Experiments), `status`, `published`, `timeframe`, `summary`, `problem`, `approach`, `stack[]`, `role`, `aiAssistance`, `outcome`, `repo`, `live`, `cover`, `diagram`. The build fails if a published project lacks a status, a role or an AI-assistance statement.

## 8. Benjaire case study outline (pending D1)

Every section lists its evidence. Nothing here claims revenue, customers, traffic or adoption: none exists in the evidence, and the PRD says there are no public brands yet.

| # | Section | Content | Evidence |
|---|---|---|---|
| 1 | Project overview | A New York company building consumer brands and digital solutions; you lead it and its web platform | README, PRD §1 **[VERIFIED]** |
| 2 | Business problem | A hand-written three-page site: an empty Brands section, a browser-only form with no validation or bot protection, a meta CSP that cannot enforce anti-clickjacking, and a 6.3 MB unused image | PRD §2 **[VERIFIED]** |
| 3 | Strategic objectives | Priorities in order: credibility, design, performance, security, search, maintainability, scale, cost; no backend without a business need | PRD §1 **[VERIFIED]** |
| 4 | My role | Owner and product lead: requirements, priorities, every approval gate, design direction, positioning. Claude drafted the PRD and ADRs and wrote the code under your direction; you reviewed, tested and approved. **[NEEDS EVIDENCE]:** which code, testing and deployment steps you did by hand (D2) | Commits authored by you with Claude co-author; "Approved by owner" entries throughout |
| 5 | Technology stack | Astro 7 static, TypeScript, Content Collections, plain CSS tokens, self-hosted fonts, Cloudflare Workers static assets, one Worker (Turnstile, validation, rate limit, Email Routing), GitHub Actions | `site/`, ADRs **[VERIFIED]** |
| 6 | Design direction | v0.2 warm cream and bronze to v0.3 "Pavilion"; a logo rebuilt on an 80-unit grid and generated by script; before/after screenshots | `docs/design-system.md`, `docs/design/proposal/` **[VERIFIED]** |
| 7 | Development process | Labelled PRD, ADRs with options tables, milestone gates M0 to M7, a cutover runbook with rollback values | `docs/` **[VERIFIED]** |
| 8 | Architecture | Diagram: GitHub, CI checks, Cloudflare static assets with security headers, `/api/*` to the Worker, Turnstile verification, Email Routing to one inbox; DNS and email kept unchanged | `wrangler.jsonc`, ADR-0002 to 0004 **[VERIFIED]** |
| 9 | Challenges and decisions | Framework choice (four options); hosting re-decided when Cloudflare moved to Workers static assets; enforcing headers a meta tag cannot; cutting over without touching email; Safari rasterising SVG filters, which forced a logo rebuild; CSP hashes instead of `unsafe-inline` | ADRs, design-system notes **[VERIFIED]** |
| 10 | Final implementation | Pages, form, CI and Lighthouse 100 on four pages, as recorded. **[NEEDS EVIDENCE]:** whether the Astro site is live at benjaire.com yet (D3); I could not reach benjaire.com from this environment | Runbook |
| 11 | Lessons learned | Written from your notes; I will draft from the record for your edit | — |
| 12 | Future development | Digital Solutions (client intake) is "in development, never described as available", per Benjaire's own rule; brands launch on their own domains | `digital.astro` comments **[VERIFIED]** |

## 9. Technology stack recommendation

**Framework [PROPOSED]: Astro, static output, mirroring Benjaire (ADR-0001).** The portfolio now needs exactly what drove that decision: one shared layout instead of a nav and CSP duplicated across ten pages, schema-validated content for projects, image optimisation for screenshots, and zero JavaScript by default. TypeScript, plain CSS tokens, no UI framework, no WebGL library.

**Content [PROPOSED]:** Content Collections for `projects`, `experience`, `certifications` and `skills`, so the résumé facts live in one place and every page reads from them.

**Hosting [DECISION D4]:**

| Option | Headers | Change | Recommendation |
|---|---|---|---|
| A. GitHub Pages, deployed by GitHub Actions | Meta CSP only (as today) | None | **Recommended for launch:** no infrastructure change |
| B. Cloudflare Workers static assets, as Benjaire | Real headers via `_headers` | Website DNS records only (DNS is already on Cloudflare) | A later phase, with its own approval |

**Contact [PROPOSED]:** a mailto link plus LinkedIn and GitHub, no form. A form would need the Worker, Turnstile and a privacy policy, which a personal portfolio does not justify (brief §15).

**Quality gates [PROPOSED]:** Benjaire's CI (`astro check`, build, links, SEO, axe) plus this repo's existing security check and keyword audit. Target Lighthouse mobile at 95 or higher on every page, matching Benjaire's gate.

**SEO [PROPOSED]:** title *"Khaneil Campbell | AI, Automation & Technology Portfolio"* (56 characters) and the brief's description (146 characters); canonical URLs, Open Graph images per page, generated sitemap, robots, `Person` JSON-LD with only verified credentials, `CreativeWork` or `SoftwareSourceCode` for each case study, and redirects for every retired URL.

## 10. Implementation roadmap

Each milestone ends with an approval gate, as Benjaire's did.

| Milestone | Work | You approve |
|---|---|---|
| **M0: Plan** | This document; your answers to §12 | The plan and decisions |
| **M1: Evidence** | Collect your answers: role detail, metrics source, a sanitised résumé PDF, screenshots, cutover status | The verified content list |
| **M2: Design system** | Tokens, type, components and a homepage concept board, published as a private preview page, at 1440 and 390 widths | The visual direction |
| **M3: Foundation** | Astro scaffold on a new branch: layout, nav, tokens, CI, content collections, redirects; existing pages ported with content unchanged | Parity with the current site |
| **M4: Core pages** | Home, About, Expertise, Experience, Contact, Résumé; timeline and skill map ported | Copy and layout |
| **M5: Case studies** | Commerce pipeline, SOC lab and portfolio case studies, with interactive diagrams | Each case study |
| **M6: Benjaire** | The flagship case study (only if D1 allows it) | Case study and anything it reveals |
| **M7: QA and launch** | Lighthouse, axe, links, SEO, keyboard, reduced motion, 320 to 1440 widths; launch pull request | Go-live |

The existing branch (`claude/stoic-hypatia-1bo10a`) stays as it is until M3. Nothing in the Benjaire repository is changed at any point.

## 11. Verified and unverified content

| Content | Status | Source |
|---|---|---|
| Columbia University, Service Desk Technician, Jul 2022 to present | VERIFIED | Résumé |
| NYC Health + Hospitals, Service Desk Analyst, Oct 2021 to Jul 2022 | VERIFIED | Résumé |
| Montefiore, Desktop Support Specialist Intern, May to Aug 2021 | VERIFIED | Résumé |
| ~180 incidents and requests a month; 96% call quality; 100% ticket review quality | VERIFIED | Résumé |
| 85% customer survey; 2.41% abandoned-call rate | **NEEDS EVIDENCE** | Brief only (D11) |
| CompTIA Security+ (May 2025), ITIL 4 Foundation (Apr 2023) | VERIFIED | Résumé, certificate pages |
| HDI KCS Foundation, HDI Customer Service Representative | VERIFIED (résumé); KCS missing from brief | Résumé (D12) |
| B.S. Individualized Studies, CIS concentration, Buffalo State University | VERIFIED | Résumé |
| AI Literacy: Advanced Course for Developers (Columbia) | VERIFIED | Résumé |
| Cybersecurity mentorship scope | **CONFLICT** | Résumé vs brief (D13) |
| "Columbia University Information Technology" as the organisation name | **NEEDS EVIDENCE** | Brief only; the résumé says Columbia University |
| n8n agent work | **NEEDS EVIDENCE** | Skill lists only (D10) |
| Benjaire live status; your hands-on share of the work | **NEEDS EVIDENCE** | D2, D3 |
| LinkedIn URL: `linkedin.com/in/khaneil-campbell` | CONFIRMED | You, 2026-10-14 (D14); applied across the site |

## 12. Decisions needed

| # | Decision | My recommendation |
|---|---|---|
| **D1** | Benjaire is anonymous by your own PRD rule. May the portfolio name you as its founder and link to it? | If yes, update the Benjaire PRD rule first, then publish. If no, publish an anonymised case study ("a New York consumer-brand company"), with no link or logo |
| **D2** | Which parts of Benjaire did you do by hand (edits, testing, deploying, DNS) versus direct and review? | Answer in your own words; I draft from it |
| **D3** | Is the Astro build live at benjaire.com yet? | Case study says "in development" until it is |
| **D4** | Hosting: stay on GitHub Pages, or move to Cloudflare as Benjaire did | Stay on GitHub Pages for launch |
| **D5** | Hero visual: SVG axonometric drawing (light, sharp) or a pre-rendered architectural still, as Benjaire uses (richer, heavier, needs an original render) | SVG drawing |
| **D6** | Résumé download: your PDF includes your phone number and personal email. Supply a public version without them, or publish a web-only résumé | A public PDF without the phone number |
| **D7** | Accent: restrained signal blue, or fully monochrome like Benjaire | Signal blue, for clear separation |
| **D8** | Navigation: keep Expertise as its own page, or fold it into About | Keep it |
| **D9** | Unpublish the phishing and access-control "in progress" case files until evidence exists | Yes |
| **D10** | n8n and CrewAI experiments: any repo, screenshots or notes to publish? | Draft until supplied |
| **D11** | Source for the 85% survey and 2.41% abandoned-call figures | Omit until supplied |
| **D12** | Include HDI KCS Foundation (on the résumé, not in the brief)? | Include |
| **D13** | Mentorship: résumé wording or brief wording? | Résumé wording unless you confirm the brief |
| ~~D14~~ | ~~Which LinkedIn URL is current?~~ | **Resolved 2026-10-14:** `linkedin.com/in/khaneil-campbell` |
