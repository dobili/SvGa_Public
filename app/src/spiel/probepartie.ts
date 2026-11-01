/**
 * Probepartie: von einer Stellung aus einer Variante oder der Auswertung einer Partie „von hier“
 * gegen Engine oder Bot weiterspielen, ohne dass die Partie zählt.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): Eine Probepartie kommt nicht in die
 * Partienliste und zählt nicht für Wertung, Siege, Rekorde, Rivalen, Ziele, Tagesprotokoll,
 * Erfahrung, Orden und Abzeichen. Deshalb liegt sie in einem eigenen Platz des Spielstands
 * (speicher/partien.ts, Feld „probe“), nie in „laufend“ oder „partien“, und die Wirkungen nach dem
 * Partieende übergehen sie (speicher/partieprotokoll.ts). Am Ende (oder beim Abbrechen) bietet die
 * App an, die Züge als Abzweig in die Variante zu übernehmen (training/probevariante.ts).
 * Hier stehen die Herkunft (gespeichert in der Einstellung der Partie, Feld „probe“), ihr Lesen
 * und ihr Text im Wert der Ansicht „spielen“. Reine Funktionen.
 * Abhängigkeiten: chessops (Farbe).
 */
import type { Color } from "chessops/types";

/** Woher eine Probepartie kommt: Stelle in einer Variante oder in einer gespielten Partie. */
export type Probeherkunft =
  | { readonly art: "variante"; readonly id: string; readonly pfad: readonly string[] }
  | { readonly art: "partie"; readonly id: string; readonly stelle: number; readonly farbe: Color };

type Roh = Record<string, unknown>;
const istObjekt = (w: unknown): w is Roh =>
  typeof w === "object" && w !== null && !Array.isArray(w);

/** Die Herkunft aus Rohdaten (Speicher); undefined, wenn keine oder unlesbar. */
export function probeherkunftAus(roh: unknown): Probeherkunft | undefined {
  if (!istObjekt(roh) || typeof roh.id !== "string") return undefined;
  if (roh.art === "variante" && Array.isArray(roh.pfad)) {
    const pfad = roh.pfad.filter((z): z is string => typeof z === "string");
    return { art: "variante", id: roh.id, pfad };
  }
  const stelle = roh.stelle;
  if (roh.art !== "partie" || typeof stelle !== "number" || !Number.isInteger(stelle)) {
    return undefined;
  }
  return {
    art: "partie",
    id: roh.id,
    stelle: Math.max(0, stelle),
    farbe: roh.farbe === "black" ? "black" : "white",
  };
}

/** Die Herkunft als Text für die Ansicht „spielen“ (übersteht das Neuladen). */
export function alsProbewert(herkunft: Probeherkunft): string {
  return JSON.stringify(herkunft);
}

/** Die Herkunft aus dem Text der Ansicht; undefined bei fehlendem oder fremdem Text. */
export function probewertAus(wert: string | undefined): Probeherkunft | undefined {
  if (!wert) return undefined;
  try {
    return probeherkunftAus(JSON.parse(wert));
  } catch {
    // Kein Fehler der App: ein alter oder fremder Merker; dann ist es keine Probepartie.
    return undefined;
  }
}
