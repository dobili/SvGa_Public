/**
 * Die herausgehobene Karte (docs/spiel/29_Tischgespraech.md, Abschnitt Kartenfächer): groß über
 * dem Brett, mit Motiv, Name, Spruch der Karte und Ambroses Erklärung, dazu „Ausspielen“ und
 * „Zurück“. Geht die Karte gerade nicht, steht der Grund in einer Zeile und „Ausspielen“ ist aus.
 *
 * Rolle im Gesamtbild: Die Kartenleiste (anbindung/KartenleisteAnzeige.tsx) öffnet sie beim Tipp
 * auf eine Karte im Fächer. „Ausspielen“ ruft denselben Ablauf wie früher der Kartenknopf,
 * einschließlich der Sprechblasen des Tischgesprächs. Zurück-Taste und Escape schließen sie
 * (app/blattstapel.ts). Das Brett bleibt darunter unverändert; die Engine rechnet weiter.
 * Abhängigkeiten: anbindung/Spielkarte.tsx, app/blattstapel.ts, schnittstelle/karten.ts,
 * texte/texte.ts, Stil in spielkarte.css.
 */
import { useEffect, useId, useRef } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import type { Kartensorte } from "../schnittstelle/karten";
import { tSpiel } from "../texte/texte";
import { Kartenmotiv, type Kartenansicht } from "./Spielkarte";

/** Taste, die die Karte schließt. */
const ESCAPE = "Escape";

/**
 * Die Karte groß. `grund` ist der Textschlüssel, warum sie gerade nicht geht (null: sie geht).
 * Beispiel: Zweite Chance vor dem ersten Zug → Grund „Erst nach deinem ersten Zug.“, Ausspielen aus.
 */
export function Kartenblick({
  sorte,
  ansicht,
  grund,
  spielbar,
  beiAusspielen,
  beiZurueck,
}: {
  readonly sorte: Kartensorte;
  readonly ansicht: Kartenansicht;
  readonly grund: string | null;
  readonly spielbar: boolean;
  readonly beiAusspielen: () => void;
  readonly beiZurueck: () => void;
}) {
  const titel = useId();
  const erster = useRef<HTMLButtonElement>(null);
  // Der neueste Rückruf gilt; der Fokus springt nur beim Öffnen auf den ersten Knopf.
  const zurueck = useRef(beiZurueck);
  useEffect(() => {
    zurueck.current = beiZurueck;
  }, [beiZurueck]);
  useZurueckSchliesst(true, beiZurueck);
  useEffect(() => {
    erster.current?.focus();
    const taste = (e: KeyboardEvent) => {
      if (e.key === ESCAPE) zurueck.current();
    };
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  }, []);
  return (
    <div className="abenteuer-kartenblick-grund" onClick={beiZurueck}>
      <section
        className="abenteuer-kartenblick"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titel}
        data-stufe={sorte.stufe}
        data-ansicht={ansicht}
        data-testid="abenteuer-karte-gross"
        onClick={(e) => e.stopPropagation()}
      >
        <Kartenmotiv sorte={sorte} rueckseite={ansicht === "rueckseite"} />
        <h2 id={titel}>{tSpiel(sorte.name)}</h2>
        <p className="abenteuer-kartenblick-spruch">{tSpiel(sorte.spruch)}</p>
        <p className="abenteuer-kartenblick-erklaerung">
          <strong>{tSpiel("faecher.ambrose")}</strong> {tSpiel(`karte.${sorte.kennung}.erklaerung`)}
        </p>
        {grund && (
          <p className="abenteuer-kartenblick-hinweis" data-testid="abenteuer-karte-grund">
            {tSpiel(grund)}
          </p>
        )}
        <div className="knopfreihe">
          <button
            ref={spielbar ? erster : undefined}
            type="button"
            className="knopf-haupt"
            disabled={!spielbar}
            data-testid="abenteuer-karte-ausspielen"
            onClick={beiAusspielen}
          >
            {tSpiel("faecher.ausspielen")}
          </button>
          <button
            ref={spielbar ? undefined : erster}
            type="button"
            className="knopf-zweit"
            data-testid="abenteuer-karte-zurueck"
            onClick={beiZurueck}
          >
            {tSpiel("faecher.zurueck")}
          </button>
        </div>
      </section>
    </div>
  );
}
