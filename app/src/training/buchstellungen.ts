/**
 * Die Stellungen aller Abbildungen des Buches als Vorrat für die Trainer.
 *
 * Rolle im Gesamtbild: Zähltrainer, Schach-Röntgen-Trainer und „Koordinaten, Notation,
 * Gangarten“ üben an den Diagrammen des Buches (Regel 1: Das Buch ist die einzige Quelle; die
 * Trainer erfinden keine Stellungen, nur die kurzen Sonderzug-Aufgaben in koordinatentrainer.ts).
 * Nur Stellungen mit beiden Königen und gültigen Regeln kommen in den Vorrat.
 * Abhängigkeiten: daten/laden.ts, schach/stellung.ts.
 */
import { ladeIndex, ladeKapitel, type Kapitel } from "../daten/laden";
import { stellungAusFen, type Stellung } from "../schach/stellung";

/** Eine Stellung aus dem Buch mit ihrer Abbildungsnummer. */
export interface Buchstellung {
  readonly nummer: string;
  readonly kapitel: number;
  readonly stellung: Stellung;
}

/**
 * Die regelgerechten Stellungen der Kapitel, jede Stellung nur einmal.
 *
 * Warum: Manche Diagramme wiederholen eine Stellung (etwa vor und nach einem Hinweis); im
 * Training soll dieselbe Aufgabe nicht doppelt kommen.
 * Beispiel: Kapitel 1 liefert unter anderem Abb. 1.26; Lehrbilder ohne König fallen weg.
 */
export function buchstellungenAus(kapitel: readonly Kapitel[]): Buchstellung[] {
  const gesehen = new Set<string>();
  const ergebnis: Buchstellung[] = [];
  for (const k of kapitel) {
    for (const abbildung of k.abbildungen) {
      const brett = abbildung.fen.split(" ")[0] ?? "";
      if (gesehen.has(brett)) continue;
      const gelesen = stellungAusFen(abbildung.fen);
      if (!gelesen.ok || !gelesen.wert.regeln) continue;
      gesehen.add(brett);
      ergebnis.push({ nummer: abbildung.id, kapitel: k.kapitel, stellung: gelesen.wert });
    }
  }
  return ergebnis;
}

/** Lädt alle Kapitel und liefert ihre Stellungen (offline aus dem Zwischenspeicher der App). */
export async function ladeBuchstellungen(): Promise<Buchstellung[]> {
  const index = await ladeIndex();
  const kapitel = await Promise.all(index.kapitel.map((k) => ladeKapitel(k.kapitel)));
  return buchstellungenAus(kapitel);
}
