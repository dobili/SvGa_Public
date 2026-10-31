/**
 * Monatsrückblick (Gamifizierung P12): Monate, Kalender und wann die Startkarte erscheint.
 *
 * Rolle im Gesamtbild: In den ersten sieben Tagen eines Monats zeigt die Buch-Startseite die Karte
 * „Dein Oktober ist fertig“; sie öffnet den Bildschirm „Dein Oktober“ (app/zusatzansichten.ts,
 * Kennung „rueckblick“, Wert „2026-10“). Ältere Monate stehen im Profil unter „Rückblicke“. Diese
 * Datei rechnet nur mit Monaten und dem Tagesprotokoll (G2); was im Rückblick steht, rechnet
 * training/rueckblickinhalt.ts, und welche Abschnitte es gibt, steht als Liste in
 * ui/komponenten/rueckblick/rueckblickabschnitte.ts. Alles rein, Ortszeit des Geräts.
 * Warum: Eine ruhige Rückschau macht Fortschritt sichtbar, ohne Druck (gamifizierung.md P12).
 * Abhängigkeiten: speicher/aktivitaet.ts (lerntage), training/kurzplaene.ts (tagesschluessel).
 */
import { lerntage } from "../speicher/aktivitaet";
import type { Gamifizierungsdaten } from "../speicher/gamifizierung";
import { tagesschluessel } from "./kurzplaene";

type Protokoll = Gamifizierungsdaten["aktivitaet"];

/** So viele Tage am Monatsanfang steht die Startkarte (P12). */
export const KARTENTAGE = 7;
const TAGE_JE_WOCHE = 7;
const MONATE_JE_JAHR = 12;
/** getDay() zählt ab Sonntag; die Woche im Kalender beginnt am Montag. */
const MONTAG = 1;
const MONATSSCHLUESSEL = /^(\d{4})-(\d{2})$/;
/** Länge eines Monatsschlüssels „JJJJ-MM“ am Anfang eines Tagesschlüssels. */
const MONATSTEIL = "JJJJ-MM".length;

/** Ein Monat mit seinen Grenzen als Tagesschlüssel. */
export interface Monat {
  /** Etwa „2026-10“; Wert der Ansicht „rueckblick“. */
  readonly schluessel: string;
  readonly jahr: number;
  /** 1 = Januar bis 12 = Dezember. */
  readonly nummer: number;
  /** Erster Tag, etwa „2026-10-01“. */
  readonly von: string;
  /** Letzter Tag, etwa „2026-10-31“. */
  readonly bis: string;
}

/** Der Monat zu Jahr und Nummer (1 bis 12); andere Nummern rollen ins Nachbarjahr. */
function monatZu(jahr: number, nummer: number): Monat {
  const erster = new Date(jahr, nummer - 1, 1);
  const letzter = new Date(erster.getFullYear(), erster.getMonth() + 1, 0);
  const von = tagesschluessel(erster);
  return {
    schluessel: von.slice(0, MONATSTEIL),
    jahr: erster.getFullYear(),
    nummer: erster.getMonth() + 1,
    von,
    bis: tagesschluessel(letzter),
  };
}

/** Der Monat eines Datums. Beispiel: 31.10.2026 → „2026-10“, 01.10. bis 31.10. */
export function monatVon(datum: Date): Monat {
  return monatZu(datum.getFullYear(), datum.getMonth() + 1);
}

/**
 * Der Monat zu einem Schlüssel wie „2026-10“; null bei allem anderen (etwa einem alten Link).
 * Beispiel: „2026-02“ → 01.02. bis 28.02.2026; „2026-13“ → null.
 */
export function monatAusSchluessel(schluessel: string | null): Monat | null {
  const treffer = MONATSSCHLUESSEL.exec(schluessel ?? "");
  if (!treffer) return null;
  const nummer = Number(treffer[2]);
  if (nummer < 1 || nummer > MONATE_JE_JAHR) return null;
  return monatZu(Number(treffer[1]), nummer);
}

