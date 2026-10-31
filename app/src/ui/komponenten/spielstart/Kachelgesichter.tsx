/**
 * Bild der Kachel „Gegner aussuchen“ auf der Startseite von „Spielen“: vier kleine Porträts
 * übereinander, wie in der zugeklappten Stufenzeile der Gegnerwahl (DS19).
 *
 * Rolle im Gesamtbild: Eigene Datei, damit spielseiten.tsx nur die Liste ausführt.
 * Abhängigkeiten: gegner/gegnerportraet.ts.
 */
import { portraet } from "../gegner/gegnerportraet";

/** Diese Bots zeigt die Kachel „Gegner aussuchen“ übereinander. */
const KACHELGESICHTER = ["tom", "marie", "derya", "pia"];

/** Vier kleine Porträts übereinander (nur Schmuck). */
export function Gesichter() {
  return (
    <span className="gesichterreihe spielkachel-gesichter" aria-hidden="true">
      {KACHELGESICHTER.map((k) => (
        <img key={k} src={portraet(k)} alt="" />
      ))}
    </span>
  );
}
