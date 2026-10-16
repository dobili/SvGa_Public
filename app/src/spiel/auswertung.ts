/**
 * Auswertung einer beendeten Partie: Zugzeichen, erste klare Abweichung, Fehler der Engine.
 *
 * Rolle im Gesamtbild: Konzept 8.3 „Auswertung“ und Pflichtenheft 5.3. Die Engine bewertet nach
 * der Partie jede Stellung im Hintergrund (ui/komponenten/useAuswertung.ts); aus den Werten
 * rechnet diese Datei den Verlust jedes Zuges und sein Zeichen. Die absichtlichen Fehler der
 * Engine stehen im Protokoll der Partie (spiel/partie.ts, engine/zugwahl.ts).
 * Abhängigkeiten: spiel/partie.ts, engine/fehlerart.ts.
 */
import type { Fehlerart } from "../engine/fehlerart";
import { stellungen, type Partie } from "./partie";
import { regelstellung } from "./zuege";

/** Zeichen eines Zuges nach dem Verlust (Konzept 8.3). */
export type Zugzeichen = "??" | "?" | "?!";

/** Grenzen aus Konzept 8.3: Verlust ab 3 „??“, ab 1,2 „?“, ab 0,5 „?!“ (Bauerneinheiten). */
const GRENZE_PATZER = 3;
export const GRENZE_FEHLER = 1.2;
const GRENZE_UNGENAU = 0.5;
/** Pflichtenheft 5.3: Grobe Patzer (mehr als zwei Bauern) werden hervorgehoben. */
export const GROBER_PATZER = 2;
/**
 * Werte jenseits dieser Grenze (Matt, klarer Gewinn) zählen wie die Grenze: Wer von „Matt in 3“
 * zu „+8“ wechselt, gewinnt weiter und soll kein „??“ bekommen.
 */
export const WERTGRENZE = 10;
/** Wert einer Mattstellung aus Sicht von Weiß (Matt durch Weiß positiv). */
const MATT = WERTGRENZE;

export interface Zugurteil {
  /** Index des Halbzuges in der Partie. */
  readonly index: number;
  /** Verlust gegenüber der Stellung davor, aus Sicht der ziehenden Seite (nie negativ). */
  readonly verlust: number;
  readonly zeichen: Zugzeichen | null;
}

export interface Enginefehler {
  readonly index: number;
  /** Zugnummer im Buchformat („12.“ oder „12...“). */
  readonly nummer: string;
  readonly fehler: Fehlerart;
}

function begrenzt(wert: number): number {
  return Math.max(-WERTGRENZE, Math.min(WERTGRENZE, wert));
}

/** Zeichen zu einem Verlust; unter 0,5 keins. */
export function zeichenFuer(verlust: number): Zugzeichen | null {
  if (verlust >= GRENZE_PATZER) return "??";
  if (verlust >= GRENZE_FEHLER) return "?";
  return verlust >= GRENZE_UNGENAU ? "?!" : null;
}

/**
 * Wert einer Endstellung ohne Engine: Matt ±Grenze, Patt und Remis 0; sonst null.
 *
 * Warum: In einer Mattstellung gibt die Engine keinen Zug und keinen Wert her.
 */
export function endwert(fen: string): number | null {
  const pos = regelstellung(fen);
  if (!pos || !pos.isEnd()) return null;
  if (pos.isCheckmate()) return pos.turn === "white" ? -MATT : MATT;
  return 0;
}

/**
 * Urteil über jeden Halbzug.
 *
 * Eingaben: Partie, Werte je Stellung aus Sicht von Weiß (Startstellung bis Ende, also ein Wert
 * mehr als Züge). Ausgabe: je Halbzug Verlust und Zeichen; leer, wenn Werte fehlen.
 * Beispiel: 1. e4 (+0,3) e5 (+0,3) 2. Dh5 (−0,2): 2. Dh5 verliert 0,5 → „?!“.
 */
export function zugurteile(partie: Partie, werte: readonly number[]): Zugurteil[] {
  if (werte.length !== partie.zuege.length + 1) return [];
  const alle = stellungen(partie);
  return partie.zuege.map((_, index) => {
    const weiss = alle[index]?.split(" ")[1] !== "b";
    const vorher = begrenzt(werte[index] ?? 0);
    const nachher = begrenzt(werte[index + 1] ?? 0);
    const verlust = Math.max(0, weiss ? vorher - nachher : nachher - vorher);
    return { index, verlust, zeichen: zeichenFuer(verlust) };
  });
}

/**
 * Der erste Zug des Lesers mit „?“ oder „??“ (Konzept 8.3: „Sprung zur ersten klaren
 * Abweichung“); null, wenn es keinen gibt.
 */
export function ersteAbweichung(partie: Partie, urteile: readonly Zugurteil[]): Zugurteil | null {
  return (
    urteile.find(
      (u) => partie.zuege[u.index]?.von === "leser" && (u.zeichen === "?" || u.zeichen === "??"),
    ) ?? null
  );
}

/** Zugnummer eines Halbzuges im Buchformat. */
export function zugnummer(partie: Partie, index: number): string {
  const fen = stellungen(partie)[index] ?? "";
  const [, seite = "w", , , , nummer = "1"] = fen.split(" ");
  return seite === "w" ? `${nummer}.` : `${nummer}...`;
}

/**
 * Die absichtlichen Fehler der Engine aus dem Protokoll (Pflichtenheft 5.2: „In Zug 12 hat die
 * Engine eine Figur hängen lassen (W1). Hast du es gesehen?“).
 */
export function enginefehler(partie: Partie): Enginefehler[] {
  return partie.zuege.flatMap((zug, index) =>
    zug.von === "engine" && zug.fehler
      ? [{ index, nummer: zugnummer(partie, index), fehler: zug.fehler }]
      : [],
  );
}
