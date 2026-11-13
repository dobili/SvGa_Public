// Gesamtsimulation, Dialoge und ihre Folgen (aus gesamtsimulation-regeln.cjs, Größengrenze): Ink-
// Geschichten mit den externen Funktionen der App (dialog/geschichte.ts) und was nach dem Dialog
// geschieht (Partie, Runde, Partieform, Laden, Reise, Übergang) wie in oberwelt/useDialogende.ts.
"use strict";
const { Story } = require(require("./gesamtsimulation-regeln.cjs").APP);
const {
  gross,
  variablenname,
  besitzvariablen,
  melde,
  verdiene,
  zufall,
  gilt,
  betrete,
} = require("./gesamtsimulation-regeln.cjs");

const MUENZEN_STRASSENSIEG = 10;
const MUENZEN_RUNDE = 10;
const AUSGAENGE = ["abgebrochen", "niederlage", "remis", "sieg"];
const WAHLEN_JE_DIALOG = 60;

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
      verdiene(st, welt.fundmuenzen[f], "fund");
    }
    st.folgen.huelle[name] = true;
  });
  binde("gibKarte", (k) => {
    st.karten[k] = (st.karten[k] || 0) + 1;
    st.zeitachse.push({ art: "karte", karte: k });
  });
  // Fahrpreis (regeln/muenzen.ts, bezahle): nur wenn es reicht; der Dialog fragt vorher `muenzen` ab.
  binde("zahle", (n) => {
    if (n >= 1 && st.muenzen >= n) verdiene(st, -n, "fahrt");
  });
  // Partieformen der Runde 6 (Gedächtnisstellung, Simultan): wie eine Aufgabenrunde nach dem Dialog.
  for (const f of ["beginneGedaechtnis", "beginneSimultan"]) {
    binde(f, (k) => {
      st.folgen.partieform = k;
    });
  }
  const ohneFolgen = [
    "setzeSzene",
    "setzeZustand",
    "schalteSteckbrief",
    "setzeToenung",
    "zeigeVorfuehrung",
    "zeigeFensterbank",
    "schreibeTagebuch",
  ];
  for (const f of ohneFolgen) binde(f, () => {});
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
    if (s.state.VisitCountAtPathString(kk) > 0)
      st.gesehen.add(datei + "." + kk);
  const ausInk = {};
  for (const n of s.variablesState._globalVariables.keys())
    ausInk[n] = s.variablesState.$(n);
  Object.assign(st.vars, ausInk, st.folgen.huelle);
  for (const n of Object.keys(besitzvariablen(st))) delete st.vars[n];
  return st.folgen;
}

/**
 * Spielt mit zufälligen Wahlen ab und meldet jeden neu besuchten Knoten (Besuchszahl wie
 * dialog/geschichte.ts, neueKnoten): Der Zeiger nach der letzten Zeile vor END steht auf nichts,
 * ein Knoten mit nur einer Zeile (pelikaninsel.leuchtfeuer_einsetzen) ginge sonst verloren.
 */
function spieleAb(welt, st, s, datei, knoten) {
  const besuche = new Map();
  const meldeNeue = () => {
    for (const k of welt.knoten[datei]) {
      const n = s.state.VisitCountAtPathString(k);
      if (n > (besuche.get(k) || 0))
        melde(welt, st, { art: "dialog", knoten: datei + "." + k });
      besuche.set(k, n);
    }
  };
  try {
    for (let wahlen = 0; wahlen <= WAHLEN_JE_DIALOG; wahlen++) {
      while (s.canContinue) {
        s.Continue();
        meldeNeue();
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
    verdiene(st, MUENZEN_STRASSENSIEG, "strasse");
  }
  if (welt.rolle[b] === "clubchef" && n === 1)
    st.zeitachse.push({ art: "clubkampf", begegnung: b });
  if (a === "sieg")
    st.vars["siege" + name] = (st.vars["siege" + name] || 0) + 1;
  if (b.endsWith(".clubkampf") && (a === "sieg" || a === "remis")) {
    const nadel = "nadel" + gross(b.split(".")[0]);
    st.vars[nadel] = Math.max(st.vars[nadel] || 0, a === "sieg" ? 2 : 1);
  }
  if (a !== "abgebrochen")
    melde(welt, st, { art: "partie", begegnung: b, ausgang: [a] });
}

function spieleRunde(welt, st, r) {
  const n = (st.runden[r] = (st.runden[r] || 0) + 1);
  if (n < 2) return;
  const teile = r.split("."),
    name = teile.pop();
  if (n === 2) verdiene(st, MUENZEN_RUNDE, "runde");
  st.vars[name + "Bestanden"] = true;
  st.vars[teile.join("") + gross(name) + "Bestanden"] = true;
  melde(welt, st, { art: "aufgaben", runde: r });
}

/**
 * Gedächtnisstellung oder Simultan (Runde 6): erst nicht bestanden, dann bestanden, wie Runden;
 * setzt Kurz- und Langform von <name>Bestanden, beim Simultan auch <name>Punkte, und meldet das
 * Quest-Ereignis „aufgaben“ (app/src/abenteuer/regeln/simultan.ts, Oberwelt.tsx). Keine Münzen.
 */
function spielePartieform(welt, st, k) {
  const n = (st.runden[k] = (st.runden[k] || 0) + 1);
  if (n < 2) return;
  const teile = k.split("."),
    name = teile.pop();
  st.vars[name + "Bestanden"] = true;
  st.vars[teile.join("") + gross(name) + "Bestanden"] = true;
  st.vars[name + "Punkte"] = 1;
  melde(welt, st, { art: "aufgaben", runde: k });
}

/** Folgen nach dem Dialog wie beiDialogende: Laden, Reise, Übergang, Runde, Partie, Abspann. */
function wendeFolgenAn(welt, st, f, uebergang, reiseErlaubt) {
  if (f.abspann) st.abspann = true;
  const laden = welt.laeden.find((l) => l.kennung === f.laden);
  if (laden) st.zeitachse.push({ art: "laden", laden: laden.kennung });
  for (const w of laden ? laden.angebot : [])
    if (w.art === "gegenstand") st.besitz.add(w.kennung);
  let ziel = f.reise && reiseErlaubt(f.reise.karte) ? f.reise : null;
  if (uebergang && gilt(st, uebergang.wenn)) ziel = uebergang.ziel;
  if (f.runde) spieleRunde(welt, st, f.runde);
  if (f.partieform) spielePartieform(welt, st, f.partieform);
  if (f.partie) spielePartie(welt, st, f.partie);
  if (ziel) betrete(welt, st, ziel.karte);
}

module.exports = { dialog, wendeFolgenAn };
