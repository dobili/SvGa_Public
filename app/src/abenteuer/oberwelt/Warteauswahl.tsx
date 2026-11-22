/**
 * Die Wahl beim Ausruhen an einer Bank (Spieluhr, 22.11.2026): warten bis Morgen, Mittag, Abend
 * oder Nacht, oder doch nicht. Gezeigt von useWarten.tsx; Stil in abenteuer-atmosphaere.css.
 * Abhängigkeiten: texte/texte.ts, wartewunsch.ts.
 */
import { tSpiel } from "../texte/texte";
import { WARTEZIELE, type Warteziel } from "./wartewunsch";

/** Die Wahl an einer Bank: vier Ziele und „Doch nicht“. */
export function Warteauswahl({
  beiZiel,
  beiAbbruch,
}: {
  readonly beiZiel: (ziel: Warteziel) => void;
  readonly beiAbbruch: () => void;
}) {
  return (
    <section
      className="abenteuer-ergebnis abenteuer-warteauswahl"
      data-testid="abenteuer-warteauswahl"
    >
      <h3>{tSpiel("warten.titel")}</h3>
      <div className="abenteuer-wartezeile">
        {WARTEZIELE.map((z) => (
          <button key={z} type="button" className="knopf-haupt" onClick={() => beiZiel(z)}>
            {tSpiel(`warten.bis.${z}`)}
          </button>
        ))}
      </div>
      <button type="button" className="knopf-zweit" onClick={beiAbbruch}>
        {tSpiel("warten.abbrechen")}
      </button>
    </section>
  );
}
