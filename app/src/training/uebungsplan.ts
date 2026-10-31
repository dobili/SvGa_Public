/**
 * Übungsplan mit Kalender-Erinnerung (Gamifizierung P11): Der Leser plant selbst, an welchen
 * Wochentagen und um wie viel Uhr er übt, und trägt den Plan als Termin in seinen Kalender ein.
 *
 * Rolle im Gesamtbild: Zeitgesteuerte Benachrichtigungen ohne Server gibt es in Web-Apps nicht
 * verlässlich (Notification Triggers nie ausgeliefert, Web Push bräuchte einen Server). Ein
 * Wenn-dann-Plan im eigenen Kalender hilft nachweislich beim Dranbleiben und bleibt auf dem Gerät.
 * Diese Datei erzeugt die Kalenderdatei nach RFC 5545 (iCalendar): Zeilen mit CRLF, gefaltet nach
 * 75 Bytes, Zeit „floating“ (Ortszeit ohne Zeitzone, so steht der Termin auf jedem Gerät um
 * dieselbe Uhrzeit), wöchentliche Wiederholung (RRULE) und Erinnerung zur Startzeit (VALARM).
 * Reine Funktionen; Wahl und Weitergabe in ui/komponenten/start/Planwahl.tsx.
 * Abhängigkeiten: speicher/gamifizierung.ts (Typ).
 */
import type { Gamifizierungsdaten, Uebungsplan } from "../speicher/gamifizierung";

/** So lange dauert der Termin im Kalender (Vorrecherche P11). */
export const TERMIN_MINUTEN = 20;
/** Adresse der App in der Beschreibung des Termins. */
export const APP_ADRESSE = "https://schach-von-grund-auf.com/app/";
/** Vorgabe der Uhrzeit beim ersten Planen. */
export const VORGABE_UHRZEIT = "18:00";
/** Dateiname der Kalenderdatei. */
export const ICS_DATEI = "schach-ueben.ics";
export const ICS_TYP = "text/calendar";

/** Kürzel der Wochentage nach RFC 5545, 0 = Montag (wie im Speicher). */
const RFC_TAGE = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const;
const TAGE_JE_WOCHE = 7;
/** getDay() zählt ab Sonntag; im Plan ist 0 der Montag. */
const SONNTAG_JS = 0;
/** Höchstlänge einer Zeile in Bytes ohne CRLF (RFC 5545, Abschnitt 3.1). */
export const ZEILE_BYTES = 75;
const CRLF = "\r\n";
const MS_JE_MINUTE = 60_000;

/** Texte des Termins (aus der Oberfläche, damit die Sprache stimmt). */
export interface Termintexte {
  readonly titel: string;
  readonly beschreibung: string;
  readonly erinnerung: string;
}

/** Wochentag im Plan (0 = Montag) zu einem Datum, Ortszeit. Beispiel: Samstag, 31.10.2026 → 5. */
export function plantag(datum: Date): number {
  const js = datum.getDay();
  return js === SONNTAG_JS ? TAGE_JE_WOCHE - 1 : js - 1;
}

/** Ist heute ein geplanter Übungstag? Beispiel: Plan Mo/Mi/Fr, Mittwoch → true. */
export function heuteGeplant(plan: Uebungsplan | null, jetzt: Date): boolean {
  return plan !== null && plan.tage.includes(plantag(jetzt));
}

/**
 * Der erste Termin ab heute: der nächste geplante Tag um die Uhrzeit (heute zählt mit, auch wenn
 * die Uhrzeit schon vorbei ist; der Kalender zeigt dann die nächsten Wiederholungen).
 * Beispiel: Plan Mo, Mi um 18:00, jetzt Samstag 31.10.2026 → Montag, 2.11.2026, 18:00.
 */
export function ersterTermin(plan: Uebungsplan, jetzt: Date): Date {
  const [stunde = 0, minute = 0] = plan.uhrzeit.split(":").map(Number);
  const heute = plantag(jetzt);
  const abstand = Math.min(...plan.tage.map((t) => (t - heute + TAGE_JE_WOCHE) % TAGE_JE_WOCHE));
  return new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() + abstand, stunde, minute);
}

const zwei = (z: number) => String(z).padStart(2, "0");

/** Ortszeit als „floating“ DATE-TIME: „20261102T180000“. */
export function ortszeit(d: Date): string {
  return `${d.getFullYear()}${zwei(d.getMonth() + 1)}${zwei(d.getDate())}T${zwei(d.getHours())}${zwei(d.getMinutes())}00`;
}

