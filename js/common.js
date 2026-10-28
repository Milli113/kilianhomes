/* KiliánHomes – közös viselkedés: fejléc, sima görgetés, oldalátmenet, feltűnő animációk */
(function () {
  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasG = typeof window.gsap !== "undefined";
  KH.RM = RM;
  if (hasG && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* Sima görgetés */
  let lenis = null;
  if (!RM && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    KH.lenis = lenis;
    if (hasG && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  KH.scrollTo = (target) => {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
  };

  /* Fejléc: áttetsző → tömör, lefelé görgetésnél elrejt */
  const hdr = document.querySelector(".hdr");
  if (hdr) {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      hdr.classList.toggle("is-solid", y > 40);
      hdr.classList.toggle("is-hidden", y > 400 && y > last + 4 && !document.body.classList.contains("nav-open"));
      if (y < last - 4) hdr.classList.remove("is-hidden");
      last = y;
      const m = document.querySelector(".mcta");
      if (m) m.classList.toggle("is-on", y > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  const burger = document.querySelector(".burger");
  if (burger) burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", open);
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    if (lenis) lenis.start();
  }));

  /* Horgony linkek sima görgetéssel */
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    KH.scrollTo(el);
  });

  /* Oldalátmenet: arany-kék függöny */
  const curtain = document.createElement("div");
  curtain.className = "curtain";
  curtain.setAttribute("aria-hidden", "true");
  curtain.innerHTML = "<i></i><i></i><i></i><i></i><i></i><div class='cl'>KiliánHomes</div>";
  document.body.appendChild(curtain);
  const bars = curtain.querySelectorAll("i");

  KH.go = (href, label) => {
    if (RM || !hasG) { location.href = href; return; }
    curtain.querySelector(".cl").textContent = label || "KiliánHomes";
    gsap.timeline({ onComplete: () => { location.href = href; } })
      .to(bars, { scaleY: 1, transformOrigin: "bottom", duration: .55, ease: "power3.inOut", stagger: .05 })
      .to(curtain.querySelector(".cl"), { opacity: 1, duration: .25 }, "-=.2");
  };
  // Belépő animáció
  if (!RM && hasG && sessionStorageSafe("kh-tr")) {
    gsap.set(bars, { scaleY: 1 });
    gsap.to(bars, { scaleY: 0, transformOrigin: "top", duration: .7, ease: "power3.inOut", stagger: .05, delay: .05 });
  }
  function sessionStorageSafe(k) {
    try { const v = sessionStorage.getItem(k); sessionStorage.removeItem(k); return v; } catch (e) { return null; }
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-tr]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    try { sessionStorage.setItem("kh-tr", "1"); } catch (err) {}
    KH.go(a.getAttribute("href"), a.dataset.tr || "");
  });
  window.addEventListener("pageshow", ev => { if (ev.persisted && hasG) gsap.set(bars, { scaleY: 0 }); });

  /* Szavakra bontás a címekhez */
  KH.split = (el) => {
    if (el.dataset.splitDone) return el.querySelectorAll(".w>span");
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span"); w.className = "w";
            const i = document.createElement("span"); i.textContent = part;
            w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") {
          // az <em> stb. megtartása: a belsejét bontjuk
          walk(n);
        }
      });
    };
    walk(el);
    el.classList.add("split");
    el.dataset.splitDone = "1";
    return el.querySelectorAll(".w>span");
  };

  /* Általános görgetésre induló animációk (az oldal nyugalmi állapotban is teljes) */
  KH.reveals = () => {
    if (RM || !hasG || !window.ScrollTrigger) return;
    document.querySelectorAll("[data-split]").forEach(el => {
      const words = KH.split(el);
      gsap.from(words, { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: .045,
        scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
    document.querySelectorAll("[data-up]").forEach(el => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: "power3.out", delay: +el.dataset.up || 0,
        scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
    document.querySelectorAll("[data-stagger]").forEach(el => {
      gsap.from(el.children, { y: 36, opacity: 0, duration: 1, ease: "power3.out", stagger: .09,
        scrollTrigger: { trigger: el, start: "top 86%", once: true } });
    });
    document.querySelectorAll(".rule").forEach(el => {
      gsap.from(el, { scaleX: 0, duration: 1.4, ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 92%", once: true } });
    });
    document.querySelectorAll("[data-count]").forEach(el => {
      const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), o = { v: 0 };
      const fmt = v => v.toLocaleString("hu-HU", { minimumFractionDigits: dec, maximumFractionDigits: dec }).replace(/ /g, " ");
      gsap.to(o, { v: to, duration: 1.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => { el.textContent = fmt(o.v); }, onComplete: () => { el.textContent = fmt(to); } });
    });
    document.querySelectorAll("[data-parallax]").forEach(el => {
      gsap.to(el, { yPercent: +el.dataset.parallax || -10, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
    document.querySelectorAll("[data-clip]").forEach(el => {
      gsap.from(el, { clipPath: "inset(0 0 100% 0)", duration: 1.4, ease: "power4.inOut",
        scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    });
  };

  /* Lightbox */
  KH.lightbox = (items) => {
    let lb = document.querySelector(".lb");
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
      lb.innerHTML = `<button class="lb__btn lb__close" aria-label="Bezárás">✕</button>
        <button class="lb__btn lb__prev" aria-label="Előző kép">‹</button>
        <button class="lb__btn lb__next" aria-label="Következő kép">›</button>
        <div><img alt=""><p class="lb__cap"></p></div>`;
      document.body.appendChild(lb);
    }
    let i = 0;
    const img = lb.querySelector("img"), cap = lb.querySelector(".lb__cap");
    const show = k => { i = (k + items.length) % items.length; img.src = items[i].src; img.alt = items[i].alt; cap.textContent = `${i + 1} / ${items.length} · ${items[i].alt}`; };
    const close = () => { lb.classList.remove("is-open"); if (lenis) lenis.start(); };
    lb.querySelector(".lb__close").onclick = close;
    lb.querySelector(".lb__prev").onclick = () => show(i - 1);
    lb.querySelector(".lb__next").onclick = () => show(i + 1);
    lb.onclick = e => { if (e.target === lb) close(); };
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(i - 1);
      if (e.key === "ArrowRight") show(i + 1);
    });
    return k => { show(k); lb.classList.add("is-open"); if (lenis) lenis.stop(); lb.querySelector(".lb__close").focus(); };
  };

  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
})();
