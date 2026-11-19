// Gesamtsimulation, Dialoge und ihre Folgen (aus gesamtsimulation-regeln.cjs, Größengrenze): Ink-
// Geschichten mit den externen Funktionen der App (dialog/geschichte.ts) und was nach dem Dialog
// geschieht (Partie, Runde, Partieform, Laden, Reise, Übergang) wie in oberwelt/useDialogende.ts.
//
// Haken für Werkzeuge, die mitlesen (lesefassung.cjs): Steht im Stand ein Leser (`st.leser`),
// bekommt er jeden Dialogbeginn, jede Zeile mit ihren Tags und jedes Dialogende, darf die Wahl
// treffen und nach Partie oder Runde gleich das Nachgespräch führen (`nachgespraech`). Ohne Leser
// (Gesamtsimulation, Chaos-Prüfung) bleibt alles wie bisher, auch der Zufall.
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
  nachBetreten,
} = require("./gesamtsimulation-regeln.cjs");

const MUENZEN_STRASSENSIEG = 10;
const MUENZEN_RUNDE = 10;
const MUENZEN_WIEDERHOLT = 2;
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
  // Nur Variablen, die es in dieser Datei gibt: Ink wirft sonst bei jeder fremden Variable einen
  // Fehler, und das Fangen kostete die meiste Rechenzeit der Simulation (Profil, 14.11.2026).
  const bekannt = s.variablesState._globalVariables;
  for (const [n, w] of Object.entries({ ...st.vars, ...besitzvariablen(st) })) {
    if (!bekannt.has(n)) continue;
    try {
      s.variablesState.$(n, w);
    } catch {
      /* Wert passt nicht zum Typ der Variable in dieser Datei */
    }
  }
  try {
    s.ChoosePathString(k);
  } catch {
    st.meldungen.add(`Knoten fehlt: ${knoten}`);
    return {};
  }
  st.leser?.beginn(knoten, s);
  const abbruch = spieleAb(welt, st, s, datei, knoten);
  for (const kk of welt.knoten[datei])
    if (s.state.VisitCountAtPathString(kk) > 0)
      st.gesehen.add(datei + "." + kk);
  // Neu geladen mitten im Dialog (Chaos-Spieler): Was nach dem Dialog geschehen sollte, ist weg;
  // was sofort wirkt (Funde, Karten, Bezahlen, Quests), steht schon im Stand, und die Ink-Variablen
  // so, wie sie beim zuletzt gemeldeten Knoten waren (useDialogende.ts, sichereVariablen).
  if (abbruch === "neuladen") {
    uebernimmVariablen(st, st.folgen.zwischenstand || {});
    return { huelle: {}, neugeladen: true };
  }
  uebernimmVariablen(st, inkVariablen(s));
  st.leser?.ende(knoten, st.folgen);
  return st.folgen;
}

/** Alle globalen Variablen der Geschichte (wie Geschichte.variablen in der App). */
function inkVariablen(s) {
  const ausInk = {};
  for (const n of s.variablesState._globalVariables.keys())
    ausInk[n] = s.variablesState.$(n);
  return ausInk;
}

/** Variablen aus Ink in den Stand; was die Hülle im Dialog gesetzt hat, gewinnt. */
function uebernimmVariablen(st, ausInk) {
  Object.assign(st.vars, ausInk, st.folgen.huelle);
  for (const n of Object.keys(besitzvariablen(st))) delete st.vars[n];
}

/**
 * Welche Antwort genommen wird: die des Lesers (`st.leser.waehle`, bekommt die Texte der Antworten
 * und gibt ihren Index zurück), sonst eine zufällige nach dem Startwert.
 * Beispiel: Auf dem Dachboden stehen „Die Decke wegziehen“ und „Lieber nicht anfassen“ zur Wahl.
 * Sonderfall: Ohne Leser wird der Zufall genau einmal je Wahl gezogen, wie vor dem Haken.
 */
function waehle(st, wahlen) {
  if (st.leser) return st.leser.waehle(wahlen.map((w) => w.text));
  return Math.floor(zufall(st) * wahlen.length);
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
      if (n > (besuche.get(k) || 0)) {
        // Wie Oberwelt.tsx: erst die Variablen sichern (Zwischenstand), dann der Quest-Schritt.
        st.folgen.zwischenstand = inkVariablen(s);
        melde(welt, st, { art: "dialog", knoten: datei + "." + k });
      }
      besuche.set(k, n);
    }
  };
  // Der Chaos-Spieler (gesamtsimulation-chaos.cjs) bricht nach einer Zeile ab: „zurueck“ (Taste
  // Zurück, wie Dialog.tsx: Variablen bleiben, Folgen laufen) oder „neuladen“ (Seite neu geladen).
  const abbruch = () => (st.chaos ? st.chaos.dialogabbruch() : null);
  try {
    for (let wahlen = 0; wahlen <= WAHLEN_JE_DIALOG; wahlen++) {
      while (s.canContinue) {
        const text = s.Continue();
        st.leser?.zeile(text, s.currentTags);
        meldeNeue();
        // Nur, solange noch etwas folgt: Nach der letzten Zeile endet der Dialog in der App sofort,
        // samt der Wirkungen dazwischen (Dialog.tsx, weiter).
        const a = s.canContinue || s.currentChoices.length ? abbruch() : null;
        if (a) return a;
      }
      if (!s.currentChoices.length) return null;
      s.ChooseChoiceIndex(waehle(st, s.currentChoices));
    }
  } catch (e) {
    st.meldungen.add(`Laufzeitfehler ${knoten}: ${e.message}`);
  }
  return null;
}

// ---------------------------------------------------------------- Folgen eines Dialogs

