/**
 * Motion direction powered by Anime.js 4.
 * The page remains fully readable if JavaScript is unavailable and respects the
 * visitor's reduced-motion preference.
 */
(() => {
  const { animate, createTimeline, engine, stagger, steps, utils } = window.anime || {};
  if (!animate || !createTimeline || !stagger || !utils) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const script = document.currentScript;
  const siteRoot = script ? new URL("../", script.src) : new URL("../", window.location.href);
  const asset = (path) => new URL(path, siteRoot).href;

  document.body.classList.add("coolness-ready");

  function initAccessibilityPanel() {
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem("portfolio-settings") || "{}"); }
      catch { return {}; }
    })();
    const apply = (settings) => {
      document.body.dataset.intensity = settings.intensity || "dynamic";
      document.body.classList.toggle("user-high-contrast", Boolean(settings.contrast));
      document.body.classList.toggle("user-large-text", Boolean(settings.largeText));
      document.body.classList.toggle("user-no-texture", Boolean(settings.noTexture));
      document.body.classList.toggle("user-no-trails", Boolean(settings.noTrails));
      document.body.classList.toggle("motion-paused", Boolean(settings.paused));
      if (settings.paused) engine?.pause(); else engine?.resume();
    };
    apply(saved);

    const panel = document.createElement("details");
    panel.className = "experience-panel";
    panel.innerHTML = `
      <summary aria-label="Open display and accessibility settings">FX <span>Settings</span></summary>
      <form>
        <strong>Experience controls</strong>
        <label>Motion intensity
          <select name="intensity">
            <option value="calm">Calm</option>
            <option value="dynamic">Dynamic</option>
            <option value="maximum">Maximum</option>
          </select>
        </label>
        <label><input type="checkbox" name="contrast"> Higher contrast</label>
        <label><input type="checkbox" name="largeText"> Larger body text</label>
        <label><input type="checkbox" name="noTexture"> Disable texture jitter</label>
        <label><input type="checkbox" name="noTrails"> Disable pointer trails</label>
        <label><input type="checkbox" name="paused"> Pause all motion</label>
        <small>Saved on this device.</small>
      </form>`;
    const form = panel.querySelector("form");
    form.elements.intensity.value = saved.intensity || "dynamic";
    ["contrast", "largeText", "noTexture", "noTrails", "paused"].forEach((name) => {
      form.elements[name].checked = Boolean(saved[name]);
    });
    form.addEventListener("change", () => {
      const settings = {
        intensity: form.elements.intensity.value,
        contrast: form.elements.contrast.checked,
        largeText: form.elements.largeText.checked,
        noTexture: form.elements.noTexture.checked,
        noTrails: form.elements.noTrails.checked,
        paused: form.elements.paused.checked
      };
      try { localStorage.setItem("portfolio-settings", JSON.stringify(settings)); } catch {}
      apply(settings);
    });
    document.body.append(panel);
  }
  initAccessibilityPanel();

  const progressRail = document.createElement("div");
  progressRail.className = "signal-progress";
  progressRail.setAttribute("aria-hidden", "true");
  progressRail.innerHTML = "<span></span><i></i>";
  document.body.append(progressRail);
  const progressFill = progressRail.querySelector("span");
  const progressMarker = progressRail.querySelector("i");
  let progressFrame;
  const updateProgress = () => {
    progressFrame = null;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressFill.style.transform = `scaleY(${progress})`;
    progressMarker.style.transform = `translateY(${progress * Math.max(0, window.innerHeight - 34)}px)`;
  };
  window.addEventListener("scroll", () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();

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
      const targetTitle = {
        "Backend systems": "Ambient Dashboard",
        "Computer vision": "Gesture-Reactive Avatar",
        "Geospatial data": "Solar System Missions",
        "Human workflows": "HandwritingConverter"
      }[node.dataset.signal];
      const heading = [...document.querySelectorAll("h3")].find((item) => item.textContent.trim() === targetTitle);
      heading?.closest("article")?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
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

  function initKineticType() {
    document.querySelectorAll("h1, .section-heading h2, .home-contact h2, .page-intro h1, .contact-intro h1").forEach((heading) => {
      if (heading.dataset.kineticReady === "true") return;
      const label = heading.textContent.trim();
      const words = label.split(/\s+/);
      heading.textContent = "";
      heading.classList.add("kinetic-heading");
      heading.dataset.kineticReady = "true";
      heading.setAttribute("aria-label", label);
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.className = "kinetic-word";
        span.textContent = word;
        span.setAttribute("aria-hidden", "true");
        heading.append(span);
        if (index < words.length - 1) heading.append(document.createTextNode(" "));
        if (!reducedMotion.matches && finePointer.matches) {
          span.addEventListener("pointerenter", () => animate(span, {
            scaleY: [1, 1.12],
            scaleX: [1, 0.94],
            fontVariationSettings: ['"wght" 540', '"wght" 820'],
            color: "var(--rust)",
            duration: 420,
            ease: "outExpo"
          }));
          span.addEventListener("pointerleave", () => animate(span, {
            scaleX: 1,
            scaleY: 1,
            fontVariationSettings: '"wght" 540',
            color: "var(--text)",
            duration: 650,
            ease: "outElastic(1, .5)"
          }));
        }
      });
    });
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
      if (element.matches("main > section") && !element.matches(".hero")) {
        utils.set(element, { clipPath: "polygon(0 47%, 18% 49%, 35% 47%, 54% 51%, 73% 48%, 100% 50%, 100% 52%, 0 53%)" });
        animate(element, {
          clipPath: [
            "polygon(0 47%, 18% 49%, 35% 47%, 54% 51%, 73% 48%, 100% 50%, 100% 52%, 0 53%)",
            "polygon(0 0, 18% 2%, 35% 0, 54% 3%, 73% 0, 100% 2%, 100% 100%, 0 98%)"
          ],
          duration: 720,
          ease: "inOutExpo"
        });
      }
      animate(children.length ? children : element, {
        opacity: [0, 1],
        x: (_, index) => [index % 2 ? "7rem" : "-7rem", 0],
        y: ["1.5rem", 0],
        rotate: (_, index) => [index % 2 ? "5deg" : "-5deg", "0deg"],
        duration: 820,
        delay: stagger(60, { from: "center" }),
        ease: "outElastic(1, .48)"
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

  const sceneMarkup = {
    "Solar System Missions": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><circle class="scene-faint" cx="160" cy="110" r="72"/><ellipse class="scene-line scene-dash scene-orbit" cx="160" cy="110" rx="125" ry="50"/><circle class="scene-fill" cx="160" cy="110" r="25"/><circle class="scene-dot" cx="276" cy="92" r="6"/><path class="scene-line" d="M35 174C91 125 199 184 285 55"/></svg>`,
    "Gesture-Reactive Avatar": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><path class="scene-line" d="M107 76l-24-29 42 14M213 76l24-29-42 14M96 95c0-44 128-44 128 0v45c0 52-128 52-128 0z"/><g class="scene-blink"><path class="scene-line" d="M119 113q14-12 28 0M173 113q14-12 28 0"/></g><path class="scene-line" d="M136 151q24 18 48 0"/></svg>`,
    "Ambient Dashboard": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><rect class="scene-paper" x="38" y="38" width="244" height="144" rx="10"/><path class="scene-faint" d="M38 70h244M126 70v112"/><circle class="scene-fill scene-wave" cx="81" cy="123" r="27"/><path class="scene-line" d="M151 101h92M151 122h68M151 143h81"/></svg>`,
    "HandwritingConverter": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><rect class="scene-paper" x="56" y="35" width="94" height="145" rx="4" transform="rotate(-5 103 107)"/><rect class="scene-paper" x="169" y="35" width="94" height="145" rx="4" transform="rotate(4 216 107)"/><path class="scene-line" d="M74 78q19-22 42 2t19-4M72 103q25 15 60-3M184 76h60M184 96h47M184 116h56M184 136h39"/><path class="scene-line scene-scan" d="M45 109h230"/></svg>`,
    "VoxNav": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><g class="scene-wave"><path class="scene-line" d="M31 110h24l9-42 16 86 15-64 13 39 15-74 18 108 17-83 15 51 12-21h29"/></g><rect class="scene-paper" x="210" y="61" width="82" height="98" rx="5"/><path class="scene-line" d="M223 84h48M223 105h35M223 126h44"/></svg>`,
    "Yoga Pose Match": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><g class="scene-limb"><circle class="scene-fill" cx="160" cy="48" r="18"/><path class="scene-line" d="M160 66v55M160 82l-69 35M160 82l68 33M160 121l-48 66M160 121l48 66"/></g><path class="scene-faint scene-dash" d="M76 201h168M63 30v171M257 30v171"/></svg>`
  };

  function hydrateProjectScene(card) {
    if (card.dataset.sceneReady === "true") return;
    const title = card.querySelector("h2")?.textContent?.trim();
    const visual = card.querySelector(".case-visual");
    if (!visual || !sceneMarkup[title]) return;
    const svg = new DOMParser().parseFromString(sceneMarkup[title], "image/svg+xml").documentElement;
    visual.append(document.importNode(svg, true));
    visual.classList.add("has-scene");
    card.dataset.sceneReady = "true";
  }

  const sceneObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrateProjectScene(entry.target);
        sceneObserver.unobserve(entry.target);
      }), { rootMargin: "320px 0px" })
    : null;
  function queueProjectScene(card) {
    if (sceneObserver) sceneObserver.observe(card);
    else hydrateProjectScene(card);
  }

  function initComicMotion() {
    if (reducedMotion.matches) return;
    const noise = document.createElement("div");
    noise.className = "kinetic-noise";
    document.body.append(noise);
    animate(noise, {
      x: () => `${Math.random() * 4 - 2}px`,
      y: () => `${Math.random() * 4 - 2}px`,
      duration: 100,
      loop: true,
      ease: steps(3)
    });
    document.querySelectorAll(".mobile-nav").forEach((menu) => {
      menu.addEventListener("toggle", () => {
        if (!menu.open) return;
        const links = menu.querySelectorAll("a");
        utils.set(links, { opacity: 0, x: "2.5rem", skewX: "-10deg" });
        animate(links, { opacity: [0, 1], x: ["2.5rem", 0], skewX: ["-10deg", 0], delay: stagger(45), duration: 520, ease: "outElastic(1, .62)" });
      });
    });

    const burst = (x, y) => {
      const impact = document.createElement("span");
      impact.className = "click-impact";
      impact.style.left = `${x}px`;
      impact.style.top = `${y}px`;
      for (let index = 0; index < 10; index += 1) {
        const ray = document.createElement("i");
        ray.style.setProperty("--ray-angle", `${index * 36}deg`);
        impact.append(ray);
      }
      document.body.append(impact);
      animate(impact.querySelectorAll("i"), { scaleX: [0, 1], opacity: [1, 0], delay: stagger(12), duration: 520, ease: "outExpo", onComplete: () => impact.remove() });
    };
    document.addEventListener("pointerdown", (event) => burst(event.clientX, event.clientY), { passive: true });

    if (!finePointer.matches) return;
    const field = document.createElement("div");
    field.className = "action-field";
    const lines = Array.from({ length: 7 }, () => {
      const line = document.createElement("i");
      field.append(line);
      return line;
    });
    document.body.append(field);
    let lastX = 0;
    let lastY = 0;
    let lineIndex = 0;
    document.addEventListener("pointermove", (event) => {
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const speed = Math.hypot(dx, dy);
      lastX = event.clientX;
      lastY = event.clientY;
      if (speed < 12) return;
      const line = lines[lineIndex++ % lines.length];
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      line.style.left = `${event.clientX}px`;
      line.style.top = `${event.clientY}px`;
      line.style.width = `${Math.min(150, 24 + speed * 1.35)}px`;
      line.style.transform = `rotate(${angle}deg) translateX(-100%)`;
      animate(line, { opacity: [0.72, 0], scaleX: [1, 0.15], duration: 430, ease: "outExpo" });
    }, { passive: true });
  }

  function connectEditorialElements() {
    document.querySelectorAll(".preview, .contact-card, .note-stack span, .method-grid li").forEach((element, index) => {
      element.classList.add("signal-surface");
      element.style.setProperty("--signal-index", String(index + 1).padStart(2, "0"));
    });

    document.querySelectorAll(".button, .text-link, .desktop-nav a").forEach((element) => {
      if (reducedMotion.matches || !finePointer.matches) return;
      element.addEventListener("pointerenter", () => {
        animate(element, {
          scale: [1, 1.25, 1.08],
          rotate: [0, -2, 0],
          boxShadow: ["0 0 0 var(--ink)", ".42rem .42rem 0 var(--ink)"],
          duration: 460,
          ease: "outElastic(1, .3)"
        });
      });
      element.addEventListener("pointermove", (event) => {
        const bounds = element.getBoundingClientRect();
        animate(element, {
          x: (event.clientX - bounds.left - bounds.width / 2) * 0.12,
          y: (event.clientY - bounds.top - bounds.height / 2) * 0.18,
          duration: 350,
          ease: "outExpo"
        });
      });
      element.addEventListener("pointerleave", () => animate(element, { x: 0, y: 0, duration: 700, ease: "outElastic(1, .45)" }));
    });

    const notes = document.querySelectorAll(".note-stack span");
    if (notes.length && !reducedMotion.matches) {
      animate(notes, {
        x: [18, 0],
        rotate: (_, index) => index % 2 ? [5, 1.5] : [-5, -1],
        opacity: [0, 1],
        delay: stagger(130),
        duration: 850,
        ease: "outExpo"
      });
    }
  }

  function initProjectFilters() {
    const list = document.querySelector("[data-project-list]");
    if (!list || list.dataset.filtersReady === "true" || !list.children.length) return;
    list.dataset.filtersReady = "true";
    const groups = {
      all: [],
      vision: ["Gesture-Reactive Avatar", "HandwritingConverter", "Yoga Pose Match"],
      systems: ["Solar System Missions", "VoxNav"],
      interfaces: ["Ambient Dashboard"]
    };
    const controls = document.createElement("div");
    controls.className = "project-filters";
    controls.setAttribute("aria-label", "Filter projects");
    const status = document.createElement("span");
    status.className = "visually-hidden";
    status.setAttribute("role", "status");
    Object.keys(groups).forEach((group, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = group;
      button.dataset.filter = group;
      button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      button.addEventListener("click", () => {
        controls.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        let visible = 0;
        [...list.children].forEach((card, cardIndex) => {
          const title = card.querySelector("h2")?.textContent.trim();
          const show = group === "all" || groups[group].includes(title);
          card.hidden = !show;
          if (show) {
            visible += 1;
            animate(card, { opacity: [0, 1], x: [cardIndex % 2 ? 55 : -55, 0], rotate: [cardIndex % 2 ? 2 : -2, 0], delay: visible * 45, duration: 650, ease: "outElastic(1, .5)" });
          }
        });
        status.textContent = `${visible} projects shown in ${group}.`;
      });
      controls.append(button);
    });
    controls.append(status);
    list.before(controls);
  }

  function initPageSignatures() {
    const mascot = document.querySelector(".contact-mascot");
    if (mascot) {
      const signal = document.createElement("div");
      signal.className = "contact-signal";
      signal.setAttribute("aria-hidden", "true");
      signal.innerHTML = "<i></i><i></i><i></i><span>CHANNEL OPEN</span>";
      mascot.append(signal);
    }
    const writing = document.querySelector(".coming-soon");
    if (writing) {
      const stamp = document.createElement("span");
      stamp.className = "archive-stamp";
      stamp.textContent = "IN PROGRESS";
      stamp.setAttribute("aria-hidden", "true");
      writing.append(stamp);
      if (!reducedMotion.matches) animate(stamp, { scale: [2.4, .88, 1], rotate: [-12, 4, -3], opacity: [0, 1], duration: 800, ease: "outElastic(1, .45)" });
    }
  }

  initKineticType();
  initSignalLab();
  playHeroIntro();
  document.querySelectorAll("main > section:not(.hero), .preview, .featured").forEach(reveal);
  connectEditorialElements();
  initComicMotion();
  initPageSignatures();
  document.querySelectorAll(".case-card").forEach((card) => {
    queueProjectScene(card);
    addCardMotion(card);
  });
  initProjectFilters();

  const projectList = document.querySelector("[data-project-list]");
  if (projectList) {
    new MutationObserver((mutations) => mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.matches(".case-card")) {
          queueProjectScene(node);
          addCardMotion(node);
          initProjectFilters();
        }
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
  let cowClicks = 0;
  companion.addEventListener("click", () => {
    cowClicks += 1;
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
    if (cowClicks === 5) {
      document.body.classList.add("cow-mode");
      message.textContent = "SECRET HERD MODE UNLOCKED.";
      message.classList.add("is-visible");
      const herd = Array.from({ length: 9 }, (_, index) => {
        const particle = document.createElement("span");
        particle.className = "cow-particle";
        particle.textContent = index % 3 === 0 ? "MOO!" : "★";
        document.body.append(particle);
        return particle;
      });
      animate(herd, {
        x: (_, index) => `${(index - 4) * 11}vw`,
        y: () => `${-35 - Math.random() * 45}vh`,
        rotate: () => `${Math.random() * 180 - 90}deg`,
        scale: [0, 1.2, 0],
        opacity: [0, 1, 0],
        delay: stagger(45, { from: "center" }),
        duration: 1500,
        ease: "outExpo",
        onComplete: () => herd.forEach((particle) => particle.remove())
      });
    }
  });
  document.body.append(message, companion);

  if (!reducedMotion.matches) {
    const wipe = document.createElement("div");
    wipe.className = "page-wipe";
    wipe.setAttribute("aria-hidden", "true");
    wipe.innerHTML = "<span></span><span></span><span></span><b>SHIFT / NEXT PANEL</b>";
    document.body.append(wipe);
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || link.target === "_blank" || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || (destination.pathname === window.location.pathname && destination.hash)) return;
      event.preventDefault();
      wipe.style.pointerEvents = "auto";
      const panels = wipe.querySelectorAll("span");
      utils.set(panels, { x: (_, index) => index === 2 ? "600%" : "-600%" });
      animate(panels, { x: "0%", skewX: ["-12deg", "0deg"], delay: stagger(45), duration: 380, ease: "inExpo" });
      animate(wipe.querySelector("b"), {
        opacity: [0, 1], scale: [1.6, 1], rotate: [-4, 0], duration: 300, delay: 160, ease: "outElastic(1, .65)",
        onComplete: () => { window.location.href = destination.href; }
      });
    });
  }
})();
