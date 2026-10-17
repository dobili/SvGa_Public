/**
 * Hinweis „Nur dieser Zug führt zum Ziel“ unter der Erklärung einer Übung.
 *
 * Rolle im Gesamtbild: Die Engine-Prüfung der Übungen (Fable, inhalte/de/trainer/
 * uebungen-engine.json) sagt je Übung, ob jeder andere erste Zug mindestens eine Bauerneinheit
 * schlechter ist (`einzigerZug`). Dann lohnt der Satz, dass es keinen gleich guten Ausweg gibt.
 * Fehlt die Prüfung (offline vor dem ersten Laden), steht einfach nichts da.
 * Abhängigkeiten: daten/trainerdaten.ts, useDaten, i18n.
 */
import { ladeUebungspruefung } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { useDaten } from "./useDaten";

export function EinzigerZug({ uebung }: { uebung: string }) {
  const pruefung = useDaten(ladeUebungspruefung, "uebungen-engine");
  if (pruefung.art !== "fertig") return null;
  const eintrag = pruefung.wert.uebungen.find((u) => u.uebung === uebung);
  if (!eintrag?.einzigerZug) return null;
  return (
    <p className="hinweis" data-testid="einziger-zug">
      {t("uebung.einzigerZug")}
    </p>
  );
}
