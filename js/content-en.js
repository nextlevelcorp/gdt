/* ===== GD&T Academy — content-en.js ===== */
(function () {
  "use strict";
  var F = GDT_SVG.fcf, SYM = GDT_SVG.SYM, D = GDT_SVG.DIAGRAMS;

  /* Shared HTML helpers (also used by content-tr.js) */
  window.GDT_H = window.GDT_H || {
    box: function (type, title, html) {
      return '<div class="box ' + type + '"><div class="box-title">' + title + "</div>" + html + "</div>";
    },
    dia: function (svgStr, caption) {
      return '<div class="diagram">' + svgStr + (caption ? '<div class="diagram-caption">' + caption + "</div>" : "") + "</div>";
    },
    tbl: function (heads, rows) {
      var h = '<div class="tbl-wrap"><table><thead><tr>';
      heads.forEach(function (x) { h += "<th>" + x + "</th>"; });
      h += "</tr></thead><tbody>";
      rows.forEach(function (r) {
        h += "<tr>";
        r.forEach(function (c) { h += "<td>" + c + "</td>"; });
        h += "</tr>";
      });
      return h + "</tbody></table></div>";
    },
    fcfDemo: function (fcfHtml, labels) {
      var h = '<div class="fcf-demo">' + fcfHtml;
      if (labels && labels.length) {
        h += '<div class="fcf-labels">';
        labels.forEach(function (l) { h += '<span class="fcf-label">' + l + "</span>"; });
        h += "</div>";
      }
      return h + "</div>";
    }
  };
  var H = window.GDT_H;

  var UI = {
    appName: "GD&T Academy",
    navHome: "Home",
    navLessons: "Lessons",
    navReference: "Reference",
    navSymbols: "Symbol Reference",
    navExam: "Final Exam",
    lessonLabel: "Lesson",
    heroTitle: "Master GD&T from zero to professional",
    heroText: "A complete, free course on Geometric Dimensioning and Tolerancing (ASME Y14.5). No prior knowledge required — every symbol, rule and concept explained step by step with diagrams, examples and quizzes.",
    heroCta: "Start learning",
    homeLessonsTitle: "Course curriculum",
    homeHowTitle: "How this course works",
    homeHowText: "Work through the lessons in order — each one builds on the previous. Finish every lesson with its short quiz (score 80% or more to mark it complete), use the Symbol Reference any time you need a reminder, and finish with the Final Exam. Your progress is saved automatically in your browser.",
    quizTitle: "Lesson quiz",
    quizIntro: "Answer all questions, then press “Check answers”. You need 80% to complete the lesson.",
    checkAnswers: "Check answers",
    tryAgain: "Try again",
    quizPass: "Passed! Lesson completed —",
    quizFail: "Not yet — review the lesson and try again.",
    scoreWord: "Score",
    prevLesson: "← Previous",
    nextLesson: "Next lesson →",
    backHome: "Home",
    completed: "Completed",
    progressText: "{done}/{total} lessons",
    resetProgress: "Reset progress",
    resetConfirm: "Delete all saved progress?",
    symTitle: "GD&T Symbol Reference",
    symIntro: "All 14 geometric characteristic symbols of ASME Y14.5 plus the most common modifiers. Use the filters to browse by category.",
    symDatum: "Datum",
    symZone: "Typical zone",
    datumYes: "Required",
    datumNo: "Never",
    datumOpt: "Optional",
    catAll: "All",
    catForm: "Form",
    catOrientation: "Orientation",
    catLocation: "Location",
    catProfile: "Profile",
    catRunout: "Runout",
    catModifier: "Modifiers",
    examTitle: "Final Exam",
    examIntro: "20 questions drawn randomly from the whole course. You need 80% to pass. You can retake it as many times as you like — a new set of questions is drawn each time.",
    examStart: "Start exam",
    examRetake: "New exam",
    examPass: "Congratulations — you passed the final exam!",
    examFail: "Below 80% — review the weak topics and try again.",
    questionWord: "Question",
    ofWord: "of",
    footer: "GD&T Academy — an educational resource based on ASME Y14.5. For production use always refer to the official standard and your company's drawing conventions.",
    minutes: "min read",
    keyPoints: "Key points",
    example: "Worked example",
    warning: "Watch out",
    definition: "Definition"
  };

  /* ---------- Symbol reference data ---------- */
  var SYMBOLS = [
    { key: "straightness", cat: "form", name: "Straightness", datum: "no", zone: "2 parallel lines / cylinder (axis)", desc: "Controls how much a line element or an axis may deviate from a perfectly straight line." },
    { key: "flatness", cat: "form", name: "Flatness", datum: "no", zone: "2 parallel planes", desc: "Controls how much an entire surface may deviate from a perfect plane." },
    { key: "circularity", cat: "form", name: "Circularity (Roundness)", datum: "no", zone: "2 concentric circles", desc: "Controls how round each individual circular cross-section is, independently of the others." },
    { key: "cylindricity", cat: "form", name: "Cylindricity", datum: "no", zone: "2 coaxial cylinders", desc: "Controls roundness, straightness and taper of a whole cylindrical surface at once." },
    { key: "perpendicularity", cat: "orientation", name: "Perpendicularity", datum: "yes", zone: "2 parallel planes / cylinder", desc: "Controls how close a surface or axis is to exactly 90° relative to a datum." },
    { key: "parallelism", cat: "orientation", name: "Parallelism", datum: "yes", zone: "2 parallel planes / cylinder", desc: "Controls how parallel a surface or axis is to a datum." },
    { key: "angularity", cat: "orientation", name: "Angularity", datum: "yes", zone: "2 parallel planes / cylinder", desc: "Controls a surface or axis at any specified basic angle relative to a datum." },
    { key: "position", cat: "location", name: "Position", datum: "yes", zone: "Cylinder / 2 parallel planes", desc: "The most used symbol in GD&T. Controls how far a feature of size may deviate from its theoretically exact (true) position." },
    { key: "concentricity", cat: "location", name: "Concentricity", datum: "yes", zone: "Cylinder about datum axis", desc: "Controls the median points of a feature relative to a datum axis. Removed from ASME Y14.5-2018; still found on older drawings." },
    { key: "symmetry", cat: "location", name: "Symmetry", datum: "yes", zone: "2 parallel planes about datum plane", desc: "Controls the median points of a feature relative to a datum center plane. Removed from ASME Y14.5-2018." },
    { key: "profileLine", cat: "profile", name: "Profile of a Line", datum: "opt", zone: "2 offset curves (2D)", desc: "Controls individual 2D cross-sections of a curved or straight contour." },
    { key: "profileSurface", cat: "profile", name: "Profile of a Surface", datum: "opt", zone: "2 offset surfaces (3D)", desc: "The most powerful symbol: can control size, form, orientation and location of any surface in one callout." },
    { key: "circularRunout", cat: "runout", name: "Circular Runout", datum: "yes", zone: "Full-indicator movement per circle", desc: "Controls each circular element of a rotating surface: dial-indicator reading while the part turns 360° about the datum axis." },
    { key: "totalRunout", cat: "runout", name: "Total Runout", datum: "yes", zone: "Full-indicator movement over surface", desc: "Like circular runout but over the entire surface at once — the indicator also traverses along the surface." },
    { key: "mmc", cat: "modifier", name: "Ⓜ — Maximum Material Condition", datum: "-", zone: "—", desc: "Tolerance applies at the size with the most material (largest shaft / smallest hole). Departing from MMC earns bonus tolerance." },
    { key: "lmc", cat: "modifier", name: "Ⓛ — Least Material Condition", datum: "-", zone: "—", desc: "Tolerance applies at the size with the least material (smallest shaft / largest hole). Used e.g. to protect minimum wall thickness." },
    { key: "proj", cat: "modifier", name: "Ⓟ — Projected Tolerance Zone", datum: "-", zone: "—", desc: "Extends the tolerance zone outside the part, over the height where a mating pin or stud actually engages." },
    { key: "freeState", cat: "modifier", name: "Ⓕ — Free State", datum: "-", zone: "—", desc: "For flexible parts: the tolerance applies while the part is unrestrained (not clamped)." },
    { key: "tangent", cat: "modifier", name: "Ⓣ — Tangent Plane", datum: "-", zone: "—", desc: "Only the plane contacting the high points of the surface must be within the zone — surface texture is ignored." },
    { key: "unilateral", cat: "modifier", name: "Ⓤ — Unequally Disposed Profile", datum: "-", zone: "—", desc: "Shifts a profile tolerance zone to one side of the true profile (e.g. all outside material)." },
    { key: "diameter", cat: "modifier", name: "⌀ — Diameter", datum: "-", zone: "—", desc: "Placed before the tolerance value it makes the tolerance zone cylindrical instead of two parallel planes." }
  ];

  /* ---------- Lessons ---------- */
  var LESSONS = [];

  /* ============ LESSON 1 ============ */
  LESSONS.push({
    id: "intro",
    title: "What is GD&T and why does it exist?",
    short: "The language of engineering drawings, its history, and why ± tolerances are not enough.",
    minutes: 12,
    sections: [
      {
        h: "A language for describing parts",
        html:
          "<p><span class='term'>GD&T</span> — <strong>Geometric Dimensioning and Tolerancing</strong> — is a symbolic language used on engineering drawings and 3D models to describe, precisely and unambiguously, the <em>allowed imperfection</em> of a manufactured part.</p>" +
          "<p>No manufacturing process is perfect. Every hole is slightly off-center, every “flat” face is slightly wavy, every shaft is slightly bent. The real engineering question is never <em>“can we make it perfect?”</em> but <em>“how imperfect can it be and still work?”</em> GD&T is the standard way to write the answer on the drawing.</p>" +
          H.box("key", UI.definition,
            "<p>GD&T defines the <strong>size</strong>, <strong>form</strong>, <strong>orientation</strong> and <strong>location</strong> of part features, and states how much each may vary. It is governed mainly by two standards: <strong>ASME Y14.5</strong> (USA, latest edition 2018) and the <strong>ISO GPS</strong> family (ISO 1101 and related). This course follows ASME Y14.5, noting ISO differences where they matter.</p>")
      },
      {
        h: "A short history: the flange that started it all",
        html:
          "<p>During World War II, British engineer <strong>Stanley Parker</strong> of the Royal Torpedo Factory noticed something odd: parts that had been <em>rejected</em> by inspection — their hole positions were outside the square ± tolerance zone — still assembled and worked perfectly.</p>" +
          "<p>He realized the problem: a hole position toleranced as ±0.1 in X and ±0.1 in Y creates a <strong>square</strong> tolerance zone. But the function — a bolt passing through — is <strong>round</strong>. A hole in the “corner” of the square is actually <em>farther</em> from the ideal position than a hole just outside the middle of an edge, yet the corner hole passes and the other fails. The square zone rejects good parts and its logic doesn't match the function.</p>" +
          "<p>Parker proposed a <strong>cylindrical tolerance zone</strong> — the seed idea from which modern GD&T grew. It was standardized in the following decades and matured into today's ASME Y14.5.</p>"
      },
      {
        h: "The problem with ± (coordinate) tolerancing",
        html:
          "<p>Traditional drawings locate a hole with two dimensions, e.g. <code>50 ±0.1</code> and <code>40 ±0.1</code>. This has three deep problems:</p>" +
          "<ol>" +
          "<li><strong>Square zone, round function.</strong> The ± zone is a 0.2 × 0.2 square. A cylindrical zone drawn through its corners (⌀0.283) has <strong>57% more area</strong> — perfectly usable parts are thrown away.</li>" +
          "<li><strong>No measurement origin.</strong> ± dimensions don't say <em>which surfaces to measure from first</em>. Two inspectors clamping the part differently get different results for the same part.</li>" +
          "<li><strong>Tolerance accumulation & ambiguity.</strong> Chains of ± dimensions stack up unpredictably, and notes like “surfaces must be square” have no measurable meaning.</li>" +
          "</ol>" +
          H.dia(D.zoneCompare({ a: "± 0.1 coordinate zone", b: "Position ⌀0.283 zone" }),
            "The same functional requirement: the square ± zone (left) vs the cylindrical position zone through its corners (right). The round zone accepts 57% more genuinely good parts.") +
          H.box("warn", UI.warning,
            "<p>GD&T does <strong>not</strong> replace ± tolerances everywhere — size dimensions (e.g. ⌀10 ±0.1) still use them. GD&T replaces ± only for <em>relationships</em>: where features are, how they are oriented, and what shape they have.</p>")
      },
      {
        h: "What GD&T gives you",
        html:
          "<ul>" +
          "<li><strong>One interpretation.</strong> Designer, machinist and inspector all read the same, mathematically defined requirement.</li>" +
          "<li><strong>Function-based tolerances.</strong> Zones match how the part actually works (round zones for round features).</li>" +
          "<li><strong>A defined measurement setup.</strong> Datums state exactly how the part is held and where measurement starts.</li>" +
          "<li><strong>Extra manufacturing tolerance for free.</strong> The cylindrical zone (+57%) and <em>bonus tolerance</em> (Lesson 10) reduce scrap without hurting function.</li>" +
          "<li><strong>Cheaper inspection decisions.</strong> Functional gauges can be built to check parts in seconds.</li>" +
          "</ul>" +
          H.box("key", UI.keyPoints,
            "<ul><li>GD&T is a precise symbolic language for allowed geometric imperfection.</li>" +
            "<li>Main standards: <strong>ASME Y14.5-2018</strong> and <strong>ISO GPS (ISO 1101)</strong>.</li>" +
            "<li>± tolerancing gives square zones, no measurement origin, and ambiguity; GD&T fixes all three.</li>" +
            "<li>A cylindrical position zone contains 57% more usable area than the equivalent square ± zone.</li></ul>")
      }
    ],
    quiz: [
      { q: "What does GD&T primarily define on a drawing?", opts: ["The material and heat treatment of a part", "The allowed variation in size, form, orientation and location of features", "The manufacturing process to be used", "The cost of the part"], a: 1, ex: "GD&T specifies how much each feature may deviate from perfect geometry — it says nothing about material, process, or cost." },
      { q: "Which standard is the main GD&T standard in the USA?", opts: ["ISO 9001", "ASME Y14.5", "DIN 476", "IPC-A-610"], a: 1, ex: "ASME Y14.5 (latest edition 2018) is the American GD&T standard; internationally the ISO GPS family (ISO 1101 etc.) is used." },
      { q: "Compared to a 0.2 × 0.2 square ± zone, the cylindrical position zone through its corners has…", opts: ["the same area", "43% less area", "57% more area", "twice the area"], a: 2, ex: "The circumscribed circle (⌀0.283) has 57% more area than the square — that extra area is all functionally acceptable." },
      { q: "What key problem of ± coordinate tolerancing do datums solve?", opts: ["Parts being too expensive", "Not knowing which surfaces to measure from, and in what order", "Drawings being too small", "Corrosion of the part"], a: 1, ex: "± dimensions define no measurement origin or sequence; datums (Lesson 4) define exactly how the part is fixtured and measured." },
      { q: "Which statement about GD&T and ± tolerances is correct?", opts: ["GD&T completely replaces all ± tolerances", "± tolerances are still used for size; GD&T handles form, orientation and location", "GD&T is only used for very cheap parts", "± tolerances are more precise than GD&T"], a: 1, ex: "Size dimensions like ⌀10 ±0.1 remain; GD&T takes over the geometric relationships that ± handles poorly." }
    ]
  });

  /* ============ LESSON 2 ============ */
  LESSONS.push({
    id: "concepts",
    title: "Core concepts and vocabulary",
    short: "Features, features of size, MMC/LMC, basic dimensions, tolerance zones, and the two fundamental rules.",
    minutes: 15,
    sections: [
      {
        h: "Feature vs. Feature of Size",
        html:
          "<p>Everything in GD&T is applied to a <span class='term'>feature</span> — a physical portion of a part: a face, a hole, a pin, a slot, an edge.</p>" +
          "<p>The most important distinction in all of GD&T is between a plain feature and a <span class='term'>feature of size (FOS)</span>:</p>" +
          H.tbl(["", "Feature (surface)", "Feature of Size (FOS)"], [
            ["What it is", "A single surface: a flat face, a contour", "A geometry with a <strong>size dimension</strong> and <strong>opposed points</strong>: a hole, a pin, a slot, a tab, a sphere"],
            ["Has a center/axis?", "No", "Yes — an axis, center plane or center point is <em>derived</em> from it"],
            ["Examples", "The top face of a plate", "⌀10 hole, ⌀12 shaft, 8 mm wide slot"],
            ["Why it matters", "Geometric controls apply to the surface itself", "Controls can apply to the <strong>axis/center plane</strong>, and material modifiers (Ⓜ/Ⓛ) become possible"]
          ]) +
          H.box("warn", UI.warning, "<p>Whether a control applies to a <em>surface</em> or to an <em>axis</em> depends on where the feature control frame is attached (Lesson 3). Attached to the size dimension → controls the axis/center plane. Pointing at the surface → controls the surface.</p>")
      },
      {
        h: "Sizes: MMC, LMC and actual local size",
        html:
          "<p>A feature of size has a toleranced size, e.g. a hole ⌀10.0–10.2. Three size concepts appear constantly:</p>" +
          "<ul>" +
          "<li><span class='term'>Actual local size</span> — any individual measured two-point distance (what a micrometer reads at one spot).</li>" +
          "<li><span class='term'>MMC — Maximum Material Condition</span> — the size at which the feature contains the <strong>most material</strong>: the <strong>largest pin</strong> (⌀10.2) or the <strong>smallest hole</strong> (⌀10.0).</li>" +
          "<li><span class='term'>LMC — Least Material Condition</span> — the size with the <strong>least material</strong>: smallest pin (⌀10.0) or largest hole (⌀10.2).</li>" +
          "</ul>" +
          H.box("example", UI.example,
            "<p>Hole ⌀10.0–10.2 → MMC = <strong>⌀10.0</strong>, LMC = <strong>⌀10.2</strong>.<br>Pin ⌀9.8–9.9 → MMC = <strong>⌀9.9</strong>, LMC = <strong>⌀9.8</strong>.</p>" +
            "<p>Memory hook: MMC is the <em>heaviest</em> version of the part; LMC is the <em>lightest</em>.</p>") +
          "<p>MMC is the critical condition for <strong>assembly</strong> (biggest pin meeting smallest hole is the tightest fit); LMC is critical for <strong>strength / wall thickness</strong>. These become tolerance modifiers in Lesson 10.</p>"
      },
      {
        h: "Basic dimensions and tolerance zones",
        html:
          "<p>A <span class='term'>basic dimension</span> is a theoretically exact value shown <strong>in a rectangular box</strong>, e.g. <code>|50|</code>. It carries <strong>no tolerance of its own</strong> — it defines the perfect, ideal geometry (the <em>true position</em>, true profile or true angle). All allowed variation comes from the geometric tolerance that refers to it.</p>" +
          "<p>A <span class='term'>tolerance zone</span> is the region of space in which the actual feature (surface, axis or center plane) must lie. Every GD&T callout creates one. The common shapes:</p>" +
          "<ul>" +
          "<li>The space between <strong>two parallel lines</strong> (straightness of a line) or <strong>two parallel planes</strong> (flatness, parallelism…)</li>" +
          "<li>A <strong>cylinder</strong> (position of a hole axis with ⌀, straightness of an axis)</li>" +
          "<li>The space between <strong>two concentric circles</strong> (circularity) or <strong>two coaxial cylinders</strong> (cylindricity)</li>" +
          "<li>The space between <strong>two offset copies of the true profile</strong> (profile tolerances)</li>" +
          "</ul>" +
          "<p>If the entire feature stays inside the zone, the part passes. There is no “90% inside” — it is binary.</p>"
      },
      {
        h: "Rule #1 — the envelope principle",
        html:
          "<p><span class='term'>Rule #1</span> of ASME Y14.5: for a feature of size, <strong>the size tolerance also controls the form</strong>. At MMC the feature must have <em>perfect form</em>: the part must never violate an imaginary perfect envelope at MMC size.</p>" +
          H.dia(D.rule1({ envelope: "Perfect-form envelope at MMC" }),
            "Rule #1: a pin may be bent or bulged, but it must still fit through a perfect ring at its MMC size. As the pin is made smaller than MMC, more form error becomes acceptable.") +
          "<ul><li>A pin at MMC everywhere must be <strong>perfectly straight</strong>.</li>" +
          "<li>Made 0.1 below MMC, it may bend up to 0.1 and still fit the envelope.</li>" +
          "<li>Rule #1 applies to individual features of size <em>only</em> — it does not relate two features to each other.</li></ul>" +
          H.box("warn", UI.warning, "<p>In the ISO system Rule #1 does <strong>not</strong> apply by default (ISO 8015: independence principle). On ISO drawings the envelope requirement must be invoked explicitly with the Ⓔ modifier. This is the single most important ASME/ISO difference.</p>")
      },
      {
        h: "Rule #2 — RFS by default",
        html:
          "<p><span class='term'>Rule #2</span>: unless a modifier is shown, every geometric tolerance applies <strong>RFS — Regardless of Feature Size</strong>. The stated tolerance is fixed; it does not grow or shrink with the actual size of the feature. To get size-dependent (bonus) tolerance you must explicitly add Ⓜ or Ⓛ (Lesson 10).</p>" +
          H.box("key", UI.keyPoints,
            "<ul><li><strong>FOS</strong> = feature with a size and opposed points → has an axis or center plane.</li>" +
            "<li><strong>MMC</strong> = most material (largest pin / smallest hole); <strong>LMC</strong> = least material.</li>" +
            "<li><strong>Basic dimensions</strong> (boxed) are exact; tolerance comes from the geometric callout.</li>" +
            "<li><strong>Rule #1</strong>: size tolerance controls form (perfect form at MMC) — ASME only.</li>" +
            "<li><strong>Rule #2</strong>: without a modifier, tolerances apply RFS.</li></ul>")
      }
    ],
    quiz: [
      { q: "Which of these is a feature of size (FOS)?", opts: ["The flat top face of a plate", "A ⌀12 hole", "A cosmetic chamfer edge", "The part's paint layer"], a: 1, ex: "A hole has a size dimension and opposed points, so an axis can be derived from it — a flat face has neither." },
      { q: "For a hole dimensioned ⌀8.0–8.4, what is its MMC size?", opts: ["⌀8.4", "⌀8.2", "⌀8.0", "⌀0.4"], a: 2, ex: "For a hole (internal feature), most material = smallest hole = ⌀8.0." },
      { q: "What does a rectangular box around a dimension mean?", opts: ["The dimension is approximate", "It is a basic (theoretically exact) dimension with no direct tolerance", "The dimension is critical and needs 100% inspection", "The dimension is in inches"], a: 1, ex: "Boxed = basic: it defines perfect geometry; the variation allowance comes from the associated geometric tolerance." },
      { q: "What does Rule #1 (envelope principle) require?", opts: ["All parts must be measured with a CMM", "A feature of size at MMC must have perfect form", "Every drawing must have three datums", "All tolerances apply at LMC"], a: 1, ex: "Rule #1: the size limits also limit form — at MMC no form error is allowed; form error may grow as the feature departs from MMC." },
      { q: "A position tolerance has no Ⓜ or Ⓛ modifier. How does it apply?", opts: ["At MMC", "At LMC", "RFS — the stated value regardless of the feature's actual size", "It is invalid"], a: 2, ex: "Rule #2: no modifier means RFS — the tolerance is constant, no bonus." },
      { q: "In the ISO GPS system, Rule #1…", opts: ["applies exactly as in ASME", "does not apply by default — independence is the default (ISO 8015)", "applies only to holes", "was invented by ISO"], a: 1, ex: "ISO defaults to the independence principle; the envelope requirement must be invoked with Ⓔ. ASME defaults to the envelope (Rule #1)." }
    ]
  });

  /* ============ LESSON 3 ============ */
  LESSONS.push({
    id: "fcf",
    title: "The Feature Control Frame",
    short: "The 'sentence' of GD&T: how to read and write the rectangular frame that carries every geometric tolerance.",
    minutes: 12,
    sections: [
      {
        h: "Anatomy of the frame",
        html:
          "<p>Every geometric tolerance is written in a <span class='term'>feature control frame (FCF)</span> — a rectangle divided into compartments, always read <strong>left to right</strong>:</p>" +
          H.fcfDemo(
            F([[{ sym: "position" }], [{ sym: "diameter" }, "0.2", { mod: "M" }], ["A"], ["B"], ["C"]]),
            ["1 — geometric characteristic", "2 — zone shape, tolerance value, modifier", "3, 4, 5 — datum references (primary, secondary, tertiary)"]) +
          "<ol>" +
          "<li><strong>Geometric characteristic symbol</strong> — which of the 14 controls is used (here: position ⌖).</li>" +
          "<li><strong>Tolerance compartment</strong> — optional <strong>⌀</strong> (zone is a cylinder), the <strong>tolerance value</strong> (total zone width/diameter, here 0.2 mm), and optional <strong>modifiers</strong> (here Ⓜ).</li>" +
          "<li><strong>Datum references</strong> — up to three letters defining the measurement setup, in order of precedence: primary, secondary, tertiary.</li>" +
          "</ol>"
      },
      {
        h: "Reading a frame as a sentence",
        html:
          "<p>Translate any FCF into a sentence with this template:</p>" +
          H.box("key", "Template",
            "<p>“The <strong>[feature]</strong> must lie within a <strong>[zone shape]</strong> tolerance zone <strong>[value]</strong> wide/diameter, <strong>[at material condition]</strong>, positioned/oriented relative to datums <strong>[A, then B, then C]</strong>.”</p>") +
          H.box("example", UI.example,
            H.fcfDemo(F([[{ sym: "position" }], [{ sym: "diameter" }, "0.2", { mod: "M" }], ["A"], ["B"], ["C"]])) +
            "<p>“The axis of this hole must lie within a <strong>cylindrical</strong> zone <strong>⌀0.2</strong> when the hole is at <strong>MMC</strong> (with bonus as it departs), the zone being located at the basic dimensions from datums <strong>A</strong> (primary), <strong>B</strong> (secondary) and <strong>C</strong> (tertiary).”</p>") +
          H.box("example", UI.example,
            H.fcfDemo(F([[{ sym: "flatness" }], ["0.1"]])) +
            "<p>“This surface must lie between <strong>two parallel planes 0.1 apart</strong>.” Form tolerances never reference datums — a surface is compared only with itself.</p>")
      },
      {
        h: "Where the frame attaches — and why it changes everything",
        html:
          "<p>The same frame means different things depending on attachment:</p>" +
          H.tbl(["Attachment", "What is controlled"], [
            ["Leader arrow pointing to a <strong>surface</strong>, or attached to an extension line", "The <strong>surface itself</strong>"],
            ["Placed <strong>with the size dimension</strong> of a feature of size (below/next to ⌀10 ±0.1)", "The <strong>axis or center plane</strong> derived from that FOS"]
          ]) +
          "<p>Example: straightness with a leader to the side of a pin controls <em>surface line elements</em>; the same straightness placed under the pin's ⌀ dimension controls the <em>axis</em> — and then a ⌀ appears in the tolerance compartment and Rule #1's perfect-form envelope is overridden.</p>" +
          H.box("warn", UI.warning, "<p>Only tolerances applied to a <strong>feature of size</strong> may use Ⓜ/Ⓛ modifiers, because bonus tolerance needs a measurable size. A modifier on a plain surface control is meaningless.</p>")
      },
      {
        h: "Reading practice",
        html:
          "<p>Cover the answers and translate these frames:</p>" +
          H.tbl(["Frame", "Meaning"], [
            [F([[{ sym: "perpendicularity" }], ["0.05"], ["A"]]), "Surface must lie between two parallel planes 0.05 apart, exactly 90° to datum A."],
            [F([[{ sym: "circularity" }], ["0.02"]]), "Each circular cross-section must lie between two concentric circles 0.02 apart (radial). No datum — form only."],
            [F([[{ sym: "profileSurface" }], ["0.4"], ["A"], ["B"]]), "Entire surface must lie in a 0.4 wide zone centered on the true profile, located relative to datums A and B."],
            [F([[{ sym: "position" }], [{ sym: "diameter" }, "0.1"], ["A"], ["B"]]), "Axis must lie in a ⌀0.1 cylindrical zone at true position from A and B, RFS (no modifier)."]
          ]) +
          H.box("key", UI.keyPoints,
            "<ul><li>FCF reads left → right: symbol, zone (⌀? value, modifier?), datums in precedence order.</li>" +
            "<li>⌀ before the value = cylindrical zone; no ⌀ = two parallel planes/lines.</li>" +
            "<li>Attachment to a size dimension → axis/center-plane control; leader to surface → surface control.</li>" +
            "<li>Datum order in the frame is the measurement order — A|B|C ≠ B|A|C.</li></ul>")
      }
    ],
    quiz: [
      { q: "In a feature control frame, what does ⌀ before the tolerance value mean?", opts: ["The feature is a hole", "The tolerance zone is cylindrical", "The tolerance is a diameter measurement in inches", "The datum is a cylinder"], a: 1, ex: "⌀ describes the shape of the tolerance zone — a cylinder — not the feature type." },
      { q: "Reading order of an FCF is:", opts: ["Right to left", "Top to bottom", "Left to right: symbol → tolerance → datums", "Datums first, then symbol"], a: 2, ex: "Always: geometric characteristic, then zone/tolerance/modifiers, then datum references in precedence order." },
      { q: "A flatness FCF contains a datum reference. What is wrong?", opts: ["Nothing — flatness often uses datums", "Form tolerances never use datums; the frame is illegal", "The datum should be at the front", "Flatness requires exactly two datums"], a: 1, ex: "Form controls (straightness, flatness, circularity, cylindricity) compare the feature only with itself — no datum reference is allowed." },
      { q: "A straightness frame is placed with the ⌀ size dimension of a pin (not pointing at its surface). What is controlled?", opts: ["The pin's surface line elements", "The pin's derived axis", "The pin's length", "The datum A"], a: 1, ex: "Associated with the size dimension → the control applies to the derived axis (and the zone becomes a cylinder if ⌀ is shown)." },
      { q: "Which frame element(s) may carry the Ⓜ modifier?", opts: ["Any tolerance on any feature", "Only tolerances applied to features of size (and datum FOS references)", "Only form tolerances", "Only profile tolerances"], a: 1, ex: "Bonus tolerance requires an actual measurable size, so Ⓜ/Ⓛ only make sense on features of size (or on datum feature-of-size references)." }
    ]
  });

  /* ============ LESSON 4 ============ */
  LESSONS.push({
    id: "datums",
    title: "Datums and the Datum Reference Frame",
    short: "How a part is 'held' for measurement: datum features, the 3-2-1 rule, and why datum order matters.",
    minutes: 15,
    sections: [
      {
        h: "Datum vs. datum feature",
        html:
          "<p>Two words that must never be confused:</p>" +
          H.tbl(["Term", "Meaning"], [
            ["<span class='term'>Datum feature</span>", "The <strong>real, imperfect surface on the part</strong> marked with the datum symbol (a boxed letter on a filled triangle)."],
            ["<span class='term'>Datum</span>", "The <strong>theoretically perfect</strong> plane, axis or point <em>derived</em> from that surface — it exists in geometry, simulated in practice by precise tooling (surface plate, chuck, pin)."]
          ]) +
          "<p>When a wavy bottom face is labeled A, datum A is the perfect plane of the <strong>surface plate it sits on</strong> — contacting the face's three highest points — not the wavy face itself. The tooling that embodies a datum (plate, vise jaw, mandrel) is called a <span class='term'>datum feature simulator</span>.</p>"
      },
      {
        h: "The Datum Reference Frame and the 3-2-1 rule",
        html:
          "<p>One datum can't fully fix a part in space. A free rigid body has <strong>six degrees of freedom</strong>: translation along X, Y, Z and rotation about each. A full <span class='term'>datum reference frame (DRF)</span> — three mutually perpendicular planes — locks all six.</p>" +
          H.dia(D.drf(), "A datum reference frame: primary plane A (3 contact points), secondary B (2 points), tertiary C (1 point) — the classic 3-2-1 fixture.") +
          "<p>The <span class='term'>3-2-1 rule</span> for planar datums:</p>" +
          "<ul>" +
          "<li><strong>Primary (A)</strong> — part rests on it with min. <strong>3 points</strong> → locks 1 translation + 2 rotations.</li>" +
          "<li><strong>Secondary (B)</strong> — pushed against it with min. <strong>2 points</strong> → locks 1 translation + 1 rotation.</li>" +
          "<li><strong>Tertiary (C)</strong> — touched with min. <strong>1 point</strong> → locks the last translation.</li>" +
          "</ul>" +
          "<p>Cylindrical datum features work differently: a datum <strong>axis</strong> (from a hole or shaft, simulated by a chuck/mandrel) locks 2 translations + 2 rotations at once, so an axis primary + face secondary is a very common DRF for turned parts.</p>"
      },
      {
        h: "Why datum order matters",
        html:
          "<p>The order A | B | C in the feature control frame is a <strong>procedure</strong>: seat fully on A first, then slide against B, then against C. Swap the order and the physical setup — and the measurement result — changes.</p>" +
          H.box("example", UI.example,
            "<p>A slightly out-of-square block measured as <strong>A then B</strong>: it sits flat on A and B touches at 2 points. Measured as <strong>B then A</strong>: it sits flat on B and now rests on A at only 2 points — every located hole is now measured from a differently-tilted part. Same part, different verdicts. The designer must choose the order that mirrors <strong>how the part is actually mounted in the assembly</strong>.</p>") +
          H.box("key", "Choosing datum features",
            "<ul><li>Pick the surfaces that <strong>mount / locate the part in real life</strong> (bolt face, locating bores).</li>" +
            "<li>Pick surfaces that are <strong>large, stable and accessible</strong> for fixturing.</li>" +
            "<li>Datum features usually get their own tight form/orientation controls (e.g. flatness on A, perpendicularity to A on B) so the foundation is trustworthy.</li></ul>")
      },
      {
        h: "Datum targets and other refinements",
        html:
          "<p>On castings, forgings and sheet metal, whole surfaces are too rough or unstable to use. <span class='term'>Datum targets</span> designate specific <strong>points, lines or small areas</strong> (symbol: a circle with crosshairs, labeled A1, A2, A3…) where the fixture must touch — making the setup repeatable on imperfect surfaces.</p>" +
          "<p>You will also meet in practice:</p>" +
          "<ul>" +
          "<li><strong>Datum feature of size referenced at Ⓜ (MMB)</strong> — the fixture becomes a fixed-size gauge pin/hole and the part may shift slightly within the gauge: <em>datum shift</em> (Lesson 10 territory).</li>" +
          "<li><strong>Common datum (A–B)</strong> — one axis built from two coaxial journals, typical for shafts and runout (Lesson 9).</li>" +
          "</ul>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Datum feature = real surface; datum = perfect derived geometry, embodied by a simulator.</li>" +
            "<li>A rigid body has 6 degrees of freedom; a 3-plane DRF locks all of them (3-2-1).</li>" +
            "<li>Datum precedence order = physical fixturing order; changing it changes results.</li>" +
            "<li>Choose datum features from the functional mounting surfaces.</li>" +
            "<li>Datum targets make rough parts (castings) measurable and repeatable.</li></ul>")
      }
    ],
    quiz: [
      { q: "What is the difference between a datum and a datum feature?", opts: ["They are the same thing", "The datum feature is the real surface; the datum is the perfect plane/axis derived from it", "The datum is on the part; the datum feature is on the fixture", "A datum feature is only used in ISO drawings"], a: 1, ex: "The imperfect physical surface is the datum feature; the theoretical perfect geometry (simulated by tooling) is the datum." },
      { q: "How many degrees of freedom does an unconstrained rigid part have?", opts: ["3", "4", "6", "9"], a: 2, ex: "Three translations (X, Y, Z) and three rotations — a full DRF locks all six." },
      { q: "In the 3-2-1 rule, the primary datum feature contacts the fixture with at least…", opts: ["1 point", "2 points", "3 points", "6 points"], a: 2, ex: "3 points define the primary plane; 2 more the secondary; 1 more the tertiary." },
      { q: "A frame reads |⌖|⌀0.2|A|B|. During inspection you must…", opts: ["Contact B first, then A", "Seat the part fully on A first, then constrain with B", "Use A and B simultaneously with equal force", "Ignore B if A is good"], a: 1, ex: "Datum order is procedure: primary seats first with full contact, then secondary, then tertiary." },
      { q: "Why are datum targets used on castings?", opts: ["To make the drawing look professional", "Because whole cast surfaces are too rough/unstable — specific points/areas give a repeatable setup", "To avoid using fixtures", "Because castings have no surfaces"], a: 1, ex: "Datum targets define exactly which points/lines/areas the fixture touches, so every measurement uses the same setup despite rough surfaces." },
      { q: "Which surfaces make the best datum features?", opts: ["The smallest surfaces on the part", "Any surface chosen at random", "The functional surfaces that mount and locate the part in the assembly", "Only painted surfaces"], a: 2, ex: "Datums should mirror real-life mounting — that way, measurement simulates function." }
    ]
  });

  /* ============ LESSON 5 ============ */
  LESSONS.push({
    id: "form",
    title: "Form tolerances",
    short: "Straightness, flatness, circularity, cylindricity — controlling a feature's shape against itself, no datums.",
    minutes: 15,
    sections: [
      {
        h: "What form tolerances have in common",
        html:
          "<ul>" +
          "<li>They compare a feature <strong>only with its own ideal shape</strong> — never with another feature. Therefore they use <strong>no datum references</strong>.</li>" +
          "<li>They <strong>refine Rule #1</strong>: the size tolerance already limits form; a form tolerance tightens it, so it must be <strong>smaller than the size tolerance</strong> (except axis straightness, which may override Rule #1).</li>" +
          "<li>They never control location or orientation.</li>" +
          "</ul>"
      },
      {
        h: "Straightness ⏤",
        html:
          H.fcfDemo(F([[{ sym: "straightness" }], ["0.05"]])) +
          "<p><strong>Surface straightness</strong> (leader to the surface): each <em>line element</em> of the surface, in the view shown, must lie between two parallel lines 0.05 apart. Each line is checked independently.</p>" +
          H.dia(D.straightness(), "Surface straightness: one line element of the surface must fit between two parallel lines 0.05 apart.") +
          "<p><strong>Axis straightness</strong> (frame under the ⌀ dimension, ⌀ in the tolerance): the <em>derived axis</em> must fit in a ⌀0.05 cylinder. This is the one form control that <strong>overrides Rule #1</strong> — the part may violate the MMC envelope by the stated amount, and Ⓜ may be applied to it.</p>"
      },
      {
        h: "Flatness ⏥",
        html:
          H.fcfDemo(F([[{ sym: "flatness" }], ["0.1"]])) +
          "<p>The <strong>entire surface</strong> must lie between two parallel planes 0.1 apart. The planes float — they are not parallel to anything else, they just sandwich the surface as tightly as possible.</p>" +
          H.dia(D.flatness(), "Flatness: the whole surface must fit between two parallel planes 0.1 apart. The zone's orientation is free.") +
          "<p>Typical uses: sealing faces (gaskets), mounting faces, and above all <strong>primary datum features</strong> — a flatness callout on datum feature A guarantees the part sits stably.</p>" +
          H.box("warn", UI.warning, "<p>Flatness is <strong>not</strong> parallelism: flatness ignores every other feature; parallelism (Lesson 6) ties the surface's orientation to a datum <em>and</em> incidentally controls its flatness too.</p>")
      },
      {
        h: "Circularity ○ and cylindricity ⌭",
        html:
          H.fcfDemo(F([[{ sym: "circularity" }], ["0.02"]])) +
          "<p><strong>Circularity (roundness)</strong>: at every cross-section along the feature, the surface must lie between <strong>two concentric circles</strong> whose radii differ by 0.02. Each cross-section is evaluated separately — circularity does <em>not</em> control taper or a bent axis.</p>" +
          H.dia(D.circularity(), "Circularity: each cross-section must fit between two concentric circles 0.08 apart (radially).") +
          H.fcfDemo(F([[{ sym: "cylindricity" }], ["0.1"]])) +
          "<p><strong>Cylindricity</strong> is circularity's 3D big brother: the <strong>whole surface at once</strong> must lie between <strong>two coaxial cylinders</strong> 0.1 apart radially. One callout simultaneously limits roundness, straightness of the surface, <em>and</em> taper.</p>" +
          H.dia(D.cylindricity(), "Cylindricity: the entire surface between two coaxial cylinders — controls roundness + straightness + taper together.") +
          H.box("warn", UI.warning, "<p>Circularity and cylindricity zones are <strong>radial</strong> distances between the two circles/cylinders — a common exam trap: the 0.02 is not a diameter difference.</p>")
      },
      {
        h: "Choosing and measuring",
        html:
          H.tbl(["Control", "Zone", "Controls", "Typical measurement"], [
            ["Straightness (line)", "2 parallel lines", "One line element at a time", "Straightedge + feeler; profilometer"],
            ["Straightness (axis)", "Cylinder ⌀t", "The derived axis", "V-blocks + indicator; CMM"],
            ["Flatness", "2 parallel planes", "Whole surface", "Surface plate + indicator sweep; CMM"],
            ["Circularity", "2 concentric circles", "Each cross-section", "Roundness tester (rotating table)"],
            ["Cylindricity", "2 coaxial cylinders", "Whole cylindrical surface", "Roundness tester with axial scan; CMM"]
          ]) +
          H.box("key", UI.keyPoints,
            "<ul><li>Form = shape vs itself: <strong>no datums, ever</strong>.</li>" +
            "<li>Form tolerances refine Rule #1, so they must be tighter than the size tolerance.</li>" +
            "<li>Flatness zone = two parallel planes; circularity/cylindricity zones are radial.</li>" +
            "<li>Circularity checks slices; cylindricity checks the whole surface (roundness + straightness + taper).</li>" +
            "<li>Axis straightness with ⌀ overrides Rule #1's perfect-form envelope.</li></ul>")
      }
    ],
    quiz: [
      { q: "Why do form tolerances never reference datums?", opts: ["To save drawing space", "Because they compare the feature only with its own ideal shape", "Because datums are optional everywhere", "They do reference datums"], a: 1, ex: "Form is self-referential — a surface is checked against a floating ideal, not against any other feature." },
      { q: "A surface has flatness 0.1. What must be true?", opts: ["The surface must be parallel to datum A within 0.1", "The whole surface must fit between two parallel planes 0.1 apart, in any orientation", "Each point must be within 0.1 of the CAD model", "The surface roughness must be under 0.1 µm"], a: 1, ex: "The two planes float with the surface; flatness says nothing about orientation to other features or roughness." },
      { q: "Which control limits roundness, straightness AND taper of a shaft surface with one callout?", opts: ["Circularity", "Straightness", "Cylindricity", "Perpendicularity"], a: 2, ex: "Cylindricity's two-coaxial-cylinder zone constrains the whole surface — roundness, straightness and taper at once." },
      { q: "A circularity tolerance of 0.02 means…", opts: ["each cross-section fits between two concentric circles 0.02 apart radially", "the diameter may vary by 0.02 along the length", "the whole cylinder fits between two coaxial cylinders", "the axis is straight within 0.02"], a: 0, ex: "Circularity is per-cross-section and its zone is a radial distance; it doesn't control taper or the axis." },
      { q: "Which form control can override Rule #1's perfect-form-at-MMC envelope?", opts: ["Flatness", "Circularity", "Axis straightness (frame placed with the size dimension)", "Surface straightness"], a: 2, ex: "Axis straightness explicitly allows the feature to violate the MMC envelope by the stated tolerance — the only form control that does." },
      { q: "Flatness 0.2 is applied to a face whose size tolerance already limits form to 0.15 via Rule #1. This flatness is…", opts: ["a good refinement", "meaningless — it is looser than what Rule #1 already guarantees", "required by law", "tighter than Rule #1"], a: 1, ex: "A form tolerance must be tighter than the control Rule #1 already provides, otherwise it adds nothing." }
    ]
  });

  /* ============ LESSON 6 ============ */
  LESSONS.push({
    id: "orientation",
    title: "Orientation tolerances",
    short: "Perpendicularity, parallelism, angularity — controlling angle relative to a datum (but not location).",
    minutes: 12,
    sections: [
      {
        h: "What orientation tolerances do",
        html:
          "<p>Orientation controls fix the <strong>angle</strong> of a feature relative to a datum: 90° (perpendicularity ⟂), 0° (parallelism ∥), or any other basic angle (angularity ∠). All three:</p>" +
          "<ul>" +
          "<li><strong>Require at least one datum</strong> — an angle must be measured <em>from</em> something.</li>" +
          "<li>Create a zone of <strong>two parallel planes</strong> (or a <strong>cylinder</strong>, for an axis with ⌀) held at the exact basic angle to the datum.</li>" +
          "<li><strong>Do NOT control location.</strong> The zone may float anywhere — only its angle is fixed. Position or profile controls location.</li>" +
          "<li>Incidentally control <strong>form</strong>: a surface trapped between two planes 0.1 apart is automatically flat within 0.1.</li>" +
          "</ul>"
      },
      {
        h: "Perpendicularity ⟂",
        html:
          H.fcfDemo(F([[{ sym: "perpendicularity" }], ["0.1"], ["A"]])) +
          "<p>The surface must lie between two parallel planes 0.1 apart that are <strong>exactly 90°</strong> to datum A.</p>" +
          H.dia(D.perpendicularity(), "Perpendicularity: the wall surface must fit inside a 0.1-wide zone held exactly 90° to datum A. The zone can slide left–right (no location control).") +
          "<p>Applied to a hole's axis with ⌀ — e.g. " + F([[{ sym: "perpendicularity" }], [{ sym: "diameter" }, "0.05", { mod: "M" }], ["A"]]) + " — the axis must stay in a ⌀0.05 cylinder perpendicular to A. This is the classic callout for dowel and bolt holes, often with Ⓜ so a functional gauge can check it.</p>"
      },
      {
        h: "Parallelism ∥",
        html:
          H.fcfDemo(F([[{ sym: "parallelism" }], ["0.2"], ["A"]])) +
          "<p>The surface must lie between two parallel planes 0.2 apart that are <strong>exactly parallel</strong> to datum A. The <em>distance</em> from A is set by the ± or basic size dimension — parallelism only refines the angle within that size zone.</p>" +
          H.dia(D.parallelism(), "Parallelism: the top face must fit in a 0.2 zone parallel to datum A. Its height is controlled by the size dimension, not by this callout.")
      },
      {
        h: "Angularity ∠",
        html:
          H.fcfDemo(F([[{ sym: "angularity" }], ["0.15"], ["A"]])) +
          "<p>For any angle other than 0°/90°: the surface must lie in a 0.15 zone held at the <strong>basic angle</strong> (e.g. |30°|, boxed, untoleranced) to datum A.</p>" +
          H.dia(D.angularity(), "Angularity: a 0.15-wide zone at the basic 30° angle to datum A.") +
          H.box("warn", UI.warning,
            "<p>Angularity replaces the old “30° ±1°” style. A ± degree tolerance creates a <strong>wedge</strong> that widens with distance from the vertex; angularity creates a <strong>constant-width</strong> zone — far better matched to function. Since 2009, perpendicularity and parallelism are officially just special cases of angularity.</p>")
      },
      {
        h: "Summary",
        html:
          H.tbl(["Control", "Basic angle", "Datum", "Also limits form?"], [
            ["Perpendicularity ⟂", "90°", "Required", "Yes (within its zone)"],
            ["Parallelism ∥", "0°", "Required", "Yes"],
            ["Angularity ∠", "Any basic angle", "Required", "Yes"]
          ]) +
          H.box("key", UI.keyPoints,
            "<ul><li>Orientation = angle to a datum; datum is mandatory.</li>" +
            "<li>The zone floats in space — orientation never controls location.</li>" +
            "<li>An orientation tolerance on a surface automatically limits its flatness to the same value.</li>" +
            "<li>Angles other than 0°/90° use angularity with a boxed basic angle.</li>" +
            "<li>Orientation tolerance must be tighter than the location tolerance it refines.</li></ul>")
      }
    ],
    quiz: [
      { q: "What do all orientation tolerances require?", opts: ["A ⌀ symbol", "At least one datum reference", "An Ⓜ modifier", "Exactly three datums"], a: 1, ex: "An angle is meaningless without a reference — orientation controls always cite at least one datum." },
      { q: "Perpendicularity 0.1 to A on a wall controls…", opts: ["the wall's distance from the part edge", "the wall's angle (90° to A) — and incidentally its flatness — but not its location", "only the wall's surface finish", "the size of the wall"], a: 1, ex: "The zone is fixed at 90° to A but free to translate: orientation, not location." },
      { q: "A face is dimensioned 25 ±0.1 above datum A and carries parallelism 0.05 to A. Which statement is right?", opts: ["The face may be anywhere between 24.9 and 25.1, and within that must be parallel/flat within 0.05", "The face must be exactly 25.05 high", "Parallelism overrides the size dimension", "The callout is illegal"], a: 0, ex: "Size sets the location window; parallelism refines angle (and form) inside it." },
      { q: "Why is angularity better than a ±1° angle tolerance?", opts: ["It is cheaper to machine", "A ± degree zone is a wedge that grows with distance; angularity gives a constant-width zone", "It requires no measurement", "It allows more variation everywhere"], a: 1, ex: "A constant-width zone matches function; a wedge lets faraway points wander much more than near ones." },
      { q: "A surface has parallelism 0.1 to A. What is its maximum possible flatness error?", opts: ["Unlimited", "0.2", "0.1", "0.05"], a: 2, ex: "The surface is trapped between two planes 0.1 apart, so it cannot be less flat than 0.1 — orientation includes form." }
    ]
  });

  /* ============ LESSON 7 ============ */
  LESSONS.push({
    id: "location",
    title: "Location tolerances: Position",
    short: "The most-used symbol in GD&T — true position, cylindrical zones, hole patterns (plus legacy concentricity & symmetry).",
    minutes: 15,
    sections: [
      {
        h: "True position and the cylindrical zone",
        html:
          "<p><span class='term'>Position ⌖</span> controls how far the <strong>axis or center plane</strong> of a feature of size may lie from its <span class='term'>true position</span> — the theoretically exact location defined by <strong>basic dimensions</strong> from the datums.</p>" +
          H.fcfDemo(F([[{ sym: "position" }], [{ sym: "diameter" }, "0.5"], ["A"], ["B"], ["C"]])) +
          H.dia(D.position(), "Position: basic dimensions (boxed 50, 40) locate the true position; the hole's actual axis (black dot) must fall inside the ⌀0.5 cylindrical zone (blue) centered on it.") +
          "<p>Reading: “the hole's axis must lie within a ⌀0.5 cylindrical zone, perpendicular to A, located exactly 50 and 40 (basic) from datums B and C.” Note the zone is a <strong>cylinder through the whole thickness</strong> — position controls the axis <em>tilt</em> too, not just its center point.</p>"
      },
      {
        h: "Why basic dimensions are essential",
        html:
          "<p>With ± location dimensions, tolerances <strong>stack</strong>: hole 2 located from hole 1 located from the edge accumulates both errors. With position, <em>every</em> hole is located by basic (exact) dimensions from the <em>same datum system</em> — nothing stacks. Each hole gets its own independent cylindrical zone, all fixed relative to the DRF.</p>" +
          H.box("example", UI.example,
            "<p>A pattern note like <code>4× ⌀6.1–6.3</code> followed by " + F([[{ sym: "position" }], [{ sym: "diameter" }, "0.25", { mod: "M" }], ["A"], ["B"], ["C"]]) + " means: all four holes share one requirement — four ⌀0.25 zones (plus bonus) sitting at the exact basic pattern locations. This is how bolt circles and connector patterns are toleranced.</p>")
      },
      {
        h: "Position with Ⓜ — designed for assembly",
        html:
          "<p>Position is most powerful with the MMC modifier. " + F([[{ sym: "position" }], [{ sym: "diameter" }, "0.2", { mod: "M" }], ["A"], ["B"]]) + " means: ⌀0.2 zone when the hole is at MMC; every bit of extra hole size adds <strong>bonus tolerance</strong> (details in Lesson 10). The engineering logic: a bigger hole can be further off-center and the bolt still fits. Functionally exact — and it lets a fixed <strong>go-gauge</strong> verify the whole requirement in one plunge.</p>"
      },
      {
        h: "Legacy controls: concentricity ◎ and symmetry ⌯",
        html:
          "<p>Older drawings use two more location symbols:</p>" +
          "<ul>" +
          "<li><strong>Concentricity ◎</strong> — all <em>median points</em> of a surface of revolution must lie within a ⌀ zone about the datum axis.</li>" +
          "<li><strong>Symmetry ⌯</strong> — median points of a slot/tab must lie between two planes centered on the datum center plane.</li>" +
          "</ul>" +
          "<p>Both are notoriously hard to measure (you must find <em>median points</em>, not just the surface) and were <strong>removed from ASME Y14.5-2018</strong>. Modern practice replaces them with <strong>position</strong> (or runout / profile). You must still recognize them on legacy drawings.</p>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Position controls an axis/center plane relative to <strong>true position</strong> set by basic dims + datums.</li>" +
            "<li>⌀ in the frame → cylindrical zone through the feature's full depth (controls tilt too).</li>" +
            "<li>Patterns (n×) share one callout; zones don't stack because all are basic from the same DRF.</li>" +
            "<li>Position + Ⓜ = assembly guarantee + gaugeable + bonus tolerance.</li>" +
            "<li>Concentricity and symmetry are gone from ASME 2018 — use position/runout/profile instead.</li></ul>")
      }
    ],
    quiz: [
      { q: "What defines the 'true position' of a hole?", opts: ["Its ± dimensions", "Basic (boxed) dimensions from the datum reference frame", "The CNC program", "The largest measured diameter"], a: 1, ex: "True position is the theoretically exact location given by basic dimensions relative to the datums." },
      { q: "In |⌖|⌀0.5|A|B|C|, what must lie inside the ⌀0.5 zone?", opts: ["The hole's surface", "The hole's derived axis, through the full depth", "Only the hole's top edge", "Datum A"], a: 1, ex: "Position on a hole controls the derived axis — the whole axis line, so tilt is limited too." },
      { q: "Why doesn't tolerance stack occur in a position-toleranced hole pattern?", opts: ["Because holes are drilled together", "Because every hole is located by basic dimensions from the same datum system", "Because Ⓜ removes all error", "Stacking does occur"], a: 1, ex: "No hole is dimensioned from another hole; all are exact from one DRF, so errors don't chain." },
      { q: "What happened to concentricity and symmetry in ASME Y14.5-2018?", opts: ["They became mandatory", "They were removed; position, runout or profile are used instead", "They were merged into flatness", "They only apply with Ⓛ now"], a: 1, ex: "Both median-point controls were dropped in 2018 for being hard to measure with little functional benefit." },
      { q: "The biggest practical advantage of position at Ⓜ for production is…", opts: ["prettier drawings", "it can be checked with a fixed functional gauge and grants bonus tolerance", "it removes the need for datums", "it makes holes rounder"], a: 1, ex: "MMC position matches assembly function, earns bonus as holes grow, and a simple go-gauge verifies it instantly." }
    ]
  });

  /* ============ LESSON 8 ============ */
  LESSONS.push({
    id: "profile",
    title: "Profile tolerances",
    short: "Profile of a line and of a surface — the most powerful controls in GD&T, for any shape.",
    minutes: 12,
    sections: [
      {
        h: "The idea: a tolerance band around the true shape",
        html:
          "<p>Profile controls compare the real surface with the <span class='term'>true profile</span> — the exact shape defined by basic dimensions (or the CAD model). The tolerance creates a band: <strong>two copies of the true profile</strong>, offset to contain a zone of the stated width.</p>" +
          H.fcfDemo(F([[{ sym: "profileSurface" }], ["0.4"], ["A"], ["B"]])) +
          H.dia(D.profileSurface(), "Profile of a surface 0.4: the real surface (solid) must stay inside a band of two curves offset ±0.2 from the true profile (center dash-dot)."),
      },
      {
        h: "Line vs. surface",
        html:
          H.tbl(["", "Profile of a line ⌒", "Profile of a surface ⌓"], [
            ["Zone", "2D — two offset curves, evaluated at <strong>each cross-section</strong> independently", "3D — two offset surfaces containing the <strong>entire surface at once</strong>"],
            ["Analogy", "Circularity : cylindricity, but for any shape", "—"],
            ["Typical use", "Extrusions, blends, airfoil sections", "Cast/molded surfaces, complex 3D geometry — the modern default"]
          ]) +
          "<p>By default the zone is <strong>bilateral</strong> — split equally (±t/2) either side of the true profile. The Ⓤ modifier makes it <strong>unequally disposed</strong>: " + F([[{ sym: "profileSurface" }], ["0.4", { mod: "U" }, "0.4"], ["A"]]) + " puts all 0.4 <em>outside</em> the true profile (the value after Ⓤ = amount in the “add material” direction).</p>"
      },
      {
        h: "One symbol, four jobs",
        html:
          "<p>Profile of a surface is unique: depending on datums, one callout can control <strong>form, orientation, location and even size</strong>:</p>" +
          H.tbl(["Callout", "Controls"], [
            [F([[{ sym: "profileSurface" }], ["0.4"]]), "<strong>Form only</strong> (no datums): the shape must match the true profile, but may float anywhere."],
            [F([[{ sym: "profileSurface" }], ["0.4"], ["A"]]), "<strong>Form + orientation</strong> to A."],
            [F([[{ sym: "profileSurface" }], ["0.4"], ["A"], ["B"], ["C"]]), "<strong>Form + orientation + location</strong>: the band is fully fixed in the DRF. On a closed contour this also bounds <strong>size</strong>."]
          ]) +
          "<p>Because of this flexibility, modern model-based drawings often carry a general note like <em>“UNLESS OTHERWISE SPECIFIED: profile of a surface 0.5 to A|B|C”</em> — one sentence tolerancing every undimensioned surface of the CAD model.</p>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Profile = band around the exact (basic/CAD) shape; works for <strong>any</strong> geometry.</li>" +
            "<li>Line profile = per cross-section (2D); surface profile = whole surface (3D).</li>" +
            "<li>Default zone is bilateral ±t/2; Ⓤ shifts it to one side.</li>" +
            "<li>Datums decide what it controls: none = form; +datums = orientation and location too.</li>" +
            "<li>Surface profile is the standard tool for castings, moldings and free-form surfaces.</li></ul>")
      }
    ],
    quiz: [
      { q: "What does a profile tolerance zone consist of?", opts: ["Two parallel planes always", "Two copies of the true profile offset to form a band of the stated width", "A single cylinder", "A square box"], a: 1, ex: "The zone follows the exact shape (basic dims / CAD), offset to the stated total width." },
      { q: "How is a profile-of-a-line zone evaluated?", opts: ["Over the whole 3D surface at once", "At each 2D cross-section independently", "Only at the two ends", "Only at datum targets"], a: 1, ex: "Line profile is 2D per section — the same relationship cylindricity has to circularity, generalized to any shape." },
      { q: "Profile of a surface 0.4 with NO datum references controls…", opts: ["form only — the shape may float", "location to datum A", "size only", "nothing; it is illegal"], a: 0, ex: "Without datums the band isn't fixed in space: only the shape (form) is controlled." },
      { q: "What does the Ⓤ modifier do in a profile callout?", opts: ["Makes the tolerance apply at MMC", "Distributes the zone unequally about the true profile (e.g. all outside)", "Doubles the tolerance", "Removes datum requirements"], a: 1, ex: "Ⓤ specifies how much of the zone lies in the add-material direction; default without it is an equal ±t/2 split." },
      { q: "Why is surface profile popular on model-based (CAD) drawings?", opts: ["It needs no measurement", "One general callout can tolerance all undimensioned CAD surfaces for form, orientation and location", "It's the only symbol CMMs understand", "It replaces datums"], a: 1, ex: "A general profile note to A|B|C covers every surface of the model with a functional, complete requirement." }
    ]
  });

  /* ============ LESSON 9 ============ */
  LESSONS.push({
    id: "runout",
    title: "Runout tolerances",
    short: "Circular and total runout — controlling rotating parts with a dial indicator.",
    minutes: 10,
    sections: [
      {
        h: "The rotating-part problem",
        html:
          "<p>For shafts, pulleys, gears and anything that spins, the functional question is: <em>how much does this surface wobble when the part rotates about its bearing axis?</em> Runout answers exactly that, and its definition <strong>is</strong> the measurement: rotate the part 360° about the datum axis and read a dial indicator on the surface. The reading (FIM — full indicator movement) must not exceed the tolerance.</p>" +
          H.dia(D.runout(), "Runout measurement: part held on datum journal A (e.g. in V-blocks or a chuck), rotated 360°; the indicator reading on the checked surface must stay within 0.05."),
      },
      {
        h: "Circular ↗ vs. total ⌰ runout",
        html:
          H.fcfDemo(F([[{ sym: "circularRunout" }], ["0.05"], ["A"]])) +
          "<p><strong>Circular runout</strong>: the indicator stays at <strong>one axial position</strong>; each circular element is checked independently (reset between positions). It catches the combination of <em>out-of-round + off-center</em> at each slice — but not taper along the length.</p>" +
          H.fcfDemo(F([[{ sym: "totalRunout" }], ["0.05"], ["A"]])) +
          "<p><strong>Total runout</strong>: the indicator also <strong>traverses along the surface</strong> while the part spins — one reading for the entire surface, no reset. It additionally catches taper, straightness and profile error of the whole surface. Strictly tighter and more expensive.</p>" +
          H.tbl(["", "Circular runout", "Total runout"], [
            ["Checks", "Each circular element separately", "Whole surface in one sweep"],
            ["Catches", "Roundness + coaxiality per slice", "Everything circular does + taper, straightness, profile"],
            ["Composite of", "circularity + concentricity (roughly)", "cylindricity + coaxiality (roughly)"],
            ["Cost", "Cheap, very common", "Tighter, use when the whole surface matters (bearing seats, seals)"]
          ])
      },
      {
        h: "Rules and usage",
        html:
          "<ul>" +
          "<li>Runout <strong>always requires a datum axis</strong> — usually a journal (A), often a common axis from two journals (<strong>A–B</strong>), matching how the shaft really sits in two bearings.</li>" +
          "<li>Runout applies <strong>only RFS</strong> — never Ⓜ/Ⓛ. It's an indicator reading; there is no bonus.</li>" +
          "<li>It can be applied to surfaces <em>around</em> the axis and to <strong>faces perpendicular</strong> to it (axial wobble of a flange face).</li>" +
          "<li>Runout is a <strong>composite</strong> control: it inherently limits circularity (and coaxiality); total runout also limits cylindricity.</li>" +
          "</ul>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Runout = dial-indicator FIM while rotating 360° about the datum axis.</li>" +
            "<li>Circular = per slice; total = whole surface with axial traverse.</li>" +
            "<li>Always needs a datum axis; always RFS.</li>" +
            "<li>Perfect for anything that spins: shafts, seal journals, brake discs, gear blanks.</li></ul>")
      }
    ],
    quiz: [
      { q: "How is circular runout fundamentally defined?", opts: ["As a CMM best-fit calculation", "As a dial-indicator reading (FIM) while the part rotates 360° about the datum axis", "As the difference between MMC and LMC", "As a surface roughness value"], a: 1, ex: "Runout is the one control whose definition literally is its classic measurement method." },
      { q: "What does total runout check that circular runout cannot?", opts: ["Roundness of one slice", "Taper and straightness along the whole surface", "Hole positions", "Material hardness"], a: 1, ex: "The axial traverse with no reset makes total runout sensitive to taper, straightness and overall profile." },
      { q: "Which modifier may be used with runout tolerances?", opts: ["Ⓜ", "Ⓛ", "None — runout is always RFS", "Ⓟ"], a: 2, ex: "Runout is an indicator reading; bonus tolerance concepts don't apply — RFS only." },
      { q: "A drawing shows runout to datum 'A–B'. What does A–B mean?", opts: ["Choose either A or B", "A common datum axis established by two journals together — like a shaft in two bearings", "Datum A minus datum B", "A is primary, B is secondary"], a: 1, ex: "A–B is one axis formed simultaneously by two features — matching real two-bearing mounting." },
      { q: "Which is the best control for the wobble of a flange face as the shaft spins?", opts: ["Flatness", "Straightness", "Runout applied to the face, datum = shaft axis", "Symmetry"], a: 2, ex: "Runout on a face perpendicular to the axis directly measures axial wobble as the part rotates." }
    ]
  });

  /* ============ LESSON 10 ============ */
  LESSONS.push({
    id: "modifiers",
    title: "Modifiers, bonus tolerance and virtual condition",
    short: "Ⓜ, Ⓛ, RFS, bonus tolerance math, virtual condition, projected zones and other advanced tools.",
    minutes: 18,
    sections: [
      {
        h: "The three material conditions",
        html:
          H.tbl(["Modifier", "Name", "Tolerance applies…", "Typical purpose"], [
            ["<span class='mod'>M</span>", "MMC — Maximum Material Condition", "at the most-material size; grows as the feature departs toward LMC", "<strong>Assembly / clearance</strong> — bolts through holes, gauging"],
            ["<span class='mod'>L</span>", "LMC — Least Material Condition", "at the least-material size; grows as the feature departs toward MMC", "<strong>Minimum wall thickness</strong>, minimum edge distance, casting stock"],
            ["(none)", "RFS — Regardless of Feature Size", "constant — the stated value, always", "Default (Rule #2); when function doesn't depend on size (e.g. balance, press fits)"]
          ])
      },
      {
        h: "Bonus tolerance — the math",
        html:
          "<p>With Ⓜ, the stated tolerance applies at MMC. As the actual size departs from MMC, that departure is added to the tolerance:</p>" +
          H.box("key", "Formula", "<p><strong>Total tolerance = stated tolerance + |actual mating size − MMC size|</strong></p>") +
          H.box("example", UI.example,
            "<p>Hole ⌀10.0–10.3 with " + F([[{ sym: "position" }], [{ sym: "diameter" }, "0.2", { mod: "M" }], ["A"], ["B"], ["C"]]) + "</p>" +
            H.dia(D.bonus({ size: "Actual hole ⌀", geo: "Stated tol", bonus: "Bonus", total: "Total position tol" }), "Bonus tolerance: every 0.1 the hole grows beyond MMC (⌀10.0) adds 0.1 of position tolerance.") +
            "<p>Why is this legitimate? Because function is <em>bolt passes through</em>: a larger hole genuinely tolerates more location error. Bonus is free manufacturing tolerance with zero functional risk.</p>") +
          H.box("warn", UI.warning, "<p>Bonus comes from the <em>toleranced feature's own size</em>. A datum feature of size referenced at Ⓜ gives something different — <strong>datum shift</strong> (the whole part may move within the gauge) — which is not added per-feature like bonus.</p>")
      },
      {
        h: "Virtual condition and functional gauges",
        html:
          "<p>The <span class='term'>virtual condition (VC)</span> is the fixed worst-case boundary generated by a feature's size and its geometric tolerance combined:</p>" +
          "<ul>" +
          "<li><strong>Internal feature (hole) at Ⓜ:</strong> VC = MMC − tolerance <em>(smallest effective opening)</em></li>" +
          "<li><strong>External feature (pin) at Ⓜ:</strong> VC = MMC + tolerance <em>(largest effective envelope)</em></li>" +
          "</ul>" +
          H.dia(D.virtualCondition({ mmcHole: "Hole MMC ⌀10.0, position ⌀0.2 Ⓜ", vc: "Virtual condition ⌀9.8" }), "A hole at MMC, displaced by its full position tolerance, leaves a guaranteed clear opening of ⌀9.8 — the virtual condition.") +
          "<p>VC is the number used to <strong>design mating parts</strong> (a ⌀9.8 pin always fits this hole) and to <strong>build functional gauges</strong>: a gauge pin at VC size, at true position, checks size + position in one operation.</p>"
      },
      {
        h: "Other modifiers you will meet",
        html:
          "<ul>" +
          "<li><strong>Ⓟ Projected tolerance zone</strong> — for threaded/press-fit holes: the zone is projected <em>above</em> the surface over the mating stud's engagement height (e.g. Ⓟ 15), because what matters is where the <em>stud</em> ends up, not the hole itself.</li>" +
          "<li><strong>Ⓕ Free state</strong> — for flexible parts (thin rings, gaskets): tolerance applies unclamped.</li>" +
          "<li><strong>Ⓣ Tangent plane</strong> — only the high-point contact plane must be in the zone; waviness below is ignored (good for clamping faces).</li>" +
          "<li><strong>Ⓤ Unequally disposed</strong> — profile zone shifted to one side (Lesson 8).</li>" +
          "<li><strong>Composite position frames</strong> — two-row position: top row locates the <em>pattern</em> to the datums (loose); bottom row controls hole-to-hole spacing <em>within</em> the pattern (tight). The standard tool for bolt patterns where relative spacing matters more than absolute pattern location.</li>" +
          "</ul>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Ⓜ = tolerance at MMC + bonus as size departs → assembly & gauging.</li>" +
            "<li>Ⓛ = tolerance at LMC + bonus toward MMC → wall thickness protection.</li>" +
            "<li>Bonus = |actual − MMC| (or LMC); RFS = never any bonus.</li>" +
            "<li>VC hole = MMC − tol; VC pin = MMC + tol; VC drives mating design and gauges.</li>" +
            "<li>Ⓟ projects the zone to the mating part's height; composite frames tolerance patterns.</li></ul>")
      }
    ],
    quiz: [
      { q: "Hole ⌀6.0–6.2, position ⌀0.1 Ⓜ. The hole measures ⌀6.15. Total position tolerance?", opts: ["⌀0.10", "⌀0.15", "⌀0.25", "⌀0.35"], a: 2, ex: "Bonus = 6.15 − 6.0 (MMC) = 0.15; total = 0.1 + 0.15 = ⌀0.25." },
      { q: "When is the Ⓛ (LMC) modifier the right choice?", opts: ["Whenever bolts must assemble", "When protecting minimum wall thickness or minimum edge distance", "Never — it is obsolete", "Only on datum features"], a: 1, ex: "LMC guards the least-material case — thin walls, edge distances, machining stock on castings." },
      { q: "Virtual condition of a hole ⌀10.0–10.3 with position ⌀0.2 Ⓜ is…", opts: ["⌀10.5", "⌀10.2", "⌀9.8", "⌀10.0"], a: 2, ex: "Internal feature: VC = MMC − tol = 10.0 − 0.2 = ⌀9.8 — the guaranteed clear opening for the mating pin." },
      { q: "What is the purpose of the Ⓟ projected tolerance zone?", opts: ["To double the tolerance above the surface", "To control the zone where the mating stud/pin actually engages, above the hole", "To project the drawing onto the part", "To replace datum C"], a: 1, ex: "For threaded holes, a tilted thread tilts the stud: controlling the zone over the engagement height guarantees the stud clears the mating part." },
      { q: "In a composite position frame, the bottom row typically controls…", opts: ["the pattern's location to the datums", "hole-to-hole relationships within the pattern (tighter)", "surface roughness", "material condition of datum A"], a: 1, ex: "Top row: pattern location (looser, full datums). Bottom row: feature-to-feature spacing/orientation (tighter, fewer datums)." },
      { q: "A tolerance with no Ⓜ/Ⓛ and a hole made anywhere in its size range gets…", opts: ["bonus equal to size departure", "exactly the stated tolerance (RFS), no bonus", "double tolerance at LMC", "no tolerance at all"], a: 1, ex: "Rule #2: RFS by default — the tolerance never changes with actual size." }
    ]
  });

  /* ============ LESSON 11 ============ */
  LESSONS.push({
    id: "reading",
    title: "Reading a real drawing, step by step",
    short: "A practical method for decoding any GD&T drawing, inspection basics, and the classic mistakes to avoid.",
    minutes: 15,
    sections: [
      {
        h: "A five-step reading method",
        html:
          "<ol>" +
          "<li><strong>Find the datums first.</strong> Locate A, B, C flags. Ask: which is primary? Does the order match how the part mounts in the machine/assembly?</li>" +
          "<li><strong>Read the title block & general notes.</strong> Standard edition (ASME Y14.5-2009? 2018?), default tolerances, general profile notes, units.</li>" +
          "<li><strong>Walk the features of size.</strong> For each hole/pin/slot: size limits → MMC/LMC → any FCF attached to the size dimension (axis controls, modifiers).</li>" +
          "<li><strong>Walk the surfaces.</strong> Profile, flatness, orientation callouts; which surfaces are datum features and how tightly are <em>they</em> controlled?</li>" +
          "<li><strong>Translate every FCF into a sentence</strong> (Lesson 3 template) and ask: could I fixture and measure this? If you can't imagine the setup, you haven't finished reading.</li>" +
          "</ol>"
      },
      {
        h: "Worked example",
        html:
          H.dia(D.drawing(), "A plate: bottom face = A, left edge = B; two ⌀10.0–10.2 holes at basic 30/80 from the datums.") +
          "<p>Suppose the pattern carries " + F([[{ sym: "position" }], [{ sym: "diameter" }, "0.25", { mod: "M" }], ["A"], ["B"]]) + " and datum feature A carries " + F([[{ sym: "flatness" }], ["0.05"]]) + ", datum feature B " + F([[{ sym: "perpendicularity" }], ["0.1"], ["A"]]) + ". The full story:</p>" +
          "<ul>" +
          "<li>Seat the part on A (flat within 0.05 — a trustworthy foundation), square against B (which is itself perpendicular to A within 0.1).</li>" +
          "<li>Each hole axis must lie in a ⌀0.25 cylinder (plus bonus up to +0.2 as holes grow to ⌀10.2) at the exact basic positions.</li>" +
          "<li>Guaranteed assembly: mating pins up to VC = 10.0 − 0.25 = <strong>⌀9.75</strong> at the same true positions will always fit.</li>" +
          "</ul>"
      },
      {
        h: "How GD&T is measured",
        html:
          H.tbl(["Tool", "What it does", "Typical checks"], [
            ["Surface plate + height gauge / indicator", "Manual datum simulation and sweeps", "Flatness, parallelism, runout (with V-blocks)"],
            ["CMM (coordinate measuring machine)", "Probes points, software fits datums and evaluates zones mathematically", "Everything — position, profile, orientation"],
            ["Functional (attribute) gauge", "Physical embodiment of virtual condition; go/no-go", "Position at Ⓜ, perpendicularity at Ⓜ"],
            ["Roundness tester", "Precision rotary table + probe", "Circularity, cylindricity, runout"],
            ["Optical/laser scanner", "Dense point cloud vs CAD", "Profile of complex surfaces"]
          ]) +
          "<p>Key insight: the FCF defines the requirement <em>independently of the tool</em>. A CMM, a gauge and a surface-plate setup must all agree because they all implement the same mathematical definition.</p>"
      },
      {
        h: "The classic mistakes",
        html:
          "<ul>" +
          "<li><strong>Datumless orientation/position</strong> — a position or perpendicularity callout with no datum reference is meaningless.</li>" +
          "<li><strong>Datums on the wrong features</strong> — datums that don't match the functional mounting produce parts that measure good and assemble badly.</li>" +
          "<li><strong>Locating holes with ± instead of basic dims</strong> — mixing coordinate and geometric location on the same feature creates contradictions.</li>" +
          "<li><strong>Form tolerance looser than the size tolerance</strong> — adds nothing (Rule #1 already did the work).</li>" +
          "<li><strong>Ⓜ on non-size features</strong> — a material modifier needs a measurable size.</li>" +
          "<li><strong>Over-tolerancing</strong> — tighter is not better: every unnecessary zero multiplies cost. Tolerance <em>what function needs</em>, as loose as function allows.</li>" +
          "</ul>" +
          H.box("key", "Where to go next",
            "<ul><li>Get the standard: <strong>ASME Y14.5-2018</strong> (or ISO 1101 for ISO environments).</li>" +
            "<li>Practice on real drawings from your own products — translate every FCF into a sentence.</li>" +
            "<li>Learn measurement: watch a CMM programmer set up datums; build intuition for what inspection can and cannot see.</li>" +
            "<li>Study tolerance stack-up analysis — the natural next skill after GD&T.</li></ul>")
      }
    ],
    quiz: [
      { q: "What should you identify FIRST when reading a GD&T drawing?", opts: ["The title block font", "The datum features and their precedence", "The smallest tolerance", "The part number"], a: 1, ex: "Datums define the coordinate system everything else is measured in — find them first." },
      { q: "A position callout on a hole has no datum references. This is…", opts: ["normal for holes", "an error — position requires datums to define true position", "allowed if the hole is small", "an ISO-only convention"], a: 1, ex: "Without datums there is no true position to measure from (position without datums exists only in rare coaxial-pattern cases — on ordinary drawings treat it as an error)." },
      { q: "Two ⌀10.0–10.2 holes carry position ⌀0.25 Ⓜ to A|B. What is the largest mating pin (at the same true positions) that always fits?", opts: ["⌀10.2", "⌀10.0", "⌀9.75", "⌀9.5"], a: 2, ex: "VC = MMC − tol = 10.0 − 0.25 = ⌀9.75 — the virtual condition is the mating-design number." },
      { q: "Why must a CMM and a functional gauge agree on a position-at-Ⓜ check?", opts: ["They never agree", "Both implement the same mathematical requirement defined by the FCF", "Because the CMM is calibrated by the gauge", "Only the gauge is legally valid"], a: 1, ex: "The FCF defines the acceptance boundary; any correct measurement method evaluates that same boundary." },
      { q: "Which is TRUE about tolerance tightness?", opts: ["Always specify the tightest tolerance your machines can achieve", "Tolerances should be as loose as function allows — unnecessary tightness only multiplies cost", "All features should share one tolerance value", "GD&T tolerances are always tighter than ± tolerances"], a: 1, ex: "The goal is functional parts at minimum cost — tolerance the function, not the process capability." }
    ]
  });

  window.GDT_CONTENT = window.GDT_CONTENT || {};
  window.GDT_CONTENT.en = { ui: UI, symbols: SYMBOLS, lessons: LESSONS };
})();
