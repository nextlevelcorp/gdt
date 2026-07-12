/* ===== GD&T Academy — trainer.js =====
 * "Automotive Design Studio": random automotive-part design scenarios.
 * Each round: a part, its interface map (surrounding parts), and a
 * step-by-step design task — datum scheme, section management, fits &
 * clearances, manufacturing, and a randomized fastener calculation.
 * app.js routes #/trainer here via GDT_TRAINER.mount(container, lang).
 */
(function () {
  "use strict";

  var DATA = {

    /* ================= ENGLISH ================= */
    en: {
      ui: {
        navLabel: "Design Studio",
        title: "🚗 Automotive Design Studio",
        intro: "A random automotive part lands on your desk. Work through it the way a design engineer does: read its environment, choose the datum scheme, manage the cross-section, budget the clearances and calculate the tolerances. A new random part every round.",
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
        topics: { iface: "Interfaces & function", datum: "Datum scheme", tol: "Tolerancing", section: "Section management", fit: "Fit & clearance", calc: "Calculation", mfg: "Manufacturing" },
        calcFloatQ: "Assembly: M{F} bolts and nuts pass through ⌀{H} MMC clearance holes in BOTH this part and its mate — a floating-fastener joint. Bolt MMC = ⌀{F}.0. Position tolerance available for each part's hole pattern?",
        calcFixedQ: "Assembly: M{F} fasteners (MMC ⌀{F}.0) are anchored (threaded / pressed) in the mating part; this part has ⌀{H} MMC clearance holes — a fixed-fastener joint. Position tolerance for each part's pattern?",
        calcFloatEx: "Floating fastener: T = H − F = {H} − {F}.0 = ⌀{T} for each part, applied at Ⓜ.",
        calcFixedEx: "Fixed fastener: T = (H − F)/2 = ({H} − {F}.0)/2 = ⌀{T} per part, applied at Ⓜ — and don't forget Ⓟ on the anchored side."
      },
      parts: [
        {
          icon: "🛞", name: "Wheel hub", process: "Forged steel, turned + drilled",
          brief: "Carries the wheel and brake disc on the spinning axis and presses onto the wheel bearing. Every micron of runout here becomes steering-wheel vibration at highway speed.",
          env: [
            ["Wheel bearing", "Press-fit journal / bore", "Defines the true axis of rotation — everything else is measured about it"],
            ["Brake disc", "Flange face + center pilot", "Face runout transfers 1:1 into disc wobble and brake judder"],
            ["Rim / wheel", "Stud pattern + center pilot", "Pilot locates the wheel; studs clamp it"],
            ["Wheel studs", "Press-fit holes in flange", "Pattern position — fixed-fastener joint with the rim"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "The entire hub spins in service. Which feature should be the primary datum?", opts: ["The stud holes — they're the most numerous feature", "The bearing journal — the surface that physically defines the rotation axis", "The outer rim pilot — easiest to reach", "The flange face — it's the largest surface"], a: 1, ex: "In the car, the hub rotates about the bearing. The datum axis must copy that function; runout and position callouts all reference it." },
            { t: "mcq", topic: "tol", q: "The disc-mounting flange face: which callout keeps brake-disc wobble in check?", opts: ["Circularity on the face", "Flatness alone — no datum needed", "Total runout referencing the bearing axis (A)", "Parallelism to one stud axis"], a: 2, ex: "Runout to the bearing axis is measured exactly the way the car experiences it: rotate about A and watch the face sweep. Flatness alone can't see tilt about the axis." },
            { t: "calc", topic: "calc", kind: "fixed", Fset: [12, 14] },
            { t: "mcq", topic: "section", q: "Making the stud flange thinner saves rotating mass. The section-management catch?", opts: ["A thinner flange flexes and cones under clamp + braking loads — lateral runout grows in service", "Thinner is always better for runout", "It only affects corrosion life", "The drawing tolerance compensates automatically"], a: 0, ex: "Section stiffness controls how the flange behaves under load. No drawing tolerance can rescue a section that deflects — tolerances describe the part as measured, not as loaded." },
            { t: "mcq", topic: "iface", q: "The rim centers on the hub's pilot diameter (hub-centric design), the studs only clamp. Consequence for the stud-hole position tolerance?", opts: ["It must be near zero — studs locate the wheel", "It can come straight from the fastener formula — the pilot does the locating, the pattern only needs to assemble", "The studs must be individually reamed at assembly", "Position must reference the flange face only, no axis"], a: 1, ex: "Split the functions: location = pilot fit, clamping = studs. Once the pilot locates, the pattern tolerance is a pure assembly (fastener-formula) problem — don't pay for precision the function doesn't use." }
          ],
          tips: [
            "Rotating part → primary datum = the axis it actually spins about (bearing journal), never a convenient face.",
            "Runout callouts read the part the way the vehicle does — a spinning sweep about datum A.",
            "Separate locating (pilot fit) from clamping (stud pattern) and tolerance each for its own job."
          ]
        },
        {
          icon: "🛑", name: "Brake disc", process: "Grey cast iron, turned",
          brief: "Turns friction into heat: two braking faces on a ventilated ring, joined to the hub by a 'hat' section. The customer feels every thickness error as pedal pulsation.",
          env: [
            ["Wheel hub", "Hat mounting face + pilot bore", "Seats and centers the disc; face errors become runout"],
            ["Brake pads / caliper", "Both friction faces", "Thickness variation (DTV) causes judder; parallelism is king"],
            ["Rim", "Clamped in the same stud stack", "Shares the bolted joint — flatness of the hat face matters"],
            ["Cooling air", "Internal vanes", "Vane section area sets thermal capacity"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "Choose the datum scheme for the disc drawing.", opts: ["A = friction face, B = outer diameter", "A = hat mounting face, B = pilot bore", "A = stud holes as a pattern, B = a vane", "A = outer diameter, B = friction face"], a: 1, ex: "The disc is located by its hat face (seats on the hub, 3 points) and centered by the pilot bore (2) — the datum scheme copies the mounting, and runout of the friction faces is measured about exactly that seat." },
            { t: "mcq", topic: "tol", q: "Brake judder comes from Disc Thickness Variation. Which control directly limits the wall between the two friction faces?", opts: ["Position of the faces to the pilot", "Cylindricity of the outer diameter", "Thickness size tolerance + parallelism between the two faces", "Concentricity of the vanes"], a: 2, ex: "DTV is a two-surface relationship: size limits set the wall, parallelism (checked over the whole face) caps its variation. Runout to A|B then handles wobble of the pair." },
            { t: "mcq", topic: "section", q: "Under hard braking the friction ring heats and wants to 'cone' about the cooler hat. Section-management response?", opts: ["Make the hat wall as thin as possible", "Chrome-plate the friction faces", "Weld the ring to the hat after machining", "Shape the hat-to-ring junction (wall, radii, offset) so thermal growth stays radial instead of tilting the ring"], a: 3, ex: "Coning is a geometry problem, not a tolerance problem: the hat section is designed so the hot ring can grow radially without tipping — then the runout tolerance only has to cover manufacturing." },
            { t: "mcq", topic: "fit", q: "Pilot bore to hub pilot — what fit do you specify?", opts: ["Heavy interference — pressed on forever", "Small, controlled clearance: centers the disc before the studs clamp it, still slides off in service", "Large sloppy clearance — the studs will center it", "Threaded connection"], a: 1, ex: "Service technicians must remove the disc, so no interference; but the pilot must center it before clamping, so the clearance is small and toleranced — a classic locational clearance fit." },
            { t: "calc", topic: "calc", kind: "fixed", Fset: [12, 14] }
          ],
          tips: [
            "Datums = how the part is mounted (hat face + pilot), never the surface you happen to machine first.",
            "Function names the control: DTV → size + parallelism; wobble → runout about the mounting datums.",
            "Solve thermal distortion in the cross-section design; keep tolerances for manufacturing variation only."
          ]
        },
        {
          icon: "⚙️", name: "Engine mount bracket", process: "High-pressure die-cast aluminum",
          brief: "Bolts to the engine block and carries a rubber mount: the vibration path between engine and body runs through this casting. Fatigue loads, tight packaging, cast-then-machined.",
          env: [
            ["Engine block", "3 machined pads + M10 bolts", "The bolted foundation — datums live here"],
            ["Rubber mount / bushing", "Machined bore", "Position sets driveline alignment; bore size sets press retention"],
            ["Alternator", "8 mm air gap at closest sweep", "Engine moves on its mounts — dynamic clearance envelope"],
            ["Road loads", "Fatigue spectrum through the casting", "Section design (ribs, radii) carries the life"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "Pick the datum scheme for the machined casting.", opts: ["Raw cast ribs — they're stiff", "A = machined pad face on the block side, B & C = two of the machined bolt holes", "The rubber-mount bore alone", "The casting parting line"], a: 1, ex: "Datum features are the machined mounting pads and two bolt holes — the same features that locate the bracket on the block (and in the machining fixture). Cast surfaces vary too much to locate precision features." },
            { t: "mcq", topic: "section", q: "Which cross-section strategy is right for a die-cast bracket?", opts: ["One massive solid section — thicker is stronger", "Uniform moderate wall + ribs where stiffness is needed", "Varying wall from 3 to 15 mm as loads dictate", "Sharp internal corners to maximize material"], a: 1, ex: "Thick die-cast sections trap porosity and sink — they're often *weaker*. Stiffness comes from rib geometry at constant wall; generous radii kill the fatigue hot-spots at rib roots." },
            { t: "mcq", topic: "mfg", q: "The bracket's walls parallel to the die-opening direction need…", opts: ["Exactly 90° — the customer said so", "Undercuts for style", "Draft (≈1–3°) so the casting releases from the die", "Mirror polish"], a: 2, ex: "Every cast/molded wall needs draft in the tool direction. The designer adds it from day one — bolting it on later moves mass and clearances you already promised to the package." },
            { t: "mcq", topic: "fit", q: "The alternator sweeps to 8 mm from the bracket; the engine moves ±6 mm on its mounts. Your move?", opts: ["8 > 6, ship it", "Profile-tolerance the facing contour to the block datums and run the stack: motion + bracket profile + alternator position must stay clear", "Let the assembly line bend it if it touches", "Glue a rubber pad on the bracket"], a: 1, ex: "Clearance to moving neighbors is a stack-up: dynamic envelope + both parts' geometric tolerances. The bracket's contour gets a profile callout to the same block datums so the stack is computable." },
            { t: "calc", topic: "calc", kind: "fixed", Fset: [8, 10] }
          ],
          tips: [
            "Castings: machine the datum system first (pads + 2 holes), then everything precise from it — one DRF for block-side features.",
            "Die-cast strength is section design: uniform walls, ribs, radii — not bulk.",
            "Clearance to parts that MOVE is a dynamic stack-up, and it needs profile tolerances on computable datums."
          ]
        },
        {
          icon: "🚪", name: "Door hinge", process: "Stamped + welded steel",
          brief: "Two hinges hang the door and define its swing axis. The customer never sees the hinge — only the door gap and flushness it produces.",
          env: [
            ["Body A-pillar", "Bolted joint, slotted holes", "Absorbs body tolerances via designed-in adjustment"],
            ["Door inner panel", "Bolted joint", "Transfers door mass; alignment sets gap & flush"],
            ["Hinge pin", "Two pin bores", "Both hinges together define ONE swing axis"],
            ["Door seal", "Compression via door position", "Wind noise and closing effort"]
          ],
          steps: [
            { t: "mcq", topic: "iface", q: "What customer-visible outcome do the hinge tolerances directly control?", opts: ["Fuel economy", "Door gap and flushness to the fender — and door drop over the years", "Engine noise", "Tire wear"], a: 1, ex: "Trace the function chain: hinge geometry → swing axis → door position → the gap your customer's eye measures in the showroom. Design the tolerances backwards from that gap budget." },
            { t: "mcq", topic: "datum", q: "The upper and lower hinge pin bores (body side) must work together. How do you tolerance them?", opts: ["Each bore loosely and independently — the pin will average it out", "As one coaxial pattern: position/coaxiality to shared body datums, both bores in one callout", "Weld the pins in after painting", "Ream them on the finished car"], a: 1, ex: "Two bores that must act as one axis are toleranced as one pattern to one DRF. Independently 'good' bores can still combine into a tilted swing axis that no assembly adjustment can fully fix." },
            { t: "mcq", topic: "fit", q: "Why do the hinge-to-body holes get slots + clamp-after-adjust bolts instead of tight position tolerances?", opts: ["Slots are cheaper to punch", "Designed-in adjustment absorbs the body-side stack so each part's tolerances can stay economical", "It saves weight", "Style heritage"], a: 1, ex: "When the stack across a whole body side is wider than the gap budget, the designer adds an adjustment feature and *documents which direction it absorbs*. Tolerance what must be right; adjust what can't be." },
            { t: "mcq", topic: "section", q: "Door sag over 10 years is hinge deflection + wear. The stamped hinge plate resists sag mainly through…", opts: ["Its section geometry — flanged edges and formed ribs — more than raw thickness", "Paint thickness", "Softer steel for damping", "A tighter position tolerance on the bores"], a: 0, ex: "Stiffness grows with the cube of section height but only linearly with thickness: formed flanges beat thicker gauge. And no position tolerance prevents deflection — that's the section's job." },
            { t: "calc", topic: "calc", kind: "floating", Fset: [8, 10] }
          ],
          tips: [
            "Tolerance backwards from what the customer sees: gap & flush budgets flow down into hinge callouts.",
            "Features that act together (two pin bores = one axis) are toleranced together — one pattern, one DRF.",
            "Adjustment features are designed, not improvised: decide where the stack gets absorbed."
          ]
        },
        {
          icon: "🔥", name: "Exhaust manifold flange", process: "Machined steel casting",
          brief: "Seals pulsing 600 °C exhaust gas against a gasket, cycling from −30 °C every drive. Sealing is a flatness-and-pressure game played on a warping playing field.",
          env: [
            ["Cylinder head", "Studs + gasket joint", "Clamp-load distribution around each port"],
            ["Gasket", "Sealing face", "Needs flatness AND the right surface finish to seal"],
            ["Downpipe", "Second flange joint", "Thermal growth direction must be managed"],
            ["Thermal cycles", "Whole part", "Warping distorts yesterday's perfect face"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "Datum scheme for the flange drawing?", opts: ["A = sealing face, B–C = two stud holes of the pattern", "A = the pipe bore", "A = outer contour", "No datums — it's symmetric"], a: 0, ex: "The part seats on its sealing face (primary, 3 points) and locates by its stud holes — again the mounting features. Ports and the outer contour are then toleranced to that frame." },
            { t: "mcq", topic: "tol", q: "For the gasket to seal, the drawing must control the sealing face's…", opts: ["Circularity", "Flatness (often per-100 mm) AND surface finish — waviness and roughness both leak", "Perpendicularity to the pipe axis only", "Weight"], a: 1, ex: "A gasket bridges small gaps only: flatness caps the macro gap, roughness spec sets the micro seal. One without the other still leaks — tolerances and surface texture are designed together." },
            { t: "mcq", topic: "section", q: "A wide thin flange warps with every thermal cycle. Section-management response?", opts: ["Make it even thinner to cool faster", "Balanced section thickness + stud positions close around each port so clamp pressure survives distortion", "Paint it black", "Loosen the flatness tolerance and hope"], a: 1, ex: "You can't tolerance warp away — you design against it: enough section to resist bowing, symmetric metal distribution, studs near the ports so the gasket stays loaded even as the flange breathes." },
            { t: "calc", topic: "calc", kind: "fixed", Fset: [8, 10] },
            { t: "mcq", topic: "fit", q: "The downpipe flange holes are often radial slots, not round holes. Why?", opts: ["Punching slots is faster", "The pipe grows several millimetres when hot — slots give the expansion a designed direction while the joint stays clamped", "To save weight", "It's a legacy of carburetors"], a: 1, ex: "Thermal growth is displacement the drawing must budget for, like any tolerance. Slots aim the growth radially instead of letting it shear the studs — environment relationship managed by hole shape." }
          ],
          tips: [
            "Sealing = flatness + finish + clamp distribution, designed as one system with the gasket.",
            "Heat moves parts: give thermal growth a designed direction (slots) instead of fighting it.",
            "Datums on the sealing/mounting features; qualify the sealing face before referencing it."
          ]
        },
        {
          icon: "💡", name: "Headlamp bracket", process: "Injection-molded PA6-GF30",
          brief: "Positions the headlamp between fender, bumper and grille — three visible gaps meet at one corner. A masterclass in tolerance chains and molded-part section rules.",
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
        }
      ]
    },

    /* ================= TÜRKÇE ================= */
    tr: {
      ui: {
        navLabel: "Tasarım Stüdyosu",
        title: "🚗 Otomotiv Tasarım Stüdyosu",
        intro: "Masanıza rastgele bir otomobil parçası geliyor. Onu bir tasarım mühendisi gibi ele alın: çevresini okuyun, datum şemasını seçin, kesiti yönetin, boşlukları bütçeleyin ve toleransları hesaplayın. Her turda yeni bir rastgele parça.",
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
        topics: { iface: "Arayüzler ve fonksiyon", datum: "Datum şeması", tol: "Toleranslama", section: "Kesit yönetimi", fit: "Boşluk ve alıştırma", calc: "Hesap", mfg: "İmalat" },
        calcFloatQ: "Montaj: M{F} cıvatalar ve somunlar, HEM bu parçadaki HEM eş parçadaki ⌀{H} MMC boşluk deliklerinden geçiyor — yüzer bağlantı. Cıvata MMC = ⌀{F}.0. Her parçanın delik grubuna verilebilecek pozisyon toleransı?",
        calcFixedQ: "Montaj: M{F} elemanlar (MMC ⌀{F}.0) eş parçaya sabitlenmiş (vidalı / çakma); bu parçada ⌀{H} MMC boşluk delikleri var — sabit bağlantı. Her parçanın deseni için pozisyon toleransı?",
        calcFloatEx: "Yüzer bağlantı: T = H − F = {H} − {F}.0 = her parça için ⌀{T}, Ⓜ ile uygulanır.",
        calcFixedEx: "Sabit bağlantı: T = (H − F)/2 = ({H} − {F}.0)/2 = parça başına ⌀{T}, Ⓜ ile — ve sabitlenen tarafta Ⓟ'yi unutmayın."
      },
      parts: [
        {
          icon: "🛞", name: "Tekerlek göbeği", process: "Dövme çelik, tornalama + delme",
          brief: "Tekerleği ve fren diskini dönme ekseni üzerinde taşır, rulmana pres geçer. Buradaki her mikron salgı, otoyol hızında direksiyon titreşimine dönüşür.",
          env: [
            ["Tekerlek rulmanı", "Pres geçme muylu / delik", "Gerçek dönme eksenini tanımlar — diğer her şey ona göre ölçülür"],
            ["Fren diski", "Flanş yüzeyi + merkez pilotu", "Yüzey salgısı 1:1 disk yalpasına ve fren titremesine dönüşür"],
            ["Jant / tekerlek", "Bijon deseni + merkez pilotu", "Pilot konumlar; bijonlar sıkar"],
            ["Bijon saplamaları", "Flanşta pres geçme delikler", "Desen pozisyonu — jantla sabit bağlantı"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "Göbek serviste bütünüyle döner. Birincil datum hangi unsur olmalı?", opts: ["Bijon delikleri — en kalabalık unsur onlar", "Rulman muylusu — dönme eksenini fiziksel olarak tanımlayan yüzey", "Dış jant pilotu — erişmesi en kolay", "Flanş yüzeyi — en büyük yüzey"], a: 1, ex: "Araçta göbek rulman etrafında döner. Datum ekseni bu fonksiyonu kopyalamalıdır; tüm salgı ve pozisyon kontrolleri ona referans verir." },
            { t: "mcq", topic: "tol", q: "Disk montaj flanş yüzeyi: fren diski yalpasını hangi kontrol dizginler?", opts: ["Yüzeyde dairesellik", "Tek başına düzlemsellik — datum gerekmez", "Rulman eksenine (A) referanslı toplam salgı", "Tek bir bijon eksenine paralellik"], a: 2, ex: "Rulman eksenine salgı, tam da aracın yaşadığı şekilde ölçülür: A etrafında döndür, yüzeyin süpürmesini izle. Düzlemsellik eksene göre eğikliği göremez." },
            { t: "calc", topic: "calc", kind: "fixed", Fset: [12, 14] },
            { t: "mcq", topic: "section", q: "Bijon flanşını inceltmek dönen kütleyi azaltır. Kesit yönetimi tuzağı nedir?", opts: ["İnce flanş, sıkma + frenleme yükleri altında esner ve konikleşir — serviste yanal salgı büyür", "Salgı için ince her zaman daha iyidir", "Yalnızca korozyon ömrünü etkiler", "Resimdeki tolerans bunu otomatik telafi eder"], a: 0, ex: "Yük altındaki davranışı kesit rijitliği belirler. Esneyen bir kesiti hiçbir resim toleransı kurtaramaz — toleranslar parçayı ölçüldüğü haliyle tanımlar, yüklenmiş haliyle değil." },
            { t: "mcq", topic: "iface", q: "Jant, göbeğin pilot çapına merkezlenir (hub-centric tasarım); bijonlar yalnızca sıkar. Bijon deliği pozisyon toleransına etkisi?", opts: ["Sıfıra yakın olmalı — tekerleği bijonlar konumlar", "Doğrudan bağlantı elemanı formülünden gelebilir — konumlamayı pilot yapar, desenin tek işi monte olmak", "Bijonlar montajda tek tek raybalanmalı", "Pozisyon yalnızca flanş yüzeyine referans vermeli, eksene değil"], a: 1, ex: "Fonksiyonları ayırın: konumlama = pilot alıştırması, sıkma = bijonlar. Pilot konumladıktan sonra desen toleransı saf bir montaj (formül) problemidir — fonksiyonun kullanmadığı hassasiyete para ödemeyin." }
          ],
          tips: [
            "Dönen parça → birincil datum = gerçekten döndüğü eksen (rulman muylusu); asla 'elverişli' bir yüzey değil.",
            "Salgı kontrolleri parçayı aracın yaşadığı gibi okur — datum A etrafında dönen bir süpürme.",
            "Konumlamayı (pilot) ve sıkmayı (bijon deseni) ayırın; her birini kendi işi için toleranslayın."
          ]
        },
        {
          icon: "🛑", name: "Fren diski", process: "Kır dökme demir, tornalama",
          brief: "Sürtünmeyi ısıya çevirir: havalandırmalı bir halka üzerinde iki frenleme yüzeyi, 'şapka' kesitiyle göbeğe bağlanır. Müşteri her kalınlık hatasını pedal titreşimi olarak hisseder.",
          env: [
            ["Tekerlek göbeği", "Şapka montaj yüzeyi + pilot deliği", "Diski oturtur ve merkezler; yüzey hataları salgıya dönüşür"],
            ["Balatalar / kaliper", "Her iki sürtünme yüzeyi", "Kalınlık değişimi (DTV) titreme yapar; paralellik kraldır"],
            ["Jant", "Aynı bijon istifinde sıkılır", "Cıvatalı bağlantıyı paylaşır — şapka yüzeyinin düzlemselliği önemli"],
            ["Soğutma havası", "İç kanatçıklar", "Kanatçık kesit alanı termal kapasiteyi belirler"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "Disk resmi için datum şemasını seçin.", opts: ["A = sürtünme yüzeyi, B = dış çap", "A = şapka montaj yüzeyi, B = pilot deliği", "A = desen olarak bijon delikleri, B = bir kanatçık", "A = dış çap, B = sürtünme yüzeyi"], a: 1, ex: "Disk şapka yüzeyiyle oturur (göbeğe, 3 nokta) ve pilot deliğiyle merkezlenir (2) — datum şeması montajı kopyalar; sürtünme yüzeylerinin salgısı tam da bu oturma etrafında ölçülür." },
            { t: "mcq", topic: "tol", q: "Fren titremesi Disk Kalınlık Değişiminden (DTV) gelir. İki sürtünme yüzeyi arasındaki eti doğrudan hangi kontrol sınırlar?", opts: ["Yüzeylerin pilota pozisyonu", "Dış çapın silindirikliği", "Kalınlık boyut toleransı + iki yüzey arasında paralellik", "Kanatçıkların eş merkezliliği"], a: 2, ex: "DTV iki yüzeyli bir ilişkidir: boyut sınırları eti belirler, paralellik (tüm yüzeyde) değişimini sınırlar. A|B'ye salgı ise çiftin yalpasını yönetir." },
            { t: "mcq", topic: "section", q: "Sert frenlemede sürtünme halkası ısınır ve daha serin şapkaya göre 'konikleşmek' ister. Kesit yönetimi yanıtı?", opts: ["Şapka duvarını olabildiğince inceltmek", "Sürtünme yüzeylerini krom kaplamak", "Halkayı işlemeden sonra şapkaya kaynatmak", "Şapka-halka birleşimini (duvar, radyüsler, ofset) ısıl büyüme halkayı yatırmadan radyal kalacak şekilde biçimlendirmek"], a: 3, ex: "Konikleşme bir tolerans değil geometri problemidir: şapka kesiti, sıcak halka radyal büyüyebilsin diye tasarlanır — böylece salgı toleransı yalnızca imalatı karşılamak zorunda kalır." },
            { t: "mcq", topic: "fit", q: "Pilot deliği ile göbek pilotu — hangi alıştırmayı verirsiniz?", opts: ["Ağır sıkı geçme — sonsuza dek preslenmiş", "Küçük, kontrollü boşluk: bijonlar sıkmadan önce diski merkezler, serviste yine de sökülür", "Bol gevşek boşluk — bijonlar merkezler nasılsa", "Dişli bağlantı"], a: 1, ex: "Servis diskin sökülmesini gerektirir, yani sıkı geçme olmaz; ama pilot sıkmadan önce merkezlemeli — küçük ve toleranslı bir boşluk: klasik konumsal boşluk alıştırması." },
            { t: "calc", topic: "calc", kind: "fixed", Fset: [12, 14] }
          ],
          tips: [
            "Datumlar = parçanın montajlandığı yüzeyler (şapka yüzeyi + pilot); asla 'önce işlenen' yüzey değil.",
            "Kontrolü fonksiyon adlandırır: DTV → boyut + paralellik; yalpa → montaj datumlarına salgı.",
            "Isıl distorsiyonu kesit tasarımında çözün; toleransları yalnızca imalat değişkenliğine saklayın."
          ]
        },
        {
          icon: "⚙️", name: "Motor kulağı braketi", process: "Yüksek basınçlı alüminyum enjeksiyon döküm",
          brief: "Motor bloğuna cıvatalanır ve kauçuk takozu taşır: motorla gövde arasındaki titreşim yolu bu dökümden geçer. Yorulma yükleri, dar paketleme; dökülür, sonra işlenir.",
          env: [
            ["Motor bloğu", "3 işlenmiş ped + M10 cıvata", "Cıvatalı temel — datumlar burada yaşar"],
            ["Kauçuk takoz / burç", "İşlenmiş delik", "Pozisyonu aktarma organı hizasını, çapı pres tutmasını belirler"],
            ["Alternatör", "En yakın süpürmede 8 mm hava boşluğu", "Motor takozları üzerinde hareket eder — dinamik boşluk zarfı"],
            ["Yol yükleri", "Döküm boyunca yorulma spektrumu", "Ömrü kesit tasarımı (federler, radyüsler) taşır"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "İşlenmiş döküm için datum şemasını seçin.", opts: ["Ham döküm federler — rijittirler", "A = blok tarafındaki işlenmiş ped yüzeyi, B ve C = işlenmiş cıvata deliklerinden ikisi", "Yalnızca kauçuk takoz deliği", "Döküm ayırma çizgisi"], a: 1, ex: "Datum unsurları, braketi blokta (ve işleme fikstüründe) konumlayan işlenmiş pedler ile iki cıvata deliğidir. Ham döküm yüzeyler hassas unsurları konumlamak için fazla değişkendir." },
            { t: "mcq", topic: "section", q: "Enjeksiyon döküm braket için doğru kesit stratejisi hangisi?", opts: ["Tek masif kalın kesit — kalın olan sağlamdır", "Homojen orta kalınlıkta duvar + rijitlik gereken yerde federler", "Yüke göre 3–15 mm arası değişen duvar", "Malzemeyi artırmak için keskin iç köşeler"], a: 1, ex: "Kalın döküm kesitleri porozite ve çökme hapseder — çoğu zaman *daha zayıftır*. Rijitlik sabit duvarda feder geometrisinden gelir; cömert radyüsler feder köklerindeki yorulma sıcak noktalarını öldürür." },
            { t: "mcq", topic: "mfg", q: "Braketin kalıp açılma yönüne paralel duvarları ne ister?", opts: ["Tam 90° — müşteri öyle dedi", "Stil için alttan kesmeler", "Eğim (≈1–3°) — döküm kalıptan çıkabilsin", "Ayna parlaklığında yüzey"], a: 2, ex: "Her döküm/kalıp duvarı takım yönünde eğim ister. Tasarımcı bunu ilk günden ekler — sonradan eklemek, pakete çoktan söz verdiğiniz kütleyi ve boşlukları kaydırır." },
            { t: "mcq", topic: "fit", q: "Alternatör brakete 8 mm'ye kadar yaklaşıyor; motor takozları üzerinde ±6 mm hareket ediyor. Hamleniz?", opts: ["8 > 6, gönder gitsin", "Bakan konturu blok datumlarına profille toleransla ve stack'i işlet: hareket + braket profili + alternatör pozisyonu temassız kalmalı", "Değerse montaj hattı büker", "Brakete kauçuk ped yapıştır"], a: 1, ex: "Hareket eden komşulara boşluk bir stack-up'tır: dinamik zarf + iki parçanın geometrik toleransları. Braket konturu, stack hesaplanabilsin diye aynı blok datumlarına profil kontrolü alır." },
            { t: "calc", topic: "calc", kind: "fixed", Fset: [8, 10] }
          ],
          tips: [
            "Döküm: önce datum sistemini işleyin (pedler + 2 delik), hassas her şey ondan — blok tarafı unsurlara tek DRF.",
            "Enjeksiyon döküm mukavemeti kesit tasarımıdır: homojen duvar, federler, radyüsler — kütle değil.",
            "HAREKET EDEN parçalara boşluk dinamik bir stack-up'tır ve hesaplanabilir datumlarda profil toleransı ister."
          ]
        },
        {
          icon: "🚪", name: "Kapı menteşesi", process: "Sac şekillendirme + kaynak, çelik",
          brief: "İki menteşe kapıyı asar ve dönme eksenini tanımlar. Müşteri menteşeyi asla görmez — yalnızca ürettiği kapı boşluğunu ve yüzey hizasını görür.",
          env: [
            ["Gövde A-direği", "Cıvatalı bağlantı, oval delikler", "Gövde toleranslarını tasarlanmış ayarla yutar"],
            ["Kapı iç sacı", "Cıvatalı bağlantı", "Kapı kütlesini aktarır; hiza boşluk ve düzlüğü belirler"],
            ["Menteşe pimi", "İki pim deliği", "İki menteşe birlikte TEK dönme ekseni tanımlar"],
            ["Kapı fitili", "Kapı pozisyonu üzerinden sıkışma", "Rüzgâr sesi ve kapanma eforu"]
          ],
          steps: [
            { t: "mcq", topic: "iface", q: "Menteşe toleransları müşterinin gördüğü hangi sonucu doğrudan kontrol eder?", opts: ["Yakıt ekonomisi", "Kapı boşluğu ve çamurluğa göre yüzey hizası — ve yıllar içinde kapı sarkması", "Motor sesi", "Lastik aşınması"], a: 1, ex: "Fonksiyon zincirini izleyin: menteşe geometrisi → dönme ekseni → kapı pozisyonu → müşterinin gözünün galeride ölçtüğü boşluk. Toleransları o boşluk bütçesinden geriye doğru tasarlayın." },
            { t: "mcq", topic: "datum", q: "Üst ve alt menteşenin pim delikleri (gövde tarafı) birlikte çalışmalı. Nasıl toleranslarsınız?", opts: ["Her deliği gevşek ve bağımsız — pim ortalamasını alır", "Tek eş eksenli desen olarak: ortak gövde datumlarına pozisyon/eş eksenlilik, iki delik tek kontrolde", "Pimleri boyadan sonra kaynatırız", "Bitmiş araçta raybalanır"], a: 1, ex: "Tek eksen gibi davranması gereken iki delik, tek DRF'ye tek desen olarak toleranslanır. Tek tek 'iyi' delikler yine de hiçbir montaj ayarının tam düzeltemeyeceği eğik bir eksen oluşturabilir." },
            { t: "mcq", topic: "fit", q: "Menteşe-gövde delikleri neden sıkı pozisyon toleransı yerine oval delik + ayarla-sonra-sık cıvata alır?", opts: ["Oval delik basmak daha ucuz", "Tasarlanmış ayar, gövde tarafı stack'ini yutar; böylece her parçanın toleransı ekonomik kalabilir", "Ağırlık kazandırır", "Stil mirası"], a: 1, ex: "Bütün bir gövde yanının stack'i boşluk bütçesinden genişse, tasarımcı bir ayar unsuru ekler ve *hangi yönü yuttuğunu belgeler*. Doğru olmak zorunda olanı toleransla; olamayanı ayarla." },
            { t: "mcq", topic: "section", q: "10 yılda kapı sarkması = menteşe esnemesi + aşınma. Sac menteşe plakası sarkmaya esas olarak neyle direnir?", opts: ["Kesit geometrisiyle — kenar flanşları ve form federler — salt kalınlıktan çok", "Boya kalınlığıyla", "Sönümleme için daha yumuşak çelikle", "Deliklere daha sıkı pozisyon toleransıyla"], a: 0, ex: "Rijitlik kesit yüksekliğinin küpüyle, kalınlığın yalnızca birinci kuvvetiyle büyür: form verilmiş flanşlar kalın sacı yener. Ve hiçbir pozisyon toleransı esnemeyi önlemez — o, kesitin işidir." },
            { t: "calc", topic: "calc", kind: "floating", Fset: [8, 10] }
          ],
          tips: [
            "Müşterinin gördüğünden geriye toleranslayın: boşluk ve hiza bütçeleri menteşe kontrollerine iner.",
            "Birlikte davranan unsurlar (iki pim deliği = tek eksen) birlikte toleranslanır — tek desen, tek DRF.",
            "Ayar unsurları doğaçlama değil tasarımdır: stack'in nerede yutulacağına karar verin."
          ]
        },
        {
          icon: "🔥", name: "Egzoz manifold flanşı", process: "İşlenmiş çelik döküm",
          brief: "600 °C'lik darbeli egzoz gazını contaya karşı sızdırmaz; her sürüşte −30 °C'den döngüye girer. Sızdırmazlık, çarpılan bir sahada oynanan düzlemsellik-ve-basınç oyunudur.",
          env: [
            ["Silindir kafası", "Saplamalar + conta bağlantısı", "Her port çevresinde sıkma yükü dağılımı"],
            ["Conta", "Sızdırmazlık yüzeyi", "Sızdırmazlık için düzlemsellik VE doğru yüzey pürüzlülüğü gerekir"],
            ["İniş borusu", "İkinci flanş bağlantısı", "Isıl büyüme yönü yönetilmeli"],
            ["Isıl döngüler", "Bütün parça", "Çarpılma, dünün mükemmel yüzeyini bozar"]
          ],
          steps: [
            { t: "mcq", topic: "datum", q: "Flanş resmi için datum şeması?", opts: ["A = sızdırmazlık yüzeyi, B–C = desenden iki saplama deliği", "A = boru deliği", "A = dış kontur", "Datum gerekmez — simetrik"], a: 0, ex: "Parça sızdırmazlık yüzeyiyle oturur (birincil, 3 nokta) ve saplama delikleriyle konumlanır — yine montaj unsurları. Portlar ve dış kontur bu çerçeveye toleranslanır." },
            { t: "mcq", topic: "tol", q: "Contanın sızdırmaması için resim, sızdırmazlık yüzeyinin nesini kontrol etmeli?", opts: ["Daireselliğini", "Düzlemselliğini (çoğu kez 100 mm başına) VE yüzey pürüzlülüğünü — dalgalılık da pürüzlülük de sızdırır", "Yalnızca boru eksenine dikliğini", "Ağırlığını"], a: 1, ex: "Conta yalnızca küçük boşlukları köprüler: düzlemsellik makro boşluğu, pürüzlülük şartı mikro sızdırmazlığı belirler. Biri olmadan öteki yine sızdırır — tolerans ve yüzey dokusu birlikte tasarlanır." },
            { t: "mcq", topic: "section", q: "Geniş ince flanş her ısıl döngüde çarpılır. Kesit yönetimi yanıtı?", opts: ["Daha hızlı soğusun diye daha da inceltmek", "Dengeli kesit kalınlığı + her portun hemen çevresine saplama yerleşimi: sıkma basıncı distorsiyona rağmen yaşasın", "Siyaha boyamak", "Düzlemsellik toleransını gevşetip dua etmek"], a: 1, ex: "Çarpılmayı toleransla yok edemezsiniz — ona karşı tasarlarsınız: bombeye direnecek kesit, simetrik metal dağılımı, portlara yakın saplamalar; flanş nefes alsa da conta yüklü kalır." },
            { t: "calc", topic: "calc", kind: "fixed", Fset: [8, 10] },
            { t: "mcq", topic: "fit", q: "İniş borusu flanş delikleri çoğu kez yuvarlak değil radyal ovaldir. Neden?", opts: ["Oval basmak daha hızlı", "Boru ısınınca milimetrelerce büyür — oval delikler büyümeye tasarlanmış bir yön verir, bağlantı sıkılı kalır", "Ağırlık için", "Karbüratör devrinden kalma"], a: 1, ex: "Isıl büyüme, resmin bütçelemesi gereken bir yer değiştirmedir — tıpkı tolerans gibi. Oval delikler büyümeyi saplamaları makaslamak yerine radyale yönlendirir: delik şekliyle yönetilen çevre ilişkisi." }
          ],
          tips: [
            "Sızdırmazlık = düzlemsellik + pürüzlülük + sıkma dağılımı; contayla birlikte tek sistem olarak tasarlanır.",
            "Isı parçaları hareket ettirir: ısıl büyümeye savaşmak yerine tasarlanmış bir yön (oval delik) verin.",
            "Datumlar sızdırmazlık/montaj unsurlarında; referans vermeden önce sızdırmazlık yüzeyini nitelendirin."
          ]
        },
        {
          icon: "💡", name: "Far braketi", process: "Enjeksiyon kalıplama, PA6-GF30",
          brief: "Farı çamurluk, tampon ve panjur arasında konumlar — üç görünür boşluk tek köşede buluşur. Tolerans zincirleri ve plastik kesit kuralları üzerine bir ustalık dersi.",
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
