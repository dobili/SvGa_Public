/**
 * Umwandlung nach Format 7 (Gamifizierung, Welle 0): Das Tagesprotokoll wird aus den Daten
 * nachgetragen, die schon ein Datum tragen.
 *
 * Rolle im Gesamtbild: Ohne Nachtrag begänne das Tagesprotokoll (G2) erst mit dem Update, und
 * Wochenziel, Monatsrückblick und Rekorde starteten leer (Vorrecherche, G2 „Hinweis“). Ein Datum
 * haben schon: das erste Ansehen jeder Abbildung, die richtige Einschätzung, der letzte Versuch
 * jeder Übung und der Beginn jeder gespeicherten Partie (die letzten 50). Mehr lässt sich ehrlich nicht nachtragen
 * (Trainerantworten zählen nur als Summe). Der Nachtrag läuft nur beim Umwandeln von Format 6 und
 * älter, nie über ein schon vorhandenes Protokoll.
 * Abhängigkeiten: speicher/gamifizierung.ts, training/kurzplaene.ts (Tagesschlüssel).
 */
import { tagesschluessel } from "../training/kurzplaene";
import type { Aktivitaetsart, Tageszaehler } from "./gamifizierung";

/** Die Felder, aus denen nachgetragen wird (Ausschnitt der Nutzerdaten). */
export interface Nachtragsquelle {
  readonly fortschritt: {
    readonly gesehen: Readonly<Record<string, string>>;
    readonly eingeschaetzt: Readonly<Record<string, string>>;
    readonly uebungen: Readonly<
      Record<string, { readonly zuletzt: string; readonly geloest: boolean }>
    >;
  };
  readonly spiel: {
    readonly partien: readonly { readonly partie: { readonly begonnen: string } }[];
  };
}

type Protokoll = Record<string, Partial<Record<Aktivitaetsart, number>>>;

function zaehle(protokoll: Protokoll, zeitpunkt: string | null | undefined, art: Aktivitaetsart) {
  if (!zeitpunkt) return;
  const datum = new Date(zeitpunkt);
  if (Number.isNaN(datum.getTime())) return;
  const tag = (protokoll[tagesschluessel(datum)] ??= {});
  tag[art] = (tag[art] ?? 0) + 1;
}

/**
 * Das nachgetragene Tagesprotokoll aus vorhandenen Datumsangaben.
 *
 * Beispiel: Abb. 1.1 und 1.2 am 20.10. gesehen, Übung am 21.10. gelöst →
 * { "2026-10-20": { abbildung: 2 }, "2026-10-21": { uebung: 1, uebungGeloest: 1 } }.
 * Sonderfall: Ungültige Zeitpunkte zählen nicht.
 */
export function nachgetragenesProtokoll(
  daten: Nachtragsquelle,
): Readonly<Record<string, Tageszaehler>> {
  const protokoll: Protokoll = {};
  for (const zeitpunkt of Object.values(daten.fortschritt.gesehen))
    zaehle(protokoll, zeitpunkt, "abbildung");
  for (const zeitpunkt of Object.values(daten.fortschritt.eingeschaetzt))
    zaehle(protokoll, zeitpunkt, "eingeschaetzt");
  for (const uebung of Object.values(daten.fortschritt.uebungen)) {
    zaehle(protokoll, uebung.zuletzt, "uebung");
    if (uebung.geloest) zaehle(protokoll, uebung.zuletzt, "uebungGeloest");
  }
  for (const eintrag of daten.spiel.partien) zaehle(protokoll, eintrag.partie.begonnen, "partie");
  return protokoll;
}
