// Auswertung der Wirtschaft für die Gesamtsimulation (Aufruf mit --wirtschaft).
//
// Zweck: Münzen, Läden und Karten entlang des ganzen Weges prüfen, damit nach neuen Karten oder
// Preisen die Ziele aus dem Regelwerk (R17, R21 ff.; docs/spiel/11, Abschnitt 7) wieder geprüft
// werden können. Grundlage ist die Zeitachse eines Durchlaufs (Ortswechsel, Münzen aus
// Straßensiegen, Runden, Quests und Funden, Läden, Karten, erste Clubkämpfe). Auf ihr spielen zwei
// Spieler: der sparsame kauft eine leichte Karte erst, wenn der Clubkampf ohne Karte zweimal
// verloren ist. Außerdem sammelt er jede dauerhafte Karte einmal, sobald er sie mit einer
// Rücklage von RUECKLAGE Münzen bezahlen kann (der Autor wünscht viele Karten); Verbrauchskarten
// und Gegenstände kauft er nicht auf Vorrat. Der verschwenderische kauft in jedem Laden alles, was
// er bezahlen kann, und spielt im Clubkampf immer seine stärkste Karte.
//
// Annahmen (Auftrag mittel-1, 09.11.2026): Sieg gegen den Clubchef ohne Karte 40 %, mit leichter
// Karte 50 %, mit mittlerer 60 %, mit starker 75 %. Nadel nach R17: ohne Karte Gold, mit leichten
// Karten Silber, mit mittlerer oder starker Bronze. Die erste Nadel eines Clubs bringt 50 Münzen.
// Jeder Clubkampf wird WIEDERHOLUNGEN-mal ausgewürfelt (Zufall mit festem Startwert).
"use strict";

const WIEDERHOLUNGEN = 200;
const SIEG = { keine: 0.4, leicht: 0.5, mittel: 0.6, stark: 0.75 };
const RANG = { leicht: 1, mittel: 2, stark: 3 };
const VERSUCHE_OHNE_KARTE = 2;
const RUECKLAGE = 50;
const REST_HOECHSTENS = 400;
const HOECHSTENS_VERSUCHE = 30;
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
const akt = (ort) => AKT[ort] || 4;

