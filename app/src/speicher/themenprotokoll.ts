/**
 * Antwortprotokoll je Thema (Gamifizierung G1): richtige und falsche Trainerantworten je Motiv,
 * Endspielthema, Bauernstruktur oder Falle.
 *
 * Rolle im Gesamtbild: Bisher legte nur eine falsche Antwort eine Wiederholungskarte an; richtige
 * Antworten je Thema gingen verloren. Ohne sie gibt es keinen „nächsten Schritt“ (P1), keine
 * Meisterschaft (P3) und keinen Monatsrückblick (P12). Geschrieben wird an einer Stelle
 * (ui/trainer/kartenantwort.ts, antworteMitKarte), gelesen in training/themenstand.ts.
 * Abhängigkeiten: speicher/gamifizierung.ts, training/kurzplaene.ts.
 */
import { tagesschluessel } from "../training/kurzplaene";
import {
  LETZTE_ANTWORTEN,
  TAGE_JE_THEMA,
  type Gamifizierungsdaten,
  type Themenstand,
} from "./gamifizierung";

/** Kennung eines Taktikmotivs als Thema. Beispiel: themaTaktik("gabel") → „taktik:gabel“. */
export const themaTaktik = (motiv: string): string => `taktik:${motiv}`;
/** Kennung eines Endspielthemas. Beispiel: „endspiel:opposition“. */
export const themaEndspiel = (thema: string): string => `endspiel:${thema}`;
/** Kennung einer Bauernstruktur. Beispiel: „struktur:isolani“. */
export const themaStruktur = (struktur: string): string => `struktur:${struktur}`;
/** „Falle oder Köder“ ist ein Thema für sich. */
export const THEMA_FALLE = "falle";

const LEER: Themenstand = { richtig: 0, falsch: 0, letzte: "", tage: [], zuletzt: "" };

/**
 * Notiert eine Trainerantwort im Thema.
 *
 * Eingaben: Daten, Themenkennung, ob richtig, Zeitpunkt. Ausgabe: neue Daten.
 * Beispiel: dritte richtige Gabel am 31.10. → richtig 3, letzte „…r“, Tag 2026-10-31 dabei.
 * Sonderfälle: Nur die letzten 20 Antworten und 12 Tage bleiben; ein Tag zählt nur mit einer
 * richtigen Antwort und nur einmal.
 */
export function notiereThemenantwort<T extends Pick<Gamifizierungsdaten, "themen">>(
  daten: T,
  thema: string,
  richtig: boolean,
  jetzt: Date,
): T {
  const alt = daten.themen[thema] ?? LEER;
  const tag = tagesschluessel(jetzt);
  const tage =
    richtig && !alt.tage.includes(tag) ? [...alt.tage, tag].sort().slice(-TAGE_JE_THEMA) : alt.tage;
  const neu: Themenstand = {
    richtig: alt.richtig + (richtig ? 1 : 0),
    falsch: alt.falsch + (richtig ? 0 : 1),
    letzte: (alt.letzte + (richtig ? "r" : "f")).slice(-LETZTE_ANTWORTEN),
    tage,
    zuletzt: jetzt.toISOString(),
  };
  return { ...daten, themen: { ...daten.themen, [thema]: neu } };
}
