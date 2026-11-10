// Gesamtsimulation, Sammelstränge: Welche Stücke der Spieler am Ende gefunden hat (Buchseiten,
// Finch-Figuren, Spuren von Perfect Move, Kreidetreffpunkte).
//
// Warum: Quests wie wegGhostCapital.finchJagd (15 Figuren) und capitalArena.verloreneSeiten
// (13 Seiten) hingen in der Simulation; der Bericht nannte nur den Knoten, nicht welches Stück fehlte.
// Ein Sammelstrang ist ein Zähler, der in mindestens drei Knoten um eins steigt
// (`~ buchseiten = buchseiten + 1`); ein Stück gilt als gefunden, wenn der Fund des Knotens
// (`gibFund("seite05")`) in den Variablen steht (gefundenSeite05), sonst als fehlend.
"use strict";
const fs = require("fs");
const path = require("path");

const DIALOGE = path.resolve(
  __dirname,
  "..",
  "..",
  "inhalte",
  "abenteuer",
  "dialoge",
  "de",
);
const MINDESTENS = 3;
const gross = (s) => s[0].toUpperCase() + s.slice(1);

/** Zähler → [{ knoten: "datei.knoten", fund }] aus allen Ink-Quellen. */
function straenge() {
  const ergebnis = {};
  for (const name of fs
    .readdirSync(DIALOGE)
    .filter((n) => n.endsWith(".ink"))) {
    const datei = name.slice(0, -4);
    const quelle = fs.readFileSync(path.join(DIALOGE, name), "utf8");
    for (const teil of quelle.split(/^=== /m).slice(1)) {
      const knoten = teil.split(/\s/)[0];
      const fund = (teil.match(/gibFund\("(\w+)"\)/) || [])[1] || null;
      for (const m of teil.matchAll(/~\s*(\w+)\s*=\s*(\w+)\s*\+\s*1/g)) {
        if (m[1] !== m[2]) continue;
        (ergebnis[m[1]] ||= []).push({ knoten: `${datei}.${knoten}`, fund });
      }
    }
  }
  // Nur Zähler, deren Knoten Funde vergeben (nicht ambroseVertrauen oder kerzeRichtig).
  const sammlung = ([, s]) => s.length >= MINDESTENS && s.every((x) => x.fund);
  return Object.fromEntries(Object.entries(ergebnis).filter(sammlung));
}

/** Zeilen für den Bericht: je Strang gefunden/gesamt und die fehlenden Knoten. */
function berichtSammlung(st) {
  return Object.entries(straenge()).map(([zaehler, stuecke]) => {
    const fehlt = stuecke.filter(
      (s) => !s.fund || !st.vars["gefunden" + gross(s.fund)],
    );
    const anzahl = stuecke.length - fehlt.length;
    const liste = fehlt.map((s) => s.knoten).join(", ");
    return `Sammelstrang ${zaehler}: ${anzahl}/${stuecke.length}${liste ? ` (fehlt: ${liste})` : ""}`;
  });
}

module.exports = { straenge, berichtSammlung };
