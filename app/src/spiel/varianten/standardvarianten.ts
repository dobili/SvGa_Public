/**
 * Die Varianten, die die App selbst mitbringt (Auftrag des Hauptchats, 26.11.2026): die drei
 * bisherigen (Blindschach, Schach960, nach Gehör) und die fünf Regelvarianten der Wege L3, L4, L7,
 * L8 und des Camps (docs/spiel/10_Sprueche_Schauplaetze_Varianten.md, Abschnitt 3a).
 *
 * Warum hier gesammelt: Ein Import dieser Datei meldet alle an (`meldeStandardvariantenAn`); die
 * Varianten mit eigenen Figuren und die Sonderformen melden sich in eigenen Dateien an
 * (docs/spiel/auftraege/varianten_schnittstelle_26-11.md).
 * Abhängigkeiten: spiel/varianten/variante.ts, spiel/varianten/regelschicht.ts, schach/chess960.ts.
 */
import { startFen960, zufallsnummer960 } from "../../schach/chess960";
import { chessopsRegeln } from "./regelschicht";
import { registriereVariante, varianteVon, type Variantendefinition } from "./variante";

/** Startstellung des Königsrennens: alle Figuren auf den ersten zwei Reihen, kein Bauer. */
export const KOENIGSRENNEN_START = "8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w - - 0 1";
/** Drei-Schach: Grundstellung mit drei Schachgeboten je Seite (Zähler wie Fairy-Stockfish). */
export const DREISCHACH_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 3+3 0 1";
const HUEGEL = ["d4", "e4", "d5", "e5"];
const ZIELLINIE = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"];
const SCHACH_JE_SEITE = 3;

/** Wie viele Schachgebote jede Seite schon gegeben hat, aus dem Zähler der FEN („3+3“ = je 0). */
export function schachgebote(fen: string): { weiss: number; schwarz: number } | null {
  const treffer = /\s(\d)\+(\d)\s/.exec(fen);
  if (!treffer) return null;
  return {
    weiss: SCHACH_JE_SEITE - Number(treffer[1]),
    schwarz: SCHACH_JE_SEITE - Number(treffer[2]),
  };
}

const STANDARD: readonly Variantendefinition[] = [
  {
    kennung: "blind",
    art: "darstellung",
    name: "variante.blind.name",
    regeln: chessopsRegeln("chess", "blind"),
    engine: { engine: "stockfish" },
    brett: { sicht: "keine_figuren" },
  },
  {
    kennung: "gehoer",
    art: "darstellung",
    name: "variante.gehoer.name",
    regeln: chessopsRegeln("chess", "gehoer"),
    engine: { engine: "stockfish" },
  },
  {
    kennung: "schach960",
    art: "regel",
    name: "variante.schach960.name",
    regeln: chessopsRegeln("chess", "schach960"),
    engine: { engine: "stockfish", optionen: { UCI_Chess960: "true" } },
    startstellung: (zufall) => startFen960(zufallsnummer960(zufall)),
  },
  {
    kennung: "dreischach",
    art: "regel",
    name: "variante.dreischach.name",
    regeln: chessopsRegeln("3check", "dreischach"),
    engine: { engine: "fairy", uciVariante: "3check" },
    startstellung: () => DREISCHACH_START,
    brett: {
      zaehler: (fen) => {
        const g = schachgebote(fen);
        return g ? { text: "variante.dreischach.zaehler", werte: g } : null;
      },
    },
  },
  {
    kennung: "atomschach",
    art: "regel",
    name: "variante.atomschach.name",
    regeln: chessopsRegeln("atomic", "atomschach"),
    engine: { engine: "fairy", uciVariante: "atomic" },
    brett: { schlagwirkung: "explosion" },
  },
  {
    kennung: "koenigDerHuegel",
    art: "regel",
    name: "variante.koenigDerHuegel.name",
    regeln: chessopsRegeln("kingofthehill", "koenigDerHuegel"),
    engine: { engine: "fairy", uciVariante: "kingofthehill" },
    brett: { felder: () => HUEGEL.map((feld) => ({ feld, farbe: "gold" as const })) },
  },
  {
    kennung: "koenigsrennen",
    art: "regel",
    name: "variante.koenigsrennen.name",
    regeln: chessopsRegeln("racingkings", "koenigsrennen"),
    engine: { engine: "fairy", uciVariante: "racingkings" },
    startstellung: () => KOENIGSRENNEN_START,
    brett: { felder: () => ZIELLINIE.map((feld) => ({ feld, farbe: "gruen" as const })) },
  },
  {
    kennung: "raeuberschach",
    art: "regel",
    name: "variante.raeuberschach.name",
    regeln: chessopsRegeln("antichess", "raeuberschach"),
    engine: { engine: "fairy", uciVariante: "antichess" },
    startstellung: () => "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1",
  },
];

/** Meldet die mitgebrachten Varianten an; ein zweiter Aufruf ändert nichts. */
export function meldeStandardvariantenAn(): void {
  for (const v of STANDARD) if (!varianteVon(v.kennung)) registriereVariante(v);
}

meldeStandardvariantenAn();
