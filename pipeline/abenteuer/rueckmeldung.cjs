// Prüfwerkzeug: Reagiert eine Figur, wenn eine Partie, Runde, ein Rätsel, Simultan oder eine
// Gedächtnisstellung aus ihrem Dialog zu Ende ist?
//
// Warum (Wunsch des Autors nach dem ersten Anspielen, 19.11.2026): „Wenn aus einem Dialog eine
// Schachpartie oder ein Rätsel startet, soll es nach dem Ende auch eine Reaktion darauf geben.“
// Die App öffnet nach der Ergebniskarte den Dialog wieder, der die Partie oder Runde gestartet hat
// (zuerst `danach` aus runden.json oder begegnungen.json; app/src/abenteuer/oberwelt/nachergebnis.ts). Die
// Gesamtsimulation tut dasselbe und schreibt jede Rückmeldung in `st.rueckmeldungen`.
//
// Geprüft wird je Start aus Ink (beginnePartie, beginneAufgaben, beginneSimultan,
// beginneGedaechtnis) und je Ausgang, den die Simulation gesehen hat:
// - Die Rückmeldung zeigt mindestens eine Zeile und startet nicht ohne Wahl gleich die nächste
//   Folge (Schleife: nach einem Fehlversuch begänne die Runde sofort neu).
// - Sie greift das Ergebnis auf: Ein besuchter Knoten fragt eine Variable des Ergebnisses
//   (ausgang…, siege…, zuege…, …Bestanden, …Punkte; regeln/dialogvariablen.ts) in einer Zeile mit
//   Text ab, oder eine Weiterleitung mit passender Bedingung führt in einen besuchten Knoten, oder
//   sie ist das `danach` der Runde.
// Starts, die die Simulation nicht erreicht, prüft das Werkzeug nur in den Dateien: Irgendein
// Knoten der Datei muss eine Variable des Ergebnisses abfragen.
//
// Aufruf aus dem Hauptordner: node pipeline/abenteuer/rueckmeldung.cjs [--startwerte 1,2,3]
//   [--sekunden 300]. Ausgabe: je Fund eine Zeile, am Ende „N Funde“; Rückgabewert 1 bei Funden.
// pytest: pipeline/tests/test_abenteuer_rueckmeldung.py (die Prüfung selbst nur mit
// ABENTEUER_SIMULATION=1, die Auswertung immer).
"use strict";
const fs = require("fs");
const path = require("path");

const DIALOGE = path.join(__dirname, "..", "..", "inhalte", "abenteuer", "dialoge", "de");
const START = /~\s*(beginnePartie|beginneAufgaben|beginneSimultan|beginneGedaechtnis)\("([^"]+)"\)/g;
const ART_DES_AUFRUFS = {
  beginnePartie: "partie",
  beginneAufgaben: "runde",
  beginneSimultan: "partieform",
  beginneGedaechtnis: "partieform",
};
const MILLISEKUNDEN = 1000;

const gross = (t) => t.charAt(0).toUpperCase() + t.slice(1);

/**
 * Die Variablen, die das Ergebnis eines Starts tragen (regeln/dialogvariablen.ts).
 * Beispiel: ("partie", "mapleFalls.ersteLektion") → ausgangMapleFallsErsteLektion,
 * siegeMapleFallsErsteLektion, zuegeMapleFallsErsteLektion.
 */
function ergebnisvariablen(art, kennung) {
  const teile = kennung.split(".");
  if (art === "partie") {
    const name = teile.map(gross).join("");
    return ["ausgang" + name, "siege" + name, "zuege" + name];
  }
  const kurz = teile[teile.length - 1];
  const ort = teile.slice(0, -1).join("");
  return [kurz + "Bestanden", ort + gross(kurz) + "Bestanden", kurz + "Punkte"];
}

/** Knoten einer Ink-Datei mit ihrem Text: { "datei.knoten": text }. */
function knotenDer(datei, text) {
  const teile = text.split(/^===\s*([a-z0-9_]+)\s*===/m);
  const knoten = {};
  for (let i = 1; i < teile.length; i += 2) knoten[`${datei}.${teile[i]}`] = teile[i + 1];
  return knoten;
}

/** Alle Ink-Dateien: Starts und Knoten. */
function ladeInk(ordner = DIALOGE) {
  const starts = new Map();
  const knoten = {};
  for (const name of fs.readdirSync(ordner).filter((d) => d.endsWith(".ink"))) {
    const datei = name.slice(0, -".ink".length);
    const text = fs.readFileSync(path.join(ordner, name), "utf8");
    Object.assign(knoten, knotenDer(datei, text));
    for (const m of text.matchAll(START)) {
      const schluessel = `${ART_DES_AUFRUFS[m[1]]}|${m[2]}`;
      if (!starts.has(schluessel)) starts.set(schluessel, new Set());
      starts.get(schluessel).add(datei);
    }
  }
  return { starts, knoten };
}

/** Fragt der Text eine der Variablen ab (ganzes Wort)? */
function fragtAb(text, variablen) {
  return variablen.some((v) => new RegExp(`\\b${v}\\b`).test(text || ""));
}

