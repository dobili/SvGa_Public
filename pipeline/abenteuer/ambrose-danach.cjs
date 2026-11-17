// Ambrose nach dem Abschied: spielt das Schach-Abenteuer bis nach dem Abschied auf der Treppe der
// Capital Arena, geht danach die ganze Welt noch einmal ab und meldet jede Stelle, an der Ambrose
// noch spricht oder am Brett sitzt.
//
// Zweck: Entscheidung des Autors (Story-Bibel Abschnitt 33, Frage 5; ENTSCHEIDUNGEN.md, Q21-5):
// Nach dem Abschied spricht Ambrose nicht mehr. Seine Zeilen stehen deshalb in den Ink-Dateien in
// `{not abschiedGesehen: …}`; dieses Werkzeug findet, was vergessen wurde.
// Warum auf der Gesamtsimulation (gesamtsimulation.cjs): Ob eine Zeile nach dem Abschied noch
// erreichbar ist, hängt am Spielstand (Quests, Variablen, Zustandskarten); das zeigt nur ein Lauf
// nach den Regeln der App. Mitgelesen wird über den Haken `st.leser` (ambrose-danach-beobachter.cjs).
//
// Aufruf aus dem Hauptordner:
//   node pipeline/abenteuer/ambrose-danach.cjs [--startwert 1] [--spieler gruendlich,eilig]
//     [--sekunden 600] [--abdeckung] [--hinweise]
// --startwert: Startwert des Zufalls für die Wahlen bis zum Abschied (wiederholbar).
// --spieler: „gruendlich“ fasst bis zum Abschied alles an (wie die Gesamtsimulation); „eilig“
//   lässt Abstecher, Nebenorte und Wegränder liegen (ambrose-danach-eilig.cjs), damit nachholbare
//   Szenen erst nach dem Abschied laufen. Vorgabe: beide nacheinander. „launisch“ (nur auf
//   Wunsch) lässt je nach Startwert ein Drittel aller Figuren und Dinge aus: für die Suche mit
//   vielen Startwerten, findet Nebenquests, die mitten im Lauf stehen geblieben sind.
// --sekunden: Zeitbudget je Spieler.
// --abdeckung: dazu die Knoten mit Ambrose-Zeilen, die nach dem Abschied nicht gelesen wurden.
// --hinweise: dazu die Zeilen anderer Sprecher, die Ambrose nach dem Abschied nennen (zum Nachlesen:
//   „Ambrose sieht lange hin“ passt nicht mehr, „Ambroses Schrift“ schon).
//
// Was nach dem Abschied geschieht: Reihum in jeden besuchten Ort (wie mit der Monatskarte), von
// dort zu Fuß in angrenzende, noch nie besuchte Orte; auf jeder Karte jede Figur, jedes Ding und
// jeden Auslöser mehrmals anfassen, bei jeder Auswahl der Reihe nach jede Antwort, jede Partie mit
// jedem Ausgang samt Nachgespräch und Partiemomenten; so viele Durchgänge, bis nichts Neues kommt.
// Ausgabe: je Fund eine Zeile (Art, Datei.Knoten oder Begegnung, Text), letzter Satz „N Funde“.
// Rückgabewert 1 bei Funden oder wenn ein Spieler den Abschied nicht erreicht, sonst 0.
// Grenzen: Statisten und alles, was die Hülle ohne Ink sagt (Tischgespräch, Karten), prüft die App
// selbst (regeln/abwesenheit.ts); Partien werden nicht gespielt, nur ihre Ausgänge durchgezählt.
"use strict";
const fs = require("fs");
const path = require("path");
const {
  ladeWelt,
  neuerStand,
  betrete,
  FOLGE,
  VERSUCHE_JE_ZUSTAND,
} = require("./gesamtsimulation-regeln.cjs");
const { erkunde, SCHRITTE } = require("./gesamtsimulation.cjs");
const { dialog, wendeFolgenAn } = require("./gesamtsimulation-dialoge.cjs");
const { nachbarorte } = require("./gesamtsimulation-rueckkehr.cjs");
const { neuerBeobachter, AMBROSE } = require("./ambrose-danach-beobachter.cjs");
const { eiligerSpieler } = require("./ambrose-danach-eilig.cjs");
const { launischerSpieler } = require("./ambrose-danach-launisch.cjs");

