# Vision

The north star for khaneilcampbell.com. Every page, section and line of copy should
serve what is set out here; when a change does not, the change is wrong, not the vision.

## The concept

An interactive digital experience rather than a résumé. A visitor arrives to a
cinematic introduction: the name resolves on screen, the disciplines follow, and
a subtle animated field gives the page depth. As they scroll, the site moves
through the work, the background, the credentials and where the career is headed.

## Positioning

| | |
|---|---|
| Name | Khaneil Campbell |
| Title | AI & Technology Professional |
| Disciplines | AI • Cybersecurity • Technology |
| Tagline | Engineering intelligent solutions for a connected world. |
| Statement | Exploring the intersection of artificial intelligence, cybersecurity, and enterprise technology to build smarter, more secure digital experiences. |

The title leads with AI without discarding the cybersecurity and enterprise IT
experience behind it. That experience is the evidence the AI work is built on, not
a separate career to apologise for.

## What every visitor should leave knowing

1. **Technical credibility.** Enterprise environments, cybersecurity principles,
   AI automation and modern IT infrastructure are understood, and shown in
   documented work rather than claimed in adjectives.
2. **Creative thinking.** The work goes beyond support: technology, automation
   and intelligent systems are applied to business problems.
3. **Professional maturity.** Years at Columbia University show the ability to
   operate inside a major institution, where an outage has consequences and every
   automation has to be auditable.

## Audience

Recruiters, hiring managers, technology leaders and potential collaborators. The
site should let any of them recognise the capability within the first screen and
confirm it within the first scroll.

## Principles

- **Show, then tell.** Lead with work that can be examined. Numbers and claims are
  kept only when the work behind them is published.
- **Immersive, not heavy.** Motion and depth are done in CSS. The site ships no
  JavaScript, so the CSP stays at `default-src 'none'`; any future step that wants
  scripting has to justify relaxing that.
- **Motion is optional.** Everything animated stops under `prefers-reduced-motion`,
  and nothing is hidden if an animation never runs.
- **Accessible by default.** Contrast ratios in the README are a floor, not a target.
