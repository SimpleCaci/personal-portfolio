const list = document.querySelector("[data-project-list]");
const loading = document.querySelector("[data-project-loading]");
const errorState = document.querySelector("[data-project-error]");

function safeText(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function validUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function projectCard(project, index) {
  const article = document.createElement("article");
  article.className = "case-card";

  const visual = document.createElement("div");
  visual.className = "case-visual";
  const initials = document.createElement("span");
  initials.className = "case-initials";
  initials.setAttribute("aria-hidden", "true");
  initials.textContent = safeText(project.title, "Project").split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  visual.append(initials);

  if (typeof project.image === "string" && project.image.trim()) {
    const image = document.createElement("img");
    image.className = "case-image";
    image.src = project.image;
    image.alt = safeText(project.imageAlt, "");
    image.loading = "lazy";
    image.addEventListener("error", () => image.remove(), { once: true });
    visual.append(image);
  }

  const body = document.createElement("div");
  body.className = "case-body";
  const top = document.createElement("div");
  top.className = "case-topline";
  const category = document.createElement("span");
  category.className = "eyebrow";
  category.textContent = `${String(index + 1).padStart(2, "0")} / ${safeText(project.category, "Experiment")}`;
  const status = document.createElement("span");
  status.className = "status-label";
  status.textContent = safeText(project.status, "Status not documented");
  top.append(category, status);

  const title = document.createElement("h2");
  title.textContent = safeText(project.title, "Untitled project");
  const summary = document.createElement("p");
  summary.className = "case-summary";
  summary.textContent = safeText(project.shortDescription, "Project notes are still being written.");

  const notes = document.createElement("dl");
  notes.className = "case-notes";
  [["Problem", project.problem], ["Approach", project.approach], ["Current limitation", project.limitation]].forEach(([label, value]) => {
    const group = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = safeText(value, "Not documented yet.");
    group.append(term, detail);
    notes.append(group);
  });

  const actions = document.createElement("div");
  actions.className = "case-actions";
  const tags = document.createElement("ul");
  tags.className = "tag-list";
  (Array.isArray(project.technologies) ? project.technologies : []).slice(0, 6).forEach((technology) => {
    if (typeof technology !== "string" || !technology.trim()) return;
    const item = document.createElement("li");
    item.textContent = technology.trim();
    tags.append(item);
  });
  actions.append(tags);
  const repositoryUrl = validUrl(project.repositoryUrl);
  if (repositoryUrl) {
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = repositoryUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View repository ↗";
    link.setAttribute("aria-label", `View ${title.textContent} repository on GitHub`);
    actions.append(link);
  }
  body.append(top, title, summary, notes, actions);
  article.append(visual, body);
  return article;
}

async function loadProjects() {
  if (!list) return;
  try {
    const response = await fetch("../data/projects.json", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Project data returned ${response.status}`);
    const data = await response.json();
    if (!data || !Array.isArray(data.projects) || !data.projects.length) throw new Error("Project data is empty or malformed");
    const fragment = document.createDocumentFragment();
    data.projects.forEach((project, index) => fragment.append(projectCard(project, index)));
    list.replaceChildren(fragment);
    loading?.remove();
  } catch (error) {
    console.error("Unable to load project data", error);
    loading?.remove();
    errorState?.removeAttribute("hidden");
  }
}

loadProjects();

