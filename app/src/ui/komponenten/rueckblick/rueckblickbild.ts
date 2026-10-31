/**
 * Das Bild des Monatsrückblicks zum Teilen (Gamifizierung P12 mit P9): der Kalender des Monats
 * als kleines SVG, Lerntage als goldene Punkte, freie Tage als leiser Ring.
 *
 * Rolle im Gesamtbild: Der Teilen-Abschnitt setzt dieses SVG wie ein Stück der Ordenkunst in das
 * Bild 1080 × 1350 (teilen/teilbild.ts, teilbildSvg); dazu stehen Monat und Zahl der Lerntage.
 * Ohne Text im SVG, damit keine Schrift fehlen kann. Rein.
 * Abhängigkeiten: training/rueckblick.ts (Kalender).
 */
import { kalenderwochen, type Monat } from "../../../training/rueckblick";

/** Größe eines Kalenderfelds und Radius der Punkte, in Einheiten der Ansicht. */
const FELD = 20;
const PUNKT = 7;
const RING = 4;
const SPALTEN = 7;
/** Höchstens sechs Wochen; das Bild bleibt quadratisch, kürzere Monate stehen mittig. */
const ZEILEN = 6;
const GOLD = "#c9a227";
const LEISE = "#4a5a76";

/**
 * Das SVG des Kalenders.
 * Beispiel: Oktober 2026 mit Lerntagen am 12. und 13. → fünf Reihen, zwei goldene Punkte.
 */
export function kalenderSvg(monat: Monat, lerntage: ReadonlySet<string>): string {
  const wochen = kalenderwochen(monat);
  const oben = ((ZEILEN - wochen.length) * FELD) / 2;
  const punkte = wochen.flatMap((woche, zeile) =>
    woche.flatMap((tag, spalte) => {
      if (tag === null) return [];
      const cx = spalte * FELD + FELD / 2;
      const cy = oben + zeile * FELD + FELD / 2;
      return lerntage.has(tag)
        ? [`<circle cx="${cx}" cy="${cy}" r="${PUNKT}" fill="${GOLD}"/>`]
        : [
            `<circle cx="${cx}" cy="${cy}" r="${RING}" fill="none" stroke="${LEISE}" stroke-width="1.5"/>`,
          ];
    }),
  );
  const breite = SPALTEN * FELD;
  const hoehe = ZEILEN * FELD;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${breite} ${hoehe}">${punkte.join("")}</svg>`;
}

/** Dateiname des Bildes. Beispiel: Oktober 2026 → „schach-von-grund-auf-rueckblick-2026-10.png“. */
export function rueckblickdateiname(monat: Monat): string {
  return `schach-von-grund-auf-rueckblick-${monat.schluessel}.png`;
}
