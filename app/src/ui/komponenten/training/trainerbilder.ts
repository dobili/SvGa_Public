/**
 * Bild je Trainer für die Karten im Bereich Training (Entwurf C2, 31.10.2026): eine typische
 * Stellung als kleines Brett mit Pfeilen und Feldern.
 *
 * Rolle im Gesamtbild: Die Karten sollen auf einen Blick zeigen, worum es im Trainer geht. Die
 * Trainerdaten liegen erst nach dem Laden vor und sind je Trainer anders gebaut; deshalb steht hier
 * je Trainer eine feste, selbst gebaute Stellung (kein Buchdiagramm, keine Buchtexte). Ein neuer
 * Trainer trägt eine Zeile ein; ohne Eintrag zeigt seine Karte die Grundstellung (VORGABEBILD).
 * Abhängigkeiten: analyse/werkzeug.ts (Markierung), training/trainer.ts (Kennungen).
 */
import type { Markierung, Markierungsfarbe } from "../../../analyse/werkzeug";
import type { TrainerKennung } from "../../../training/trainer";

/** Ein Kartenbild: Stellung und Markierungen. */
export interface Trainerbild {
  readonly fen: string;
  readonly markierungen: readonly Markierung[];
}

/** Pfeil von Feld zu Feld (kurz für die Liste). */
function pfeil(von: string, nach: string, farbe: Markierungsfarbe = "gold"): Markierung {
  return { typ: "pfeil", farbe, von, nach };
}

/** Markiertes Feld (kurz für die Liste). */
function feld(name: string, farbe: Markierungsfarbe = "gold"): Markierung {
  return { typ: "feld", farbe, feld: name };
}

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ITALIENISCH = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3";

/** Bild für Trainer ohne eigenen Eintrag: die Grundstellung. */
export const VORGABEBILD: Trainerbild = { fen: GRUNDSTELLUNG, markierungen: [] };

/**
 * Je Trainer ein Bild. Beispiel: Röntgen-Trainer → Dame a8 zielt durch den Läufer d4 auf den
 * König h1 (rot), wie die Schach-Röntgen-Regel fragt: Was steht auf der Linie dahinter?
 */
export const TRAINERBILDER: Readonly<Partial<Record<TrainerKennung, Trainerbild>>> = {
  koordinaten: {
    fen: "8/8/8/8/4N3/8/8/8 w - - 0 1",
    markierungen: [pfeil("e4", "f6"), pfeil("e4", "c3"), feld("e4")],
  },
  roentgen: {
    fen: "q7/8/8/8/3B4/8/8/7K w - - 0 1",
    markierungen: [pfeil("a8", "h1", "rot"), feld("h1", "rot")],
  },
  zaehlen: {
    fen: "8/8/4p3/3p4/4P3/2N5/8/8 w - - 0 1",
    markierungen: [pfeil("c3", "d5"), pfeil("e4", "d5"), pfeil("e6", "d5", "rot")],
  },
  repertoire: {
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    markierungen: [pfeil("b8", "c6")],
  },
  zielbilanz: {
    fen: ITALIENISCH,
    markierungen: [feld("d4"), feld("e4"), feld("d5"), feld("e5")],
  },
  abweichung: {
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    markierungen: [pfeil("c7", "c5", "rot")],
  },
  faktorenbilanz: {
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2",
    markierungen: [pfeil("e5", "f4", "rot")],
  },
  falle: {
    fen: "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3",
    markierungen: [pfeil("h5", "f7", "rot"), pfeil("c4", "f7", "rot")],
  },
  struktur: {
    fen: "8/pp3ppp/4p3/8/3P4/8/PP3PPP/8 w - - 0 1",
    markierungen: [feld("d4"), feld("d5", "grau")],
  },
  planbilanz: {
    fen: "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    markierungen: [pfeil("d1", "d7")],
  },
  taktik: {
    fen: "r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1",
    markierungen: [pfeil("b5", "c7"), feld("a8", "rot"), feld("e8", "rot")],
  },
  endspiel: {
    fen: "8/8/4k3/8/4K3/4P3/8/8 w - - 0 1",
    markierungen: [feld("d5"), feld("e5"), feld("f5")],
  },
  studien: {
    fen: "r7/4P3/8/8/8/8/7k/K7 w - - 0 1",
    markierungen: [pfeil("e7", "e8")],
  },
  zugErraten: {
    fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7",
    markierungen: [pfeil("c1", "g5")],
  },
  dreissigMinuten: VORGABEBILD,
  kurzplaene: {
    fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
    markierungen: [pfeil("c4", "d5")],
  },
  fehlerdatenbank: {
    fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
    markierungen: [pfeil("f6", "e4", "rot"), feld("e4", "rot")],
  },
  denkroutine: {
    fen: ITALIENISCH,
    markierungen: [pfeil("g8", "f6"), pfeil("f8", "c5"), pfeil("f3", "e5", "grau")],
  },
};

/** Das Bild eines Trainers; ohne Eintrag die Grundstellung. */
export function trainerbild(kennung: TrainerKennung): Trainerbild {
  return TRAINERBILDER[kennung] ?? VORGABEBILD;
}
