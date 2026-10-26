/**
 * Spielstärke-Bewertung nach der Partie: Genauigkeit, geschätzte Spielstärke und Zugzeichen je Seite.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors („Elo-Schätzung für beide Seiten, Anzahl der !, ?,
 * ?! Züge, Genauigkeit wie bei chess.com“). Die Genauigkeit folgt der Rechnung von Lichess (offen
 * dokumentiert, in spiel/zuggenauigkeit.ts): Jede Bewertung wird in eine Gewinnwahrscheinlichkeit
 * umgerechnet, die Genauigkeit eines Zuges fällt mit dem Verlust an Gewinnwahrscheinlichkeit;
 * die Genauigkeit der Partie ist wie bei Lichess das Mittel aus zwei Mitteln der
 * eigenen Züge: dem nach der Schwankung der Partie gewichteten Mittel (ruhige, längst entschiedene
 * Phasen zählen wenig, die Kämpfe viel) und dem harmonischen Mittel (ein grober Fehler drückt die
 * Zahl spürbar). Dazu ein Urteilswort je Phase (wie die Symbole je Phase bei chess.com)
 * und die Spielstärke im Mittelspiel getrennt nach Taktik und Strategie (spiel/taktik.ts). Reine
 * Funktionen, die Werte kommen aus der Auswertung.
 * Für Spielstärke und Urteilswort zählen nur die Züge bis zur Entscheidung der Partie
 * (spiel/entscheidung.ts). Die Spielstärke kommt aus dem Elo-Modell je Zeitklasse
 * (spiel/elomodell.ts: Kennzahlen der Züge bis zur Entscheidung, Maßstab Lichess, Spanne für 90 %
 * der Spieler; Entscheidung des Autors, 23.10.2026); die Genauigkeit ist die von Lichess über
 * alle Züge.
 * Abhängigkeiten: spiel/auswertung.ts, spiel/zuggenauigkeit.ts, spiel/entscheidung.ts, spiel/partie.ts, spiel/phasen.ts,
 * spiel/phasenurteil.ts, spiel/taktik.ts, spiel/elomodell.ts.
 */
import type { Color } from "chessops/types";
import { type Zugklasse, type Zugurteil, type Zugzeichen } from "./auswertung";
import { gewerteteHalbzuege } from "./entscheidung";
import { stellungen, type Partie } from "./partie";
import { phasenJeStellung, type Phase } from "./phasen";
import {
  istSchmal,
  kennzahlenAus,
  schaetzung as wertungsschaetzung,
  type Kennzahlzug,
  type Partiekennzahlen,
  type Wertungsschaetzung,
  type Wertungstempo,
} from "./elomodell";
import type { Zugart } from "./taktik";
import {
  gewinnwahrscheinlichkeit,
  partiegenauigkeit,
  zuggenauigkeit,
  zuggewichte,
  GEWICHT_MINDESTENS,
} from "./zuggenauigkeit";

export interface Seitenbilanz {
  /** Zahl der eigenen Züge. */
  readonly zuege: number;
  /** Genauigkeit 0 bis 100 nach der Rechnung von Lichess über alle Züge; null ohne Züge. */
  readonly genauigkeit: number | null;
  /** Innere Genauigkeit (Lichess) für Spielstärke und Urteilswort, nur bis zur Entscheidung. */
  readonly innen: number | null;
  /** Züge bis zur Entscheidung (spiel/entscheidung.ts); nur sie zählen für `innen`. */
  readonly gewertet: number;
  /** Durchschnittlicher Verlust je Zug in Bauerneinheiten. */
  readonly verlustJeZug: number;
  /**
   * Geschätzte Spielstärke (Mitte der Schätzung); null bei zu wenigen Zügen und bei einer Phase,
   * deren Spanne zu breit ist (spiel/elomodell.ts, SCHMAL).
   */
  readonly spielstaerke: number | null;
  /** Die Schätzung des Elo-Modells der Zeitklasse mit Spanne; null bei zu wenigen Zügen. */
  readonly schaetzung: Wertungsschaetzung | null;
  /** Kennzahlen der Züge bis zur Entscheidung für die Schätzung über mehrere Partien; null ohne Züge. */
  readonly kennzahlen: Partiekennzahlen | null;
  /** Anzahl je Zeichen. */
  readonly zeichen: Readonly<Record<Zugzeichen, number>>;
  /** Anzahl je Zugklasse (wie bei chess.com). */
  readonly klassen: Readonly<Record<Zugklasse, number>>;
  /** Züge, die der beste Zug der Engine waren. */
  readonly beste: number;
}

export interface Spielstaerke {
  readonly white: Seitenbilanz;
  readonly black: Seitenbilanz;
}

