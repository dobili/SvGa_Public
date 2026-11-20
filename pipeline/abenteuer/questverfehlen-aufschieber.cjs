// Der Aufschieber: spielt das Schach-Abenteuer wie die Gesamtsimulation, lässt aber eine Quest so
// lange liegen, wie das Spiel es erlaubt, und versucht sie erst ganz am Ende (nach dem Abspann).
//
// Zweck (Auftrag „Quests verfehlen“, 20.11.2026): Kann ein Spieler eine Quest dauerhaft verpassen?
// Etwa, weil eine Figur nach einem Abschied fehlt, eine Zustandskarte sie ersetzt, eine Reise den
// Ort schließt oder ein einmaliger Dialog nie wiederkommt. Die statische Prüfung
// (questverfehlen.py) findet Bedingungen, die das möglich machen; hier zeigt ein Durchlauf nach den
// Regeln der App (gesamtsimulation-*.cjs), ob es wirklich geschieht.
// Vorgehen je Quest Q: Über den Haken `st.auslassen` fasst der Spieler keine Figur und keinen
// Auslöser an, die den Start von Q oder den laufenden Schritt auslösen (Knoten, Runde, Begegnung).
// Welche das sind, sagt die statische Prüfung (questverfehlen.py --objekte, Fluss der Ink-Dateien);
// ohne diese Datei nimmt er grob alle Objekte derselben Ink-Datei. Kommt das Spiel so nicht voran
// (RUHE_BIS_ALLES Schritte ohne Änderung), fasst er alles
// an, bis sich etwas ändert: Q geht nur weiter, wenn sonst nichts mehr geht. Nach dem Ende des
// Spiels gibt er Q frei, holt nach wie die Gesamtsimulation und geht dann gezielt in die Orte von Q.
// Fund: Q ist danach nicht fertig (nie begonnen oder hängt bei Schritt n).
// Grenze: Orte, die Q nur über `ort`-Ereignisse betreffen, betritt er normal; Eingangsdialoge laufen.
//
// Aufruf aus dem Hauptordner:
//   python -m pipeline.abenteuer.questverfehlen --objekte /tmp/objekte.json
//   node pipeline/abenteuer/questverfehlen-aufschieber.cjs --objekte /tmp/objekte.json
//     [--quests a.b,c.d] [--teil 1/4] [--startwert 1] [--sekunden 600]
// --quests: nur diese Quests; --teil n/m: jede m-te Quest ab der n-ten (für mehrere Prozesse).
// Ausgabe: je Quest „ok“ oder „VERFEHLT“ mit Schritt und Grund; Rückgabe 1 bei einem Fund.
"use strict";
const fs = require("fs");
const path = require("path");
const { ladeWelt, neuerStand } = require("./gesamtsimulation-regeln.cjs");
const { erkunde, nachholen, rueckkehr, SCHRITTE } = require("./gesamtsimulation.cjs");
const { hin, bleibe, nachbarorte } = require("./gesamtsimulation-rueckkehr.cjs");

const DIALOGE = path.join(__dirname, "../../inhalte/abenteuer/dialoge/de");
const MILLISEKUNDEN = 1000;
/**
 * Erst kurz bevor die Gesamtsimulation aufgibt (RUHE_ENDE, 1500 Schritte ohne Änderung), fasst der
 * Aufschieber auch Q an: Bis dahin hat er alles andere versucht, auch das nächste Gebiet (nach 400).
 */
const RUHE_BIS_ALLES = 1400;
/** So viele Schritte bleibt er am Ende in den Orten von Q. */
const ENDE_SCHRITTE = 6000;

/** Ink-Dateien (ohne Endung), in denen ein Aufruf mit diesem Text vorkommt (gemerkt). */
function dateienMit(welt, text) {
  welt.inkTexte ??= Object.fromEntries(
    fs
      .readdirSync(DIALOGE)
      .filter((d) => d.endsWith(".ink"))
      .map((d) => [d.slice(0, -4), fs.readFileSync(path.join(DIALOGE, d), "utf8")]),
  );
  return Object.keys(welt.inkTexte).filter((n) => welt.inkTexte[n].includes(text));
}

/** Die Ink-Dateien, deren Dialoge das nächste Stück von Q auslösen (Start oder laufender Schritt). */
function dateienJetzt(welt, st, q) {
  const s = st.staende.find((x) => x.k === q.kennung);
  if (s?.fertig) return [];
  const e = s ? q.schritte[s.i]?.ereignis : q.start;
  if (!e) return [];
  if (e.knoten) return [e.knoten.split(".")[0]];
  if (e.runde) return dateienMit(welt, `"${e.runde}"`);
  if (e.begegnung) return dateienMit(welt, `"${e.begegnung}"`);
  return [];
}

/** Ob ein Objekt der Karte (Figur, Auslöser, Gegner) einen Dialog aus diesen Dateien öffnet. */
function oeffnetDatei(welt, karte, o, dateien, q) {
  const ort = welt.karteZuOrt[karte];
  const figur = ort.figuren.find((f) => f.kennung === ort.kennung + "." + o.name);
  const ausloeser = (ort.ausloeser || []).find((a) => a.name === o.name);
  const dialog = figur?.dialog || ausloeser?.dialog || "";
  const s = q.schritte.find((x) => x.ereignis?.begegnung && figur?.gegner === x.ereignis.begegnung);
  return dateien.some((d) => dialog.startsWith(d + ".")) || Boolean(s);
}

