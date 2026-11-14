/**
 * Leiste über der Welt: Tagebuch, Reisebrett (Übungspartie) und Monatskarte (Reisen), dazu die
 * Münzen.
 *
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx, ausgelagert, damit der Bildschirm lesbar
 * bleibt. In Erinnerungen (Ambroses Zeit) zeigt die Oberwelt sie nicht (F3). Welche Knöpfe
 * erscheinen, entscheidet die Oberwelt; hier nur Anzeige. Seit docs/spiel/30 (Bedienung mit dem
 * Daumen) liegen die Knöpfe nicht mehr oben, sondern in einer Leiste über dem Steuerkreuz
 * (Hochformat) oder als runde Knöpfe rechts über dem Aktionsknopf (Querformat); die Lage regelt
 * bedienung.css. Jeder Knopf trägt ein Zeichen für die runde Form und seinen Namen; quer zeigt
 * er nur das Zeichen, der Name bleibt sein zugänglicher Name. Die Münzen bleiben oben (nur lesen).
 * Abhängigkeiten: texte/texte.ts.
 */
import { tSpiel } from "../texte/texte";

/** Ein Knopf der Leiste: Zeichen (für die runde Form im Querformat) und Name. */
function Leistenknopf({
  zeichen,
  text,
  testid,
  zusatz = "",
  beiKlick,
}: {
  readonly zeichen: string;
  readonly text: string;
  readonly testid: string;
  readonly zusatz?: string;
  readonly beiKlick: () => void;
}) {
  return (
    <button
      type="button"
      className={`abenteuer-tagebuchknopf ${zusatz}`}
      aria-label={text}
      onClick={beiKlick}
      data-testid={testid}
    >
      <span className="abenteuer-leiste-zeichen" aria-hidden="true">
        {zeichen}
      </span>
      <span className="abenteuer-leiste-text" aria-hidden="true">
        {text}
      </span>
    </button>
  );
}

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
      <nav className="abenteuer-leiste" aria-label={tSpiel("oberwelt.leiste")}>
        <Leistenknopf
          zeichen="📖"
          text={tSpiel("tagebuch.knopf")}
          testid="abenteuer-tagebuchknopf"
          beiKlick={props.beiTagebuch}
        />
        {props.beiReisebrett && (
          <Leistenknopf
            zeichen="♞"
            text={tSpiel("reisebrett.knopf")}
            testid="abenteuer-reisebrettknopf"
            zusatz="abenteuer-reisebrettknopf"
            beiKlick={props.beiReisebrett}
          />
        )}
        {props.beiReisen && (
          <Leistenknopf
            zeichen="🎫"
            text={tSpiel("reisen.knopf")}
            testid="abenteuer-reisenknopf"
            zusatz="abenteuer-reisenknopf"
            beiKlick={props.beiReisen}
          />
        )}
      </nav>
      <span className="abenteuer-muenzen" data-testid="abenteuer-muenzen" aria-live="polite">
        {tSpiel("laden.muenzenKurz", { anzahl: props.muenzen })}
      </span>
    </>
  );
}