const PROZENT = 100;
/** Unter so vielen Zügen ist eine Schätzung der Spielstärke nicht sinnvoll. */
const MINDESTENS_ZUEGE = 10;
/** Je Phase reichen weniger Züge für eine (noch gröbere) Schätzung. */
const MINDESTENS_ZUEGE_PHASE = 6;
/**
 * Entschieden ist eine Stellung, wenn die Gewinnwahrscheinlichkeit der ziehenden Seite vor dem Zug
 * über 90 % oder unter 10 % liegt (etwa sechs Bauern Vorsprung oder Rückstand); solche Züge zählen
 * je nach Modus weniger (staerkemodell.ts, POLSTER).
 */
export const ENTSCHIEDEN_AB = 90;

export { phasenurteil, type Phasenurteil } from "./phasenurteil";
export { gewinnwahrscheinlichkeit, partiegenauigkeit, zuggenauigkeit, zuggewichte };

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

/** Bilanz einer Seite aus ihren Zügen; mit Phase die Schätzung aus dem Teilmodell dieser Phase. */
function seitenbilanz(
  eigene: readonly Zugbilanz[],
  tempo: Wertungstempo,
  phase: Phase | null = null,
  mindestensZuege = MINDESTENS_ZUEGE,
): Seitenbilanz {
  const zuege = eigene.length;
  const zeichen = { ...KEINE_ZEICHEN };
  const klassen = { ...KEINE_KLASSEN };
  let verlust = 0;
  let beste = 0;
  for (const z of eigene) {
    if (z.urteil.zeichen) zeichen[z.urteil.zeichen] += 1;
    klassen[z.urteil.klasse] += 1;
    verlust += z.urteil.verlust;
    if (z.bester) beste += 1;
  }
  const verlustJeZug = zuege > 0 ? verlust / zuege : 0;
  const gewertete = eigene.filter((z) => z.gewertet);
  const innen = partiegenauigkeit(gewertete);
  const kennzahlen = kennzahlenAus(gewertete.map(kennzahlzug), innen);
  const schaetzung =
    gewertete.length >= mindestensZuege && kennzahlen
      ? wertungsschaetzung(tempo, kennzahlen, 1, phase)
      : null;
  const schmal = schaetzung !== null && (phase === null || istSchmal(schaetzung));
  return {
    zuege,
    genauigkeit: partiegenauigkeit(eigene),
    innen,
    gewertet: gewertete.length,
    verlustJeZug,
    spielstaerke: schmal ? schaetzung.mitte : null,
    schaetzung,
    kennzahlen,
    zeichen,
    klassen,
    beste,
  };
}

/** Ein eingeordneter Zug mit Seite, Genauigkeit, Gewicht, „bester“ und der Phase seiner Stellung. */
interface Zugbilanz {
  readonly seite: Color;
  readonly phase: Phase | null;
  readonly urteil: Zugurteil;
  readonly genauigkeit: number;
  readonly gewicht: number;
  readonly bester: boolean;
  /** Stellung vor dem Zug entschieden (siehe ENTSCHIEDEN_AB). */
  readonly entschieden: boolean;
  /** Zug vor dem Entscheidungspunkt (zählt für Spielstärke und Urteilswort). */
  readonly gewertet: boolean;
  /** Wert nach dem Zug aus Sicht der ziehenden Seite (Bauern), für die Zugklasse des Elo-Modells. */
  readonly nachher: number;
}

/** Der Zug, wie das Elo-Modell ihn braucht (spiel/elomodell.ts). */
function kennzahlzug(z: Zugbilanz): Kennzahlzug {
  return {
    verlust: z.urteil.verlust,
    genauigkeit: z.genauigkeit,
    nachher: z.nachher,
    phase: z.phase,
  };
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
  const gewichte = zuggewichte(werte);
  const bis = gewerteteHalbzuege(werte.map(gewinnwahrscheinlichkeit));
  return urteile.map((urteil) => {
    const fen = alle[urteil.index] ?? "";
    const seite: Color = fen.split(" ")[1] === "b" ? "black" : "white";
    const vorher = gewinnwahrscheinlichkeit(werte[urteil.index] ?? 0);
    const nachher = gewinnwahrscheinlichkeit(werte[urteil.index + 1] ?? 0);
    const verlustProzent = seite === "white" ? vorher - nachher : nachher - vorher;
    const eigeneChance = seite === "white" ? vorher : PROZENT - vorher;
    const entschieden = eigeneChance >= ENTSCHIEDEN_AB || eigeneChance <= PROZENT - ENTSCHIEDEN_AB;
    const gespielt = gespielteUci[urteil.index] ?? null;
    const bester = gespielt !== null && gespielt !== "" && gespielt === beste[urteil.index];
    const phase = phasen[urteil.index] ?? null;
    const gewicht = gewichte[urteil.index] ?? GEWICHT_MINDESTENS;
    const wertNachher = werte[urteil.index + 1] ?? 0;
    return {
      seite,
      phase,
      urteil,
      genauigkeit: zuggenauigkeit(verlustProzent),
      gewicht,
      bester,
      entschieden,
      gewertet: urteil.index < bis,
      nachher: seite === "white" ? wertNachher : -wertNachher,
    };
  });
}

