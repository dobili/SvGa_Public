/**
 * Meisterschaft je Thema (Gamifizierung P3): Bronze, Silber, Gold aus dem Antwortprotokoll.
 *
 * Rolle im Gesamtbild: Kompetenz sichtbar machen, ehrlich und informierend: belohnt wird Können
 * über mehrere Tage, nicht Fleiß. Die Stufen werden nur aus dem Antwortprotokoll (G1,
 * speicher/themenprotokoll.ts) abgeleitet; nichts Neues wird gespeichert. Damit eine Stufe bleibt,
 * auch wenn die Quote später sinkt oder alte Tage aus dem Protokoll fallen (Entscheidung E4: keine
 * Verlustangst), steht die erste Feier wie bei Orden und Abzeichen in „verdient“ (G3), Schlüssel
 * „meisterschaft:<stufe>:<thema>“, etwa „meisterschaft:silber:taktik:fesselung“.
 * Die Themen kommen aus den Kennungen im Protokoll (taktik:, endspiel:, struktur:, falle), ohne
 * feste Liste: Ein neuer Trainer mit eigenem Präfix bekommt seine Medaillen von selbst.
 * Die Regeln stehen als Liste (STUFENREGELN, je Stufe eine Zeile mit Bedingung, Fortschritt und
 * Erfahrungspunkten). Regel: Kapitel 12 (Training), verteiltes Wiederholen über mehrere Tage.
 * Abhängigkeiten: training/themenstand.ts, speicher/gamifizierung.ts (Typen).
 */
import type { Themenstand } from "../speicher/gamifizierung";
import { themenquote } from "./themenstand";

/** Die Stufen in aufsteigender Reihenfolge. */
export const MEDAILLENSTUFEN = ["bronze", "silber", "gold"] as const;
export type Medaillenstufe = (typeof MEDAILLENSTUFEN)[number];

/** Bronze: so viele richtige Antworten. */
export const BRONZE_RICHTIG = 5;
/** Silber: so viele richtige Antworten … */
export const SILBER_RICHTIG = 15;
/** … und mindestens dieser Anteil richtiger unter den letzten (bis 20) Antworten. */
export const SILBER_QUOTE = 0.7;
/** Gold: richtige Antworten an so vielen verschiedenen Tagen … */
export const GOLD_TAGE = 3;
/** … und zwei davon mindestens so viele Tage auseinander. */
export const GOLD_ABSTAND = 7;
/** Nach so vielen Tagen ohne richtige Antwort steht „Zum Auffrischen“ (E4). */
export const AUFFRISCHEN_NACH_TAGEN = 60;

const MS_JE_TAG = 86_400_000;
const PROZENT = 100;

/** Wie weit ein Thema auf dem Weg zur nächsten Stufe ist („7 von 15“). */
export interface Stufenfortschritt {
  readonly erreicht: number;
  readonly noetig: number;
  /** Was gezählt wird; Textschlüssel „themen.fortschritt.<art>“. */
  readonly art: "richtig" | "quote" | "tage" | "abstand";
}

/** Eine Stufe: Bedingung, Fortschritt dorthin und Erfahrungspunkte. */
export interface Stufenregel {
  readonly stufe: Medaillenstufe;
  readonly erfahrung: number;
  readonly erfuellt: (stand: Themenstand) => boolean;
  readonly fortschritt: (stand: Themenstand) => Stufenfortschritt;
}

/** Fortlaufende Tagesnummer aus „YYYY-MM-DD“; null bei Unsinn. */
function tagnummer(tag: string): number | null {
  const zeit = Date.parse(`${tag}T00:00:00Z`);
  return Number.isNaN(zeit) ? null : Math.round(zeit / MS_JE_TAG);
}

/** Abstand zwischen dem ersten und dem letzten Tag mit richtiger Antwort, in Tagen. */
export function tagesspanne(tage: readonly string[]): number {
  const nummern = tage.map(tagnummer).filter((n): n is number => n !== null);
  return nummern.length === 0 ? 0 : Math.max(...nummern) - Math.min(...nummern);
}

