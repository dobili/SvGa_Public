/**
 * Lage der Zugmarke am Brett (Zugmarke.tsx), als reine Rechnung ohne React, damit sie testbar ist.
 *
 * Rolle im Gesamtbild: Die Marke einer Zugklasse sitzt oben rechts am Zielfeld des gezeigten
 * Zuges (Wunsch des Autors, 25.10.2026). Das Brett rechnet in Einheiten von 0 bis 8000
 * (geometrie.ts); die Marke liegt als HTML über dem SVG und braucht Prozent der Brettbreite.
 * Abhängigkeiten: brett/geometrie.ts, brett/masse.ts.
 */
import { feldEcke } from "../brett/geometrie";
import { FELD } from "../brett/masse";

/** Breite des Brettes in Einheiten von geometrie.ts (acht Felder). */
const FELDER_JE_REIHE = 8;
const BRETT = FELD * FELDER_JE_REIHE;
const PROZENT = 100;

/**
 * Lage der Marke als Prozentwerte im Brett: rechte obere Ecke des Feldes.
 *
 * Eingaben: Zielfeld wie „f3“, ob das Brett aus Sicht von Schwarz steht.
 * Ausgabe: { links, oben } in Prozent der Brettbreite oder null bei ungültigem Feld.
 * Beispiel: „h8“ normal → { links: 100, oben: 0 }; „a1“ gedreht → { links: 100, oben: 0 }.
 */
export function markenlage(feld: string, gedreht: boolean): { links: number; oben: number } | null {
  const ecke = feldEcke(feld, gedreht);
  if (!ecke) return null;
  return { links: ((ecke.x + FELD) / BRETT) * PROZENT, oben: (ecke.y / BRETT) * PROZENT };
}
