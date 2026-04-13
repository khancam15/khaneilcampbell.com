# Khaneil Campbell — Cybersecurity Portfolio

This repository hosts a static cybersecurity portfolio for Khaneil Campbell, showcasing SOC-focused labs, professional background, and certification pages.

## Project Structure

- `index.html` — main portfolio landing page
- `labs.html` — dedicated Featured Labs listing page
- `soc-automation-lab.html` — deep-dive detail page for the SOC Automation lab
- `security-plus.html` — dedicated Security+ certification page
- `itil4.html` — dedicated ITIL 4 certification page
- `images/security-plus-cert.png` — Security+ certificate image asset
- `images/itil-4.png` — ITIL 4 certificate image asset
- `CNAME` — custom domain configuration for GitHub Pages
- `.gitignore` — security-focused ignore rules for local/system/secrets files

## Current Site Sections

### Main Page (`index.html`)
- Sticky nav with Home / Labs / About / Contact anchors
- Hero section with badge, headline, action buttons, stat cards, and Featured Project box
- Featured Labs section with three lab cards (SOC Automation, Phishing IR, IAM)
- About Me section with bio and three pillar cards (Lab Engineering, Core Competencies, The Mission)
- Contact section with LinkedIn, GitHub, and Email actions

### Labs Page (`labs.html`)
- Full lab listing with headline and subtext
- SOC Automation card linking to detail page and GitHub repo

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
3. Commit and push

```bash
git add .
git commit -m "Update portfolio content and pages"
git push origin main
```
