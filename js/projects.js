// ======= CONFIG: map tech name -> icon path (auto-fallback included) =======
const TECH_ICON_BASE = "../assets/icons"; // adjust to your folder (you wrote ./asset/icon)
const TECH_ICON_EXT = "png";             // png/svg etc

function slugTech(t) {
  return String(t || "")
    .trim()
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/\#/g, "sharp")
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function techIconPath(techName) {
  const slug = slugTech(techName);
  return `${TECH_ICON_BASE}/${slug}.${TECH_ICON_EXT}`;
}

function buildTechIcons(techArr = []) {
  const wrap = document.createElement("div");
  wrap.className = "project-tech-icons";

  for (const t of techArr) {
    const chip = document.createElement("span");
    chip.className = "tech-chip";

    const img = document.createElement("img");
    img.className = "tech-icon";
    img.alt = t;
    img.loading = "lazy";
    img.decoding = "async";

    console.log("TECH:", t, "=>", techIconPath(t));

    img.src = techIconPath(t);

    // fallback: if missing icon, show text chip
    img.onerror = () => {
      img.remove();
      chip.textContent = t;
      chip.classList.add("tech-chip--text");
    };

    chip.title = t;
    chip.dataset.label = t;

    chip.appendChild(img);
    wrap.appendChild(chip);
  }

  return wrap;
}

// ======= global =======
let projects;

// fetch JSON
async function grabData(dataName) {
  const requestURL = `../data/${dataName}.json`;
  const response = await fetch(requestURL);
  return await response.json();
}

function populateProject(project) {
  const section = document.querySelector(".current-items-section");

  const card = document.createElement("article");
  card.className = "project-card";
  card.dataset.date = project.date;

  /* ---------------- HEADER ---------------- */
  const header = document.createElement("div");
  header.className = "project-header";

  const title = document.createElement("h2");
  title.className = "project-title";
  title.textContent = project.title;

  const meta = document.createElement("p");
  meta.className = "project-meta";
  meta.textContent = `${project.status} • ${project.date}`;

  header.append(title, meta);

  /* ---------------- IMAGE ---------------- */
  if (project.image) {
    const imgWrap = document.createElement("div");
    imgWrap.className = "project-image-wrap";

    const img = document.createElement("img");
    img.src = project.image;
    img.alt = project.title;
    img.className = "project-image";
    img.loading = "lazy";
    img.decoding = "async";

    imgWrap.appendChild(img);
    card.appendChild(imgWrap);
  }

  /* ---------------- BODY ---------------- */
  const body = document.createElement("div");
  body.className = "project-body";

  // tech icons row (compact)
  body.appendChild(buildTechIcons(project.tech || []));

  const desc = document.createElement("p");
  desc.className = "project-desc";
  desc.textContent = project.description;

  const details = document.createElement("div");
  details.className = "project-details";

  const problem = document.createElement("p");
  problem.innerHTML = `<strong>Problem:</strong> ${project.problem}`;

  const approach = document.createElement("p");
  approach.innerHTML = `<strong>Approach:</strong> ${project.approach}`;

  const result = document.createElement("p");
  result.innerHTML = `<strong>Result:</strong> ${project.result}`;

  const learned = document.createElement("p");
  learned.innerHTML = `<strong>Learned:</strong> ${project.learned}`;

  details.append(problem, approach, result, learned);
  body.append(desc, details);

  /* ---------------- FOOTER ---------------- */
  const footer = document.createElement("div");
  footer.className = "project-footer";

  const link = document.createElement("a");
  link.href = project.link;
  link.textContent = "View Project →";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "project-link";

  footer.appendChild(link);

  /* ---------------- ASSEMBLE ---------------- */
  card.append(header, body, footer);
  section.appendChild(card);
}

// scrollspy
function setupDateScrollSpy() {
  const activeDateEl = document.getElementById("activeDate");
  const cards = document.querySelectorAll(".project-card");
  if (!activeDateEl || !cards.length) return;

  activeDateEl.textContent = cards[0].dataset.date || "—";

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) activeDateEl.textContent = visible.target.dataset.date || "—";
  }, { threshold: [0.25, 0.5, 0.75], rootMargin: "-30% 0px -50% 0px" });

  cards.forEach(card => observer.observe(card));
}

// run after DOM exists
document.addEventListener("DOMContentLoaded", async () => {
  const data = await grabData("projects");
  projects = data.projects;

  for (const project of projects) populateProject(project);
  setupDateScrollSpy();
});
