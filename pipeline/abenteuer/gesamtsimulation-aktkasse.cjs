// Kasse je Akt für die Wirtschaftsauswertung (gesamtsimulation-wirtschaft.cjs): Münzen am Anfang,
// Einnahmen, Ausgaben und Stand am Ende jedes Akts, je Spieler (Balance-Prüfung 27.11.2026).
//
// Warum eigene Datei: Die Ortstabelle zeigt nur Ankunft und Abreise je Ort; ob man in einem Akt zu
// reich wird oder knapp hängt, sieht man erst an der Summe je Akt. Zugleich steht hier die
// Zuordnung der Orte zu den Akten, die auch die Wirtschaft braucht (Größengrenze der Datei).
//
// Akt eines Ortes: Hauptorte nach der Story-Bibel (AKT, AKT4); Nebenorte (Kürbishof, Lockport,
// Sternwarte …) zählen zum Akt, in dem der Spieler gerade ist, der Abspann beginnt den Epilog (5).
"use strict";

const AKT = {
  mapleFalls: 1,
  wegMapleCedar: 1,
  cedarCreek: 1,
  wegCedarRiverton: 2,
  riverton: 2,
  erinnerungLondon: 2,
  wegRivertonIronwood: 2,
  ironwood: 2,
  wegIronwoodSilicon: 3,
  siliconBay: 3,
  wegSiliconDelacroix: 3,
  portDelacroix: 3,
  wegDelacroixDesert: 3,
  desertSprings: 3,
};
/** Hauptorte von Akt 4 (Story-Bibel); Nebenorte fehlen hier absichtlich. */
const AKT4 = new Set([
  "wegDesertSummit",
  "summitCity",
  "wegSummitCrossroads",
  "crossroads",
  "wegCrossroadsPinewood",
  "pinewoodCamp",
  "wegPinewoodGhost",
  "ghostTown",
  "wegGhostCapital",
  "capitalArena",
]);
const EPILOG = 5;
/** Quellen der Einnahmen (verdiene in gesamtsimulation-regeln.cjs, dazu die erste Nadel). */
const QUELLEN = ["strasse", "runde", "quest", "fund", "nadel"];

/** Akt eines Ortes für Läden und Ortstabelle: bekannte Orte der Akte 1 bis 3, sonst 4. */
const akt = (ort) => AKT[ort] || 4;

/** Das Kassenbuch des laufenden Akts (legt es beim ersten Zugriff mit dem Stand an). */
function kasse(sp) {
  sp.jeAkt = sp.jeAkt || {};
  const lauf = sp.aktLauf || 1;
  sp.jeAkt[lauf] = sp.jeAkt[lauf] || {
    anfang: sp.muenzen,
    rein: 0,
    quellen: {},
  };
  return sp.jeAkt[lauf];
}

/** Ortswechsel: Ein Hauptort eines späteren Akts schaltet den laufenden Akt weiter. */
function betreteOrt(sp, ort) {
  const neu = AKT[ort] || (AKT4.has(ort) ? 4 : 0);
  if (neu > (sp.aktLauf || 1) && (sp.aktLauf || 1) < EPILOG) sp.aktLauf = neu;
  kasse(sp);
}

/** Abspann: Danach zählt alles zum Epilog. */
function beginneEpilog(sp) {
  sp.aktLauf = EPILOG;
  kasse(sp);
}

/** Eine Einnahme im laufenden Akt verbuchen (Ausgaben ergeben sich aus dem Stand). */
function verbucheEinnahme(sp, anzahl, quelle) {
  const k = kasse(sp);
  k.rein += anzahl;
  k.quellen[quelle] = (k.quellen[quelle] || 0) + anzahl;
}

/** Je Akt: Anfang, Einnahmen, Ausgaben, Ende; Ende ist der Anfang des nächsten Akts. */
function aktbilanz(sp) {
  const akte = Object.keys(sp.jeAkt || {})
    .map(Number)
    .sort((a, b) => a - b);
  return akte.map((a, i) => {
    const k = sp.jeAkt[a];
    const ende =
      i + 1 < akte.length ? sp.jeAkt[akte[i + 1]].anfang : sp.muenzen;
    return {
      akt: a,
      anfang: k.anfang,
      rein: k.rein,
      quellen: k.quellen,
      raus: k.anfang + k.rein - ende,
      ende,
    };
  });
}

const spanne = (werte) =>
  Math.min(...werte) === Math.max(...werte)
    ? `${werte[0]}`
    : `${Math.min(...werte)}–${Math.max(...werte)}`;

/** Tabelle der Kasse je Akt über alle Startwerte (Spannen). */
function kassentabelle(laeufe) {
  const zeilen = [
    "| Akt | Münzen am Anfang | Einnahmen | davon Straße / Runde / Quest / Fund / Nadel | Ausgaben | am Ende |",
    "| --- | --- | --- | --- | --- | --- |",
  ];
  const quelle = (je, q) => spanne(je.map((x) => x.quellen[q] || 0));
  const bilanzen = laeufe.map(aktbilanz);
  for (const b of bilanzen[0]) {
    const je = bilanzen
      .map((x) => x.find((y) => y.akt === b.akt))
      .filter(Boolean);
    const name = b.akt === EPILOG ? "nach dem Abspann" : b.akt;
    const wert = (f) => spanne(je.map((x) => x[f]));
    const quellen = QUELLEN.map((q) => quelle(je, q)).join(" / ");
    zeilen.push(
      `| ${name} | ${wert("anfang")} | ${wert("rein")} | ${quellen} | ${wert("raus")} | ${wert("ende")} |`,
    );
  }
  return zeilen;
}

module.exports = {
  akt,
  betreteOrt,
  beginneEpilog,
  verbucheEinnahme,
  kassentabelle,
  spanne,
};
