/**
 * Abzeichen der Rekordtafel (Gamifizierung P5) als eigene Teilliste von ABZEICHEN.
 *
 * Rolle im Gesamtbild: Wettbewerb mit sich selbst statt Bestenliste. Wer drei verschiedene
 * Rekorde aufgestellt hat (training/rekordarten.ts), bekommt das Abzeichen; ein später
 * eingetragener Rekord eines neuen Trainers zählt von selbst mit.
 * Abhängigkeiten: abzeichen.ts (Typ), lucide-react (Zeichen).
 */
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import type { Abzeichenangabe } from "./abzeichen";
import { zielanteil } from "./abzeichenanteil";

/** So viele verschiedene Rekorde braucht das Abzeichen „Drei Rekorde“. */
export const REKORDE_FUER_ABZEICHEN = 3;

/** Die Abzeichen der Rekordtafel in der Reihenfolge des Gitters. */
export const REKORD_ABZEICHEN: readonly Abzeichenangabe[] = [
  {
    kennung: "dreiRekorde",
    symbol: ChartNoAxesColumnIncreasing,
    erfuellt: (g) => Object.keys(g.daten.rekorde).length >= REKORDE_FUER_ABZEICHEN,
    fortschritt: (g) => zielanteil(Object.keys(g.daten.rekorde).length, REKORDE_FUER_ABZEICHEN),
  },
];
