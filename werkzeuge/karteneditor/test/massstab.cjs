/*
 * Test der Kollision skalierter Objekte (js/massstab.js): Der Editor muss für ein Objekt mit
 * `massstab` dieselben Kacheln sperren wie der Kartenbau (pipeline/abenteuer/objektmassstab.py,
 * KARTENREGELN 10.88).
 *
 * Herkunft der Erwartungswerte: Größe und `maske` aus `objektform.geformt(angabe, eintrag)` der
 * Pipeline (Stand 17.11.2026), Angaben (breite, hoehe, maske, frei_unten) aus dem Möbelkatalog
 * inhalte/abenteuer/moebel/. Ändert sich die Regel in der Pipeline, hier neu ausrechnen:
 *   python -c "from pipeline.abenteuer.objektform import geformt; print(geformt(ANGABE, EINTRAG))"
 *
 * Aufruf ohne Browser und ohne Paket (Hauptordner): node werkzeuge/karteneditor/test/massstab.cjs
 * Dazu läuft `imEditor` im Oberflächentest (editor.test.cjs) mit denselben Fällen im echten Editor.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const K = 16;
/** Skripte, die die Form eines Objekts rechnen, in der Reihenfolge der Seite (index.html). */
const FORMSKRIPTE = ["geometrie.js", "zuschnitt.js", "massstab.js", "fein.js"];

const FAELLE = [
  {
    name: "mf4VillaWhitlock (Katalogmaske 9 × 13) mit massstab 1.1",
    angabe: {
      breite: 144,
      hoehe: 208,
      maske: [
        ".........",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "##.######",
        "#...#####",
        "#...#####",
      ],
    },
    eintrag: { massstab: 1.1 },
    breite: 158,
    hoehe: 229,
    maske: [
      "..........",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##.#######",
      "#...######",
      "#...######",
      "#....#####",
    ],
  },
  {
    name: "mf4VillaWhitlock mit zuschnitt [0, 0, 14, 0] und massstab 1.1",
    angabe: {
      breite: 144,
      hoehe: 208,
      maske: [
        ".........",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "##.######",
        "#...#####",
        "#...#####",
      ],
    },
    eintrag: { massstab: 1.1, zuschnitt: [0, 0, 14, 0] },
    breite: 143,
    hoehe: 229,
    maske: [
      ".........",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "##.######",
      "#...#####",
      "#...#####",
      "#....####",
    ],
  },
  {
    name: "mf4VillaWhitlock wie in Maple Falls: eigene maske der Szene geht vor",
    angabe: {
      breite: 144,
      hoehe: 208,
      maske: [
        ".........",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "##.######",
        "#...#####",
        "#...#####",
      ],
    },
    eintrag: {
      massstab: 1.1,
      zuschnitt: [0, 0, 14, 0],
      maske: [
        ".........",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "##.######",
        "##.######",
        "#...#####",
        "#...#####",
      ],
    },
    breite: 143,
    hoehe: 229,
    maske: [
      ".........",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "##.######",
      "##.######",
      "#...#####",
      "#...#####",
      ".........",
    ],
  },
  {
    name: "rvPavillonAchteck (Katalogmaske) mit massstab 1.375",
    angabe: {
      breite: 128,
      hoehe: 144,
      maske: [
        "........",
        "........",
        "........",
        "........",
        "########",
        "########",
        "########",
        "########",
        "########",
      ],
    },
    eintrag: { massstab: 1.375 },
    breite: 176,
    hoehe: 198,
    maske: [
      "...........",
      "...........",
      "...........",
      "...........",
      "...........",
      "###########",
      "###########",
      "###########",
      "###########",
      "###########",
      "###########",
      "###########",
      "###########",
    ],
  },
  {
    name: "ca8Eisenwaren (Fassade 128 × 144, Standardregel) mit massstab 1.25",
    angabe: { breite: 128, hoehe: 144 },
    eintrag: { massstab: 1.25 },
    breite: 160,
    hoehe: 180,
    maske: [
      "..........",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "..........",
    ],
  },
  {
    name: "mf4Diner (128 × 144) mit massstab 1.2: Reihe mit der Tür sperrt",
    angabe: { breite: 128, hoehe: 144 },
    eintrag: { massstab: 1.2 },
    breite: 154,
    hoehe: 173,
    maske: [
      "..........",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
      "##########",
    ],
  },
  {
    name: "ld14BlockhuetteKamin (80 × 80) mit massstab 1.5",
    angabe: { breite: 80, hoehe: 80 },
    eintrag: { massstab: 1.5 },
    breite: 120,
    hoehe: 120,
    maske: [
      "........",
      "#######.",
      "########",
      "########",
      "########",
      "########",
      "########",
      "#######.",
    ],
  },
  {
    name: "mf4VillaWhitlock mit massstab 1.1, gespiegelt und um 90 Grad gedreht",
    angabe: {
      breite: 144,
      hoehe: 208,
      maske: [
        ".........",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "#########",
        "##.######",
        "#...#####",
        "#...#####",
      ],
    },
    eintrag: { massstab: 1.1, spiegeln: true, drehung: 90 },
    breite: 229,
    hoehe: 158,
    maske: [
      "#############..",
      "#############..",
      "#############..",
      "#############..",
      "#############..",
      "#############..",
      "..###########..",
      "..###########..",
      "..###########..",
      "#############..",
    ],
  },
  {
    name: "Kunstfall: 48 × 64 mit frei_unten 1, massstab 1.3, drehung 270",
    angabe: { breite: 48, hoehe: 64, frei_unten: 1 },
    eintrag: { massstab: 1.3, drehung: 270 },
    breite: 83,
    hoehe: 62,
    maske: [".###..", ".###..", ".###..", ".###.."],
  },
  {
    name: "mf12Tischsets (16 × 16) mit massstab 0.7",
    angabe: { breite: 16, hoehe: 16 },
    eintrag: { massstab: 0.7 },
    breite: 11,
    hoehe: 11,
    maske: ["#"],
  },
];

