/**
 * Hilfen der Gegnerwahl ohne Oberfläche: Adresse eines Porträts und die offenen Stufen beim
 * ersten Zeigen (seit 0.2.85, Gegnerstufen.tsx).
 * Abhängigkeiten: engine/gegner.ts, engine/stufen.ts.
 */
import { gegnerVon, istSpassbot, klasseVon } from "../../../engine/gegner";
import { STUFEN, type Stufennummer } from "../../../engine/stufen";

/** Die Nummern aller Stufen (seit 0.2.117 eins bis zehn). */
export const STUFENNUMMERN: readonly Stufennummer[] = STUFEN.map((s) => s.nummer);
/** Schlüssel der Gruppe „Zum Spaß“ im Merker der offenen Gruppen (0.2.88, vor Stufe 1). */
export const SPASSGRUPPE = 0;
/** Ordner der Porträts (app/public/gegner/, erzeugt von skripte/erzeuge-gegnerbilder.mjs). */
const PORTRAETS = "gegner/";

/**
 * Adresse des Porträts eines vorgefertigten Gegners; seit 0.2.117 steht die Datei im Gegner
 * (die neuen Bots tragen die Porträts der alten), sonst die Kennung selbst.
 */
export function portraet(kennung: string): string {
  const datei = gegnerVon(kennung)?.portraet ?? kennung;
  return `${import.meta.env.BASE_URL}${PORTRAETS}${datei}.svg`;
}

/**
 * Die offenen Stufen beim ersten Zeigen: aus dem Merker, sonst die Stufe des gewählten Gegners
 * (bei einem Spaß-Bot die Gruppe „Zum Spaß“, Schlüssel 0).
 * Beispiel: Merker „0,2,5“ → Spaß, Stufen 2 und 5 offen; kein Merker, Gegner Timo (Gruppe 4) → Stufe 4.
 */
export function offeneStufenAnfangs(merker: string | null, bot: string | null): Set<number> {
  if (merker !== null) {
    return new Set(
      merker
        .split(",")
        // Leere Teile fallen weg: Number("") wäre 0, der Schlüssel der Spaß-Gruppe.
        .filter((teil) => teil.trim() !== "")
        .map(Number)
        .filter((n) => n === SPASSGRUPPE || STUFENNUMMERN.some((s) => s === n)),
    );
  }
  const gewaehlt = gegnerVon(bot);
  if (!gewaehlt) return new Set();
  return new Set([istSpassbot(gewaehlt) ? SPASSGRUPPE : klasseVon(gewaehlt).nummer]);
}
