/**
 * Das Ladenfenster (docs/spiel/08, G2, G5, G6): Waren mit Preis, Münzen des Helden, Kaufen.
 *
 * Rolle im Gesamtbild: React-Overlay über der Welt wie die Deckwahl; die Oberwelt öffnet es, wenn
 * ein Dialog `oeffneLaden(kennung)` ruft und zu Ende ist. Was kaufbar ist, entscheidet
 * regeln/muenzen.ts; diese Datei zeigt nur an und meldet den Kauf.
 * Abhängigkeiten: regeln/muenzen.ts, daten/laden.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useZurueckSchliesst } from "../../app/blattstapel";
import type { Kartendaten, Ladendaten } from "../daten/laden";
import { kaufhindernis, type Ware } from "../regeln/muenzen";
import type { Kartensorte } from "../schnittstelle/karten";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";

export function Laden({
  laden,
  stand,
  sorten,
  beiKauf,
  beiSchliessen,
}: {
  readonly laden: Ladendaten;
  readonly stand: Abenteuerstand;
  readonly sorten: readonly Kartendaten[];
  readonly beiKauf: (ware: Ware) => void;
  readonly beiSchliessen: () => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  const alleSorten = sorten as unknown as readonly Kartensorte[];
  const name = (ware: Ware) =>
    ware.art === "karte"
      ? tSpiel(alleSorten.find((s) => s.kennung === ware.kennung)?.name ?? ware.kennung)
      : tSpiel(`gegenstand.${ware.kennung}.name`);
  return (
    <section
      className="abenteuer-menue"
      role="dialog"
      aria-label={tSpiel(laden.name)}
      data-testid="abenteuer-laden"
    >
      <h2>{tSpiel(laden.name)}</h2>
      <p data-testid="abenteuer-laden-muenzen">
        {tSpiel("laden.muenzen", { anzahl: stand.muenzen })}
      </p>
      <div className="abenteuer-deck">
        {laden.angebot.map((ware) => {
          const hindernis = kaufhindernis(stand, ware, alleSorten);
          return (
            <button
              key={`${ware.art}-${ware.kennung}`}
              type="button"
              className="abenteuer-karte"
              disabled={hindernis !== null}
              onClick={() => beiKauf(ware)}
            >
              {tSpiel("laden.ware", { name: name(ware), preis: ware.preis })}
              {hindernis === "schonDa" && ` · ${tSpiel("laden.schonDa")}`}
            </button>
          );
        })}
      </div>
      <button type="button" className="knopf-haupt" onClick={beiSchliessen}>
        {tSpiel("laden.schliessen")}
      </button>
    </section>
  );
}
