/**
 * Werkzeuge als Symbole am Brett: Zählen, Ziehen, Engine, Röntgen und Warnsignale.
 *
 * Rolle im Gesamtbild: Werkzeug-Umbau 0.2.30 (Vorschlag C, Ebene 1; Entscheidung des Autors vom
 * 15.10.2026): Diese Werkzeuge braucht man in jeder Phase („In jeder Phase zuerst Warnsignale und
 * Röntgen“, Kapitel 12), deshalb sitzen sie unten rechts am Brett neben „Brett drehen“, sobald das
 * Buch sie eingeführt hat. Seit 0.2.31 auch „Zählen“ (Wunsch des Autors: immer zugänglich und
 * arbeitet mit dem Brett). Ein zweites Tippen wählt ab, bei allen Symbolen.
 * Abhängigkeiten: werkzeugordnung.ts, useWerkzeugwahl.ts, i18n, lucide-react.
 */
import { Calculator, Cpu, Move, ScanEye, TriangleAlert, type LucideIcon } from "lucide-react";
import { t } from "../../i18n/sprache";
import type { Werkzeugwahl } from "./Werkzeugleiste";
import type { Werkzeugwahlstand } from "./useWerkzeugwahl";
import { brettsymbole } from "./werkzeugordnung";

const SYMBOLGROESSE = 20;

/** Das Bild je Werkzeug am Brett. */
function bildVon(wahl: Werkzeugwahl): LucideIcon {
  if (wahl === "zaehlen") return Calculator;
  if (wahl === "ziehen") return Move;
  if (wahl === "engine") return Cpu;
  if (wahl === "k1-roentgen") return ScanEye;
  return TriangleAlert;
}

/**
 * Die Symbole eines Kapitels als Knöpfe (aria-pressed, Name als Beschriftung für Bildschirmleser).
 * Beispiel: Abb. 7.18 → Zählen, Ziehen, Engine, Röntgen, W1–W7.
 */
export function Brettsymbole({
  kapitel,
  mitRegeln,
  werkzeug,
}: {
  kapitel: number;
  mitRegeln: boolean;
  werkzeug: Werkzeugwahlstand;
}) {
  return (
    <>
      {brettsymbole(kapitel, mitRegeln).map((symbol) => {
        const Bild = bildVon(symbol.wahl);
        const name = t(symbol.name);
        const kurz = t(symbol.kurz);
        const gewaehlt = werkzeug.buendel === null && werkzeug.wahl === symbol.wahl;
        return (
          <button
            key={symbol.wahl}
            type="button"
            className="knopf-symbol brettschalter brettwerkzeug"
            aria-pressed={gewaehlt}
            aria-label={name}
            title={name}
            onClick={() => werkzeug.tippeSymbol(symbol.wahl)}
          >
            <Bild size={SYMBOLGROESSE} aria-hidden="true" />
            <span className="brettschalter-text" aria-hidden="true">
              {kurz}
            </span>
          </button>
        );
      })}
    </>
  );
}
