/* KiliánHomes – főoldal */
(function () {
  const RM = KH.RM, G = window.gsap, ST = window.ScrollTrigger;
  const IMG = KH.IMG;

  /* ---------- Műszaki tartalom ---------- */
  const ico = KH.specIcons, specs = KH.specs;
  const grid = document.getElementById("specGrid");
  specs.forEach(([ic, t, txt], i) => {
    const m = txt.match(/^(.+?[.!?])\s+(.*)$/s);
    const sum = m ? m[1] : txt, more = m ? m[2] : "";
    const el = document.createElement("article");
    el.className = "spec__item";
    el.innerHTML = `<button type="button" ${more ? `aria-expanded="false" aria-controls="sp${i}"` : 'tabindex="-1" style="cursor:default"'}>
      <div class="spec__top"><span class="spec__ico"><svg viewBox="0 0 40 40">${ico[ic]}</svg></span>${more ? '<span class="spec__plus" aria-hidden="true"></span>' : ""}</div>
      <h3>${t}</h3><p class="spec__sum">${sum}</p>
      ${more ? `<div class="spec__more" id="sp${i}"><div><p>${more}</p></div></div>` : ""}</button>`;
    if (more) el.querySelector("button").addEventListener("click", () => {
      const open = el.classList.toggle("is-open");
      el.querySelector("button").setAttribute("aria-expanded", open);
      setTimeout(() => ST && ST.refresh(), 600);
    });
    grid.appendChild(el);
  });

  /* ---------- Udvar ---------- */
  const court = [
    ['<path d="M4 26h32v8H4zM8 26l4-10h16l4 10"/><circle cx="12" cy="34" r="3"/><circle cx="28" cy="34" r="3"/>', "Parkolás", "Az udvarban 6 önálló garázs és 15 udvari parkoló is épül. A garázsok és a parkolók megvásárolhatók."],
    ['<path d="M22 4L10 22h10l-2 14 12-18H20z"/>', "Elektromos töltés", "Gondoltunk az elektromos autók tulajdonosaira is: az udvarban egy kijelölt parkolót ingyenesen biztosítunk a társasházi közösségnek, amely a későbbiekben lehetőséget ad az autótöltő-hálózat kiépítésére és a járművek töltésére."],
    ['<rect x="6" y="10" width="28" height="24"/><path d="M6 18h28M16 14h8"/>', "Tárolás", "Saját tároló a lakásokon belül, közös tároló a házban és külön udvari kerékpártároló."],
    ['<path d="M20 4l14 6v10c0 8-6 13-14 16C12 33 6 28 6 20V10z"/><path d="M14 20l4 4 8-8"/>', "Biztonság", "Körbekerített telek, elektromos kapumozgatású bejáratok, kamerás megfigyelés a közösségi tereken. Minden lakásban Hikvision DS-PWA64 vezeték nélküli riasztórendszer, központtal, mozgásérzékelővel, nyitásérzékelővel és távirányítóval."],
    ['<rect x="4" y="4" width="32" height="32"/><path d="M4 22h14v14M24 4v12h12"/>', "Tágas udvar", "A 2 500 m²-es telek szellős, zárt udvart biztosít. A kertkapcsolatos lakásokhoz 2D kerítéssel elválasztott privát kert tartozik."],
    ['<path d="M20 36s11-11 11-19a11 11 0 0 0-22 0c0 8 11 19 11 19z"/><circle cx="20" cy="17" r="4"/>', "Elhelyezkedés", "100–500 méteren belül élelmiszerüzletek, gyógyszertár, iskola, óvoda és buszmegálló. A belváros autóval 5 perc."]
  ];
  const cl = document.getElementById("courtList");
  court.forEach(([p, t, d]) => {
    cl.insertAdjacentHTML("beforeend", `<div class="citem"><svg viewBox="0 0 40 40">${p}</svg><div><h3>${t}</h3><p>${d}</p></div></div>`);
  });

  /* ---------- Galéria ---------- */
  const gal = [
    ["k02-2776d8a389.jpg", "Az épület az udvar felől, naplementében"],
    ["k03-33d0811889.jpg", "Kertkapcsolatos lakások naplementekor"],
    ["k04-7a1d2f691c.jpg", "Teraszok és privát kertek napsütésben"],
    ["k05-858015c809.jpg", "Az udvar a számozott garázsokkal"],
    ["k06-2dcb5f90f8.jpg", "Az épület az utca felől, saját kapuval"],
    ["k07-559def7b3d.jpg", "Az utcafront a garázssorral, az udvari parkolókkal és a kertekkel"],
    ["k08-ed2e69a0e3.jpg", "Esti terasz kertvilágítással"],
    ["k09-0dc90d14a7.jpg", "Kivilágított otthonok esti esőben"],
    ["k10-8df6c63dcd.jpg", "Téli este, havas tetővel"],
    ["k11-e9befacad7.jpg", "Madártávlat a kertkapcsolatos teraszokkal és az udvari parkolóval"],
    ["k12-75d0624780.jpg", "Madártávlat: az épület a kertekkel, az udvarral és a garázssorral"]
  ];
  const track = document.getElementById("galTrack");
  const openLb = KH.lightbox(gal.map(([f, a]) => ({ src: IMG + f, alt: a })));
  gal.forEach(([f, a], i) => {
    const fig = document.createElement("figure");
    fig.className = "gal__item"; fig.tabIndex = 0;
    fig.setAttribute("role", "button"); fig.setAttribute("aria-label", "Nagyítás: " + a);
    fig.innerHTML = `<div class="gal__frame"><img src="${IMG + f}" alt="${a}" loading="lazy"></div><figcaption><b>${KH.pad(i + 1)}</b>${a}</figcaption>`;
    fig.addEventListener("click", () => openLb(i));
    fig.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(i); } });
    track.appendChild(fig);
  });

  /* ---------- Pergola ---------- */
  const NS = "http://www.w3.org/2000/svg";
  const lamG = document.getElementById("pgLams"), raysG = document.getElementById("pgRays"),
        rainG = document.getElementById("pgRain"), splashG = document.getElementById("pgSplash");
  const lams = [];
  for (let i = 0; i < 14; i++) {
    const cx = 108 + i * 29.5, cy = 170;
    const r = document.createElementNS(NS, "rect");
    r.setAttribute("x", cx - 16); r.setAttribute("y", cy - 3); r.setAttribute("width", 32); r.setAttribute("height", 6);
    r.setAttribute("fill", "#d4bb8c"); r.setAttribute("stroke", "#152234"); r.setAttribute("stroke-width", ".8");
    r.dataset.cx = cx; r.dataset.cy = cy;
    lamG.appendChild(r); lams.push(r);
    if (i < 13) {
      const ray = document.createElementNS(NS, "polygon");
      const x = cx + 14.75;
      ray.setAttribute("points", `${x - 4},172 ${x + 4},172 ${x - 26},430 ${x - 38},430`);
      ray.setAttribute("fill", "url(#pgRay)");
      raysG.appendChild(ray);
    }
  }
  for (let i = 0; i < 42; i++) {
    const l = document.createElementNS(NS, "line");
    const x = 20 + Math.random() * 560, y = Math.random() * 400;
    l.setAttribute("x1", x); l.setAttribute("y1", y); l.setAttribute("x2", x - 4); l.setAttribute("y2", y + 14);
    l.setAttribute("opacity", .35 + Math.random() * .5);
    rainG.appendChild(l);
  }
  for (let i = 0; i < 10; i++) {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", 110 + i * 42); c.setAttribute("cy", 160); c.setAttribute("r", 1.6);
    splashG.appendChild(c);
  }
  const setAngle = deg => lams.forEach(r => r.setAttribute("transform", `rotate(${deg} ${r.dataset.cx} ${r.dataset.cy})`));
  const state = { a: 78 };
  setAngle(state.a);
  let rainTween = null, splashTween = null;
  const pgState = document.getElementById("pgState");
  const setMode = (mode) => {
    document.querySelectorAll(".pergola__toggle button").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === mode));
    const sun = mode === "sun";
    pgState.textContent = sun ? "Napsütés · lamellák nyitva" : "Eső · lamellák zárva";
    if (RM || !G) {
      setAngle(sun ? 78 : 0);
      raysG.style.opacity = sun ? 1 : 0; rainG.style.opacity = sun ? 0 : 1;
      return;
    }
    G.to(state, { a: sun ? 78 : 0, duration: 1.6, ease: "power3.inOut", onUpdate: () => setAngle(state.a) });
    G.to(raysG, { opacity: sun ? 1 : 0, duration: sun ? 1.2 : .6, delay: sun ? .6 : 0 });
    G.to("#pgSun", { opacity: sun ? 1 : .15, duration: 1 });
    G.to("#pgSunRays", { rotation: sun ? 45 : 0, svgOrigin: "500 54", duration: 1.6, ease: "power2.out" });
    G.to(rainG, { opacity: sun ? 0 : 1, duration: .8 });
    G.to("#pgShade", { opacity: sun ? .55 : .95, duration: 1 });
    if (!sun) {
      rainTween = rainTween || G.to(rainG.children, { y: 430, duration: .9, ease: "none", repeat: -1, stagger: { each: .03, from: "random" }, modifiers: { y: y => (parseFloat(y) % 160) } });
      rainTween.play();
      splashG.style.opacity = 1;
      splashTween = splashTween || G.fromTo(splashG.children, { attr: { r: .5 }, opacity: 1 }, { attr: { r: 5 }, opacity: 0, duration: .6, repeat: -1, stagger: { each: .12, from: "random" } });
      splashTween.play();
    } else {
      if (rainTween) rainTween.pause();
      if (splashTween) { splashTween.pause(); splashG.style.opacity = 0; }
    }
  };
  document.querySelectorAll(".pergola__toggle button").forEach(b => b.addEventListener("click", () => { autoCycle = false; setMode(b.dataset.mode); }));
  let autoCycle = true;

  /* ---------- Űrlap ---------- */
  const sel = document.getElementById("fUnit");
  KH.units.forEach(u => {
    const o = document.createElement("option");
    o.value = u.n; o.textContent = `Lakás ${KH.pad(u.n)} · ${u.level} · ${u.net} m²${u.status !== "szabad" ? " · " + KH.statusLabel[u.status] : ""}`;
    sel.appendChild(o);
  });
  const params = new URLSearchParams(location.search);
  if (params.get("lakas")) sel.value = params.get("lakas");
  const tabs = document.querySelectorAll(".tabs button");
  const setType = t => {
    tabs.forEach(b => b.setAttribute("aria-pressed", b.dataset.type === t));
    document.getElementById("submitLbl").textContent = t === "bejaras" ? "Bejárást kérek" : "Visszahívást kérek";
    document.getElementById("formIntro").textContent = t === "bejaras"
      ? "Adja meg nevét és telefonszámát, és egyeztetjük Önnel a személyes bejárás időpontját."
      : "Adja meg nevét és telefonszámát, és munkanapokon hamarosan visszahívjuk.";
  };
  tabs.forEach(b => b.addEventListener("click", () => setType(b.dataset.type)));
  if (params.get("tipus") === "bejaras") setType("bejaras");
  document.querySelectorAll("[data-bejaras]").forEach(a => a.addEventListener("click", () => setType("bejaras")));
  document.querySelectorAll("[data-notify]").forEach(a => a.addEventListener("click", () => {
    setType("visszahivas");
    document.getElementById("fNote").value = "Kérek értesítést a mintalakás megnyitásáról.";
  }));
  const form = document.getElementById("leadForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const err = document.getElementById("formErr");
    const name = form.fName.value.trim(), phone = form.fPhone.value.trim();
    let msg = "";
    if (!name) msg = "Kérjük, adja meg a nevét.";
    else if (phone.replace(/\D/g, "").length < 8) msg = "Kérjük, adjon meg egy érvényes telefonszámot.";
    else if (!form.fGdpr.checked) msg = "A küldéshez fogadja el az adatkezelési tájékoztatót.";
    err.hidden = !msg; err.textContent = msg;
    if (msg) return;
    if (form.hp.value) return;
    /* Élesítéskor ide kerül a meglévő űrlapkezelő hívása (fetch POST a jelenlegi végpontra). */
    document.getElementById("formBody").hidden = true;
    const ok = document.getElementById("formOk");
    ok.hidden = false;
    requestAnimationFrame(() => ok.classList.add("is-on"));
  });

  /* ---------- Térkép ---------- */
  document.getElementById("mapLoad").addEventListener("click", () => {
    const f = document.getElementById("mapFrame");
    f.innerHTML = '<iframe title="Térkép: Pápa, Vízmű utca 6." loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=P%C3%A1pa%2C%20V%C3%ADzm%C5%B1%20utca%206&output=embed"></iframe>';
  });

  /* ---------- Animációk ---------- */
  if (RM || !G || !ST) { setMode("sun"); return; }

  // Hero belépő
  const heroWords = KH.split(document.getElementById("heroTitle"));
  G.timeline({ delay: .15 })
    .from("#heroImg", { scale: 1.18, duration: 2.6, ease: "power3.out" })
    .from(heroWords, { yPercent: 115, duration: 1.2, ease: "power4.out", stagger: .07 }, .3)
    .from("#heroSide > *", { y: 30, opacity: 0, duration: 1, ease: "power3.out", stagger: .12 }, .9);
  G.from(".hdr .wrap", { opacity: 0, duration: 1, ease: "power2.out", delay: .6 });
  G.to("#heroImg", { yPercent: 14, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  KH.reveals();

  // Pergola: belépéskor kinyílik, majd néhány másodpercenként vált
  ST.create({
    trigger: "#pergola", start: "top 60%", once: true,
    onEnter: () => {
      state.a = 0; setAngle(0);
      setMode("sun");
      let m = "sun";
      const t = setInterval(() => {
        if (!autoCycle) { clearInterval(t); return; }
        m = m === "sun" ? "rain" : "sun"; setMode(m);
      }, 5200);
    }
  });
  G.from(".pergola__stage", { y: 60, opacity: 0, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: "#pergola", start: "top 75%", once: true } });

  // Vízszintes galéria
  const mm = G.matchMedia();
  mm.add("(min-width: 801px)", () => {
    const dist = () => track.scrollWidth - window.innerWidth + 40;
    const tw = G.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: ".gal", start: "top top", end: () => "+=" + dist(), pin: ".gal__pin", scrub: 1, invalidateOnRefresh: true,
        onUpdate: s => {
          document.getElementById("galBar").style.transform = `scaleX(${s.progress})`;
          document.getElementById("galNow").textContent = KH.pad(Math.min(11, 1 + Math.round(s.progress * 10)));
        }
      }
    });
    track.querySelectorAll(".gal__frame img").forEach(img => {
      G.fromTo(img, { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tw, start: "left right", end: "right left", scrub: true } });
    });
    return () => G.set(track, { x: 0 });
  });
  mm.add("(max-width: 800px)", () => {
    const onS = () => {
      const p = track.scrollLeft / (track.scrollWidth - track.clientWidth || 1);
      document.getElementById("galBar").style.transform = `scaleX(${p})`;
      document.getElementById("galNow").textContent = KH.pad(Math.min(11, 1 + Math.round(p * 10)));
    };
    track.addEventListener("scroll", onS, { passive: true });
    return () => track.removeEventListener("scroll", onS);
  });

  // Idővonal kirajzolódik
  G.fromTo("#tlFill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#tl", start: "top 70%", end: "bottom 60%", scrub: true } });
  document.querySelectorAll(".tl__step").forEach(s => {
    ST.create({ trigger: s, start: "top 68%", onEnter: () => s.classList.add("is-on"), onLeaveBack: () => s.classList.remove("is-on") });
    G.from(s.children, { x: 30, opacity: 0, duration: .9, ease: "power3.out", stagger: .06, scrollTrigger: { trigger: s, start: "top 85%", once: true } });
  });

  window.addEventListener("load", () => ST.refresh());
})();