const MILLISEKUNDEN = 1000;
/** Variable, die capital-arena-aussen.abschied setzt. */
const ABSCHIED = "abschiedGesehen";
const SPIELER = ["gruendlich", "eilig"];
/** Höchstens so viele Durchgänge durch alle Orte; meist ist nach drei nichts mehr neu. */
const DURCHGAENGE = 8;
/** Schritte je Ort und Durchgang, und nach wie vielen Schritten ohne Neues der Ort als fertig gilt. */
const SCHRITTE_JE_ORT = 600;
const RUHE_JE_ORT = 50;
/** So oft hintereinander darf eine Figur oder ein Ding nichts Neues sagen, bevor es liegen bleibt. */
const GEDULD = 5;
/** Zähler in Variablen gelten ab diesem Wert als gleich (wie in `zustand`). */
const ZAEHLER_KAPPE = 5;
/** Gegenstand, mit dem die Hülle die Übungspartie gegen Ambrose anbietet (oberwelt/Oberwelt.tsx). */
const REISEBRETT = "reisebrett";

/**
 * Fingerabdruck dessen, was neue Zeilen freischalten kann: Variablen (ohne Zähler der Siege und
 * ohne die Ausgänge der Partien, die nach dem Abschied reihum wechseln), Quests und Besitz.
 * Zahlen sind gekappt wie in `zustand` (gesamtsimulation-regeln.cjs): Besuchszähler wie
 * wandererBesuche wachsen sonst bei jedem Gespräch, und der Lauf käme nie zur Ruhe.
 */
function fortschritt(st) {
  const vars = Object.entries(st.vars)
    .filter(([n]) => !n.startsWith("siege") && !n.startsWith("ausgang"))
    .map(([n, w]) => [
      n,
      typeof w === "number" ? Math.min(w, ZAEHLER_KAPPE) : w,
    ]);
  return JSON.stringify([vars, st.staende, [...st.besitz], [...st.besucht]]);
}

/**
 * Die Geduld des Spielers nach dem Abschied (Haken `st.auslassen`): Bringt eine Figur oder ein Ding
 * GEDULD-mal hintereinander keine neue Zeile, bleibt es liegen, bis der Spielstand einen noch nie
 * gesehenen Fortschritt zeigt.
 * Warum: Ohne Geduld spricht die Simulation jede Figur nach jeder Partie wieder bis zu 16-mal an
 * (290 000 Dialoge, zehn Minuten); neue Zeilen kommen dabei nicht mehr.
 * Beispiel: Hector im Diner sagt nach vier Besuchen nichts Neues → erst wieder, wenn eine Quest
 * weitergeht.
 */
function geduldig(st, beobachter) {
  const fruchtlos = new Map();
  const gesehen = new Set();
  let letztes = null;
  let zeilen = 0;
  let dialoge = -1;
  st.auslassen = (welt, s, karte, o) => {
    if (letztes !== null) {
      const neu = beobachter.neues() > zeilen;
      fruchtlos.set(letztes, neu ? 0 : (fruchtlos.get(letztes) || 0) + 1);
    }
    // Der Spielstand ändert sich nur durch Dialoge; ohne neuen Dialog bleibt der Fingerabdruck.
    if (beobachter.dialoge !== dialoge) {
      const stand = fortschritt(s);
      if (!gesehen.has(stand)) fruchtlos.clear();
      gesehen.add(stand);
      dialoge = beobachter.dialoge;
    }
    const schluessel = karte + "." + o.name;
    const lassen = (fruchtlos.get(schluessel) || 0) >= GEDULD;
    letztes = lassen ? null : schluessel;
    zeilen = beobachter.neues();
    return lassen;
  };
}