/** Eine Weiterleitung „- Bedingung: -> ziel“ oder „{Bedingung: -> ziel}“: { bedingung, ziel }. */
const WEITERLEITUNG = /^\s*(?:-|\{)\s*([^:\n]+):\s*->\s*([a-z0-9_]+)/;

/**
 * Passt eine Bedingung zum Ausgang? Runde: „bestanden“ verlangt die Variable ohne „not“ davor,
 * „nicht bestanden“ mit „not“. Partie: die Variable verglichen mit dem Ausgang, „!= """ (gespielt)
 * oder die Siege (nur bei Sieg). Beispiel: („not reiheDexBestanden“, bestanden) → false.
 */
function passtZumAusgang(bedingung, variablen, ausgang) {
  const v = variablen.find((x) => new RegExp(`\\b${x}\\b`).test(bedingung));
  if (!v) return false;
  const verneint = new RegExp(`\\bnot\\s+${v}\\b`).test(bedingung);
  if (ausgang === "bestanden") return !verneint;
  if (ausgang === "nicht bestanden") return verneint;
  if (v.startsWith("siege")) return ausgang === "sieg" && !verneint;
  return bedingung.includes(`"${ausgang}"`) || /!=\s*""/.test(bedingung);
}

/**
 * Reagiert ein besuchter Knoten auf das Ergebnis? Ja, wenn er die Variable außerhalb einer
 * Weiterleitung abfragt (Text je Ergebnis), oder wenn eine seiner Weiterleitungen mit passender
 * Bedingung in einen besuchten Knoten führt. Reine Weiterleitungen anderswohin zählen nicht
 * (Befund: „dex“ fragt reiheDexBestanden ab, führt nach der Runde aber in den Alltag).
 */
function reagiert(text, datei, besucht, variablen, ausgang) {
  if (kaskade(text, datei, besucht, variablen)) return true;
  for (const zeile of (text || "").split("\n")) {
    if (!fragtAb(zeile, variablen)) continue;
    const w = WEITERLEITUNG.exec(zeile);
    if (!w) return true;
    if (besucht.includes(`${datei}.${w[2]}`) && passtZumAusgang(w[1], variablen, ausgang))
      return true;
  }
  return false;
}

/** Ziele, die keine Reaktion sind, auch wenn ein Zweig sie erreicht: Alltag, Warten, Rat. */
const KEINE_REAKTION = /_(alltag|wartet|rat)$/;
/** Ein Zweig „- Bedingung: -> ziel“ (auch „- else: -> ziel“) oder eine Zeile „{Bedingung: -> ziel}“. */
const ZWEIG = /^\s*(?:-|\{)\s*([^:\n]+):\s*->\s*([a-z0-9_]+)\s*\}?\s*$/;

/**
 * Kaskade im Verteilerblock: Der genommene Zweig folgt unmittelbar auf einen nicht genommenen
 * Zweig, der das Ergebnis abfragt, und sein Ziel ist kein Alltag. Beispiele: „nova“ prüft
 * „not reiheNovaBestanden“ (nicht genommen), gleich danach nova_karte (Reaktion); „rosa“ prüft
 * „niederlage“, sonst rosa_nach_sieg; „dex“ prüft reiheDexBestanden, sonst dex_alltag (keine).
 * Grenze: Der Inhalt des Ziels wird nicht gelesen; ein Erzählschritt direkt nach der Prüfung zählt.
 */
function kaskade(text, datei, besucht, variablen) {
  const zweige = (text || "")
    .split("\n")
    .filter((z) => !/^\s*\/\//.test(z))
    .map((z) => ZWEIG.exec(z));
  return zweige.some((z, i) => {
    const davor = zweige[i - 1];
    if (!z || !davor || !fragtAb(davor[1], variablen)) return false;
    const genommen = (ziel) => besucht.includes(`${datei}.${ziel}`);
    return !genommen(davor[2]) && genommen(z[2]) && !KEINE_REAKTION.test(z[2]);
  });
}

/** Greift eine Rückmeldung das Ergebnis auf? Ja mit Zeilen und einem reagierenden Knoten. */
function greiftAuf(r, knoten, rundenDanach) {
  if (!r.zeilen) return false;
  if (rundenDanach[r.kennung] === r.knoten) return true;
  const variablen = ergebnisvariablen(r.art, r.kennung);
  return r.besucht.some((k) =>
    reagiert(knoten[k], k.split(".")[0], r.besucht, variablen, r.ausgang),
  );
}

/**
 * Die Funde aus Starts, Rückmeldungen der Simulation und Knoten.
 * Eingaben: starts (Map „art|kennung“ → Dateien), rueckmeldungen ({ art, kennung, ausgang,
 * knoten, zeilen, besucht }), knoten ({ „datei.knoten“: Text }), rundenDanach ({ Runde: Knoten }).
 * Ausgabe: Liste von Zeilen. Beispiel: „partie mapleFalls.x (sieg): Rückmeldung a.b ohne Bezug“.
 */
/**
 * Führt die Rückmeldung in den Zweig eines anderen Ausgangs? Am Namen erkannt: „…_nach_sieg“ bei
 * Remis oder Niederlage, „…_nach_niederlage“ oder „…_nach_remis“ bei einem Sieg. Warum: Zwölf
 * Weichen schickten ein Remis in „…_nach_sieg“ mit „Gewonnen“ und Karte; die übrigen Regeln sahen
 * nur, dass ein Zweig das Ergebnis abfragt (schwacher Spieler im Durchlauf, 19.11.2026).
 * Fragt einer der besuchten Knoten den Ausgang ausdrücklich ab, ist der Weg gewollt (die Clubs: Remis
 * bringt auch eine Nadel; Ruiz: beim Endspiel „Remis halten“ ist ein Remis das Ziel).
 * Ausgabe: der Knoten oder null. Beispiel: remis, besucht „s.sol“, „s.sol_nach_sieg“ → „s.sol_nach_sieg“.
 */
function falscherZweig(r, knoten = {}) {
  const fremd = r.ausgang === "sieg" ? /_nach_(niederlage|remis)$/ : /_nach_sieg$/;
  if (!["sieg", "remis", "niederlage"].includes(r.ausgang)) return null;
  const besucht = r.besucht ?? [];
  if (besucht.some((k) => (knoten[k] ?? "").includes(`== "${r.ausgang}"`))) return null;
  return besucht.find((k) => fremd.test(k)) ?? null;
}

function funde(starts, rueckmeldungen, knoten, rundenDanach) {
  const liste = [];
  for (const [schluessel, dateien] of starts) {
    const [art, kennung] = schluessel.split("|");
    const eigene = rueckmeldungen.filter((r) => r.art === art && r.kennung === kennung);
    if (!eigene.length) {
      const variablen = ergebnisvariablen(art, kennung);
      const inDatei = Object.entries(knoten).some(
        ([k, t]) => dateien.has(k.split(".")[0]) && fragtAb(t, variablen),
      );
      if (!inDatei) liste.push(`${art} ${kennung}: nicht erreicht, und kein Knoten fragt das Ergebnis ab`);
      continue;
    }
    const schleife = eigene.find((r) => r.neustartOhneWahl);
    if (schleife)
      liste.push(`${art} ${kennung} (${schleife.ausgang}): Rückmeldung ${schleife.knoten} startet ohne Wahl neu`);
    for (const ausgang of new Set(eigene.map((r) => r.ausgang))) {
      const je = eigene.filter((r) => r.ausgang === ausgang);
      const falsch = je.find((r) => falscherZweig(r, knoten));
      if (falsch) liste.push(`${art} ${kennung} (${ausgang}): Rückmeldung führt in ${falscherZweig(falsch, knoten)}`);
      if (je.some((r) => greiftAuf(r, knoten, rundenDanach))) continue;
      const r = je[0];
      const grund = r.zeilen ? "ohne Bezug auf das Ergebnis" : "ohne Zeile";
      liste.push(`${art} ${kennung} (${ausgang}): Rückmeldung ${r.knoten} ${grund}`);
    }
  }
  return liste.sort();
}

/** Zahl nach einem Schalter, sonst die Vorgabe. */
function schalter(liste, name, vorgabe) {
  const i = liste.indexOf(name);
  return i >= 0 && liste[i + 1] ? liste[i + 1] : vorgabe;
}

/** Läuft die Gesamtsimulation je Startwert und sammelt die Rückmeldungen. */
function sammle(startwerte, sekunden) {
  const { ladeWelt, neuerStand } = require("./gesamtsimulation-regeln.cjs");
  const { erkunde, nachholen, rueckkehr, SCHRITTE } = require("./gesamtsimulation.cjs");
  const welt = ladeWelt();
  const alle = [];
  for (const startwert of startwerte) {
    welt.geschichten = {};
    const st = neuerStand(startwert);
    const frist = Date.now() + sekunden * MILLISEKUNDEN;
    erkunde(welt, st, frist);
    nachholen(welt, st, frist, SCHRITTE);
    rueckkehr(welt, st, frist, SCHRITTE);
    alle.push(...(st.rueckmeldungen || []));
  }
  return { rueckmeldungen: alle, rundenDanach: { ...welt.rundenDanach, ...welt.begegnungDanach } };
}

function hauptprogramm(liste) {
  const startwerte = schalter(liste, "--startwerte", "1,2,3").split(",").map(Number);
  const sekunden = Number(schalter(liste, "--sekunden", "300"));
  const { starts, knoten } = ladeInk();
  const { rueckmeldungen, rundenDanach } = sammle(startwerte, sekunden);
  const gefunden = funde(starts, rueckmeldungen, knoten, rundenDanach);
  for (const zeile of gefunden) console.log(zeile);
  console.log(`${starts.size} Starts, ${rueckmeldungen.length} Rückmeldungen, ${gefunden.length} Funde`);
  process.exitCode = gefunden.length ? 1 : 0;
}

if (require.main === module) hauptprogramm(process.argv.slice(2));

module.exports = {
  falscherZweig,
  ergebnisvariablen,
  knotenDer,
  ladeInk,
  fragtAb,
  passtZumAusgang,
  reagiert,
  kaskade,
  greiftAuf,
  funde,
};
