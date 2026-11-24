/**
 * Blickpunkte (Wunsch des Autors, 24.11.2026): Stellen auf einer Karte, an denen es für einen Mann
 * von 1866 etwas Besonderes zu sehen gibt. Kommt der Held zum ersten Mal in ihre Nähe, erscheint
 * Ambrose kurz neben ihm und sagt etwas dazu; der Held antwortet in Gedanken. Kein Kommentar beim
 * Betreten einer Karte („da hat man von der Karte noch nichts gesehen“).
 *
 * Daten: inhalte/abenteuer/ambrose_blickpunkte.json, mehrere je Karte:
 * `{ "karte": "mapleFalls.park", "feld": [25, 13], "radius": 3,
 *    "knoten": "blick_mapleFalls_park_kiosk", "wann": "<Bedingung, optional>" }`.
 * Der Knoten steht in dialoge/de/ambrose-blick.ink. Jeder läuft höchstens einmal; das merkt die
 * Hülle in der Dialogvariablen `<knoten>_gesehen`, sobald sie ihn öffnet.
 *
 * Wann: Der Held steht im Radius (Abstand der Felder, Luftlinie), Ambrose ist da und wach
 * (regeln/abwesenheit.ts), die Welt ist frei (kein Fenster, keine Meldung, kein Eingangsdialog,
 * keine offene Rückmeldung, kein Aktionsknopf), die Ankunftsruhe nach Kartenwechsel oder Fenster
 * ist vorbei, und der letzte Blickpunkt liegt mindestens 30 Sekunden freie Spielzeit zurück.
 *
 * Rolle im Gesamtbild: reine Regeln für oberwelt/useBlickpunkte.ts; die Gesamtsimulation hält
 * dieselben Regeln ein (pipeline/abenteuer/gesamtsimulation-blickpunkte.cjs), die Daten prüft
 * pipeline/abenteuer/blickpunkte.py.
 * Abhängigkeiten: regeln/abwesenheit.ts, regeln/bedingung.ts.
 */
import { ambroseNichtDa, ambroseSprichtJetzt } from "./abwesenheit";
import { erfuellt } from "./bedingung";

/** Dialogdatei der Blickpunkte (ohne Endung) und ihre Daten im Paket. */
export const BLICK_DATEI = "ambrose-blick";
export const BLICKPUNKTE_PFAD = "daten/ambrose_blickpunkte.json";
/** Ruhe nach Kartenwechsel oder Fenster (ms): nicht im Eingang und nicht gleich nach einem Gespräch. */
export const ANKUNFTSRUHE_MS = 1500;
/** Freie Spielzeit zwischen zwei Blickpunkten (ms), damit Ambrose nicht nervt. */
export const BLICKPAUSE_MS = 30_000;

type Variablen = Readonly<Record<string, number | string | boolean>>;

/** Ein Blickpunkt aus ambrose_blickpunkte.json. */
export interface Blickpunkt {
  readonly karte: string;
  /** Feld der Stelle in Kachelkoordinaten [x, y]. */
  readonly feld: readonly [number, number];
  /** Radius in Feldern (Luftlinie von Feld zu Feld). */
  readonly radius: number;
  /** Knoten in ambrose-blick.ink. */
  readonly knoten: string;
  /** Bedingung (regeln/bedingung.ts), meist eine Variable, die wahr sein muss. */
  readonly wann?: string;
}

/** Ist der Wert ein vollständiger Blickpunkt? */
function istBlickpunkt(wert: unknown): wert is Blickpunkt {
  const p = wert as Partial<Blickpunkt> | null;
  if (!p || typeof p.karte !== "string" || typeof p.knoten !== "string") return false;
  const feld: unknown = p.feld;
  const zahlen = Array.isArray(feld) && feld.length === 2 && feld.every(Number.isFinite);
  return (
    zahlen && typeof p.radius === "number" && (p.wann === undefined || typeof p.wann === "string")
  );
}

/**
 * Die Blickpunkte aus dem gelesenen JSON: eine Liste oder `{ "blickpunkte": [...] }`.
 * Unvollständige Einträge fallen weg (die Prüfung blickpunkte.py meldet sie beim Bauen).
 * Beispiel: [{ karte, feld: [25, 13], radius: 3, knoten }] → derselbe Eintrag.
 */
export function liesBlickpunkte(roh: unknown): readonly Blickpunkt[] {
  const liste: unknown = Array.isArray(roh) ? roh : (roh as { blickpunkte?: unknown })?.blickpunkte;
  return Array.isArray(liste) ? liste.filter(istBlickpunkt) : [];
}

