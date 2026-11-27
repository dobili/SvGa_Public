// Regeln der Gesamtsimulation (gesamtsimulation.cjs): Spieldaten, Spielstand, Quests und Bewegung
// wie in der App; Dialoge und ihre Folgen stehen in gesamtsimulation-dialoge.cjs. Wie in der App (oberwelt/Oberwelt.tsx, regeln/quests.ts, dialogvariablen.ts);
// eigene Datei, damit jede unter 400 Zeilen bleibt (CLAUDE.md, Regel 4).
"use strict";
const fs = require("fs");
const path = require("path");

const HAUPT = path.resolve(__dirname, "..", "..");
const APP = path.join(HAUPT, "app", "node_modules", "inkjs");
const { erfuellt } = require("./bedingung.cjs");
const { nachUhr, startstunde, warte } = require("./gesamtsimulation-uhr.cjs");
// Laden der Welt (Daten, Ink, Objekte der Karten) steht seit dem 20.11.2026 in
// gesamtsimulation-welt.cjs (Regel 4); hier nur weitergereicht, damit die Aufrufer bleiben.
const { ladeWelt, figurenOhneKarte } = require("./gesamtsimulation-welt.cjs");
const DATEN = path.join(HAUPT, "inhalte", "abenteuer");

/** Gebiete in der Reihenfolge der Geschichte (Story-Bibel, Teil 1 bis 4). Die Hochebene folgt
 * seit dem 15.11.2026 auf Summit City: Ihr Weg beginnt am Westrand der Stadt, nicht mehr an der
 * Bergstraße (Weltpuzzle, orte/summit-city.md 1.7). */
const FOLGE = [
  "mapleFalls",
  "wegMapleCedar",
  "cedarCreek",
  "wegCedarRiverton",
  "riverton",
  "wegRivertonIronwood",
  "ironwood",
  "wegIronwoodSilicon",
  "siliconBay",
  "wegSiliconDelacroix",
  "portDelacroix",
  "wegDelacroixDesert",
  "desertSprings",
  "wegDesertSummit",
  "summitCity",
  "hochebene",
  "wegSummitCrossroads",
  "crossroads",
  "wegCrossroadsPinewood",
  "pinewoodCamp",
  "wegPinewoodGhost",
  "ghostTown",
  "wegGhostCapital",
  "capitalArena",
  "bayou",
];
// Münzen wie in regeln/muenzen.ts (MUENZEN); Rollen, Fundmünzen, Karten in ladeWelt für --wirtschaft.
const MUENZEN_ERSTE_NADEL = 50;
const VERSUCHE_JE_ZUSTAND = 16;
const RUHE_NEUER_VERSUCH = 61;
const RUHE_TAKT = 150;
const RUHE_NAECHSTES_GEBIET = 400;
const RUHE_ENDE = 1500;
/** So viele Schritte erkundet der gründliche Spieler noch, wenn Abspann und Epilog vorbei sind. */
const SCHRITTE_NACH_DEM_ENDE = 2 * RUHE_ENDE;

// ---------------------------------------------------------------- Aufruf und Daten

const gross = (s) => s[0].toUpperCase() + s.slice(1);
const variablenname = (kennung) => kennung.split(".").map(gross).join("");

/**
 * Die Objekte der Fassung, die gerade gilt: die letzte Zustandskarte, deren Bedingung erfüllt ist,
 * sonst die Grundkarte (oberwelt/kartenfassung.ts). Beispiel: mapleFalls.zimmer hat den Schreibtisch
 * mit Brett und Ambrose erst mit ersterAbendGesehen.
 */
function objekteJetzt(welt, st, karte) {
  const passend = (welt.fassungen[karte] || []).filter((f) => gilt(st, f.wenn));
  const objekte = passend.length
    ? passend[passend.length - 1].objekte
    : welt.grundobjekte[karte];
  // Mit Uhr: Figuren nach Tagesablauf, die Geschichte geht vor (gesamtsimulation-uhr.cjs).
  return nachUhr(welt, st, karte, objekte, gilt);
}

// ---------------------------------------------------------------- Spielstand und Quests

/**
 * Rivale Victor oder Rivalin Victoria (Wunsch des Autors, 22.11.2026): dieselben Wörter wie die
 * App (inhalte/abenteuer/rivalformen.json, app/src/abenteuer/regeln/rivalform.ts). Die Fassung
 * wählt die Umgebungsvariable ABENTEUER_RIVALIN=1; ohne sie spielt die Simulation mit Victor.
 */
