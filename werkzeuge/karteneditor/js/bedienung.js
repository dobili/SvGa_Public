/*
 * Karteneditor – Bedienung mit Maus und Tastatur: Auswählen (auch Strg+Klick und Rechteck),
 * Ziehen mit Einrasten (Alt pixelgenau), Ansicht verschieben und zoomen, Auswahlliste bei
 * übereinanderliegenden Bildern, Ziehen aus der Bibliothek, Pinsel, Kollisionspinsel (pinsel.js)
 * und Tastenkürzel.
 */
"use strict";

(function (KE) {
  const K = 16;
  const ZOOM_MIN = 0.25;
  const ZOOM_MAX = 8;
  const ZOOM_FAKTOR = 1.2;
  const KLICK_TOLERANZ = 3; // Bildschirmpixel, ab denen ein Klick als Ziehen gilt
  let ziehen = null; // { art: "objekte" | "ansicht" | "rechteck" | "pinsel" | "kpinsel" | "setzen", … }
  let letzterKlick = null; // { x, y, nummer } für das Durchschalten übereinanderliegender Bilder

  /** Bildschirmpunkt → Kartenpixel. */
  KE.karte = function (ereignis) {
    const r = document.getElementById("leinwand").getBoundingClientRect();
    const a = KE.zustand.ansicht;
    return [(ereignis.clientX - r.left) / a.zoom + a.x, (ereignis.clientY - r.top) / a.zoom + a.y];
  };

  /** Zoomt um einen Faktor um einen Bildschirmpunkt (sx, sy). */
  KE.zoome = function (faktor, sx, sy) {
    const a = KE.zustand.ansicht;
    const canvas = document.getElementById("leinwand");
    sx = sx ?? canvas.width / 2;
    sy = sy ?? canvas.height / 2;
    const neu = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, a.zoom * faktor));
    a.x += sx / a.zoom - sx / neu;
    a.y += sy / a.zoom - sy / neu;
    a.zoom = neu;
    KE.meldeAenderung();
  };

  /** Passt die ganze Karte ins Fenster. */
  KE.einpassen = function () {
    const szene = KE.szene();
    if (!szene) return;
    const canvas = document.getElementById("leinwand");
    const [b, h] = KE.kartengroesse(szene);
    const a = KE.zustand.ansicht;
    a.zoom = Math.max(
      ZOOM_MIN,
      Math.min(ZOOM_MAX, Math.min(canvas.width / b, canvas.height / h) * 0.95),
    );
    a.x = (b - canvas.width / a.zoom) / 2;
    a.y = (h - canvas.height / a.zoom) / 2;
    KE.meldeAenderung();
  };

  /** Mitte der Ansicht in Kartenpixeln (Hinzufügen per Klick in der Bibliothek). */
  KE.mitte = function () {
    const canvas = document.getElementById("leinwand");
    const a = KE.zustand.ansicht;
    return [a.x + canvas.width / a.zoom / 2, a.y + canvas.height / a.zoom / 2];
  };

  function starteZiehen(ereignis, px, py) {
    const auswahl = KE.ausgewaehlt();
    ziehen = {
      art: "objekte",
      px,
      py,
      sx: ereignis.clientX,
      sy: ereignis.clientY,
      start: auswahl.map((t) => ({ t, kopie: KE.kopie(t.eintrag) })),
      vorher: KE.schnappschuss([KE.zustand.datei]),
      bewegt: false,
    };
  }

  function waehle(ereignis, px, py) {
    const z = KE.zustand;
    const treffer = KE.trefferAn(px, py);
    const strg = ereignis.ctrlKey || ereignis.metaKey;
    KE.schliesseListe();
    if (!treffer.length) {
      if (!strg) z.auswahl.clear();
      ziehen = { art: "rechteck", x0: px, y0: py, strg, basis: new Set(z.auswahl) };
      return;
    }
    // Erneuter Klick an dieselbe Stelle schaltet zum nächsten Bild darunter.
    const gleich =
      letzterKlick && Math.hypot(letzterKlick.x - px, letzterKlick.y - py) < 2 / z.ansicht.zoom;
    const nummer = gleich ? (letzterKlick.nummer + 1) % treffer.length : 0;
    letzterKlick = { x: px, y: py, nummer };
    const gewaehlt = treffer[nummer];
    if (strg) {
      if (z.auswahl.has(gewaehlt.uid)) z.auswahl.delete(gewaehlt.uid);
      else z.auswahl.add(gewaehlt.uid);
    } else if (!z.auswahl.has(gewaehlt.uid) || gleich) {
      z.auswahl = new Set([gewaehlt.uid]);
    }
    if (treffer.length > 1) KE.zeigeListe(treffer, ereignis.clientX, ereignis.clientY, strg);
    if (z.auswahl.has(gewaehlt.uid)) starteZiehen(ereignis, px, py);
    KE.meldeAenderung();
  }

  function pinsel(px, py) {
    const szene = KE.szene();
    if (KE.male(szene, Math.floor(px / K), Math.floor(py / K), KE.zustand.pinselZeichen))
      KE.zeichne();
  }

  function mausRunter(ereignis) {
    const z = KE.zustand;
    if (!z.datei) return;
    const [px, py] = KE.karte(ereignis);
    const ansicht = ereignis.button === 1 || ereignis.button === 2 || KE.leertaste;
    if (ansicht) {
      ziehen = { art: "ansicht", sx: ereignis.clientX, sy: ereignis.clientY, a: { ...z.ansicht } };
      return;
    }
    if (ereignis.button !== 0 || z.schalter.vorher) return;
    // Modi aus kollision.js und ausloeser.js: Der Klick gilt der Kachel, nicht der Auswahl.
    if (z.kollisionUid) return KE.kollisionsKlick(px, py);
    if (z.uebergangVorlage) return KE.setzeUebergang(px, py);
    if (z.setzen) {
      ziehen = KE.setzenStart(px, py); // Neuer Übergang, Gegenauslöser, Ankunft (ausloeser.js)
      return;
    }
    if (z.kpinsel) {
      ziehen = KE.pinselStart(ereignis, px, py);
      return;
    }
    if (z.schalter.pinsel) {
      // Der Bodenpinsel malt auch bei „Umgebung sperren“: Er ist ein eigenes Werkzeug (16.11.2026).
      ziehen = { art: "pinsel", vorher: KE.schnappschuss([z.datei]) };
      pinsel(px, py);
      return;
    }
    waehle(ereignis, px, py);
  }

  function mausBewegt(ereignis) {
    const [px, py] = KE.karte(ereignis);
    KE.zeigeKoordinaten(Math.floor(px / K), Math.floor(py / K));
    if (!ziehen) return;
    const z = KE.zustand;
    if (ziehen.art === "ansicht") {
      z.ansicht.x = ziehen.a.x - (ereignis.clientX - ziehen.sx) / z.ansicht.zoom;
      z.ansicht.y = ziehen.a.y - (ereignis.clientY - ziehen.sy) / z.ansicht.zoom;
      return KE.zeichne();
    }
    if (ziehen.art === "pinsel") return pinsel(px, py);
    if (ziehen.art === "kpinsel") return KE.pinselZiehen(ziehen, px, py);
    if (ziehen.art === "setzen") return KE.setzenZiehen(ziehen, px, py);
    if (ziehen.art === "rechteck") {
      KE.rechteck = {
        x0: Math.min(ziehen.x0, px),
        y0: Math.min(ziehen.y0, py),
        x1: Math.max(ziehen.x0, px),
        y1: Math.max(ziehen.y0, py),
      };
      const drin = KE.imRechteck(KE.rechteck.x0, KE.rechteck.y0, KE.rechteck.x1, KE.rechteck.y1);
      z.auswahl = new Set([...(ziehen.strg ? ziehen.basis : []), ...drin.map((s) => s.uid)]);
      return KE.zeichne();
    }
    const weit = Math.hypot(ereignis.clientX - ziehen.sx, ereignis.clientY - ziehen.sy);
    if (!ziehen.bewegt && weit < KLICK_TOLERANZ) return;
    ziehen.bewegt = true;
    KE.schliesseListe();
    let dx = Math.round(px - ziehen.px);
    let dy = Math.round(py - ziehen.py);
    // Ohne Alt rastet die Bewegung auf ganze Kacheln ein, mit Alt pixelgenau (als versatz).
    if (!ereignis.altKey) {
      dx = Math.round(dx / K) * K;
      dy = Math.round(dy / K) * K;
    }
    for (const { t, kopie } of ziehen.start) {
      KE.setzeLage(t.eintrag, kopie, dx, dy);
      if (kopie.feld) KE.belebungMitnehmen(t, kopie.feld);
    }
    KE.zeichne();
  }

  function mausHoch() {
    if (!ziehen) return;
    const art = ziehen.art;
    if (art === "objekte" && ziehen.bewegt) KE.schrittAbschliessen("Verschieben", ziehen.vorher);
    if (art === "pinsel") KE.schrittAbschliessen("Malen", ziehen.vorher);
    if (art === "kpinsel") KE.pinselEnde(ziehen);
    if (art === "setzen") KE.setzenEnde();
    ziehen = null;
    KE.rechteck = null;
    KE.meldeAenderung();
  }

  function rad(ereignis) {
    ereignis.preventDefault();
    const r = ereignis.currentTarget.getBoundingClientRect();
    const faktor = ereignis.deltaY < 0 ? ZOOM_FAKTOR : 1 / ZOOM_FAKTOR;
    KE.zoome(faktor, ereignis.clientX - r.left, ereignis.clientY - r.top);
  }

  function ablegen(ereignis) {
    ereignis.preventDefault();
    const kennung = ereignis.dataTransfer.getData("text/plain");
    const [px, py] = KE.karte(ereignis);
    if (KE.zustand.daten.moebel[kennung]) KE.fuegeEin(kennung, px, py);
  }

  KE.bindeLeinwand = function (canvas) {
    canvas.addEventListener("mousedown", mausRunter);
    window.addEventListener("mousemove", mausBewegt);
    window.addEventListener("mouseup", mausHoch);
    canvas.addEventListener("wheel", rad, { passive: false });
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("dragover", (e) => e.preventDefault());
    canvas.addEventListener("drop", ablegen);
  };

  /** Tastenkürzel (siehe Hilfe, Taste ?). Nicht in Eingabefeldern. */
  const KUERZEL = {
    "strg+z": () => KE.rueckgaengig(),
    "strg+y": () => KE.wiederholen(),
    "strg+umschalt+z": () => KE.wiederholen(),
    "strg+d": () => KE.dupliziere(),
    "strg+s": () => KE.herunterladen(),
    "strg+a": () => {
      KE.zustand.auswahl = new Set(KE.imRechteck(-1e9, -1e9, 1e9, 1e9).map((s) => s.uid));
      KE.meldeAenderung();
    },
    delete: () => KE.loesche(),
    backspace: () => KE.loesche(),
    arrowleft: () => KE.verschiebe(-1, 0),
    arrowright: () => KE.verschiebe(1, 0),
    arrowup: () => KE.verschiebe(0, -1),
    arrowdown: () => KE.verschiebe(0, 1),
    "umschalt+arrowleft": () => KE.verschiebe(-K, 0),
    "umschalt+arrowright": () => KE.verschiebe(K, 0),
    "umschalt+arrowup": () => KE.verschiebe(0, -K),
    "umschalt+arrowdown": () => KE.verschiebe(0, K),
    r: () => KE.drehe(1),
    "umschalt+r": () => KE.drehe(-1),
    h: () => KE.spiegele(),
    pageup: () => KE.ebene("vorn"),
    pagedown: () => KE.ebene("hinten"),
    "umschalt+pageup": () => KE.ebene("ganzVorn"),
    "umschalt+pagedown": () => KE.ebene("ganzHinten"),
    "+": () => KE.zoome(ZOOM_FAKTOR),
    "-": () => KE.zoome(1 / ZOOM_FAKTOR),
    f: () => KE.einpassen(),
    g: () => KE.schalte("raster"),
    k: () => KE.schalte("kollision"),
    u: () => KE.schalte("nurUmgebung"),
    l: () => KE.schalte("umgebungSperren"),
    v: () => KE.schalte("vorher"),
    b: () => KE.schalte("pinsel"),
    m: () => KE.schalte("markierungen"),
    s: () => KE.kollisionspinsel("sperren"),
    o: () => KE.kollisionspinsel("freigeben"),
    x: () => KE.kollisionspinsel("radierer"),
    "?": () => KE.hilfe(true),
    escape: () => {
      KE.hilfe(false);
      KE.schliesseListe();
      const z = KE.zustand;
      if (z.kollisionUid || z.uebergangVorlage || z.kpinsel || z.setzen) {
        z.kollisionUid = z.uebergangVorlage = z.kpinsel = z.setzen = null;
        return KE.meldeAenderung("Modus beendet");
      }
      KE.zustand.auswahl.clear();
      KE.meldeAenderung();
    },
  };

  /** Name eines Tastendrucks, z. B. „strg+umschalt+z“ (Pfeile verschieben dort um 1 Pixel). */
  function tastenname(e) {
    const taste = e.key.toLowerCase();
    const teile = [];
    if (e.ctrlKey || e.metaKey) teile.push("strg");
    if (e.shiftKey && (taste.length > 1 || /^[a-z]$/.test(taste))) teile.push("umschalt");
    teile.push(taste);
    return teile.join("+");
  }

  KE.bindeTastatur = function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === " ") KE.leertaste = true;
      const ziel = e.target;
      if (ziel.tagName === "INPUT" || ziel.tagName === "TEXTAREA" || ziel.tagName === "SELECT")
        return;
      const tu = KUERZEL[tastenname(e)];
      if (!tu) return;
      e.preventDefault();
      tu();
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === " ") KE.leertaste = false;
    });
  };
})(window.KE);
