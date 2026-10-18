/**
 * Die vorgefertigten Gegner der Stufen 5 bis 8 (Vereinsanfänger bis Experte), je acht.
 *
 * Rolle im Gesamtbild: Teil von engine/gegnerliste.ts. Ab Stufe 5 gibt es keine absichtlichen
 * Fehler mehr (engine/stufen.ts); die Persönlichkeit entsteht aus den Stufen je Phase, den
 * blinden Flecken und dem Stil. Stufe 8 spielt in voller Stärke, dort unterscheiden nur blinde
 * Flecken und Stil die Gegner.
 * Abhängigkeiten: engine/gegnerbau.ts (Typ, Helfer).
 */
import { gegner, type Gegner } from "./gegnerbau";

/** Stufe 5, Vereinsanfänger. */
const STUFE_5: readonly Gegner[] = [
  gegner(
    "kurt",
    "Kurt",
    [4, 5, 5],
    ["koenigsschild", "falscherAbtausch", "ungenau"],
    ["springer"],
    0,
  ),
  gegner(
    "frau-ortega",
    "Frau Ortega",
    [5, 5, 4],
    ["ungenau", "drohungIgnoriert"],
    ["rueckzug"],
    -1,
  ),
  gegner("nils", "Nils", [5, 5, 5], [], ["ruhig", "abzug"], 2),
  gegner("hanna", "Hanna", [6, 5, 5], [], ["rueckzug"], 1),
  gegner("herr-weber", "Herr Weber", [4, 5, 6], [], ["dame", "diagonale"], -2),
  gegner("lea", "Lea", [5, 5, 4], [], ["grundreihe", "bauer"], 1),
  gegner("paul", "Paul", [5, 5, 6], [], ["turm"], 0),
  gegner("frau-kaya", "Frau Kaya", [5, 5, 5], [], ["roentgen", "springer"], -1),
];

/** Stufe 6, Vereinsspieler. */
const STUFE_6: readonly Gegner[] = [
  gegner("lena", "Lena", [6, 6, 5], [], ["ruhig", "zwischenzug"], 0),
  gegner("viktor", "Viktor", [7, 6, 6], [], ["abzug", "bauer"], 1),
  gegner("sara", "Sara", [6, 6, 6], [], ["abzug"], 2),
  gegner("herr-fischer", "Herr Fischer", [5, 6, 7], [], ["dame", "ruhig"], -2),
  gegner("elif", "Elif", [7, 7, 5], [], ["ruhig", "grundreihe"], 1),
  gegner("matteo", "Matteo", [6, 7, 5], [], ["zwischenzug"], 0),
  gegner("frau-lind", "Frau Lind", [6, 5, 7], [], ["diagonale", "bauer"], -1),
  gegner("ben", "Ben", [6, 6, 6], [], ["springer", "turm"], 1),
];

/** Stufe 7, starke Vereinsspieler. */
const STUFE_7: readonly Gegner[] = [
  gegner("doktor-berg", "Doktor Berg", [6, 7, 7], [], ["turm"], 0),
  gegner("trainer-koch", "Trainer Koch", [7, 7, 7], [], ["ruhig"], -1),
  gegner("yara", "Yara", [8, 7, 6], [], ["rueckzug"], 2),
  gegner("herr-brandt", "Herr Brandt", [6, 7, 8], [], ["abzug"], -2),
  gegner("noah", "Noah", [7, 8, 6], [], ["grundreihe"], 1),
  gegner("frau-stein", "Frau Stein", [7, 7, 7], [], ["zwischenzug", "dame"], 0),
  gegner("ravi", "Ravi", [7, 6, 8], [], ["diagonale"], 1),
  gegner("frau-doktor-ahl", "Frau Dr. Ahl", [8, 7, 7], [], ["bauer"], -1),
];

/** Stufe 8, Experten: volle Stärke, nur blinde Flecken und Stil unterscheiden sie. */
const STUFE_8: readonly Gegner[] = [
  gegner("gm-gruen", "Großmeister Grün", [8, 8, 8], [], [], 0),
  gegner("im-vogt", "IM Vogt", [8, 8, 8], [], ["ruhig"], 2),
  gegner("wgm-sato", "WGM Sato", [8, 8, 8], [], ["rueckzug"], 1),
  gegner("fm-ortiz", "FM Ortiz", [7, 8, 8], [], ["abzug"], 0),
  gegner("gm-petrova", "GM Petrova", [8, 8, 8], [], ["zwischenzug"], -1),
  gegner("im-haas", "IM Haas", [8, 8, 7], [], ["grundreihe"], -2),
  gegner("wim-nkemelu", "WIM Nkemelu", [8, 7, 8], [], ["diagonale"], 1),
  gegner("gm-lindqvist", "GM Lindqvist", [8, 8, 8], [], ["bauer"], 0),
];

export const GEGNER_STUFE_5_BIS_8: readonly Gegner[] = [
  ...STUFE_5,
  ...STUFE_6,
  ...STUFE_7,
  ...STUFE_8,
];
