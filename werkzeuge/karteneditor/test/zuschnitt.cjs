/*
 * Teil des Oberflächentests (editor.test.cjs) für den Zuschnitt (Editor 1.5, Wunsch des Autors,
 * 16.11.2026: aus einem Zaunstück nur den Pfosten machen). Am Viehgatter (64 × 32, links ein
 * Pfosten von 8 Pixeln): Zahlenfelder und ±-Knöpfe, Rückgängig, Griffe ziehen (pixelgenau und mit
 * Alt in 16-px-Schritten), Treffer und Kollision im Ausschnitt, Duplizieren, „Als eigenes Bild
 * merken“ und wieder einfügen, Mehrfachauswahl, „Zuschnitt aufheben“. Herunterladen und Rücklauf
 * prüft `ruecklauf` mit der Ausgabe aus editor.test.cjs.
 */
"use strict";
const h = require("./hilfen.cjs");

const GATTER = "cr7Viehgatter";
const PFOSTEN = [0, 0, 56, 0]; // nur der linke Pfosten, 8 × 32

const stueck = (seite, uid) =>
  seite.evaluate((u) => {
    const s = KE.platziere(KE.szene()).find((x) => x.uid === u);
    return s && { x: s.x, y: s.y, b: s.b, h: s.h, maske: s.angabe.maske };
  }, uid);

/** Bildschirmpunkt zu einem Kartenpixel. */
const schirm = (seite, px, py) =>
  seite.evaluate(
    ([px, py]) => {
      const r = document.getElementById("leinwand").getBoundingClientRect();
      const a = KE.zustand.ansicht;
      return { x: r.left + (px - a.x) * a.zoom, y: r.top + (py - a.y) * a.zoom };
    },
    [px, py],
  );

/** Zahlenfelder und ±-Knöpfe, Rückgängig. Ausgabe: uid des Gatters. */
async function zahlenfelder(seite, pruefe) {
  await seite.keyboard.press("Escape");
  await seite.fill("#bibsuche", "Viehgatter");
  await seite.click(`.bibeintrag[data-kennung="${GATTER}"]`);
  await seite.fill("#bibsuche", "");
  const [uid] = await h.auswahl(seite);
  const vorher = await stueck(seite, uid);
  await seite.fill("#zuschnitt-rechts", "56");
  await seite.press("#zuschnitt-rechts", "Enter");
  const e = await h.eintrag(seite, uid);
  const pfosten = await stueck(seite, uid);
  pruefe(e.zuschnitt?.join() === PFOSTEN.join(), "Zahlenfeld rechts 56: zuschnitt [0, 0, 56, 0]");
  pruefe(
    pfosten.b === 8 && pfosten.h === 32 && pfosten.x === vorher.x && pfosten.y === vorher.y,
    "Pfosten 8 × 32, linke obere Ecke bleibt",
  );
  pruefe(pfosten.maske.join("/") === "./#", "Katalogmaske mitbeschnitten (./#)");
  await seite.click("button.mehr-links");
  const plus = await stueck(seite, uid);
  pruefe(
    (await h.eintrag(seite, uid)).zuschnitt[0] === 1 && plus.x === vorher.x + 1 && plus.b === 7,
    "+ links schneidet 1 Pixel und schiebt die Ecke mit",
  );
  await seite.click("button.weniger-links", { modifiers: ["Shift"] });
  pruefe((await h.eintrag(seite, uid)).zuschnitt[0] === 0, "Umschalt+− (16 px) endet bei 0");
  await seite.keyboard.press("Control+z");
  await seite.keyboard.press("Control+z");
  pruefe((await h.eintrag(seite, uid)).zuschnitt.join() === PFOSTEN.join(), "Rückgängig");
  return uid;
}

