/*
 * Karteneditor – Zuschnitt: Bilder links, oben, rechts und unten beschneiden (Editor 1.5).
 *
 * Warum: Der Autor möchte vorhandene Bilder beschneiden, etwa aus einem Zaunstück mit Pfosten nur
 * den Pfosten machen (Wunsch des Autors, 16.11.2026). Die Szene speichert das im Objektfeld
 * `zuschnitt`: [links, oben, rechts, unten] in Pixeln des Katalogbilds, vor Maßstab, Spiegeln und
 * Drehung. Regeln wie pipeline/abenteuer/objektzuschnitt.py und app/.../moebelzuschnitt.ts: Das
 * Objekt ist so groß wie der Ausschnitt, `feld` und `versatz` nennen seine linke obere Ecke, die
 * Katalogmaske wird mitbeschnitten (angefangene Kacheln zählen), die Tiefe folgt der unteren Kante.
 * Inhalt: Form und Treffer mit Zuschnitt (ergänzt geometrie.js), Zeichnen des Ausschnitts, Setzen
 * eines Werts für alle gleichen Bilder der Auswahl, Modus „Zuschneiden“ mit Griffen an den Kanten
 * und halbdurchsichtiger Vorschau des weggeschnittenen Teils. Bedienfeld und Bibliothek:
 * zuschnittfeld.js.
 */
"use strict";

