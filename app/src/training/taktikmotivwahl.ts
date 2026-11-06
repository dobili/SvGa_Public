/**
 * Motivwahl im Taktiktrainer: welche Grundmotive auf eine Aufgabe zutreffen und ob die Wahl des
 * Lesers („Welches Motiv war es?“) richtig ist.
 *
 * Rolle im Gesamtbild: Frage des Autors (6.11.2026): „Können mehrere Motive gleichzeitig
 * zutreffen? Alle zulässigen Lösungen akzeptieren.“ Jede Aufgabe trägt in den Daten genau ein
 * Motiv (Buch: Unterabschnitt oder Motivtext der Übung; Lichess: das einzige Motiv unter den
 * Themen). Oft trifft aber mehr zu, etwa bei einem Doppelschach, das immer auch ein Abzug ist, oder
 * bei einer Hinlenkung, die in eine Gabel führt (Abb. 7.14). Deshalb zählt neben dem Motiv der
 * Daten jedes Motiv, das der Motiverkenner der App (schach/taktikmotive.ts, Werkzeug „Motiv
 * benennen“) an der Lösungsfolge findet. Reine Funktionen.
 * Abhängigkeiten: schach/taktikmotive.ts (erkenneMotive), spiel/zuege.ts (Regelstellung),
 * training/taktiktrainer.ts (Grundmotive).
 * Buchbezug: Kapitel 7, „Die zwölf Grundmotive“ (Kombinationen verbinden oft mehrere Motive).
 */
import type { Taktikaufgabe } from "../daten/trainerdaten";
import { erkenneMotive, type Motiv } from "../schach/taktikmotive";
import { regelstellung } from "../spiel/zuege";
import { MOTIVE, type Taktikmotiv } from "./taktiktrainer";

const RETTUNG: Taktikmotiv = "rettung";

/**
 * Das Grundmotiv des Buches zu jedem Motiv des Erkenners.
 *
 * Regel: Kapitel 7, Gliederung der zwölf Grundmotive: „1. Doppelangriff und Gabel“, „4. Batterie
 * und Abzug“, „6. Köder, Hinlenkung und Räumung“, „8. Überlastung und Ablenkung“, „9. Zwischenzug
 * und Desperado“, „12. Rettung“ durch Dauerschach und Patt (wie MOTIV_JE_NUMMER in
 * pipeline/trainer/taktik.py und ZUSATZTHEMEN in training/zusatzaufgaben.ts).
 */
export const GRUNDMOTIV_JE_MOTIV: Readonly<Record<Motiv, Taktikmotiv>> = {
  gabel: "doppelangriff",
  doppelangriff: "doppelangriff",
  fesselung: "fesselung",
  spiess: "spiess",
  abzug: "abzug",
  batterie: "abzug",
  doppelschach: "doppelschach",
  hinlenkung: "hinlenkung",
  raeumung: "hinlenkung",
  beseitigung: "beseitigung",
  ueberlastung: "ueberlastung",
  ablenkung: "ueberlastung",
  zwischenzug: "zwischenzug",
  desperado: "zwischenzug",
  gefangen: "gefangen",
  umwandlung: "umwandlung",
  dauerschach: "rettung",
  patt: "rettung",
};

/**
 * Die Grundmotive, die der Erkenner an der Lösungsfolge findet, in der Reihenfolge des Buches.
 *
 * Eingaben: Aufgabe (Stellung und Lösung in SAN). Ausgabe: Grundmotive ohne Doppelte.
 * Beispiel: Abb. 7.18 „Lxc6 Lxc6 Se7+ Kh8 Sxc8“ → Doppelangriff, Fesselung, Beseitigung.
 * Sonderfall: Ist die Stellung oder der erste Zug nicht lesbar, eine leere Liste.
 */
export function erkannteGrundmotive(aufgabe: Taktikaufgabe): Taktikmotiv[] {
  const regeln = regelstellung(aufgabe.fen);
  const befund = regeln ? erkenneMotive(regeln, aufgabe.loesung) : null;
  const gefunden = new Set((befund?.motive ?? []).map((m) => GRUNDMOTIV_JE_MOTIV[m]));
  return MOTIVE.filter((m) => gefunden.has(m));
}

/**
 * Alle Motive, die als Antwort auf „Welches Motiv war es?“ richtig sind: zuerst das Motiv der
 * Daten, dann die übrigen erkannten in der Reihenfolge des Buches.
 *
 * Warum: Das Motiv der Daten bleibt immer richtig (Buch oder Lichess haben es so verschlagwortet);
 * was der Erkenner zusätzlich findet, trifft ebenfalls zu und darf nicht als falsch gelten.
 * Beispiel: Abb. 7.14 „Th8+ Kxh8 Sxf7+“ (Daten: Hinlenkung) → Hinlenkung, Doppelangriff (Gabel).
 * Sonderfall: Ohne Motiv in den Daten (Mattbild-Aufgaben) eine leere Liste; dann fragt der
 * Trainer nicht nach dem Motiv.
 * Sonderfall: Rettungsaufgaben (Motiv 12) nur mit „Rettung“. Regel: Kapitel 7, Motiv 12 („Wer
 * klar verliert, sucht nach einem Remis“): Dort geht es um das Remis; dass die Dame beim
 * Dauerschach oder beim Pattopfer nebenbei eine zweite Figur angreift (Abb. 7.27, 7.29), ist kein
 * Doppelangriff, der etwas gewinnt.
 */
export function zutreffendeMotive(aufgabe: Taktikaufgabe): Taktikmotiv[] {
  if (!aufgabe.motiv) return [];
  const erstes = aufgabe.motiv;
  if (erstes === RETTUNG) return [erstes];
  return [erstes, ...erkannteGrundmotive(aufgabe).filter((m) => m !== erstes)];
}

/** Ergebnis der Motivwahl: richtig oder nicht, dazu die übrigen zutreffenden Motive. */
export interface Motivurteil {
  readonly richtig: boolean;
  /** Die zutreffenden Motive außer dem gewählten, in der Reihenfolge von zutreffendeMotive. */
  readonly weitere: readonly Taktikmotiv[];
}

/**
 * Prüft die Wahl des Lesers gegen alle zutreffenden Motive.
 *
 * Beispiele: Abb. 7.14 (Hinlenkung, Doppelangriff), Wahl „doppelangriff“ → richtig, weitere:
 * Hinlenkung; Wahl „fesselung“ → falsch, weitere: Hinlenkung, Doppelangriff.
 */
export function pruefeMotivwahl(
  zutreffend: readonly Taktikmotiv[],
  gewaehlt: Taktikmotiv,
): Motivurteil {
  return {
    richtig: zutreffend.includes(gewaehlt),
    weitere: zutreffend.filter((m) => m !== gewaehlt),
  };
}
