/**
 * Reiter (Tabs): eine Zeile gleich breiter Reiter, von denen genau einer gewählt ist.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): Statt Knöpfen, die auf dem Handy
 * umbrechen, liegen Reiter mit kleiner Schrift nebeneinander (Ansicht der Wertungskurve,
 * Bereiche der Darstellung). Für Bildschirmleser eine Reiterliste (role „tablist“); der Inhalt
 * darunter gehört zum gewählten Reiter.
 * Abhängigkeiten: React, Lucide-Symbole (optional je Reiter).
 */
import type { LucideIcon } from "lucide-react";

const SYMBOLGROESSE = 18;

export interface ReiterEintrag<T extends string> {
  readonly wert: T;
  readonly text: string;
  readonly symbol?: LucideIcon;
}

/**
 * Eine Reiterzeile.
 * Beispiel: Ansicht der Wertung mit „Wertung“, „Eröffnung“, „Mittelspiel“, „Endspiel“.
 * Sonderfall: Reicht die Breite nicht, lässt sich die Zeile seitlich schieben (kein Umbruch).
 */
export function Reiter<T extends string>({
  name,
  eintraege,
  gewaehlt,
  beiWahl,
}: {
  name: string;
  eintraege: readonly ReiterEintrag<T>[];
  gewaehlt: T;
  beiWahl: (wert: T) => void;
}) {
  return (
    <div className="reiterzeile" role="tablist" aria-label={name}>
      {eintraege.map(({ wert, text, symbol: Symbol }) => (
        <button
          key={wert}
          type="button"
          role="tab"
          aria-selected={wert === gewaehlt}
          className="reiter"
          onClick={() => beiWahl(wert)}
        >
          {Symbol && <Symbol size={SYMBOLGROESSE} aria-hidden="true" />}
          <span>{text}</span>
        </button>
      ))}
    </div>
  );
}
