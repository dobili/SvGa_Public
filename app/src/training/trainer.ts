/**
 * Verzeichnis aller Trainer mit Kapitel und Ausbaustufe (Pflichtenheft 7).
 *
 * Rolle im Gesamtbild: Das Trainingsmenü zeigt alle Trainer von Anfang an, auch die aus Stufe 2
 * und 3; was noch nicht fertig ist, trägt „folgt mit einem Update“ (Konzept 10.1). Die Namen
 * stehen in i18n/de.json (`trainer.<kennung>.name`) und kommen vor dem Druck in die
 * Trainingskästen des Buches (AP 16); danach werden sie nicht mehr geändert.
 * Abhängigkeiten: keine.
 */

/** Ein Trainer. `fertig` wird true, sobald er in der App spielbar ist (ab AP 13). */
export interface Trainer {
  readonly kennung: TrainerKennung;
  /** Kapitel, zu denen er gehört; der erste Eintrag bestimmt den Platz im Menü. */
  readonly kapitel: readonly number[];
  readonly stufe: 2 | 3;
  readonly fertig: boolean;
}

export type TrainerKennung =
  | "koordinaten"
  | "roentgen"
  | "zaehlen"
  | "repertoire"
  | "zielbilanz"
  | "abweichung"
  | "faktorenbilanz"
  | "falle"
  | "struktur"
  | "planbilanz"
  | "taktik"
  | "endspiel"
  | "studien"
  | "zugErraten"
  | "dreissigMinuten"
  | "fehlerdatenbank"
  | "denkroutine";

/** Reihenfolge wie in der Tabelle in Pflichtenheft 7. */
export const TRAINER: readonly Trainer[] = [
  { kennung: "koordinaten", kapitel: [0], stufe: 2, fertig: true },
  { kennung: "roentgen", kapitel: [1], stufe: 2, fertig: true },
  { kennung: "zaehlen", kapitel: [1], stufe: 2, fertig: true },
  { kennung: "repertoire", kapitel: [2], stufe: 2, fertig: false },
  { kennung: "zielbilanz", kapitel: [2], stufe: 2, fertig: false },
  { kennung: "abweichung", kapitel: [2, 3], stufe: 3, fertig: false },
  { kennung: "faktorenbilanz", kapitel: [3], stufe: 2, fertig: false },
  { kennung: "falle", kapitel: [4], stufe: 2, fertig: false },
  { kennung: "struktur", kapitel: [5], stufe: 2, fertig: false },
  { kennung: "planbilanz", kapitel: [6], stufe: 3, fertig: false },
  { kennung: "taktik", kapitel: [7], stufe: 2, fertig: true },
  { kennung: "endspiel", kapitel: [8, 9], stufe: 2, fertig: false },
  { kennung: "studien", kapitel: [10], stufe: 3, fertig: false },
  { kennung: "zugErraten", kapitel: [11], stufe: 3, fertig: false },
  { kennung: "dreissigMinuten", kapitel: [12], stufe: 3, fertig: false },
  { kennung: "fehlerdatenbank", kapitel: [12], stufe: 3, fertig: false },
  { kennung: "denkroutine", kapitel: [12], stufe: 3, fertig: false },
];

/**
 * Die Trainer eines Kapitels, auch die, die mehrere Kapitel abdecken.
 *
 * Beispiel: Kapitel 9 → „Endspieltrainer“ (Kapitel 8 und 9).
 */
export function trainerZuKapitel(kapitel: number): Trainer[] {
  return TRAINER.filter((trainer) => trainer.kapitel.includes(kapitel));
}
