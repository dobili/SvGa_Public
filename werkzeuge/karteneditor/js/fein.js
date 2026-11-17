/*
 * Karteneditor – Kollision fein: Zellen von 4 × 4 Pixeln, je Kachel 4 × 4 (Editor 1.6, Wunsch des
 * Autors, 16.11.2026: ein Viertel, die Hälfte oder drei Viertel einer Kachel sperren).
 *
 * Felder (pipeline/abenteuer/kollisionfein.py): Szene `sperren_fein` und `freigeben_fein` (Listen
 * [x, y, 16 Zeichen], „#“ heißt gesperrt bzw. freigegeben), Objekt `maske_fein` (je Kachel 4 Zeichen
 * und 4 Zeilen, im Raster des ungedrehten Bildes wie `maske`). Eine ganz gesperrte oder ganz
 * freigegebene Kachel schreibt der Editor grob (`sperren`, `freigeben`).
 * Regel wie die App (oberwelt/feinsperren.ts): Für Ankunft, Figuren und Lauf gilt eine Kachel mit
 * irgendeiner gesperrten Zelle als gesperrt, weil der Held (12 Pixel) mittig auf ihr die Zelle
 * berührte. Diese Datei ergänzt geometrie.js (geformt, grundsperren, sperranzeige); das Malen steht
 * in feinmalen.js.
 */
"use strict";

