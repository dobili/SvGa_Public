/**
 * Spielstärke-Bewertung nach der Partie: Genauigkeit, geschätzte Spielstärke und Zugzeichen je Seite.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest von 0.2.38 („Elo-Schätzung für beide
 * Seiten, Anzahl der !, ?, ?! Züge, Genauigkeit wie bei chess.com“). Die Genauigkeit folgt der
 * Rechnung von Lichess (offen dokumentiert): Jede Bewertung wird in eine Gewinnwahrscheinlichkeit
 * umgerechnet, die Genauigkeit eines Zuges fällt mit dem Verlust an Gewinnwahrscheinlichkeit;
 * die Genauigkeit der Partie ist das Mittel über die eigenen Züge. Die Spielstärke ist eine grobe
 * Schätzung aus dem durchschnittlichen Verlust je Zug (Tabelle unten, aus Erfahrungswerten;
 * keine Wertungszahl eines Verbands). Reine Funktionen, die Werte kommen aus der Auswertung.
 * Abhängigkeiten: spiel/auswertung.ts, spiel/partie.ts.
 */
import type { Color } from "chessops/types";
import { WERTGRENZE, type Zugklasse, type Zugurteil, type Zugzeichen } from "./auswertung";
import { stellungen, type Partie } from "./partie";
import type { Phase } from "./phasen";
export interface Seitenbilanz {
  /** Zahl der eigenen Züge. */
  readonly zuege: number;
  /** Genauigkeit 0 bis 100, wie bei Lichess und chess.com; null ohne Züge. */
  readonly genauigkeit: number | null;
  /** Durchschnittlicher Verlust je Zug in Bauerneinheiten. */
  readonly verlustJeZug: number;
  /** Geschätzte Spielstärke (Elo-ähnlich); null bei zu wenigen Zügen. */
  readonly spielstaerke: number | null;
  /** Anzahl je Zeichen. */
  readonly zeichen: Readonly<Record<Zugzeichen, number>>;
  /** Anzahl je Zugklasse (wie bei chess.com, 0.2.40). */
  readonly klassen: Readonly<Record<Zugklasse, number>>;
  /** Züge, die der beste Zug der Engine waren. */
  readonly beste: number;
}

export interface Spielstaerke {
  readonly white: Seitenbilanz;
  readonly black: Seitenbilanz;
}

/** Steilheit der Gewinnwahrscheinlichkeit (Lichess: 0,00368208 je Centibauer). */
const STEILHEIT = 0.00368208;
const CENTI = 100;
const PROZENT = 100;
const HALB = 50;
/** Lichess: Genauigkeit eines Zuges = 103,1668 · e^(−0,04354 · Verlust in Prozentpunkten) − 3,1669. */
const GENAUIGKEIT_FAKTOR = 103.1668;
const GENAUIGKEIT_ABFALL = 0.04354;
const GENAUIGKEIT_VERSATZ = 3.1669;
/** Unter so vielen Zügen ist eine Schätzung der Spielstärke nicht sinnvoll. */
const MINDESTENS_ZUEGE = 10;
/** Je Phase reichen weniger Züge für eine (noch gröbere) Schätzung. */
const MINDESTENS_ZUEGE_PHASE = 6;
/**
 * Stützstellen: durchschnittlicher Verlust je Zug in Bauerneinheiten → Spielstärke. Grobe
 * Erfahrungswerte (Meisterpartien etwa 0,1 bis 0,2, Vereinsspieler 0,3 bis 0,5, Einsteiger ab
 * 1,0); dazwischen wird linear gerechnet.
 */
const STUETZSTELLEN: readonly (readonly [number, number])[] = [
  [0, 2900],
  [0.1, 2600],
  [0.2, 2250],
  [0.3, 2000],
  [0.4, 1800],
  [0.5, 1650],
  [0.6, 1500],
  [0.8, 1300],
  [1.0, 1100],
  [1.5, 800],
  [2.5, 500],
];
const RUNDUNG = 50;

/** Gewinnwahrscheinlichkeit von Weiß in Prozent aus dem Wert in Bauerneinheiten. */
export function gewinnwahrscheinlichkeit(wert: number): number {
  const begrenzt = Math.max(-WERTGRENZE, Math.min(WERTGRENZE, wert));
  return HALB + HALB * (2 / (1 + Math.exp(-STEILHEIT * begrenzt * CENTI)) - 1);
}

/** Genauigkeit eines Zuges (0 bis 100) aus dem Verlust an Gewinnwahrscheinlichkeit (Prozentpunkte). */
export function zuggenauigkeit(verlustProzent: number): number {
  const roh = GENAUIGKEIT_FAKTOR * Math.exp(-GENAUIGKEIT_ABFALL * Math.max(0, verlustProzent));
  return Math.max(0, Math.min(PROZENT, roh - GENAUIGKEIT_VERSATZ));
}

/** Spielstärke aus dem Verlust je Zug, linear zwischen den Stützstellen, auf 50 gerundet. */
export function spielstaerkeAus(verlustJeZug: number): number {
  const letzte = STUETZSTELLEN.at(-1) ?? [0, 0];
  if (verlustJeZug >= letzte[0]) return letzte[1];
  for (let i = 1; i < STUETZSTELLEN.length; i += 1) {
    const [x0, y0] = STUETZSTELLEN[i - 1] ?? [0, 0];
    const [x1, y1] = STUETZSTELLEN[i] ?? [0, 0];
    if (verlustJeZug <= x1) {
      const anteil = (verlustJeZug - x0) / (x1 - x0);
      return Math.round((y0 + anteil * (y1 - y0)) / RUNDUNG) * RUNDUNG;
    }
  }
  return letzte[1];
}

