/**
 * Stand der Haken für die Engine-Folgen (Folgenwahl.tsx), eigene Datei, damit die
 * Komponentendatei nur Komponenten ausgibt.
 *
 * Rolle im Gesamtbild: Rückmeldungen des Autors (1.11.2026): beide Haken vorab an.
 * Abhängigkeiten: React.
 */
import { useState } from "react";

/** Was die Haken ergeben. */
export interface Folgenstand {
  readonly engine: boolean;
  readonly gegner: boolean;
}

/** Der Stand der Haken, beide vorab an. */
export function useFolgenwahl() {
  return useState<Folgenstand>({ engine: true, gegner: true });
}
