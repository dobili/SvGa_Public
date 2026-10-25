/**
 * Die Zahlen einer Zeile der Partienliste (seit 0.2.142): Spielstärke oder Genauigkeit beider
 * Seiten als Text.
 *
 * Rolle im Gesamtbild: Partiezeile.tsx zeigt sie rechts untereinander. Eigene Datei, weil
 * Komponentendateien nur Komponenten ausführen (schnelles Neuladen).
 * Abhängigkeiten: spiel/genauigkeit.ts (Seitenbilanz), i18n.
 */
import { t } from "../../i18n/sprache";
import type { Seitenbilanz } from "../../spiel/genauigkeit";

/**
 * Die Zahlen beider Seiten als Text, eigene zuerst. Spielstärke nur, wenn beide Seiten eine haben
 * (sonst stünde „≈ 1450“ neben „78 %“); sonst die Genauigkeit beider Seiten (Wunsch des Autors,
 * 25.10.2026). Beispiel: 39 Halbzüge → „≈ 1450“, „≈ 1520“; 10 Halbzüge → „78 %“, „64 %“.
 */
export function partiezahlen(
  ich: Seitenbilanz,
  gegner: Seitenbilanz,
): { ich: string; gegner: string } | null {
  if (ich.spielstaerke !== null && gegner.spielstaerke !== null)
    return {
      ich: t("spielen.zahlStaerke", { wert: ich.spielstaerke }),
      gegner: t("spielen.zahlStaerke", { wert: gegner.spielstaerke }),
    };
  if (ich.genauigkeit === null && gegner.genauigkeit === null) return null;
  const genau = (b: Seitenbilanz) =>
    b.genauigkeit === null ? "–" : t("spielen.zahlGenau", { wert: Math.round(b.genauigkeit) });
  return { ich: genau(ich), gegner: genau(gegner) };
}