/** Modus „Zuschneiden“: Griffe ziehen, Vorschau, Treffer im Ausschnitt. */
async function griffe(seite, uid, pruefe) {
  await seite.click("#eigenschaften button.zuschneiden");
  pruefe(await seite.evaluate(() => KE.zustand.zuschnittModus), "Modus „Zuschneiden“ an");
  const zoom = await seite.evaluate(() => KE.zustand.ansicht.zoom);
  let s = await stueck(seite, uid);
  // Obere Kante 8 Kartenpixel nach unten: rastet auf Pixel ein, die Ecke wandert mit.
  await h.ziehe(seite, await schirm(seite, s.x + s.b / 2, s.y), 0, 8 * zoom);
  let e = await h.eintrag(seite, uid);
  const oben = await stueck(seite, uid);
  pruefe(e.zuschnitt[1] === 8 && oben.y === s.y + 8 && oben.h === 24, "Griff oben: 8 px weg");
  // Untere Kante 10 Pixel hoch mit Alt: springt auf 16.
  s = oben;
  await h.ziehe(seite, await schirm(seite, s.x + s.b / 2, s.y + s.h), 0, -10 * zoom, true);
  e = await h.eintrag(seite, uid);
  pruefe(e.zuschnitt[3] === 16 && (await stueck(seite, uid)).h === 8, "Alt: 16-px-Schritt unten");
  await h.foto(seite, "zuschnitt-01-griffe");
  await seite.keyboard.press("Control+z");
  await seite.keyboard.press("Control+z");
  pruefe((await h.eintrag(seite, uid)).zuschnitt.join() === PFOSTEN.join(), "Griffe rückgängig");
  s = await stueck(seite, uid);
  const treffer = await seite.evaluate(
    ([u, x, y]) => [
      KE.trefferAn(x + 4, y + 20).some((t) => t.uid === u),
      KE.trefferAn(x + 20, y + 20).some((t) => t.uid === u),
    ],
    [uid, s.x, s.y],
  );
  pruefe(treffer[0] && !treffer[1], "Treffer nur im Ausschnitt");
  await seite.keyboard.press("Escape");
  pruefe(!(await seite.evaluate(() => KE.zustand.zuschnittModus)), "Esc beendet den Modus");
}

/** Duplizieren, eigenes Bild merken und einfügen, Mehrfachauswahl, aufheben. */
async function kopien(seite, uid, pruefe) {
  await seite.evaluate((u) => (KE.zustand.auswahl = new Set([u])) && KE.meldeAenderung(), uid);
  await seite.keyboard.press("Control+d");
  const [kopie] = await h.auswahl(seite);
  pruefe((await h.eintrag(seite, kopie)).zuschnitt?.join() === PFOSTEN.join(), "Kopie behält ihn");
  await seite.click("#eigenschaften button.merken");
  await seite.waitForSelector(".eigenerzuschnitt");
  await h.foto(seite, "zuschnitt-02-bibliothek");
  const anzahl = await h.zahl(seite);
  await seite.click(".eigenerzuschnitt");
  const [dritte] = await h.auswahl(seite);
  pruefe(
    (await h.zahl(seite)) === anzahl + 1 &&
      (await h.eintrag(seite, dritte)).zuschnitt?.join() === PFOSTEN.join(),
    "Eigener Zuschnitt aus der Bibliothek mit Zuschnitt eingefügt",
  );
  // Mehrfachauswahl: Der Zuschnitt gilt für alle gleichen Bilder.
  await seite.evaluate(
    ([a, b]) => (KE.zustand.auswahl = new Set([a, b])) && KE.meldeAenderung(),
    [uid, kopie],
  );
  await seite.fill("#zuschnitt-oben", "4");
  await seite.press("#zuschnitt-oben", "Enter");
  const beide = [await h.eintrag(seite, uid), await h.eintrag(seite, kopie)];
  pruefe(
    beide.every((e) => e.zuschnitt[1] === 4),
    "Mehrfachauswahl: beide beschnitten",
  );
  await seite.keyboard.press("Control+z");
  await seite.evaluate((u) => (KE.zustand.auswahl = new Set([u])) && KE.meldeAenderung(), dritte);
  await seite.click("#eigenschaften button.aufheben");
  pruefe(!(await h.eintrag(seite, dritte)).zuschnitt, "Zuschnitt aufheben");
  await seite.keyboard.press("Control+z");
  pruefe(!!(await h.eintrag(seite, dritte)).zuschnitt, "Aufheben rückgängig");
  await seite.click("[data-schalter=kollision]");
  await h.foto(seite, "zuschnitt-03-kollision");
  await seite.click("[data-schalter=kollision]");
  return kopie;
}

