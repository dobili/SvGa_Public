/**
 * Wochenziel (Gamifizierung P4): Wie viele Lerntage nimmt sich der Leser je Woche vor, wie viele
 * hat er diese Woche, und in wie vielen Wochen hat er sein Ziel erreicht?
 *
 * Rolle im Gesamtbild: Ersetzt die tägliche Serie als Hauptmotor (Q5-2 des Autors, Entscheidung
 * E5), ohne Druck: Es gibt kein Zurücksetzen und keinen Zähler für verpasste Wochen. Lerntage
 * kommen aus dem Tagesprotokoll (speicher/aktivitaet.ts, LERNARTEN: Inhalt statt bloßes Öffnen).
 * Erreichte Wochen sind die Wochen, deren Lerntage das jetzige Ziel erreichen, und dazu jede
 * Woche, die einmal als erreicht festgehalten wurde (Feld `verdient`, Schlüssel „woche:<Montag>“).
 * Warum festhalten: Wer sein Ziel später erhöht, soll keine erreichte Woche verlieren
 * (nichts verfällt). Die Woche beginnt am Montag (ISO 8601), es zählt die Ortszeit des Geräts.
 * Reine Funktionen; die Oberfläche steht in ui/komponenten/start/Wochenkarte.tsx.
 * Abhängigkeiten: speicher/aktivitaet.ts, speicher/gamifizierung.ts (Typen).
 */
import { lerntage, wochenbeginn, wochentage } from "../speicher/aktivitaet";
import type { Gamifizierungsdaten } from "../speicher/gamifizierung";
import { tagesschluessel } from "./kurzplaene";

/** Die Ziele zur Wahl (Lerntage je Woche, P4). */
export const ZIELWAHL: readonly number[] = [2, 3, 4, 5, 7];
/** Vorgeschlagen, aber nicht vorgegeben (Entscheidung E5). */
export const VORGESCHLAGENES_ZIEL = 3;
/** Vorsilbe der festgehaltenen Wochen im Feld `verdient`. */
export const WOCHE_VERDIENT = "woche:";

const TAGE_JE_WOCHE = 7;
const SONNTAG = 6;
const MS_JE_TAG = 86_400_000;
/** Ab so vielen Wochen hintereinander zeigt die Karte die „Beste Folge“ (eine allein ist keine). */
export const FOLGE_AB = 2;

type Wochendaten = Pick<Gamifizierungsdaten, "aktivitaet" | "verdient" | "wochen">;

/** Ein Tag der Woche auf der Karte. */
export interface Wochentag {
  readonly schluessel: string;
  readonly gelernt: boolean;
  readonly heute: boolean;
}

/** Stand der laufenden Woche. */
export interface Wochenlage {
  readonly tage: readonly Wochentag[];
  readonly gelernt: number;
  readonly ziel: number | null;
  readonly erreicht: boolean;
  /** Montag der Woche als Tagesschlüssel. */
  readonly montag: string;
  /** Sonntag mit genau einem fehlenden Tag: der Hinweis „Noch ein Tag …“. */
  readonly nochEinTag: boolean;
}

/** Datum um Mitternacht (Ortszeit) aus einem Tagesschlüssel „JJJJ-MM-TT“. */
function ausSchluessel(schluessel: string): Date {
  const [jahr = 0, monat = 1, tag = 1] = schluessel.split("-").map(Number);
  return new Date(jahr, monat - 1, tag);
}

/** Montag (Tagesschlüssel) zu einem Tagesschlüssel. */
export function montagVon(schluessel: string): string {
  return tagesschluessel(wochenbeginn(ausSchluessel(schluessel)));
}

/**
 * Die laufende Woche: sieben Tage Mo bis So, Lerntage, Ziel, erreicht.
 * Regel: Ein geändertes Ziel gilt sofort, auch mitten in der Woche (Abnahme P4).
 * Beispiel: Ziel 3, gelernt am Montag und Mittwoch → gelernt 2, erreicht false.
 */
