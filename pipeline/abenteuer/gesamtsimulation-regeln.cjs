// Regeln der Gesamtsimulation (gesamtsimulation.cjs): Spieldaten, Spielstand, Quests, Dialoge und
// Folgen eines Dialogs wie in der App (oberwelt/Oberwelt.tsx, regeln/quests.ts, dialogvariablen.ts);
// eigene Datei, damit jede unter 400 Zeilen bleibt (CLAUDE.md, Regel 4).
"use strict";
const fs = require("fs");
const path = require("path");

const HAUPT = path.resolve(__dirname, "..", "..");
const APP = path.join(HAUPT, "app", "node_modules", "inkjs");
const { Compiler } = require(path.join(APP, "compiler", "Compiler"));
const { CompilerOptions } = require(path.join(APP, "compiler", "CompilerOptions"));
const { Story } = require(APP);
const DATEN = path.join(HAUPT, "inhalte", "abenteuer");

/** Gebiete in der Reihenfolge der Geschichte (Story-Bibel, Teil 1 bis 4). */
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
  "hochebene",
  "summitCity",
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
const MUENZEN_STRASSENSIEG = 10;
const MUENZEN_RUNDE = 10;
const MUENZEN_ERSTE_NADEL = 50;
const AUSGAENGE = ["abgebrochen", "niederlage", "remis", "sieg"];
const VERSUCHE_JE_ZUSTAND = 16;
const RUHE_NEUER_VERSUCH = 61;
const RUHE_TAKT = 150;
const RUHE_NAECHSTES_GEBIET = 400;
const RUHE_ENDE = 1500;
const WAHLEN_JE_DIALOG = 60;

// ---------------------------------------------------------------- Aufruf und Daten

const lade = (name) => JSON.parse(fs.readFileSync(path.join(DATEN, name), "utf8"));
const gross = (s) => s[0].toUpperCase() + s.slice(1);
const variablenname = (kennung) => kennung.split(".").map(gross).join("");

/** Alle Spieldaten: Orte, Quests, Läden, Begegnungen, Ink (mit Besuchszählung), Objekte der Karten. */
function ladeWelt() {
  const orte = lade("orte.json").orte;
  const welt = {
    orte,
    quests: lade("quests.json").quests,
    laeden: lade("laeden.json").laeden,
    begegnungen: new Set(lade("begegnungen.json").begegnungen.map((b) => b.kennung)),
    rolle: rollenJeBegegnung(),
    fundmuenzen: Object.fromEntries(
      lade("funde.json").funde.map((f) => [f.kennung, f.muenzen || 0]),
    ),
    karten: Object.fromEntries(lade("karten.json").karten.map((k) => [k.kennung, k])),
    kartenErlaubt: Object.fromEntries(
      lade("begegnungen.json").begegnungen.map((b) => [b.kennung, b.kartenErlaubt]),
    ),
    ink: {},
    knoten: {},
    objekte: {},
    karteZuOrt: {},
  };
  const ordner = path.join(DATEN, "dialoge", "de");
  for (const datei of fs.readdirSync(ordner).filter((d) => d.endsWith(".ink"))) {
    const quelle = fs.readFileSync(path.join(ordner, datei), "utf8");
    const name = datei.replace(".ink", "");
    welt.ink[name] = new Compiler(quelle, new CompilerOptions(null, [], true)).Compile().ToJson();
    welt.knoten[name] = [...quelle.matchAll(/^=== (\w+) ===/gm)].map((m) => m[1]);
  }
  for (const ort of orte)
    for (const k of ort.karten) {
      welt.karteZuOrt[k.kennung] = ort;
      const tiled = JSON.parse(fs.readFileSync(path.join(DATEN, k.datei), "utf8"));
      welt.objekte[k.kennung] = tiled.layers
        .filter((l) => l.type === "objectgroup")
        .flatMap((l) => l.objects.map((o) => ({ name: o.name, typ: o.type || o.class })))
        .filter((o) => o.typ !== "statist" && o.typ !== "tier");
    }
  return welt;
}

