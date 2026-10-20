/**
 * Die Spaß-Bots unter den Einsteigern: vier Gegner, die einen Teil ihrer Züge zufällig spielen.
 *
 * Rolle im Gesamtbild: Teil von engine/gegnerliste.ts. Wunsch des Autors (18.10.2026 abends):
 * „eine Spaßkategorie unter Einsteiger … richtig schlecht“, vier Bots. Seit 0.2.116 neu gebaut
 * (Wunsch des Autors vom 20.10.2026, Porträts bleiben): Sie spielen wie Stufe 1 (Menschen um
 * 600, engine/menschenwahl.ts) und ziehen dazu mit ihrem Anteil an Zufallszügen irgendeinen
 * legalen Zug (engine/zufallszug.ts). Die Anteile ordnen die vier vom schwächsten zum stärksten;
 * ihre Zahl misst die Elo-Leiter (engine/botstaerke.messung.ts).
 * Abhängigkeiten: engine/gegnerbau.ts (Typ, Helfer, Persönlichkeiten).
 */
import { spassbot, type Gegner } from "./gegnerbau";

/** Zum Spaß: vom schwächsten zum stärksten. */
export const SPASSBOTS: readonly Gegner[] = [
  spassbot("kiki", "Kiki", "fritzi", 0.5, "hektiker", 1),
  spassbot("onkel-otto", "Onkel Otto", "willi", 0.32, "materialist", 0),
  spassbot("tante-hilde", "Tante Hilde", "trude", 0.2, "vorsichtig", -1),
  spassbot("bodo", "Bodo", "bruno", 0.1, "angreifer", 2),
];
