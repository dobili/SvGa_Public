/**
 * Die Spaß-Bots unter den Einsteigern: vier Gegner, die einen Teil ihrer Züge zufällig spielen.
 *
 * Rolle im Gesamtbild: Teil von engine/gegnerliste.ts. Wunsch des Autors (18.10.2026 abends):
 * „eine Spaßkategorie unter Einsteiger … richtig schlecht“, vier Bots. Seit 0.2.116 neu gebaut
 * (Wunsch des Autors vom 20.10.2026, Porträts bleiben). Seit 0.2.117 (zehn Stufen) spielt jeder
 * eine eigene Stufe mit den Zusatzfehlern der Menschen und zieht dazu mit seinem Anteil an
 * Zufallszügen irgendeinen legalen Zug (engine/zufallszug.ts): mal ordentlich, mal völlig
 * daneben. Stufe 1 ist schon fast zufällig; darum liegen sie nicht mehr darunter, sondern stehen
 * in ihrer eigenen Gruppe mit ihrer gemessenen Zahl (engine/botstaerke.messung.ts).
 * Abhängigkeiten: engine/gegnerbau.ts (Typ, Helfer, Persönlichkeiten).
 */
import { spassbot, type Gegner } from "./gegnerbau";

/** Zum Spaß: vom schwächsten zum stärksten. */
export const SPASSBOTS: readonly Gegner[] = [
  spassbot("kiki", "Kiki", "fritzi", 3, 0.5, "hektiker", 1),
  spassbot("onkel-otto", "Onkel Otto", "willi", 4, 0.32, "materialist", 0),
  spassbot("tante-hilde", "Tante Hilde", "trude", 5, 0.2, "vorsichtig", -1),
  spassbot("bodo", "Bodo", "bruno", 6, 0.1, "angreifer", 2),
];
