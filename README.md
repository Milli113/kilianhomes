# KiliánHomes – új weboldal

Statikus oldal, build nélkül. A mappa tartalmát a jelenlegi kilianhomes.hu tárhely gyökerébe kell tenni.

- `index.html` – főoldal
- `lakasok.html` – élő lakásválasztó (`#foldszint` / `#tetoter`)
- `lakas.html?n=1` … `lakas.html?n=14` – lakás aloldalak
- `js/data.js` – MINDEN lakásadat egy helyen: státusz (`szabad` / `foglalt` / `eladva`), ár, helyiségek, garázsok
- A képek és PDF-ek a meglévő `https://kilianhomes.hu/img/`, `/adatlap/`, `/muszaki/` útvonalakról töltődnek (`KH.IMG`, `KH.DOC` a data.js elején).
- Az űrlap most csak visszajelzést mutat: élesítéskor a `js/home.js` „Űrlap” részében kell a meglévő űrlapkezelőre küldeni (fetch POST).
- Animációk: GSAP + ScrollTrigger, Lenis sima görgetés (CDN). Csökkentett mozgás beállításnál kikapcsolnak.
