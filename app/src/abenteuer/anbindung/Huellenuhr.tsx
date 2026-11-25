/**
 * Uhr der Spielhülle (aus PartieHuelle.tsx gelöst, 26.11.2026): Name und Restzeit einer Seite,
 * die laufende Uhr hervorgehoben, knappe Zeit rot, wie in der App.
 * Abhängigkeiten: spiel/uhr.ts, schach/stellung.ts (Farbe).
 */
import type { Farbe } from "../../schach/stellung";
import { restzeit, zeitAlsText, type Uhrstand } from "../../spiel/uhr";

/** Unter so viel Restzeit (ms) wird die Uhr rot, wie in der App. */
const KNAPP_MS = 10_000;

/**
 * Uhr einer Seite: Name und Restzeit; die laufende Uhr hervorgehoben, knappe Zeit rot. Die Uhr
 * des Gegners trägt eine eigene Klasse: hoch steht sie über dem Brett (huellenlage.css).
 */
export function Huellenuhr({
  uhr,
  farbe,
  name,
  jetztMs,
  gegnerseite = false,
}: {
  uhr: Uhrstand;
  farbe: Farbe;
  name: string;
  jetztMs: number;
  gegnerseite?: boolean;
}) {
  const rest = restzeit(uhr, farbe, jetztMs);
  return (
    <div
      className={`abenteuer-huelle-uhr ${gegnerseite ? "abenteuer-huelle-uhr-gegner" : ""}`}
      data-laeuft={uhr.laeuft === farbe}
      data-knapp={rest < KNAPP_MS}
      data-testid={`uhr-${farbe}`}
    >
      <span>{name}</span>
      <span className="abenteuer-huelle-zeit" role="timer">
        {zeitAlsText(rest)}
      </span>
    </div>
  );
}
