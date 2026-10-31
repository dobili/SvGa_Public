/**
 * Weitere Quellen der Erfahrungspunkte aus den Paketen der Gamifizierung, als Liste zum Eintragen.
 *
 * Rolle im Gesamtbild: Welle 0 (G3): Die Grundquellen (Abbildungen, Übungen, Partien …) stehen fest
 * in erfahrung.ts. Jedes Paket, das Punkte vergibt (Wochenziel P4, Meisterschaft P3, Rekorde P5,
 * Aufträge P6, Duelle P8, eigene Ziele P13), trägt hier eine Zeile mit Kennung, Gewicht und
 * Zählung ein; ebenso später ein neuer Trainer oder ein neues Werkzeug. So ändert niemand die
 * Grundlage selbst. Vorgesehene Gewichte (Vorrecherche): Woche mit erreichtem Ziel 30, Auftrag 15,
 * Bronze 10, Silber 25, Gold 50, Rival besiegt 40, eigenes Ziel erreicht 20.
 * Abhängigkeiten: speicher/format.ts (Typ), training/wochenziel.ts (P4).
 */
import type { Nutzerdaten } from "../../../speicher/format";
import { PUNKTE_JE_ZIEL } from "../../../training/ziele";
import { erreichteWochen } from "../../../training/wochenziel";

/** Eine Quelle: Kennung, Punkte je Einheit, Zahl der Einheiten aus den Nutzerdaten. */
export interface Erfahrungsquelle {
  readonly kennung: string;
  readonly gewicht: number;
  readonly zaehle: (daten: Nutzerdaten) => number;
}

/** Alle zusätzlichen Quellen; Pakete fügen je eine Zeile an (Konfliktkarte, Abschnitt 5). */
export const ERFAHRUNGSQUELLEN: readonly Erfahrungsquelle[] = [
  { kennung: "wochenErreicht", gewicht: 30, zaehle: (d) => erreichteWochen(d).length },
  { kennung: "zieleErreicht", gewicht: PUNKTE_JE_ZIEL, zaehle: (d) => d.ziele.erreicht.length },
];
