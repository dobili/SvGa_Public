/**
 * Die Sprechblasen am Brett (docs/spiel/29_Tischgespraech.md, Abschnitt 2): oben der Gegner oder
 * wer die Aufgabe stellt, unten Ambrose (halb durchsichtig) oder der Held, je mit Porträt in der
 * Stimmung der Zeile.
 *
 * Rolle im Gesamtbild: TischblasenRahmen umschließt die Spielhülle einer Partie oder Rätselrunde
 * (PartieHuelle.tsx, AufgabenAnsicht.tsx); wer sprechen will, holt sich mit useTischblasen() die
 * Steuerung und legt Zeilen hinein (Warteschlange und Vorrang: anbindung/tischblasen.ts). Die
 * Blase legt sich nie aufs Brett und hält nichts an: Sie verschwindet nach der Lesedauer oder auf
 * Tipp. Der Kopf der Hülle zeigt das Porträt in der Stimmung der oberen Zeile (useKopfstimmung).
 * Abhängigkeiten: anbindung/tischblasen.ts, dialog/Portraet.tsx, texte/texte.ts.
 */
import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import { Portraet } from "../dialog/Portraet";
import { tSpiel } from "../texte/texte";
import {
  LEERE_BLASEN,
  lesedauer,
  mitZeile,
  ohneErste,
  type Blasenstand,
  type Blasenzeile,
  type Lage,
} from "./tischblasen";
import { TischKontext, useTischblasen, type Blasensteuerung } from "./tischkontext";

type Aktion =
  | { readonly art: "zeige"; readonly zeile: Blasenzeile }
  | { readonly art: "schliesse"; readonly lage: Lage; readonly schluessel: string };

function schritt(stand: Blasenstand, aktion: Aktion): Blasenstand {
  return aktion.art === "zeige"
    ? mitZeile(stand, aktion.zeile)
    : ohneErste(stand, aktion.lage, aktion.schluessel);
}

/** Der Rahmen mit dem Stand der Blasen; ohne ihn sprechen die Sprecher ins Leere (null). */
export function TischblasenRahmen({ children }: { readonly children: ReactNode }) {
  const [stand, sende] = useReducer(schritt, LEERE_BLASEN);
  const steuerung = useMemo<Blasensteuerung>(
    () => ({
      stand,
      zeige: (zeile) => sende({ art: "zeige", zeile }),
      schliesse: (lage, schluessel) => sende({ art: "schliesse", lage, schluessel }),
    }),
    [stand],
  );
  return <TischKontext value={steuerung}>{children}</TischKontext>;
}

/** Eine gezeigte Zeile: Porträt, Name, Text; Tipp oder Lesedauer blendet sie aus. */
function Zeile({ zeile, beiEnde }: { readonly zeile: Blasenzeile; readonly beiEnde: () => void }) {
  useEffect(() => {
    const uhr = window.setTimeout(beiEnde, lesedauer(zeile.text));
    return () => window.clearTimeout(uhr);
    // Einmal je Zeile; der Rückruf ist bei jedem Zeichnen neu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zeile.schluessel]);
  return (
    <button
      type="button"
      className="abenteuer-tischblase"
      data-lage={zeile.lage}
      data-erscheinung={zeile.geist ? "geist" : undefined}
      data-testid={zeile.testid}
      aria-label={tSpiel("huelle.momentSchliessen")}
      onClick={beiEnde}
    >
      {zeile.sprecher && (
        <Portraet sprecher={zeile.sprecher} stimmung={zeile.stimmung} zeile={zeile.text} />
      )}
      <span role="status" aria-live="polite">
        {zeile.name && <strong>{zeile.name}</strong>} {zeile.text}
      </span>
    </button>
  );
}

/** Die Blase einer Lage: zeigt die erste wartende Zeile, sonst nichts. */
export function Tischblase({ lage }: { readonly lage: Lage }) {
  const steuerung = useTischblasen();
  const zeile = steuerung?.stand[lage][0];
  if (!steuerung || !zeile) return null;
  return (
    <Zeile
      key={zeile.schluessel}
      zeile={zeile}
      beiEnde={() => steuerung.schliesse(lage, zeile.schluessel)}
    />
  );
}
