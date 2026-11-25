/**
 * Das Ladenfenster (docs/spiel/08, G2, G5, G6): Waren mit Preis, Münzen des Helden, Kaufen.
 *
 * Rolle im Gesamtbild: React-Overlay über der Welt wie die Deckwahl; die Oberwelt öffnet es, wenn
 * ein Dialog `oeffneLaden(kennung)` ruft und zu Ende ist. Was kaufbar ist, entscheidet
 * regeln/muenzen.ts; diese Datei zeigt nur an und meldet den Kauf.
 * Seit dem 25.11.2026 (Befund des Autors: Karte mehrmals gekauft, weil kein Kauf sichtbar
 * bestätigt wurde): Jede Ware nennt, wie viele Stück im Rucksack sind; nach dem Kauf steht eine
 * Bestätigung da, und die Münzzahl blinkt kurz auf. Eine Verbrauchskarte, die man schon hat, kauft
 * erst ein zweites Tippen (regeln/muenzen.ts, brauchtRueckfrage).
 * Abhängigkeiten: regeln/muenzen.ts, daten/laden.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import type { Kartendaten, Ladendaten } from "../daten/laden";
import { brauchtRueckfrage, imRucksack, kaufhindernis, type Ware } from "../regeln/muenzen";
import type { Kartensorte } from "../schnittstelle/karten";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";

/** Schlüssel einer Ware im Angebot. */
const schluessel = (ware: Ware) => `${ware.art}-${ware.kennung}`;

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
  // Ware, die auf das zweite Tippen wartet, und der letzte Kauf (für die Bestätigung).
  const [rueckfrage, setzeRueckfrage] = useState<string | null>(null);
  const [gekauft, setzeGekauft] = useState<{ ware: Ware; nummer: number } | null>(null);
  const alleSorten = sorten as unknown as readonly Kartensorte[];
  const name = (ware: Ware) =>
    ware.art === "karte"
      ? tSpiel(alleSorten.find((s) => s.kennung === ware.kennung)?.name ?? ware.kennung)
      : tSpiel(`gegenstand.${ware.kennung}.name`);
  const tippe = (ware: Ware) => {
    if (brauchtRueckfrage(stand, ware, alleSorten) && rueckfrage !== schluessel(ware)) {
      setzeRueckfrage(schluessel(ware));
      return;
    }
    setzeRueckfrage(null);
    beiKauf(ware);
    setzeGekauft((alt) => ({ ware, nummer: (alt?.nummer ?? 0) + 1 }));
  };
  return (
    <section
      className="abenteuer-menue"
      role="dialog"
      aria-label={tSpiel(laden.name)}
      data-testid="abenteuer-laden"
    >
      {/* Nur der Inhalt rollt, „Fertig“ steht im Fuß darunter und verdeckt keine Ware
          (quer lag der stehende Knopf über einer Reihe, Spieler-Durchlauf 20.11.2026). */}
      <div className="abenteuer-menue-inhalt">
        <h2>{tSpiel(laden.name)}</h2>
        {/* Neuer Schlüssel je Kauf: Die Münzzahl blinkt dann neu auf (abenteuer.css). */}
        <p
          key={gekauft?.nummer ?? 0}
          className={gekauft ? "abenteuer-laden-muenzen-neu" : undefined}
          data-testid="abenteuer-laden-muenzen"
        >
          {tSpiel("laden.muenzen", { anzahl: stand.muenzen })}
        </p>
        {gekauft && (
          <p
            className="abenteuer-laden-gekauft"
            role="status"
            data-testid="abenteuer-laden-gekauft"
          >
            {tSpiel("laden.gekauft", {
              name: name(gekauft.ware),
              anzahl: imRucksack(stand, gekauft.ware),
            })}
          </p>
        )}
        <div className="abenteuer-deck">
          {laden.angebot.map((ware) => {
            const hindernis = kaufhindernis(stand, ware, alleSorten);
            const anzahl = imRucksack(stand, ware);
            const fragt = rueckfrage === schluessel(ware);
            return (
              <button
                key={schluessel(ware)}
                type="button"
                className="abenteuer-karte"
                disabled={hindernis !== null}
                aria-pressed={fragt}
                data-testid={`abenteuer-ware-${ware.kennung}`}
                onClick={() => tippe(ware)}
              >
                {fragt
                  ? tSpiel("laden.nochEine", { name: name(ware), preis: ware.preis })
                  : tSpiel("laden.ware", { name: name(ware), preis: ware.preis })}
                {hindernis === "schonDa" && ` · ${tSpiel("laden.schonDa")}`}
                {hindernis !== "schonDa" &&
                  anzahl > 0 &&
                  ` · ${tSpiel("laden.imRucksack", { anzahl })}`}
              </button>
            );
          })}
        </div>
      </div>
      <div className="abenteuer-menue-fuss">
        <button type="button" className="knopf-haupt" onClick={beiSchliessen}>
          {tSpiel("laden.schliessen")}
        </button>
      </div>
    </section>
  );
}
