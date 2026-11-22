/*
 * Teil des Oberflächentests (editor.test.cjs) für Editor 1.8: Figuren fein verschieben (Wunsch des
 * Autors, 22.11.2026). Im Diner: hector mit Pfeil 1 Pixel nach rechts, mit Umschalt 4 Pixel nach
 * oben, mehrmals bis zur Grenze −8; das Feld bleibt, nur das Bild rückt. „Versatz zurücksetzen“
 * stellt es wieder aufs Feld. Für den sitzenden LKW-Fahrer auf dem Hocker rechnet der Editor die
 * Lage auf dem Sitzmöbel wie die App (sitzen.js).
 */
"use strict";
const h = require("./hilfen.cjs");

/** Wählt hector (Figur des Diners) allein. */
const waehleHector = (seite) =>
  seite.evaluate(() => {
    const f = KE.szene().figuren.find((e) => e.name === "hector");
    KE.zustand.auswahl = new Set([f._uid]);
    KE.meldeAenderung();
  });

/** Versatz, Feld und Lage der Markierung von hector. */
const lage = (seite) =>
  seite.evaluate(() => {
    const f = KE.szene().figuren.find((e) => e.name === "hector");
    const m = KE.markierungen(KE.szene()).find((e) => e.name === "hector");
    return { versatz: f.versatz || null, feld: f.feld.join(","), x: m.x, y: m.y };
  });

async function figurversatz(seite, pruefe) {
  await seite.click(`.kartenknopf[data-datei="${h.KARTE}"]`);
  await seite.waitForTimeout(200);
  await waehleHector(seite);
  const vorher = await lage(seite);
  await seite.keyboard.press("ArrowRight");
  await seite.keyboard.press("Shift+ArrowUp");
  let jetzt = await lage(seite);
  pruefe(String(jetzt.versatz) === "1,-4", "Pfeil 1 px, Umschalt+Pfeil 4 px als versatz der Figur");
  pruefe(jetzt.feld === vorher.feld, "Das Feld der Figur bleibt beim feinen Verschieben");
  pruefe(jetzt.x === vorher.x + 1 && jetzt.y === vorher.y - 4, "Das Bild rückt mit dem Versatz");
  await seite.keyboard.press("Shift+ArrowUp");
  await seite.keyboard.press("Shift+ArrowUp");
  jetzt = await lage(seite);
  pruefe(String(jetzt.versatz) === "1,-8", "Der Versatz endet bei −8 (halbe Kachel)");
  await seite.click("#eigenschaften button.versatz-zurueck");
  jetzt = await lage(seite);
  pruefe(jetzt.versatz === null && jetzt.x === vorher.x, "„Versatz zurücksetzen“ stellt aufs Feld");
  const sitz = await seite.evaluate(() => {
    const b = KE.szene().belebung.find((e) => e.name === "lkwFahrer");
    const m = KE.markierungen(KE.szene()).find((e) => e.name === "lkwFahrer");
    return { lage: KE.sitzlage(b.feld), ohneBild: KE.sitzverschiebung(m, { naturalWidth: 32 }, false) };
  });
  pruefe(
    sitz.lage !== null && sitz.ohneBild.dy === sitz.lage.dy - 4,
    "Sitzende: Lage auf dem Hocker wie die App, ohne Sitzbild 4 Pixel Hub (6 × 2/3)",
  );
}

module.exports = { figurversatz };
