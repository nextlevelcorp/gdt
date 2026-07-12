/* ===== GD&T Academy — diagrams.js =====
 * SVG symbol icons + technical diagrams.
 * Diagrams are language-neutral (numbers & symbols only);
 * translated captions are supplied by the content files.
 */
(function () {
  "use strict";

  var S = 'stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="1.8"';

  /* ---------- GD&T characteristic symbol icons (24x24) ---------- */
  function icon(inner, size) {
    size = size || 22;
    return '<svg class="sym-icon" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true">' + inner + "</svg>";
  }

  var PATHS = {
    straightness: '<line x1="4" y1="12" x2="20" y2="12" class="d-stroke" ' + S + "/>",
    flatness: '<path d="M7 8 H21 L17 16 H3 Z" class="d-stroke" ' + S + "/>",
    circularity: '<circle cx="12" cy="12" r="7" class="d-stroke" ' + S + "/>",
    cylindricity:
      '<circle cx="12" cy="12" r="6" class="d-stroke" ' + S + "/>" +
      '<line x1="2.5" y1="20" x2="8.5" y2="4" class="d-stroke" ' + S + "/>" +
      '<line x1="15.5" y1="20" x2="21.5" y2="4" class="d-stroke" ' + S + "/>",
    profileLine: '<path d="M4 16 A 8 8 0 0 1 20 16" class="d-stroke" ' + S + "/>",
    profileSurface:
      '<path d="M4 15 A 8 8 0 0 1 20 15" class="d-stroke" ' + S + "/>" +
      '<line x1="4" y1="15" x2="20" y2="15" class="d-stroke" ' + S + "/>",
    angularity: '<path d="M20 18 H4 L17 6" class="d-stroke" ' + S + "/>",
    perpendicularity:
      '<line x1="12" y1="4" x2="12" y2="18" class="d-stroke" ' + S + "/>" +
      '<line x1="4" y1="18" x2="20" y2="18" class="d-stroke" ' + S + "/>",
    parallelism:
      '<line x1="6" y1="20" x2="12" y2="4" class="d-stroke" ' + S + "/>" +
      '<line x1="12" y1="20" x2="18" y2="4" class="d-stroke" ' + S + "/>",
    position:
      '<circle cx="12" cy="12" r="6" class="d-stroke" ' + S + "/>" +
      '<line x1="12" y1="2" x2="12" y2="22" class="d-stroke" ' + S + "/>" +
      '<line x1="2" y1="12" x2="22" y2="12" class="d-stroke" ' + S + "/>",
    concentricity:
      '<circle cx="12" cy="12" r="8" class="d-stroke" ' + S + "/>" +
      '<circle cx="12" cy="12" r="3.5" class="d-stroke" ' + S + "/>",
    symmetry:
      '<line x1="4" y1="12" x2="20" y2="12" class="d-stroke" ' + S + "/>" +
      '<line x1="7" y1="7.5" x2="17" y2="7.5" class="d-stroke" ' + S + "/>" +
      '<line x1="7" y1="16.5" x2="17" y2="16.5" class="d-stroke" ' + S + "/>",
    circularRunout:
      '<line x1="6" y1="19" x2="17" y2="5" class="d-stroke" ' + S + "/>" +
      '<path d="M17 5 L11.5 6.5 M17 5 L15.8 10.5" class="d-stroke" ' + S + "/>",
    totalRunout:
      '<line x1="4" y1="19" x2="20" y2="19" class="d-stroke" ' + S + "/>" +
      '<line x1="7" y1="19" x2="14" y2="5" class="d-stroke" ' + S + "/>" +
      '<line x1="13" y1="19" x2="20" y2="5" class="d-stroke" ' + S + "/>" +
      '<path d="M14 5 L9.5 6.3 M20 5 L15.5 6.3" class="d-stroke" ' + S + "/>",
    diameter:
      '<circle cx="12" cy="12" r="7" class="d-stroke" ' + S + "/>" +
      '<line x1="5" y1="19" x2="19" y2="5" class="d-stroke" ' + S + "/>"
  };

  function modCircle(letter) {
    return (
      '<circle cx="12" cy="12" r="9" class="d-stroke" ' + S + "/>" +
      '<text x="12" y="16.2" text-anchor="middle" font-size="12" font-weight="700" class="d-fill" stroke="none">' + letter + "</text>"
    );
  }
  PATHS.mmc = modCircle("M");
  PATHS.lmc = modCircle("L");
  PATHS.proj = modCircle("P");
  PATHS.freeState = modCircle("F");
  PATHS.tangent = modCircle("T");
  PATHS.unilateral = modCircle("U");

  var SYM = {};
  Object.keys(PATHS).forEach(function (k) {
    SYM[k] = function (size) { return icon(PATHS[k], size); };
  });

  /* ---------- Feature control frame builder (HTML) ---------- */
  // parts: array of cells; each cell = array of tokens.
  // token: {sym:"position"} | {mod:"M"} | plain string
  function fcf(parts) {
    var html = '<span class="fcf">';
    parts.forEach(function (cell) {
      html += '<span class="fcf-cell">';
      cell.forEach(function (t) {
        if (typeof t === "string") html += "<span>" + t + "</span>";
        else if (t.sym) html += SYM[t.sym](20);
        else if (t.mod) html += '<span class="mod">' + t.mod + "</span>";
      });
      html += "</span>";
    });
    return html + "</span>";
  }

  /* ---------- Shared SVG helpers ---------- */
  function svg(w, h, inner) {
    return '<svg viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" role="img">' + inner + "</svg>";
  }
  function txt(x, y, s, opts) {
    opts = opts || {};
    return '<text x="' + x + '" y="' + y + '" font-size="' + (opts.fs || 12) + '"' +
      (opts.anchor ? ' text-anchor="' + opts.anchor + '"' : "") +
      (opts.cls ? ' class="' + opts.cls + '"' : "") +
      (opts.w ? ' font-weight="' + opts.w + '"' : "") + ">" + s + "</text>";
  }
  function arrow(x1, y1, x2, y2, cls) {
    cls = cls || "d-stroke";
    var a = Math.atan2(y2 - y1, x2 - x1), L = 7, w = Math.PI / 7;
    function head(x, y, ang) {
      return '<path d="M' + x + " " + y +
        " L" + (x - L * Math.cos(ang - w)).toFixed(1) + " " + (y - L * Math.sin(ang - w)).toFixed(1) +
        " M" + x + " " + y +
        " L" + (x - L * Math.cos(ang + w)).toFixed(1) + " " + (y - L * Math.sin(ang + w)).toFixed(1) +
        '" class="' + cls + '" fill="none" stroke-width="1.4"/>';
    }
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + cls + '" stroke-width="1.4"/>' +
      head(x2, y2, a) + head(x1, y1, a + Math.PI);
  }
  function dline(x1, y1, x2, y2, cls, dash, sw) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || "d-stroke") +
      '" stroke-width="' + (sw || 1.6) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + ' fill="none"/>';
  }
  function datumFlag(x, y, letter) {
    // filled triangle on surface + leader + boxed letter (ASME style)
    return (
      '<path d="M' + x + " " + y + " L" + (x - 7) + " " + (y + 12) + " L" + (x + 7) + " " + (y + 12) + ' Z" class="d-fill"/>' +
      dline(x, y + 12, x, y + 26) +
      '<rect x="' + (x - 9) + '" y="' + (y + 26) + '" width="18" height="18" class="d-stroke" fill="none" stroke-width="1.6"/>' +
      txt(x, y + 39.5, letter, { anchor: "middle", fs: 12, w: 700 })
    );
  }

  /* ---------- Diagrams ----------
   * Each returns an SVG string. Text labels limited to symbols/numbers,
   * or passed in via the single `L` labels object (for the few that need words).
   */
  var DIAGRAMS = {};

  /* Plus/minus zone (square) vs position zone (circle) */
  DIAGRAMS.zoneCompare = function (L) {
    var inner =
      // left: square zone
      '<rect x="40" y="40" width="120" height="120" class="d-zone" stroke-width="1.6"/>' +
      dline(30, 100, 170, 100, "d-soft", "4 4", 1) +
      dline(100, 30, 100, 170, "d-soft", "4 4", 1) +
      '<circle cx="100" cy="100" r="3.5" class="d-fill"/>' +
      arrow(40, 178, 160, 178) + txt(100, 195, "0.2", { anchor: "middle" }) +
      txt(100, 22, L.a, { anchor: "middle", fs: 12, w: 600 }) +
      // right: circular zone
      '<circle cx="330" cy="100" r="84.85" class="d-zone" stroke-width="1.6"/>' +
      dline(240, 100, 420, 100, "d-soft", "4 4", 1) +
      dline(330, 20, 330, 180, "d-soft", "4 4", 1) +
      '<circle cx="330" cy="100" r="3.5" class="d-fill"/>' +
      arrow(270.7, 159.3, 389.3, 40.7) +
      txt(392, 34, "⌀0.283", { fs: 12 }) +
      txt(330, 22, L.b, { anchor: "middle", fs: 12, w: 600 }) +
      // +57%
      txt(330, 196, "+57%", { anchor: "middle", fs: 13, w: 700, cls: "d-accentfill" });
    return svg(470, 205, inner);
  };

  /* Flatness: two parallel planes */
  DIAGRAMS.flatness = function () {
    var inner =
      '<rect x="30" y="70" width="300" height="26" class="d-zone" stroke-width="0"/>' +
      dline(30, 70, 330, 70, "d-accent", "6 4", 1.6) +
      dline(30, 96, 330, 96, "d-accent", "6 4", 1.6) +
      '<path d="M30 88 Q 90 72 150 84 T 270 82 T 330 86" class="d-stroke" fill="none" stroke-width="2.2"/>' +
      arrow(350, 70, 350, 96) + txt(358, 87, "0.1", { fs: 12 }) +
      // part body below
      dline(30, 96, 30, 150, "d-soft", null, 1.2) + dline(330, 96, 330, 150, "d-soft", null, 1.2) +
      dline(30, 150, 330, 150, "d-soft", null, 1.2);
    return svg(400, 165, inner);
  };

  /* Straightness of a line element */
  DIAGRAMS.straightness = function () {
    var inner =
      '<rect x="30" y="60" width="300" height="18" class="d-zone" stroke-width="0"/>' +
      dline(30, 60, 330, 60, "d-accent", "6 4", 1.6) +
      dline(30, 78, 330, 78, "d-accent", "6 4", 1.6) +
      '<path d="M30 72 Q 110 58 190 70 T 330 66" class="d-stroke" fill="none" stroke-width="2.2"/>' +
      arrow(350, 60, 350, 78) + txt(358, 73, "0.05", { fs: 12 });
    return svg(410, 100, inner);
  };

  /* Circularity: two concentric circles */
  DIAGRAMS.circularity = function () {
    var inner =
      '<circle cx="110" cy="105" r="80" class="d-accent" fill="none" stroke-dasharray="6 4" stroke-width="1.6"/>' +
      '<circle cx="110" cy="105" r="64" class="d-accent" fill="none" stroke-dasharray="6 4" stroke-width="1.6"/>' +
      '<path d="M110 33 a 72 72 0 0 1 69 52 a 74 68 0 0 1 -66 92 a 70 74 0 0 1 -72 -70 a 76 70 0 0 1 69 -74 Z" class="d-stroke" fill="none" stroke-width="2.2"/>' +
      '<circle cx="110" cy="105" r="3" class="d-fill"/>' +
      arrow(110, 25, 110, 41) + txt(120, 36, "0.08", { fs: 12 });
    return svg(240, 210, inner);
  };

  /* Cylindricity: tube zone */
  DIAGRAMS.cylindricity = function () {
    var inner =
      '<ellipse cx="70" cy="100" rx="22" ry="52" class="d-accent" fill="none" stroke-dasharray="6 4" stroke-width="1.6"/>' +
      '<ellipse cx="70" cy="100" rx="14" ry="40" class="d-accent" fill="none" stroke-dasharray="6 4" stroke-width="1.6"/>' +
      dline(70, 48, 300, 48, "d-accent", "6 4") + dline(70, 152, 300, 152, "d-accent", "6 4") +
      dline(70, 60, 300, 60, "d-accent", "6 4") + dline(70, 140, 300, 140, "d-accent", "6 4") +
      '<path d="M75 55 Q 160 50 240 57 T 300 54" class="d-stroke" fill="none" stroke-width="2.2"/>' +
      '<path d="M75 146 Q 170 150 250 144 T 300 147" class="d-stroke" fill="none" stroke-width="2.2"/>' +
      dline(70, 100, 300, 100, "d-soft", "10 4 2 4", 1) +
      arrow(315, 48, 315, 60) + txt(323, 58, "0.1", { fs: 12 });
    return svg(370, 200, inner);
  };

  /* Perpendicularity: surface vs datum */
  DIAGRAMS.perpendicularity = function () {
    var inner =
      // datum base
      dline(20, 170, 300, 170, "d-stroke", null, 2.4) +
      '<path d="M20 170 l 260 0" class="d-stroke" stroke-width="2.4"/>' +
      (function () { var h = ""; for (var x = 30; x < 300; x += 18) h += dline(x, 170, x - 9, 180, "d-soft", null, 1); return h; })() +
      datumFlag(150, 182, "A") +
      // tolerance zone (two vertical planes)
      '<rect x="96" y="40" width="24" height="130" class="d-zone" stroke-width="0"/>' +
      dline(96, 40, 96, 170, "d-accent", "6 4") + dline(120, 40, 120, 170, "d-accent", "6 4") +
      // actual surface
      '<path d="M112 170 Q 104 130 110 90 T 106 40" class="d-stroke" fill="none" stroke-width="2.2"/>' +
      arrow(96, 30, 120, 30) + txt(128, 34, "0.1", { fs: 12 }) +
      txt(60, 158, "90°", { fs: 12, cls: "d-softtext" });
    return svg(340, 240, inner);
  };

  /* Parallelism */
  DIAGRAMS.parallelism = function () {
    var inner =
      dline(20, 170, 320, 170, "d-stroke", null, 2.4) +
      (function () { var h = ""; for (var x = 30; x < 320; x += 18) h += dline(x, 170, x - 9, 180, "d-soft", null, 1); return h; })() +
      datumFlag(170, 182, "A") +
      '<rect x="20" y="52" width="300" height="20" class="d-zone" stroke-width="0"/>' +
      dline(20, 52, 320, 52, "d-accent", "6 4") + dline(20, 72, 320, 72, "d-accent", "6 4") +
      '<path d="M20 66 Q 100 54 180 64 T 320 58" class="d-stroke" fill="none" stroke-width="2.2"/>' +
      arrow(336, 52, 336, 72) + txt(344, 66, "0.2", { fs: 12 }) +
      dline(20, 72, 20, 170, "d-soft", null, 1.2) + dline(320, 72, 320, 170, "d-soft", null, 1.2);
    return svg(390, 240, inner);
  };

  /* Angularity */
  DIAGRAMS.angularity = function () {
    var deg = -30 * Math.PI / 180;
    var cx = 60, cy = 170, len = 240;
    var ex = cx + len * Math.cos(deg), ey = cy + len * Math.sin(deg);
    var nx = -Math.sin(deg) * 11, ny = Math.cos(deg) * 11;
    var inner =
      dline(20, 170, 330, 170, "d-stroke", null, 2.4) +
      (function () { var h = ""; for (var x = 30; x < 330; x += 18) h += dline(x, 170, x - 9, 180, "d-soft", null, 1); return h; })() +
      datumFlag(230, 182, "A") +
      '<polygon points="' +
      (cx + nx) + "," + (cy + ny) + " " + (ex + nx) + "," + (ey + ny) + " " +
      (ex - nx) + "," + (ey - ny) + " " + (cx - nx) + "," + (cy - ny) +
      '" class="d-zone" stroke-width="0"/>' +
      dline(cx + nx, cy + ny, ex + nx, ey + ny, "d-accent", "6 4") +
      dline(cx - nx, cy - ny, ex - nx, ey - ny, "d-accent", "6 4") +
      dline(cx, cy, ex, ey, "d-stroke", null, 2.2) +
      '<path d="M 120 170 A 60 60 0 0 0 112 140" class="d-soft" fill="none" stroke-width="1.4"/>' +
      txt(132, 152, "30°", { fs: 12 }) +
      txt(268, 40, "0.15", { fs: 12 });
    return svg(360, 240, inner);
  };

  /* Position: true position + cylindrical zone */
  DIAGRAMS.position = function () {
    var inner =
      // part outline
      '<rect x="30" y="30" width="220" height="160" class="d-stroke" fill="none" stroke-width="2"/>' +
      // basic dims
      arrow(30, 210, 140, 210) + txt(85, 226, "50", { anchor: "middle" }) +
      '<rect x="72" y="216" width="28" height="16" class="d-stroke" fill="none" stroke-width="1.2"/>' +
      arrow(276, 190, 276, 110) + txt(288, 152, "40", { fs: 12 }) +
      '<rect x="282" y="140" width="26" height="16" class="d-stroke" fill="none" stroke-width="1.2"/>' +
      // crosshair true position
      dline(110, 80, 170, 80, "d-soft", "10 4 2 4", 1) +
      dline(140, 50, 140, 145, "d-soft", "10 4 2 4", 1) +
      // tolerance zone circle
      '<circle cx="140" cy="110" r="26" class="d-zone" stroke-dasharray="5 4" stroke-width="1.6"/>' +
      // actual hole (slightly off)
      '<circle cx="148" cy="103" r="34" class="d-stroke" fill="none" stroke-width="2.2"/>' +
      '<circle cx="148" cy="103" r="2.5" class="d-fill"/>' +
      '<circle cx="140" cy="110" r="2.5" class="d-accentfill"/>' +
      txt(180, 68, "⌀ 0.5", { fs: 12, cls: "d-accentfill", w: 700 });
    return svg(330, 245, inner);
  };

  /* Bonus tolerance chart */
  DIAGRAMS.bonus = function (L) {
    var rows = [
      ["10.0 (MMC)", "0.2", "0.0", "0.2"],
      ["10.1", "0.2", "0.1", "0.3"],
      ["10.2", "0.2", "0.2", "0.4"],
      ["10.3 (LMC)", "0.2", "0.3", "0.5"]
    ];
    var inner = "";
    var cols = [10, 130, 240, 330, 440];
    var head = [L.size, L.geo, L.bonus, L.total];
    head.forEach(function (h, i) {
      inner += txt((cols[i] + cols[i + 1]) / 2, 24, h, { anchor: "middle", fs: 12, w: 700 });
    });
    inner += dline(10, 34, 440, 34, "d-stroke", null, 1.6);
    rows.forEach(function (r, ri) {
      var y = 58 + ri * 28;
      r.forEach(function (c, ci) {
        inner += txt((cols[ci] + cols[ci + 1]) / 2, y, c, {
          anchor: "middle", fs: 12,
          w: ci === 3 ? 700 : 400,
          cls: ci === 3 ? "d-accentfill" : (ci === 2 ? "d-softtext" : "")
        });
      });
    });
    return svg(450, 155, inner);
  };

  /* Datum reference frame: 3 mutually perpendicular planes */
  DIAGRAMS.drf = function () {
    var inner =
      // primary plane (bottom, isometric-ish)
      '<polygon points="60,190 240,190 300,140 120,140" class="d-zone" stroke-width="1.4"/>' +
      // secondary (back)
      '<polygon points="60,190 60,60 120,20 120,140" fill="var(--accent)" fill-opacity="0.10" class="d-accent" stroke-width="1.4"/>' +
      // tertiary (side)
      '<polygon points="120,140 120,20 300,20 300,140" fill="var(--accent)" fill-opacity="0.06" class="d-accent" stroke-width="1.4"/>' +
      // part (box) sitting on planes
      '<g>' +
      '<polygon points="150,150 250,150 285,122 185,122" class="d-stroke" fill="var(--surface-2)" stroke-width="1.8"/>' +
      '<polygon points="150,150 150,95 185,67 185,122" class="d-stroke" fill="var(--surface-2)" stroke-width="1.8"/>' +
      '<polygon points="150,95 250,95 285,67 185,67" class="d-stroke" fill="var(--surface-2)" stroke-width="1.8"/>' +
      '<polygon points="250,150 250,95 285,67 285,122" class="d-stroke" fill="none" stroke-width="1.8"/>' +
      "</g>" +
      txt(90, 208, "A", { fs: 15, w: 700 }) + txt(70, 44, "B", { fs: 15, w: 700 }) + txt(288, 40, "C", { fs: 15, w: 700 }) +
      // contact points markers 3-2-1
      '<circle cx="180" cy="168" r="3" class="d-accentfill"/>' +
      '<circle cx="230" cy="168" r="3" class="d-accentfill"/>' +
      '<circle cx="255" cy="140" r="3" class="d-accentfill"/>' +
      txt(150, 232, "A: 3   B: 2   C: 1", { fs: 12, cls: "d-softtext" });
    return svg(360, 245, inner);
  };

  /* Profile of a surface */
  DIAGRAMS.profileSurface = function () {
    var inner =
      // true profile
      '<path d="M30 150 C 90 60, 200 60, 300 130" class="d-soft" fill="none" stroke-dasharray="10 4 2 4" stroke-width="1.4"/>' +
      // zone boundaries offset
      '<path d="M30 136 C 92 48, 202 48, 302 118" class="d-accent" fill="none" stroke-dasharray="6 4" stroke-width="1.6"/>' +
      '<path d="M30 164 C 88 72, 198 72, 298 142" class="d-accent" fill="none" stroke-dasharray="6 4" stroke-width="1.6"/>' +
      // actual surface
      '<path d="M30 154 C 95 62, 196 58, 300 128" class="d-stroke" fill="none" stroke-width="2.4"/>' +
      arrow(310, 112, 310, 138) + txt(320, 130, "0.4", { fs: 12 });
    return svg(370, 190, inner);
  };

  /* Circular runout */
  DIAGRAMS.runout = function () {
    var inner =
      // axis
      dline(20, 100, 360, 100, "d-soft", "12 4 2 4", 1.2) +
      // datum journal (left cylinder)
      '<rect x="40" y="70" width="70" height="60" class="d-stroke" fill="var(--surface-2)" stroke-width="2"/>' +
      // measured cylinder (right, bigger)
      '<rect x="150" y="45" width="150" height="110" class="d-stroke" fill="var(--surface-2)" stroke-width="2"/>' +
      // rotation arrow
      '<path d="M 75 40 A 45 22 0 1 1 74 40.4" class="d-accent" fill="none" stroke-width="1.6"/>' +
      '<path d="M75 40 l 8 -5 M75 40 l 9 4" class="d-accent" fill="none" stroke-width="1.6"/>' +
      datumFlag(75, 132, "A") +
      // dial indicator
      dline(225, 45, 225, 18, "d-stroke", null, 2) +
      '<circle cx="225" cy="12" r="9" class="d-stroke" fill="none" stroke-width="1.8"/>' +
      dline(225, 12, 230, 6, "d-stroke", null, 1.4) +
      '<path d="M217 45 l 16 0" class="d-stroke" stroke-width="2.4"/>' +
      txt(245, 20, "0.05", { fs: 12 });
    return svg(380, 200, inner);
  };

  /* Virtual condition (hole) */
  DIAGRAMS.virtualCondition = function (L) {
    var inner =
      '<circle cx="110" cy="100" r="70" class="d-stroke" fill="none" stroke-width="2.2"/>' +
      '<circle cx="118" cy="106" r="58" class="d-accent" fill="none" stroke-dasharray="6 4" stroke-width="1.8"/>' +
      '<circle cx="110" cy="100" r="2.5" class="d-fill"/>' +
      txt(110, 22, L.mmcHole, { anchor: "middle", fs: 12 }) +
      txt(118, 190, L.vc, { anchor: "middle", fs: 12, cls: "d-accentfill", w: 700 }) +
      arrow(110, 100, 160, 60) ;
    return svg(230, 205, inner);
  };

  /* Rule #1 envelope */
  DIAGRAMS.rule1 = function (L) {
    var inner =
      // envelope at MMC
      '<rect x="40" y="40" width="280" height="80" class="d-accent" fill="none" stroke-dasharray="8 5" stroke-width="1.8"/>' +
      // bent pin inside
      '<path d="M45 60 Q 180 30 315 62 L 315 102 Q 180 132 45 100 Z" class="d-stroke" fill="var(--surface-2)" stroke-width="2.2"/>' +
      arrow(345, 40, 345, 120) + txt(353, 84, "MMC", { fs: 12 }) +
      txt(180, 150, L.envelope, { anchor: "middle", fs: 12, cls: "d-accentfill", w: 600 });
    return svg(420, 165, inner);
  };

  /* Drawing example with FCF placement (used in lesson 11) */
  DIAGRAMS.drawing = function () {
    var inner =
      // plate
      '<rect x="50" y="60" width="300" height="170" class="d-stroke" fill="none" stroke-width="2.2"/>' +
      // holes
      '<circle cx="120" cy="130" r="18" class="d-stroke" fill="none" stroke-width="2"/>' +
      '<circle cx="280" cy="130" r="18" class="d-stroke" fill="none" stroke-width="2"/>' +
      dline(120, 104, 120, 156, "d-soft", "8 3 2 3", 1) + dline(94, 130, 146, 130, "d-soft", "8 3 2 3", 1) +
      dline(280, 104, 280, 156, "d-soft", "8 3 2 3", 1) + dline(254, 130, 306, 130, "d-soft", "8 3 2 3", 1) +
      // datum flags
      datumFlag(200, 232, "A") +
      '<path d="M50 190 L38 183 L38 197 Z" class="d-fill"/>' + dline(38, 190, 16, 190) +
      '<rect x="2" y="181" width="16" height="17" class="d-stroke" fill="none" stroke-width="1.5"/>' +
      txt(10, 194, "B", { anchor: "middle", fs: 11, w: 700 }) +
      // leader to hole with dim
      dline(120, 112, 90, 40, "d-stroke", null, 1.2) +
      txt(60, 32, "2× ⌀10.0–10.2", { fs: 12 }) +
      // basic dims
      arrow(50, 250, 120, 250) + txt(85, 266, "30", { anchor: "middle", fs: 11 }) +
      '<rect x="74" y="255" width="22" height="15" class="d-stroke" fill="none" stroke-width="1"/>' +
      arrow(120, 250, 280, 250) + txt(200, 266, "80", { anchor: "middle", fs: 11 }) +
      '<rect x="188" y="255" width="24" height="15" class="d-stroke" fill="none" stroke-width="1"/>';
    return svg(400, 285, inner);
  };

  window.GDT_SVG = { SYM: SYM, fcf: fcf, DIAGRAMS: DIAGRAMS, icon: icon, PATHS: PATHS };
})();
