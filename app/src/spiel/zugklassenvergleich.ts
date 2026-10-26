/**
 * Vergleich der Zugklassen einer Partie mit dem Üblichen bei gleicher Spielstärke (R56).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (23.10.2026): Die Klassen (brillant bis Patzer) sind
 * nicht gleichwertig; ein großer Balken für „Patzer“ wäre schlecht, einer für „Bester Zug“ gut.
 * Deshalb steht jede Klasse gegen ihren üblichen Anteil bei einem Spieler gleicher Stärke, mit
 * Zonen „schwach / normal / gut“ (bei den schwachen Klassen umgekehrt). Die Anzeige steht in
 * ui/komponenten/Zugklassen.tsx.
 * Seit 0.2.125 (Wunsch des Autors, 24.10.2026) kommen Üblich und Zonen aus den Spielerprofilen
 * (spiel/zugklassenvergleich-daten.ts): „üblich“ ist der Median der Spieler des Bandes in der
 * Zeitklasse, „normal“ reicht vom 5-%- bis zum 95-%-Quantil der Spieler, erweitert um die
 * Zufallsstreuung einer einzelnen Partie mit so vielen Zügen (Binomial, 90 %), damit eine Partie
 * nicht schon durch Würfelglück „gut“ oder „schwach“ heißt. Seit 0.3.0 (Wunsch des Autors,
 * 26.10.2026) sind alle zehn Klassen gemessen: Der Messlauf spiel/zugklassen.messung.ts bestimmt
 * die Klasse jedes Zuges der Profile mit der Regel der App; vorher waren brillant, stark und
 * Theoriezug geschätzt (feste Zone 75 bis 125 %), und „bester“ enthielt sie noch.
 * Abhängigkeiten: spiel/auswertung.ts (Zugklasse), spiel/zugklassenvergleich-daten.ts,
 * spiel/elomodell-daten.ts (Zeitklasse).
 */
import type { Zugklasse } from "./auswertung";
import type { Wertungstempo } from "./elomodell-daten";
import { ZUGKLASSEN_UEBLICH } from "./zugklassenvergleich-daten";

/** Klassen, von denen man viele haben will; die übrigen möglichst wenige. */
export const GUTE_KLASSEN: ReadonlySet<Zugklasse> = new Set([
  "brillant",
  "stark",
  "bester",
  "sehrGut",
  "gut",
  "buch",
]);

/** Unter so vielen eigenen Zügen springen die Anteile zu stark: dann nur die Anzahlen. */
export const MINDESTZUEGE_VERGLEICH = 15;
/** Die Skala jeder Zeile reicht bis zum Doppelten des Üblichen. */
const SKALA_FAKTOR = 2;
const PROZENT = 100;
/** Lage der Bandmitte der Spielerprofile (Bänder 400 breit). */
const HALBES_BAND = 200;
/** 90 % einer Normalverteilung liegen innerhalb von ±1,645 Standardabweichungen. */
const Z_90 = 1.645;

export type Klassenurteil = "gut" | "normal" | "schwach";

export interface Klassenvergleich {
  readonly klasse: Zugklasse;
  readonly anzahl: number;
  /** Anteil an den eigenen Zügen in Prozent. */
  readonly anteil: number;
  /** Üblicher Anteil bei dieser Spielstärke in Prozent (Median der Spieler). */
  readonly ueblich: number;
  /** Anteil geteilt durch den üblichen (1 = genau üblich). */
  readonly relativ: number;
  readonly urteil: Klassenurteil;
  /** Länge des Balkens auf der Skala 0 bis 1 (Skala bis zum Doppelten des Üblichen). */
  readonly balken: number;
  /** Zone „normal“ auf der Skala 0 bis 1: von … bis. */
  readonly normalVon: number;
  readonly normalBis: number;
  /** Ragt der Anteil über die Skala hinaus (etwa ein brillanter Zug in einer kurzen Partie)? */
  readonly ueberSkala: boolean;
}

/** Wert einer Stützstellenliste [x, y], gerade dazwischen, außen festgehalten. */
function interpoliert(punkte: readonly (readonly [number, number])[], x: number): number {
  const erste = punkte[0];
  const letzte = punkte[punkte.length - 1];
  if (!erste || !letzte) return 0;
  if (x <= erste[0]) return erste[1];
  if (x >= letzte[0]) return letzte[1];
  const oben = punkte.findIndex(([grenze]) => grenze >= x);
  const [xa, ya] = punkte[oben - 1] ?? erste;
  const [xb, yb] = punkte[oben] ?? letzte;
  return ya + ((x - xa) / (xb - xa)) * (yb - ya);
}

