/**
 * Abbildungsnummern verstehen, wie Leser sie eintippen.
 *
 * Rolle im Gesamtbild: Kern des Nummernfelds „Abbildung öffnen“ (Konzept 6.1, „findeAbbildung“).
 * Rein und ohne Netz, damit es vollständig testbar ist.
 * Abhängigkeiten: keine.
 */

/** Ergebnis der Suche nach einer Abbildungsnummer. */
export type Fundergebnis =
  | { readonly art: "gefunden"; readonly nummer: string; readonly kapitel: number }
  | { readonly art: "unbekannt"; readonly nummer: string; readonly vorschlaege: readonly string[] }
  | { readonly art: "ungueltig" };

/** Höchstens so viele Vorschläge bei einem Tippfehler. */
const HOECHSTZAHL_VORSCHLAEGE = 3;

/**
 * Bringt eine Eingabe in die Form „Kapitel.Nummer“.
 *
 * Versteht „7.3“, „7,3“, „Abb. 7.3“, „abb 7 3“ und führende Nullen („07.03“).
 * Ausgabe: normierte Nummer wie „7.3“ oder null.
 */
export function normiereNummer(eingabe: string): string | null {
  const treffer = /^\s*(?:abb(?:ildung)?\.?\s*)?(\d{1,2})\s*[.,:\s]\s*(\d{1,3})\s*$/i.exec(eingabe);
  if (!treffer?.[1] || !treffer[2]) {
    return null;
  }
  return `${Number(treffer[1])}.${Number(treffer[2])}`;
}

/** Zerlegt „7.3“ in [7, 3]. */
function teile(nummer: string): [number, number] {
  const [kapitel, laufend] = nummer.split(".").map(Number);
  return [kapitel ?? 0, laufend ?? 0];
}

/**
 * Sucht eine Abbildung zu einer Eingabe des Lesers.
 *
 * Warum: Leser sehen im Buch „Abb. 1.26“ und tippen das ins Nummernfeld.
 * Eingaben: Eingabe, Liste aller vorhandenen Nummern (aus index.json).
 * Ausgabe: gefunden mit Kapitel, unbekannt mit nächstliegenden Nummern, oder ungültig.
 * Beispiel: finde("1,26", …) → gefunden „1.26“ in Kapitel 1.
 * Sonderfälle: Bei „1.62“ (gibt es nicht) werden Nummern desselben Kapitels mit dem kleinsten
 * Abstand vorgeschlagen, etwa „1.43“.
 */
export function findeAbbildung(eingabe: string, vorhandene: readonly string[]): Fundergebnis {
  const nummer = normiereNummer(eingabe);
  if (nummer === null) {
    return { art: "ungueltig" };
  }
  if (vorhandene.includes(nummer)) {
    return { art: "gefunden", nummer, kapitel: teile(nummer)[0] };
  }
  return { art: "unbekannt", nummer, vorschlaege: naechstliegende(nummer, vorhandene) };
}

/** Nummern mit dem kleinsten Abstand: erst gleiches Kapitel, dann vertauschte Ziffern. */
function naechstliegende(nummer: string, vorhandene: readonly string[]): string[] {
  const [kapitel, laufend] = teile(nummer);
  const vertauscht = `${laufend}.${kapitel}`;
  const abstand = (kandidat: string): number => {
    if (kandidat === vertauscht) return 0;
    const [k, l] = teile(kandidat);
    const KAPITELSTRAFE = 1000;
    return Math.abs(k - kapitel) * KAPITELSTRAFE + Math.abs(l - laufend);
  };
  return [...vorhandene].sort((a, b) => abstand(a) - abstand(b)).slice(0, HOECHSTZAHL_VORSCHLAEGE);
}
