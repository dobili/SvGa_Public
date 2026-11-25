/**
 * Gemeinsames der Varianten-Bots (Nebel, Ente, Tandem): die Engine als eingesteckte Funktion und
 * die Wahl unter guten Zügen.
 *
 * Warum: Die Bots sollen nicht immer den besten Zug spielen, sondern menschlich streuen, und sie
 * sollen ohne die Engine testbar sein (Attrappe in den Tests). Die Engine (Stockfish oder
 * Fairy-Stockfish, Zusatzpaket von mittel-3) reicht die Partiehülle herein.
 * Abhängigkeiten: keine.
 */

/** Ein von der Engine bewerteter Zug: UCI und Wert in Centipawns aus Sicht des Ziehenden. */
export interface Bewerteterzug {
  readonly zug: string;
  readonly wert: number;
}

/** Die Engine von außen: FEN und Zahl der Varianten → die besten Züge, bester zuerst. */
export type Zugbewerter = (fen: string, varianten: number) => Promise<readonly Bewerteterzug[]>;

/** Wie der Bot spielt: Zahl der Varianten, erlaubter Abstand zum besten Zug, Zufallsquelle. */
export interface Botstil {
  readonly varianten: number;
  /** Züge bis so viele Centipawns schlechter als der beste kommen in die Wahl. */
  readonly spielraumCp: number;
  /** Zufallszahl in [0, 1), für Tests fest. */
  readonly zufall: () => number;
}

/**
 * Wählt zufällig unter den Zügen, die höchstens `spielraumCp` schlechter sind als der beste,
 * gewichtet zugunsten der besseren. Ausgabe: der Index in `liste` (nicht leer).
 */
export function waehle(liste: readonly Bewerteterzug[], stil: Botstil): number {
  const bester = liste[0]?.wert ?? 0;
  const gute = liste.filter((z) => bester - z.wert <= stil.spielraumCp);
  const gewichte = gute.map((_, i) => gute.length - i);
  let rest = stil.zufall() * gewichte.reduce((a, b) => a + b, 0);
  for (let i = 0; i < gewichte.length; i++) {
    rest -= gewichte[i] ?? 0;
    if (rest < 0) return liste.indexOf(gute[i] as Bewerteterzug);
  }
  return 0;
}

/** Spielraum in Centipawns bei sehr schwachem und bei starkem Gegner. */
const SPIELRAUM_SCHWACH = 250;
const SPIELRAUM_STARK = 15;
/** Elo, ab der der Bot nur noch fast beste Züge spielt, und darunter die schwächste. */
const ELO_STARK = 2000;
const ELO_SCHWACH = 600;
const VARIANTEN = 4;

/**
 * Stil eines Varianten-Bots aus der Stärke des Gegners (Elo der Begegnung): Je schwächer, desto
 * größer der Spielraum, aus dem er zufällig wählt. Linear zwischen 600 (250 cp) und 2000 (15 cp).
 * Beispiel: 1200 → etwa 150 cp. Sonderfall: außerhalb begrenzt.
 */
export function botstilFuer(elo: number, zufall: () => number = Math.random): Botstil {
  const anteil = Math.min(1, Math.max(0, (elo - ELO_SCHWACH) / (ELO_STARK - ELO_SCHWACH)));
  const spielraumCp = Math.round(
    SPIELRAUM_SCHWACH - anteil * (SPIELRAUM_SCHWACH - SPIELRAUM_STARK),
  );
  return { varianten: VARIANTEN, spielraumCp, zufall };
}
