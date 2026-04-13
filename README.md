# Khaneil Campbell — Cybersecurity Portfolio

This repository hosts a static cybersecurity portfolio for Khaneil Campbell, showcasing SOC-focused labs, professional background, and certification pages.

## Project Structure

- `index.html` — main portfolio landing page
- `security-plus.html` — dedicated Security+ certification page
- `itil4.html` — dedicated ITIL 4 certification page
- `images/security-plus-cert.png` — Security+ certificate image asset
- `images/itil-4.png` — ITIL 4 certificate image asset
- `CNAME` — custom domain configuration for GitHub Pages
- `.gitignore` — security-focused ignore rules for local/system/secrets files

## Current Site Sections

The main page includes:

- Home navigation anchor support (`#home`)
- Featured Labs section
- About Me section
- Contact section with GitHub, LinkedIn, and email actions

Certification pages include:

- Top navigation with Home/Labs/About/Contact links back to `index.html`
- Individual certificate detail cards and image display

## Deployment

This is a static HTML/CSS site and can be deployed on GitHub Pages or any static host.

### GitHub Pages

1. Push all updates to the `main` branch
2. In repository Settings, enable GitHub Pages from `main`
3. Use the published URL from GitHub Pages settings

## Local Development

1. Edit `index.html`, `security-plus.html`, or `itil4.html`
2. Add/update assets in the `images/` folder
3. Commit and push

```bash
git add .
git commit -m "Update portfolio content and pages"
git push origin main
```
