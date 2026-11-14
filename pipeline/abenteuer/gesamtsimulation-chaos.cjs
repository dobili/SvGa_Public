// Gesamtsimulation, Chaos-Prüfung, der Chaos-Spieler: Sackgassen durch ungeschicktes oder fast
// zufälliges Spielen. Die Läufe, der Bericht und der Aufruf stehen in gesamtsimulation-chaoslauf.cjs.
//
// Zweck (Wunsch des Autors, 14.11.2026): „Es sollte nichts kaputt gehen, sodass man das Spiel
// nicht mehr beenden kann“, auch wenn Spieler sich dämlich oder fast zufällig verhalten.
// Ablauf je Lauf: Der gründliche Spieler (gesamtsimulation.cjs) spielt bis in ein zufälliges Gebiet
// (oder gar nicht), dann spielt der Chaos-Spieler N Schritte fast zufällig, dann übernimmt wieder
// der gründliche Spieler. Kommt er nicht zum Abspann oder hängt eine Hauptquest, ist das eine
// Sackgasse; der Bericht nennt Startwert, Gebiet, N und die Aktionen des Chaos-Spielers.
//
// Der Chaos-Spieler: fasst zufällige Dinge an, geht zufällige Wege (auch zurück in frühere Akte),
// reist mit der Monatskarte, bricht Dialoge nach einer zufälligen Zeile ab (Taste Zurück: Variablen
// bleiben und die Folgen laufen, wie Dialog.tsx; oder Neuladen: die Folgen sind weg, was sofort
// wirkt, bleibt, und die Ink-Variablen gelten so, wie sie beim zuletzt gemeldeten Knoten waren,
// wie useDialogende.ts, sichereVariablen, und dialogwirkungen.ts), verliert oder bricht
// Partien ab, fällt durch Runden und kauft je Art nichts, alles oder Zufälliges zu echten Preisen.
// Der Spielstand der App (regeln/spielstand.ts, abenteuerstandAus) behält beim Laden alles außer dem
// offenen Dialog, offenen Läden und den Merkern nach dem Dialog; mehr verwirft auch die Simulation
// nicht. Ein Neuladen zwischen zwei Aktionen ändert deshalb nichts und wird nicht eigens gespielt.
// Echte Preise (st.echt) gelten in allen Teilen; jeder weitere Straßensieg bringt 2 Münzen.
//
// Aufruf: node pipeline/abenteuer/gesamtsimulation.cjs --chaos --startwerte 1-200 [--sekunden 3600]
//   [--schritte 30,100,300,1000] [--lauf-sekunden 240] [--json datei.jsonl]
//   [--kuerzen START:GEBIET:N]   (sucht für einen Fund das kleinste N, das noch hängen bleibt)
//   [--einzeln START:GEBIET:N]   (nur dieser Lauf, mit allen Aktionen)
//   [--schnell --startwerte 1-8 --schritte 100,250]   (Akt 1 bis Riverton, für Pytest)
// Rückgabewert 1, wenn ein Lauf in einer Sackgasse endet.
"use strict";
const {
  FOLGE,
  zufall,
  gilt,
  betrete,
  melde,
  ausloeserFuer,
  objekteJetzt,
} = require("./gesamtsimulation-regeln.cjs");
const { dialog, wendeFolgenAn } = require("./gesamtsimulation-dialoge.cjs");

const ABBRUCH_JE_ZEILE = 0.04;
const AUSGANG_GEWICHTE = [
  ["abgebrochen", 0.25],
  ["niederlage", 0.35],
  ["remis", 0.15],
  ["sieg", 0.25],
];
const BESTANDEN = 0.3;
const KAUFARTEN = ["geiz", "verschwender", "zufall"];
const AKTIONEN = [
  ["fasse", 0.45],
  ["gehe", 0.33],
  ["reise", 0.07],
  ["gruendlich", 0.15],
];

// ---------------------------------------------------------------- Der Chaos-Spieler

/** Wählt nach Gewichten ([[wert, gewicht], …]) mit dem Zufall des Stands. */
function gewichtet(st, liste) {
  let r = zufall(st) * liste.reduce((s, [, g]) => s + g, 0);
  for (const [w, g] of liste) if ((r -= g) < 0) return w;
  return liste[liste.length - 1][0];
}

const eins = (st, liste) => liste[Math.floor(zufall(st) * liste.length)];

