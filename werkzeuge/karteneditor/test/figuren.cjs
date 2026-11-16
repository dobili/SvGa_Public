/*
 * Teile des Oberflächentests (editor.test.cjs) für Editor 1.2: Figuren und stehende Statisten als
 * Hindernis in der Kollisionsanzeige (bedingte gestrichelt), Figuren und Belebung löschen (mit
 * Rückfrage) und kopieren (Strg+D), Varianten als eigene Gruppe der Kartenliste und Bodenkacheln,
 * die trotz „Umgebung sperren“ anwählbar bleiben, wenn sie auf einer Treppe liegen.
 *
 * Für den Rücklauf bleibt im Diner eine gelöschte Figur (hector) stehen: Der Bericht muss warnen,
 * weil ihr Gespräch (Ink-Knoten maple-falls-diner.hector) sie braucht.
 */
"use strict";
const h = require("./hilfen.cjs");

/** Wählt genau einen Eintrag (Objekt oder Markierung) über seine uid. */
function waehle(seite, uid) {
  return seite.evaluate((u) => {
    KE.zustand.auswahl = new Set([u]);
    KE.meldeAenderung();
  }, uid);
}

/** uid der ersten Markierung einer Liste mit diesem Namen. */
const markierung = (seite, liste, name) =>
  seite.evaluate(([l, n]) => KE.szene()[l].find((e) => e.name === n)._uid, [liste, name]);

const anzahl = (seite, liste) => seite.evaluate((l) => (KE.szene()[l] || []).length, liste);

async function hindernisse(seite, pruefe) {
  await seite.click(`.kartenknopf[data-datei="${h.KARTE}"]`);
  await seite.waitForTimeout(200);
  const r = await seite.evaluate(() => {
    const s = KE.szene();
    const gesperrt = KE.sperrkacheln(s, KE.platziere(s));
    return {
      hector: gesperrt.has(s.figuren.find((f) => f.name === "hector").feld.join()),
      bedingt: [...KE.figurensperren(s).bedingt.values()],
      dialog: KE.zustand.nachDatei[KE.zustand.datei].figurangaben.hector?.dialog,
    };
  });
  pruefe(r.hector, "Figur hector sperrt ihre Kachel");
  pruefe(r.bedingt.includes("lkwFahrer"), `Statist mit Tageszeit gestrichelt (${r.bedingt})`);
  pruefe(r.dialog === "maple-falls-diner.hector", "Paket kennt den Dialog der Figur");
  // Carla steht nur bis zum Ende von Akt 1 da (orte.json „wenn“): gestrichelt, nicht fest.
  const carla = await seite.evaluate(() => {
    const s = KE.szene();
    const vorher = KE.sperrkacheln(s, KE.platziere(s));
    const y = s.raster.findIndex((z, i) =>
      [...z].some((c, x) => c === "." && !vorher.has(x + "," + i)),
    );
    const x = [...s.raster[y]].findIndex((c, i) => c === "." && !vorher.has(i + "," + y));
    KE.schritt("Test", [KE.zustand.datei], () =>
      s.figuren.push({ name: "carla", feld: [x, y], _uid: KE.neueUid() }),
    );
    return {
      fest: KE.sperrkacheln(s, KE.platziere(s)).has(x + "," + y),
      bedingt: KE.figurensperren(s).bedingt.get(x + "," + y),
    };
  });
  pruefe(!carla.fest && carla.bedingt === "carla", "Figur mit Bedingung nur gestrichelt");
  await seite.evaluate(() => KE.schalte("kollision", true));
  await h.foto(seite, "14-figuren-kollision");
  await seite.evaluate(() => KE.schalte("kollision", false));
  await seite.keyboard.press("Control+z");
}

async function loeschenUndKopieren(seite, pruefe) {
  const hector = await markierung(seite, "figuren", "hector");
  await waehle(seite, hector);
  seite.once("dialog", (d) => d.dismiss());
  await seite.keyboard.press("Delete");
  pruefe((await anzahl(seite, "figuren")) === 1, "Abbrechen der Rückfrage lässt die Figur stehen");
  await seite.keyboard.press("Control+d");
  const kopie = await seite.evaluate(() => KE.szene().figuren.map((f) => f.feld.join()));
  pruefe(kopie.length === 2 && kopie[1] === "7,3", `Strg+D kopiert die Figur daneben (${kopie})`);
  await seite.keyboard.press("Control+z");
  const kellnerin = await markierung(seite, "belebung", "kellnerin");
  await waehle(seite, kellnerin);
  await seite.click("#eigenschaften button.duplizieren");
  const neu = await seite.evaluate(() => KE.kopie(KE.szene().belebung.at(-1)));
  pruefe(
    neu.name === "kellnerin" && neu.eigenschaften.von === "2,4" && neu.eigenschaften.bis === "10,4",
    `Kopie der Belebung mit verschobenem Laufweg (${neu.eigenschaften.von} bis ${neu.eigenschaften.bis})`,
  );
  await seite.keyboard.press("Control+z");
  await waehle(seite, hector);
  let frage = "";
  seite.once("dialog", (d) => {
    frage = d.message();
    d.accept();
  });
  await seite.keyboard.press("Delete");
  pruefe(
    (await anzahl(seite, "figuren")) === 0 && frage.includes("Dialog maple-falls-diner.hector"),
    "Entf löscht die Figur nach Rückfrage mit Dialog",
  );
  await seite.keyboard.press("Escape");
}

async function varianten(seite, pruefe) {
  const gruppen = await seite.$$eval("#kartenliste summary", (s) => s.map((x) => x.textContent));
  pruefe(
    gruppen.at(-1).startsWith("Varianten"),
    `Varianten als eigene Gruppe (${gruppen.join(", ")})`,
  );
  await seite.click("#kartenliste summary >> text=Varianten"); // Gruppe aufklappen
  await seite.click(`.kartenknopf[data-datei="varianten/${h.VARIANTE}"]`);
  await seite.waitForTimeout(200);
  pruefe(
    (await seite.evaluate(() => KE.szene().variante)) === "b",
    "Variante öffnet sich im Editor",
  );
  await h.foto(seite, "15-variante");
}

/** Im Dachboden nach dem Treppenabgang (kollision.cjs): Dielen trotz „Umgebung sperren“ anwählbar. */
async function bodenkachelnTrotzSperre(seite, pruefe) {
  await seite.evaluate(() => KE.schalte("umgebungSperren", true));
  const r = await seite.evaluate(() => {
    const alle = KE.platziere(KE.szene());
    const diele = alle.find((s) => s.kennung === "bkDielen");
    const getroffen = KE.trefferAn(diele.x + 8, diele.y + 8).map((t) => t.uid);
    return { diele: getroffen.includes(diele.uid), umgebung: diele.umgebung };
  });
  pruefe(r.umgebung && r.diele, "Bodenkachel auf der Treppe bleibt trotz Sperre anwählbar");
  await seite.evaluate(() => KE.schalte("umgebungSperren", false));
}

module.exports = { hindernisse, loeschenUndKopieren, varianten, bodenkachelnTrotzSperre };
