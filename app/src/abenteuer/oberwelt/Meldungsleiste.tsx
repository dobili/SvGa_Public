/**
 * Meldung der Oberwelt („Neu im Tagebuch …“, „Neue Aufgabe …“, Funde mit Bild) als schmale Leiste
 * oben: eine Zeile, „Weiter“ klein daneben, Antippen des Textes schließt auch.
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/Oberwelt.tsx (Größengrenze). Die Lage hoch und
 * quer regelt bedienung.css (Abschnitt Meldungen); vorher war die Meldung quer eine halbe
 * Bildschirmhöhe groß und lag zugleich mit dem Dialog da (Fotos 14.11.2026).
 * Abhängigkeiten: oberwelt/Fundbild.tsx, texte/texte.ts.
 */
import { tSpiel } from "../texte/texte";
import { Fundbild } from "./Fundbild";

/**
 * Die Leiste. Eingaben: Text, Bild des Fundes (oder null), Rückruf zum Schließen.
 * Beispiel: „Neu im Tagebuch: Das Brett auf dem Dachboden“ mit „Weiter“ rechts.
 */
export function Meldungsleiste(props: {
  readonly text: string;
  readonly bild: string | null;
  readonly beiSchliessen: () => void;
}) {
  return (
    <section
      className="abenteuer-ergebnis abenteuer-meldung"
      role="status"
      data-testid="abenteuer-meldung"
    >
      <Fundbild bild={props.bild} />
      <p onClick={props.beiSchliessen}>{props.text}</p>
      <button type="button" className="knopf-zweit" onClick={props.beiSchliessen}>
        {tSpiel("ergebnis.weiter")}
      </button>
    </section>
  );
}
