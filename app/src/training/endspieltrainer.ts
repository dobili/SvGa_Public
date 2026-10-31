/**
 * Endspieltrainer (Kapitel 8 und 9): Buchstellungen gegen die Engine gewinnen oder Remis halten.
 *
 * Rolle im Gesamtbild: Trainer „endspiel“ (Pflichtenheft 7, AP 13). Die Aufgaben stammen aus
 * inhalte/de/trainer/endspiel.json (pipeline/trainer/endspiel.py): Abbildungen der Kapitel 8 und
 * 9 mit Seite des Lesers, Ziel (Gewinn oder Remis), Thema, Stichwort und Schwierigkeit, jede von
 * Stockfish geprüft; dazu freie Endspielaufgaben der Lichess-Datenbank (CC0, P4, R47; Themen
 * bauernendspiel, turmendspiel, damenendspiel, leichtfiguren, Stufe nach Lichess-Wertung). Der
 * Leser spielt gegen die Engine in voller Stärke; nach jedem seiner Züge sagt die Bewertung, ob
 * die Stellung noch hält. Reine Funktionen; die Engine ruft die Oberfläche
 * (ui/trainer/useEndspielpartie.ts).
 * Abhängigkeiten: daten/trainerdaten.ts, spiel/ergebnis.ts, training/zufall.ts.
 * Buchbezug: Kapitel 8 (Endspiel-Fundament) und 9 (Endspiel-Vertiefung).
 */
import type { Endspielaufgabe, Endspielthema } from "../daten/trainerdaten";
import type { Partieende } from "../spiel/ergebnis";
import { mische, type Zufall } from "./zufall";
import { fenGeeignet } from "./eignung";

/** Gruppen der Themen für die Auswahl. */
export type Endspielgruppe = "alle" | "matt" | "bauern" | "turm" | "dame" | "leichtfiguren";
/** Die Gruppen in der Reihenfolge der Auswahl, „alle“ zuerst. */
export const GRUPPEN: readonly Endspielgruppe[] = [
  "alle",
  "matt",
  "bauern",
  "turm",
  "dame",
  "leichtfiguren",
];

const THEMEN_JE_GRUPPE: Readonly<Record<Endspielgruppe, readonly Endspielthema[]>> = {
  alle: [],
  matt: ["damenmatt", "turmmatt", "laeuferpaar"],
  bauern: [
    "opposition",
    "schluesselfelder",
    "quadrat",
    "bauernrennen",
    "durchbruch",
    "freibauer",
    "zugzwang",
    "randbauer",
    "bauernendspiel",
  ],
  turm: ["turmendspiel"],
  dame: ["dameGegenBauer", "damenendspiel"],
  leichtfiguren: ["leichtfiguren"],
};

/**
 * Die Gruppe, in der ein Endspielthema steht (Vorwahl, wenn der Trainer mit Thema geöffnet wird,
 * etwa über „Üben“ an einer Medaille der Meisterschaft, P3). Beispiel: „opposition“ → „bauern“.
 * Sonderfall: unbekanntes Thema oder null → null (dann bleibt „alle“).
 */
export function gruppeZumThema(thema: string | null): Endspielgruppe | null {
  if (thema === null) return null;
  return GRUPPEN.find((g) => (THEMEN_JE_GRUPPE[g] as readonly string[]).includes(thema)) ?? null;
}

export interface Endspielwahl {
  readonly gruppe: Endspielgruppe;
  /** Schwierigkeit 1 bis 5, null für alle. */
  readonly stufe: number | null;
}

/** Grenzen der Bewertung (Bauerneinheiten aus Sicht des Lesers), wie in endspiel.json. */
export interface Massstab {
  readonly gewinnAb: number;
  readonly remisBis: number;
}

/**
 * Spielraum beim Kippen: Die Engine schwankt bei kurzer Rechenzeit; erst wer deutlich unter die
 * Grenze fällt, hat das Ziel verfehlt (Gewinn: unter gewinnAb − 0,5; Remis: unter −remisBis − 0,7).
 */
const SPIELRAUM_GEWINN = 0.5;
const SPIELRAUM_REMIS = 0.7;
/** So viele eigene Züge muss der Leser das Remis halten, dann gilt es als erreicht. */
export const HALTEN_ZUEGE = 12;

