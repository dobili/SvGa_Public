/*
 * Karteneditor – Sitzen und feiner Figurversatz (Editor 1.8, Wunsch des Autors, 22.11.2026: „Figuren
 * in kleineren Schritten verschiebbar … damit die Beine über die Sitzfläche herüberragen und nicht
 * in die Sitzfläche hinein“).
 *
 * Eine Figur trägt optional `versatz: [dx, dy]` in Kartenpixeln, höchstens ±8 (eine halbe Kachel);
 * er rückt nur ihr Bild, Feld, Kollision und Ansprechen bleiben (App: oberwelt/figurversatz.ts,
 * Pipeline: kartentiled.figurversatz). Damit man im Editor sieht, was im Spiel erscheint, zeichnet
 * der Editor eine Sitzende wie die App: auf ihr Sitzmöbel gerückt (Füße an die sichtbare Unterkante,
 * waagerecht auf die sichtbare Mitte; sitzplatz.ts und pipeline/abenteuer/sitzplatz.py), mit dem
 * Sitzbild aus dem Paket (Stuhlzustand aus PixelLab) oder, wenn es fehlt, mit dem Standbild
 * 6 Figurenpixel höher. Ohne Sitzmöbel sitzt sie am Boden: kein Hub, nicht verschoben.
 * Näherung: Gedrehte oder gespiegelte Stühle zählen mit ihrem ganzen Rechteck.
 */
"use strict";

