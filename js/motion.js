/**
 * Motion direction powered by Anime.js 4.
 * The page remains fully readable if JavaScript is unavailable and respects the
 * visitor's reduced-motion preference.
 */
(() => {
  const { animate, createTimeline, stagger, utils } = window.anime || {};
  if (!animate || !createTimeline || !stagger || !utils) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const script = document.currentScript;
  const siteRoot = script ? new URL("../", script.src) : new URL("../", window.location.href);
  const asset = (path) => new URL(path, siteRoot).href;

  document.body.classList.add("coolness-ready");

  const header = document.querySelector(".site-header");
  if (header) {
    const coordinates = document.createElement("span");
    coordinates.className = "field-coordinates";
    coordinates.textContent = "POINTER 000 / 000";
    coordinates.setAttribute("aria-hidden", "true");
    header.querySelector(".wordmark")?.after(coordinates);
    document.addEventListener("pointermove", (event) => {
      document.body.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.body.style.setProperty("--pointer-y", `${event.clientY}px`);
      coordinates.textContent = `POINTER ${String(Math.round(event.clientX)).padStart(3, "0")} / ${String(Math.round(event.clientY)).padStart(3, "0")}`;
    }, { passive: true });
  }

  const map = document.querySelector(".field-map");
  if (map) {
    const route = document.createElement("span");
    route.className = "map-route";
    const routeDot = document.createElement("span");
    routeDot.className = "map-route-dot";
    const label = document.createElement("span");
    label.className = "map-label";
    label.textContent = "SIGNAL ACQUIRED";
    route.append(routeDot);
    map.append(route, label);

    if (!reducedMotion.matches) {
      animate(route, { rotate: [24, 384], duration: 18000, loop: true, ease: "linear" });
      animate(routeDot, {
        scale: [0.7, 1.35, 0.7],
        opacity: [0.45, 1, 0.45],
        duration: 1800,
        loop: true,
        ease: "inOutSine"
      });
    }
  }

  function initSignalLab() {
    const stage = document.querySelector("[data-signal-stage]");
    if (!stage) return;
    const core = stage.querySelector(".system-core");
    const rings = stage.querySelectorAll(".orbit");
    const globeLines = stage.querySelectorAll(".core-globe ellipse, .core-globe path");
    const nodes = stage.querySelectorAll(".signal-node");
    const links = stage.querySelectorAll(".signal-links path");
    const readout = document.querySelector("[data-signal-readout]");

    if (!reducedMotion.matches) {
      animate(rings, {
        rotateZ: (target, index) => index % 2 ? [0, -360] : [0, 360],
        duration: (target, index) => 12000 + index * 3500,
        loop: true,
        ease: "linear"
      });
      animate(globeLines, {
        strokeDashoffset: [0, -56],
        duration: 5000,
        delay: stagger(180),
        loop: true,
        ease: "linear"
      });
      animate(nodes, {
        y: [0, -7, 0],
        scale: [1, 1.07, 1],
        duration: 2600,
        delay: stagger(320),
        loop: true,
        ease: "inOutSine"
      });
      animate(links, {
        strokeDashoffset: [0, -48],
        opacity: [0.18, 0.55, 0.18],
        duration: 4200,
        delay: stagger(240),
        loop: true,
        ease: "linear"
      });
    }

    if (!reducedMotion.matches && finePointer.matches) {
      stage.addEventListener("pointermove", (event) => {
        const bounds = stage.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        animate(core, {
          rotateY: x * 22,
          rotateX: y * -18,
          x: x * 9,
          y: y * 7,
          duration: 800,
          ease: "outExpo"
        });
        animate(nodes, {
          x: (_, index) => x * (index % 2 ? -12 : 12),
          y: (_, index) => y * (index < 2 ? -10 : 10),
          duration: 950,
          ease: "outExpo"
        });
      });
      stage.addEventListener("pointerleave", () => {
        animate(core, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 1100, ease: "outElastic(1, .45)" });
        animate(nodes, { x: 0, y: 0, duration: 900, ease: "outExpo" });
      });
    }

    nodes.forEach((node) => node.addEventListener("click", () => {
      nodes.forEach((item) => item.classList.toggle("is-active", item === node));
      if (readout) readout.textContent = node.dataset.signal || "Applied systems";
      if (reducedMotion.matches) return;
      animate(node, { scale: [1, 1.35, 0.92, 1.08], duration: 720, ease: "outElastic(1, .5)" });
      animate(core, {
        scale: [1, 0.82, 1.12, 1],
        rotateZ: "+=90",
        duration: 1050,
        ease: "outElastic(1, .55)"
      });
      animate(links, {
        opacity: [0.2, 1, 0.2],
        strokeWidth: [1, 2.5, 1],
        duration: 780,
        delay: stagger(80),
        ease: "inOutQuad"
      });
    }));
  }

  function playHeroIntro() {
    const hero = document.querySelector(".hero");
    if (!hero || reducedMotion.matches) return;
    const copy = hero.querySelectorAll(".eyebrow, h1, .hero-lead, .button-row");
    const card = hero.querySelector(".hero-card");
    utils.set(copy, { opacity: 0, y: "1.4rem" });
    if (card) utils.set(card, { opacity: 0, x: "2rem", rotate: "3deg" });

    const timeline = createTimeline({ defaults: { ease: "outExpo" } });
    timeline
      .add(copy, {
        opacity: [0, 1],
        y: ["1.4rem", 0],
        duration: 900,
        delay: stagger(95)
      })
      .add(card, {
        opacity: [0, 1],
        x: ["2rem", 0],
        rotate: ["3deg", "1deg"],
        duration: 1050
      }, 180);
  }

  function reveal(element) {
    element.classList.add("cool-reveal");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      element.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      element.classList.add("is-revealed");
      const children = element.matches(".preview, .case-card, .featured")
        ? [element]
        : [...element.children].filter((child) => !child.matches(".rope-rule"));
      animate(children.length ? children : element, {
        opacity: [0, 1],
        y: ["1.5rem", 0],
        duration: 760,
        delay: stagger(75),
        ease: "outExpo"
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6%" });
    observer.observe(element);
  }

  function addCardMotion(card) {
    if (card.dataset.motionReady === "true") return;
    card.dataset.motionReady = "true";
    reveal(card);
    if (reducedMotion.matches || !finePointer.matches) return;

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3;
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3;
      animate(card, { rotateX, rotateY, duration: 420, ease: "outExpo" });
      animate(card.querySelector(".case-body"), { z: "1rem", duration: 420, ease: "outExpo" });
      card.classList.add("is-tilting");
    });
    card.addEventListener("pointerleave", () => {
      animate(card, { rotateX: 0, rotateY: 0, duration: 650, ease: "outElastic(1, .5)" });
      animate(card.querySelector(".case-body"), { z: 0, duration: 500, ease: "outExpo" });
      card.classList.remove("is-tilting");
    });
  }

  initSignalLab();
  playHeroIntro();
  document.querySelectorAll("main > section:not(.hero), .preview, .featured").forEach(reveal);
  document.querySelectorAll(".case-card").forEach(addCardMotion);

  const projectList = document.querySelector("[data-project-list]");
  if (projectList) {
    new MutationObserver((mutations) => mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.matches(".case-card")) addCardMotion(node);
      });
    })).observe(projectList, { childList: true });
  }

  const companion = document.createElement("button");
  companion.className = "cow-companion";
  companion.type = "button";
  companion.setAttribute("aria-label", "Ask the field assistant for a signal");
  companion.innerHTML = `<img src="${asset("assets/images/cow.png")}" alt="">`;

  const message = document.createElement("div");
  message.className = "cow-message";
  message.setAttribute("role", "status");
  message.setAttribute("aria-live", "polite");
  const messages = [
    "Signal acquired. Keep building.",
    "Cow-approved system boundary.",
    "Prototype honestly. Iterate loudly.",
    "Useful beats impressive.",
    "Moo is a valid debugging strategy."
  ];
  let messageIndex = -1;
  let messageTimer;
  companion.addEventListener("click", () => {
    messageIndex = (messageIndex + 1) % messages.length;
    message.textContent = messages[messageIndex];
    message.classList.add("is-visible");
    if (!reducedMotion.matches) {
      animate(companion, {
        scale: [1, 1.22, 0.94, 1],
        rotate: [0, -12, 7, 0],
        duration: 620,
        ease: "outElastic(1, .55)"
      });
      animate(message, { opacity: [0, 1], y: [8, 0], duration: 360, ease: "outExpo" });
    }
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => {
      message.classList.remove("is-visible");
      if (!reducedMotion.matches) animate(message, { opacity: 0, y: -5, duration: 220, ease: "inQuad" });
    }, 3200);
  });
  document.body.append(message, companion);

  if (!reducedMotion.matches) {
    const wipe = document.createElement("div");
    wipe.className = "page-wipe";
    wipe.setAttribute("aria-hidden", "true");
    document.body.append(wipe);
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || link.target === "_blank" || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || (destination.pathname === window.location.pathname && destination.hash)) return;
      event.preventDefault();
      wipe.style.pointerEvents = "auto";
      animate(wipe, {
        clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
        duration: 380,
        ease: "inOutQuart",
        onComplete: () => { window.location.href = destination.href; }
      });
    });
  }
})();
