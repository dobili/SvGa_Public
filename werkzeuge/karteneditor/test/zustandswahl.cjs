/*
 * Teil des Oberflächentests (editor.test.cjs) für Editor 1.9: Zustand einer Figur wählen (Wunsch
 * des Autors, 23.11.2026). Im Diner: hector bekommt „Boden“ (sitzt am Boden ohne Hub), dann
 * „Zurück auf Standard“; der sitzende LKW-Fahrer bekommt „Stehen“ und steht danach. Jede Wahl ist
 * ein Schritt (Rückgängig) und steht im Eintrag der Szene. Dazu die getrennten Knöpfe „Figuren“
 * (Taste P) und „Markierungen“ (Taste M): beim Öffnen Figuren an, Markierungen aus.
 */
"use strict";
const h = require("./hilfen.cjs");

/** Wählt eine Markierung nach Liste und Name allein. */
const waehle = (seite, liste, name) =>
  seite.evaluate(
    ([l, n]) => {
      const e = KE.szene()[l].find((x) => x.name === n);
      KE.zustand.auswahl = new Set([e._uid]);
      KE.meldeAenderung();
    },
    [liste, name],
  );

/** Zustand, Standbild und ob die Person sitzt, für eine Markierung. */
const stand = (seite, liste, name) =>
  seite.evaluate(
    ([l, n]) => {
      const m = KE.markierungen(KE.szene()).find((x) => x.name === n && x.liste === l);
      return { ...KE.zustandVon(l, m.eintrag), sitzt: KE.sitztJetzt(m) };
    },
    [liste, name],
  );

async function zustandswahl(seite, pruefe) {
  await seite.click(`.kartenknopf[data-datei="${h.KARTE}"]`);
  await seite.waitForTimeout(200);
  await ansichtsknoepfe(seite, pruefe);
  await waehle(seite, "figuren", "hector");
  pruefe(await seite.isVisible("#eigenschaften .zustandsfeld"), "Zustandsfeld bei einer Figur");
  await seite.click("#eigenschaften button.zustand-sitzboden");
  let jetzt = await stand(seite, "figuren", "hector");
  pruefe(jetzt.zustand === "sitzboden" && jetzt.sitzt, "„Boden“ setzt zustand und lässt sitzen");
  const hub = await seite.evaluate(() => {
    const m = KE.markierungen(KE.szene()).find((x) => x.name === "hector");
    return KE.sitzverschiebung(m, { naturalWidth: 32 }, false);
  });
  pruefe(hub.dy >= 0, "Am Boden ohne Hub");
  await seite.click("#eigenschaften button.zustand-zurueck");
  jetzt = await stand(seite, "figuren", "hector");
  pruefe(jetzt.zustand === null && !jetzt.sitzt, "„Zurück auf Standard“ entfernt den Zustand");
  await waehle(seite, "belebung", "lkwFahrer");
  await seite.click("#eigenschaften button.zustand-stehen");
  jetzt = await stand(seite, "belebung", "lkwFahrer");
  pruefe(jetzt.zustand === "stehen" && !jetzt.sitzt, "Sitzender Statist steht mit „Stehen“");
  // Bettdecke (Editor 1.9.1): Kopfseite aus dem Namen wie die App, gespiegelt vertauscht.
  const kopf = await seite.evaluate(() => [
    KE.kopfseiteDesBetts("rv5BettKopfLinks", false),
    KE.kopfseiteDesBetts("rv5BettKopfLinks", true),
    KE.kopfseiteDesBetts("rv5Bett", false),
  ]);
  pruefe(kopf.join(",") === "links,rechts,rechts", "Kopfseite des Betts aus dem Namen");
  await seite.keyboard.press("Control+z");
  jetzt = await stand(seite, "belebung", "lkwFahrer");
  pruefe(jetzt.zustand === null && jetzt.sitzt, "Rückgängig stellt die Regel wieder her");
}

/** Knöpfe „Figuren“ und „Markierungen“: Vorgabe, Tasten, was sichtbar und anwählbar ist. */
async function ansichtsknoepfe(seite, pruefe) {
  const zaehle = () =>
    seite.evaluate(() => {
      const marken = KE.sichtbareMarken(KE.szene());
      const s = KE.zustand.schalter;
      return {
        figuren: s.figuren,
        markierungen: s.markierungen,
        alle: marken.length,
        personen: marken.filter(KE.istFigurenmarke).length,
      };
    });
  let jetzt = await zaehle();
  pruefe(jetzt.figuren && !jetzt.markierungen, "Vorgabe: Figuren an, Markierungen aus");
  pruefe(jetzt.alle === jetzt.personen && jetzt.personen > 0, "Nur Figuren und Tiere anwählbar");
  await seite.click('[data-schalter="markierungen"]');
  jetzt = await zaehle();
  pruefe(jetzt.markierungen && jetzt.alle > jetzt.personen, "Markierungen zeigen auch Auslöser");
  await seite.click('[data-schalter="figuren"]');
  await seite.click('[data-schalter="markierungen"]');
  jetzt = await zaehle();
  pruefe(!jetzt.figuren && jetzt.alle === 0, "Beide aus: keine Figuren, keine Markierungen");
  await seite.click('[data-schalter="figuren"]');
  pruefe((await zaehle()).figuren, "Figuren wieder an");
}

module.exports = { zustandswahl, ansichtsknoepfe };
