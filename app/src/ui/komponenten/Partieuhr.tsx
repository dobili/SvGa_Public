/**
 * Anzeige einer Schachuhr über oder unter dem Brett (Bildschirmentwurf „Partie“).
 *
 * Rolle im Gesamtbild: Zeigt Name und Restzeit einer Seite; die laufende Uhr ist hervorgehoben,
 * unter zehn Sekunden erscheint sie rot. Die Zeit rechnet spiel/uhr.ts.
 * Abhängigkeiten: spiel/uhr.ts.
 */
import type { Uhrstand } from "../../spiel/uhr";
import { restzeit, zeitAlsText } from "../../spiel/uhr";
import type { Farbe } from "../../schach/stellung";

/** Ab dieser Restzeit wird die Uhr rot. */
const KNAPP_MS = 10_000;

export function Partieuhr({
  name,
  farbe,
  uhr,
  jetztMs,
}: {
  name: string;
  farbe: Farbe;
  uhr: Uhrstand;
  jetztMs: number;
}) {
  const rest = restzeit(uhr, farbe, jetztMs);
  return (
    <div
      className="partieuhr"
      data-tour="partie-uhr"
      data-laeuft={uhr.laeuft === farbe}
      data-knapp={rest < KNAPP_MS}
      data-testid={`uhr-${farbe}`}
    >
      <span className="partieuhr-name">{name}</span>
      <span className="partieuhr-zeit" role="timer">
        {zeitAlsText(rest)}
      </span>
    </div>
  );
}
