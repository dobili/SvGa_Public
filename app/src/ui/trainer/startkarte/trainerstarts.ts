/**
 * Die Beschreibung der Startkarte je Trainer: Beispielstellung mit Markierungen.
 *
 * Rolle im Gesamtbild: Entwurf G1 „Startkarte“ (Wahl des Autors, 31.10.2026). Oben auf jeder
 * Startkarte steht ein Beispielbrett mit einer typischen Stellung und ein Satz, worum es geht
 * (Texte `trainerstart.<kennung>.satz` und `.kurz` in de.json und en.json). Ein neuer Trainer
 * trägt hier eine Zeile ein; seine Einstellzeilen und Modi beschreibt sein Bereich
 * (ui/trainer/*Bereich.tsx) als Listen (einstellung.ts). Die Stellungen sind selbst gebaute
 * Beispiele der App, keine Abbildungen des Buches; ein Test prüft, dass jede FEN gültig ist.
 * Abhängigkeiten: analyse/werkzeug.ts (Markierung), training/trainer.ts (Kennungen).
 */
import type { Markierung } from "../../../analyse/werkzeug";
import type { TrainerKennung } from "../../../training/trainer";

/** Die Beispielstellung oben auf der Startkarte. */
export interface Trainerstart {
  readonly fen: string;
  readonly markierungen: readonly Markierung[];
  /** Brett von Schwarz aus zeigen. */
  readonly gedreht?: boolean;
}

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * Ein Eintrag je Trainer mit Startkarte. Trainer ohne Eintrag (30-Minuten-Plan,
 * Fehlerdatenbank) zeigen weiter ihre eigene Seite: Sie haben keine Runde zum Starten.
 */
export const TRAINERSTARTS: Readonly<Partial<Record<TrainerKennung, Trainerstart>>> = {
  // Feld e4 suchen: Grundstellung, das Zielfeld golden.
  koordinaten: {
    fen: GRUNDSTELLUNG,
    markierungen: [{ typ: "feld", farbe: "gold", feld: "e4", text: "?" }],
  },
  // Nach 1.e4 e5 2.Lc4 Sc6 3.Dh5 Sf6: Weiß droht Dxf7 matt, Schwarz greift die Dame an.
  roentgen: {
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    markierungen: [
      { typ: "pfeil", farbe: "gold", von: "h5", nach: "f7" },
      { typ: "pfeil", farbe: "rot", von: "f6", nach: "h5" },
    ],
  },
  // Wer gewinnt auf e5? Angreifer und Verteidiger zählen.
  zaehlen: {
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    markierungen: [
      { typ: "feld", farbe: "gold", feld: "e5" },
      { typ: "pfeil", farbe: "gold", von: "f3", nach: "e5" },
      { typ: "pfeil", farbe: "blau", von: "c6", nach: "e5" },
    ],
  },
  // Spanische Partie nach 3.Lb5.
  repertoire: {
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    markierungen: [{ typ: "pfeil", farbe: "gold", von: "f1", nach: "b5" }],
  },
  // Entwickelte Italienische Stellung: Zentrum, Entwicklung, Königssicherheit.
  zielbilanz: {
    fen: "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 b - - 0 6",
    markierungen: [
      { typ: "feld", farbe: "gruen", feld: "e4" },
      { typ: "feld", farbe: "gruen", feld: "e5" },
    ],
  },
  // Die Engine verlässt das Buch: 2…f6 statt 2…Sc6.
  abweichung: {
    fen: "rnbqkbnr/pppp2pp/5p2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
    markierungen: [{ typ: "pfeil", farbe: "rot", von: "f7", nach: "f6" }],
  },
  // Zweispringerspiel nach 5…Sxd5: Wer steht besser?
  faktorenbilanz: {
    fen: "r1bqkb1r/ppp2ppp/2n5/3np1N1/2B5/8/PPPP1PPP/RNBQ1RK1 b kq - 1 6",
    markierungen: [{ typ: "feld", farbe: "rot", feld: "f7" }],
  },
  // Blackburnes Köder: 3…Sd4 lässt e5 hängen.
  falle: {
    fen: "r1bqkbnr/pppp1ppp/8/4p3/2BnP3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    markierungen: [{ typ: "pfeil", farbe: "rot", von: "c6", nach: "d4" }],
  },
  // Isolierter Damenbauer: d5 ist ein starkes Feld für Schwarz.
  struktur: {
    fen: "4k3/pp3ppp/4p3/8/3P4/8/PP3PPP/4K3 w - - 0 1",
    markierungen: [
      { typ: "feld", farbe: "rot", feld: "d4" },
      { typ: "feld", farbe: "gold", feld: "d5" },
    ],
  },
  // Wo spiele ich? Lange Diagonale und Königsflügel.
  planbilanz: {
    fen: "r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10",
    markierungen: [{ typ: "pfeil", farbe: "gold", von: "d3", nach: "h7" }],
  },
  // Grundreihe: Td8 setzt matt.
  taktik: {
    fen: "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    markierungen: [],
  },
  // Bauernendspiel: Opposition.
  endspiel: {
    fen: "8/8/8/4k3/8/4K3/4P3/8 w - - 0 1",
    markierungen: [{ typ: "feld", farbe: "gold", feld: "e4" }],
  },
  // Eine klassische Studie: Der König holt den Bauern doch noch ein.
  studien: {
    fen: "7K/8/k1P5/7p/8/8/8/8 w - - 0 1",
    markierungen: [{ typ: "pfeil", farbe: "gold", von: "h8", nach: "g7" }],
  },
  // Ein Meisterzug ist gesucht: welcher Plan?
  zugErraten: {
    fen: "r1bq1rk1/pp2bppp/2n1pn2/2pp4/3P4/2PBPN2/PP1N1PPP/R1BQ1RK1 w - - 0 8",
    markierungen: [{ typ: "pfeil", farbe: "gold", von: "f3", nach: "e5" }],
  },
  // Kurz und regelmäßig: eine Taktikstellung.
  kurzplaene: {
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    markierungen: [{ typ: "pfeil", farbe: "gold", von: "h5", nach: "f7" }],
  },
  // Zwei Kandidaten mit der stärksten Antwort.
  denkroutine: {
    fen: "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 b - - 0 6",
    markierungen: [
      { typ: "pfeil", farbe: "blau", von: "d7", nach: "d6" },
      { typ: "pfeil", farbe: "blau", von: "c5", nach: "b4" },
    ],
  },
};
