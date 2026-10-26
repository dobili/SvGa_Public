/**
 * Ein Symbol je Trainer (Wunsch des Autors: Eine Trainingsseite mit viel Text liest sich
 * langsam; am Symbol erkennt man einen Trainer schneller). Wo ein Trainer ein Werkzeug übt, trägt
 * er dessen Symbol (Röntgen, Zählen, Planfindung, Taktik, Endspiel, Denkroutine).
 * Abhängigkeiten: lucide-react, training/trainer.ts (TrainerKennung).
 */
import {
  Bone,
  Brain,
  Calculator,
  Database,
  Fish,
  Flag,
  GitBranch,
  Grid3x3,
  Library,
  Lightbulb,
  Map,
  Puzzle,
  Scale,
  ScanEye,
  Target,
  Timer,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { TrainerKennung } from "../../../training/trainer";

/** „Falle oder Köder“: Fisch (Köder); Zug erraten: Puzzle; Studien: Glühbirne (die Idee). */
export const TRAINERSYMBOL: Readonly<Record<TrainerKennung, LucideIcon>> = {
  koordinaten: Grid3x3,
  roentgen: ScanEye,
  zaehlen: Calculator,
  repertoire: Library,
  zielbilanz: Target,
  abweichung: GitBranch,
  faktorenbilanz: Scale,
  falle: Fish,
  struktur: Bone,
  planbilanz: Map,
  taktik: Zap,
  endspiel: Flag,
  studien: Lightbulb,
  zugErraten: Puzzle,
  dreissigMinuten: Timer,
  fehlerdatenbank: Database,
  denkroutine: Brain,
};
