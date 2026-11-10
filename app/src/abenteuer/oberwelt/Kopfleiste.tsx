/**
 * Kopfleiste über der Welt: Tagebuch, Münzen, Reisebrett (Übungspartie) und Monatskarte (Reisen).
 *
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx, ausgelagert, damit der Bildschirm lesbar
 * bleibt. In Erinnerungen (Ambroses Zeit) zeigt die Oberwelt sie nicht (F3). Welche Knöpfe
 * erscheinen, entscheidet die Oberwelt; hier nur Anzeige.
 * Abhängigkeiten: texte/texte.ts.
 */
import { tSpiel } from "../texte/texte";

export function Kopfleiste(props: {
  readonly muenzen: number;
  readonly beiTagebuch: () => void;
  /** Rückruf fürs Reisebrett, oder null, wenn der Knopf fehlt. */
  readonly beiReisebrett: (() => void) | null;
  /** Rückruf für die Monatskarte, oder null, wenn der Knopf fehlt. */
  readonly beiReisen: (() => void) | null;
}) {
  return (
    <>
      <button
        type="button"
        className="abenteuer-tagebuchknopf"
        onClick={props.beiTagebuch}
        data-testid="abenteuer-tagebuchknopf"
      >
        {tSpiel("tagebuch.knopf")}
      </button>
      <span className="abenteuer-muenzen" data-testid="abenteuer-muenzen" aria-live="polite">
        {tSpiel("laden.muenzenKurz", { anzahl: props.muenzen })}
      </span>
      {props.beiReisebrett && (
        <button
          type="button"
          className="abenteuer-tagebuchknopf abenteuer-reisebrettknopf"
          onClick={props.beiReisebrett}
          data-testid="abenteuer-reisebrettknopf"
        >
          {tSpiel("reisebrett.knopf")}
        </button>
      )}
      {props.beiReisen && (
        <button
          type="button"
          className="abenteuer-tagebuchknopf abenteuer-reisenknopf"
          onClick={props.beiReisen}
          data-testid="abenteuer-reisenknopf"
        >
          {tSpiel("reisen.knopf")}
        </button>
      )}
    </>
  );
}
