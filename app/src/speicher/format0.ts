/**
 * Format 0: die Merker der ersten Testversionen im localStorage als Rohobjekt für wandleUm.
 *
 * Rolle im Gesamtbild: Aus speicher/format.ts ausgelagert (Welle 0 der Gamifizierung, damit die
 * Datei unter 400 Zeilen bleibt). Wer vor 0.2.20 die App nutzte, hatte Einstellungen und
 * Lernstand nur in Merkern; das erste Laden übernimmt sie (speicher/speicher.ts).
 * Abhängigkeiten: keine.
 */

/**
 * Die Merker aus Format 0 als Rohobjekt (ohne schemaVersion).
 *
 * Eingaben: die Texte der Merker „einstellungen“ und „lernstand“ (null, wenn nicht vorhanden).
 * Ausgabe: Rohobjekt für wandleUm, kaputtes JSON zählt als nicht vorhanden.
 * Beispiel: {"brettfarben":"holz"} und {"1":[0,2]} → Holzbrett, in Kapitel 1 zwei Haken.
 */
export function merkerAlsFormat0(
  einstellungen: string | null,
  lernstand: string | null,
): Record<string, unknown> {
  const lies = (text: string | null): unknown => {
    if (!text) return undefined;
    try {
      return JSON.parse(text);
    } catch (fehler) {
      console.warn("Merker aus Version 0.2 nicht lesbar, wird leer übernommen:", fehler);
      return undefined;
    }
  };
  return { einstellungen: lies(einstellungen), lernstand: lies(lernstand) };
}
