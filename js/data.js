/* KiliánHomes – lakásadatok
   Egy helyen kell módosítani: státusz ("szabad" | "foglalt" | "eladva"), ár, helyiségek.
   Forrás: kilianhomes.hu jelenlegi lakásválasztója (2026. október). */

window.KH = window.KH || {};

KH.IMG = "https://kilianhomes.hu/img/";
KH.DOC = "https://kilianhomes.hu/";

KH.floors = {
  f: { key: "f", name: "Földszint", img: "k28-ec59528c74.jpg", w: 2000, h: 1357,
       alt: "Földszinti áttekintő alaprajz, Lakás 1–8" },
  t: { key: "t", name: "Tetőtér", img: "k29-60e728461a.jpg", w: 2000, h: 1413,
       alt: "Tetőtéri áttekintő alaprajz, Lakás 6 és 8–14" }
};

/* Kattintható lakásfoltok az áttekintő alaprajzokon (képpixelben) */
KH.polys = {
  f: {
    1: [[1425,265],[1600,265],[1600,665],[1340,665],[1340,480],[1425,480]],
    2: [[1340,725],[1600,725],[1600,1080],[1425,1080],[1425,935],[1340,935]],
    3: [[1175,770],[1335,770],[1335,935],[1425,935],[1425,1080],[1175,1080]],
    4: [[1175,265],[1425,265],[1425,480],[1340,480],[1340,580],[1175,580]],
    5: [[800,780],[990,780],[990,690],[1170,690],[1170,945],[800,945]],
    6: [[520,780],[795,780],[795,960],[520,960]],
    7: [[800,515],[1170,515],[1170,690],[990,690],[990,775],[800,775]],
    8: [[520,515],[795,515],[795,775],[520,775]]
  },
  t: {
    6: [[345,825],[730,825],[730,1090],[345,1090]],
    8: [[345,550],[730,550],[730,820],[345,820]],
    9: [[1320,150],[1680,150],[1680,345],[1590,345],[1590,580],[1510,580],[1510,665],[1320,665]],
    10: [[1680,150],[1860,150],[1860,735],[1590,735],[1590,345],[1680,345]],
    11: [[1590,740],[1860,740],[1860,1105],[1560,1105],[1560,965],[1470,965],[1470,860],[1590,860]],
    12: [[1290,860],[1465,860],[1465,965],[1560,965],[1560,1105],[1860,1105],[1860,1305],[1320,1305],[1320,1090],[1290,1090]],
    13: [[735,825],[1180,825],[1180,855],[1285,855],[1285,1090],[735,1090]],
    14: [[735,550],[1270,550],[1270,775],[1180,775],[1180,820],[735,820]]
  }
};

