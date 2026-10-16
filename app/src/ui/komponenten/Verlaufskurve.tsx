/**
 * Verlaufskurve der Bewertung über die ganze Partie (Vorschlag H).
 *
 * Rolle im Gesamtbild: Steht über der Auswertung (Auswertung.tsx). x: Halbzug, y: Bewertung aus
 * Sicht von Weiß, auf ±5 begrenzt (Matt am Rand). Die Fläche unter der Kurve ist hell (der Anteil
 * von Weiß wie im Balken), darüber dunkel; die Nulllinie ist eingezeichnet. Züge mit „?“ oder „??“ sind Punkte. Ein Tipp springt zur Stellung. Für
 * Bildschirmleser und Tastatur ist die Kurve ein Bild; springen geht dort über die Zugliste.
 * Abhängigkeiten: spiel/rueckblick.ts, spiel/auswertung.ts, i18n.
 */
import type { Zugurteil } from "../../spiel/auswertung";
import { kurvenpunkte } from "../../spiel/rueckblick";
import { t } from "../../i18n/sprache";

/** Zeichenfläche in SVG-Einheiten; das Bild passt sich der Breite an. */
const BREITE = 300;
const HOEHE = 80;
const PUNKTRADIUS = 3;

/**
 * Die Kurve mit Tippflächen je Stellung.
 *
 * Eingaben: Werte je Stellung, Urteile je Halbzug, Sprung zu einer Stelle (0 = Startstellung).
 */
export function Verlaufskurve({
  werte,
  urteile,
  beiStelle,
}: {
  werte: readonly number[];
  urteile: readonly Zugurteil[];
  beiStelle: (stelle: number) => void;
}) {
  const punkte = kurvenpunkte(werte, BREITE, HOEHE);
  if (punkte.length < 2) return null;
  const linie = punkte.map((p) => `${p.x},${p.y}`).join(" ");
  const mitte = HOEHE / 2;
  const flaeche = `0,${HOEHE} ${linie} ${BREITE},${HOEHE}`;
  const schritt = BREITE / (punkte.length - 1);
  const fehler = urteile.filter((u) => u.zeichen === "?" || u.zeichen === "??");
  return (
    <svg
      className="verlaufskurve"
      viewBox={`0 0 ${BREITE} ${HOEHE}`}
      role="img"
      aria-label={t("rueckblick.kurve")}
      data-testid="verlaufskurve"
    >
      <rect className="verlaufskurve-schwarz" x={0} y={0} width={BREITE} height={HOEHE} />
      <polygon className="verlaufskurve-weiss" points={flaeche} />
      <line className="verlaufskurve-null" x1={0} y1={mitte} x2={BREITE} y2={mitte} />
      <polyline className="verlaufskurve-linie" points={linie} />
      {fehler.map((u) => {
        const p = punkte[u.index + 1];
        return p ? (
          <circle
            key={u.index}
            className="verlaufskurve-fehler"
            cx={p.x}
            cy={p.y}
            r={PUNKTRADIUS}
          />
        ) : null;
      })}
      {punkte.map((p, stelle) => (
        <rect
          key={stelle}
          className="verlaufskurve-taste"
          x={p.x - schritt / 2}
          y={0}
          width={schritt}
          height={HOEHE}
          onClick={() => beiStelle(stelle)}
        />
      ))}
    </svg>
  );
}