/** Befehlszeile; alle Schalter haben Vorgaben. */
function argumente(liste) {
  const wert = (name, vorgabe) => {
    const i = liste.indexOf(name);
    return i >= 0 && liste[i + 1] !== undefined ? liste[i + 1] : vorgabe;
  };
  return {
    startwert: Number(wert("--startwert", "1")),
    sekunden: Number(wert("--sekunden", "600")),
    spieler: wert("--spieler", SPIELER.join(",")).split(","),
    abdeckung: liste.includes("--abdeckung"),
    hinweise: liste.includes("--hinweise"),
  };
}

/**
 * Die Dialoge der Übergänge, die aus dem Ort hinausführen (Kanalweg, Fähre, Bus): je Übergang
 * GEDULD-mal gespielt, mit ihren Folgen wie beim Gehen. Warum: Der Spieler bleibt beim Abgehen im
 * Ort; was Ambrose am Ortsausgang sagte („Ironwood. Gehen wir.“), bliebe sonst ungehört.
 * Sonderfall: Führt der Übergang hinaus, holt `geheOrtAb` den Spieler im nächsten Schritt zurück.
 */
function hoereUebergaenge(welt, st, hinaus, gehoert) {
  const hier = st.karte;
  for (const w of hinaus) {
    const schluessel = hier + "." + w.name;
    const n = gehoert.get(schluessel) || 0;
    if (n >= GEDULD || st.karte !== hier) continue;
    gehoert.set(schluessel, n + 1);
    wendeFolgenAn(welt, st, dialog(welt, st, w.dialog), w, () => false);
  }
}

/**
 * Ein Ort nach dem Abschied: hinein auf seine erste Karte, dann alles anfassen und alle Karten
 * ablaufen, bis RUHE_JE_ORT Schritte lang weder der Spielstand noch die gelesenen Zeilen wachsen.
 * Angrenzende, nie besuchte Orte gehören dazu (zu Fuß, wenn ihr Übergang offen ist).
 * Beispiel: Port Delacroix mit dem Bayou, wenn die Gummistiefel erst jetzt gekauft werden.
 */
function geheOrtAb(welt, st, beobachter, ort, frist) {
  const neu = nachbarorte(welt, [ort.kennung]).filter(
    (k) => !st.besucht.has(k),
  );
  st.zielOrte = new Set([ort.kennung, ...neu]);
  const start = ort.karten[0].kennung;
  betrete(welt, st, start);
  for (const k of Object.keys(st.versuche)) st.versuche[k] = 0;
  const gehoert = new Map();
  let ruhe = 0;
  let vorher = "";
  for (let n = 0; n < SCHRITTE_JE_ORT && ruhe < RUHE_JE_ORT; n++) {
    if (Date.now() > frist) return;
    if (!SCHRITTE.imZiel(welt, st, st.karte)) betrete(welt, st, start);
    const hier = st.karte;
    const alle = SCHRITTE.besucheKarte(welt, st);
    const wege = alle.filter((w) => SCHRITTE.imZiel(welt, st, w.ziel?.karte));
    const hinaus = alle.filter((w) => !wege.includes(w) && w.dialog);
    if (st.karte === hier) hoereUebergaenge(welt, st, hinaus, gehoert);
    if (st.karte !== hier) continue;
    SCHRITTE.waehleWeg(welt, st, wege, st.uhr);
    beobachter.spieleMomente();
    const jetzt = fortschritt(st) + beobachter.neues();
    ruhe = jetzt === vorher ? ruhe + 1 : 0;
    vorher = jetzt;
  }
}

/**
 * Alles nach dem Abschied: Durchgänge durch alle besuchten Orte in der Reihenfolge der Geschichte,
 * bis ein Durchgang nichts Neues bringt. Ausgabe: Zahl der Durchgänge.
 * Sonderfall: Erinnerungen haben keinen eigenen Durchgang; sie zählen zu dem Ort, aus dem man
 * sie betritt.
 */
