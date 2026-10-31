/**
 * Was im Monatsrückblick (Gamifizierung P12) steht: Zahlen aus dem Tagesprotokoll, Wertung am
 * Monatsanfang und -ende, neu verdiente Orden und Abzeichen, neue Rekorde, stärkstes Thema und
 * Thema zum Üben.
 *
 * Rolle im Gesamtbild: Reine Funktionen für die Abschnitte des Rückblicks
 * (ui/komponenten/rueckblick/). Welche Zahlen erscheinen, steht als Liste RUECKBLICKZAHLEN; ein
 * späterer Trainer oder ein Werkzeug trägt dort eine Zeile ein (Wunsch des Autors, 31.10.2026:
 * eintragen statt umbauen) und dazu den Text „rueckblick.zahl.<kennung>“. Die Themen kommen aus dem
 * Antwortprotokoll (G1) und gelten für jeden Trainer mit eigenem Präfix von selbst.
 * Grenzen der Daten: „rekorde“ hält nur die letzte Verbesserung, „themen“ nur die letzten zwölf
 * Tage mit richtiger Antwort; ältere Rückblicke zeigen daher nur, was davon noch im Monat liegt.
 * Abhängigkeiten: speicher/aktivitaet.ts, training/themenstand.ts, training/rueckblick.ts,
 * training/vorschlagsarten.ts (Grenze „unsicher“), spiel/wertung.ts (Typ).
 */
import type { Wertungstempo } from "../spiel/elomodell-daten";
import { verlaufDerZeitklasse, zeitklassenMitWertung, type Wertungspunkt } from "../spiel/wertung";
import { summeIn } from "../speicher/aktivitaet";
import type { Aktivitaetsart, Gamifizierungsdaten, Themenstand } from "../speicher/gamifizierung";
import { imMonat, type Monat } from "./rueckblick";
import { schwaechstesThema, staerkstesThema, type Themenquote } from "./themenstand";
import { UNSICHER_UNTER } from "./vorschlagsarten";
import { tagesschluessel } from "./kurzplaene";

/** Eine Zahl des Rückblicks: Summe der genannten Arten im Monat. */
export interface Rueckblickzahl {
  /** Text „rueckblick.zahl.<kennung>“ (mit Einzahl „…Eins“). */
  readonly kennung: string;
  readonly arten: readonly Aktivitaetsart[];
}

/** Die Zahlen in ihrer Reihenfolge; je neue Zahl eine Zeile. */
export const RUECKBLICKZAHLEN: readonly Rueckblickzahl[] = [
  { kennung: "abbildung", arten: ["abbildung"] },
  { kennung: "uebung", arten: ["uebungGeloest"] },
  { kennung: "trainerAntwort", arten: ["trainerAntwort"] },
  { kennung: "karte", arten: ["karte"] },
  { kennung: "partie", arten: ["partie"] },
  { kennung: "sieg", arten: ["sieg"] },
];

/**
 * Die Zahlen des Monats ohne Nullen, in der Reihenfolge der Liste.
 * Beispiel: 12 Abbildungen und 3 Partien im Oktober → [{ abbildung, 12 }, { partie, 3 }].
 */
export function zahlenImMonat(
  protokoll: Gamifizierungsdaten["aktivitaet"],
  monat: Monat,
  liste: readonly Rueckblickzahl[] = RUECKBLICKZAHLEN,
): { readonly kennung: string; readonly anzahl: number }[] {
  return liste
    .map((zahl) => ({
      kennung: zahl.kennung,
      anzahl: zahl.arten.reduce((s, art) => s + summeIn(protokoll, art, monat.von, monat.bis), 0),
    }))
    .filter((z) => z.anzahl > 0);
}

/** Wertung einer Zeitklasse am Monatsanfang (null: vorher keine) und am Monatsende. */
export interface Monatswertung {
  readonly tempo: Wertungstempo;
  readonly anfang: number | null;
  readonly ende: number;
}

