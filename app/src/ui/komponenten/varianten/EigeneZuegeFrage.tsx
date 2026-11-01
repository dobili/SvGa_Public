/**
 * Rückfrage am Gabel-Knopf einer Abbildung, wenn der Leser schon selbst gezogen hat: „Deine Züge
 * als Variante speichern?“ mit Speichern, Nur das Buch, Abbrechen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): Ob eine Variante gespeichert wird, entscheidet
 * immer der Leser. Vorher speicherte der Gabel-Knopf eigene Züge sofort (useAbbildungsvariante.ts).
 * Abhängigkeiten: spielstart/Blatt.tsx, useAbbildungsvariante.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import { Blatt } from "../spielstart/Blatt";
import type { Abbildungsvariante } from "./useAbbildungsvariante";

/** Das Blatt; zu, solange nicht gefragt wird. */
export function EigeneZuegeFrage({ variante }: { variante: Abbildungsvariante }) {
  return (
    <Blatt
      titel={t("varianten.frage.titel")}
      offen={variante.frage}
      schliessen={variante.schliesseFrage}
      testid="abbildung-speicherfrage"
      kinder={
        <>
          <p>{t("varianten.frage.eigeneZuege")}</p>
          <div className="knopfreihe">
            <button type="button" className="knopf-haupt" onClick={variante.speichere}>
              {t("varianten.speichern")}
            </button>
            <button type="button" className="knopf-zweit" onClick={variante.nurBuch}>
              {t("varianten.frage.nurBuch")}
            </button>
            <button type="button" className="knopf-zweit" onClick={variante.schliesseFrage}>
              {t("loeschen.nein")}
            </button>
          </div>
        </>
      }
    />
  );
}
