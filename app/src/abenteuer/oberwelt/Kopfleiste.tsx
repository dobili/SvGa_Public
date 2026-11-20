/**
 * Leiste über der Welt: Tagebuch, Reisebrett (Übungspartie) und Monatskarte (Reisen), dazu die
 * Münzen.
 *
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx, ausgelagert, damit der Bildschirm lesbar
 * bleibt. In Erinnerungen (Ambroses Zeit) zeigt die Oberwelt sie nicht (F3). Welche Knöpfe
 * erscheinen, entscheidet die Oberwelt; hier nur Anzeige. Seit docs/spiel/30 (Bedienung mit dem
 * Daumen) liegen die Knöpfe nicht mehr oben; seit 20.11.2026 (Wunsch des Autors) sind sie kleine
 * Symbolknöpfe in einer Reihe unter dem Steuerkreuz, neben dem Menü ☰; die Lage regelt
 * bedienung.css. Jeder Knopf zeigt nur sein Zeichen; der Name bleibt sein zugänglicher Name
 * (aria-label) und steht als verborgener Text im Knopf. Die Münzen stehen oben, aber nur,
 * wenn sich ihre Zahl ändert, und im Laden (Muenzanzeige.tsx, Wunsch des Autors, 20.11.2026).
 * Abhängigkeiten: texte/texte.ts, oberwelt/Muenzanzeige.tsx.
 */
import { tSpiel } from "../texte/texte";
import { Muenzanzeige } from "./Muenzanzeige";

/** Ein Knopf der Leiste: Zeichen (sichtbar) und Name (zugänglicher Name). */
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
  /** Im Laden bleibt die Münzanzeige stehen (Wunsch des Autors, 20.11.2026). */
  readonly imLaden: boolean;
  readonly beiTagebuch: () => void;
  /** Der Tagebuchknopf pulsiert einmal (Hinweis zur Steuerung, Steuerhinweis.tsx). */
  readonly tagebuchPuls?: boolean;
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
          zusatz={props.tagebuchPuls ? "abenteuer-tagebuchknopf-puls" : ""}
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
      <Muenzanzeige muenzen={props.muenzen} immer={props.imLaden} />
    </>
  );
}