function spielePartie(welt, st, b) {
  if (!welt.begegnungen.has(b)) st.meldungen.add(`Begegnung fehlt: ${b}`);
  const n = (st.partien[b] = (st.partien[b] || 0) + 1);
  const a = st.chaos
    ? st.chaos.ausgang(b)
    : AUSGAENGE[Math.min(n, AUSGAENGE.length) - 1];
  const name = variablenname(b);
  st.vars["ausgang" + name] = a;
  // Wirtschaft: erster Sieg gegen einen Straßengegner (MUENZEN.strassensieg), erster Clubkampf.
  // Mit echten Preisen (st.echt, Chaos-Prüfung) bringt jeder weitere Sieg MUENZEN_WIEDERHOLT wie
  // ein Sieg am selben Tag (regeln/muenzen.ts, strassensiegWiederholt).
  if (a === "sieg" && welt.rolle[b] === "strasse") {
    if (!st.vars["siege" + name]) verdiene(st, MUENZEN_STRASSENSIEG, "strasse");
    else if (st.echt) verdiene(st, MUENZEN_WIEDERHOLT, "strasse");
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
  if (st.chaos ? !st.chaos.bestanden(r) : n < 2) return;
  const teile = r.split("."),
    name = teile.pop();
  if (!st.rundeBezahlt?.has(r)) verdiene(st, MUENZEN_RUNDE, "runde");
  (st.rundeBezahlt = st.rundeBezahlt || new Set()).add(r);
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
  if (st.chaos ? !st.chaos.bestanden(k) : n < 2) return;
  const teile = k.split("."),
    name = teile.pop();
  st.vars[name + "Bestanden"] = true;
  st.vars[teile.join("") + gross(name) + "Bestanden"] = true;
  st.vars[name + "Punkte"] = 1;
  melde(welt, st, { art: "aufgaben", runde: k });
}

/**
 * Einkauf mit echten Preisen (regeln/muenzen.ts, kaufe): Der Chaos-Spieler wählt selbst
 * (st.chaos.kaufe), der gründliche Spieler kauft jeden Gegenstand, den er bezahlen kann, keine Karten.
 * Gegenstände gibt es nur einmal (kaufhindernis „schonDa“).
 */
function kaufeEin(st, laden) {
  const waren = st.chaos
    ? st.chaos.kaufe(laden.angebot)
    : laden.angebot.filter((w) => w.art === "gegenstand");
  for (const w of waren) {
    if (w.art === "gegenstand" && st.besitz.has(w.kennung)) continue;
    if (st.muenzen < w.preis) {
      if (!st.chaos && w.art === "gegenstand") st.zuTeuer.add(w.kennung);
      continue;
    }
    verdiene(st, -w.preis, "laden");
    if (w.art === "gegenstand") st.besitz.add(w.kennung);
    else st.karten[w.kennung] = (st.karten[w.kennung] || 0) + 1;
  }
}

/** Folgen nach dem Dialog wie beiDialogende: Laden, Reise, Übergang, Runde, Partie, Abspann. */
function wendeFolgenAn(welt, st, f, uebergang, reiseErlaubt) {
  // Nach dem Neuladen ist der Dialog weg: kein Übergang, keine Partie, kein Laden.
  if (f.neugeladen) return;
  if (f.abspann) st.abspann = true;
  const laden = welt.laeden.find((l) => l.kennung === f.laden);
  if (laden) st.zeitachse.push({ art: "laden", laden: laden.kennung });
  if (laden && st.echt) kaufeEin(st, laden);
  else
    for (const w of laden ? laden.angebot : [])
      if (w.art === "gegenstand") st.besitz.add(w.kennung);
  let ziel = f.reise && reiseErlaubt(f.reise.karte) ? f.reise : null;
  if (uebergang && gilt(st, uebergang.wenn)) ziel = uebergang.ziel;
  if (f.runde) spieleRunde(welt, st, f.runde);
  if (f.partieform) spielePartieform(welt, st, f.partieform);
  if (f.partie) spielePartie(welt, st, f.partie);
  if (ziel) betrete(welt, st, ziel.karte);
  // Leser: Wer gerade gespielt hat, spricht den Gegner gleich noch einmal an (derselbe Knoten).
  const nochmal = ziel ? null : st.leser?.nachgespraech(f);
  if (nochmal)
    wendeFolgenAn(welt, st, dialog(welt, st, nochmal), null, reiseErlaubt);
}

/**
 * Eingangsdialog einer Karte wie in der App (oberwelt/eingang.ts): Gilt beim Betreten die
 * Bedingung des Feldes „eingang“ (orte.json), läuft der Dialog von selbst, mit seinen Folgen
 * (die Einleitung reist ins Wohnzimmer, dort läuft dann die Ankunft).
 */
function eingangsdialog(welt, st, karte) {
  const eintrag = welt.karteZuOrt[karte]?.karten.find(
    (k) => k.kennung === karte,
  );
  const eingang = eintrag?.eingang;
  if (!eingang || !gilt(st, eingang.wenn)) return;
  // Zufallsneutral: Die Einleitung kam am 19.11.2026 vor alles andere; verbrauchte sie Zufall,
  // nähme jeder Startwert danach einen anderen Weg als zuvor, und Läufe vor und nach ihr wären nicht
  // mehr vergleichbar. Ihre Wahlen ziehen Zufall wie sonst, danach gilt wieder der alte Startwert
  // (der Leser der Lesefassung wählt selbst und zieht keinen).
  const saat = st.saat;
  const folgen = dialog(welt, st, eingang.dialog);
  if (!st.leser) st.saat = saat;
  wendeFolgenAn(welt, st, folgen, null, () => true);
}
nachBetreten.push(eingangsdialog);

module.exports = { dialog, wendeFolgenAn };