/** Rolle des Gegners (strasse, clubchef …) je Begegnung, aus begegnungen.json und gegner.json. */
function rollenJeBegegnung() {
  const rollen = Object.fromEntries(lade("gegner.json").gegner.map((g) => [g.kennung, g.rolle]));
  return Object.fromEntries(
    lade("begegnungen.json").begegnungen.map((b) => [b.kennung, rollen[b.gegner]]),
  );
}

/** Figuren, die auf keiner Karte ihres Ortes stehen; die bekannten werden ersatzweise gesetzt. */
function figurenOhneKarte(welt, ersatz) {
  const ohne = [];
  for (const ort of welt.orte)
    for (const f of ort.figuren) {
      const kurz = f.kennung.split(".")[1];
      if (ort.karten.some((k) => welt.objekte[k.kennung].some((o) => o.name === kurz))) continue;
      ohne.push(f.kennung);
      if (!ersatz.includes(f.kennung)) continue;
      const datei = "karten/" + f.dialog.split(".")[0] + ".json";
      const k = ort.karten.find((x) => x.datei === datei) || ort.karten[0];
      welt.objekte[k.kennung].push({ name: kurz, typ: "figur" });
    }
  return ohne;
}

// ---------------------------------------------------------------- Spielstand und Quests

function neuerStand(startwert) {
  return {
    vars: { held: "Kim" },
    zeitachse: [],
    besitz: new Set(),
    karten: {},
    muenzen: 0,
    staende: [],
    karte: "mapleFalls.dachboden",
    besucht: new Set(),
    abspann: false,
    partien: {},
    runden: {},
    gesehen: new Set(),
    meldungen: new Set(),
    saat: startwert,
    karteBesucht: {},
    uhr: 0,
  };
}

/** Wiederholbarer Zufall für die Wahlen (lineare Kongruenz). */
function zufall(st) {
  st.saat = (st.saat * 1103515245 + 12345) % 2147483648;
  return st.saat / 2147483648;
}

function passt(e, x) {
  if (e.art !== x.art) return false;
  if (e.art === "dialog") return e.knoten === x.knoten;
  if (e.art === "aufgaben") return e.runde === x.runde;
  if (e.art === "partie")
    return e.begegnung === x.begegnung && x.ausgang.some((a) => e.ausgang.includes(a));
  return e.karte === x.karte && (e.ausloeser === undefined || e.ausloeser === x.ausloeser);
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
      st.muenzen += w.anzahl;
      st.zeitachse.push({ art: "muenzen", anzahl: w.anzahl, quelle: "quest" });
    }
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
  }
  for (const q of welt.quests) {
    if (st.staende.some((s) => s.k === q.kennung) || !passt(q.start, x)) continue;
    if (!(q.voraussetzung || []).every((v) => st.staende.some((s) => s.k === v && s.fertig)))
      continue;
    st.staende.push({ k: q.kennung, i: 0, fertig: false });
  }
}

/** Variablen aus dem Besitz, beim Öffnen jedes Dialogs neu (regeln/dialogvariablen.ts). */
function besitzvariablen(st) {
  const v = { muenzen: st.muenzen };
  for (const g of st.besitz) v["hat" + gross(g)] = true;
  for (const [k, n] of Object.entries(st.karten)) v["hatKarte" + gross(k)] = n > 0;
  return v;
}

/** Fingerabdruck des Spielstands; Zähler sind gekappt, damit Wiederholungen ruhig werden. */
function zustand(st) {
  const vars = Object.entries(st.vars)
    .filter(([n]) => !n.startsWith("siege"))
    .map(([n, w]) => [n, typeof w === "number" ? Math.min(w, 5) : w]);
  const zaehler = (o, m) => Object.entries(o).map(([k, n]) => k + Math.min(n, m));
  return JSON.stringify([
    vars,
    st.staende,
    [...st.besitz],
    zaehler(st.partien, 4),
    zaehler(st.runden, 2),
  ]);
}

// ---------------------------------------------------------------- Dialoge

