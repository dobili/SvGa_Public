/*
 * Karteneditor – Kollision fein malen (Editor 1.6, Wunsch des Autors, 16.11.2026): Schalter „Fein“
 * (Taste F) am Kollisionspinsel und an „Kollision bearbeiten“, Malen in Zellen von 4 × 4 Pixeln,
 * 4-Pixel-Gitter, Kennzeichen für teilweise gesperrte Kacheln, Übertragen auf Fassungen.
 *
 * Warum: Eine Kachel soll sich zu einem Viertel, zur Hälfte oder zu drei Vierteln sperren lassen,
 * waagrecht und senkrecht getrennt. Die Felder beschreibt fein.js. Der Pinsel schreibt wie der grobe
 * nur, was etwas ändert („Sperren“ nur auf freien Zellen, „Freigeben“ nur auf gesperrten); eine
 * ganz gesperrte oder ganz freigegebene Kachel landet grob in `sperren` oder `freigeben`.
 */
"use strict";

(function (KE) {
  const K = 16;
  const Z = 4;
  const ZP = K / Z;
  const FARBE_GITTER = "rgba(0, 110, 200, 0.5)"; // blau: auf Boden, Wand und Gelb sichtbar
  const FARBE_KACHELGITTER = "rgba(0, 60, 140, 0.9)";
  const FARBE_FEINSPERRE = "rgba(150, 95, 0, 0.9)";
  const FARBE_FREI = "rgba(30, 190, 80, 1)";
  const FARBE_PUNKT = "rgba(150, 70, 0, 0.95)";
  const PUNKT = 2; // Halbmesser des Kennzeichens einer teilweise gesperrten Kachel in Pixeln
  const NAMEN = { sperren: "sperren", freigeben: "freigeben" };
  const FEIN = { sperren: "sperren_fein", freigeben: "freigeben_fein" };

  /** Schaltet „Fein“ um (oder auf `an`). Gilt für den Kollisionspinsel und „Kollision bearbeiten“. */
  KE.schalteFein = function (an) {
    const z = KE.zustand;
    z.fein = typeof an === "boolean" ? an : !z.fein;
    KE.meldeAenderung(
      z.fein
        ? "Fein: Zellen von 4 Pixeln, je Kachel 4 × 4. Taste F schaltet zurück."
        : "Fein aus: ganze Kacheln.",
    );
  };

  /** Liste einer Szene neu schreiben, sortiert nach Reihe und Spalte; leer entfernt sie. */
  function schreibeListe(szene, name, eintraege) {
    eintraege.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    if (eintraege.length) szene[name] = eintraege;
    else delete szene[name];
  }

  /** Entfernt die feinen Einträge einer Kachel „x,y“ (der grobe Pinsel malt die ganze Kachel). */
  KE.entferneFein = function (szene, k) {
    for (const name of Object.values(FEIN))
      if (szene[name])
        schreibeListe(
          szene,
          name,
          szene[name].filter((e) => e[0] + "," + e[1] !== k),
        );
  };

  /** Zustand einer Kachel: Sätze der Zellnummern 0 … 15, die gesperrt und die freigegeben sind. */
  function kachelzustand(szene, k) {
    const grob = KE.pinselmengen(szene);
    const fein = KE.feinlisten(szene);
    const menge = (art) => {
      if (grob[art].has(k)) return new Set([...Array(Z * Z).keys()]);
      const maske = fein[art].get(k) || "";
      return new Set([...maske].flatMap((c, i) => (c === "#" ? [i] : [])));
    };
    return { sperren: menge("sperren"), freigeben: menge("freigeben") };
  }

  /** Schreibt den Zustand einer Kachel: ganz → grob, teilweise → fein, nichts → gar nicht. */
  function schreibeKachel(szene, k, zustand) {
    const [x, y] = k.split(",").map(Number);
    for (const art of ["sperren", "freigeben"]) {
      const grob = (szene[NAMEN[art]] || []).filter((e) => e[0] + "," + e[1] !== k);
      const fein = (szene[FEIN[art]] || []).filter((e) => e[0] + "," + e[1] !== k);
      const zellen = zustand[art];
      if (zellen.size === Z * Z) grob.push([x, y]);
      else if (zellen.size) {
        const maske = [...Array(Z * Z).keys()].map((i) => (zellen.has(i) ? "#" : ".")).join("");
        fein.push([x, y, maske]);
      }
      schreibeListe(szene, NAMEN[art], grob);
      schreibeListe(szene, FEIN[art], fein);
    }
  }

  /** Ob eine Szene irgendeine Freigabe hat (grob oder fein): sonst entfällt freigeben_grund. */
  KE.hatFreigaben = (szene) =>
    !!((szene.freigeben || []).length || (szene.freigeben_fein || []).length);

  /**
   * Malt eine Zelle (cx, cy in Zellen). grund: Zellen, die ohne Pinsel gesperrt sind
   * (KE.grundzellen ohne Pinsel). Ausgabe: ob sich etwas geändert hat.
   */
  KE.malePinselzelle = function (szene, cx, cy, modus, grund) {
    const zeilen = szene.raster || [];
    const breite = Math.max(0, ...zeilen.map((z) => z.length));
    const [x, y] = [Math.floor(cx / Z), Math.floor(cy / Z)];
    if (y < 0 || y >= zeilen.length || x < 0 || x >= breite) return false;
    const felder = ["sperren", "freigeben", "sperren_fein", "freigeben_fein"];
    const vorher = JSON.stringify(felder.map((f) => szene[f]));
    const k = x + "," + y;
    const zustand = kachelzustand(szene, k);
    const i = (cy - y * Z) * Z + (cx - x * Z);
    zustand.sperren.delete(i);
    zustand.freigeben.delete(i);
    const zelle = cx + "," + cy;
    if (modus === "sperren" && !grund.has(zelle)) zustand.sperren.add(i);
    if (modus === "freigeben" && grund.has(zelle)) zustand.freigeben.add(i);
    schreibeKachel(szene, k, zustand);
    if (!KE.hatFreigaben(szene)) delete szene.freigeben_grund;
    return JSON.stringify(felder.map((f) => szene[f])) !== vorher;
  };

  /** Zeichnet ein Gitter in Zellen über dem sichtbaren Teil der Karte (Fein-Modus). */
  KE.zeichneFeingitter = function (ctx, breite, hoehe, zoom, ausschnitt) {
    const [x0, y0, x1, y1] = ausschnitt || [0, 0, breite * K, hoehe * K];
    const links = Math.max(0, Math.floor(x0 / ZP) * ZP);
    const oben = Math.max(0, Math.floor(y0 / ZP) * ZP);
    const rechts = Math.min(breite * K, x1);
    const unten = Math.min(hoehe * K, y1);
    ctx.lineWidth = 1 / zoom;
    for (const kachel of [false, true]) {
      ctx.strokeStyle = kachel ? FARBE_KACHELGITTER : FARBE_GITTER;
      ctx.beginPath();
      for (let x = links; x <= rechts; x += ZP)
        if ((x % K === 0) === kachel) (ctx.moveTo(x, oben), ctx.lineTo(x, unten));
      for (let y = oben; y <= unten; y += ZP)
        if ((y % K === 0) === kachel) (ctx.moveTo(links, y), ctx.lineTo(rechts, y));
      ctx.stroke();
    }
  };

  /** Zeichnet den Umriss einer Menge von Zellen „cx,cy“ (nur die Außenkanten). */
  function umriss(ctx, zellen) {
    ctx.beginPath();
    for (const k of zellen) {
      const [cx, cy] = k.split(",").map(Number);
      const [x, y] = [cx * ZP, cy * ZP];
      const frei = (dx, dy) => !zellen.has(cx + dx + "," + (cy + dy));
      if (frei(0, -1)) (ctx.moveTo(x, y), ctx.lineTo(x + ZP, y));
      if (frei(0, 1)) (ctx.moveTo(x, y + ZP), ctx.lineTo(x + ZP, y + ZP));
      if (frei(-1, 0)) (ctx.moveTo(x, y), ctx.lineTo(x, y + ZP));
      if (frei(1, 0)) (ctx.moveTo(x + ZP, y), ctx.lineTo(x + ZP, y + ZP));
    }
    ctx.stroke();
  }

  /**
   * Feine Pinselzellen: Sperren braun gestrichelt umrandet, Freigaben grün umrandet (wie der grobe
   * Pinsel: Dort hat der Autor etwas übersteuert). Die gelbe Fläche zeichnet zeichnen.js.
   */
  KE.zeichneFeinpinsel = function (ctx, szene, zoom) {
    const fein = KE.feinlisten(szene);
    ctx.lineWidth = 1.5 / zoom;
    for (const [art, farbe] of [
      ["sperren", FARBE_FEINSPERRE],
      ["freigeben", FARBE_FREI],
    ]) {
      ctx.strokeStyle = farbe;
      ctx.setLineDash(art === "sperren" ? [2 / zoom, 2 / zoom] : []);
      umriss(ctx, new Set([...fein[art]].flatMap(([k, m]) => KE.zellenDerMaske(k, m))));
    }
    ctx.setLineDash([]);
  };

  /** Kennzeichen der Kacheln, auf denen der Held nicht mittig stehen kann: ein kleiner Punkt. */
  KE.zeichneTeilkacheln = function (ctx, teilkacheln, zoom) {
    ctx.fillStyle = FARBE_PUNKT;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 0.75 / zoom;
    for (const k of teilkacheln) {
      const [x, y] = k.split(",").map(Number);
      ctx.beginPath();
      ctx.arc(x * K + K / 2, y * K + K / 2, PUNKT, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  };

  /**
   * Überträgt die feinen Kacheln dieser Karte auf eine Zustandsfassung (wie KE.pinselUebertragen):
   * neu gemalte oder geänderte Kacheln dorthin, entfernte dort entfernen. Ausgabe: Zahl.
   */
  KE.feinUebertragen = function (andere) {
    const z = KE.zustand;
    const hier = KE.feinlisten(KE.szene());
    const alt = KE.feinlisten(z.original[z.datei]);
    let zahl = 0;
    for (const art of ["sperren", "freigeben"]) {
      const dort = KE.feinlisten(andere)[art];
      for (const [k, m] of hier[art]) {
        if (alt[art].get(k) === m || dort.get(k) === m) continue;
        // Eine Kachel steht nie zugleich grob und fein in der Szene.
        for (const name of Object.values(NAMEN))
          if (andere[name]) andere[name] = andere[name].filter((e) => e[0] + "," + e[1] !== k);
        dort.set(k, m);
        zahl++;
      }
      for (const k of alt[art].keys()) if (!hier[art].has(k) && dort.delete(k)) zahl++;
      const liste = [...dort].map(([k, m]) => [...k.split(",").map(Number), m]);
      schreibeListe(andere, FEIN[art], liste);
    }
    for (const name of Object.values(NAMEN))
      if (andere[name] && !andere[name].length) delete andere[name];
    return zahl;
  };
})(window.KE);
