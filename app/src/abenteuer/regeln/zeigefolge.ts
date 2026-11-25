/**
 * „Soll ich es dir zeigen?“ (Wunsch des Autors, 26.11.2026; Entwurf
 * docs/spiel/auftraege/partiebesprechung_25-11.md, Abschnitt 10): wie viele Halbzüge der besseren
 * Fortsetzung die Besprechung auf dem Brett vorspielt, je Stufe.
 *
 * Rolle im Gesamtbild: reine Regel für anbindung/besprechungsfolge.ts. Stufe 1 zeigt nur den
 * besseren Zug, Stufe 2 den Zug und die Antwort, und wenn danach ein Schlag oder ein Matt die Sache
 * entscheidet, bis zu vier Halbzüge; Stufe 3 etwa sechs. Ein Matt beendet die Folge immer.
 * Abhängigkeiten: regeln/besprechung.ts (Typ der Stufe).
 */
import type { Besprechungsstufe } from "./besprechung";

/** Was die Regel von einem Halbzug der Folge wissen muss. */
export interface Folgehalbzug {
  /** Schlägt der Zug eine Figur oder einen Bauern? */
  readonly schlag: boolean;
  /** Setzt der Zug matt? */
  readonly matt: boolean;
}

/** Grundlänge je Stufe: der bessere Zug, mit Antwort, eine längere Folge. */
const GRUNDLAENGE: Readonly<Record<Besprechungsstufe, number>> = { 0: 0, 1: 1, 2: 2, 3: 6 };
/** Bis hierhin verlängert Stufe 2, wenn ein Schlag oder Matt die Folge auflöst. */
const AUFLOESUNG_BIS = 4;

/**
 * Die Zahl der gezeigten Halbzüge.
 * Eingaben: Stufe, die Halbzüge der gespeicherten Folge (schon auf legale Züge gekürzt).
 * Beispiel: Stufe 2, Folge Sxe5 dxe5 Dxd8+ Kxd8 (Schläge im 3. und 4. Halbzug) → 4; Stufe 2,
 * Folge d4 exd4 c3 → 2; Stufe 3, Matt im 3. Halbzug → 3.
 * Sonderfälle: leere Folge oder Stufe 0 → 0; nie mehr Halbzüge, als die Folge hat.
 */
export function zeigelaenge(stufe: Besprechungsstufe, folge: readonly Folgehalbzug[]): number {
  const grund = Math.min(GRUNDLAENGE[stufe], folge.length);
  if (grund === 0) return 0;
  const matt = folge.findIndex((h) => h.matt);
  if (matt >= 0 && matt < grund) return matt + 1;
  if (stufe !== 2) return grund;
  const bis = Math.min(AUFLOESUNG_BIS, folge.length);
  for (let i = bis - 1; i >= grund; i -= 1) {
    const halbzug = folge[i];
    if (halbzug?.matt || halbzug?.schlag) return i + 1;
  }
  return grund;
}
