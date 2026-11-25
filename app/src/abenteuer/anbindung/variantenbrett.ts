/**
 * Was das Brett der Spielhülle in einer Variantenpartie zusätzlich zeigt (Auftrag des Hauptchats,
 * 26.11.2026): markierte Felder (Hügel, Ziellinie), die Felder, die bei einem Schlag im
 * Atomschach explodiert sind, und den Zähler der Schachgebote im Drei-Schach.
 *
 * Warum rein: Die Hülle (anbindung/PartieHuelle.tsx) bleibt schlank, und die Regeln lassen sich
 * ohne Brett prüfen. Die Angaben kommen aus der Variante (spiel/varianten/, `brett`).
 * Abhängigkeiten: chessops (FEN), spiel/varianten/alle.ts, analyse/werkzeug.ts (Markierung).
 */
import { parseFen } from "chessops/fen";
import { makeSquare } from "chessops/util";
import type { Markierung } from "../../analyse/werkzeug";
import { varianteVon } from "../../spiel/varianten/alle";

/** Belegte Felder einer Stellung. */
function belegt(fen: string): Set<string> {
  const setup = parseFen(fen);
  if (setup.isErr) return new Set();
  return new Set([...setup.value.board.occupied].map((f) => makeSquare(f)));
}

/**
 * Felder, die ein Zug im Atomschach leer gesprengt hat: vorher besetzt, danach leer, ohne das
 * Feld, von dem der Zug kam. Beispiel: Sxf7 mit König e8 → f7, e8, … (je nach Nachbarn).
 */
export function explodierteFelder(vorher: string, nachher: string, von: string | null): string[] {
  const danach = belegt(nachher);
  return [...belegt(vorher)].filter((f) => !danach.has(f) && f !== von);
}

/** Markierungen der Variante für das gezeigte Bild; leer ohne Variante. */
export function variantenmarken(
  variante: string | undefined,
  fen: string,
  vorher: string | null,
  von: string | null,
): Markierung[] {
  const brett = varianteVon(variante)?.brett;
  if (!brett) return [];
  const felder: Markierung[] = (brett.felder?.(fen) ?? []).map((f) => ({
    typ: "feld",
    farbe: f.farbe,
    feld: f.feld,
  }));
  if (brett.schlagwirkung !== "explosion" || !vorher) return felder;
  const knall = explodierteFelder(vorher, fen, von).map((feld): Markierung => ({
    typ: "feld",
    farbe: "rot",
    feld,
  }));
  return [...felder, ...knall];
}

/** Zähler über dem Brett (Textschlüssel und Werte), oder null. */
export function variantenzaehler(
  variante: string | undefined,
  fen: string,
): { readonly text: string; readonly werte: Record<string, number> } | null {
  return varianteVon(variante)?.brett?.zaehler?.(fen) ?? null;
}