/** Weltzeit für DTSTAMP: „20261031T120000Z“. */
function weltzeit(d: Date): string {
  return `${d.getUTCFullYear()}${zwei(d.getUTCMonth() + 1)}${zwei(d.getUTCDate())}T${zwei(d.getUTCHours())}${zwei(d.getUTCMinutes())}${zwei(d.getUTCSeconds())}Z`;
}

/**
 * Text für ein TEXT-Feld: Rückstrich, Semikolon, Komma und Zeilenumbruch maskiert (RFC 5545, 3.3.11).
 * Beispiel: "nach dem Essen, am Tisch" → "nach dem Essen\, am Tisch".
 */
export function maskiere(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Faltet eine Zeile nach höchstens 75 Bytes (UTF-8); Folgezeilen beginnen mit einem Leerzeichen.
 * Warum Bytes: Umlaute brauchen zwei Bytes, und ein Zeichen darf nicht zerschnitten werden.
 */
export function falte(zeile: string): string {
  const kodierer = new TextEncoder();
  const teile: string[] = [];
  let teil = "";
  let bytes = 0;
  for (const zeichen of zeile) {
    const laenge = kodierer.encode(zeichen).length;
    const grenze = teile.length === 0 ? ZEILE_BYTES : ZEILE_BYTES - 1;
    if (bytes + laenge > grenze) {
      teile.push(teil);
      teil = "";
      bytes = 0;
    }
    teil += zeichen;
    bytes += laenge;
  }
  teile.push(teil);
  return teile.join(CRLF + " ");
}

/** Die Zeilen des Termins (VEVENT mit VALARM), noch ungefaltet. */
function terminzeilen(plan: Uebungsplan, texte: Termintexte, jetzt: Date): string[] {
  const beginn = ersterTermin(plan, jetzt);
  const ende = new Date(beginn.getTime() + TERMIN_MINUTEN * MS_JE_MINUTE);
  const beschreibung = [texte.beschreibung, plan.satz.trim(), APP_ADRESSE].filter(Boolean);
  return [
    "BEGIN:VEVENT",
    `UID:uebungsplan-${weltzeit(jetzt)}@schach-von-grund-auf.com`,
    `DTSTAMP:${weltzeit(jetzt)}`,
    `DTSTART:${ortszeit(beginn)}`,
    `DTEND:${ortszeit(ende)}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${plan.tage.map((t) => RFC_TAGE[t]).join(",")}`,
    `SUMMARY:${maskiere(texte.titel)}`,
    `DESCRIPTION:${maskiere(beschreibung.join("\n"))}`,
    `URL:${APP_ADRESSE}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${maskiere(texte.erinnerung)}`,
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
  ];
}

/**
 * Die Kalenderdatei zum Plan (RFC 5545): ein wöchentlich wiederholter Termin von 20 Minuten mit
 * Erinnerung zur Startzeit, Titel und Beschreibung aus `texte`, dazu der Satz des Lesers.
 * Beispiel: Plan Mo, Mi, Fr um 18:00 → „RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR“, „DTSTART:20261102T180000“.
 * Sonderfall: ein Termin kurz vor Mitternacht endet am nächsten Tag (DTEND rechnet weiter).
 */
export function kalenderdatei(plan: Uebungsplan, texte: Termintexte, jetzt: Date): string {
  const zeilen = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Schach von Grund auf//Uebungsplan//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...terminzeilen(plan, texte, jetzt),
    "END:VCALENDAR",
  ];
  return zeilen.map(falte).join(CRLF) + CRLF;
}

/** Ein gültiger Plan aus der Wahl? Mindestens ein Tag, Uhrzeit „HH:MM“. */
export function istPlan(plan: Uebungsplan): boolean {
  return (
    plan.tage.length > 0 &&
    plan.tage.every((t) => Number.isInteger(t) && t >= 0 && t < TAGE_JE_WOCHE) &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(plan.uhrzeit)
  );
}

/**
 * Setzt den Übungsplan (Tage sortiert, ohne Doppel) oder entfernt ihn (null).
 * Sonderfall: ein ungültiger Plan ändert nichts.
 */
export function mitUebungsplan<T extends Pick<Gamifizierungsdaten, "uebungsplan">>(
  daten: T,
  plan: Uebungsplan | null,
): T {
  if (plan === null) return { ...daten, uebungsplan: null };
  if (!istPlan(plan)) return daten;
  const tage = [...new Set(plan.tage)].sort((a, b) => a - b);
  return { ...daten, uebungsplan: { ...plan, tage, satz: plan.satz.trim() } };
}
