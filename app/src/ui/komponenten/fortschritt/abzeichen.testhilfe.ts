/**
 * Testhilfen für Erfahrungspunkte und Abzeichen (erfahrung.test.ts, abzeichen.test.ts): Partien,
 * Wertungspunkte und Nutzerdaten mit wenigen Zeilen bauen.
 * Abhängigkeiten: spiel/partie.ts, speicher/format.ts.
 */
import { gibAuf, neuePartie, type Partie, type Partiezug } from "../../../spiel/partie";
import type { Wertungspunkt } from "../../../spiel/wertung";
import { leereDaten, type Nutzerdaten } from "../../../speicher/format";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Beginn aller Testpartien. */
export const BEGINN = "2026-10-19T08:00:00.000Z";

/** Halbzüge abwechselnd vom Leser (Weiß) und der Engine. */
export function zuege(sans: readonly string[]): Partiezug[] {
  return sans.map((san, i) => ({
    san,
    von: i % 2 === 0 ? "leser" : "engine",
    quelle: i % 2 === 0 ? "leser" : "engine",
    fehler: null,
    verlust: 0,
  }));
}

/**
 * Eine beendete Partie gegen die Engine; der Leser spielt Weiß. `gewonnen`: die Engine gibt auf,
 * sonst der Leser. `matt`: Ende durch Matt statt Aufgabe.
 */
export function testpartie(
  id: string,
  sans: readonly string[],
  { gewonnen = false, matt = false, werkzeuge = true, ruecknahmen = 0 } = {},
): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 2,
      uhr: null,
      ruecknahmeErlaubt: true,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 2, mittelspiel: 2, endspiel: 2 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge },
      gewertet: false,
    },
    id,
    BEGINN,
  );
  if (!neu) throw new Error("nicht spielbar");
  const sieger = gewonnen ? "white" : "black";
  const art = matt ? "matt" : "aufgabe";
  return { ...gibAuf(neu), zuege: zuege(sans), ruecknahmen, ende: { art, sieger } };
}

/** Ein Wertungspunkt gegen einen Gegner der Stärke `gegner` bei eigener Wertung `wertung`. */
export function punkt(
  gegner: number,
  wertung: number,
  ergebnis: Wertungspunkt["ergebnis"],
): Wertungspunkt {
  return {
    partieId: `w-${gegner}-${wertung}-${ergebnis}`,
    zeit: BEGINN,
    gegner,
    ergebnis,
    wertung,
    phasen: { eroeffnung: null, mittelspiel: null, endspiel: null },
  };
}

/** Leere Nutzerdaten mit beendeten Partien (ohne Auswertung). */
export function mitPartien(partien: readonly Partie[], daten = leereDaten(new Date(BEGINN))) {
  const eintraege = partien.map((partie) => ({
    partie,
    werte: [],
    beste: [],
    abstaende: [],
    varianten: [],
  }));
  return { ...daten, spiel: { ...daten.spiel, partien: eintraege } } satisfies Nutzerdaten;
}
