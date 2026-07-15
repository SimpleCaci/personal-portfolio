"""Lightweight, dependency-free checks for the static portfolio."""

from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = [ROOT / "index.html", ROOT / "projects/index.html", ROOT / "writings/index.html", ROOT / "contacts/index.html"]
REQUIRED_PROJECT_FIELDS = {"id", "title", "shortDescription", "category", "technologies", "status", "repositoryUrl", "year", "problem", "approach", "limitation"}
BAD_TEXT = ("example.com", "This is a brief", "placeholder copy", "â€", "â†", "Â·")


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.links: list[dict[str, str | None]] = []
        self.images: list[dict[str, str | None]] = []
        self.titles = 0
        self.main_count = 0
        self.h1_count = 0
        self.errors: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if "id" in values and values["id"]:
            if values["id"] in self.ids:
                self.errors.append(f"duplicate id #{values['id']}")
            self.ids.add(values["id"])
        if tag == "a":
            self.links.append(values)
        elif tag == "img":
            self.images.append(values)
        elif tag == "title":
            self.titles += 1
        elif tag == "main":
            self.main_count += 1
        elif tag == "h1":
            self.h1_count += 1
        for name in values:
            if name.lower().startswith("on"):
                self.errors.append(f"inline event handler {name}")


def check_page(path: Path) -> list[str]:
    source = path.read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(source)
    errors = list(parser.errors)
    relative = path.relative_to(ROOT)
    if parser.titles != 1:
        errors.append(f"expected one title element, found {parser.titles}")
    if parser.main_count != 1:
        errors.append(f"expected one main landmark, found {parser.main_count}")
    if parser.h1_count != 1:
        errors.append(f"expected one h1, found {parser.h1_count}")
    if not re.search(r'<meta\s+name="description"\s+content="[^"]+"', source):
        errors.append("missing meta description")
    for marker in BAD_TEXT:
        if marker in source:
            errors.append(f"contains prohibited or corrupted text: {marker}")
    for link in parser.links:
        href = link.get("href")
        if not href:
            errors.append("link missing href")
            continue
        if link.get("target") == "_blank" and "noopener" not in (link.get("rel") or ""):
            errors.append(f"external tab missing noopener: {href}")
        if href.startswith("#"):
            if href[1:] not in parser.ids:
                errors.append(f"broken fragment: {href}")
            continue
        parsed = urlparse(href)
        if parsed.scheme in {"http", "https", "mailto"}:
            continue
        local = (path.parent / href.split("#", 1)[0]).resolve()
        if not local.exists():
            errors.append(f"missing local target: {href}")
    for image in parser.images:
        if image.get("alt") is None:
            errors.append(f"image missing alt: {image.get('src')}")
        src = image.get("src")
        if src and not urlparse(src).scheme and not (path.parent / src).resolve().exists():
            errors.append(f"missing local image: {src}")
    return [f"{relative}: {error}" for error in errors]


def check_data() -> list[str]:
    errors: list[str] = []
    projects = json.loads((ROOT / "data/projects.json").read_text(encoding="utf-8"))
    entries = projects.get("projects")
    if projects.get("schemaVersion") != 2 or not isinstance(entries, list) or not entries:
        return ["data/projects.json: expected schemaVersion 2 and a non-empty projects array"]
    ids: set[str] = set()
    for index, project in enumerate(entries):
        if not isinstance(project, dict):
            errors.append(f"data/projects.json: project {index} is not an object")
            continue
        missing = REQUIRED_PROJECT_FIELDS - project.keys()
        if missing:
            errors.append(f"data/projects.json: project {index} missing {sorted(missing)}")
        project_id = project.get("id")
        if project_id in ids:
            errors.append(f"data/projects.json: duplicate id {project_id}")
        ids.add(project_id)
        if not isinstance(project.get("technologies"), list):
            errors.append(f"data/projects.json: {project_id} technologies must be an array")
        repo = project.get("repositoryUrl", "")
        if not isinstance(repo, str) or not repo.startswith("https://github.com/SimpleCaci/"):
            errors.append(f"data/projects.json: {project_id} has an unexpected repository URL")
    json.loads((ROOT / "data/profile.json").read_text(encoding="utf-8"))
    json.loads((ROOT / "data/writings.json").read_text(encoding="utf-8"))
    return errors


def main() -> int:
    errors = [error for page in HTML_FILES for error in check_page(page)]
    errors.extend(check_data())
    if errors:
        print("Static validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"Static validation passed for {len(HTML_FILES)} pages and project data.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

