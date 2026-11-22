/*
 * Karteneditor – Geometrie: Lage, Größe, Tiefe und Kollision der Objekte einer Szene, genau wie
 * der Kartenbau (pipeline/abenteuer/kartenbau.py, platziere) und die Form der Objekte
 * (pipeline/abenteuer/objektform.py: drehung, spiegeln, massstab, ebene), die Übersteuerung der
 * Kollision je Objekt (objektkollision.py: kollision, maske), Bodenteile über Abgängen
 * (bodenteile.py), Kollisionspinsel (kollisionspinsel.py: sperren, freigeben) und Figuren als
 * Hindernis wie in der App (oberwelt/begehbar.ts).
 *
 * Warum: Der Editor soll die Karte so zeigen wie das Spiel; Zeichenreihenfolge (tiefe) und
 * Kollision müssen deshalb dieselben Regeln haben. Ändert sich eine Regel dort, muss sie hier
 * nachgezogen werden.
 */
"use strict";

(function (KE) {
  const K = 16;
  KE.K = K;
  /** Felder des Rasters, die sperren (Wand, Wasser, Leere), wie GESPERRT im Kartenbau. */
  const GESPERRT = new Set(["#", "~", " "]);

  /** Ob ein Eintrag gedreht, gespiegelt oder skaliert ist. */
  KE.hatForm = (e) => (e.drehung || 0) % 360 !== 0 || !!e.spiegeln || Number(e.massstab ?? 1) !== 1;

  /** Größe des gezeichneten Rechtecks nach Maßstab und Drehung (objektform.wirksame_groesse). */
  KE.wirksameGroesse = function (breite, hoehe, e) {
    const s = Number(e.massstab ?? 1);
    const b = Math.max(1, Math.round(breite * s));
    const h = Math.max(1, Math.round(hoehe * s));
    return (e.drehung || 0) % 180 === 90 ? [h, b] : [b, h];
  };

  /** Maske gespiegelt, dann im Uhrzeigersinn gedreht (objektform.drehe_maske). */
  KE.dreheMaske = function (maske, spalten, reihen, drehung, spiegeln) {
    let r = [];
    for (let y = 0; y < reihen; y++)
      r.push((maske[y] || "").padEnd(spalten, ".").slice(0, spalten));
    if (spiegeln) r = r.map((z) => [...z].reverse().join(""));
    const schritte = Math.floor((((drehung % 360) + 360) % 360) / 90);
    for (let n = 0; n < schritte; n++) {
      const neu = [];
      for (let x = 0; x < r[0].length; x++) {
        let zeile = "";
        for (let y = r.length - 1; y >= 0; y--) zeile += r[y][x];
        neu.push(zeile);
      }
      r = neu;
    }
    return r;
  };

  /**
   * Die Möbelangabe in der Form des Eintrags (objektform.geformt). Eine eigene `maske` am Eintrag
   * (Übersteuerung, objektkollision.py) ersetzt die Katalogmaske und gilt im Raster des skalierten,
   * ungedrehten Bildes. Mit Maßstab rechnet massstab.js die Maske neu (skalierte Standfläche).
   */
  KE.geformt = function (angabe, e) {
    if (!angabe) return angabe;
    const eigene = Array.isArray(e.maske) ? e.maske : null;
    if (!KE.hatForm(e)) return eigene ? { ...angabe, maske: [...eigene] } : angabe;
    const neu = { ...angabe };
    [neu.breite, neu.hoehe] = KE.wirksameGroesse(angabe.breite, angabe.hoehe, e);
    const drehung = (e.drehung || 0) % 360;
    const massstab = Number(e.massstab ?? 1);
    const maske = eigene || (massstab === 1 ? angabe.maske : null);
    if (maske) {
      const [b, h] = KE.wirksameGroesse(angabe.breite, angabe.hoehe, { massstab });
      const sp = Math.max(1, Math.floor(b / K));
      const re = Math.max(1, Math.floor(h / K));
      neu.maske = KE.dreheMaske(maske, sp, re, drehung, !!e.spiegeln);
    } else delete neu.maske;
    if (drehung) delete neu.frei_unten;
    return neu;
  };

  /** Ob ein Eintrag sperrt: `kollision` am Eintrag, sonst der Katalog (objektkollision.kollision_an). */
  KE.kollisionAn = (roh, e) =>
    typeof e.kollision === "boolean" ? e.kollision : !!(roh && roh.kollision);

  /** Ob ein Möbel ein Abgang nach unten ist (bodenteile.ist_abgang). */
  const istAbgang = (roh) => !!roh && roh.art === "treppe" && roh.richtung === "runter";
  const beruehrt = (a, b) =>
    a.x < b.x + b.b && b.x < a.x + a.b && a.y < b.y + b.h && b.y < a.y + a.h;

  /**
   * Bodenteile über einem Abgang (pipeline/abenteuer/bodenteile.py): Der abgedeckte Abgang wird
   * flach (Tiefe 1 plus Ebene), das Bodenteil liegt direkt darüber.
   */
  function legeBodenteile(stuecke, moebel) {
    const art = (s) => (moebel[s.kennung] || {}).art;
    const teile = stuecke.filter((s) => art(s) === "boden_teil" && s.tiefe > 0);
    if (!teile.length) return;
    const ebene = (s) => s.eintrag.ebene || 0;
    const abgaenge = stuecke.filter(
      (s) =>
        istAbgang(moebel[s.kennung]) && s.tiefe - ebene(s) > 0 && teile.some((t) => beruehrt(s, t)),
    );
    for (const s of abgaenge) s.tiefe = 1 + ebene(s);
    for (const t of teile) {
      const unter = abgaenge.filter((s) => beruehrt(s, t)).map((s) => s.tiefe);
      if (unter.length) t.tiefe = Math.max(...unter) + 1 + ebene(t);
    }
  }

  /**
   * Alle Objekte der Szene mit Lage und Tiefe (wie platziere). Ausgabe: Liste von Stücken
   * { uid, index, eintrag, kennung, angabe, x, y, b, h, tiefe, kollision, umgebung }.
   * Unbekannte Möbel erscheinen als rotes Kästchen (fehlt: true).
   */
  KE.platziere = function (szene) {
    const moebel = KE.zustand.daten.moebel;
    const nachId = {};
    const stuecke = [];
    (szene.objekte || []).forEach((e, index) => {
      const roh = moebel[e.moebel];
      const angabe = KE.geformt(roh || { breite: K, hoehe: K }, e);
      const [dx, dy] = e.versatz || [0, 0];
      let x, y, tiefe, kollision;
      if (e.auf !== undefined) {
        const basis = nachId[e.auf];
        if (!basis) return;
        x = basis.x + Math.floor((basis.b - angabe.breite) / 2) + dx;
        y = basis.y + Math.floor((basis.h * 3) / 5) - angabe.hoehe + dy;
        tiefe = basis.tiefe + 1;
        kollision = false;
      } else {
        const feld = e.feld || [0, 0];
        x = feld[0] * K + dx;
        y = feld[1] * K + dy;
        const flach = !angabe.kollision && !e.an_wand && !e.vorn;
        tiefe = e.an_wand ? 0 : flach ? 1 : y + angabe.hoehe - K / 2;
        kollision = KE.kollisionAn(roh, e) && !e.an_wand && !e.vorn;
      }
      const stueck = {
        uid: e._uid,
        index,
        eintrag: e,
        kennung: e.moebel,
        angabe,
        x,
        y,
        b: angabe.breite,
        h: angabe.hoehe,
        tiefe: tiefe + (e.ebene || 0),
        kollision,
        umgebung: !!(roh && roh.umgebung),
        fehlt: !roh,
        id: e.id ?? `${e.moebel}@${index}`,
      };
      nachId[stueck.id] = stueck;
      stuecke.push(stueck);
    });
    legeBodenteile(stuecke, moebel);
    // Zeichenreihenfolge: nach Tiefe, bei Gleichstand in der Reihenfolge der Szene.
    return stuecke.sort((a, b) => a.tiefe - b.tiefe || a.index - b.index);
  };

  /** Gesperrte Kacheln eines Stücks relativ zu seiner Ecke (maske.py, maskenfelder). */
  KE.maskenfelder = function (angabe) {
    const felder = [];
    if (angabe.maske) {
      angabe.maske.forEach((z, y) => [...z].forEach((c, x) => c === "#" && felder.push([x, y])));
      return felder;
    }
    const sp = Math.max(1, Math.floor(angabe.breite / K));
    const re = Math.max(1, Math.floor(angabe.hoehe / K));
    const oben = re > 1 ? 1 : 0;
    const unten = re - (angabe.frei_unten || 0);
    for (let x = 0; x < sp; x++) for (let y = oben; y < unten; y++) felder.push([x, y]);
    return felder;
  };

  /** Verhalten von Tieren, die den Helden nicht aufhalten (belebungsbewegung.ts, haeltAuf). */
  const FREI_LAUFEND = new Set(["fliegen", "schwimmen", "folgen"]);

  /**
   * Ob eine Belebung den Helden an ihrem Feld aufhält: Statist oder Tier am Boden, das an einem Fleck
   * steht (von gleich bis, begehbar.ts stehtFest). Wandernde geben den Weg wieder frei.
   */
  function stehtFest(b) {
    const e = b.eigenschaften || {};
    if (b.typ === "tier" && FREI_LAUFEND.has(e.verhalten)) return false;
    return (e.von ?? null) === (e.bis ?? null);
  }

  /**
   * Kacheln, die Figuren und stehende Belebung sperren (wie die App: oberwelt/begehbar.ts,
   * figurenaufstellung.ts, belebungsschicht.ts). „bedingt“: Die Figur steht nur, wenn ihre Bedingung
   * aus orte.json gilt (wenn, regeln/figurbedingung.ts), der Statist nur zu seiner Tageszeit (wann).
   * Ausgabe: { fest: Set("x,y"), bedingt: Map("x,y" → Name) }.
   */
  KE.figurensperren = function (szene, datei = KE.zustand.datei) {
    const angaben = KE.zustand.nachDatei[datei]?.figurangaben || {};
    const fest = new Set();
    const bedingt = new Map();
    const merke = (e, nurBedingt) =>
      nurBedingt ? bedingt.set(e.feld.join(","), e.name) : fest.add(e.feld.join(","));
    for (const f of szene.figuren || []) merke(f, !!angaben[f.name]?.wenn);
    for (const b of szene.belebung || []) {
      const wann = (b.eigenschaften || {}).wann;
      if (stehtFest(b)) merke(b, !!wann && wann !== "immer");
    }
    for (const k of fest) bedingt.delete(k);
    return { fest, bedingt };
  };

  /**
   * Kacheln, die ein 16 × 16 großes Pixelrechteck ab (px, py) berührt, als „x,y“ (eine, zwei oder vier).
   * Wie die App (oberwelt/begehbar.ts): Ein Möbel mit Feinschub sperrt jede berührte Kachel.
   */
  KE.beruehrt = function (px, py) {
    const kacheln = [];
    for (let x = Math.floor(px / K); x * K < px + K; x++)
      for (let y = Math.floor(py / K); y * K < py + K; y++) kacheln.push(x + "," + y);
    return kacheln;
  };

  /** Die gemalten Kacheln einer Szene als Mengen „x,y“ (Kollisionspinsel, pinsel.js). */
  KE.pinselmengen = (szene) => ({
    sperren: new Set((szene.sperren || []).map((f) => f.join(","))),
    freigeben: new Set((szene.freigeben || []).map((f) => f.join(","))),
  });

  /**
   * Was Raster (Wand, Wasser, Leere) und Möbel mit Kollision sperren, ohne Figuren. Mit `pinsel`
   * gilt der Kollisionspinsel wie im Kartenbau (kollisionspinsel.py): Eine Maskenkachel, die eine
   * Freigabe berührt, entfällt; Freigaben stechen auch das Raster, Sperren kommen dazu.
   */
  KE.grundsperren = function (szene, stuecke, pinsel = true) {
    const leer = { sperren: new Set(), freigeben: new Set() };
    const { sperren, freigeben } = pinsel ? KE.pinselmengen(szene) : leer;
    const gesperrt = new Set();
    const bruecken = new Set(szene.bruecken || []);
    (szene.raster || []).forEach((zeile, y) =>
      [...zeile].forEach((z, x) => {
        if (GESPERRT.has(z) && !bruecken.has(z)) gesperrt.add(x + "," + y);
      }),
    );
    for (const s of stuecke) {
      if (!s.kollision) continue;
      for (const [a, b] of KE.maskenfelder(s.angabe)) {
        const kacheln = KE.beruehrt(s.x + a * K, s.y + b * K);
        if (!kacheln.some((k) => freigeben.has(k))) for (const k of kacheln) gesperrt.add(k);
      }
    }
    for (const k of sperren) gesperrt.add(k);
    for (const k of freigeben) gesperrt.delete(k);
    return gesperrt;
  };

  /**
   * Alle gesperrten Kacheln der Szene: Raster, Möbel und Kollisionspinsel (grundsperren), dazu
   * Figuren und stehende Belebung, die immer da sind (bedingte zeigt zeichnen.js gestrichelt). Die
   * Freigabe des Pinsels sticht keine Figur, wie in der App.
   */
  KE.sperrkacheln = function (szene, stuecke) {
    const gesperrt = KE.grundsperren(szene, stuecke);
    for (const k of KE.figurensperren(szene).fest) gesperrt.add(k);
    return gesperrt;
  };

  /**
   * Für die Anzeige (Fehlerbericht des Autors, 16.11.2026): Im Spiel sperrt ein Möbel genau seine
   * Pixelfläche (moebel.ts, Phaser-Körper je Maskenkachel). Steht es nicht auf dem Raster (Feinschub,
   * Pfeiltasten, Alt-Ziehen), zeigt der Editor seine Maskenkacheln deshalb als Pixelflächen statt
   * als zwei berührte Kacheln. Ausgabe: { kacheln: Set „x,y“, flaechen: [[px, py], …] } (je 16 × 16).
   */
  KE.sperranzeige = function (szene, stuecke) {
    const { freigeben } = KE.pinselmengen(szene);
    const amRaster = stuecke.filter((s) => s.x % K === 0 && s.y % K === 0);
    const kacheln = KE.grundsperren(szene, amRaster);
    for (const k of KE.figurensperren(szene).fest) kacheln.add(k);
    const flaechen = [];
    for (const s of stuecke) {
      if (!s.kollision || (s.x % K === 0 && s.y % K === 0)) continue;
      for (const [a, b] of KE.maskenfelder(s.angabe)) {
        const px = s.x + a * K;
        const py = s.y + b * K;
        if (!KE.beruehrt(px, py).some((k) => freigeben.has(k))) flaechen.push([px, py]);
      }
    }
    return { kacheln, flaechen };
  };

  /** Markierungen (Auslöser, Figuren, Belebung) als Stücke von einer Kachel. */
  KE.markierungen = function (szene) {
    const arten = [
      ["ausloeser", "Auslöser"],
      ["figuren", "Figur"],
      ["belebung", "Belebung"],
    ];
    return arten.flatMap(([liste, art]) =>
      (szene[liste] || []).map((e) => ({
        uid: e._uid,
        markierung: true,
        liste,
        art,
        eintrag: e,
        name: e.name,
        // Figuren: feiner Versatz des Bildes (sitzen.js, Editor 1.8); Feld und Kollision bleiben.
        x: e.feld[0] * K + (liste === "figuren" ? KE.figurversatz(e)[0] : 0),
        y: e.feld[1] * K + (liste === "figuren" ? KE.figurversatz(e)[1] : 0),
        b: K,
        h: K,
      })),
    );
  };

  /** Ob ein Punkt (Kartenpixel) auf einem deckenden Pixel des Stücks liegt. */
  KE.trifft = function (s, px, py) {
    if (px < s.x || py < s.y || px >= s.x + s.b || py >= s.y + s.h) return false;
    if (s.markierung || s.fehlt) return true;
    const daten = KE.bildpixel(KE.zustand.daten.moebel[s.kennung].bild);
    if (!daten) return true;
    const e = s.eintrag;
    const m = Number(e.massstab ?? 1);
    // Rückwärts: Punkt relativ zur Mitte, Drehung zurück, Spiegelung zurück, Maßstab zurück.
    let lx = px - (s.x + s.b / 2);
    let ly = py - (s.y + s.h / 2);
    const w = (-(e.drehung || 0) * Math.PI) / 180;
    [lx, ly] = [lx * Math.cos(w) - ly * Math.sin(w), lx * Math.sin(w) + ly * Math.cos(w)];
    if (e.spiegeln) lx = -lx;
    const ix = Math.floor(lx / m + daten.width / 2);
    const iy = Math.floor(ly / m + daten.height / 2);
    if (ix < 0 || iy < 0 || ix >= daten.width || iy >= daten.height) return false;
    return daten.data[(iy * daten.width + ix) * 4 + 3] > 0;
  };

  /**
   * Ob ein Stück wegen „Umgebung sperren“ nicht anwählbar ist. Ausnahme: Bodenkacheln (Art
   * boden_teil), die auf einem Nicht-Umgebungs-Bild liegen (Dielen über einer Treppe nach unten,
   * Treppenabgang selbst bauen): Sonst käme der Autor bei gesperrter Umgebung nicht an sie heran.
   */
  KE.gesperrteUmgebung = function (s, stuecke) {
    if (!KE.zustand.schalter.umgebungSperren || !s.umgebung) return false;
    if ((KE.zustand.daten.moebel[s.kennung] || {}).art !== "boden_teil") return true;
    return !stuecke.some((o) => !o.umgebung && beruehrt(o, s));
  };

  /**
   * Alles unter einem Punkt, oberstes zuerst: Markierungen, dann Objekte (sichtbare, anwählbare).
   */
  KE.trefferAn = function (px, py) {
    const szene = KE.szene();
    const sch = KE.zustand.schalter;
    const treffer = [];
    if (sch.markierungen && !sch.nurUmgebung) {
      for (const m of KE.markierungen(szene)) if (KE.trifft(m, px, py)) treffer.push(m);
    }
    const stuecke = KE.platziere(szene).reverse();
    for (const s of stuecke) {
      if (sch.nurUmgebung && !s.umgebung) continue;
      if (KE.gesperrteUmgebung(s, stuecke)) continue;
      if (KE.trifft(s, px, py)) treffer.push(s);
    }
    return treffer;
  };

  /** Alle anwählbaren Stücke und Markierungen, die ein Rechteck berühren. */
  KE.imRechteck = function (x0, y0, x1, y1) {
    const sch = KE.zustand.schalter;
    const szene = KE.szene();
    const stuecke = KE.platziere(szene);
    const alle = [
      ...stuecke.filter(
        (s) => !(sch.nurUmgebung && !s.umgebung) && !KE.gesperrteUmgebung(s, stuecke),
      ),
      ...(sch.markierungen && !sch.nurUmgebung ? KE.markierungen(szene) : []),
    ];
    return alle.filter((s) => s.x < x1 && s.x + s.b > x0 && s.y < y1 && s.y + s.h > y0);
  };
})(window.KE);
