/**
 * Speicherfelder der Gamifizierung (Welle 0, G5): Themenstand, Tagesprotokoll, Datum der Stücke,
 * Rekorde, Duelle, Wochenziel und Aufträge, Fundstücke, Übungsplan, eigene Ziele.
 *
 * Rolle im Gesamtbild: Vorrecherche docs/nebenchat/gamifizierung.md, Abschnitt 3. Alle Felder
 * kommen in einem Zug (Format 7, speicher/format.ts), damit die Arbeitschats der Wellen 1 und 2
 * das Speicherformat nicht anfassen müssen. Entscheidung E1 des Autors (31.10.2026): mit neuer
 * Formatversion; eine ältere App lehnt Format 7 als „neuer“ ab, statt die Felder beim nächsten
 * Speichern stillschweigend zu verlieren. Jedes Feld hat eine leere Vorgabe; der Leser prüft Feld
 * für Feld, Unbekanntes fällt weg.
 * Abhängigkeiten: keine (nur Typen und reine Leser).
 */

/** Ortsdatum „JJJJ-MM-TT“ (training/kurzplaene.ts, tagesschluessel). */
export type Tagesschluessel = string;

/** So viele letzte Antworten je Thema bleiben als „r“/„f“ (Quote der letzten Antworten, P3). */
export const LETZTE_ANTWORTEN = 20;
/** So viele verschiedene Tage mit richtiger Antwort bleiben je Thema (Gold braucht Abstand, P3). */
export const TAGE_JE_THEMA = 12;
/** So viele Tage hält das Tagesprotokoll; ältere fallen beim Schreiben weg. */
export const PROTOKOLL_TAGE = 400;

/**
 * Stand eines Themas (G1), etwa „taktik:gabel“, „endspiel:opposition“, „struktur:isolani“,
 * „falle“ oder „kapitel:7“.
 */
export interface Themenstand {
  readonly richtig: number;
  readonly falsch: number;
  /** Die letzten Antworten, älteste zuerst: „r“ richtig, „f“ falsch (höchstens 20). */
  readonly letzte: string;
  /** Verschiedene Tage mit mindestens einer richtigen Antwort, aufsteigend (höchstens 12). */
  readonly tage: readonly Tagesschluessel[];
  /** Zeitpunkt der letzten Antwort, ISO 8601. */
  readonly zuletzt: string;
}

/** Was im Tagesprotokoll gezählt wird (G2). */
export const AKTIVITAETSARTEN = [
  "abbildung",
  "uebung",
  "uebungGeloest",
  "warum",
  "eingeschaetzt",
  "lernziel",
  "trainerAntwort",
  "trainerRichtig",
  "trainerRunde",
  "karte",
  "partie",
  "sieg",
  "sammlung",
  "fehler",
  "tagesaufgabe",
] as const;
export type Aktivitaetsart = (typeof AKTIVITAETSARTEN)[number];
export type Tageszaehler = Readonly<Partial<Record<Aktivitaetsart, number>>>;

/** Ein Rekord mit Wert und Datum (P5). Kennungen legt training/rekorde.ts fest. */
export interface Rekord {
  readonly wert: number;
  readonly datum: string;
}

/** Bilanz gegen einen Bot aus Sicht des Lesers (P8). */
export interface Duell {
  readonly siege: number;
  readonly remis: number;
  readonly niederlagen: number;
  readonly zuletzt: string;
}

/** Ein Wochenauftrag (P6): Art, Zielzahl, ein Wert dazu (etwa Kapitel oder Trainer). */
export interface Wochenauftrag {
  readonly art: string;
  readonly anzahl: number;
  readonly wert: string | null;
}

/** Wochenziel (P4) und die festgehaltenen Aufträge einer Woche (P6). */
export interface Wochenstand {
  /** Lerntage je Woche, die sich der Leser vornimmt; null: noch keins gewählt. */
  readonly ziel: number | null;
  readonly auftraege: {
    /** Montag der Woche als Tagesschlüssel. */
    readonly woche: Tagesschluessel;
    readonly liste: readonly Wochenauftrag[];
    /** Stellen in der Liste, die schon einmal getauscht wurden. */
    readonly getauscht: readonly number[];
  } | null;
}

/** Selbst geplante Übungszeit (P11): Wochentage 0 = Montag bis 6 = Sonntag. */
export interface Uebungsplan {
  readonly tage: readonly number[];
  /** „HH:MM“, Ortszeit. */
  readonly uhrzeit: string;
  readonly satz: string;
}