/** Die Entscheidungen des Chaos-Spielers, die die Dialogteile abfragen (st.chaos). */
function chaosspieler(st, kaufart) {
  const log = (text) => st.protokoll.push(text);
  return {
    dialogabbruch() {
      if (zufall(st) >= ABBRUCH_JE_ZEILE) return null;
      const art = zufall(st) < 0.5 ? "zurueck" : "neuladen";
      log(`  Dialog abgebrochen (${art})`);
      return art;
    },
    ausgang(b) {
      const a = gewichtet(st, AUSGANG_GEWICHTE);
      log(`  Partie ${b}: ${a}`);
      return a;
    },
    bestanden(r) {
      const ja = zufall(st) < BESTANDEN;
      log(`  Runde ${r}: ${ja ? "bestanden" : "nicht bestanden"}`);
      return ja;
    },
    kaufe(angebot) {
      let waren = [];
      if (kaufart === "verschwender")
        waren = [...angebot, ...angebot].sort(() => zufall(st) - 0.5);
      if (kaufart === "zufall") waren = angebot.filter(() => zufall(st) < 0.3);
      log(
        `  Laden: will ${waren.map((w) => w.kennung).join(", ") || "nichts"}`,
      );
      return waren;
    },
  };
}

/** Fasst ein zufälliges Ding der Karte an (Figur, Auslöser ohne Übergang). */
function fasseZufaellig(welt, st, h) {
  const ort = welt.karteZuOrt[st.karte];
  const dinge = objekteJetzt(welt, st, st.karte).filter((o) => {
    const a = ausloeserFuer(ort, st.karte, o.name);
    return !(a && a.art === "uebergang") && o.typ !== "moebel";
  });
  if (!dinge.length) return;
  const o = eins(st, dinge);
  st.protokoll.push(`fasse ${st.karte}.${o.name}`);
  h.fasseAn(welt, st, ort, st.karte, o, ausloeserFuer(ort, st.karte, o.name));
}

/** Geht einen zufälligen Weg der Karte; mit Dialog prüft der Übergang `wenn` danach. */
function geheZufaellig(welt, st, h) {
  const wege = h.wegeVon(welt, st.karte);
  if (!wege.length) return;
  const w = eins(st, wege);
  st.protokoll.push(`gehe ${st.karte}.${w.name}`);
  melde(welt, st, { art: "ort", karte: st.karte, ausloeser: w.name });
  if (w.dialog)
    wendeFolgenAn(welt, st, dialog(welt, st, w.dialog), w, () => true);
  else if (gilt(st, w.wenn)) betrete(welt, st, w.ziel.karte);
}

/** Schnellreise wie Oberwelt.tsx und reiseziele.ts: draußen, mit Monatskarte, in besuchte Städte. */
function reiseZufaellig(welt, st) {
  const karte = welt.karteZuOrt[st.karte].karten.find(
    (k) => k.kennung === st.karte,
  );
  if (!st.besitz.has("monatskarte") || karte?.innen) return;
  const ziele = welt.orte.filter(
    (o) => !o.art && st.besucht.has(o.kennung) && o.kennung !== st.letzterOrt,
  );
  if (!ziele.length) return;
  const ziel = eins(st, ziele);
  const k = ziel.karten.find((x) => !x.innen) || ziel.karten[0];
  st.protokoll.push(`reise ${k.kennung}`);
  betrete(welt, st, k.kennung);
}

/** Höchstes besuchtes Gebiet der FOLGE. */
function weitestesGebiet(st) {
  return Math.max(0, ...FOLGE.map((o, i) => (st.besucht.has(o) ? i : 0)));
}

/** Ein Schritt des gründlichen Spielers mitten im Chaos (damit es vorangeht). */
function gruendlich(welt, st, h, schritt) {
  st.phase = Math.min(weitestesGebiet(st) + 1, FOLGE.length - 1);
  st.protokoll.push(`gruendlich auf ${st.karte}`);
  const vorher = st.karte;
  const wege = h.besucheKarte(welt, st);
  if (st.karte === vorher) h.waehleWeg(welt, st, wege, schritt);
}

/** N Schritte des Chaos-Spielers auf dem Stand st. */
function spieleChaos(welt, st, h, n, kaufart) {
  // Merker des gründlichen Spielers, falls der Stand von ganz vorn kommt.
  for (const f of ["letzteSig", "versuche", "letzterWeg", "gesperrt"])
    st[f] = st[f] || {};
  if (!st.besucht.size) betrete(welt, st, st.karte);
  st.chaos = chaosspieler(st, kaufart);
  for (let i = 0; i < n; i++) {
    const art = gewichtet(st, AKTIONEN);
    if (art === "fasse") fasseZufaellig(welt, st, h);
    else if (art === "gehe") geheZufaellig(welt, st, h);
    else if (art === "reise") reiseZufaellig(welt, st);
    else gruendlich(welt, st, h, 1e7 + i);
  }
  st.chaos = null;
}

module.exports = { spieleChaos, weitestesGebiet, gewichtet, KAUFARTEN };
