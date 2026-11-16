/*
 * Karteneditor – Ankunft nach einem Übergang (ab 1.4): auf welchem Feld der Held steht, wenn er
 * über einen Übergang auf diese Karte kommt, und wohin er schaut. Nachbau von
 * app/src/abenteuer/oberwelt/ankunft.ts (ankunftsort, verdeckendesMoebel) mit der Kollision des
 * Editors (geometrie.js, sperrkacheln); Änderungen dort bitte hier nachziehen.
 *
 * Regel (Befund des Autors, 10.11.2026; Funktionstests 15.11.2026): der Held kommt NEBEN dem
 * Zielauslöser an, auf dem freien Nachbarfeld ohne Auslöser mit dem meisten Platz ringsum
 * (3 × 3), Felder hinter einem Möbelbild nur zur Not; er schaut vom Durchgang weg. Liegt nichts
 * Freies daneben, steht er auf dem Auslöser selbst. Seit 1.4 kann die Szene das Feld festlegen:
 * Eigenschaft „ankunft“ („x,y“) an einem Feld des Auslösers, dazu „blick“ (oben, unten, links,
 * rechts; ohne: vom Durchgang weg). Jede Seite eines Übergangs hat so ihren eigenen Ankunftsort.
 */
"use strict";

(function (KE) {
  const K = 16;
  const START = "start";
  const VERDECKT_ABZUG = 10;
  const RICHTUNGEN = ["oben", "unten", "links", "rechts"];
  const NACHBARN = [
    [0, -1, "oben"],
    [0, 1, "unten"],
    [-1, 0, "links"],
    [1, 0, "rechts"],
  ];
  const FARBE = { automatisch: "#ffffff", fest: "#3fe0ff", fehler: "#ff4d4d" };

  /** „x,y“ → [x, y], sonst null. Beispiel: „3,5“ → [3, 5]. */
  KE.liesFeld = function (text) {
    const teile = String(text ?? "")
      .split(",")
      .map((t) => Number(t.trim()));
    return teile.length === 2 && teile.every(Number.isInteger) ? teile : null;
  };

  /** Blick vom nächsten Auslöserfeld weg (größere Achse), wie blickWeg in ankunft.ts. */
  function blickWeg(x, y, felder) {
    const abstand = (f) => Math.abs(f.feld[0] - x) + Math.abs(f.feld[1] - y);
    const naechstes = [...felder].sort((a, b) => abstand(a) - abstand(b))[0];
    const dx = x - naechstes.feld[0];
    const dy = y - naechstes.feld[1];
    if (!dx && !dy) return "unten";
    if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? "rechts" : "links";
    return dy > 0 ? "unten" : "oben";
  }

  /** Ob ein Möbelbild den Helden auf (x, y) verdeckt (verdeckendesMoebel in ankunft.ts). */
  function verdeckt(stuecke, x, y) {
    const tiefe = (y + 0.5) * K;
    const mitte = (x + 0.5) * K;
    return stuecke.some(
      (s) =>
        s.tiefe > tiefe &&
        mitte >= s.x &&
        mitte < s.x + s.b &&
        [tiefe, tiefe - K].some((h) => h >= s.y && h < s.y + s.h),
    );
  }

  /** Frei-Prüfung der Karte: im Raster, nicht gesperrt (Raster, Möbel, Pinsel, Figuren). */
  function freiPruefung(szene, stuecke) {
    const gesperrt = KE.sperrkacheln(szene, stuecke);
    const zeilen = szene.raster || [];
    return (x, y) =>
      y >= 0 && y < zeilen.length && x >= 0 && x < zeilen[y].length && !gesperrt.has(x + "," + y);
  }

  /**
   * Ankunft am Auslöser `name` der Szene: { x, y, richtung, aufAusloeser, festgelegt, fehler } oder
   * null ohne Auslöser. `fehler` (nur festgelegt) nennt, was nicht stimmt: gesperrt oder auf einem
   * Auslöser (dieselben Regeln prüfen pipeline/abenteuer/ankunftsfeld.py und der Lauftest).
   * Beispiel: Dachboden, „treppe“ auf (1..2, 3..4) → das freie Feld daneben mit dem meisten Platz.
   */
  KE.ankunftsort = function (szene, name, stuecke = KE.platziere(szene)) {
    const felder = (szene.ausloeser || []).filter((a) => a.name === name);
    if (!felder.length) return null;
    const frei = freiPruefung(szene, stuecke);
    const belegt = new Map(
      (szene.ausloeser || []).filter((a) => a.name !== START).map((a) => [a.feld.join(","), a]),
    );
    const mitAngabe = felder.find((a) => KE.liesFeld(a.eigenschaften?.ankunft));
    if (mitAngabe) {
      const [x, y] = KE.liesFeld(mitAngabe.eigenschaften.ankunft);
      const blick = mitAngabe.eigenschaften.blick;
      const richtung = RICHTUNGEN.includes(blick) ? blick : blickWeg(x, y, felder);
      const darauf = belegt.get(x + "," + y);
      const fehler = !frei(x, y)
        ? "gesperrt"
        : darauf
          ? `liegt auf dem Auslöser ${darauf.name}`
          : null;
      return { x, y, richtung, aufAusloeser: false, festgelegt: true, fehler };
    }
    const platz = (x, y) => {
      let zahl = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) if (frei(x + dx, y + dy)) zahl++;
      return zahl;
    };
    let beste = null;
    let bestwert = -Infinity;
    for (const f of felder)
      for (const [dx, dy, richtung] of NACHBARN) {
        const x = f.feld[0] + dx;
        const y = f.feld[1] + dy;
        if (!frei(x, y) || belegt.has(x + "," + y)) continue;
        const wert = platz(x, y) - (verdeckt(stuecke, x, y) ? VERDECKT_ABZUG : 0);
        if (wert > bestwert) [bestwert, beste] = [wert, { x, y, richtung, aufAusloeser: false }];
      }
    const [x, y] = felder[0].feld;
    return beste ?? { x, y, richtung: "unten", aufAusloeser: true, fehler: "kein Feld frei" };
  };

  /**
   * Fußsymbol mit Pfeil auf dem Ankunftsfeld: weiß automatisch, türkis festgelegt, rot bei einem
   * Fehler; eine dünne Linie verbindet es mit dem ersten Feld des Auslösers.
   */
  KE.zeichneFuss = function (ctx, an, ausloeser, zoom) {
    const farbe = an.fehler ? FARBE.fehler : an.festgelegt ? FARBE.fest : FARBE.automatisch;
    const mx = an.x * K + K / 2;
    const my = an.y * K + K / 2;
    ctx.save();
    ctx.strokeStyle = farbe;
    ctx.lineWidth = 1 / zoom;
    ctx.setLineDash([2 / zoom, 2 / zoom]);
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(ausloeser.feld[0] * K + K / 2, ausloeser.feld[1] * K + K / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.translate(mx, my);
    ctx.rotate({ oben: 0, rechts: Math.PI / 2, unten: Math.PI, links: -Math.PI / 2 }[an.richtung]);
    ctx.fillStyle = farbe;
    ctx.strokeStyle = "rgba(0,0,0,0.85)";
    ctx.lineWidth = 0.8;
    for (const seite of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(seite * 2.2, 1.5, 1.6, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.beginPath(); // Pfeil in Blickrichtung
    ctx.moveTo(0, -7);
    ctx.lineTo(-3, -3.5);
    ctx.lineTo(3, -3.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
})(window.KE);
