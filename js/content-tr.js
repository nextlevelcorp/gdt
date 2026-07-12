/* ===== GD&T Academy — content-tr.js ===== */
(function () {
  "use strict";
  var F = GDT_SVG.fcf, SYM = GDT_SVG.SYM, D = GDT_SVG.DIAGRAMS;
  var H = window.GDT_H; // helpers defined in content-en.js (loaded first)

  var UI = {
    appName: "GD&T Akademi",
    navHome: "Ana Sayfa",
    navLessons: "Dersler",
    navPractice: "Pratik",
    navReference: "Referans",
    navSymbols: "Sembol Referansı",
    navExam: "Final Sınavı",
    lessonLabel: "Ders",
    heroTitle: "GD&T'yi sıfırdan profesyonel seviyeye öğrenin",
    heroText: "Geometrik Boyutlandırma ve Toleranslandırma (ASME Y14.5) üzerine eksiksiz, ücretsiz bir kurs. Ön bilgi gerekmez — her sembol, kural ve kavram; diyagramlar, örnekler ve quizlerle adım adım anlatılır.",
    heroCta: "Öğrenmeye başla",
    homeLessonsTitle: "Kurs müfredatı",
    homeHowTitle: "Bu kurs nasıl işler?",
    homeHowText: "Dersleri sırayla takip edin — her ders bir öncekinin üzerine kurulur. Her dersi kısa quiziyle bitirin (tamamlamak için %80 ve üzeri puan gerekir), aklınıza takıldıkça Sembol Referansı'na bakın ve kursu Final Sınavı ile tamamlayın. İlerlemeniz tarayıcınızda otomatik olarak kaydedilir.",
    quizTitle: "Ders quizi",
    quizIntro: "Tüm soruları cevaplayıp “Cevapları kontrol et” butonuna basın. Dersi tamamlamak için %80 gerekir.",
    checkAnswers: "Cevapları kontrol et",
    tryAgain: "Tekrar dene",
    quizPass: "Geçtiniz! Ders tamamlandı —",
    quizFail: "Henüz değil — dersi gözden geçirip tekrar deneyin.",
    scoreWord: "Puan",
    prevLesson: "← Önceki",
    nextLesson: "Sonraki ders →",
    backHome: "Ana Sayfa",
    completed: "Tamamlandı",
    progressText: "{done}/{total} ders",
    resetProgress: "İlerlemeyi sıfırla",
    resetConfirm: "Kayıtlı tüm ilerleme silinsin mi?",
    symTitle: "GD&T Sembol Referansı",
    symIntro: "ASME Y14.5'in 14 geometrik karakteristik sembolünün tamamı ve en yaygın modifiyeler. Kategoriye göre filtreleyebilirsiniz.",
    symDatum: "Datum",
    symZone: "Tipik bölge",
    datumYes: "Zorunlu",
    datumNo: "Asla",
    datumOpt: "İsteğe bağlı",
    catAll: "Tümü",
    catForm: "Form (Şekil)",
    catOrientation: "Yönelim",
    catLocation: "Konum",
    catProfile: "Profil",
    catRunout: "Salgı",
    catModifier: "Modifiyeler",
    examTitle: "Final Sınavı",
    examIntro: "Tüm kurstan rastgele seçilen 20 soru. Geçmek için %80 gerekir. İstediğiniz kadar tekrar girebilirsiniz — her seferinde yeni bir soru seti çekilir.",
    examStart: "Sınavı başlat",
    examRetake: "Yeni sınav",
    examPass: "Tebrikler — final sınavını geçtiniz!",
    examFail: "%80'in altında — zayıf konuları tekrar edip yeniden deneyin.",
    questionWord: "Soru",
    ofWord: "/",
    footer: "GD&T Akademi — ASME Y14.5 temel alınarak hazırlanmış bir eğitim kaynağıdır. Üretimde her zaman resmi standarda ve şirketinizin teknik resim kurallarına başvurun.",
    minutes: "dk okuma",
    keyPoints: "Önemli noktalar",
    example: "Çözümlü örnek",
    warning: "Dikkat",
    definition: "Tanım"
  };

  var SYMBOLS = [
    { key: "straightness", cat: "form", name: "Doğrusallık", datum: "no", zone: "2 paralel çizgi / silindir (eksen)", desc: "Bir çizgi elemanının veya bir eksenin mükemmel doğrudan ne kadar sapabileceğini kontrol eder." },
    { key: "flatness", cat: "form", name: "Düzlemsellik", datum: "no", zone: "2 paralel düzlem", desc: "Bir yüzeyin tamamının mükemmel düzlemden ne kadar sapabileceğini kontrol eder." },
    { key: "circularity", cat: "form", name: "Dairesellik (Yuvarlaklık)", datum: "no", zone: "2 eşmerkezli çember", desc: "Her bir dairesel kesitin, diğerlerinden bağımsız olarak ne kadar yuvarlak olduğunu kontrol eder." },
    { key: "cylindricity", cat: "form", name: "Silindiriklik", datum: "no", zone: "2 eş eksenli silindir", desc: "Silindirik bir yüzeyin tamamının yuvarlaklığını, doğrusallığını ve konikliğini tek seferde kontrol eder." },
    { key: "perpendicularity", cat: "orientation", name: "Diklik", datum: "yes", zone: "2 paralel düzlem / silindir", desc: "Bir yüzeyin veya eksenin bir datuma göre tam 90°'ye ne kadar yakın olduğunu kontrol eder." },
    { key: "parallelism", cat: "orientation", name: "Paralellik", datum: "yes", zone: "2 paralel düzlem / silindir", desc: "Bir yüzeyin veya eksenin bir datuma ne kadar paralel olduğunu kontrol eder." },
    { key: "angularity", cat: "orientation", name: "Açısallık", datum: "yes", zone: "2 paralel düzlem / silindir", desc: "Bir yüzeyi veya ekseni, datuma göre belirtilen herhangi bir temel açıda kontrol eder." },
    { key: "position", cat: "location", name: "Pozisyon (Konum)", datum: "yes", zone: "Silindir / 2 paralel düzlem", desc: "GD&T'nin en çok kullanılan sembolü. Boyutlu bir unsurun teorik olarak tam (gerçek) konumundan ne kadar sapabileceğini kontrol eder." },
    { key: "concentricity", cat: "location", name: "Eşmerkezlilik", datum: "yes", zone: "Datum ekseni etrafında silindir", desc: "Bir unsurun medyan noktalarını datum eksenine göre kontrol eder. ASME Y14.5-2018'de kaldırıldı; eski resimlerde hâlâ görülür." },
    { key: "symmetry", cat: "location", name: "Simetri", datum: "yes", zone: "Datum orta düzlemi etrafında 2 paralel düzlem", desc: "Bir unsurun medyan noktalarını datum orta düzlemine göre kontrol eder. ASME Y14.5-2018'de kaldırıldı." },
    { key: "profileLine", cat: "profile", name: "Çizgi Profili", datum: "opt", zone: "2 ofsetli eğri (2B)", desc: "Eğri veya düz bir konturun tek tek 2B kesitlerini kontrol eder." },
    { key: "profileSurface", cat: "profile", name: "Yüzey Profili", datum: "opt", zone: "2 ofsetli yüzey (3B)", desc: "En güçlü sembol: tek bir gösterimle herhangi bir yüzeyin boyutunu, formunu, yönelimini ve konumunu kontrol edebilir." },
    { key: "circularRunout", cat: "runout", name: "Dairesel Salgı", datum: "yes", zone: "Her çemberde tam ibre hareketi", desc: "Dönen bir yüzeyin her bir dairesel elemanını kontrol eder: parça datum ekseni etrafında 360° dönerken komparatör okuması." },
    { key: "totalRunout", cat: "runout", name: "Toplam Salgı", datum: "yes", zone: "Tüm yüzeyde tam ibre hareketi", desc: "Dairesel salgı gibidir ama tüm yüzey tek seferde kontrol edilir — komparatör yüzey boyunca da hareket eder." },
    { key: "mmc", cat: "modifier", name: "Ⓜ — Maksimum Malzeme Koşulu", datum: "-", zone: "—", desc: "Tolerans, en çok malzemenin bulunduğu boyutta geçerlidir (en büyük mil / en küçük delik). MMC'den uzaklaştıkça bonus tolerans kazanılır." },
    { key: "lmc", cat: "modifier", name: "Ⓛ — Minimum Malzeme Koşulu", datum: "-", zone: "—", desc: "Tolerans, en az malzemenin bulunduğu boyutta geçerlidir (en küçük mil / en büyük delik). Örn. minimum et kalınlığını korumak için kullanılır." },
    { key: "proj", cat: "modifier", name: "Ⓟ — Uzatılmış Tolerans Bölgesi", datum: "-", zone: "—", desc: "Tolerans bölgesini parçanın dışına, eşleşen pim veya saplamanın gerçekte temas ettiği yüksekliğe uzatır." },
    { key: "freeState", cat: "modifier", name: "Ⓕ — Serbest Durum", datum: "-", zone: "—", desc: "Esnek parçalar için: tolerans, parça bağlanmamış (serbest) haldeyken geçerlidir." },
    { key: "tangent", cat: "modifier", name: "Ⓣ — Teğet Düzlem", datum: "-", zone: "—", desc: "Yalnızca yüzeyin tepe noktalarına temas eden düzlemin bölge içinde olması gerekir — yüzey dokusu dikkate alınmaz." },
    { key: "unilateral", cat: "modifier", name: "Ⓤ — Eşit Dağılmamış Profil", datum: "-", zone: "—", desc: "Profil tolerans bölgesini gerçek profilin bir tarafına kaydırır (örn. tamamı malzeme dışına)." },
    { key: "diameter", cat: "modifier", name: "⌀ — Çap", datum: "-", zone: "—", desc: "Tolerans değerinin önüne konduğunda tolerans bölgesini iki paralel düzlem yerine silindirik yapar." }
  ];

  var LESSONS = [];

  /* ============ DERS 1 ============ */
  LESSONS.push({
    id: "intro",
    title: "GD&T nedir ve neden var?",
    short: "Mühendislik resimlerinin dili, tarihçesi ve ± toleransların neden yetersiz kaldığı.",
    minutes: 12,
    sections: [
      {
        h: "Parçaları tarif eden bir dil",
        html:
          "<p><span class='term'>GD&T</span> — <strong>Geometrik Boyutlandırma ve Toleranslandırma</strong> (Geometric Dimensioning and Tolerancing) — teknik resimlerde ve 3B modellerde, imal edilen bir parçanın <em>izin verilen kusurunu</em> kesin ve tek anlamlı biçimde tarif etmek için kullanılan sembolik bir dildir.</p>" +
          "<p>Hiçbir imalat yöntemi mükemmel değildir. Her delik merkezinden biraz kaçıktır, her “düz” yüzey biraz dalgalıdır, her mil biraz eğridir. Gerçek mühendislik sorusu asla <em>“mükemmel yapabilir miyiz?”</em> değil, <em>“ne kadar kusurlu olsa da yine çalışır?”</em> sorusudur. GD&T, bu sorunun cevabını resmin üzerine yazmanın standart yoludur.</p>" +
          H.box("key", UI.definition,
            "<p>GD&T, parça unsurlarının <strong>boyutunu</strong>, <strong>formunu (şeklini)</strong>, <strong>yönelimini</strong> ve <strong>konumunu</strong> tanımlar ve her birinin ne kadar sapabileceğini belirtir. Başlıca iki standartla yönetilir: <strong>ASME Y14.5</strong> (ABD, son sürüm 2018) ve <strong>ISO GPS</strong> ailesi (ISO 1101 ve ilgili standartlar). Bu kurs ASME Y14.5'i takip eder; önemli ISO farklarına ayrıca değinilir.</p>")
      },
      {
        h: "Kısa tarihçe: her şeyi başlatan flanş",
        html:
          "<p>İkinci Dünya Savaşı sırasında, Kraliyet Torpido Fabrikası'nda çalışan İngiliz mühendis <strong>Stanley Parker</strong> tuhaf bir şey fark etti: muayenede <em>reddedilen</em> parçalar — delik konumları kare ± tolerans bölgesinin dışındaydı — yine de sorunsuz monte oluyor ve çalışıyordu.</p>" +
          "<p>Sorunu şöyle teşhis etti: X'te ±0,1 ve Y'de ±0,1 ile toleranslanan bir delik konumu <strong>kare</strong> bir tolerans bölgesi oluşturur. Oysa fonksiyon — içinden geçen bir cıvata — <strong>yuvarlaktır</strong>. Karenin “köşesindeki” bir delik, ideal konumdan, kenar ortasının hemen dışındaki bir delikten aslında <em>daha uzaktır</em>; yine de köşedeki geçer, diğeri kalır. Kare bölge iyi parçaları reddeder ve mantığı fonksiyonla örtüşmez.</p>" +
          "<p>Parker, <strong>silindirik tolerans bölgesini</strong> önerdi — modern GD&T'nin doğduğu tohum fikir. Takip eden on yıllarda standartlaştı ve bugünkü ASME Y14.5'e evrildi.</p>"
      },
      {
        h: "± (koordinat) toleranslamanın sorunu",
        html:
          "<p>Geleneksel resimler bir deliği iki ölçüyle konumlandırır, örn. <code>50 ±0,1</code> ve <code>40 ±0,1</code>. Bunun üç derin sorunu vardır:</p>" +
          "<ol>" +
          "<li><strong>Kare bölge, yuvarlak fonksiyon.</strong> ± bölgesi 0,2 × 0,2'lik bir karedir. Köşelerinden geçen silindirik bölgenin (⌀0,283) alanı <strong>%57 daha fazladır</strong> — kullanılabilir parçalar çöpe gider.</li>" +
          "<li><strong>Ölçüm başlangıcı yok.</strong> ± ölçüler <em>önce hangi yüzeylerden ölçüleceğini</em> söylemez. Parçayı farklı bağlayan iki muayeneci aynı parça için farklı sonuçlar bulur.</li>" +
          "<li><strong>Tolerans birikimi ve belirsizlik.</strong> ± ölçü zincirleri öngörülemez biçimde birikir; “yüzeyler dik olacaktır” gibi notların ölçülebilir bir anlamı yoktur.</li>" +
          "</ol>" +
          H.dia(D.zoneCompare({ a: "± 0,1 koordinat bölgesi", b: "Pozisyon ⌀0,283 bölgesi" }),
            "Aynı fonksiyonel gereksinim: kare ± bölgesi (solda) ile köşelerinden geçen silindirik pozisyon bölgesi (sağda). Yuvarlak bölge, gerçekte iyi olan parçaların %57 fazlasını kabul eder.") +
          H.widget("zoneCompare") +
          H.box("warn", UI.warning,
            "<p>GD&T, ± toleransları her yerde <strong>kaldırmaz</strong> — boyut ölçüleri (örn. ⌀10 ±0,1) yine ± ile verilir. GD&T yalnızca <em>ilişkiler</em> için ±'nin yerini alır: unsurların nerede olduğu, nasıl yönlendiği ve hangi şekle sahip olduğu.</p>")
      },
      {
        h: "GD&T size ne kazandırır?",
        html:
          "<ul>" +
          "<li><strong>Tek yorum.</strong> Tasarımcı, tezgâhçı ve muayeneci aynı, matematiksel olarak tanımlı gereksinimi okur.</li>" +
          "<li><strong>Fonksiyona dayalı toleranslar.</strong> Bölgeler parçanın gerçek çalışma şekliyle örtüşür (yuvarlak unsurlara yuvarlak bölgeler).</li>" +
          "<li><strong>Tanımlı ölçüm düzeneği.</strong> Datumlar, parçanın tam olarak nasıl tutulacağını ve ölçümün nereden başlayacağını belirtir.</li>" +
          "<li><strong>Bedava ek imalat toleransı.</strong> Silindirik bölge (+%57) ve <em>bonus tolerans</em> (Ders 10) fonksiyonu bozmadan ıskartayı azaltır.</li>" +
          "<li><strong>Daha ucuz muayene kararları.</strong> Fonksiyonel mastarlarla parçalar saniyeler içinde kontrol edilebilir.</li>" +
          "</ul>" +
          H.box("key", UI.keyPoints,
            "<ul><li>GD&T, izin verilen geometrik kusur için kesin bir sembolik dildir.</li>" +
            "<li>Ana standartlar: <strong>ASME Y14.5-2018</strong> ve <strong>ISO GPS (ISO 1101)</strong>.</li>" +
            "<li>± toleranslama kare bölgeler verir, ölçüm başlangıcı tanımlamaz ve belirsizdir; GD&T üçünü de çözer.</li>" +
            "<li>Silindirik pozisyon bölgesi, eşdeğer kare ± bölgeden %57 daha fazla kullanılabilir alan içerir.</li></ul>")
      }
    ],
    quiz: [
      { q: "GD&T bir resimde öncelikle neyi tanımlar?", opts: ["Parçanın malzemesini ve ısıl işlemini", "Unsurların boyut, form, yönelim ve konumundaki izin verilen sapmayı", "Kullanılacak imalat yöntemini", "Parçanın maliyetini"], a: 1, ex: "GD&T her unsurun mükemmel geometriden ne kadar sapabileceğini belirtir — malzeme, yöntem veya maliyet hakkında bir şey söylemez." },
      { q: "ABD'deki ana GD&T standardı hangisidir?", opts: ["ISO 9001", "ASME Y14.5", "DIN 476", "IPC-A-610"], a: 1, ex: "ASME Y14.5 (son sürüm 2018) Amerikan GD&T standardıdır; uluslararası alanda ISO GPS ailesi (ISO 1101 vb.) kullanılır." },
      { q: "0,2 × 0,2'lik kare ± bölgesine kıyasla, köşelerinden geçen silindirik pozisyon bölgesinin alanı…", opts: ["aynıdır", "%43 daha azdır", "%57 daha fazladır", "iki katıdır"], a: 2, ex: "Çevrel çemberin (⌀0,283) alanı kareden %57 fazladır — bu ek alanın tamamı fonksiyonel olarak kabul edilebilirdir." },
      { q: "Datumlar, ± koordinat toleranslamanın hangi temel sorununu çözer?", opts: ["Parçaların çok pahalı olmasını", "Hangi yüzeylerden ve hangi sırayla ölçüleceğinin bilinmemesini", "Resimlerin çok küçük olmasını", "Parçanın korozyonunu"], a: 1, ex: "± ölçüler ölçüm başlangıcı veya sırası tanımlamaz; datumlar (Ders 4) parçanın tam olarak nasıl bağlanıp ölçüleceğini tanımlar." },
      { q: "GD&T ve ± toleranslar hakkında hangi ifade doğrudur?", opts: ["GD&T tüm ± toleransların yerini tamamen alır", "± toleranslar boyut için kullanılmaya devam eder; form, yönelim ve konumu GD&T üstlenir", "GD&T yalnızca çok ucuz parçalarda kullanılır", "± toleranslar GD&T'den daha hassastır"], a: 1, ex: "⌀10 ±0,1 gibi boyut ölçüleri kalır; ±'nin kötü yönettiği geometrik ilişkileri GD&T devralır." }
    ]
  });

  /* ============ DERS 2 ============ */
  LESSONS.push({
    id: "concepts",
    title: "Temel kavramlar ve terminoloji",
    short: "Unsurlar, boyutlu unsurlar, MMC/LMC, temel ölçüler, tolerans bölgeleri ve iki temel kural.",
    minutes: 15,
    sections: [
      {
        h: "Unsur ve Boyutlu Unsur (FOS)",
        html:
          "<p>GD&T'de her şey bir <span class='term'>unsura (feature)</span> uygulanır — parçanın fiziksel bir bölümü: bir yüzey, bir delik, bir pim, bir kanal, bir kenar.</p>" +
          "<p>Tüm GD&T'deki en önemli ayrım, düz unsur ile <span class='term'>boyutlu unsur (feature of size, FOS)</span> arasındakidir:</p>" +
          H.tbl(["", "Unsur (yüzey)", "Boyutlu Unsur (FOS)"], [
            ["Nedir?", "Tek bir yüzey: düz bir alın, bir kontur", "<strong>Boyut ölçüsü</strong> ve <strong>karşılıklı noktaları</strong> olan geometri: delik, pim, kanal, tırnak, küre"],
            ["Merkezi/ekseni var mı?", "Hayır", "Evet — kendisinden bir eksen, orta düzlem veya merkez noktası <em>türetilir</em>"],
            ["Örnekler", "Bir plakanın üst yüzeyi", "⌀10 delik, ⌀12 mil, 8 mm genişliğinde kanal"],
            ["Neden önemli?", "Geometrik kontroller yüzeyin kendisine uygulanır", "Kontroller <strong>eksene/orta düzleme</strong> uygulanabilir ve malzeme modifiyeleri (Ⓜ/Ⓛ) mümkün olur"]
          ]) +
          H.box("warn", UI.warning, "<p>Bir kontrolün <em>yüzeye</em> mi yoksa <em>eksene</em> mi uygulandığı, özellik kontrol çerçevesinin nereye bağlandığına bağlıdır (Ders 3). Boyut ölçüsüne bağlıysa → ekseni/orta düzlemi kontrol eder. Yüzeye ok ile gösteriliyorsa → yüzeyi kontrol eder.</p>")
      },
      {
        h: "Boyutlar: MMC, LMC ve gerçek yerel boyut",
        html:
          "<p>Boyutlu bir unsurun toleranslı bir boyutu vardır; örn. ⌀10,0–10,2 delik. Üç boyut kavramı sürekli karşınıza çıkar:</p>" +
          "<ul>" +
          "<li><span class='term'>Gerçek yerel boyut</span> — tek tek ölçülen herhangi bir iki-nokta mesafesi (mikrometrenin bir noktada okuduğu değer).</li>" +
          "<li><span class='term'>MMC — Maksimum Malzeme Koşulu</span> — unsurun <strong>en çok malzeme</strong> içerdiği boyut: <strong>en büyük pim</strong> (⌀10,2) veya <strong>en küçük delik</strong> (⌀10,0).</li>" +
          "<li><span class='term'>LMC — Minimum Malzeme Koşulu</span> — <strong>en az malzemeli</strong> boyut: en küçük pim (⌀10,0) veya en büyük delik (⌀10,2).</li>" +
          "</ul>" +
          H.box("example", UI.example,
            "<p>Delik ⌀10,0–10,2 → MMC = <strong>⌀10,0</strong>, LMC = <strong>⌀10,2</strong>.<br>Pim ⌀9,8–9,9 → MMC = <strong>⌀9,9</strong>, LMC = <strong>⌀9,8</strong>.</p>" +
            "<p>Hafıza kancası: MMC parçanın <em>en ağır</em> hâli; LMC <em>en hafif</em> hâlidir.</p>") +
          "<p>MMC, <strong>montaj</strong> için kritik durumdur (en büyük pim en küçük delikle buluştuğunda geçme en sıkıdır); LMC ise <strong>mukavemet / et kalınlığı</strong> için kritiktir. Bunlar Ders 10'da tolerans modifiyelerine dönüşür.</p>"
      },
      {
        h: "Temel ölçüler ve tolerans bölgeleri",
        html:
          "<p><span class='term'>Temel ölçü (basic dimension)</span>, <strong>dikdörtgen kutu içinde</strong> gösterilen teorik olarak tam bir değerdir, örn. <code>|50|</code>. <strong>Kendi toleransı yoktur</strong> — mükemmel, ideal geometriyi (gerçek pozisyonu, gerçek profili veya gerçek açıyı) tanımlar. İzin verilen tüm sapma, ona atıfta bulunan geometrik toleranstan gelir.</p>" +
          "<p><span class='term'>Tolerans bölgesi</span>, gerçek unsurun (yüzey, eksen veya orta düzlem) içinde kalması gereken uzay bölgesidir. Her GD&T gösterimi bir tane oluşturur. Yaygın şekiller:</p>" +
          "<ul>" +
          "<li><strong>İki paralel çizgi</strong> (bir çizginin doğrusallığı) veya <strong>iki paralel düzlem</strong> arası (düzlemsellik, paralellik…)</li>" +
          "<li>Bir <strong>silindir</strong> (⌀ ile bir delik ekseninin pozisyonu, bir eksenin doğrusallığı)</li>" +
          "<li><strong>İki eşmerkezli çember</strong> (dairesellik) veya <strong>iki eş eksenli silindir</strong> arası (silindiriklik)</li>" +
          "<li><strong>Gerçek profilin iki ofsetli kopyası</strong> arası (profil toleransları)</li>" +
          "</ul>" +
          "<p>Unsurun tamamı bölgenin içindeyse parça geçer. “%90'ı içeride” diye bir şey yoktur — sonuç ikilidir: geçer/kalır.</p>"
      },
      {
        h: "Kural 1 — zarf prensibi",
        html:
          "<p>ASME Y14.5'in <span class='term'>1. Kuralı</span>: boyutlu bir unsurda <strong>boyut toleransı formu da kontrol eder</strong>. MMC'de unsur <em>mükemmel forma</em> sahip olmalıdır: parça, MMC boyutundaki hayali mükemmel zarfı asla ihlal edemez.</p>" +
          H.dia(D.rule1({ envelope: "MMC'de mükemmel form zarfı" }),
            "Kural 1: bir pim eğri veya şişkin olabilir, ama yine de MMC boyutundaki mükemmel bir halkadan geçmelidir. Pim MMC'den küçük imal edildikçe daha fazla form hatası kabul edilebilir olur.") +
          "<ul><li>Her yeri MMC'de olan bir pim <strong>mükemmel doğru</strong> olmalıdır.</li>" +
          "<li>MMC'den 0,1 küçük yapılırsa, 0,1'e kadar eğilebilir ve yine zarfa sığar.</li>" +
          "<li>Kural 1 <em>yalnızca</em> tek tek boyutlu unsurlara uygulanır — iki unsuru birbirine ilişkilendirmez.</li></ul>" +
          H.widget("rule1") +
          H.box("warn", UI.warning, "<p>ISO sisteminde Kural 1 varsayılan olarak <strong>uygulanmaz</strong> (ISO 8015: bağımsızlık prensibi). ISO resimlerinde zarf gereksinimi Ⓔ modifiyesi ile açıkça belirtilmelidir. Bu, en önemli ASME/ISO farkıdır.</p>")
      },
      {
        h: "Kural 2 — varsayılan RFS",
        html:
          "<p><span class='term'>2. Kural</span>: bir modifiye gösterilmedikçe her geometrik tolerans <strong>RFS — Regardless of Feature Size (unsur boyutundan bağımsız)</strong> uygulanır. Belirtilen tolerans sabittir; unsurun gerçek boyutuyla büyüyüp küçülmez. Boyuta bağlı (bonus) tolerans için Ⓜ veya Ⓛ açıkça eklenmelidir (Ders 10).</p>" +
          H.box("key", UI.keyPoints,
            "<ul><li><strong>FOS</strong> = boyutu ve karşılıklı noktaları olan unsur → ekseni veya orta düzlemi vardır.</li>" +
            "<li><strong>MMC</strong> = en çok malzeme (en büyük pim / en küçük delik); <strong>LMC</strong> = en az malzeme.</li>" +
            "<li><strong>Temel ölçüler</strong> (kutulu) tamdır; tolerans, geometrik gösterimden gelir.</li>" +
            "<li><strong>Kural 1</strong>: boyut toleransı formu kontrol eder (MMC'de mükemmel form) — yalnızca ASME.</li>" +
            "<li><strong>Kural 2</strong>: modifiye yoksa toleranslar RFS uygulanır.</li></ul>")
      }
    ],
    quiz: [
      { q: "Aşağıdakilerden hangisi boyutlu bir unsurdur (FOS)?", opts: ["Bir plakanın düz üst yüzeyi", "⌀12'lik bir delik", "Kozmetik bir pah kenarı", "Parçanın boya katmanı"], a: 1, ex: "Deliğin boyut ölçüsü ve karşılıklı noktaları vardır, dolayısıyla ondan bir eksen türetilebilir — düz yüzeyde ikisi de yoktur." },
      { q: "⌀8,0–8,4 olarak ölçülendirilen bir deliğin MMC boyutu nedir?", opts: ["⌀8,4", "⌀8,2", "⌀8,0", "⌀0,4"], a: 2, ex: "Delik (iç unsur) için en çok malzeme = en küçük delik = ⌀8,0." },
      { q: "Bir ölçünün etrafındaki dikdörtgen kutu ne anlama gelir?", opts: ["Ölçü yaklaşıktır", "Doğrudan toleransı olmayan temel (teorik olarak tam) bir ölçüdür", "Ölçü kritiktir ve %100 muayene gerekir", "Ölçü inç cinsindendir"], a: 1, ex: "Kutulu = temel: mükemmel geometriyi tanımlar; sapma payı ilişkili geometrik toleranstan gelir." },
      { q: "Kural 1 (zarf prensibi) ne gerektirir?", opts: ["Tüm parçaların CMM ile ölçülmesini", "MMC'deki boyutlu bir unsurun mükemmel forma sahip olmasını", "Her resimde üç datum olmasını", "Tüm toleransların LMC'de uygulanmasını"], a: 1, ex: "Kural 1: boyut sınırları formu da sınırlar — MMC'de form hatasına izin yoktur; unsur MMC'den uzaklaştıkça form hatası artabilir." },
      { q: "Bir pozisyon toleransında Ⓜ veya Ⓛ yok. Nasıl uygulanır?", opts: ["MMC'de", "LMC'de", "RFS — unsurun gerçek boyutundan bağımsız olarak belirtilen değer", "Geçersizdir"], a: 2, ex: "Kural 2: modifiye yoksa RFS — tolerans sabittir, bonus yoktur." },
      { q: "ISO GPS sisteminde Kural 1…", opts: ["ASME'deki gibi aynen uygulanır", "varsayılan olarak uygulanmaz — varsayılan bağımsızlık prensibidir (ISO 8015)", "yalnızca deliklere uygulanır", "ISO tarafından icat edilmiştir"], a: 1, ex: "ISO varsayılanı bağımsızlık prensibidir; zarf gereksinimi Ⓔ ile belirtilmelidir. ASME varsayılanı zarftır (Kural 1)." }
    ]
  });

  /* ============ DERS 3 ============ */
  LESSONS.push({
    id: "fcf",
    title: "Özellik Kontrol Çerçevesi",
    short: "GD&T'nin 'cümlesi': her geometrik toleransı taşıyan dikdörtgen çerçeveyi okuma ve yazma.",
    minutes: 12,
    sections: [
      {
        h: "Çerçevenin anatomisi",
        html:
          "<p>Her geometrik tolerans, bölmelere ayrılmış ve her zaman <strong>soldan sağa</strong> okunan bir dikdörtgen olan <span class='term'>özellik kontrol çerçevesine (feature control frame, FCF)</span> yazılır:</p>" +
          H.fcfDemo(
            F([[{ sym: "position" }], [{ sym: "diameter" }, "0.2", { mod: "M" }], ["A"], ["B"], ["C"]]),
            ["1 — geometrik karakteristik", "2 — bölge şekli, tolerans değeri, modifiye", "3, 4, 5 — datum referansları (birincil, ikincil, üçüncül)"]) +
          "<ol>" +
          "<li><strong>Geometrik karakteristik sembolü</strong> — 14 kontrolden hangisinin kullanıldığı (burada: pozisyon ⌖).</li>" +
          "<li><strong>Tolerans bölmesi</strong> — isteğe bağlı <strong>⌀</strong> (bölge silindiriktir), <strong>tolerans değeri</strong> (toplam bölge genişliği/çapı, burada 0,2 mm) ve isteğe bağlı <strong>modifiyeler</strong> (burada Ⓜ).</li>" +
          "<li><strong>Datum referansları</strong> — ölçüm düzeneğini tanımlayan en fazla üç harf, öncelik sırasıyla: birincil, ikincil, üçüncül.</li>" +
          "</ol>"
      },
      {
        h: "Çerçeveyi cümle olarak okumak",
        html:
          "<p>Herhangi bir FCF'yi şu şablonla cümleye çevirin:</p>" +
          H.box("key", "Şablon",
            "<p>“<strong>[Unsur]</strong>, <strong>[malzeme koşulunda]</strong>, datum <strong>[A, sonra B, sonra C]</strong>'ye göre konumlanmış/yönlenmiş, <strong>[değer]</strong> genişliğinde/çapında <strong>[bölge şekli]</strong> tolerans bölgesi içinde kalmalıdır.”</p>") +
          H.box("example", UI.example,
            H.fcfDemo(F([[{ sym: "position" }], [{ sym: "diameter" }, "0.2", { mod: "M" }], ["A"], ["B"], ["C"]])) +
            "<p>“Bu deliğin ekseni, delik <strong>MMC'deyken</strong> (boyut MMC'den uzaklaştıkça bonusla birlikte), datum <strong>A</strong> (birincil), <strong>B</strong> (ikincil) ve <strong>C</strong>'den (üçüncül) temel ölçülerle konumlanmış <strong>⌀0,2 silindirik</strong> bölge içinde kalmalıdır.”</p>") +
          H.box("example", UI.example,
            H.fcfDemo(F([[{ sym: "flatness" }], ["0.1"]])) +
            "<p>“Bu yüzey, <strong>0,1 aralıklı iki paralel düzlem</strong> arasında kalmalıdır.” Form toleransları asla datum kullanmaz — yüzey yalnızca kendisiyle karşılaştırılır.</p>")
      },
      {
        h: "Çerçevenin bağlandığı yer — ve neden her şeyi değiştirdiği",
        html:
          "<p>Aynı çerçeve, bağlandığı yere göre farklı anlamlara gelir:</p>" +
          H.tbl(["Bağlantı", "Neyi kontrol eder?"], [
            ["<strong>Yüzeye</strong> işaret eden ok veya uzatma çizgisine bağlı", "<strong>Yüzeyin kendisini</strong>"],
            ["Boyutlu bir unsurun <strong>boyut ölçüsüyle birlikte</strong> (⌀10 ±0,1'in altında/yanında)", "O FOS'tan türetilen <strong>ekseni veya orta düzlemi</strong>"]
          ]) +
          "<p>Örnek: pimin yan yüzeyine ok ile bağlanan doğrusallık <em>yüzey çizgi elemanlarını</em> kontrol eder; aynı doğrusallık pimin ⌀ ölçüsünün altına konursa <em>ekseni</em> kontrol eder — bu durumda tolerans bölmesinde ⌀ görünür ve Kural 1'in mükemmel form zarfı geçersiz kılınır.</p>" +
          H.box("warn", UI.warning, "<p>Yalnızca <strong>boyutlu unsura</strong> uygulanan toleranslar Ⓜ/Ⓛ modifiyesi kullanabilir; çünkü bonus tolerans ölçülebilir bir boyut gerektirir. Düz bir yüzey kontrolünde modifiye anlamsızdır.</p>")
      },
      {
        h: "Okuma alıştırması",
        html:
          "<p>Cevapları kapatıp şu çerçeveleri cümleye çevirin:</p>" +
          H.tbl(["Çerçeve", "Anlamı"], [
            [F([[{ sym: "perpendicularity" }], ["0.05"], ["A"]]), "Yüzey, datum A'ya tam 90° olan, 0,05 aralıklı iki paralel düzlem arasında kalmalıdır."],
            [F([[{ sym: "circularity" }], ["0.02"]]), "Her dairesel kesit, (radyal) 0,02 aralıklı iki eşmerkezli çember arasında kalmalıdır. Datum yok — yalnızca form."],
            [F([[{ sym: "profileSurface" }], ["0.4"], ["A"], ["B"]]), "Tüm yüzey, gerçek profil merkezli 0,4 genişliğinde, datum A ve B'ye göre konumlanmış bölge içinde kalmalıdır."],
            [F([[{ sym: "position" }], [{ sym: "diameter" }, "0.1"], ["A"], ["B"]]), "Eksen, A ve B'den gerçek pozisyonda ⌀0,1'lik silindirik bölge içinde kalmalıdır, RFS (modifiye yok)."]
          ]) +
          H.widget("fcfBuilder") +
          H.box("key", UI.keyPoints,
            "<ul><li>FCF soldan → sağa okunur: sembol, bölge (⌀? değer, modifiye?), öncelik sırasıyla datumlar.</li>" +
            "<li>Değerin önündeki ⌀ = silindirik bölge; ⌀ yoksa = iki paralel düzlem/çizgi.</li>" +
            "<li>Boyut ölçüsüne bağlı → eksen/orta düzlem kontrolü; yüzeye ok → yüzey kontrolü.</li>" +
            "<li>Çerçevedeki datum sırası ölçüm sırasıdır — A|B|C ≠ B|A|C.</li></ul>")
      }
    ],
    quiz: [
      { q: "Özellik kontrol çerçevesinde tolerans değerinin önündeki ⌀ ne anlama gelir?", opts: ["Unsur bir deliktir", "Tolerans bölgesi silindiriktir", "Tolerans inç cinsinden bir çap ölçümüdür", "Datum bir silindirdir"], a: 1, ex: "⌀, tolerans bölgesinin şeklini — silindir — tanımlar; unsurun türünü değil." },
      { q: "FCF'nin okunma sırası:", opts: ["Sağdan sola", "Yukarıdan aşağıya", "Soldan sağa: sembol → tolerans → datumlar", "Önce datumlar, sonra sembol"], a: 2, ex: "Her zaman: geometrik karakteristik, sonra bölge/tolerans/modifiyeler, sonra öncelik sırasıyla datum referansları." },
      { q: "Bir düzlemsellik FCF'sinde datum referansı var. Yanlış olan nedir?", opts: ["Hiçbir şey — düzlemsellik sık sık datum kullanır", "Form toleransları asla datum kullanmaz; çerçeve geçersizdir", "Datum en öne alınmalıdır", "Düzlemsellik tam iki datum gerektirir"], a: 1, ex: "Form kontrolleri (doğrusallık, düzlemsellik, dairesellik, silindiriklik) unsuru yalnızca kendisiyle karşılaştırır — datum referansına izin verilmez." },
      { q: "Bir doğrusallık çerçevesi pimin ⌀ boyut ölçüsüyle birlikte verilmiş (yüzeyine ok yok). Ne kontrol edilir?", opts: ["Pimin yüzey çizgi elemanları", "Pimin türetilmiş ekseni", "Pimin boyu", "Datum A"], a: 1, ex: "Boyut ölçüsüyle ilişkilendirilirse → kontrol türetilmiş eksene uygulanır (⌀ gösterilmişse bölge silindir olur)." },
      { q: "Ⓜ modifiyesi hangi durumlarda kullanılabilir?", opts: ["Her unsurdaki her toleransta", "Yalnızca boyutlu unsurlara uygulanan toleranslarda (ve boyutlu datum referanslarında)", "Yalnızca form toleranslarında", "Yalnızca profil toleranslarında"], a: 1, ex: "Bonus tolerans, ölçülebilir gerçek bir boyut gerektirir; Ⓜ/Ⓛ yalnızca boyutlu unsurlarda (veya boyutlu datum referanslarında) anlamlıdır." }
    ]
  });

  /* ============ DERS 4 ============ */
  LESSONS.push({
    id: "datums",
    title: "Datumlar ve Datum Referans Çerçevesi",
    short: "Parçanın ölçüm için nasıl 'tutulduğu': datum unsurları, 3-2-1 kuralı ve datum sırasının önemi.",
    minutes: 15,
    sections: [
      {
        h: "Datum ve datum unsuru",
        html:
          "<p>Asla karıştırılmaması gereken iki terim:</p>" +
          H.tbl(["Terim", "Anlamı"], [
            ["<span class='term'>Datum unsuru</span>", "Datum sembolüyle (dolu üçgen üzerinde kutulu harf) işaretlenen, <strong>parçadaki gerçek, kusurlu yüzey</strong>."],
            ["<span class='term'>Datum</span>", "O yüzeyden <em>türetilen</em>, <strong>teorik olarak mükemmel</strong> düzlem, eksen veya nokta — geometride var olur, pratikte hassas takımlarla (pleyt, ayna, pim) benzetilir."]
          ]) +
          "<p>Dalgalı bir alt yüzey A olarak işaretlendiğinde, datum A o dalgalı yüzeyin kendisi değil, üzerine oturduğu <strong>pleytin mükemmel düzlemidir</strong> — yüzeyin en yüksek üç noktasına temas eder. Datumu cisimleştiren takım (pleyt, mengene çenesi, malafa) <span class='term'>datum unsuru simülatörü</span> olarak adlandırılır.</p>"
      },
      {
        h: "Datum Referans Çerçevesi ve 3-2-1 kuralı",
        html:
          "<p>Tek bir datum, parçayı uzayda tam olarak sabitleyemez. Serbest bir rijit cismin <strong>altı serbestlik derecesi</strong> vardır: X, Y, Z boyunca öteleme ve her biri etrafında dönme. Tam bir <span class='term'>datum referans çerçevesi (DRF)</span> — birbirine dik üç düzlem — altısını da kilitler.</p>" +
          H.dia(D.drf(), "Bir datum referans çerçevesi: birincil düzlem A (3 temas noktası), ikincil B (2 nokta), üçüncül C (1 nokta) — klasik 3-2-1 bağlama düzeni.") +
          "<p>Düzlemsel datumlar için <span class='term'>3-2-1 kuralı</span>:</p>" +
          "<ul>" +
          "<li><strong>Birincil (A)</strong> — parça üzerine min. <strong>3 nokta</strong> ile oturur → 1 öteleme + 2 dönme kilitlenir.</li>" +
          "<li><strong>İkincil (B)</strong> — min. <strong>2 nokta</strong> ile dayanır → 1 öteleme + 1 dönme kilitlenir.</li>" +
          "<li><strong>Üçüncül (C)</strong> — min. <strong>1 nokta</strong> ile temas eder → son öteleme kilitlenir.</li>" +
          "</ul>" +
          "<p>Silindirik datum unsurları farklı çalışır: bir datum <strong>ekseni</strong> (delikten veya milden; ayna/malafa ile benzetilir) tek başına 2 öteleme + 2 dönmeyi kilitler; bu yüzden eksen birincil + alın ikincil, tornalanmış parçalar için çok yaygın bir DRF'dir.</p>" +
          H.widget("datum321")
      },
      {
        h: "Datum sırası neden önemli?",
        html:
          "<p>Özellik kontrol çerçevesindeki A | B | C sırası bir <strong>prosedürdür</strong>: önce A'ya tam oturt, sonra B'ye daya, sonra C'ye. Sırayı değiştirin; fiziksel düzenek — ve ölçüm sonucu — değişir.</p>" +
          H.box("example", UI.example,
            "<p>Hafif gönyesiz bir blok <strong>önce A sonra B</strong> ile ölçülürse: A'ya tam oturur, B'ye 2 noktadan değer. <strong>Önce B sonra A</strong> ile: B'ye tam oturur, A'ya artık yalnızca 2 noktadan değer — konumlanan her delik artık farklı yatmış bir parçadan ölçülür. Aynı parça, farklı kararlar. Tasarımcı, <strong>parçanın montajda gerçekte nasıl bağlandığını</strong> yansıtan sırayı seçmelidir.</p>") +
          H.box("key", "Datum unsuru seçimi",
            "<ul><li>Parçayı <strong>gerçek hayatta taşıyan / konumlandıran</strong> yüzeyleri seçin (cıvata yüzeyi, merkezleme delikleri).</li>" +
            "<li>Bağlama için <strong>büyük, kararlı ve erişilebilir</strong> yüzeyleri seçin.</li>" +
            "<li>Datum unsurlarına genellikle kendi sıkı form/yönelim kontrolleri verilir (örn. A'ya düzlemsellik, B'ye A'ya diklik) — böylece temel güvenilir olur.</li></ul>")
      },
      {
        h: "Datum hedefleri ve diğer incelikler",
        html:
          "<p>Döküm, dövme ve sac parçalarda yüzeylerin tamamı, kullanılamayacak kadar pürüzlü veya kararsızdır. <span class='term'>Datum hedefleri</span>, fikstürün temas etmesi gereken belirli <strong>noktaları, çizgileri veya küçük alanları</strong> belirtir (sembol: artı işaretli daire; A1, A2, A3… olarak etiketlenir) — kusurlu yüzeylerde bile düzeneği tekrarlanabilir kılar.</p>" +
          "<p>Pratikte şunlarla da karşılaşacaksınız:</p>" +
          "<ul>" +
          "<li><strong>Ⓜ ile referans verilen boyutlu datum unsuru (MMB)</strong> — fikstür sabit boyutlu bir mastar pimi/deliği hâline gelir ve parça mastar içinde biraz kayabilir: <em>datum kayması</em> (Ders 10 konusu).</li>" +
          "<li><strong>Ortak datum (A–B)</strong> — iki eş eksenli muyludan kurulan tek eksen; miller ve salgı için tipiktir (Ders 9).</li>" +
          "</ul>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Datum unsuru = gerçek yüzey; datum = simülatörle cisimleşen mükemmel türetilmiş geometri.</li>" +
            "<li>Rijit cismin 6 serbestlik derecesi vardır; 3 düzlemli DRF hepsini kilitler (3-2-1).</li>" +
            "<li>Datum öncelik sırası = fiziksel bağlama sırası; değiştirmek sonucu değiştirir.</li>" +
            "<li>Datum unsurlarını fonksiyonel montaj yüzeylerinden seçin.</li>" +
            "<li>Datum hedefleri pürüzlü parçaları (döküm) ölçülebilir ve tekrarlanabilir yapar.</li></ul>")
      }
    ],
    quiz: [
      { q: "Datum ile datum unsuru arasındaki fark nedir?", opts: ["Aynı şeydir", "Datum unsuru gerçek yüzeydir; datum ondan türetilen mükemmel düzlem/eksendir", "Datum parçadadır; datum unsuru fikstürdedir", "Datum unsuru yalnızca ISO resimlerinde kullanılır"], a: 1, ex: "Kusurlu fiziksel yüzey datum unsurudur; teorik mükemmel geometri (takımla benzetilen) datumdur." },
      { q: "Serbest bir rijit parçanın kaç serbestlik derecesi vardır?", opts: ["3", "4", "6", "9"], a: 2, ex: "Üç öteleme (X, Y, Z) ve üç dönme — tam bir DRF altısını da kilitler." },
      { q: "3-2-1 kuralında birincil datum unsuru fikstüre en az kaç noktayla temas eder?", opts: ["1 nokta", "2 nokta", "3 nokta", "6 nokta"], a: 2, ex: "3 nokta birincil düzlemi tanımlar; 2 nokta ikincili; 1 nokta üçüncülü." },
      { q: "Çerçeve |⌖|⌀0,2|A|B| şeklinde. Muayenede ne yapmalısınız?", opts: ["Önce B'ye, sonra A'ya temas ettirmek", "Parçayı önce A'ya tam oturtmak, sonra B ile kısıtlamak", "A ve B'yi aynı anda eşit kuvvetle kullanmak", "A iyiyse B'yi yok saymak"], a: 1, ex: "Datum sırası prosedürdür: birincil tam temasla önce oturur, sonra ikincil, sonra üçüncül." },
      { q: "Dökümlerde datum hedefleri neden kullanılır?", opts: ["Resim profesyonel görünsün diye", "Döküm yüzeylerinin tamamı çok pürüzlü/kararsız olduğu için — belirli noktalar/alanlar tekrarlanabilir bir düzenek sağlar", "Fikstür kullanmamak için", "Dökümlerin yüzeyi olmadığı için"], a: 1, ex: "Datum hedefleri fikstürün tam olarak hangi noktalara/çizgilere/alanlara temas edeceğini tanımlar; böylece her ölçüm aynı düzeneği kullanır." },
      { q: "En iyi datum unsurları hangi yüzeylerden seçilir?", opts: ["Parçadaki en küçük yüzeylerden", "Rastgele seçilen herhangi bir yüzeyden", "Parçayı montajda taşıyan ve konumlandıran fonksiyonel yüzeylerden", "Yalnızca boyalı yüzeylerden"], a: 2, ex: "Datumlar gerçek montajı yansıtmalıdır — böylece ölçüm, fonksiyonu simüle eder." }
    ]
  });

  /* ============ DERS 5 ============ */
  LESSONS.push({
    id: "form",
    title: "Form (şekil) toleransları",
    short: "Doğrusallık, düzlemsellik, dairesellik, silindiriklik — unsurun şeklini kendisine göre kontrol etmek, datum yok.",
    minutes: 15,
    sections: [
      {
        h: "Form toleranslarının ortak özellikleri",
        html:
          "<ul>" +
          "<li>Unsuru <strong>yalnızca kendi ideal şekliyle</strong> karşılaştırırlar — asla başka bir unsurla değil. Bu yüzden <strong>datum referansı kullanmazlar</strong>.</li>" +
          "<li><strong>Kural 1'i inceltirler</strong>: boyut toleransı formu zaten sınırlar; form toleransı bunu sıkılaştırır, dolayısıyla <strong>boyut toleransından küçük olmalıdır</strong> (Kural 1'i geçersiz kılabilen eksen doğrusallığı hariç).</li>" +
          "<li>Asla konum veya yönelim kontrol etmezler.</li>" +
          "</ul>"
      },
      {
        h: "Doğrusallık ⏤",
        html:
          H.fcfDemo(F([[{ sym: "straightness" }], ["0.05"]])) +
          "<p><strong>Yüzey doğrusallığı</strong> (yüzeye ok): gösterilen görünüşte yüzeyin her <em>çizgi elemanı</em>, 0,05 aralıklı iki paralel çizgi arasında kalmalıdır. Her çizgi bağımsız kontrol edilir.</p>" +
          H.dia(D.straightness(), "Yüzey doğrusallığı: yüzeyin bir çizgi elemanı 0,05 aralıklı iki paralel çizgi arasına sığmalıdır.") +
          "<p><strong>Eksen doğrusallığı</strong> (çerçeve ⌀ ölçüsünün altında, toleransta ⌀): <em>türetilmiş eksen</em> ⌀0,05'lik silindire sığmalıdır. Bu, <strong>Kural 1'i geçersiz kılan</strong> tek form kontrolüdür — parça MMC zarfını belirtilen miktar kadar ihlal edebilir ve Ⓜ uygulanabilir.</p>"
      },
      {
        h: "Düzlemsellik ⏥",
        html:
          H.fcfDemo(F([[{ sym: "flatness" }], ["0.1"]])) +
          "<p><strong>Yüzeyin tamamı</strong>, 0,1 aralıklı iki paralel düzlem arasında kalmalıdır. Düzlemler serbesttir — başka hiçbir şeye paralel değildirler; yüzeyi mümkün olan en dar şekilde sandviçlerler.</p>" +
          H.dia(D.flatness(), "Düzlemsellik: tüm yüzey, 0,1 aralıklı iki paralel düzlem arasına sığmalıdır. Bölgenin yönelimi serbesttir.") +
          H.widget("flatness") +
          "<p>Tipik kullanım: sızdırmazlık yüzeyleri (contalar), montaj yüzeyleri ve en önemlisi <strong>birincil datum unsurları</strong> — datum unsuru A'daki düzlemsellik, parçanın kararlı oturmasını garanti eder.</p>" +
          H.box("warn", UI.warning, "<p>Düzlemsellik, paralellik <strong>değildir</strong>: düzlemsellik diğer tüm unsurları yok sayar; paralellik (Ders 6) yüzeyin yönelimini bir datuma bağlar <em>ve</em> dolaylı olarak düzlemselliğini de kontrol eder.</p>")
      },
      {
        h: "Dairesellik ○ ve silindiriklik ⌭",
        html:
          H.fcfDemo(F([[{ sym: "circularity" }], ["0.02"]])) +
          "<p><strong>Dairesellik (yuvarlaklık)</strong>: unsur boyunca her kesitte yüzey, yarıçapları 0,02 farklı <strong>iki eşmerkezli çember</strong> arasında kalmalıdır. Her kesit ayrı değerlendirilir — dairesellik konikliği veya eğri ekseni <em>kontrol etmez</em>.</p>" +
          H.dia(D.circularity(), "Dairesellik: her kesit, (radyal) 0,08 aralıklı iki eşmerkezli çember arasına sığmalıdır.") +
          H.fcfDemo(F([[{ sym: "cylindricity" }], ["0.1"]])) +
          "<p><strong>Silindiriklik</strong>, daireselliğin 3B ağabeyidir: <strong>tüm yüzey aynı anda</strong>, radyal 0,1 aralıklı <strong>iki eş eksenli silindir</strong> arasında kalmalıdır. Tek gösterim; yuvarlaklığı, yüzeyin doğrusallığını <em>ve</em> konikliği birlikte sınırlar.</p>" +
          H.dia(D.cylindricity(), "Silindiriklik: tüm yüzey iki eş eksenli silindir arasında — yuvarlaklık + doğrusallık + koniklik birlikte kontrol edilir.") +
          H.box("warn", UI.warning, "<p>Dairesellik ve silindiriklik bölgeleri iki çember/silindir arasındaki <strong>radyal</strong> mesafedir — klasik sınav tuzağı: 0,02 çap farkı değildir.</p>")
      },
      {
        h: "Seçim ve ölçüm",
        html:
          H.tbl(["Kontrol", "Bölge", "Neyi kontrol eder?", "Tipik ölçüm"], [
            ["Doğrusallık (çizgi)", "2 paralel çizgi", "Her seferinde bir çizgi elemanı", "Cetvel + sentil; profilometre"],
            ["Doğrusallık (eksen)", "Silindir ⌀t", "Türetilmiş eksen", "V-yatakları + komparatör; CMM"],
            ["Düzlemsellik", "2 paralel düzlem", "Tüm yüzey", "Pleyt + komparatör taraması; CMM"],
            ["Dairesellik", "2 eşmerkezli çember", "Her kesit", "Yuvarlaklık ölçüm cihazı (döner tabla)"],
            ["Silindiriklik", "2 eş eksenli silindir", "Tüm silindirik yüzey", "Eksenel taramalı yuvarlaklık cihazı; CMM"]
          ]) +
          H.box("key", UI.keyPoints,
            "<ul><li>Form = şeklin kendisiyle kıyası: <strong>asla datum yok</strong>.</li>" +
            "<li>Form toleransları Kural 1'i inceltir; boyut toleransından sıkı olmalıdır.</li>" +
            "<li>Düzlemsellik bölgesi = iki paralel düzlem; dairesellik/silindiriklik bölgeleri radyaldir.</li>" +
            "<li>Dairesellik dilimleri, silindiriklik tüm yüzeyi kontrol eder (yuvarlaklık + doğrusallık + koniklik).</li>" +
            "<li>⌀ ile eksen doğrusallığı, Kural 1'in mükemmel form zarfını geçersiz kılar.</li></ul>")
      }
    ],
    quiz: [
      { q: "Form toleransları neden asla datum referansı kullanmaz?", opts: ["Resimde yer kazanmak için", "Unsuru yalnızca kendi ideal şekliyle karşılaştırdıkları için", "Datumlar her yerde isteğe bağlı olduğu için", "Aslında datum kullanırlar"], a: 1, ex: "Form kendine referanslıdır — yüzey, serbest bir ideale karşı kontrol edilir; başka bir unsura karşı değil." },
      { q: "Bir yüzeyin düzlemselliği 0,1. Ne doğru olmalıdır?", opts: ["Yüzey datum A'ya 0,1 içinde paralel olmalıdır", "Tüm yüzey, herhangi bir yönelimde, 0,1 aralıklı iki paralel düzlem arasına sığmalıdır", "Her nokta CAD modeline 0,1 içinde olmalıdır", "Yüzey pürüzlülüğü 0,1 µm altında olmalıdır"], a: 1, ex: "İki düzlem yüzeyle birlikte serbestçe yönlenir; düzlemsellik diğer unsurlara yönelim veya pürüzlülük hakkında bir şey söylemez." },
      { q: "Bir mil yüzeyinin yuvarlaklığını, doğrusallığını VE konikliğini tek gösterimle hangisi sınırlar?", opts: ["Dairesellik", "Doğrusallık", "Silindiriklik", "Diklik"], a: 2, ex: "Silindirikliğin iki eş eksenli silindir bölgesi tüm yüzeyi kısıtlar — yuvarlaklık, doğrusallık ve koniklik aynı anda." },
      { q: "0,02'lik dairesellik toleransı ne demektir?", opts: ["Her kesit, radyal 0,02 aralıklı iki eşmerkezli çember arasına sığar", "Çap, boy boyunca 0,02 değişebilir", "Tüm silindir iki eş eksenli silindir arasına sığar", "Eksen 0,02 içinde doğrudur"], a: 0, ex: "Dairesellik kesit başınadır ve bölgesi radyal mesafedir; konikliği veya ekseni kontrol etmez." },
      { q: "Hangi form kontrolü Kural 1'in MMC'de mükemmel form zarfını geçersiz kılabilir?", opts: ["Düzlemsellik", "Dairesellik", "Eksen doğrusallığı (çerçeve boyut ölçüsüyle verilmiş)", "Yüzey doğrusallığı"], a: 2, ex: "Eksen doğrusallığı, unsurun MMC zarfını belirtilen tolerans kadar ihlal etmesine açıkça izin verir — bunu yapan tek form kontrolü." },
      { q: "Boyut toleransı Kural 1 ile formu zaten 0,15'e sınırlayan bir yüzeye 0,2 düzlemsellik verilmiş. Bu düzlemsellik…", opts: ["iyi bir inceltmedir", "anlamsızdır — Kural 1'in zaten garanti ettiğinden gevşektir", "kanunen zorunludur", "Kural 1'den sıkıdır"], a: 1, ex: "Form toleransı, Kural 1'in zaten sağladığı kontrolden sıkı olmalıdır; aksi hâlde hiçbir şey eklemez." }
    ]
  });

  /* ============ DERS 6 ============ */
  LESSONS.push({
    id: "orientation",
    title: "Yönelim toleransları",
    short: "Diklik, paralellik, açısallık — bir datuma göre açıyı kontrol etmek (ama konumu değil).",
    minutes: 12,
    sections: [
      {
        h: "Yönelim toleransları ne yapar?",
        html:
          "<p>Yönelim kontrolleri, bir unsurun bir datuma göre <strong>açısını</strong> sabitler: 90° (diklik ⟂), 0° (paralellik ∥) veya başka herhangi bir temel açı (açısallık ∠). Üçü de:</p>" +
          "<ul>" +
          "<li><strong>En az bir datum gerektirir</strong> — açı, bir şeye <em>göre</em> ölçülmelidir.</li>" +
          "<li>Datuma tam temel açıda tutulan <strong>iki paralel düzlem</strong> (veya ⌀ ile bir eksen için <strong>silindir</strong>) bölgesi oluşturur.</li>" +
          "<li><strong>Konumu KONTROL ETMEZ.</strong> Bölge istediği yerde durabilir — yalnızca açısı sabittir. Konumu pozisyon veya profil kontrol eder.</li>" +
          "<li>Dolaylı olarak <strong>formu</strong> da kontrol eder: 0,1 aralıklı iki düzlem arasına hapsedilen yüzey otomatik olarak 0,1 içinde düzlemseldir.</li>" +
          "</ul>"
      },
      {
        h: "Diklik ⟂",
        html:
          H.fcfDemo(F([[{ sym: "perpendicularity" }], ["0.1"], ["A"]])) +
          "<p>Yüzey, datum A'ya <strong>tam 90°</strong> olan, 0,1 aralıklı iki paralel düzlem arasında kalmalıdır.</p>" +
          H.dia(D.perpendicularity(), "Diklik: duvar yüzeyi, datum A'ya tam 90° tutulan 0,1 genişliğindeki bölgeye sığmalıdır. Bölge sağa-sola kayabilir (konum kontrolü yok).") +
          "<p>⌀ ile bir delik eksenine uygulandığında — örn. " + F([[{ sym: "perpendicularity" }], [{ sym: "diameter" }, "0.05", { mod: "M" }], ["A"]]) + " — eksen, A'ya dik ⌀0,05'lik silindir içinde kalmalıdır. Bu, pim ve cıvata delikleri için klasik gösterimdir; genellikle fonksiyonel mastarla kontrol edilebilsin diye Ⓜ ile verilir.</p>" +
          H.widget("orientation")
      },
      {
        h: "Paralellik ∥",
        html:
          H.fcfDemo(F([[{ sym: "parallelism" }], ["0.2"], ["A"]])) +
          "<p>Yüzey, datum A'ya <strong>tam paralel</strong>, 0,2 aralıklı iki paralel düzlem arasında kalmalıdır. A'ya olan <em>mesafeyi</em> ± veya temel boyut ölçüsü belirler — paralellik yalnızca o boyut bölgesi içinde açıyı inceltir.</p>" +
          H.dia(D.parallelism(), "Paralellik: üst yüzey, datum A'ya paralel 0,2'lik bölgeye sığmalıdır. Yüksekliği bu gösterim değil, boyut ölçüsü kontrol eder.")
      },
      {
        h: "Açısallık ∠",
        html:
          H.fcfDemo(F([[{ sym: "angularity" }], ["0.15"], ["A"]])) +
          "<p>0°/90° dışındaki herhangi bir açı için: yüzey, datum A'ya <strong>temel açıda</strong> (örn. |30°|, kutulu, toleranssız) tutulan 0,15'lik bölge içinde kalmalıdır.</p>" +
          H.dia(D.angularity(), "Açısallık: datum A'ya temel 30° açıda, 0,15 genişliğinde bölge.") +
          H.box("warn", UI.warning,
            "<p>Açısallık, eski “30° ±1°” tarzının yerini alır. ± derece toleransı, tepe noktasından uzaklaştıkça genişleyen bir <strong>kama</strong> oluşturur; açısallık <strong>sabit genişlikte</strong> bölge oluşturur — fonksiyona çok daha uygundur. 2009'dan beri diklik ve paralellik resmî olarak açısallığın özel hâlleridir.</p>")
      },
      {
        h: "Özet",
        html:
          H.tbl(["Kontrol", "Temel açı", "Datum", "Formu da sınırlar mı?"], [
            ["Diklik ⟂", "90°", "Zorunlu", "Evet (bölgesi içinde)"],
            ["Paralellik ∥", "0°", "Zorunlu", "Evet"],
            ["Açısallık ∠", "Herhangi bir temel açı", "Zorunlu", "Evet"]
          ]) +
          H.box("key", UI.keyPoints,
            "<ul><li>Yönelim = datuma göre açı; datum zorunludur.</li>" +
            "<li>Bölge uzayda serbestçe durur — yönelim asla konum kontrol etmez.</li>" +
            "<li>Bir yüzeydeki yönelim toleransı, düzlemselliğini de otomatik olarak aynı değerle sınırlar.</li>" +
            "<li>0°/90° dışındaki açılar, kutulu temel açıyla açısallık kullanır.</li>" +
            "<li>Yönelim toleransı, incelttiği konum toleransından sıkı olmalıdır.</li></ul>")
      }
    ],
    quiz: [
      { q: "Tüm yönelim toleransları ne gerektirir?", opts: ["⌀ sembolü", "En az bir datum referansı", "Ⓜ modifiyesi", "Tam üç datum"], a: 1, ex: "Referanssız açı anlamsızdır — yönelim kontrolleri her zaman en az bir datum belirtir." },
      { q: "Bir duvara A'ya 0,1 diklik verilmiş. Neyi kontrol eder?", opts: ["Duvarın parça kenarına mesafesini", "Duvarın açısını (A'ya 90°) — ve dolaylı olarak düzlemselliğini — ama konumunu değil", "Yalnızca yüzey pürüzlülüğünü", "Duvarın boyutunu"], a: 1, ex: "Bölge A'ya 90°'de sabittir ama ötelemede serbesttir: yönelim, konum değil." },
      { q: "Bir yüzey datum A'nın 25 ±0,1 üstünde ölçülendirilmiş ve A'ya 0,05 paralellik taşıyor. Hangisi doğru?", opts: ["Yüzey 24,9–25,1 arasında herhangi bir yerde olabilir ve bu aralık içinde 0,05'te paralel/düzlemsel olmalıdır", "Yüzey tam 25,05 yükseklikte olmalıdır", "Paralellik boyut ölçüsünü geçersiz kılar", "Gösterim geçersizdir"], a: 0, ex: "Boyut, konum penceresini belirler; paralellik onun içinde açıyı (ve formu) inceltir." },
      { q: "Açısallık, ±1°'lik açı toleransından neden daha iyidir?", opts: ["İşlemesi daha ucuz olduğu için", "± derece bölgesi mesafeyle büyüyen bir kamadır; açısallık sabit genişlikte bölge verir", "Ölçüm gerektirmediği için", "Her yerde daha fazla sapmaya izin verdiği için"], a: 1, ex: "Sabit genişlikte bölge fonksiyonla örtüşür; kama, uzaktaki noktaların yakındakilerden çok daha fazla gezmesine izin verir." },
      { q: "Bir yüzeyin A'ya paralelliği 0,1. Olabilecek en büyük düzlemsellik hatası nedir?", opts: ["Sınırsız", "0,2", "0,1", "0,05"], a: 2, ex: "Yüzey 0,1 aralıklı iki düzlem arasına hapsolmuştur; 0,1'den daha az düzlemsel olamaz — yönelim, formu içerir." }
    ]
  });

  /* ============ DERS 7 ============ */
  LESSONS.push({
    id: "location",
    title: "Konum toleransları: Pozisyon",
    short: "GD&T'nin en çok kullanılan sembolü — gerçek pozisyon, silindirik bölgeler, delik desenleri (ve eski eşmerkezlilik & simetri).",
    minutes: 15,
    sections: [
      {
        h: "Gerçek pozisyon ve silindirik bölge",
        html:
          "<p><span class='term'>Pozisyon ⌖</span>, boyutlu bir unsurun <strong>ekseninin veya orta düzleminin</strong>, <span class='term'>gerçek pozisyonundan</span> — datumlardan <strong>temel ölçülerle</strong> tanımlanan teorik olarak tam konumundan — ne kadar sapabileceğini kontrol eder.</p>" +
          H.fcfDemo(F([[{ sym: "position" }], [{ sym: "diameter" }, "0.5"], ["A"], ["B"], ["C"]])) +
          H.dia(D.position(), "Pozisyon: temel ölçüler (kutulu 50, 40) gerçek pozisyonu belirler; deliğin gerçek ekseni (siyah nokta) onun merkezindeki ⌀0,5'lik silindirik bölgeye (mavi) düşmelidir.") +
          "<p>Okunuşu: “deliğin ekseni, A'ya dik, datum B ve C'den tam 50 ve 40 (temel) konumdaki ⌀0,5'lik silindirik bölge içinde kalmalıdır.” Bölgenin <strong>tüm kalınlık boyunca bir silindir</strong> olduğuna dikkat edin — pozisyon, eksenin yalnızca merkez noktasını değil <em>eğikliğini</em> de kontrol eder.</p>"
      },
      {
        h: "Temel ölçüler neden şart?",
        html:
          "<p>± konum ölçüleriyle toleranslar <strong>birikir</strong>: kenardan konumlanan 1. delikten konumlanan 2. delik her iki hatayı da toplar. Pozisyonda ise <em>her</em> delik, <em>aynı datum sisteminden</em> temel (tam) ölçülerle konumlanır — hiçbir şey birikmez. Her delik, DRF'ye göre sabitlenmiş kendi bağımsız silindirik bölgesini alır.</p>" +
          H.box("example", UI.example,
            "<p><code>4× ⌀6,1–6,3</code> yazısını izleyen " + F([[{ sym: "position" }], [{ sym: "diameter" }, "0.25", { mod: "M" }], ["A"], ["B"], ["C"]]) + " şu demektir: dört delik tek gereksinimi paylaşır — tam temel desen konumlarında duran dört ⌀0,25'lik bölge (artı bonus). Cıvata çemberleri ve konektör desenleri böyle toleranslanır.</p>")
      },
      {
        h: "Ⓜ ile pozisyon — montaj için tasarlandı",
        html:
          "<p>Pozisyon en güçlü hâline MMC modifiyesiyle kavuşur. " + F([[{ sym: "position" }], [{ sym: "diameter" }, "0.2", { mod: "M" }], ["A"], ["B"]]) + " şu demektir: delik MMC'deyken ⌀0,2'lik bölge; deliğin her fazladan büyüklüğü <strong>bonus tolerans</strong> ekler (ayrıntılar Ders 10'da). Mühendislik mantığı: daha büyük delik merkezden daha fazla kaçabilir ve cıvata yine geçer. Fonksiyonel olarak tam isabet — üstelik sabit bir <strong>geçer mastarın</strong> tüm gereksinimi tek dalışta doğrulamasına izin verir.</p>" +
          H.widget("position")
      },
      {
        h: "Eski kontroller: eşmerkezlilik ◎ ve simetri ⌯",
        html:
          "<p>Eski resimlerde iki konum sembolü daha görülür:</p>" +
          "<ul>" +
          "<li><strong>Eşmerkezlilik ◎</strong> — dönel bir yüzeyin tüm <em>medyan noktaları</em>, datum ekseni etrafındaki ⌀ bölge içinde kalmalıdır.</li>" +
          "<li><strong>Simetri ⌯</strong> — bir kanalın/tırnağın medyan noktaları, datum orta düzlemine ortalanmış iki düzlem arasında kalmalıdır.</li>" +
          "</ul>" +
          "<p>İkisinin de ölçümü meşhur derecede zordur (yüzeyi değil, <em>medyan noktaları</em> bulmanız gerekir) ve <strong>ASME Y14.5-2018'de kaldırılmışlardır</strong>. Modern pratik yerlerine <strong>pozisyon</strong> (veya salgı / profil) kullanır. Eski resimlerde tanıyabilmeniz yine de gerekir.</p>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Pozisyon, ekseni/orta düzlemi, temel ölçüler + datumların belirlediği <strong>gerçek pozisyona</strong> göre kontrol eder.</li>" +
            "<li>Çerçevede ⌀ → unsurun tüm derinliği boyunca silindirik bölge (eğikliği de kontrol eder).</li>" +
            "<li>Desenler (n×) tek gösterimi paylaşır; hepsi aynı DRF'den temel olduğu için bölgeler birikmez.</li>" +
            "<li>Pozisyon + Ⓜ = montaj garantisi + mastarla kontrol + bonus tolerans.</li>" +
            "<li>Eşmerkezlilik ve simetri ASME 2018'den çıktı — yerine pozisyon/salgı/profil kullanın.</li></ul>")
      }
    ],
    quiz: [
      { q: "Bir deliğin 'gerçek pozisyonunu' ne tanımlar?", opts: ["± ölçüleri", "Datum referans çerçevesinden temel (kutulu) ölçüler", "CNC programı", "Ölçülen en büyük çap"], a: 1, ex: "Gerçek pozisyon, datumlara göre temel ölçülerin verdiği teorik olarak tam konumdur." },
      { q: "|⌖|⌀0,5|A|B|C| gösteriminde ⌀0,5'lik bölgenin içinde ne kalmalıdır?", opts: ["Deliğin yüzeyi", "Deliğin türetilmiş ekseni, tüm derinlik boyunca", "Yalnızca deliğin üst kenarı", "Datum A"], a: 1, ex: "Delikteki pozisyon, türetilmiş ekseni kontrol eder — eksen çizgisinin tamamını; böylece eğiklik de sınırlanır." },
      { q: "Pozisyonla toleranslanan delik deseninde tolerans birikimi neden olmaz?", opts: ["Delikler birlikte delindiği için", "Her delik aynı datum sisteminden temel ölçülerle konumlandığı için", "Ⓜ tüm hatayı kaldırdığı için", "Birikim olur"], a: 1, ex: "Hiçbir delik başka bir delikten ölçülendirilmez; hepsi tek DRF'den tamdır, hatalar zincirlenmez." },
      { q: "ASME Y14.5-2018'de eşmerkezlilik ve simetriye ne oldu?", opts: ["Zorunlu hâle geldiler", "Kaldırıldılar; yerlerine pozisyon, salgı veya profil kullanılır", "Düzlemsellikle birleştirildiler", "Artık yalnızca Ⓛ ile uygulanırlar"], a: 1, ex: "Her iki medyan-nokta kontrolü de, ölçümü zor ve fonksiyonel getirisi az olduğu için 2018'de çıkarıldı." },
      { q: "Üretim için Ⓜ'li pozisyonun en büyük pratik avantajı…", opts: ["daha güzel resimler", "sabit fonksiyonel mastarla kontrol edilebilmesi ve bonus tolerans kazandırması", "datum ihtiyacını ortadan kaldırması", "delikleri daha yuvarlak yapması"], a: 1, ex: "MMC'li pozisyon montaj fonksiyonuyla örtüşür, delikler büyüdükçe bonus kazandırır ve basit bir geçer mastar anında doğrular." }
    ]
  });

  /* ============ DERS 8 ============ */
  LESSONS.push({
    id: "profile",
    title: "Profil toleransları",
    short: "Çizgi profili ve yüzey profili — GD&T'nin en güçlü kontrolleri, her şekil için.",
    minutes: 12,
    sections: [
      {
        h: "Fikir: gerçek şeklin etrafında bir tolerans bandı",
        html:
          "<p>Profil kontrolleri, gerçek yüzeyi <span class='term'>gerçek profille</span> — temel ölçülerin (veya CAD modelinin) tanımladığı tam şekille — karşılaştırır. Tolerans bir bant oluşturur: belirtilen genişlikte bir bölge içerecek şekilde ofsetlenmiş, <strong>gerçek profilin iki kopyası</strong>.</p>" +
          H.fcfDemo(F([[{ sym: "profileSurface" }], ["0.4"], ["A"], ["B"]])) +
          H.dia(D.profileSurface(), "Yüzey profili 0,4: gerçek yüzey (düz çizgi), gerçek profilden (orta noktalı-kesikli) ±0,2 ofsetlenmiş iki eğrinin oluşturduğu bandın içinde kalmalıdır.") +
          H.widget("profile"),
      },
      {
        h: "Çizgi ve yüzey",
        html:
          H.tbl(["", "Çizgi profili ⌒", "Yüzey profili ⌓"], [
            ["Bölge", "2B — iki ofsetli eğri, <strong>her kesitte</strong> bağımsız değerlendirilir", "3B — <strong>tüm yüzeyi aynı anda</strong> içeren iki ofsetli yüzey"],
            ["Benzetme", "Dairesellik : silindiriklik, ama her şekil için", "—"],
            ["Tipik kullanım", "Ekstrüzyonlar, geçişler, kanat profili kesitleri", "Döküm/kalıp yüzeyleri, karmaşık 3B geometri — modern varsayılan"]
          ]) +
          "<p>Varsayılan bölge <strong>çift taraflıdır (bilateral)</strong> — gerçek profilin iki yanına eşit (±t/2) dağılır. Ⓤ modifiyesi bölgeyi <strong>eşit olmayan dağılımlı</strong> yapar: " + F([[{ sym: "profileSurface" }], ["0.4", { mod: "U" }, "0.4"], ["A"]]) + " 0,4'ün tamamını gerçek profilin <em>dışına</em> koyar (Ⓤ'dan sonraki değer = “malzeme ekleme” yönündeki miktar).</p>"
      },
      {
        h: "Tek sembol, dört görev",
        html:
          "<p>Yüzey profili benzersizdir: datumlara bağlı olarak tek bir gösterim <strong>formu, yönelimi, konumu ve hatta boyutu</strong> kontrol edebilir:</p>" +
          H.tbl(["Gösterim", "Kontrol ettikleri"], [
            [F([[{ sym: "profileSurface" }], ["0.4"]]), "<strong>Yalnızca form</strong> (datum yok): şekil gerçek profile uymalıdır ama uzayda serbestçe durabilir."],
            [F([[{ sym: "profileSurface" }], ["0.4"], ["A"]]), "<strong>Form + A'ya yönelim</strong>."],
            [F([[{ sym: "profileSurface" }], ["0.4"], ["A"], ["B"], ["C"]]), "<strong>Form + yönelim + konum</strong>: bant DRF'de tamamen sabittir. Kapalı bir konturda <strong>boyutu</strong> da sınırlar."]
          ]) +
          "<p>Bu esneklik sayesinde, modern model tabanlı resimler genellikle <em>“AKSİ BELİRTİLMEDİKÇE: A|B|C'ye yüzey profili 0,5”</em> gibi genel bir not taşır — CAD modelinin ölçülendirilmemiş tüm yüzeylerini tek cümlede toleranslar.</p>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Profil = tam (temel/CAD) şeklin etrafında bant; <strong>her</strong> geometri için çalışır.</li>" +
            "<li>Çizgi profili = kesit başına (2B); yüzey profili = tüm yüzey (3B).</li>" +
            "<li>Varsayılan bölge çift taraflı ±t/2; Ⓤ tek tarafa kaydırır.</li>" +
            "<li>Neyi kontrol ettiğine datumlar karar verir: datum yok = form; +datumlar = yönelim ve konum da.</li>" +
            "<li>Yüzey profili; döküm, kalıp ve serbest form yüzeylerin standart aracıdır.</li></ul>")
      }
    ],
    quiz: [
      { q: "Bir profil tolerans bölgesi neden oluşur?", opts: ["Her zaman iki paralel düzlemden", "Belirtilen genişlikte bant oluşturacak şekilde ofsetlenmiş, gerçek profilin iki kopyasından", "Tek bir silindirden", "Kare bir kutudan"], a: 1, ex: "Bölge tam şekli (temel ölçüler / CAD) izler ve belirtilen toplam genişliğe ofsetlenir." },
      { q: "Çizgi profili bölgesi nasıl değerlendirilir?", opts: ["Tüm 3B yüzeyde aynı anda", "Her 2B kesitte bağımsız olarak", "Yalnızca iki uçta", "Yalnızca datum hedeflerinde"], a: 1, ex: "Çizgi profili kesit başına 2B'dir — silindirikliğin daireselliğe oranının her şekle genellenmiş hâli." },
      { q: "Datum referansı OLMAYAN yüzey profili 0,4 neyi kontrol eder?", opts: ["yalnızca formu — şekil serbestçe durabilir", "datum A'ya konumu", "yalnızca boyutu", "hiçbir şeyi; geçersizdir"], a: 0, ex: "Datum olmadan bant uzayda sabitlenmez: yalnızca şekil (form) kontrol edilir." },
      { q: "Profil gösteriminde Ⓤ modifiyesi ne yapar?", opts: ["Toleransı MMC'de uygular", "Bölgeyi gerçek profil etrafında eşit olmayan biçimde dağıtır (örn. tamamı dışarıya)", "Toleransı iki katına çıkarır", "Datum gereksinimlerini kaldırır"], a: 1, ex: "Ⓤ, bölgenin ne kadarının malzeme-ekleme yönünde olduğunu belirtir; onsuz varsayılan eşit ±t/2 dağılımdır." },
      { q: "Yüzey profili model tabanlı (CAD) resimlerde neden popülerdir?", opts: ["Ölçüm gerektirmediği için", "Tek bir genel gösterim, ölçülendirilmemiş tüm CAD yüzeylerini form, yönelim ve konum için toleranslayabildiği için", "CMM'lerin anladığı tek sembol olduğu için", "Datumların yerini aldığı için"], a: 1, ex: "A|B|C'ye genel bir profil notu, modelin her yüzeyini fonksiyonel ve eksiksiz bir gereksinimle kapsar." }
    ]
  });

  /* ============ DERS 9 ============ */
  LESSONS.push({
    id: "runout",
    title: "Salgı toleransları",
    short: "Dairesel ve toplam salgı — dönen parçaları komparatörle kontrol etmek.",
    minutes: 10,
    sections: [
      {
        h: "Dönen parça problemi",
        html:
          "<p>Miller, kasnaklar, dişliler ve dönen her şey için fonksiyonel soru şudur: <em>parça yatak ekseni etrafında dönerken bu yüzey ne kadar yalpalar?</em> Salgı tam olarak buna cevap verir ve tanımı ölçümün ta kendisidir: parçayı datum ekseni etrafında 360° döndürün ve yüzeydeki komparatörü okuyun. Okuma (FIM — tam ibre hareketi) toleransı aşmamalıdır.</p>" +
          H.dia(D.runout(), "Salgı ölçümü: parça datum muylusu A'dan tutulur (örn. V-yataklarında veya aynada), 360° döndürülür; kontrol edilen yüzeydeki komparatör okuması 0,05 içinde kalmalıdır.") +
          H.widget("runout"),
      },
      {
        h: "Dairesel ↗ ve toplam ⌰ salgı",
        html:
          H.fcfDemo(F([[{ sym: "circularRunout" }], ["0.05"], ["A"]])) +
          "<p><strong>Dairesel salgı</strong>: komparatör <strong>tek eksenel konumda</strong> durur; her dairesel eleman bağımsız kontrol edilir (konumlar arasında sıfırlanır). Her dilimde <em>ovallik + eksen kaçıklığı</em> bileşimini yakalar — ama boy boyunca konikliği yakalamaz.</p>" +
          H.fcfDemo(F([[{ sym: "totalRunout" }], ["0.05"], ["A"]])) +
          "<p><strong>Toplam salgı</strong>: parça dönerken komparatör <strong>yüzey boyunca da ilerler</strong> — tüm yüzey için tek okuma, sıfırlama yok. Ek olarak konikliği, doğrusallığı ve tüm yüzeyin profil hatasını da yakalar. Kesinlikle daha sıkı ve daha pahalıdır.</p>" +
          H.tbl(["", "Dairesel salgı", "Toplam salgı"], [
            ["Kontrol", "Her dairesel eleman ayrı ayrı", "Tüm yüzey tek taramada"],
            ["Yakaladıkları", "Dilim başına yuvarlaklık + eş eksenlilik", "Dairesel salgının yakaladığı her şey + koniklik, doğrusallık, profil"],
            ["Bileşimi (kabaca)", "dairesellik + eşmerkezlilik", "silindiriklik + eş eksenlilik"],
            ["Maliyet", "Ucuz, çok yaygın", "Daha sıkı; tüm yüzey önemliyse kullanın (yatak yuvaları, keçeler)"]
          ])
      },
      {
        h: "Kurallar ve kullanım",
        html:
          "<ul>" +
          "<li>Salgı <strong>her zaman bir datum ekseni gerektirir</strong> — genellikle bir muylu (A), sıklıkla iki muyludan ortak eksen (<strong>A–B</strong>); milin gerçekte iki yatakta oturuşuyla örtüşür.</li>" +
          "<li>Salgı <strong>yalnızca RFS</strong> uygulanır — asla Ⓜ/Ⓛ olmaz. Bir ibre okumasıdır; bonus diye bir şey yoktur.</li>" +
          "<li>Eksen <em>etrafındaki</em> yüzeylere ve eksene <strong>dik alınlara</strong> da uygulanabilir (flanş alnının eksenel yalpası).</li>" +
          "<li>Salgı <strong>bileşik</strong> bir kontroldür: daireselliği (ve eş eksenliliği) doğal olarak sınırlar; toplam salgı silindirikliği de sınırlar.</li>" +
          "</ul>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Salgı = datum ekseni etrafında 360° dönerken komparatör FIM okuması.</li>" +
            "<li>Dairesel = dilim başına; toplam = eksenel ilerlemeyle tüm yüzey.</li>" +
            "<li>Her zaman datum ekseni gerekir; her zaman RFS.</li>" +
            "<li>Dönen her şey için mükemmel: miller, keçe muyluları, fren diskleri, dişli taslakları.</li></ul>")
      }
    ],
    quiz: [
      { q: "Dairesel salgı temelde nasıl tanımlanır?", opts: ["CMM'de en iyi uydurma hesabı olarak", "Parça datum ekseni etrafında 360° dönerken komparatör okuması (FIM) olarak", "MMC ile LMC arasındaki fark olarak", "Bir yüzey pürüzlülüğü değeri olarak"], a: 1, ex: "Salgı, tanımı kelimenin tam anlamıyla klasik ölçüm yöntemi olan tek kontroldür." },
      { q: "Toplam salgı, dairesel salgının yakalayamadığı neyi kontrol eder?", opts: ["Tek dilimin yuvarlaklığını", "Tüm yüzey boyunca koniklik ve doğrusallığı", "Delik konumlarını", "Malzeme sertliğini"], a: 1, ex: "Sıfırlamasız eksenel ilerleme, toplam salgıyı konikliğe, doğrusallığa ve genel profile duyarlı yapar." },
      { q: "Salgı toleranslarıyla hangi modifiye kullanılabilir?", opts: ["Ⓜ", "Ⓛ", "Hiçbiri — salgı her zaman RFS'dir", "Ⓟ"], a: 2, ex: "Salgı bir ibre okumasıdır; bonus tolerans kavramları uygulanamaz — yalnızca RFS." },
      { q: "Resimde 'A–B' datumuna salgı gösterilmiş. A–B ne demektir?", opts: ["A veya B'den birini seç", "İki muylunun birlikte kurduğu ortak datum ekseni — iki yataktaki mil gibi", "Datum A eksi datum B", "A birincil, B ikincildir"], a: 1, ex: "A–B, iki unsurun aynı anda oluşturduğu tek eksendir — gerçek iki-yatak montajıyla örtüşür." },
      { q: "Mil dönerken flanş alnının yalpası için en iyi kontrol hangisidir?", opts: ["Düzlemsellik", "Doğrusallık", "Alına uygulanan salgı, datum = mil ekseni", "Simetri"], a: 2, ex: "Eksene dik bir alna uygulanan salgı, parça dönerken eksenel yalpayı doğrudan ölçer." }
    ]
  });

  /* ============ DERS 10 ============ */
  LESSONS.push({
    id: "modifiers",
    title: "Modifiyeler, bonus tolerans ve sanal koşul",
    short: "Ⓜ, Ⓛ, RFS, bonus tolerans hesabı, sanal koşul, uzatılmış bölgeler ve diğer ileri araçlar.",
    minutes: 18,
    sections: [
      {
        h: "Üç malzeme koşulu",
        html:
          H.tbl(["Modifiye", "Adı", "Tolerans uygulanır…", "Tipik amaç"], [
            ["<span class='mod'>M</span>", "MMC — Maksimum Malzeme Koşulu", "en çok malzemeli boyutta; unsur LMC'ye doğru uzaklaştıkça büyür", "<strong>Montaj / boşluk</strong> — deliklerden geçen cıvatalar, mastarlama"],
            ["<span class='mod'>L</span>", "LMC — Minimum Malzeme Koşulu", "en az malzemeli boyutta; unsur MMC'ye doğru uzaklaştıkça büyür", "<strong>Minimum et kalınlığı</strong>, minimum kenar mesafesi, döküm payı"],
            ["(yok)", "RFS — Unsur boyutundan bağımsız", "sabit — her zaman belirtilen değer", "Varsayılan (Kural 2); fonksiyon boyuta bağlı değilse (örn. balans, sıkı geçmeler)"]
          ])
      },
      {
        h: "Bonus tolerans — hesap",
        html:
          "<p>Ⓜ ile belirtilen tolerans MMC'de geçerlidir. Gerçek boyut MMC'den uzaklaştıkça, bu uzaklaşma toleransa eklenir:</p>" +
          H.box("key", "Formül", "<p><strong>Toplam tolerans = belirtilen tolerans + |gerçek eşleşme boyutu − MMC boyutu|</strong></p>") +
          H.box("example", UI.example,
            "<p>Delik ⌀10,0–10,3 ve " + F([[{ sym: "position" }], [{ sym: "diameter" }, "0.2", { mod: "M" }], ["A"], ["B"], ["C"]]) + "</p>" +
            H.dia(D.bonus({ size: "Gerçek delik ⌀", geo: "Belirtilen tol.", bonus: "Bonus", total: "Toplam pozisyon tol." }), "Bonus tolerans: delik MMC'nin (⌀10,0) ötesine her 0,1 büyüdüğünde 0,1 pozisyon toleransı eklenir.") +
            "<p>Bu neden meşrudur? Çünkü fonksiyon <em>cıvatanın geçmesidir</em>: daha büyük delik gerçekten daha fazla konum hatasını tolere eder. Bonus, sıfır fonksiyonel riskle bedava imalat toleransıdır.</p>") +
          H.widget("position") +
          H.box("warn", UI.warning, "<p>Bonus, <em>toleranslanan unsurun kendi boyutundan</em> gelir. Ⓜ ile referans verilen boyutlu bir datum unsuru farklı bir şey verir — <strong>datum kayması</strong> (parçanın tamamı mastar içinde oynayabilir) — bu, bonus gibi unsur başına eklenmez.</p>")
      },
      {
        h: "Sanal koşul ve fonksiyonel mastarlar",
        html:
          "<p><span class='term'>Sanal koşul (virtual condition, VC)</span>, bir unsurun boyutuyla geometrik toleransının birlikte ürettiği sabit, en kötü durum sınırıdır:</p>" +
          "<ul>" +
          "<li><strong>İç unsur (delik) Ⓜ'de:</strong> VC = MMC − tolerans <em>(en küçük etkin açıklık)</em></li>" +
          "<li><strong>Dış unsur (pim) Ⓜ'de:</strong> VC = MMC + tolerans <em>(en büyük etkin zarf)</em></li>" +
          "</ul>" +
          H.dia(D.virtualCondition({ mmcHole: "Delik MMC ⌀10,0, pozisyon ⌀0,2 Ⓜ", vc: "Sanal koşul ⌀9,8" }), "MMC'deki bir delik, pozisyon toleransının tamamı kadar kaydırıldığında ⌀9,8'lik garantili bir açıklık bırakır — sanal koşul.") +
          "<p>VC, <strong>eşleşen parçaları tasarlamak</strong> (⌀9,8'lik pim bu deliğe her zaman girer) ve <strong>fonksiyonel mastar yapmak</strong> için kullanılan sayıdır: gerçek pozisyonda, VC boyutunda bir mastar pimi; boyutu ve pozisyonu tek işlemde kontrol eder.</p>"
      },
      {
        h: "Karşılaşacağınız diğer modifiyeler",
        html:
          "<ul>" +
          "<li><strong>Ⓟ Uzatılmış tolerans bölgesi</strong> — vidalı/sıkı geçme delikler için: bölge, yüzeyin <em>üstüne</em>, eşleşen saplamanın temas yüksekliği boyunca uzatılır (örn. Ⓟ 15); çünkü önemli olan deliğin kendisi değil, <em>saplamanın</em> nereye gittiğidir.</li>" +
          "<li><strong>Ⓕ Serbest durum</strong> — esnek parçalar için (ince halkalar, contalar): tolerans bağlanmamış hâlde geçerlidir.</li>" +
          "<li><strong>Ⓣ Teğet düzlem</strong> — yalnızca tepe noktalarına temas eden düzlemin bölgede olması gerekir; altındaki dalgalanma yok sayılır (bağlama yüzeyleri için iyi).</li>" +
          "<li><strong>Ⓤ Eşit dağılmamış</strong> — profil bölgesi bir tarafa kaydırılır (Ders 8).</li>" +
          "<li><strong>Bileşik pozisyon çerçeveleri</strong> — iki satırlı pozisyon: üst satır <em>deseni</em> datumlara konumlar (gevşek); alt satır desen <em>içindeki</em> delikler arası mesafeyi kontrol eder (sıkı). Göreli aralığın mutlak desen konumundan önemli olduğu cıvata desenlerinin standart aracı.</li>" +
          "</ul>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Ⓜ = MMC'de tolerans + boyut uzaklaştıkça bonus → montaj ve mastarlama.</li>" +
            "<li>Ⓛ = LMC'de tolerans + MMC'ye doğru bonus → et kalınlığı koruması.</li>" +
            "<li>Bonus = |gerçek − MMC| (veya LMC); RFS = asla bonus yok.</li>" +
            "<li>VC delik = MMC − tol; VC pim = MMC + tol; VC eşleşen tasarımı ve mastarları yönetir.</li>" +
            "<li>Ⓟ bölgeyi eşleşen parçanın yüksekliğine taşır; bileşik çerçeveler desenleri toleranslar.</li></ul>")
      }
    ],
    quiz: [
      { q: "Delik ⌀6,0–6,2, pozisyon ⌀0,1 Ⓜ. Delik ⌀6,15 ölçülüyor. Toplam pozisyon toleransı?", opts: ["⌀0,10", "⌀0,15", "⌀0,25", "⌀0,35"], a: 2, ex: "Bonus = 6,15 − 6,0 (MMC) = 0,15; toplam = 0,1 + 0,15 = ⌀0,25." },
      { q: "Ⓛ (LMC) modifiyesi ne zaman doğru seçimdir?", opts: ["Cıvataların monte olması gerektiğinde", "Minimum et kalınlığını veya minimum kenar mesafesini korurken", "Hiçbir zaman — kullanımdan kalktı", "Yalnızca datum unsurlarında"], a: 1, ex: "LMC en az malzemeli durumu korur — ince etler, kenar mesafeleri, dökümde işleme payı." },
      { q: "Pozisyonu ⌀0,2 Ⓜ olan ⌀10,0–10,3 deliğin sanal koşulu…", opts: ["⌀10,5", "⌀10,2", "⌀9,8", "⌀10,0"], a: 2, ex: "İç unsur: VC = MMC − tol = 10,0 − 0,2 = ⌀9,8 — eşleşen pim için garantili açıklık." },
      { q: "Ⓟ uzatılmış tolerans bölgesinin amacı nedir?", opts: ["Yüzeyin üstünde toleransı ikiye katlamak", "Bölgeyi, eşleşen saplamanın/pimin gerçekte temas ettiği, deliğin üstündeki alanda kontrol etmek", "Resmi parçaya yansıtmak", "Datum C'nin yerini almak"], a: 1, ex: "Vidalı deliklerde eğik diş saplamayı eğer: bölgeyi temas yüksekliği üzerinde kontrol etmek, saplamanın karşı parçadan kaçmasını garantiler." },
      { q: "Bileşik pozisyon çerçevesinde alt satır tipik olarak neyi kontrol eder?", opts: ["Desenin datumlara konumunu", "Desen içindeki delikler arası ilişkileri (daha sıkı)", "Yüzey pürüzlülüğünü", "Datum A'nın malzeme koşulunu"], a: 1, ex: "Üst satır: desen konumu (gevşek, tüm datumlar). Alt satır: unsurdan unsura aralık/yönelim (sıkı, daha az datum)." },
      { q: "Ⓜ/Ⓛ olmayan bir tolerans ve boyut aralığının herhangi bir yerinde imal edilen delik…", opts: ["boyut sapması kadar bonus alır", "tam olarak belirtilen toleransı alır (RFS), bonus yok", "LMC'de çift tolerans alır", "hiç tolerans almaz"], a: 1, ex: "Kural 2: varsayılan RFS — tolerans gerçek boyutla asla değişmez." }
    ]
  });

  /* ============ DERS 11 ============ */
  LESSONS.push({
    id: "reading",
    title: "Gerçek bir teknik resmi adım adım okumak",
    short: "Herhangi bir GD&T resmini çözmek için pratik bir yöntem, muayene temelleri ve kaçınılması gereken klasik hatalar.",
    minutes: 15,
    sections: [
      {
        h: "Beş adımlı okuma yöntemi",
        html:
          "<ol>" +
          "<li><strong>Önce datumları bulun.</strong> A, B, C bayraklarını yerleştirin. Sorun: birincil hangisi? Sıra, parçanın makinede/montajda bağlanışıyla örtüşüyor mu?</li>" +
          "<li><strong>Antet ve genel notları okuyun.</strong> Standart sürümü (ASME Y14.5-2009? 2018?), varsayılan toleranslar, genel profil notları, birimler.</li>" +
          "<li><strong>Boyutlu unsurları gezin.</strong> Her delik/pim/kanal için: boyut sınırları → MMC/LMC → boyut ölçüsüne bağlı FCF'ler (eksen kontrolleri, modifiyeler).</li>" +
          "<li><strong>Yüzeyleri gezin.</strong> Profil, düzlemsellik, yönelim gösterimleri; hangi yüzeyler datum unsuru ve <em>onlar</em> ne kadar sıkı kontrol ediliyor?</li>" +
          "<li><strong>Her FCF'yi cümleye çevirin</strong> (Ders 3 şablonu) ve sorun: bunu bağlayıp ölçebilir miydim? Düzeneği hayal edemiyorsanız, okumayı bitirmemişsinizdir.</li>" +
          "</ol>"
      },
      {
        h: "Çözümlü örnek",
        html:
          H.dia(D.drawing(), "Bir plaka: alt yüzey = A, sol kenar = B; datumlardan temel 30/80 konumunda iki adet ⌀10,0–10,2 delik.") +
          "<p>Desene " + F([[{ sym: "position" }], [{ sym: "diameter" }, "0.25", { mod: "M" }], ["A"], ["B"]]) + " verildiğini, datum unsuru A'nın " + F([[{ sym: "flatness" }], ["0.05"]]) + ", datum unsuru B'nin " + F([[{ sym: "perpendicularity" }], ["0.1"], ["A"]]) + " taşıdığını varsayalım. Hikâyenin tamamı:</p>" +
          "<ul>" +
          "<li>Parçayı A'ya oturtun (0,05 içinde düzlemsel — güvenilir bir temel), B'ye dayayın (B'nin kendisi A'ya 0,1 içinde dik).</li>" +
          "<li>Her delik ekseni, tam temel konumlarda ⌀0,25'lik silindirde (delikler ⌀10,2'ye büyüdükçe +0,2'ye kadar bonusla) kalmalıdır.</li>" +
          "<li>Garantili montaj: aynı gerçek pozisyonlardaki, VC = 10,0 − 0,25 = <strong>⌀9,75</strong>'e kadar eşleşen pimler her zaman girer.</li>" +
          "</ul>"
      },
      {
        h: "GD&T nasıl ölçülür?",
        html:
          H.tbl(["Araç", "Ne yapar?", "Tipik kontroller"], [
            ["Pleyt + mihengir / komparatör", "Elle datum benzetimi ve taramalar", "Düzlemsellik, paralellik, salgı (V-yataklarıyla)"],
            ["CMM (koordinat ölçüm makinesi)", "Noktalar problar; yazılım datumları oturtur ve bölgeleri matematiksel değerlendirir", "Her şey — pozisyon, profil, yönelim"],
            ["Fonksiyonel (nitelik) mastar", "Sanal koşulun fiziksel cisimleşmesi; geçer/geçmez", "Ⓜ'de pozisyon, Ⓜ'de diklik"],
            ["Yuvarlaklık ölçüm cihazı", "Hassas döner tabla + prob", "Dairesellik, silindiriklik, salgı"],
            ["Optik/lazer tarayıcı", "CAD'e karşı yoğun nokta bulutu", "Karmaşık yüzeylerin profili"]
          ]) +
          "<p>Kilit içgörü: FCF gereksinimi <em>araçtan bağımsız</em> tanımlar. CMM, mastar ve pleyt düzeneği aynı sonuca varmak zorundadır; çünkü hepsi aynı matematiksel tanımı uygular.</p>"
      },
      {
        h: "Klasik hatalar",
        html:
          "<ul>" +
          "<li><strong>Datumsuz yönelim/pozisyon</strong> — datum referansı olmayan bir pozisyon veya diklik gösterimi anlamsızdır.</li>" +
          "<li><strong>Yanlış unsurlarda datum</strong> — fonksiyonel bağlamayla örtüşmeyen datumlar, ölçümde iyi çıkıp montajda kötü olan parçalar üretir.</li>" +
          "<li><strong>Delikleri temel yerine ± ile konumlamak</strong> — aynı unsurda koordinat ve geometrik konumu karıştırmak çelişki yaratır.</li>" +
          "<li><strong>Boyut toleransından gevşek form toleransı</strong> — hiçbir şey katmaz (Kural 1 işi zaten yapmıştır).</li>" +
          "<li><strong>Boyutsuz unsurlarda Ⓜ</strong> — malzeme modifiyesi ölçülebilir bir boyut ister.</li>" +
          "<li><strong>Aşırı toleranslama</strong> — daha sıkı, daha iyi değildir: her gereksiz sıfır maliyeti katlar. <em>Fonksiyonun ihtiyacını</em>, fonksiyonun izin verdiği kadar gevşek toleranslayın.</li>" +
          "</ul>" +
          H.box("key", "Bundan sonrası",
            "<ul><li>Standardı edinin: <strong>ASME Y14.5-2018</strong> (ISO ortamları için ISO 1101).</li>" +
            "<li>Kendi ürünlerinizin gerçek resimlerinde pratik yapın — her FCF'yi cümleye çevirin.</li>" +
            "<li>Ölçümü öğrenin: bir CMM programcısının datum kuruşunu izleyin; muayenenin neyi görüp göremediğine dair sezgi geliştirin.</li>" +
            "<li>Tolerans zinciri (stack-up) analizini çalışın — GD&T'den sonraki doğal beceri.</li></ul>")
      }
    ],
    quiz: [
      { q: "GD&T'li bir resmi okurken İLK ne belirlenmelidir?", opts: ["Antet yazı tipi", "Datum unsurları ve öncelik sıraları", "En küçük tolerans", "Parça numarası"], a: 1, ex: "Datumlar, diğer her şeyin ölçüldüğü koordinat sistemini tanımlar — önce onları bulun." },
      { q: "Bir delikteki pozisyon gösteriminde datum referansı yok. Bu…", opts: ["delikler için normaldir", "hatadır — pozisyon, gerçek pozisyonu tanımlamak için datum gerektirir", "delik küçükse izinlidir", "yalnızca ISO'ya özgü bir kuraldır"], a: 1, ex: "Datum olmadan ölçüm yapılacak bir gerçek pozisyon yoktur (datumsuz pozisyon yalnızca nadir eş eksenli desen durumlarında vardır — sıradan resimlerde hata sayın)." },
      { q: "İki ⌀10,0–10,2 delik, A|B'ye pozisyon ⌀0,25 Ⓜ taşıyor. Aynı gerçek pozisyonlarda her zaman giren en büyük eşleşen pim hangisidir?", opts: ["⌀10,2", "⌀10,0", "⌀9,75", "⌀9,5"], a: 2, ex: "VC = MMC − tol = 10,0 − 0,25 = ⌀9,75 — sanal koşul, eşleşen tasarımın sayısıdır." },
      { q: "Ⓜ'li pozisyon kontrolünde CMM ile fonksiyonel mastar neden aynı karara varmalıdır?", opts: ["Asla aynı karara varmazlar", "İkisi de FCF'nin tanımladığı aynı matematiksel gereksinimi uygular", "CMM mastarla kalibre edildiği için", "Yalnızca mastar yasal olarak geçerlidir"], a: 1, ex: "FCF kabul sınırını tanımlar; her doğru ölçüm yöntemi aynı sınırı değerlendirir." },
      { q: "Tolerans sıkılığı hakkında hangisi DOĞRUDUR?", opts: ["Her zaman makinelerinizin başarabildiği en sıkı toleransı verin", "Toleranslar fonksiyonun izin verdiği kadar gevşek olmalıdır — gereksiz sıkılık yalnızca maliyeti katlar", "Tüm unsurlar tek tolerans değerini paylaşmalıdır", "GD&T toleransları her zaman ± toleranslardan sıkıdır"], a: 1, ex: "Hedef, minimum maliyetle fonksiyonel parçadır — prosesin yeteneğini değil, fonksiyonu toleranslayın." }
    ]
  });

  /* ============ DERS 12 ============ */
  LESSONS.push({
    id: "design",
    title: "Tasarımcı için GD&T: fonksiyondan bitmiş resme",
    short: "Bir tasarımcı datumları (ve dolayısıyla fikstürü) nasıl seçer, parçayı konumlanabilir nasıl tasarlar ve tolerans değerlerini bağlantı elemanı formülleri, stack-up ve proses kabiliyetiyle nasıl hesaplar.",
    minutes: 20,
    sections: [
      {
        h: "Toleranslama parçada değil, montajda başlar",
        html:
          "<p>Şimdiye kadarki her şey size GD&T'yi <em>okumayı</em> öğretti. Bu ders <em>yazmakla</em> ilgili — bir tasarımcının fonksiyonel bir gereksinimi resim üzerindeki sembollere dönüştürürken izlediği iş akışı. Sıralama son derece önemlidir:</p>" +
          "<ol>" +
          "<li><strong>Fonksiyonu anlayın.</strong> Parçayı değil, montajı açın. Bu parça neye dokunuyor? Ne ile eşleşiyor, sızdırmazlık yapıyor, kayıyor veya hizalanıyor? Montajda komşularına hangi sırayla temas ediyor?</li>" +
          "<li><strong>Datum unsurlarını seçin.</strong> Bunlar parçanın montajda <em>konumlandırıldığı</em> yüzeylerdir — bu da onları otomatik olarak fikstürün ve ölçüm kurulumunun tutacağı yüzeyler yapar.</li>" +
          "<li><strong>Datum unsurlarının kendilerini nitelendirin.</strong> Bir datum ancak geldiği yüzey kadar güvenilirdir: A'ya düzlemsellik, B'ye A'ya diklik verin, vb.</li>" +
          "<li><strong>Geri kalan her şeyi datumlara bağlayın.</strong> Delikler ve pimler için pozisyon, konturlar için profil, fonksiyonun gerektirdiği yerde yönelim.</li>" +
          "<li><strong>Değerleri hesaplayın.</strong> Bağlantı elemanı formülleri ve stack-up'lar fonksiyonun gerektirdiği sayıyı verir; proses kabiliyeti ise imalatın bu değeri makul maliyetle tutturup tutturamayacağını söyler.</li>" +
          "</ol>" +
          H.box("key", UI.definition,
            "<p><strong>Fonksiyonel boyutlandırma:</strong> toleranslar parçanın <em>yapması gerekenden</em> — takılmak, sızdırmamak, hizalanmak — türetilir; asla atölyenin tesadüfen başardığından değil, asla eski bir resimden kopyalanarak değil. Resim gereksinimi belirtir; proses bu gereksinimi karşılamak için seçilir.</p>")
      },
      {
        h: "Datum seçmek = fikstürü tasarlamak",
        html:
          "<p>Datum unsurlarını ve sıralarını seçtiğinizde aynı anda üç şeyi tasarlıyorsunuz: resmin <strong>koordinat sistemini</strong>, <strong>ölçüm kurulumunu</strong> ve <strong>imalat fikstürünü</strong>. 3-2-1 kuralı (Ders 4) doğrudan fikstür donanımına karşılık gelir:</p>" +
          H.tbl(["Öncelik", "Temas (3-2-1)", "Fikstür elemanı", "Şöyle bir unsur seçin…"], [
            ["Birincil (A)", "3 nokta — parçayı oturtur", "3 oturma pedi / düz bir ayna yüzeyi", "eş parçayla <strong>en büyük, en kararlı</strong> temasa sahip olan; genellikle montaj yüzeyi"],
            ["İkincil (B)", "2 nokta — yönlendirir", "2 dayama pimi / bir kızak", "parçayı yönlendiren veya hizalayan: uzun bir kenar, pim deliği çifti, konumlandırma deliği"],
            ["Üçüncül (C)", "1 nokta — durdurur", "1 dayama pimi", "son serbestlik derecesini alan: kısa bir kenar veya ikinci bir delik"]
          ]) +
          H.dia(D.drf(), "Datum referans çerçevesi: birincil oturtur (3 nokta), ikincil yönlendirir (2), üçüncül durdurur (1) — tam olarak bir fikstürün yaptığı iş.") +
          "<p>İyi bir datum unsuru için kontrol listesi: montajda <strong>önce eşleşir</strong>, tekrarlanabilir konumlama için yeterince <strong>büyük ve kararlıdır</strong>, fikstür, prob ve takım tezgâhı tarafından <strong>erişilebilirdir</strong> ve sonraki operasyonların referans alabilmesi için <strong>erken işlenir</strong>.</p>" +
          H.widget("datumPick") +
          H.box("warn", UI.warning,
            "<p>Klasik tasarım hatası: datumların fonksiyona göre değil, resim kolaylığına göre seçilmesi (elverişli bir kenar, kozmetik bir yüzey). Böyle parçalar <em>ölçümde</em> iyi çıkar, <em>montajda</em> kötü davranır — ölçüm koordinat sistemi, montajın kullandığı sistem değildir. Datum unsurlarınız montaj unsurları değilse, başka bir parçayı toleranslamışsınız demektir.</p>")
      },
      {
        h: "Parçayı konumlanabilecek şekilde tasarlayın",
        html:
          "<p>İyi datumlar sonradan <em>bulunmaz</em>, baştan <em>tasarlanır</em>. Parçayı şekillendirirken:</p>" +
          "<ul>" +
          "<li><strong>Oturacağı bir şey verin.</strong> Doğal bir yüzey yeterince büyük ve kararlı değilse işlenmiş pedler, çıkıntılar (boss) veya bir flanş ekleyin — üç küçük eş düzlemli ped, özellikle döküm parçalarda tek büyük çarpık yüzeyden çoğu zaman daha iyidir.</li>" +
          "<li><strong>Hizalanacağı bir şey verin.</strong> Bir çift pim/takımlama deliği mükemmel bir B–C ikilisi oluşturur ve her operasyonun, fikstürün ve CMM programının parçayı aynı şekilde konumlamasını sağlar.</li>" +
          "<li><strong>Datum unsurlarını nitelendirin.</strong> DRF önce A, sonra B, sonra C diye kurulur; her birini bir öncekine göre kontrol edin:</li>" +
          "</ul>" +
          H.fcfDemo(F([[{ sym: "flatness" }], ["0.05"]]), ["datum unsuru A üzerinde — güvenilir bir temel"]) +
          H.fcfDemo(F([[{ sym: "perpendicularity" }], ["0.1"], ["A"]]), ["datum unsuru B üzerinde — temele dik"]) +
          H.fcfDemo(F([[{ sym: "perpendicularity" }], ["0.1"], ["A"], ["B"]]), ["datum unsuru C üzerinde"]) +
          "<ul>" +
          "<li><strong>Her fonksiyonel grup için tek DRF.</strong> <em>Birlikte</em> çalışması gereken her unsur (bir cıvata deseni ve merkezlediği delik) <em>aynı</em> datumlara aynı sırayla referans vermelidir — ilişkili unsurlar arasında DRF değiştirmek, fikstürleme hatalarını sessizce stack'e ekler.</li>" +
          "<li><strong>Döküm ve enjeksiyon parçaları:</strong> ham parça üzerinde geçici <em>takımlama datumları</em> (hedefler) tanımlayın, gerçek datum unsurlarını önce onlardan işleyin, geri kalan her şeyi işlenmiş datumlardan ölçülendirin.</li>" +
          "</ul>"
      },
      {
        h: "Değeri belirlemek: bağlantı elemanı formülleri",
        html:
          "<p>Cıvatalı bağlantılarda — en yaygın konumlama problemi — pozisyon toleransı tahmin edilmez; delik ile bağlantı elemanı arasındaki MMC boşluğundan <strong>hesaplanır</strong>:</p>" +
          H.tbl(["Bağlantı tipi", "Nedir", "Formül (parça başına)"], [
            ["<strong>Yüzer bağlantı (floating)</strong>", "Cıvata + somun <em>her iki</em> parçadaki boşluk deliklerinden geçer — cıvata ikisinde de 'yüzebilir'", "<code>T = H − F</code>"],
            ["<strong>Sabit bağlantı (fixed)</strong>", "Eleman parçalardan <em>birine</em> vidalanır veya çakılır — boşluk yalnızca diğer parçadadır", "<code>T = (H − F) / 2</code>"]
          ]) +
          "<p>Burada <strong>H</strong> = delik MMC'si (en küçük delik), <strong>F</strong> = elemanın MMC'si (en büyük eleman). Sonucu daima <strong>Ⓜ</strong> ile belirtin — formüller montajı tam olarak sanal durum sınırında garanti eder ve bonus tolerans büyüyen delikleri ödüllendirmeye devam eder.</p>" +
          H.box("example", UI.example,
            "<p>İki plakada ⌀6,6–6,75 boşluk deliklerinden (H = ⌀6,6) geçen M6 cıvatalar (F = ⌀6,0):</p>" +
            "<ul><li><strong>Yüzer</strong> (arkada somun): T = 6,6 − 6,0 = her plakanın deseninde <strong>⌀0,6 Ⓜ</strong>.</li>" +
            "<li><strong>Sabit</strong> (ikinci plakaya vidalı): T = (6,6 − 6,0)/2 = her parçada <strong>⌀0,3 Ⓜ</strong>.</li></ul>") +
          H.widget("fastener") +
          H.box("warn", UI.warning,
            "<p><strong>Sabit</strong> bağlantıda, dişli deliklere eş plakanın kalınlığı boyunca yansıtılan bir <strong>yansıtılmış tolerans bölgesi Ⓟ</strong> (Ders 10) ekleyin — yoksa toleransta ama eğik bir delik, dışarı taşan cıvatanın boşluk deliğini ıskalamasına yine de neden olabilir.</p>")
      },
      {
        h: "Stack-up, proses kabiliyeti ve maliyet",
        html:
          "<p><strong>Tolerans stack-up'ı</strong> şu soruyu yanıtlar: “her unsur yasal en kötü sınırındayken montaj yine de çalışır mı?” En kötü durum yöntemi, katkıları bir zincir boyunca toplar: boşluk = nominal boşluk − Σ(tolerans katkıları). Sonuç negatifse ya gereksinimi gevşetin (daha büyük boşluk delikleri → formüllerden daha büyük T) ya da katkıları sıkın — en ucuz olanlardan başlayarak.</p>" +
          "<p>Sonra her değeri proseslerin gerçekte tutabildiğiyle karşılaştırın:</p>" +
          H.tbl(["Proses", "Tipik kabiliyet (kılavuz değerler)"], [
            ["Delme (matkap)", "pozisyon ⌀0,2–0,5; boyut H12"],
            ["Raybalama / bara işleme", "boyut H7–H9; pozisyon ⌀0,05–0,15 (iyi fikstürlemeyle)"],
            ["Frezeleme", "düzlemsellik 0,02–0,1 / 100 mm; pozisyon ⌀0,1–0,25"],
            ["Tornalama", "dairesellik 0,005–0,03; salgı 0,01–0,05"],
            ["Taşlama", "düzlemsellik/paralellik 0,002–0,01"],
            ["Enjeksiyon kalıplama", "profil 0,1–0,3 (boyuta bağlı)"],
            ["Sac delme/bükme", "pozisyon ⌀0,1–0,3; bükme sonrası profil 0,2–0,5"]
          ]) +
          "<p>Ve maliyet eğrisini unutmayın: <strong>bir toleransı yarıya indirmek, onu başarmanın maliyetini kabaca ikiye katlar</strong> — daha sıkı bir değer prosesi sessizce değiştirebilir (matkap → rayba → hassas bara), operasyon ekler, ölçüm süresini uzatır ve ıskartayı artırır. Tasarımcının hedefi <em>fonksiyonu hâlâ garanti eden en gevşek toleranstır</em>.</p>" +
          H.box("key", UI.keyPoints,
            "<ul><li>Cıvatalı bağlantıların pozisyon değerleri <strong>T = H − F</strong> (yüzer) ve <strong>T = (H − F)/2</strong> (sabit) formüllerinden gelir, Ⓜ ile uygulanır.</li>" +
            "<li>Sabit bağlantılar: kavrama yüksekliği boyunca Ⓟ ekleyin.</li>" +
            "<li>En kötü durum stack-up'ıyla doğrulayın; negatif boşlukları en ucuz katkıda düzeltin.</li>" +
            "<li>Değerleri proses kabiliyetine karşı kontrol edin — prosesin tutamadığı tolerans bir gereksinim değil, ıskarta üreticisidir.</li></ul>")
      },
      {
        h: "Vaka çalışması + tasarımcının kontrol listesi",
        html:
          H.dia(D.drawing(), "Ders 11'deki braket — bu kez tasarımcının gözünden.") +
          "<p>Bu plakanın baştan sona tasarım hikâyesi: yüzeyi makine gövdesine cıvatalanıyor (→ alt yüzey = <strong>A</strong>, sallanmadan oturması için " + F([[{ sym: "flatness" }], ["0.05"]]) + " gerekli), sol kenarı bir kızağa yaslanıyor (→ <strong>B</strong>, " + F([[{ sym: "perpendicularity" }], ["0.1"], ["A"]]) + " ile) ve iki M6 cıvata, yüzer bir kapağı her iki parçadan geçerek bağlıyor. Bağlantı elemanı formülü T = 6,6 − 6,0 = ⌀0,6 verir… biz " + F([[{ sym: "position" }], [{ sym: "diameter" }, "0.25", { mod: "M" }], ["A"], ["B"]]) + " yazıyoruz çünkü stack-up, boşluğun bir kısmını kapağın kendi deseni için de kullanıyor — hesaplanan bütçe bağlantının iki parçası arasında <em>paylaştırılır</em>.</p>" +
          H.box("key", "Tasarımcının yayın öncesi kontrol listesi",
            "<ul>" +
            "<li>Datumlar = parçanın <strong>montajda konumlandırıldığı</strong> unsurlar, temas sırasıyla (3-2-1)?</li>" +
            "<li>Her datum unsuru <strong>nitelendirilmiş</strong> mi (A'da form, B ve C'de yönelim)?</li>" +
            "<li>İlişkili tüm unsurlar <strong>tek DRF</strong> üzerinde; temel ölçüler datumlardan, araya ± konumlama ölçüsü karışmamış?</li>" +
            "<li>Pozisyon değerleri <strong>hesaplanmış</strong> mı (bağlantı elemanı formülleri / stack-up), tahmin değil — ve fonksiyon montaj olduğunda Ⓜ ile mi uygulanmış?</li>" +
            "<li>Sabit bağlantıların dişli/çakma deliklerinde Ⓟ var mı?</li>" +
            "<li>Konturlu yüzeylerde eksiksiz DRF'li profil; her yüzey bir şeyle kontrol ediliyor mu (genel profil notu olağan güvenlik ağıdır)?</li>" +
            "<li>Her değer amaçlanan prosesle <strong>başarılabilir</strong> mi — ve fonksiyonun gerektirdiğinden daha sıkı değil mi?</li>" +
            "<li>Her sembol için fikstürü ve mastarı tarif edebiliyor musunuz? Siz edemiyorsanız tezgâhçı da edemez.</li>" +
            "</ul>")
      }
    ],
    quiz: [
      { q: "Normalde hangi unsur birincil datum (A) olmalıdır?", opts: ["CMM'de problaması en kolay yüzey", "Parçayı montajında konumlandıran en büyük/en kararlı yüzey", "Sıkı toleranslı herhangi bir yüzey", "CAD ağacında ilk sırada listelenen yüzey"], a: 1, ex: "Birincil datum 3 temas noktası alır — parçayı montajda gerçekten oturtan unsur olmalıdır; fikstürün tutacağı yüzey de budur." },
      { q: "Cıvata + somun HER İKİ parçadaki boşluk deliklerinden geçiyor. Delik MMC ⌀6,6, cıvata MMC ⌀6,0. Parça başına pozisyon toleransı?", opts: ["⌀0,3", "⌀0,6", "⌀1,2", "⌀0,15"], a: 1, ex: "Yüzer bağlantı: T = H − F = 6,6 − 6,0 = her parçanın deseni için ⌀0,6 (Ⓜ ile)." },
      { q: "Aynı bağlantı, ama cıvata ikinci parçaya vidalanıyor. Parça başına pozisyon toleransı?", opts: ["⌀0,6", "⌀0,45", "⌀0,3", "⌀0,9"], a: 2, ex: "Sabit bağlantı: T = (H − F)/2 = 0,6/2 = ⌀0,3 — hatayı yalnızca bir parçanın boşluğu karşılayabildiği için bütçe bölünür." },
      { q: "Yeni bir parçayı toleranslarken İLK adım nedir?", opts: ["Atölyenin tezgâh kabiliyetlerini listelemek", "Benzer eski bir resimden toleransları kopyalamak", "Montajı incelemek: parça neye dokunuyor, neyle eşleşiyor, hangi sırayla", "Her şeye genel bir profil toleransı uygulamak"], a: 2, ex: "Her şeyi fonksiyon yönlendirir — datum seçimi, karakteristikler ve değerler parçanın montajdaki yaşamından gelir." },
      { q: "Datum önceliği (hangisi A, hangisi B…) neye göre seçilmelidir?", opts: ["CAD yüzeylerinin alfabetik sırasına", "Parçanın montajda eşlerine/fikstüre temas etme sırasına", "Unsurların işlenme sırasına", "En gevşek toleransı veren sıraya"], a: 1, ex: "DRF, parçanın konumlanma şeklinin matematiksel kopyasıdır: birincil oturtur (3 nokta), ikincil yönlendirir (2), üçüncül durdurur (1)." },
      { q: "Stack-up, delinmiş bir delikte pozisyon ⌀0,05 istiyor (delme ~⌀0,2–0,5 tutar). En iyi tasarım yanıtı?", opts: ["Yine de ⌀0,05 yazın — atölye bir yolunu bulur", "Daha fazla boşluk için yeniden tasarlayın veya kabiliyetli bir prosese (rayba/bara) geçip maliyetini hesaplayın", "Pozisyon sembolünü silin", "Sayı iyi görünene kadar datumları değiştirin"], a: 1, ex: "Prosesin tutamadığı tolerans bir ıskarta makinesidir. Ya fonksiyona daha fazla alan verin (büyük boşluk → gevşek T) ya da bilinçli olarak daha kabiliyetli bir proses satın alın." }
    ]
  });

  window.GDT_CONTENT = window.GDT_CONTENT || {};
  window.GDT_CONTENT.tr = { ui: UI, symbols: SYMBOLS, lessons: LESSONS };
})();
