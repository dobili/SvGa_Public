/**
 * Löschen mit „Rückgängig“: Ein Eintrag verschwindet sofort, unten schwebt kurz „Gelöscht.
 * Rückgängig“ und holt ihn auf Wunsch an seine alte Stelle zurück.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): Einträge der Lernsammlung und der
 * Fehlerdatenbank direkt löschen, mit Rückfrage oder Rückgängig. Gewählt ist Rückgängig: ein
 * Tipp weniger als eine Rückfrage, und ein versehentliches Löschen bleibt heilbar (wie in
 * Mail-Apps üblich). Die Leiste verschwindet nach einigen Sekunden oder beim nächsten Löschen.
 * Was „Löschen“ und „Zurückholen“ in den Nutzerdaten heißt, sagt der Aufrufer
 * (training/eintragspflege.ts).
 * Abhängigkeiten: speicher/speicher.ts, training/eintragspflege.ts, Rueckgaengigleiste.tsx.
 */
import { useEffect, useState, type ReactNode } from "react";
import type { Nutzerdaten } from "../../../speicher/format";
import { aendere } from "../../../speicher/speicher";
import { fundstelleIn, type Geloescht } from "../../../training/eintragspflege";
import { Rueckgaengigleiste } from "./Rueckgaengigleiste";

/** So lange steht „Rückgängig“ bereit (Millisekunden); lang genug, um es zu lesen und zu tippen. */
const RUECKGAENGIG_MS = 10_000;

/** Was der Aufrufer festlegt: die Liste und wie Löschen und Zurückholen in den Daten gehen. */
export interface Loeschregeln<T extends { readonly id: string }> {
  readonly liste: readonly T[];
  readonly entfernen: (daten: Nutzerdaten, id: string) => Nutzerdaten;
  readonly zurueckholen: (daten: Nutzerdaten, geloescht: Geloescht<T>) => Nutzerdaten;
}

/**
 * Löschen mit Rückgängig. Ausgabe: `loesche(id)` für die Knöpfe und `leiste`, die der Bildschirm
 * unten einhängt (null, solange nichts zum Zurückholen da ist).
 * Beispiel: Lernsammlung, „Löschen“ an Abb. 2.2 → Eintrag weg, Leiste „Gelöscht. Rückgängig“.
 */
export function useLoeschenMitRueckgaengig<T extends { readonly id: string }>(
  regeln: Loeschregeln<T>,
): { loesche: (id: string) => void; leiste: ReactNode } {
  const [letzter, setzeLetzter] = useState<Geloescht<T> | null>(null);
  useEffect(() => {
    if (!letzter) return;
    const uhr = window.setTimeout(() => setzeLetzter(null), RUECKGAENGIG_MS);
    return () => window.clearTimeout(uhr);
  }, [letzter]);
  const { liste, entfernen, zurueckholen } = regeln;
  const loesche = (id: string) => {
    const fund = fundstelleIn(liste, id);
    if (!fund) return;
    void aendere((daten) => entfernen(daten, id));
    setzeLetzter(fund);
  };
  const zurueck = () => {
    if (!letzter) return;
    void aendere((daten) => zurueckholen(daten, letzter));
    setzeLetzter(null);
  };
  return {
    loesche,
    leiste: letzter ? <Rueckgaengigleiste beiRueckgaengig={zurueck} /> : null,
  };
}