export function wochenlage(daten: Wochendaten, jetzt: Date): Wochenlage {
  const schluessel = wochentage(jetzt);
  const montag = schluessel[0] ?? tagesschluessel(jetzt);
  const sonntag = schluessel[SONNTAG] ?? montag;
  const gelernt = new Set(lerntage(daten.aktivitaet, montag, sonntag));
  const heute = tagesschluessel(jetzt);
  const ziel = daten.wochen.ziel;
  const erreicht = ziel !== null && gelernt.size >= ziel;
  return {
    tage: schluessel.map((s) => ({ schluessel: s, gelernt: gelernt.has(s), heute: s === heute })),
    gelernt: gelernt.size,
    ziel,
    erreicht,
    montag,
    nochEinTag: ziel !== null && heute === sonntag && !gelernt.has(heute) && ziel - gelernt.size === 1,
  };
}

/** Lerntage je Woche (Montag → Zahl) aus dem ganzen Protokoll. */
function lerntageJeWoche(aktivitaet: Wochendaten["aktivitaet"]): Map<string, number> {
  const jeWoche = new Map<string, number>();
  for (const tag of lerntage(aktivitaet, "", "9999-12-31")) {
    const montag = montagVon(tag);
    jeWoche.set(montag, (jeWoche.get(montag) ?? 0) + 1);
  }
  return jeWoche;
}

/** Die als erreicht festgehaltenen Wochen (Montage) aus `verdient`. */
function festgehalteneWochen(verdient: Wochendaten["verdient"]): string[] {
  return Object.keys(verdient)
    .filter((k) => k.startsWith(WOCHE_VERDIENT))
    .map((k) => k.slice(WOCHE_VERDIENT.length));
}

/**
 * Alle Wochen mit erreichtem Ziel (Montage, aufsteigend): nach dem jetzigen Ziel aus dem
 * Protokoll, dazu die festgehaltenen. Ohne Ziel zählen nur die festgehaltenen.
 * Beispiel: Ziel 2, Lerntage Mo und Di der Woche vom 26.10.2026 → ["2026-10-26"].
 */
export function erreichteWochen(daten: Wochendaten): string[] {
  const ziel = daten.wochen.ziel;
  const abgeleitet =
    ziel === null
      ? []
      : [...lerntageJeWoche(daten.aktivitaet)].filter(([, n]) => n >= ziel).map(([m]) => m);
  return [...new Set([...abgeleitet, ...festgehalteneWochen(daten.verdient)])].sort();
}

/**
 * Die erreichten Wochen, die noch nicht festgehalten sind, als Schlüssel für `verdient`.
 * Beispiel: Woche vom 26.10. erreicht, noch nicht gemerkt → ["woche:2026-10-26"].
 */
export function neuErreichteWochen(daten: Wochendaten): string[] {
  return erreichteWochen(daten)
    .map((m) => WOCHE_VERDIENT + m)
    .filter((k) => daten.verdient[k] === undefined);
}

/**
 * Die längste Folge von Wochen hintereinander unter diesen Montagen.
 * Beispiel: 5.10., 12.10., 19.10. und 2.11. → 3. Sonderfall: keine Wochen → 0.
 */
export function besteFolge(montage: readonly string[]): number {
  const nummern = [...new Set(montage)]
    .map((m) => {
      const d = ausSchluessel(m);
      return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / MS_JE_TAG);
    })
    .sort((a, b) => a - b);
  let beste = 0;
  let folge = 0;
  nummern.forEach((n, i) => {
    folge = i > 0 && n - (nummern[i - 1] ?? 0) === TAGE_JE_WOCHE ? folge + 1 : 1;
    beste = Math.max(beste, folge);
  });
  return beste;
}

/** Ein gültiges Ziel aus der Wahl? Beispiel: 3 → true, 6 → false. */
export function istZiel(ziel: number): boolean {
  return ZIELWAHL.includes(ziel);
}

/**
 * Setzt oder entfernt das Wochenziel (null: kein Ziel).
 * Sonderfall: ein Wert außerhalb der Wahl ändert nichts.
 */
export function mitWochenziel<T extends Pick<Gamifizierungsdaten, "wochen">>(
  daten: T,
  ziel: number | null,
): T {
  if (ziel !== null && !istZiel(ziel)) return daten;
  return { ...daten, wochen: { ...daten.wochen, ziel } };
}