(function (KE) {
  const K = 16;
  const SEITEN = ["links", "oben", "rechts", "unten"];
  const GRIFF = 6; // Bildschirmpixel, in denen eine Kante greifbar ist
  const DURCHSICHTIG = 0.35;
  KE.ZUSCHNITTSEITEN = SEITEN;
  KE.zustand.zuschnittModus = false;

  /** Der Zuschnitt eines Eintrags als [l, o, r, u], oder null (fehlt oder lauter Nullen). */
  KE.zuschnittVon = function (e) {
    const z = e && e.zuschnitt;
    if (!Array.isArray(z) || z.length !== 4 || !z.some((w) => w > 0)) return null;
    return z.map((w) => Math.max(0, Math.round(Number(w) || 0)));
  };

  const hatFormOhne = KE.hatForm;
  KE.hatForm = (e) => hatFormOhne(e) || !!KE.zuschnittVon(e);

  /** Raster eines beschnittenen Bildes: angefangene Kacheln zählen (objektzuschnitt.raster). */
  const raster = (b, h) => [Math.max(1, Math.ceil(b / K)), Math.max(1, Math.ceil(h / K))];
  const standardmaske = (sp, re, freiUnten = 0) =>
    Array.from({ length: re }, (_, y) =>
      (y >= (re > 1 ? 1 : 0) && y < re - freiUnten ? "#" : ".").repeat(sp),
    );

  /** Neue Kacheln, die die alte Kachel ab `anfang` nach dem Versatz berührt. */
  function beruehrte(anfang, laenge, versatz, anzahl) {
    const links = Math.max(0, anfang - versatz);
    const rechts = Math.min(laenge, anfang + K - versatz);
    const liste = [];
    for (let i = Math.floor(links / K); rechts > links && i < anzahl && i * K < rechts; i++)
      liste.push(i);
    return liste;
  }

  /** Die Angabe nach dem Zuschnitt: Größe des Ausschnitts, Katalogmaske mitbeschnitten. */
  function beschnitten(angabe, z) {
    const breite = Math.max(1, angabe.breite - z[0] - z[2]);
    const hoehe = Math.max(1, angabe.hoehe - z[1] - z[3]);
    const sp0 = Math.max(1, Math.floor(angabe.breite / K));
    const re0 = Math.max(1, Math.floor(angabe.hoehe / K));
    const katalog = angabe.maske
      ? Array.from({ length: re0 }, (_, y) =>
          (angabe.maske[y] || "").padEnd(sp0, ".").slice(0, sp0),
        )
      : standardmaske(sp0, re0, angabe.frei_unten || 0);
    const [sp, re] = raster(breite, hoehe);
    const neu = Array.from({ length: re }, () => Array(sp).fill("."));
    katalog.forEach((zeile, y) =>
      [...zeile].forEach((c, x) => {
        if (c !== "#") return;
        for (const ny of beruehrte(y * K, hoehe, z[1], re))
          for (const nx of beruehrte(x * K, breite, z[0], sp)) neu[ny][nx] = "#";
      }),
    );
    const { frei_unten: _frei, ...rest } = angabe;
    return { ...rest, breite, hoehe, maske: neu.map((r) => r.join("")) };
  }

  const geformtOhne = KE.geformt;
  /** objektform.geformt mit Zuschnitt: erst ausschneiden, dann Maßstab, Spiegeln, Drehung. */
  KE.geformt = function (angabe, e) {
    const z = KE.zuschnittVon(e);
    if (!angabe || !z) return geformtOhne(angabe, e);
    const roh = beschnitten(angabe, z);
    const m = Number(e.massstab ?? 1);
    const [b, h] = KE.wirksameGroesse(roh.breite, roh.hoehe, { massstab: m });
    const [sp, re] = raster(b, h);
    const eigene = Array.isArray(e.maske) ? e.maske : null;
    const grund = eigene || (m === 1 ? roh.maske : standardmaske(sp, re));
    const neu = { ...roh, maske: KE.dreheMaske(grund, sp, re, e.drehung || 0, !!e.spiegeln) };
    [neu.breite, neu.hoehe] = KE.wirksameGroesse(roh.breite, roh.hoehe, e);
    return neu;
  };

  /** Spalten und Reihen der Maske eines Stücks (kollision.js); beschnitten zählen angefangene. */
  KE.maskenmasse = (s) =>
    KE.zuschnittVon(s.eintrag)
      ? raster(s.b, s.h)
      : [Math.max(1, Math.floor(s.b / K)), Math.max(1, Math.floor(s.h / K))];

  /** Bildseite (0 links … 3 unten) → Seite auf der Karte nach Spiegeln und Drehung. */
  const schritte = (e) => Math.floor(((((e.drehung || 0) % 360) + 360) % 360) / 90);
  const spiegel = (e, i) => (e.spiegeln && i % 2 === 0 ? 2 - i : i);
  KE.anzeigeseite = (e, q) => (spiegel(e, q) + schritte(e)) % 4;
  KE.bildseite = (e, d) => spiegel(e, (d - schritte(e) + 4) % 4);

  /** Wie geometrie.trifft, aber im Ausschnitt (deckende Pixel nur dort). */
  const trifftOhne = KE.trifft;
  KE.trifft = function (s, px, py) {
    const z = !s.markierung && !s.fehlt && KE.zuschnittVon(s.eintrag);
    if (!z) return trifftOhne(s, px, py);
    if (px < s.x || py < s.y || px >= s.x + s.b || py >= s.y + s.h) return false;
    const daten = KE.bildpixel(KE.zustand.daten.moebel[s.kennung].bild);
    if (!daten) return true;
    const e = s.eintrag;
    const m = Number(e.massstab ?? 1);
    let lx = px - (s.x + s.b / 2);
    let ly = py - (s.y + s.h / 2);
    const w = (-(e.drehung || 0) * Math.PI) / 180;
    [lx, ly] = [lx * Math.cos(w) - ly * Math.sin(w), lx * Math.sin(w) + ly * Math.cos(w)];
    if (e.spiegeln) lx = -lx;
    const bw = Math.max(1, daten.width - z[0] - z[2]);
    const bh = Math.max(1, daten.height - z[1] - z[3]);
    const ix = Math.floor(lx / m + bw / 2);
    const iy = Math.floor(ly / m + bh / 2);
    if (ix < 0 || iy < 0 || ix >= bw || iy >= bh) return false;
    return daten.data[((iy + z[1]) * daten.width + ix + z[0]) * 4 + 3] > 0;
  };

  /** Zeichnet ein beschnittenes Stück (zeichnen.js): nur der Ausschnitt, in seiner Form. */
  KE.zeichneBeschnitten = function (ctx, s, b) {
    const e = s.eintrag;
    const z = KE.zuschnittVon(e);
    const m = Number(e.massstab ?? 1);
    const bw = Math.max(1, b.naturalWidth - z[0] - z[2]);
    const bh = Math.max(1, b.naturalHeight - z[1] - z[3]);
    ctx.save();
    ctx.translate(s.x + s.b / 2, s.y + s.h / 2);
    ctx.rotate(((e.drehung || 0) * Math.PI) / 180);
    ctx.scale(e.spiegeln ? -1 : 1, 1);
    ctx.drawImage(b, z[0], z[1], bw, bh, (-bw * m) / 2, (-bh * m) / 2, bw * m, bh * m);
    ctx.restore();
  };

  const stueck = (uid) => KE.platziere(KE.szene()).find((s) => s.uid === uid);
  const katalog = (e) => KE.zustand.daten.moebel[e.moebel];
  const objekte = () => KE.ausgewaehlt().filter((t) => t.liste === "objekte");

  /** Die Objekte, für die ein Zuschnitt gilt: alle der Auswahl mit demselben Bild wie das erste. */
  KE.zuschnittZiele = function () {
    const alle = objekte().filter((t) => katalog(t.eintrag));
    return alle.length ? alle.filter((t) => t.eintrag.moebel === alle[0].eintrag.moebel) : [];
  };

  /**
   * Setzt eine Bildseite q des Zuschnitts auf `wert` (Pixel des Katalogbilds) und schiebt das
   * Objekt so, dass die anderen Kanten auf der Karte stehen bleiben. Mindestens 1 Pixel bleibt.
   */
  function wendeAn(e, q, wert) {
    const angabe = katalog(e);
    const z = KE.zuschnittVon(e) || [0, 0, 0, 0];
    const laenge = q % 2 === 0 ? angabe.breite : angabe.hoehe;
    const neu = Math.max(0, Math.min(laenge - 1 - z[(q + 2) % 4], Math.round(wert)));
    if (neu === z[q]) return;
    const vorher = stueck(e._uid);
    z[q] = neu;
    if (z.some((w) => w > 0)) e.zuschnitt = z;
    else delete e.zuschnitt;
    const nachher = stueck(e._uid);
    if (!vorher || !nachher) return;
    // Die Kante gegenüber der beschnittenen Seite bleibt, wo sie war.
    const d = KE.anzeigeseite(e, q);
    const zielX = d === 0 ? vorher.x + vorher.b - nachher.b : vorher.x;
    const zielY = d === 1 ? vorher.y + vorher.h - nachher.h : vorher.y;
    if (zielX !== nachher.x || zielY !== nachher.y)
      KE.setzeLage(e, KE.kopie(e), zielX - nachher.x, zielY - nachher.y);
  }

  /** Bedienfeld: setzt eine Bildseite für alle gleichen Bilder der Auswahl (ein Schritt). */
  KE.setzeZuschnitt = function (q, wert, relativ = false) {
    const ziele = KE.zuschnittZiele();
    if (!ziele.length) return;
    KE.schritt(`Zuschnitt ${SEITEN[q]}`, [KE.zustand.datei], () => {
      for (const t of ziele) {
        const alt = (KE.zuschnittVon(t.eintrag) || [0, 0, 0, 0])[q];
        wendeAn(t.eintrag, q, relativ ? alt + wert : wert);
      }
    });
  };

  /** „Zuschnitt aufheben“: wieder das ganze Bild, an derselben Stelle der sichtbaren Kanten. */
  KE.zuschnittAufheben = function () {
    const ziele = objekte().filter((t) => KE.zuschnittVon(t.eintrag));
    if (!ziele.length) return;
    KE.schritt("Zuschnitt aufheben", [KE.zustand.datei], () => {
      for (const t of ziele) for (let q = 0; q < 4; q++) wendeAn(t.eintrag, q, 0);
    });
  };

  /** Schaltet den Modus „Zuschneiden“ (Griffe an den Kanten des ausgewählten Bildes). */
  KE.zuschneiden = function (an = !KE.zustand.zuschnittModus) {
    const z = KE.zustand;
    z.zuschnittModus = !!an && KE.zuschnittZiele().length > 0;
    if (z.zuschnittModus)
      ((z.kollisionUid = null), (z.kpinsel = null), (z.uebergangVorlage = null));
    KE.meldeAenderung(
      z.zuschnittModus
        ? "Zuschneiden: Kante ziehen (rastet auf Pixel ein, mit Alt 16 px). Esc beendet."
        : "",
    );
  };

  /** Die Kante (Seite auf der Karte, 0 bis 3) des ersten Ziels unter dem Punkt, oder -1. */
  function kanteAn(s, px, py) {
    const tol = GRIFF / KE.zustand.ansicht.zoom;
    const imY = py > s.y - tol && py < s.y + s.h + tol;
    const imX = px > s.x - tol && px < s.x + s.b + tol;
    const abstand = [
      imY ? Math.abs(px - s.x) : Infinity,
      imX ? Math.abs(py - s.y) : Infinity,
      imY ? Math.abs(px - (s.x + s.b)) : Infinity,
      imX ? Math.abs(py - (s.y + s.h)) : Infinity,
    ];
    const d = abstand.indexOf(Math.min(...abstand));
    return abstand[d] < tol ? d : -1;
  }

  /** Maus runter im Modus: greift eine Kante (Ausgabe: Ziehzustand) oder null (dann Auswahl). */
  KE.zuschnittStart = function (ereignis, px, py) {
    const ziele = KE.zuschnittZiele();
    const s = ziele.length && stueck(ziele[0].eintrag._uid);
    if (!s) return null;
    const d = kanteAn(s, px, py);
    if (d < 0) return null;
    const q = KE.bildseite(s.eintrag, d);
    return {
      art: "zuschnitt",
      d,
      q,
      px,
      py,
      massstab: Number(s.eintrag.massstab ?? 1),
      start: ziele.map((t) => ({ t, kopie: KE.kopie(t.eintrag) })),
      wert: (KE.zuschnittVon(s.eintrag) || [0, 0, 0, 0])[q],
      vorher: KE.schnappschuss([KE.zustand.datei]),
    };
  };

  /** Ziehen einer Kante: Wert in Pixeln des Bildes, mit Alt auf 16 px gerundet. */
  KE.zuschnittZiehen = function (ziehen, ereignis, px, py) {
    const welt = [px - ziehen.px, py - ziehen.py, ziehen.px - px, ziehen.py - py][ziehen.d];
    let wert = ziehen.wert + Math.round(welt / ziehen.massstab);
    if (ereignis.altKey) wert = Math.round(wert / K) * K;
    for (const { t, kopie } of ziehen.start) {
      for (const k of Object.keys(t.eintrag)) if (!(k in kopie)) delete t.eintrag[k];
      Object.assign(t.eintrag, KE.kopie(kopie));
      wendeAn(t.eintrag, ziehen.q, wert);
    }
    KE.zeichne();
  };

  KE.zuschnittEnde = (ziehen) => KE.schrittAbschliessen("Zuschneiden", ziehen.vorher);

  /** Das ganze Bild halbdurchsichtig, nur außerhalb des Ausschnitts (Vorschau des Weggeschnittenen). */
  function zeichneWeggeschnitten(ctx, s, zoom) {
    const e = s.eintrag;
    const angabe = katalog(e);
    const b = angabe && KE.bild(angabe.bild);
    if (!b || !b.complete) return;
    const z = KE.zuschnittVon(e) || [0, 0, 0, 0];
    const m = Number(e.massstab ?? 1);
    const rand = [0, 1, 2, 3].map((d) => z[KE.bildseite(e, d)] * m);
    const ganz = { x: s.x - rand[0], y: s.y - rand[1] };
    ganz.b = s.b + rand[0] + rand[2];
    ganz.h = s.h + rand[1] + rand[3];
    ctx.save();
    ctx.beginPath();
    ctx.rect(ganz.x, ganz.y, ganz.b, ganz.h);
    ctx.rect(s.x, s.y, s.b, s.h);
    ctx.clip("evenodd");
    ctx.globalAlpha = DURCHSICHTIG;
    ctx.translate(ganz.x + ganz.b / 2, ganz.y + ganz.h / 2);
    ctx.rotate(((e.drehung || 0) * Math.PI) / 180);
    ctx.scale(e.spiegeln ? -1 : 1, 1);
    const w = b.naturalWidth * m;
    const h = b.naturalHeight * m;
    ctx.drawImage(b, -w / 2, -h / 2, w, h);
    ctx.restore();
    ctx.setLineDash([3 / zoom, 3 / zoom]);
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 1 / zoom;
    ctx.strokeRect(ganz.x, ganz.y, ganz.b, ganz.h);
    ctx.setLineDash([]);
  }

  /** Griffe an den vier Kanten des ersten Ziels: kleine Quadrate in der Mitte jeder Kante. */
  function zeichneGriffe(ctx, s, zoom) {
    const g = 8 / zoom;
    const mitte = [
      [s.x, s.y + s.h / 2],
      [s.x + s.b / 2, s.y],
      [s.x + s.b, s.y + s.h / 2],
      [s.x + s.b / 2, s.y + s.h],
    ];
    ctx.lineWidth = 1.5 / zoom;
    ctx.strokeStyle = "#ff8a00";
    ctx.strokeRect(s.x, s.y, s.b, s.h);
    for (const [x, y] of mitte) {
      ctx.fillStyle = "#ff8a00";
      ctx.fillRect(x - g / 2, y - g / 2, g, g);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(x - g / 2, y - g / 2, g, g);
    }
  }

  /** Vorschau im Modus „Zuschneiden“ (zeichnen.js ruft das nach den Objekten). */
  KE.zeichneZuschnitt = function (ctx, zoom) {
    const z = KE.zustand;
    if (!z.zuschnittModus || z.schalter.vorher) return;
    const ziele = KE.zuschnittZiele();
    if (!ziele.length) return (z.zuschnittModus = false);
    const stuecke = KE.platziere(KE.szene());
    const uids = new Set(ziele.map((t) => t.eintrag._uid));
    const gewaehlt = stuecke.filter((s) => uids.has(s.uid));
    for (const s of gewaehlt) zeichneWeggeschnitten(ctx, s, zoom);
    const erstes = gewaehlt.find((s) => s.uid === ziele[0].eintrag._uid);
    if (erstes) zeichneGriffe(ctx, erstes, zoom);
  };
})(window.KE);
