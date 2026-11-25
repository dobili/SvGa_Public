/**
 * Testhilfe: die einkernige Fairy-Stockfish (app/public/engine-varianten, Bau von mittel-3) in Node
 * als Zugbewerter für die Bots der Sonderformen.
 *
 * Warum: Die Bots sind mit einer Attrappe getestet; ob die echte Engine dieselben Regeln spielt
 * (Entenfeld, Taschen, Rochade-Schreibweise), zeigt erst eine Partie gegen sie. In der App kommt
 * die Anbindung von mittel-3 (Worker); hier läuft dieselbe Datei direkt in Node.
 * Abhängigkeiten: node:fs, die Engine-Dateien unter public/engine-varianten.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import type { Bewerteterzug, Zugbewerter } from "./botwahl";

const ORDNER = new URL("../../../public/engine-varianten/", import.meta.url).pathname;
/** Wert für ein Matt in Centipawns (weit über jeder Bewertung). */
const MATTWERT = 100000;

interface Fairy {
  postMessage(befehl: string): void;
  addMessageListener(empfaenger: (zeile: string) => void): void;
}
type Fabrik = (optionen: { locateFile: () => string }) => Promise<Fairy>;

/** Lädt die Engine (einmal je Aufruf; ein „go“ blockiert, deshalb nacheinander fragen). */
async function ladeFairy(): Promise<Fairy> {
  const quelle = readFileSync(`${ORDNER}fairy-stockfish-einkernig.js`, "utf8");
  const baue = new Function("require", "process", "__dirname", `${quelle}\n;return Stockfish;`) as (
    r: NodeJS.Require,
    p: NodeJS.Process,
    d: string,
  ) => Fabrik;
  const fabrik = baue(createRequire(import.meta.url), process, ORDNER);
  return fabrik({ locateFile: () => `${ORDNER}fairy-stockfish-einkernig.wasm` });
}

/** Liest „info … multipv N … score cp X … pv ZUG“ zu (N, Zug, Wert). */
function infozeile(zeile: string): { nummer: number; zug: string; wert: number } | null {
  const m = / multipv (\d+) .*score (cp|mate) (-?\d+).* pv (\S+)/.exec(zeile);
  if (!m) return null;
  const zahl = Number(m[3]);
  const wert = m[2] === "mate" ? Math.sign(zahl) * MATTWERT : zahl;
  return { nummer: Number(m[1]), zug: m[4] as string, wert };
}

/**
 * Ein Zugbewerter für eine Variante (UCI_Variant: chess, duck, crazyhouse …) mit fester
 * Rechenzeit. Ausgabe: beste Züge, bester zuerst (jeweils die letzte Zeile je Variante).
 */
export async function fairyBewerter(variante: string, rechenzeitMs: number): Promise<Zugbewerter> {
  const sf = await ladeFairy();
  let empfang: ((z: string) => void) | null = null;
  sf.addMessageListener((z) => empfang?.(z));
  const bis = (muster: RegExp, sammle?: (z: string) => void) =>
    new Promise<void>((fertig) => {
      empfang = (z) => {
        sammle?.(z);
        if (muster.test(z)) fertig();
      };
    });
  const ok = bis(/^uciok/);
  sf.postMessage("uci");
  await ok;
  sf.postMessage(`setoption name UCI_Variant value ${variante}`);
  return async (fen, varianten) => {
    const je = new Map<number, Bewerteterzug>();
    const fertig = bis(/^bestmove/, (z) => {
      const i = infozeile(z);
      if (i) je.set(i.nummer, { zug: i.zug, wert: i.wert });
    });
    sf.postMessage(`setoption name MultiPV value ${varianten}`);
    sf.postMessage(`position fen ${fen}`);
    sf.postMessage(`go movetime ${rechenzeitMs}`);
    await fertig;
    return [...je.entries()].sort((a, b) => a[0] - b[0]).map(([, z]) => z);
  };
}
