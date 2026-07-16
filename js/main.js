document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", () => link.closest("details")?.removeAttribute("open"));
});

const mainScript = document.currentScript;
if (mainScript) {
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = new URL("../css/coolness.css", mainScript.src).href;
  document.head.append(style);

  const coolness = document.createElement("script");
  coolness.src = new URL("coolness.js", mainScript.src).href;
  coolness.defer = true;
  document.head.append(coolness);
}