function rivalvariablen() {
  const formen = JSON.parse(fs.readFileSync(path.join(DATEN, "rivalformen.json"), "utf8")).de;
  const rivalin = process.env.ABENTEUER_RIVALIN === "1";
  return { rivalin, ...(rivalin ? formen.rivalin : formen.rivale) };
}

function neuerStand(startwert) {
  return {
    vars: { held: "Kim", ...rivalvariablen() },
    zeitachse: [],
    besitz: new Set(),
    karten: {},
    muenzen: 0,
    staende: [],
    // Seit der Einleitung (19.11.2026) wie die App vor dem Haus (regeln/spielstand.ts, STARTPOSITION).
    karte: "mapleFalls.aussen",
    besucht: new Set(),
    abspann: false,
    partien: {},
    runden: {},
    gesehen: new Set(),
    meldungen: new Set(),
    saat: startwert,
    karteBesucht: {},
    uhr: 0,
    // Spieluhr (gesamtsimulation-uhr.cjs): null ohne Uhr, sonst die Stunde (SIM_STUNDE, #uhr).
    stunde: startstunde(),
    // Chaos-Prüfung (gesamtsimulation-chaos.cjs): echte Preise, zu teure Gegenstände, Chaos-Spieler.
    echt: false,
    zuTeuer: new Set(),
    chaos: null,
  };
}

const LCG_FAKTOR = 1103515245;
const LCG_SUMMAND = 12345;
const LCG_MODUL = 2147483648; // 2^31
const LCG_MASKE = 0x7fffffff;

/**
 * Der nächste Wert der linearen Kongruenz, exakt modulo 2^31.
 * Warum Math.imul: `saat * 1103515245` liegt weit über 2^53; als Gleitkommazahl gerechnet gingen
 * die unteren Bits verloren, und die Folge lief schon nach etwa 13 000 Werten in einen Zyklus von
 * 10 466 (Startwert 3). Mit dem gleichmäßigen Takt der Simulation (neue Versuche alle 150 Schritte)
 * traf Miss Odile in Port Delacroix dann immer dieselben Werte, und der Clubkampf kam nie (Befund
 * vom 19.11.2026). Math.imul rechnet die unteren 32 Bit genau; die Maske nimmt davon 31.
 * Beispiel: naechsteSaat(3) → 3310558080 & 0x7fffffff = 1163074432.
 */
function naechsteSaat(saat) {
  return (Math.imul(saat, LCG_FAKTOR) + LCG_SUMMAND) & LCG_MASKE;
}

/** Wiederholbarer Zufall für die Wahlen (lineare Kongruenz, siehe naechsteSaat). */
function zufall(st) {
  st.saat = naechsteSaat(st.saat);
  return st.saat / LCG_MODUL;
}

function passt(e, x) {
  if (e.art !== x.art) return false;
  if (e.art === "dialog") return e.knoten === x.knoten;
  if (e.art === "aufgaben") return e.runde === x.runde;
  if (e.art === "partie")
    return (
      e.begegnung === x.begegnung &&
      x.ausgang.some((a) => e.ausgang.includes(a))
    );
  return (
    e.karte === x.karte &&
    (e.ausloeser === undefined || e.ausloeser === x.ausloeser)
  );
}

function wirke(st, wirkungen) {
  for (const w of wirkungen || []) {
    if (w.art === "karte") {
      st.karten[w.karte] = (st.karten[w.karte] || 0) + 1;
      st.zeitachse.push({ art: "karte", karte: w.karte });
    }
    if (w.art === "gegenstand") st.besitz.add(w.gegenstand);
    if (w.art === "gegenstandWeg") st.besitz.delete(w.gegenstand);
    if (w.art === "muenzen") {
      verdiene(st, w.anzahl, "quest");
    }
  }
}

/**
 * Schon eingetreten (wie schonEingetreten in regeln/quests.ts): Runde bestanden oder Partie mit
 * passendem Ausgang, ablesbar an den Variablen `<ort><Name>Bestanden` und `ausgang<Begegnung>`.
 */
function schonEingetreten(st, e) {
  if (e.art === "aufgaben") {
    const teile = e.runde.split(".");
    const name = teile.pop();
    return Boolean(st.vars[teile.join("") + gross(name) + "Bestanden"]);
  }
  if (e.art === "partie")
    return e.ausgang.includes(st.vars["ausgang" + variablenname(e.begegnung)]);
  return false;
}

