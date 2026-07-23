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
  const styleUrl = new URL("../css/coolness.css", mainScript.src);
  styleUrl.searchParams.set("v", "20260723-4");
  style.href = styleUrl.href;
  document.head.append(style);

  const motion = document.createElement("script");
  const motionUrl = new URL("motion.js", mainScript.src);
  motionUrl.searchParams.set("v", "20260723-4");
  motion.src = motionUrl.href;
  motion.defer = true;

  const anime = document.createElement("script");
  const animeUrl = new URL("vendor/anime.umd.min.js", mainScript.src);
  animeUrl.searchParams.set("v", "4.5.0");
  anime.src = animeUrl.href;
  anime.defer = true;
  anime.addEventListener("load", () => document.head.append(motion), { once: true });
  anime.addEventListener("error", () => {
    document.documentElement.classList.add("motion-unavailable");
  }, { once: true });
  document.head.append(anime);
}
