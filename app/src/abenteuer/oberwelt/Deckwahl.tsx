/**
 * Die Deckwahl vor einer Partie: bis zu DECKGROESSE Karten aus dem Besitz (Regelwerk R24).
 *
 * Rolle im Gesamtbild: React-Overlay über der Welt, aufgerufen von der Oberwelt, wenn eine
 * Begegnung Karten erlaubt und der Leser welche besitzt. „Ohne Karten spielen“ ist immer möglich
 * (Gold braucht keine). Welche Karte ins Deck darf, entscheidet regeln/karten.ts.
 * Abhängigkeiten: regeln/karten.ts, schnittstelle/karten.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import type { Kartendaten } from "../daten/laden";
import { deckErlaubt } from "../regeln/karten";
import { DECKGROESSE, type Kartenbesitz, type Kartensorte } from "../schnittstelle/karten";
import { tSpiel } from "../texte/texte";

export function Deckwahl({
  besitz,
  sorten,
  beiWahl,
  beiAbbruch,
}: {
  readonly besitz: readonly Kartenbesitz[];
  readonly sorten: readonly Kartendaten[];
  readonly beiWahl: (deck: readonly string[]) => void;
  readonly beiAbbruch: () => void;
}) {
  const [deck, setzeDeck] = useState<readonly string[]>([]);
  useZurueckSchliesst(true, beiAbbruch);
  const alleSorten = sorten as unknown as readonly Kartensorte[];
  const waehlbar = besitz.filter((k) => {
    const sorte = alleSorten.find((s) => s.kennung === k.kennung);
    return sorte !== undefined && sorte.zeitpunkt !== "nachher";
  });
  const schalte = (kennung: string) => {
    if (deck.includes(kennung)) setzeDeck(deck.filter((k) => k !== kennung));
    else if (deckErlaubt(deck, kennung, alleSorten)) setzeDeck([...deck, kennung]);
  };
  const mitVorgabe = deck.some(
    (k) => alleSorten.find((s) => s.kennung === k)?.wirkung.art === "vorgabe",
  );
  return (
    <section
      className="abenteuer-menue"
      role="dialog"
      aria-label={tSpiel("deck.titel")}
      data-testid="abenteuer-deckwahl"
    >
      <h2>{tSpiel("deck.titel")}</h2>
      <p>{tSpiel("deck.hinweis", { max: DECKGROESSE })}</p>
      {waehlbar.length === 0 ? (
        <p>{tSpiel("deck.keine")}</p>
      ) : (
        <div className="abenteuer-deck">
          {waehlbar.map((k) => {
            const sorte = alleSorten.find((s) => s.kennung === k.kennung);
            const gewaehlt = deck.includes(k.kennung);
            return (
              <button
                key={k.kennung}
                type="button"
                className="abenteuer-karte"
                aria-pressed={gewaehlt}
                disabled={!gewaehlt && !deckErlaubt(deck, k.kennung, alleSorten)}
                onClick={() => schalte(k.kennung)}
              >
                {tSpiel(sorte?.name ?? k.kennung)}
                {k.anzahl > 1 && ` × ${k.anzahl}`}
              </button>
            );
          })}
        </div>
      )}
      {mitVorgabe && <p>{tSpiel("deck.vorgabeHinweis")}</p>}
      <button type="button" className="knopf-haupt" onClick={() => beiWahl(deck)}>
        {deck.length === 0 ? tSpiel("deck.ohne") : tSpiel("deck.los", { anzahl: deck.length })}
      </button>
    </section>
  );
}
