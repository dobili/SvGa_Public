/**
 * Die vorgefertigten Gegner der Stufen 1 bis 4 (Einsteiger bis Gelegenheitsspieler), je acht.
 *
 * Rolle im Gesamtbild: Teil von engine/gegnerliste.ts. In diesen Stufen prägen die erlaubten
 * Fehlerarten (Kapitel 1 und 4 grob, Kapitel 5 bis 8 fein) die Persönlichkeit, dazu blinde
 * Flecken und Stil. Die 18 Gegner aus 0.2.46 bleiben unverändert (der Autor kennt sie aus
 * den Nachtests N241 und N242), nur ihr Stil ist neu.
 * Abhängigkeiten: engine/gegnerbau.ts (Typ, Helfer, Fehlerlisten).
 */
import { FEIN, gegner, GROB, type Gegner } from "./gegnerbau";

/** Stufe 1, Einsteiger: grobe Fehler aus Kapitel 1 und 4, in jeder Partie mehrere. */
const STUFE_1: readonly Gegner[] = [
  gegner("lotta", "Lotta", [1, 1, 1], [...GROB, ...FEIN], ["ruhig"], 0),
  gegner("paula", "Paula", [1, 1, 2], GROB, ["diagonale", "rueckzug", "grundreihe"], -1),
  gegner(
    "max",
    "Max",
    [1, 2, 1],
    ["verfruehteDame", "bauernraub", "figurHaengen", "tempoverlust"],
    ["rueckzug"],
    2,
  ),
  gegner(
    "finn",
    "Finn",
    [2, 1, 1],
    ["schlagreflex", "figurHaengen", "bauernraub", "koenigMitte"],
    ["ruhig", "abzug"],
    2,
  ),
  gegner(
    "oma-gerda",
    "Oma Gerda",
    [1, 1, 2],
    ["koenigPassiv", "tempoverlust", "figurHaengen", "drohungIgnoriert"],
    ["dame", "springer"],
    -2,
  ),
  gegner(
    "leon",
    "Leon",
    [1, 2, 1],
    ["verfruehteDame", "taktikUebersehen", "ungenau", "schlagreflex"],
    ["grundreihe", "bauer"],
    1,
  ),
  gegner("mia", "Mia", [1, 1, 1], GROB, ["diagonale", "zwischenzug"], 0),
  gegner(
    "emil",
    "Emil",
    [1, 1, 2],
    ["figurHaengen", "drohungIgnoriert", "pattGesetzt", "koenigPassiv"],
    ["turm", "rueckzug"],
    -1,
  ),
];

/** Stufe 2, Anfänger: noch grobe Fehler, seltener, dazu erste feine. */
const STUFE_2: readonly Gegner[] = [
  gegner(
    "opa-hans",
    "Opa Hans",
    [2, 1, 2],
    ["figurHaengen", "schlagreflex", "koenigMitte", "koenigPassiv", "bauernvorstoss"],
    ["springer", "grundreihe"],
    -1,
  ),
  gegner(
    "onkel-rudi",
    "Onkel Rudi",
    [2, 2, 1],
    ["schlagreflex", "bauernraub", "verfruehteDame", "drohungIgnoriert"],
    ["abzug"],
    2,
  ),
  gegner(
    "frieda",
    "Frieda",
    [2, 2, 3],
    ["drohungIgnoriert", "schlagreflex", "koenigsschild", "falscherAbtausch", "ungenau"],
    ["diagonale", "roentgen"],
    -2,
  ),
  gegner(
    "herr-lehmann",
    "Herr Lehmann",
    [3, 2, 2],
    ["koenigMitte", "tempoverlust", "koenigPassiv", "figurHaengen", "pattGesetzt"],
    ["dame", "turm"],
    0,
  ),
  gegner(
    "ayse",
    "Ayşe",
    [2, 3, 2],
    ["taktikUebersehen", "koenigsschild", "ungenau", "bauernvorstoss"],
    ["abzug"],
    1,
  ),
  gegner(
    "pit",
    "Pit",
    [1, 2, 3],
    ["schlagreflex", "bauernraub", "verfruehteDame", "falscherAbtausch"],
    ["ruhig", "roentgen"],
    2,
  ),
  gegner(
    "sophie",
    "Sophie",
    [3, 2, 1],
    ["tempoverlust", "koenigMitte", "koenigPassiv", "pattGesetzt", "ungenau"],
    ["springer", "dame"],
    -1,
  ),
  gegner(
    "karl",
    "Karl",
    [2, 2, 2],
    ["figurHaengen", "drohungIgnoriert", "taktikUebersehen"],
    ["zwischenzug", "grundreihe"],
    0,
  ),
];

