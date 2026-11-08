/**
 * Schnellreise mit der Monatskarte (docs/spiel/11, I6; Story-Bibel Szene 30a): von draußen in jede
 * schon besuchte Stadt, ohne die Wege noch einmal zu laufen.
 *
 * Rolle im Gesamtbild: React-Overlay über der Welt wie Laden und Deckwahl; die Oberwelt zeigt den
 * Knopf „Reisen“ nur mit dem Gegenstand `monatskarte`, draußen und nicht in einer Erinnerung.
 * Ziel ist die erste Außenkarte der Stadt am Auslöser `start` (den hat jede Karte).
 * Abhängigkeiten: daten/laden.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useZurueckSchliesst } from "../../app/blattstapel";
import type { Reiseziel } from "./reiseziele";
import { tSpiel } from "../texte/texte";

export function Reisen({
  ziele,
  beiWahl,
  beiSchliessen,
}: {
  readonly ziele: readonly Reiseziel[];
  readonly beiWahl: (karte: string) => void;
  readonly beiSchliessen: () => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  return (
    <section
      className="abenteuer-menue"
      role="dialog"
      aria-label={tSpiel("reisen.titel")}
      data-testid="abenteuer-reisen"
    >
      <h2>{tSpiel("reisen.titel")}</h2>
      <p>{tSpiel("reisen.hinweis")}</p>
      {ziele.length === 0 ? (
        <p>{tSpiel("reisen.keine")}</p>
      ) : (
        <div className="abenteuer-deck">
          {ziele.map((z) => (
            <button
              key={z.ort.kennung}
              type="button"
              className="abenteuer-karte"
              onClick={() => beiWahl(z.karte)}
            >
              {tSpiel(z.ort.name)}
            </button>
          ))}
        </div>
      )}
      <button type="button" className="knopf-haupt" onClick={beiSchliessen}>
        {tSpiel("reisen.zurueck")}
      </button>
    </section>
  );
}
