/**
 * Datum, an dem ein Orden, ein Abzeichen oder ein Rekord zum ersten Mal gefeiert wurde
 * (Gamifizierung G3, Feld „verdient“ ab Format 7).
 *
 * Rolle im Gesamtbild: Die Feiern selbst merken sich nur auf dem Gerät, dass sie gezeigt wurden
 * (Merker „ringeGefeiert“, „abzeichenGefeiert“). Monatsrückblick (P12) und Teilen (P9) brauchen
 * das Datum, und es soll in die Datensicherung. Deshalb schreiben beide Feiern zusätzlich hierher.
 * Schlüssel wie die Startanimation (ordenkunst/startorden.ts): „orden:<k>“, „abzeichen:<k>“,
 * „rekord:<k>“. Ein schon gesetztes Datum bleibt.
 * Abhängigkeiten: speicher/gamifizierung.ts (Typ).
 */
import type { Gamifizierungsdaten } from "./gamifizierung";

/**
 * Trägt das Datum für noch nicht verdiente Schlüssel ein.
 * Beispiel: mitVerdient(daten, ["abzeichen:erstesMatt"], jetzt) → verdient am heutigen Tag.
 * Sonderfall: Alle schon da → dieselben Daten (der Speicher schreibt nichts).
 */
export function mitVerdient<T extends Pick<Gamifizierungsdaten, "verdient">>(
  daten: T,
  schluessel: readonly string[],
  jetzt: Date,
): T {
  const neu = schluessel.filter((s) => daten.verdient[s] === undefined);
  if (neu.length === 0) return daten;
  const datum = jetzt.toISOString();
  return {
    ...daten,
    verdient: { ...daten.verdient, ...Object.fromEntries(neu.map((s) => [s, datum])) },
  };
}
