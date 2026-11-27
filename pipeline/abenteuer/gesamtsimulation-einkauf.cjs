// Einkauf der beiden Spieler der Wirtschaftsauswertung (gesamtsimulation-wirtschaft.cjs, aus ihr
// herausgelöst wegen der Größengrenze): was sie im Laden kaufen, was der sparsame später nachholt
// und welche leichte Karte er vor einem Clubkampf kaufen würde.
//
// Der sparsame Spieler sammelt jede dauerhafte Karte einmal, sobald danach noch RUECKLAGE Münzen
// bleiben, und kauft die Gegenstände, ohne die der Weg der Zeitachse nicht ginge (WEG_GEGENSTAENDE).
// Der verschwenderische kauft mit `kaufe` alles, was er bezahlen kann; der normale liegt dazwischen
// (`kaufeNormal`).
"use strict";

const RUECKLAGE = 50;
/**
 * Gegenstände, die der Weg der Zeitachse voraussetzt: Die Simulation bekommt sie im Laden geschenkt
 * und verdient mit ihnen (Laterne: Steinbruch, Umkleide und Goldmine, `wenn: hatLaterne`;
 * Monatskarte: Rückkehr mit der Bahn zu offenen Quests, gesamtsimulation-rueckkehr.cjs). Wer diese
 * Münzen bekommt, hat sie also gekauft; der sparsame Spieler zahlt sie beim ersten Laden, in dem es
 * reicht (Befund vom 26.11.2026: vorher zählten die Einnahmen, nicht aber die Ausgaben).
 */
const WEG_GEGENSTAENDE = ["laterne", "monatskarte"];

/** Legt eine Karte oder einen Gegenstand in den Besitz des Spielers der Auswertung. */
function nimmKarte(sp, kennung) {
  sp.karten[kennung] = (sp.karten[kennung] || 0) + 1;
}

/** Kauft eine Ware, wenn bezahlbar und (dauerhafte Karte, Gegenstand) noch nicht vorhanden. */
function kaufe(welt, sp, ware) {
  const karte = welt.karten[ware.kennung];
  const schonDa =
    (ware.art === "gegenstand" || karte?.art === "dauerhaft") &&
    sp.karten[ware.kennung];
  if (schonDa || sp.muenzen < ware.preis) return false;
  sp.muenzen -= ware.preis;
  nimmKarte(sp, ware.kennung);
  sp.kaeufe.push({ kennung: ware.kennung, ort: sp.hier });
  return true;
}

/** Sparsam: dauerhafte Karten einmal, nur wenn danach noch die Rücklage bleibt. */
function sammle(welt, sp, ware) {
  if (WEG_GEGENSTAENDE.includes(ware.kennung)) return kaufe(welt, sp, ware);
  if (
    welt.karten[ware.kennung]?.art !== "dauerhaft" ||
    sp.muenzen - ware.preis < RUECKLAGE
  )
    return;
  kaufe(welt, sp, ware);
}

/** Rücklage des normalen Spielers bei Gegenständen, die der Weg nicht braucht (Fahrrad, Tasche). */
const RUECKLAGE_GEGENSTAND = 100;
/** Rücklage des normalen Spielers bei dauerhaften Karten. */
const RUECKLAGE_NORMAL = 20;

/**
 * Normal (Balance 27.11.2026): kauft jede dauerhafte Karte, sobald danach RUECKLAGE_NORMAL bleibt,
 * hält eine Verbrauchskarte für den nächsten Clubkampf bereit (kauft eine, wenn er keine hat) und
 * gönnt sich einen Gegenstand, wenn danach RUECKLAGE_GEGENSTAND bleibt. Beispiel: 130 Münzen im
 * Eisenwarenladen → Fahrrad für 120 nicht (10 blieben), Laterne für 60 ja (Weg), „Was droht?“ ja.
 */
function kaufeNormal(welt, sp, ware) {
  if (WEG_GEGENSTAENDE.includes(ware.kennung)) return kaufe(welt, sp, ware);
  const karte = welt.karten[ware.kennung];
  const rest = sp.muenzen - ware.preis;
  if (ware.art === "gegenstand") {
    if (rest >= RUECKLAGE_GEGENSTAND) kaufe(welt, sp, ware);
    return;
  }
  if (karte?.art === "dauerhaft") {
    if (rest >= RUECKLAGE_NORMAL) kaufe(welt, sp, ware);
    return;
  }
  const verbrauch = Object.entries(sp.karten).some(
    ([k, n]) => n > 0 && welt.karten[k]?.art === "verbrauch",
  );
  if (karte?.art === "verbrauch" && karte.stufe !== "stark" && !verbrauch)
    kaufe(welt, sp, ware);
}

/**
 * Sparsam mit Monatskarte: Dauerhafte Karten, die in einem früheren Laden nicht reichten, holt er
 * nach, sobald das Geld reicht (mit der Bahn zurück, wie die Rückkehr der Simulation). Beispiel:
 * Startwert 2 kam mit 160 Münzen nach Crossroads, das Erkennungsbild kostet 180; ohne Nachholen
 * blieben ihm am Ende 490 Münzen und eine Karte fehlte (26.11.2026).
 */
function holeKartenNach(welt, sp) {
  if (!sp.karten.monatskarte) return;
  for (const l of sp.laedenBesucht)
    for (const w of welt.laeden.find((x) => x.kennung === l).angebot)
      if (!sp.karten[w.kennung]) sammle(welt, sp, w);
}

/** Billigste leichte Karte in den bisher besuchten Läden (die der sparsame Spieler kaufen würde). */
function billigsteLeichte(welt, sp) {
  const waren = [...sp.laedenBesucht].flatMap(
    (l) => welt.laeden.find((x) => x.kennung === l).angebot,
  );
  return waren
    .filter(
      (w) => w.art === "karte" && welt.karten[w.kennung]?.stufe === "leicht",
    )
    .sort((a, b) => a.preis - b.preis)[0];
}

module.exports = {
  nimmKarte,
  kaufe,
  kaufeNormal,
  sammle,
  holeKartenNach,
  billigsteLeichte,
};
