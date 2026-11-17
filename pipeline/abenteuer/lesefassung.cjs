// Lesefassung des Schach-Abenteuers: das Protokoll eines vollständigen Spielverlaufs als Markdown,
// so, wie ein normaler Spieler die Geschichte erlebt.
//
// Zweck: Lektorat und Durchsicht der ganzen Geschichte am Stück, ohne das Spiel zu spielen.
// Warum auf der Gesamtsimulation (gesamtsimulation.cjs): Sie geht die Welt schon nach den Regeln der
// App ab (Orte, Quests, Zustandskarten, echtes inkjs). Hier spielt statt des zufälligen Spielers ein
// Leser mit festen Entscheidungen (lesefassung-spieler.cjs) und schreibt jeden Dialog mit; danach
// bleibt von jedem Gespräch nur der erste Durchlauf (siehe `grundZumWeglassen`).
//
// Aufruf aus dem Hauptordner:
//   node pipeline/abenteuer/lesefassung.cjs --ziel DATEI.md [--startwert 1] [--akte] [--sekunden 900]
// --ziel: Markdown-Datei mit der ganzen Lesefassung.
// --startwert: Startwert für wechselnde Sätze in Ink (Zufallsfolgen); gleicher Aufruf, gleiche Datei.
// --akte: dazu je Akt eine Teildatei akt1.md, akt2.md … neben die Zieldatei (der Teil nach dem
//   Abspann steht beim letzten Akt).
// --sekunden: Zeitbudget des Durchlaufs; reicht es nicht, endet das Werkzeug mit Fehler.
// Rückgabewert 1, wenn der Durchlauf in einer Sackgasse endet oder das Zeitbudget nicht reicht.
"use strict";
const fs = require("fs");
const path = require("path");
const { ladeWelt, neuerStand } = require("./gesamtsimulation-regeln.cjs");
const {
  erkunde,
  nachholen,
  rueckkehr,
  sackgasse,
  SCHRITTE,
} = require("./gesamtsimulation.cjs");
const { neuerLeser } = require("./lesefassung-spieler.cjs");
const { namen, aktAlsText, woerter } = require("./lesefassung-text.cjs");
const { kopf } = require("./lesefassung-kopf.cjs");

const MILLISEKUNDEN = 1000;
const GRUENDE = ["leer", "doppelt", "nichtsNeues"];

/** Befehlszeile: --ziel ist Pflicht, die übrigen Schalter haben Vorgaben. */
function argumente(liste) {
  const wert = (name, vorgabe) => {
    const i = liste.indexOf(name);
    return i >= 0 && liste[i + 1] !== undefined ? liste[i + 1] : vorgabe;
  };
  return {
    ziel: wert("--ziel", ""),
    startwert: Number(wert("--startwert", "1")),
    sekunden: Number(wert("--sekunden", "900")),
    akte: liste.includes("--akte"),
  };
}

/**
 * Der Durchlauf: derselbe Weg wie die Gesamtsimulation (Erkunden, Nachholen, Rückkehr), aber mit
 * dem Leser statt des Zufalls. Ausgabe: { welt, st, dialoge } mit der ganzen Mitschrift.
 * Sonderfall: Endet der Lauf in einer Sackgasse, steht das in `st.meldungen` bzw. `sackgasse`.
 */
function durchlauf(startwert, sekunden) {
  const welt = ladeWelt();
  const st = neuerStand(startwert);
  const leser = neuerLeser(welt, st);
  const frist = Date.now() + sekunden * MILLISEKUNDEN;
  erkunde(welt, st, frist);
  nachholen(welt, st, frist, SCHRITTE);
  rueckkehr(welt, st, frist, SCHRITTE);
  const rest = leser.schliesseAb();
  const letzter = leser.dialoge[leser.dialoge.length - 1];
  if (letzter) letzter.danach.push(...rest);
  return { welt, st, dialoge: leser.dialoge };
}

const inhalt = (d) =>
  d.knoten + "\n" + d.zeilen.map((z) => z.text || "> " + z.wahl).join("\n");
const folgeSchluessel = (f) =>
  [f.art, f.begegnung || f.runde || f.laden || ""].join(":");

