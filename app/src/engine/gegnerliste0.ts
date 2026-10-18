/**
 * Die Spaß-Bots unter den Einsteigern: vier Gegner, die einen Teil ihrer Züge zufällig spielen.
 *
 * Rolle im Gesamtbild: Teil von engine/gegnerliste.ts. Wunsch des Autors (18.10.2026 abends):
 * „eine Spaßkategorie unter Einsteiger … um 500 bis 1000, also richtig schlecht“, vier Bots. Sie
 * spielen wie Stufe 1 mit groben Fehlern und ziehen dazu mit ihrem Anteil an Zufallszügen
 * irgendeinen legalen Zug (engine/zufallszug.ts). Die Anteile sind gemessen
 * (engine/botstaerke.messung.ts), sodass die vier etwa gleichmäßig zwischen 500 und 1000 liegen.
 * Abhängigkeiten: engine/gegnerbau.ts (Typ, Helfer, Fehlerlisten).
 */
import { GROB, spassbot, type Gegner } from "./gegnerbau";

/** Zum Spaß: vom schwächsten zum stärksten. */
export const SPASSBOTS: readonly Gegner[] = [
  spassbot("fritzi", "Fritzi", 0.75, GROB, [], 1),
  spassbot("willi", "Onkel Willi", 0.5, GROB, ["ruhig"], 0),
  spassbot("trude", "Tante Trude", 0.35, GROB, ["diagonale"], -1),
  spassbot("bruno", "Bruno", 0.2, GROB, ["springer"], 2),
];
