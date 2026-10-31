/**
 * Abzeichen der Wochenaufträge (Gamifizierung P6) als eigene Teilliste von ABZEICHEN.
 *
 * Rolle im Gesamtbild: Wer in einem Kalendermonat acht Wochenaufträge erledigt, bekommt das
 * Abzeichen „Acht Aufträge“. Es bleibt, auch wenn spätere Monate weniger haben (nichts verfällt).
 * Gezählt wird aus dem Feld `verdient` mit training/wochenauftraege.ts (besterMonat).
 * Abhängigkeiten: abzeichen.ts (Typ), training/wochenauftraege.ts, lucide-react (Zeichen).
 */
import { ListChecks } from "lucide-react";
import { besterMonat } from "../../../training/wochenauftraege";
import type { Abzeichenangabe } from "./abzeichen";

/** So viele erledigte Aufträge in einem Monat braucht das Abzeichen. */
export const AUFTRAEGE_IM_MONAT = 8;

/** Die Abzeichen der Wochenaufträge in der Reihenfolge des Gitters. */
export const AUFTRAG_ABZEICHEN: readonly Abzeichenangabe[] = [
  {
    kennung: "auftraege8",
    symbol: ListChecks,
    erfuellt: (g) => besterMonat(g.daten.verdient) >= AUFTRAEGE_IM_MONAT,
  },
];
