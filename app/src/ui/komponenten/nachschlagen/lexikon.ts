/**
 * Die Lexikonseite des Glossars: Begriffe nach Anfangsbuchstaben auf Seiten verteilen, die
 * Definition als Fließtext kürzen, die Kapitel eines Begriffs nennen.
 *
 * Rolle im Gesamtbild: Entwurf I3 „Lexikonseite“ (Wahl des Autors, 31.10.2026). Je Buchstabe
 * eine Seite mit großem Anfangsbuchstaben; jeder Eintrag als Absatz „Begriff. Definition KAP. 1, 2“
 * wie in einem Lexikon. Der volle Eintrag mit allen Stellen und Verweisen bleibt auf der
 * Begriffsseite (Glossar.tsx). Regel 1: Die Texte kommen aus dem Anhang des Buches; gekürzt wird
 * nur die Fundstelle am Ende, die als Kapitelangabe daneben steht.
 * Abhängigkeiten: daten/laden.ts (Typ).
 */
import type { Glossareintrag } from "../../../daten/laden";

/** Gruppe für Begriffe, die nicht mit einem Buchstaben beginnen („50-Züge-Regel“). */
export const ZEICHENGRUPPE = "#";

/**
 * Anfangsbuchstabe für die Seiten: Umlaute wie der Grundbuchstabe (Ä bei A), Ziffern unter „#“.
 * Beispiel: "50-Züge-Regel" → "#"; "Ablenkung" → "A"; "Überlastung" → "U".
 */
export function anfangsbuchstabe(begriff: string): string {
  const erster = begriff
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .slice(0, 1)
    .toUpperCase();
  return /[A-Z]/.test(erster) ? erster : ZEICHENGRUPPE;
}

/** Eine Seite des Lexikons: ein Anfangsbuchstabe mit seinen Begriffen. */
export interface Lexikonseite {
  readonly buchstabe: string;
  readonly eintraege: readonly Glossareintrag[];
}

/**
 * Verteilt die Begriffe auf Seiten, Buchstaben von A bis Z, „#“ zuletzt; innerhalb einer Seite
 * die Reihenfolge des Glossars. Beispiel: 255 Begriffe des Buches → Seiten A bis Z und „#“.
 */
export function lexikonseiten(eintraege: readonly Glossareintrag[]): readonly Lexikonseite[] {
  const gruppen = new Map<string, Glossareintrag[]>();
  for (const eintrag of eintraege) {
    const buchstabe = anfangsbuchstabe(eintrag.begriff);
    gruppen.set(buchstabe, [...(gruppen.get(buchstabe) ?? []), eintrag]);
  }
  const rang = (b: string) => (b === ZEICHENGRUPPE ? 1 : 0);
  return [...gruppen.entries()]
    .sort(([a], [b]) => rang(a) - rang(b) || a.localeCompare(b))
    .map(([buchstabe, liste]) => ({ buchstabe, eintraege: liste }));
}

/** Fundstelle am Ende einer Definition: „(Kapitel 2 und 6; Abschnitt 2.6 …)“, auch englisch. */
const FUNDSTELLE_AM_ENDE = /\s*\((?:Kapitel|Kap\.|Chapters?|Ch\.)[^()]*\)\s*\.?\s*$/;

/**
 * Die Definition als schlichter Fließtext ohne Fundstelle am Ende und ohne Verweispfeile.
 * Beispiel: „Beide Seiten rochieren … eine Linie öffnet (Kapitel 2 und 6; Abschnitt 2.6 …).“
 * → „Beide Seiten rochieren … eine Linie öffnet.“
 * Sonderfall: Ohne Fundstelle bleibt der Text, wie er ist.
 */
export function lexikontext(eintrag: Glossareintrag): string {
  const text = eintrag.text
    .map((teil) => teil.text)
    .join("")
    .replace(/→\s*/g, "")
    .trim();
  const ohne = text.replace(FUNDSTELLE_AM_ENDE, "");
  if (ohne === text) return text;
  return /[.!?]$/.test(ohne) ? ohne : `${ohne}.`;
}

/** Die Kapitel eines Begriffs, aufsteigend und ohne Doppelte. Beispiel: Fesselung → 1, 2, 7. */
export function kapitelDesBegriffs(eintrag: Glossareintrag): readonly number[] {
  return [...new Set(eintrag.stellen.map((s) => s.kapitel))].sort((a, b) => a - b);
}

/** Die erste Abbildung, an der der Begriff im Buch vorkommt, oder null. */
export function ersteAbbildungDesBegriffs(eintrag: Glossareintrag): string | null {
  return eintrag.stellen.find((s) => s.abbildung)?.abbildung ?? null;
}