const silberQuoteErreicht = (s: Themenstand) => themenquote(s) >= SILBER_QUOTE;

/**
 * Die Stufenregeln, je Stufe eine Zeile (Vorschlag der Vorrecherche, E4).
 * Beispiel: 15 richtige, letzte 20 mit 16 richtigen → Silber; dazu Tage 1., 4. und 9. → Gold.
 */
export const STUFENREGELN: readonly Stufenregel[] = [
  {
    stufe: "bronze",
    erfahrung: 10,
    erfuellt: (s) => s.richtig >= BRONZE_RICHTIG,
    fortschritt: (s) => ({ erreicht: s.richtig, noetig: BRONZE_RICHTIG, art: "richtig" }),
  },
  {
    stufe: "silber",
    erfahrung: 25,
    erfuellt: (s) => s.richtig >= SILBER_RICHTIG && silberQuoteErreicht(s),
    fortschritt: (s) =>
      s.richtig < SILBER_RICHTIG
        ? { erreicht: s.richtig, noetig: SILBER_RICHTIG, art: "richtig" }
        : {
            erreicht: Math.round(themenquote(s) * PROZENT),
            noetig: SILBER_QUOTE * PROZENT,
            art: "quote",
          },
  },
  {
    stufe: "gold",
    erfahrung: 50,
    erfuellt: (s) => s.tage.length >= GOLD_TAGE && tagesspanne(s.tage) >= GOLD_ABSTAND,
    fortschritt: (s) =>
      s.tage.length < GOLD_TAGE
        ? { erreicht: s.tage.length, noetig: GOLD_TAGE, art: "tage" }
        : { erreicht: tagesspanne(s.tage), noetig: GOLD_ABSTAND, art: "abstand" },
  },
];

/** Schlüssel in „verdient“. Beispiel: („silber“, „taktik:fesselung“) → „meisterschaft:silber:taktik:fesselung“. */
export function verdientSchluessel(stufe: Medaillenstufe, thema: string): string {
  return `meisterschaft:${stufe}:${thema}`;
}

/** Stufe und Thema aus einem Schlüssel in „verdient“; null für andere Schlüssel. */
export function ausVerdientSchluessel(
  schluessel: string,
): { stufe: Medaillenstufe; thema: string } | null {
  const teile = /^meisterschaft:([a-z]+):(.+)$/.exec(schluessel);
  const stufe = MEDAILLENSTUFEN.find((s) => s === teile?.[1]);
  return stufe && teile?.[2] ? { stufe, thema: teile[2] } : null;
}

/** Nummer einer Stufe: −1 ohne, 0 Bronze, 1 Silber, 2 Gold. */
export function stufennummer(stufe: Medaillenstufe | null): number {
  return stufe === null ? -1 : MEDAILLENSTUFEN.indexOf(stufe);
}

/** Die höhere von zwei Stufen. */
export function hoehereStufe(
  a: Medaillenstufe | null,
  b: Medaillenstufe | null,
): Medaillenstufe | null {
  return stufennummer(a) >= stufennummer(b) ? a : b;
}

/**
 * Die Stufe eines Themas: schon gefeierte Stufen bleiben, darüber zählt der heutige Stand. Eine
 * Stufe setzt die vorige voraus (Gold nur nach Silber).
 * Beispiel: Silber gefeiert, Quote heute 50 %, Tage 1., 4., 9. → Gold.
 */
export function stufeAus(stand: Themenstand, gefeiert: Medaillenstufe | null): Medaillenstufe | null {
  let stufe = gefeiert;
  for (const regel of STUFENREGELN) {
    const nummer = stufennummer(regel.stufe);
    if (nummer <= stufennummer(stufe)) continue;
    if (nummer !== stufennummer(stufe) + 1 || !regel.erfuellt(stand)) break;
    stufe = regel.stufe;
  }
  return stufe;
}

/** Die nächste Regel nach einer Stufe; null nach Gold. */
export function naechsteRegel(stufe: Medaillenstufe | null): Stufenregel | null {
  return STUFENREGELN[stufennummer(stufe) + 1] ?? null;
}