/**
 * Warum ein Dialog nicht in die Lesefassung kommt, oder null, wenn er bleibt.
 * Warum: Die Simulation spricht jede Figur in jedem neuen Zustand bis zu 16-mal an; ein Spieler
 * liest jedes Gespräch einmal. Es bleibt, was eine Quest bewegt oder erstmals eine Partie, Runde
 * oder einen Laden auslöst. Sonst fällt weg: „leer“ (keine Zeile), „doppelt“ (wortgleich schon
 * gezeigt), „nichtsNeues“ (jede Zeile stand schon da).
 * Beispiel: Mama sagt im Wohnzimmer zum zweiten Mal „Bist du oben fertig?“ → „nichtsNeues“.
 */
function grundZumWeglassen(d, gezeigt) {
  const bewegtQuest = d.quests.length > 0 || d.danach.length > 0;
  const neueFolge = d.folgen.some(
    (f) => !gezeigt.folgen.has(folgeSchluessel(f)),
  );
  if (bewegtQuest || neueFolge) return null;
  if (!d.zeilen.length) return "leer";
  if (gezeigt.inhalte.has(inhalt(d))) return "doppelt";
  const neues = d.zeilen.some((z) => z.text && !gezeigt.zeilen.has(z.text));
  return neues ? null : "nichtsNeues";
}

/**
 * Die Zeilen, die von einem Dialog in der Lesefassung stehen. Ein Zweitgespräch (dieselbe Auswahl
 * wie früher, diesmal mit der nächsten Antwort) wird gekürzt: Vor der neuen Antwort bleiben nur
 * Zeilen, die noch nicht dastanden. Ausgabe: { zeilen, gekuerzt }.
 * Beispiel: Carla sagt beim zweiten Mal dasselbe; es bleibt „Juno sagt, du warst gut.“ und ihre
 * Antwort darauf.
 */
function zeilenFuer(d, gezeigt) {
  if (d.zweitAb === null) return { zeilen: d.zeilen, gekuerzt: false };
  const vorher = d.zeilen
    .slice(0, d.zweitAb)
    .filter((z) => z.text && !gezeigt.zeilen.has(z.text));
  const zeilen = [...vorher, ...d.zeilen.slice(d.zweitAb)];
  return { zeilen, gekuerzt: zeilen.length < d.zeilen.length };
}

/**
 * Der Questschritt, zu dem ein Dialog gehört: der Schritt, den er erledigt oder beginnt, sonst die
 * zuletzt bewegte offene Hauptquest mit ihrem Schritt vor dem Dialog.
 * Ausgabe: { quest, schritt } | null.
 */
function bezugVon(d, laufend) {
  const bewegt = d.quests.find((x) => x.art !== "fertig");
  if (bewegt) return { quest: bewegt.quest, schritt: bewegt.schritt };
  const stand = laufend && d.stand.get(laufend);
  return stand && !stand.fertig ? { quest: laufend, schritt: stand.i } : null;
}

/**
 * Die zuletzt bewegte offene Hauptquest nach einigen Queständerungen (für die Kopfzeilen).
 * Warum nur Hauptquests: Sie tragen die Geschichte; eine Nebenquest stünde sonst über fremden
 * Gesprächen. `haupt` ist die Menge der Kennungen der Hauptquests.
 */
function laufendNach(aenderungen, laufend, haupt) {
  for (const x of aenderungen) {
    if (!haupt.has(x.quest)) continue;
    if (x.art !== "fertig") laufend = x.quest;
    else if (laufend === x.quest) laufend = null;
  }
  return laufend;
}

/**
 * Der Erstdurchlauf: nimmt aus der Mitschrift die Wiederholungen heraus, nummeriert die übrigen
 * Dialoge und gibt jedem seinen Questschritt. Eingaben: Mitschrift des Lesers, Kennungen der
 * Hauptquests. Ausgabe: { dialoge, weggelassen (Zahl je Grund) }.
 * Sonderfall: Queständerungen vor einem weggelassenen Dialog wandern zum nächsten, der bleibt.
 */
function erstdurchlauf(mitschrift, haupt) {
  const gezeigt = { inhalte: new Set(), zeilen: new Set(), folgen: new Set() };
  const weggelassen = Object.fromEntries(GRUENDE.map((g) => [g, 0]));
  const dialoge = [];
  let davor = [];
  let laufend = null;
  for (const d of mitschrift) {
    const grund = grundZumWeglassen(d, gezeigt);
    laufend = laufendNach(d.davor, laufend, haupt);
    const bezug = bezugVon(d, laufend);
    laufend = laufendNach([...d.quests, ...d.danach], laufend, haupt);
    davor.push(...d.davor);
    if (grund) {
      weggelassen[grund]++;
      continue;
    }
    const kurz = zeilenFuer(d, gezeigt);
    gezeigt.inhalte.add(inhalt(d));
    for (const z of d.zeilen) if (z.text) gezeigt.zeilen.add(z.text);
    for (const f of d.folgen) gezeigt.folgen.add(folgeSchluessel(f));
    dialoge.push({ ...d, ...kurz, davor, bezug, nummer: dialoge.length + 1 });
    davor = [];
  }
  return { dialoge, weggelassen };
}

