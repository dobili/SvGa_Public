/**
 * Hilfen der Trainer zum Antippen von Feldern und zum Abgleich mit der Lösung.
 *
 * Rolle im Gesamtbild: Zähltrainer (hängende Figuren) und Gangarten teilen dieselbe Bedienung:
 * Felder an- und abwählen, nach „Prüfen“ gold, rot und grau markieren (Farben wie im Buch,
 * Konzept 10.3).
 * Abhängigkeiten: analyse/werkzeug.ts (Markierung), training/zaehltrainer.ts (Abgleich).
 */
import type { Markierung } from "../../analyse/werkzeug";
import type { pruefeFelder } from "../../training/zaehltrainer";

/** Markierungen nach dem Abgleich: gefunden gold, übersehen rot, zu viel grau. */
export function abgleichsfelder(vergleich: ReturnType<typeof pruefeFelder>): Markierung[] {
  return [
    ...vergleich.gefunden.map((feld): Markierung => ({ typ: "feld", farbe: "gold", feld })),
    ...vergleich.fehlend.map((feld): Markierung => ({ typ: "feld", farbe: "rot", feld })),
    ...vergleich.falsch.map((feld): Markierung => ({ typ: "feld", farbe: "grau", feld })),
  ];
}

/** Ein Feld in einer Liste ein- oder austragen. */
export function umschalten(liste: readonly string[], feld: string): string[] {
  return liste.includes(feld) ? liste.filter((f) => f !== feld) : [...liste, feld];
}
