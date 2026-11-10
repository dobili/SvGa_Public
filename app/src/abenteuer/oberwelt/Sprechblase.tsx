/**
 * Sprechblase eines Statisten: ein Satz, darunter auf Wunsch Ambroses Antwort, und „Weiter“.
 *
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx (Runde 7, Dokument 16, Abschnitt 3.1).
 * Statisten haben keinen Dialog aus Ink; sie sagen einen Satz aus den Texten, beim nächsten
 * Ansprechen den nächsten. Die Texte kommen schon übersetzt herein.
 */
export interface SprechblasenInhalt {
  readonly satz: string;
  /** Ambroses Antwort, schon mit seinem Namen davor; null ohne. */
  readonly ambrose: string | null;
  /** Kennung einer Vorführung, die der Statist anbietet (Dokument 16, 3.4); null ohne. */
  readonly zeigt: string | null;
}

/** Texte der Knöpfe und der Frage, schon übersetzt. */
export interface Sprechblasentexte {
  readonly weiter: string;
  readonly frage: string;
  readonly zeigen: string;
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
      className="abenteuer-ergebnis abenteuer-sprechblase"
      role="status"
      data-testid="abenteuer-sprechblase"
    >
      <p>{props.inhalt.satz}</p>
      {props.inhalt.ambrose && (
        <p className="abenteuer-sprechblase-ambrose">{props.inhalt.ambrose}</p>
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
