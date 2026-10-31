/**
 * Tagesprotokoll (Gamifizierung G2): je Tag, wie oft der Leser was getan hat.
 *
 * Rolle im Gesamtbild: Grundlage für Wochenziel (P4), Wochenaufträge (P6), Rekorde (P5) und
 * Monatsrückblick (P12). Geschrieben wird an den Stellen, die schon jede Handlung kennen
 * (speicher/fortschritt.ts, app/lernstand.ts, Partieende, Lernsammlung, Fehlerdatenbank, Trainer);
 * gelesen über die reinen Funktionen unten. Es zählt die Ortszeit des Geräts
 * (training/kurzplaene.ts, tagesschluessel). Höchstens 400 Tage; ältere fallen beim Schreiben weg.
 * Abhängigkeiten: speicher/gamifizierung.ts, training/kurzplaene.ts.
 */
import { tagesschluessel } from "../training/kurzplaene";
import type { Aktivitaetsart, Gamifizierungsdaten, Tageszaehler } from "./gamifizierung";
import { PROTOKOLL_TAGE } from "./gamifizierung";

type Protokoll = Gamifizierungsdaten["aktivitaet"];
const TAGE_JE_WOCHE = 7;
/** getDay() zählt ab Sonntag; die Woche beginnt am Montag (ISO 8601). */
const MONTAG = 1;

/**
 * Zählt eine Handlung im Tagesprotokoll.
 *
 * Eingaben: Daten mit Protokoll, Art, Anzahl (meist 1), Zeitpunkt. Ausgabe: neue Daten.
 * Beispiel: zaehleAktivitaet(daten, "abbildung", 1, jetzt) beim ersten Ansehen von Abb. 1.26.
 * Sonderfall: Hat das Protokoll mehr als 400 Tage, fallen die ältesten weg.
 */
export function zaehleAktivitaet<T extends Pick<Gamifizierungsdaten, "aktivitaet">>(
  daten: T,
  art: Aktivitaetsart,
  anzahl: number,
  jetzt: Date,
): T {
  if (anzahl <= 0) return daten;
  const tag = tagesschluessel(jetzt);
  const alt: Tageszaehler = daten.aktivitaet[tag] ?? {};
  let aktivitaet: Protokoll = {
    ...daten.aktivitaet,
    [tag]: { ...alt, [art]: (alt[art] ?? 0) + anzahl },
  };
  const tage = Object.keys(aktivitaet);
  if (tage.length > PROTOKOLL_TAGE) {
    const behalten = new Set(tage.sort().slice(-PROTOKOLL_TAGE));
    aktivitaet = Object.fromEntries(Object.entries(aktivitaet).filter(([t]) => behalten.has(t)));
  }
  return { ...daten, aktivitaet };
}

/** Die Arten, die einen Lerntag ausmachen (P4: Inhalt, nicht bloßes Öffnen). */
export const LERNARTEN: readonly Aktivitaetsart[] = [
  "abbildung",
  "uebung",
  "warum",
  "eingeschaetzt",
  "lernziel",
  "trainerAntwort",
  "karte",
  "partie",
  "tagesaufgabe",
];

/**
 * Die Lerntage im Zeitraum (beide Grenzen eingeschlossen, Tagesschlüssel), aufsteigend.
 * Beispiel: lerntage(p, "2026-10-26", "2026-11-01") → ["2026-10-27", "2026-10-30"].
 */
export function lerntage(protokoll: Protokoll, von: string, bis: string): string[] {
  return Object.entries(protokoll)
    .filter(([tag, z]) => tag >= von && tag <= bis && LERNARTEN.some((a) => (z[a] ?? 0) > 0))
    .map(([tag]) => tag)
    .sort();
}

/** Summe einer Art im Zeitraum (Tagesschlüssel, beide Grenzen eingeschlossen). */
export function summeIn(
  protokoll: Protokoll,
  art: Aktivitaetsart,
  von: string,
  bis: string,
): number {
  let summe = 0;
  for (const [tag, z] of Object.entries(protokoll))
    if (tag >= von && tag <= bis) summe += z[art] ?? 0;
  return summe;
}

/**
 * Der Montag der Woche eines Datums (Ortszeit), als Datum um Mitternacht.
 * Beispiel: Samstag, 31.10.2026 → Montag, 26.10.2026; Montag bleibt Montag.
 */
export function wochenbeginn(datum: Date): Date {
  const tag = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
  const abstand = (tag.getDay() - MONTAG + TAGE_JE_WOCHE) % TAGE_JE_WOCHE;
  tag.setDate(tag.getDate() - abstand);
  return tag;
}

/** Die sieben Tagesschlüssel der Woche eines Datums, Montag bis Sonntag. */
export function wochentage(datum: Date): string[] {
  const montag = wochenbeginn(datum);
  return Array.from({ length: TAGE_JE_WOCHE }, (_, i) => {
    const tag = new Date(montag);
    tag.setDate(montag.getDate() + i);
    return tagesschluessel(tag);
  });
}
