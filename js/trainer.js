/* ===== GD&T Academy — trainer.js =====
 * "Plastic Part Design Studio": random plastic automotive-part design
 * scenarios. Each round: a part, its interface map (surrounding parts),
 * and a step-by-step design task — datum scheme, wall/rib section
 * management, fits & clearances (incl. CLTE), molding rules, and a
 * randomized fastener calculation.
 * app.js routes #/trainer here via GDT_TRAINER.mount(container, lang).
 */
(function () {
  "use strict";

  var DATA = {

    /* ================= ENGLISH ================= */
    en: {
      ui: {
        navLabel: "Design Studio",
        title: "🚗 Plastic Part Design Studio",
        intro: "A random plastic automotive part lands on your desk. Work through it the way a plastics design engineer does: read its environment, choose the datum/locator scheme, manage walls, ribs and bosses, budget clearances (including thermal growth), respect the molding process — and calculate what needs calculating. A new random part every round.",
        newPart: "🎲 Draw a random part",
        anotherPart: "🎲 Draw another part",
        briefTitle: "Design brief",
        processWord: "Process",
        envTitle: "Interface map — what surrounds this part",
        envHeads: ["Mating part / environment", "Interface", "What matters"],
        stepWord: "Step",
        next: "Next step →",
        finish: "See the debrief →",
        resultTitle: "Debrief",
        scoreWord: "Score",
        resultPass: "Strong work — this part would survive a design review.",
        resultFail: "Review the explanations above, then draw another part — the designer's eye is built by repetition.",
        takeaways: "Key takeaways for this part",
        topics: { iface: "Interfaces & function", datum: "Datums & locators", tol: "Tolerancing", section: "Section management", fit: "Fit & clearance", calc: "Calculation", mfg: "Molding & process" },
        calcFloatQ: "Assembly: M{F} bolts and nuts pass through ⌀{H} MMC clearance holes in BOTH this part and its mate — a floating-fastener joint. Bolt MMC = ⌀{F}.0. Position tolerance available for each part's hole pattern?",
        calcFixedQ: "Assembly: ⌀{F}.0 MMC fasteners/clips are anchored in one part; the mating holes are ⌀{H} MMC — a fixed-fastener joint. Position tolerance for each part's pattern?",
        calcFloatEx: "Floating fastener: T = H − F = {H} − {F}.0 = ⌀{T} for each part, applied at Ⓜ.",
        calcFixedEx: "Fixed fastener: T = (H − F)/2 = ({H} − {F}.0)/2 = ⌀{T} per part, applied at Ⓜ — generous molded-hole clearances exist exactly because plastic patterns need this room."
      },
      parts: [
        {
          icon: "🛡️", name: "Bumper fascia", process: "Injection-molded PP/EPDM, painted",
          brief: "A 1.8-metre flexible, painted, customer-visible skin that must meet steel fenders and headlamps with perfect gaps — while being too floppy to measure like a rigid part and growing millimetres every summer.",
          env: [
            ["Steel fenders", "Visible gap & flush both sides", "CLTE mismatch: PP grows ~10× more than steel"],
            ["Headlamps", "Visible cutline", "Gap balance across three parts"],
            ["Grille / trim inserts", "Snap-fit openings", "Undercuts need slides in the tool"],
            ["Body brackets", "Screws + sliding clips", "Where the part is held — and where it may move"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "A 1.8 m flexible fascia sags under its own weight. How is it dimensioned and measured?", opts: ["Free state only — measure it on a granite table like a machined block", "Restrained: clamped on datum TARGETS that simulate the body mounts, with the restraint documented on the drawing", "Make it thick enough to be rigid, then use 3-2-1", "No datums — visual check only"], a: 1, ex: "Flexible parts are toleranced in the restrained condition: datum targets copy the real body attachment points, the drawing states the clamping, and the checking fixture rebuilds the car. Free-state checks are the documented exception (Ⓕ), not the rule." },
            { t: "mcq", topic: "fit", q: "PP on a steel body: ~1 m span, −30…+80 °C. The fascia grows several millimetres more than the fender it must gap to. Design response?", opts: ["Tighten the gap tolerance so it can't move", "Fix the part rigidly at every bracket", "Fix the CENTER, let the ends float on sliding attachments — give the thermal growth a designed direction, and set nominal gaps hot/cold", "Specify steel filler in the PP"], a: 2, ex: "ΔL = α·L·ΔT ≈ (150−12)·10⁻⁶ × 1000 mm × 60 °C ≈ 8 mm relative movement. You cannot tolerance that away: one anchored point plus sliding attachments aims the growth, and the gap study is run at temperature extremes." },
            { t: "mcq", topic: "section", q: "Stiffening ribs are needed right behind a painted class-A surface. Section rule?", opts: ["Rib thickness ≈ 50–60% of the wall it joins, generous radius, or core the rib from behind — sink marks on class-A are unshippable", "Ribs same thickness as the wall for strength", "Double-thickness ribs, painted over", "Never rib a fascia"], a: 0, ex: "A thick rib root creates a local heavy section that shrinks more and prints a sink mark through the paint. Thin ribs (50–60%), radii, and coring keep the visible side flat — section management IS surface quality on plastics." },
            { t: "mcq", topic: "mfg", q: "The fascia fills from several gates, so flow fronts meet somewhere. Weld lines are weak and visible. The designer's move?", opts: ["Weld lines are the molder's problem, not the drawing's", "Polish them off after molding", "Work with the molder on gate positions so weld lines land in hidden, low-stress zones (behind the plate recess, under trim) — before the tool is cut", "Add more gates everywhere"], a: 2, ex: "Gate layout decides where weld lines fall; once the tool is cut it's fixed. Front-loading a filling simulation and steering weld lines away from visible and impact-loaded areas is a design task, not a production afterthought." },
            { t: "mcq", topic: "tol", q: "Profile |1.0|A|B|C applies restrained. Logistics also needs the unclamped part to stay within 3.0 so it fits the shipping rack. How is that written?", opts: ["A note saying 'be careful'", "A second, looser profile callout marked Ⓕ (free state) alongside the restrained one", "Impossible — one part can't have two profiles", "Use ± dimensions for the free shape"], a: 1, ex: "Dual callouts are standard for flexible parts: the tight profile applies restrained on the datum targets; the loose Ⓕ profile bounds the free-state shape. Two requirements, two conditions, both measurable." }
          ],
          tips: [
            "Flexible part = restrained datums on targets that copy the body; Ⓕ marks the free-state exceptions.",
            "CLTE is a design input: anchor one point, slide the rest, and run gap studies hot and cold.",
            "On class-A plastics, section management (rib %, radii, coring) is what keeps the painted surface flat."
          ]
        },
        {
          icon: "💡", name: "Headlamp bracket", process: "Injection-molded PA6-GF30",
          brief: "Positions the headlamp between fender, bumper and grille — three visible gaps meet at one corner. A masterclass in tolerance chains and glass-filled molding.",
          env: [
            ["Radiator support", "Screws + locating pins", "The bracket's own mounting datums"],
            ["Headlamp housing", "Snap-fits + screws", "Lamp position = bracket position"],
            ["Fender edge", "Visible 3.5 ± 0.5 gap", "The gap every customer sees"],
            ["Bumper / grille", "Two more visible interfaces", "Gaps must be balanced, not just in-spec"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "Lamp, fender and bumper must align at one visible corner. The winning datum strategy?", opts: ["Each part locates on whichever neighbor is closest", "Chain them: fender→bracket→lamp→bumper", "Locate lamp, fender and bumper from the SAME body reference points — a common DRF cuts the chains", "Leave it to line workers to align"], a: 2, ex: "Every part-to-part link adds its tolerances to the visible gap. Locating all gap-forming parts from shared master references (common body datums) is the single strongest move in visual-quality design." },
            { t: "mcq", topic: "section", q: "Section rule for the molded bracket walls?", opts: ["Nominal uniform wall (~2.5 mm) everywhere; ribs — thinner than the wall — where stiffness is needed", "Thick blocks at load points, thin elsewhere", "Constant 6 mm for strength", "Whatever CAD fillets produce"], a: 0, ex: "Non-uniform sections in injection molding create sinks, voids and warp — which destroy the very positions you toleranced. Rib thickness ≈ 60% of the wall it meets, to avoid sink on the visible side." },
            { t: "mcq", topic: "mfg", q: "PA6-GF30 (30% glass fiber) shrinks differently along vs across fiber flow. Design consequence?", opts: ["No consequence — shrink is shrink", "Warp depends on gate position and flow direction: critical locating features should sit where flow (and the toolmaker) can keep them true — and the drawing tolerances must respect it", "Glass fiber removes all shrinkage", "Only color is affected"], a: 1, ex: "Anisotropic shrink means the tool and the part are co-designed: gate placement, flow direction and achievable profile tolerances are agreed with the molder BEFORE the drawing is released." },
            { t: "mcq", topic: "fit", q: "Gap budget: fender gap 3.5 ± 0.5 mm, with the bracket one of 4 contributors in the chain. Worst-case, what does the bracket get?", opts: ["±0.5 — same as the total", "Roughly its share of ±0.5 (≈±0.12 if split evenly) — unless you cut the chain with a common datum or an adjuster", "±1.0 — molded parts need more", "Gap budgets are inspection's problem"], a: 1, ex: "Worst-case stacks divide the budget among contributors. ±0.12 on a molded part is expensive-to-impossible — which is exactly why the datum-strategy answer (cut the chain) and adjusters exist." },
            { t: "mcq", topic: "tol", q: "The bracket's lamp-locating surfaces (pins, pads, snap seats): the natural callout?", opts: ["Circularity on each pin", "± linear dimensions from part edges", "Flatness on everything", "Profile of a surface / position, all referencing the bracket's mounting datums (radiator-support interface)"], a: 3, ex: "The features that position the lamp are controlled to the features that position the bracket — one DRF from the mounting interface, profile for the shaped seats, position for pins. The chain stays computable end to end." }
          ],
          tips: [
            "Visible-gap design: shorten tolerance chains with common datums before tightening any single tolerance.",
            "Molded sections: uniform wall, ribs at ~60%, or sink/warp will eat your position tolerances.",
            "With fiber-filled plastics, the drawing and the mold are designed together — talk to the molder early."
          ]
        },
        {
          icon: "🚪", name: "Door trim panel", process: "Injection-molded ABS, grained",
          brief: "The big visible panel the passenger touches every day: clips into the steel door, carries the switch bezel and speaker grille, and must never squeak, rattle or show a sink mark through its grain.",
          env: [
            ["Steel door inner", "Clip pattern + one screw", "Locator scheme and clip position tolerances"],
            ["Switch bezel / grille", "Snap-fit sub-parts", "Visible sub-gaps on the panel itself"],
            ["Occupant", "Grained class-A surface, touch loads", "Sink marks, stiffness, squeak & rattle"],
            ["Glass & seals", "Moving glass behind the panel", "Clearance to moving parts"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "The locator scheme is one round pin (4-way), one SLOT (2-way), plus face pads. Why a slot instead of a second round pin?", opts: ["Slots are cheaper to mold", "Two round pins over-constrain: pitch variation and thermal growth would fight the pins, warping the panel — the slot locates in one direction and releases the other", "The slot is for drainage", "Style department asked for it"], a: 1, ex: "The 4-way pin fixes X-Y, the 2-way slot fixes rotation but releases the pin-to-pin distance — exactly where molding variation and CLTE live. This pin-and-slot pattern is THE standard plastic-trim locating scheme." },
            { t: "calc", topic: "calc", kind: "fixed", Fset: [6, 8] },
            { t: "mcq", topic: "section", q: "A self-tapping screw boss on the back of the grained surface. Correct boss design?", opts: ["A solid cylinder — maximum thread engagement", "Boss wall ≈ 60% of nominal wall, cored hollow, tied to the wall with thin gussets instead of solid mass", "Attach the boss directly to the class-A wall with a thick root", "The taller the boss, the better"], a: 1, ex: "A solid or thick-rooted boss is a heavy section: it sinks through the visible grain and voids internally. Cored boss + thin gussets gives screw retention without printing its silhouette on the A-side." },
            { t: "mcq", topic: "mfg", q: "The visible side carries a leather grain texture. Effect on draft angles?", opts: ["None — texture is cosmetic", "Textured walls need MORE draft: roughly +1° per 0.025 mm of grain depth on top of the base draft, or ejection scuffs the grain", "Texture lets you use zero draft", "Draft only matters on ribs"], a: 1, ex: "Grain is thousands of tiny undercuts. Without extra draft the pattern drags on ejection and leaves shiny scuff marks — a classic late-tooling crisis that the designer prevents on day one." },
            { t: "mcq", topic: "fit", q: "Trim panel edge near the metal door frame: how do you manage the touching risk (squeak & rattle)?", opts: ["Nominal zero gap — 'just touching' looks best", "Either a DESIGNED clearance (with stack-up proof it never closes) or a designed interference through a soft element (foam, felt, flocking) — never accidental contact", "Leave 5 mm everywhere to be safe", "Squeaks are a warranty problem, not a design problem"], a: 1, ex: "S&R engineering knows only two safe states: guaranteed gap or guaranteed preload through a compliant layer. The tolerance stack must prove whichever one you chose; 'nominal touching' guarantees noise on half the cars." }
          ],
          tips: [
            "Pin + slot + pads: locate plastics without over-constraint so molding variation and CLTE have somewhere to go.",
            "Bosses and ribs follow the 60% rule and stay off the class-A wall — retention without sink.",
            "Squeak & rattle: design a proven gap or a proven preload; anything in between is noise."
          ]
        },
        {
          icon: "🌬️", name: "HVAC vent register", process: "Injection-molded ABS, multi-part",
          brief: "A palm-sized precision mechanism in the instrument panel: thin vanes pivot with a damped, premium feel; the bezel must sit flush in the IP. Small part, small tolerances, big perceived quality.",
          env: [
            ["Instrument panel", "Snap-in bezel, visible flush", "Flushness and uniform gap around the bezel"],
            ["Vanes (own sub-parts)", "Pivot pins in bores", "Rotation torque = perceived quality"],
            ["Damper & knob", "Sliding link", "Consistent effort over life"],
            ["Airflow", "Duct sealing lips", "Leakage and whistle noise"]
          ],
          steps: [
            { t: "mcq", topic: "fit", q: "Vane pivots must turn with a consistent, damped torque — forever. How is that feel engineered?", opts: ["Loose fit plus grease at assembly", "A controlled pin-to-bore fit PLUS a designed spring element (molded finger or grease-damped hub) providing preload — with the torque validated over the tolerance range", "As tight as possible; users will break it in", "Glue with a torque-limiting compound"], a: 1, ex: "Feel = friction torque = preload × radius. Relying on the raw pin/bore tolerance alone gives cars that are stiff and cars that flop; a compliant preload element keeps torque constant across the molded tolerance range." },
            { t: "mcq", topic: "mfg", q: "A 1.2 mm-thick vane fills from a gate at one end; the flow splits around the pivot boss and rejoins behind it. Risk and fix?", opts: ["No risk — thin parts always fill fine", "A weld line right at the loaded pivot: move the gate or add an overflow tab so the weld line lands in a low-stress zone", "Paint the vane to hide the line", "Thicken the whole vane to 3 mm"], a: 1, ex: "Where flow fronts rejoin, strength can drop 30–50%+ — deadly at the pivot that takes all the handling load. Gate position steers the weld line; on precision mechanisms this is decided in design, with a filling simulation." },
            { t: "mcq", topic: "section", q: "The thin vane needs a thick hub at the pivot. Managing that section jump?", opts: ["Step from 1.2 mm to 4 mm sharply — it's functional", "Blend gradually (≤3:1 over a distance, radii), core the hub where possible: abrupt thick sections sink, void and warp the vane like a banana", "Make the whole vane 4 mm", "Add a metal insert instead"], a: 1, ex: "Differential shrink between thin and thick regions bends the part as it cools. Gradual transitions and coring keep shrink uniform, so the vane stays straight enough for its bearing bores to line up." },
            { t: "mcq", topic: "datum", q: "The bezel's visible flush & gap is to the instrument panel. Datum scheme for the bezel drawing?", opts: ["The vane pivots — most precise features", "The bezel's own mounting/snap interfaces to the IP — the features that physically position it in the opening", "The outer show surface — it's what the customer sees", "Any three corners"], a: 1, ex: "Same law at every scale: datums = the features the part is located BY. The show surface is what you tolerance (profile back to those datums), not what you locate from." },
            { t: "mcq", topic: "tol", q: "A realistic general tolerance for a ~150 mm dimension on this molded ABS part?", opts: ["±0.02 mm — it's a precision part", "±0.01 mm with a good molder", "Around ±0.3 mm general (per DIN 16742 / molder capability), with only the few functional features held tighter — at cost", "Plastic parts can't hold tolerances at all"], a: 2, ex: "Molded plastics live in a wider tolerance world than machining: shrink varies with batch, moisture and process drift. Design the mechanism so most dimensions can breathe, then spend tight tolerances only on the pivots and snap interfaces." }
          ],
          tips: [
            "Perceived quality is engineered: consistent torque comes from designed preload, not from hoping tolerances land.",
            "Weld lines and section jumps are design decisions — steer them away from loaded features while gates can still move.",
            "Spend tight tolerances only on functional plastic features; give everything else molding-realistic room."
          ]
        },
        {
          icon: "⚙️", name: "Cooling fan shroud", process: "Injection-molded PA6-GF30",
          brief: "A large glass-filled ring that ducts air through the radiator and carries the fan motor: a spinning blade a few millimetres from your plastic, bolted to an aluminum radiator that grows at a different rate.",
          env: [
            ["Radiator (aluminum)", "Bolted flange, 4–6 points", "CLTE mismatch across a metre of width"],
            ["Fan blade", "Tip clearance to the shroud ring", "Efficiency wants small gap; contact is catastrophic"],
            ["Fan motor", "Central mount, 3 arms", "Arm stiffness sets blade position under load"],
            ["Vibration & heat", "Engine bay environment", "GF creep, fatigue at bolt bosses"]
          ],
          steps: [
            { t: "mcq", topic: "fit", q: "Fan tip clearance: efficiency wants it minimal, contact is catastrophic. What sets the minimum safe gap?", opts: ["Whatever the stylist left", "A stack-up: ring position/profile tolerance + motor mount position + blade tip runout + arm deflection under load + thermal moves — worst case must stay clear", "A constant 10 mm rule of thumb", "The molder decides"], a: 1, ex: "Tip gap is a computable stack, and the shroud's contribution enters as its profile/position tolerances about the mounting datums. This is why the ring and the motor mount must share one DRF — otherwise the stack has extra unknown links." },
            { t: "calc", topic: "calc", kind: "floating", Fset: [6, 8] },
            { t: "mcq", topic: "section", q: "A large, nearly flat GF30 ring panel wants to warp out of plane. Section strategy?", opts: ["Mold it dead flat and clamp it straight at assembly", "Uniform wall + rib pattern for stiffness, symmetric sections, and flow (gates) arranged so fiber orientation is balanced — accept that flatness comes from design, not from the press", "Double the wall thickness", "Anneal every part in an oven"], a: 1, ex: "Glass fiber makes shrink anisotropic: unbalanced flow = built-in warp that no process setting fully removes. Ribs, symmetry and gate layout are the flatness tolerance's real enforcers." },
            { t: "mcq", topic: "datum", q: "Datum scheme for the shroud drawing?", opts: ["A = the ring bore, alone", "A = radiator-side mounting pads (3 targets), B–C = two of the mounting holes; ring bore and motor mount toleranced to that frame", "A = the biggest flat face wherever it is", "Datums are unnecessary on flexible plastics"], a: 1, ex: "Mounted-part law again: the radiator interface locates the shroud in the car, so it locates it on the drawing. The blade-tip stack then flows through one computable frame — pads, holes, ring, motor mount." },
            { t: "mcq", topic: "mfg", q: "Weld lines in GF30 can drop strength ~50%. Where must they NOT fall on this part?", opts: ["Anywhere is fine — GF is strong", "On the visible side only", "On the motor-mount arms and bolt bosses — the fatigue-loaded load paths; steer gates so weld lines land in the quiet zones of the ring", "Weld lines don't occur in GF materials"], a: 2, ex: "In fiber-filled parts the weld line is a fiber-poor, weak seam. A vibrating motor on three arms is a fatigue machine: gate layout must keep weld lines off the arms and bosses — checked by simulation before tooling." }
          ],
          tips: [
            "Clearance to a moving blade is a worst-case stack through ONE datum frame — design it computable.",
            "GF parts: flatness and straightness are earned with ribs, symmetry and gate layout, not process heroics.",
            "Fatigue + weld lines don't mix: keep flow-front meetings away from load paths."
          ]
        },
        {
          icon: "🧴", name: "Coolant expansion tank", process: "Injection-molded PP, hot-plate welded halves",
          brief: "Two molded PP halves welded into a pressure vessel: 1.4 bar and 120 °C coolant for fifteen years. Ports, cap threads, a level sensor — and one weld seam that must never open.",
          env: [
            ["Coolant system", "1.4 bar @ 120 °C, cycling", "Creep-rated wall sections; burst ≥ 4× working"],
            ["Hoses", "Barbed spigots + spring clamps", "Barb geometry and OD tolerance = retention"],
            ["Pressure cap", "Threads + seal seat", "Seal face must be true to the thread axis"],
            ["Body bracket", "Push-in pins + one screw", "Locating scheme on a flexible tank"]
          ],
          steps: [
            { t: "mcq", topic: "mfg", q: "The two halves are hot-plate welded. What does the weld joint region need, by design?", opts: ["Two sharp edges pressed together", "Flat, parallel weld flanges perpendicular to the press direction, ~2–2.5× wall for melt, plus flash traps so molten bead stays out of sight and out of the coolant", "Glue as a backup", "A metal clamp ring"], a: 1, ex: "Hot-plate welding is a designed joint: flange area sets strength, parallelism sets even melt, flash traps capture the bead. The joint is drawn and toleranced like any functional feature — because it is one." },
            { t: "mcq", topic: "section", q: "Internal pressure pushes on the tank's large flat side walls. Section response?", opts: ["Flat thin walls — cheapest", "Crown (curve) the walls and/or add internal ribs/tie features: flat panels balloon, creep and oil-can under 1.4 bar at 120 °C", "One very thick flat wall", "Rely on the bracket to hold the shape"], a: 1, ex: "Pressure vessels hate flat panels: curvature turns bending into membrane tension, which PP handles far better — especially in creep at temperature. Shape does the work so wall thickness (and sink risk) stays sane." },
            { t: "mcq", topic: "fit", q: "The hose barbs: what actually keeps the hose sealed and on the spigot for 15 years?", opts: ["The hose is stretchy, anything works", "Barb OD size + form tolerance, bead geometry, surface finish, AND a defined clamp seat behind the barb — the spigot is a toleranced sealing system", "Adhesive inside the hose", "Safety wire"], a: 1, ex: "Retention = designed interference between barb OD and hose ID, held by the clamp on its seat. Molded spigot OD, ovality (circularity) and parting-line flash all sit inside that interference budget — flash across a sealing barb is a leak." },
            { t: "mcq", topic: "tol", q: "The cap seals on a face at the top of the molded neck. The critical geometric relationship?", opts: ["The seal face must be square/true to the THREAD AXIS (runout/perpendicularity to the thread datum) — a tilted face loads the seal unevenly and weeps", "The neck's color match", "The face's distance from the tank bottom, ±2 mm", "Thread class only, the face follows"], a: 0, ex: "The cap references the threads; the seal references the face. If the face isn't controlled about the thread axis, torque seats the cap crooked and the O-ring sees a gap on one side. Datum = thread pitch cylinder, then control the face to it." },
            { t: "mcq", topic: "datum", q: "The tank is molded in two halves that meet at the weld. How do you make sure ports, bracket pins and sensor boss line up as one part?", opts: ["Weld first, then re-machine everything true", "Design shared datum/alignment features (targets, pilot pins in the weld fixture) on BOTH halves, referenced by both half-drawings and the assembly drawing — so the halves are located the same way in molding, welding and checking", "Hope both cavities shrink identically", "Only tolerance the finished assembly"], a: 1, ex: "A welded plastic assembly is a small alignment chain: each half to its cavity, both halves to the weld fixture. Common datum features across the half drawings and the assembly drawing keep that chain computable — the same common-DRF law as everywhere else." }
          ],
          tips: [
            "Welded joints, barbs and seal seats are toleranced functional systems — draw them like it.",
            "Pressure + heat + PP = creep: let curvature and ribs carry load so walls stay moldable.",
            "Multi-piece plastic assemblies need shared datum features across every half and fixture."
          ]
        }
      ]
    },

    /* ================= TÜRKÇE ================= */
    tr: {
      ui: {
        navLabel: "Tasarım Stüdyosu",
        title: "🚗 Plastik Parça Tasarım Stüdyosu",
        intro: "Masanıza rastgele bir plastik otomobil parçası geliyor. Onu bir plastik tasarım mühendisi gibi ele alın: çevresini okuyun, datum/konumlayıcı şemasını seçin, duvarları, federleri ve bosları yönetin, boşlukları (ısıl büyüme dahil) bütçeleyin, kalıplama prosesine saygı duyun — ve hesaplanması gerekeni hesaplayın. Her turda yeni bir rastgele parça.",
        newPart: "🎲 Rastgele parça çek",
        anotherPart: "🎲 Başka parça çek",
        briefTitle: "Tasarım görevi",
        processWord: "Proses",
        envTitle: "Arayüz haritası — bu parçayı ne çevreliyor",
        envHeads: ["Eş parça / çevre", "Arayüz", "Neyin önemi var"],
        stepWord: "Adım",
        next: "Sonraki adım →",
        finish: "Değerlendirmeyi gör →",
        resultTitle: "Değerlendirme",
        scoreWord: "Puan",
        resultPass: "Sağlam iş — bu parça tasarım gözden geçirmesinden geçerdi.",
        resultFail: "Yukarıdaki açıklamaları inceleyin, sonra yeni bir parça çekin — tasarımcı gözü tekrarla gelişir.",
        takeaways: "Bu parçanın kilit dersleri",
        topics: { iface: "Arayüzler ve fonksiyon", datum: "Datum ve konumlayıcılar", tol: "Toleranslama", section: "Kesit yönetimi", fit: "Boşluk ve alıştırma", calc: "Hesap", mfg: "Kalıplama ve proses" },
        calcFloatQ: "Montaj: M{F} cıvatalar ve somunlar, HEM bu parçadaki HEM eş parçadaki ⌀{H} MMC boşluk deliklerinden geçiyor — yüzer bağlantı. Cıvata MMC = ⌀{F}.0. Her parçanın delik grubuna verilebilecek pozisyon toleransı?",
        calcFixedQ: "Montaj: ⌀{F}.0 MMC elemanlar/klipsler bir parçaya sabitlenmiş; karşı delikler ⌀{H} MMC — sabit bağlantı. Her parçanın deseni için pozisyon toleransı?",
        calcFloatEx: "Yüzer bağlantı: T = H − F = {H} − {F}.0 = her parça için ⌀{T}, Ⓜ ile uygulanır.",
        calcFixedEx: "Sabit bağlantı: T = (H − F)/2 = ({H} − {F}.0)/2 = parça başına ⌀{T}, Ⓜ ile — plastikte kalıplanmış deliklere cömert boşluk verilmesinin nedeni tam da desenlerin bu alana ihtiyaç duymasıdır."
      },
      parts: [
        {
          icon: "🛡️", name: "Tampon kaplaması", process: "Enjeksiyon PP/EPDM, boyalı",
          brief: "1,8 metrelik esnek, boyalı, müşterinin gördüğü bir kabuk: çelik çamurluklar ve farlarla kusursuz boşluklarda buluşmalı — üstelik rijit bir parça gibi ölçülemeyecek kadar esnekken ve her yaz milimetrelerce büyürken.",
          env: [
            ["Çelik çamurluklar", "İki yanda görünür boşluk ve hiza", "CLTE farkı: PP çelikten ~10 kat fazla genleşir"],
            ["Farlar", "Görünür ayrım çizgisi", "Üç parça arasında boşluk dengesi"],
            ["Panjur / trim ekleri", "Snap-fit açıklıkları", "Alttan kesmeler kalıpta maça ister"],
            ["Gövde braketleri", "Vidalar + kayar klipsler", "Parçanın tutulduğu — ve hareket edebileceği — yerler"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "1,8 m'lik esnek tampon kendi ağırlığıyla sarkar. Nasıl ölçülendirilir ve ölçülür?", opts: ["Yalnızca serbest halde — granit masada işlenmiş blok gibi", "Kısıtlanmış halde: gövde bağlantılarını taklit eden datum HEDEFLERİNE mengenelenmiş, kısıtlama resimde belgelenmiş olarak", "Rijitleşene kadar kalınlaştır, sonra 3-2-1 uygula", "Datum gerekmez — göz kontrolü yeter"], a: 1, ex: "Esnek parçalar kısıtlanmış durumda toleranslanır: datum hedefleri gerçek gövde bağlantı noktalarını kopyalar, resim mengenelemeyi belirtir, kontrol fikstürü aracı yeniden kurar. Serbest hal ölçümleri kural değil, belgelenmiş istisnadır (Ⓕ)." },
            { t: "mcq", topic: "fit", q: "Çelik gövdede PP: ~1 m açıklık, −30…+80 °C. Tampon, boşluk vermesi gereken çamurluktan milimetrelerce fazla büyür. Tasarım yanıtı?", opts: ["Hareket edemesin diye boşluk toleransını sık", "Parçayı her brakette rijit sabitle", "MERKEZİ sabitle, uçları kayar bağlantılarda yüzdür — ısıl büyümeye tasarlanmış bir yön ver ve nominal boşlukları sıcak/soğuk çalış", "PP'ye çelik dolgu şart koş"], a: 2, ex: "ΔL = α·L·ΔT ≈ (150−12)·10⁻⁶ × 1000 mm × 60 °C ≈ 8 mm bağıl hareket. Bunu toleransla yok edemezsiniz: tek ankraj noktası + kayar bağlantılar büyümeyi yönlendirir; boşluk etüdü sıcaklık uçlarında koşulur." },
            { t: "mcq", topic: "section", q: "Boyalı A-yüzeyin hemen arkasına rijitlik federi gerekiyor. Kesit kuralı?", opts: ["Feder kalınlığı ≈ birleştiği duvarın %50–60'ı, cömert radyüs, ya da federi arkadan boşalt — A-yüzeyde çöküntü izi sevkiyat engelidir", "Mukavemet için duvar kalınlığında feder", "Çift kalınlıkta feder, üstü boyanır", "Tampona asla feder atılmaz"], a: 0, ex: "Kalın feder kökü lokal ağır kesit yaratır: daha çok çeker ve boyanın içinden çöküntü izi basar. İnce federler (%50–60), radyüsler ve boşaltma görünür yüzü düz tutar — plastikte kesit yönetimi, yüzey kalitesinin ta kendisidir." },
            { t: "mcq", topic: "mfg", q: "Tampon birden çok yolluktan dolar; akış cepheleri bir yerde buluşur. Birleşme çizgileri hem zayıf hem görünürdür. Tasarımcının hamlesi?", opts: ["Birleşme çizgisi kalıpçının derdi, resmin değil", "Kalıptan sonra polisajla silinir", "Takım kesilmeden ÖNCE kalıpçıyla yolluk konumlarına çalış: birleşme çizgileri gizli, düşük gerilimli bölgelere (plaka yuvası arkası, trim altı) düşsün", "Her yere daha çok yolluk ekle"], a: 2, ex: "Birleşme çizgilerinin yerini yolluk düzeni belirler; takım kesildikten sonra sabittir. Dolum simülasyonunu öne almak ve çizgileri görünür/darbe yüklü bölgelerden uzağa yönlendirmek üretim sonrası bir çare değil, tasarım işidir." },
            { t: "mcq", topic: "tol", q: "Profil |1,0|A|B|C kısıtlanmış halde geçerli. Lojistik, sevkiyat rafına sığması için parçanın mengenesiz halde de 3,0 içinde kalmasını istiyor. Bu nasıl yazılır?", opts: ["'Dikkatli olun' diye bir not", "Kısıtlanmış olanın yanına Ⓕ (serbest hal) işaretli ikinci, daha gevşek bir profil kontrolü", "İmkânsız — bir parçanın iki profili olmaz", "Serbest şekil için ± ölçüler"], a: 1, ex: "Esnek parçalarda çift kontrol standarttır: sıkı profil datum hedeflerinde kısıtlanmış halde geçerlidir; gevşek Ⓕ profili serbest hal şeklini sınırlar. İki gereksinim, iki koşul; ikisi de ölçülebilir." }
          ],
          tips: [
            "Esnek parça = gövdeyi kopyalayan hedeflerde kısıtlanmış datumlar; serbest hal istisnalarını Ⓕ işaretler.",
            "CLTE bir tasarım girdisidir: bir noktayı sabitle, gerisini kaydır; boşluk etüdünü sıcak ve soğukta koş.",
            "A-yüzey plastiğinde boyalı yüzeyi düz tutan şey kesit yönetimidir (feder %, radyüs, boşaltma)."
          ]
        },
        {
          icon: "💡", name: "Far braketi", process: "Enjeksiyon kalıplama, PA6-GF30",
          brief: "Farı çamurluk, tampon ve panjur arasında konumlar — üç görünür boşluk tek köşede buluşur. Tolerans zincirleri ve cam elyaflı kalıplama üzerine bir ustalık dersi.",
          env: [
            ["Radyatör traversi", "Vidalar + konumlama pimleri", "Braketin kendi montaj datumları"],
            ["Far gövdesi", "Klipsler + vidalar", "Far pozisyonu = braket pozisyonu"],
            ["Çamurluk kenarı", "Görünür 3,5 ± 0,5 boşluk", "Her müşterinin gördüğü boşluk"],
            ["Tampon / panjur", "İki görünür arayüz daha", "Boşluklar yalnız şartta değil, dengede de olmalı"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "Far, çamurluk ve tampon tek görünür köşede hizalanmalı. Kazanan datum stratejisi?", opts: ["Her parça en yakın komşusuna konumlansın", "Zincirle: çamurluk→braket→far→tampon", "Farı, çamurluğu ve tamponu AYNI gövde referans noktalarından konumla — ortak DRF zincirleri keser", "Hat işçileri hizalasın"], a: 2, ex: "Parçadan parçaya her halka, toleranslarını görünür boşluğa ekler. Boşluğu oluşturan tüm parçaları ortak ana referanslardan (ortak gövde datumları) konumlamak, görsel kalite tasarımının en güçlü hamlesidir." },
            { t: "mcq", topic: "section", q: "Kalıplanmış braket duvarları için kesit kuralı?", opts: ["Her yerde homojen nominal duvar (~2,5 mm); rijitlik gereken yerde duvardan İNCE federler", "Yük noktalarında kalın bloklar, gerisi ince", "Mukavemet için sabit 6 mm", "CAD'in ürettiği radyüsler neyse o"], a: 0, ex: "Enjeksiyonda homojen olmayan kesit çökme, boşluk ve çarpılma üretir — bunlar tam da toleransladığınız pozisyonları yok eder. Feder kalınlığı ≈ birleştiği duvarın %60'ı: görünür yüzde çökme izi olmasın." },
            { t: "mcq", topic: "mfg", q: "PA6-GF30 (%30 cam elyaf) elyaf akışı boyunca ve enine farklı çeker. Tasarım sonucu?", opts: ["Sonucu yok — çekme çekmedir", "Çarpılma, yolluk konumuna ve akış yönüne bağlıdır: kritik konumlama unsurları akışın (ve kalıpçının) doğru tutabileceği yerde olmalı — resim toleransları da buna saygı duymalı", "Cam elyaf çekmeyi tamamen kaldırır", "Yalnızca renk etkilenir"], a: 1, ex: "Anizotropik çekme, kalıp ile parçanın birlikte tasarlanması demektir: yolluk yeri, akış yönü ve ulaşılabilir profil toleransları resim yayınlanmadan ÖNCE kalıpçıyla kararlaştırılır." },
            { t: "mcq", topic: "fit", q: "Boşluk bütçesi: çamurluk boşluğu 3,5 ± 0,5 mm ve braket zincirdeki 4 katkıdan biri. En kötü durumda brakete ne düşer?", opts: ["±0,5 — toplamla aynı", "±0,5'in kabaca payı (eşit bölünse ≈±0,12) — zinciri ortak datumla ya da ayarcıyla kesmediyseniz", "±1,0 — plastik parçaya fazlası gerekir", "Boşluk bütçesi kalite kontrolün derdi"], a: 1, ex: "En kötü durum stack'i bütçeyi katkılara böler. Plastik parçada ±0,12 pahalıdan imkânsıza gider — datum stratejisi (zinciri kes) ve ayar unsurları tam da bu yüzden vardır." },
            { t: "mcq", topic: "tol", q: "Braketin farı konumlayan yüzeyleri (pimler, pedler, klips yuvaları): doğal kontrol hangisi?", opts: ["Her pimde dairesellik", "Parça kenarlarından ± doğrusal ölçüler", "Her şeye düzlemsellik", "Hepsi braketin montaj datumlarına (travers arayüzü) referanslı yüzey profili / pozisyon"], a: 3, ex: "Farı konumlayan unsurlar, braketi konumlayan unsurlara kontrol edilir — montaj arayüzünden tek DRF; biçimli yuvalara profil, pimlere pozisyon. Zincir uçtan uca hesaplanabilir kalır." }
          ],
          tips: [
            "Görünür boşluk tasarımı: tek bir toleransı sıkmadan önce zincirleri ortak datumlarla kısaltın.",
            "Plastik kesit: homojen duvar, ~%60 feder — yoksa çökme/çarpılma pozisyon toleranslarınızı yer.",
            "Elyaf dolgulu plastikte resim ve kalıp birlikte tasarlanır — kalıpçıyla erken konuşun."
          ]
        },
        {
          icon: "🚪", name: "Kapı trim paneli", process: "Enjeksiyon ABS, desenli (grenli)",
          brief: "Yolcunun her gün dokunduğu büyük görünür panel: çelik kapıya klipslenir, cam düğmesi çerçevesini ve hoparlör ızgarasını taşır — ve asla gıcırdamamalı, tıkırdamamalı, greninden çöküntü izi göstermemeli.",
          env: [
            ["Çelik kapı içi", "Klips deseni + bir vida", "Konumlayıcı şeması ve klips pozisyon toleransları"],
            ["Düğme çerçevesi / ızgara", "Snap-fit alt parçalar", "Panelin üzerindeki görünür alt boşluklar"],
            ["Yolcu", "Grenli A-yüzey, dokunma yükleri", "Çöküntü izi, rijitlik, gıcırtı ve tıkırtı"],
            ["Cam ve fitiller", "Panelin arkasında hareketli cam", "Hareketli parçalara boşluk"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "Konumlayıcı şeması: bir yuvarlak pim (4 yön), bir OVAL yuva (2 yön) ve yüzey pedleri. Neden ikinci yuvarlak pim değil de oval yuva?", opts: ["Oval yuva kalıplamada daha ucuz", "İki yuvarlak pim aşırı kısıtlar: adım sapması ve ısıl büyüme pimlerle savaşıp paneli çarpıtırdı — oval yuva bir yönde konumlar, diğerini serbest bırakır", "Oval yuva su tahliyesi için", "Stil bölümü istedi"], a: 1, ex: "4 yön pimi X-Y'yi sabitler; 2 yön yuvası dönmeyi sabitler ama pimden pime mesafeyi serbest bırakır — kalıp sapması ile CLTE tam orada yaşar. Pim + oval yuva, plastik trim konumlamanın STANDART şemasıdır." },
            { t: "calc", topic: "calc", kind: "fixed", Fset: [6, 8] },
            { t: "mcq", topic: "section", q: "Grenli yüzeyin arkasına sac vidası bosu gerekiyor. Doğru bos tasarımı?", opts: ["Dolu silindir — azami diş kavraması", "Bos duvarı ≈ nominal duvarın %60'ı, içi boşaltılmış, duvara dolu kütle yerine ince gusetlerle bağlanmış", "Bosu kalın kökle doğrudan A-yüzey duvarına bağla", "Bos ne kadar uzun, o kadar iyi"], a: 1, ex: "Dolu ya da kalın köklü bos ağır bir kesittir: görünür grenin içinden çöker ve içten boşluk yapar. Boşaltılmış bos + ince gusetler, silüetini A-yüze basmadan vida tutması verir." },
            { t: "mcq", topic: "mfg", q: "Görünür yüz deri deseni (gren) taşıyor. Çekme açılarına etkisi?", opts: ["Yok — desen kozmetiktir", "Desenli duvarlar DAHA ÇOK eğim ister: taban eğimin üstüne, kabaca her 0,025 mm gren derinliği için +1° — yoksa itici, greni çizerek parlak izler bırakır", "Desen sıfır eğime izin verir", "Eğim yalnızca federlerde önemli"], a: 1, ex: "Gren, binlerce minik alttan kesmedir. Ek eğim olmadan desen çıkarmada sürter ve parlak sıyrık izleri bırakır — tasarımcının ilk günden önlediği klasik geç-kalıp krizi." },
            { t: "mcq", topic: "fit", q: "Panel kenarı metal kapı çerçevesine yakın: temas (gıcırtı-tıkırtı) riski nasıl yönetilir?", opts: ["Nominal sıfır boşluk — 'tam değiyor' en iyi görünür", "Ya TASARLANMIŞ bir boşluk (stack ile asla kapanmadığı kanıtlı) ya da yumuşak bir eleman (sünger, keçe, floklama) üzerinden tasarlanmış bir ön yük — asla tesadüfi temas", "Garanti olsun diye her yerde 5 mm bırak", "Gıcırtı garanti sorunudur, tasarım değil"], a: 1, ex: "Gıcırtı-tıkırtı mühendisliği yalnızca iki güvenli durum bilir: garantili boşluk ya da uyumlu katman üzerinden garantili ön yük. Seçtiğinizi tolerans stack'i kanıtlamalı; 'nominalde değiyor' araçların yarısında ses garantisidir." }
          ],
          tips: [
            "Pim + oval yuva + pedler: plastiği aşırı kısıtlamadan konumlayın; kalıp sapması ve CLTE'nin gidecek yeri olsun.",
            "Bos ve federler %60 kuralına uyar ve A-yüzey duvarından uzak durur — çöküntüsüz tutma.",
            "Gıcırtı-tıkırtı: kanıtlı boşluk ya da kanıtlı ön yük tasarlayın; arası gürültüdür."
          ]
        },
        {
          icon: "🌬️", name: "Klima havalandırma ızgarası", process: "Enjeksiyon ABS, çok parçalı",
          brief: "Torpidoda avuç içi kadar bir hassas mekanizma: ince kanatlar sönümlü, premium bir hisle döner; çerçeve torpidoya sıfır oturmalı. Küçük parça, küçük toleranslar, büyük algılanan kalite.",
          env: [
            ["Torpido paneli", "Geçmeli çerçeve, görünür hiza", "Çerçeve çevresinde hiza ve eşit boşluk"],
            ["Kanatlar (alt parçalar)", "Yuvalarda pivot pimleri", "Dönme torku = algılanan kalite"],
            ["Damper ve topuz", "Kayar bağlantı", "Ömür boyu tutarlı kuvvet"],
            ["Hava akışı", "Kanal sızdırmazlık dudakları", "Kaçak ve ıslık sesi"]
          ],
          steps: [
            { t: "mcq", topic: "fit", q: "Kanat pivotları tutarlı, sönümlü bir torkla dönmeli — hep. Bu his nasıl mühendislenir?", opts: ["Gevşek alıştırma + montajda gres", "Kontrollü pim-delik alıştırması ARTI ön yük veren tasarlanmış bir yay elemanı (kalıplanmış parmak ya da gresli göbek) — tork, tolerans aralığı boyunca doğrulanır", "Olabildiğince sıkı; kullanıcı alıştırır", "Tork sınırlayıcı yapıştırıcıyla yapıştır"], a: 1, ex: "His = sürtünme torku = ön yük × yarıçap. Yalnız ham pim/delik toleransına güvenmek, kimi araçta sert kimi araçta bomboş kanat verir; esnek ön yük elemanı torku kalıp tolerans aralığında sabit tutar." },
            { t: "mcq", topic: "mfg", q: "1,2 mm'lik kanat tek uçtaki yolluktan dolar; akış pivot bosunun etrafından ayrılıp arkasında birleşir. Risk ve çözüm?", opts: ["Risk yok — ince parçalar hep iyi dolar", "Yüklü pivotta tam bir birleşme çizgisi: yolluğu taşı ya da taşma sekmesi ekle — çizgi düşük gerilimli bölgeye düşsün", "Kanadı boyayıp çizgiyi gizle", "Bütün kanadı 3 mm yap"], a: 1, ex: "Akış cephelerinin birleştiği yerde mukavemet %30–50+ düşebilir — bütün kullanım yükünü taşıyan pivotta ölümcül. Birleşme çizgisini yolluk konumu yönlendirir; hassas mekanizmalarda bu, dolum simülasyonuyla tasarımda kararlaştırılır." },
            { t: "mcq", topic: "section", q: "İnce kanat pivotta kalın göbek istiyor. Bu kesit sıçraması nasıl yönetilir?", opts: ["1,2'den 4 mm'ye keskin geç — fonksiyonel", "Kademeli geçiş (mesafeye yayılmış, radyüslü) ve mümkünse göbeği boşalt: ani kalın kesit çöker, boşluk yapar ve kanadı muz gibi çarpıtır", "Bütün kanadı 4 mm yap", "Metal insert ekle"], a: 1, ex: "İnce ve kalın bölgeler arasındaki farklı çekme, parça soğurken onu büker. Kademeli geçiş ve boşaltma çekmeyi homojen tutar; kanat, yatak delikleri hizalanacak kadar düz kalır." },
            { t: "mcq", topic: "datum", q: "Çerçevenin görünür hizası ve boşluğu torpidoya göre. Çerçeve resmi için datum şeması?", opts: ["Kanat pivotları — en hassas unsurlar", "Çerçevenin torpidoya kendi montaj/geçme arayüzleri — parçayı açıklıkta fiziksel olarak konumlayan unsurlar", "Dış görünen yüzey — müşterinin gördüğü o", "Herhangi üç köşe"], a: 1, ex: "Her ölçekte aynı yasa: datumlar = parçanın KONUMLANDIĞI unsurlar. Görünen yüzey, o datumlara toleranslanan şeydir (profil); konumlama kaynağı değil." },
            { t: "mcq", topic: "tol", q: "Bu kalıplanmış ABS parçada ~150 mm'lik bir ölçü için gerçekçi genel tolerans?", opts: ["±0,02 mm — hassas parça bu", "İyi bir kalıpçıyla ±0,01 mm", "Genelde ±0,3 mm civarı (DIN 16742 / kalıpçı kabiliyeti); yalnızca birkaç fonksiyonel unsur — bedeli ödenerek — daha sıkı tutulur", "Plastik parça tolerans tutamaz"], a: 2, ex: "Kalıplanmış plastik, talaşlı imalattan daha geniş bir tolerans dünyasında yaşar: çekme; parti, nem ve proses kaymasıyla değişir. Mekanizmayı çoğu ölçü nefes alabilecek şekilde tasarlayın; sıkı toleransı yalnızca pivotlara ve geçme arayüzlerine harcayın." }
          ],
          tips: [
            "Algılanan kalite mühendisliktir: tutarlı tork, toleransların denk gelmesinden değil tasarlanmış ön yükten gelir.",
            "Birleşme çizgileri ve kesit sıçramaları tasarım kararıdır — yolluklar oynayabiliyorken yüklü unsurlardan uzaklaştırın.",
            "Sıkı toleransı yalnızca fonksiyonel plastik unsurlara harcayın; gerisine kalıp gerçekçisi alan verin."
          ]
        },
        {
          icon: "⚙️", name: "Fan davlumbazı", process: "Enjeksiyon kalıplama, PA6-GF30",
          brief: "Havayı radyatörden geçiren ve fan motorunu taşıyan büyük, cam elyaflı bir halka: plastiğinizden birkaç milimetre ötede dönen bir kanat — ve farklı oranda genleşen alüminyum bir radyatöre cıvatalı.",
          env: [
            ["Radyatör (alüminyum)", "Cıvatalı flanş, 4–6 nokta", "Bir metrelik genişlikte CLTE farkı"],
            ["Fan kanadı", "Halkaya uç boşluğu", "Verim küçük boşluk ister; temas felakettir"],
            ["Fan motoru", "3 kollu merkez bağlantı", "Kol rijitliği yük altında kanat pozisyonunu belirler"],
            ["Titreşim ve ısı", "Motor bölmesi ortamı", "GF sünme, cıvata boslarında yorulma"]
          ],
          steps: [
            { t: "mcq", topic: "fit", q: "Fan ucu boşluğu: verim minimum ister, temas felakettir. Güvenli asgari boşluğu ne belirler?", opts: ["Stilistin bıraktığı neyse o", "Bir stack-up: halka pozisyon/profil toleransı + motor bağlantı pozisyonu + kanat ucu salgısı + yük altında kol esnemesi + ısıl hareketler — en kötü durum temassız kalmalı", "Sabit 10 mm el kuralı", "Kalıpçı karar verir"], a: 1, ex: "Uç boşluğu hesaplanabilir bir stack'tir ve davlumbazın katkısı, montaj datumlarına göre profil/pozisyon toleransı olarak girer. Halka ile motor bağlantısının tek DRF paylaşması bu yüzden şarttır — yoksa stack'e bilinmeyen halkalar eklenir." },
            { t: "calc", topic: "calc", kind: "floating", Fset: [6, 8] },
            { t: "mcq", topic: "section", q: "Büyük, neredeyse düz bir GF30 halka panel düzlem dışına çarpılmak ister. Kesit stratejisi?", opts: ["Dümdüz kalıpla, montajda mengeneleyip düzelt", "Homojen duvar + rijitlik için feder deseni, simetrik kesitler ve elyaf yönelimi dengeli olsun diye akış (yolluk) düzeni — düzlemselliğin presten değil tasarımdan geldiğini kabul et", "Duvar kalınlığını ikiye katla", "Her parçayı fırında gerginlik gider"], a: 1, ex: "Cam elyaf çekmeyi anizotrop yapar: dengesiz akış = hiçbir proses ayarının tam silemeyeceği yerleşik çarpılma. Federler, simetri ve yolluk düzeni, düzlemsellik toleransının gerçek bekçileridir." },
            { t: "mcq", topic: "datum", q: "Davlumbaz resmi için datum şeması?", opts: ["Yalnızca halka deliği A olsun", "A = radyatör tarafı montaj pedleri (3 hedef), B–C = montaj deliklerinden ikisi; halka ve motor bağlantısı bu çerçeveye toleranslanır", "A = neredeyse en büyük düz yüzey", "Esnek plastikte datum gereksiz"], a: 1, ex: "Yine montajlı parça yasası: davlumbazı araçta radyatör arayüzü konumlar, öyleyse resimde de o konumlar. Kanat ucu stack'i böylece tek hesaplanabilir çerçeveden akar — pedler, delikler, halka, motor bağlantısı." },
            { t: "mcq", topic: "mfg", q: "GF30'da birleşme çizgileri mukavemeti ~%50 düşürebilir. Bu parçada NEREYE düşmemeli?", opts: ["Fark etmez — GF sağlamdır", "Yalnızca görünür yüze düşmesin", "Motor bağlantı kollarına ve cıvata boslarına — yorulma yüklü yük yollarına; yollukları çizgiler halkanın sakin bölgelerine düşecek şekilde yönlendir", "GF malzemede birleşme çizgisi olmaz"], a: 2, ex: "Elyaf dolgulu parçada birleşme çizgisi, elyafça fakir zayıf bir dikiştir. Üç kol üstünde titreşen motor bir yorulma makinesidir: yolluk düzeni çizgileri kollardan ve boslardan uzak tutmalı — takımdan önce simülasyonla doğrulanır." }
          ],
          tips: [
            "Hareketli kanada boşluk, TEK datum çerçevesinden geçen en kötü durum stack'idir — hesaplanabilir tasarlayın.",
            "GF parçada düzlemsellik federle, simetriyle ve yolluk düzeniyle kazanılır; proses kahramanlığıyla değil.",
            "Yorulma ile birleşme çizgisi bir araya gelmez: akış buluşmalarını yük yollarından uzak tutun."
          ]
        },
        {
          icon: "🧴", name: "Genleşme deposu", process: "Enjeksiyon PP, sıcak plaka kaynaklı iki yarım",
          brief: "Kaynakla basınçlı kaba dönüşen iki PP yarım: on beş yıl boyunca 1,4 bar ve 120 °C soğutma sıvısı. Hortum ağızları, kapak dişleri, seviye sensörü — ve asla açılmaması gereken tek bir kaynak dikişi.",
          env: [
            ["Soğutma sistemi", "1,4 bar @ 120 °C, döngülü", "Sünmeye göre duvar kesitleri; patlama ≥ 4× çalışma"],
            ["Hortumlar", "Tırnaklı ağızlar + yaylı kelepçeler", "Tırnak geometrisi ve dış çap toleransı = tutma"],
            ["Basınç kapağı", "Dişler + sızdırmazlık oturağı", "Sızdırmazlık yüzü diş eksenine gerçek olmalı"],
            ["Gövde braketi", "Geçme pimler + bir vida", "Esnek depoda konumlama şeması"]
          ],
          steps: [
            { t: "mcq", topic: "mfg", q: "İki yarım sıcak plaka ile kaynaklanıyor. Kaynak bölgesi tasarım olarak ne ister?", opts: ["Bastırılan iki keskin kenar", "Pres yönüne dik, düz ve paralel kaynak flanşları (ergiyik için ~2–2,5× duvar) artı çapak tuzakları: ergiyik hem gözden hem soğutma sıvısından uzak kalsın", "Yedek olarak yapıştırıcı", "Metal kelepçe halkası"], a: 1, ex: "Sıcak plaka kaynağı tasarlanmış bir bağlantıdır: flanş alanı mukavemeti, paralellik eşit ergimeyi belirler; çapak tuzakları boncuğu yakalar. Bağlantı, herhangi bir fonksiyonel unsur gibi çizilir ve toleranslanır — çünkü öyledir." },
            { t: "mcq", topic: "section", q: "İç basınç deponun büyük düz yan duvarlarını iter. Kesit yanıtı?", opts: ["Düz ince duvarlar — en ucuzu", "Duvarları bombele (eğrilt) ve/veya iç feder/bağ elemanları ekle: düz paneller 120 °C'de 1,4 bar altında balonlaşır, süner ve 'teneke' sesi yapar", "Tek çok kalın düz duvar", "Şekli braket tutsun"], a: 1, ex: "Basınçlı kaplar düz panel sevmez: eğrilik, eğilmeyi membran çekmesine çevirir — PP bunu, özellikle sıcakta sünmede, çok daha iyi taşır. İşi biçim yapar; duvar kalınlığı (ve çökme riski) makul kalır." },
            { t: "mcq", topic: "fit", q: "Hortum tırnakları: hortumu 15 yıl boyunca ağızda sızdırmaz tutan gerçekte nedir?", opts: ["Hortum esnek, her şey uyar", "Tırnak dış çap boyutu + form toleransı, boncuk geometrisi, yüzey durumu VE tırnağın arkasında tanımlı kelepçe oturağı — ağız, toleranslı bir sızdırmazlık sistemidir", "Hortumun içine yapıştırıcı", "Emniyet teli"], a: 1, ex: "Tutma = tırnak dış çapı ile hortum iç çapı arasındaki tasarlanmış girişim; kelepçe onu oturağında tutar. Kalıplanan ağız çapı, ovallik (dairesellik) ve ayırma çizgisi çapağı bu girişim bütçesinin içindedir — sızdırmazlık tırnağının üstünden geçen çapak, kaçaktır." },
            { t: "mcq", topic: "tol", q: "Kapak, kalıplanmış boyun tepesindeki bir yüzeyde sızdırmazlık yapar. Kritik geometrik ilişki?", opts: ["Sızdırmazlık yüzü DİŞ EKSENİNE dik/gerçek olmalı (diş datumuna salgı/diklik) — eğik yüz contayı dengesiz yükler ve terletir", "Boynun renk uyumu", "Yüzün depo tabanına mesafesi, ±2 mm", "Yalnız diş kalitesi; yüz peşinden gelir"], a: 0, ex: "Kapak dişlere, sızdırmazlık yüze referans verir. Yüz diş eksenine göre kontrol edilmezse tork kapağı yamuk oturtur ve O-ring bir tarafta boşluk görür. Datum = diş bölüm silindiri; yüz ona kontrol edilir." },
            { t: "mcq", topic: "datum", q: "Depo, kaynakta buluşan iki yarım olarak kalıplanıyor. Ağızlar, braket pimleri ve sensör bosu tek parça gibi nasıl hizalanır?", opts: ["Önce kaynakla, sonra hepsini yeniden işle", "HER İKİ yarımda ortak datum/hizalama unsurları (hedefler, kaynak fikstürü pilot pimleri) tasarla; iki yarım resmi ve montaj resmi aynı unsurlara referans versin — yarımlar kalıpta, kaynakta ve kontrolde hep aynı şekilde konumlansın", "İki gözün de aynı çekmesini um", "Yalnız bitmiş montajı toleransla"], a: 1, ex: "Kaynaklı plastik montaj küçük bir hizalama zinciridir: her yarım kendi göz boşluğuna, iki yarım kaynak fikstürüne. Yarım resimleri ile montaj resminde ortak datum unsurları bu zinciri hesaplanabilir tutar — her yerdeki ortak-DRF yasasının ta kendisi." }
          ],
          tips: [
            "Kaynak bağlantıları, tırnaklar ve sızdırmazlık oturakları toleranslı fonksiyonel sistemlerdir — öyle çizin.",
            "Basınç + ısı + PP = sünme: yükü eğrilik ve federler taşısın ki duvarlar kalıplanabilir kalsın.",
            "Çok parçalı plastik montajlar, her yarımda ve fikstürde ortak datum unsurları ister."
          ]
        }
      ]
    }
  };

  /* ---------- state (shared across languages; parts arrays are parallel) ---------- */
  var S = { pi: null, step: 0, answered: false, picks: [], score: 0, calc: null, done: false };
  var CSET = [0.5, 0.6, 0.8, 1.0];

  function fmt(n, lang, dp) {
    var s = n.toFixed(dp == null ? 2 : dp);
    return lang === "tr" ? s.replace(".", ",") : s;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function newScenario() {
    var n = DATA.en.parts.length;
    var pi;
    do { pi = Math.floor(Math.random() * n); } while (n > 1 && pi === S.pi);
    S.pi = pi; S.step = 0; S.answered = false; S.picks = []; S.score = 0; S.done = false;
    // pre-roll the calc values for this scenario (same in both languages)
    var part = DATA.en.parts[pi];
    var calcStep = null;
    part.steps.forEach(function (st) { if (st.t === "calc") calcStep = st; });
    if (calcStep) {
      var F = calcStep.Fset[Math.floor(Math.random() * calcStep.Fset.length)];
      var c = CSET[Math.floor(Math.random() * CSET.length)];
      var T = calcStep.kind === "floating" ? c : c / 2;
      var opts = calcStep.kind === "floating" ? [T, T / 2, T * 2, c + 0.25] : [T, T / 2, c, c * 2];
      // shuffle once, remember the correct slot
      for (var i = opts.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t2 = opts[i]; opts[i] = opts[j]; opts[j] = t2;
      }
      S.calc = { F: F, c: c, T: T, opts: opts, a: opts.indexOf(T) };
    } else S.calc = null;
  }

  function calcQuestion(ui, kind, lang) {
    var H = S.calc.F + S.calc.c;
    var tpl = kind === "floating" ? ui.calcFloatQ : ui.calcFixedQ;
    var ex = kind === "floating" ? ui.calcFloatEx : ui.calcFixedEx;
    function fill(s) {
      return s.split("{F}").join(S.calc.F).split("{H}").join(fmt(H, lang, 1)).split("{T}").join(fmt(S.calc.T, lang));
    }
    return {
      q: fill(tpl),
      opts: S.calc.opts.map(function (v) { return "⌀" + fmt(v, lang); }),
      a: S.calc.a,
      ex: fill(ex)
    };
  }

  function stepData(ui, part, si, lang) {
    var st = part.steps[si];
    if (st.t === "calc") {
      var c = calcQuestion(ui, st.kind, lang);
      return { topic: st.topic, q: c.q, opts: c.opts, a: c.a, ex: c.ex };
    }
    return { topic: st.topic, q: st.q, opts: st.opts, a: st.a, ex: st.ex };
  }

  /* ---------- rendering ---------- */
  var mountEl = null, mountLang = "en";

  function html(lang) {
    var L = DATA[lang] || DATA.en;
    var ui = L.ui;
    var h = "<h1>" + ui.title + "</h1><p class='lesson-intro'>" + ui.intro + "</p>";
    if (S.pi == null) {
      h += '<button class="btn" id="trNew">' + ui.newPart + "</button>";
      return h;
    }
    var part = L.parts[S.pi];
    var total = part.steps.length;

    h += '<div class="tr-head"><span class="tr-emoji">' + part.icon + "</span><div>" +
      "<h3>" + esc(part.name) + '</h3><span class="pill">' + ui.processWord + ": " + esc(part.process) + "</span></div>" +
      '<button class="btn secondary" id="trNew" style="margin-left:auto">' + ui.anotherPart + "</button></div>";
    h += '<div class="box key"><div class="box-title">' + ui.briefTitle + "</div><p>" + esc(part.brief) + "</p></div>";

    h += "<h2>" + ui.envTitle + "</h2>";
    h += '<div class="tbl-wrap"><table><thead><tr>';
    ui.envHeads.forEach(function (x) { h += "<th>" + x + "</th>"; });
    h += "</tr></thead><tbody>";
    part.env.forEach(function (r) {
      h += "<tr><td><strong>" + esc(r[0]) + "</strong></td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td></tr>";
    });
    h += "</tbody></table></div>";

    var shown = Math.min(S.step + 1, total);
    h += '<div class="tr-progress"><i style="width:' + Math.round(100 * (S.step + (S.answered ? 1 : 0)) / total) + '%"></i></div>';

    for (var si = 0; si < shown; si++) {
      var d = stepData(ui, part, si, lang);
      var answered = si < S.step || (si === S.step && S.answered);
      var pick = S.picks[si];
      h += '<div class="quiz-q tr-step' + (answered ? " graded" : "") + '" data-step="' + si + '">' +
        '<div class="tr-topic">' + ui.topics[d.topic] + "</div>" +
        '<div class="quiz-q-title">' + ui.stepWord + " " + (si + 1) + " / " + total + " — " + esc(d.q) + "</div>";
      d.opts.forEach(function (opt, oi) {
        var cls = "quiz-opt";
        if (answered) {
          if (oi === d.a) cls += " correct";
          else if (oi === pick) cls += " wrong";
        }
        h += '<label class="' + cls + '" data-o="' + oi + '"><input type="radio"' +
          (answered ? " disabled" + (oi === pick ? " checked" : "") : "") + "><span>" + esc(opt) + "</span></label>";
      });
      h += '<div class="quiz-explain">💡 ' + esc(d.ex) + "</div></div>";
    }

    if (S.answered && !S.done) {
      var last = S.step === total - 1;
      h += '<button class="btn" id="trNext">' + (last ? ui.finish : ui.next) + "</button>";
    }

    if (S.done) {
      var passed = S.score >= Math.ceil(total * 0.8);
      h += '<div class="quiz-result ' + (passed ? "pass" : "fail") + '" style="display:flex">' +
        (passed ? "🎉 " + ui.resultPass : "🔁 " + ui.resultFail) +
        ' <span class="exam-score-big" style="margin-left:auto">' + S.score + "/" + total + "</span></div>";
      h += '<div class="box key" style="margin-top:16px"><div class="box-title">' + ui.takeaways + "</div><ul>";
      part.tips.forEach(function (t) { h += "<li>" + esc(t) + "</li>"; });
      h += "</ul></div>";
      h += '<button class="btn" id="trNew2">' + ui.anotherPart + "</button>";
    }
    return h;
  }

  function bind() {
    var root = mountEl;
    var lang = mountLang;
    var L = DATA[lang] || DATA.en;
    ["trNew", "trNew2"].forEach(function (id) {
      var b = root.querySelector("#" + id);
      if (b) b.onclick = function () { newScenario(); redraw(); };
    });
    var next = root.querySelector("#trNext");
    if (next) next.onclick = function () {
      var total = L.parts[S.pi].steps.length;
      if (S.step === total - 1) S.done = true;
      else { S.step++; S.answered = false; }
      redraw();
    };
    if (S.pi == null || S.answered || S.done) return;
    var stepEl = root.querySelector('[data-step="' + S.step + '"]');
    if (!stepEl) return;
    stepEl.querySelectorAll(".quiz-opt").forEach(function (optEl) {
      optEl.addEventListener("click", function (e) {
        if (S.answered) return;
        e.preventDefault();
        var oi = parseInt(optEl.getAttribute("data-o"), 10);
        var d = stepData(L.ui, L.parts[S.pi], S.step, lang);
        S.picks[S.step] = oi;
        if (oi === d.a) S.score++;
        S.answered = true;
        redraw();
      });
    });
  }

  function redraw() {
    if (!mountEl) return;
    mountEl.innerHTML = html(mountLang);
    bind();
    var btn = mountEl.querySelector("#trNext");
    if (btn) btn.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  window.GDT_TRAINER = {
    ui: function (lang) { return (DATA[lang] || DATA.en).ui; },
    mount: function (container, lang) {
      mountEl = container; mountLang = lang;
      container.innerHTML = html(lang);
      bind();
    }
  };
})();
