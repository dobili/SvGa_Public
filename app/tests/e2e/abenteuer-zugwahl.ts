/**
 * Ein Spieler für die Oberflächentests des Schach-Abenteuers: liest die laufende Partie aus dem
 * Speicher der App, lässt Stockfish (unter Node, neben dem Test) alle Züge bewerten und wählt den
 * Zug, der zu einem gewünschten Ausgang führt; der Test tippt ihn dann auf dem Brett.
 *
 * Warum: Die kurzen Partieformen (Regelwerk R13a, R13b) enden nach einer festen Zahl eigener Züge
 * mit einer Bewertung. Ob Partieende, Ausklang und Wegsperre zusammenpassen, zeigt nur eine
 * wirklich gespielte Partie (Auftrag vom 18.11.2026); die Testknöpfe „Gewinnen“ und „Verlieren“
 * überspringen genau diese Wertung.
 * Abhängigkeiten: stockfish (wie engine/engineDienst.test.ts), chessops, Playwright.
 * Beispiel: Zielwert −5 → der Spieler nimmt in jeder Stellung den Zug, nach dem er etwa eine
 * Figur weniger hat; so verliert er die Wertung.
 */
import { createRequire } from "node:module";
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { makeSquare } from "chessops/util";
import type { Page } from "@playwright/test";

/** Zielwerte für „spiele den besten Zug“ und „spiele den schlechtesten Zug“. */
export const BESTER_ZUG = Number.POSITIVE_INFINITY;
export const SCHLECHTESTER_ZUG = Number.NEGATIVE_INFINITY;

/** Die laufende oder zuletzt beendete Partie des Abenteuers, so weit der Test sie braucht. */
export interface Partiestand {
  readonly id: string;
  readonly startFen: string;
  readonly zuege: readonly string[];
  /** Art des Endes („ziel“, „zielRemis“, „matt“ …) oder null, solange die Partie läuft. */
  readonly ende: string | null;
  /** Sieger des Endes, wenn es einen gibt. */
  readonly sieger: string | null;
}

/** Ein bewerteter Zug: UCI-Schreibweise und Wert in Bauern aus Sicht dessen, der zieht. */
interface Kandidat {
  readonly uci: string;
  readonly wert: number;
}

interface NodeEngine {
  processCommand(befehl: string): void;
  terminate(): void;
}
type EngineFabrik = (art: string, beiZeile: (zeile: string) => void) => NodeEngine;

/** Suchtiefe des Spielers: reicht, um Figuren nicht einzustellen, und bleibt schnell. */
const TIEFE = 10;
/** Mehr Züge hat keine Stellung dieser Tests; Stockfish kürzt auf die Zahl der legalen Züge. */
const ALLE_VARIANTEN = 120;
/** Ein Matt zählt als so viele Bauern (das Vorzeichen sagt, für wen). */
const MATTWERT = 100;
/** Hundertstelbauern je Bauer. */
const HUNDERTSTEL = 100;

/** Liest die neueste Partie des Abenteuers aus den Nutzerdaten; läuft im Browser. */
export function liesPartieImBrowser(): Promise<Partiestand | null> {
  return new Promise((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const lesen = db.transaction("nutzerdaten", "readonly").objectStore("nutzerdaten");
      const r = lesen.get("aktuell");
      r.onsuccess = () => {
        type P = {
          id: string;
          ende: { art: string; sieger?: string } | null;
          zuege: { san: string }[];
          einstellung: { startFen: string; abenteuer?: { kennung: string } };
        };
        const d = r.result as { spiel?: { laufend?: P; partien?: { partie: P }[] } } | undefined;
        const alle = [
          ...(d?.spiel?.laufend ? [d.spiel.laufend] : []),
          ...(d?.spiel?.partien ?? []).map((e) => e.partie),
        ];
        const p = alle.find((e) => e.einstellung.abenteuer);
        db.close();
        fertig(
          p
            ? {
                id: p.id,
                startFen: p.einstellung.startFen,
                zuege: p.zuege.map((z) => z.san),
                ende: p.ende?.art ?? null,
                sieger: p.ende?.sieger ?? null,
              }
            : null,
        );
      };
    };
  });
}

/**
 * Die Stellung nach den Zügen der Partie als FEN. Wirft, wenn ein Zug nicht zur Stellung passt
 * (dann stimmt der Speicher nicht mit dem Brett überein).
 * Beispiel: Startstellung von Abb. 8.2 und ["Qxd7", "Nxd7"] → FEN mit Weiß am Zug.
 */
export function stellungNach(stand: Pick<Partiestand, "startFen" | "zuege">): string {
  const stellung = Chess.fromSetup(parseFen(stand.startFen).unwrap()).unwrap();
  for (const san of stand.zuege) {
    const zug = parseSan(stellung, san);
    if (!zug) throw new Error(`Zug ${san} passt nicht zur Stellung ${makeFen(stellung.toSetup())}`);
    stellung.play(zug);
  }
  return makeFen(stellung.toSetup());
}

/**
 * Irgendein regelgerechter Zug der Stellung in UCI-Schreibweise, ohne Engine und damit sofort
 * (kein Bauernzug, damit keine Umwandlung dazwischenkommt); null, wenn es keinen gibt.
 * Wozu: Der Test tippt ihn, während die Hülle die Stellung wertet; das Brett muss dann zu sein.
 */