/**
 * Akt je Ort aus den Daten: die kleinste Aktnummer der Szenen, die die Quests eines Ortes setzen
 * (quests.json, Wirkung „szene“). Beispiel: riverton → 2. Orte ohne Szene (Wege) fehlen.
 */
function aktJeOrt(welt) {
  const akte = new Map();
  for (const q of welt.quests)
    for (const s of q.schritte)
      for (const w of s.wirkungen || []) {
        if (w.art !== "szene") continue;
        akte.set(q.ort, Math.min(w.akt, akte.get(q.ort) ?? w.akt));
      }
  return akte;
}

/**
 * Der Ort, zu dem eine Dialogdatei gehört: Ihr Name beginnt mit der Kennung des Ortes in
 * Kleinbuchstaben mit Bindestrichen. Beispiel: „riverton-aussen“ → riverton; „ansehen-…“ → null.
 */
function ortDerDatei(welt, datei) {
  const klein = (k) => k.replace(/[A-Z]/g, (b) => "-" + b.toLowerCase());
  const ort = welt.orte.find(
    (o) =>
      datei === klein(o.kennung) || datei.startsWith(klein(o.kennung) + "-"),
  );
  return ort ? ort.kennung : null;
}

/**
 * Gliedert die Dialoge in Akte: Ein Akt beginnt mit dem ersten Dialog, der auf einer Karte oder
 * aus einer Dialogdatei eines Ortes mit höherer Aktnummer spielt (die Ankunft in Riverton steht in
 * riverton-aussen.ink, spielt aber noch auf dem Weg). Wege und Rückfahrten bleiben im laufenden
 * Akt. Nach dem Abspann folgt ein eigener Teil (Epilog und was die Simulation am Ende nachholt).
 * Ausgabe: Liste aus { nummer, titel, dialoge, nachAbspann }.
 */
function gliedere(welt, dialoge) {
  const jeOrt = aktJeOrt(welt);
  let nummer = Math.min(...jeOrt.values());
  let nachAbspann = false;
  const akte = [];
  for (const d of dialoge) {
    const orte = [
      welt.karteZuOrt[d.karte].kennung,
      ortDerDatei(welt, d.knoten.split(".")[0]),
    ];
    nummer = Math.max(nummer, ...orte.map((o) => jeOrt.get(o) || 0));
    let akt = akte[akte.length - 1];
    if (!akt || akt.nummer !== nummer || akt.nachAbspann !== nachAbspann) {
      const titel = nachAbspann
        ? "Nach dem Abspann: Epilog und nachgeholte Nebenquests"
        : `Akt ${nummer}`;
      akt = { nummer, titel, dialoge: [], nachAbspann };
      akte.push(akt);
    }
    akt.dialoge.push(d);
    if (d.folgen.some((f) => f.art === "abspann")) nachAbspann = true;
  }
  return akte;
}

/** Umfang eines Aktes: Dialoge, Zeilen (mit gewählten Antworten) und Wörter. */
function umfang(akt) {
  return {
    titel: akt.titel,
    dialoge: akt.dialoge.length,
    zeilen: akt.dialoge.reduce((n, d) => n + d.zeilen.length, 0),
    woerter: akt.dialoge.reduce((n, d) => n + woerter(d), 0),
  };
}

/**
 * Knoten, die die Lesefassung nicht zeigt, je Datei, die Datei mit den meisten zuerst.
 * Ausgabe: { alle, fehlend, dateien: [{ datei, fehlend: [Knoten], von }] }.
 */
function abdeckung(welt, dialoge) {
  const gelesen = new Set(dialoge.flatMap((d) => d.besucht));
  const dateien = Object.entries(welt.knoten)
    .map(([datei, knoten]) => ({
      datei,
      von: knoten.length,
      fehlend: knoten.filter((k) => !gelesen.has(datei + "." + k)),
    }))
    .filter((x) => x.fehlend.length)
    .sort(
      (a, b) =>
        b.fehlend.length - a.fehlend.length || a.datei.localeCompare(b.datei),
    );
  const alle = Object.values(welt.knoten).reduce((n, k) => n + k.length, 0);
  const fehlend = dateien.reduce((n, x) => n + x.fehlend.length, 0);
  return { alle, fehlend, dateien };
}

