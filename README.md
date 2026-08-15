# Personal Portfolio

Quinton’s public portfolio is a handcrafted static site about applied software systems, product thinking, and what he learns by building.

## Direction

The design mixes a technical field notebook with Spider-Noir atmosphere,
comic-panel cuts, hard shadows, web geometry, and a small rope-and-ranch
streak. The original cow mascot stayed. Navigation and content do not depend
on animation or JavaScript.

The featured work spans geospatial mission data, computer vision, handwriting OCR, voice interaction, browser-based pose estimation, and practical productivity experiments. Project status language is intentionally specific: a repository link is not presented as a verified deployment or demo.

## Pages

- `index.html` - homepage, interactive signal web, selected work, about, and availability callout
- `projects/` - JSON-backed project field notes with no-JavaScript and load-failure fallbacks
- `writings/` - honest archive placeholder until finished writing exists
- `contacts/` - verified public email and GitHub links

## Technology

- semantic HTML
- responsive CSS with custom properties
- small progressive-enhancement JavaScript
- Anime.js 4.5 for orchestrated, accessible motion
- vendored Anton, Barlow Condensed, and Space Mono webfonts
- JSON-backed project content
- dependency-free static validation

Anime.js is vendored at `js/vendor/anime.umd.min.js` so the deployed site keeps
working without a package manager, build step, or third-party CDN request.
The motion layer uses timelines, center-out staggering, SVG line animation,
spring-like reactions, scroll-triggered reveals, restrained background rain,
pointer speed lines, and a single-panel page transition. Each component owns
its transform so independent effects do not pull the same element in different
directions. Ransom-note cutout letters are intentionally reserved for the main
page openings and one noir interlude; ordinary section and project titles stay
undistorted for a clearer visual hierarchy.

The site copy was edited with the
[Humanizer](https://github.com/blader/humanizer) guidelines. That pass removed
stiff or promotional phrasing while preserving every project fact, limitation,
status, link, and public contact detail.

Anton and Barlow Condensed are distributed under the SIL Open Font License.
Their license texts are included beside the font files in `assets/fonts/`.

## Accessibility and experience controls

The fixed `FX` control opens a keyboard-accessible settings panel. Preferences
are stored locally in the browser and never transmitted. Visitors can choose:

- Calm, Dynamic, or Maximum motion intensity
- higher color contrast
- larger body text
- static background texture
- no pointer trails
- globally paused Anime.js and CSS motion; navigation stays functional while paused

The site also honors `prefers-reduced-motion`, retains native scrolling, uses
semantic headings and landmarks, exposes filter state with `aria-pressed`,
announces project-filter results through a live region, preserves visible focus
states, and keeps decorative SVG and motion layers out of the accessibility
tree. All core content and navigation remain available without JavaScript.

## Page-specific enhancements

- Home uses a light interactive signal web to connect API, computer vision,
  geospatial, and workflow interests to the corresponding featured work. It
  also includes a visible “Open to internships” status and a focused
  Spider-Noir case-file interlude.
- Projects provides keyboard-operable category filters and lazy, decorative
  project schematics.
- Writing receives an animated archive stamp and layered note treatment.
- Contact uses a decorative channel-open signal around the existing mascot.
- Clicking the field assistant five times unlocks an optional visual easter egg.

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