(function (KE) {
  const K = 16;
  const GRENZE = 8;
  const SITZARTEN = ["stuhl", "bank", "sessel", "sofa", "hocker", "couch"];
  // Vordergrund ab diesem Anteil der sichtbaren Höhe (wie VORGABE_AB in vordergrund.ts).
  const VORGABE_AB = { stuhl: 0.55, hocker: 0.45, bank: 0.55, sessel: 0.6, sofa: 0.6, couch: 0.6 };
  const VORGABE_AB_SONST = 0.55;
  // Seitlicher Blick: nur unter der Sitzfläche (wie sitzunterkante in vordergrund.ts, 23.11.2026).
  const VORGABE_SEITE = 0.8;
  const SITZFLAECHE_BREIT = 0.6;
  const SITZFLAECHE_ZEILEN = 2;
  const SICHTBAR_AB = 40; // Deckkraft, ab der ein Pixel als sichtbar zählt (sitzumriss.ts)
  const SITZ_HUB = 6; // Figurenpixel, um die ein Standbild sitzend höher steht (sitzrichtung.ts)
  const PIXELLAB_MASSSTAB = 2 / 3; // PixelLab-Bilder (32 breit) stehen mit 2/3 auf der Karte
  const umrisse = {};

  /** Ganze Pixel, auf ±8 begrenzt. */
  const begrenzt = (w) => Math.max(-GRENZE, Math.min(GRENZE, Math.round(Number(w) || 0)));

  /** Versatz einer Figur als [dx, dy] (begrenzt); [0, 0] ohne Angabe. */
  KE.figurversatz = function (e) {
    const v = Array.isArray(e?.versatz) ? e.versatz : [0, 0];
    return [begrenzt(v[0]), begrenzt(v[1])];
  };

  /** Ändert den Versatz einer Figur um (dx, dy), begrenzt; (0, 0) fällt weg. */
  KE.rueckeFigur = function (e, dx, dy) {
    const [vx, vy] = KE.figurversatz(e);
    const neu = [begrenzt(vx + dx), begrenzt(vy + dy)];
    if (neu[0] || neu[1]) e.versatz = neu;
    else delete e.versatz;
  };

  /** Sichtbares Rechteck (links, oben, breite, hoehe) eines Stücks in Kartenpixeln. */
  function sichtbar(s) {
    const roh = KE.zustand.daten.moebel[s.kennung];
    const e = s.eintrag;
    if (!roh || e.drehung || e.spiegeln) return [s.x, s.y, s.b, s.h];
    const daten = KE.bildpixel(roh.bild);
    if (!daten) return [s.x, s.y, s.b, s.h];
    umrisse[roh.bild] ??= umrissAus(daten);
    const u = umrisse[roh.bild];
    if (!u) return [s.x, s.y, s.b, s.h];
    const m = Number(e.massstab ?? 1);
    return [s.x + u[0] * m, s.y + u[1] * m, u[2] * m, u[3] * m];
  }

  /** Umriss der Pixel ab SICHTBAR_AB Deckkraft in Bildpixeln, sonst null. */
  function umrissAus(daten) {
    let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1; // prettier-ignore
    for (let y = 0; y < daten.height; y++) {
      for (let x = 0; x < daten.width; x++) {
        if (daten.data[(y * daten.width + x) * 4 + 3] < SICHTBAR_AB) continue;
        [x0, y0, x1, y1] = [Math.min(x0, x), Math.min(y0, y), Math.max(x1, x), Math.max(y1, y)];
      }
    }
    return x1 < 0 ? null : [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
  }

  /** Unterste Zeile der Sitzfläche (von unten das erste Band breiter Zeilen), sonst null. */
  function unterkanteAus(daten, u) {
    let band = 0;
    for (let y = u[1] + u[3] - 1; y >= u[1]; y--) {
      let zahl = 0;
      for (let x = u[0]; x < u[0] + u[2]; x++)
        if (daten.data[(y * daten.width + x) * 4 + 3] >= SICHTBAR_AB) zahl++;
      band = zahl >= u[2] * SITZFLAECHE_BREIT ? band + 1 : 0;
      if (band >= SITZFLAECHE_ZEILEN) return y + SITZFLAECHE_ZEILEN - 1;
    }
    return null;
  }

  /** Erste verdeckende Bildzeile je Blick (wie sitzausschnitt in vordergrund.ts), sonst null. */
  function vordergrundAb(roh, daten, u, blick) {
    const ab = roh.vordergrund?.ab ?? VORGABE_AB[roh.art] ?? VORGABE_AB_SONST;
    if (ab >= 1) return null;
    if (blick === "oben") return Math.round(u[1] + u[3] * ab);
    const seite = roh.vordergrund?.seite;
    if (seite !== undefined) return Math.round(u[1] + u[3] * seite);
    return unterkanteAus(daten, u) ?? Math.round(u[1] + u[3] * VORGABE_SEITE);
  }

  const istSitz = (s) => {
    const art = KE.zustand.daten.moebel[s.kennung]?.art;
    return art
      ? SITZARTEN.includes(art)
      : SITZARTEN.some((w) => s.kennung.toLowerCase().includes(w));
  };
  const rasterrest = (w) => {
    const rest = w - Math.round(w / K) * K;
    return rest <= -K / 2 ? rest + K : rest;
  };
  const kachelweit = (w) => Math.round(Math.max(-K, Math.min(K, w)));

  /**
   * Verschiebung (dx, dy) einer Sitzenden auf ihr Sitzmöbel, wie sitzlage in sitzplatz.ts; null,
   * wenn unter ihrem Feld kein Sitzmöbel steht (am Boden).
   */
  KE.sitzlage = function (feld, szene = KE.szene()) {
    const mx = feld[0] * K + K / 2;
    const my = feld[1] * K + K / 2;
    const treffer = KE.platziere(szene)
      .filter((s) => !s.fehlt && istSitz(s))
      .filter((s) => s.x <= mx && mx < s.x + s.b && s.y <= my && my < s.y + s.h)
      .sort((a, b) => a.b * a.h - b.b * b.h);
    const sitz = treffer[0];
    if (!sitz) return null;
    const [sx, sy, sb, sh] = sichtbar(sitz);
    const waagerecht = sitz.b <= K ? sx + sb / 2 - mx : rasterrest(sitz.x);
    const senkrecht = sitz.h <= 2 * K ? sy + sh - (feld[1] + 1) * K : rasterrest(sitz.y);
    return { dx: kachelweit(waagerecht), dy: kachelweit(senkrecht), sitz };
  };

  /**
   * Vordergrund des Sitzmöbels über der Sitzenden, wie vordergrund.ts in der App (23.11.2026): von
   * hinten („oben“) die Lehne ab dem Anteil `ab` der sichtbaren Höhe (je Art oder `vordergrund.ab`),
   * seitlich nur unter der Sitzfläche (aus den Pixeln, sonst 0,8 oder `vordergrund.seite`); wer zum
   * Betrachter schaut („unten“), bekommt keinen. Gedrehte, gespiegelte oder beschnittene Möbel zeigt der Editor ohne Vordergrund.
   */
  KE.zeichneSitzvordergrund = function (ctx, m, blick) {
    // Sitzt die Person an dieser Stelle (Zustand der Szene vor `sitzt`, Editor 1.9, blick.js)?
    const sitzt = KE.sitztJetzt(m);
    const lage = sitzt && blick !== "unten" ? KE.sitzlage(m.eintrag.feld) : null;
    const s = lage?.sitz;
    const roh = s && KE.zustand.daten.moebel[s.kennung];
    const b = roh && KE.bild(roh.bild);
    if (!b || !b.complete || s.eintrag.drehung || s.eintrag.spiegeln || KE.zuschnittVon(s.eintrag))
      return;
    const daten = KE.bildpixel(roh.bild);
    const u = daten && (umrisse[roh.bild] ??= umrissAus(daten));
    if (!u) return;
    const oben = vordergrundAb(roh, daten, u, blick);
    if (oben === null) return;
    const massstab = Number(s.eintrag.massstab ?? 1);
    const hoehe = b.naturalHeight - oben;
    ctx.drawImage(
      b,
      0,
      oben,
      b.naturalWidth,
      hoehe,
      s.x,
      s.y + oben * massstab,
      b.naturalWidth * massstab,
      hoehe * massstab,
    );
  };

  /**
   * Verschiebung des Personenbilds gegen die Kachel (ohne den feinen Versatz, der steckt schon in
   * der Lage der Markierung): sitzend auf das Möbel, ohne Sitzbild dazu der Hub.
   * Eingaben: Markierung, gezeichnetes Bild, ob es ein echtes Sitzbild ist.
   */
  KE.sitzverschiebung = function (m, bild, istSitzbild) {
    if (!KE.sitztJetzt(m)) return { dx: 0, dy: 0 };
    // Zustand der Stelle (Editor 1.9): Stuhl auch ohne Möbel (mit Hub), Boden ohne Hub.
    const zustand = KE.zustandVon?.(m.liste, m.eintrag).zustand;
    const lage = KE.sitzlage(m.eintrag.feld);
    if (!lage && zustand !== "sitzstuhl") return { dx: 0, dy: 0 };
    const massstab = bild.naturalWidth >= 2 * K ? PIXELLAB_MASSSTAB : 1;
    const hub = istSitzbild || zustand === "sitzboden" ? 0 : Math.round(SITZ_HUB * massstab);
    return { dx: lage?.dx ?? 0, dy: (lage?.dy ?? 0) - hub };
  };
})(window.KE);
