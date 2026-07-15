# Personal Portfolio

Quinton's maintained public portfolio: a handcrafted static site about applied software systems, product thinking, and learning through projects.

## Direction

The design combines a technical field notebook with a restrained rope-and-ranch motif. It keeps the original cow mascot, but core navigation and content no longer depend on a custom cursor, animation, or JavaScript.

The featured work spans geospatial mission data, computer vision, desktop product design, handwriting OCR, voice interaction, and browser-based pose estimation. Project status language is intentionally specific: a repository link is not presented as a verified deployment or demo.

## Pages

- `index.html` - homepage, selected work, method, about, and contact callout
- `projects/` - JSON-backed project field notes with no-JavaScript and load-failure fallbacks
- `writings/` - honest archive placeholder until finished writing exists
- `contacts/` - verified public email and GitHub links

## Technology

- semantic HTML
- responsive CSS with custom properties
- small progressive-enhancement JavaScript
- JSON-backed project content
- dependency-free static validation

## Run locally

No build step is required. Serve the repository root so JSON and relative paths behave like GitHub Pages:

```bash
python -m http.server 8000
```

Open <http://localhost:8000> and visit every public page.

## Validate

```bash
python scripts/validate_site.py
```

The script checks page structure, local links and images, alternative text, external-tab safety, obvious placeholders or encoding corruption, and the project JSON schema. GitHub Actions runs the same check for pull requests and pushes to `main`.

## Deployment

The repository is associated with <https://simplecaci.github.io/personal-portfolio/>. Confirm the GitHub Pages source and live response after merging; the repository does not contain a custom deployment action.

## Authorship

Designed and built by [SimpleCaci](https://github.com/SimpleCaci). A project license has not yet been selected.

