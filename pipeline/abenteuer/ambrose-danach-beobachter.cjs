// Ambrose nach dem Abschied, der Beobachter: liest nach dem Abschied jeden Dialog der
// Gesamtsimulation mit und hält fest, wo Ambrose noch spricht oder als Gegner am Brett sitzt.
//
// Zweck: Entscheidung des Autors (Story-Bibel Abschnitt 33, Frage 5; ENTSCHEIDUNGEN.md, Q21-5):
// Nach dem Abschied im Finale spricht Ambrose nicht mehr. Das Werkzeug ambrose-danach.cjs geht die
// Welt nach dem Abschied ab; diese Datei ist sein Ohr.
// Warum eine eigene Datei: Der Beobachter hängt wie der Leser der Lesefassung
// (lesefassung-spieler.cjs) an den Haken `st.leser` und `st.chaos` der Gesamtsimulation
// (gesamtsimulation-dialoge.cjs); das Abgehen der Welt steht in ambrose-danach.cjs (Regel 4,
// Dateien unter 400 Zeilen).
"use strict";
const fs = require("fs");
const path = require("path");
const { dialog } = require("./gesamtsimulation-dialoge.cjs");

const HAUPT = path.resolve(__dirname, "..", "..");
const DATEN = path.join(HAUPT, "inhalte", "abenteuer");
const MOMENTZEILE = path.join(
  HAUPT,
  "app",
  "src",
  "abenteuer",
  "anbindung",
  "Momentzeile.tsx",
);

/** Kurzname Ambroses in den Dialogtags (`#sprecher:ambrose`) und in den Partiemomenten. */
const AMBROSE = "ambrose";
/** Kennung des Gegners Ambrose in gegner.json und begegnungen.json. */
const GEGNER_AMBROSE = "mapleFalls.ambrose";
/** Regel der App, die Ambroses Partiemomente nach dem Abschied weglässt (regeln/abwesenheit.ts). */
const REGEL_DER_APP = "ambroseVerabschiedet";
/** Eine Wahl, die eine Partie gegen Ambrose anbietet („Blindschach gegen Ambrose“). */
const WAHL_GEGEN_AMBROSE = /gegen Ambrose/i;
/** Zeilen anderer Sprecher, die Ambrose nennen (Hinweise zum Nachlesen, keine Funde). */
const NENNT_AMBROSE = /\bAmbrose\b/;
/**
 * Ausgänge der Partien nach dem Abschied, der Reihe nach je Begegnung: So kommen alle
 * Nachgespräche vor (Sieg, Niederlage, Remis) und auch der Abbruch.
 */
const AUSGAENGE = ["sieg", "niederlage", "remis", "abgebrochen"];

const lade = (name) =>
  JSON.parse(fs.readFileSync(path.join(DATEN, name), "utf8"));

/** Der Sprecher einer Zeile aus ihren Tags. Beispiel: ["sprecher:ambrose", "stimmung:fern"] → „ambrose“. */
function sprecherAus(tags) {
  const tag = (tags || []).find((t) => t.trim().startsWith("sprecher:"));
  return tag ? tag.split(":")[1].trim() : null;
}

/**
 * Der Knoten, in dem die zuletzt gelesene Zeile steht: der Knoten, dessen Besuchszahl seit der
 * letzten Zeile gestiegen ist (wie `meldeNeue` in gesamtsimulation-dialoge.cjs), sonst der bisherige.
 * Eingaben: der offene Dialog ({ geschichte, besuche (Map), knoten (aktueller) }) und die Knoten
 * der Datei. Beispiel: Dialog ab „bayou.pepe“, Zeile aus `pepe_formular` → „pepe_formular“.
 */
function knotenDerZeile(offen, knoten) {
  for (const k of knoten) {
    const n = offen.geschichte.state.VisitCountAtPathString(k);
    if (n > (offen.besuche.get(k) || 0)) offen.knoten = k;
    offen.besuche.set(k, n);
  }
  return offen.knoten;
}

/**
 * Ob die App Ambroses Partiemomente nach dem Abschied weglässt: Die Momentzeile muss die Regel
 * `ambroseVerabschiedet` aus regeln/abwesenheit.ts benutzen. Fehlt sie dort, sind die Momente
 * Funde. Warum am Quelltext: Das Werkzeug kann die App nicht ausführen; den Rest prüft
 * abwesenheit.test.ts.
 */
function appFiltertMomente() {
  return fs.readFileSync(MOMENTZEILE, "utf8").includes(REGEL_DER_APP);
}

/**
 * Die Entscheidungen bei Partien und Aufgaben nach dem Abschied (Form wie `st.chaos`): jede
 * Begegnung der Reihe nach mit allen Ausgängen, jede Runde abwechselnd nicht bestanden und
 * bestanden. `gespielt(begegnung)` bekommt jede begonnene Partie.
 */
function entscheidungen(gespielt) {
  const partien = {};
  const runden = {};
  return {
    dialogabbruch: () => null,
    ausgang(begegnung) {
      const n = (partien[begegnung] = (partien[begegnung] || 0) + 1);
      gespielt(begegnung);
      return AUSGAENGE[(n - 1) % AUSGAENGE.length];
    },
    bestanden(runde) {
      const n = (runden[runde] = (runden[runde] || 0) + 1);
      return n % 2 === 0;
    },
    kaufe: () => [],
  };
}