/** Dialogvariable „schon gesehen“. Beispiel: „blick_mapleFalls_park_kiosk_gesehen“. */
export function blickvariable(knoten: string): string {
  return `${knoten}_gesehen`;
}

/**
 * Kann Ambrose gerade etwas zu einer Stelle sagen? Er ist da und wach: nach der ersten Lektion,
 * nicht zwischen Tiefpunkt und Versöhnung, nicht nach dem Abschied.
 */
export function ambroseSiehtHin(variablen: Variablen): boolean {
  return !ambroseNichtDa(variablen) && ambroseSprichtJetzt(variablen);
}

/** Abstand zweier Felder im Quadrat (Luftlinie). */
function abstandQuadrat(a: readonly [number, number], x: number, y: number): number {
  return (a[0] - x) ** 2 + (a[1] - y) ** 2;
}

/** Was die Hülle über den Helden weiß. */
export interface Blicklage {
  readonly karte: string;
  /** Feld des Helden. */
  readonly x: number;
  readonly y: number;
  readonly variablen: Variablen;
  /** Knoten, die es in ambrose-blick.ink gibt. */
  readonly knoten: ReadonlySet<string>;
}

/**
 * Der Blickpunkt, der an dieser Stelle auslöst, oder null: auf dieser Karte, im Radius, noch
 * nicht gesehen, Bedingung erfüllt, Knoten vorhanden; bei mehreren der nächste.
 * Beispiel: Held auf (25, 16), Kiosk auf (25, 13) mit Radius 3 → der Kiosk; auf (25, 17) → null.
 * Sonderfall: Ist Ambrose nicht da oder noch nicht wach, löst nichts aus.
 */
export function blickpunktHier(punkte: readonly Blickpunkt[], lage: Blicklage): Blickpunkt | null {
  if (!ambroseSiehtHin(lage.variablen)) return null;
  const nah = punkte
    .filter((p) => p.karte === lage.karte && lage.knoten.has(p.knoten))
    .filter((p) => abstandQuadrat(p.feld, lage.x, lage.y) <= p.radius ** 2)
    .filter((p) => lage.variablen[blickvariable(p.knoten)] !== true)
    .filter((p) => !p.wann || erfuellt(p.wann, lage.variablen));
  const naeher = (a: Blickpunkt, b: Blickpunkt) =>
    abstandQuadrat(a.feld, lage.x, lage.y) - abstandQuadrat(b.feld, lage.x, lage.y);
  return [...nah].sort(naeher)[0] ?? null;
}

/** Zeiten der freien Welt: seit Ankunft oder letztem Fenster, und seit dem letzten Blickpunkt. */
export interface Blickuhr {
  readonly ruheMs: number;
  readonly seitLetztemMs: number;
}

/** Die Uhr zu Beginn: Noch kein Blickpunkt, also keine Pause; die Ankunftsruhe beginnt. */
export const BLICKUHR_START: Blickuhr = { ruheMs: 0, seitLetztemMs: BLICKPAUSE_MS };

/**
 * Ein Takt der Uhr. Ist die Welt nicht frei (Fenster, Meldung, Aktionsknopf), beginnt die Ruhe
 * neu, und die Pause steht: Sie zählt nur freie Spielzeit. Sonst laufen beide weiter.
 * Beispiel: 1500 ms frei nach der Ankunft → die Ruhe ist vorbei (blickBereit).
 */
export function blicktakt(uhr: Blickuhr, deltaMs: number, frei: boolean): Blickuhr {
  if (!frei) return { ...uhr, ruheMs: 0 };
  return { ruheMs: uhr.ruheMs + deltaMs, seitLetztemMs: uhr.seitLetztemMs + deltaMs };
}

/** Die Uhr nach einem Kartenwechsel: Die Ankunftsruhe beginnt neu, die Pause läuft weiter. */
export function nachAnkunft(uhr: Blickuhr): Blickuhr {
  return { ...uhr, ruheMs: 0 };
}

/** Die Uhr, nachdem ein Blickpunkt ausgelöst hat: Die Pause von 30 Sekunden beginnt. */
export function nachBlickpunkt(): Blickuhr {
  return { ruheMs: 0, seitLetztemMs: 0 };
}

/** Darf jetzt ein Blickpunkt auslösen: Ankunftsruhe vorbei und Pause seit dem letzten um? */
export function blickBereit(uhr: Blickuhr): boolean {
  return uhr.ruheMs >= ANKUNFTSRUHE_MS && uhr.seitLetztemMs >= BLICKPAUSE_MS;
}
