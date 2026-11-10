/**
 * Prüfung einer Übersetzung der Spieltexte gegen die deutsche Quelle (Dokument 17, Abschnitt 3,
 * Punkt 2): Welche Schlüssel fehlen, welche gibt es nur in der Übersetzung, wo stimmen die
 * Platzhalter nicht überein.
 *
 * Rolle im Gesamtbild: Reine Logik, benutzt von texte/uebersetzung.test.ts (prüft alle
 * `inhalte/abenteuer/texte/<sprache>.json` außer Deutsch). Fehlende Schlüssel sind bei einer
 * unfertigen Sprache erlaubt (das Spiel fällt auf Deutsch zurück); unbekannte Schlüssel und
 * falsche Platzhalter sind immer Fehler.
 * Beispiel: de { a: "Hallo {name}" }, en { a: "Hello {nom}" } → Platzhalter „a“ passt nicht.
 */

/** Ergebnis der Prüfung einer Sprache. */
export interface Uebersetzungsbefund {
  /** In der Übersetzung fehlende Schlüssel (fallen auf Deutsch zurück). */
  readonly fehlend: readonly string[];
  /** Schlüssel, die es auf Deutsch nicht gibt (Tippfehler oder veraltet). */
  readonly unbekannt: readonly string[];
  /** Schlüssel, deren Platzhalter ({name} …) anders sind als auf Deutsch. */
  readonly platzhalter: readonly string[];
}

/** Die Platzhalter eines Textes, sortiert: „{held} sagt {satz}“ → „held,satz“. */
function platzhalterVon(text: string): string {
  return [...text.matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1])
    .sort()
    .join(",");
}

/** Vergleicht eine Übersetzung mit der deutschen Quelle. */
export function pruefeUebersetzung(
  quelle: Readonly<Record<string, string>>,
  uebersetzung: Readonly<Record<string, string>>,
): Uebersetzungsbefund {
  const fehlend = Object.keys(quelle).filter((k) => uebersetzung[k] === undefined);
  const unbekannt = Object.keys(uebersetzung).filter((k) => quelle[k] === undefined);
  const platzhalter = Object.entries(uebersetzung)
    .filter(([k]) => quelle[k] !== undefined)
    .filter(([k, text]) => platzhalterVon(text) !== platzhalterVon(quelle[k] ?? ""))
    .map(([k]) => k);
  return { fehlend, unbekannt, platzhalter };
}