function passtZurGruppe(aufgabe: Endspielaufgabe, gruppe: Endspielgruppe): boolean {
  return gruppe === "alle" || THEMEN_JE_GRUPPE[gruppe].includes(aufgabe.thema);
}

/** Wie viele Aufgaben es je Gruppe gibt (für die Auswahl). Beispiel: „turm“ → 20. */
export function anzahlJeGruppe(aufgaben: readonly Endspielaufgabe[]): Map<Endspielgruppe, number> {
  return new Map(GRUPPEN.map((g) => [g, aufgaben.filter((a) => passtZurGruppe(a, g)).length]));
}

/**
 * Eine Runde Aufgaben der Gruppe, nahe an der gewählten Stufe, leichteste zuerst.
 *
 * Warum: Wie im Taktiktrainer ein Themenblock; Endspiele dauern länger, deshalb weniger Aufgaben.
 * Ausgabe: höchstens `anzahl` Aufgaben, nach Schwierigkeit sortiert.
 */
export function endspielrunde(
  aufgaben: readonly Endspielaufgabe[],
  wahl: Endspielwahl,
  anzahl: number,
  zufall: Zufall,
): Endspielaufgabe[] {
  const abstand = (a: Endspielaufgabe) =>
    wahl.stufe === null ? 0 : Math.abs(a.schwierigkeit - wahl.stufe);
  const auswahl = mische(
    // Eignung je Trainer (training/eignung.ts): nur Matt und Patt fallen weg.
    aufgaben.filter((a) => passtZurGruppe(a, wahl.gruppe) && fenGeeignet("endspiel", a.fen)),
    zufall,
  )
    .sort((a, b) => abstand(a) - abstand(b))
    .slice(0, anzahl);
  return auswahl.sort((a, b) => a.schwierigkeit - b.schwierigkeit);
}

/**
 * Ist die Stellung aus Sicht des Lesers gekippt? Gewinn: der Vorteil ist weg; Remis: er steht
 * auf Verlust. Eingabe: Ziel, Wert aus Sicht des Lesers, Maßstab.
 * Beispiel: Ziel Gewinn, Wert +0,3 (Opposition verpasst) → gekippt; Ziel Remis, Wert −0,9 → hält.
 */
export function gekippt(ziel: Endspielaufgabe["ziel"], wertLeser: number, m: Massstab): boolean {
  if (ziel === "gewinn") return wertLeser < m.gewinnAb - SPIELRAUM_GEWINN;
  return wertLeser < -(m.remisBis + SPIELRAUM_REMIS);
}

/** Wie eine Aufgabe ausging. */
export type Endspielergebnis =
  | { readonly art: "erreicht"; readonly grund: "matt" | "umwandlung" | "remis" | "gehalten" }
  | {
      readonly art: "verfehlt";
      readonly grund: "gekippt" | "matt" | "remis" | "aufgegeben";
      /** Der Zug (SAN), der das Ziel gehalten hätte, falls bekannt. */
      readonly gehalten: string | null;
    };

/**
 * Das Ergebnis aus dem Partieende, falls die Partie zu Ende ist.
 *
 * Gewinnziel: Matt durch den Leser erreicht; Patt, Remis, Matt gegen ihn verfehlt. Remisziel:
 * jedes Remis erreicht, Matt gegen ihn verfehlt (Matt durch ihn zählt ebenfalls als erreicht).
 */
export function ergebnisAusEnde(
  ziel: Endspielaufgabe["ziel"],
  leser: "w" | "b",
  ende: Partieende | null,
): Endspielergebnis | null {
  if (!ende) return null;
  if ("sieger" in ende) {
    const leserSiegt = (ende.sieger === "white") === (leser === "w");
    if (leserSiegt) return { art: "erreicht", grund: "matt" };
    return { art: "verfehlt", grund: "matt", gehalten: null };
  }
  if (ziel === "remis") return { art: "erreicht", grund: "remis" };
  return { art: "verfehlt", grund: "remis", gehalten: null };
}

/** Hat der Leser mit seinem letzten Zug umgewandelt (Gewinnziel: der Rest ist Technik)? */
export function istUmwandlung(san: string | undefined): boolean {
  return san !== undefined && san.includes("=");
}
