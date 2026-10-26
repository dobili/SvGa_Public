/**
 * Knopf „Wiederholen“ in der Auswahl des Taktiktrainers und von „Falle oder Köder“ (U9, 0.2.47).
 *
 * Rolle im Gesamtbild: Startet eine Runde aus den fälligen Aufgaben (kartenantwort.ts); ohne
 * fällige Aufgaben steht nichts da.
 * Abhängigkeiten: i18n.
 */
import { t } from "../../i18n/sprache";

/**
 * Der Knopf „Wiederholen“ in einem Trainer: startet eine Runde aus den fälligen Aufgaben; ohne
 * fällige Aufgaben erscheint er nicht.
 */
export function Wiederholungsknopf({ anzahl, starte }: { anzahl: number; starte: () => void }) {
  if (anzahl === 0) return null;
  return (
    <p data-testid="trainer-wiederholung" data-tour="trainer-wiederholen">
      <button type="button" className="knopf-zweit" onClick={starte}>
        {anzahl === 1 ? t("trainer.wiederholungEine") : t("trainer.wiederholungAnzahl", { anzahl })}
      </button>
    </p>
  );
}
