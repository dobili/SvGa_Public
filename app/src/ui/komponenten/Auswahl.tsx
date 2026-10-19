/**
 * Eine Reihe von Chips, von denen genau einer gewählt ist (Einstellungen, Spielen).
 *
 * Rolle im Gesamtbild: Gemeinsame Auswahl für die Karte „Einstellungen“ und den
 * Spielen-Bildschirm (Seite, Stufe, Ziel, Uhr). Für Bildschirmleser eine Gruppe von Radioknöpfen.
 * Seit 0.2.101 (DS24) optional mit Zeichen vor dem Namen, etwa der Uhr vor „Bedenkzeit“.
 * Abhängigkeiten: React, Titelsymbol.
 */
import { Titelsymbol, type Abschnittsart } from "./Titelsymbol";

/** Eine Reihe von Chips, von denen genau einer gewählt ist. */
export function Auswahl<T extends string>({
  name,
  werte,
  gewaehlt,
  text,
  beiWahl,
  symbol,
}: {
  name: string;
  /** Zeichen vor dem Namen (DS24); ohne Angabe nur der Name. */
  symbol?: Abschnittsart;
  werte: readonly T[];
  gewaehlt: T;
  text: (wert: T) => string;
  beiWahl: (wert: T) => void;
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
            {text(wert)}
          </button>
        ))}
      </div>
    </div>
  );
}
