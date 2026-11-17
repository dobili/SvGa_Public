/**
 * Zustand des Wikis in der Adresse des Dashboards: welches Wiki („app“ oder „spiel“) und welche
 * Seite offen ist, etwa „/admin/?wiki=spiel&seite=code/oberwelt“.
 *
 * Rolle im Gesamtbild: Seit 17.11.2026 gibt es zwei Wikis auf derselben Plattform (Wunsch des
 * Autors: Das Spiel soll später auch eigenständig erscheinen). Damit Links auf eine Seite eines
 * bestimmten Wikis funktionieren (in Notizen, im Chat), steht der Zustand in der Adresse; ein
 * Neuladen öffnet genau diese Seite wieder. Reine Funktionen auf dem Suchteil der Adresse,
 * dazu zwei kleine Helfer für window.location und history.
 * Abhängigkeiten: keine.
 */

export const WIKIS = ["app", "spiel"] as const;
export type Wikiname = (typeof WIKIS)[number];

/** Zustand des Wikis aus der Adresse; null, wenn sie kein Wiki nennt (dann gilt die Übersicht). */
export interface Wikiadresse {
  readonly wiki: Wikiname;
  readonly seite: string | null;
}

/**
 * Liest den Suchteil einer Adresse. Beispiel: „?wiki=spiel&seite=code/oberwelt“ →
 * { wiki: "spiel", seite: "code/oberwelt" }; „?wiki=buch“ → { wiki: "app", seite: null }.
 */
export function wikiadresseAus(suche: string): Wikiadresse | null {
  const teile = new URLSearchParams(suche);
  const wiki = teile.get("wiki");
  if (wiki === null) return null;
  const bekannt = (WIKIS as readonly string[]).includes(wiki) ? (wiki as Wikiname) : "app";
  return { wiki: bekannt, seite: teile.get("seite") || null };
}

/** Der Suchteil zu einem Zustand. Beispiel: { wiki: "app", seite: null } → „?wiki=app“. */
export function suchteilZu(adresse: Wikiadresse): string {
  const teile = new URLSearchParams({ wiki: adresse.wiki });
  if (adresse.seite) teile.set("seite", adresse.seite);
  return `?${teile.toString()}`;
}

/** Der Zustand der aktuellen Adresse im Browser. */
export const liesWikiadresse = (): Wikiadresse | null => wikiadresseAus(window.location.search);

/** Schreibt den Zustand in die Adresse (ohne Neuladen; Zurück im Browser geht einen Schritt zurück). */
export function schreibeWikiadresse(adresse: Wikiadresse): void {
  const neu = suchteilZu(adresse);
  if (neu !== window.location.search) window.history.pushState(null, "", neu);
}
