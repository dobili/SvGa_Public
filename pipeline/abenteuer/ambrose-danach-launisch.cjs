// Ambrose nach dem Abschied, der launische Spieler: geht wie der gründliche durch die Welt, lässt
// aber bis zum Abschied je nach Startwert ein Drittel der Figuren und Dinge ganz liegen.
//
// Zweck: Nebenquests bleiben so mitten im Lauf stehen (Formular gefunden, aber nicht entziffert;
// Partie gespielt, aber nicht besprochen), und ihre späteren Schritte laufen erst nach dem
// Abschied. Der gründliche Spieler hat sie dann längst erledigt, der eilige nie begonnen.
// Warum eine Auswertung der Ink-Quelltexte: Was die Hauptgeschichte braucht, darf er nicht
// liegen lassen, sonst erreicht er den Abschied nie. „Gebraucht“ wird hier großzügig geschätzt
// (alles, was zu einem Knoten einer Hauptquest führt oder eine Variable setzt, die ein solcher
// Knoten oder ein Übergang liest); der Rest ist frei.
// Grenze: Die Schätzung liest die Quelltexte mit einfachen Mustern. Bleibt der Spieler doch hängen,
// meldet ambrose-danach.cjs „Abschied nicht erreicht“; dann einen anderen Startwert nehmen.
"use strict";
const fs = require("fs");
const path = require("path");
const { gross, variablenname } = require("./gesamtsimulation-regeln.cjs");
const { SPAETER } = require("./ambrose-danach-eilig.cjs");

const DIALOGE = path.join(
  __dirname,
  "..",
  "..",
  "inhalte",
  "abenteuer",
  "dialoge",
  "de",
);
/** Der launische Spieler lässt jedes dritte freie Objekt liegen. */
const JEDES_WIEVIELTE = 3;
/** Startwert und Primzahl des Streuwerts FNV-1a (32 Bit). */
const FNV_START = 2166136261;
const FNV_PRIMZAHL = 16777619;
const NAME = /[A-Za-z_]\w*/g;
const AUFRUF = /\b(beginne\w+|gibFund|oeffneLaden)\("([\w.]+)"\)/g;

/** Streuwert einer Zeichenkette (FNV-1a, 32 Bit) für die Launen des Spielers. */
function streuwert(text) {
  let h = FNV_START;
  for (let i = 0; i < text.length; i++)
    h = Math.imul(h ^ text.charCodeAt(i), FNV_PRIMZAHL) >>> 0;
  return h;
}

/**
 * Variablen, die ein Aufruf der Hülle setzt. Beispiel: beginnePartie("riverton.clubkampf") →
 * ausgangRivertonClubkampf, siegeRivertonClubkampf, nadelRiverton; beginneAufgaben("x.reiheSam")
 * → reiheSamBestanden; gibFund("lupe") → gefundenLupe; oeffneLaden → Besitz aus diesem Laden.
 */
function gesetztDurch(welt, aufruf, kennung) {
  if (aufruf === "gibFund") return ["gefunden" + gross(kennung)];
  if (aufruf === "oeffneLaden") {
    const laden = welt.laeden.find((l) => l.kennung === kennung);
    return (laden?.angebot || []).map((w) => "hat" + gross(w.kennung));
  }
  const name = variablenname(kennung);
  if (aufruf === "beginnePartie")
    return [
      "ausgang" + name,
      "siege" + name,
      "nadel" + gross(kennung.split(".")[0]),
    ];
  const kurz = kennung.split(".").pop();
  return [
    kurz + "Bestanden",
    name[0].toLowerCase() + name.slice(1) + "Bestanden",
    kurz + "Punkte",
  ];
}

/**
 * Liest alle Ink-Dateien in Knoten: je „Datei.Knoten“ die Ziele seiner Weiterleitungen, die
 * Variablen, die er setzt, die Namen, die in ihm vorkommen (gelesene Variablen, großzügig), und
 * seine Aufrufe der Hülle. Ausgabe: Map „Datei.Knoten“ → { ziele, setzt, liest, aufrufe }.
 */