export type Zeitart = "blitz" | "rapid" | "classical";

/** Ein eigenes Ziel (P13). */
export type Ziel =
  | { readonly art: "bot"; readonly bot: string; readonly zeitart: Zeitart | "egal" }
  | { readonly art: "ring"; readonly ring: string }
  | { readonly art: "thema"; readonly thema: string; readonly stufe: "gold" }
  | { readonly art: "kapitel"; readonly kapitel: number };

export interface Zielstand {
  readonly angeheftet: readonly Ziel[];
  readonly erreicht: readonly { readonly ziel: Ziel; readonly datum: string }[];
}

/** Alle Felder der Gamifizierung in den Nutzerdaten. */
export interface Gamifizierungsdaten {
  readonly themen: Readonly<Record<string, Themenstand>>;
  readonly aktivitaet: Readonly<Record<Tagesschluessel, Tageszaehler>>;
  /**
   * „orden:<k>“, „abzeichen:<k>“, „rekord:<k>“ → Datum der ersten Feier (G3); dazu „woche:<Montag>“
   * für jede Woche mit erreichtem Wochenziel (P4), damit ein später erhöhtes Ziel keine Woche nimmt.
   */
  readonly verdient: Readonly<Record<string, string>>;
  readonly rekorde: Readonly<Record<string, Rekord>>;
  readonly duelle: Readonly<Record<string, Duell>>;
  readonly rivale: { readonly kennung: string; readonly seit: string } | null;
  readonly wochen: Wochenstand;
  readonly fundstuecke: readonly string[];
  readonly uebungsplan: Uebungsplan | null;
  readonly ziele: Zielstand;
}

/** Vorgabe beim ersten Start und für ältere Formate. */
export const LEERE_GAMIFIZIERUNG: Gamifizierungsdaten = {
  themen: {},
  aktivitaet: {},
  verdient: {},
  rekorde: {},
  duelle: {},
  rivale: null,
  wochen: { ziel: null, auftraege: null },
  fundstuecke: [],
  uebungsplan: null,
  ziele: { angeheftet: [], erreicht: [] },
};

type Roh = Record<string, unknown>;

