// Eichung Schritt b: rechnet die gesammelten Partien mit der Engine der App nach (Plan vom 18.10.2026).
//
// Warum: Genauigkeit und Spielstärke werden an Partien von chess.com und Lichess geeicht. Damit die
// Eichung zur App passt, rechnet dieselbe Engine (Stockfish 19 lite, ein Kern, npm-Paket
// „stockfish“) jede Stellung bis zur festen Tiefe 18, wie künftig die Auswertung in der App
// (Entscheidung 7). Gespeichert wird je Stellung die rohe Bewertung aus Sicht der Seite am Zug
// (Centibauern oder Matt in n) und der beste Zug; die Umrechnung macht Schritt c mit dem Code der
// App.
//
// Aufruf (im Ordner app/):
//   node skripte/eichung-rechnen.mjs                     # alle Partien, vier Läufe, höchstens 110 Minuten
//   node skripte/eichung-rechnen.mjs --parallel 2 --minuten 30
//
// Fortsetzbar: Jeder Lauf k schreibt nach buch/arbeit/eichung/bewertet-<k>.jsonl; schon bewertete
// Partien werden übersprungen. Die Rohdaten bleiben lokal (nie ins Repository).
import { fork } from "node:child_process";
import { appendFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Chess } from "chessops/chess";
import { parseSan } from "chessops/san";
import { makeUci } from "chessops/util";

const HIER = dirname(fileURLToPath(import.meta.url));
const STANDARD_ORDNER = resolve(HIER, "../../buch/arbeit/eichung");
const AUSGABE = /^bewertet-\d+\.jsonl$/;
const PLATTFORMEN = ["chesscom", "lichess"];
const TIEFE = 18;
const STANDARD_PARALLEL = 4;
const STANDARD_MINUTEN = 110;
const MS_JE_MINUTE = 60_000;
const benoetige = createRequire(import.meta.url);

function argumente(argv) {
  const text = (name, vorgabe) => {
    const stelle = argv.indexOf(name);
    return stelle >= 0 ? argv[stelle + 1] : vorgabe;
  };
  const wert = (name, vorgabe) => Number(text(name, String(vorgabe)));
  return {
    ordner: resolve(text("--ordner", STANDARD_ORDNER)),
    parallel: wert("--parallel", STANDARD_PARALLEL),
    minuten: wert("--minuten", STANDARD_MINUTEN),
    lauf: wert("--lauf", -1),
  };
}

/** Die Zeilen einer JSONL-Datei als Objekte; fehlt die Datei, keine. */
function liesZeilen(datei) {
  if (!existsSync(datei)) return [];
  return readFileSync(datei, "utf8")
    .split("\n")
    .filter((z) => z.trim())
    .map((z) => JSON.parse(z));
}

/** Alle gesammelten Partien beider Plattformen, in fester Reihenfolge. */
function allePartien(ordner) {
  return PLATTFORMEN.flatMap((plattform) => liesZeilen(resolve(ordner, `${plattform}.jsonl`)));
}

/** Schlüssel aller schon bewerteten Partien, aus allen Läufen (auch mit anderer Aufteilung). */
function schonBewertet(ordner) {
  const dateien = existsSync(ordner) ? readdirSync(ordner).filter((n) => AUSGABE.test(n)) : [];
  return new Set(dateien.flatMap((n) => liesZeilen(resolve(ordner, n)).map(schluessel)));
}

/** Schlüssel einer Partie (Plattform und Kennung). */
const schluessel = (p) => `${p.plattform}:${p.kennung}`;

const KOENIG_KURZ = 6;
const KOENIG_LANG = 2;
const LINIEN = 8;

/**
 * Ein Zug in UCI, wie Stockfish ihn erwartet: chessops schreibt die Rochade als „König schlägt
 * Turm“ (e1h1), Stockfish im normalen Modus als Königszug um zwei Felder (e1g1); wie
 * sanZuUci in app/src/spiel/zuege.ts.
 */
function alsUci(stellung, zug) {
  const figur = stellung.board.get(zug.from);
  const ziel = stellung.board.get(zug.to);
  if (figur?.role !== "king" || ziel?.role !== "rook" || ziel.color !== figur.color) {
    return makeUci(zug);
  }
  const reihe = zug.from - (zug.from % LINIEN);
  return makeUci({ from: zug.from, to: reihe + (zug.to > zug.from ? KOENIG_KURZ : KOENIG_LANG) });
}

