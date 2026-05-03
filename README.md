# Khaneil Campbell — Cybersecurity Portfolio

This repository hosts a static cybersecurity portfolio for Khaneil Campbell, showcasing SOC-focused labs, professional background, and certification pages.

## Project Structure

- `index.html` — main portfolio landing page
- `labs.html` — dedicated Featured Labs listing page
- `lab-details.html` — expanded detailed views for every security lab
- `projects.html` — personal projects page showcasing AI developer and automation work
- `soc-automation-lab.html` — deep-dive detail page for the SOC Automation lab
- `security-plus.html` — dedicated Security+ certification page
- `itil4.html` — dedicated ITIL 4 certification page
- `404.html` — branded fallback page for GitHub Pages routing
- `robots.txt` — crawler directives pointing to the sitemap
- `sitemap.xml` — public URL index for search engines
- `images/security-plus-cert.png` — Security+ certificate image asset
- `images/itil-4.png` — ITIL 4 certificate image asset
- `scripts/interface_upgrade.py` — repeatable Python interface polish for public HTML pages
- `scripts/site_audit.py` — dependency-free Python audit for HTML security, accessibility, and link hygiene
- `scripts/site_inventory.py` — dependency-free Python inventory generator for pages, links, headings, and assets
- `CNAME` — custom domain configuration for GitHub Pages
- `.gitignore` — security-focused ignore rules for local/system/secrets files

## Current Site Sections

### Main Page (`index.html`)
- Immersive security operations interface with live case-feed styling, metrics, and action links
- Featured Labs section with SOC Automation, Phishing IR, and IAM lab cards
- Personal Projects section linking to the AI Etsy Product Pipeline
- Operating Method section explaining scenario, detection, triage, and response standards
- About section focused on enterprise IT experience, detection work, IAM, and investigation methods
- Credentials section linking to Security+ and ITIL 4 pages
- Contact section with LinkedIn, GitHub, and Email actions

### Featured Labs Page (`labs.html`)
- Immersive cyber range interface with command-feed styling, metrics, filtering, and analyst briefing sections
- SOC Automation card linking to detail page and GitHub repo
- Staged cards for phishing IR and IAM workflows

### Labs Page (`lab-details.html`)
- Expanded case-file views for SOC Automation, Phishing IR, and IAM labs
- Shows scenario, telemetry, evidence goals, workflow phases, tools, and status for each lab

### Personal Projects Page (`projects.html`)
- AI developer showcase for the AI Etsy Product Pipeline
- Highlights autonomous workflow design, CrewAI orchestration, Anthropic API usage, Canva Connect automation, Etsy REST API publishing, SQLite state tracking, and VPS operation

### SOC Automation Lab (`soc-automation-lab.html`)
- Objective, 4-step workflow, stack, skills demonstrated, and outcome
- Links back to portfolio and GitHub repo

### Certification Pages
- Top navigation linking back to `index.html`
- Individual certificate detail cards with image display

## Deployment

This is a static HTML/CSS site deployed on GitHub Pages with a custom domain.

### GitHub Pages

1. Push all updates to the `main` branch
2. In repository Settings, enable GitHub Pages from `main`
3. Custom domain is configured via `CNAME` → `khaneilcampbell.com`

## Local Development

1. Edit any `.html` file directly — no build step required
2. Add/update assets in the `images/` folder
3. Run local checks before committing
4. Commit and push

```bash
python3 scripts/interface_upgrade.py .
python3 scripts/site_audit.py .
python3 scripts/site_inventory.py .
bash scripts/security-check.sh .
```

```bash
git add .
git commit -m "Update portfolio content and pages"
git push origin main
```
