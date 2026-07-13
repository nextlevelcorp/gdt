# GD&T Academy / GD&T Akademi

**EN** — A complete, free, interactive course that teaches GD&T (Geometric Dimensioning and Tolerancing, ASME Y14.5) from absolute zero to a professional working level. Fully bilingual: English and Turkish.

**TR** — GD&T'yi (Geometrik Boyutlandırma ve Toleranslandırma, ASME Y14.5) sıfırdan profesyonel çalışma seviyesine kadar öğreten eksiksiz, ücretsiz ve etkileşimli bir kurs. Tamamen iki dilli: İngilizce ve Türkçe.

## Features / Özellikler

- **12 detailed lessons / 12 detaylı ders** — from "what is GD&T?" to reading real drawings and *designing* with GD&T: history, core concepts, feature control frames, datums, form / orientation / location / profile / runout tolerances, modifiers, bonus tolerance, virtual condition, inspection — plus a designer's lesson: choosing datums (and thereby the fixture), fastener formulas, tolerance stack-ups, process capability and cost.
- **12 interactive & animated widgets / 12 etkileşimli ve animasyonlu widget** — drag a hole inside square-vs-cylindrical zones, bend a pin against the Rule #1 envelope, build feature control frames with live plain-language readout, seat a part on its datums step by step, watch a spinning shaft move a dial indicator (runout), simulate position bonus tolerance with an MMC/RFS toggle, explore flatness / orientation / profile with sliders, assign datums A-B-C on a bracket like a designer, and calculate position tolerances with the floating/fixed fastener formulas.
- **70+ quiz questions / 70+ quiz sorusu** — every lesson ends with a quiz (80% to pass) with explanations for every answer.
- **🧪 Plastic Design Bench / Plastik Tasarım Tezgahı** — a hands-on, **interactive 3D studio** (no quizzes). Each of the 5 stations is a live rig: **drag the 3D part to orbit it**, move the sliders, and watch the consequence of your design choice happen in real time. **🧱 Section & Sink** — thicken a rib behind a class-A surface and watch a sink mark telegraph through the paint (the 60% rule) with a live cross-section hot-spot. **📐 Draft & Ejection** — set the draft angle (grained walls need more), press EJECT and see the part lift free or drag and scuff. **🌡️ Thermal Gap** — sweep the temperature and watch the plastic grow (ΔL = α·L·ΔT) toward a steel neighbour until the gap slams shut; choose where to anchor it. **📍 Pin & Slot** — locate a panel on two pins and watch two round holes over-constrain it into a warp while a pin + slot stays flat. **🔩 Fastener & Position** — turn a bolted joint's clearance into a live position tolerance zone (floating `T = H−F` / fixed `T = (H−F)/2`) rendered as a real FCF.
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
js/trainer.js       Plastic Design Bench: interactive 3D design stations (CSS-3D + SVG, EN+TR)
js/content-en.js    English lessons, quizzes, symbol reference, UI strings
js/content-tr.js    Turkish lessons, quizzes, symbol reference, UI strings
js/app.js           hash router, i18n, quiz engine, progress, final exam
```

## Disclaimer / Not

Educational resource based on ASME Y14.5. For production use always refer to the official standard. / ASME Y14.5 temel alınarak hazırlanmış bir eğitim kaynağıdır. Üretimde her zaman resmi standarda başvurun.
