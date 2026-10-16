/**
 * Engine-Abschnitte in der Werkzeugkarte: bei „Gegner?“ Plan und Vorbeugezug (GegnerKarte, seit
 * 0.2.32, Vorschlag D4), bei „Erzwingende Züge“ jeder Kandidat bis zur Ruhe (ErzwingendKarte,
 * seit 0.2.33, Vorschlag B1), bei der Zielbilanz die Nachrechnung angegriffener Zentrumsbauern
 * (ZentrumKarte, seit 0.2.33, C1.1). Auch die Partie gegen die Engine nutzt diese Auswahl.
 *
 * Rolle im Gesamtbild: hält die Auswahl aus dem Abbildung-Bildschirm heraus, damit er unter 400
 * Zeilen bleibt. Ein neuer Schlüssel (Stellung, Sicht) legt die Karte neu an und startet die
 * Rechnung der Engine von vorn.
 * Abhängigkeiten: GegnerKarte.tsx, ErzwingendKarte.tsx, ZentrumKarte.tsx, Werkzeugleiste.tsx.
 */
import type { Color } from "chessops/types";
import type { Markierung } from "../../analyse/werkzeug";
import type { Stellung } from "../../schach/stellung";
import { ErzwingendKarte } from "./ErzwingendKarte";
import { GegnerKarte } from "./GegnerKarte";
import type { Werkzeugwahl } from "./Werkzeugleiste";
import { ZentrumKarte } from "./ZentrumKarte";

/**
 * Der Engine-Abschnitt zum gewählten Werkzeug, oder nichts.
 *
 * Eingaben: Werkzeugwahl, Stellung, Seite der Sicht, Rückrufe für die Markierungen am Brett.
 * Beispiel: Abb. 7.14 mit „Erzwingende Züge“ → die Engine rechnet Te8+, Th8+, Sxf7 … bis zur Ruhe.
 * Sonderfall: Lehrbilder ohne Regeln bekommen keinen Engine-Abschnitt.
 */
export function Werkzeugzusatz({
  wahl,
  stellung,
  eigen,
  beiGegnerplan,
  beiErzwingend,
}: {
  wahl: Werkzeugwahl | null;
  stellung: Stellung;
  eigen: Color;
  beiGegnerplan: (markierungen: Markierung[]) => void;
  beiErzwingend: (markierungen: Markierung[]) => void;
}) {
  if (!stellung.regeln) return null;
  if (wahl === "k6-gegner")
    return <GegnerKarte key={stellung.fen} stellung={stellung} beiMarkierungen={beiGegnerplan} />;
  if (wahl === "k7-erzwingend")
    return (
      <ErzwingendKarte
        key={`${stellung.fen} ${eigen}`}
        stellung={stellung}
        eigen={eigen}
        beiMarkierungen={beiErzwingend}
      />
    );
  if (wahl === "k2-zielbilanz") return <ZentrumKarte key={stellung.fen} stellung={stellung} />;
  return null;
}