export function schnellerZug(fen: string): string | null {
  const stellung = Chess.fromSetup(parseFen(fen).unwrap()).unwrap();
  for (const [von, ziele] of stellung.allDests()) {
    const ziel = ziele.first();
    if (ziel !== undefined && stellung.board.get(von)?.role !== "pawn") {
      return makeSquare(von) + makeSquare(ziel);
    }
  }
  return null;
}

/** Wert einer Zeile der Engine in Bauern („score cp 35“ → 0,35; „score mate -2“ → −100). */
function wertAus(zeile: string): number | null {
  const treffer = /score (cp|mate) (-?\d+)/.exec(zeile);
  if (!treffer) return null;
  const zahl = Number(treffer[2]);
  return treffer[1] === "cp" ? zahl / HUNDERTSTEL : Math.sign(zahl) * MATTWERT;
}

/**
 * Stockfish unter Node als Spieler. `beende` gibt die Engine frei; ohne das endet der Testprozess
 * nicht. Je Prozess lässt sich die Engine nur einmal laden (ein zweites Laden findet ihre
 * WASM-Datei nicht mehr): Tests holen den Spieler deshalb über `spielerDesProzesses`.
 * Sonderfall: Umwandlungen in etwas anderes als die Dame lässt der Spieler aus.
 * Beispiel: `await spieler.waehle(fen, BESTER_ZUG)` → „d2d4“.
 */
export class Zugwaehler {
  private readonly engine: NodeEngine;
  private beiZeile: (zeile: string) => void = () => undefined;

  constructor() {
    const lade = createRequire(import.meta.url)("stockfish") as EngineFabrik;
    this.engine = lade("lite-single", (zeile) => this.beiZeile(zeile));
    this.engine.processCommand("uci");
    this.engine.processCommand(`setoption name MultiPV value ${ALLE_VARIANTEN}`);
  }

  /** Alle Züge der Stellung mit Wert, der beste zuerst. */
  bewerteAlle(fen: string): Promise<Kandidat[]> {
    return new Promise((fertig) => {
      const funde = new Map<string, number>();
      this.beiZeile = (zeile) => {
        const zug = / pv (\S+)/.exec(zeile)?.[1];
        const wert = wertAus(zeile);
        if (zeile.startsWith("info") && zug && wert !== null) funde.set(zug, wert);
        if (!zeile.startsWith("bestmove")) return;
        const liste = [...funde].map(([uci, w]) => ({ uci, wert: w }));
        fertig(liste.sort((a, b) => b.wert - a.wert));
      };
      this.engine.processCommand(`position fen ${fen}`);
      this.engine.processCommand(`go depth ${TIEFE}`);
    });
  }

  /**
   * Der Zug, dessen Wert dem Zielwert am nächsten liegt. BESTER_ZUG nimmt den besten,
   * SCHLECHTESTER_ZUG den schlechtesten (läuft oft ins Matt); +0,1 hält beim Format „Vorteil“
   * die Stellung knapp besser als gleich; −5 verliert deutlich, ohne sich gleich mattsetzen zu
   * lassen (ein Matt zählt ±100).
   */
  async waehle(fen: string, zielwert: number): Promise<string> {
    const alle = (await this.bewerteAlle(fen)).filter((k) => !/[rbn]$/.test(k.uci));
    const erster = alle[0];
    if (!erster) throw new Error(`Kein Zug in der Stellung ${fen}`);
    if (zielwert === BESTER_ZUG) return erster.uci;
    if (zielwert === SCHLECHTESTER_ZUG) return (alle.at(-1) ?? erster).uci;
    const abstand = (k: Kandidat) => Math.abs(k.wert - zielwert);
    return alle.reduce((a, b) => (abstand(b) < abstand(a) ? b : a)).uci;
  }

  /** Wert der Stellung in Bauern aus Sicht dessen, der am Zug ist (bester Zug, Tiefe TIEFE). */
  async bewerte(fen: string): Promise<number> {
    const bester = (await this.bewerteAlle(fen))[0];
    if (!bester) throw new Error(`Kein Zug in der Stellung ${fen}`);
    return bester.wert;
  }

  /** Gibt die Engine frei. */
  beende(): void {
    this.engine.terminate();
  }
}

let gemeinsamer: Zugwaehler | null = null;

/** Der eine Spieler dieses Testprozesses; beim ersten Aufruf startet die Engine. */
export function spielerDesProzesses(): Zugwaehler {
  gemeinsamer ??= new Zugwaehler();
  return gemeinsamer;
}

/** Gibt den Spieler des Prozesses frei (in `test.afterAll`), falls einer gestartet wurde. */
export function beendeSpielerDesProzesses(): void {
  gemeinsamer?.beende();
  gemeinsamer = null;
}

/**
 * Tippt einen Zug in UCI-Schreibweise auf dem Brett der Spielhülle: Startfeld, Zielfeld, bei
 * einer Umwandlung die Dame. Mit `frist` (ms) gibt der Tipp auf, wenn ein Feld nicht antwortet.
 * Beispiel: „e2e4“ tippt e2 und dann e4.
 */
export async function tippeZug(seite: Page, uci: string, frist?: number): Promise<void> {
  const brett = seite.locator(".abenteuer-partie-brett");
  const feld = (name: string) => brett.getByRole("button", { name: new RegExp(`^${name}(,|$)`) });
  await feld(uci.slice(0, 2)).click({ timeout: frist });
  await feld(uci.slice(2, 4)).click({ timeout: frist });
  if (uci.length > 4) {
    await seite.getByRole("dialog").getByRole("button", { name: /Dame/ }).click();
  }
}