function geheWeltAb(welt, st, beobachter, frist) {
  Object.assign(st, { phase: FOLGE.length - 1, ruhe: 0, zuFuss: false });
  const rang = (o) => FOLGE.indexOf(o.kennung) + 1 || FOLGE.length + 1;
  const orte = [...welt.orte].sort((a, b) => rang(a) - rang(b));
  for (let durchgang = 1; durchgang <= DURCHGAENGE; durchgang++) {
    const vorher = fortschritt(st) + beobachter.neues();
    for (const ort of orte) {
      if (ort.art === "erinnerung" || !st.besucht.has(ort.kennung)) continue;
      geheOrtAb(welt, st, beobachter, ort, frist);
    }
    if (fortschritt(st) + beobachter.neues() === vorher) return durchgang;
    if (Date.now() > frist) {
      st.meldungen.add(
        "Zeitbudget erreicht (nach dem Abschied nicht alles abgegangen)",
      );
      return durchgang;
    }
  }
  return DURCHGAENGE;
}

/** Stellt den Spieler bis zum Abschied ein; Ausgabe: Funktion, die ihn danach zurückstellt. */
function spielerFuer(spieler, welt, st, startwert) {
  if (spieler === "eilig") return eiligerSpieler(welt, st);
  if (spieler === "launisch") return launischerSpieler(welt, st, startwert);
  return () => {};
}

/**
 * Ein Lauf mit einem Spieler: bis zum Abschied, dann die Welt abgehen.
 * Eingaben: Name des Spielers („gruendlich“, „eilig“ oder „launisch“), Startwert, Zeitbudget in Sekunden.
 * Ausgabe: { spieler, erreicht (Abschied gesehen), beobachter, st, welt, durchgaenge, offen
 * (Quests, die beim Abschied nicht fertig waren), unbesucht (Orte, die beim Abschied fehlten) }.
 * Sonderfall: Erreicht der Spieler den Abschied nicht, bleibt `beobachter` null.
 */
function lauf(spieler, startwert, sekunden) {
  const welt = ladeWelt();
  const st = neuerStand(startwert);
  const frist = Date.now() + sekunden * MILLISEKUNDEN;
  const oeffne = spielerFuer(spieler, welt, st, startwert);
  erkunde(welt, st, frist, 0, (s) => s.vars[ABSCHIED] === true);
  oeffne();
  st.meldungen.delete(
    "Zeitbudget erreicht (der Lauf ist nicht zu Ende gekommen)",
  );
  const ergebnis = { spieler, welt, st, erreicht: st.vars[ABSCHIED] === true };
  if (!ergebnis.erreicht) return { ...ergebnis, beobachter: null };
  const fertig = new Set(st.staende.filter((s) => s.fertig).map((s) => s.k));
  const offen = welt.quests.map((q) => q.kennung).filter((k) => !fertig.has(k));
  const unbesucht = welt.orte
    .filter((o) => o.art !== "erinnerung" && !st.besucht.has(o.kennung))
    .map((o) => o.kennung);
  const beobachter = neuerBeobachter(welt, st);
  geduldig(st, beobachter);
  const durchgaenge = geheWeltAb(welt, st, beobachter, frist);
  return { ...ergebnis, beobachter, durchgaenge, offen, unbesucht };
}

/** Knoten mit Ambrose-Zeilen im Quelltext, die der Lauf nach dem Abschied nicht gelesen hat. */
function ungeleseneAmbroseKnoten(gelesen) {
  const ordner = path.join(
    __dirname,
    "..",
    "..",
    "inhalte",
    "abenteuer",
    "dialoge",
    "de",
  );
  const liste = [];
  for (const datei of fs
    .readdirSync(ordner)
    .filter((d) => d.endsWith(".ink"))) {
    let knoten = "";
    const mit = new Set();
    for (const zeile of fs
      .readFileSync(path.join(ordner, datei), "utf8")
      .split("\n")) {
      const kopf = zeile.match(/^=== (\w+) ===/);
      if (kopf) knoten = kopf[1];
      if (zeile.includes("#sprecher:" + AMBROSE)) mit.add(knoten);
    }
    const name = datei.replace(".ink", "");
    const fehlend = [...mit].filter((k) => !gelesen.has(name + "." + k));
    if (fehlend.length) liste.push(`  ${name}: ${fehlend.join(", ")}`);
  }
  return liste;
}

