/**
 * Messlauf: übliche Anteile aller zehn Zugklassen je Zeitklasse und Elo-Band aus den
 * Spielerprofilen (77 000 Lichess-Partien, buch/arbeit/spielerprofil, nur lokal).
 *
 * Warum: „Deine Züge“ vergleicht jede Klasse mit dem Üblichen bei gleicher Stärke
 * (spiel/zugklassenvergleich.ts). Für Brillant, Stark und Theoriezug gab es bis 0.2.146 nur
 * Schätzungen (Frage des Autors, 26.10.2026). Dieser Lauf bestimmt die Klasse jedes gespeicherten
 * Zuges mit der Regel der App selbst (klasseVon in spiel/auswertung.ts, Opfer nach engine/opfer.ts,
 * Theoriekette nach schach/theorie.ts) und zählt je Spieler.
 * Ablauf: Teil 0 bis 3 (je eine Datei stellungen-N.jsonl) schreiben die Zählungen je Spieler,
 * danach fasst ZUSAMMEN=1 alles zu Quantilen zusammen (5 %, Median, 95 % über die Spieler mit
 * mindestens 100 Zügen) und schreibt spiel/zugklassenvergleich-daten.ts neu.
 * Aufruf (im Ordner app/): TEIL=0 npx vitest run --config vitest.messung.config.ts
 *   src/spiel/zugklassen.messung.ts (je Teil), dann ZUSAMMEN=1 mit demselben Befehl.
 * Abhängigkeiten: spiel/auswertung.ts, engine/opfer.ts, engine/fehlerart.ts, schach/theorie.ts,
 * schach/theorienamen.ts, schach/eroeffnungsindex.ts, chessops.
 */
import { createReadStream, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { makeSan } from "chessops/san";
import { makeUci, parseUci } from "chessops/util";
import { it } from "vitest";
import type { Eroeffnungsliste } from "../daten/generiert/eroeffnungsliste";
import { lageVon } from "../engine/fehlerart";
import { opferwert } from "../engine/opfer";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { baueEroeffnungsindex } from "../schach/eroeffnungsindex";
import { baueTheoriebaum, theorieJeZug, type Theoriequellen } from "../schach/theorie";
import { gambitJeZug } from "../schach/theorienamen";
import { GRENZE_FEHLER, klasseVon, OPFER_AB, WERTGRENZE, type Zugklasse } from "./auswertung";
import { zugklassenTabelle } from "./messung/zugklassen-tabelle.messung-hilfe";

const ORDNER = join(import.meta.dirname, "../../../buch/arbeit/spielerprofil");
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Grenzen der Klasse „ungenau“ und des Brillant-Vorfilters wie in spiel/auswertung.ts. */
const UNGENAU_AB = 0.5;
const BRILLANT_NICHT_SCHLECHTER_ALS = -1;
const BRILLANT_ZWEITBESTER_UNTER = 7;
const BANDBREITE = 400;
const BAND_MIN = 400;
const BAND_MAX = 2400;
const MINDEST_ZUEGE = 100;
/** Für einen Probelauf: höchstens so viele Stellungen (PROBE=20000). */
const GRENZE_PROBE = Number(process.env.PROBE ?? Infinity);

export const KLASSEN: readonly Zugklasse[] = [
  "brillant",
  "stark",
  "bester",
  "sehrGut",
  "gut",
  "buch",
  "ungenau",
  "fehler",
  "verpasst",
  "patzer",
];

interface Datensatz {
  readonly g: string;
  readonly s: string;
  readonly t: string;
  readonly p: number;
  readonly f: string;
  readonly m: string;
  readonly b: string | null;
  readonly bw: number | null;
  readonly w: number | null;
  readonly w2: number | null;
}

const begrenzt = (x: number | null) => Math.max(-WERTGRENZE, Math.min(WERTGRENZE, x ?? 0));
/** Stellung ohne Zugzähler, zum Vergleich zweier FEN. */
const kern = (fen: string) => fen.split(" ").slice(0, 4).join(" ");

function position(fen: string): Chess | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  return pos.isErr ? null : pos.value;
}

