/* ===== GD&T Academy — app.js =====
 * Hash routing, i18n (EN/TR), quiz engine, progress (localStorage), final exam.
 */
(function () {
  "use strict";

  var LS_LANG = "gdt-lang";
  var LS_PROGRESS = "gdt-progress";
  var PASS_RATIO = 0.8;
  var EXAM_SIZE = 20;

  var savedLang = localStorage.getItem(LS_LANG);
  var state = {
    lang: (savedLang === "en" || savedLang === "tr") ? savedLang :
      ((navigator.language || "").toLowerCase().indexOf("tr") === 0 ? "tr" : "en"),
    progress: loadProgress(),
    examQuestions: null // current exam set: [{li, qi}]
  };

  function C() { return window.GDT_CONTENT[state.lang]; }
  function UI() { return C().ui; }
  function lessons() { return C().lessons; }

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(LS_PROGRESS)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress() {
    localStorage.setItem(LS_PROGRESS, JSON.stringify(state.progress));
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- Routing ---------- */
  function route() {
    var h = location.hash || "#/home";
    var m;
    if ((m = h.match(/^#\/lesson\/(\d+)$/))) {
      var idx = parseInt(m[1], 10) - 1;
      if (idx >= 0 && idx < lessons().length) return { page: "lesson", idx: idx };
    }
    if (h === "#/symbols") return { page: "symbols" };
    if (h === "#/trainer") return { page: "trainer" };
    if (h === "#/exam") return { page: "exam" };
    return { page: "home" };
  }

  /* ---------- Sidebar ---------- */
  function renderSidebar() {
    var r = route();
    var ui = UI();
    var h = '<div class="nav-group-label">' + ui.navHome + "</div>";
    h += navItem("#/home", "🏠", ui.navHome, r.page === "home", false);
    h += '<div class="nav-group-label">' + ui.navLessons + "</div>";
    lessons().forEach(function (l, i) {
      var done = state.progress["lesson-" + l.id];
      h += '<a class="nav-item' + (r.page === "lesson" && r.idx === i ? " active" : "") + (done ? " done" : "") + '" href="#/lesson/' + (i + 1) + '">' +
        '<span class="nav-num">' + (done ? "✓" : i + 1) + "</span>" +
        '<span class="nav-title">' + esc(l.title) + "</span>" +
        (done ? '<span class="nav-score">' + done.score + "/" + done.total + "</span>" : "") +
        "</a>";
    });
    h += '<div class="nav-group-label">' + ui.navPractice + "</div>";
    h += navItem("#/trainer", "🚗", GDT_TRAINER.ui(state.lang).navLabel, r.page === "trainer", false);
    h += '<div class="nav-group-label">' + ui.navReference + "</div>";
    h += navItem("#/symbols", "⌖", ui.navSymbols, r.page === "symbols", false);
    var examDone = state.progress["exam"];
    h += '<a class="nav-item' + (r.page === "exam" ? " active" : "") + (examDone && examDone.passed ? " done" : "") + '" href="#/exam">' +
      '<span class="nav-num">' + (examDone && examDone.passed ? "✓" : "🎓") + "</span>" +
      '<span class="nav-title">' + ui.navExam + "</span>" +
      (examDone ? '<span class="nav-score">' + examDone.score + "/" + examDone.total + "</span>" : "") +
      "</a>";
    h += '<div style="padding:16px 12px"><button class="btn ghost" id="resetBtn" style="font-size:.78rem;padding:4px 8px">' + ui.resetProgress + "</button></div>";
    document.getElementById("sidebarNav").innerHTML = h;
    var rb = document.getElementById("resetBtn");
    if (rb) rb.onclick = function () {
      if (confirm(ui.resetConfirm)) {
        state.progress = {};
        saveProgress();
        render();
      }
    };
  }
  function navItem(href, num, title, active, done) {
    return '<a class="nav-item' + (active ? " active" : "") + (done ? " done" : "") + '" href="' + href + '">' +
      '<span class="nav-num">' + num + '</span><span class="nav-title">' + esc(title) + "</span></a>";
  }

  function renderTopbar() {
    var ui = UI();
    document.querySelector(".brand span").textContent = ui.appName;
    document.title = ui.appName + " — GD&T";
    document.documentElement.lang = state.lang;
    document.getElementById("langEn").classList.toggle("active", state.lang === "en");
    document.getElementById("langTr").classList.toggle("active", state.lang === "tr");
    var done = lessons().filter(function (l) { return state.progress["lesson-" + l.id]; }).length;
    var pill = document.getElementById("progressPill");
    pill.textContent = ui.progressText.replace("{done}", done).replace("{total}", lessons().length);
    pill.title = ui.navLessons;
  }

  /* ---------- Pages ---------- */
  function renderHome() {
    var ui = UI();
    var h = '<div class="hero"><h1>' + ui.heroTitle + "</h1><p>" + ui.heroText + "</p>" +
      '<a class="btn" href="#/lesson/1">' + ui.heroCta + " →</a></div>";
    h += "<h2 style='margin-top:8px;border:0'>" + ui.homeHowTitle + "</h2><p>" + ui.homeHowText + "</p>";
    h += "<h2>" + ui.homeLessonsTitle + "</h2>";
    h += '<div class="card-grid">';
    lessons().forEach(function (l, i) {
      var done = state.progress["lesson-" + l.id];
      h += '<a class="card" href="#/lesson/' + (i + 1) + '">' +
        '<span class="card-num">' + ui.lessonLabel + " " + (i + 1) + " · " + l.minutes + " " + ui.minutes + "</span>" +
        "<h3>" + esc(l.title) + "</h3><p>" + esc(l.short) + "</p>" +
        (done ? '<span class="card-done">✓ ' + ui.completed + "</span>" : "") +
        "</a>";
    });
    var tui = GDT_TRAINER.ui(state.lang);
    h += '<a class="card" href="#/trainer"><span class="card-num">🚗 ' + ui.navPractice + "</span><h3>" + tui.title + "</h3><p>" + tui.intro + "</p></a>";
    h += '<a class="card" href="#/symbols"><span class="card-num">' + ui.navReference + "</span><h3>" + ui.symTitle + "</h3><p>" + ui.symIntro + "</p></a>";
    h += '<a class="card" href="#/exam"><span class="card-num">🎓</span><h3>' + ui.examTitle + "</h3><p>" + ui.examIntro + "</p></a>";
    h += "</div>";
    h += footer();
    return h;
  }

  function renderLesson(idx) {
    var ui = UI();
    var l = lessons()[idx];
    var h = '<div class="lesson-kicker">' + ui.lessonLabel + " " + (idx + 1) + " / " + lessons().length + " · " + l.minutes + " " + ui.minutes + "</div>";
    h += "<h1>" + esc(l.title) + "</h1>";
    h += '<p class="lesson-intro">' + esc(l.short) + "</p>";
    l.sections.forEach(function (s) {
      h += "<h2>" + esc(s.h) + "</h2>" + s.html;
    });
    /* quiz */
    h += '<div class="quiz" id="quiz"><h2>📝 ' + ui.quizTitle + "</h2><p>" + ui.quizIntro + "</p>";
    l.quiz.forEach(function (q, qi) {
      h += '<div class="quiz-q" data-q="' + qi + '"><div class="quiz-q-title">' + (qi + 1) + ". " + esc(q.q) + "</div>";
      q.opts.forEach(function (opt, oi) {
        h += '<label class="quiz-opt" data-o="' + oi + '"><input type="radio" name="q' + qi + '" value="' + oi + '"><span>' + esc(opt) + "</span></label>";
      });
      h += '<div class="quiz-explain">💡 ' + esc(q.ex) + "</div></div>";
    });
    h += '<button class="btn" id="checkQuiz">' + ui.checkAnswers + "</button>" +
      '<div class="quiz-result" id="quizResult"></div></div>';
    /* prev/next */
    h += '<div class="lesson-nav">';
    h += idx > 0 ? '<a class="btn secondary" href="#/lesson/' + idx + '">' + ui.prevLesson + "</a>" : '<a class="btn secondary" href="#/home">' + ui.backHome + "</a>";
    h += idx < lessons().length - 1
      ? '<a class="btn" href="#/lesson/' + (idx + 2) + '">' + ui.nextLesson + "</a>"
      : '<a class="btn" href="#/exam">🎓 ' + ui.examTitle + "</a>";
    h += "</div>" + footer();
    return h;
  }

  function bindQuiz(idx) {
    var quizEl = document.getElementById("quiz");
    if (!quizEl) return;
    var ui = UI();
    var l = lessons()[idx];
    document.getElementById("checkQuiz").onclick = function () {
      var score = gradeQuiz(quizEl, l.quiz);
      var total = l.quiz.length;
      var result = document.getElementById("quizResult");
      var passed = score >= Math.ceil(total * PASS_RATIO);
      result.className = "quiz-result " + (passed ? "pass" : "fail");
      result.innerHTML = (passed ? "🎉 " + ui.quizPass : "❌ " + ui.quizFail) + " " + ui.scoreWord + ": <strong>" + score + "/" + total + "</strong>";
      if (passed) {
        var prev = state.progress["lesson-" + l.id];
        if (!prev || score > prev.score) {
          state.progress["lesson-" + l.id] = { score: score, total: total };
          saveProgress();
        }
        renderSidebar();
        renderTopbar();
      } else {
        this.textContent = ui.tryAgain;
      }
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    };
  }

  /* Grade a quiz container against a question array. Returns score. */
  function gradeQuiz(container, questions) {
    var score = 0;
    container.classList.add("graded");
    questions.forEach(function (q, qi) {
      var qEl = container.querySelector('[data-q="' + qi + '"]');
      var chosen = qEl.querySelector("input:checked");
      qEl.querySelectorAll(".quiz-opt").forEach(function (optEl) {
        optEl.classList.remove("correct", "wrong");
        var oi = parseInt(optEl.getAttribute("data-o"), 10);
        if (oi === q.a) optEl.classList.add("correct");
        else if (chosen && parseInt(chosen.value, 10) === oi) optEl.classList.add("wrong");
      });
      if (chosen && parseInt(chosen.value, 10) === q.a) score++;
    });
    return score;
  }

  function renderSymbols() {
    var ui = UI();
    var cats = [
      ["all", ui.catAll], ["form", ui.catForm], ["orientation", ui.catOrientation],
      ["location", ui.catLocation], ["profile", ui.catProfile], ["runout", ui.catRunout], ["modifier", ui.catModifier]
    ];
    var h = "<h1>" + ui.symTitle + "</h1><p class='lesson-intro'>" + ui.symIntro + "</p>";
    h += '<div class="sym-filter" id="symFilter">';
    cats.forEach(function (c, i) {
      h += '<button data-cat="' + c[0] + '"' + (i === 0 ? ' class="active"' : "") + ">" + c[1] + "</button>";
    });
    h += "</div>";
    var catLabel = {};
    cats.forEach(function (c) { catLabel[c[0]] = c[1]; });
    var datumLabel = { yes: ui.datumYes, no: ui.datumNo, opt: ui.datumOpt, "-": "—" };
    h += '<div class="sym-grid" id="symGrid">';
    C().symbols.forEach(function (s) {
      h += '<div class="sym-card" data-cat="' + s.cat + '">' +
        '<div class="sym-card-head"><span class="sym-card-icon">' + GDT_SVG.SYM[s.key](30) + "</span>" +
        "<div><h3>" + esc(s.name) + '</h3><span class="sym-cat">' + catLabel[s.cat] + "</span></div></div>" +
        "<p>" + esc(s.desc) + "</p>" +
        '<div class="sym-meta"><strong>' + ui.symDatum + ":</strong> " + datumLabel[s.datum] +
        (s.zone !== "—" ? " · <strong>" + ui.symZone + ":</strong> " + esc(s.zone) : "") + "</div></div>";
    });
    h += "</div>" + footer();
    return h;
  }

  function bindSymbols() {
    var filter = document.getElementById("symFilter");
    if (!filter) return;
    filter.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      filter.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var cat = btn.getAttribute("data-cat");
      document.querySelectorAll("#symGrid .sym-card").forEach(function (card) {
        card.style.display = (cat === "all" || card.getAttribute("data-cat") === cat) ? "" : "none";
      });
    });
  }

  /* ---------- Exam ---------- */
  function pickExamQuestions() {
    var pool = [];
    lessons().forEach(function (l, li) {
      l.quiz.forEach(function (q, qi) { pool.push({ li: li, qi: qi }); });
    });
    // Fisher–Yates shuffle
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    return pool.slice(0, Math.min(EXAM_SIZE, pool.length));
  }

  function renderExam() {
    var ui = UI();
    var h = "<h1>🎓 " + ui.examTitle + "</h1><p class='lesson-intro'>" + ui.examIntro + "</p>";
    if (!state.examQuestions) {
      h += '<button class="btn" id="startExam">' + ui.examStart + "</button>";
    } else {
      h += '<div class="quiz" id="examQuiz">';
      state.examQuestions.forEach(function (ref, i) {
        var q = lessons()[ref.li].quiz[ref.qi];
        h += '<div class="quiz-q" data-q="' + i + '"><div class="quiz-q-title">' + ui.questionWord + " " + (i + 1) + " " + ui.ofWord + " " + state.examQuestions.length + " — " + esc(q.q) + "</div>";
        q.opts.forEach(function (opt, oi) {
          h += '<label class="quiz-opt" data-o="' + oi + '"><input type="radio" name="eq' + i + '" value="' + oi + '"><span>' + esc(opt) + "</span></label>";
        });
        h += '<div class="quiz-explain">💡 ' + esc(q.ex) + "</div></div>";
      });
      h += '<button class="btn" id="checkExam">' + ui.checkAnswers + "</button> " +
        '<button class="btn secondary" id="retakeExam">' + ui.examRetake + "</button>" +
        '<div class="quiz-result" id="examResult"></div></div>';
    }
    h += footer();
    return h;
  }

  function bindExam() {
    var ui = UI();
    var startBtn = document.getElementById("startExam");
    if (startBtn) {
      startBtn.onclick = function () {
        state.examQuestions = pickExamQuestions();
        render();
      };
      return;
    }
    var retake = document.getElementById("retakeExam");
    if (retake) retake.onclick = function () {
      state.examQuestions = pickExamQuestions();
      render();
    };
    var check = document.getElementById("checkExam");
    if (check) check.onclick = function () {
      var qs = state.examQuestions.map(function (ref) { return lessons()[ref.li].quiz[ref.qi]; });
      var container = document.getElementById("examQuiz");
      var score = gradeQuiz(container, qs);
      var total = qs.length;
      var passed = score >= Math.ceil(total * PASS_RATIO);
      var result = document.getElementById("examResult");
      result.className = "quiz-result " + (passed ? "pass" : "fail");
      result.innerHTML = (passed ? "🎉 " + ui.examPass : "❌ " + ui.examFail) +
        ' <span class="exam-score-big" style="margin-left:auto">' + score + "/" + total + "</span>";
      var prev = state.progress["exam"];
      if (!prev || score > prev.score) {
        state.progress["exam"] = { score: score, total: total, passed: passed || (prev && prev.passed) || false };
        saveProgress();
      } else if (passed && prev && !prev.passed) {
        prev.passed = true;
        saveProgress();
      }
      renderSidebar();
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    };
  }

  function footer() {
    return '<div class="footer-note">' + UI().footer + "</div>";
  }

  /* ---------- Main render ---------- */
  function render() {
    var r = route();
    var content = document.getElementById("content");
    if (r.page === "home") content.innerHTML = renderHome();
    else if (r.page === "lesson") { content.innerHTML = renderLesson(r.idx); bindQuiz(r.idx); }
    else if (r.page === "symbols") { content.innerHTML = renderSymbols(); bindSymbols(); }
    else if (r.page === "trainer") { GDT_TRAINER.mount(content, state.lang); }
    else if (r.page === "exam") { content.innerHTML = renderExam(); bindExam(); }
    if (window.GDT_WIDGETS) GDT_WIDGETS.mountAll(content, state.lang);
    // re-trigger entry animation
    content.classList.remove("content-anim");
    void content.offsetWidth;
    content.classList.add("content-anim");
    renderSidebar();
    renderTopbar();
    closeSidebar();
    window.scrollTo(0, 0);
  }

  /* ---------- Language switching ---------- */
  function setLang(lang) {
    if (lang === state.lang) return;
    state.lang = lang;
    localStorage.setItem(LS_LANG, lang);
    render();
  }
  document.getElementById("langEn").onclick = function () { setLang("en"); };
  document.getElementById("langTr").onclick = function () { setLang("tr"); };

  /* ---------- Mobile sidebar ---------- */
  var sidebar = document.getElementById("sidebar");
  var backdrop = document.getElementById("sidebarBackdrop");
  document.getElementById("menuToggle").onclick = function () {
    sidebar.classList.toggle("open");
    backdrop.classList.toggle("show", sidebar.classList.contains("open"));
  };
  backdrop.onclick = closeSidebar;
  function closeSidebar() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
  }

  window.addEventListener("hashchange", render);
  render();
})();
