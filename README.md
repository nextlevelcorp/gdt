# GD&T Academy / GD&T Akademi

**EN** — A complete, free, interactive course that teaches GD&T (Geometric Dimensioning and Tolerancing, ASME Y14.5) from absolute zero to a professional working level. Fully bilingual: English and Turkish.

**TR** — GD&T'yi (Geometrik Boyutlandırma ve Toleranslandırma, ASME Y14.5) sıfırdan profesyonel çalışma seviyesine kadar öğreten eksiksiz, ücretsiz ve etkileşimli bir kurs. Tamamen iki dilli: İngilizce ve Türkçe.

## Features / Özellikler

- **12 detailed lessons / 12 detaylı ders** — from "what is GD&T?" to reading real drawings and *designing* with GD&T: history, core concepts, feature control frames, datums, form / orientation / location / profile / runout tolerances, modifiers, bonus tolerance, virtual condition, inspection — plus a designer's lesson: choosing datums (and thereby the fixture), fastener formulas, tolerance stack-ups, process capability and cost.
- **12 interactive & animated widgets / 12 etkileşimli ve animasyonlu widget** — drag a hole inside square-vs-cylindrical zones, bend a pin against the Rule #1 envelope, build feature control frames with live plain-language readout, seat a part on its datums step by step, watch a spinning shaft move a dial indicator (runout), simulate position bonus tolerance with an MMC/RFS toggle, explore flatness / orientation / profile with sliders, assign datums A-B-C on a bracket like a designer, and calculate position tolerances with the floating/fixed fastener formulas.
- **70+ quiz questions / 70+ quiz sorusu** — every lesson ends with a quiz (80% to pass) with explanations for every answer.
- **Final exam / Final sınavı** — 20 random questions drawn from the whole course, new set each attempt.
- **Interactive symbol reference / Etkileşimli sembol referansı** — all 14 geometric characteristic symbols + modifiers, filterable by category.
- **Hand-drawn SVG diagrams / SVG diyagramlar** — tolerance zones, datum reference frames, bonus tolerance charts, virtual condition and more.
- **Progress tracking / İlerleme takibi** — saved in the browser (localStorage).
- **EN ⇄ TR language switch** — one click, on every page; auto-detects browser language on first visit.
- **Responsive + dark mode** — works on phones; follows the system color scheme.

## Running / Çalıştırma

No build step, no dependencies — it's a static site. / Derleme adımı ve bağımlılık yok — statik bir sitedir.

```bash
# Option 1: just open the file / dosyayı açmanız yeterli
open index.html

# Option 2: serve locally / yerel sunucu
python3 -m http.server 8000
# → http://localhost:8000
```

It can be hosted as-is on GitHub Pages, Netlify, or any static host.

## Structure / Yapı

```
index.html          app shell
css/style.css       theme (light/dark), layout, components
js/diagrams.js      SVG symbol icons + technical diagrams (language-neutral)
js/widgets.js       interactive & animated lesson widgets (drag, sliders, rAF animations)
js/content-en.js    English lessons, quizzes, symbol reference, UI strings
js/content-tr.js    Turkish lessons, quizzes, symbol reference, UI strings
js/app.js           hash router, i18n, quiz engine, progress, final exam
```

## Disclaimer / Not

Educational resource based on ASME Y14.5. For production use always refer to the official standard. / ASME Y14.5 temel alınarak hazırlanmış bir eğitim kaynağıdır. Üretimde her zaman resmi standarda başvurun.