(function (KE) {
  const K = 16;
  const Z = 4; // Zellen je Kachelkante
  const ZP = K / Z; // Pixel je Zelle
  KE.ZELLE = ZP;
  const GESPERRT = new Set(["#", "~", " "]);
  const VOLL = "#".repeat(Z * Z);

  /** Kachelmaske (Raster der Kacheln) aus einer feinen Maske: Kachel sperrt, wenn eine Zelle sperrt. */
  KE.grobAusFein = function (fein) {
    const reihen = Math.max(1, Math.ceil(fein.length / Z));
    const spalten = Math.max(1, ...fein.map((z) => Math.ceil(z.length / Z)));
    const grob = [];
    for (let b = 0; b < reihen; b++) {
      let zeile = "";
      for (let a = 0; a < spalten; a++) {
        const teile = fein.slice(b * Z, b * Z + Z).map((z) => z.slice(a * Z, a * Z + Z));
        zeile += teile.some((t) => t.includes("#")) ? "#" : ".";
      }
      grob.push(zeile);
    }
    return grob;
  };

  /** Spalten und Reihen (Kacheln) des ungedrehten Bildes zu einer geformten Angabe. */
  function grundraster(neu, e) {
    const quer = (e.drehung || 0) % 180 === 90;
    const [b, h] = quer ? [neu.hoehe, neu.breite] : [neu.breite, neu.hoehe];
    // Beschnitten oder skaliert zählen angefangene Kacheln mit (objektform.geformt, massstab.js).
    const auf = !!(KE.zuschnittVon && KE.zuschnittVon(e)) || Number(e.massstab ?? 1) !== 1;
    const r = (v) => Math.max(1, auf ? Math.ceil(v / K) : Math.floor(v / K));
    return [r(b), r(h)];
  }

  /**
   * Die feine Maske, die gilt (objektform._feine_maske_von): die des Eintrags, sonst die des Katalogs
   * (feinmasken.py, KARTENREGELN 10.88), diese nur ohne Maßstab, Zuschnitt und eigene `maske`.
   */
  function feineMaske(angabe, e) {
    if (Array.isArray(e.maske_fein)) return e.maske_fein;
    const zugeschnitten = !!(KE.zuschnittVon && KE.zuschnittVon(e));
    const katalog = Array.isArray(angabe.maske_fein) && !Array.isArray(e.maske);
    return katalog && Number(e.massstab ?? 1) === 1 && !zugeschnitten ? angabe.maske_fein : null;
  }

  const geformtOhneFein = KE.geformt;
  /** objektform.geformt mit `maske_fein`: dreht und spiegelt mit, dazu die grobe Maske. */
  KE.geformt = function (angabe, e) {
    const neu = geformtOhneFein(angabe, e);
    if (!neu) return neu;
    const quelle = feineMaske(angabe, e);
    if (!quelle) {
      const { maske_fein: _katalog, ...rest } = neu;
      return rest;
    }
    const [sp, re] = grundraster(neu, e);
    const fein = KE.dreheMaske(quelle, sp * Z, re * Z, e.drehung || 0, !!e.spiegeln);
    return { ...neu, maske_fein: fein, maske: KE.grobAusFein(fein) };
  };

  /** Feine Listen der Szene als Maps „x,y“ → 16 Zeichen. */
  KE.feinlisten = (szene) => {
    const map = (liste) => new Map((liste || []).map(([x, y, m]) => [x + "," + y, m]));
    return { sperren: map(szene.sperren_fein), freigeben: map(szene.freigeben_fein) };
  };

  /** Die Zellen „cx,cy“ einer Kachelmaske (16 Zeichen) der Kachel „x,y“. */
  KE.zellenDerMaske = function (k, maske) {
    const [x, y] = k.split(",").map(Number);
    const zellen = [];
    for (let i = 0; i < Z * Z; i++)
      if (maske[i] === "#") zellen.push(x * Z + (i % Z) + "," + (y * Z + Math.floor(i / Z)));
    return zellen;
  };
  const alleZellen = (k) => KE.zellenDerMaske(k, VOLL);
  KE.alleZellen = alleZellen;
  const kachelVonZelle = (zelle) => {
    const [cx, cy] = zelle.split(",").map(Number);
    return Math.floor(cx / Z) + "," + Math.floor(cy / Z);
  };
  KE.kachelVonZelle = kachelVonZelle;

  /** Ob die Szene feine Felder hat oder ein Stück eine feine Maske trägt. */
  KE.hatFein = (szene, stuecke = []) =>
    !!((szene.sperren_fein || []).length || (szene.freigeben_fein || []).length) ||
    stuecke.some((s) => s.kollision && s.angabe.maske_fein);

  /** Zellen, die ein Pixelrechteck berührt. */
  function zellenImRechteck(px, py, b, h, ziel) {
    for (let x = Math.floor(px / ZP); x * ZP < px + b; x++)
      for (let y = Math.floor(py / ZP); y * ZP < py + h; y++) ziel.push(x + "," + y);
  }

  /** Gesperrte Zellen eines Stücks relativ zur Ecke: [spalte, reihe] (feine oder Kachelmaske). */
  KE.stueckzellenLokal = function (s) {
    if (s.angabe.maske_fein) {
      const z = [];
      s.angabe.maske_fein.forEach((r, y) => [...r].forEach((c, x) => c === "#" && z.push([x, y])));
      return z;
    }
    const z = [];
    for (const [a, b] of KE.maskenfelder(s.angabe))
      for (let i = 0; i < Z; i++) for (let j = 0; j < Z; j++) z.push([a * Z + i, b * Z + j]);
    return z;
  };

  /**
   * Die Kartenzellen eines Stücks, ohne Zellen in Kacheln, die eine grobe Freigabe berühren
   * (kollisionspinsel.gib_frei) und ohne Zellen, die eine feine Freigabe berühren (gib_frei_fein).
   */
  function stueckzellen(s, freiKacheln, freiZellen) {
    const ergebnis = [];
    for (const [c, r] of KE.stueckzellenLokal(s)) {
      const kachel = KE.beruehrt(s.x + Math.floor(c / Z) * K, s.y + Math.floor(r / Z) * K);
      if (kachel.some((k) => freiKacheln.has(k))) continue;
      const zellen = [];
      zellenImRechteck(s.x + c * ZP, s.y + r * ZP, ZP, ZP, zellen);
      if (!zellen.some((z) => freiZellen.has(z))) ergebnis.push(...zellen);
    }
    return ergebnis;
  }

  /**
   * Alle gesperrten Zellen ohne Figuren (kollisionfein.sperrzellen): Raster, Möbel, grobe Sperren
   * und Freigaben, feine Freigaben und Sperren. Ohne `pinsel` ohne alle gemalten Felder.
   */
  KE.grundzellen = function (szene, stuecke, pinsel = true) {
    const { sperren, freigeben } = pinsel
      ? KE.pinselmengen(szene)
      : { sperren: new Set(), freigeben: new Set() };
    const fein = pinsel ? KE.feinlisten(szene) : { sperren: new Map(), freigeben: new Map() };
    const zu = [...fein.sperren].flatMap(([k, m]) => KE.zellenDerMaske(k, m));
    const frei = new Set([...fein.freigeben].flatMap(([k, m]) => KE.zellenDerMaske(k, m)));
    const zellen = new Set();
    const bruecken = new Set(szene.bruecken || []);
    (szene.raster || []).forEach((zeile, y) =>
      [...zeile].forEach((c, x) => {
        if (GESPERRT.has(c) && !bruecken.has(c))
          for (const z of alleZellen(x + "," + y)) zellen.add(z);
      }),
    );
    for (const s of stuecke)
      if (s.kollision) for (const z of stueckzellen(s, freigeben, frei)) zellen.add(z);
    for (const k of sperren) for (const z of alleZellen(k)) zellen.add(z);
    for (const k of freigeben) for (const z of alleZellen(k)) zellen.delete(z);
    for (const z of frei) zellen.delete(z);
    for (const z of zu) zellen.add(z);
    return zellen;
  };

  /** Kacheln „x,y“ mit mindestens einer der Zellen. */
  KE.kachelnAus = (zellen) => new Set([...zellen].map(kachelVonZelle));

  const grundsperrenOhneFein = KE.grundsperren;
  /** grundsperren mit feiner Kollision: gesperrt ist jede Kachel mit einer gesperrten Zelle. */
  KE.grundsperren = function (szene, stuecke, pinsel = true) {
    const fein = (pinsel && KE.hatFein(szene)) || KE.hatFein({}, stuecke);
    if (!fein) return grundsperrenOhneFein(szene, stuecke, pinsel);
    return KE.kachelnAus(KE.grundzellen(szene, stuecke, pinsel));
  };

  /** Ob ein Stück für die Anzeige in Zellen gilt: feine Maske oder eine feine Freigabe berührt es. */
  function zellstueck(s, freiKacheln) {
    if (s.angabe.maske_fein) return true;
    const zellen = [];
    zellenImRechteck(s.x, s.y, s.b, s.h, zellen);
    return zellen.some((z) => freiKacheln.has(kachelVonZelle(z)));
  }

  const anzeigeOhneFein = KE.sperranzeige;
  /**
   * Kollisionsanzeige mit feiner Kollision. Ohne feine Felder wie bisher (Feinschub als
   * Pixelflächen). Mit ihnen: `kacheln` ganz gesperrte Kacheln, `zellen` die gesperrten Zellen der
   * übrigen ([px, py] je 4 × 4, bei feinen Möbeln pixelgenau), `teilkacheln` die Kacheln, auf denen
   * der Held nicht mittig stehen kann, die aber nicht ganz gesperrt sind (eigene Kennzeichnung).
   */
  KE.sperranzeige = function (szene, stuecke) {
    if (!KE.hatFein(szene, stuecke))
      return { ...anzeigeOhneFein(szene, stuecke), zellen: [], teilkacheln: new Set() };
    const freiKacheln = new Set(KE.feinlisten(szene).freigeben.keys());
    const amRaster = (s) => s.x % K === 0 && s.y % K === 0;
    const fein = stuecke.filter((s) => s.kollision && zellstueck(s, freiKacheln));
    const grob = stuecke.filter((s) => !fein.includes(s));
    const alt = anzeigeOhneFein(
      szene,
      grob.filter((s) => !amRaster(s)),
    );
    const zellen = KE.grundzellen(szene, grob.filter(amRaster));
    const alle = KE.grundzellen(szene, stuecke);
    const kacheln = new Set();
    for (const k of KE.kachelnAus(zellen))
      if (alleZellen(k).every((z) => zellen.has(z))) kacheln.add(k);
    for (const k of KE.figurensperren(szene).fest) kacheln.add(k);
    const punkte = [...zellen]
      .filter((z) => !kacheln.has(kachelVonZelle(z)))
      .map((z) => z.split(",").map((v) => Number(v) * ZP));
    const frei = new Set(
      [...KE.feinlisten(szene).freigeben].flatMap(([k, m]) => KE.zellenDerMaske(k, m)),
    );
    for (const s of fein)
      for (const [c, r] of KE.stueckzellenLokal(s)) {
        const z = [];
        zellenImRechteck(s.x + c * ZP, s.y + r * ZP, ZP, ZP, z);
        if (!z.some((q) => frei.has(q))) punkte.push([s.x + c * ZP, s.y + r * ZP]);
      }
    const teilkacheln = new Set();
    for (const k of KE.kachelnAus(alle))
      if (!kacheln.has(k) && !alleZellen(k).every((z) => alle.has(z))) teilkacheln.add(k);
    return { kacheln, flaechen: alt.flaechen, zellen: punkte, teilkacheln };
  };

  /** Ob alle 16 Zeichen gleich „#“ sind. */
  KE.istVoll = (maske) => maske === VOLL;
  KE.FEIN_VOLL = VOLL;
})(window.KE);
