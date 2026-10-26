/**
 * Filter und Sortierung der Partienliste, mehrere Filter zugleich (Wunsch des Autors vom
 * 19.10.2026).
 *
 * Rolle im Gesamtbild: Die Liste im Bereich Spielen hält bis zu 50 Partien. Der Leser schaltet
 * Filter als Symbole an und aus: Ergebnis, Wertung, eigene Farbe und Art des Gegners. Innerhalb
 * einer Gruppe gilt „oder“ (gewonnen oder remis), zwischen den Gruppen „und“; eine Gruppe ohne
 * gewähltes Symbol schränkt nicht ein. Das Ergebnis zählt aus Sicht des Lesers; bei Mensch gegen
 * Mensch gibt es kein „gewonnen“ oder „verloren“, solche Partien passen dort nur zu „remis“.
 * Sortiert wird nach Datum, nach der eigenen Spielstärke in der Partie oder nach der Stärke des
 * Gegners. Reine Funktionen.
 * Abhängigkeiten: spiel/partie.ts.
 */
import type { Partie } from "./partie";
import { ZEITKLASSEN, zeitklasse } from "./zeitklasse";

/** Die Symbole des Filters „Ergebnis“, aus Sicht des Lesers. */
export const ERGEBNISSE = ["gewonnen", "remis", "verloren"] as const;
export type Ergebnis = (typeof ERGEBNISSE)[number];
/** Die Symbole des Filters „Wertung“. */
export const WERTUNGEN = ["gewertet", "ungewertet"] as const;
export type Wertungsart = (typeof WERTUNGEN)[number];
/** Die Symbole des Filters „eigene Farbe“. */
export const FARBEN = ["white", "black"] as const;
export type Farbfilter = (typeof FARBEN)[number];
/**
 * Art des Gegners: vorgefertigter oder eigener Bot, die Engine nach Stufe, ein Mensch am selben
 * Gerät, eine eingelesene Partie (PGN-Import).
 */
export const GEGNERARTEN = ["bot", "stufe", "mensch", "import"] as const;
export type Gegnerfilter = (typeof GEGNERARTEN)[number];
/** Zeitklasse der Partie (R51, spiel/zeitklasse.ts) oder „ohne“ Uhr. */
export const ZEITFILTER = [...ZEITKLASSEN, "ohne"] as const;
export type Zeitfilter = (typeof ZEITFILTER)[number];
/** Sortierung nach Datum, nach der eigenen Spielstärke in der Partie oder nach der des Gegners. */
export const SORTIERUNGEN = ["datum", "staerke", "gegner"] as const;
export type Sortierung = (typeof SORTIERUNGEN)[number];

export interface Partienfilter {
  readonly ergebnis: readonly Ergebnis[];
  readonly wertung: readonly Wertungsart[];
  readonly farbe: readonly Farbfilter[];
  readonly gegner: readonly Gegnerfilter[];
  readonly zeit: readonly Zeitfilter[];
}

/** Kein Symbol gewählt: Die Liste zeigt alle Partien. */
export const OHNE_FILTER: Partienfilter = {
  ergebnis: [],
  wertung: [],
  farbe: [],
  gegner: [],
  zeit: [],
};

/** Ergebnis einer beendeten Partie aus Sicht des Lesers; null bei laufender oder Mensch gegen Mensch mit Sieger. */
export function ergebnisFuerLeser(partie: Partie): Ergebnis | null {
  const ende = partie.ende;
  if (!ende) return null;
  if (!("sieger" in ende)) return "remis";
  // Zu zweit an einem Gerät gibt es keine Seite des Lesers; bei eingelesenen Partien schon.
  if (partie.einstellung.gegner === "mensch" && !partie.einstellung.importiert) return null;
  return ende.sieger === partie.einstellung.eigeneFarbe ? "gewonnen" : "verloren";
}

/** Die Art des Gegners einer Partie. */
export function gegnerart(partie: Partie): Gegnerfilter {
  if (partie.einstellung.importiert) return "import";
  if (partie.einstellung.gegner === "mensch") return "mensch";
  return partie.einstellung.bot === null ? "stufe" : "bot";
}

/** Passt der Wert zur Gruppe? Eine leere Gruppe schränkt nicht ein. */
function inGruppe<T>(gruppe: readonly T[], wert: T | null): boolean {
  return gruppe.length === 0 || (wert !== null && gruppe.includes(wert));
}

/**
 * Passt die Partie zum Filter? Beispiel: gewonnene, gewertete Partie mit Weiß gegen Lotta →
 * passt zu {ergebnis: [gewonnen, remis]} und {farbe: [white], gegner: [bot]}, nicht zu
 * {ergebnis: [verloren]}.
 * Sonderfall: Mensch gegen Mensch hat keine eigene Farbe; ein Farbfilter lässt sie weg.
 */
export function passtZumFilter(partie: Partie, filter: Partienfilter): boolean {
  const e = partie.einstellung;
  const wertung: Wertungsart = e.gewertet ? "gewertet" : "ungewertet";
  const farbe = e.gegner === "mensch" && !e.importiert ? null : e.eigeneFarbe;
  return (
    inGruppe(filter.ergebnis, ergebnisFuerLeser(partie)) &&
    inGruppe(filter.wertung, wertung) &&
    inGruppe(filter.farbe, farbe) &&
    inGruppe(filter.gegner, gegnerart(partie)) &&
    inGruppe<Zeitfilter>(filter.zeit, zeitklasse(e.uhr) ?? "ohne")
  );
}

/** Schaltet einen Wert in einer Gruppe an oder aus. */
export function umschalten<T>(gruppe: readonly T[], wert: T): readonly T[] {
  return gruppe.includes(wert) ? gruppe.filter((w) => w !== wert) : [...gruppe, wert];
}

/** Wie viele Gruppen gerade einschränken (für „Filter zurücksetzen“). */
export function aktiveFilter(filter: Partienfilter): number {
  return [filter.ergebnis, filter.wertung, filter.farbe, filter.gegner, filter.zeit].filter(
    (g) => g.length > 0,
  ).length;
}

/** Zahlen einer Partie zum Sortieren; null, wenn unbekannt (etwa ohne Auswertung). */
export interface Sortierwerte {
  readonly begonnen: string;
  readonly staerke: number | null;
  readonly gegner: number | null;
}

/**
 * Sortiert Einträge: Datum neueste zuerst, Stärken höchste zuerst; unbekannte Stärken ans Ende,
 * dort nach Datum. Mit „aufsteigend“ umgekehrt (unbekannte bleiben am Ende).
 * Beispiel: Stärken 1400, null, 1600 → 1600, 1400, null.
 */
export function sortiere<T>(
  eintraege: readonly T[],
  sortierung: Sortierung,
  werte: (eintrag: T) => Sortierwerte,
  aufsteigend = false,
): T[] {
  const richtung = aufsteigend ? -1 : 1;
  const nachDatum = (a: Sortierwerte, b: Sortierwerte) => b.begonnen.localeCompare(a.begonnen);
  return [...eintraege].sort((x, y) => {
    const a = werte(x);
    const b = werte(y);
    if (sortierung === "datum") return richtung * nachDatum(a, b);
    const za = a[sortierung];
    const zb = b[sortierung];
    if (za === null || zb === null) return za === zb ? nachDatum(a, b) : za === null ? 1 : -1;
    return za === zb ? nachDatum(a, b) : richtung * (zb - za);
  });
}
