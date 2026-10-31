/**
 * Duellbilanz je Bot (Gamifizierung P8 „Rivalen unter den Bots“): Siege, Remis und Niederlagen des
 * Lesers gegen jeden Bot, über alle beendeten Partien gegen die Engine.
 *
 * Rolle im Gesamtbild: Die Liste der Partien hält nur die letzten 50; die Bilanz soll aber für
 * immer bleiben und in die Datensicherung (Feld `duelle`, speicher/gamifizierung.ts). Geschrieben
 * wird sie nach jedem Partieende über die Liste NACH_PARTIEENDE (speicher/partieprotokoll.ts),
 * nicht in der gesperrten Partie. Gezählt wird jede beendete Partie gegen einen gewählten Bot,
 * gewertet oder nicht (eine Bilanz unter Freunden zählt auch die Übungspartien); ob ein Rivale
 * besiegt ist, entscheidet dagegen nur ein gewerteter Sieg (Entscheidung E6, training/rivalen.ts).
 * Abhängigkeiten: spiel/partie.ts (Typ), spiel/partienfilter.ts (Ergebnis aus Sicht des Lesers),
 * speicher/gamifizierung.ts (Typ Duell), speicher/format.ts (Typ).
 */
import type { Partie } from "../spiel/partie";
import { ergebnisFuerLeser, type Ergebnis } from "../spiel/partienfilter";
import type { Duell } from "../speicher/gamifizierung";
import type { Nutzerdaten } from "../speicher/format";

/** Noch keine Partie gegen diesen Bot. */
export const LEERES_DUELL: Duell = { siege: 0, remis: 0, niederlagen: 0, zuletzt: "" };

/** Welches Feld der Bilanz ein Ergebnis des Lesers erhöht. */
const FELD_JE_ERGEBNIS: Readonly<Record<Ergebnis, "siege" | "remis" | "niederlagen">> = {
  gewonnen: "siege",
  remis: "remis",
  verloren: "niederlagen",
};

/**
 * Der Bot einer Partie, wenn sie für die Bilanz zählt: gegen die Engine, mit gewähltem Bot,
 * beendet und nicht eingelesen. Beispiel: Partie gegen „lotte“, Matt → "lotte"; gegen die
 * eigene Stufe ohne Bot → null.
 */
export function duellgegner(partie: Partie): string | null {
  const e = partie.einstellung;
  if (e.gegner !== "engine" || !e.bot || e.importiert || !partie.ende) return null;
  return e.bot;
}

/** Zahl der Partien eines Duells. Beispiel: 1 Sieg, 1 Remis, 2 Niederlagen → 4. */
export function partienImDuell(duell: Duell | undefined): number {
  return duell ? duell.siege + duell.remis + duell.niederlagen : 0;
}

/**
 * Die Bilanzen mit dieser Partie (rein).
 *
 * Eingaben: bisherige Bilanzen, die beendete Partie, Zeitpunkt. Ausgabe: neue Bilanzen.
 * Beispiel: gegen Lotte 1 : 2, der Leser gewinnt → Siege 2, Niederlagen 2, zuletzt jetzt.
 * Sonderfall: Partie zählt nicht (Mensch, eingelesen, läuft noch) → dieselben Bilanzen.
 */
export function mitDuell(
  duelle: Readonly<Record<string, Duell>>,
  partie: Partie,
  jetzt: Date,
): Readonly<Record<string, Duell>> {
  const bot = duellgegner(partie);
  const ergebnis = ergebnisFuerLeser(partie);
  if (!bot || !ergebnis) return duelle;
  const alt = duelle[bot] ?? LEERES_DUELL;
  const feld = FELD_JE_ERGEBNIS[ergebnis];
  return { ...duelle, [bot]: { ...alt, [feld]: alt[feld] + 1, zuletzt: jetzt.toISOString() } };
}

/**
 * Das Ergebnis der letzten beendeten Partie gegen diesen Bot aus Sicht des Lesers, aus der
 * Liste der gespeicherten Partien (neueste zuerst); null ohne solche Partie. Warum: Der Spruch
 * des Rivalen richtet sich nach dem letzten Ergebnis, die Bilanz selbst kennt es nicht.
 * Beispiel: zuletzt gegen Lotte verloren → "verloren".
 */
export function letztesErgebnis(daten: Nutzerdaten, bot: string): Ergebnis | null {
  for (const { partie } of daten.spiel.partien) {
    if (duellgegner(partie) === bot) return ergebnisFuerLeser(partie);
  }
  return null;
}
