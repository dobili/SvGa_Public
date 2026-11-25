/**
 * Partie und Brett für Varianten ohne chessops (Märchenfiguren über ffish: Falke und Bison, Drache;
 * Wunsch von mittel-2, 26.11.2026): Züge, Kurznotation, Stellung danach und Ende allein über die
 * Regelschicht der Variante.
 *
 * Warum: Partie (spiel/partie.ts, spiel/zuege.ts, spiel/ergebnis.ts) und Brett
 * (schach/weiterspielen.ts) rechneten bisher mit einer chessops-Stellung. Die gibt es für Falke,
 * Bison und Drachen nicht (`regeln.chessops` ist null). Diese Funktionen leisten dasselbe nur mit
 * `legaleZuege`, `ziehe` und `ende`; jede Stelle dort fragt zuerst `freieRegeln(variante)`.
 * Züge stehen in UCI wie bei Fairy-Stockfish: „g1f3h“ (Springer, Falke auf g1 eingesetzt),
 * „e7e8q“ (Umwandlung), „P@e4“ (Einsetzen aus der Tasche).
 * Abhängigkeiten: spiel/varianten/variante.ts.
 */
import type { Color } from "chessops/types";
import { varianteVon, type Regelschicht } from "./variante";

/** Länge eines UCI-Zugs ohne Zusatz („g1f3“). */
const ZUG_OHNE_ZUSATZ = 4;
const FELD_LAENGE = 2;

/** Die Regelschicht, wenn die Variante ohne chessops rechnet; sonst null (dann gilt chessops). */
export function freieRegeln(variante: string | undefined): Regelschicht | null {
  const v = varianteVon(variante);
  return v && v.regeln.chessops === null ? v.regeln : null;
}

/** So viele Stellungen merkt sich der Zugspeicher je Regelschicht (älteste fallen heraus). */
const ZUGSPEICHER_STELLUNGEN = 2000;

/** Ein legaler Zug mit UCI und Stellung danach. */
interface Gemerkterzug {
  readonly uci: string;
  readonly fen: string;
}

/**
 * Alle legalen Züge einer Stellung nach Kurznotation, einmal gerechnet und gemerkt. Warum: Die
 * Partie speichert Kurznotation und rechnet ihre Stellungen bei jedem Zeichnen nach (stellungen in
 * spiel/partie.ts); über ffish kostet jede Stellung sonst rund 60 ms (alle Züge ausprobieren).
 */
const ZUGSPEICHER = new WeakMap<Regelschicht, Map<string, ReadonlyMap<string, Gemerkterzug>>>();

function zuegeNachSan(regeln: Regelschicht, fen: string): ReadonlyMap<string, Gemerkterzug> {
  let speicher = ZUGSPEICHER.get(regeln);
  if (!speicher) {
    speicher = new Map();
    ZUGSPEICHER.set(regeln, speicher);
  }
  const gemerkt = speicher.get(fen);
  if (gemerkt) return gemerkt;
  const zuege = new Map<string, Gemerkterzug>();
  for (const uci of regeln.legaleZuege(fen)) {
    const zug = regeln.ziehe(fen, uci);
    if (zug && !zuege.has(zug.san)) zuege.set(zug.san, { uci, fen: zug.fen });
  }
  if (speicher.size >= ZUGSPEICHER_STELLUNGEN) {
    const aeltester = speicher.keys().next().value;
    if (aeltester !== undefined) speicher.delete(aeltester);
  }
  speicher.set(fen, zuege);
  return zuege;
}

/** Kurznotation eines Zugs in UCI; null, wenn er nicht legal ist. */
export function freiUciZuSan(regeln: Regelschicht, fen: string, uci: string): string | null {
  return regeln.ziehe(fen, uci)?.san ?? null;
}

/** UCI zu einem Zug in Kurznotation: der legale Zug, dessen Kurznotation passt. */
export function freiSanZuUci(regeln: Regelschicht, fen: string, san: string): string | null {
  return zuegeNachSan(regeln, fen).get(san)?.uci ?? null;
}