/** Stufe 3, fortgeschrittene Anfänger: vor allem feine Fehler aus Kapitel 5 bis 8. */
const STUFE_3: readonly Gegner[] = [
  gegner(
    "selin",
    "Selin",
    [3, 3, 2],
    ["koenigsschild", "bauernvorstoss", "koenigPassiv", "ungenau"],
    ["dame"],
    0,
  ),
  gegner(
    "nina",
    "Nina",
    [3, 3, 3],
    ["taktikUebersehen", "drohungIgnoriert", "ungenau"],
    ["abzug"],
    0,
  ),
  gegner(
    "jonas",
    "Jonas",
    [2, 3, 4],
    ["bauernraub", "schlagreflex", "koenigsschild", "taktikUebersehen"],
    ["bauer"],
    -1,
  ),
  gegner(
    "tobias",
    "Tobias",
    [4, 3, 2],
    ["taktikUebersehen", "falscherAbtausch", "koenigPassiv"],
    ["rueckzug", "bauer"],
    1,
  ),
  gegner(
    "greta",
    "Greta",
    [3, 4, 3],
    ["ungenau", "koenigsschild", "bauernvorstoss"],
    ["dame", "turm"],
    2,
  ),
  gegner(
    "herr-nowak",
    "Herr Nowak",
    [3, 3, 3],
    ["drohungIgnoriert", "schlagreflex", "ungenau"],
    ["diagonale", "roentgen"],
    -2,
  ),
  gegner(
    "ida",
    "Ida",
    [2, 3, 4],
    ["bauernraub", "tempoverlust", "taktikUebersehen"],
    ["abzug", "grundreihe"],
    0,
  ),
  gegner(
    "omar",
    "Omar",
    [3, 2, 3],
    ["koenigsschild", "falscherAbtausch", "ungenau", "drohungIgnoriert"],
    ["zwischenzug", "ruhig"],
    1,
  ),
];

/** Stufe 4, Gelegenheitsspieler: nur noch kleine Ungenauigkeiten und übersehene Taktik. */
const STUFE_4: readonly Gegner[] = [
  gegner("benno", "Benno", [4, 4, 4], ["taktikUebersehen", "ungenau"], ["ruhig", "springer"], 0),
  gegner(
    "timo",
    "Timo",
    [5, 4, 3],
    ["taktikUebersehen", "falscherAbtausch", "bauernvorstoss", "ungenau"],
    ["rueckzug", "diagonale", "zwischenzug"],
    1,
  ),
  gegner("frau-berger", "Frau Berger", [4, 4, 5], ["ungenau", "koenigPassiv"], ["dame"], -1),
  gegner(
    "lukas",
    "Lukas",
    [3, 4, 5],
    ["taktikUebersehen", "bauernraub"],
    ["roentgen", "springer"],
    2,
  ),
  gegner("zoe", "Zoë", [5, 4, 3], ["ungenau", "bauernvorstoss", "koenigsschild"], ["rueckzug"], 2),
  gegner(
    "herr-schmitt",
    "Herr Schmitt",
    [4, 4, 4],
    ["ungenau", "falscherAbtausch", "taktikUebersehen"],
    ["turm", "abzug"],
    -2,
  ),
  gegner("amira", "Amira", [4, 5, 3], ["taktikUebersehen", "ungenau"], ["bauer", "zwischenzug"], 0),
  gegner(
    "jan",
    "Jan",
    [4, 3, 5],
    ["koenigsschild", "ungenau", "drohungIgnoriert"],
    ["diagonale", "grundreihe"],
    1,
  ),
];

export const GEGNER_STUFE_1_BIS_4: readonly Gegner[] = [
  ...STUFE_1,
  ...STUFE_2,
  ...STUFE_3,
  ...STUFE_4,
];
