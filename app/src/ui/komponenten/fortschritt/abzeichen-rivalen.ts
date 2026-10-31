/**
 * Abzeichen der Rivalen (Gamifizierung P8) als eigene Teilliste von ABZEICHEN.
 *
 * Rolle im Gesamtbild: Ein Duell ist gewonnen, wenn der Leser seinen Rivalen zum ersten Mal in
 * einer gewerteten Partie besiegt (Entscheidung E6); danach stellt sich ein neuer Rivale vor.
 * Wer drei bzw. zehn Rivalen besiegt hat, bekommt ein Abzeichen. Gezählt wird mit
 * training/rivalen.ts (Einträge „rivale:<bot>“ in `verdient`).
 * Abhängigkeiten: abzeichen.ts (Typ), training/rivalen.ts, lucide-react (Zeichen).
 */
import { Swords, Trophy } from "lucide-react";
import { besiegteRivalen } from "../../../training/rivalen";
import type { Abzeichenangabe } from "./abzeichen";
import { zielanteil } from "./abzeichenanteil";

/** Besiegte Rivalen für die beiden Abzeichen; ein weiteres bekäme hier eine Zahl und unten eine Zeile. */
export const RIVALEN_ABZEICHEN_ZAHLEN = { drei: 3, zehn: 10 } as const;

/** Die Abzeichen der Rivalen in der Reihenfolge des Gitters. */
export const RIVALEN_ABZEICHEN: readonly Abzeichenangabe[] = [
  {
    kennung: "rivalen3",
    symbol: Swords,
    erfuellt: (g) => besiegteRivalen(g.daten).length >= RIVALEN_ABZEICHEN_ZAHLEN.drei,
    fortschritt: (g) => zielanteil(besiegteRivalen(g.daten).length, RIVALEN_ABZEICHEN_ZAHLEN.drei),
  },
  {
    kennung: "rivalen10",
    symbol: Trophy,
    erfuellt: (g) => besiegteRivalen(g.daten).length >= RIVALEN_ABZEICHEN_ZAHLEN.zehn,
    fortschritt: (g) => zielanteil(besiegteRivalen(g.daten).length, RIVALEN_ABZEICHEN_ZAHLEN.zehn),
  },
];