/* r: helyiségek [név, m²]; "#..." sor = szintfejléc (duplex lakásoknál) */
KH.units = [
  { n:1, rooms:3, net:"64,47", sum:"64,13", level:"Földszint", floors:["f"], garden:true, entrance:false, price:59312400, status:"szabad",
    ext:[["Bioklimatikus pergolás terasz","11,68"]], img:"k14-4026eb183e.jpg",
    r:[["Előtér","6,64"],["Fürdő","5,98"],["WC","1,28"],["Tároló","2,16"],["Szoba","10,00"],["Konyha-étkező","9,58"],["Nappali","18,02"],["Szoba","10,47"]] },
  { n:2, rooms:3, net:"61,69", sum:"61,52", level:"Földszint", floors:["f"], garden:true, entrance:false, price:57988600, status:"szabad",
    ext:[["Bioklimatikus pergolás terasz","11,68"]], img:"k15-fdd98f4876.jpg",
    r:[["Előtér","3,64"],["WC","1,75"],["Tároló","2,12"],["Szoba","10,00"],["Konyha-étkező","7,99"],["Nappali","18,00"],["WC","1,34"],["Közlekedő","1,59"],["Fürdő","4,66"],["Szoba","10,43"]] },
  { n:3, rooms:2, net:"51,71", sum:"51,79", level:"Földszint", floors:["f"], garden:true, entrance:false, price:49124500, status:"foglalt",
    ext:[["Bioklimatikus pergolás terasz","12,95"]], img:"k16-d3c0887437.jpg",
    r:[["Előtér","4,89"],["Tároló","2,03"],["Fürdő","6,76"],["Konyha-étkező","9,89"],["Nappali","18,00"],["Szoba","10,22"]] },
  { n:4, rooms:3, net:"61,81", sum:"61,82", level:"Földszint", floors:["f"], garden:true, entrance:false, price:55629000, status:"szabad",
    ext:[["Bioklimatikus pergolás terasz","12,95"]], img:"k17-2f9549c9cd.jpg",
    r:[["Előtér","2,95"],["Tároló","2,03"],["WC","1,40"],["Közlekedő","2,36"],["Szoba","10,00"],["Fürdő","5,89"],["Konyha-étkező","8,89"],["Nappali","18,00"],["Szoba","10,30"]] },
  { n:5, rooms:3, net:"65,52", sum:"64,87", level:"Földszint", floors:["f"], garden:true, entrance:true, price:61588800, status:"szabad",
    ext:[["Bioklimatikus pergolás terasz és fedett bejárat","16,60"]], img:"k18-7c81f49b44.jpg",
    r:[["Előtér","2,67"],["WC","1,72"],["Tároló","2,01"],["Nappali","18,00"],["Konyha-étkező","9,28"],["Fürdő","4,75"],["Közlekedő","5,42"],["Szoba","10,00"],["Szoba","11,02"]] },
  { n:6, rooms:3, net:"81,92", sum:"73,78", level:"Földszint + tetőtér", floors:["f","t"], duplex:true, garden:true, entrance:true, price:68926800, status:"szabad",
    ext:[["Bioklimatikus pergolás terasz és fedett bejárat","15,32"]], img:"k19-890e12d1fb.jpg",
    r:[["#Földszint"],["Előtér","2,91"],["Nappali","18,00"],["Konyha-étkező","11,52"],["Tároló","2,47"],["WC","2,37"],["Lépcső","2,96"],["Közlekedő","3,88"],
       ["#Tetőtér"],["Közlekedő","4,05"],["Szoba","10,45","nettó 14,07"],["Szoba","10,59","nettó 14,94"],["Fürdő","4,58"]] },
  { n:7, rooms:3, net:"65,46", sum:"64,87", level:"Földszint", floors:["f"], garden:true, entrance:true, price:59895900, status:"szabad",
    ext:[["Bioklimatikus pergolás terasz és fedett bejárat","14,56"]], img:"k20-d8c37921c2.jpg",
    r:[["Előtér","2,67"],["WC","1,75"],["Tároló","2,01"],["Nappali","18,00"],["Közlekedő","2,21"],["Konyha-étkező","9,28"],["Fürdő","4,75"],["Közlekedő","3,21"],["Szoba","10,00"],["Szoba","11,02"]] },
  { n:8, rooms:3, net:"85,97", sum:"77,91", level:"Földszint + tetőtér", floors:["f","t"], duplex:true, garden:true, entrance:true, price:72571800, status:"szabad",
    ext:[["Bioklimatikus pergolás terasz","11,48"],["Fedett bejárat","3,26"]], img:"k21-a636c2b852.jpg",
    r:[["#Földszint"],["Előtér","4,16"],["WC","1,99"],["Nappali","19,49"],["Konyha","6,47"],["Étkező","9,35"],["Tároló","3,83"],["Lépcső","2,95"],
       ["#Tetőtér"],["Közlekedő","4,05"],["Szoba","10,59","nettó 14,94"],["Szoba","10,45","nettó 14,07"],["Fürdő","4,58"]] },
  { n:9, rooms:2, net:"61,86", sum:"52,54", level:"Tetőtér", floors:["t"], garden:false, entrance:false, price:49812450, status:"szabad",
    ext:[], img:"k22-f5699df29e.jpg",
    r:[["Előtér","3,11"],["Fürdő","5,43","nettó 6,72"],["WC","1,19"],["Konyha-étkező","11,27","nettó 13,78"],["Tároló","2,00"],["Nappali","18,08","nettó 24,40"],["Szoba","11,46"]] },
  { n:10, rooms:2, net:"57,36", sum:"49,14", level:"Tetőtér", floors:["t"], garden:false, entrance:false, price:45929750, status:"szabad",
    ext:[], img:"k23-fb35400bf6.jpg",
    r:[["Előtér","4,94"],["Fürdő","4,90","nettó 7,40"],["Tároló","2,01"],["Konyha-étkező","8,55","nettó 9,89"],["Nappali","18,37"],["Szoba","10,37","nettó 14,75"]] },
  { n:11, rooms:2, net:"46,42", sum:"44,45", level:"Tetőtér", floors:["t"], garden:false, entrance:false, price:41134750, status:"szabad",
    ext:[], img:"k24-1e56002c1d.jpg",
    r:[["Előtér","3,31"],["Fürdő","4,63"],["Tároló","2,26"],["Konyha-étkező","6,25"],["Nappali","18,00"],["Szoba","10,00","nettó 11,97"]] },
  { n:12, rooms:3, net:"67,86", sum:"57,82", level:"Tetőtér", floors:["t"], garden:false, entrance:false, price:54408500, status:"szabad",
    ext:[], img:"k25-7ff1239706.jpg",
    r:[["Előtér","3,37"],["WC","1,22"],["Fürdő","4,82"],["Tároló","2,26"],["Konyha-étkező","5,46"],["Nappali","18,08","nettó 24,29"],["Közlekedő","2,19"],["Szoba","10,00"],["Szoba","10,42","nettó 14,25"]] },
  { n:13, rooms:2, net:"58,68", sum:"52,30", level:"Tetőtér", floors:["t"], garden:false, entrance:false, price:48037750, status:"szabad",
    ext:[], img:"k26-85624ca186.jpg",
    r:[["Előtér","2,60"],["Tároló","2,02"],["Konyha-étkező","8,11","nettó 10,29"],["Nappali","20,32"],["Közlekedő","1,95"],["WC","1,17"],["Fürdő","6,13"],["Szoba","10,00","nettó 14,20"]] },
  { n:14, rooms:2, net:"58,08", sum:"51,61", level:"Tetőtér", floors:["t"], garden:false, entrance:false, price:47519250, status:"szabad",
    ext:[], img:"k27-eda2f60f6b.jpg",
    r:[["Előtér","2,94"],["Tároló","2,47"],["Konyha-étkező","7,60","nettó 9,87"],["Nappali","19,35"],["Közlekedő","1,95"],["WC","1,17"],["Fürdő","6,13"],["Szoba","10,00","nettó 14,20"]] }
];