/** Rückt über Schritte vor, deren Ereignis schon eingetreten ist (außer dem gemeldeten). */
function holeNach(st, q, s, x) {
  while (!s.fertig) {
    const e = q.schritte[s.i].ereignis;
    if (passt(e, x) || !schonEingetreten(st, e)) return;
    wirke(st, q.schritte[s.i].wirkungen);
    s.i++;
    s.fertig = s.i >= q.schritte.length;
  }
}

/** Ein Ereignis der Welt: Schritte laufender Quests, dann neue Quests (wie regeln/quests.ts). */
function melde(welt, st, x) {
  for (const s of st.staende) {
    if (s.fertig) continue;
    const q = welt.quests.find((q) => q.kennung === s.k);
    if (!passt(q.schritte[s.i].ereignis, x)) continue;
    wirke(st, q.schritte[s.i].wirkungen);
    s.i++;
    s.fertig = s.i >= q.schritte.length;
    holeNach(st, q, s, x);
  }
  for (const q of welt.quests) {
    if (st.staende.some((s) => s.k === q.kennung) || !passt(q.start, x))
      continue;
    if (
      !(q.voraussetzung || []).every((v) =>
        st.staende.some((s) => s.k === v && s.fertig),
      )
    )
      continue;
    const neu = { k: q.kennung, i: 0, fertig: false };
    st.staende.push(neu);
    holeNach(st, q, neu, x);
  }
}

/** Münzen gutschreiben: im Stand (für die Dialogvariable `muenzen`) und in der Zeitachse. */
function verdiene(st, anzahl, quelle) {
  st.muenzen += anzahl;
  st.zeitachse.push({ art: "muenzen", anzahl, quelle });
}

/**
 * Ob die Erkundung zu Ende ist, weil die Geschichte erzählt ist: Abspann gesehen, jede Hauptquest
 * fertig, und seitdem SCHRITTE_NACH_DEM_ENDE Schritte. Danach übernimmt die Rückkehr die offenen
 * Nebenquests (gesamtsimulation-rueckkehr.cjs).
 * Warum: In der fertigen Welt kommt die Ruhe oft nicht zustande (Tagesabläufe und Ausgänge
 * wechseln), und der Spieler irrte zwischen den alten Orten umher, bis die Uhr ablief. Startwert 2
 * lief nach dem Epilog 17 000 Schritte (mehr als die Hälfte des Laufs, Zeitbudget im Gate, 26.11.2026);
 * Startwert 1 kommt nach 1 600 Schritten von selbst zur Ruhe und bleibt unverändert.
 */
function fertigErkundet(welt, st) {
  if (!st.abspann) return false;
  if (!welt.quests.every((q) => !q.haupt || st.staende.some((s) => s.k === q.kennung && s.fertig)))
    return false;
  st.schritteNachDemEnde = (st.schritteNachDemEnde || 0) + 1;
  return st.schritteNachDemEnde > SCHRITTE_NACH_DEM_ENDE;
}

/**
 * Nimmt Zahlungen zurück (Stellen in der Zeitachse, absteigend entfernt), etwa den Fahrpreis des
 * Lastkahns, wenn die Simulation die Reise danach ablehnt (reiseErlaubtFuer in gesamtsimulation.cjs).
 * Warum: Ein Mensch, der nicht fahren will, wählt „Hierbleiben“. Die Simulation zahlte sonst bei
 * jedem Ansprechen und blieb doch in Lockport: Startwert 2 zahlte 150 Fahrten (750 Münzen), und der
 * Rest des sparsamen Spielers hing an diesem Umherirren statt an den Preisen (26.11.2026).
 */
function storniere(st, stellen = []) {
  for (const i of [...stellen].sort((a, b) => b - a)) {
    st.muenzen -= st.zeitachse[i].anzahl;
    st.zeitachse.splice(i, 1);
  }
}

/**
 * Ob `wenn` (Bedingung, bedingung.cjs) gilt; Besitz zählt mit wie in der App.
 * Mit `merker` (Map, nur solange sich der Stand nicht ändert, etwa in einer Wegsuche) werden die
 * Variablen einmal zusammengesetzt und die Antworten gemerkt: Das sparte die meiste Rechenzeit.
 */
function gilt(st, wenn, merker = null) {
  if (!wenn) return true;
  if (!merker) return erfuellt(wenn, { ...st.vars, ...besitzvariablen(st) });
  if (!merker.has(wenn)) {
    if (!merker.variablen)
      merker.variablen = { ...st.vars, ...besitzvariablen(st) };
    merker.set(wenn, erfuellt(wenn, merker.variablen));
  }
  return merker.get(wenn);
}

