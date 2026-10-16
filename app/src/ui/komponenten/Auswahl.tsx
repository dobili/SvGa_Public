/**
 * Eine Reihe von Chips, von denen genau einer gewählt ist (Einstellungen, Spielen).
 *
 * Rolle im Gesamtbild: Gemeinsame Auswahl für die Karte „Darstellung und Training“ und den
 * Spielen-Bildschirm (Seite, Stufe, Ziel, Uhr). Für Bildschirmleser eine Gruppe von Radioknöpfen.
 * Abhängigkeiten: React.
 */

/** Eine Reihe von Chips, von denen genau einer gewählt ist. */
export function Auswahl<T extends string>({
  name,
  werte,
  gewaehlt,
  text,
  beiWahl,
}: {
  name: string;
  werte: readonly T[];
  gewaehlt: T;
  text: (wert: T) => string;
  beiWahl: (wert: T) => void;
}) {
  return (
    <div className="einstellung-auswahl" role="radiogroup" aria-label={name}>
      <span className="einstellung-name">{name}</span>
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
