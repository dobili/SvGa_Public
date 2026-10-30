/**
 * Ein Orden: Medaille mit Band und dem Zeichen des Rings, aus dem er entstand.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (26.10.2026): Ist ein Fortschrittsring voll, verwandelt er
 * sich dauerhaft in einen Orden, passend zum Zeichen des Rings. Die Karte „Dein Fortschritt“
 * (Symbolringe.tsx) und die Gratulation (Ringfeier.tsx) zeigen ihn golden; die Startanimation
 * zeigt noch nicht verdiente Orden als Silhouette.
 * Abhängigkeiten: lucide-react (Zeichen), Stil in ui/stil/fortschritt.css.
 */
import type { LucideIcon } from "lucide-react";

/** Maße der Zeichnung (Einheiten des viewBox). */
const BREITE = 64;
const HOEHE = 80;
const MITTE_X = BREITE / 2;
const MITTE_Y = 48;
const RADIUS = 26;
const INNEN = 20;
const ZEICHEN = 24;

/**
 * Die Medaille. `silhouette`: nur der Umriss in einer ruhigen Farbe (noch nicht verdient).
 * Beispiel: voller Ring „Übungen gelöst“ → goldene Medaille mit Klemmbrett.
 */
export function Orden({
  symbol: Zeichen,
  beschriftung,
  silhouette = false,
  klasse = "",
}: {
  symbol: LucideIcon;
  beschriftung: string;
  silhouette?: boolean;
  klasse?: string;
}) {
  return (
    <svg
      className={`orden ${silhouette ? "orden-silhouette" : ""} ${klasse}`.trim()}
      viewBox={`0 0 ${BREITE} ${HOEHE}`}
      role="img"
      aria-label={beschriftung}
    >
      <path className="orden-band" d="M18 0 H30 L36 26 H24 Z" />
      <path className="orden-band orden-band-zwei" d="M34 0 H46 L40 26 H28 Z" />
      <circle className="orden-rand" cx={MITTE_X} cy={MITTE_Y} r={RADIUS} />
      <circle className="orden-scheibe" cx={MITTE_X} cy={MITTE_Y} r={INNEN} />
      {!silhouette && (
        <Zeichen
          className="orden-zeichen"
          x={MITTE_X - ZEICHEN / 2}
          y={MITTE_Y - ZEICHEN / 2}
          width={ZEICHEN}
          height={ZEICHEN}
          aria-hidden="true"
        />
      )}
    </svg>
  );
}
