/**
 * Kandidaten für den neuen Bot-Satz (0.2.125, Restplan 8; Wunsch des Autors, 24.10.2026): je Gruppe
 * 24 zusätzliche Bots (jeder Stil mit drei bis vier passenden Persönlichkeiten, Phasen gestreut), die
 * zusammen mit den 64 bestehenden gemessen werden; aus dem Pool wählt der Autor je Gruppe acht. Die
 * nicht gewählten bleiben hier samt Messwerten (engine/botkandidaten-daten.ts) erhalten, weil sie
 * später nützlich sein können. Ohne Namen und Porträt; nur die Messung (engine/stufen.messung.ts)
 * kennt sie, die App bietet sie nicht an.
 * Abhängigkeiten: engine/gegnerbau.ts.
 */
import type { Gegner } from "./gegnerbau";
import { BOTKANDIDATEN_1 } from "./botkandidaten1";
import { BOTKANDIDATEN_2 } from "./botkandidaten2";
import { BOTKANDIDATEN_3 } from "./botkandidaten3";
import { BOTKANDIDATEN_4 } from "./botkandidaten4";
import { BOTKANDIDATEN_NEULING } from "./botkandidaten-neuling";

/** Alle Kandidaten (seit 24.10.2026 in vier Teildateien, damit jede unter 400 Zeilen bleibt). */
export const BOTKANDIDATEN: readonly Gegner[] = [
  ...BOTKANDIDATEN_1,
  ...BOTKANDIDATEN_2,
  ...BOTKANDIDATEN_3,
  ...BOTKANDIDATEN_4,
  ...BOTKANDIDATEN_NEULING,
];
