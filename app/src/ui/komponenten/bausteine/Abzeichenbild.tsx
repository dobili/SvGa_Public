/**
 * Das Bild eines Abzeichens, ein Sechseck mit Rand und Zeichen.
 *
 * Rolle im Gesamtbild: Abzeichen (fortschritt/abzeichen.ts) sollen sich auf einen Blick von den
 * Orden (Orden.tsx, Medaille mit Band) unterscheiden: Orden stehen für volle Ringe, Abzeichen für
 * besondere Leistungen. Das Gitter im Profil zeigt noch nicht verdiente Abzeichen als graue
 * Silhouette wie die Startanimation die Orden; die Meldung zeigt es groß.
 * Abhängigkeiten: lucide-react (Zeichen), Stil in ui/stil/abzeichen.css.
 */
import type { LucideIcon } from "lucide-react";

/** Maße der Zeichnung (Einheiten des viewBox). */
const GROESSE = 64;
const MITTE = GROESSE / 2;
const ZEICHEN = 26;
/** Sechseck außen und innen (Spitzen oben und unten). */
const AUSSEN = "32,2 58,17 58,47 32,62 6,47 6,17";
const INNEN = "32,9 52,20.5 52,43.5 32,55 12,43.5 12,20.5";

/**
 * Das Abzeichenbild. `silhouette`: nur grauer Umriss mit blassem Zeichen (noch nicht verdient).
 * Beispiel: Abzeichen „Erste Partie“ → goldenes Sechseck mit Fahne.
 */
export function Abzeichenbild({
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
      className={`abzeichenbild ${silhouette ? "abzeichenbild-silhouette" : ""} ${klasse}`.trim()}
      viewBox={`0 0 ${GROESSE} ${GROESSE}`}
      role="img"
      aria-label={beschriftung}
    >
      <polygon className="abzeichenbild-rand" points={AUSSEN} />
      <polygon className="abzeichenbild-flaeche" points={INNEN} />
      <Zeichen
        className="abzeichenbild-zeichen"
        x={MITTE - ZEICHEN / 2}
        y={MITTE - ZEICHEN / 2}
        width={ZEICHEN}
        height={ZEICHEN}
        aria-hidden="true"
      />
    </svg>
  );
}
