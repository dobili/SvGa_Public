/**
 * Was das Brett der Spielhülle in einer Variantenpartie zusätzlich zeigt (Auftrag des Hauptchats,
 * 26.11.2026): markierte Felder (Hügel, Ziellinie), die Felder, die bei einem Schlag im
 * Atomschach explodiert sind, und den Zähler der Schachgebote im Drei-Schach.
 *
 * Warum rein: Die Hülle (anbindung/PartieHuelle.tsx) bleibt schlank, und die Regeln lassen sich
 * ohne Brett prüfen. Die Angaben kommen aus der Variante (spiel/varianten/, `brett`).
 * Dazu für Märchenfiguren (ohne chessops) die Stellung fürs Brett, die Tasche und den letzten Zug.
 * Abhängigkeiten: chessops (FEN), spiel/varianten/alle.ts, spiel/varianten/freieregeln.ts,
 * schach/stellung.ts, analyse/werkzeug.ts (Markierung).
 */
import { Board } from "chessops/board";
import { parseFen } from "chessops/fen";
import { makeSquare } from "chessops/util";
import type { Markierung } from "../../analyse/werkzeug";
import { stellungAusFen, type Ergebnis, type Stellung } from "../../schach/stellung";
import { varianteVon } from "../../spiel/varianten/alle";
import { freieRegeln, freiSanZuUci } from "../../spiel/varianten/freieregeln";

/** Länge eines Feldnamens in UCI („g1“). */
const FELD = 2;

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

/**
 * Die Stellung für das Brett der Hülle. Märchenfiguren (Falke H, Bison E, Drache D) liest chessops
 * nicht; dann zeichnet das Brett allein aus der FEN (ui/brett/geometrie.ts, figurenAusFen), und
 * die Regeln kommen aus der Variante. Ohne solche Variante wie stellungAusFen.
 */
export function variantenstellung(fen: string, variante: string | undefined): Ergebnis<Stellung> {
  const gewoehnlich = stellungAusFen(fen);
  if (gewoehnlich.ok || !freieRegeln(variante)) return gewoehnlich;
  const amZug = fen.split(" ")[1] === "b" ? "black" : "white";
  return { ok: true, wert: { fen: fen.trim(), brett: Board.empty(), amZug, regeln: null } };
}

/** Die Tasche aus der FEN („[HEhe]“), je Farbe die Buchstaben; null ohne Tasche. */
export function tascheAus(
  fen: string,
): { readonly weiss: string; readonly schwarz: string } | null {
  const treffer = /\[([^\]]*)\]/.exec(fen.split(" ")[0] ?? "");
  if (!treffer) return null;
  const inhalt = treffer[1] ?? "";
  return {
    weiss: [...inhalt].filter((z) => z !== z.toLowerCase()).join(""),
    schwarz: [...inhalt].filter((z) => z !== z.toUpperCase()).join(""),
  };
}

/** Start- und Zielfeld des letzten Zugs in einer Variante ohne chessops (für den Schimmer). */
export function freierLetzterZug(
  variante: string | undefined,
  vorher: string,
  san: string,
): { von: string; nach: string } | null {
  const regeln = freieRegeln(variante);
  const uci = regeln ? freiSanZuUci(regeln, vorher, san) : null;
  if (!uci || uci.includes("@")) return null;
  return { von: uci.slice(0, FELD), nach: uci.slice(FELD, 2 * FELD) };
}
