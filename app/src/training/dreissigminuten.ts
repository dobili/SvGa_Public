/**
 * Der 30-Minuten-Plan (Kapitel 12): zwei Tagestypen im Wechsel, je drei Schritte mit fester
 * Zeit, und am Studientag vier Bereiche im Wechsel.
 *
 * Rolle im Gesamtbild: Trainer „dreissigMinuten“ (AP 13 Stufe 3). Diese Datei rechnet nur den
 * Stand der Einheit (welcher Tag, welcher Schritt, seit wann); die Oberfläche
 * (ui/trainer/DreissigMinutenBereich.tsx) zeigt den Schritt, die Uhr und führt zu den
 * vorhandenen Trainern und zum Spiel gegen die Engine. Der Stand ist eine Bequemlichkeit auf dem
 * Gerät (app/merker.ts): Er überlebt den Wechsel zum Spielen und zurück, geht aber nicht in die
 * Datensicherung.
 * Abhängigkeiten: training/trainer.ts (nur Typen).
 * Buchbezug: Kapitel 12, „Der 30-Minuten-Trainingsplan“ (Tag A Partietag: 5 + 20 + 5 Minuten,
 * Tag B Studientag: 5 + 15 + 10 Minuten) und „Der Studientag: vier Bereiche im Wechsel“.
 */
import type { TrainerKennung } from "./trainer";

export type Tagesart = "partietag" | "studientag";

/** Was in einem Schritt geschieht. */
export type Schrittart = "taktik" | "partie" | "kurzanalyse" | "thema" | "analyse";

export interface Planschritt {
  readonly art: Schrittart;
  readonly minuten: number;
}

/**
 * Die Schritte beider Tage.
 * Regel: Kapitel 12, Tabelle „Der tägliche 30-Minuten-Trainingsplan“.
 */
export const PLAN: Readonly<Record<Tagesart, readonly Planschritt[]>> = {
  partietag: [
    { art: "taktik", minuten: 5 },
    { art: "partie", minuten: 20 },
    { art: "kurzanalyse", minuten: 5 },
  ],
  studientag: [
    { art: "taktik", minuten: 5 },
    { art: "thema", minuten: 15 },
    { art: "analyse", minuten: 10 },
  ],
};

export const TAGESARTEN: readonly Tagesart[] = ["partietag", "studientag"];

/** Die vier Bereiche des Studientags, in der Reihenfolge des Buches. */
export type Studienbereich = "taktik" | "endspiel" | "strategie" | "eroeffnung";
export const BEREICHE: readonly Studienbereich[] = [
  "taktik",
  "endspiel",
  "strategie",
  "eroeffnung",
];

/**
 * Die Trainer der App zu jedem Bereich.
 * Regel: Kapitel 12, Tabelle „Die vier Trainingsbereiche des Studientags“ (Werkzeug im Buch:
 * Taktik Kapitel 7 und 10, Endspiel Kapitel 8 und 9, Strategie Kapitel 5, 6 und 11, Eröffnung
 * Kapitel 2 und 3).
 */
export const TRAINER_JE_BEREICH: Readonly<Record<Studienbereich, readonly TrainerKennung[]>> = {
  taktik: ["taktik", "studien"],
  endspiel: ["endspiel"],
  strategie: ["zugErraten", "planbilanz", "struktur"],
  eroeffnung: ["repertoire", "abweichung", "zielbilanz", "faktorenbilanz"],
};

/** Eine laufende Einheit. Zeiten in Millisekunden seit 1970 (Date.now). */
export interface Einheit {
  readonly tag: Tagesart;
  /** Stelle des aktuellen Schritts in PLAN[tag]. */
  readonly schritt: number;
  readonly beginn: number;
  readonly schrittBeginn: number;
  /** Am Studientag der gewählte Bereich, sonst null. */
  readonly bereich: Studienbereich | null;
}

/** Der ganze Stand: laufende Einheit und was zuletzt geübt wurde (für den Wechsel). */
export interface Planstand {
  readonly einheit: Einheit | null;
  readonly letzterTag: Tagesart | null;
  readonly letzterBereich: Studienbereich | null;
}

export const LEERER_PLANSTAND: Planstand = {
  einheit: null,
  letzterTag: null,
  letzterBereich: null,
};

const MS_JE_MINUTE = 60_000;
/** Nach so vielen Stunden gilt eine liegengebliebene Einheit als verfallen. */
const VERFALL_STUNDEN = 3;
const MINUTEN_JE_STUNDE = 60;

/**
 * Der Tagestyp, der heute dran ist: der andere als beim letzten Mal, zu Beginn der Partietag.
 * Regel: Kapitel 12, „Dabei wechseln sich zwei Tagestypen ab“.
 */
export function naechsterTag(letzter: Tagesart | null): Tagesart {
  return letzter === "partietag" ? "studientag" : "partietag";
}

/**
 * Der Bereich, der am Studientag dran ist: der nächste nach dem zuletzt geübten.
 * Regel: Kapitel 12, „wechselst dabei zwischen vier Bereichen, damit keiner zu kurz kommt“.
 * Beispiel: zuletzt „endspiel“ → „strategie“; zuletzt „eroeffnung“ → wieder „taktik“.
 */
