/* ===== GD&T Academy — widgets.js =====
 * Interactive, animated lesson widgets (vanilla JS + SVG).
 * Content files embed <div class="widget-mount" data-widget="name"></div>;
 * app.js calls GDT_WIDGETS.mountAll(root, lang) after each render.
 */
(function () {
  "use strict";

  var cleanups = []; // active rAF loops / listeners to cancel on re-render

  /* ---------- tiny helpers ---------- */
  function h(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function fmt(n, lang, dp) {
    var s = n.toFixed(dp == null ? 2 : dp);
    return lang === "tr" ? s.replace(".", ",") : s;
  }
  function slider(labelText, min, max, step, value, lang, dp, oninput) {
    var wrap = h("div", { class: "wctl" });
    var lab = h("label");
    var name = h("span", null, labelText);
    var val = h("span", { class: "wval" }, fmt(value, lang, dp));
    lab.appendChild(name); lab.appendChild(val);
    var inp = h("input", { type: "range", min: min, max: max, step: step, value: value });
    inp.addEventListener("input", function () {
      val.textContent = fmt(parseFloat(inp.value), lang, dp);
      oninput(parseFloat(inp.value));
    });
    wrap.appendChild(lab); wrap.appendChild(inp);
    wrap.value = function () { return parseFloat(inp.value); };
    return wrap;
  }
  function verdict(el, ok, passText, failText) {
    el.className = "wverdict " + (ok ? "pass" : "fail");
    el.textContent = (ok ? "✓ " + passText : "✗ " + failText);
  }
  function frame(container, icon, title, sub, badge) {
    container.classList.add("widget");
    container.innerHTML = "";
    container.appendChild(h("div", { class: "widget-title" }, icon + " " + title + (badge ? ' <span class="pill wpill">' + badge + "</span>" : "")));
    if (sub) container.appendChild(h("div", { class: "widget-sub" }, sub));
    var stage = h("div", { class: "widget-stage" });
    var controls = h("div", { class: "widget-controls" });
    var readout = h("div", { class: "wreadout" });
    container.appendChild(stage); container.appendChild(controls); container.appendChild(readout);
    return { stage: stage, controls: controls, readout: readout };
  }
  function svgEl(w, hgt, inner) {
    var d = h("div");
    d.innerHTML = '<svg viewBox="0 0 ' + w + " " + hgt + '" width="' + w + '" height="' + hgt + '" style="max-width:100%;height:auto">' + inner + "</svg>";
    return d.firstChild;
  }
  function svgPoint(svg, evt) {
    var r = svg.getBoundingClientRect();
    var vb = svg.viewBox.baseVal;
    return {
      x: (evt.clientX - r.left) * (vb.width / r.width),
      y: (evt.clientY - r.top) * (vb.height / r.height)
    };
  }
  function tween(from, to, ms, step, done) {
    var t0 = null, raf;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / ms);
      var e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOut
      step(from + (to - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else if (done) done();
    }
    raf = requestAnimationFrame(tick);
    cleanups.push(function () { cancelAnimationFrame(raf); });
  }
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var W = {}; // widget registry

  /* ================================================================
   * 1. zoneCompare — drag a hole center; square ± zone vs ⌀ position zone
   * ================================================================ */
  W.zoneCompare = {
    i18n: {
      en: {
        title: "Try it: square vs cylindrical zone", badge: "interactive",
        sub: "Drag the hole center (blue dot). The square is the ±0.1 coordinate zone; the circle is the position zone ⌀0.283 drawn through its corners.",
        coord: "± coordinate (±0.1)", pos: "Position (⌀0.283)",
        pass: "PASS", fail: "FAIL", dev: "Radial deviation (diametral)",
        aha: "⚠️ This part works (inside the circle) but ± tolerancing would scrap it!"
      },
      tr: {
        title: "Deneyin: kare bölge vs silindirik bölge", badge: "interaktif",
        sub: "Delik merkezini (mavi nokta) sürükleyin. Kare, ±0,1 koordinat bölgesi; çember, köşelerinden geçen ⌀0,283 pozisyon bölgesidir.",
        coord: "± koordinat (±0,1)", pos: "Pozisyon (⌀0,283)",
        pass: "GEÇER", fail: "KALIR", dev: "Radyal sapma (çapsal)",
        aha: "⚠️ Bu parça çalışır (çemberin içinde) ama ± toleranslama onu ıskartaya ayırırdı!"
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "🎯", T.title, T.sub, T.badge);
      var S = 600; // px per mm
      var cx = 210, cy = 160, half = 0.1 * S, R = 0.1 * Math.SQRT2 * S;
      var svg = svgEl(420, 320,
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" class="d-zone" stroke-dasharray="6 4" stroke-width="1.6"/>' +
        '<rect x="' + (cx - half) + '" y="' + (cy - half) + '" width="' + 2 * half + '" height="' + 2 * half + '" fill="none" class="d-stroke" stroke-width="1.6"/>' +
        '<line x1="' + (cx - R - 14) + '" y1="' + cy + '" x2="' + (cx + R + 14) + '" y2="' + cy + '" class="d-soft" stroke-width="1" stroke-dasharray="8 3 2 3"/>' +
        '<line x1="' + cx + '" y1="' + (cy - R - 14) + '" x2="' + cx + '" y2="' + (cy + R + 14) + '" class="d-soft" stroke-width="1" stroke-dasharray="8 3 2 3"/>' +
        '<circle id="hole" cx="' + cx + '" cy="' + cy + '" r="26" fill="none" class="d-stroke" stroke-width="2.2"/>' +
        '<circle id="dot" cx="' + cx + '" cy="' + cy + '" r="8" class="d-accentfill" style="cursor:grab"/>'
      );
      f.stage.appendChild(svg);
      var dot = svg.querySelector("#dot"), hole = svg.querySelector("#hole");
      var vC = h("span", { class: "wverdict" }), vP = h("span", { class: "wverdict" });
      var dev = h("span"), aha = h("div", { class: "waha" });
      f.readout.appendChild(vC); f.readout.appendChild(vP); f.readout.appendChild(dev);
      c.appendChild(aha);
      function update(x, y) {
        var dx = (x - cx) / S, dy = (y - cy) / S;
        dot.setAttribute("cx", x); dot.setAttribute("cy", y);
        hole.setAttribute("cx", x); hole.setAttribute("cy", y);
        var okC = Math.abs(dx) <= 0.1 && Math.abs(dy) <= 0.1;
        var d = 2 * Math.hypot(dx, dy);
        var okP = d <= 0.283;
        verdict(vC, okC, T.coord + ": " + T.pass, T.coord + ": " + T.fail);
        verdict(vP, okP, T.pos + ": " + T.pass, T.pos + ": " + T.fail);
        dev.innerHTML = T.dev + ": <b>⌀" + fmt(d, lang, 3) + "</b>";
        aha.textContent = (okP && !okC) ? T.aha : "";
      }
      update(cx + half * 1.18, cy - half * 0.3); // start in the "aha" region
      var dragging = false;
      function move(e) {
        if (!dragging) return;
        var p = svgPoint(svg, e.touches ? e.touches[0] : e);
        var r = Math.hypot(p.x - cx, p.y - cy), max = R + 30;
        if (r > max) { p.x = cx + (p.x - cx) * max / r; p.y = cy + (p.y - cy) * max / r; }
        update(p.x, p.y);
        e.preventDefault();
      }
      svg.addEventListener("pointerdown", function (e) { dragging = true; svg.setPointerCapture(e.pointerId); move(e); });
      svg.addEventListener("pointermove", move);
      svg.addEventListener("pointerup", function () { dragging = false; });
      svg.style.touchAction = "none";
    }
  };

  /* ================================================================
   * 2. rule1 — envelope principle: size + bow sliders
   * ================================================================ */
  W.rule1 = {
    i18n: {
      en: {
        title: "Try it: Rule #1 — perfect form at MMC", badge: "interactive",
        sub: "The dashed lines are the fixed perfect-form envelope at MMC (⌀10.0). Make the pin thinner and it may bow more — as long as it still fits the envelope. Deviations exaggerated for visibility.",
        size: "Pin size (MMC 10.0)", bow: "Bow (form error)",
        allowed: "Form error allowed by Rule #1", fits: "Fits the MMC envelope", violates: "Violates the MMC envelope"
      },
      tr: {
        title: "Deneyin: Kural 1 — MMC'de mükemmel form", badge: "interaktif",
        sub: "Kesikli çizgiler, MMC'deki (⌀10,0) sabit mükemmel form zarfıdır. Pimi inceltin; zarfa sığdığı sürece daha çok eğilebilir. Sapmalar görünürlük için abartılmıştır.",
        size: "Pim boyutu (MMC 10,0)", bow: "Eğilme (form hatası)",
        allowed: "Kural 1'in izin verdiği form hatası", fits: "MMC zarfına sığıyor", violates: "MMC zarfını ihlal ediyor"
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "📏", T.title, T.sub, T.badge);
      var MMC = 10.0, S = 200; // exaggeration px/mm
      var top = 30, bot = 170, L = 340, x0 = 40;
      var svg = svgEl(440, 205,
        '<line x1="' + x0 + '" y1="' + top + '" x2="' + (x0 + L) + '" y2="' + top + '" class="d-accent" stroke-dasharray="8 5" stroke-width="1.8"/>' +
        '<line x1="' + x0 + '" y1="' + bot + '" x2="' + (x0 + L) + '" y2="' + bot + '" class="d-accent" stroke-dasharray="8 5" stroke-width="1.8"/>' +
        '<path id="pin" class="d-stroke" fill="var(--surface-2)" stroke-width="2"/>' +
        '<text x="' + (x0 + L + 8) + '" y="' + ((top + bot) / 2 + 4) + '" font-size="12">MMC</text>'
      );
      f.stage.appendChild(svg);
      var pin = svg.querySelector("#pin");
      var v = h("span", { class: "wverdict" }), allow = h("span");
      f.readout.appendChild(v); f.readout.appendChild(allow);
      var size = 9.9, bow = 0.05;
      function redraw() {
        var hgt = (bot - top) - (MMC - size) * S;   // pin visual thickness
        var bS = bow * S;
        var yEnd = bot - hgt;                       // top edge at the ends
        // bowed pin: ends sit on bottom envelope line, bow lifts the middle
        var d = "M" + x0 + " " + bot +
          " Q " + (x0 + L / 2) + " " + (bot - 2 * bS) + " " + (x0 + L) + " " + bot +
          " L" + (x0 + L) + " " + yEnd +
          " Q " + (x0 + L / 2) + " " + (yEnd - 2 * bS) + " " + x0 + " " + yEnd + " Z";
        pin.setAttribute("d", d);
        var ok = bow <= (MMC - size) + 1e-9;
        verdict(v, ok, T.fits, T.violates);
        allow.innerHTML = T.allowed + ": <b>" + fmt(MMC - size, lang) + "</b>";
      }
      f.controls.appendChild(slider(T.size, 9.7, 10.0, 0.01, size, lang, 2, function (val) { size = val; redraw(); }));
      f.controls.appendChild(slider(T.bow, 0, 0.3, 0.01, bow, lang, 2, function (val) { bow = val; redraw(); }));
      redraw();
    }
  };

  /* ================================================================
   * 3. fcfBuilder — build a feature control frame, read the sentence
   * ================================================================ */
  W.fcfBuilder = {
    i18n: {
      en: {
        title: "Try it: build a feature control frame", badge: "interactive",
        sub: "Choose a characteristic, tolerance and datums — the frame and its meaning update live. Illegal combinations are disabled automatically.",
        char: "Characteristic", tol: "Tolerance", zone: "Zone", mod: "Modifier", datums: "Datums",
        zonePlanes: "two parallel planes", zoneCyl: "cylindrical (⌀)",
        modNone: "none (RFS)",
        names: { position: "Position", flatness: "Flatness", straightness: "Straightness", circularity: "Circularity", perpendicularity: "Perpendicularity", parallelism: "Parallelism", profileSurface: "Profile of a surface", totalRunout: "Total runout" },
        say: {
          position: "The axis of the feature of size must lie within a {zone} held at true position by basic dimensions relative to {datums}{mod}.",
          flatness: "The entire surface must lie between two parallel planes {v} apart. No datum — the surface is compared only with itself.",
          straightness: "Each line element of the surface must lie between two parallel lines {v} apart. No datum.",
          circularity: "Each circular cross-section must lie between two concentric circles {v} apart (radial). No datum.",
          perpendicularity: "The feature must lie within a {zone} held exactly 90° to {datums}{mod}. Location is NOT controlled.",
          parallelism: "The feature must lie within a {zone} held exactly parallel to {datums}{mod}. Location is NOT controlled.",
          profileSurface: "The entire surface must lie within a band {v} wide centered on the true profile{datumsOpt}.",
          totalRunout: "While the part rotates 360° about the datum axis {dl} and the indicator traverses the surface, the total indicator reading must not exceed {v}. Always RFS."
        },
        zoneCylTxt: "cylindrical zone ⌀{v}", zonePlanesTxt: "zone of two parallel planes {v} apart",
        modM: ", when the feature is at MMC (bonus tolerance as size departs)",
        modL: ", when the feature is at LMC (bonus toward MMC)",
        datumWord: "datum", datumsWord: "datums", andLocated: ", oriented and located relative to ",
        needDatum: "This characteristic requires at least one datum."
      },
      tr: {
        title: "Deneyin: özellik kontrol çerçevesi kurun", badge: "interaktif",
        sub: "Karakteristik, tolerans ve datum seçin — çerçeve ve anlamı canlı güncellenir. Geçersiz kombinasyonlar otomatik devre dışı kalır.",
        char: "Karakteristik", tol: "Tolerans", zone: "Bölge", mod: "Modifiye", datums: "Datumlar",
        zonePlanes: "iki paralel düzlem", zoneCyl: "silindirik (⌀)",
        modNone: "yok (RFS)",
        names: { position: "Pozisyon", flatness: "Düzlemsellik", straightness: "Doğrusallık", circularity: "Dairesellik", perpendicularity: "Diklik", parallelism: "Paralellik", profileSurface: "Yüzey profili", totalRunout: "Toplam salgı" },
        say: {
          position: "Boyutlu unsurun ekseni, {datums} göre temel ölçülerle gerçek pozisyonda tutulan {zone} içinde kalmalıdır{mod}.",
          flatness: "Yüzeyin tamamı, {v} aralıklı iki paralel düzlem arasında kalmalıdır. Datum yok — yüzey yalnızca kendisiyle karşılaştırılır.",
          straightness: "Yüzeyin her çizgi elemanı, {v} aralıklı iki paralel çizgi arasında kalmalıdır. Datum yok.",
          circularity: "Her dairesel kesit, (radyal) {v} aralıklı iki eşmerkezli çember arasında kalmalıdır. Datum yok.",
          perpendicularity: "Unsur, {datums} tam 90° tutulan {zone} içinde kalmalıdır{mod}. Konum kontrol EDİLMEZ.",
          parallelism: "Unsur, {datums} tam paralel tutulan {zone} içinde kalmalıdır{mod}. Konum kontrol EDİLMEZ.",
          profileSurface: "Yüzeyin tamamı, gerçek profil merkezli {v} genişliğindeki bant içinde kalmalıdır{datumsOpt}.",
          totalRunout: "Parça, {dl} datum ekseni etrafında 360° dönerken ve komparatör yüzey boyunca ilerlerken toplam ibre okuması {v} değerini aşmamalıdır. Her zaman RFS."
        },
        zoneCylTxt: "⌀{v} silindirik bölge", zonePlanesTxt: "{v} aralıklı iki paralel düzlemli bölge",
        modM: "; unsur MMC'deyken (boyut uzaklaştıkça bonus toleransla)",
        modL: "; unsur LMC'deyken (MMC'ye doğru bonusla)",
        datumWord: "datumuna", datumsWord: "datumlarına", andLocated: "",
        needDatum: "Bu karakteristik en az bir datum gerektirir."
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "🧩", T.title, T.sub, T.badge);
      var CFG = {
        position: { datum: "req", dia: true, mod: true, sym: "position" },
        perpendicularity: { datum: "req", dia: true, mod: true, sym: "perpendicularity" },
        parallelism: { datum: "req", dia: true, mod: true, sym: "parallelism" },
        profileSurface: { datum: "opt", dia: false, mod: false, sym: "profileSurface" },
        totalRunout: { datum: "req", dia: false, mod: false, sym: "totalRunout" },
        flatness: { datum: "none", dia: false, mod: false, sym: "flatness" },
        straightness: { datum: "none", dia: false, mod: false, sym: "straightness" },
        circularity: { datum: "none", dia: false, mod: false, sym: "circularity" }
      };
      var state = { char: "position", v: 0.2, dia: true, mod: "M", datums: 3 };

      function sel(labelText, opts, cur, cb) {
        var wrap = h("div", { class: "wctl" });
        wrap.appendChild(h("label", null, "<span>" + labelText + "</span>"));
        var s = h("select", { class: "wsel" });
        opts.forEach(function (o) {
          var op = h("option", { value: o[0] }, o[1]);
          if (o[0] === String(cur)) op.selected = true;
          s.appendChild(op);
        });
        s.addEventListener("change", function () { cb(s.value); });
        wrap.appendChild(s);
        wrap.select = s;
        return wrap;
      }

      var charSel = sel(T.char, Object.keys(CFG).map(function (k) { return [k, T.names[k]]; }), state.char, function (v) { state.char = v; sync(); });
      var zoneSel = sel(T.zone, [["planes", T.zonePlanes], ["dia", T.zoneCyl]], state.dia ? "dia" : "planes", function (v) { state.dia = v === "dia"; render(); });
      var modSel = sel(T.mod, [["", T.modNone], ["M", "Ⓜ MMC"], ["L", "Ⓛ LMC"]], state.mod, function (v) { state.mod = v; render(); });
      var datumSel = sel(T.datums, [["0", "—"], ["1", "A"], ["2", "A | B"], ["3", "A | B | C"]], state.datums, function (v) { state.datums = parseInt(v, 10); render(); });
      var tolCtl = slider(T.tol, 0.05, 1, 0.05, state.v, lang, 2, function (v) { state.v = v; render(); });
      [charSel, tolCtl, zoneSel, modSel, datumSel].forEach(function (x) { f.controls.appendChild(x); });

      var fcfBox = h("div", { class: "fcf-demo", style: "font-size:1.25rem" });
      var sentence = h("div", { class: "wsentence" });
      f.stage.appendChild(fcfBox);
      c.appendChild(sentence);

      function sync() { // enforce legality when characteristic changes
        var cfg = CFG[state.char];
        if (cfg.datum === "none") state.datums = 0;
        if (cfg.datum === "req" && state.datums === 0) state.datums = 1;
        if (!cfg.dia) state.dia = false;
        if (!cfg.mod) state.mod = "";
        zoneSel.select.value = state.dia ? "dia" : "planes";
        modSel.select.value = state.mod;
        datumSel.select.value = String(state.datums);
        zoneSel.select.disabled = !cfg.dia;
        modSel.select.disabled = !cfg.mod;
        datumSel.select.disabled = cfg.datum === "none";
        // datum options: forbid "—" when required
        datumSel.select.querySelector('option[value="0"]').disabled = cfg.datum === "req";
        render();
      }
      function render() {
        var cfg = CFG[state.char];
        var vStr = fmt(state.v, lang, 2);
        var tolCell = [];
        if (state.dia) tolCell.push({ sym: "diameter" });
        tolCell.push(vStr);
        if (state.mod) tolCell.push({ mod: state.mod });
        var parts = [[{ sym: cfg.sym }], tolCell];
        var letters = ["A", "B", "C"];
        for (var i = 0; i < state.datums; i++) parts.push([letters[i]]);
        fcfBox.innerHTML = GDT_SVG.fcf(parts);
        // sentence
        var zone = (state.dia ? T.zoneCylTxt : T.zonePlanesTxt).replace("{v}", vStr);
        var dl = letters.slice(0, state.datums).join(", ");
        var datums = dl + " " + (state.datums > 1 ? T.datumsWord : T.datumWord);
        var mod = state.mod === "M" ? T.modM : state.mod === "L" ? T.modL : "";
        var s = T.say[state.char]
          .replace("{zone}", zone).replace("{v}", vStr)
          .replace("{dl}", dl)
          .replace("{datums}", datums)
          .replace("{datumsOpt}", state.datums ? (lang === "tr" ? "; " + dl + " datumlarına göre konumlanmış" : ", located relative to " + dl) : "")
          .replace("{mod}", mod);
        sentence.innerHTML = "🗣️ " + s;
      }
      sync();
    }
  };

  /* ================================================================
   * 4. datum321 — animated seating: A then B, DOF counter
   * ================================================================ */
  W.datum321 = {
    i18n: {
      en: {
        title: "Watch it: seating a part in the datum reference frame", badge: "animated",
        sub: "A free part in 2D has 3 degrees of freedom (X, Y, rotation) — in 3D it's 6. Seat it on the datums in order and watch each step remove freedom.",
        step1: "1 · Seat on A", step2: "2 · Push to B", reset: "Reset",
        dof: "Degrees of freedom left", note3d: "(2D shown: 3 DOF. In 3D the same procedure with A, B, C locks all 6 — the 3-2-1 rule.)",
        s0: "Floating free: the part can translate and rotate.",
        s1: "Primary datum A: rests on the 2 highest points (3 in 3D) — vertical translation and rotation are locked.",
        s2: "Secondary datum B: slid against the wall — the last translation is locked. The part is fully constrained."
      },
      tr: {
        title: "İzleyin: parçayı datum referans çerçevesine oturtmak", badge: "animasyonlu",
        sub: "Serbest bir parçanın 2B'de 3 serbestlik derecesi vardır (X, Y, dönme) — 3B'de 6. Parçayı sırayla datumlara oturtun; her adımın serbestliği nasıl aldığını izleyin.",
        step1: "1 · A'ya oturt", step2: "2 · B'ye daya", reset: "Sıfırla",
        dof: "Kalan serbestlik derecesi", note3d: "(2B gösterim: 3 SD. 3B'de aynı prosedür A, B, C ile 6'sını da kilitler — 3-2-1 kuralı.)",
        s0: "Serbest hâlde: parça ötelenebilir ve dönebilir.",
        s1: "Birincil datum A: en yüksek 2 noktasına oturur (3B'de 3) — düşey öteleme ve dönme kilitlendi.",
        s2: "İkincil datum B: duvara dayandı — son öteleme de kilitlendi. Parça tamamen kısıtlandı."
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "🧲", T.title, T.sub, T.badge);
      var svg = svgEl(420, 250,
        // datum simulators: plate (bottom) + wall (left)
        '<line x1="30" y1="220" x2="400" y2="220" class="d-stroke" stroke-width="3"/>' +
        (function () { var s = ""; for (var x = 40; x < 400; x += 16) s += '<line x1="' + x + '" y1="220" x2="' + (x - 8) + '" y2="230" class="d-soft" stroke-width="1"/>'; return s; })() +
        '<line x1="60" y1="220" x2="60" y2="30" class="d-stroke" stroke-width="3"/>' +
        (function () { var s = ""; for (var y = 40; y < 220; y += 16) s += '<line x1="60" y1="' + y + '" x2="50" y2="' + (y - 8) + '" class="d-soft" stroke-width="1"/>'; return s; })() +
        '<text x="200" y="245" font-size="13" font-weight="700">A</text>' +
        '<text x="38" y="120" font-size="13" font-weight="700">B</text>' +
        // part: rectangle with a slightly wavy bottom (drawn in its own frame)
        '<g id="part"><path d="M0 0 L150 0 L150 -70 L0 -70 Z M0 0" class="d-stroke" fill="var(--accent)" fill-opacity="0.13" stroke-width="2"/>' +
        '<path d="M0 0 Q 40 -7 75 -2 T 150 -1" class="d-accent" fill="none" stroke-width="2"/>' +
        '<circle cx="8" cy="-2" r="3.5" class="d-accentfill" opacity="0"/><circle cx="142" cy="-1" r="3.5" class="d-accentfill" opacity="0"/>' +
        '</g>'
      );
      f.stage.appendChild(svg);
      var part = svg.querySelector("#part");
      var dots = part.querySelectorAll("circle");
      var pose = { x: 150, y: 130, r: -14 };            // start floating, tilted
      var seated = { x: 150, y: 219, r: 0 };            // after A
      var pushed = { x: 61, y: 219, r: 0 };             // after B
      function apply() {
        part.setAttribute("transform", "translate(" + pose.x + " " + pose.y + ") rotate(" + pose.r + ")");
      }
      var dofEl = h("span"), story = h("div", { class: "wsentence" });
      f.readout.appendChild(dofEl);
      c.appendChild(story);
      c.appendChild(h("div", { class: "widget-sub", style: "margin-top:8px" }, T.note3d));
      var step = 0, busy = false;
      function setState(n) {
        step = n;
        dofEl.innerHTML = T.dof + ": <b>" + [3, 1, 0][n] + "</b>" + (n === 2 ? " ✓" : "");
        story.innerHTML = ["🔓 " + T.s0, "🔒 " + T.s1, "🔒 " + T.s2][n];
        dots[0].setAttribute("opacity", n >= 1 ? 1 : 0);
        dots[1].setAttribute("opacity", n >= 1 ? 1 : 0);
        b1.disabled = n !== 0 || busy; b2.disabled = n !== 1 || busy;
      }
      function animateTo(target, then) {
        if (reducedMotion) { pose = Object.assign({}, target); apply(); if (then) then(); return; }
        busy = true; b1.disabled = b2.disabled = true;
        var from = Object.assign({}, pose);
        tween(0, 1, 700, function (p) {
          pose.x = from.x + (target.x - from.x) * p;
          pose.y = from.y + (target.y - from.y) * p;
          pose.r = from.r + (target.r - from.r) * p;
          apply();
        }, function () { busy = false; if (then) then(); });
      }
      var b1 = h("button", { class: "btn secondary wbtn" }, T.step1);
      var b2 = h("button", { class: "btn secondary wbtn" }, T.step2);
      var b3 = h("button", { class: "btn ghost wbtn" }, T.reset);
      b1.onclick = function () { animateTo(seated, function () { setState(1); }); };
      b2.onclick = function () { animateTo(pushed, function () { setState(2); }); };
      b3.onclick = function () { pose = { x: 150, y: 130, r: -14 }; apply(); setState(0); };
      [b1, b2, b3].forEach(function (b) { f.controls.appendChild(b); });
      apply(); setState(0);
    }
  };

  /* ================================================================
   * 5. flatness — waviness vs tolerance sliders
   * ================================================================ */
  W.flatness = {
    i18n: {
      en: {
        title: "Try it: flatness explorer", badge: "interactive",
        sub: "The two dashed planes always hug the surface as tightly as possible — their gap is the measured flatness. Compare it with the tolerance.",
        wav: "Surface error", tol: "Flatness tolerance",
        meas: "Measured flatness", pass: "Within tolerance", fail: "Out of tolerance"
      },
      tr: {
        title: "Deneyin: düzlemsellik kaşifi", badge: "interaktif",
        sub: "İki kesikli düzlem yüzeyi her zaman olabildiğince dar sandviçler — aralıkları ölçülen düzlemselliktir. Toleransla karşılaştırın.",
        wav: "Yüzey hatası", tol: "Düzlemsellik toleransı",
        meas: "Ölçülen düzlemsellik", pass: "Tolerans içinde", fail: "Tolerans dışında"
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "⏥", T.title, T.sub, T.badge);
      var S = 300, x0 = 30, L = 360, yMid = 90;
      var svg = svgEl(440, 170,
        '<rect id="zone" x="' + x0 + '" class="d-zone" stroke-width="0"/>' +
        '<line id="zt" x1="' + x0 + '" x2="' + (x0 + L) + '" class="d-accent" stroke-dasharray="6 4" stroke-width="1.6"/>' +
        '<line id="zb" x1="' + x0 + '" x2="' + (x0 + L) + '" class="d-accent" stroke-dasharray="6 4" stroke-width="1.6"/>' +
        '<path id="surf" class="d-stroke" fill="none" stroke-width="2.4"/>' +
        '<line x1="' + x0 + '" y1="150" x2="' + (x0 + L) + '" y2="150" class="d-soft" stroke-width="1.4"/>'
      );
      f.stage.appendChild(svg);
      var surf = svg.querySelector("#surf"), zt = svg.querySelector("#zt"), zb = svg.querySelector("#zb"), zone = svg.querySelector("#zone");
      var v = h("span", { class: "wverdict" }), meas = h("span");
      f.readout.appendChild(v); f.readout.appendChild(meas);
      var a = 0.08, tol = 0.1;
      function profile(t) { // normalized 0..1 deviation shape, PV = 1
        return 0.5 + 0.32 * Math.sin(t * 6.28318) + 0.18 * Math.sin(t * 18.85 + 1.3);
      }
      function redraw() {
        var pts = [], min = 1e9, max = -1e9, n = 60;
        for (var i = 0; i <= n; i++) {
          var t = i / n;
          var d = profile(t); // 0..1
          var y = yMid + (d - 0.5) * a * S;
          min = Math.min(min, y); max = Math.max(max, y);
          pts.push((i ? "L" : "M") + (x0 + t * L).toFixed(1) + " " + y.toFixed(1));
        }
        surf.setAttribute("d", pts.join(" "));
        zt.setAttribute("y1", min); zt.setAttribute("y2", min);
        zb.setAttribute("y1", max); zb.setAttribute("y2", max);
        zone.setAttribute("y", min); zone.setAttribute("width", L); zone.setAttribute("height", Math.max(0, max - min));
        var flat = (max - min) / S;
        var ok = flat <= tol + 1e-9;
        verdict(v, ok, T.pass, T.fail);
        meas.innerHTML = T.meas + ": <b>" + fmt(flat, lang, 3) + "</b> / " + fmt(tol, lang, 2);
      }
      f.controls.appendChild(slider(T.wav, 0.01, 0.2, 0.005, a, lang, 3, function (val) { a = val; redraw(); }));
      f.controls.appendChild(slider(T.tol, 0.02, 0.2, 0.01, tol, lang, 2, function (val) { tol = val; redraw(); }));
      redraw();
    }
  };

  /* ================================================================
   * 6. orientation — tilt a wall vs a fixed 90° zone
   * ================================================================ */
  W.orientation = {
    i18n: {
      en: {
        title: "Try it: perpendicularity explorer", badge: "interactive",
        sub: "The blue zone is held exactly 90° to datum A (it may slide sideways, never tilt). Tilt the wall and watch the deviation over its height. Tilt exaggerated ×10 for visibility.",
        tilt: "Wall tilt (°)", tol: "Perpendicularity tolerance",
        dev: "Deviation over 40 mm height", pass: "Within zone", fail: "Out of zone"
      },
      tr: {
        title: "Deneyin: diklik kaşifi", badge: "interaktif",
        sub: "Mavi bölge datum A'ya tam 90° tutulur (yana kayabilir, asla eğilemez). Duvarı eğin ve yüksekliği boyunca sapmayı izleyin. Eğim görünürlük için ×10 abartılmıştır.",
        tilt: "Duvar eğimi (°)", tol: "Diklik toleransı",
        dev: "40 mm yükseklikte sapma", pass: "Bölge içinde", fail: "Bölge dışında"
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "⟂", T.title, T.sub, T.badge);
      var H40 = 160, baseY = 200, wx = 170, S = H40 / 40; // px per mm of height
      var svg = svgEl(380, 240,
        '<line x1="20" y1="' + baseY + '" x2="360" y2="' + baseY + '" class="d-stroke" stroke-width="3"/>' +
        (function () { var s = ""; for (var x = 30; x < 360; x += 16) s += '<line x1="' + x + '" y1="' + baseY + '" x2="' + (x - 8) + '" y2="' + (baseY + 10) + '" class="d-soft" stroke-width="1"/>'; return s; })() +
        '<text x="185" y="228" font-size="13" font-weight="700">A</text>' +
        '<rect id="zone" y="' + (baseY - H40) + '" height="' + H40 + '" class="d-zone" stroke-dasharray="6 4" stroke-width="1.4"/>' +
        '<line id="wall" class="d-stroke" stroke-width="4" stroke-linecap="round"/>'
      );
      f.stage.appendChild(svg);
      var wall = svg.querySelector("#wall"), zone = svg.querySelector("#zone");
      var v = h("span", { class: "wverdict" }), dev = h("span");
      f.readout.appendChild(v); f.readout.appendChild(dev);
      var tilt = 0.1, tol = 0.1, EX = 10; // visual exaggeration
      function redraw() {
        var devMm = Math.abs(Math.tan(tilt * Math.PI / 180)) * 40; // over 40mm
        var topShift = Math.tan(tilt * Math.PI / 180) * EX * H40;  // exaggerated px
        wall.setAttribute("x1", wx); wall.setAttribute("y1", baseY);
        wall.setAttribute("x2", wx + topShift); wall.setAttribute("y2", baseY - H40);
        // zone floats: center it on the wall horizontally
        var zw = Math.max(6, tol * S * EX * 4); // visual width (same exaggeration feel)
        var cx = wx + topShift / 2;
        zone.setAttribute("x", cx - zw / 2); zone.setAttribute("width", zw);
        var ok = devMm <= tol + 1e-9;
        verdict(v, ok, T.pass, T.fail);
        dev.innerHTML = T.dev + ": <b>" + fmt(devMm, lang, 3) + "</b> / " + fmt(tol, lang, 2);
      }
      f.controls.appendChild(slider(T.tilt, -0.4, 0.4, 0.01, tilt, lang, 2, function (val) { tilt = val; redraw(); }));
      f.controls.appendChild(slider(T.tol, 0.02, 0.3, 0.01, tol, lang, 2, function (val) { tol = val; redraw(); }));
      redraw();
    }
  };

  /* ================================================================
   * 7. position — offsets + size + RFS/MMC bonus simulator
   * ================================================================ */
  W.position = {
    i18n: {
      en: {
        title: "Try it: position + bonus tolerance simulator", badge: "interactive",
        sub: "Hole ⌀10.0–10.3, position ⌀0.2 to A|B|C. Move the hole and change its size. Switch to Ⓜ and watch the zone grow as the hole departs from MMC — that growth is bonus tolerance.",
        dx: "Offset X", dy: "Offset Y", size: "Actual hole size",
        rfs: "RFS (no modifier)", mmc: "Ⓜ MMC",
        zone: "Allowed zone", devL: "Actual deviation", bonus: "Bonus",
        gauge: "Functional gauge pin ⌀9.8 fits", yes: "YES", no: "NO",
        pass: "In tolerance", fail: "Out of tolerance"
      },
      tr: {
        title: "Deneyin: pozisyon + bonus tolerans simülatörü", badge: "interaktif",
        sub: "Delik ⌀10,0–10,3, pozisyon A|B|C'ye ⌀0,2. Deliği kaydırın ve boyutunu değiştirin. Ⓜ'ye geçin ve delik MMC'den uzaklaştıkça bölgenin büyümesini izleyin — bu büyüme bonus toleranstır.",
        dx: "Kaçıklık X", dy: "Kaçıklık Y", size: "Gerçek delik boyutu",
        rfs: "RFS (modifiyesiz)", mmc: "Ⓜ MMC",
        zone: "İzin verilen bölge", devL: "Gerçek sapma", bonus: "Bonus",
        gauge: "Fonksiyonel mastar pimi ⌀9,8 giriyor", yes: "EVET", no: "HAYIR",
        pass: "Tolerans içinde", fail: "Tolerans dışında"
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "⌖", T.title, T.sub, T.badge);
      var S = 340, cx = 180, cy = 140;
      var svg = svgEl(380, 280,
        '<rect x="30" y="20" width="300" height="240" class="d-stroke" fill="none" stroke-width="2"/>' +
        '<line x1="' + (cx - 70) + '" y1="' + cy + '" x2="' + (cx + 70) + '" y2="' + cy + '" class="d-soft" stroke-dasharray="8 3 2 3" stroke-width="1"/>' +
        '<line x1="' + cx + '" y1="' + (cy - 70) + '" x2="' + cx + '" y2="' + (cy + 70) + '" class="d-soft" stroke-dasharray="8 3 2 3" stroke-width="1"/>' +
        '<circle id="zonec" cx="' + cx + '" cy="' + cy + '" class="d-zone" stroke-dasharray="5 4" stroke-width="1.6" style="transition:r .25s ease"/>' +
        '<circle id="holec" fill="none" class="d-stroke" stroke-width="2.4"/>' +
        '<circle id="axis" r="3.5" class="d-fill"/>'
      );
      f.stage.appendChild(svg);
      var zonec = svg.querySelector("#zonec"), holec = svg.querySelector("#holec"), axis = svg.querySelector("#axis");
      var st = { dx: 0.08, dy: 0.04, size: 10.15, mmc: true };
      var v = h("span", { class: "wverdict" }), zr = h("span"), dr = h("span"), br = h("span"), gr = h("span");
      [v, zr, dr, br, gr].forEach(function (x) { f.readout.appendChild(x); });

      var bRfs = h("button", { class: "btn secondary wbtn" }, T.rfs);
      var bMmc = h("button", { class: "btn secondary wbtn" }, T.mmc);
      function setMode(m) {
        st.mmc = m;
        bMmc.classList.toggle("wactive", m);
        bRfs.classList.toggle("wactive", !m);
        redraw();
      }
      bRfs.onclick = function () { setMode(false); };
      bMmc.onclick = function () { setMode(true); };
      f.controls.appendChild(bRfs); f.controls.appendChild(bMmc);
      f.controls.appendChild(slider(T.dx, -0.25, 0.25, 0.01, st.dx, lang, 2, function (val) { st.dx = val; redraw(); }));
      f.controls.appendChild(slider(T.dy, -0.25, 0.25, 0.01, st.dy, lang, 2, function (val) { st.dy = val; redraw(); }));
      f.controls.appendChild(slider(T.size, 10.0, 10.3, 0.01, st.size, lang, 2, function (val) { st.size = val; redraw(); }));

      function redraw() {
        var bonus = st.mmc ? (st.size - 10.0) : 0;
        var zone = 0.2 + bonus;
        var dev = 2 * Math.hypot(st.dx, st.dy);
        var x = cx + st.dx * S, y = cy - st.dy * S;
        zonec.setAttribute("r", zone / 2 * S);
        holec.setAttribute("cx", x); holec.setAttribute("cy", y);
        holec.setAttribute("r", (st.size / 2 - 4.95) * S * 0.55 + 38); // stylized
        axis.setAttribute("cx", x); axis.setAttribute("cy", y);
        var ok = dev <= zone + 1e-9;
        verdict(v, ok, T.pass, T.fail);
        zr.innerHTML = T.zone + ": <b>⌀" + fmt(zone, lang) + "</b>";
        dr.innerHTML = T.devL + ": <b>⌀" + fmt(dev, lang, 3) + "</b>";
        br.innerHTML = T.bonus + ": <b>" + (st.mmc ? fmt(bonus, lang) : "—") + "</b>";
        var gaugeOk = (st.size - dev) >= 9.8 - 1e-9;
        gr.innerHTML = T.gauge + ": <b>" + (gaugeOk ? T.yes : T.no) + "</b>";
      }
      setMode(true);
    }
  };

  /* ================================================================
   * 8. runout — rotating part + dial indicator (auto-animated)
   * ================================================================ */
  W.runout = {
    i18n: {
      en: {
        title: "Watch it: runout on a spinning part", badge: "animated",
        sub: "The part spins about datum axis A while a dial indicator rides on its surface. Off-center (eccentricity) and out-of-round (ovality) both move the needle — runout catches their combination.",
        ecc: "Eccentricity", oval: "Out-of-round", tol: "Runout tolerance",
        play: "▶ Play", pause: "⏸ Pause",
        fim: "FIM (full indicator movement)", pass: "Within tolerance", fail: "Out of tolerance"
      },
      tr: {
        title: "İzleyin: dönen parçada salgı", badge: "animasyonlu",
        sub: "Parça, datum ekseni A etrafında dönerken komparatör yüzeyde gezinir. Eksen kaçıklığı ve ovallik ibreyi birlikte oynatır — salgı ikisinin bileşimini yakalar.",
        ecc: "Eksen kaçıklığı", oval: "Ovallik", tol: "Salgı toleransı",
        play: "▶ Oynat", pause: "⏸ Duraklat",
        fim: "FIM (tam ibre hareketi)", pass: "Tolerans içinde", fail: "Tolerans dışında"
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "🔄", T.title, T.sub, T.badge);
      var cx = 190, cy = 170, R = 78, S = 260; // S: px per mm for defects
      var svg = svgEl(420, 300,
        '<line x1="40" y1="' + cy + '" x2="360" y2="' + cy + '" class="d-soft" stroke-dasharray="10 4 2 4" stroke-width="1.2"/>' +
        '<text x="365" y="' + (cy + 4) + '" font-size="12" font-weight="700">A</text>' +
        '<g id="rot"><path id="shape" class="d-stroke" fill="var(--accent)" fill-opacity="0.10" stroke-width="2.4"/>' +
        '<line id="mark" class="d-accent" stroke-width="1.6"/></g>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="3" class="d-fill"/>' +
        // indicator: stem + dial + needle
        '<line id="stem" x1="' + cx + '" y1="60" x2="' + cx + '" y2="30" class="d-stroke" stroke-width="2.4"/>' +
        '<path id="foot" class="d-stroke" stroke-width="3"/>' +
        '<circle cx="' + cx + '" cy="24" r="17" class="d-stroke" fill="var(--surface)" stroke-width="1.8"/>' +
        '<line id="needle" x1="' + cx + '" y1="24" x2="' + cx + '" y2="10" class="d-bad" stroke-width="1.8"/>' +
        '<circle cx="' + cx + '" cy="24" r="2" class="d-fill"/>'
      );
      f.stage.appendChild(svg);
      var rot = svg.querySelector("#rot"), shape = svg.querySelector("#shape"), mark = svg.querySelector("#mark");
      var needle = svg.querySelector("#needle"), stem = svg.querySelector("#stem"), foot = svg.querySelector("#foot");
      var vd = h("span", { class: "wverdict" }), fimEl = h("span"), cur = h("span");
      f.readout.appendChild(vd); f.readout.appendChild(fimEl); f.readout.appendChild(cur);
      var st = { e: 0.03, o: 0.02, tol: 0.1 };
      var theta = 0, playing = !reducedMotion, raf = null, last = null;

      function buildShape() {
        // cross-section in part frame, centered e to the right of rotation axis
        var pts = [];
        for (var i = 0; i <= 90; i++) {
          var psi = i / 90 * 2 * Math.PI;
          var r = R + st.o * S * Math.cos(2 * psi);
          var x = st.e * S + r * Math.cos(psi), y = r * Math.sin(psi);
          pts.push((i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1));
        }
        shape.setAttribute("d", pts.join(" ") + " Z");
        mark.setAttribute("x1", st.e * S); mark.setAttribute("y1", 0);
        mark.setAttribute("x2", st.e * S + R - st.o * S); mark.setAttribute("y2", 0);
        // FIM over a full rev (numeric)
        var min = 1e9, max = -1e9;
        for (var k = 0; k < 360; k++) {
          var t = k * Math.PI / 180;
          var d = reading(t);
          min = Math.min(min, d); max = Math.max(max, d);
        }
        var fim = (max - min) / S;
        var ok = fim <= st.tol + 1e-9;
        verdict(vd, ok, T.pass, T.fail);
        fimEl.innerHTML = T.fim + ": <b>" + fmt(fim, lang, 3) + "</b> / " + fmt(st.tol, lang, 2);
      }
      function reading(th) { // surface height above axis at the indicator (top), in px
        // top point ≈ e*sin? use vertical direction: part rotated by th; sample to find max y over shape
        var best = -1e9;
        for (var i = 0; i < 90; i++) {
          var psi = i / 90 * 2 * Math.PI;
          var r = R + st.o * S * Math.cos(2 * psi);
          var x = st.e * S + r * Math.cos(psi), y = r * Math.sin(psi);
          // rotate by th
          var yr = x * Math.sin(th) + y * Math.cos(th);
          var xr = x * Math.cos(th) - y * Math.sin(th);
          if (Math.abs(xr) < 26 && -yr > best) best = -yr; // top region near indicator
        }
        return best;
      }
      function drawFrame() {
        rot.setAttribute("transform", "translate(" + cx + " " + cy + ") rotate(" + (theta * 180 / Math.PI) + ")");
        var top = reading(theta);         // px above axis
        var surfY = cy - top;
        stem.setAttribute("y1", surfY - 4);
        foot.setAttribute("d", "M" + (cx - 9) + " " + (surfY - 3) + " L" + (cx + 9) + " " + (surfY - 3));
        var defl = (top - R) / S;         // mm deviation from nominal radius
        var maxD = st.e + st.o + 0.001;
        var ang = Math.max(-65, Math.min(65, defl / maxD * 65));
        needle.setAttribute("transform", "rotate(" + ang + " " + cx + " 24)");
        cur.innerHTML = "🕐 <b>" + fmt(defl, lang, 3) + "</b>";
      }
      function loop(t) {
        if (!last) last = t;
        theta += (t - last) / 1000 * 2.4; last = t;
        drawFrame();
        if (playing) raf = requestAnimationFrame(loop);
      }
      function setPlay(p) {
        playing = p; last = null;
        pb.textContent = p ? T.pause : T.play;
        if (p) raf = requestAnimationFrame(loop);
        else if (raf) cancelAnimationFrame(raf);
      }
      var pb = h("button", { class: "btn secondary wbtn" }, T.pause);
      pb.onclick = function () { setPlay(!playing); };
      f.controls.appendChild(pb);
      f.controls.appendChild(slider(T.ecc, 0, 0.08, 0.005, st.e, lang, 3, function (v) { st.e = v; buildShape(); drawFrame(); }));
      f.controls.appendChild(slider(T.oval, 0, 0.06, 0.005, st.o, lang, 3, function (v) { st.o = v; buildShape(); drawFrame(); }));
      f.controls.appendChild(slider(T.tol, 0.02, 0.3, 0.01, st.tol, lang, 2, function (v) { st.tol = v; buildShape(); }));
      buildShape(); drawFrame();
      setPlay(playing);
      cleanups.push(function () { playing = false; if (raf) cancelAnimationFrame(raf); });
    }
  };

  /* ================================================================
   * 9. profile — deform a surface inside the profile band
   * ================================================================ */
  W.profile = {
    i18n: {
      en: {
        title: "Try it: profile tolerance band", badge: "interactive",
        sub: "The band (blue) is two copies of the true profile offset ±t/2. Deform the real surface and see when it escapes the band.",
        dev: "Surface deviation", tol: "Profile tolerance (total)",
        max: "Max deviation from true profile", pass: "Inside the band", fail: "Escapes the band"
      },
      tr: {
        title: "Deneyin: profil tolerans bandı", badge: "interaktif",
        sub: "Bant (mavi), gerçek profilin ±t/2 ofsetlenmiş iki kopyasıdır. Gerçek yüzeyi deforme edin ve banttan ne zaman çıktığını görün.",
        dev: "Yüzey sapması", tol: "Profil toleransı (toplam)",
        max: "Gerçek profilden en büyük sapma", pass: "Bandın içinde", fail: "Banttan çıkıyor"
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "⌓", T.title, T.sub, T.badge);
      var S = 220, x0 = 25, L = 350;
      function trueY(t) { return 150 - 95 * Math.sin(Math.PI * (0.15 + 0.7 * t)); }
      function path(off, dev) {
        var p = [];
        for (var i = 0; i <= 70; i++) {
          var t = i / 70;
          var y = trueY(t) + off + (dev ? dev * S * Math.sin(t * 9.4 + 0.6) * Math.sin(Math.PI * t) : 0);
          p.push((i ? "L" : "M") + (x0 + t * L).toFixed(1) + " " + y.toFixed(1));
        }
        return p.join(" ");
      }
      var svg = svgEl(400, 190,
        '<path id="bt" class="d-accent" fill="none" stroke-dasharray="6 4" stroke-width="1.6"/>' +
        '<path id="bb" class="d-accent" fill="none" stroke-dasharray="6 4" stroke-width="1.6"/>' +
        '<path id="tp" class="d-soft" fill="none" stroke-dasharray="10 4 2 4" stroke-width="1.2"/>' +
        '<path id="act" class="d-stroke" fill="none" stroke-width="2.4"/>'
      );
      f.stage.appendChild(svg);
      var bt = svg.querySelector("#bt"), bb = svg.querySelector("#bb"), tp = svg.querySelector("#tp"), act = svg.querySelector("#act");
      var v = h("span", { class: "wverdict" }), mx = h("span");
      f.readout.appendChild(v); f.readout.appendChild(mx);
      var dev = 0.12, tol = 0.4;
      function redraw() {
        tp.setAttribute("d", path(0, 0));
        bt.setAttribute("d", path(-tol / 2 * S, 0));
        bb.setAttribute("d", path(tol / 2 * S, 0));
        act.setAttribute("d", path(0, dev));
        var ok = dev <= tol / 2 + 1e-9;
        verdict(v, ok, T.pass, T.fail);
        mx.innerHTML = T.max + ": <b>±" + fmt(dev, lang) + "</b> / ±" + fmt(tol / 2, lang);
      }
      f.controls.appendChild(slider(T.dev, 0, 0.4, 0.01, dev, lang, 2, function (val) { dev = val; redraw(); }));
      f.controls.appendChild(slider(T.tol, 0.1, 0.8, 0.05, tol, lang, 2, function (val) { tol = val; redraw(); }));
      redraw();
    }
  };

  /* ================================================================
   * 11. datumPick — assign A/B/C to the surfaces of a bracket
   * ================================================================ */
  W.datumPick = {
    i18n: {
      en: {
        title: "Design task: choose the datums", badge: "interactive",
        sub: "This bracket is bolted to a machine base on its large face, slides along a guide rail on its long edge, and is pushed against a stop on its short edge. Click the features in the order you would reference them: first click = datum A, then B, then C.",
        face: "mounting face (4 bolts)", rail: "guide rail", railEdge: "long edge on rail",
        stop: "stop", stopEdge: "short edge on stop", hole: "⌀4 cosmetic hole",
        reset: "Reset",
        fb: {
          faceA: "✓ A — the bolted face carries the part: largest, most stable contact (3 points). The natural primary.",
          faceX: "✗ The mounting face is the foundation the part sits on — it should be primary (A), not {L}.",
          railB: "✓ B — the rail edge guides the part with 2 points of contact: exactly what a secondary datum does.",
          railA: "✗ An edge cannot seat the part stably. Primary should be the large bolted face (3 points), the rail edge fits secondary.",
          railC: "✗ The rail edge constrains 2 degrees of freedom — it deserves secondary (B), not tertiary.",
          stopC: "✓ C — the stop touches at 1 point and removes the last degree of freedom: a textbook tertiary datum.",
          stopX: "✗ The stop edge offers only 1 point of contact — it can only ever be the tertiary datum (C).",
          holeX: "✗ That hole touches nothing in the assembly. A feature that doesn't locate the part makes a poor datum."
        },
        allOk: "Perfect DRF — |A|B|C| copies exactly how the part is located: 3 points + 2 points + 1 point. Your fixture designs itself.",
        someBad: "Not quite — datum order must copy how the part is actually located in the assembly. Press Reset and try again."
      },
      tr: {
        title: "Tasarım görevi: datumları seçin", badge: "interaktif",
        sub: "Bu braket geniş yüzeyinden makine gövdesine cıvatalanıyor, uzun kenarı bir kızak boyunca kayıyor ve kısa kenarı bir dayamaya yaslanıyor. Unsurlara referans vereceğiniz sırayla tıklayın: ilk tıklama = datum A, sonra B, sonra C.",
        face: "montaj yüzeyi (4 cıvata)", rail: "kızak", railEdge: "kızağa yaslanan uzun kenar",
        stop: "dayama", stopEdge: "dayamaya yaslanan kısa kenar", hole: "⌀4 kozmetik delik",
        reset: "Sıfırla",
        fb: {
          faceA: "✓ A — cıvatalanan yüzey parçayı taşır: en büyük, en kararlı temas (3 nokta). Doğal birincil datum.",
          faceX: "✗ Montaj yüzeyi parçanın oturduğu temeldir — {L} değil, birincil (A) olmalıdır.",
          railB: "✓ B — kızak kenarı parçayı 2 temas noktasıyla yönlendirir: ikincil datumun tam görevi.",
          railA: "✗ Bir kenar parçayı kararlı şekilde oturtamaz. Birincil, geniş cıvatalı yüzey (3 nokta) olmalı; kızak kenarı ikincile uygundur.",
          railC: "✗ Kızak kenarı 2 serbestlik derecesini kısıtlar — üçüncül değil, ikincil (B) olmayı hak eder.",
          stopC: "✓ C — dayama 1 noktadan temas eder ve son serbestlik derecesini alır: ders kitabı gibi bir üçüncül datum.",
          stopX: "✗ Dayama kenarı yalnızca 1 temas noktası sunar — ancak üçüncül datum (C) olabilir.",
          holeX: "✗ O delik montajda hiçbir şeye temas etmiyor. Parçayı konumlandırmayan bir unsur kötü bir datumdur."
        },
        allOk: "Mükemmel DRF — |A|B|C| parçanın konumlanma şeklini birebir kopyalıyor: 3 nokta + 2 nokta + 1 nokta. Fikstürünüz kendini tasarlıyor.",
        someBad: "Tam değil — datum sırası, parçanın montajda gerçekte nasıl konumlandığını kopyalamalıdır. Sıfırla'ya basıp yeniden deneyin."
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "📐", T.title, T.sub, T.badge);
      var svg = svgEl(460, 300,
        // rail (hatched strip along bottom long edge)
        '<rect x="80" y="228" width="300" height="14" fill="none" class="d-soft" stroke-width="1.2"/>' +
        Array.apply(null, Array(15)).map(function (_, i) {
          var x = 84 + i * 20;
          return '<line x1="' + x + '" y1="242" x2="' + (x + 10) + '" y2="228" class="d-soft" stroke-width="1"/>';
        }).join("") +
        '<text x="230" y="262" font-size="11" text-anchor="middle" class="d-softtext">' + T.rail + "</text>" +
        // stop block on the short (left) edge
        '<rect x="46" y="100" width="18" height="80" fill="none" class="d-soft" stroke-width="1.2"/>' +
        '<line x1="46" y1="180" x2="64" y2="100" class="d-soft" stroke-width="1"/>' +
        '<text x="55" y="94" font-size="11" text-anchor="middle" class="d-softtext">' + T.stop + "</text>" +
        // plate
        '<rect x="80" y="50" width="300" height="170" fill="none" class="d-stroke" stroke-width="2"/>' +
        // bolts on the face
        [[130, 85], [330, 85], [130, 185], [330, 185]].map(function (p) {
          return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="none" class="d-soft" stroke-width="1.4"/>' +
            '<line x1="' + (p[0] - 5) + '" y1="' + (p[1] - 5) + '" x2="' + (p[0] + 5) + '" y2="' + (p[1] + 5) + '" class="d-soft" stroke-width="1"/>' +
            '<line x1="' + (p[0] + 5) + '" y1="' + (p[1] - 5) + '" x2="' + (p[0] - 5) + '" y2="' + (p[1] + 5) + '" class="d-soft" stroke-width="1"/>';
        }).join("") +
        // decoy hole
        '<circle cx="305" cy="130" r="7" fill="none" class="d-stroke" stroke-width="1.6"/>' +
        '<text x="305" y="115" font-size="10" text-anchor="middle" class="d-softtext">' + T.hole + "</text>" +
        // clickable hit areas
        '<rect id="hit-face" x="105" y="105" width="150" height="70" class="d-zone" rx="8" style="cursor:pointer"/>' +
        '<text x="180" y="145" font-size="11" text-anchor="middle" class="d-softtext" pointer-events="none">' + T.face + "</text>" +
        '<rect id="hit-rail" x="80" y="210" width="300" height="16" class="d-zone" style="cursor:pointer"/>' +
        '<text x="230" y="205" font-size="10" text-anchor="middle" class="d-softtext" pointer-events="none">' + T.railEdge + "</text>" +
        '<rect id="hit-stop" x="72" y="50" width="16" height="170" class="d-zone" style="cursor:pointer"/>' +
        '<rect id="hit-hole" x="291" y="116" width="28" height="28" fill="transparent" style="cursor:pointer"/>' +
        // datum flag slots (filled on click)
        '<g id="flags"></g>'
      );
      f.stage.appendChild(svg);
      var flags = svg.querySelector("#flags");
      var fbList = h("div", { class: "wfb" });
      var v = h("span", { class: "wverdict" });
      f.readout.appendChild(v);
      c.appendChild(fbList);
      var bReset = h("button", { class: "btn ghost wbtn" }, T.reset);
      f.controls.appendChild(bReset);

      var flagPos = { face: [180, 168], rail: [395, 218], stop: [80, 38], hole: [330, 130] };
      var picks;
      function reset() {
        picks = [];
        flags.innerHTML = "";
        fbList.innerHTML = "";
        v.className = "wverdict"; v.textContent = "";
        ["face", "rail", "stop", "hole"].forEach(function (k) {
          var el = svg.querySelector("#hit-" + k);
          el.setAttribute("class", "d-zone");
          el.style.cursor = "pointer";
        });
      }
      function feedback(key, L) {
        var fb = T.fb, ok, msg;
        if (key === "face") { ok = L === "A"; msg = ok ? fb.faceA : fb.faceX.replace("{L}", L); }
        else if (key === "rail") { ok = L === "B"; msg = L === "B" ? fb.railB : (L === "A" ? fb.railA : fb.railC); }
        else if (key === "stop") { ok = L === "C"; msg = ok ? fb.stopC : fb.stopX; }
        else { ok = false; msg = fb.holeX; }
        return { ok: ok, msg: "<b>" + L + ":</b> " + msg };
      }
      function pick(key) {
        if (picks.length >= 3 || picks.some(function (p) { return p.key === key; })) return;
        var L = ["A", "B", "C"][picks.length];
        var r = feedback(key, L);
        picks.push({ key: key, ok: r.ok });
        var p = flagPos[key];
        flags.innerHTML +=
          '<g><rect x="' + (p[0] - 11) + '" y="' + (p[1] - 11) + '" width="22" height="22" fill="none" class="' + (r.ok ? "d-good" : "d-bad") + '" stroke-width="2"/>' +
          '<text x="' + p[0] + '" y="' + (p[1] + 5) + '" font-size="13" font-weight="700" text-anchor="middle">' + L + "</text></g>";
        var hit = svg.querySelector("#hit-" + key);
        hit.setAttribute("class", r.ok ? "d-good" : "d-bad");
        hit.setAttribute("fill", "none"); hit.setAttribute("stroke-width", "2");
        hit.style.cursor = "default";
        var line = h("div", { class: "wfb-line " + (r.ok ? "pass" : "fail") }, r.msg);
        fbList.appendChild(line);
        if (picks.length === 3) {
          var all = picks.every(function (x) { return x.ok; });
          verdict(v, all, T.allOk, T.someBad);
        }
      }
      ["face", "rail", "stop", "hole"].forEach(function (k) {
        svg.querySelector("#hit-" + k).addEventListener("click", function () { pick(k); });
      });
      bReset.addEventListener("click", reset);
      reset();
    }
  };

  /* ================================================================
   * 12. fastener — floating / fixed fastener formula calculator
   * ================================================================ */
  W.fastener = {
    i18n: {
      en: {
        title: "Fastener formula calculator", badge: "interactive",
        sub: "The designer's most-used calculation: how much position tolerance can the clearance holes get? Set the fastener and hole MMC sizes, and switch between a floating joint (bolt + nut through two clearance holes) and a fixed one (fastener threaded or pressed into the second part).",
        floating: "Floating (bolt + nut)", fixed: "Fixed (threaded)",
        fLab: "Fastener MMC ⌀F", hLab: "Hole MMC ⌀H",
        formula: "Formula", perPart: "Position tolerance for each part",
        clr: "clearance / side",
        bad: "H ≤ F — the fastener cannot pass through even a perfectly positioned hole!",
        use: "Use on each part's hole pattern:",
        note: "Fixed joints halve the tolerance: the fastener is anchored in one part, so only the clearance holes can absorb error."
      },
      tr: {
        title: "Bağlantı elemanı formül hesaplayıcısı", badge: "interaktif",
        sub: "Tasarımcının en çok kullandığı hesap: boşluk deliklerine ne kadar pozisyon toleransı verilebilir? Cıvata ve delik MMC boyutlarını ayarlayın; yüzer bağlantı (iki boşluk deliğinden geçen cıvata + somun) ile sabit bağlantı (ikinci parçaya vidalanan/çakılan eleman) arasında geçiş yapın.",
        floating: "Yüzer (cıvata + somun)", fixed: "Sabit (dişli)",
        fLab: "Eleman MMC ⌀F", hLab: "Delik MMC ⌀H",
        formula: "Formül", perPart: "Her parça için pozisyon toleransı",
        clr: "boşluk / kenar",
        bad: "H ≤ F — eleman, mükemmel konumlanmış delikten bile geçemez!",
        use: "Her parçanın delik grubunda kullanın:",
        note: "Sabit bağlantılar toleransı yarıya indirir: eleman bir parçaya sabitlendiği için hatayı yalnızca boşluk delikleri karşılayabilir."
      }
    },
    mount: function (c, T, lang) {
      var f = frame(c, "🔩", T.title, T.sub, T.badge);
      var mode = "floating", F = 6.0, Hh = 6.6;
      var stageDiv = h("div");
      f.stage.appendChild(stageDiv);

      var bFloat = h("button", { class: "btn secondary wbtn" }, T.floating);
      var bFixed = h("button", { class: "btn secondary wbtn" }, T.fixed);
      f.controls.appendChild(bFloat); f.controls.appendChild(bFixed);

      var formulaEl = h("span"), tolEl = h("span", { class: "wverdict" });
      f.readout.appendChild(formulaEl); f.readout.appendChild(tolEl);
      var useEl = h("div", { class: "wfcf-use" });
      var noteEl = h("div", { class: "waha" });
      c.appendChild(useEl); c.appendChild(noteEl);

      function draw() {
        var S = 16, cx = 220, hw = Hh * S / 2, fw = F * S / 2;
        var topY = 78, midY = 132, botY = 186;
        var botHw = mode === "floating" ? hw : fw;
        var inner =
          // plates (each as two rects leaving the hole gap)
          '<rect x="40" y="' + topY + '" width="' + (cx - hw - 40) + '" height="' + (midY - topY) + '" class="d-softfill" fill-opacity=".28"/>' +
          '<rect x="' + (cx + hw) + '" y="' + topY + '" width="' + (400 - cx - hw) + '" height="' + (midY - topY) + '" class="d-softfill" fill-opacity=".28"/>' +
          '<rect x="40" y="' + midY + '" width="' + (cx - botHw - 40) + '" height="' + (botY - midY) + '" class="d-softfill" fill-opacity=".45"/>' +
          '<rect x="' + (cx + botHw) + '" y="' + midY + '" width="' + (400 - cx - botHw) + '" height="' + (botY - midY) + '" class="d-softfill" fill-opacity=".45"/>' +
          '<line x1="40" y1="' + midY + '" x2="400" y2="' + midY + '" class="d-soft" stroke-width="1"/>' +
          // bolt: head + shaft (+ nut when floating, threads when fixed)
          '<rect x="' + (cx - fw * 1.7) + '" y="52" width="' + fw * 3.4 + '" height="26" class="d-accentfill" fill-opacity=".85"/>' +
          '<rect x="' + (cx - fw) + '" y="78" width="' + fw * 2 + '" height="' + ((mode === "floating" ? botY + 14 : botY) - 78) + '" class="d-accentfill" fill-opacity=".7"/>' +
          (mode === "floating"
            ? '<rect x="' + (cx - fw * 1.7) + '" y="' + (botY + 14) + '" width="' + fw * 3.4 + '" height="20" class="d-accentfill" fill-opacity=".85"/>'
            : Array.apply(null, Array(5)).map(function (_, i) {
                var y = midY + 8 + i * 9;
                return '<line x1="' + (cx - fw - 4) + '" y1="' + y + '" x2="' + (cx + fw + 4) + '" y2="' + (y - 5) + '" class="d-accent" stroke-width="1.2"/>';
              }).join("")) +
          // clearance annotation on the top plate
          '<line x1="' + (cx + fw) + '" y1="' + (topY + 16) + '" x2="' + (cx + hw) + '" y2="' + (topY + 16) + '" class="d-bad" stroke-width="2"/>' +
          '<text x="' + (cx + hw + 8) + '" y="' + (topY + 20) + '" font-size="11" class="d-softtext">' + fmt((Hh - F) / 2, lang) + " " + T.clr + "</text>" +
          '<text x="60" y="' + (topY - 8) + '" font-size="11" class="d-softtext">⌀H = ' + fmt(Hh, lang, 1) + "</text>" +
          '<text x="60" y="' + (botY + 30) + '" font-size="11" class="d-softtext">⌀F = ' + fmt(F, lang, 1) + "</text>";
        stageDiv.innerHTML = "";
        stageDiv.appendChild(svgEl(440, 240, inner));

        var t = mode === "floating" ? Hh - F : (Hh - F) / 2;
        formulaEl.innerHTML = T.formula + ": <b>" + (mode === "floating" ? "T = H − F" : "T = (H − F) / 2") + "</b>";
        if (t <= 0) {
          verdict(tolEl, false, "", T.bad);
          useEl.innerHTML = "";
        } else {
          verdict(tolEl, true, T.perPart + ": ⌀" + fmt(t, lang), "");
          useEl.innerHTML = T.use + " " + GDT_SVG.fcf([[{ sym: "position" }], [{ sym: "diameter" }, fmt(t, lang), { mod: "M" }], ["A"], ["B"], ["C"]]);
        }
        noteEl.textContent = mode === "fixed" ? T.note : "";
        bFloat.classList.toggle("wactive", mode === "floating");
        bFixed.classList.toggle("wactive", mode === "fixed");
      }
      bFloat.addEventListener("click", function () { mode = "floating"; draw(); });
      bFixed.addEventListener("click", function () { mode = "fixed"; draw(); });
      f.controls.appendChild(slider(T.fLab, 4, 10, 0.1, F, lang, 1, function (v) { F = v; draw(); }));
      f.controls.appendChild(slider(T.hLab, 4, 12, 0.1, Hh, lang, 1, function (v) { Hh = v; draw(); }));
      draw();
    }
  };

  /* ---------- mounting ---------- */
  window.GDT_WIDGETS = {
    mountAll: function (root, lang) {
      cleanups.forEach(function (fn) { try { fn(); } catch (e) {} });
      cleanups = [];
      root.querySelectorAll("[data-widget]").forEach(function (el) {
        var w = W[el.dataset.widget];
        if (!w) return;
        try { w.mount(el, w.i18n[lang] || w.i18n.en, lang); }
        catch (e) { if (window.console) console.error("widget " + el.dataset.widget, e); }
      });
    }
  };
})();
