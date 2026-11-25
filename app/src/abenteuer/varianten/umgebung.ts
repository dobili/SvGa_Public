/**
 * Umgebung der Brettansichten aus den Werten der Spielhülle: Farbe, Stil aus der Gegnerstärke,
 * Name des Gegners, Ende mit Zugzahl.
 * Warum: eigene Datei, damit Variantenpartien.tsx nur Komponenten enthält (Fast Refresh).
 * Abhängigkeiten: anbindung/variantenpartien.ts (Typen), anbindung/huellentexte.ts, botwahl.ts.
 */
import type { Color } from "chessops/types";
import type { Variantenpartiewerte } from "../anbindung/variantenpartien";
import { gegnerName } from "../anbindung/huellentexte";
import { botstilFuer, type Zugbewerter } from "./botwahl";
import type { Variantenumgebung } from "./useBotzug";

/** Die Umgebung der Brettansicht aus den Werten der Hülle. */
export function umgebungAus(w: Variantenpartiewerte, bewerter: Zugbewerter): Variantenumgebung {
  const heldFarbe: Color = w.eigeneFarbe === "weiss" ? "white" : "black";
  return {
    bewerter,
    stil: botstilFuer(w.staerke),
    heldFarbe,
    startFen: w.partie.einstellung.startFen,
    gegner: gegnerName(w.partie),
    beiEnde: (ausgang, zuege) => w.beiEnde({ ausgang, halbzuege: zuege.length, zuege }),
  };
}
