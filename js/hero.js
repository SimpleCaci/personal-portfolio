const hero = document.querySelector(".top-bar-section");

hero.addEventListener("mousemove", (e) => {
  const r = hero.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;

  hero.style.setProperty("--px", (x * 14).toFixed(2) + "px");
  hero.style.setProperty("--py", (y * 10).toFixed(2) + "px");
});

hero.addEventListener("mouseleave", () => {
  hero.style.setProperty("--px", "0px");
  hero.style.setProperty("--py", "0px");
});
