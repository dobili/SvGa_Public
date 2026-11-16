/*
 * Teile des Oberflächentests (editor.test.cjs) für Editor 1.7: Blickrichtung stehender Figuren und
 * Statisten (Rückmeldung R008, js/blick.js). Im Diner: hector nach links, hector und die Kellnerin
 * zusammen (Strg-Mehrfachauswahl) nach rechts, „Vorgabe“ entfernt die Angabe wieder, der sitzende
 * LKW-Fahrer bekommt keine Auswahl. Das Standbild der Richtung kommt aus dem Paket.
 *
 * Für den Rücklauf behält die Kellnerin „rechts“: Der Bericht nennt die Änderung, die Szene trägt
 * eigenschaften.blick.
 */
"use strict";
const fs = require("fs");
const h = require("./hilfen.cjs");

/** Wählt die Markierungen mit diesen Namen (Figuren und Belebung) wie Strg+Klick. */
function waehle(seite, namen) {
  return seite.evaluate((n) => {
    const s = KE.szene();
    const uids = [...s.figuren, ...s.belebung].filter((e) => n.includes(e.name)).map((e) => e._uid);
    KE.zustand.auswahl = new Set(uids);
    KE.meldeAenderung();
  }, namen);
}

/** Blickrichtung (gesetzt oder undefined) einer Figur oder eines Statisten der aktuellen Szene. */
const blick = (seite, name) =>
  seite.evaluate((n) => {
    const s = KE.szene();
    const f = s.figuren.find((e) => e.name === n);
    return f ? f.blick : s.belebung.find((e) => e.name === n).eigenschaften?.blick;
  }, name);

async function blickrichtung(seite, pruefe) {
  await seite.click(`.kartenknopf[data-datei="${h.KARTE}"]`);
  await seite.waitForTimeout(200);
  await waehle(seite, ["hector"]);
  await seite.click("#eigenschaften .blickfeld button.blick-links");
  pruefe((await blick(seite, "hector")) === "links", "Blick-Knopf setzt blick an der Figur");
  const bild = await seite.waitForFunction(
    () => {
      const m = KE.markierungen(KE.szene()).find((e) => e.name === "hector");
      const ctx = document.createElement("canvas").getContext("2d");
      return KE.zeichnePerson(ctx, m, 16);
    },
    null,
    { timeout: 5000 },
  );
  pruefe(await bild.jsonValue(), "Vorschau zeichnet das Standbild der Richtung");
  await waehle(seite, ["hector", "kellnerin"]);
  await seite.click("#eigenschaften .blickfeld button.blick-rechts");
  pruefe(
    (await blick(seite, "hector")) === "rechts" && (await blick(seite, "kellnerin")) === "rechts",
    "Mehrfachauswahl: beide schauen nach rechts (Statist in eigenschaften.blick)",
  );
  await h.foto(seite, "30-blick");
  await waehle(seite, ["hector"]);
  await seite.click("#eigenschaften .blickfeld button.blick-vorgabe");
  pruefe((await blick(seite, "hector")) === undefined, "Vorgabe entfernt blick");
  await waehle(seite, ["lkwFahrer"]);
  pruefe(!(await seite.isVisible("#eigenschaften .blickfeld")), "Sitzende: keine Blickauswahl");
  await seite.keyboard.press("Escape");
}

/** Rücklauf: Bericht nennt die Blickänderung, die Szene im Testordner trägt sie. */
function ruecklauf(ausgabe, szenendatei, pruefe) {
  pruefe(/Blick \(belebung\): kellnerin Vorgabe → rechts/.test(ausgabe), "Bericht nennt den Blick");
  const szene = JSON.parse(fs.readFileSync(szenendatei, "utf8"));
  const kellnerin = szene.belebung.find((b) => b.name === "kellnerin");
  pruefe(kellnerin.eigenschaften.blick === "rechts", "Rücklauf schreibt eigenschaften.blick");
}

module.exports = { blickrichtung, ruecklauf };