function leseKnoten(welt) {
  const knoten = new Map();
  for (const datei of Object.keys(welt.ink)) {
    const quelle = fs.readFileSync(path.join(DIALOGE, datei + ".ink"), "utf8");
    const teile = quelle.split(/^=== (\w+) ===.*$/m);
    for (let i = 1; i < teile.length; i += 2) {
      const text = teile[i + 1].replace(/\/\/.*$/gm, "").replace(/#.*$/gm, "");
      const aufrufe = [...text.matchAll(AUFRUF)].map((m) => [m[1], m[2]]);
      knoten.set(datei + "." + teile[i], {
        ziele: [...text.matchAll(/->\s*(\w+)/g)].map((m) => datei + "." + m[1]),
        setzt: new Set([
          ...[...text.matchAll(/~\s*(\w+)\s*=/g)].map((m) => m[1]),
          ...aufrufe.flatMap(([a, k]) => gesetztDurch(welt, a, k)),
        ]),
        liest: new Set(text.match(NAME) || []),
        aufrufe,
      });
    }
  }
  return knoten;
}

/** Ereignis einer Quest als Knoten: der Dialogknoten selbst oder die Knoten, die Partie oder Runde starten. */
function knotenZu(knoten, ereignis) {
  if (ereignis.art === "dialog") return [ereignis.knoten];
  const ziel = ereignis.begegnung || ereignis.runde;
  if (!ziel) return [];
  return [...knoten]
    .filter(([, k]) => k.aufrufe.some(([, kennung]) => kennung === ziel))
    .map(([name]) => name);
}

/** Variablennamen in den Bedingungen der Übergänge, Figuren und Zustandskarten der Hauptorte. */
function variablenDerWelt(welt) {
  const namen = new Set();
  const merke = (wenn) =>
    (wenn || "").match(NAME)?.forEach((n) => namen.add(n));
  for (const ort of welt.orte) {
    if (SPAETER.includes(ort.kennung)) continue;
    for (const a of ort.ausloeser || []) merke(a.wenn);
    for (const f of ort.figuren) merke(f.wenn);
    for (const k of ort.karten) Object.keys(k.zustaende || {}).forEach(merke);
  }
  return namen;
}

/**
 * Die Knoten, die die Hauptgeschichte braucht (großzügig): Knoten der Hauptquests, alles, was zu
 * ihnen weiterleitet, und alles, was eine Variable setzt, die ein gebrauchter Knoten oder ein
 * Übergang liest; dazu Quests, die einen gebrauchten Gegenstand geben. Wiederholt, bis nichts mehr
 * dazukommt. Ausgabe: Menge „Datei.Knoten“.
 */
function gebrauchteKnoten(welt) {
  const knoten = leseKnoten(welt);
  const gebraucht = new Set();
  const variablen = variablenDerWelt(welt);
  const ereignisse = (q) => [q.start, ...q.schritte.map((s) => s.ereignis)];
  const nimm = (q) =>
    ereignisse(q).forEach((e) =>
      knotenZu(knoten, e).forEach((k) => gebraucht.add(k)),
    );
  welt.quests.filter((q) => q.haupt).forEach(nimm);
  for (let groesse = -1; groesse !== gebraucht.size + variablen.size;) {
    groesse = gebraucht.size + variablen.size;
    for (const [name, k] of knoten) {
      const fuehrtHin = k.ziele.some((z) => gebraucht.has(z));
      const setztEtwas = [...k.setzt].some((v) => variablen.has(v));
      if (fuehrtHin || setztEtwas) gebraucht.add(name);
      if (gebraucht.has(name)) k.liest.forEach((v) => variablen.add(v));
    }
    for (const q of welt.quests) {
      const gibt = q.schritte.flatMap((s) => s.wirkungen || []);
      if (
        gibt.some(
          (w) => w.gegenstand && variablen.has("hat" + gross(w.gegenstand)),
        )
      )
        nimm(q);
    }
  }
  return gebraucht;
}

/**
 * Macht aus dem Stand einen launischen Spieler (Haken `st.auslassen`).
 * Eingaben: Welt, Stand, Startwert (bestimmt, was liegen bleibt).
 * Ausgabe: `oeffne()`, das den Spieler nach dem Abschied wieder gründlich macht.
 * Beispiel: Mit Startwert 4 bleibt Mrs. Boateng im Waschsalon liegen; ihr Formular wird erst
 * nach dem Abschied entziffert.
 * Sonderfall: Was die Hauptgeschichte braucht (gebrauchteKnoten), bleibt nie liegen.
 */
function launischerSpieler(welt, st, startwert) {
  const gebraucht = gebrauchteKnoten(welt);
  const dialogVon = (karte, o) => {
    const ort = welt.karteZuOrt[karte];
    const figur = ort.figuren.find(
      (f) => f.kennung === ort.kennung + "." + o.name,
    );
    const a = (ort.ausloeser || []).find(
      (x) => x.name === o.name && (!x.karte || x.karte === karte),
    );
    return figur ? figur.dialog : a?.dialog;
  };
  st.auslassen = (w, s, karte, o) => {
    const dialog = dialogVon(karte, o);
    if (!dialog || gebraucht.has(dialog)) return false;
    return streuwert(`${startwert}:${karte}.${o.name}`) % JEDES_WIEVIELTE === 0;
  };
  return () => delete st.auslassen;
}

module.exports = { launischerSpieler, gebrauchteKnoten };
