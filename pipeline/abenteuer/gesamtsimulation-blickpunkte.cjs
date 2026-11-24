// Gesamtsimulation, Blickpunkte (Wunsch des Autors, 24.11.2026): Stellen aus
// inhalte/abenteuer/ambrose_blickpunkte.json, an denen Ambrose etwas sagt, wenn der Spieler zum
// ersten Mal vorbeikommt (Knoten in ambrose-blick.ink). Die Simulation spielt sie wie die App
// (app/src/abenteuer/regeln/blickpunkte.ts, oberwelt/useBlickpunkte.ts): jeden höchstens einmal
// (Variable `<knoten>_gesehen`, die Hülle setzt sie beim Öffnen), nur wenn Ambrose da und wach ist
// (regeln/abwesenheit.ts: nach der ersten Lektion, nicht zwischen Tiefpunkt und Versöhnung, nicht
// nach dem Abschied), nur wenn `wann` gilt, nicht in Erinnerungen und nicht, solange der
// Eingangsdialog der Karte gilt.
//
// Warum ein eigener Haken: So zählen die Besuche der Knoten („nie erreichte Knoten“ im Bericht),
// die Variablen stehen im Stand (aktstand.cjs, Durchlauf), die Lesefassung liest die Zeilen mit,
// und ambrose-danach.cjs prüft, dass nach dem Abschied keiner mehr läuft.
// Vereinfachung: Die Simulation kennt keine Felder. Der gründliche Spieler kommt an jeder Stelle
// vorbei; deshalb laufen beim Betreten einer Karte alle fälligen Blickpunkte der Karte, ohne die
// Pause von 30 Sekunden der App. Wird `wann` erst später wahr, läuft die Stelle beim nächsten
// Betreten.
// Zufallsneutral wie der Eingangsdialog: Die Gedankenwahl verbraucht keinen Zufall des Laufs, damit
// jeder Startwert denselben Weg nimmt wie vor den Blickpunkten.
"use strict";
const fs = require("fs");
const path = require("path");
const { gilt, nachBetreten } = require("./gesamtsimulation-regeln.cjs");
const { dialog, wendeFolgenAn } = require("./gesamtsimulation-dialoge.cjs");

/** Dialogdatei der Blickpunkte (ohne Endung), wie BLICK_DATEI in der App. */
const DATEI = "ambrose-blick";
const DATEN = path.resolve(
  __dirname,
  "..",
  "..",
  "inhalte",
  "abenteuer",
  "ambrose_blickpunkte.json",
);

/** Die Blickpunkte: eine Liste oder { blickpunkte: [...] } (wie liesBlickpunkte in der App). */
function ladeBlickpunkte() {
  if (!fs.existsSync(DATEN)) return [];
  const roh = JSON.parse(fs.readFileSync(DATEN, "utf8"));
  return Array.isArray(roh) ? roh : roh.blickpunkte || [];
}

/** Ist Ambrose nicht da (ambroseNichtDa): im Tiefpunkt oder nach dem Abschied? */
function nichtDa(v) {
  const tiefpunkt =
    v.tiefpunktGesehen === true && v.versoehnungGesehen !== true;
  return tiefpunkt || v.abschiedGesehen === true;
}

/** Kann Ambrose gerade etwas sagen (ambroseSprichtJetzt)? Erst nach der ersten Lektion. */
function sprichtJetzt(v) {
  if (v.ersteLektionBesprochen !== true || v.abschiedGesehen === true)
    return false;
  if (v.tiefpunktGesehen !== true) return true;
  return v.ambroseSprichtWieder === true || v.versoehnungGesehen === true;
}

/** Die Blickpunkte der Karte, die jetzt laufen (in der Reihenfolge der Datei). */
function faelligeBlickpunkte(welt, st, karte) {
  welt.blickpunkte = welt.blickpunkte || ladeBlickpunkte();
  const ort = welt.karteZuOrt[karte];
  if (st.karte !== karte || !ort || ort.art === "erinnerung") return [];
  if (nichtDa(st.vars) || !sprichtJetzt(st.vars)) return [];
  const eingang = ort.karten.find((k) => k.kennung === karte)?.eingang;
  if (eingang && gilt(st, eingang.wenn)) return [];
  return welt.blickpunkte.filter(
    (p) =>
      p.karte === karte &&
      welt.knoten[DATEI]?.includes(p.knoten) &&
      st.vars[p.knoten + "_gesehen"] !== true &&
      gilt(st, p.wann),
  );
}

/** Nach dem Betreten: jeden fälligen Blickpunkt als gesehen merken und abspielen. */
function blickpunkte(welt, st, karte) {
  for (const p of faelligeBlickpunkte(welt, st, karte)) {
    // Ein Blickpunkt davor kann die Lage geändert haben (Variable, Karte).
    if (!faelligeBlickpunkte(welt, st, karte).includes(p)) continue;
    const gesehen = p.knoten + "_gesehen";
    st.vars[gesehen] = true;
    const saat = st.saat;
    const folgen = dialog(welt, st, DATEI + "." + p.knoten);
    if (!st.leser) st.saat = saat;
    // Die Hülle hat die Variable gesetzt; sie gewinnt gegen den Wert aus Ink.
    st.vars[gesehen] = true;
    // Ein Blickpunkt löst nichts aus; Reisen aus ihm gelten nicht.
    wendeFolgenAn(welt, st, folgen, null, () => false);
  }
}
nachBetreten.push(blickpunkte);

module.exports = { faelligeBlickpunkte, ladeBlickpunkte };
