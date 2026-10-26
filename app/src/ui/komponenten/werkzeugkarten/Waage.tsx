/**
 * Waage für Vergleiche in der Faktorenbilanz: Sie neigt sich zu der Seite, die vorn liegt.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2, Faktorenbilanz: „Darstellung mit Waage wie im Buch“.
 * Kapitel 3: „Die Waage neigt sich zu der Seite, die vorn liegt, und daneben steht, um wie viel.
 * Steht es gleich, ist die Waage gerade.“ Die Beschriftung steht zusätzlich als Text daneben, damit
 * die Aussage auch ohne die Grafik (Bildschirmleser) ankommt.
 * Abhängigkeiten: analyse/werkzeug.ts, i18n.
 */
import type { Waagenanzeige } from "../../../analyse/werkzeug";
import { t } from "../../../i18n/sprache";

/** Zeichenfläche der Waage (Breite, Höhe) in SVG-Einheiten. */
const BREITE = 120;
const HOEHE = 56;
const MITTE = BREITE / 2;
/** Halbe Balkenlänge und Neigung des Balkens an den Enden. */
const HALBBALKEN = 44;
const NEIGUNG = 10;
const BALKEN_Y = 18;
/** Schalen: Abstand unter dem Balken und halbe Breite. */
const SCHALE_TIEFE = 18;
const SCHALE_HALB = 14;
/** Fuß der Waage: Abstand vom unteren Rand und halbe Breite; Säule ragt über den Balken. */
const FUSS_RAND = 4;
const FUSS_Y = HOEHE - FUSS_RAND;
const FUSS_HALB = 16;
const SAEULE_UEBERSTAND = 6;
/** Wölbung des Schalenbodens. */
const SCHALE_BAUCH = 8;

/** Höhenversatz eines Balkenendes: Die vordere Seite sinkt. */
function versatz(neigung: Waagenanzeige["neigung"], seite: "links" | "rechts"): number {
  if (neigung === "gerade") return 0;
  return neigung === seite ? NEIGUNG : -NEIGUNG;
}

function Schale({ x, y }: { x: number; y: number }) {
  const boden = y + SCHALE_TIEFE;
  return (
    <g>
      <line x1={x} y1={y} x2={x - SCHALE_HALB} y2={boden} />
      <line x1={x} y1={y} x2={x + SCHALE_HALB} y2={boden} />
      <path
        d={`M ${x - SCHALE_HALB} ${boden} Q ${x} ${boden + SCHALE_BAUCH} ${x + SCHALE_HALB} ${boden}`}
      />
    </g>
  );
}

/**
 * Die Waage mit Beschriftung, etwa „Weiß | Waage | Schwarz“ und „Schwarz liegt vorn: +1“.
 * Sonderfall: Ohne Vorsprung (Faktorenbilanz-Trainer, nur die Richtung) „Schwarz liegt vorn“.
 */
export function Waage({ waage }: { waage: Waagenanzeige }) {
  const links = { x: MITTE - HALBBALKEN, y: BALKEN_Y + versatz(waage.neigung, "links") };
  const rechts = { x: MITTE + HALBBALKEN, y: BALKEN_Y + versatz(waage.neigung, "rechts") };
  const beschreibung =
    waage.neigung === "gerade"
      ? t("waage.gerade", { links: waage.links, rechts: waage.rechts })
      : t(waage.vorsprung ? "waage.neigt" : "waage.neigtOhne", {
          seite: waage.neigung === "links" ? waage.links : waage.rechts,
          vorsprung: waage.vorsprung,
        });
  return (
    <div className="waage">
      <span className="waage-seite">{waage.links}</span>
      <svg viewBox={`0 0 ${BREITE} ${HOEHE}`} role="img" aria-label={beschreibung}>
        <g className="waage-linien">
          <line x1={MITTE} y1={BALKEN_Y - SAEULE_UEBERSTAND} x2={MITTE} y2={FUSS_Y} />
          <line x1={MITTE - FUSS_HALB} y1={FUSS_Y} x2={MITTE + FUSS_HALB} y2={FUSS_Y} />
          <line x1={links.x} y1={links.y} x2={rechts.x} y2={rechts.y} />
          <Schale x={links.x} y={links.y} />
          <Schale x={rechts.x} y={rechts.y} />
        </g>
      </svg>
      <span className="waage-seite">{waage.rechts}</span>
      <span className="waage-text">{beschreibung}</span>
    </div>
  );
}
