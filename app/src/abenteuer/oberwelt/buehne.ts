/**
 * Bühnenanweisungen einer Dialogzeile für die Karte (Atmosphäre T6 und T9): Licht für die Szene
 * (`#licht:abend`) und Figuren ein- oder ausblenden (`#figur:mira:aus`).
 *
 * Rolle im Gesamtbild: Die Oberwelt (Oberwelt.tsx) reicht jede Zeile hierher und wendet die
 * Anweisungen auf die Phaser-Szene an. Das Licht gilt nur bis zum Ende des Dialogs, danach kehrt
 * das Licht der Karte zurück. Geblendete Figuren bleiben so bis zum Verlassen der Karte; nichts
 * davon kommt in den Spielstand.
 * Abhängigkeiten: toenung.ts.
 */
import { istToenung, TAGESLICHT, type Toenung } from "./toenung";

/** Deckkraft einer Figur nach `#figur:<name>:<wert>`. */
const DECKKRAFT: Readonly<Record<string, number>> = { ein: 1, halb: 0.5, aus: 0 };

/** Was eine Zeile auf der Karte ändert. */
export interface Buehnenanweisung {
  /** Licht für die Dauer des Dialogs (null: kein Schleier); fehlt: unverändert. */
  readonly licht?: Toenung | null;
  /** Figur, die geblendet wird, mit Ziel-Deckkraft (0 bis 1). */
  readonly figur?: { readonly name: string; readonly deckkraft: number };
}

/**
 * Liest die Bühnenanweisungen aus den Tags einer Zeile.
 *
 * Warum: Ambrose verschwindet als Geist, ein Abend bricht im Gespräch herein; das soll der Dialog
 * sagen können, ohne die Karte zu ändern.
 * Beispiel: `#licht:nacht #figur:ambrose:halb` → Licht „nacht“, Ambrose halb durchsichtig.
 * Sonderfälle: `#licht:tag` → kein Schleier; unbekanntes Licht oder unbekannter Wert → nichts.
 */
export function buehnenanweisung(tags: Readonly<Record<string, string>>): Buehnenanweisung {
  const licht = tags.licht;
  const lichtteil = licht === TAGESLICHT ? { licht: null } : istToenung(licht) ? { licht } : {};
  const figur = tags.figur ?? "";
  const trenner = figur.lastIndexOf(":");
  const name = figur.slice(0, trenner);
  const deckkraft = DECKKRAFT[figur.slice(trenner + 1)];
  const figurteil = trenner > 0 && deckkraft !== undefined ? { figur: { name, deckkraft } } : {};
  return { ...lichtteil, ...figurteil };
}
