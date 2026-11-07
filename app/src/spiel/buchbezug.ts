/**
 * Die zwanzig Kategorien „Fehler mit Buchbezug“: zehn Warum-Kategorien (W1 bis W10, warum der
 * gespielte Zug schlecht war) und zehn Finde-Kategorien (F1 bis F10, mit welcher Idee des Buches
 * der bessere Zug zu finden war), je mit Anzeige, Fundstelle, Kapiteln und dem Trainer, den
 * „Üben“ öffnet.
 *
 * Rolle im Gesamtbild: Konzept docs/KONZEPT_FEHLER_BUCHBEZUG.md (vom Autor am 7.11.2026
 * freigegeben), Abschnitt 3. Eine Tabelle für alle Stellen, die eine Kategorie nennen: die
 * Warum-Zeile der Zeitleiste (spiel/warumkategorie.ts, ui/komponenten/auswertung/Warumzeile.tsx),
 * die Findezeile (analyse/findekategorien.ts) und später die Empfehlung auf der Startseite und der
 * Vorschlag der Fehlerdatenbank. So sagen Karte, Startseite und Datenbank dasselbe.
 * Die Reihenfolge der Prüfung (Konzept 4.1, Genaues vor Faustregel) steht in WARUM_REIHENFOLGE und
 * FINDE_REIHENFOLGE; die Erkennung selbst steht nicht hier.
 * Abhängigkeiten: training/trainer.ts (Trainerkennung), i18n (nur Typ der Schlüssel).
 */
import type { Textschluessel } from "../i18n/sprache";
import type { TrainerKennung } from "../training/trainer";

/** Warum-Kategorien: Der gespielte Zug war schlecht, weil … (Konzept 3.1). */
export type Warumkennung = "W1" | "W2" | "W3" | "W4" | "W5" | "W6" | "W7" | "W8" | "W9" | "W10";
/** Finde-Kategorien: Den besseren Zug hättest du finden können, weil … (Konzept 3.2). */
export type Findekennung = "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10";
export type Buchkennung = Warumkennung | Findekennung;

/** Zuverlässigkeit der Erkennung (Konzept 3); für die Schwellen der Startseite (Konzept 4.3). */
export type Zuverlaessigkeit = "hoch" | "mittel";

/** Eine Kategorie mit allem, was Karte, Startseite und Fehlerdatenbank brauchen. */
export interface Buchbezug {
  readonly kennung: Buchkennung;
  /** Kurzname auf der Karte, etwa „Drohung stehen gelassen“. */
  readonly anzeige: Textschluessel;
  /** Fundstelle im Buch für die Karte, etwa „Kapitel 1, Schach-Röntgen-Regel“. */
  readonly quelle: Textschluessel;
  /** Kapitel des Buchbezugs; das erste ist das Hauptkapitel. */
  readonly kapitel: readonly number[];
  /** Der Trainer, den „Üben“ öffnet. */
  readonly trainer: TrainerKennung;
  /** Thema, mit dem der Trainer öffnet (ui/trainer/trainerthema.ts); null ohne Vorwahl. */
  readonly thema: string | null;
  readonly zuverlaessigkeit: Zuverlaessigkeit;
}

/** Kapitel des Buches, auf die die Kategorien verweisen. */
const GRUNDLAGEN = 1;
const EROEFFNUNGEN = 2;
const GAMBITS = 3;
const VERTEIDIGUNG = 4;
const BAUERN = 5;
const PLAN = 6;
const TAKTIK = 7;
const ENDSPIEL = 8;
const ROUTINE = 12;

