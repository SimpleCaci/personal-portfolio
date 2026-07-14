# Personal Portfolio

Quinton's maintained public portfolio: a personality-forward static site about applied software systems, product thinking, and learning through projects.

## Direction

The site is structured as a field notebook for projects that turn messy real-world input into useful output. Its featured work spans geospatial mission data, computer vision, desktop product design, handwriting OCR, voice interaction, and browser-based pose estimation.

Project status language is intentionally specific. A repository link is not presented as a verified deployment or demo.

## Featured work

- Turion Hackathon 2025 / Solar System Missions
- Gesture-Reactive Avatar
- Ambient Dashboard
- HandwritingConverter
- VoxNav
- Rose Hackathon 2026 / Yoga Pose Match

## Technology

- semantic HTML
- responsive CSS
- small, progressive vanilla JavaScript enhancement
- static-hosting-compatible relative paths

## Run locally

No build step is required. Serve the repository root so paths behave like GitHub Pages:

```bash
python -m http.server 8000
```

Open <http://localhost:8000>.

## Validation

Before publishing:

- parse the HTML and check local links/assets
- verify external project links
- test at desktop and mobile widths
- test keyboard navigation and visible focus
- test with reduced motion enabled
- check the browser console for errors
- verify the deployed GitHub Pages URL after merging

## Deployment

The repository is associated with <https://simplecaci.github.io/personal-portfolio/>. There is no deployment workflow in the repository, so the GitHub Pages source and live response should be verified in repository settings after changes merge.

## Authorship

Designed and built by [SimpleCaci](https://github.com/SimpleCaci). A project license has not yet been selected.

