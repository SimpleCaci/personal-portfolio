// global
let projects;

// fetch JSON
async function grabData(dataName) {
  const requestURL = `../data/${dataName}.json`;
  const response = await fetch(requestURL);
  return await response.json();
}

function populateProject(project) {
  const section = document.querySelector(".current-items-section");

  const card = document.createElement("div");
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

    imgWrap.appendChild(img);
    card.appendChild(imgWrap);
  }

  /* ---------------- BODY ---------------- */
  const body = document.createElement("div");
  body.className = "project-body";

  const desc = document.createElement("p");
  desc.className = "project-desc";
  desc.textContent = project.description;

  const tech = document.createElement("p");
  tech.innerHTML = `<strong>Tech:</strong> ${project.tech.join(", ")}`;

  const problem = document.createElement("p");
  problem.innerHTML = `<strong>Problem:</strong> ${project.problem}`;

  const approach = document.createElement("p");
  approach.innerHTML = `<strong>Approach:</strong> ${project.approach}`;

  const result = document.createElement("p");
  result.innerHTML = `<strong>Result:</strong> ${project.result}`;

  const learned = document.createElement("p");
  learned.innerHTML = `<strong>Learned:</strong> ${project.learned}`;

  body.append(desc, tech, problem, approach, result, learned);

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
