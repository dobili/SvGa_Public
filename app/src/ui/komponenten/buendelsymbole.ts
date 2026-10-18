/**
 * Ein Symbol je Werkzeug-Bündel (seit 0.2.85, Wunsch des Autors): In der waagerecht scrollbaren
 * Werkzeugleiste erkennt man ein Bündel am Symbol, ohne den Namen zu lesen. Dazu die Symbole für
 * „frühere“ (Werkzeuge aus früheren Kapiteln) und „spätere“ (Vorschau).
 * Abhängigkeiten: lucide-react, werkzeugordnung.ts (Buendelkennung).
 */
import {
  Bone,
  Brain,
  Crosshair,
  DoorOpen,
  Flag,
  History,
  Map,
  ShieldAlert,
  Telescope,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Buendelkennung } from "./werkzeugordnung";

/** Eröffnung: Tür (der Einstieg); Angriffsregel: Fadenkreuz; Fallencheck: Schild mit Warnung. */
export const BUENDELSYMBOL: Readonly<Record<Buendelkennung, LucideIcon>> = {
  eroeffnung: DoorOpen,
  angriffsregel: Crosshair,
  fallencheck: ShieldAlert,
  skelett: Bone,
  planfindung: Map,
  taktik: Zap,
  endspiel: Flag,
  denkroutine: Brain,
};

/** „frühere“: Uhr mit Pfeil zurück; „spätere“: Fernrohr (Vorschau). */
export const FRUEHERE_SYMBOL: LucideIcon = History;
export const SPAETERE_SYMBOL: LucideIcon = Telescope;
