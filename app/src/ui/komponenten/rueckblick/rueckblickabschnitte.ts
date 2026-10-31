/**
 * Abschnitte des Monatsrückblicks (Gamifizierung P12): eine Liste zum Eintragen.
 *
 * Rolle im Gesamtbild: Der Bildschirm „Dein Oktober“ (ui/bildschirme/Rueckblick.tsx) zeigt alle
 * sichtbaren Abschnitte nach Rang. Spätere Pakete tragen je eine Zeile ein, ohne den Bildschirm zu
 * ändern (Wunsch des Autors, 31.10.2026: eintragen statt umbauen): Meisterschaft P3 (Rang 45,
 * neue Medaillen des Monats), Rivalen P8 (35, Duelle des Monats), eigene Ziele P13 (55, erreichte
 * Ziele), ebenso Abschnitte neuer Trainer oder Werkzeuge. Jeder Abschnitt bekommt die Nutzerdaten
 * und den Monat und rechnet selbst (rein, etwa wie training/rueckblickinhalt.ts).
 * Abhängigkeiten: speicher/format.ts, training/rueckblick.ts, die Abschnitte dieses Ordners.
 */
import type { ComponentType } from "react";
import type { Nutzerdaten } from "../../../speicher/format";
import type { Monat } from "../../../training/rueckblick";
import {
  rekordeImMonat,
  themenImMonat,
  verdientImMonat,
  wertungImMonat,
  zahlenImMonat,
} from "../../../training/rueckblickinhalt";
import { REKORDARTEN } from "../../../training/rekordarten";
import { Kalenderabschnitt } from "./Kalenderabschnitt";
import { Wertungsabschnitt, Zahlenabschnitt } from "./Zahlenabschnitte";
import { Rekordabschnitt, Stueckabschnitt } from "./Stueckabschnitte";
import { STUECKARTEN } from "./rueckblickwerte";
import { Naechsterabschnitt, Themenabschnitt } from "./Themenabschnitte";
import { RueckblickTeilen } from "./RueckblickTeilen";

/** Was jeder Abschnitt bekommt. */
export interface Rueckblickangabe {
  readonly daten: Nutzerdaten;
  readonly monat: Monat;
}

/** Ein Abschnitt des Rückblicks. */
export interface Rueckblickabschnitt {
  readonly kennung: string;
  /** Reihenfolge (kleiner zuerst); Lücken lassen Platz für spätere Pakete. */
  readonly rang: number;
  /** Hat der Abschnitt in diesem Monat etwas zu zeigen? Rein, ohne Nebenwirkung. */
  readonly sichtbar: (angabe: Rueckblickangabe) => boolean;
  readonly Abschnitt: ComponentType<{ readonly angabe: Rueckblickangabe }>;
}

const IMMER = () => true;

/** Alle Abschnitte; Pakete fügen je eine Zeile an. */
export const RUECKBLICKABSCHNITTE: readonly Rueckblickabschnitt[] = [
  { kennung: "kalender", rang: 10, sichtbar: IMMER, Abschnitt: Kalenderabschnitt },
  {
    kennung: "zahlen",
    rang: 20,
    sichtbar: ({ daten, monat }) => zahlenImMonat(daten.aktivitaet, monat).length > 0,
    Abschnitt: Zahlenabschnitt,
  },
  {
    kennung: "wertung",
    rang: 30,
    sichtbar: ({ daten, monat }) => wertungImMonat(daten.spiel.wertung, monat).length > 0,
    Abschnitt: Wertungsabschnitt,
  },
  {
    kennung: "stuecke",
    rang: 40,
    sichtbar: ({ daten, monat }) =>
      STUECKARTEN.some((art) => verdientImMonat(daten.verdient, art, monat).length > 0),
    Abschnitt: Stueckabschnitt,
  },
  {
    kennung: "rekorde",
    rang: 50,
    sichtbar: ({ daten, monat }) =>
      rekordeImMonat(
        daten.rekorde,
        REKORDARTEN.map((a) => a.kennung),
        monat,
      ).length > 0,
    Abschnitt: Rekordabschnitt,
  },
  {
    kennung: "themen",
    rang: 60,
    sichtbar: ({ daten, monat }) => {
      const { stark, ueben } = themenImMonat(daten.themen, monat);
      return stark !== null || ueben !== null;
    },
    Abschnitt: Themenabschnitt,
  },
  { kennung: "naechster", rang: 70, sichtbar: IMMER, Abschnitt: Naechsterabschnitt },
  { kennung: "teilen", rang: 90, sichtbar: IMMER, Abschnitt: RueckblickTeilen },
];

/** Die sichtbaren Abschnitte nach Rang. Beispiel: Monat ohne Partie → ohne „wertung“. */
export function sichtbareRueckblickabschnitte<
  A extends Pick<Rueckblickabschnitt, "rang" | "sichtbar">,
>(abschnitte: readonly A[], angabe: Rueckblickangabe): A[] {
  return abschnitte.filter((a) => a.sichtbar(angabe)).sort((a, b) => a.rang - b.rang);
}