/** Der Monat davor. Beispiel: „2026-01“ → „2025-12“. */
export function vormonat(monat: Monat): Monat {
  return monatZu(monat.jahr, monat.nummer - 1);
}

/** Der Monat danach. Beispiel: „2026-12“ → „2027-01“. */
export function folgemonat(monat: Monat): Monat {
  return monatZu(monat.jahr, monat.nummer + 1);
}

/** Liegt ein ISO-Zeitpunkt (Ortszeit) in diesem Monat? */
export function imMonat(iso: string, monat: Monat): boolean {
  const zeit = new Date(iso);
  if (Number.isNaN(zeit.getTime())) return false;
  const tag = tagesschluessel(zeit);
  return tag >= monat.von && tag <= monat.bis;
}

/** Die Lerntage eines Monats (G2), aufsteigend. */
export function lerntageIm(protokoll: Protokoll, monat: Monat): string[] {
  return lerntage(protokoll, monat.von, monat.bis);
}

/**
 * Der Kalender eines Monats in Wochen von Montag bis Sonntag; Felder außerhalb des Monats sind
 * null. Beispiel: Oktober 2026 beginnt an einem Donnerstag → erste Woche [null, null, null,
 * „2026-10-01“, …, „2026-10-04“].
 */
export function kalenderwochen(monat: Monat): (string | null)[][] {
  const erster = new Date(monat.jahr, monat.nummer - 1, 1);
  const vorne = (erster.getDay() - MONTAG + TAGE_JE_WOCHE) % TAGE_JE_WOCHE;
  const tage = Number(monat.bis.slice(-2));
  const felder: (string | null)[] = Array.from({ length: vorne }, () => null);
  for (let tag = 1; tag <= tage; tag += 1)
    felder.push(tagesschluessel(new Date(monat.jahr, monat.nummer - 1, tag)));
  while (felder.length % TAGE_JE_WOCHE !== 0) felder.push(null);
  return Array.from({ length: felder.length / TAGE_JE_WOCHE }, (_, w) =>
    felder.slice(w * TAGE_JE_WOCHE, (w + 1) * TAGE_JE_WOCHE),
  );
}

/**
 * Die abgeschlossenen Monate mit mindestens einem Lerntag, der jüngste zuerst (Profilkarte
 * „Rückblicke“). Der laufende Monat fehlt, er ist noch nicht fertig.
 * Beispiel: Lerntage im September und Oktober, heute 03.11. → [„2026-10“, „2026-09“].
 */
export function rueckblickMonate(protokoll: Protokoll, jetzt: Date): Monat[] {
  const bis = vormonat(monatVon(jetzt)).bis;
  const schluessel = new Set(lerntage(protokoll, "", bis).map((tag) => tag.slice(0, MONATSTEIL)));
  return [...schluessel]
    .sort()
    .reverse()
    .map((s) => monatAusSchluessel(s))
    .filter((m): m is Monat => m !== null);
}

/**
 * Erscheint die Startkarte? Ja in den ersten sieben Tagen eines Monats, wenn der Vormonat
 * mindestens einen Lerntag hat und sein Rückblick noch nicht geöffnet wurde.
 * Eingaben: Protokoll, Zeitpunkt, Merker „rueckblickGesehen“ (Monatsschlüssel oder null).
 * Beispiel: 03.11., Lerntage im Oktober, gesehen „2026-09“ → ja; am 08.11. → nein.
 * Sonderfall: Ein Oktober ohne Lerntag bekommt keine Karte (nichts zurückzuschauen, kein Vorwurf).
 */
export function rueckblickkarteSichtbar(
  protokoll: Protokoll,
  jetzt: Date,
  gesehen: string | null,
): boolean {
  if (jetzt.getDate() > KARTENTAGE) return false;
  const monat = vormonat(monatVon(jetzt));
  if (gesehen === monat.schluessel) return false;
  return lerntageIm(protokoll, monat).length > 0;
}