export function naechsterBereich(letzter: Studienbereich | null): Studienbereich {
  const stelle = letzter === null ? -1 : BEREICHE.indexOf(letzter);
  return BEREICHE[(stelle + 1) % BEREICHE.length] ?? "taktik";
}

/** Beginnt eine Einheit; am Studientag mit dem Bereich, der dran ist. */
export function starte(stand: Planstand, tag: Tagesart, jetzt: number): Planstand {
  const bereich = tag === "studientag" ? naechsterBereich(stand.letzterBereich) : null;
  return { ...stand, einheit: { tag, schritt: 0, beginn: jetzt, schrittBeginn: jetzt, bereich } };
}

/** Wählt am Studientag einen anderen Bereich. */
export function mitBereich(stand: Planstand, bereich: Studienbereich): Planstand {
  return stand.einheit ? { ...stand, einheit: { ...stand.einheit, bereich } } : stand;
}

/**
 * Schließt den aktuellen Schritt ab. Nach dem letzten ist die Einheit vorbei: Tag und Bereich
 * werden für den Wechsel gemerkt.
 * Ausgabe: der neue Stand und ob die Einheit damit fertig ist.
 */
export function weiter(stand: Planstand, jetzt: number): { stand: Planstand; fertig: boolean } {
  const e = stand.einheit;
  if (!e) return { stand, fertig: false };
  if (e.schritt + 1 < PLAN[e.tag].length) {
    return {
      stand: { ...stand, einheit: { ...e, schritt: e.schritt + 1, schrittBeginn: jetzt } },
      fertig: false,
    };
  }
  const letzterBereich = e.bereich ?? stand.letzterBereich;
  return { stand: { einheit: null, letzterTag: e.tag, letzterBereich }, fertig: true };
}

/** Bricht die Einheit ab, ohne den Wechsel weiterzuschalten. */
export function abbrechen(stand: Planstand): Planstand {
  return { ...stand, einheit: null };
}

/** Der aktuelle Schritt der Einheit. */
export function aktuellerSchritt(e: Einheit): Planschritt {
  return PLAN[e.tag][e.schritt] ?? { art: "taktik", minuten: 0 };
}

/**
 * Restzeit des aktuellen Schritts in Millisekunden; negativ, wenn die Zeit überschritten ist.
 * Beispiel: Partie (20 Minuten) seit 21 Minuten → −60 000.
 */
export function restMs(e: Einheit, jetzt: number): number {
  return aktuellerSchritt(e).minuten * MS_JE_MINUTE - (jetzt - e.schrittBeginn);
}

/** Ist die Einheit so alt, dass sie nicht mehr weiterläuft (am Vortag liegengeblieben)? */
export function verfallen(e: Einheit, jetzt: number): boolean {
  return jetzt - e.beginn > VERFALL_STUNDEN * MINUTEN_JE_STUNDE * MS_JE_MINUTE;
}

const istTag = (w: unknown): w is Tagesart => TAGESARTEN.includes(w as Tagesart);
const istBereich = (w: unknown): w is Studienbereich => BEREICHE.includes(w as Studienbereich);
const istZahl = (w: unknown): w is number => typeof w === "number" && Number.isFinite(w);

function einheitAus(w: unknown): Einheit | null {
  if (typeof w !== "object" || w === null) return null;
  const e = w as Record<string, unknown>;
  if (!istTag(e.tag) || !istZahl(e.schritt) || !istZahl(e.beginn) || !istZahl(e.schrittBeginn))
    return null;
  if (e.schritt < 0 || e.schritt >= PLAN[e.tag].length) return null;
  const bereich = istBereich(e.bereich) ? e.bereich : null;
  return {
    tag: e.tag,
    schritt: e.schritt,
    beginn: e.beginn,
    schrittBeginn: e.schrittBeginn,
    bereich,
  };
}

/**
 * Liest den gemerkten Stand. Unlesbares (anderes Format, von Hand verändert) ergibt den leeren
 * Stand; eine verfallene Einheit fällt weg, Tag und Bereich für den Wechsel bleiben.
 */
export function planstandAus(text: string | null, jetzt: number): Planstand {
  if (text === null) return LEERER_PLANSTAND;
  let roh: unknown;
  try {
    roh = JSON.parse(text);
  } catch (fehler) {
    console.warn("30-Minuten-Plan: gemerkter Stand nicht lesbar:", fehler);
    return LEERER_PLANSTAND;
  }
  if (typeof roh !== "object" || roh === null) return LEERER_PLANSTAND;
  const r = roh as Record<string, unknown>;
  const einheit = einheitAus(r.einheit);
  return {
    einheit: einheit && !verfallen(einheit, jetzt) ? einheit : null,
    letzterTag: istTag(r.letzterTag) ? r.letzterTag : null,
    letzterBereich: istBereich(r.letzterBereich) ? r.letzterBereich : null,
  };
}
