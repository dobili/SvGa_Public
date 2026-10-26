/**
 * Warum-Fragen einer Buchabbildung (Art V): Auswahl und Auswertung der Antwort.
 *
 * Rolle im Gesamtbild: Pflichtenheft 3 „Warum-Fragen mit Antwortauswahl“ für Buchstellungen. Die
 * Fragen kommen aus der Pipeline (abbildung.vorbereitet, AP 14); Entwürfe erscheinen nur in
 * Testversionen und sind gekennzeichnet. Die App zeigt nur die Warum-Fragen,
 * nicht die Einschätzungen je Werkzeug (Entscheidung des Autors vom 15.10.2026: nichts aus
 * dem Buch vorwegnehmen). Später (AP 13) dienen die Fragen auch als Wiederholungskarten.
 * Abhängigkeiten: daten/generiert (Typen der Buchdaten).
 */
import type { Abbildung } from "../daten/generiert/abbildung";

/** Vorbereitete Texte einer Abbildung, wie die Pipeline sie schreibt (vorbereitet.schema.json). */
export type Vorbereitet = NonNullable<Abbildung["vorbereitet"]>;
export type Frage = Vorbereitet["fragen"][number];

/**
 * Die Warum-Fragen der Abbildung (leer, wenn es keine gibt).
 * Beispiel: Abb. 1.26 → eine Frage zu 6. Ld3.
 */
export function warumFragen(vorbereitet: Vorbereitet | undefined): readonly Frage[] {
  return vorbereitet?.fragen ?? [];
}

/** Ist die gewählte Antwort richtig? Positionen zählen ab 0 wie in den Daten. */
export function istRichtig(frage: Frage, gewaehlt: number): boolean {
  return frage.richtig === gewaehlt;
}

/**
 * Warum-Fragen je Abbildung, nur Abbildungen mit Fragen (für das Zeichen in der Kapitelübersicht
 * und Zähler im Fortschritt). Beispiel: Kapitel 1 → { "1.26": 1, … }.
 */
export function fragenJeAbbildung(
  abbildungen: readonly Pick<Abbildung, "id" | "vorbereitet">[],
): Record<string, number> {
  return Object.fromEntries(
    abbildungen
      .map((a) => [a.id, warumFragen(a.vorbereitet).length] as const)
      .filter(([, anzahl]) => anzahl > 0),
  );
}
