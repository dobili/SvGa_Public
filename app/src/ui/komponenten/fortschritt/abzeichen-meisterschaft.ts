/**
 * Abzeichen der Meisterschaft je Thema (Gamifizierung P3) als eigene Teilliste von ABZEICHEN.
 *
 * Rolle im Gesamtbild: Wer Themen bis Gold führt, bekommt dafür zusätzlich ein Abzeichen: das
 * erste Gold, fünf Themen in Silber und alle Taktikmotive in Gold. Die Stufen kommen aus
 * training/meisterschaftsstand.ts (nur echte Antworten, ohne Probe). Die Taktikmotive stehen in
 * training/taktiktrainer.ts (MOTIVE); kommt dort ein Motiv dazu, zählt es von selbst mit.
 * Abhängigkeiten: abzeichen.ts (Typ), training/meisterschaftsstand.ts, training/taktiktrainer.ts,
 * speicher/themenprotokoll.ts, lucide-react (Zeichen).
 */
import { Award, Medal, Trophy } from "lucide-react";
import { themaTaktik } from "../../../speicher/themenprotokoll";
import { themenstufen, zaehleThemen } from "../../../training/meisterschaftsstand";
import { MOTIVE } from "../../../training/taktiktrainer";
import type { Abzeichenangabe } from "./abzeichen";

/** So viele Themen in Silber braucht das Abzeichen „Fünf Themen in Silber“. */
export const THEMEN_FUER_SILBERABZEICHEN = 5;

/** Sind alle Taktikmotive in Gold? */
function alleTaktikmotiveGold(stufen: Readonly<Record<string, string>>): boolean {
  return MOTIVE.every((motiv) => stufen[themaTaktik(motiv)] === "gold");
}

/** Die Abzeichen der Meisterschaft in der Reihenfolge des Gitters. */
export const MEISTERSCHAFT_ABZEICHEN: readonly Abzeichenangabe[] = [
  {
    kennung: "erstesGold",
    symbol: Medal,
    erfuellt: (g) => zaehleThemen(themenstufen(g.daten), "gold") >= 1,
  },
  {
    kennung: "fuenfSilber",
    symbol: Award,
    erfuellt: (g) => zaehleThemen(themenstufen(g.daten), "silber") >= THEMEN_FUER_SILBERABZEICHEN,
  },
  {
    kennung: "alleTaktikGold",
    symbol: Trophy,
    erfuellt: (g) => alleTaktikmotiveGold(themenstufen(g.daten)),
  },
];