/** Die Zeilen des Berichts zu einem Lauf (ohne die Funde). */
function berichtLauf(l) {
  const kopf = `Spieler „${l.spieler}“`;
  if (!l.erreicht)
    return [
      `${kopf}: Der Abschied wurde nicht erreicht (Zeitbudget oder Sackgasse).`,
    ];
  const b = l.beobachter;
  const zeilen = [
    `${kopf}: beim Abschied ${l.offen.length} Quests offen, ${l.unbesucht.length} Orte nie besucht` +
      (l.unbesucht.length ? ` (${l.unbesucht.join(", ")})` : ""),
    `  danach ${l.durchgaenge} Durchgänge, ${b.dialoge} Dialoge, ${b.gelesen.size} Knoten, ` +
      `${b.zeilen.size} verschiedene Zeilen`,
  ];
  const nie = l.welt.orte
    .filter((o) => o.art !== "erinnerung" && !l.st.besucht.has(o.kennung))
    .map((o) => o.kennung);
  if (nie.length) zeilen.push(`  auch danach nie betreten: ${nie.join(", ")}`);
  if (l.st.besitz.has(REISEBRETT))
    zeilen.push(
      "  Hinweis (Hülle, kein Fund): Das Reisebrett bietet die Übungspartie reisebrett.ambrose an.",
    );
  for (const m of l.st.meldungen) zeilen.push(`  Meldung: ${m}`);
  return zeilen;
}

/**
 * Der ganze Bericht: je Lauf Kopfzeilen, dann alle Funde (über die Läufe vereint, sortiert), am
 * Ende „N Funde“. Ausgabe: { zeilen, funde (Zahl), fehlgeschlagen (ein Abschied fehlt) }.
 */
function bericht(laeufe, arg) {
  const zeilen = [`Ambrose nach dem Abschied (Startwert ${arg.startwert})`];
  const funde = new Map();
  const gelesen = new Set();
  for (const l of laeufe) {
    zeilen.push(...berichtLauf(l));
    for (const [k, f] of l.beobachter?.funde || []) funde.set(k, f);
    for (const k of l.beobachter?.gelesen || []) gelesen.add(k);
  }
  const sortiert = [...funde.values()].sort(
    (a, b) => a.wo.localeCompare(b.wo) || a.art.localeCompare(b.art),
  );
  for (const f of sortiert) zeilen.push(`${f.art} ${f.wo}: ${f.text}`);
  if (arg.hinweise) {
    const hinweise = new Set(
      laeufe.flatMap((l) => [...(l.beobachter?.hinweise || [])]),
    );
    zeilen.push(
      "Hinweise (Zeilen anderer Sprecher, die Ambrose nennen; keine Funde):",
    );
    zeilen.push(...[...hinweise].sort().map((h) => "  " + h));
  }
  if (arg.abdeckung) {
    zeilen.push("Knoten mit Ambrose-Zeilen, nach dem Abschied nicht gelesen:");
    zeilen.push(...ungeleseneAmbroseKnoten(gelesen));
  }
  zeilen.push(`${sortiert.length} Funde`);
  const fehlgeschlagen = laeufe.some((l) => !l.erreicht);
  return { zeilen, funde: sortiert.length, fehlgeschlagen };
}

function hauptprogramm(liste) {
  const arg = argumente(liste);
  const laeufe = arg.spieler.map((s) => lauf(s, arg.startwert, arg.sekunden));
  const ergebnis = bericht(laeufe, arg);
  console.log(ergebnis.zeilen.join("\n"));
  process.exitCode = ergebnis.funde || ergebnis.fehlgeschlagen ? 1 : 0;
}

if (require.main === module) hauptprogramm(process.argv.slice(2));

module.exports = { lauf, bericht };