const KEINE_ZEICHEN: Readonly<Record<Zugzeichen, number>> = {
  "!!": 0,
  "!": 0,
  "?!": 0,
  "?": 0,
  "??": 0,
};
const KEINE_KLASSEN: Readonly<Record<Zugklasse, number>> = {
  brillant: 0,
  stark: 0,
  bester: 0,
  sehrGut: 0,
  gut: 0,
  buch: 0,
  ungenau: 0,
  fehler: 0,
  verpasst: 0,
  patzer: 0,
};

/** Bilanz einer Seite aus ihren Zügen. */
function seitenbilanz(
  eigene: readonly { urteil: Zugurteil; genauigkeit: number; bester: boolean }[],
  mindestensZuege = MINDESTENS_ZUEGE,
): Seitenbilanz {
  const zuege = eigene.length;
  const zeichen = { ...KEINE_ZEICHEN };
  const klassen = { ...KEINE_KLASSEN };
  let verlust = 0;
  let genauigkeit = 0;
  let beste = 0;
  for (const z of eigene) {
    if (z.urteil.zeichen) zeichen[z.urteil.zeichen] += 1;
    klassen[z.urteil.klasse] += 1;
    verlust += z.urteil.verlust;
    genauigkeit += z.genauigkeit;
    if (z.bester) beste += 1;
  }
  const verlustJeZug = zuege > 0 ? verlust / zuege : 0;
  return {
    zuege,
    genauigkeit: zuege > 0 ? genauigkeit / zuege : null,
    verlustJeZug,
    spielstaerke: zuege >= mindestensZuege ? spielstaerkeAus(verlustJeZug) : null,
    zeichen,
    klassen,
    beste,
  };
}

/** Ein eingeordneter Zug mit Seite, Genauigkeit, „bester“ und der Phase seiner Stellung. */
interface Zugbilanz {
  readonly seite: Color;
  readonly phase: Phase | null;
  readonly urteil: Zugurteil;
  readonly genauigkeit: number;
  readonly bester: boolean;
}

/** Ordnet jeden Zug ein (Seite, Phase, Genauigkeit, bester). */
function zugbilanzen(
  partie: Partie,
  werte: readonly number[],
  urteile: readonly Zugurteil[],
  beste: readonly string[],
  gespielteUci: readonly (string | null)[],
  phasen: readonly Phase[],
): Zugbilanz[] {
  const alle = stellungen(partie);
  return urteile.map((urteil) => {
    const fen = alle[urteil.index] ?? "";
    const seite: Color = fen.split(" ")[1] === "b" ? "black" : "white";
    const vorher = gewinnwahrscheinlichkeit(werte[urteil.index] ?? 0);
    const nachher = gewinnwahrscheinlichkeit(werte[urteil.index + 1] ?? 0);
    const verlustProzent = seite === "white" ? vorher - nachher : nachher - vorher;
    const gespielt = gespielteUci[urteil.index] ?? null;
    const bester = gespielt !== null && gespielt !== "" && gespielt === beste[urteil.index];
    const phase = phasen[urteil.index] ?? null;
    return { seite, phase, urteil, genauigkeit: zuggenauigkeit(verlustProzent), bester };
  });
}

/**
 * Die Spielstärke-Bewertung je Phase (Wunsch des Autors, 0.2.40): Eröffnung, Mittelspiel,
 * Endspiel, jeweils beide Seiten; Schätzung ab sechs Zügen je Phase.
 * Eingaben wie `spielstaerke`, dazu die Phase je Stellung (spiel/phasen.ts).
 */
export function spielstaerkeJePhase(
  partie: Partie,
  werte: readonly number[],
  urteile: readonly Zugurteil[],
  beste: readonly string[],
  gespielteUci: readonly (string | null)[],
  phasen: readonly Phase[],
): Readonly<Record<Phase, Spielstaerke>> {
  const alle = zugbilanzen(partie, werte, urteile, beste, gespielteUci, phasen);
  const je = (ph: Phase): Spielstaerke => ({
    white: seitenbilanz(
      alle.filter((z) => z.phase === ph && z.seite === "white"),
      MINDESTENS_ZUEGE_PHASE,
    ),
    black: seitenbilanz(
      alle.filter((z) => z.phase === ph && z.seite === "black"),
      MINDESTENS_ZUEGE_PHASE,
    ),
  });
  return { eroeffnung: je("eroeffnung"), mittelspiel: je("mittelspiel"), endspiel: je("endspiel") };
}

/**
 * Die Spielstärke-Bewertung beider Seiten.
 *
 * Eingaben: Partie, Werte je Stellung aus Sicht von Weiß, Urteile je Halbzug (spiel/auswertung.ts),
 * beste Züge je Stellung (UCI, dürfen fehlen). Ausgabe: je Seite Genauigkeit, Verlust je Zug,
 * geschätzte Spielstärke, Zeichen und beste Züge.
 * Beispiel: 20 eigene Züge mit durchschnittlich 0,4 Bauern Verlust → etwa 1800, Genauigkeit
 * etwa 80 %. Sonderfall: ohne Werte (Auswertung läuft noch) sind beide Seiten leer.
 */
export function spielstaerke(
  partie: Partie,
  werte: readonly number[],
  urteile: readonly Zugurteil[],
  beste: readonly string[] = [],
  gespielteUci: readonly (string | null)[] = [],
): Spielstaerke {
  const alle = zugbilanzen(partie, werte, urteile, beste, gespielteUci, []);
  return {
    white: seitenbilanz(alle.filter((z) => z.seite === "white")),
    black: seitenbilanz(alle.filter((z) => z.seite === "black")),
  };
}
