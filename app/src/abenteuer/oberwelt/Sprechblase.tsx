/**
 * Sprechblase eines Statisten: ein Satz, darunter auf Wunsch Ambroses Antwort, und „Weiter“.
 *
 * Steht unten im selben Fenster wie die Dialoge (Wunsch des Autors, 14.11.2026: ein Textfenster
 * für alles, was zur Geschichte gehört; oben nur Meldungen zum Spiel). Ambroses Antwort trägt
 * sein Porträt, damit man sieht, wer spricht.
 *
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx (Runde 7, Dokument 16, Abschnitt 3.1).
 * Statisten haben keinen Dialog aus Ink; sie sagen einen Satz aus den Texten, beim nächsten
 * Ansprechen den nächsten. Die Texte kommen schon übersetzt herein.
 */
import { Portraet } from "../dialog/Portraet";

export interface SprechblasenInhalt {
  readonly satz: string;
  /** Ambroses Antwort (ohne Namen, den zeigt der Kopf mit Porträt); null ohne. */
  readonly ambrose: string | null;
  /** Kennung einer Vorführung, die der Statist anbietet (Dokument 16, 3.4); null ohne. */
  readonly zeigt: string | null;
}

/** Texte der Knöpfe und der Frage, schon übersetzt. */
export interface Sprechblasentexte {
  readonly weiter: string;
  readonly frage: string;
  readonly zeigen: string;
  /** Ambroses Name über seinem Porträt. */
  readonly ambrose: string;
}

export function Sprechblase(props: {
  readonly inhalt: SprechblasenInhalt;
  readonly texte: Sprechblasentexte;
  readonly beiSchliessen: () => void;
  /** Der Leser will die Vorführung sehen. */
  readonly beiZeigen: (kennung: string) => void;
}) {
  const zeigt = props.inhalt.zeigt;
  return (
    <section
      className="abenteuer-dialog abenteuer-sprechblase"
      role="status"
      data-testid="abenteuer-sprechblase"
    >
      <p className="abenteuer-dialog-text">{props.inhalt.satz}</p>
      {props.inhalt.ambrose && (
        <div className="abenteuer-sprechblase-ambrose">
          <div className="abenteuer-dialog-kopf" data-erscheinung="geist">
            <Portraet sprecher="ambrose" stimmung={null} zeile={props.inhalt.ambrose} />
            <p className="abenteuer-dialog-sprecher">{props.texte.ambrose}</p>
          </div>
          <p className="abenteuer-dialog-text">{props.inhalt.ambrose}</p>
        </div>
      )}
      {zeigt && <p>{props.texte.frage}</p>}
      <div className="knopfzeile">
        {zeigt && (
          <button
            type="button"
            className="knopf"
            onClick={() => props.beiZeigen(zeigt)}
            data-testid="abenteuer-vorfuehrung-zeigen"
          >
            {props.texte.zeigen}
          </button>
        )}
        <button type="button" className="knopf-zweit" onClick={props.beiSchliessen}>
          {props.texte.weiter}
        </button>
      </div>
    </section>
  );
}