/**
 * Je Zeitklasse mit gewerteter Partie im Monat: Wertung am Anfang (letzter Punkt vor dem Monat)
 * und am Ende (letzter Punkt im Monat). Die Wertung gilt je Zeitklasse (spiel/wertung.ts).
 * Beispiel: Schnellschach 1180 im September, 1205 und 1225 im Oktober →
 * [{ rapid, anfang: 1180, ende: 1225 }]. Sonderfall: ohne Partie im Monat leer.
 */
export function wertungImMonat(punkte: readonly Wertungspunkt[], monat: Monat): Monatswertung[] {
  const tag = (p: Wertungspunkt) => tagesschluessel(new Date(p.zeit));
  return zeitklassenMitWertung(punkte).flatMap((tempo) => {
    const verlauf = verlaufDerZeitklasse(punkte, tempo).sort((a, b) => a.zeit.localeCompare(b.zeit));
    const vorher = verlauf.filter((p) => tag(p) < monat.von).at(-1);
    const letzter = verlauf.filter((p) => imMonat(p.zeit, monat)).at(-1);
    return letzter ? [{ tempo, anfang: vorher?.wertung ?? null, ende: letzter.wertung }] : [];
  });
}

/** Ein im Monat verdientes Stück. */
export interface Verdientes {
  readonly art: string;
  readonly kennung: string;
  readonly datum: string;
}

/**
 * Die im Monat verdienten Stücke einer Art aus „verdient“ (G3), nach Datum.
 * Beispiel: art „abzeichen“, verdient „abzeichen:ersterSieg“ am 12.10. → [{ ersterSieg, … }].
 */
export function verdientImMonat(
  verdient: Gamifizierungsdaten["verdient"],
  art: string,
  monat: Monat,
): Verdientes[] {
  const vorsilbe = `${art}:`;
  return Object.entries(verdient)
    .filter(([schluessel, datum]) => schluessel.startsWith(vorsilbe) && imMonat(datum, monat))
    .map(([schluessel, datum]) => ({ art, kennung: schluessel.slice(vorsilbe.length), datum }))
    .sort((a, b) => a.datum.localeCompare(b.datum));
}

/**
 * Die Rekorde, deren letzte Verbesserung im Monat liegt, in der Reihenfolge der Rekordarten.
 * Beispiel: trainerTag 16 am 30.10. → [{ trainerTag, 16, … }].
 */
export function rekordeImMonat(
  rekorde: Gamifizierungsdaten["rekorde"],
  kennungen: readonly string[],
  monat: Monat,
): { readonly kennung: string; readonly wert: number; readonly datum: string }[] {
  return kennungen.flatMap((kennung) => {
    const rekord = rekorde[kennung];
    return rekord && imMonat(rekord.datum, monat) ? [{ kennung, ...rekord }] : [];
  });
}

/** Die Themen mit mindestens einem Tag richtiger Antworten im Monat. */
function themenDesMonats(
  themen: Readonly<Record<string, Themenstand>>,
  monat: Monat,
): Record<string, Themenstand> {
  return Object.fromEntries(
    Object.entries(themen).filter(([, s]) => s.tage.some((t) => t >= monat.von && t <= monat.bis)),
  );
}

/**
 * Stärkstes Thema und Thema zum Üben unter den Themen des Monats (ab 8 Antworten, G1). Zum Üben
 * steht nur ein anderes Thema unter 70 % richtig, sonst null.
 * Beispiel: Gabel 9 von 10, Fesselung 5 von 9 → stark Gabel, üben Fesselung.
 */
export function themenImMonat(
  themen: Readonly<Record<string, Themenstand>>,
  monat: Monat,
): { readonly stark: Themenquote | null; readonly ueben: Themenquote | null } {
  const imMonat = themenDesMonats(themen, monat);
  const stark = staerkstesThema(imMonat);
  const schwach = schwaechstesThema(imMonat);
  const ueben =
    schwach && schwach.thema !== stark?.thema && schwach.quote < UNSICHER_UNTER ? schwach : null;
  return { stark, ueben };
}
