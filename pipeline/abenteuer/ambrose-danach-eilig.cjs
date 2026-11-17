// Ambrose nach dem Abschied, der eilige Spieler: läuft bis zum Abschied nur der Hauptgeschichte
// nach und lässt Abstecher, Nebenorte und alles am Wegrand liegen.
//
// Zweck: Nachholbare Szenen (Ankunft im Pinewood Camp, Lagerfeuer, Gretas erstes Treffen, die
// Hochebene, die Nebenorte) laufen im gründlichen Durchlauf vor dem Finale; ob Ambrose in ihnen
// nach dem Abschied noch spricht, zeigt nur ein Spielstand, der sie offen gelassen hat.
// Warum so: Die Gesamtsimulation (gesamtsimulation.cjs) fasst alles an. Hier bekommt sie über den
// Haken `st.auslassen` einen Spieler, der in Orten ohne offene Hauptquest nichts anfasst und sonst
// nur Figuren anspricht, und die
// Übergänge in Abstecher und Nebenorte bleiben bis zum Abschied zu.
// Grenze: In Orten mit offener Hauptquest spricht auch er jede Figur an (welche Gespräche die
// Hauptquest braucht, weiß die Simulation nicht); Dinge zum Ansehen, Funde und Tafeln lässt er dort
// liegen. Kommt er nicht voran, fasst er alles an, bis sich etwas ändert.
"use strict";
const { FOLGE } = require("./gesamtsimulation-regeln.cjs");

/**
 * Orte, die die Hauptgeschichte nicht braucht (13_Wegenetz: Pinewood Camp und Hochebene sind
 * Abstecher, die Nebenorte N1 bis N7 liegen an Seitenwegen). Der Jahrmarkt bleibt offen: Darlenes
 * Lieferung dorthin öffnet die Alte Minenstraße nach Ghost Town.
 */
const SPAETER = [
  "hochebene",
  "wegCrossroadsPinewood",
  "pinewoodCamp",
  "wegPinewoodGhost",
  "kuerbishof",
  "lockport",
  "steinbruch",
  "sternwarte",
  "pelikaninsel",
  "goldmine",
  "bayou",
];
/** Bedingung, mit der ein Übergang bis zum Abschied zu bleibt. */
const ERST_DANACH = "abschiedGesehen";
/** Nach so vielen Schritten ohne Fortschritt fasst auch der eilige Spieler alles an. */
const RUHE_BIS_ALLES = 120;

/** Ob im Ort noch eine Hauptquest offen ist, die schon beginnen darf (Epilog erst nach dem Finale). */
function hauptquestOffen(welt, st, ort) {
  const fertig = (k) => st.staende.some((s) => s.k === k && s.fertig);
  return welt.quests.some(
    (q) =>
      q.haupt &&
      q.ort === ort &&
      !fertig(q.kennung) &&
      (q.voraussetzung || []).every(fertig),
  );
}

/** Der Spieler ist im Gebiet der laufenden Phase angekommen (wie nachSchritt in gesamtsimulation.cjs). */
function angekommen(st) {
  return (
    FOLGE.indexOf(st.letzterOrt) >= st.phase || st.besucht.has(FOLGE[st.phase])
  );
}

/** Ob ein Übergang aus einem früheren Ort der Hauptgeschichte in diesen Ort führt (zu Fuß erreichbar). */
function zuFussErreichbar(welt, ort) {
  const frueher = FOLGE.slice(0, FOLGE.indexOf(ort)).filter(
    (k) => !SPAETER.includes(k),
  );
  return welt.orte.some(
    (o) =>
      frueher.includes(o.kennung) &&
      (o.ausloeser || []).some(
        (a) => a.ziel && welt.karteZuOrt[a.ziel.karte]?.kennung === ort,
      ),
  );
}

/**
 * Die nächste Phase ohne die Orte aus SPAETER, oder null, wenn der eilige Spieler nicht von sich
 * aus weitergehen soll: am Ende der Folge, oder wenn der nächste Ort nur über einen Abstecher zu
 * Fuß erreichbar ist. Beispiel: Nach Crossroads käme Ghost Town, dorthin führt ohne das Pinewood
 * Camp nur die Alte Minenstraße (eine Reise im Dialog, mit Darlenes Schlüssel); dann bleibt er in
 * Crossroads, bis die Gesamtsimulation von selbst weitergeht (alles angefasst, nichts ändert sich).
 */
