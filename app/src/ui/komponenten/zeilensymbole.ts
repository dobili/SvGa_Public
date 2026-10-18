/**
 * Symbole der Zeilen in den Tabellen der Auswertung (seit 0.2.85, Wunsch des Autors): je
 * Kennzahl, je Phase und je Zugart im Mittelspiel. Die Darstellung steht in Auswertungssymbole.tsx.
 * Abhängigkeiten: lucide-react, spiel/phasen.ts, spiel/taktik.ts.
 */
import {
  BookOpen,
  Compass,
  Flag,
  Gauge,
  Highlighter,
  Star,
  Swords,
  Target,
  TrendingDown,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Phase } from "../../spiel/phasen";
import type { Zugart } from "../../spiel/taktik";

/** Die Kennzahlen der ersten Tabelle in ihrer Reihenfolge, je mit Symbol. */
export const KENNZAHLSYMBOLE: readonly LucideIcon[] = [
  Target,
  Gauge,
  TrendingDown,
  Star,
  Highlighter,
];

/** Symbole der Phasen und der Zugarten im Mittelspiel. */
export const PHASENSYMBOLE: Readonly<Record<Phase | Zugart, LucideIcon>> = {
  eroeffnung: BookOpen,
  mittelspiel: Swords,
  endspiel: Flag,
  taktik: Zap,
  strategie: Compass,
};
