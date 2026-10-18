/**
 * Segmentleiste: eine Wahl aus wenigen kurzen Werten in einer Zeile, gleich breit, ohne Umbruch
 * (wie Reiter, aber als Auswahl).
 *
 * Rolle im Gesamtbild: Seit 0.2.87 für „Genauigkeit wie“ in der Auswertung (Spielstaerke.tsx,
 * Wunsch des Autors: die Knöpfe sollen nicht umbrechen). Für Bildschirmleser eine Gruppe von
 * Radioknöpfen wie Auswahl.tsx.
 * Abhängigkeiten: keine.
 */

/**
 * Eingaben: Name der Wahl (für Bildschirmleser), Werte, gewählter Wert, Beschriftung, Wahl.
 * Beispiel: Lichess | App | chess.com.
 */
export function Segmentwahl<T extends string>({
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
    <div className="segmentwahl" role="radiogroup" aria-label={name}>
      {werte.map((wert) => (
        <button
          key={wert}
          type="button"
          role="radio"
          aria-checked={wert === gewaehlt}
          className="segment"
          onClick={() => beiWahl(wert)}
        >
          {text(wert)}
        </button>
      ))}
    </div>
  );
}