/** Die drei Quantile [5 %, Median, 95 %] einer Profilklasse bei dieser Stärke und Zeitklasse. */
function quantile(klasse: Zugklasse, elo: number, tempo: Wertungstempo): [number, number, number] {
  const baender = Object.entries(ZUGKLASSEN_UEBLICH[tempo])
    .map(([band, werte]) => [Number(band) + HALBES_BAND, werte[klasse]] as const)
    .sort((a, b) => a[0] - b[0]);
  const je = (i: 0 | 1 | 2) =>
    interpoliert(
      baender.map(([mitte, q]) => [mitte, q[i]] as const),
      elo,
    );
  return [je(0), je(1), je(2)];
}

/**
 * Üblich und Zone „normal“ (Prozent) einer Klasse bei dieser Stärke und Zeitklasse, ohne die
 * Zufallsstreuung der Partie. Beispiel: „patzer“ bei 1400 Schnellschach → üblich etwa 3,4 %,
 * normal etwa 1,8 bis 5 %. Sonderfall: brillant hat bei den meisten Spielern den Anteil 0; die
 * Mitte ist dann das Mittel der Spieler (spiel/zugklassenvergleich-daten.ts).
 */
export function ueblicheSpanne(
  klasse: Zugklasse,
  elo: number,
  tempo: Wertungstempo = "rapid",
): { readonly unten: number; readonly ueblich: number; readonly oben: number } {
  const [unten, ueblich, oben] = quantile(klasse, elo, tempo);
  return { unten, ueblich, oben };
}

/** Üblicher Anteil einer Klasse in Prozent (Median der Spieler). */
export function ueblicherAnteil(
  klasse: Zugklasse,
  elo: number,
  tempo: Wertungstempo = "rapid",
): number {
  return ueblicheSpanne(klasse, elo, tempo).ueblich;
}

/** Zufallsstreuung des Anteils (Prozentpunkte, 90 %) einer Partie mit so vielen Zügen. */
function zufallsbreite(ueblich: number, zuege: number): number {
  if (zuege <= 0) return 0;
  const p = ueblich / PROZENT;
  return Z_90 * Math.sqrt((p * (1 - p)) / zuege) * PROZENT;
}

/** Urteil aus der Lage zur Zone: bei guten Klassen ist mehr besser, bei schwachen weniger. */
function urteilFuer(klasse: Zugklasse, anteil: number, unten: number, oben: number): Klassenurteil {
  const viel = anteil > oben;
  const wenig = anteil < unten;
  if (!viel && !wenig) return "normal";
  return GUTE_KLASSEN.has(klasse) === viel ? "gut" : "schwach";
}

/**
 * Vergleich einer Klasse mit dem Üblichen.
 *
 * Eingaben: Klasse, Anzahl der Züge dieser Klasse, Zahl aller eigenen Züge, Spielstärke und
 * Zeitklasse für den Vergleich. Ausgabe: Anteil, üblicher Anteil, Verhältnis, Urteil, Balkenlänge
 * und die Zone „normal“ auf der Skala. Die Zone ist die Spanne der Spieler (5 bis 95 %), je Seite
 * um die Zufallsstreuung der Partie erweitert (quadratisch addiert).
 * Beispiel: 4 Ungenauigkeiten in 33 Zügen bei 1400 Schnellschach (üblich 13,8 %, Spieler 10,6 bis
 * 17,6 %, Zufall ±9,9 Punkte) → Anteil 12 %, „normal“. Ein brillanter Zug in 33 Zügen → weit über
 * dem Üblichen, „gut“, über der Skala.
 * Sonderfall: keine Züge → Anteil 0.
 */
export function vergleicheKlasse(
  klasse: Zugklasse,
  anzahl: number,
  zuege: number,
  elo: number,
  tempo: Wertungstempo = "rapid",
): Klassenvergleich {
  const anteil = zuege > 0 ? (anzahl / zuege) * PROZENT : 0;
  const { unten, ueblich, oben } = ueblicheSpanne(klasse, elo, tempo);
  const zufall = zufallsbreite(ueblich, zuege);
  const normalUnten = Math.max(0, ueblich - Math.hypot(ueblich - unten, zufall));
  const normalOben = ueblich + Math.hypot(oben - ueblich, zufall);
  const relativ = ueblich > 0 ? anteil / ueblich : 0;
  const skala = ueblich * SKALA_FAKTOR;
  return {
    klasse,
    anzahl,
    anteil,
    ueblich,
    relativ,
    urteil: urteilFuer(klasse, anteil, normalUnten, normalOben),
    balken: skala > 0 ? Math.min(anteil / skala, 1) : 0,
    normalVon: skala > 0 ? Math.min(normalUnten / skala, 1) : 0,
    normalBis: skala > 0 ? Math.min(normalOben / skala, 1) : 1,
    ueberSkala: anteil > skala,
  };
}
