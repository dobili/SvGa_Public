/*
 * Teil des Oberflächentests (editor.test.cjs) für „Änderungen laden“ (Editor 1.3.2, Frage des
 * Autors, 16.11.2026): Eine heruntergeladene Änderungsdatei lässt sich wieder öffnen.
 */
"use strict";
const fs = require("fs");
const path = require("path");

/**
 * „Änderungen laden“ (1.3.2): Datei herunterladen, alles verwerfen, Datei über den Knopf wieder
 * öffnen; danach ist die Änderungsdatei bis auf den Zeitstempel dieselbe.
 */
async function laden(seite, arbeit, pruefe) {
  const vorher = await seite.evaluate(() => KE.aenderungen());
  const datei = path.join(arbeit, "laden.json");
  fs.writeFileSync(datei, JSON.stringify(vorher));
  await seite.evaluate(() => KE.allesVerwerfen());
  pruefe(await seite.evaluate(() => KE.geaenderteDateien().length === 0), "Verwerfen leert alles");
  const wahl = seite.waitForEvent("filechooser");
  await seite.click("#laden");
  await (await wahl).setFiles(datei);
  await seite.waitForFunction((n) => KE.geaenderteDateien().length === n, vorher.szenen.length);
  const nachher = await seite.evaluate(() => KE.aenderungen());
  const ohneZeit = (d) =>
    JSON.stringify({
      ...d,
      zeitstempel: "",
      szenen: [...d.szenen].sort((a, b) => a.datei.localeCompare(b.datei)),
    });
  pruefe(ohneZeit(nachher) === ohneZeit(vorher), "Änderungen laden stellt denselben Stand her");
}

module.exports = { laden };
