/**
 * Die drei Kategorien der Engine-Gegner und der passende Gegner beim Wechsel der Kategorie.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): Die Gegnerwahl (GegnerWahl.tsx) zeigt drei
 * Kacheln, eigene Stufe, vorgefertigte Bots und eigene Bots, und darunter nur den Inhalt der
 * gewählten. Damit die Partie immer zur sichtbaren Wahl passt, wählt der Wechsel gleich einen
 * Gegner aus der neuen Kategorie (Spielen.tsx).
 * Abhängigkeiten: engine/gegner.ts, engine/stufen.ts (Typen).
 */
import { gegnerDerStufe, gegnerVon, type EigenerGegner } from "../../engine/gegner";
import { istGruppe } from "../../engine/gruppe";
import type { Stufennummer } from "../../engine/stufen";

/** Die drei Arten von Engine-Gegnern (seit 0.2.80). */
export type Gegnerkategorie = "stufe" | "vorgefertigt" | "eigene";

/**
 * Die Kategorie eines gewählten Gegners.
 * Beispiel: „paula“ → vorgefertigt, ein eigener Gegner → eigene, null → eigene Stufe.
 */
export function kategorieVon(
  bot: string | null,
  eigene: readonly EigenerGegner[],
): Gegnerkategorie {
  if (gegnerVon(bot) || istGruppe(bot)) return "vorgefertigt";
  return eigene.some((g) => g.kennung === bot) ? "eigene" : "stufe";
}

/**
 * Der Gegner nach dem Wechsel der Kategorie: eigene Stufe → kein Bot; vorgefertigt → der
 * bisherige oder der erste der Stufe im Mittelspiel; eigene → der bisherige oder der erste eigene
 * (ohne eigene: keiner, bis einer angelegt und gewählt ist).
 * Beispiel: Regler im Mittelspiel auf 3, Wechsel zu „Vorgefertigte Bots“ → erster Bot der Stufe 3.
 */
export function botFuerKategorie(
  kategorie: Gegnerkategorie,
  bot: string | null,
  eigene: readonly EigenerGegner[],
  stufeImMittelspiel: Stufennummer,
): string | null {
  if (kategorie === "stufe") return null;
  if (kategorie === "vorgefertigt") {
    return gegnerVon(bot) ? bot : (gegnerDerStufe(stufeImMittelspiel)[0]?.kennung ?? null);
  }
  return eigene.some((g) => g.kennung === bot) ? bot : (eigene[0]?.kennung ?? null);
}
