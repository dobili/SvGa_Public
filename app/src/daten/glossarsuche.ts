/**
 * Suche im Glossar: Treffer nach Begriff und Text, ohne Rücksicht auf Groß- und Kleinschreibung.
 *
 * Rolle im Gesamtbild: Bildschirm Glossar (Pflichtenheft 4 „Glossar: Suche …“). Eigene Datei,
 * damit die Logik ohne Oberfläche testbar ist.
 * Abhängigkeiten: daten/laden.ts (Typ).
 */
import type { Glossareintrag } from "./laden";

/** Vergleich ohne Groß- und Kleinschreibung und ohne Akzente (ä bleibt ä, é wird e). */
function normal(text: string): string {
  return text.toLocaleLowerCase("de").normalize("NFD").replace(/[́̀̂]/g, "");
}

/**
 * Treffer der Suche: erst Begriffe, die mit dem Suchtext beginnen, dann solche, die ihn enthalten,
 * dann Einträge, in deren Text er vorkommt.
 *
 * Beispiel: „hebel“ → „Hebel“ vor „Bauernhebel (Hebel)“ vor Einträgen, die Hebel erwähnen.
 */
export function suche(eintraege: readonly Glossareintrag[], suchtext: string): Glossareintrag[] {
  const gesucht = normal(suchtext.trim());
  if (!gesucht) return [...eintraege];
  const rang = (eintrag: Glossareintrag): number => {
    const begriff = normal(eintrag.begriff);
    if (begriff.startsWith(gesucht)) return 0;
    if (begriff.includes(gesucht)) return 1;
    return normal(eintrag.text.map((teil) => teil.text).join("")).includes(gesucht) ? 2 : -1;
  };
  return eintraege
    .map((eintrag) => ({ eintrag, rang: rang(eintrag) }))
    .filter((treffer) => treffer.rang >= 0)
    .sort((a, b) => a.rang - b.rang)
    .map((treffer) => treffer.eintrag);
}
