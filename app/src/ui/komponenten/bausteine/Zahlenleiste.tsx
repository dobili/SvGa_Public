/**
 * Zahlenleiste für Abbildungsnummern: Ziffern, Punkt und Löschen zum Antippen.
 *
 * Rolle im Gesamtbild: Punkt A3 des Nebenchats (31.10.2026, im Sinne des Autors: keine
 * Handytastatur, wo Antippen reicht). Beim Öffnen einer Abbildung über ihre Nummer („5.28“)
 * klappte die Handytastatur auf. Das Eingabefeld bleibt (am Rechner tippt man weiter), zeigt auf
 * dem Handy aber keine Tastatur mehr (inputMode „none“); darunter steht diese Leiste.
 * Abhängigkeiten: i18n; Stil in ui/stil/trainerfeinschliff.css.
 */
import { t } from "../../../i18n/sprache";

const TASTEN = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."] as const;

/** Die Leiste; jeder Tipp hängt seine Taste an, „⌫“ löscht die letzte. */
export function Zahlenleiste({ text, setze }: { text: string; setze: (text: string) => void }) {
  return (
    <div className="zahlenleiste" role="group" aria-label={t("zahlenleiste.titel")}>
      {TASTEN.map((taste) => (
        <button
          key={taste}
          type="button"
          className="chip taste"
          onClick={() => setze(text + taste)}
        >
          {taste}
        </button>
      ))}
      <button
        type="button"
        className="chip taste"
        disabled={text === ""}
        aria-label={t("zahlenleiste.loeschen")}
        onClick={() => setze(text.slice(0, -1))}
      >
        ⌫
      </button>
    </div>
  );
}
