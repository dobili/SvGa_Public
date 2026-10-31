/**
 * Abzeichen des Wochenziels (Gamifizierung P4) als eigene Teilliste von ABZEICHEN.
 *
 * Rolle im Gesamtbild: Wer sein selbst gewähltes Wochenziel in vier bzw. zwölf Wochen erreicht hat,
 * bekommt ein Abzeichen. Die Wochen müssen nicht hintereinander liegen (kein Druck durch
 * Verlustangst, Leitlinien der Vorrecherche). Gezählt wird mit training/wochenziel.ts.
 * Abhängigkeiten: abzeichen.ts (Typ), training/wochenziel.ts, lucide-react (Zeichen).
 */
import { CalendarHeart, CalendarRange } from "lucide-react";
import { erreichteWochen } from "../../../training/wochenziel";
import type { Abzeichenangabe } from "./abzeichen";
import { zielanteil } from "./abzeichenanteil";

/** Erreichte Wochen für die beiden Abzeichen. */
export const WOCHENZIEL_ABZEICHEN = { vier: 4, zwoelf: 12 } as const;

/** Die Abzeichen des Wochenziels in der Reihenfolge des Gitters. */
export const WOCHEN_ABZEICHEN: readonly Abzeichenangabe[] = [
  {
    kennung: "wochenziel4",
    symbol: CalendarRange,
    erfuellt: (g) => erreichteWochen(g.daten).length >= WOCHENZIEL_ABZEICHEN.vier,
    fortschritt: (g) => zielanteil(erreichteWochen(g.daten).length, WOCHENZIEL_ABZEICHEN.vier),
  },
  {
    kennung: "wochenziel12",
    symbol: CalendarHeart,
    erfuellt: (g) => erreichteWochen(g.daten).length >= WOCHENZIEL_ABZEICHEN.zwoelf,
    fortschritt: (g) => zielanteil(erreichteWochen(g.daten).length, WOCHENZIEL_ABZEICHEN.zwoelf),
  },
];
