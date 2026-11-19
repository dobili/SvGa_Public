// Aktstand: lässt die Gesamtsimulation (gesamtsimulation.cjs) bis zum Beginn eines Akts spielen und
// schreibt ihren Stand als JSON, damit der Spieler-Durchlauf (app/tests/durchlauf) einen Akt von
// seinem Beginn an im Browser spielen kann.
//
// Zweck: Der Spieler-Durchlauf spielt das Spiel mit echten Eingaben und braucht für das ganze Spiel
// viele Stunden. Um Akt 2, 3 und 4 trotzdem je von vorn zu messen, beginnt er dort mit einem Stand,
// den die Logik der Simulation erspielt hat (Auftrag vom 18.11.2026). Hier wird kein Wert von Hand
// gesetzt: Die Simulation spielt mit ihren Regeln, bis die Variable des Aktendes steht.
// Warum als eigenes Werkzeug: Die Simulation selbst bleibt unverändert; dieses Werkzeug nutzt nur
// ihren Haken `bis(st)` (wie der Chaos-Spieler) und schreibt den Stand in ihrer eigenen Form. Die
// Umrechnung in einen Spielstand der App macht app/tests/durchlauf/simstand.ts mit den Funktionen
// der App.
//
// Aufruf aus dem Hauptordner:
//   node pipeline/abenteuer/aktstand.cjs --akt 2 --ziel DATEI.json [--startwert 1] [--sekunden 120]
// --akt: 2, 3 oder 4 (der Stand zu Beginn dieses Akts).
// Ausgabe: JSON mit Variablen, Besitz, Karten, Münzen, Queststand, Karte, besuchten Orten, Runden
// und Partien der Simulation. Rückgabewert 1, wenn der Aktbeginn im Zeitbudget nicht erreicht wird.
"use strict";
const fs = require("fs");
const { ladeWelt, neuerStand } = require("./gesamtsimulation-regeln.cjs");
const { erkunde } = require("./gesamtsimulation.cjs");

/**
 * Die Variable, mit der der vorige Akt endet (Dialoge: cedar-creek-aussen.ende_akt1,
 * ironwood-aussen.einladung, desert-springs-aussen.bahnhof_ende).
 */
const AKTENDE = {
  2: "endeAkt1Gesehen",
  3: "einladungGesehen",
  4: "endeAkt3Gesehen",
};

/** Liest --name wert aus der Befehlszeile. */
function wert(liste, name, vorgabe) {
  const i = liste.indexOf(name);
  return i >= 0 && liste[i + 1] !== undefined ? liste[i + 1] : vorgabe;
}

function hauptprogramm(liste) {
  const akt = Number(wert(liste, "--akt", "2"));
  const ziel = wert(liste, "--ziel", "");
  const variable = AKTENDE[akt];
  if (!variable || !ziel) {
    console.error(
      "Aufruf: node pipeline/abenteuer/aktstand.cjs --akt 2|3|4 --ziel DATEI.json",
    );
    process.exitCode = 1;
    return;
  }
  const welt = ladeWelt();
  const st = neuerStand(Number(wert(liste, "--startwert", "1")));
  const frist = Date.now() + Number(wert(liste, "--sekunden", "120")) * 1000;
  const erreicht = erkunde(
    welt,
    st,
    frist,
    0,
    (s) => s.vars[variable] === true,
  );
  if (!erreicht) {
    console.error(`Akt ${akt} nicht erreicht (${variable} steht nicht).`);
    process.exitCode = 1;
    return;
  }
  const stand = {
    akt,
    vars: st.vars,
    besitz: [...st.besitz],
    karten: st.karten,
    muenzen: st.muenzen,
    staende: st.staende,
    karte: st.karte,
    besucht: [...st.besucht],
    runden: st.runden,
    partien: st.partien,
  };
  fs.writeFileSync(ziel, JSON.stringify(stand, null, 1));
  console.log(
    `Akt ${akt}: Stand auf ${st.karte}, ${st.staende.length} Quests, ${st.muenzen} Münzen → ${ziel}`,
  );
}

if (require.main === module) hauptprogramm(process.argv.slice(2));