/** Größe, Maske und gesperrte Kacheln (relativ zur Ecke), die der Editor für einen Fall rechnet. */
function rechne(KE, fall) {
  const angabe = KE.geformt({ ...fall.angabe, kollision: true }, fall.eintrag);
  const felder = KE.maskenfelder(angabe).map((f) => f.join(","));
  return { breite: angabe.breite, hoehe: angabe.hoehe, maske: angabe.maske, felder };
}

/** Die Kacheln „x,y“, die eine Maske sperrt (Vergleichswert zu KE.maskenfelder). */
const felderVon = (maske) =>
  maske.flatMap((zeile, y) => [...zeile].flatMap((c, x) => (c === "#" ? [x + "," + y] : [])));

/** Vergleicht das Ergebnis des Editors mit den Werten der Pipeline. */
function vergleiche(fall, ist, pruefe) {
  const maske = ist.maske || [];
  const gleich =
    ist.breite === fall.breite &&
    ist.hoehe === fall.hoehe &&
    maske.join("/") === fall.maske.join("/") &&
    ist.felder.sort().join(" ") === felderVon(fall.maske).sort().join(" ");
  const zusatz = gleich ? "" : ` (Editor ${ist.breite} × ${ist.hoehe}: ${maske.join("/")})`;
  pruefe(gleich, `Maßstab wie Kartenbau: ${fall.name}${zusatz}`);
}

/** Ohne Maßstab bleibt alles beim Alten: ganze Kacheln, Standardregel mit frei_unten. */
function ohneMassstab(KE, pruefe) {
  const fassade = KE.geformt({ breite: 128, hoehe: 150, frei_unten: 1, kollision: true }, {});
  const felder = KE.maskenfelder(fassade);
  const reihen = [...new Set(felder.map((f) => f[1]))];
  pruefe(
    felder.length === (128 / K) * 7 && reihen.join() === "1,2,3,4,5,6,7",
    "Ohne Maßstab unverändert: 128 × 150 mit frei_unten 1 sperrt die Reihen 1 bis 7",
  );
}

/** Die Fälle im laufenden Editor (Playwright-Seite), Teil von editor.test.cjs. */
async function imEditor(seite, pruefe) {
  const ergebnisse = await seite.evaluate(
    ([faelle, quelle]) => {
      const rechne = new Function("return " + quelle)();
      return faelle.map((fall) => rechne(KE, fall));
    },
    [FAELLE, rechne.toString()],
  );
  FAELLE.forEach((fall, i) => vergleiche(fall, ergebnisse[i], pruefe));
}

/** Lädt die Formskripte des Editors in eine leere Umgebung (kein DOM, kein Paket). */
function ladeEditor() {
  const fenster = { KE: { zustand: {} } };
  const umgebung = vm.createContext({ window: fenster });
  for (const name of FORMSKRIPTE) {
    const datei = path.join(__dirname, "..", "js", name);
    vm.runInContext(fs.readFileSync(datei, "utf-8"), umgebung, { filename: datei });
  }
  return fenster.KE;
}

function haupt() {
  let fehler = 0;
  const pruefe = (bedingung, text) => {
    console.log(`${bedingung ? "ok  " : "FEHLER"} ${text}`);
    if (!bedingung) fehler++;
  };
  const KE = ladeEditor();
  for (const fall of FAELLE) vergleiche(fall, rechne(KE, fall), pruefe);
  ohneMassstab(KE, pruefe);
  console.log(fehler ? `${fehler} Fehler` : "Alles in Ordnung");
  process.exit(fehler ? 1 : 0);
}

if (require.main === module) haupt();
module.exports = { imEditor, FAELLE };