/** Stelle von Q jetzt: 0 vor dem Start, sonst Nummer des laufenden Schritts; null, wenn fertig. */
function stelle(st, q) {
  const s = st.staende.find((x) => x.k === q.kennung);
  if (s?.fertig) return null;
  return s ? s.i + 1 : 0;
}

/** Ob das Objekt den Start oder den laufenden Schritt von Q auslöst (Objekte aus der Prüfung). */
function loestAus(welt, st, karte, o, q, objekte) {
  const n = stelle(st, q);
  if (n === null) return false;
  const liste = objekte?.[`${q.kennung}:${n}`];
  if (!liste) return oeffnetDatei(welt, karte, o, dateienJetzt(welt, st, q), q);
  return liste.some(([k, name]) => k === karte && name === o.name);
}

/** Ein Durchlauf, der Q aufschiebt; Ausgabe: der Endstand. */
function aufschieben(welt, q, startwert, sekunden, objekte = null) {
  welt.geschichten = {};
  const st = neuerStand(startwert);
  const frist = Date.now() + sekunden * MILLISEKUNDEN;
  st.auslassen = (w, s, karte, o) =>
    s.ruhe < RUHE_BIS_ALLES && loestAus(w, s, karte, o, q, objekte);
  erkunde(welt, st, frist);
  st.auslassen = null;
  // Fertig schon vor dem Freigeben: die Geschichte brauchte Q (kein Aufschub möglich).
  st.vorFreigabe = fertig(st, q);
  nachholen(welt, st, frist, SCHRITTE);
  rueckkehr(welt, st, frist, SCHRITTE);
  if (!fertig(st, q)) holeNach(welt, st, q, frist);
  return st;
}

/** Am Ende gezielt in die Orte von Q (Ort der Quest und Orte der Dialoge des nächsten Stücks). */
function holeNach(welt, st, q, frist) {
  const orte = new Set([q.ort]);
  for (const d of dateienJetzt(welt, st, q))
    for (const o of welt.orte)
      if ([...o.figuren, ...(o.ausloeser || [])].some((x) => (x.dialog || "").startsWith(d + ".")))
        orte.add(o.kennung);
  for (const ort of orte) {
    if (fertig(st, q) || Date.now() > frist) return;
    const o = welt.orte.find((x) => x.kennung === ort);
    if (!o) continue;
    st.zielOrte = new Set([ort, ...nachbarorte(welt, [ort])]);
    hin(welt, st, o.karten[0].kennung);
    bleibe(welt, st, SCHRITTE, o.karten[0].kennung, ENDE_SCHRITTE, () => fertig(st, q));
  }
  st.zielOrte = null;
}

const fertig = (st, q) => st.staende.some((x) => x.k === q.kennung && x.fertig);

/** Ergebniszeile für Q. */
function ergebnis(st, q) {
  if (fertig(st, q)) {
    const wie = st.vorFreigabe ? "von der Geschichte gebraucht" : "aufgeschoben und nachgeholt";
    return { fund: false, text: `ok        ${q.kennung} (${wie})` };
  }
  const s = st.staende.find((x) => x.k === q.kennung);
  const wo = s ? `hängt bei Schritt ${s.i + 1}` : "nie begonnen";
  const ende = st.abspann ? "" : " (Spiel nicht zu Ende gekommen)";
  return { fund: true, text: `VERFEHLT  ${q.kennung}: ${wo}${ende}` };
}

function argumente(liste) {
  const wert = (name, vorgabe) => {
    const i = liste.indexOf(name);
    return i >= 0 && liste[i + 1] !== undefined ? liste[i + 1] : vorgabe;
  };
  const [n, m] = wert("--teil", "1/1").split("/").map(Number);
  return {
    quests: wert("--quests", "").split(",").filter(Boolean),
    teil: { n, m },
    startwert: Number(wert("--startwert", "1")),
    sekunden: Number(wert("--sekunden", "600")),
    objekte: wert("--objekte", ""),
  };
}

function hauptprogramm(liste) {
  const arg = argumente(liste);
  const welt = ladeWelt();
  const alle = welt.quests.filter((q) => !arg.quests.length || arg.quests.includes(q.kennung));
  const auswahl = alle.filter((_, i) => i % arg.teil.m === arg.teil.n - 1);
  const objekte = arg.objekte ? JSON.parse(fs.readFileSync(arg.objekte, "utf8")) : null;
  let funde = 0;
  for (const q of auswahl) {
    const { fund, text } = ergebnis(aufschieben(welt, q, arg.startwert, arg.sekunden, objekte), q);
    if (fund) funde++;
    console.log(text);
  }
  console.log(`${funde} Funde`);
  process.exitCode = funde ? 1 : 0;
}

if (require.main === module) hauptprogramm(process.argv.slice(2));

module.exports = { aufschieben, ergebnis, dateienJetzt };
