/**
 * Die Ausschnitte der Wertungskurve (letzte 10, 25, 50 Partien oder ein Zeitraum bis jetzt) für
 * den Bereich „Mehr“ der Karte „Deine Wertung“ (Wertungsdetail.tsx).
 *
 * Rolle im Gesamtbild: Aus der früheren Karte (fortschritt/Wertungskurve.tsx) übernommen; ein neuer
 * Ausschnitt ist eine Zeile mehr und ein Text „ich.wertung.bereich.<k>“.
 * Abhängigkeiten: spiel/wertung.ts (Typ), i18n (Typ).
 */
import type { Textschluessel } from "../../../i18n/sprache";
import type { Wertungsbereich } from "../../../spiel/wertung";

const TAGE_WOCHE = 7;
const TAGE_4_WOCHEN = 28;
const TAGE_3_MONATE = 91;
const TAGE_HALBJAHR = 182;
const TAGE_JAHR = 365;

/** Ein Ausschnitt: Kennung, Text der Auswahl, Bereich. */
export interface Ausschnitt {
  readonly kennung: string;
  readonly text: Textschluessel;
  readonly bereich: Wertungsbereich;
}

/** Alle Ausschnitte in der Reihenfolge der Auswahl. */
export const AUSSCHNITTE: readonly Ausschnitt[] = [
  { kennung: "p10", text: "ich.wertung.bereich.p10", bereich: { art: "partien", anzahl: 10 } },
  { kennung: "p25", text: "ich.wertung.bereich.p25", bereich: { art: "partien", anzahl: 25 } },
  { kennung: "p50", text: "ich.wertung.bereich.p50", bereich: { art: "partien", anzahl: 50 } },
  { kennung: "w1", text: "ich.wertung.bereich.w1", bereich: { art: "zeit", tage: TAGE_WOCHE } },
  { kennung: "w4", text: "ich.wertung.bereich.w4", bereich: { art: "zeit", tage: TAGE_4_WOCHEN } },
  { kennung: "m3", text: "ich.wertung.bereich.m3", bereich: { art: "zeit", tage: TAGE_3_MONATE } },
  { kennung: "hj", text: "ich.wertung.bereich.hj", bereich: { art: "zeit", tage: TAGE_HALBJAHR } },
  { kennung: "j", text: "ich.wertung.bereich.j", bereich: { art: "zeit", tage: TAGE_JAHR } },
];

/** Beim Öffnen: die letzten 25 Partien. */
export const STANDARD_AUSSCHNITT = "p25";

/** Der Bereich eines Ausschnitts; unbekannte Kennung: der erste (letzte 10 Partien). */
export function ausschnittsbereich(kennung: string): Wertungsbereich {
  const ausschnitt = AUSSCHNITTE.find((a) => a.kennung === kennung) ?? AUSSCHNITTE[0];
  return ausschnitt ? ausschnitt.bereich : { art: "partien", anzahl: 10 };
}