/** Die Warum-Kategorien (Konzept 3.1, Spalten „Buchbezug“ und „Trainer · Kapitel“). */
const WARUM: Readonly<Record<Warumkennung, Omit<Buchbezug, "kennung">>> = {
  W1: {
    anzeige: "buchbezug.W1.anzeige",
    quelle: "buchbezug.W1.quelle",
    kapitel: [VERTEIDIGUNG],
    trainer: "falle",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  W2: {
    anzeige: "buchbezug.W2.anzeige",
    quelle: "buchbezug.W2.quelle",
    kapitel: [GRUNDLAGEN, ROUTINE],
    trainer: "roentgen",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  W3: {
    anzeige: "buchbezug.W3.anzeige",
    quelle: "buchbezug.W3.quelle",
    kapitel: [GRUNDLAGEN, PLAN],
    trainer: "roentgen",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  W4: {
    anzeige: "buchbezug.W4.anzeige",
    quelle: "buchbezug.W4.quelle",
    kapitel: [VERTEIDIGUNG, ROUTINE],
    trainer: "roentgen",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  W5: {
    anzeige: "buchbezug.W5.anzeige",
    quelle: "buchbezug.W5.quelle",
    kapitel: [GRUNDLAGEN, TAKTIK],
    trainer: "zaehlen",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  W6: {
    anzeige: "buchbezug.W6.anzeige",
    quelle: "buchbezug.W6.quelle",
    kapitel: [VERTEIDIGUNG, GRUNDLAGEN],
    trainer: "falle",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  W7: {
    anzeige: "buchbezug.W7.anzeige",
    quelle: "buchbezug.W7.quelle",
    kapitel: [TAKTIK],
    trainer: "taktik",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  W8: {
    anzeige: "buchbezug.W8.anzeige",
    quelle: "buchbezug.W8.quelle",
    kapitel: [GRUNDLAGEN, EROEFFNUNGEN],
    trainer: "zielbilanz",
    thema: null,
    zuverlaessigkeit: "mittel",
  },
  W9: {
    anzeige: "buchbezug.W9.anzeige",
    quelle: "buchbezug.W9.quelle",
    kapitel: [BAUERN],
    trainer: "struktur",
    thema: null,
    zuverlaessigkeit: "mittel",
  },
  W10: {
    anzeige: "buchbezug.W10.anzeige",
    quelle: "buchbezug.W10.quelle",
    kapitel: [ENDSPIEL],
    trainer: "endspiel",
    thema: null,
    zuverlaessigkeit: "mittel",
  },
};

/** Die Finde-Kategorien (Konzept 3.2); die Erkennung baut analyse/findekategorien.ts. */
const FINDEN: Readonly<Record<Findekennung, Omit<Buchbezug, "kennung">>> = {
  F1: {
    anzeige: "buchbezug.F1.anzeige",
    quelle: "buchbezug.F1.quelle",
    kapitel: [TAKTIK, GRUNDLAGEN],
    trainer: "taktik",
    thema: "taktik:mattbilder",
    zuverlaessigkeit: "hoch",
  },
  F2: {
    anzeige: "buchbezug.F2.anzeige",
    quelle: "buchbezug.F2.quelle",
    kapitel: [TAKTIK],
    trainer: "taktik",
    thema: "taktik:rettung",
    zuverlaessigkeit: "mittel",
  },
  F3: {
    anzeige: "buchbezug.F3.anzeige",
    quelle: "buchbezug.F3.quelle",
    kapitel: [TAKTIK],
    trainer: "taktik",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  F4: {
    anzeige: "buchbezug.F4.anzeige",
    quelle: "buchbezug.F4.quelle",
    kapitel: [GRUNDLAGEN],
    trainer: "zaehlen",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  F5: {
    anzeige: "buchbezug.F5.anzeige",
    quelle: "buchbezug.F5.quelle",
    kapitel: [GRUNDLAGEN, TAKTIK],
    trainer: "roentgen",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  F6: {
    anzeige: "buchbezug.F6.anzeige",
    quelle: "buchbezug.F6.quelle",
    kapitel: [ENDSPIEL],
    trainer: "endspiel",
    thema: "endspiel:opposition",
    zuverlaessigkeit: "hoch",
  },
  F7: {
    anzeige: "buchbezug.F7.anzeige",
    quelle: "buchbezug.F7.quelle",
    kapitel: [ENDSPIEL],
    trainer: "endspiel",
    thema: "endspiel:quadrat",
    zuverlaessigkeit: "hoch",
  },
  F8: {
    anzeige: "buchbezug.F8.anzeige",
    quelle: "buchbezug.F8.quelle",
    kapitel: [EROEFFNUNGEN, GAMBITS],
    trainer: "repertoire",
    thema: null,
    zuverlaessigkeit: "hoch",
  },
  F9: {
    anzeige: "buchbezug.F9.anzeige",
    quelle: "buchbezug.F9.quelle",
    kapitel: [GRUNDLAGEN, EROEFFNUNGEN],
    trainer: "zielbilanz",
    thema: null,
    zuverlaessigkeit: "mittel",
  },
  F10: {
    anzeige: "buchbezug.F10.anzeige",
    quelle: "buchbezug.F10.quelle",
    kapitel: [PLAN],
    trainer: "planbilanz",
    thema: null,
    zuverlaessigkeit: "mittel",
  },
};

/**
 * Die Tabelle aller zwanzig Kategorien.
 * Beispiel: BUCHBEZUG.W3 → „Drohung stehen gelassen“, Kapitel 1 und 6, Schach-Röntgen-Trainer.
 */
export const BUCHBEZUG: Readonly<Record<Buchkennung, Buchbezug>> = Object.fromEntries(
  Object.entries({ ...WARUM, ...FINDEN }).map(([kennung, eintrag]) => [
    kennung,
    { kennung, ...eintrag },
  ]),
) as Readonly<Record<Buchkennung, Buchbezug>>;

/**
 * Reihenfolge der Warum-Prüfung (Konzept 4.1): W1 Falle, W2 Matt, W3 Drohung ab Leichtfigur, W10
 * Patt, W6 Köder, W5 verrechnet, W4 eingestellt, W3 kleinere Drohung, W7 Taktik, W8 Todsünde, W9
 * Bauernzug, W10 übrige Endspielregeln. W3 und W10 stehen je zweimal (Stufe „vorn“ und „hinten“).
 */
export const WARUM_REIHENFOLGE: readonly Warumkennung[] = [
  "W1",
  "W2",
  "W3",
  "W10",
  "W6",
  "W5",
  "W4",
  "W3",
  "W7",
  "W8",
  "W9",
  "W10",
];

/** Reihenfolge der Finde-Prüfung (Konzept 4.1): Konkretes vor Faustregel. */
export const FINDE_REIHENFOLGE: readonly Findekennung[] = [
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
];

/** Ist die Kennung eine Warum-Kategorie? Beispiel: „W10“ → ja, „F1“ → nein. */
export function istWarumkennung(kennung: Buchkennung): kennung is Warumkennung {
  return kennung.startsWith("W");
}
