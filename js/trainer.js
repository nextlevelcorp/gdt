/* ===== GD&T Academy — trainer.js =====
 * "Plastic Design Bench": a hands-on, visual, 3D studio (no quizzes).
 * Each station is an interactive rig where you manipulate real design
 * parameters on an orbitable 3D plastic part (drag to rotate) and watch
 * the consequence live — sink marks, ejection scuffs, thermal collisions,
 * over-constraint warp, and fastener position zones.
 * app.js routes #/trainer here via GDT_TRAINER.mount(container, lang).
 */
(function () {
  "use strict";

  /* ---------------- tiny DOM + math helpers ---------------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function fmt(n, lang, dp) {
    var s = (+n).toFixed(dp == null ? 2 : dp);
    return lang === "tr" ? s.replace(".", ",") : s;
  }
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // active rAF loops / global listeners to tear down on any re-render
  var cleanups = [];
  function runCleanups() { cleanups.forEach(function (f) { try { f(); } catch (e) {} }); cleanups = []; }

  /* ---------------- 3D primitives (pure CSS transforms) ---------------- */
  // Build a 6-face box centred on the scene origin. Returns the element with
  // .faces {front,back,left,right,top,bottom} and .place(x,y,z[,extra]).
  function makeBox(w, h, d, cls) {
    var b = el("div", "b3d " + (cls || ""));
    b.style.width = w + "px"; b.style.height = h + "px";
    b.style.left = (-w / 2) + "px"; b.style.top = (-h / 2) + "px";
    var faces = {};
    function face(fw, fh, tf, name) {
      var f = el("div", "b3d-face f-" + name);
      f.style.width = fw + "px"; f.style.height = fh + "px";
      f.style.left = ((w - fw) / 2) + "px"; f.style.top = ((h - fh) / 2) + "px";
      f.style.transform = tf;
      b.appendChild(f); faces[name] = f; return f;
    }
    face(w, h, "translateZ(" + (d / 2) + "px)", "front");
    face(w, h, "translateZ(" + (-d / 2) + "px) rotateY(180deg)", "back");
    face(d, h, "rotateY(90deg) translateZ(" + (w / 2) + "px)", "right");
    face(d, h, "rotateY(-90deg) translateZ(" + (w / 2) + "px)", "left");
    face(w, d, "rotateX(90deg) translateZ(" + (h / 2) + "px)", "top");
    face(w, d, "rotateX(-90deg) translateZ(" + (h / 2) + "px)", "bottom");
    b.faces = faces;
    b.place = function (x, y, z, extra) {
      b.style.transform = "translate3d(" + (x || 0) + "px," + (y || 0) + "px," + (z || 0) + "px)" + (extra ? " " + extra : "");
    };
    b.place(0, 0, 0);
    return b;
  }

  // A scene you can orbit by dragging. Returns { scene, get:()=>{rx,ry} }.
  function scene3d(stage, rx, ry) {
    var host = el("div", "st3d");
    var scene = el("div", "st3d-scene");
    host.appendChild(scene); stage.appendChild(host);
    var hint = el("div", "st3d-hint", "⟳");
    host.appendChild(hint);
    var st = { rx: rx == null ? -22 : rx, ry: ry == null ? -32 : ry, d: false, x: 0, y: 0 };
    function apply() { scene.style.transform = "rotateX(" + st.rx + "deg) rotateY(" + st.ry + "deg)"; }
    apply();
    function P(e) { var t = e.touches && e.touches[0]; return { x: t ? t.clientX : e.clientX, y: t ? t.clientY : e.clientY }; }
    function down(e) { st.d = true; var p = P(e); st.x = p.x; st.y = p.y; host.classList.add("grabbing"); host.classList.add("touched"); }
    function move(e) {
      if (!st.d) return;
      var p = P(e);
      st.ry += (p.x - st.x) * 0.55;
      st.rx = clamp(st.rx - (p.y - st.y) * 0.55, -88, 88);
      st.x = p.x; st.y = p.y; apply();
      if (e.cancelable) e.preventDefault();
    }
    function up() { st.d = false; host.classList.remove("grabbing"); }
    host.addEventListener("mousedown", down);
    host.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    cleanups.push(function () {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    });
    return { scene: scene, host: host };
  }

  /* ---------------- control builders ---------------- */
  function slider(label, min, max, step, val, lang, dp, cb) {
    var w = el("div", "wctl");
    var l = el("label");
    l.appendChild(el("span", null, label));
    var v = el("span", "wval", fmt(val, lang, dp));
    l.appendChild(v);
    var i = el("input"); i.type = "range"; i.min = min; i.max = max; i.step = step; i.value = val;
    i.addEventListener("input", function () {
      v.textContent = fmt(parseFloat(i.value), lang, dp);
      cb(parseFloat(i.value));
    });
    w.appendChild(l); w.appendChild(i);
    return { el: w, get: function () { return parseFloat(i.value); }, set: function (x) { i.value = x; v.textContent = fmt(x, lang, dp); } };
  }
  function seg(options, initial, cb) {
    var w = el("div", "studio-seg");
    var buttons = [];
    options.forEach(function (o) {
      var b = el("button", "studio-seg-btn" + (o.k === initial ? " on" : ""), o.label);
      b.onclick = function () {
        buttons.forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        cb(o.k);
      };
      buttons.push(b); w.appendChild(b);
    });
    return { el: w };
  }
  function verdict(node, ok, text) {
    node.className = "studio-verdict " + (ok ? "pass" : "fail");
    node.innerHTML = (ok ? "✓ " : "✗ ") + text;
  }
  function warnV(node, text) { node.className = "studio-verdict warn"; node.innerHTML = "⚠ " + text; }

  function readout(pairs) {
    var w = el("div", "studio-readout");
    pairs.forEach(function (p) {
      var r = el("div", "studio-rd");
      r.appendChild(el("span", "studio-rd-k", p[0]));
      var v = el("span", "studio-rd-v", p[1]);
      r.appendChild(v); w.appendChild(r); r._v = v;
    });
    w.set = function (i, val) { if (w.children[i]) w.children[i].lastChild.textContent = val; };
    return w;
  }
  function svgWrap(inner, w, h) {
    var d = el("div", "diagram studio-svg");
    d.innerHTML = '<svg viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '">' + inner + "</svg>";
    return d;
  }

  /* ======================================================================
   *  STATIONS
   * ==================================================================== */
  var STATIONS = [];

  /* ---- Station 1 — Section & Sink -------------------------------------- */
  STATIONS.push({
    id: "sink", icon: "🧱",
    name: { en: "Section & Sink", tr: "Kesit & Çöküntü" },
    goal: {
      en: "Add a stiffening rib behind a painted class-A surface — without printing a sink mark through the paint. Drag to orbit; find the thickness that stays invisible.",
      tr: "Boyalı A-yüzeyin arkasına rijitlik federi ekle — boyanın içinden çöküntü izi bastırmadan. Döndürmek için sürükle; görünmez kalan kalınlığı bul."
    },
    principle: {
      en: "A rib thicker than ~60% of the wall it joins forms a heavy junction that cools slowly, shrinks more, and pulls a sink mark into the opposite (visible) face. Thin ribs, radii and coring keep the show surface flat — on plastics, section management <em>is</em> surface quality.",
      tr: "Birleştiği duvarın ~%60'ından kalın bir feder, yavaş soğuyan, daha çok çeken ve karşı (görünür) yüze çöküntü izi çeken ağır bir kavşak oluşturur. İnce federler, radyüsler ve boşaltma görünür yüzü düz tutar — plastikte kesit yönetimi <em>yüzey kalitesinin ta kendisidir.</em>"
    },
    build: function (stage, side, lang) {
      var s3 = scene3d(stage, -18, -34), scene = s3.scene;
      var slabW = 210, slabH = 148;
      var wall = 2.5, ribPct = 55;

      var slab = makeBox(slabW, slabH, 44, "part-slab");
      var sink = el("div", "sink-mark"); slab.faces.front.appendChild(sink);
      var ribD = 60;
      var rib = makeBox(1, 108, ribD, "part-rib");
      scene.appendChild(rib); scene.appendChild(slab);

      var xsec = svgWrap("", 260, 150);
      stage.appendChild(xsec);

      var out = readout([["", ""], ["", ""], ["", ""], ["", ""]]);
      var vv = el("div", "studio-verdict");
      var t = lang === "tr"
        ? { wall: "Duvar kalınlığı", rib: "Feder kalınlığı (duvarın %'si)", ribmm: "Feder = ", mass: "Kavşak kütlesi", sink: "Çöküntü derinliği", pass: "Feder duvarın %{p}'i (≤ %60) → A-yüzey düz kalır.", fail: "Feder %{p} > %60 → ~{s} µm çöküntü boyanın içinden görünür.", warn: "Feder %{p} > %60 → çöküntü izi başlıyor.", um: " µm", showlabel: "A-YÜZEY (boyalı)", riblabel: "feder", hot: "sıcak nokta" }
        : { wall: "Wall thickness", rib: "Rib thickness (% of wall)", ribmm: "Rib = ", mass: "Junction mass", sink: "Sink depth", pass: "Rib is {p}% of wall (≤ 60%) → show surface stays flat.", fail: "Rib {p}% > 60% → ~{s} µm sink telegraphs through the paint.", warn: "Rib {p}% > 60% → sink mark beginning.", um: " µm", showlabel: "CLASS-A (painted)", riblabel: "rib", hot: "hot spot" };

      function recompute() {
        var ribT = wall * ribPct / 100;          // mm
        var over = Math.max(0, ribPct - 60);
        var sinkUm = over * 3.0 * (wall / 2.5);   // schematic
        // 3D display sizes (decoupled from metric scale so it reads as a thin panel)
        var wallPx = 22 + wall * 9;               // panel thickness
        var ribPx = 8 + ribPct * 0.48;            // rib fin thickness, grows with %
        rebuildDepth(slab, slabW, slabH, wallPx);
        rebuildDepth(rib, ribPx, 108, ribD);
        rib.place(0, 8, -(wallPx / 2 + ribD / 2));
        var op = clamp(sinkUm / 130, 0, 0.82);
        sink.style.opacity = op;
        sink.style.width = sink.style.height = clamp(ribPx * 2.4, 60, 190) + "px";
        // cross-section (exact geometry, in mm)
        xsec.querySelector("svg").innerHTML = xsecSink(wall, ribT, over, t);
        // readout + verdict
        out.set(0, fmt(wall, lang, 1) + " mm");
        out.set(1, fmt(ribT, lang, 2) + " mm");
        out.set(2, fmt(1 + over / 40, lang, 2) + "×");
        out.set(3, fmt(sinkUm, lang, 0) + t.um);
        var p = Math.round(ribPct);
        if (ribPct <= 60) verdict(vv, true, t.pass.replace("{p}", p));
        else if (sinkUm < 20) warnV(vv, t.warn.replace("{p}", p));
        else verdict(vv, false, t.fail.replace("{p}", p).replace("{s}", Math.round(sinkUm)));
      }

      var sWall = slider(t.wall, 1.5, 4, 0.1, wall, lang, 1, function (v) { wall = v; recompute(); });
      var sRib = slider(t.rib, 30, 120, 1, ribPct, lang, 0, function (v) { ribPct = v; recompute(); });
      side.appendChild(sWall.el); side.appendChild(sRib.el);
      side.appendChild(vv); side.appendChild(out);
      recompute();
    }
  });

  function xsecSink(wmm, rmm, over, t) {
    var W = 260, H = 150, cx = 130, wallY = 46, wallH = Math.max(8, wmm * 14), wallX0 = 24, wallX1 = 236;
    var ribW = Math.max(8, rmm * 14), ribX0 = cx - ribW / 2, ribX1 = cx + ribW / 2, ribBot = 132;
    var mass = Math.max(6, (over) * 0.5 + Math.min(wallH, ribW) * 0.55);
    var dip = Math.min(12, over * 0.35);
    var showY = wallY;
    var s = "";
    // show surface (top) with a dip when sinking
    s += '<text x="' + cx + '" y="16" text-anchor="middle" class="d-softtext" font-size="10">' + t.showlabel + "</text>";
    var mid = dip > 0.5
      ? "M" + wallX0 + " " + showY + " L" + (cx - 40) + " " + showY + " Q" + cx + " " + (showY + dip * 2) + " " + (cx + 40) + " " + showY + " L" + wallX1 + " " + showY
      : "M" + wallX0 + " " + showY + " L" + wallX1 + " " + showY;
    s += '<path d="' + mid + '" class="d-stroke" fill="none" stroke-width="2.2"/>';
    // wall body
    s += '<path d="M' + wallX0 + " " + (showY + wallH) + " L" + wallX1 + " " + (showY + wallH) + '" class="d-soft" fill="none" stroke-width="1.4"/>';
    s += '<rect x="' + wallX0 + '" y="' + showY + '" width="' + (wallX1 - wallX0) + '" height="' + wallH + '" class="d-zone" opacity=".35"/>';
    // rib going down
    s += '<rect x="' + ribX0 + '" y="' + (showY + wallH) + '" width="' + ribW + '" height="' + (ribBot - showY - wallH) + '" class="d-zone" opacity=".5"/>';
    s += '<line x1="' + ribX0 + '" y1="' + (showY + wallH) + '" x2="' + ribX0 + '" y2="' + ribBot + '" class="d-soft" stroke-width="1.2"/>';
    s += '<line x1="' + ribX1 + '" y1="' + (showY + wallH) + '" x2="' + ribX1 + '" y2="' + ribBot + '" class="d-soft" stroke-width="1.2"/>';
    s += '<text x="' + cx + '" y="' + (ribBot + 12) + '" text-anchor="middle" class="d-softtext" font-size="10">' + t.riblabel + "</text>";
    // hot-spot inscribed circle at junction
    var jy = showY + wallH + 2;
    s += '<circle cx="' + cx + '" cy="' + jy + '" r="' + mass + '" fill="none" stroke-dasharray="3 3" class="' + (over > 0 ? "d-bad" : "d-good") + '" stroke-width="1.6"/>';
    if (over > 0) s += '<text x="' + (cx + mass + 6) + '" y="' + (jy + 3) + '" class="d-softtext" font-size="9">' + t.hot + "</text>";
    return s;
  }
  // rebuild a box's face sizes when a dimension changes (depth/width live-edited)
  function rebuildDepth(box, w, h, d) {
    box.style.width = w + "px"; box.style.height = h + "px";
    box.style.left = (-w / 2) + "px"; box.style.top = (-h / 2) + "px";
    var f = box.faces;
    setFace(f.front, w, h, ((w - w) / 2), ((h - h) / 2), "translateZ(" + (d / 2) + "px)");
    setFace(f.back, w, h, 0, 0, "translateZ(" + (-d / 2) + "px) rotateY(180deg)");
    setFace(f.right, d, h, (w - d) / 2, 0, "rotateY(90deg) translateZ(" + (w / 2) + "px)");
    setFace(f.left, d, h, (w - d) / 2, 0, "rotateY(-90deg) translateZ(" + (w / 2) + "px)");
    setFace(f.top, w, d, 0, (h - d) / 2, "rotateX(90deg) translateZ(" + (h / 2) + "px)");
    setFace(f.bottom, w, d, 0, (h - d) / 2, "rotateX(-90deg) translateZ(" + (h / 2) + "px)");
  }
  function setFace(f, fw, fh, lx, ty, tf) {
    f.style.width = fw + "px"; f.style.height = fh + "px";
    f.style.left = lx + "px"; f.style.top = ty + "px"; f.style.transform = tf;
  }

  /* ---- Station 2 — Draft & Ejection ------------------------------------ */
  STATIONS.push({
    id: "draft", icon: "📐",
    name: { en: "Draft & Ejection", tr: "Çekme Açısı & İtme" },
    goal: {
      en: "Give the molded cup enough draft to eject cleanly. Textured (grained) walls need more. Set the angle, then press EJECT and watch it lift free — or drag and scuff.",
      tr: "Kalıplanan kaba temiz çıkacak kadar çekme açısı ver. Desenli (grenli) duvarlar daha fazla ister. Açıyı ayarla, sonra ÇIKAR'a bas ve serbestçe kalkmasını izle — ya da sürtüp çizilmesini."
    },
    principle: {
      en: "Zero-draft walls grab the core and drag on ejection. A texture is thousands of tiny undercuts, so it adds required draft — roughly +1° per 0.025 mm of grain depth. Too little draft and the ejectors scuff the surface or stress-whiten the part. Draft is decided on day one, not after the tool is cut.",
      tr: "Sıfır eğimli duvarlar maçayı kavrar ve itmede sürter. Desen binlerce minik alttan kesmedir; gereken eğimi artırır — kabaca her 0,025 mm gren derinliği için +1°. Yetersiz eğimde iticiler yüzeyi çizer ya da parçayı gerilmeyle beyazlatır. Eğim ilk gün kararlaştırılır, takım kesildikten sonra değil."
    },
    build: function (stage, side, lang) {
      var s3 = scene3d(stage, -12, -28), scene = s3.scene;
      var draft = 1.0, grain = 0.0, ejecting = false;

      var mold = makeBox(220, 46, 150, "part-mold");
      mold.place(0, 92, 0);
      var core = makeBox(96, 96, 96, "part-core");
      core.place(0, 40, 0);
      var partW = 150, partH = 96, partD = 110;
      var part = makeBox(partW, partH, partD, "part-cup");
      scene.appendChild(mold); scene.appendChild(core); scene.appendChild(part);

      var t = lang === "tr"
        ? { draft: "Çekme açısı", grain: "Gren derinliği (mm)", req: "Gerekli eğim", margin: "Marj", eject: "⬆ ÇIKAR", reset: "↺ Sıfırla",
            ok: "Eğim {a}° ≥ gerekli {r}° → parça temiz çıkar.", bad: "Eğim {a}° < gerekli {r}° → parça maçaya sürter, gren çizilir.",
            base: "temel", grainlbl: "gren" }
        : { draft: "Draft angle", grain: "Grain depth (mm)", req: "Required draft", margin: "Margin", eject: "⬆ EJECT", reset: "↺ Reset",
            ok: "Draft {a}° ≥ required {r}° → part lifts free.", bad: "Draft {a}° < required {r}° → part drags on the core, grain scuffs.",
            base: "base", grainlbl: "grain" };

      var vv = el("div", "studio-verdict");
      var out = readout([["", ""], ["", ""]]);

      function required() { return 0.5 + grain / 0.025 * 1.0; }
      function skew(a) {
        // visually lean the side walls by the draft angle
        var f = part.faces;
        f.left.style.transform = "rotateY(-90deg) translateZ(" + (partW / 2) + "px) skewY(" + (a * 3) + "deg)";
        f.right.style.transform = "rotateY(90deg) translateZ(" + (partW / 2) + "px) skewY(" + (-a * 3) + "deg)";
      }
      function recompute() {
        var req = required();
        skew(draft);
        out.set(0, fmt(req, lang, 1) + "°");
        out.set(1, fmt(draft - req, lang, 1) + "°");
        var ok = draft >= req - 1e-9;
        part.classList.toggle("bad", !ok);
        if (!ejecting) {
          if (ok) verdict(vv, true, t.ok.replace("{a}", fmt(draft, lang, 1)).replace("{r}", fmt(req, lang, 1)));
          else verdict(vv, false, t.bad.replace("{a}", fmt(draft, lang, 1)).replace("{r}", fmt(req, lang, 1)));
        }
      }
      function tween(from, to, ms, step, done) {
        if (reduced) { step(to); if (done) done(); return; }
        var t0 = null, raf;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / ms);
          var e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          step(from + (to - from) * e);
          if (p < 1) raf = requestAnimationFrame(tick); else if (done) done();
        }
        raf = requestAnimationFrame(tick); cleanups.push(function () { cancelAnimationFrame(raf); });
      }
      function eject() {
        if (ejecting) return; ejecting = true;
        var ok = draft >= required() - 1e-9;
        part.classList.remove("scuff");
        if (ok) {
          tween(0, -170, 900, function (y) { part.place(0, y, 0); }, function () {
            tween(-170, 0, 700, function (y) { part.place(0, y, 0); }, function () { ejecting = false; recompute(); });
          });
          verdict(vv, true, t.ok.replace("{a}", fmt(draft, lang, 1)).replace("{r}", fmt(required(), lang, 1)));
        } else {
          part.classList.add("scuff");
          tween(0, -46, 260, function (y) { part.place(0, y, 0); }, function () {
            // shudder then snap back
            var n = 0;
            (function shake() {
              if (n++ > 5) { tween(-46, 0, 260, function (y) { part.place(0, y, 0); }, function () { ejecting = false; recompute(); }); return; }
              part.place((n % 2 ? 4 : -4), -46, 0); requestAnimationFrame(function () { setTimeout(shake, 55); });
            })();
          });
          verdict(vv, false, t.bad.replace("{a}", fmt(draft, lang, 1)).replace("{r}", fmt(required(), lang, 1)));
        }
      }

      var sD = slider(t.draft, 0, 3, 0.1, draft, lang, 1, function (v) { draft = v; recompute(); });
      var sG = slider(t.grain, 0, 0.05, 0.005, grain, lang, 3, function (v) { grain = v; recompute(); });
      var btn = el("button", "btn", t.eject); btn.onclick = eject;
      side.appendChild(sD.el); side.appendChild(sG.el);
      side.appendChild(btn);
      side.appendChild(vv); side.appendChild(out);
      recompute();
    }
  });

  /* ---- Station 3 — Thermal Gap ----------------------------------------- */
  STATIONS.push({
    id: "thermal", icon: "🌡️",
    name: { en: "Thermal Gap", tr: "Isıl Boşluk" },
    goal: {
      en: "A plastic part sits next to a steel neighbour with a visible gap. Sweep the temperature and watch the plastic grow — keep the gap from slamming shut. Choose where you anchor it.",
      tr: "Bir plastik parça, görünür bir boşlukla çelik komşusunun yanında duruyor. Sıcaklığı süpür ve plastiğin büyümesini izle — boşluğun kapanmasını engelle. Nereden sabitleyeceğini seç."
    },
    principle: {
      en: "Plastics expand far more than steel (ΔL = α·L·ΔT). Over a long span that relative growth is millimetres — you cannot tolerance it away. Anchor one point and let the rest slide so the growth has a designed direction, and run the gap study hot <em>and</em> cold. Anchoring the centre halves the movement each end sees.",
      tr: "Plastikler çelikten çok daha fazla genleşir (ΔL = α·L·ΔT). Uzun bir açıklıkta bu bağıl büyüme milimetrelerdir — toleransla yok edemezsiniz. Bir noktayı sabitle, gerisini kaydır ki büyümenin tasarlanmış bir yönü olsun; boşluk etüdünü sıcak <em>ve</em> soğukta koş. Merkezi sabitlemek her ucun gördüğü hareketi yarıya indirir."
    },
    build: function (stage, side, lang) {
      var s3 = scene3d(stage, -16, -30), scene = s3.scene;
      var mats = {
        PP: { a: 120, label: "PP" }, ABS: { a: 85, label: "ABS" }, GF: { a: 30, label: "PA6-GF30" }
      };
      var matKey = "PP", temp = 20, coldGap = 2.5, length = 800, anchor = "center";
      var steelA = 12;

      var basePlasticW = 150, boxH = 96, boxD = 120;
      var plastic = makeBox(basePlasticW, boxH, boxD, "part-plastic");
      var steel = makeBox(70, boxH, boxD, "part-steel");
      scene.appendChild(plastic); scene.appendChild(steel);

      var t = lang === "tr"
        ? { mat: "Malzeme", temp: "Sıcaklık (°C)", gap: "Soğuk boşluk (mm)", len: "Açıklık (mm)", anchor: "Sabitleme",
            center: "Merkez", far: "Uzak uç", dl: "ΔL (bağıl)", move: "Boşluğa doğru", hot: "Anlık boşluk",
            ok: "Anlık boşluk {g} mm → temas yok.", touch: "Boşluk {g} mm → çok dar, temas riski.", crash: "ÇARPIŞMA: plastik çeliği eziyor ({g} mm)." }
        : { mat: "Material", temp: "Temperature (°C)", gap: "Cold gap (mm)", len: "Span (mm)", anchor: "Anchor",
            center: "Centre", far: "Far end", dl: "ΔL (relative)", move: "Toward gap", hot: "Live gap",
            ok: "Live gap {g} mm → clear.", touch: "Gap {g} mm → very tight, contact risk.", crash: "COLLISION: plastic crushes the steel ({g} mm)." };

      var vv = el("div", "studio-verdict");
      var out = readout([["", ""], ["", ""], ["", ""]]);
      var formula = el("div", "studio-formula");

      var GAPPX = 26; // px per mm of gap (exaggerated so it reads)
      function recompute() {
        var a = mats[matKey].a;
        var dT = temp - 20;
        var dL = (a - steelA) * 1e-6 * length * dT; // mm, relative to steel
        var toGap = anchor === "center" ? dL / 2 : dL; // movement of the gap-side end toward steel
        var liveGap = coldGap - toGap;
        // colour by temperature (cold blue → hot red), inherited by faces via --tint
        var warm = clamp((temp + 30) / 110, 0, 1);
        var r = Math.round(lerp(37, 220, warm)), g = Math.round(lerp(99, 38, warm)), bl = Math.round(lerp(235, 38, warm));
        plastic.style.setProperty("--tint", "rgba(" + r + "," + g + "," + bl + ",.7)");
        // steel fixed on the right; plastic grows and its right edge approaches
        var steelX = 150, steelHalf = 35; // steel box is 70 wide
        steel.place(steelX, 0, 0);
        var steelLeft = steelX - steelHalf;
        var growPx = clamp(dL * GAPPX, -50, 130);   // exaggerated so growth reads
        var newW = clamp(basePlasticW + growPx, 90, 300);
        rebuildDepth(plastic, newW, boxH, boxD);
        var gapPx = liveGap * GAPPX;
        var rightEdge = steelLeft - Math.max(-14, gapPx); // clamp overlap so a crush stays visible
        plastic.place(rightEdge - newW / 2, 0, 0);
        plastic.classList.toggle("bad", liveGap <= 0);

        out.set(0, fmt(dL, lang, 2) + " mm");
        out.set(1, fmt(toGap, lang, 2) + " mm");
        out.set(2, fmt(liveGap, lang, 2) + " mm");
        formula.innerHTML = "ΔL = (" + mats[matKey].a + "−" + steelA + ")·10⁻⁶ × " + length + " × " + fmt(dT, lang, 0) + " = <b>" + fmt(dL, lang, 2) + " mm</b>";
        if (liveGap <= 0) verdict(vv, false, t.crash.replace("{g}", fmt(liveGap, lang, 2)));
        else if (liveGap < 0.4) warnV(vv, t.touch.replace("{g}", fmt(liveGap, lang, 2)));
        else verdict(vv, true, t.ok.replace("{g}", fmt(liveGap, lang, 2)));
      }

      var segM = seg([{ k: "PP", label: "PP" }, { k: "ABS", label: "ABS" }, { k: "GF", label: "PA6-GF30" }], "PP", function (k) { matKey = k; recompute(); });
      var segA = seg([{ k: "center", label: t.center }, { k: "far", label: t.far }], "center", function (k) { anchor = k; recompute(); });
      var sT = slider(t.temp, -30, 80, 1, temp, lang, 0, function (v) { temp = v; recompute(); });
      var sG = slider(t.gap, 0.5, 6, 0.1, coldGap, lang, 1, function (v) { coldGap = v; recompute(); });
      var sL = slider(t.len, 100, 1200, 10, length, lang, 0, function (v) { length = v; recompute(); });
      side.appendChild(labelRow(t.mat, segM.el));
      side.appendChild(labelRow(t.anchor, segA.el));
      side.appendChild(sT.el); side.appendChild(sG.el); side.appendChild(sL.el);
      side.appendChild(vv); side.appendChild(formula); side.appendChild(out);
      recompute();
    }
  });

  /* ---- Station 4 — Pin & Slot locators --------------------------------- */
  STATIONS.push({
    id: "locate", icon: "📍",
    name: { en: "Pin & Slot", tr: "Pim & Yuva" },
    goal: {
      en: "Locate a molded panel on two fixture pins. Try two round holes, then a round hole + a slot. Add molding/thermal variation and watch which scheme stays flat and which fights itself into a warp.",
      tr: "Kalıplanmış bir paneli iki fikstür pimine konumla. Önce iki yuvarlak delik, sonra bir yuvarlak delik + bir yuva dene. Kalıp/ısıl sapma ekle ve hangi şemanın düz kaldığını, hangisinin kendisiyle savaşıp çarpıldığını izle."
    },
    principle: {
      en: "Two round holes on two pins over-constrain the panel: as pitch varies with molding and temperature, the pins fight the holes and the panel bows. The 4-way pin fixes X-Y, a 2-way slot fixes rotation but <em>releases</em> the pin-to-pin distance — exactly where the variation lives. Pin + slot + face pads is the standard plastic-locating scheme.",
      tr: "İki pime iki yuvarlak delik paneli aşırı kısıtlar: adım, kalıp ve sıcaklıkla değiştikçe pimler deliklerle savaşır ve panel bombeleşir. 4-yön pimi X-Y'yi sabitler; 2-yön yuvası dönmeyi sabitler ama pimden pime mesafeyi <em>serbest bırakır</em> — sapmanın yaşadığı yer tam orası. Pim + yuva + yüzey pedleri standart plastik konumlama şemasıdır."
    },
    build: function (stage, side, lang) {
      var s3 = scene3d(stage, -58, -8), scene = s3.scene;
      var mode = "pins", varr = 0.15, clearance = 0.2;

      var base = makeBox(240, 20, 150, "part-fixture");
      base.place(0, 48, 0);
      var pin1 = makeBox(14, 70, 14, "part-pin"); pin1.place(-80, 6, 0);
      var pin2 = makeBox(14, 70, 14, "part-pin"); pin2.place(80, 6, 0);
      var panel = makeBox(240, 12, 150, "part-panel");
      panel.place(0, 0, 0);
      scene.appendChild(base); scene.appendChild(pin1); scene.appendChild(pin2);
      scene.appendChild(panel);

      // top-view SVG of the two features
      var xsec = svgWrap("", 260, 120);
      stage.appendChild(xsec);

      var t = lang === "tr"
        ? { mode: "Konumlama şeması", pins: "2 yuvarlak delik", pinslot: "Delik + yuva",
            varr: "Kalıp/ısıl sapma (mm)", clr: "Delik boşluğu (mm)",
            ok: "Sapma {v} mm boşlukta soğrulur → panel düz oturur.", warp: "Aşırı kısıt: sapma {v} mm > boşluk {c} mm → panel çarpılır.",
            slotok: "Yuva pimden-pime mesafeyi serbest bırakır → sapma ne olursa olsun düz.",
            hole: "delik", slot: "yuva", pin: "pim" }
        : { mode: "Locating scheme", pins: "2 round holes", pinslot: "Hole + slot",
            varr: "Molding/thermal variation (mm)", clr: "Hole clearance (mm)",
            ok: "Variation {v} mm absorbed by clearance → panel seats flat.", warp: "Over-constrained: variation {v} mm > clearance {c} mm → panel warps.",
            slotok: "The slot releases the pin-to-pin distance → flat at any variation.",
            hole: "hole", slot: "slot", pin: "pin" };

      var vv = el("div", "studio-verdict");

      function recompute() {
        var overc = mode === "pins" && varr > clearance;
        var bow = overc ? clamp((varr - clearance) * 60, 0, 26) : 0;
        // warp the panel: lift one side + arch via rotateX
        if (bow > 0) {
          panel.place(0, -bow * 0.3, 0, "rotateZ(" + (bow * 0.16) + "deg) rotateX(" + (bow * 0.12) + "deg)");
          panel.classList.add("bad");
        } else {
          panel.place(0, 0, 0);
          panel.classList.remove("bad");
        }
        xsec.querySelector("svg").innerHTML = topView(mode, varr, clearance, t);
        if (mode === "pinslot") verdict(vv, true, t.slotok);
        else if (overc) verdict(vv, false, t.warp.replace("{v}", fmt(varr, lang, 2)).replace("{c}", fmt(clearance, lang, 2)));
        else verdict(vv, true, t.ok.replace("{v}", fmt(varr, lang, 2)));
      }

      var segMode = seg([{ k: "pins", label: t.pins }, { k: "pinslot", label: t.pinslot }], "pins", function (k) { mode = k; recompute(); });
      var sV = slider(t.varr, 0, 0.6, 0.01, varr, lang, 2, function (v) { varr = v; recompute(); });
      var sC = slider(t.clr, 0.05, 0.4, 0.01, clearance, lang, 2, function (v) { clearance = v; recompute(); });
      side.appendChild(labelRow(t.mode, segMode.el));
      side.appendChild(sV.el); side.appendChild(sC.el);
      side.appendChild(vv);
      recompute();
    }
  });

  function topView(mode, varr, clr, t) {
    var W = 260, H = 120, y = 60, x1 = 70, x2 = 190, off = varr * 60;
    var s = "";
    s += '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" class="d-soft" stroke-dasharray="5 4" stroke-width="1.2"/>';
    // pins (nominal)
    [x1, x2].forEach(function (px) {
      s += '<circle cx="' + px + '" cy="' + y + '" r="4" class="d-accentfill"/>';
    });
    // hole 1 (round, on pin 1)
    s += '<circle cx="' + x1 + '" cy="' + y + '" r="12" fill="none" class="d-stroke" stroke-width="2"/>';
    s += '<text x="' + x1 + '" y="' + (y + 30) + '" text-anchor="middle" class="d-softtext" font-size="10">' + t.hole + "</text>";
    // feature 2 depends on mode; the required pin position shifts by variation
    var pin2x = x2 + off;
    if (mode === "pins") {
      s += '<circle cx="' + x2 + '" cy="' + y + '" r="12" fill="none" class="' + (Math.abs(off) > clr * 60 ? "d-bad" : "d-stroke") + '" stroke-width="2"/>';
      s += '<circle cx="' + pin2x + '" cy="' + y + '" r="4" class="d-accentfill"/>';
      s += '<text x="' + x2 + '" y="' + (y + 30) + '" text-anchor="middle" class="d-softtext" font-size="10">' + t.hole + "</text>";
      if (Math.abs(off) > clr * 60)
        s += '<line x1="' + x2 + '" y1="' + (y - 20) + '" x2="' + pin2x + '" y2="' + (y - 20) + '" class="d-bad" stroke-width="1.4" marker-end="url(#tvA)"/>';
    } else {
      // slot: stadium elongated along the pitch direction
      var sw = 40;
      s += '<rect x="' + (x2 - sw / 2) + '" y="' + (y - 12) + '" width="' + sw + '" height="24" rx="12" fill="none" class="d-good" stroke-width="2"/>';
      s += '<circle cx="' + clamp(pin2x, x2 - sw / 2 + 4, x2 + sw / 2 - 4) + '" cy="' + y + '" r="4" class="d-accentfill"/>';
      s += '<text x="' + x2 + '" y="' + (y + 30) + '" text-anchor="middle" class="d-softtext" font-size="10">' + t.slot + "</text>";
    }
    s += '<defs><marker id="tvA" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7z" class="d-badfill"/></marker></defs>';
    return s;
  }

  /* ---- Station 5 — Fastener & Position --------------------------------- */
  STATIONS.push({
    id: "fastener", icon: "🔩", no3d: true,
    name: { en: "Fastener & Position", tr: "Bağlantı & Pozisyon" },
    goal: {
      en: "Turn a bolted joint into a position tolerance. Slide the hole and bolt sizes; the clearance becomes the position zone Ⓜ. Switch between a floating joint (bolt through both parts) and a fixed one (thread anchored in one).",
      tr: "Cıvatalı bir bağlantıyı pozisyon toleransına çevir. Delik ve cıvata ölçülerini kaydır; boşluk, pozisyon bölgesi Ⓜ olur. Yüzer bağlantı (cıvata her iki parçadan geçer) ile sabit bağlantı (diş bir parçaya sabit) arasında geçiş yap."
    },
    principle: {
      en: "The clearance between hole and fastener is exactly the position tolerance you can afford. Floating (both parts clear): T = H − F, split between the two parts. Fixed (one part threaded): T = (H − F)/2. Apply it at MMC (Ⓜ) so the part earns bonus tolerance as the hole grows — this is why molded holes get generous clearance.",
      tr: "Delik ile bağlantı elemanı arasındaki boşluk, tam olarak verebileceğiniz pozisyon toleransıdır. Yüzer (her iki parça boşluklu): T = H − F, iki parça arasında bölünür. Sabit (bir parça dişli): T = (H − F)/2. Ⓜ (MMC) ile uygula ki delik büyüdükçe parça bonus tolerans kazansın — kalıplanmış deliklere cömert boşluk verilmesinin nedeni budur."
    },
    build: function (stage, side, lang) {
      var kind = "floating", H = 8.5, F = 8.0;
      var xsec = svgWrap("", 340, 220);
      stage.appendChild(xsec);
      var fcf = el("div", "studio-fcf");
      var vv = el("div", "studio-verdict");
      var t = lang === "tr"
        ? { kind: "Bağlantı tipi", floating: "Yüzer (iki delik)", fixed: "Sabit (dişli)",
            hole: "Delik MMC ⌀ (mm)", bolt: "Eleman MMC ⌀ (mm)",
            fF: "Yüzer: T = H − F = {H} − {F} = ⌀{T}", fX: "Sabit: T = (H − F)/2 = ({H} − {F})/2 = ⌀{T}",
            ok: "Pozisyon toleransı ⌀{T} — her parçaya Ⓜ ile uygulanır.", none: "Boşluk yok: T = ⌀0 → montaj kesişimi." }
        : { kind: "Joint type", floating: "Floating (2 clear holes)", fixed: "Fixed (threaded)",
            hole: "Hole MMC ⌀ (mm)", bolt: "Fastener MMC ⌀ (mm)",
            fF: "Floating: T = H − F = {H} − {F} = ⌀{T}", fX: "Fixed: T = (H − F)/2 = ({H} − {F})/2 = ⌀{T}",
            ok: "Position tolerance ⌀{T} — applied at Ⓜ on each part.", none: "No clearance: T = ⌀0 → assembly interference." };

      function recompute() {
        if (F > H) F = H;
        var T = kind === "floating" ? (H - F) : (H - F) / 2;
        xsec.querySelector("svg").innerHTML = fastXsec(H, F, T, kind);
        fcf.innerHTML = fcfBox(T, lang);
        var line = (kind === "floating" ? t.fF : t.fX)
          .replace("{H}", fmt(H, lang, 1)).replace("{F}", fmt(F, lang, 1)).replace("{T}", fmt(T, lang, 2));
        if (T <= 0) verdict(vv, false, t.none);
        else verdict(vv, true, line);
      }
      var segK = seg([{ k: "floating", label: t.floating }, { k: "fixed", label: t.fixed }], "floating", function (k) { kind = k; recompute(); });
      var sH = slider(t.hole, 6.5, 12, 0.1, H, lang, 1, function (v) { H = v; recompute(); });
      var sF = slider(t.bolt, 5, 11, 0.1, F, lang, 1, function (v) { F = v; recompute(); });
      side.appendChild(labelRow(t.kind, segK.el));
      side.appendChild(sH.el); side.appendChild(sF.el);
      side.appendChild(vv); side.appendChild(fcf);
      recompute();
    }
  });

  function fastXsec(H, F, T, kind) {
    var W = 340, HH = 220, cx = 170, scale = 12;
    var holeR = H * scale / 2, boltR = F * scale / 2, zoneR = Math.max(2, T * scale / 2);
    var pT = 46, pB = 128, plate1 = [pT, 78], plate2 = [86, pB];
    var s = "";
    // plates
    s += '<rect x="40" y="' + plate1[0] + '" width="260" height="' + (plate1[1] - plate1[0]) + '" class="d-zone" opacity=".28"/>';
    s += '<rect x="40" y="' + plate2[0] + '" width="260" height="' + (plate2[1] - plate2[0]) + '" class="d-zone" opacity=".18"/>';
    s += '<rect x="40" y="' + plate1[0] + '" width="260" height="' + (plate2[1] - plate1[0]) + '" fill="none" class="d-soft" stroke-width="1.2"/>';
    // hole walls (both plates for floating; lower plate threaded for fixed)
    s += '<line x1="' + (cx - holeR) + '" y1="' + plate1[0] + '" x2="' + (cx - holeR) + '" y2="' + plate1[1] + '" class="d-stroke" stroke-width="1.6"/>';
    s += '<line x1="' + (cx + holeR) + '" y1="' + plate1[0] + '" x2="' + (cx + holeR) + '" y2="' + plate1[1] + '" class="d-stroke" stroke-width="1.6"/>';
    if (kind === "floating") {
      s += '<line x1="' + (cx - holeR) + '" y1="' + plate2[0] + '" x2="' + (cx - holeR) + '" y2="' + plate2[1] + '" class="d-stroke" stroke-width="1.6"/>';
      s += '<line x1="' + (cx + holeR) + '" y1="' + plate2[0] + '" x2="' + (cx + holeR) + '" y2="' + plate2[1] + '" class="d-stroke" stroke-width="1.6"/>';
    } else {
      // thread hatch
      for (var yy = plate2[0]; yy < plate2[1]; yy += 6) {
        s += '<line x1="' + (cx - boltR) + '" y1="' + yy + '" x2="' + (cx - boltR + 4) + '" y2="' + (yy + 4) + '" class="d-soft" stroke-width="1"/>';
        s += '<line x1="' + (cx + boltR - 4) + '" y1="' + yy + '" x2="' + (cx + boltR) + '" y2="' + (yy + 4) + '" class="d-soft" stroke-width="1"/>';
      }
    }
    // bolt
    var bTop = 22;
    s += '<rect x="' + (cx - boltR) + '" y="' + bTop + '" width="' + (2 * boltR) + '" height="' + (pB - bTop) + '" class="d-accent" fill="none" stroke-width="1.8"/>';
    s += '<rect x="' + (cx - boltR - 10) + '" y="' + (bTop) + '" width="' + (2 * boltR + 20) + '" height="12" class="d-accentfill" opacity=".55"/>';
    // clearance shading (hole minus bolt), each side
    if (H > F) {
      s += '<rect x="' + (cx - holeR) + '" y="' + plate1[0] + '" width="' + (holeR - boltR) + '" height="' + (plate1[1] - plate1[0]) + '" class="d-badfill" opacity=".35"/>';
      s += '<rect x="' + (cx + boltR) + '" y="' + plate1[0] + '" width="' + (holeR - boltR) + '" height="' + (plate1[1] - plate1[0]) + '" class="d-badfill" opacity=".35"/>';
    }
    // position zone at bottom axis
    var zy = 176;
    s += '<line x1="40" y1="' + zy + '" x2="300" y2="' + zy + '" class="d-soft" stroke-dasharray="4 4" stroke-width="1"/>';
    s += '<line x1="' + cx + '" y1="' + (zy - 24) + '" x2="' + cx + '" y2="' + (zy + 12) + '" class="d-soft" stroke-dasharray="3 3" stroke-width="1"/>';
    s += '<circle cx="' + cx + '" cy="' + zy + '" r="' + zoneR + '" class="d-zone" stroke-width="1.6"/>';
    s += '<text x="' + (cx + zoneR + 8) + '" y="' + (zy + 4) + '" class="d-softtext" font-size="11">⌀' + T.toFixed(2) + '</text>';
    return s;
  }
  function fcfBox(T, lang) {
    if (window.GDT_SVG && GDT_SVG.fcf)
      return GDT_SVG.fcf([[{ sym: "position" }], ["⌀" + T.toFixed(2), { mod: "M" }], ["A"], ["B"], ["C"]]);
    return '<span class="fcf"><span class="fcf-cell">⌖</span><span class="fcf-cell">⌀' + T.toFixed(2) + " Ⓜ</span></span>";
  }

  function labelRow(label, node) {
    var w = el("div", "studio-labelrow");
    w.appendChild(el("div", "studio-label", label));
    w.appendChild(node);
    return w;
  }

  /* ======================================================================
   *  UI strings + page render
   * ==================================================================== */
  var UI = {
    en: {
      navLabel: "Design Studio",
      title: "🧪 Plastic Design Bench",
      intro: "A hands-on studio — no quizzes. Each station is a live rig: grab the 3D part to orbit it, then move the sliders and watch the consequence of your design choice happen in real time — sink marks, ejection scuffs, thermal collisions, over-constraint warp, and fastener position zones.",
      principle: "Why it works",
      drag: "drag to orbit"
    },
    tr: {
      navLabel: "Tasarım Stüdyosu",
      title: "🧪 Plastik Tasarım Tezgahı",
      intro: "Uygulamalı bir stüdyo — quiz yok. Her istasyon canlı bir düzenek: 3B parçayı tutup döndür, sonra kaydırıcıları oynat ve tasarım kararının sonucunu gerçek zamanlı izle — çöküntü izleri, itme çizikleri, ısıl çarpışmalar, aşırı kısıt çarpılması ve bağlantı pozisyon bölgeleri.",
      principle: "Neden böyle",
      drag: "döndürmek için sürükle"
    }
  };

  var active = 0, mountEl = null, mountLang = "en";

  function renderAll(container, lang) {
    runCleanups();
    var ui = UI[lang] || UI.en;
    container.innerHTML = "";
    container.appendChild(el("h1", null, ui.title));
    container.appendChild(el("p", "lesson-intro", ui.intro));

    var tabs = el("div", "studio-tabs");
    STATIONS.forEach(function (st, i) {
      var b = el("button", "studio-tab" + (i === active ? " on" : ""), st.icon + " " + st.name[lang]);
      b.onclick = function () { active = i; renderAll(container, lang); };
      tabs.appendChild(b);
    });
    container.appendChild(tabs);

    var body = el("div", "studio-body");
    container.appendChild(body);

    var st = STATIONS[active];
    body.appendChild(el("div", "studio-goal", "🎯 " + st.goal[lang]));
    var grid = el("div", "studio-grid");
    var stage = el("div", "studio-stage");
    if (!st.no3d) stage.appendChild(el("div", "studio-drag", "🖐 " + ui.drag));
    var sidep = el("div", "studio-side");
    grid.appendChild(stage); grid.appendChild(sidep);
    body.appendChild(grid);
    var note = el("div", "box key studio-note", '<div class="box-title">💡 ' + ui.principle + "</div><p>" + st.principle[lang] + "</p>");
    body.appendChild(note);

    st.build(stage, sidep, lang);
  }

  window.GDT_TRAINER = {
    ui: function (lang) { return UI[lang] || UI.en; },
    mount: function (container, lang) {
      mountEl = container; mountLang = lang;
      renderAll(container, lang);
    }
  };
})();