/** Der Zug von `fen` nach `ziel` (eine Stellung weiter), als UCI; null, wenn keiner passt. */
function verbindungszug(fen: string, ziel: string): string | null {
  const pos = position(fen);
  if (!pos) return null;
  for (const [von, ziele] of pos.allDests()) {
    for (const nach of ziele) {
      for (const promotion of [undefined, "queen", "knight", "rook", "bishop"] as const) {
        const zug = { from: von, to: nach, promotion };
        if (!pos.isLegal(zug)) continue;
        const neu = pos.clone();
        neu.play(zug);
        if (kern(makeFen(neu.toSetup())) === kern(ziel)) return makeUci(zug);
      }
    }
  }
  return null;
}

/** Spielt einen UCI-Zug: Kurznotation und Stellung danach. */
function spiele(fen: string, uci: string): { san: string; fen: string } | null {
  const pos = position(fen);
  const zug = parseUci(uci);
  if (!pos || !zug || !pos.isLegal(zug)) return null;
  const san = makeSan(pos, zug);
  pos.play(zug);
  return { san, fen: makeFen(pos.toSetup()) };
}

interface Halbzug {
  readonly eigener: Datensatz | null;
  /** Verlust des gegnerischen Zuges aus Sicht des Spielers (nur bei gegnerischen Halbzügen). */
  readonly gegnerVerlust: number;
}

/** Die Partie bis zum letzten eigenen Zug: Stellungen, Züge, eigene Datensätze an ihrem Platz. */
function rekonstruiere(saetze: readonly Datensatz[]) {
  const fens = [GRUNDSTELLUNG];
  const sans: string[] = [];
  const halbzuege: Halbzug[] = [];
  let vorher: Datensatz | null = null;
  for (const r of saetze) {
    const jetzt = fens[fens.length - 1] ?? GRUNDSTELLUNG;
    if (kern(jetzt) !== kern(r.f)) {
      const uci = verbindungszug(jetzt, r.f);
      const zug = uci ? spiele(jetzt, uci) : null;
      if (!zug) return null;
      sans.push(zug.san);
      fens.push(zug.fen);
      const verlust = vorher ? begrenzt(r.bw) - begrenzt(vorher.w) : 0;
      halbzuege.push({ eigener: null, gegnerVerlust: verlust });
    }
    const eigen = spiele(r.f, r.m);
    if (!eigen) return null;
    sans.push(eigen.san);
    fens.push(eigen.fen);
    halbzuege.push({ eigener: r, gegnerVerlust: 0 });
    vorher = r;
  }
  return { fens, sans, halbzuege };
}

/** Darf der Zug nach den billigen Bedingungen überhaupt brillant sein? Dann erst das Opfer rechnen. */
function opferMoeglich(verlust: number, warBester: boolean, wertVorher: number, abstand: number) {
  return (
    (warBester || verlust < UNGENAU_AB) &&
    wertVorher - verlust >= BRILLANT_NICHT_SCHLECHTER_ALS &&
    wertVorher - abstand < BRILLANT_ZWEITBESTER_UNTER
  );
}

/** Klassen der eigenen Züge einer Partie, mit der Regel der App. */
function klassenDerPartie(saetze: readonly Datensatz[], quellen: Theoriequellen): Zugklasse[] {
  const partie = rekonstruiere(saetze);
  if (!partie) return [];
  const theorie = theorieJeZug(quellen, partie.fens, partie.sans);
  const gambits = gambitJeZug(quellen, partie.fens, partie.sans);
  const klassen: Zugklasse[] = [];
  let nochTheorie = true;
  let vorherVerlust = 0;
  partie.halbzuege.forEach((h, i) => {
    const r = h.eigener;
    if (!r) {
      const grenze = gambits[i] ? GRENZE_FEHLER : UNGENAU_AB;
      nochTheorie = nochTheorie && theorie[i] === true && h.gegnerVerlust < grenze;
      vorherVerlust = h.gegnerVerlust;
      return;
    }
    const wertVorher = begrenzt(r.bw);
    const verlust = Math.max(0, wertVorher - begrenzt(r.w));
    const warBester = r.b !== null && r.m === r.b;
    const abstand = r.w2 === null ? 0 : Math.max(0, wertVorher - begrenzt(r.w2));
    const buch = nochTheorie && theorie[i] === true;
    const pos = position(r.f);
    const imSchach = pos?.isCheck() ?? false;
    let opfer = false;
    if (!buch && !imSchach && opferMoeglich(verlust, warBester, wertVorher, abstand)) {
      const lage = lageVon(r.f);
      opfer = lage !== null && opferwert(lage, r.m) >= OPFER_AB;
    }
    const klasse = klasseVon(verlust, {
      warBester,
      einziger: warBester && abstand >= GRENZE_FEHLER,
      opfer,
      vorherVerlust,
      wertVorher,
      abstand,
      imSchach,
      buch,
      gambit: gambits[i] === true,
    });
    klassen.push(klasse);
    nochTheorie = klasse === "buch";
    vorherVerlust = 0;
  });
  return klassen;
}