/** Eine Geschichte je Datei, einmal gebaut; die Hülle meldet ihre Folgen in `st.folgen`. */
function geschichte(welt, st, datei) {
  welt.geschichten = welt.geschichten || {};
  if (welt.geschichten[datei]) return welt.geschichten[datei];
  const s = new Story(welt.ink[datei]);
  const binde = (name, f) => s.BindExternalFunction(name, f, false);
  binde("beginnePartie", (b) => {
    st.folgen.partie = b;
  });
  binde("beginneAufgaben", (r) => {
    st.folgen.runde = r;
  });
  binde("reise", (k, a) => {
    st.folgen.reise = { karte: k, ausloeser: a };
  });
  binde("oeffneLaden", (l) => {
    st.folgen.laden = l;
  });
  binde("zeigeAbspann", () => {
    st.folgen.abspann = true;
  });
  binde("gibFund", (f) => {
    const name = "gefunden" + gross(f);
    if (!st.vars[name] && welt.fundmuenzen[f]) {
      st.zeitachse.push({ art: "muenzen", anzahl: welt.fundmuenzen[f], quelle: "fund" });
    }
    st.folgen.huelle[name] = true;
  });
  binde("gibKarte", (k) => {
    st.karten[k] = (st.karten[k] || 0) + 1;
    st.zeitachse.push({ art: "karte", karte: k });
  });
  for (const f of ["setzeSzene", "setzeZustand", "schalteSteckbrief"]) binde(f, () => {});
  return (welt.geschichten[datei] = s);
}

/** Spielt einen Dialog ab Knoten (Datei.Knoten) mit zufälligen Wahlen; gibt seine Folgen zurück. */
function dialog(welt, st, knoten) {
  const [datei, k] = knoten.split(".");
  if (!welt.ink[datei]) {
    st.meldungen.add(`Dialogdatei fehlt: ${knoten}`);
    return {};
  }
  const s = geschichte(welt, st, datei);
  s.ResetState();
  st.folgen = { huelle: {} };
  for (const [n, w] of Object.entries({ ...st.vars, ...besitzvariablen(st) })) {
    try {
      s.variablesState.$(n, w);
    } catch {
      /* Variable gibt es in dieser Datei nicht */
    }
  }
  try {
    s.ChoosePathString(k);
  } catch {
    st.meldungen.add(`Knoten fehlt: ${knoten}`);
    return {};
  }
  spieleAb(welt, st, s, datei, knoten);
  for (const kk of welt.knoten[datei])
    if (s.state.VisitCountAtPathString(kk) > 0) st.gesehen.add(datei + "." + kk);
  const ausInk = {};
  for (const n of s.variablesState._globalVariables.keys()) ausInk[n] = s.variablesState.$(n);
  Object.assign(st.vars, ausInk, st.folgen.huelle);
  for (const n of Object.keys(besitzvariablen(st))) delete st.vars[n];
  return st.folgen;
}

function spieleAb(welt, st, s, datei, knoten) {
  let gemeldet = null;
  try {
    for (let wahlen = 0; wahlen <= WAHLEN_JE_DIALOG; wahlen++) {
      while (s.canContinue) {
        const zeile = s.Continue().trim();
        const p = (s.state.currentPathString || "").split(".")[0];
        if (zeile && p && p !== gemeldet) {
          gemeldet = p;
          melde(welt, st, { art: "dialog", knoten: datei + "." + p });
        }
      }
      if (!s.currentChoices.length) return;
      s.ChooseChoiceIndex(Math.floor(zufall(st) * s.currentChoices.length));
    }
  } catch (e) {
    st.meldungen.add(`Laufzeitfehler ${knoten}: ${e.message}`);
  }
}

// ---------------------------------------------------------------- Folgen eines Dialogs