/** Stellung nach einem Zug in Kurznotation; null, wenn er nicht passt. */
export function freiFenNach(regeln: Regelschicht, fen: string, san: string): string | null {
  return zuegeNachSan(regeln, fen).get(san)?.fen ?? null;
}

/** Ende nach den Regeln: Sieger als Farbe von chessops (für Partieende), null ohne Ende. */
export function freiesEnde(
  regeln: Regelschicht,
  fen: string,
): { readonly sieger: Color | null; readonly grund: string } | null {
  const ende = regeln.ende(fen);
  if (!ende) return null;
  const sieger = ende.sieger === "weiss" ? "white" : ende.sieger === "schwarz" ? "black" : null;
  return { sieger, grund: ende.grund };
}

/** Spielbar: Es gibt Züge, und die Partie ist nicht schon zu Ende. */
export function freiSpielbar(regeln: Regelschicht, fen: string): boolean {
  return regeln.legaleZuege(fen).length > 0 && regeln.ende(fen) === null;
}

/** Brettzüge (von Feld zu Feld) ohne Einsetzen aus der Tasche („P@e4“). */
function brettzuege(regeln: Regelschicht, fen: string): string[] {
  return regeln.legaleZuege(fen).filter((uci) => !uci.includes("@"));
}

/** Zielfelder der Figur auf `von`, jedes einmal. Beispiel: Start Falke und Bison, g1 → f3, h3. */
export function freieZiele(regeln: Regelschicht, fen: string, von: string): string[] {
  const ziele = brettzuege(regeln, fen)
    .filter((uci) => uci.startsWith(von))
    .map((uci) => uci.slice(FELD_LAENGE, ZUG_OHNE_ZUSATZ));
  return [...new Set(ziele)];
}

/** Felder mit Figuren, die ziehen können. */
export function freieZiehbareFelder(regeln: Regelschicht, fen: string): string[] {
  return [...new Set(brettzuege(regeln, fen).map((uci) => uci.slice(0, FELD_LAENGE)))];
}

/**
 * Zusätze der legalen Züge von `von` nach `nach`: "" für den Zug ohne Zusatz, sonst das fünfte
 * Zeichen (Umwandlung „q“, Einsetzen beim Zug „h“, „e“, „d“). Beispiel: g1 → f3 im Start von
 * Falke und Bison → ["", "h", "e"].
 */
export function freieZusaetze(regeln: Regelschicht, fen: string, von: string, nach: string) {
  return brettzuege(regeln, fen)
    .filter((uci) => uci.slice(0, ZUG_OHNE_ZUSATZ) === `${von}${nach}`)
    .map((uci) => uci.slice(ZUG_OHNE_ZUSATZ));
}

/** Ergebnis eines Zugversuchs ohne chessops (wie schach/weiterspielen.ts, Zugversuch). */
export type FreierZugversuch =
  | { readonly art: "gespielt"; readonly san: string; readonly fen: string }
  | { readonly art: "auswahl" }
  | { readonly art: "ungueltig" };

/**
 * Zug von Feld zu Feld. Gibt es dort mehrere Züge (Umwandlung, Einsetzen eines Falken oder
 * Bisons) und fehlt `zusatz`, meldet die Funktion „auswahl“; die Hülle fragt dann nach
 * (freieZusaetze). `zusatz` "" heißt: ohne Einsetzen.
 */
export function freierZug(
  regeln: Regelschicht,
  fen: string,
  von: string,
  nach: string,
  zusatz?: string,
): FreierZugversuch {
  const zusaetze = freieZusaetze(regeln, fen, von, nach);
  if (zusaetze.length === 0) return { art: "ungueltig" };
  const gewaehlt = zusatz ?? (zusaetze.length === 1 ? zusaetze[0] : undefined);
  if (gewaehlt === undefined) return { art: "auswahl" };
  if (!zusaetze.includes(gewaehlt)) return { art: "ungueltig" };
  const zug = regeln.ziehe(fen, `${von}${nach}${gewaehlt}`);
  return zug ? { art: "gespielt", san: zug.san, fen: zug.fen } : { art: "ungueltig" };
}
