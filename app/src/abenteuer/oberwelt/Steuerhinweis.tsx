/**
 * Zeigt die einmaligen Hinweise zur Steuerung (steuerhinweise.ts) als eine Zeile über der Welt.
 *
 * Warum: Erstspieler-Durchgang 20.11.2026; ein neuer Spieler bekam die Bedienung nirgends erklärt.
 * Die Zeile kommt nur in freier Welt, eine zugleich, verschwindet beim Tippen, beim ersten Gebrauch
 * des Bedienelements oder nach einigen Sekunden und kommt dann nie wieder (der Spielstand merkt sie
 * sich, sobald sie endet). Solange der Tagebuch-Hinweis steht, pulsiert der Tagebuchknopf
 * einmal (Kopfleiste.tsx, steuerhinweis.css; ohne Bewegung bei prefers-reduced-motion).
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx (ausgelagert, Größengrenze).
 * Abhängigkeiten: useSteuerhinweis.ts, texte/texte.ts.
 */
import "../steuerhinweis.css";
import { tSpiel } from "../texte/texte";
import type { Hinweissteuerung } from "./useSteuerhinweis";

/** Die Zeile selbst; Tippen schließt sie. Ohne gezeigten Hinweis nichts. */
export function Steuerhinweiszeile({ steuerung }: { readonly steuerung: Hinweissteuerung }) {
  const h = steuerung.aktiv;
  if (h === null) return null;
  return (
    <button
      type="button"
      className="abenteuer-steuerhinweis"
      data-hinweis={h}
      data-testid="abenteuer-steuerhinweis"
      aria-live="polite"
      onClick={steuerung.schliesse}
    >
      {tSpiel(`hinweis.${h}`)}
    </button>
  );
}
