/**
 * Die Reiter der Einstellungen unter der Brettvorschau: Bedienung, Anzeige, Hilfe.
 *
 * Rolle im Gesamtbild: Entwurf K2 (Wahl des Autors, 31.10.2026). Ein neuer Reiter ist ein Eintrag
 * in `REITER` (eintragen statt umbauen); EinstellungenKarte.tsx zeigt sie in dieser Reihenfolge.
 * Abhängigkeiten: schalterzeilen, anzeigezeilen, i18n (Schlüsseltyp).
 */
import type { ComponentType } from "react";
import type { Textschluessel } from "../../../i18n/sprache";
import { AnzeigeZeilen } from "./anzeigezeilen";
import { BedienungZeilen, HilfeZeilen } from "./schalterzeilen";

/** Ein Reiter der Einstellungen. */
export interface Einstellungsreiter {
  readonly wert: string;
  readonly text: Textschluessel;
  /** Ziel-Kennung für die Tour der Einstellungen (tour/touren.ts). */
  readonly tour: string;
  readonly Inhalt: ComponentType;
}

/** Die Reiter in der Reihenfolge des Entwurfs; der erste ist beim Öffnen gewählt. */
export const REITER: readonly Einstellungsreiter[] = [
  {
    wert: "bedienung",
    text: "einstellungen.reiter.bedienung",
    tour: "einstellungen-reiter-bedienung",
    Inhalt: BedienungZeilen,
  },
  {
    wert: "anzeige",
    text: "einstellungen.reiter.anzeige",
    tour: "einstellungen-reiter-anzeige",
    Inhalt: AnzeigeZeilen,
  },
  {
    wert: "hilfe",
    text: "einstellungen.reiter.hilfe",
    tour: "einstellungen-reiter-hilfe",
    Inhalt: HilfeZeilen,
  },
];
