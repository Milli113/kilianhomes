/* KiliánHomes – lakás aloldal */
(function () {
  const RM = KH.RM, G = window.gsap, NS = "http://www.w3.org/2000/svg";
  const q = new URLSearchParams(location.search);
  let u = KH.unit(q.get("n") || q.get("lakas") || 1) || KH.units[0];
  const $ = id => document.getElementById(id);
  const n2 = KH.pad(u.n);
  const terr = u.ext.reduce((s, e) => s + KH.num(e[1]), 0);
  const fmt2 = v => v.toLocaleString("hu-HU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.title = `Lakás ${n2} – KiliánHomes Pápa`;
  $("crumbUnit").textContent = `Lakás ${n2}`;
  $("crumbSel").href = "lakasok.html" + (u.floors[0] === "t" ? "#tetoter" : "#foldszint");
  $("uNo").textContent = n2;
  const kind = u.duplex ? "kétszintes, kertkapcsolatos" : u.garden ? "kertkapcsolatos" : "tetőtéri";
  $("uTitle").innerHTML = `${u.rooms} szobás, <em>${kind}</em> lakás`;
  const st = $("uStatus"); st.className = "st st--" + u.status; st.textContent = KH.statusLabel[u.status];

  const tags = [u.level];
  if (u.garden) tags.push("Saját kert");
  if (u.ext.length) tags.push("Bioklimatikus pergola");
  if (u.entrance) tags.push("Közvetlen bejárat");
  if (u.duplex) tags.push("Duplex");
  $("uTags").innerHTML = tags.map((t, i) => `<span class="tag${i ? " tag--gold" : ""}">${t}</span>`).join("");

  const sold = u.status === "eladva";
  $("uPrice").textContent = sold ? "Eladva" : KH.ft(u.price);
  $("uDeposit").textContent = sold ? "" : `20% foglaló: ${KH.ft(u.price * .2)} · 5% ÁFA`;

  const kpis = [
    ["Nettó alapterület", u.net, " m²", KH.num(u.net), 2],
    ["Helyiségek összesen", u.sum, " m²", KH.num(u.sum), 2],
    ["Szobák", String(u.rooms), " szoba", u.rooms, 0],
    [u.ext.length ? "Terasz" : "Szint", u.ext.length ? fmt2(terr) : "Tetőtér", u.ext.length ? " m²" : "", u.ext.length ? terr : null, 2]
  ];
  $("uKpis").innerHTML = kpis.map(([l, v, s, c, d]) => `<div><span>${l}</span><b>${c != null ? `<span data-to="${c}" data-dec="${d}">${v}</span>` : v}${s}</b></div>`).join("");

  /* Alaprajz */
  const plan = $("uPlan");
  plan.src = KH.IMG + u.img;
  plan.alt = `Lakás ${n2} alaprajza`;

  /* Helyiségek */
  const rows = u.r.filter(r => !r[0].startsWith("#"));
  const max = Math.max(...rows.map(r => KH.num(r[1])), ...u.ext.map(e => KH.num(e[1])));
  let html = "";
  u.r.forEach(r => {
    if (r[0].startsWith("#")) { html += `<div class="room room--hdr">${r[0].slice(1)}</div>`; return; }
    const v = KH.num(r[1]);
    html += `<div class="room"><span class="room__n">${r[0]}</span><span class="room__v"><span data-to="${v}" data-dec="2">${r[1]}</span>${r[2] ? `<small>(${r[2]})</small>` : ""}</span><span class="room__bar"><i style="transform:scaleX(${v / max})"></i></span></div>`;
  });
  if (u.ext.length) {
    html += `<div class="room room--hdr">Kültér</div>`;
    u.ext.forEach(e => {
      const v = KH.num(e[1]);
      html += `<div class="room"><span class="room__n">${e[0]}</span><span class="room__v"><span data-to="${v}" data-dec="2">${e[1]}</span></span><span class="room__bar"><i style="transform:scaleX(${v / max})"></i></span></div>`;
    });
  }
  html += `<div class="room room--sum"><span class="room__n">Helyiségek összesen</span><span class="room__v">${u.sum} m²</span></div>`;
  html += `<div class="room room--sum" style="padding-top:4px"><span class="room__n" style="font-size:1rem;font-family:var(--f-body);font-weight:600;color:var(--muted)">Nettó alapterület</span><span class="room__v">${u.net} m²</span></div>`;
  $("uRooms").innerHTML = html;

  /* Mini alaprajz(ok) */
  u.floors.forEach(k => {
    const F = KH.floors[k];
    const box = document.createElement("a");
    box.className = "minimap"; box.href = "lakasok.html" + (k === "t" ? "#tetoter" : "#foldszint");
    box.dataset.tr = "Lakásválasztó";
    box.setAttribute("aria-label", `${F.name}: vissza a lakásválasztóhoz`);
    const others = Object.entries(KH.polys[k]).filter(([n]) => +n !== u.n)
      .map(([, p]) => `<polygon class="o" points="${p.map(x => x.join(",")).join(" ")}"/>`).join("");
    const mine = KH.polys[k][u.n];
    box.innerHTML = `<img src="${KH.IMG + F.img}" alt="" style="opacity:.55">
      <svg viewBox="0 0 ${F.w} ${F.h}">${others}<polygon class="me" points="${mine.map(x => x.join(",")).join(" ")}"/></svg>
      <span class="minimap__lbl">${F.name}</span>`;
    $("uMinis").appendChild(box);
  });

  /* CTA-k a lakás előkitöltésével */
  $("ctaQuote").href = `index.html?lakas=${u.n}#kapcsolat`;
  $("ctaVisit").href = `index.html?lakas=${u.n}&tipus=bejaras#kapcsolat`;
  $("navCta").href = $("mctaQuote").href = $("ctaQuote").href;
  $("ctaPdf").href = `${KH.DOC}adatlap/KilianHomes_Lakas-${n2}.pdf`;
  if (sold) { $("ctaQuote").hidden = true; $("ctaVisit").querySelector("span").textContent = "Hasonló lakást keresek"; }

  /* Műszaki tartalom – a lakásra szabva */
  const keys = ["window", "wall", "tile", "heat", "snow", "meter", "blind", "door"];
  if (u.garden) keys.splice(3, 0, "pergola");
  const specTxt = {};
  KH.specs.forEach(([ic, t, txt]) => specTxt[ic] = [t, txt.match(/^(.+?[.!?])(\s|$)/s)[1]]);
  specTxt.snow[1] = "Lakásonként, mérettől függően, 1–2 önálló klímaegységgel adjuk át az ingatlant.";
  $("uSpec").innerHTML = keys.slice(0, 8).map(k => `<div><svg viewBox="0 0 40 40">${KH.specIcons[k]}</svg><b>${specTxt[k][0]}</b><p>${specTxt[k][1]}</p></div>`).join("");

  /* Lapozás */
  const idx = KH.units.indexOf(u);
  const prev = KH.units[(idx - 1 + KH.units.length) % KH.units.length], next = KH.units[(idx + 1) % KH.units.length];
  $("uNav").innerHTML = `
    <a href="lakas.html?n=${prev.n}" data-tr="Lakás ${KH.pad(prev.n)}"><span>← Előző</span><b>Lakás ${KH.pad(prev.n)}</b><span>${prev.level} · ${prev.net} m²</span></a>
    <a href="lakas.html?n=${next.n}" data-tr="Lakás ${KH.pad(next.n)}"><span>Következő →</span><b>Lakás ${KH.pad(next.n)}</b><span>${next.level} · ${next.net} m²</span></a>`;
  document.addEventListener("keydown", e => {
    if (e.target.closest("input,textarea,select") || $("zoom").classList.contains("is-open")) return;
    if (e.key === "ArrowLeft") KH.go(`lakas.html?n=${prev.n}`, "Lakás " + KH.pad(prev.n));
    if (e.key === "ArrowRight") KH.go(`lakas.html?n=${next.n}`, "Lakás " + KH.pad(next.n));
  });

  /* Nagyító */
  const zoom = $("zoom"), zImg = $("zImg");
  let s = 1, tx = 0, ty = 0, drag = null;
  const apply = () => zImg.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${s})`;
  const openZoom = () => {
    zImg.src = plan.src; zImg.alt = plan.alt;
    s = Math.min(1, (window.innerWidth * .92) / Math.min(1600, window.innerWidth * 1.4)); tx = ty = 0; apply();
    zoom.classList.add("is-open"); KH.lenis && KH.lenis.stop(); $("zClose").focus();
  };
  const closeZoom = () => { zoom.classList.remove("is-open"); KH.lenis && KH.lenis.start(); $("uPlanImg").focus(); };
  $("uPlanImg").addEventListener("click", openZoom);
  $("uPlanImg").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openZoom(); } });
  $("zoomBtn").addEventListener("click", openZoom);
  $("zClose").addEventListener("click", closeZoom);
  $("zIn").addEventListener("click", () => { s = Math.min(4, s * 1.3); apply(); });
  $("zOut").addEventListener("click", () => { s = Math.max(.3, s / 1.3); apply(); });
  zoom.addEventListener("wheel", e => { e.preventDefault(); s = Math.min(4, Math.max(.3, s * (e.deltaY < 0 ? 1.1 : .9))); apply(); }, { passive: false });
  zImg.addEventListener("pointerdown", e => { drag = [e.clientX - tx, e.clientY - ty]; zImg.setPointerCapture(e.pointerId); zImg.style.cursor = "grabbing"; });
  zImg.addEventListener("pointermove", e => { if (!drag) return; tx = e.clientX - drag[0]; ty = e.clientY - drag[1]; apply(); });
  zImg.addEventListener("pointerup", () => { drag = null; zImg.style.cursor = "grab"; });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && zoom.classList.contains("is-open")) closeZoom(); });

  /* Animációk */
  if (RM || !G) { document.querySelector(".u-plan__img .mask").remove(); return; }
  const count = (el, delay = 0, dur = 1.6) => {
    const to = +el.dataset.to, dec = +el.dataset.dec, o = { v: 0 };
    G.to(o, { v: to, duration: dur, delay, ease: "power2.out", onUpdate: () => el.textContent = o.v.toLocaleString("hu-HU", { minimumFractionDigits: dec, maximumFractionDigits: dec }) });
  };
  const words = KH.split($("uTitle"));
  const tl = G.timeline({ delay: .15 });
  const noObj = { v: 0 };
  tl.to(noObj, { v: u.n, duration: 1.2, ease: "power3.out", onUpdate: () => $("uNo").textContent = KH.pad(Math.round(noObj.v)) }, 0)
    .from("#uNo", { yPercent: 40, opacity: 0, duration: 1.2, ease: "power4.out" }, 0)
    .from(words, { yPercent: 115, duration: 1, ease: "power4.out", stagger: .05 }, .2)
    .from("#uStatus, #uTags .tag, .u-crumb", { y: 16, opacity: 0, duration: .7, ease: "power3.out", stagger: .06 }, .4)
    .from(".u-price > *", { y: 20, opacity: 0, duration: .8, ease: "power3.out", stagger: .08 }, .5)
    .from("#uKpis > div", { y: 30, opacity: 0, duration: .9, ease: "power3.out", stagger: .08 }, .6)
    .add(() => document.querySelectorAll("#uKpis [data-to]").forEach(el => count(el)), .6);
  if (!sold) {
    const p = { v: u.price * .82 };
    tl.to(p, { v: u.price, duration: 1.6, ease: "power3.out", onUpdate: () => $("uPrice").textContent = KH.ft(Math.round(p.v / 50) * 50) }, .5);
  }
  // Alaprajz előtűnés
  const startPlan = () => {
    G.timeline()
      .to(".u-plan__img .mask", { scaleX: 0, duration: 1.3, ease: "power4.inOut" })
      .from(plan, { scale: 1.12, duration: 1.8, ease: "power3.out" }, 0);
  };
  plan.complete ? startPlan() : plan.addEventListener("load", startPlan, { once: true });
  setTimeout(() => G.set(".u-plan__img .mask", { scaleX: 0 }), 4000);
  // Helyiségek
  G.from("#uRooms .room", { x: 24, opacity: 0, duration: .7, ease: "power3.out", stagger: .045, delay: .7 });
  G.from("#uRooms .room__bar i", { scaleX: 0, duration: 1.1, ease: "power3.out", stagger: .05, delay: .9 });
  setTimeout(() => document.querySelectorAll("#uRooms [data-to]").forEach((el, i) => count(el, i * .04, 1.1)), 800);
  // Mini alaprajz – körvonal rajzolódik
  document.querySelectorAll(".minimap polygon.me").forEach(p => {
    const len = p.getTotalLength ? p.getTotalLength() : 3000;
    G.fromTo(p, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 },
      { strokeDashoffset: 0, fillOpacity: 1, duration: 1.6, ease: "power2.inOut", delay: 1.2,
        scrollTrigger: window.ScrollTrigger ? { trigger: p.closest(".minimap"), start: "top 90%", once: true } : undefined });
  });
  KH.reveals();
})();
