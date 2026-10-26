/**
 * Eine Reihe von Chips, von denen genau einer gewählt ist (Einstellungen, Spielen).
 *
 * Rolle im Gesamtbild: Gemeinsame Auswahl für die Karte „Einstellungen“ und den
 * Spielen-Bildschirm (Seite, Stufe, Ziel, Uhr). Für Bildschirmleser eine Gruppe von Radioknöpfen.
 * Optional mit Zeichen vor dem Namen (DS24), etwa der Uhr vor „Bedenkzeit“, und seit 0.3.2 mit
 * einem Zeichen in jedem Chip (`zeichen`), etwa Bot und Menschen bei „Gegner“.
 * Abhängigkeiten: React, Titelsymbol.
 */
import type { ReactNode } from "react";
import { Titelsymbol, type Abschnittsart } from "./Titelsymbol";

/** Eine Reihe von Chips, von denen genau einer gewählt ist. */
export function Auswahl<T extends string>({
  name,
  werte,
  gewaehlt,
  text,
  beiWahl,
  symbol,
  zeichen,
}: {
  name: string;
  /** Zeichen vor dem Namen (DS24); ohne Angabe nur der Name. */
  symbol?: Abschnittsart;
  werte: readonly T[];
  gewaehlt: T;
  text: (wert: T) => string;
  beiWahl: (wert: T) => void;
  /** Zeichen vor dem Text jedes Chips (für Bildschirmleser verborgen, der Text steht daneben). */
  zeichen?: (wert: T) => ReactNode;
}) {
  return (
    <div className="einstellung-auswahl" role="radiogroup" aria-label={name}>
      <span className="einstellung-name">
        {symbol && <Titelsymbol art={symbol} />}
        {name}
      </span>
      <div className="chipreihe">
        {werte.map((wert) => (
          <button
            key={wert}
            type="button"
            role="radio"
            aria-checked={wert === gewaehlt}
            className="chip"
            onClick={() => beiWahl(wert)}
          >
            {zeichen && (
              <span className="chip-zeichen" aria-hidden="true">
                {zeichen(wert)}
              </span>
            )}
            {text(wert)}
          </button>
        ))}
      </div>
    </div>
  );
}