/**
 * Die Spielstärke-Bewertung je Phase (Wunsch des Autors): Eröffnung, Mittelspiel,
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
  tempo: Wertungstempo = "rapid",
): Readonly<Record<Phase, Spielstaerke>> {
  const alle = zugbilanzen(partie, werte, urteile, beste, gespielteUci, phasen);
  const je = (ph: Phase): Spielstaerke => ({
    white: seitenbilanz(
      alle.filter((z) => z.phase === ph && z.seite === "white"),
      tempo,
      ph,
      MINDESTENS_ZUEGE_PHASE,
    ),
    black: seitenbilanz(
      alle.filter((z) => z.phase === ph && z.seite === "black"),
      tempo,
      ph,
      MINDESTENS_ZUEGE_PHASE,
    ),
  });
  return { eroeffnung: je("eroeffnung"), mittelspiel: je("mittelspiel"), endspiel: je("endspiel") };
}

/**
 * Die Spielstärke im Mittelspiel getrennt nach Zugart (Taktik: Stellungen mit Schach, Drohung
 * oder Schlag mit Gewinn; Strategie: ruhige Stellungen, spiel/taktik.ts), beide Seiten, Schätzung
 * ab sechs Zügen. Eröffnung und Endspiel bleiben ungeteilt (wie bei chess.com).
 * Eingaben wie `spielstaerkeJePhase`, dazu die Zugart je Stellung.
 * Beispiel: Partie des Autors gegen einen 1700er-Bot: Taktik 12 Züge, Strategie 20 Züge.
 */
export function spielstaerkeImMittelspiel(
  partie: Partie,
  werte: readonly number[],
  urteile: readonly Zugurteil[],
  beste: readonly string[],
  gespielteUci: readonly (string | null)[],
  phasen: readonly Phase[],
  zugarten: readonly (Zugart | null)[],
  tempo: Wertungstempo = "rapid",
): Readonly<Record<Zugart, Spielstaerke>> {
  const mittelspiel = zugbilanzen(partie, werte, urteile, beste, gespielteUci, phasen).filter(
    (z) => z.phase === "mittelspiel",
  );
  const je = (art: Zugart): Spielstaerke => {
    const passende = mittelspiel.filter((z) => zugarten[z.urteil.index] === art);
    return {
      white: seitenbilanz(
        passende.filter((z) => z.seite === "white"),
        tempo,
        "mittelspiel",
        MINDESTENS_ZUEGE_PHASE,
      ),
      black: seitenbilanz(
        passende.filter((z) => z.seite === "black"),
        tempo,
        "mittelspiel",
        MINDESTENS_ZUEGE_PHASE,
      ),
    };
  };
  return { taktik: je("taktik"), strategie: je("strategie") };
}

/**
 * Die Spielstärke-Bewertung beider Seiten.
 *
 * Eingaben: Partie, Werte je Stellung aus Sicht von Weiß, Urteile je Halbzug (spiel/auswertung.ts),
 * beste Züge je Stellung (UCI, dürfen fehlen). Ausgabe: je Seite Genauigkeit, Verlust je Zug,
 * geschätzte Spielstärke, Zeichen und beste Züge.
 * Beispiel: Genauigkeit wie bei Lichess (partiegenauigkeit), für die Beispielpartie des Autors
 * 88 % und 76 % (chess.com: 86,8 und 80,3), daraus etwa 1500 und 750. Sonderfall: ohne Werte
 * (Auswertung läuft noch) sind beide Seiten leer.
 */
export function spielstaerke(
  partie: Partie,
  werte: readonly number[],
  urteile: readonly Zugurteil[],
  beste: readonly string[] = [],
  gespielteUci: readonly (string | null)[] = [],
  tempo: Wertungstempo = "rapid",
  phasen: readonly Phase[] = phasenJeStellung(partie),
): Spielstaerke {
  // Die Phase je Zug gehört seit 0.2.125 zu den Kennzahlen des Elo-Modells.
  const alle = zugbilanzen(partie, werte, urteile, beste, gespielteUci, phasen);
  return {
    white: seitenbilanz(
      alle.filter((z) => z.seite === "white"),
      tempo,
    ),
    black: seitenbilanz(
      alle.filter((z) => z.seite === "black"),
      tempo,
    ),
  };
}
