/**
 * Die Bilanztabellen des Buches je Abbildung (Zielbilanz, Faktorenbilanz).
 *
 * Rolle im Gesamtbild: Trainer vergleichen, wo das Buch eine Tabelle hat, mit dem Urteil des
 * Buches statt mit der Rechnung der App (Regel 1: Das Buch ist die einzige Quelle; Rückfrage W9).
 * Die Referenztests der Werkzeuge nutzen dieselbe Zuordnung (schach/buchabbildungen.testhilfe.ts).
 * Abhängigkeiten: erzeugte Typen der Buchdaten.
 * Buchbezug: Kapitel 2 (Zielbilanz) und Kapitel 3 (Faktorenbilanz).
 */
import type { Bilanz, Tabelle } from "../daten/generiert/bilanz";
import type { Kapitel } from "../daten/generiert/kapitel";

/** Eine Tabelle des Buches mit der Abbildung, deren Stellung sie bewertet. */
export interface Bilanzfall {
  readonly abbildung: string;
  readonly tabelle: Tabelle;
}

/** Die Abbildung zu einer Tabelle: der Verweis im Text davor, sonst die Abbildung der Bilanz. */
function abbildungVor(bilanz: Bilanz, stelle: number): string | null {
  for (let i = stelle - 1; i >= 0; i--) {
    const block = bilanz.bloecke[i];
    if (block?.art !== "text") continue;
    const verweis = block.text.find((teil) => teil.art === "verweis" && teil.abbildung);
    if (verweis?.abbildung) return verweis.abbildung;
  }
  return bilanz.abbildung;
}

/**
 * Alle Tabellen einer Art („ziel“ oder „faktor“) eines Kapitels mit ihrer Abbildung.
 *
 * Warum: Eine Bilanz mit mehreren Tabellen (Abb. 2.76: Angenommenes Damengambit und Orthodoxe
 * Verteidigung) nennt die Abbildung jeweils im Text vor der Tabelle.
 * Beispiel: Kapitel 3, „faktor“ → Abb. 3.6 (Königsgambit nach 9… O-O), 3.8, 3.10, …
 */
export function bilanzfaelleAus(kapitel: Kapitel, art: Bilanz["art"]): Bilanzfall[] {
  const faelle: Bilanzfall[] = [];
  for (const bilanz of kapitel.bilanzen.filter((b) => b.art === art)) {
    const mehrere = bilanz.bloecke.filter((b) => b.art === "tabelle").length > 1;
    bilanz.bloecke.forEach((block, stelle) => {
      if (block.art !== "tabelle") return;
      const abbildung = mehrere ? abbildungVor(bilanz, stelle) : bilanz.abbildung;
      if (abbildung) faelle.push({ abbildung, tabelle: block });
    });
  }
  return faelle;
}
