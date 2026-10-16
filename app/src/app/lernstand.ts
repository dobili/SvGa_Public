/**
 * Lernstand: welche Lernziele der Leser je Kapitel abgehakt hat.
 *
 * Rolle im Gesamtbild: Die Gesamt-Checkliste wird zur Abhakliste (Wunsch des Autors nach dem
 * Test von 0.2.0). Die Punkte stehen im Buch am Ende jedes Kapitels („Bevor du weiterliest,
 * solltest du Folgendes können“, nachschlagen.json, Feld lernziele). Gespeichert wird nur, welche
 * Punkte abgehakt sind; seit AP 12 als Teil der Nutzerdaten im Speicher (bis 0.2.20 als Merker).
 * Abhängigkeiten: speicher/speicher.ts, speicher/format.ts.
 */
import type { Lernstand } from "../speicher/format";
import { aendere, useSpeicher } from "../speicher/speicher";

export type { Lernstand } from "../speicher/format";

/**
 * Hakt einen Punkt ab oder nimmt den Haken zurück (reine Funktion, für Tests).
 *
 * Beispiel aus dem Buch: Kapitel 1, Punkt 0 „die drei Eröffnungsziele an einer Stellung prüfen“.
 */
export function umschalten(alt: Lernstand, kapitel: number, punkt: number): Lernstand {
  const bisher = alt[kapitel] ?? [];
  const neu = bisher.includes(punkt)
    ? bisher.filter((p) => p !== punkt)
    : [...bisher, punkt].sort((a, b) => a - b);
  return { ...alt, [kapitel]: neu };
}

/** Wie viele der ``anzahl`` Punkte eines Kapitels abgehakt sind (Positionen außerhalb zählen nicht). */
export function abgehakt(stand: Lernstand, kapitel: number, anzahl: number): number {
  return (stand[kapitel] ?? []).filter((punkt) => punkt < anzahl).length;
}

/** Hakt einen Punkt ab oder nimmt den Haken zurück und speichert sofort. */
export function schalteLernziel(kapitel: number, punkt: number): void {
  void aendere((daten) => ({ ...daten, lernstand: umschalten(daten.lernstand, kapitel, punkt) }));
}

/** Abonniert den Lernstand in einer Komponente. */
export function useLernstand(): Lernstand {
  return useSpeicher((zustand) => zustand.daten.lernstand);
}
