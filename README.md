# Personal Portfolio

A personality-forward static portfolio for my projects, writing, and contact information.

The site uses a playful rope-and-cow visual theme while organizing project data separately from presentation code. It is intended to become the main public portfolio for SimpleCaci.

> **Status:** active work in progress. The main pages, styling, project data, transitions, and custom cursor are present, but several sections still contain placeholder copy and links.

## Pages and features

- home page with animated hero and current-project cards
- project gallery populated from `data/projects.json`
- writings page
- contact page
- custom cursor, rope interaction, and page transitions
- responsive CSS structure and local visual assets

## Technology

- semantic HTML
- CSS
- vanilla JavaScript
- JSON-backed project/profile/writing data
- static hosting compatible

## Project structure

```text
index.html            home
projects/             project gallery
writings/             writing links
contacts/             contact page
data/                 profile, project, and writing content
js/                   interactions and data rendering
css/                  shared and page-specific styles
assets/               icons, project art, and visual theme
```

## Run locally

No build step is required. Use a local server so JSON requests and relative links behave consistently:

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Content updates

Update portfolio content in:

- `data/profile.json`
- `data/projects.json`
- `data/writings.json`

Keep claims, project status, screenshots, and links accurate. Do not add placeholder awards, metrics, or deployments.

## Validation status

No automated tests or CI workflow currently exist. Before publishing, manually check:

- every navigation and project link
- desktop and mobile layouts
- keyboard focus and reduced-motion behavior
- image alternative text
- missing JSON/image failure states
- contact details and external links
- the site with JavaScript disabled or unavailable

## Known unfinished work

- the home page contains generic introduction/project copy
- writing entries include example placeholders
- the contact page references an external image
- navigation/footer sections are incomplete
- metadata and page titles are generic
- no deployment workflow or custom-domain documentation exists
- the custom cursor and animation effects need accessibility fallbacks

## Roadmap

- replace placeholder copy with a concise developer narrative
- feature the strongest verified projects and case studies
- add consistent project screenshots
- finish navigation and footer
- add reduced-motion and keyboard-friendly behavior
- validate and deploy the static site
- connect the profile README to the finished portfolio

## Authorship

Designed and built by [SimpleCaci](https://github.com/SimpleCaci). A project license has not yet been selected.
