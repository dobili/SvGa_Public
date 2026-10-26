/**
 * Eine Zeile mit Auswahlknöpfen, nach der Antwort mit der Antwort der App (oder des Buches)
 * daneben.
 *
 * Rolle im Gesamtbild: Gemeinsam für die Zielbilanz-Übung (ja, teils, nein) und den
 * Faktorenbilanz-Trainer (Weiß, gleich, Schwarz). Grün, wenn die eigene Wahl stimmt, sonst rot.
 * Abhängigkeiten: i18n.
 */
import { t } from "../../i18n/sprache";

/**
 * Eine Zeile mit Auswahlknöpfen (etwa ja, teils, nein); nach der Antwort steht die Antwort der App
 * daneben, grün oder rot.
 */
export function Wahlzeile<T extends string>({
  titel,
  werte,
  name,
  wert,
  setze,
  app,
  quelle = "app",
}: {
  titel: string;
  werte: readonly T[];
  /** Beschriftung eines Wertes. */
  name: (wert: T) => string;
  wert: T | undefined;
  setze: (wert: T) => void;
  /** Die Antwort der App, sobald geprüft ist; sonst null. */
  app: T | null;
  /** Woher die Antwort stammt: Rechnung der App oder Tabelle des Buches (W9). */
  quelle?: "app" | "buch";
}) {
  return (
    <fieldset className="zahlwahl">
      <legend>{titel}</legend>
      {werte.map((w) => (
        <button
          key={w}
          type="button"
          className="chip"
          aria-pressed={wert === w}
          disabled={app !== null}
          onClick={() => setze(w)}
        >
          {name(w)}
        </button>
      ))}
      {app !== null && (
        <span className={`meldung ${app === wert ? "gut" : "schlecht"}`}>
          {t(quelle === "buch" ? "trainer.buchSagt" : "trainer.appSagt", { antwort: name(app) })}
        </span>
      )}
    </fieldset>
  );
}
