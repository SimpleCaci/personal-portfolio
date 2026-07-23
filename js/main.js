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

  const motion = document.createElement("script");
  motion.src = new URL("motion.js", mainScript.src).href;
  motion.defer = true;

  const anime = document.createElement("script");
  anime.src = new URL("vendor/anime.umd.min.js", mainScript.src).href;
  anime.defer = true;
  anime.addEventListener("load", () => document.head.append(motion), { once: true });
  anime.addEventListener("error", () => {
    document.documentElement.classList.add("motion-unavailable");
  }, { once: true });
  document.head.append(anime);
}