/** Die Züge einer Partie in UCI, oder null bei einem nicht spielbaren Zug (Datenfehler). */
function uciZuege(zuege) {
  const stellung = Chess.default();
  const ergebnis = [];
  for (const san of zuege) {
    const zug = parseSan(stellung, san);
    if (!zug) return null;
    ergebnis.push(alsUci(stellung, zug));
    stellung.play(zug);
  }
  return ergebnis;
}

/**
 * Eine Engine, erst nach „readyok“ benutzbar (vorher beendet sie sich bei Befehlen).
 * Ausgabe: Promise mit neuePartie(), bewerte(zuege) → {cp|matt, bester, tiefe}, beenden().
 */
function engine() {
  return new Promise((bereit) => {
    let warten = null;
    let letzte = null;
    const sf = benoetige("stockfish")("lite-single", (zeile) => {
      if (zeile === "readyok") bereit(steuerung);
      if (zeile.startsWith("info depth ") && zeile.includes(" score ")) letzte = zeile;
      if (zeile.startsWith("bestmove") && warten) {
        const fertig = warten;
        warten = null;
        fertig(auswerten(letzte, zeile.split(" ")[1]));
        letzte = null;
      }
    });
    const steuerung = {
      neuePartie: () => sf.processCommand("ucinewgame"),
      bewerte: (zuege) =>
        new Promise((erledigt) => {
          warten = erledigt;
          sf.processCommand(`position startpos${zuege.length ? " moves " + zuege.join(" ") : ""}`);
          sf.processCommand(`go depth ${TIEFE}`);
        }),
      beenden: () => sf.terminate(),
    };
    sf.processCommand("uci");
    sf.processCommand("isready");
  });
}

/** Liest Tiefe und Bewertung aus der letzten Info-Zeile; ohne Zeile (Matt, Patt) keine Bewertung. */
function auswerten(zeile, bester) {
  const tiefe = Number(/ depth (\d+)/.exec(zeile ?? "")?.[1] ?? 0);
  const cp = /score cp (-?\d+)/.exec(zeile ?? "")?.[1];
  const matt = /score mate (-?\d+)/.exec(zeile ?? "")?.[1];
  const ende = bester === "(none)" ? null : bester;
  if (matt !== undefined) return { matt: Number(matt), bester: ende, tiefe };
  return { cp: cp === undefined ? null : Number(cp), bester: ende, tiefe };
}

/** Ein Lauf: bewertet jede n-te Partie, die noch in keiner Ausgabe steht. */
async function lauf(ordner, nummer, anzahl, ende) {
  const ausgabe = resolve(ordner, `bewertet-${nummer}.jsonl`);
  const fertig = schonBewertet(ordner);
  const sf = await engine();
  const meine = allePartien(ordner).filter((_, i) => i % anzahl === nummer);
  for (const partie of meine) {
    if (Date.now() > ende) break;
    if (fertig.has(schluessel(partie))) continue;
    const zuege = uciZuege(partie.zuege);
    if (!zuege) continue;
    sf.neuePartie();
    const stellungen = [];
    for (let i = 0; i <= zuege.length; i += 1) stellungen.push(await sf.bewerte(zuege.slice(0, i)));
    const zeile = {
      plattform: partie.plattform,
      kennung: partie.kennung,
      tiefe: TIEFE,
      stellungen,
    };
    appendFileSync(ausgabe, JSON.stringify(zeile) + "\n");
  }
  sf.beenden();
}

function main() {
  const a = argumente(process.argv.slice(2));
  const ende = Date.now() + a.minuten * MS_JE_MINUTE;
  if (a.lauf >= 0) {
    lauf(a.ordner, a.lauf, a.parallel, ende).then(() => process.exit(0));
    return;
  }
  const gesamt = allePartien(a.ordner).length;
  console.log(
    `${gesamt} Partien, ${a.parallel} Läufe, Tiefe ${TIEFE}, höchstens ${a.minuten} Minuten`,
  );
  for (let k = 0; k < a.parallel; k += 1) {
    fork(fileURLToPath(import.meta.url), [
      "--lauf",
      String(k),
      "--parallel",
      String(a.parallel),
      "--minuten",
      String(a.minuten),
      "--ordner",
      a.ordner,
    ]);
  }
}

main();
