import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];
const requiredFiles = [
  "index.html",
  "css/site.css",
  "js/site.js",
  "data/projects.json",
  "data/profile.json",
  "projects/index.html",
  "contacts/index.html",
  "writings/index.html",
];

const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");
const fail = (message) => failures.push(message);

for (const file of requiredFiles) {
  try {
    const info = await stat(path.join(root, file));
    if (!info.isFile()) fail(`${file} is not a file`);
  } catch {
    fail(`${file} is missing`);
  }
}

const index = await read("index.html");
const projects = JSON.parse(await read("data/projects.json"));
JSON.parse(await read("data/profile.json"));

if (!index.includes('fetch("./data/projects.json"') && !(await read("js/site.js")).includes('fetch("./data/projects.json"')) {
  fail("Project data must use a GitHub Pages-safe relative path");
}

for (const forbidden of ["example.com", "This is a brief introduction", "Details about my projects", "Lorem ipsum"]) {
  if (index.includes(forbidden) || JSON.stringify(projects).includes(forbidden)) {
    fail(`Placeholder content remains: ${forbidden}`);
  }
}

const expectedRepos = [
  "Turion-Hackathon-2025",
  "Gesture-Reactive-Avatar",
  "ambient-dashboard",
  "HandwritingConverter",
  "VoxNav",
  "Rose-Hackathon-2026",
];

if (!Array.isArray(projects.projects) || projects.projects.length !== expectedRepos.length) {
  fail(`Expected exactly ${expectedRepos.length} verified projects`);
} else {
  const repoNames = projects.projects.map((project) => new URL(project.repo).pathname.split("/").filter(Boolean).at(-1));
  for (const repo of expectedRepos) {
    if (!repoNames.includes(repo)) fail(`Missing verified repository: ${repo}`);
  }

  for (const project of projects.projects) {
    const fields = ["title", "visual", "status", "summary", "input", "process", "output", "why", "proof", "repo"];
    for (const field of fields) {
      if (!project[field] || typeof project[field] !== "string") fail(`${project.title || "Project"} is missing ${field}`);
    }
    if (!project.repo.startsWith("https://github.com/SimpleCaci/")) fail(`${project.title} has an unexpected repository URL`);
    if (!Array.isArray(project.tech) || project.tech.length < 3) fail(`${project.title} needs at least three technologies`);
    if (!Array.isArray(project.evidence) || project.evidence.length < 3) fail(`${project.title} needs at least three evidence notes`);
  }
}

const attributes = [...index.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
for (const value of attributes) {
  if (/^(?:https?:|mailto:|#|data:)/.test(value)) continue;
  const clean = value.split("#")[0].split("?")[0];
  if (!clean) continue;
  const localPath = clean.replace(/^\.\//, "");
  try {
    await stat(path.join(root, localPath));
  } catch {
    fail(`Broken local reference in index.html: ${value}`);
  }
}

if (!index.includes('id="main-content"')) fail("Missing main-content skip target");
if (!index.includes('aria-live="polite"')) fail("Missing live-region feedback");
if (!index.includes('rel="noopener noreferrer"')) fail("External links need safe opener behavior");

if (failures.length) {
  console.error("Portfolio validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Portfolio validation passed: ${projects.projects.length} verified projects and ${attributes.length} indexed references.`);
}
