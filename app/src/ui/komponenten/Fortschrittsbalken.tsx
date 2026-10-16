/**
 * Schmaler Fortschrittsbalken in Gold, wie auf der Installationsseite des Bildschirmentwurfs.
 *
 * Rolle im Gesamtbild: Zeigt den Fortschritt je Kapitel im Buch, in der Kapitelübersicht und im
 * Bereich Ich (AP 12). Für Vorleseprogramme ein echter Fortschrittsbalken mit Beschriftung.
 * Abhängigkeiten: speicher/fortschritt.ts (Typ Anteil).
 */
import type { Anteil } from "../../speicher/fortschritt";

const PROZENT = 100;

/** Beispiel: <Fortschrittsbalken anteil={{ erreicht: 12, gesamt: 40 }} beschriftung="…" />. */
export function Fortschrittsbalken({
  anteil,
  beschriftung,
}: {
  anteil: Anteil;
  beschriftung: string;
}) {
  const prozent = anteil.gesamt > 0 ? Math.round((anteil.erreicht / anteil.gesamt) * PROZENT) : 0;
  return (
    <span
      className="fortschrittsbalken"
      role="progressbar"
      aria-label={beschriftung}
      aria-valuemin={0}
      aria-valuemax={anteil.gesamt}
      aria-valuenow={anteil.erreicht}
    >
      <span className="fortschrittsbalken-fuellung" style={{ width: `${prozent}%` }} />
    </span>
  );
}
