/**
 * Umgebung der Brettansichten aus den Werten der Spielhülle: Farbe, Stil aus der Gegnerstärke,
 * Name des Gegners, Ende mit Zugzahl.
 * Warum: eigene Datei, damit Variantenpartien.tsx nur Komponenten enthält (Fast Refresh).
 * Abhängigkeiten: anbindung/variantenpartien.ts (Typen), botwahl.ts, texte.
 */
import type { Color } from "chessops/types";
import type { Variantenpartiewerte } from "../anbindung/variantenpartien";
import { tSpiel } from "../texte/texte";
import { botstilFuer, type Zugbewerter } from "./botwahl";
import type { Variantenumgebung } from "./useBotzug";

/** Die Umgebung der Brettansicht aus den Werten der Hülle. */
export function umgebungAus(w: Variantenpartiewerte, bewerter: Zugbewerter): Variantenumgebung {
  const heldFarbe: Color = w.eigeneFarbe === "weiss" ? "white" : "black";
  return {
    bewerter,
    stil: botstilFuer(w.staerke),
    heldFarbe,
    gegner: tSpiel(w.auftrag.profil.name),
    beiEnde: (ausgang, zuege) => w.beiEnde({ ausgang, halbzuege: zuege.length, zuege }),
  };
}