function spielePartie(welt, st, b) {
  if (!welt.begegnungen.has(b)) st.meldungen.add(`Begegnung fehlt: ${b}`);
  const n = (st.partien[b] = (st.partien[b] || 0) + 1);
  const a = AUSGAENGE[Math.min(n, AUSGAENGE.length) - 1];
  const name = variablenname(b);
  st.vars["ausgang" + name] = a;
  // Wirtschaft: erster Sieg gegen einen Straßengegner (MUENZEN.strassensieg), erster Clubkampf.
  if (a === "sieg" && !st.vars["siege" + name] && welt.rolle[b] === "strasse") {
    st.zeitachse.push({ art: "muenzen", anzahl: MUENZEN_STRASSENSIEG, quelle: "strasse" });
  }
  if (welt.rolle[b] === "clubchef" && n === 1)
    st.zeitachse.push({ art: "clubkampf", begegnung: b });
  if (a === "sieg") st.vars["siege" + name] = (st.vars["siege" + name] || 0) + 1;
  if (b.endsWith(".clubkampf") && (a === "sieg" || a === "remis")) {
    const nadel = "nadel" + gross(b.split(".")[0]);
    st.vars[nadel] = Math.max(st.vars[nadel] || 0, a === "sieg" ? 2 : 1);
  }
  if (a !== "abgebrochen") melde(welt, st, { art: "partie", begegnung: b, ausgang: [a] });
}

function spieleRunde(welt, st, r) {
  const n = (st.runden[r] = (st.runden[r] || 0) + 1);
  if (n < 2) return;
  const teile = r.split("."),
    name = teile.pop();
  if (n === 2) st.zeitachse.push({ art: "muenzen", anzahl: MUENZEN_RUNDE, quelle: "runde" });
  st.vars[name + "Bestanden"] = true;
  st.vars[teile.join("") + gross(name) + "Bestanden"] = true;
  melde(welt, st, { art: "aufgaben", runde: r });
}

/** Folgen nach dem Dialog wie beiDialogende: Laden, Reise, Übergang, Runde, Partie, Abspann. */
function wendeFolgenAn(welt, st, f, uebergang, reiseErlaubt) {
  if (f.abspann) st.abspann = true;
  const laden = welt.laeden.find((l) => l.kennung === f.laden);
  if (laden) st.zeitachse.push({ art: "laden", laden: laden.kennung });
  for (const w of laden ? laden.angebot : []) if (w.art === "gegenstand") st.besitz.add(w.kennung);
  let ziel = f.reise && reiseErlaubt(f.reise.karte) ? f.reise : null;
  if (uebergang && (!uebergang.wenn || Boolean(st.vars[uebergang.wenn]))) ziel = uebergang.ziel;
  if (f.runde) spieleRunde(welt, st, f.runde);
  if (f.partie) spielePartie(welt, st, f.partie);
  if (ziel) betrete(welt, st, ziel.karte);
}

// ---------------------------------------------------------------- Bewegung

function betrete(welt, st, karte) {
  const ort = welt.karteZuOrt[karte];
  if (!ort) {
    st.meldungen.add(`Karte fehlt: ${karte}`);
    return;
  }
  if (st.letzterOrt !== ort.kennung) st.zeitachse.push({ art: "ort", ort: ort.kennung });
  st.karte = karte;
  st.letzterOrt = ort.kennung;
  st.karteBesucht[karte] = ++st.uhr;
  if (!st.besucht.has(ort.kennung)) {
    st.besucht.add(ort.kennung);
    st.vars["besucht" + gross(ort.kennung)] = true;
  }
  melde(welt, st, { art: "ort", karte });
}

function ausloeserFuer(ort, karte, name) {
  return (
    ort.ausloeser.find((a) => a.name === name && a.karte === karte) ||
    ort.ausloeser.find((a) => a.name === name && !a.karte)
  );
}

module.exports = {
  MUENZEN_ERSTE_NADEL,
  ladeWelt,
  figurenOhneKarte,
  neuerStand,
  zustand,
  dialog,
  wendeFolgenAn,
  betrete,
  ausloeserFuer,
  melde,
  FOLGE,
  VERSUCHE_JE_ZUSTAND,
  RUHE_NEUER_VERSUCH,
  RUHE_TAKT,
  RUHE_NAECHSTES_GEBIET,
  RUHE_ENDE,
};
