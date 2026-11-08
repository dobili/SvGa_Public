/**
 * Die Deckwahl vor einer Partie: bis zu DECKGROESSE Karten aus dem Besitz (Regelwerk R24) und,
 * wo die Begegnung es erlaubt, die Bedenkzeit (Schritt 13: ohne Uhr, Schnellschach, Blitz).
 *
 * Rolle im Gesamtbild: React-Overlay über der Welt, aufgerufen von der Oberwelt, wenn eine
 * Begegnung Karten erlaubt und der Leser welche besitzt. „Ohne Karten spielen“ ist immer möglich
 * (Gold braucht keine). Welche Karte ins Deck darf, entscheidet regeln/karten.ts. Die Bedenkzeit
 * kostet keine Nadel (docs/spiel/08, Z2): Mit Uhr gerät der Gegner in Zeitnot und spielt schwächer.
 * Abhängigkeiten: regeln/karten.ts, regeln/zeitkarten.ts, schnittstelle/karten.ts, texte/texte.ts, app/blattstapel.ts.
 */
import { useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import type { Kartendaten } from "../daten/laden";
import { deckErlaubt } from "../regeln/karten";
import { ZEITKLASSEN, type Zeitklasse } from "../regeln/zeitkarten";
import { DECKGROESSE, type Kartenbesitz, type Kartensorte } from "../schnittstelle/karten";
import { tSpiel } from "../texte/texte";

/** Die Zeitklassen in der Reihenfolge der Knöpfe. */
const KLASSEN: readonly Zeitklasse[] = ["ohne", "schnell", "blitz"];

export function Deckwahl({
  besitz,
  sorten,
  mitKarten,
  groesse = DECKGROESSE,
  sprueche = false,
  zeitwahl,
  farbeFrei = false,
  mentorGesperrt = false,
  freieKarten = [],
  steckbrief = [],
  beiWahl,
  beiAbbruch,
}: {
  readonly besitz: readonly Kartenbesitz[];
  readonly sorten: readonly Kartendaten[];
  /** Erlaubt die Begegnung Karten (Story-Sperre, R24)? */
  readonly mitKarten: boolean;
  /** Deckgröße: 3, mit der Kartentasche 4. */
  readonly groesse?: number;
  /** Sind Sprüche erlaubt (nur gegen Straßengegner)? Sonst stehen sie nicht zur Wahl. */
  readonly sprueche?: boolean;
  /** Darf der Leser die Bedenkzeit wählen? */
  readonly zeitwahl: boolean;
  /** Wird die Farbe ausgelost? Nur dann gibt es die Karte Farbwahl in der Auswahl. */
  readonly farbeFrei?: boolean;
  /** Regel R29: Mentor-Zug zwischen Tiefpunkt und Versöhnung gesperrt. */
  readonly mentorGesperrt?: boolean;
  /** Freie Karten der Begegnung (R29), liegen ohne Besitz zusätzlich im Deck. */
  readonly freieKarten?: readonly string[];
  /** Was die Lupe des Uhrmachers über den Gegner verrät (leer ohne Lupe). */
  readonly steckbrief?: readonly string[];
  readonly beiWahl: (
    deck: readonly string[],
    zeit: Zeitklasse,
    farbe: "white" | "black" | null,
  ) => void;
  readonly beiAbbruch: () => void;
}) {
  const [deck, setzeDeck] = useState<readonly string[]>([]);
  const [zeit, setzeZeit] = useState<Zeitklasse>("ohne");
  const [farbe, setzeFarbe] = useState<"white" | "black">("white");
  useZurueckSchliesst(true, beiAbbruch);
  const alleSorten = sorten as unknown as readonly Kartensorte[];
  const waehlbar = besitz.filter((k) => {
    const sorte = alleSorten.find((s) => s.kennung === k.kennung);
    if (sorte?.spruch_art && !sprueche) return false;
    if (sorte?.wirkung.art === "farbwahl" && !farbeFrei) return false;
    if (sorte?.wirkung.art === "mentorzug" && mentorGesperrt) return false;
    return sorte !== undefined && sorte.zeitpunkt !== "nachher";
  });
  const schalte = (kennung: string) => {
    if (deck.includes(kennung)) setzeDeck(deck.filter((k) => k !== kennung));
    else if (deckErlaubt(deck, kennung, alleSorten, groesse)) setzeDeck([...deck, kennung]);
  };
  const mitFarbwahl = deck.some(
    (k) => alleSorten.find((s) => s.kennung === k)?.wirkung.art === "farbwahl",
  );
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
      {steckbrief.length > 0 && (
        <div className="abenteuer-steckbrief" data-testid="abenteuer-lupe">
          <h3>{tSpiel("steckbrief.titel")}</h3>
          <ul>
            {steckbrief.map((zeile) => (
              <li key={zeile}>{zeile}</li>
            ))}
          </ul>
        </div>
      )}
      {zeitwahl && (
        <>
          <h3>{tSpiel("deck.zeit")}</h3>
          <div className="abenteuer-deck" role="radiogroup" aria-label={tSpiel("deck.zeit")}>
            {KLASSEN.map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                className="abenteuer-karte"
                aria-checked={zeit === k}
                data-testid={`abenteuer-zeit-${k}`}
                onClick={() => setzeZeit(k)}
              >
                {tSpiel(`deck.zeit.${k}`)}
              </button>
            ))}
          </div>
          {ZEITKLASSEN[zeit] && <p>{tSpiel("deck.zeitHinweis")}</p>}
        </>
      )}
      {mitKarten && <p>{tSpiel("deck.hinweis", { max: groesse })}</p>}
      {!mitKarten ? null : waehlbar.length === 0 ? (
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
                disabled={!gewaehlt && !deckErlaubt(deck, k.kennung, alleSorten, groesse)}
                onClick={() => schalte(k.kennung)}
              >
                {tSpiel(sorte?.name ?? k.kennung)}
                {k.anzahl > 1 && ` × ${k.anzahl}`}
              </button>
            );
          })}
        </div>
      )}
      {deck.map((kennung) => (
        <p key={kennung} className="abenteuer-karte-erklaerung">
          {tSpiel(`karte.${kennung}.erklaerung`)}
        </p>
      ))}
      {mitVorgabe && <p>{tSpiel("deck.vorgabeHinweis")}</p>}
      {freieKarten.length > 0 && (
        <p data-testid="abenteuer-freie-karten">
          {tSpiel("deck.frei", {
            karten: freieKarten
              .map((k) => tSpiel(alleSorten.find((s) => s.kennung === k)?.name ?? k))
              .join(", "),
          })}
        </p>
      )}
      {mitFarbwahl && (
        <div className="abenteuer-deck" role="radiogroup" aria-label={tSpiel("deck.farbe")}>
          {(["white", "black"] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              className="abenteuer-karte"
              aria-checked={farbe === f}
              data-testid={`abenteuer-farbe-${f}`}
              onClick={() => setzeFarbe(f)}
            >
              {tSpiel(`deck.farbe.${f}`)}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className="knopf-haupt"
        data-testid="abenteuer-deck-los"
        onClick={() => beiWahl(deck, zeit, mitFarbwahl ? farbe : null)}
      >
        {deck.length === 0 ? tSpiel("deck.ohne") : tSpiel("deck.los", { anzahl: deck.length })}
      </button>
    </section>
  );
}
