/**
 * Schriftzug „Chessfare“: der Name des Spiels als Bildmarke (Wahl des Autors, 28.11.2026, Q27-1).
 *
 * Warum: Der Name steht auf dem Startbild, im Hauptmenü und auf der Startkarte. Als bloßer Text
 * wirkte er wie eine Überschrift; als Schriftzug wird er zur Marke des Spiels. Aufbau: ein
 * goldener Pixel-Bauer (der Bauer, der auf seiner Reise zur Dame wird) vor dem Wort, „Chess“ in
 * Gold und „fare“ in Creme mit dunkler Pixelkontur, darunter ein Band aus Schachfeldern wie der
 * Weg auf dem Startbild. Der Bauer hüpft auf dem Startbild im Schritt (nicht bei „Bewegung
 * reduzieren“).
 * Eingabe: `groesse` („gross“ für das Startbild, „mittel“ für Hauptmenü und Startkarte; dort
 * steht der Schriftzug in der Überschrift h1). Ausgabe: span mit role="img" und dem Namen als
 * Beschriftung, damit Bildschirmleser „Chessfare“ lesen statt Teilwörter.
 * Beispiel: <Schriftzug groesse="gross" /> auf dem Startbild.
 * Sonderfall: Die Teilwörter kommen aus de.json/en.json (abenteuer.schriftzug.vorne/hinten);
 * der Name wird nicht übersetzt, beide Sprachen sagen „Chessfare“.
 */
import { t } from "../../i18n/sprache";
import { figurenraster, pixellaeufe, RASTERGROESSE, type Pixelklasse } from "../brett/pixelfiguren";
import "../schriftzug.css";

/** Farben des Bauern im Schriftzug: Gold mit Navy-Kontur wie die Schrift (spielfarben.css). */
const BAUERNFARBEN: Readonly<Record<Pixelklasse, string>> = {
  umriss: "var(--spiel-navy-tief)",
  koerper: "var(--spiel-gold)",
  schatten: "var(--spiel-gold-tief)",
};

/** Der Pixel-Bauer des Schriftzugs (gleiches Raster wie die Figuren auf dem Weg). */
function Bauer() {
  const raster = figurenraster("P");
  if (!raster) return null;
  return (
    <svg
      className="schriftzug-bauer"
      viewBox={`0 0 ${RASTERGROESSE} ${RASTERGROESSE}`}
      shapeRendering="crispEdges"
    >
      {pixellaeufe(raster).map((lauf) => (
        <rect
          key={`${lauf.x}-${lauf.y}`}
          x={lauf.x}
          y={lauf.y}
          width={lauf.laenge}
          height={1}
          fill={BAUERNFARBEN[lauf.klasse]}
        />
      ))}
    </svg>
  );
}

/** Der Schriftzug; siehe Dateikopf. */
export function Schriftzug({ groesse }: { groesse: "gross" | "mittel" }) {
  return (
    <span
      className={`schriftzug schriftzug-${groesse}`}
      role="img"
      aria-label={t("abenteuer.titel")}
    >
      <span className="schriftzug-zeile" aria-hidden="true">
        <Bauer />
        <span className="schriftzug-wort">
          <span className="schriftzug-vorne">{t("abenteuer.schriftzug.vorne")}</span>
          <span className="schriftzug-hinten">{t("abenteuer.schriftzug.hinten")}</span>
        </span>
      </span>
      <span className="schriftzug-felder" aria-hidden="true" />
    </span>
  );
}
