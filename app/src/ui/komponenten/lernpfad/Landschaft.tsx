/**
 * Die Bänder der Landschaft hinter dem Lernpfad und die Namen der Teile (Gestaltung B1, 31.10.2026).
 *
 * Rolle im Gesamtbild: Weg.tsx legt dieses SVG unter Linie und Knöpfe. Je Etappe ein Band
 * (wegform.ts, baender) mit dem Bild aus LANDSCHAFTEN; darüber links oben „Teil 1“ und der Name
 * des Teils als Überschrift, auf einem leicht deckenden Grund, damit der Text auf jedem Bild
 * lesbar bleibt (hell und dunkel). Nur Schmuck: das Bild ist für Vorlesehilfen verborgen, die
 * Überschriften nicht.
 * Abhängigkeiten: wegform.ts, landschaften.ts, i18n.
 */
import { t, type Textschluessel } from "../../../i18n/sprache";
import { landschaftVon } from "./landschaften";
import { BREITE, inProzent, type Band } from "./wegform";

/** Die Bilder aller Bänder in einem SVG über die ganze Fläche. */
export function Landschaftsbild({ baender, hoehe }: { baender: readonly Band[]; hoehe: number }) {
  return (
    <svg
      viewBox={`0 0 ${BREITE} ${hoehe}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="lernpfad-landschaft"
    >
      {baender.map(({ teil, y0, y1 }) => {
        const Bild = landschaftVon(teil)?.Bild;
        return (
          <g key={teil} transform={`translate(0 ${y0})`} className={`land-band land-${teil}`}>
            <rect width={BREITE} height={y1 - y0} className="land-schlicht" />
            {Bild && <Bild hoehe={y1 - y0} />}
          </g>
        );
      })}
    </svg>
  );
}

/** Abstand der Überschrift vom oberen Rand des Bandes (Einheiten des Koordinatensystems). */
const KOPF_ABSTAND = 12;
const KOPF_X = 14;

/** „Teil 1 · Grundlagen“ über jedem Band. */
export function Teilnamen({ baender, hoehe }: { baender: readonly Band[]; hoehe: number }) {
  return baender.map(({ teil, y0 }, i) => (
    <div
      key={teil}
      className="lernpfad-teilname"
      style={inProzent(KOPF_X, y0 + KOPF_ABSTAND, hoehe)}
      data-testid={`lernpfad-teil-${teil}`}
    >
      <p className="ueberzeile">{t("buchlook.teil", { n: i + 1 })}</p>
      <h2>{t(`fortschritt.teil.${teil}` as Textschluessel)}</h2>
    </div>
  ));
}
