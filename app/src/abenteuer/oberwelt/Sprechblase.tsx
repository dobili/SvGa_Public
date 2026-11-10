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
}

export function Sprechblase(props: {
  readonly inhalt: SprechblasenInhalt;
  readonly weiter: string;
  readonly beiSchliessen: () => void;
}) {
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
      <button type="button" className="knopf-zweit" onClick={props.beiSchliessen}>
        {props.weiter}
      </button>
    </section>
  );
}
