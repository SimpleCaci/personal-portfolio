(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const body = document.body;

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    })[character]);

  function setupNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    const header = document.querySelector("[data-header]");
    if (!toggle || !links || !header) return;

    const closeNavigation = () => {
      toggle.setAttribute("aria-expanded", "false");
      links.classList.remove("is-open");
      body.classList.remove("nav-open");
    };

    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      links.classList.toggle("is-open", willOpen);
      body.classList.toggle("nav-open", willOpen);
    });

    links.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavigation();
    });

    let previousY = window.scrollY;
    window.addEventListener("scroll", () => {
      const currentY = window.scrollY;
      const movingDown = currentY > previousY;
      header.classList.toggle("is-hidden", movingDown && currentY > 240 && !links.classList.contains("is-open"));
      previousY = currentY;
    }, { passive: true });
  }

  function setupRotatingWord() {
    const word = document.getElementById("rotating-word");
    if (!word || prefersReducedMotion.matches) return;

    const words = [
      "useful systems.",
      "clear feedback.",
      "working tools.",
      "strange little experiments.",
    ];
    let index = 0;

    window.setInterval(() => {
      word.classList.add("is-switching");
      window.setTimeout(() => {
        index = (index + 1) % words.length;
        word.textContent = words[index];
      }, 170);
      window.setTimeout(() => word.classList.remove("is-switching"), 380);
    }, 3100);
  }

  function setupReveal() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) return;

    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });

    revealItems.forEach((item) => observer.observe(item));
  }

  function setupSky() {
    const canvas = document.getElementById("sky-canvas");
    if (!canvas || prefersReducedMotion.matches) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const pointer = { x: 0.5, y: 0.35, active: false };
    let width = 0;
    let height = 0;
    let ratio = 1;
    let animationFrame = 0;
    let particles = [];
    let running = true;

    const makeParticle = (index, total) => ({
      x: (index * 97.3 % total) / total,
      y: (index * 53.7 % total) / total,
      radius: 0.6 + ((index * 19) % 14) / 10,
      speed: 0.00008 + ((index * 7) % 8) / 90000,
      drift: ((index % 2 ? 1 : -1) * (0.00002 + (index % 5) / 100000)),
      alpha: 0.14 + (index % 6) * 0.055,
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(110, Math.max(42, Math.round((width * height) / 17000)));
      particles = Array.from({ length: count }, (_, index) => makeParticle(index + 1, count));
    };

    const drawCloud = (x, y, scale, alpha) => {
      context.save();
      context.translate(x, y);
      context.scale(scale, scale);
      context.globalAlpha = alpha;
      context.fillStyle = "#ffffff";
      [
        [-42, 9, 34],
        [-12, -2, 46],
        [26, 7, 35],
        [58, 14, 25],
        [8, 25, 62],
      ].forEach(([cx, cy, radius]) => {
        context.beginPath();
        context.arc(cx, cy, radius, 0, Math.PI * 2);
        context.fill();
      });
      context.restore();
    };

    const render = (time) => {
      if (!running) return;
      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(255,255,255,0.14)");
      gradient.addColorStop(0.62, "rgba(111,99,255,0.035)");
      gradient.addColorStop(1, "rgba(17,24,47,0.04)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      const px = pointer.active ? (pointer.x - 0.5) * 24 : 0;
      const py = pointer.active ? (pointer.y - 0.5) * 18 : 0;
      drawCloud(width * 0.1 + Math.sin(time / 22000) * 30 - px, height * 0.18 - py, 1.5, 0.11);
      drawCloud(width * 0.86 + Math.cos(time / 26000) * 40 - px * 0.6, height * 0.34 - py * 0.5, 1.1, 0.09);
      drawCloud(width * 0.45 + Math.sin(time / 30000) * 55, height * 0.84, 1.8, 0.06);

      particles.forEach((particle) => {
        particle.y -= particle.speed * 16;
        particle.x += particle.drift * 16;
        if (particle.y < -0.02) particle.y = 1.02;
        if (particle.x < -0.02) particle.x = 1.02;
        if (particle.x > 1.02) particle.x = -0.02;

        const x = particle.x * width + px * particle.radius * 0.28;
        const y = particle.y * height + py * particle.radius * 0.22;
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(17,24,47,${particle.alpha})`;
        context.fill();
      });

      animationFrame = window.requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX / Math.max(1, width);
      pointer.y = event.clientY / Math.max(1, height);
      pointer.active = true;
    }, { passive: true });
    document.addEventListener("pointerleave", () => { pointer.active = false; });

    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) animationFrame = window.requestAnimationFrame(render);
      else window.cancelAnimationFrame(animationFrame);
    });

    resize();
    animationFrame = window.requestAnimationFrame(render);
  }

  function setupPlayground() {
    const playground = document.getElementById("hero-playground");
    const cow = document.getElementById("field-cow");
    const message = document.getElementById("cow-message");
    const coordinates = document.getElementById("cow-coordinates");
    if (!playground || !cow || !message || !coordinates) return;

    const messages = [
      "cow systems nominal.",
      "moo. ship the useful part.",
      "field test passed. probably.",
      "the cow has no deployment link either.",
      "product manager says: needs more grass.",
      "unexpected input. excellent.",
    ];

    let cowX = 0;
    let cowY = 0;
    let originX = 0;
    let originY = 0;
    let startX = 0;
    let startY = 0;
    let distance = 0;
    let dragged = false;

    const updateCow = () => {
      cow.style.setProperty("--cow-x", `${cowX}px`);
      cow.style.setProperty("--cow-y", `${cowY}px`);
      const box = playground.getBoundingClientRect();
      const xPercent = Math.round(((cow.offsetLeft + cowX + cow.offsetWidth / 2) / Math.max(1, box.width)) * 100);
      const yPercent = Math.round(((cow.offsetTop + cowY + cow.offsetHeight / 2) / Math.max(1, box.height)) * 100);
      coordinates.textContent = `X ${Math.max(0, Math.min(99, xPercent))} / Y ${Math.max(0, Math.min(99, yPercent))}`;
    };

    const saySomething = () => {
      const current = message.textContent;
      const choices = messages.filter((item) => item !== current);
      message.textContent = choices[Math.floor(Math.random() * choices.length)];
      if (!prefersReducedMotion.matches) cow.animate(
        [
          { transform: `translate(${cowX}px, ${cowY}px) rotate(-5deg) scale(1)` },
          { transform: `translate(${cowX}px, ${cowY - 8}px) rotate(-2deg) scale(1.04)` },
          { transform: `translate(${cowX}px, ${cowY}px) rotate(-5deg) scale(1)` },
        ],
        { duration: 360, easing: "ease-out" },
      );
    };

    cow.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      cow.setPointerCapture(event.pointerId);
      cow.classList.add("is-dragging");
      originX = cowX;
      originY = cowY;
      startX = event.clientX;
      startY = event.clientY;
      distance = 0;
      dragged = false;
    });

    cow.addEventListener("pointermove", (event) => {
      if (!cow.hasPointerCapture(event.pointerId)) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      distance = Math.hypot(deltaX, deltaY);
      dragged = distance > 6;

      const playgroundBox = playground.getBoundingClientRect();
      const cowBox = cow.getBoundingClientRect();
      const horizontalLimit = Math.max(20, playgroundBox.width - cowBox.width * 0.56);
      const verticalLimit = Math.max(30, playgroundBox.height - cowBox.height * 0.64);
      cowX = Math.max(-horizontalLimit * 0.75, Math.min(horizontalLimit * 0.28, originX + deltaX));
      cowY = Math.max(-verticalLimit * 0.62, Math.min(verticalLimit * 0.22, originY + deltaY));
      updateCow();
    });

    const finishDrag = (event) => {
      if (cow.hasPointerCapture(event.pointerId)) cow.releasePointerCapture(event.pointerId);
      cow.classList.remove("is-dragging");
      if (dragged) {
        message.textContent = distance > 180 ? "long-range cow transport complete." : "cow repositioned successfully.";
      }
    };

    cow.addEventListener("pointerup", finishDrag);
    cow.addEventListener("pointercancel", finishDrag);
    cow.addEventListener("click", (event) => {
      if (dragged) {
        event.preventDefault();
        dragged = false;
        return;
      }
      saySomething();
    });

    if (!prefersReducedMotion.matches) {
      playground.addEventListener("pointermove", (event) => {
        const bounds = playground.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * -12;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
        const scene = playground.querySelector(".orbit-scene");
        if (scene) {
          scene.style.setProperty("--scene-x", `${x}px`);
          scene.style.setProperty("--scene-y", `${y}px`);
        }
      });
    }

    updateCow();
  }

  function setupPullCord() {
    const cord = document.getElementById("pull-cord");
    const wipe = document.getElementById("page-wipe");
    if (!cord || !wipe) return;

    let startY = 0;
    let pull = 0;
    let dragging = false;
    let activated = false;

    const render = () => cord.style.setProperty("--pull", `${pull}px`);

    const returnHome = () => {
      if (wipe.classList.contains("is-wiping")) return;
      wipe.classList.add("is-wiping");
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" }), 420);
      window.setTimeout(() => wipe.classList.remove("is-wiping"), 980);
    };

    cord.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      cord.setPointerCapture(event.pointerId);
      startY = event.clientY;
      dragging = true;
      activated = false;
    });

    cord.addEventListener("pointermove", (event) => {
      if (!dragging || !cord.hasPointerCapture(event.pointerId)) return;
      pull = Math.max(0, Math.min(116, event.clientY - startY));
      render();
      if (pull >= 92 && !activated) {
        activated = true;
        returnHome();
      }
    });

    const release = (event) => {
      dragging = false;
      if (cord.hasPointerCapture(event.pointerId)) cord.releasePointerCapture(event.pointerId);
      if (!prefersReducedMotion.matches) cord.animate(
        [{ transform: `translateY(${pull}px)` }, { transform: "translateY(0)" }],
        { duration: 480, easing: "cubic-bezier(.2,.9,.2,1)" },
      );
      pull = 0;
      render();
    };

    cord.addEventListener("pointerup", release);
    cord.addEventListener("pointercancel", release);
    cord.addEventListener("click", () => {
      if (activated) {
        activated = false;
        return;
      }
      returnHome();
    });
  }

  const visuals = {
    turion: `
      <svg viewBox="0 0 720 300" role="img" aria-label="Orbital data visualization">
        <defs><radialGradient id="spaceGlow"><stop offset="0" stop-color="#6f63ff" stop-opacity=".72"/><stop offset="1" stop-color="#11182f" stop-opacity="0"/></radialGradient></defs>
        <rect width="720" height="300" fill="#11182f"/><circle cx="535" cy="118" r="180" fill="url(#spaceGlow)"/>
        <g fill="#fffaf0" opacity=".75"><circle cx="56" cy="45" r="2"/><circle cx="122" cy="88" r="1.5"/><circle cx="210" cy="32" r="2"/><circle cx="310" cy="81" r="1"/><circle cx="660" cy="54" r="2"/><circle cx="628" cy="248" r="1.5"/><circle cx="383" cy="235" r="1.5"/><circle cx="176" cy="250" r="2"/></g>
        <g fill="none" stroke="#a9d8ff" opacity=".72"><ellipse cx="450" cy="150" rx="215" ry="82" transform="rotate(-16 450 150)"/><ellipse cx="450" cy="150" rx="146" ry="124" transform="rotate(34 450 150)" stroke-dasharray="7 8"/></g>
        <circle cx="450" cy="150" r="31" fill="#f6d85d" stroke="#11182f" stroke-width="5"/><path d="M119 220 C245 35 394 276 625 71" fill="none" stroke="#ff6f59" stroke-width="4" stroke-dasharray="10 8"/>
        <g transform="translate(104 196) rotate(-11)"><rect x="-24" y="-15" width="48" height="30" rx="4" fill="#fffaf0" stroke="#11182f" stroke-width="4"/><rect x="-67" y="-11" width="39" height="22" fill="#7e70ff" stroke="#fffaf0" stroke-width="2"/><rect x="28" y="-11" width="39" height="22" fill="#7e70ff" stroke="#fffaf0" stroke-width="2"/></g>
        <text x="31" y="276" fill="#fffaf0" font-family="monospace" font-size="12">JPL HORIZONS // TRAJECTORY TRACE 004</text>
      </svg>`,
    handwriting: `
      <svg viewBox="0 0 720 300" role="img" aria-label="Handwriting moving through an OCR pipeline">
        <rect width="720" height="300" fill="#f5ecdc"/>
        <g transform="translate(38 33) rotate(-3)"><rect width="230" height="226" rx="9" fill="#fffaf0" stroke="#11182f" stroke-width="4"/><g stroke="#b8c7da" stroke-width="2"><path d="M20 55H210"/><path d="M20 87H210"/><path d="M20 119H210"/><path d="M20 151H210"/><path d="M20 183H210"/></g><path d="M29 48c28-29 37 27 66-2s26 23 57-4 25 18 46-3M31 82c33-22 46 20 72-5s41 25 85-3M29 113c37-18 56 25 92-4s43 15 75-2M30 145c48-23 68 18 103-3s40 20 63-5" fill="none" stroke="#263152" stroke-width="5" stroke-linecap="round"/></g>
        <g fill="#ff6f59" stroke="#11182f" stroke-width="2"><circle cx="312" cy="87" r="7"/><circle cx="337" cy="111" r="5"/><circle cx="306" cy="143" r="4"/><circle cx="343" cy="173" r="7"/><circle cx="310" cy="210" r="5"/></g><path d="M287 149H386" stroke="#11182f" stroke-width="4" stroke-dasharray="8 7"/><path d="m376 139 14 10-14 10" fill="none" stroke="#11182f" stroke-width="4"/>
        <g transform="translate(397 42)"><rect width="286" height="210" rx="12" fill="#11182f" stroke="#11182f" stroke-width="4"/><rect x="18" y="18" width="250" height="30" rx="5" fill="#ff8e72"/><text x="30" y="38" fill="#11182f" font-family="monospace" font-size="12">OCR REVIEW // 82% CONF.</text><g fill="#fffaf0" opacity=".82"><rect x="21" y="75" width="222" height="8" rx="4"/><rect x="21" y="99" width="192" height="8" rx="4"/><rect x="21" y="123" width="231" height="8" rx="4"/><rect x="21" y="147" width="161" height="8" rx="4"/><rect x="21" y="185" width="92" height="10" rx="3" fill="#d8f76f"/></g></g>
      </svg>`,
    ambient: `
      <svg viewBox="0 0 720 300" role="img" aria-label="Retro ambient dashboard interface">
        <rect width="720" height="300" fill="#192238"/><circle cx="620" cy="54" r="25" fill="#d8f76f"/><g stroke="#d8f76f" opacity=".23"><path d="M0 254H720"/><path d="M0 224H720"/><path d="M0 194H720"/><path d="M80 0V300"/><path d="M160 0V300"/><path d="M240 0V300"/><path d="M320 0V300"/><path d="M400 0V300"/><path d="M480 0V300"/><path d="M560 0V300"/><path d="M640 0V300"/></g>
        <g transform="translate(35 35)"><rect width="650" height="224" rx="16" fill="#24314b" stroke="#fffaf0" stroke-width="3"/><text x="24" y="38" fill="#d8f76f" font-family="monospace" font-size="14">20:26 // NIGHT BLOOM</text><rect x="24" y="58" width="250" height="136" rx="10" fill="#11182f"/><text x="43" y="88" fill="#fffaf0" font-family="monospace" font-size="11">TODAY'S SIGNALS</text><g fill="#d8f76f"><rect x="43" y="106" width="168" height="9" rx="4"/><rect x="43" y="132" width="121" height="9" rx="4"/><rect x="43" y="158" width="198" height="9" rx="4"/></g><g transform="translate(300 58)"><rect width="150" height="64" rx="9" fill="#6f63ff"/><text x="16" y="28" fill="#fffaf0" font-family="monospace" font-size="10">FOCUS</text><text x="16" y="51" fill="#fffaf0" font-family="monospace" font-size="21">25:00</text><rect x="168" width="150" height="64" rx="9" fill="#ff6f59"/><text x="184" y="28" fill="#11182f" font-family="monospace" font-size="10">SESSIONS</text><text x="184" y="51" fill="#11182f" font-family="monospace" font-size="21">03</text><rect y="82" width="318" height="54" rx="9" fill="#fffaf0"/><circle cx="27" cy="109" r="10" fill="#d8f76f" stroke="#11182f" stroke-width="3"/><rect x="50" y="102" width="222" height="12" rx="6" fill="#a9d8ff"/></g></g>
      </svg>`,
    gesture: `
      <svg viewBox="0 0 720 300" role="img" aria-label="Face landmarks mapped to a cat avatar">
        <rect width="720" height="300" fill="#352743"/><g opacity=".16" stroke="#ffb7cf"><path d="M0 50H720"/><path d="M0 100H720"/><path d="M0 150H720"/><path d="M0 200H720"/><path d="M0 250H720"/></g>
        <g transform="translate(100 34)"><path d="M50 65 22 17l65 28c39-20 80-20 119 0l65-28-28 50c19 23 29 53 29 87 0 68-51 106-111 106S50 222 50 154c0-35 10-65 30-89Z" fill="#ffb7cf" stroke="#11182f" stroke-width="6"/><g fill="#11182f"><ellipse cx="119" cy="130" rx="12" ry="17"/><ellipse cx="202" cy="130" rx="12" ry="17"/><path d="m161 152-13 14h26Z"/><path d="M161 166c-4 22-27 22-35 9M161 166c4 22 27 22 35 9" fill="none" stroke="#11182f" stroke-width="5"/></g><g fill="#d8f76f" stroke="#11182f" stroke-width="2"><circle cx="82" cy="92" r="5"/><circle cx="115" cy="112" r="5"/><circle cx="147" cy="99" r="5"/><circle cx="179" cy="99" r="5"/><circle cx="207" cy="112" r="5"/><circle cx="238" cy="92" r="5"/><circle cx="121" cy="152" r="5"/><circle cx="161" cy="166" r="5"/><circle cx="201" cy="152" r="5"/><circle cx="161" cy="207" r="5"/></g><g fill="none" stroke="#d8f76f" stroke-width="2" opacity=".78"><path d="m82 92 33 20 32-13 32 0 28 13 31-20M121 152l40 14 40-14M161 166v41"/></g></g>
        <path d="M412 150H512" stroke="#fffaf0" stroke-width="4" stroke-dasharray="8 8"/><path d="m502 140 14 10-14 10" fill="none" stroke="#fffaf0" stroke-width="4"/><g transform="translate(532 79)"><rect width="147" height="142" rx="18" fill="#fffaf0" stroke="#11182f" stroke-width="5"/><text x="18" y="31" fill="#11182f" font-family="monospace" font-size="9">REACTION_07</text><text x="73" y="93" text-anchor="middle" font-size="52">:3</text><rect x="24" y="112" width="99" height="9" rx="4" fill="#ffb7cf"/></g>
      </svg>`,
    voxnav: `
      <svg viewBox="0 0 720 300" role="img" aria-label="Voice waveform becoming a safe desktop command">
        <rect width="720" height="300" fill="#0e1930"/><g stroke="#7dd8ff" stroke-width="5" stroke-linecap="round"><path d="M35 150h20l12-42 19 87 21-132 23 171 22-121 20 72 17-35h30" fill="none"/></g>
        <g transform="translate(250 47)"><rect width="435" height="206" rx="14" fill="#fffaf0" stroke="#11182f" stroke-width="5"/><rect width="435" height="38" rx="11" fill="#7dd8ff"/><circle cx="22" cy="19" r="6" fill="#ff6f59"/><circle cx="41" cy="19" r="6" fill="#f6d85d"/><circle cx="60" cy="19" r="6" fill="#d8f76f"/><g font-family="monospace" font-size="11"><text x="21" y="76" fill="#263152">HEARD</text><rect x="92" y="62" width="169" height="21" rx="5" fill="#dceeff"/><text x="103" y="77" fill="#11182f">"move right faster"</text><text x="21" y="117" fill="#263152">MATCHED</text><rect x="92" y="103" width="206" height="21" rx="5" fill="#f1e8ff"/><text x="103" y="118" fill="#11182f">move(direction, speed)</text><text x="21" y="158" fill="#263152">MODE</text><rect x="92" y="144" width="124" height="21" rx="5" fill="#d8f76f"/><text x="103" y="159" fill="#11182f">SAFE PREVIEW</text><text x="21" y="190" fill="#263152">NO DESKTOP ACTION EXECUTED</text></g><g transform="translate(338 76)"><path d="m0 0 50 52-22 4 15 31-18 9-15-31-19 14Z" fill="#ff6f59" stroke="#11182f" stroke-width="4"/></g></g>
      </svg>`,
    rose: `
      <svg viewBox="0 0 720 300" role="img" aria-label="Pose landmarks aligned with a target silhouette">
        <rect width="720" height="300" fill="#ffefb0"/><g opacity=".24" stroke="#11182f"><circle cx="545" cy="150" r="120" fill="none"/><circle cx="545" cy="150" r="88" fill="none"/><circle cx="545" cy="150" r="55" fill="none"/></g>
        <g transform="translate(60 28)"><rect width="220" height="244" rx="17" fill="#fffaf0" stroke="#11182f" stroke-width="5"/><text x="18" y="28" fill="#11182f" font-family="monospace" font-size="9">TARGET // WARRIOR_II</text><g fill="#6f63ff" stroke="#11182f" stroke-width="4"><circle cx="110" cy="63" r="17"/><circle cx="110" cy="101" r="8"/><circle cx="45" cy="110" r="8"/><circle cx="175" cy="110" r="8"/><circle cx="88" cy="153" r="8"/><circle cx="140" cy="153" r="8"/><circle cx="52" cy="210" r="8"/><circle cx="183" cy="209" r="8"/></g><g stroke="#11182f" stroke-width="9" stroke-linecap="round"><path d="M110 80v67M105 102 45 110M115 102l60 8M88 153l-36 57M140 153l43 56"/></g></g>
        <path d="M307 150H395" stroke="#11182f" stroke-width="4" stroke-dasharray="8 8"/><path d="m385 140 14 10-14 10" fill="none" stroke="#11182f" stroke-width="4"/>
        <g transform="translate(430 28)"><rect width="240" height="244" rx="17" fill="#11182f" stroke="#11182f" stroke-width="5"/><text x="18" y="28" fill="#fffaf0" font-family="monospace" font-size="9">LIVE MATCH // HOLD 00:04</text><g fill="#d8f76f"><circle cx="120" cy="63" r="15"/><circle cx="120" cy="101" r="7"/><circle cx="55" cy="110" r="7"/><circle cx="185" cy="110" r="7"/><circle cx="98" cy="153" r="7"/><circle cx="150" cy="153" r="7"/><circle cx="62" cy="210" r="7"/><circle cx="193" cy="209" r="7"/></g><g stroke="#d8f76f" stroke-width="7" stroke-linecap="round"><path d="M120 78v68M115 102l-60 8M125 102l60 8M98 153l-36 57M150 153l43 56"/></g><rect x="30" y="221" width="180" height="9" rx="4" fill="#263152"/><rect x="30" y="221" width="143" height="9" rx="4" fill="#ff6f59"/></g>
      </svg>`,
  };

  function projectCard(project, index) {
    const categories = Array.isArray(project.categories) ? project.categories.join(" ") : "";
    const technology = (project.tech || []).map((item) => `<li>${escapeHTML(item)}</li>`).join("");
    const evidence = (project.evidence || []).map((item) => `<li>${escapeHTML(item)}</li>`).join("");
    const visual = visuals[project.visual] || visuals.ambient;
    const number = String(index + 1).padStart(2, "0");

    return `
      <article class="project-card project-card--${escapeHTML(project.visual)}" data-categories="${escapeHTML(categories)}">
        <div class="project-visual" data-label="${escapeHTML(project.visualLabel)}">${visual}</div>
        <div class="project-card-content">
          <div class="project-topline">
            <span class="project-index">SYSTEM ${number} / 06</span>
            <span class="project-status">${escapeHTML(project.status)}</span>
          </div>
          <h3>${escapeHTML(project.title)}</h3>
          <p class="project-summary">${escapeHTML(project.summary)}</p>
          <div class="system-trace" aria-label="${escapeHTML(project.input)} becomes ${escapeHTML(project.output)} through ${escapeHTML(project.process)}">
            <span>${escapeHTML(project.input)}</span><b aria-hidden="true">→</b>
            <span>${escapeHTML(project.process)}</span><b aria-hidden="true">→</b>
            <span>${escapeHTML(project.output)}</span>
          </div>
          <ul class="project-tech" aria-label="Technology">${technology}</ul>
          <details class="project-notes">
            <summary>Open field notes</summary>
            <div class="project-note-body">
              <p><strong>Why it matters:</strong> ${escapeHTML(project.why)}</p>
              <ul class="project-evidence">${evidence}</ul>
            </div>
          </details>
          <footer class="project-footer">
            <a class="project-repo" href="${escapeHTML(project.repo)}" target="_blank" rel="noopener noreferrer">Inspect repository <span aria-hidden="true">↗</span></a>
            <span class="project-proof">${escapeHTML(project.proof)}</span>
          </footer>
        </div>
      </article>`;
  }

  function setupProjectTilt(cards) {
    if (prefersReducedMotion.matches || window.matchMedia("(pointer: coarse)").matches) return;

    cards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty("--tilt-x", `${(x * 2.7).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(y * -2.4).toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function setupFilters(cards) {
    const buttons = document.querySelectorAll("[data-filter]");
    const status = document.getElementById("filter-status");
    let filterRun = 0;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        const currentRun = ++filterRun;
        buttons.forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });

        cards.forEach((card) => card.classList.add("is-filtering"));
        window.setTimeout(() => {
          if (currentRun !== filterRun) return;
          let visible = 0;
          cards.forEach((card) => {
            const categories = (card.dataset.categories || "").split(" ");
            const shouldShow = filter === "all" || categories.includes(filter);
            card.hidden = !shouldShow;
            if (shouldShow) {
              visible += 1;
              window.requestAnimationFrame(() => card.classList.remove("is-filtering"));
            }
          });
          if (status) status.textContent = `${visible} project${visible === 1 ? "" : "s"} shown for ${button.textContent.trim()}.`;
        }, 150);
      });
    });
  }

  async function loadProjects() {
    const grid = document.getElementById("project-grid");
    if (!grid) return;

    try {
      const response = await fetch("./data/projects.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Project data returned HTTP ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload.projects) || payload.projects.length === 0) throw new Error("No verified projects were found");

      grid.innerHTML = payload.projects.map(projectCard).join("");
      const cards = [...grid.querySelectorAll(".project-card")];
      setupProjectTilt(cards);
      setupFilters(cards);
    } catch (error) {
      console.error("Unable to load project field notes:", error);
      grid.innerHTML = `
        <div class="project-error" role="alert">
          <strong>The project signal dropped.</strong>
          <p>The repositories are still available on <a href="https://github.com/SimpleCaci">GitHub</a>.</p>
        </div>`;
    }
  }

  setupNavigation();
  setupRotatingWord();
  setupReveal();
  setupSky();
  setupPlayground();
  setupPullCord();
  loadProjects();
})();