/**
 * Die Antwort des Beobachters: Steht dieselbe Auswahl wieder da, nimmt er die nächste Antwort, bis
 * alle einmal dran waren (auch „Nicht jetzt.“), und beginnt dann von vorn.
 * Beispiel: Greta bietet „Blindschach gegen Ambrose“ und „Ein andermal.“ an → erst das eine, beim
 * nächsten Gespräch das andere.
 */
function naechsteAntwort(zaehler, datei, antworten) {
  const schluessel = datei + "\n" + antworten.join("\n");
  const n = zaehler.get(schluessel) || 0;
  zaehler.set(schluessel, n + 1);
  return n % antworten.length;
}

/**
 * Legt den Beobachter an und hängt ihn in den Stand (`st.leser`, `st.chaos`). Ab jetzt zählt jede
 * Zeile mit Sprecher Ambrose, jede Wahl „… gegen Ambrose“, jede Partie gegen ihn und jeder seiner
 * Partiemomente als Fund.
 * Eingaben: Welt und Stand der Simulation (der Abschied ist schon gesehen).
 * Ausgabe: { funde (Map Schlüssel → { art, wo, text }), hinweise (Menge: Zeilen anderer Sprecher,
 * die Ambrose nennen), gelesen (Menge „Datei.Knoten“), neues()
 * (Zahl bisher gelesener verschiedener Zeilen), spieleMomente() (führt nach begonnenen Partien
 * die Dialoge ihrer Momente), dialoge (Zahl) }.
 * Beispiel: „Wie im Leben: Man sieht nie das ganze Brett.“ in bayou.theron → Fund der Art „Zeile“.
 * Sonderfall: Der Dialog des Abschieds selbst läuft vor dem Beobachter und zählt nicht.
 */
function neuerBeobachter(welt, st) {
  const b = {
    funde: new Map(),
    gelesen: new Set(),
    zeilen: new Set(),
    dialoge: 0,
    hinweise: new Set(),
    wartend: [],
  };
  const zaehler = new Map();
  const begegnungen = new Map(
    lade("begegnungen.json").begegnungen.map((x) => [x.kennung, x]),
  );
  const texte = lade(path.join("texte", "de.json"));
  const gefiltert = appFiltertMomente();
  let offen = null;
  let imNachgespraech = false;
  const fund = (art, wo, text) =>
    b.funde.set([art, wo, text].join("|"), { art, wo, text });
  st.chaos = entscheidungen((begegnung) => {
    b.wartend.push(begegnung);
    if (begegnungen.get(begegnung)?.gegner === GEGNER_AMBROSE)
      fund("Partie", begegnung, `Gegner Ambrose, begonnen in ${offen.wo}`);
  });
  st.leser = {
    beginn(knoten, geschichte) {
      const [datei, einstieg] = knoten.split(".");
      const besuche = new Map();
      offen = { datei, einstieg, geschichte, wo: knoten, besuche };
      offen.knoten = einstieg;
      b.dialoge++;
    },
    zeile(text, tags) {
      const sauber = text.trim();
      if (!sauber) return;
      const { datei } = offen;
      offen.wo = datei + "." + knotenDerZeile(offen, welt.knoten[datei]);
      b.gelesen.add(offen.wo);
      b.zeilen.add(offen.wo + "|" + sauber);
      if (sprecherAus(tags) === AMBROSE) fund("Zeile", offen.wo, sauber);
      else if (NENNT_AMBROSE.test(sauber))
        b.hinweise.add(`${offen.wo}: ${sauber}`);
    },
    waehle(antworten) {
      for (const a of antworten)
        if (WAHL_GEGEN_AMBROSE.test(a)) fund("Wahl", offen.wo, a);
      return naechsteAntwort(zaehler, offen.datei, antworten);
    },
    ende() {},
    // Nach Partie oder Runde gleich noch einmal derselbe Knoten (das Nachgespräch), nur einmal.
    nachgespraech(folgen) {
      const gespielt = folgen.partie || folgen.runde || folgen.partieform;
      const knoten =
        gespielt && !imNachgespraech
          ? offen.datei + "." + offen.einstieg
          : null;
      imNachgespraech = Boolean(knoten);
      return knoten;
    },
  };
  b.neues = () => b.zeilen.size + b.funde.size;
  b.spieleMomente = () => {
    for (const begegnung of b.wartend.splice(0))
      for (const m of begegnungen.get(begegnung)?.momente || [])
        pruefeMoment(welt, st, { begegnung, m, texte, gefiltert, fund });
  };
  return b;
}

/**
 * Ein Partiemoment einer nach dem Abschied begonnenen Partie: Spricht Ambrose (`sprecher`), ist er
 * ein Fund, außer die App lässt ihn weg; ein Moment mit Ink-Dialog wird gespielt, damit seine
 * Zeilen beim Beobachter ankommen.
 * Beispiel: summitCity.clubkampf, Moment „damenTausch“ mit Dialog summit-city-huette.clubkampf_heimweg.
 */
function pruefeMoment(welt, st, { begegnung, m, texte, gefiltert, fund }) {
  if (m.sprecher === AMBROSE) {
    if (gefiltert) return;
    const text = m.text ? texte[m.text] || m.text : `Dialog ${m.dialog}`;
    fund("Moment", begegnung, text);
  }
  if (m.dialog) dialog(welt, st, m.dialog);
}

module.exports = { neuerBeobachter, sprecherAus, AMBROSE };