KH.garages = {
  img: "garazsok.jpg", vb: [820, 240], price: "bruttó 10 millió Ft",
  rects: [[54,118,110,98],[174,118,110,98],[292,118,110,98],[412,118,110,98],[532,118,110,98],[650,118,110,98]],
  status: ["szabad","szabad","szabad","szabad","szabad","szabad"]
};

KH.unit = n => KH.units.find(u => u.n === +n);
KH.num = s => parseFloat(String(s).replace(",", "."));
KH.ft = v => new Intl.NumberFormat("hu-HU").format(Math.round(v)).replace(/ /g, " ") + " Ft";
KH.mft = v => (v / 1e6).toLocaleString("hu-HU", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " M Ft";
KH.pad = n => String(n).padStart(2, "0");
KH.statusLabel = { szabad: "Szabad", foglalt: "Foglalt", eladva: "Eladva" };

/* Műszaki tartalom (közös a főoldal és a lakásoldal között) */
KH.specIcons = {
    window: '<rect x="6" y="4" width="28" height="32"/><path d="M20 4v32M6 20h28"/>',
    door: '<rect x="10" y="3" width="20" height="34"/><circle cx="25" cy="21" r="1.4"/><path d="M4 37h32"/>',
    wall: '<path d="M4 8h32M4 16h32M4 24h32M4 32h32M14 8v8M26 16v8M14 24v8M26 32v4M26 4v4"/>',
    tile: '<rect x="4" y="4" width="14" height="14"/><rect x="22" y="4" width="14" height="14"/><rect x="4" y="22" width="14" height="14"/><rect x="22" y="22" width="14" height="14"/>',
    pergola: '<path d="M4 10h32M8 10v26M32 10v26"/><path d="M10 6l4 8M16 6l4 8M22 6l4 8M28 6l4 8"/>',
    heat: '<path d="M6 32c4-4 4-8 0-12s-4-8 0-12M16 32c4-4 4-8 0-12s-4-8 0-12M26 32c4-4 4-8 0-12s-4-8 0-12"/><path d="M4 36h32"/>',
    snow: '<path d="M20 4v32M6 12l28 16M6 28l28-16M16 6l4 4 4-4M16 34l4-4 4 4"/>',
    meter: '<circle cx="20" cy="22" r="14"/><path d="M20 22l7-7M12 10l2 3M28 10l-2 3"/>',
    blind: '<rect x="6" y="4" width="28" height="30"/><path d="M6 10h28M6 16h28M6 22h28M20 34v4"/><circle cx="20" cy="38" r="1"/>'
  };
KH.specs = [
    ["window", "Nyílászárók", "Kömmerling 76 AD német profilrendszer, háromrétegű hőszigetelő üvegezés. A teraszkapcsolatoknál emelő-toló ajtók."],
    ["door", "Beltéri ajtók", "Tokba süllyesztett, rejtett pántos ajtók, négy színben. Az ajtólapok 120 mm-es forgácslap kerettel, 3 cm-es lépésálló nikecell betéttel és 3 mm-es Egger laminált borítással készülnek, lekerekített, ABS-sel zárt élekkel. A pántok 3 dimenzióban állíthatók, a zárszerkezet modern mágneses csapdájú zár."],
    ["wall", "Falazat és hőszigetelés", "Az új falazat 30 cm-es Leiertherm kerámia falazóelemekből készül, 15 cm-es EPS homlokzati hőszigeteléssel. A lakások között 30 cm-es AKU N+F hanggátló téglafal."],
    ["tile", "Minőségi burkolatok az alapárban", "A belső hidegburkolatok kiválasztásakor négyféle prémium, 60×120-as méretű járólap- és csempekombinációt biztosítunk. A nappali és a szobák minőségi melegburkolattal készülnek, legalább háromféle típus közül választhat. Így Önnek nem kell saját költségen magasabb kategóriájú burkolatokra ráfizetnie."],
    ["pergola", "Bioklimatikus pergola", "A kertkapcsolatos lakások teraszára állítható lamellás bioklimatikus pergola kerül, a vételár részeként."],
    ["heat", "Fűtés és megújuló energia", "Két 32 kW-os kondenzációs gázkazán, padlófűtés. A közös területek áramellátását napelemes rendszer biztosítja."],
    ["snow", "Klíma", "Lakásonként, mérettől függően, 1–2 önálló klímaegységgel adjuk át az ingatlant, így nem kell tartani a meleg nyarak vagy az átmeneti hideg időszakok okozta kellemetlenségektől."],
    ["meter", "Egyedi mérés", "Lakásonként külön hőmennyiség-, víz- és árammérő a pontosan követhető rezsiért."],
    ["blind", "Árnyékolás és világítás", "Elektromos mozgatásra előkészített redőnyök. A kertes lakásoknál udvari és növényvilágítás."]
  ];
