/**
 * Regeln für Varianten mit Märchenfiguren über ffish, die Regelbibliothek von Fairy-Stockfish
 * (npm ffish-es6, GPL 3, WebAssembly, ein Kern, synchron nach dem Laden).
 *
 * Warum: chessops kennt Falke, Bison und Drache nicht. ffish rechnet mit derselben variants.ini wie
 * die Engine (spiel/varianten/maerchenfiguren.ts), so sind Regeln und Engine gleich
 * (Schnittstelle von mittel-3, docs/spiel/auftraege/varianten_schnittstelle_26-11.md). Die Fälle in
 * abenteuer/regeln/maerchenfaelle.json (aus pyffish) prüfen das.
 *
 * Laden: ffish ist knapp 1 MB groß und lädt erst, wenn eine solche Partie beginnt
 * (`ladeMaerchenregeln`). Vorher werfen die Regeln einen Fehler, denn eine Partie ohne Regeln darf
 * nicht still mit leeren Zuglisten weiterlaufen.
 * Abhängigkeiten: ffish-es6 (dynamisch geladen), spiel/varianten/variante.ts (Typen).
 */
import type { FairyStockfish, ModuleOptions } from "ffish-es6";
import type { Regelschicht, Variantenende } from "./variante";

let geladen: FairyStockfish | null = null;
let laden: Promise<FairyStockfish> | null = null;
/** Abschnitte der variants.ini, die nach dem Laden (und bei jedem neuen Laden) gelten. */
const ABSCHNITTE = new Set<string>();

/** Wie ffish die WebAssembly bekommt: im Browser über die Adresse, in Tests direkt als Bytes. */
export interface Maerchenladeweg {
  readonly wasmBinary?: Uint8Array;
}

/** Meldet einen Abschnitt der variants.ini an (eigene Varianten wie „drache“); gilt auch später. */
export function meldeMaerchenabschnittAn(ini: string): void {
  ABSCHNITTE.add(ini);
  geladen?.loadVariantConfig(ini);
}

/** Lädt das Modul im Browser: Die WebAssembly-Datei liegt neben dem Code (Vite, Adresse „?url“). */
async function ladeModul(weg: Maerchenladeweg): Promise<FairyStockfish> {
  const { default: Module } = await import("ffish-es6");
  const optionen: ModuleOptions & Maerchenladeweg = { ...weg };
  if (!weg.wasmBinary) {
    const { default: adresse } = await import("ffish-es6/ffish.wasm?url");
    optionen.locateFile = () => adresse;
  }
  const modul = await Module(optionen);
  for (const ini of ABSCHNITTE) modul.loadVariantConfig(ini);
  return modul;
}

/**
 * Lädt ffish einmal und behält es. Die Spielhülle ruft das vor einer Partie mit Märchenfiguren.
 * Ein Fehler beim Laden kommt beim Aufrufer an (keine Partie ohne Regeln); ein späterer Aufruf
 * versucht es neu.
 */
export async function ladeMaerchenregeln(weg: Maerchenladeweg = {}): Promise<void> {
  if (geladen) return;
  laden ??= ladeModul(weg);
  try {
    geladen = await laden;
  } catch (fehler: unknown) {
    laden = null;
    throw fehler;
  }
}

/** Ob die Regeln schon geladen sind (die Hülle zeigt sonst „Brett wird vorbereitet“). */
export function maerchenregelnGeladen(): boolean {
  return geladen !== null;
}

function modul(): FairyStockfish {
  if (!geladen) throw new Error("Märchenregeln nicht geladen: erst ladeMaerchenregeln()");
  return geladen;
}

/** Ein Brett der Variante in der Stellung, für einen Aufruf; danach wird es freigegeben. */
function mitBrett<T>(
  variante: string,
  fen: string,
  arbeit: (brett: InstanceType<FairyStockfish["Board"]>) => T,
): T {
  const brett = new (modul().Board)(variante, fen);
  try {
    return arbeit(brett);
  } finally {
    brett.delete();
  }
}

/** Ergebnis von ffish („1-0“, „0-1“, „1/2-1/2“) als Sieger. */
function siegerAus(ergebnis: string): Variantenende["sieger"] {
  if (ergebnis === "1-0") return "weiss";
  if (ergebnis === "0-1") return "schwarz";
  return null;
}

/**
 * Die Regelschicht einer Variante mit Märchenfiguren. `uciVariante` ist der Name bei Fairy-Stockfish
 * („seirawan“, „drache“). Züge in UCI wie Fairy-Stockfish: Einsetzen beim Zug der Grundreihe als
 * fünftes Zeichen („g1f3h“ setzt einen Falken auf g1), bei der Rochade ebenso („e1g1e“ setzt den
 * Bison auf e1). Welche Schreibweise gilt, sagt die Zugliste von ffish; die Hülle fragt nichts nach.
 * Beispiel: legaleZuege(Start von Falke und Bison) → 28 Züge, darunter „g1f3h“ und „g1f3e“.
 */
export function maerchenRegeln(uciVariante: string): Regelschicht {
  return {
    chessops: null,
    stellung: () => null,
    legaleZuege: (fen) =>
      mitBrett(uciVariante, fen, (brett) => brett.legalMoves().split(" ").filter(Boolean)),
    ziehe: (fen, uci) =>
      mitBrett(uciVariante, fen, (brett) => {
        if (!brett.legalMoves().split(" ").includes(uci)) return null;
        const san = brett.sanMove(uci);
        brett.push(uci);
        return { fen: brett.fen(), san };
      }),
    ende: (fen) =>
      mitBrett(uciVariante, fen, (brett) => {
        if (!brett.isGameOver()) return null;
        const sieger = siegerAus(brett.result());
        const matt = brett.isCheck() && brett.numberLegalMoves() === 0;
        const patt = !brett.isCheck() && brett.numberLegalMoves() === 0;
        return {
          sieger,
          grund: matt ? "variante.matt" : patt ? "variante.patt" : "variante.remis",
        };
      }),
  };
}
