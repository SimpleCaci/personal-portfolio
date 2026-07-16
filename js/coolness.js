(() => {
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
    const label = document.createElement("span");
    label.className = "map-label";
    label.textContent = "SIGNAL ACQUIRED";
    map.append(route, label);
    if (!reducedMotion.matches && finePointer.matches) {
      map.closest(".hero-card")?.addEventListener("pointermove", (event) => {
        const card = event.currentTarget;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--field-tilt-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 4}deg`);
        card.style.setProperty("--field-tilt-y", `${((event.clientY - bounds.top) / bounds.height - .5) * -4}deg`);
      });
    }
  }

  const sceneMarkup = {
    "Solar System Missions": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><circle class="scene-faint" cx="160" cy="110" r="72"/><ellipse class="scene-line scene-dash scene-orbit" cx="160" cy="110" rx="125" ry="50"/><circle class="scene-fill" cx="160" cy="110" r="25"/><circle class="scene-dot" cx="276" cy="92" r="6"/><path class="scene-line" d="M35 174C91 125 199 184 285 55"/></svg>`,
    "Gesture-Reactive Avatar": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><path class="scene-line" d="M107 76l-24-29 42 14M213 76l24-29-42 14M96 95c0-44 128-44 128 0v45c0 52-128 52-128 0z"/><g class="scene-blink"><path class="scene-line" d="M119 113q14-12 28 0M173 113q14-12 28 0"/></g><path class="scene-line" d="M136 151q24 18 48 0"/><g class="scene-faint"><circle cx="119" cy="113" r="4"/><circle cx="201" cy="113" r="4"/><circle cx="160" cy="132" r="4"/></g></svg>`,
    "Ambient Dashboard": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><rect class="scene-paper" x="38" y="38" width="244" height="144" rx="10"/><path class="scene-faint" d="M38 70h244M126 70v112"/><circle class="scene-fill scene-wave" cx="81" cy="123" r="27"/><path class="scene-line" d="M151 101h92M151 122h68M151 143h81"/><circle class="scene-dot" cx="263" cy="54" r="4"/></svg>`,
    "HandwritingConverter": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><rect class="scene-paper" x="56" y="35" width="94" height="145" rx="4" transform="rotate(-5 103 107)"/><rect class="scene-paper" x="169" y="35" width="94" height="145" rx="4" transform="rotate(4 216 107)"/><path class="scene-line" d="M74 78q19-22 42 2t19-4M72 103q25 15 60-3M184 76h60M184 96h47M184 116h56M184 136h39"/><path class="scene-line scene-scan" d="M45 109h230"/></svg>`,
    "VoxNav": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><g class="scene-wave"><path class="scene-line" d="M31 110h24l9-42 16 86 15-64 13 39 15-74 18 108 17-83 15 51 12-21h29"/></g><rect class="scene-paper" x="210" y="61" width="82" height="98" rx="5"/><path class="scene-line" d="M223 84h48M223 105h35M223 126h44"/><circle class="scene-dot scene-blink" cx="279" cy="144" r="5"/></svg>`,
    "Yoga Pose Match": `<svg class="project-scene" viewBox="0 0 320 220" aria-hidden="true"><g class="scene-limb"><circle class="scene-fill" cx="160" cy="48" r="18"/><path class="scene-line" d="M160 66v55M160 82l-69 35M160 82l68 33M160 121l-48 66M160 121l48 66"/></g><path class="scene-faint scene-dash" d="M76 201h168M63 30v171M257 30v171"/><circle class="scene-dot" cx="91" cy="117" r="5"/><circle class="scene-dot" cx="228" cy="115" r="5"/></svg>`
  };

  function hydrateScene(card) {
    if (card.dataset.sceneReady === "true") return;
    const title = card.querySelector("h2")?.textContent?.trim();
    const markup = sceneMarkup[title];
    const visual = card.querySelector(".case-visual");
    if (!markup || !visual) return;
    const documentFragment = new DOMParser().parseFromString(markup, "image/svg+xml").documentElement;
    visual.append(document.importNode(documentFragment, true));
    visual.classList.add("has-scene");
    card.dataset.sceneReady = "true";
  }

  function enhanceCard(card) {
    hydrateScene(card);
    card.classList.add("cool-reveal");
    reveal(card);
    if (reducedMotion.matches || !finePointer.matches) return;
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--card-tilt-y", `${((event.clientX - bounds.left) / bounds.width - .5) * 2.6}deg`);
      card.style.setProperty("--card-tilt-x", `${((event.clientY - bounds.top) / bounds.height - .5) * -2.6}deg`);
      card.classList.add("is-tilting");
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--card-tilt-x");
      card.style.removeProperty("--card-tilt-y");
      card.classList.remove("is-tilting");
    });
  }

  let observer;
  function reveal(element) {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      element.classList.add("is-revealed");
      return;
    }
    observer ||= new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -5%" });
    observer.observe(element);
  }

  document.querySelectorAll("main > section, .preview, .featured").forEach((element) => {
    element.classList.add("cool-reveal");
    reveal(element);
  });
  document.querySelectorAll(".case-card").forEach(enhanceCard);
  const projectList = document.querySelector("[data-project-list]");
  if (projectList) {
    new MutationObserver((mutations) => mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement && node.matches(".case-card")) enhanceCard(node);
    }))).observe(projectList, { childList: true });
  }

  const companion = document.createElement("button");
  companion.className = "cow-companion";
  companion.type = "button";
  companion.setAttribute("aria-label", "Ask the field assistant for a signal");
  const cow = document.createElement("img");
  cow.src = asset("assets/images/cow.png");
  cow.alt = "";
  companion.append(cow);
  const message = document.createElement("div");
  message.className = "cow-message";
  message.setAttribute("role", "status");
  message.setAttribute("aria-live", "polite");
  const messages = ["Signal acquired. Keep building.", "Cow-approved system boundary.", "Prototype honestly. Iterate loudly.", "Useful beats impressive.", "Moo is a valid debugging strategy."];
  let messageIndex = -1;
  let messageTimer;
  companion.addEventListener("click", () => {
    messageIndex = (messageIndex + 1) % messages.length;
    message.textContent = messages[messageIndex];
    message.classList.add("is-visible");
    companion.classList.remove("is-signaling");
    requestAnimationFrame(() => companion.classList.add("is-signaling"));
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => message.classList.remove("is-visible"), 3200);
  });
  document.body.append(message, companion);

  if (!reducedMotion.matches && finePointer.matches) {
    const trail = document.createElement("div");
    trail.className = "cow-trail";
    const image = document.createElement("img");
    image.src = asset("assets/images/cow.png");
    image.alt = "";
    trail.append(image);
    document.body.append(trail);
    let targetX = -80, targetY = -80, x = targetX, y = targetY, rotation = 0, frame;
    const tick = () => {
      x += (targetX - x) * .18;
      y += (targetY - y) * .18;
      rotation += ((targetX - x) * .12 - rotation) * .12;
      trail.style.transform = `translate3d(${x + 15}px, ${y + 18}px, 0) rotate(${rotation}deg)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > .6) frame = requestAnimationFrame(tick);
      else frame = null;
    };
    document.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      trail.classList.add("is-active");
      if (!frame) frame = requestAnimationFrame(tick);
    }, { passive: true });
    document.addEventListener("pointerleave", () => trail.classList.remove("is-active"));
    document.addEventListener("visibilitychange", () => { if (document.hidden && frame) { cancelAnimationFrame(frame); frame = null; } });
  }

  if (!reducedMotion.matches) {
    const wipe = document.createElement("div");
    wipe.className = "page-wipe";
    wipe.setAttribute("aria-hidden", "true");
    document.body.append(wipe);
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || link.target === "_blank" || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname && destination.hash) return;
      event.preventDefault();
      wipe.classList.add("is-active");
      setTimeout(() => { window.location.href = destination.href; }, 260);
    });
  }
})();
