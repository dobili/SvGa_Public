/**
 * Rechnet nach „Erst selbst denken“ das Urteil der Engine über die eingeschätzte Stellung (NA1).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (19.10.2026): Nach der eigenen Einschätzung steht die
 * Antwort der Engine statt der Aufforderung, selbst zu vergleichen. Die Karte dazu ist
 * EigeneEinschaetzung in SelbstDenken.tsx; das Urteil selbst kommt aus analyse/einschaetzung.ts.
 * Abhängigkeiten: engine/engineDienst.ts, analyse/einschaetzung.ts, React.
 */
import { useEffect, useState } from "react";
import { einschaetzungDerEngine, type Einschaetzung } from "../../../analyse/einschaetzung";
import { AuftragAbgebrochen, engine } from "../../../engine/engineDienst";
import type { Wert } from "../../../engine/uci";

export type Engineeinschaetzung =
  | { readonly art: "rechnet" }
  | { readonly art: "fertig"; readonly wert: Wert; readonly urteil: Einschaetzung }
  | { readonly art: "fehler" };

/**
 * Eingabe: FEN der eingeschätzten Stellung, oder null (dann rechnet nichts).
 * Ausgabe: Stand des Urteils. Beispiel: Abb. 1.26 → „rechnet“, nach 2,5 s „fertig“, +0,3, gleich.
 * Sonderfall: Bricht ein neuer Engine-Auftrag diesen ab (etwa der Knopf „Engine“), bleibt der
 * Stand „rechnet“, bis der Leser die Abbildung neu öffnet; das ist selten und schadet nicht.
 */
export function useEngineEinschaetzung(fen: string | null): Engineeinschaetzung | null {
  const [ergebnis, setzeErgebnis] = useState<{
    fen: string;
    stand: Engineeinschaetzung;
  } | null>(null);
  useEffect(() => {
    if (!fen) return undefined;
    let aktiv = true;
    engine
      .bewerte(fen)
      .then((bewertung) => {
        const beste = bewertung.varianten[0];
        if (!aktiv) return;
        setzeErgebnis({
          fen,
          stand: beste
            ? { art: "fertig", wert: beste.wert, urteil: einschaetzungDerEngine(beste.wert) }
            : { art: "fehler" },
        });
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        console.error("Urteil der Engine zur Einschätzung fehlgeschlagen:", fehler);
        setzeErgebnis({ fen, stand: { art: "fehler" } });
      });
    return () => {
      aktiv = false;
    };
  }, [fen]);
  if (!fen) return null;
  return ergebnis?.fen === fen ? ergebnis.stand : { art: "rechnet" };
}
