# Quinton's Personal Field Station

A personality-forward portfolio for Quinton's verified software projects, technical interests, and contact information.

The site keeps the original cloud, cow, and pull-rope personality, then expands it into an interactive field station: an animated sky, a draggable cow, code-native project illustrations, honest project field notes, responsive map coordinates, and a pull-cord return interaction.

> **Status:** active portfolio. The six featured repositories and their current limitations were verified before this redesign. The site does not claim live demos or deployments that have not been tested.

## Featured systems

- [Turion Hackathon 2025](https://github.com/SimpleCaci/Turion-Hackathon-2025)
- [HandwritingConverter](https://github.com/SimpleCaci/HandwritingConverter)
- [Ambient Dashboard](https://github.com/SimpleCaci/ambient-dashboard)
- [Gesture-Reactive Avatar](https://github.com/SimpleCaci/Gesture-Reactive-Avatar)
- [VoxNav](https://github.com/SimpleCaci/VoxNav)
- [Rose Hackathon 2026](https://github.com/SimpleCaci/Rose-Hackathon-2026)

## Experience

- animated canvas sky that responds gently to pointer position
- draggable field cow with keyboard-accessible messages
- pull-cord shortcut for returning to the beginning
- project filters and expandable evidence notes
- six original inline SVG project illustrations
- map-inspired interests and handwritten field rules
- reduced-motion, keyboard, mobile, high-contrast, and print fallbacks
- legacy page redirects for existing project and contact URLs

## Technology

- semantic HTML
- modern responsive CSS
- vanilla JavaScript
- JSON-backed project content
- static GitHub Pages hosting

No framework or production build step is required.

## Run locally

Serve the repository root so JSON requests behave like GitHub Pages:

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Validate

The repository includes a dependency-free validation script:

```bash
node scripts/validate-site.mjs
node --check js/site.js
```

The same checks run in GitHub Actions for pull requests and pushes to `main`.

Manual validation should still cover:

- project filtering and expanded field notes
- cow dragging with mouse and touch
- cow activation and pull-cord return with a keyboard
- navigation at desktop and mobile widths
- reduced-motion behavior
- public repository and contact links

## Content updates

Verified project details live in `data/projects.json`. Keep status, evidence, limitations, repository links, and deployment claims accurate.

## Deployment

The public site is hosted at [simplecaci.github.io/personal-portfolio](https://simplecaci.github.io/personal-portfolio/). The repository does not add or change a deployment workflow; the existing GitHub Pages configuration remains the deployment source.

## Authorship

Designed and built by [SimpleCaci](https://github.com/SimpleCaci). A project license has not yet been selected.
