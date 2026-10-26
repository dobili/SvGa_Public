/**
 * Die Zahlen einer Zeile der Partienliste: Spielstärke oder Genauigkeit beider Seiten als Text.
 *
 * Rolle im Gesamtbild: Partiezeile.tsx zeigt sie rechts untereinander. Eigene Datei, weil
 * Komponentendateien nur Komponenten ausführen (schnelles Neuladen).
 * Abhängigkeiten: spiel/genauigkeit.ts (Seitenbilanz), i18n.
 */
import { t } from "../../../i18n/sprache";
import type { Seitenbilanz } from "../../../spiel/genauigkeit";

/** Eine Seite: Text der Zahl und bei der Genauigkeit der Anteil 0 bis 1 für den Balken. */
export interface Seitenzahl {
  readonly text: string;
  readonly anteil: number | null;
}

/** Die Zahlen einer Partie: welche Art und beide Seiten, die eigene zuerst. */
export interface Partiezahlen {
  readonly art: "elo" | "genau";
  readonly ich: Seitenzahl;
  readonly gegner: Seitenzahl;
}

const PROZENT = 100;

/** „78 %“ mit Anteil 0,78; ohne Genauigkeit „–“. */
function genau(b: Seitenbilanz): Seitenzahl {
  return b.genauigkeit === null
    ? { text: "–", anteil: null }
    : {
        text: t("spielen.zahlGenau", { wert: Math.round(b.genauigkeit) }),
        anteil: b.genauigkeit / PROZENT,
      };
}

/**
 * Die Zahlen beider Seiten, eigene zuerst. Spielstärke (Elo) nur, wenn beide Seiten eine haben
 * (sonst stünde „1450“ neben „78 %“); sonst die Genauigkeit beider Seiten (Wunsch des Autors,
 * 25.10.2026). Beispiel: 39 Halbzüge → Elo „1450“, „1520“; 10 Halbzüge → „78 %“, „64 %“.
 */
export function partiezahlen(ich: Seitenbilanz, gegner: Seitenbilanz): Partiezahlen | null {
  if (ich.spielstaerke !== null && gegner.spielstaerke !== null)
    return {
      art: "elo",
      ich: { text: String(ich.spielstaerke), anteil: null },
      gegner: { text: String(gegner.spielstaerke), anteil: null },
    };
  if (ich.genauigkeit === null && gegner.genauigkeit === null) return null;
  return { art: "genau", ich: genau(ich), gegner: genau(gegner) };
}
