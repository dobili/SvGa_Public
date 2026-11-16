/*
 * Teil des Oberflächentests (editor.test.cjs): Kollision bei Möbeln abseits des Rasters
 * (Fehlerbericht des Autors, 16.11.2026: Nach dem Verschieben einer Tischgruppe passten die gelben
 * Felder nicht mehr, und „Kollision bearbeiten“ traf die falschen Kacheln). Ein Möbel wird um
 * 5 Pixel verschoben; die Anzeige zeigt seine Sperrflächen pixelgenau, und ein Klick in eine
 * gesperrte Maskenkachel gibt genau diese frei.
 */
"use strict";
const h = require("./hilfen.cjs");
const { sperrendesObjekt } = require("./kollision.cjs");
const K = 16;

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

async function versatz(seite, pruefe) {
  await seite.keyboard.press("Escape");
  // Ein Möbel mit grober, sperrender Maske: Die feinen Katalogmasken (KARTENREGELN 10.88)
  // bearbeitet der Editor in Zellen, dieser Test prüft die Kachelmaske.
  const fein = await seite.evaluate(() =>
    KE.platziere(KE.szene())
      .filter((s) => s.angabe.maske_fein || !KE.maskenfelder(s.angabe).length)
      .map((s) => s.uid),
  );
  const a = await sperrendesObjekt(seite, fein);
  await seite.mouse.click(a.p.x, a.p.y);
  for (let i = 0; i < 5; i++) await seite.keyboard.press("ArrowRight");
  const lage = await seite.evaluate((u) => {
    const sz = KE.szene();
    const st = KE.platziere(sz).find((s) => s.uid === u);
    const felder = KE.maskenfelder(st.angabe);
    const anzeige = KE.sperranzeige(sz, KE.platziere(sz));
    const da = felder.every(([x, y]) =>
      anzeige.flaechen.some(([px, py]) => px === st.x + x * 16 && py === st.y + y * 16),
    );
    return { x: st.x, y: st.y, feld: felder[0], da };
  }, a.uid);
  pruefe(lage.x % K !== 0, "Möbel steht nach fünf Pfeildrücken abseits des Rasters");
  pruefe(lage.da, "Sperrflächen sitzen pixelgenau unter dem verschobenen Möbel");
  await seite.click("#eigenschaften button.kollisionbearbeiten");
  // Klick in die rechte Hälfte der ersten gesperrten Maskenkachel (dort lag früher die Nachbarkachel).
  const [fx, fy] = lage.feld;
  const p = await schirm(seite, lage.x + fx * K + K - 3, lage.y + fy * K + K / 2);
  await seite.mouse.click(p.x, p.y);
  const e = await h.eintrag(seite, a.uid);
  const zeichen = Array.isArray(e.maske) ? (e.maske[fy] || "")[fx] : null;
  pruefe(
    zeichen === ".",
    `Klick gibt genau die getroffene Maskenkachel frei (${JSON.stringify(e.maske)})`,
  );
  await seite.keyboard.press("Escape");
  await seite.keyboard.press("Control+z");
  await seite.keyboard.press("Control+z");
}

module.exports = { versatz };