/** Zufall mit festem Startwert (lineare Kongruenz), je Spieler und Durchlauf neu. */
function zufallMit(saat) {
  let s = saat;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

/** Kartenwaren aller Läden eines Ortes. */
function warenIn(welt, ort) {
  return welt.laeden.filter((l) => l.ort === ort).flatMap((l) => l.angebot);
}

function neuerSpieler(art) {
  return {
    art,
    muenzen: 0,
    karten: {},
    laedenBesucht: new Set(),
    clubs: [],
    orte: [],
    kaeufe: [],
    hier: null,
  };
}

function nimmKarte(sp, kennung) {
  sp.karten[kennung] = (sp.karten[kennung] || 0) + 1;
}

/** Kauft eine Ware, wenn bezahlbar und (dauerhafte Karte, Gegenstand) noch nicht vorhanden. */
function kaufe(welt, sp, ware) {
  const karte = welt.karten[ware.kennung];
  const schonDa =
    (ware.art === "gegenstand" || karte?.art === "dauerhaft") && sp.karten[ware.kennung];
  if (schonDa || sp.muenzen < ware.preis) return false;
  sp.muenzen -= ware.preis;
  nimmKarte(sp, ware.kennung);
  sp.kaeufe.push({ kennung: ware.kennung, ort: sp.hier });
  return true;
}

/** Sparsam: dauerhafte Karten einmal, nur wenn danach noch die Rücklage bleibt. */
function sammle(welt, sp, ware) {
  if (welt.karten[ware.kennung]?.art !== "dauerhaft" || sp.muenzen - ware.preis < RUECKLAGE) return;
  kaufe(welt, sp, ware);
}

/** Billigste leichte Karte in den bisher besuchten Läden (die der sparsame Spieler kaufen würde). */
function billigsteLeichte(welt, sp) {
  const waren = [...sp.laedenBesucht].flatMap(
    (l) => welt.laeden.find((x) => x.kennung === l).angebot,
  );
  return waren
    .filter((w) => w.art === "karte" && welt.karten[w.kennung]?.stufe === "leicht")
    .sort((a, b) => a.preis - b.preis)[0];
}

/** Die Karte, die der Spieler in diesem Versuch spielt (verbraucht sie, wenn nötig), oder null. */
function karteFuerVersuch(welt, sp, versuch) {
  const besitz = Object.entries(sp.karten).filter(([k, n]) => n > 0 && welt.karten[k]);
  if (sp.art === "sparsam" && versuch < VERSUCHE_OHNE_KARTE) return null;
  // Sparsam: nur leichte, dauerhafte zuerst; verschwenderisch: die stärkste, bei gleicher Stufe dauerhafte.
  const dauerhaft = (k) => (welt.karten[k].art === "dauerhaft" ? 0 : 1);
  const passend = besitz
    .filter(([k]) => sp.art !== "sparsam" || welt.karten[k].stufe === "leicht")
    .sort(
      (a, b) =>
        RANG[welt.karten[b[0]].stufe] - RANG[welt.karten[a[0]].stufe] ||
        dauerhaft(a[0]) - dauerhaft(b[0]),
    );
  let wahl = passend[0];
  if (!wahl && sp.art === "sparsam") {
    const ware = billigsteLeichte(welt, sp);
    if (ware && kaufe(welt, sp, ware)) wahl = [ware.kennung];
  }
  if (!wahl) return null;
  const karte = welt.karten[wahl[0]];
  if (karte.art === "verbrauch") sp.karten[wahl[0]]--;
  return karte;
}

/** Ein Clubkampf bis zum Sieg; Ergebnis: Versuche, Versuche mit Karte, Nadel, kaufbar. */
function clubkampf(welt, sp, begegnung, zufall, kartenErlaubt) {
  const leichtImBesitz = Object.entries(sp.karten).some(
    ([k, n]) => n > 0 && welt.karten[k]?.stufe === "leicht",
  );
  const ware = billigsteLeichte(welt, sp);
  const kaufbar = !kartenErlaubt || leichtImBesitz || (ware && sp.muenzen >= ware.preis);
  let mitKarte = 0;
  for (let v = 0; v < HOECHSTENS_VERSUCHE; v++) {
    const karte = kartenErlaubt ? karteFuerVersuch(welt, sp, v) : null;
    if (karte) mitKarte++;
    if (zufall() >= SIEG[karte ? karte.stufe : "keine"]) continue;
    const nadel = !karte ? 3 : karte.stufe === "leicht" ? 2 : 1;
    return { begegnung, versuche: v + 1, mitKarte, nadel, kaufbar };
  }
  return { begegnung, versuche: HOECHSTENS_VERSUCHE, mitKarte, nadel: 0, kaufbar };
}

/** Spielt eine Zeitachse mit einem Spieler ab; gibt seine Orte (Ankunft, Abreise) und Clubs zurück. */
function spiele(welt, zeitachse, art, saat, ersteNadel) {
  const sp = neuerSpieler(art),
    zufall = zufallMit(saat);
  let aktuell = null;
  for (const e of zeitachse) {
    if (e.art === "ort") {
      // Ankunft und Abreise gelten für den ersten Aufenthalt; spätere Rückwege zählen nicht.
      if (aktuell && aktuell.abreise === undefined) abreise(welt, sp, aktuell);
      sp.hier = e.ort;
      const bekannt = sp.orte.find((o) => o.ort === e.ort);
      aktuell = bekannt || {
        ort: e.ort,
        ankunft: sp.muenzen,
        bezahlbar: bezahlbar(welt, sp, e.ort),
      };
      if (!bekannt) sp.orte.push(aktuell);
    } else if (e.art === "muenzen") sp.muenzen += e.anzahl;
    else if (e.art === "karte") nimmKarte(sp, e.karte);
    else if (e.art === "laden") {
      sp.laedenBesucht.add(e.laden);
      const angebot = welt.laeden.find((l) => l.kennung === e.laden).angebot;
      for (const w of angebot)
        art === "verschwenderisch" ? kaufe(welt, sp, w) : sammle(welt, sp, w);
    } else if (e.art === "clubkampf") {
      const erlaubt = welt.kartenErlaubt[e.begegnung] !== false;
      const c = clubkampf(welt, sp, e.begegnung, zufall, erlaubt);
      sp.clubs.push(c);
      if (c.nadel) sp.muenzen += ersteNadel;
    }
  }
  if (aktuell && aktuell.abreise === undefined) abreise(welt, sp, aktuell);
  return sp;
}

function bezahlbar(welt, sp, ort) {
  return warenIn(welt, ort)
    .filter((w) => w.preis <= sp.muenzen)
    .map((w) => w.kennung);
}

function abreise(welt, sp, ort) {
  ort.abreise = sp.muenzen;
  ort.bezahlbarAbreise = bezahlbar(welt, sp, ort.ort);
  ort.karten = Object.entries(sp.karten).filter(([k, n]) => n > 0 && welt.karten[k]).length;
}

// ---------------------------------------------------------------- Bericht

const NADELNAME = ["keine", "Bronze", "Silber", "Gold"];
const spanne = (werte) =>
  Math.min(...werte) === Math.max(...werte)
    ? `${werte[0]}`
    : `${Math.min(...werte)}–${Math.max(...werte)}`;
const anteil = (n, von) => `${Math.round((100 * n) / von)} %`;

/** Clubkämpfe eines Spielers über alle Durchläufe und Wiederholungen zusammengefasst. */
function clubstatistik(laeufe) {
  const je = {};
  for (const sp of laeufe)
    for (const c of sp.clubs) (je[c.begegnung] = je[c.begegnung] || []).push(c);
  return Object.entries(je).map(([b, cs]) => ({
    begegnung: b,
    silberOderBesser: cs.filter((c) => c.nadel >= 2).length / cs.length,
    versuche: cs.reduce((x, c) => x + c.versuche, 0) / cs.length,
    mitKarte: cs.reduce((x, c) => x + c.mitKarte, 0) / cs.length,
    kaufbar: cs.filter((c) => c.kaufbar).length / cs.length,
    schlechteste: Math.min(...cs.map((c) => c.nadel)),
  }));
}

function ortstabelle(welt, ersteLaeufe) {
  const kopf =
    "| Ort | Akt | Münzen Ankunft | Münzen Abreise | im Laden bezahlbar (Ankunft / Abreise) | Karten |";
  const zeilen = [kopf, "| --- | --- | --- | --- | --- | --- |"];
  for (const o of ersteLaeufe[0].orte) {
    const je = ersteLaeufe.map((sp) => sp.orte.find((x) => x.ort === o.ort)).filter(Boolean);
    const anzahl = warenIn(welt, o.ort).length;
    const laden = anzahl
      ? `${o.bezahlbar.length} / ${o.bezahlbarAbreise.length} von ${anzahl}`
      : "–";
    zeilen.push(
      `| ${o.ort} | ${akt(o.ort)} | ${spanne(je.map((x) => x.ankunft))} | ${spanne(je.map((x) => x.abreise))} | ${laden} | ${o.karten} |`,
    );
  }
  return zeilen;
}

function clubtabelle(stat) {
  const zeilen = [
    "| Clubkampf | mind. Silber | Versuche | davon mit Karte | Karte kaufbar | schlechteste Nadel |",
    "| --- | --- | --- | --- | --- | --- |",
  ];
  for (const c of stat) {
    zeilen.push(
      `| ${c.begegnung} | ${anteil(c.silberOderBesser, 1)} | ${c.versuche.toFixed(1)} | ${c.mitKarte.toFixed(1)} | ${anteil(c.kaufbar, 1)} | ${NADELNAME[c.schlechteste]} |`,
    );
  }
  return zeilen;
}

/** Erster Kauf einer Karte dieser Stufe durch den verschwenderischen Spieler. */
function frueheste(welt, ersteLaeufe, stufe) {
  const kauf = ersteLaeufe[0].kaeufe.find((k) => welt.karten[k.kennung]?.stufe === stufe);
  return kauf ? `${kauf.kennung} in ${kauf.ort} (Akt ${akt(kauf.ort)})` : "nie";
}

function dauerhafteNichtGekauft(welt, sp) {
  const alle = new Set(
    welt.laeden
      .flatMap((l) => l.angebot)
      .filter((w) => welt.karten[w.kennung]?.art === "dauerhaft")
      .map((w) => w.kennung),
  );
  return [...alle].filter((k) => !sp.karten[k]);
}

function starkFrueh(welt) {
  return welt.laeden
    .filter((l) => akt(l.ort) < 3)
    .flatMap((l) => l.angebot)
    .filter((w) => welt.karten[w.kennung]?.stufe === "stark")
    .map((w) => w.kennung);
}

function warenAkt4NichtGekauft(welt, sp) {
  const gekauft = new Set(sp.kaeufe.map((k) => k.kennung));
  return welt.laeden
    .filter((l) => akt(l.ort) === 4)
    .flatMap((l) => l.angebot)
    .filter((w) => !gekauft.has(w.kennung) && !sp.karten[w.kennung]);
}

/** Bericht der Wirtschaft für mehrere Zeitachsen (Startwerte) und beide Spieler. */
function berichtWirtschaft(welt, zeitachsen, ersteNadel) {
  const zeilen = ["# Wirtschaft", ""];
  const ziele = [];
  for (const art of ["sparsam", "verschwenderisch"]) {
    const erste = zeitachsen.map((z, i) => spiele(welt, z, art, 1000 * (i + 1), ersteNadel));
    const alle = zeitachsen.flatMap((z, i) =>
      Array.from({ length: WIEDERHOLUNGEN }, (_, w) =>
        spiele(welt, z, art, 1000 * (i + 1) + w, ersteNadel),
      ),
    );
    const stat = clubstatistik(alle);
    zeilen.push(
      `## Spieler: ${art}`,
      "",
      ...ortstabelle(welt, erste),
      "",
      ...clubtabelle(stat),
      "",
    );
    if (art === "sparsam") {
      const ohneSilber = stat.filter((c) => c.silberOderBesser < 0.95).map((c) => c.begegnung);
      const ohneKauf = stat.filter((c) => c.kaufbar < 0.95).map((c) => c.begegnung);
      ziele.push(
        `- Sparsamer Spieler mindestens Silber (in 95 % der Läufe): ${ohneSilber.length ? "NEIN, " + ohneSilber.join(", ") : "ja"}`,
      );
      ziele.push(
        `- Vor jedem Clubkampf eine leichte Karte im Besitz oder kaufbar: ${ohneKauf.length ? "NEIN, " + ohneKauf.join(", ") : "ja"}`,
      );
      const rest = erste.map((sp) => sp.muenzen);
      ziele.push(
        `- Münzen des sparsamen Spielers am Ende: ${spanne(rest)} (Ziel etwa 100 bis 300)`,
      );
      ziele.push(
        `- Rest am Ende höchstens ${REST_HOECHSTENS}: ${Math.max(...rest) <= REST_HOECHSTENS ? "ja" : "NEIN"}`,
      );
      const fehlt = erste.map((sp) => dauerhafteNichtGekauft(welt, sp).length);
      ziele.push(
        `- Dauerhafte Karten, die der sparsame Spieler nie kaufen konnte: ${spanne(fehlt)}`,
      );
    } else {
      ziele.push(`- Erste gekaufte starke Karte: ${frueheste(welt, erste, "stark")}`);
      ziele.push(
        `- Starke Karten erst ab Akt 3 im Laden: ${starkFrueh(welt).length ? "NEIN, " + starkFrueh(welt).join(", ") : "ja"}`,
      );
      const offen = erste.map((sp) => warenAkt4NichtGekauft(welt, sp).length);
      ziele.push(
        `- Waren in Akt 4, die der verschwenderische Spieler nicht kaufen konnte: ${spanne(offen)} (Ziel: mehr als 0)`,
      );
      ziele.push(`- Erste kaufbare mittlere Karte: ${frueheste(welt, erste, "mittel")}`);
      const ende = erste.map((sp) => sp.orte.find((o) => akt(o.ort) === 2)?.ankunft ?? 0);
      ziele.push(`- Münzen des verschwenderischen Spielers bei Beginn von Akt 2: ${spanne(ende)}`);
    }
  }
  return [...zeilen, "## Ziele", "", ...ziele].join("\n");
}

module.exports = { berichtWirtschaft };
