/**
 * Hilfen der Gegnerwahl ohne Oberfläche: Adresse eines Porträts und die offenen Stufen beim
 * ersten Zeigen (seit 0.2.85, Gegnerstufen.tsx).
 * Abhängigkeiten: engine/gegner.ts, engine/stufen.ts.
 */
import { durchschnitt, gegnerVon, istSpassbot } from "../../engine/gegner";
import type { Stufennummer } from "../../engine/stufen";

export const STUFENNUMMERN: readonly Stufennummer[] = [1, 2, 3, 4, 5, 6, 7, 8];
/** Schlüssel der Gruppe „Zum Spaß“ im Merker der offenen Gruppen (0.2.87, vor Stufe 1). */
export const SPASSGRUPPE = 0;
/** Ordner der Porträts (app/public/gegner/, erzeugt von skripte/erzeuge-gegnerbilder.mjs). */
const PORTRAETS = "gegner/";

/** Adresse des Porträts eines vorgefertigten Gegners. */
export function portraet(kennung: string): string {
  return `${import.meta.env.BASE_URL}${PORTRAETS}${kennung}.svg`;
}

/**
 * Die offenen Stufen beim ersten Zeigen: aus dem Merker, sonst die Stufe des gewählten Gegners
 * (bei einem Spaß-Bot die Gruppe „Zum Spaß“, Schlüssel 0).
 * Beispiel: Merker „0,2,5“ → Spaß, Stufen 2 und 5 offen; kein Merker, Gegner Timo (⌀ 4) → Stufe 4.
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
  return new Set([istSpassbot(gewaehlt) ? SPASSGRUPPE : Math.round(durchschnitt(gewaehlt))]);
}