function quellen(): Theoriequellen {
  const pfad = join(import.meta.dirname, "../../public/daten/de/eroeffnungen-lichess.json");
  const liste = JSON.parse(readFileSync(pfad, "utf-8")) as Eroeffnungsliste;
  return {
    baum: baueTheoriebaum(liste),
    buch: baueEroeffnungsindex([ladeKapitel(2), ladeKapitel(3)]),
  };
}

/** Elo je Partie und Spieler aus partien.jsonl („g|s“ → Elo). */
function eloJeSpiel(): Map<string, number> {
  const elo = new Map<string, number>();
  for (const zeile of readFileSync(join(ORDNER, "partien.jsonl"), "utf8").split("\n")) {
    if (!zeile) continue;
    const d = JSON.parse(zeile) as { g: string; s: string; elo: number };
    elo.set(`${d.g}|${d.s}`, d.elo);
  }
  return elo;
}

const bandVon = (elo: number) =>
  Math.max(BAND_MIN, Math.min(BAND_MAX, Math.floor(elo / BANDBREITE) * BANDBREITE));

/** Zählt einen Teil: je „Zeitklasse|Band|Spieler“ die Zahl der Züge je Klasse. */
async function zaehleTeil(teil: string) {
  const q = quellen();
  const elo = eloJeSpiel();
  const zaehlung: Record<string, Record<string, number>> = {};
  let gruppe: Datensatz[] = [];
  const fertig = () => {
    const erster = gruppe[0];
    if (!erster) return;
    const e = elo.get(`${erster.g}|${erster.s}`);
    if (e !== undefined) {
      const schluessel = `${erster.t}|${bandVon(e)}|${erster.s}`;
      const z = (zaehlung[schluessel] ??= {});
      for (const k of klassenDerPartie(gruppe, q)) z[k] = (z[k] ?? 0) + 1;
    }
    gruppe = [];
  };
  const zeilen = createInterface({
    input: createReadStream(join(ORDNER, `stellungen-${teil}.jsonl`)),
  });
  let n = 0;
  for await (const zeile of zeilen) {
    if (!zeile) continue;
    const r = JSON.parse(zeile) as Datensatz;
    const erster = gruppe[0];
    if (erster && (erster.g !== r.g || erster.s !== r.s)) fertig();
    gruppe.push(r);
    n += 1;
    if (n % 100000 === 0) console.log(`Teil ${teil}: ${n} Stellungen`);
    if (n >= GRENZE_PROBE) break;
  }
  fertig();
  writeFileSync(join(ORDNER, `zugklassen-neu-${teil}.json`), JSON.stringify(zaehlung));
}

/** Fasst die Teile zusammen und schreibt die Tabelle. */
function zusammen() {
  const alle: Record<string, Record<string, number>> = {};
  for (const teil of ["0", "1", "2", "3"]) {
    const datei = join(ORDNER, `zugklassen-neu-${teil}.json`);
    if (!existsSync(datei)) throw new Error(`${datei} fehlt`);
    const z = JSON.parse(readFileSync(datei, "utf8")) as Record<string, Record<string, number>>;
    for (const [k, v] of Object.entries(z)) {
      const ziel = (alle[k] ??= {});
      for (const [klasse, n] of Object.entries(v)) ziel[klasse] = (ziel[klasse] ?? 0) + n;
    }
  }
  const { tabelle, bericht } = zugklassenTabelle(alle, KLASSEN, MINDEST_ZUEGE);
  writeFileSync(join(import.meta.dirname, "zugklassenvergleich-daten.ts"), tabelle);
  writeFileSync(join(ORDNER, "zugklassen-neu-bericht.txt"), bericht);
  console.log(bericht);
}

it("misst die Zugklassen", async () => {
  if (process.env.ZUSAMMEN) zusammen();
  else await zaehleTeil(process.env.TEIL ?? "0");
});
