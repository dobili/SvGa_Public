/**
 * „Muster aus deinen Partien“: eine Kategorie „Fehler mit Buchbezug“ (W1 bis W10, F1 bis F10),
 * die in den letzten ausgewerteten Partien des Lesers immer wieder vorkommt, mit Trainer und
 * Kapitel dazu.
 *
 * Rolle im Gesamtbild: Konzept docs/KONZEPT_FEHLER_BUCHBEZUG.md, Abschnitt 4.3 (vom Autor
 * freigegeben). Die Startseite schlägt damit dezent den passenden Trainer vor
 * (training/vorschlagsarten.ts, Art „muster“, vor dem Phasen-Vorschlag, weil genauer). Gezählt
 * werden Partien, nicht Züge: Eine wilde Partie mit fünf eingestellten Figuren soll nicht allein
 * entscheiden. Grundlage sind die gespeicherten Kürzel (spiel/buchkuerzel.ts); Partien ohne
 * aktuelle Kürzel zählen nicht mit, bis sie nachgerechnet sind.
 * Abhängigkeiten: spiel/buchkuerzel.ts, spiel/buchbezug.ts, speicher/partien.ts (Typen).
 */
import type { Zugklasse } from "../spiel/auswertung";
import { BUCHBEZUG, FINDE_REIHENFOLGE, type Buchkennung } from "../spiel/buchbezug";
import { kuerzelAktuell } from "../spiel/buchkuerzel";
import type { Nutzerdaten } from "../speicher/format";
import type { Partieeintrag } from "../speicher/partien";

/** Die letzten so vielen ausgewerteten Partien (wie beim Phasen-Vorschlag). */
export const MUSTER_PARTIEN = 10;
/** Erst ab so vielen ausgewerteten Partien mit Kürzeln. */
export const MUSTER_MINDESTENS = 5;

/** Schwelle einer Zuverlässigkeit: so viele Partien und so ein Anteil der betrachteten. */
interface Musterschwelle {
  readonly partien: number;
  readonly anteil: number;
}

/** Hohe Zuverlässigkeit: 3 Partien und 30 %; mittlere (W8, W9, W10, F2, F9, F10): 4 und 40 %. */
export const MUSTER_SCHWELLEN: Readonly<Record<"hoch" | "mittel", Musterschwelle>> = {
  hoch: { partien: 3, anteil: 0.3 },
  mittel: { partien: 4, anteil: 0.4 },
};

/** Nur diese Klassen zählen; „ungenau“ nicht (Konzept 4.3: dort oft nur eine von mehreren Ideen). */
const ZAEHLT: ReadonlySet<Zugklasse> = new Set<Zugklasse>(["fehler", "patzer", "verpasst"]);

/** Das gefundene Muster. */
export interface Muster {
  readonly kennung: Buchkennung;
  /** In so vielen der betrachteten Partien kam die Kategorie vor. */
  readonly anzahl: number;
  /** So viele Partien wurden betrachtet (5 bis 10). */
  readonly partien: number;
  /** Beginn der neuesten betrachteten Partie (ISO), für die Ruhe nach dem Üben. */
  readonly neueste: string;
}

/** Die Kategorien einer Partie, die zählen (jede einmal). */
function kategorienDerPartie(e: Partieeintrag): Set<Buchkennung> {
  const zuege = e.buchbezug?.zuege ?? [];
  return new Set(zuege.flatMap((z) => (ZAEHLT.has(z.klasse) ? z.kuerzel : [])));
}

/** Rang für den Gleichstand: hohe Zuverlässigkeit, dann kleineres Kapitel, dann Warum vor Finden. */
function rang(kennung: Buchkennung): readonly number[] {
  const b = BUCHBEZUG[kennung];
  const finden = (FINDE_REIHENFOLGE as readonly string[]).includes(kennung) ? 1 : 0;
  return [b.zuverlaessigkeit === "hoch" ? 0 : 1, b.kapitel[0] ?? 0, finden];
}

/** Vergleicht zwei Ränge Stelle für Stelle. */
function vergleiche(a: readonly number[], b: readonly number[]): number {
  for (const [i, wert] of a.entries()) {
    const unterschied = wert - (b[i] ?? 0);
    if (unterschied !== 0) return unterschied;
  }
  return 0;
}

/** Erreicht die Kategorie ihre Schwelle? */
function ueberSchwelle(kennung: Buchkennung, anzahl: number, partien: number): boolean {
  const s = MUSTER_SCHWELLEN[BUCHBEZUG[kennung].zuverlaessigkeit];
  return anzahl >= s.partien && anzahl / partien >= s.anteil;
}

/**
 * Das Muster der letzten Partien, oder null.
 *
 * Warum: Wer zweimal eine Gabel übersieht, hat Pech gehabt; dreimal in zehn Partien ist ein
 * Muster (Konzept 4.3).
 * Eingabe: die gespeicherten Partien, neueste zuerst. Ausgabe: die Kategorie mit dem höchsten
 * Anteil über ihrer Schwelle; bei Gleichstand hohe Zuverlässigkeit, dann das kleinere Kapitel.
 * Beispiel: 10 Partien, in 4 blieb eine Drohung stehen (W3) → { W3, 4, 10 }.
 * Sonderfälle: weniger als 5 Partien mit aktuellen Kürzeln → null.
 */
export function musterAusPartien(partien: readonly Partieeintrag[]): Muster | null {
  const betrachtet = partien
    .filter((e) => e.werte.length > 0 && kuerzelAktuell(e.buchbezug))
    .slice(0, MUSTER_PARTIEN);
  const neueste = betrachtet[0];
  if (!neueste || betrachtet.length < MUSTER_MINDESTENS) return null;
  const zaehler = new Map<Buchkennung, number>();
  for (const e of betrachtet)
    for (const k of kategorienDerPartie(e)) zaehler.set(k, (zaehler.get(k) ?? 0) + 1);
  const kandidaten = [...zaehler]
    .filter(([k, anzahl]) => ueberSchwelle(k, anzahl, betrachtet.length))
    .sort(([ka, a], [kb, b]) => b - a || vergleiche(rang(ka), rang(kb)));
  const [kennung, anzahl] = kandidaten[0] ?? [];
  if (!kennung || anzahl === undefined) return null;
  return { kennung, anzahl, partien: betrachtet.length, neueste: neueste.partie.begonnen };
}

/** Je Partienliste einmal gerechnet (die Karte „Heute“ zeichnet oft). */
const ZWISCHEN = new WeakMap<readonly Partieeintrag[], Muster | null>();

/**
 * Das Muster, außer der Leser hat den passenden Trainer seit der neuesten betrachteten Partie
 * schon geübt (Konzept 4.3, „Ruhe“: sonst ein Dauerhinweis, der nervt).
 * Beispiel: Muster W3 (Schach-Röntgen-Trainer), Trainer gestern geübt, letzte Partie vorgestern
 * → null; nach der nächsten Partie wieder das Muster, wenn es noch gilt.
 */
export function musterFuer(daten: Nutzerdaten): Muster | null {
  const partien = daten.spiel.partien;
  if (!ZWISCHEN.has(partien)) ZWISCHEN.set(partien, musterAusPartien(partien));
  const muster = ZWISCHEN.get(partien) ?? null;
  if (!muster) return null;
  const geuebt = daten.fortschritt.trainer[BUCHBEZUG[muster.kennung].trainer]?.zuletzt ?? "";
  const ruht = geuebt !== "" && Date.parse(geuebt) > Date.parse(muster.neueste);
  return ruht ? null : muster;
}