async function zuschnitt(seite, pruefe) {
  const uid = await zahlenfelder(seite, pruefe);
  await griffe(seite, uid, pruefe);
  const kopie = await kopien(seite, uid, pruefe);
  await deckkraft(seite, [uid, kopie], pruefe);
}

/** Deckkraft (Editor 1.5): Knopf 50 % für zwei Bilder, Duplizieren behält sie, Kollision bleibt. */
async function deckkraft(seite, uids, pruefe) {
  await seite.evaluate((u) => (KE.zustand.auswahl = new Set(u)) && KE.meldeAenderung(), uids);
  const sperrenVorher = await seite.evaluate(() =>
    [...KE.sperrkacheln(KE.szene(), KE.platziere(KE.szene()))].sort().join(),
  );
  await seite.click("#eigenschaften button.deckkraft-50");
  const werte = await Promise.all(uids.map(async (u) => (await h.eintrag(seite, u)).deckkraft));
  pruefe(
    werte.every((w) => w === 50),
    "Deckkraft 50 % für die ganze Auswahl",
  );
  const sperrenNachher = await seite.evaluate(() =>
    [...KE.sperrkacheln(KE.szene(), KE.platziere(KE.szene()))].sort().join(),
  );
  pruefe(sperrenVorher === sperrenNachher, "Deckkraft ändert die Kollision nicht");
  await seite.keyboard.press("Control+d");
  const kopien = await h.auswahl(seite);
  const kopiewerte = await Promise.all(
    kopien.map(async (u) => (await h.eintrag(seite, u)).deckkraft),
  );
  pruefe(
    kopiewerte.length === 2 && kopiewerte.every((w) => w === 50),
    "Duplizieren behält die Deckkraft",
  );
  await h.foto(seite, "zuschnitt-04-deckkraft");
  await seite.keyboard.press("Control+z");
  await seite.evaluate((u) => (KE.zustand.auswahl = new Set([u])) && KE.meldeAenderung(), uids[0]);
  await seite.click("#eigenschaften button.deckkraft-100");
  pruefe((await h.eintrag(seite, uids[0])).deckkraft === undefined, "100 % entfernt das Feld");
  await seite.keyboard.press("Control+z");
}

/** Rücklauf: Bericht nennt den Zuschnitt und schlägt nach drei Stellen einen Katalogeintrag vor. */
function ruecklauf(ausgabe, daten, pruefe) {
  pruefe(
    /Zuschnitt: cr7Viehgatter .* beschnitten auf 8 × 32: links 0, oben 0, rechts 56, unten 0/.test(
      ausgabe,
    ),
    "Bericht nennt den Zuschnitt",
  );
  pruefe(
    /Wiederholte Zuschnitte/.test(ausgabe),
    "Bericht schlägt einen eigenen Katalogeintrag vor",
  );
  // In der Karte, die gerade offen war (seit Editor 1.4 der Dachboden).
  const posten = daten.szenen.flatMap((s) =>
    (s.nachher.objekte || []).filter((o) => o.moebel === GATTER && o.zuschnitt),
  );
  pruefe(posten.length === 3, "Datei trägt drei beschnittene Pfosten");
  pruefe(
    posten.filter((o) => o.deckkraft === 50).length === 2 &&
      /Deckkraft: cr7Viehgatter .*100 → 50 %/.test(ausgabe),
    "Deckkraft in Datei und Bericht",
  );
}

module.exports = { zuschnitt, ruecklauf };