function naechstePhase(welt, phase) {
  let p = phase + 1;
  while (p < FOLGE.length && SPAETER.includes(FOLGE[p])) p++;
  if (p >= FOLGE.length) return null;
  return SPAETER.includes(FOLGE[phase]) || zuFussErreichbar(welt, FOLGE[p])
    ? p
    : null;
}

/** Ob das Objekt der Karte eine Figur des Ortes ist (orte.json, `figuren`). */
function istFigur(welt, karte, o) {
  const ort = welt.karteZuOrt[karte];
  return ort.figuren.some((f) => f.kennung === ort.kennung + "." + o.name);
}

/** Der letzte Ort der Hauptgeschichte vor dieser Phase. Beispiel: vor Ghost Town → Crossroads. */
function ortDavor(phase) {
  let p = phase - 1;
  while (p > 0 && SPAETER.includes(FOLGE[p])) p--;
  return FOLGE[p];
}

/**
 * Macht aus dem Stand einen eiligen Spieler und schließt in der Welt die Übergänge in die Orte aus
 * SPAETER. Eingaben: Welt und frischer Stand. Ausgabe: `oeffne()`, das nach dem Abschied alles
 * zurückstellt (Übergänge wie in orte.json, Spieler wieder gründlich).
 * Beispiel: In Crossroads bleibt der Wanderweg zum Pinewood Camp zu; {held} nimmt mit Darlenes
 * Schlüssel die Alte Minenstraße nach Ghost Town.
 * Sonderfall: Kommt er 120 Schritte nicht voran, fasst er alles an, bis sich etwas ändert.
 */
function eiligerSpieler(welt, st) {
  const geschlossen = [];
  for (const ort of welt.orte) {
    if (SPAETER.includes(ort.kennung)) continue;
    for (const a of ort.ausloeser || []) {
      const ziel = a.ziel && welt.karteZuOrt[a.ziel.karte];
      if (a.art !== "uebergang" || !ziel || !SPAETER.includes(ziel.kennung))
        continue;
      geschlossen.push({ a, wenn: a.wenn });
      a.wenn = ERST_DANACH;
    }
  }
  let phaseZuletzt = 0;
  st.auslassen = (w, s, karte, o) => {
    const naechste = naechstePhase(w, s.phase);
    const fertig = angekommen(s) && !hauptquestOffen(w, s, FOLGE[s.phase]);
    if (naechste !== null && (fertig || SPAETER.includes(FOLGE[s.phase])))
      s.phase = naechste;
    // Neue Phase, neue Versuche: Was im Gebiet davor an der Phase hing (die Reise am Viehgatter
    // gilt erst, wenn Ghost Town an der Reihe ist), wird gleich noch einmal angefasst.
    if (s.phase !== phaseZuletzt)
      for (const k of Object.keys(s.versuche)) s.versuche[k] = 0;
    phaseZuletzt = s.phase;
    const ort = w.karteZuOrt[karte].kennung;
    // Vor einem Ort, in den nur eine Reise im Dialog führt (Viehgatter in Crossroads), fasst er
    // im Ort davor weiter alles an, bis er angekommen ist.
    const davor = !angekommen(s) && ort === ortDavor(s.phase);
    if (davor || s.ruhe >= RUHE_BIS_ALLES) return false;
    // Mit offener Hauptquest spricht er die Figuren an; Dinge zum Ansehen, Funde und Tafeln
    // bleiben liegen.
    return !(hauptquestOffen(w, s, ort) && istFigur(w, karte, o));
  };
  return () => {
    for (const { a, wenn } of geschlossen) {
      if (wenn === undefined) delete a.wenn;
      else a.wenn = wenn;
    }
    delete st.auslassen;
  };
}

module.exports = { eiligerSpieler, SPAETER, RUHE_BIS_ALLES };
