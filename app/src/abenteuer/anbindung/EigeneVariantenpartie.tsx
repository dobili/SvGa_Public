/**
 * Eigene Variantenpartie in der Spielhülle (Tandem, Ente, Nebel; Auftrag des Hauptchats,
 * 26.11.2026): Statt des Bretts der Hülle spielt die angemeldete Komponente
 * (variantenpartien.ts); ihr Ergebnis wird das Ende der Partie der App (eigenepartie.ts).
 * Abhängigkeiten: variantenpartien.ts, eigenepartie.ts, ui/komponenten/partie/botzug.ts (Speicher
 * und Stufe), engine/stufen.ts.
 */
import { createElement } from "react";
import { stufe } from "../../engine/stufen";
import { aktuelleFen, type Partie } from "../../spiel/partie";
import { aendereNeueste, stufeFuer } from "../../ui/komponenten/partie/botzug";
import { endeAusErgebnis } from "./eigenepartie";
import { variantenpartie } from "./variantenpartien";

/** Die Komponente der Variante, solange die Partie läuft. */
export function EigeneVariantenpartie({ partie }: { partie: Partie }) {
  const Komponente = variantenpartie(partie.einstellung.abenteuer?.variante ?? "");
  if (!Komponente) return null;
  const staerke = stufe(stufeFuer(partie, aktuelleFen(partie))).wertung;
  return (
    <div className="abenteuer-partie-brett" data-testid="abenteuer-eigene-partie">
      {/* Die Komponente kommt aus der Anmeldung (fest je Variante), nicht aus diesem Render. */}
      {createElement(Komponente, {
        partie,
        staerke,
        eigeneFarbe: partie.einstellung.eigeneFarbe === "white" ? "weiss" : "schwarz",
        beiEnde: (ergebnis) => aendereNeueste(partie.id, (p) => endeAusErgebnis(p, ergebnis)),
      })}
    </div>
  );
}
