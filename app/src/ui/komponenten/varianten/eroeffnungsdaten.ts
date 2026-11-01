/**
 * Die Kennzugfolgen der Steckbriefe je Beispiel, für die ganze Eröffnung im Variationsbrowser.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4. Die reine Rechnung der Eröffnung steht in
 * training/eroeffnungsvariante.ts; sie fragt hier nach dem Kern aus dem Steckbrief („Wer wählt
 * sie?“ und Schlussstellung der Hauptvariante, wie der Eröffnungsbaum der Steckbriefe).
 * Abhängigkeiten: nachschlagen/eroeffnungsbaum.ts, nachschlagen/steckbriefbild.ts, daten (Typen).
 */
import type { Kapitel } from "../../../daten/laden";
import { kennzugfolge } from "../nachschlagen/eroeffnungsbaum";
import { schlussstellung } from "../nachschlagen/steckbriefbild";

/**
 * Kern je Beispiel aus den Steckbriefen: das Beispiel der Schlussstellung und die Kennzugfolge.
 * Beispiel: Spanische Partie → „k02-a1“ mit e4 e5 Nf3 Nc6 Bb5.
 * Sonderfall: Ein Steckbrief ohne Schlussstellung oder Kennzugfolge fehlt in der Liste.
 */
export function steckbriefkerne(kapitel: readonly Kapitel[]): Map<string, readonly string[]> {
  const kerne = new Map<string, readonly string[]>();
  for (const s of kapitel.flatMap((k) => k.steckbriefe)) {
    const schluss = schlussstellung(kapitel, s);
    const zuege = kennzugfolge(s, schluss);
    const id = schluss?.beispiel?.id;
    if (id && zuege && !kerne.has(id)) kerne.set(id, zuege);
  }
  return kerne;
}
