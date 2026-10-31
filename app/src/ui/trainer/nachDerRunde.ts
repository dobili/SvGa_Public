/**
 * Meldungen am Ende einer Trainerrunde (Gamifizierung G4): neuer Rekord (P5), Fundstück (P10),
 * Meisterschaft (P3), Teilen (P9) und spätere.
 *
 * Rolle im Gesamtbild: Das Rundenende (Rundenrahmen.tsx, „Runde fertig“) zeigt nach dem Ergebnis
 * jede eingetragene Meldung. Sie entscheidet selbst, ob sie etwas zeigt (sonst null). Pakete
 * tragen je eine Zeile ein; ein neuer Trainer, der den Rundenrahmen nutzt, bekommt sie von selbst.
 * Abhängigkeiten: training/trainer.ts (Kennungen).
 */
import type { ComponentType } from "react";
import type { TrainerKennung } from "../../training/trainer";
import { RekordNachRunde } from "../komponenten/rekorde/NeueRekorde";

/** Was eine Meldung über die fertige Runde weiß. */
export interface Rundenergebnis {
  readonly trainer: TrainerKennung;
  readonly richtig: number;
  readonly anzahl: number;
  readonly sekunden: number | null;
}

/** Eine Meldung am Rundenende. */
export interface NachDerRunde {
  readonly kennung: string;
  readonly Meldung: ComponentType<{ readonly ergebnis: Rundenergebnis }>;
}

/** Alle Meldungen; Pakete fügen je eine Zeile an. */
export const NACH_DER_RUNDE: readonly NachDerRunde[] = [
  { kennung: "rekorde", Meldung: RekordNachRunde },
];
