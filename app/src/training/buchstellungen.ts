/**
 * Die Stellungen aller Abbildungen des Buches als Vorrat für die Trainer.
 *
 * Rolle im Gesamtbild: Zähltrainer, Schach-Röntgen-Trainer und „Koordinaten, Notation,
 * Gangarten“ üben an den Diagrammen des Buches (Regel 1: Das Buch ist die einzige Quelle; die
 * Trainer erfinden keine Stellungen, nur die kurzen Sonderzug-Aufgaben in koordinatentrainer.ts).
 * Nur Stellungen mit beiden Königen und gültigen Regeln kommen in den Vorrat.
 * Abhängigkeiten: daten/laden.ts, schach/stellung.ts.
 */
import type { Vorbereitet } from "../analyse/warumfragen";
import type { Tabelle } from "../daten/generiert/bilanz";
import { ladeIndex, ladeKapitel, type Kapitel } from "../daten/laden";
import { stellungAusFen, type Stellung } from "../schach/stellung";
import { bilanzfaelleAus } from "./buchbilanzen";

/** Eine Stellung aus dem Buch mit ihrer Abbildungsnummer. */
export interface Buchstellung {
  readonly nummer: string;
  readonly kapitel: number;
  readonly stellung: Stellung;
  /** Die Faktorenbilanz des Buches zu dieser Abbildung, falls es eine gibt (W9). */
  readonly faktortabelle?: Tabelle;
  /** Die vorbereiteten Texte der Abbildung (Warum-Fragen, AP 14), falls es welche gibt. */
  readonly vorbereitet?: Vorbereitet;
  /** Stellung aus einer Zugfolge statt aus einer Abbildung: Titel und Zug (Röntgen-Stufen). */
  readonly zugfolge?: { readonly titel: string; readonly zug: number };
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
    const tabellen = new Map(bilanzfaelleAus(k, "faktor").map((f) => [f.abbildung, f.tabelle]));
    for (const abbildung of k.abbildungen) {
      const brett = abbildung.fen.split(" ")[0] ?? "";
      if (gesehen.has(brett)) continue;
      const gelesen = stellungAusFen(abbildung.fen);
      if (!gelesen.ok || !gelesen.wert.regeln) continue;
      gesehen.add(brett);
      const tabelle = tabellen.get(abbildung.id);
      ergebnis.push({
        nummer: abbildung.id,
        kapitel: k.kapitel,
        stellung: gelesen.wert,
        ...(tabelle ? { faktortabelle: tabelle } : {}),
        ...(abbildung.vorbereitet ? { vorbereitet: abbildung.vorbereitet } : {}),
      });
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
