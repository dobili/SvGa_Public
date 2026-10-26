/**
 * Das Bild der Wertungskurve (SVG): Rasterlinien, Linie, ein Punkt je Partie (grün Sieg, rot
 * Niederlage, grau Remis), Datum links und rechts. Seit 0.2.125 aus Wertungskurve.tsx ausgelagert,
 * damit die Karte (Zeitklassen, Phasen, vorläufige Wertung) unter 400 Zeilen bleibt.
 *
 * Rolle im Gesamtbild: Zeichnet, was Wertungskurve.tsx auswählt; bei den Partien steht jede gleich
 * weit von der nächsten, beim Zeitraum liegt jede an ihrer Zeit, der rechte Rand ist jetzt. Für
 * Bildschirmleser trägt jeder Punkt Datum, Ergebnis, Gegner und Wertung.
 * Abhängigkeiten: spiel/wertung.ts (Wertungspunkt, Wertungsbereich), i18n.
 */
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Punktwert, Wertungsbereich, Wertungspunkt } from "../../../spiel/wertung";

const ERGEBNISTEXT: Readonly<Record<Punktwert, Textschluessel>> = {
  1: "ich.wertung.sieg",
  0.5: "ich.wertung.remis",
  0: "ich.wertung.niederlage",
};
const ERGEBNISKLASSE: Readonly<Record<Punktwert, string>> = {
  1: "wertungskurve-sieg",
  0.5: "wertungskurve-remis",
  0: "wertungskurve-niederlage",
};

/** Zeichenfläche in SVG-Einheiten; das Bild passt sich der Breite an. */
const BREITE = 300;
const HOEHE = 110;
/** Rand links für die Zahlen der Wertung, unten für die Daten. */
const RAND_LINKS = 34;
const RAND_RECHTS = 8;
const RAND_OBEN = 6;
const RAND_UNTEN = 14;
const PUNKTRADIUS = 3;
const SCHRIFT = 9;
/** Die Achse rastet auf runde Wertungen. */
const SCHRITT = 50;
/** So viele Rasterlinien höchstens. */
const RASTERLINIEN = 4;
/** „17.10.2026“ aus einer ISO-Zeit. */
function datum(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

/** Der Wertebereich der Achse: runde Grenzen um die Punkte, mindestens ein Schritt Luft. */
function achse(punkte: readonly Wertungspunkt[]): { unten: number; oben: number } {
  const werte = punkte.map((p) => p.wertung);
  const unten = Math.floor((Math.min(...werte) - 1) / SCHRITT) * SCHRITT;
  const oben = Math.ceil((Math.max(...werte) + 1) / SCHRITT) * SCHRITT;
  return { unten, oben };
}

/** Die Lage der Punkte in der Zeichenfläche. */
function lagen(
  punkte: readonly Wertungspunkt[],
  bereich: Wertungsbereich,
  jetzt: Date,
): { x: number; y: number; punkt: Wertungspunkt }[] {
  const { unten, oben } = achse(punkte);
  const breite = BREITE - RAND_LINKS - RAND_RECHTS;
  const hoehe = HOEHE - RAND_OBEN - RAND_UNTEN;
  const y = (w: number) => RAND_OBEN + hoehe - ((w - unten) / (oben - unten)) * hoehe;
  if (bereich.art === "partien") {
    const schritt = punkte.length > 1 ? breite / (punkte.length - 1) : 0;
    return punkte.map((punkt, i) => ({
      x: RAND_LINKS + (punkte.length > 1 ? i * schritt : breite),
      y: y(punkt.wertung),
      punkt,
    }));
  }
  const ende = jetzt.getTime();
  const anfang = ende - bereich.tage * 24 * 60 * 60 * 1000;
  return punkte.map((punkt) => ({
    x: RAND_LINKS + ((new Date(punkt.zeit).getTime() - anfang) / (ende - anfang)) * breite,
    y: y(punkt.wertung),
    punkt,
  }));
}

/** Die Rasterlinien mit Beschriftung: Zwischenwerte in ganzen Schritten. */
function raster(punkte: readonly Wertungspunkt[]): number[] {
  const { unten, oben } = achse(punkte);
  const stufen = Math.max(1, Math.ceil((oben - unten) / SCHRITT / RASTERLINIEN));
  const linien: number[] = [];
  for (let w = unten; w <= oben; w += stufen * SCHRITT) linien.push(w);
  return linien;
}

/**
 * Zeichnet die Wertungskurve: Linie mit einem Punkt je Partie (grün Sieg, rot Niederlage, grau
 * Remis) und Datum am Rand.
 */
export function Kurve({
  punkte,
  bereich,
  jetzt,
}: {
  punkte: readonly Wertungspunkt[];
  bereich: Wertungsbereich;
  jetzt: Date;
}) {
  const { unten, oben } = achse(punkte);
  const hoehe = HOEHE - RAND_OBEN - RAND_UNTEN;
  const yVon = (w: number) => RAND_OBEN + hoehe - ((w - unten) / (oben - unten)) * hoehe;
  const lage = lagen(punkte, bereich, jetzt);
  const erste = punkte[0];
  const letzte = punkte[punkte.length - 1];
  return (
    <svg
      className="wertungskurve"
      viewBox={`0 0 ${BREITE} ${HOEHE}`}
      role="img"
      aria-label={t("ich.wertung.kurve")}
      data-testid="wertungskurve"
    >
      {raster(punkte).map((w) => (
        <g key={w} className="wertungskurve-raster">
          <line x1={RAND_LINKS} y1={yVon(w)} x2={BREITE - RAND_RECHTS} y2={yVon(w)} />
          <text x={RAND_LINKS - 3} y={yVon(w) + SCHRIFT / 3} fontSize={SCHRIFT} textAnchor="end">
            {w}
          </text>
        </g>
      ))}
      <polyline
        className="wertungskurve-linie"
        points={lage.map((l) => `${l.x},${l.y}`).join(" ")}
      />
      {lage.map((l) => (
        <circle
          key={l.punkt.partieId}
          className={ERGEBNISKLASSE[l.punkt.ergebnis]}
          cx={l.x}
          cy={l.y}
          r={PUNKTRADIUS}
        >
          <title>
            {t("ich.wertung.punkt", {
              datum: datum(l.punkt.zeit),
              ergebnis: t(ERGEBNISTEXT[l.punkt.ergebnis]),
              gegner: l.punkt.gegner,
              wertung: l.punkt.wertung,
            })}
          </title>
        </circle>
      ))}
      {erste && letzte && (
        <g className="wertungskurve-daten">
          <text x={RAND_LINKS} y={HOEHE - 3} fontSize={SCHRIFT}>
            {datum(erste.zeit)}
          </text>
          <text x={BREITE - RAND_RECHTS} y={HOEHE - 3} fontSize={SCHRIFT} textAnchor="end">
            {bereich.art === "zeit" ? t("ich.wertung.jetzt") : datum(letzte.zeit)}
          </text>
        </g>
      )}
    </svg>
  );
}
