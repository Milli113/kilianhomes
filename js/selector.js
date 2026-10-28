/* KiliánHomes – élő lakásválasztó */
(function () {
  const RM = KH.RM, G = window.gsap, NS = "http://www.w3.org/2000/svg";
  const stage = document.getElementById("planStage"), plan = document.getElementById("plan");
  const tip = document.getElementById("tip");
  let isTouch = window.matchMedia("(hover: none)").matches;
  window.addEventListener("pointerdown", e => { isTouch = e.pointerType !== "mouse"; }, { capture: true, passive: true });
  window.addEventListener("pointermove", e => { if (e.pointerType === "mouse") isTouch = false; }, { passive: true });
  let floor = location.hash === "#tetoter" ? "t" : "f";
  const filters = new Set();

  /* Számlálók */
  const cnt = s => KH.units.filter(u => u.status === s).length;
  document.getElementById("cFree").textContent = cnt("szabad");
  document.getElementById("cRes").textContent = cnt("foglalt");
  document.getElementById("cSold").textContent = cnt("eladva");

  const centroid = pts => {
    // területtel súlyozott súlypont
    let a = 0, cx = 0, cy = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
      const f = x0 * y1 - x1 * y0; a += f; cx += (x0 + x1) * f; cy += (y0 + y1) * f;
    }
    a /= 2; return [cx / (6 * a), cy / (6 * a)];
  };
  const unitUrl = n => `lakas.html?n=${n}`;
  const open = n => {
    try { sessionStorage.setItem("kh-tr", "1"); } catch (e) {}
    KH.go(unitUrl(n), "Lakás " + KH.pad(n));
  };

  /* Alaprajzok + kattintható foltok */
  const floorEls = {};
  ["f", "t"].forEach(k => {
    const F = KH.floors[k];
    const wrap = document.createElement("div");
    wrap.className = "plan__floor" + (k === floor ? " is-active" : "");
    wrap.dataset.floor = k;
    wrap.innerHTML = `<img src="${KH.IMG + F.img}" alt="${F.alt}" width="${F.w}" height="${F.h}">`;
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${F.w} ${F.h}`);
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", F.name + " lakásai");
    svg.innerHTML = `<defs><pattern id="hatch-${k}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="rgba(192,138,62,.12)"/><line x1="0" y1="0" x2="0" y2="14" stroke="rgba(192,138,62,.7)" stroke-width="4"/></pattern></defs>`;
    Object.entries(KH.polys[k]).forEach(([n, pts]) => {
      const u = KH.unit(n);
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", `u-poly st-${u.status}`);
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "link");
      g.setAttribute("aria-label", `Lakás ${n}, ${u.level}, ${u.rooms} szoba, ${u.net} m², ${KH.statusLabel[u.status]}`);
      g.dataset.n = n;
      const poly = document.createElementNS(NS, "polygon");
      poly.setAttribute("points", pts.map(p => p.join(",")).join(" "));
      if (u.status === "foglalt") poly.style.fill = `url(#hatch-${k})`;
      const [cx, cy] = centroid(pts);
      const lbl = document.createElementNS(NS, "g");
      lbl.setAttribute("class", "u-lbl");
      lbl.innerHTML = `<rect x="${cx - 38}" y="${cy - 30}" width="76" height="60"/><text x="${cx}" y="${cy + 2}">${KH.pad(n)}</text>`;
      g.append(poly, lbl);
      svg.appendChild(g);
    });
    wrap.appendChild(svg);
    stage.appendChild(wrap);
    floorEls[k] = wrap;
  });

  /* Tooltip */
  const tipHTML = u => `
    <div class="tip__img"><img src="${KH.IMG + u.img}" alt=""></div>
    <div class="tip__body">
      <div class="tip__head"><b>Lakás ${KH.pad(u.n)}</b><span class="st st--${u.status}">${KH.statusLabel[u.status]}</span></div>
      <dl>
        <div><dt>Szint</dt><dd>${u.level}</dd></div>
        <div><dt>Szobák</dt><dd>${u.rooms} szoba</dd></div>
        <div><dt>Nettó alapterület</dt><dd>${u.net} m²</dd></div>
        <div><dt>${u.garden ? "Terasz + kert" : "Típus"}</dt><dd>${u.ext[0] ? u.ext.reduce((s, e) => s + KH.num(e[1]), 0).toLocaleString("hu-HU", { maximumFractionDigits: 2 }) + " m² terasz" : "Tetőtéri"}</dd></div>
      </dl>
      <div class="tip__price"><span>Bruttó vételár</span><b>${u.status === "eladva" ? "—" : KH.ft(u.price)}</b></div>
      <div class="tip__cta">${isTouch ? "Koppintson újra az adatlaphoz →" : "Kattintson az adatlaphoz →"}</div>
    </div>`;
  let tipN = null;
  const showTip = (n, x, y) => {
    if (tipN !== n) { tip.innerHTML = tipHTML(KH.unit(n)); tipN = n; }
    placeTip(x, y);
    tip.classList.add("is-on");
  };
  const placeTip = (x, y) => {
    const w = tip.offsetWidth || 270, h = tip.offsetHeight || 340, pad = 16;
    let left = x + 22, top = y + 18;
    if (left + w > window.innerWidth - pad) left = x - w - 22;
    if (left < pad) left = pad;
    if (top + h > window.innerHeight - pad) top = window.innerHeight - h - pad;
    if (top < pad) top = pad;
    tip.style.transform = "";
    tip.style.left = left + "px"; tip.style.top = top + "px";
  };
  const hideTip = () => { tip.classList.remove("is-on"); };

  let armed = null; // érintőképernyő: első koppintás = előnézet
  stage.querySelectorAll(".u-poly").forEach(g => {
    const n = +g.dataset.n;
    g.addEventListener("mouseenter", e => { if (!isTouch) { showTip(n, e.clientX, e.clientY); hlRow(n, true); } });
    g.addEventListener("mousemove", e => { if (!isTouch) placeTip(e.clientX, e.clientY); });
    g.addEventListener("mouseleave", () => { if (!isTouch) { hideTip(); hlRow(n, false); } });
    g.addEventListener("focus", () => { const r = g.getBoundingClientRect(); showTip(n, r.right - 20, r.top); g.classList.add("is-hl"); });
    g.addEventListener("blur", () => { hideTip(); g.classList.remove("is-hl"); });
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(n); } });
    g.addEventListener("click", e => {
      if (isTouch && armed !== n) {
        armed = n;
        stage.querySelectorAll(".u-poly.is-hl").forEach(x => x.classList.remove("is-hl"));
        g.classList.add("is-hl");
        const r = g.getBoundingClientRect();
        showTip(n, Math.min(r.left + r.width / 2, window.innerWidth - 300), r.bottom);
        return;
      }
      open(n);
    });
  });
  document.addEventListener("click", e => { if (isTouch && !e.target.closest(".u-poly")) { armed = null; hideTip(); stage.querySelectorAll(".u-poly.is-hl").forEach(x => x.classList.remove("is-hl")); } });
  window.addEventListener("scroll", () => { if (isTouch) hideTip(); }, { passive: true });

  /* Lakásszámok kapcsoló */
  const showAll = document.getElementById("showAll");
  const syncAll = () => plan.classList.toggle("show-all", showAll.checked);
  showAll.addEventListener("change", syncAll); syncAll();

  /* Szintváltó */
  const seg = document.getElementById("floorSeg"), ind = seg.querySelector(".seg__ind");
  const btns = seg.querySelectorAll("button");
  const moveInd = () => {
    const b = seg.querySelector('[aria-pressed="true"]');
    ind.style.width = b.offsetWidth + "px";
    ind.style.transform = `translateX(${b.offsetLeft}px)`;
  };
  const setFloor = (k, animate = true) => {
    floor = k;
    btns.forEach(b => b.setAttribute("aria-pressed", b.dataset.floor === k));
    moveInd();
    Object.entries(floorEls).forEach(([kk, el]) => el.classList.toggle("is-active", kk === k));
    history.replaceState(null, "", k === "t" ? "#tetoter" : "#foldszint");
    hideTip();
    if (animate && !RM && G) introPolys(k);
  };
  btns.forEach(b => b.addEventListener("click", () => setFloor(b.dataset.floor)));
  window.addEventListener("resize", moveInd);

  const introPolys = k => {
    const gs = floorEls[k].querySelectorAll(".u-poly");
    G.fromTo(gs, { opacity: 0, scale: .94, transformOrigin: "50% 50%" },
      { opacity: 1, scale: 1, duration: .7, ease: "back.out(1.6)", stagger: .06, delay: .15, clearProps: "transform",
        onComplete: applyFilters });
    gs.forEach((g, i) => {
      const p = g.querySelector("polygon");
      setTimeout(() => { p.classList.remove("pulse"); void p.getBBox(); p.classList.add("pulse"); }, 350 + i * 90);
    });
  };

  /* Szűrők */
  const match = u => {
    if (filters.has("rooms2") && !filters.has("rooms3") && u.rooms !== 2) return false;
    if (filters.has("rooms3") && !filters.has("rooms2") && u.rooms !== 3) return false;
    if (filters.has("garden") && !u.garden) return false;
    if (filters.has("free") && u.status !== "szabad") return false;
    return true;
  };
  function applyFilters() {
    stage.querySelectorAll(".u-poly").forEach(g => g.classList.toggle("is-dim", !match(KH.unit(g.dataset.n))));
    document.querySelectorAll("#utable tbody tr").forEach(tr => {
      const show = match(KH.unit(tr.dataset.n));
      tr.hidden = !show;
    });
    const n = KH.units.filter(match).length;
    document.getElementById("planHint").textContent = filters.size
      ? `${n} lakás felel meg a szűrésnek. Kattintson egy lakásra az adatlap megnyitásához.`
      : "Kattintson egy lakásra az adatlap megnyitásához.";
  }
  document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
    const f = c.dataset.filter;
    filters.has(f) ? filters.delete(f) : filters.add(f);
    c.setAttribute("aria-pressed", filters.has(f));
    applyFilters();
  }));

  /* Táblázat */
  const tbody = document.querySelector("#utable tbody");
  const terr = u => u.ext.reduce((s, e) => s + KH.num(e[1]), 0);
  let sortK = "n", sortDir = 1;
  const val = (u, k) => k === "net" ? KH.num(u.net) : k === "ext" ? terr(u) : k === "level" ? (u.floors[0] === "f" ? 0 : 1) + (u.duplex ? .5 : 0) : k === "status" ? ["szabad", "foglalt", "eladva"].indexOf(u.status) : u[k];
  const renderTable = () => {
    const list = [...KH.units].sort((a, b) => (val(a, sortK) - val(b, sortK)) * sortDir || a.n - b.n);
    tbody.innerHTML = list.map(u => `
      <tr data-n="${u.n}" tabindex="0">
        <td class="un">${KH.pad(u.n)}</td>
        <td>${u.level}${u.duplex ? ' <span class="tag" style="color:var(--gold-ink);border-color:var(--gold)">duplex</span>' : ""}</td>
        <td>${u.rooms}</td>
        <td>${u.net} m²</td>
        <td>${u.ext.length ? terr(u).toLocaleString("hu-HU", { maximumFractionDigits: 2 }) + " m²" : "—"}</td>
        <td style="font-weight:700">${u.status === "eladva" ? "—" : KH.ft(u.price)}</td>
        <td><span class="st st--${u.status}">${KH.statusLabel[u.status]}</span></td>
        <td><span class="go">Adatlap →</span></td>
      </tr>`).join("");
    tbody.querySelectorAll("tr").forEach(tr => {
      const n = +tr.dataset.n, u = KH.unit(n);
      tr.addEventListener("click", () => open(n));
      tr.addEventListener("keydown", e => { if (e.key === "Enter") open(n); });
      tr.addEventListener("mouseenter", () => {
        if (!u.floors.includes(floor)) setFloor(u.floors[0], false);
        hlPoly(n, true);
      });
      tr.addEventListener("mouseleave", () => hlPoly(n, false));
    });
    document.querySelectorAll("#utable th[data-k]").forEach(th => {
      if (th.dataset.k === sortK) th.setAttribute("aria-sort", sortDir > 0 ? "ascending" : "descending");
      else th.removeAttribute("aria-sort");
      th.querySelector(".so").textContent = th.dataset.k === sortK ? (sortDir > 0 ? "↑" : "↓") : "↕";
    });
    applyFilters();
  };
  document.querySelectorAll("#utable th[data-k]").forEach(th => th.addEventListener("click", () => {
    const k = th.dataset.k;
    sortDir = sortK === k ? -sortDir : 1; sortK = k; renderTable();
  }));
  function hlPoly(n, on) { stage.querySelectorAll(`.u-poly[data-n="${n}"]`).forEach(g => g.classList.toggle("is-hl", on)); }
  function hlRow(n, on) { const tr = tbody.querySelector(`tr[data-n="${n}"]`); if (tr) tr.classList.toggle("is-hl", on); }
  renderTable();

  /* Garázsok */
  const gsv = document.getElementById("gsv"), gnums = document.getElementById("gnums"), gInfo = document.getElementById("gInfo");
  const setG = (i, on) => {
    gsv.querySelectorAll("g")[i].classList.toggle("is-hl", on);
    gnums.children[i].classList.toggle("is-hl", on);
    if (on) gInfo.textContent = `${i + 1}. számú garázs · ${KH.statusLabel[KH.garages.status[i]]} · ${KH.garages.price}`;
  };
  KH.garages.rects.forEach(([x, y, w, h], i) => {
    const g = document.createElementNS(NS, "g");
    g.innerHTML = `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    gsv.appendChild(g);
    const b = document.createElement("button");
    b.type = "button"; b.textContent = i + 1; b.setAttribute("aria-label", `${i + 1}. garázs`);
    gnums.appendChild(b);
    const sel = () => { [...gnums.children].forEach((_, j) => setG(j, false)); setG(i, true); };
    g.addEventListener("mouseenter", sel); g.addEventListener("click", sel);
    b.addEventListener("mouseenter", sel); b.addEventListener("click", sel);
    b.addEventListener("focus", sel);
  });

  /* Indítás */
  setFloor(floor, false);
  requestAnimationFrame(moveInd);
  document.fonts && document.fonts.ready.then(moveInd);
  if (RM || !G) return;
  const words = KH.split(document.getElementById("selTitle"));
  G.timeline({ delay: .2 })
    .from(words, { yPercent: 115, duration: 1.1, ease: "power4.out", stagger: .06 })
    .from("#selLead, #legend, .sel-bar > *", { y: 24, opacity: 0, duration: .9, ease: "power3.out", stagger: .08 }, .4)
    .from(plan, { clipPath: "inset(0 0 100% 0)", duration: 1.3, ease: "power4.inOut" }, .5)
    .from(floorEls[floor].querySelector("img"), { scale: 1.08, duration: 1.8, ease: "power3.out" }, .5)
    .add(() => introPolys(floor), 1.2);
  if (window.ScrollTrigger) {
    G.from("#utable tbody tr", { y: 20, opacity: 0, duration: .7, ease: "power3.out", stagger: .04, scrollTrigger: { trigger: "#utable", start: "top 85%", once: true } });
    G.from(".garage > *", { y: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: .12, scrollTrigger: { trigger: ".garage", start: "top 80%", once: true } });
    G.from("#gsv g", { opacity: 0, duration: .01, scrollTrigger: { trigger: ".garage", start: "top 70%", once: true,
      onEnter: () => KH.garages.rects.forEach((_, i) => setTimeout(() => { setG(i, true); setTimeout(() => setG(i, false), 380); }, 600 + i * 160)) } });
  }
})();
