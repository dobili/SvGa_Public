/**
 * Liste der Landschaften hinter dem Lernpfad (Gestaltung B1, 31.10.2026): je Teil des Buches ein
 * Bild aus landschaftsbilder.tsx.
 *
 * Rolle im Gesamtbild: Landschaft.tsx sucht hier das Bild zum Band einer Etappe. Ein späterer
 * Teil des Buches (oder ein eigener Weg eines Trainers) trägt eine Zeile ein (eintragen statt
 * umbauen, Wunsch des Autors 31.10.2026); ohne Eintrag bleibt das Band schlicht.
 * Abhängigkeiten: landschaftsbilder.tsx.
 */
import type { ComponentType } from "react";
import { Huegel, Morgen, Nacht, Saal, Schachbrett, type Flaeche } from "./landschaftsbilder";

/** Eine Zeile der Liste: Teil des Buches (Kennung wie BUCHTEILE) und sein Bild. */
export interface Landschaft {
  readonly teil: string;
  readonly Bild: ComponentType<Flaeche>;
}

/** Je Teil des Buches ein Bild; ein späterer Teil ergänzt eine Zeile. */
export const LANDSCHAFTEN: readonly Landschaft[] = [
  { teil: "grundlagen", Bild: Schachbrett },
  { teil: "eroeffnung", Bild: Morgen },
  { teil: "mittelspiel", Bild: Huegel },
  { teil: "endspiel", Bild: Nacht },
  { teil: "praxis", Bild: Saal },
];

/** Das Bild eines Teils; null ohne Eintrag. Beispiel: „endspiel“ → Nachthimmel. */
export function landschaftVon(teil: string): Landschaft | null {
  return LANDSCHAFTEN.find((l) => l.teil === teil) ?? null;
}
