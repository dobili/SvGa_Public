/**
 * Die Fehlerarten der Gesamt-Checkliste (Kapitel 12) für die Fehlerdatenbank.
 *
 * Rolle im Gesamtbild: Formular und Auswertung der Fehlerdatenbank brauchen dieselbe Liste; sie
 * kommt aus nachschlagen.json (Spalte „Fehlerart“, je Kapitel eine).
 * Abhängigkeiten: daten/laden.ts, ui/komponenten/bausteine/useDaten.ts.
 */
import { ladeNachschlagen } from "../../daten/laden";
import { useDaten } from "../komponenten/bausteine/useDaten";

/** Eine Fehlerart der Gesamt-Checkliste: Kapitel und Name. */
export interface Fehlerart {
  readonly kapitel: number;
  readonly name: string;
}

/** Die Fehlerarten der Gesamt-Checkliste (leer, solange sie lädt oder fehlt). */
export function useFehlerarten(): readonly Fehlerart[] {
  const daten = useDaten(ladeNachschlagen, "nachschlagen");
  if (daten.art !== "fertig" || !daten.wert.checkliste) return [];
  return daten.wert.checkliste.zeilen.map((z) => ({ kapitel: z.kapitel, name: z.fehlerart }));
}