/** Variablen aus dem Besitz, beim Öffnen jedes Dialogs neu (regeln/dialogvariablen.ts). */
function besitzvariablen(st) {
  // hierKarte: die Karte unter dem Helden, wie variablenAusBesitz in der App (Ward auf der Bank).
  const v = { muenzen: st.muenzen, hierKarte: st.karte };
  for (const g of st.besitz) v["hat" + gross(g)] = true;
  for (const [k, n] of Object.entries(st.karten))
    v["hatKarte" + gross(k)] = n > 0;
  return v;
}

/** Fingerabdruck des Spielstands; Zähler sind gekappt, damit Wiederholungen ruhig werden. */
function zustand(st) {
  const vars = Object.entries(st.vars)
    .filter(([n]) => !n.startsWith("siege"))
    .map(([n, w]) => [n, typeof w === "number" ? Math.min(w, 5) : w]);
  const zaehler = (o, m) =>
    Object.entries(o).map(([k, n]) => k + Math.min(n, m));
  return JSON.stringify([
    vars,
    st.staende,
    [...st.besitz],
    zaehler(st.partien, 4),
    zaehler(st.runden, 2),
  ]);
}

/**
 * In Ruhe ein neuer Anlauf: Jedes Ding darf noch einmal angefasst werden, und jeder Weg mit Dialog,
 * der in diesem Zustand gesperrt blieb, wird noch einmal versucht.
 * Warum auch die Wege: Ein Übergang kann eine Wahl enthalten („Mit dem Zug nach Hause fahren“ oder
 * „Noch bleiben“ am Kanalweg in Riverton, „Eine Stellung.“ oder „Später.“ an den Wegsperren S15
 * bis S17). Wählt der Zufall einmal „bleiben“, ändert sich nichts am Zustand, und der Weg blieb
 * bisher für immer gesperrt (Startwert 2 blieb so in Riverton hängen, 17.11.2026).
 */
function neueVersuche(st) {
  for (const n of Object.keys(st.versuche))
    st.versuche[n] = VERSUCHE_JE_ZUSTAND - 1;
  st.gesperrt = {};
  // Mit Uhr wartet der Spieler in Ruhe bis zur nächsten Phase (Bank, Bett; gesamtsimulation-uhr.cjs).
  warte(st);
}

// ---------------------------------------------------------------- Bewegung

/**
 * Was nach dem Betreten einer Karte noch geschieht; gesamtsimulation-dialoge.cjs trägt hier den
 * Eingangsdialog ein (orte.json, Feld „eingang“, wie oberwelt/eingang.ts der App). Ein Haken statt
 * eines Aufrufs, weil die Dialoge dieses Modul laden (sonst ein Kreis).
 */
const nachBetreten = [];

function betrete(welt, st, karte) {
  const ort = welt.karteZuOrt[karte];
  if (!ort) {
    st.meldungen.add(`Karte fehlt: ${karte}`);
    return;
  }
  if (st.letzterOrt !== ort.kennung)
    st.zeitachse.push({ art: "ort", ort: ort.kennung });
  st.karte = karte;
  st.letzterOrt = ort.kennung;
  st.karteBesucht[karte] = ++st.uhr;
  if (!st.besucht.has(ort.kennung)) {
    st.besucht.add(ort.kennung);
    st.vars["besucht" + gross(ort.kennung)] = true;
  }
  melde(welt, st, { art: "ort", karte });
  for (const f of nachBetreten) f(welt, st, karte);
}

function ausloeserFuer(ort, karte, name) {
  return (
    ort.ausloeser.find((a) => a.name === name && a.karte === karte) ||
    ort.ausloeser.find((a) => a.name === name && !a.karte)
  );
}

module.exports = {
  APP,
  gross,
  variablenname,
  besitzvariablen,
  verdiene,
  storniere,
  fertigErkundet,
  zufall,
  naechsteSaat,
  gilt,
  MUENZEN_ERSTE_NADEL,
  ladeWelt,
  objekteJetzt,
  figurenOhneKarte,
  neuerStand,
  zustand,
  betrete,
  nachBetreten,
  ausloeserFuer,
  melde,
  FOLGE,
  VERSUCHE_JE_ZUSTAND,
  RUHE_NEUER_VERSUCH,
  RUHE_TAKT,
  RUHE_NAECHSTES_GEBIET,
  RUHE_ENDE,
  neueVersuche,
};
