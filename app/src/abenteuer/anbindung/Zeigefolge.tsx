/**
 * „Soll ich es dir zeigen?“ in der Partiebesprechung (Wunsch des Autors, 26.11.2026; Entwurf
 * docs/spiel/auftraege/partiebesprechung_25-11.md, Abschnitt 10): der Knopf unter der Blase und
 * das Abspielen der Folge auf dem Brett, Halbzug für Halbzug, danach „Zurück zur Partie“.
 *
 * Rolle im Gesamtbild: Teil von anbindung/Besprechung.tsx. Die Folge kommt fertig aus
 * anbindung/besprechungsfolge.ts, der Takt aus useAbspielen.ts; hier stehen nur die Knöpfe.
 * Abhängigkeiten: anbindung/besprechungsfolge.ts (Typ), texte/texte.ts.
 */
import { tSpiel } from "../texte/texte";
import type { Zeigefolge } from "./besprechungsfolge";

/** Der Knopf unter der Blase: mit Ambrose „Zeig es mir.“, ohne ihn „Besseren Weg zeigen“. */
export function Zeigeknopf(props: {
  readonly folge: Zeigefolge;
  readonly mitAmbrose: boolean;
  readonly zeige: () => void;
}) {
  const { folge, mitAmbrose, zeige } = props;
  const art = folge.besser ? "" : "Weiter";
  const text = mitAmbrose ? `besprechung.zeigen${art}` : `besprechung.zeigenAllein${art}`;
  return (
    <button
      type="button"
      className="knopf-zweit"
      data-testid="abenteuer-besprechung-zeigen"
      onClick={zeige}
    >
      {tSpiel(text)}
    </button>
  );
}

/** Während des Zeigens statt der Bedienung: Stand und „Zurück zur Partie“. */
export function Zeigeleiste(props: {
  readonly folge: Zeigefolge;
  readonly gezeigt: number;
  readonly zurueck: () => void;
}) {
  const { folge, gezeigt, zurueck } = props;
  return (
    <div className="abenteuer-huelle-blaettern" data-testid="abenteuer-besprechung-zeigeleiste">
      <span role="status" data-testid="abenteuer-besprechung-zeigestand">
        {tSpiel("besprechung.zeigeStand", {
          gezeigt: String(gezeigt),
          anzahl: String(folge.schritte.length),
        })}
      </span>
      <button
        type="button"
        className="knopf-zweit"
        data-testid="abenteuer-besprechung-zurueck-zur-partie"
        onClick={zurueck}
      >
        {tSpiel("besprechung.zurueckZurPartie")}
      </button>
    </div>
  );
}