/**
 * Woran der Durchlauf hängt, wenn er in einer Sackgasse endet (sonst leer): fehlender Abspann,
 * offene Hauptquests und begonnene, nicht beendete Quests mit ihrem Schritt.
 */
function haengendes(welt, st) {
  if (!sackgasse(welt, st)) return [];
  const offen = welt.quests
    .map((q) => ({ q, s: st.staende.find((x) => x.k === q.kennung) }))
    .filter(({ q, s }) => (s ? !s.fertig : q.haupt))
    .map(
      ({ q, s }) =>
        `${q.kennung} (${s ? "Schritt " + (s.i + 1) : "nie begonnen"})`,
    );
  return [
    `Der Durchlauf endet in einer Sackgasse${st.abspann ? "" : " ohne Abspann"}: ` +
      (offen.join(", ") || "fehlende Daten"),
  ];
}

/**
 * Baut die Lesefassung. Eingabe: { startwert, sekunden }. Ausgabe: { text (ganze Datei), akte
 * ([{ datei, text }] für --akte), zahlen (Umfang, Abdeckung, Weggelassenes), fehler (Liste) }.
 */
function lesefassung({ startwert, sekunden }) {
  const { welt, st, dialoge: mitschrift } = durchlauf(startwert, sekunden);
  const haupt = new Set(
    welt.quests.filter((q) => q.haupt).map((q) => q.kennung),
  );
  const { dialoge, weggelassen } = erstdurchlauf(mitschrift, haupt);
  const n = namen(welt, st.vars.held);
  const akte = gliedere(welt, dialoge);
  const zahlen = {
    startwert,
    held: st.vars.held,
    mitgeschrieben: mitschrift.length,
    weggelassen,
    umfang: akte.map(umfang),
    abdeckung: abdeckung(welt, dialoge),
  };
  const fehler = [...st.meldungen, ...haengendes(welt, st)];
  const texte = akte.map((a) => aktAlsText(n, a));
  const text = [kopf(zahlen, fehler), ...texte].join("\n\n") + "\n";
  return { text, akte: teildateien(akte, texte), zahlen, fehler };
}

/** Je Aktnummer eine Teildatei; der Teil nach dem Abspann hängt am letzten Akt. */
function teildateien(akte, texte) {
  const dateien = new Map();
  akte.forEach((akt, i) => {
    const datei = `akt${akt.nummer}.md`;
    const kopfzeile = `# Schach-Abenteuer: Lesefassung, Akt ${akt.nummer}`;
    const hinweis =
      "Teil der Lesefassung; Regeln für Wahlen und Ausgänge im Kopf der Gesamtdatei.";
    if (!dateien.has(datei)) dateien.set(datei, [kopfzeile, hinweis]);
    dateien.get(datei).push(texte[i]);
  });
  return [...dateien].map(([datei, teile]) => ({
    datei,
    text: teile.join("\n\n") + "\n",
  }));
}

function hauptprogramm(liste) {
  const arg = argumente(liste);
  if (!arg.ziel) {
    console.error(
      "Aufruf: node pipeline/abenteuer/lesefassung.cjs --ziel DATEI.md",
    );
    process.exitCode = 1;
    return;
  }
  const ergebnis = lesefassung(arg);
  const ordner = path.dirname(path.resolve(arg.ziel));
  fs.mkdirSync(ordner, { recursive: true });
  fs.writeFileSync(arg.ziel, ergebnis.text);
  if (arg.akte)
    for (const a of ergebnis.akte)
      fs.writeFileSync(path.join(ordner, a.datei), a.text);
  for (const u of ergebnis.zahlen.umfang)
    console.log(`${u.titel}: ${u.dialoge} Dialoge, ${u.woerter} Wörter`);
  for (const f of ergebnis.fehler) console.error(`Fehler: ${f}`);
  process.exitCode = ergebnis.fehler.length ? 1 : 0;
}

if (require.main === module) hauptprogramm(process.argv.slice(2));

module.exports = { lesefassung, erstdurchlauf, grundZumWeglassen, gliedere };
