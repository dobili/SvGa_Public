/**
 * Reiseziele der Monatskarte (docs/spiel/11, I6): besuchte Städte als Ziele der Schnellreise.
 *
 * Rolle im Gesamtbild: reine Regel für oberwelt/Reisen.tsx (getrennt, damit die Komponentendatei
 * nur Komponenten exportiert).
 * Abhängigkeiten: daten/laden.ts.
 */
import type { Ortdaten } from "../daten/laden";

/** Eine Stadt als Reiseziel: Ort und die Karte, auf der man ankommt. */
export interface Reiseziel {
  readonly ort: Ortdaten;
  readonly karte: string;
}

/**
 * Die Reiseziele: besuchte Städte (nicht Wege, nicht Erinnerungen) außer der aktuellen, nach
 * Nummer. Beispiel: besucht Maple Falls, Cedar Creek, Riverton, jetzt in Riverton → Maple Falls,
 * Cedar Creek.
 */
export function reiseziele(
  orte: readonly Ortdaten[],
  besucht: readonly string[],
  aktuellerOrt: string,
): Reiseziel[] {
  return orte
    .filter((o) => (o.art ?? "stadt") === "stadt" && besucht.includes(o.kennung))
    .filter((o) => o.kennung !== aktuellerOrt)
    .sort((a, b) => a.nummer - b.nummer)
    .flatMap((ort) => {
      const karte = ort.karten.find((k) => !k.innen) ?? ort.karten[0];
      return karte ? [{ ort, karte: karte.kennung }] : [];
    });
}
