/**
 * Abzeichen der eigenen Ziele (Gamifizierung P13) als eigene Teilliste von ABZEICHEN.
 *
 * Rolle im Gesamtbild: Wer zehn selbst gewählte Ziele erreicht hat (training/ziele.ts), bekommt das
 * Abzeichen „Zehn eigene Ziele erreicht“. Jede Zielart zählt mit, auch spätere (P3, P8).
 * Abhängigkeiten: abzeichen.ts (Typ), lucide-react (Zeichen).
 */
import { Flag } from "lucide-react";
import type { Abzeichenangabe } from "./abzeichen";
import { zielanteil } from "./abzeichenanteil";

/** So viele erreichte Ziele braucht das Abzeichen. */
export const ZIELE_FUER_ABZEICHEN = 10;

/** Die Abzeichen der eigenen Ziele in der Reihenfolge des Gitters. */
export const ZIEL_ABZEICHEN: readonly Abzeichenangabe[] = [
  {
    kennung: "zehnZiele",
    symbol: Flag,
    erfuellt: (g) => g.daten.ziele.erreicht.length >= ZIELE_FUER_ABZEICHEN,
    fortschritt: (g) => zielanteil(g.daten.ziele.erreicht.length, ZIELE_FUER_ABZEICHEN),
  },
];