function istObjekt(wert: unknown): wert is Roh {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

function ganz(wert: unknown): number {
  return typeof wert === "number" && Number.isFinite(wert) && wert >= 0 ? Math.floor(wert) : 0;
}

function text(wert: unknown): string {
  return typeof wert === "string" ? wert : "";
}

function texte(wert: unknown): string[] {
  return Array.isArray(wert) ? wert.filter((t): t is string => typeof t === "string") : [];
}

/** Ein Objekt Eintrag für Eintrag; was der Leser ablehnt (null), fällt weg. */
function eintraege<T>(roh: unknown, lies: (wert: unknown) => T | null): Record<string, T> {
  if (!istObjekt(roh)) return {};
  const ergebnis: Record<string, T> = {};
  for (const [schluessel, wert] of Object.entries(roh)) {
    const gelesen = lies(wert);
    if (gelesen !== null) ergebnis[schluessel] = gelesen;
  }
  return ergebnis;
}

function themenstandAus(roh: unknown): Themenstand | null {
  if (!istObjekt(roh)) return null;
  return {
    richtig: ganz(roh.richtig),
    falsch: ganz(roh.falsch),
    letzte: text(roh.letzte).replace(/[^rf]/g, "").slice(-LETZTE_ANTWORTEN),
    tage: [...new Set(texte(roh.tage))].sort().slice(-TAGE_JE_THEMA),
    zuletzt: text(roh.zuletzt),
  };
}

const ARTEN = new Set<string>(AKTIVITAETSARTEN);

function tageszaehlerAus(roh: unknown): Tageszaehler | null {
  if (!istObjekt(roh)) return null;
  const zaehler = Object.entries(roh).filter(([art, n]) => ARTEN.has(art) && ganz(n) > 0);
  return zaehler.length > 0 ? Object.fromEntries(zaehler.map(([a, n]) => [a, ganz(n)])) : null;
}

function rekordAus(roh: unknown): Rekord | null {
  return istObjekt(roh) && typeof roh.wert === "number" && Number.isFinite(roh.wert)
    ? { wert: roh.wert, datum: text(roh.datum) }
    : null;
}

function duellAus(roh: unknown): Duell | null {
  if (!istObjekt(roh)) return null;
  return {
    siege: ganz(roh.siege),
    remis: ganz(roh.remis),
    niederlagen: ganz(roh.niederlagen),
    zuletzt: text(roh.zuletzt),
  };
}

function rivaleAus(roh: unknown): Gamifizierungsdaten["rivale"] {
  return istObjekt(roh) && typeof roh.kennung === "string"
    ? { kennung: roh.kennung, seit: text(roh.seit) }
    : null;
}

function auftragAus(roh: unknown): Wochenauftrag | null {
  if (!istObjekt(roh) || typeof roh.art !== "string") return null;
  return {
    art: roh.art,
    anzahl: ganz(roh.anzahl),
    wert: typeof roh.wert === "string" ? roh.wert : null,
  };
}

function wochenAus(roh: unknown): Wochenstand {
  if (!istObjekt(roh)) return LEERE_GAMIFIZIERUNG.wochen;
  const ziel = ganz(roh.ziel);
  const a = roh.auftraege;
  const auftraege =
    istObjekt(a) && typeof a.woche === "string" && Array.isArray(a.liste)
      ? {
          woche: a.woche,
          liste: a.liste.flatMap((e) => auftragAus(e) ?? []),
          getauscht: Array.isArray(a.getauscht) ? a.getauscht.filter(Number.isInteger) : [],
        }
      : null;
  return { ziel: ziel > 0 ? ziel : null, auftraege };
}

const WOCHENTAGE = 7;
const UHRZEIT = /^([01]\d|2[0-3]):[0-5]\d$/;

function uebungsplanAus(roh: unknown): Uebungsplan | null {
  if (!istObjekt(roh) || !Array.isArray(roh.tage)) return null;
  const tage = roh.tage.filter((t): t is number => Number.isInteger(t) && t >= 0 && t < WOCHENTAGE);
  const uhrzeit = text(roh.uhrzeit);
  if (tage.length === 0 || !UHRZEIT.test(uhrzeit)) return null;
  return { tage: [...new Set(tage)].sort((x, y) => x - y), uhrzeit, satz: text(roh.satz) };
}

const ZEITARTEN = new Set(["blitz", "rapid", "classical", "egal"]);

/** Ein Ziel aus Rohdaten; unbekannte Arten fallen weg (aus einer späteren Version). */
export function zielAus(roh: unknown): Ziel | null {
  if (!istObjekt(roh)) return null;
  if (roh.art === "bot" && typeof roh.bot === "string" && ZEITARTEN.has(text(roh.zeitart)))
    return { art: "bot", bot: roh.bot, zeitart: roh.zeitart as Zeitart | "egal" };
  if (roh.art === "ring" && typeof roh.ring === "string") return { art: "ring", ring: roh.ring };
  if (roh.art === "thema" && typeof roh.thema === "string")
    return { art: "thema", thema: roh.thema, stufe: "gold" };
  if (roh.art === "kapitel" && Number.isInteger(roh.kapitel))
    return { art: "kapitel", kapitel: ganz(roh.kapitel) };
  return null;
}

function zieleAus(roh: unknown): Zielstand {
  if (!istObjekt(roh)) return LEERE_GAMIFIZIERUNG.ziele;
  const angeheftet = Array.isArray(roh.angeheftet)
    ? roh.angeheftet.flatMap((z) => zielAus(z) ?? [])
    : [];
  const erreicht = Array.isArray(roh.erreicht)
    ? roh.erreicht.flatMap((e) => {
        const ziel = istObjekt(e) ? zielAus(e.ziel) : null;
        return ziel && istObjekt(e) ? [{ ziel, datum: text(e.datum) }] : [];
      })
    : [];
  return { angeheftet, erreicht };
}

/**
 * Liest alle Felder der Gamifizierung aus Rohdaten; was fehlt oder nicht passt, wird leer.
 * Beispiel: Daten aus Format 6 (ohne die Felder) → LEERE_GAMIFIZIERUNG.
 */
export function gamifizierungAus(roh: Roh): Gamifizierungsdaten {
  return {
    themen: eintraege(roh.themen, themenstandAus),
    aktivitaet: eintraege(roh.aktivitaet, tageszaehlerAus),
    verdient: eintraege(roh.verdient, (w) => (typeof w === "string" ? w : null)),
    rekorde: eintraege(roh.rekorde, rekordAus),
    duelle: eintraege(roh.duelle, duellAus),
    rivale: rivaleAus(roh.rivale),
    wochen: wochenAus(roh.wochen),
    fundstuecke: [...new Set(texte(roh.fundstuecke))],
    uebungsplan: uebungsplanAus(roh.uebungsplan),
    ziele: zieleAus(roh.ziele),
  };
}
