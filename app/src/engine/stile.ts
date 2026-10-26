/**
 * Die sieben Spielstile der Bots (Teil D, Entscheidung des Autors 23.10.2026) als Verschiebungen
 * der Stilmerkmale im Wahlmodell.
 *
 * Rolle im Gesamtbild: Aus 3 889 Lichess-Spielern ergaben sich drei Stilachsen (Königsangriff,
 * Aktivität, Bauernsturm gegen Vereinfachen; docs/ENTSCHEIDUNGEN.md „Spielstile der Bots“). Ein
 * Stil liegt eine Standardabweichung von der Mitte auf einer Achse; je Bot genau ein Stil. Hier
 * wird jeder Stil auf die Stilmerkmale des Wahlmodells (engine/stilmerkmale.ts) abgebildet:
 * Königsangriff → Schach und Königsnähe, Aktivität → Schlag und Vorwärts gegen Rückzug, Bauernsturm
 * gegen Vereinfachen → Bauernsturm gegen Abtausch. Die Stärke je Merkmal (STAERKE) ist an der
 * Streuung der Menschen geeicht (etwa anderthalb Standardabweichungen). Der Regler −2 bis 2 eigener Gegner
 * (engine/stil.ts, engine/wahlschritt.ts) bleibt daneben bestehen.
 * Abhängigkeiten: engine/stilmerkmale.ts (Namen der Merkmale).
 */
import type { Stilmerkmale } from "./stilmerkmale";

/** Die Namen der sieben Stile, der letzte ist „universell“. */
export const STILNAMEN = [
  "angreifer",
  "positionsspieler",
  "taktiker",
  "verteidiger",
  "draufgaenger",
  "vereinfacher",
  "universell",
] as const;
export type Stilname = (typeof STILNAMEN)[number];

/**
 * Verschiebung des Nutzens je Stilmerkmal, so gewählt, dass ein Stil den Anteil der Züge mit dem
 * Merkmal um etwa anderthalb Standardabweichungen der Spieler verschiebt (deutlich erkennbar, aber
 * im Rahmen echter Spieler; Eichung 24.10.2026 an den Spielerprofilen, Schnellschach 1200:
 * Streuung zwischen Spielern Schach 2,5, Königsnähe 3,3, Schlag 2,3, Vorwärts 3,3, Rückzug 2,2,
 * Bauernsturm 1,7, Abtausch 1,3 Prozentpunkte; Wirkung im Wahlmodell je 0,5 Verschiebung:
 * +3,1, +4,2, +4,7, +8,2, −4,7, +4,9, +1,5 Punkte; lokal buch/arbeit/zugwahl/stilstaerke.py und
 * spielerprofil/stilstreuung.py).
 */
const STAERKE: Readonly<Record<keyof Stilmerkmale, number>> = {
  schach: 0.6,
  koenigsnaehe: 0.6,
  schlag: 0.4,
  vorwaerts: 0.3,
  rueckzug: 0.35,
  bauernsturm: 0.25,
  tausch: 0.6,
};

type Stilverschiebung = Readonly<Partial<Record<keyof Stilmerkmale, number>>>;

const STILE: Readonly<Record<Stilname, Stilverschiebung>> = {
  angreifer: { schach: STAERKE.schach, koenigsnaehe: STAERKE.koenigsnaehe },
  positionsspieler: { schach: -STAERKE.schach, koenigsnaehe: -STAERKE.koenigsnaehe },
  taktiker: { schlag: STAERKE.schlag, vorwaerts: STAERKE.vorwaerts, rueckzug: -STAERKE.rueckzug },
  verteidiger: {
    schlag: -STAERKE.schlag,
    vorwaerts: -STAERKE.vorwaerts,
    rueckzug: STAERKE.rueckzug,
  },
  draufgaenger: {
    bauernsturm: STAERKE.bauernsturm,
    vorwaerts: STAERKE.vorwaerts,
    tausch: -STAERKE.tausch,
  },
  vereinfacher: { tausch: STAERKE.tausch, bauernsturm: -STAERKE.bauernsturm },
  universell: {},
};

/**
 * Die Verschiebung eines Stils, auf Wunsch abgeschwächt oder verstärkt (Anteil 1: die geeichte
 * Stärke). Beispiel: „angreifer“ → Schach und Königsnähe je +0,6; Anteil 0,5 → je +0,3;
 * „universell“ → nichts.
 */
export function stilverschiebung(stil: Stilname, anteil = 1): Stilverschiebung {
  const aus: Partial<Record<keyof Stilmerkmale, number>> = {};
  for (const [merkmal, wert] of Object.entries(STILE[stil]) as [keyof Stilmerkmale, number][]) {
    aus[merkmal] = wert * anteil;
  }
  return aus;
}

/** Ein Stil mit Richtung (alle außer „universell“). */
export type Richtungsstil = Exclude<Stilname, "universell">;

/**
 * Eine Stil-Mischung eigener Bots (Wunsch des Autors): je Stil die Ausprägung in Prozent
 * der geeichten Stärke (50, 75, 100 oder 125). Je Achse höchstens ein Stil, denn die beiden Enden
 * einer Achse höben sich auf. Leer: universell.
 */
export type Stilmix = Readonly<Partial<Record<Richtungsstil, number>>>;

/** Die wählbaren Ausprägungen in Prozent; 100 ist die geeichte Stärke, 125 geht darüber hinaus. */
export const STILPROZENTE = [50, 75, 100, 125] as const;
/** Die geeichte Ausprägung in Prozent (Vorgabe). */
export const STILPROZENT_GEEICHT = 100;

/** Das andere Ende derselben Achse. */
export const GEGENUEBER: Readonly<Record<Richtungsstil, Richtungsstil>> = {
  angreifer: "positionsspieler",
  positionsspieler: "angreifer",
  taktiker: "verteidiger",
  verteidiger: "taktiker",
  draufgaenger: "vereinfacher",
  vereinfacher: "draufgaenger",
};

/** Die drei Achsen, je mit ihren beiden Enden. */
export const STILACHSEN: readonly (readonly [Richtungsstil, Richtungsstil])[] = [
  ["angreifer", "positionsspieler"],
  ["taktiker", "verteidiger"],
  ["draufgaenger", "vereinfacher"],
];

/**
 * Die Verschiebung einer Mischung: Summe der Stile mal Prozent.
 * Beispiel: { angreifer: 100, taktiker: 50 } → Schach +0,6, Königsnähe +0,6, Schlag +0,2,
 * Vorwärts +0,15, Rückzug −0,175.
 */
export function mischverschiebung(mix: Stilmix): Stilverschiebung {
  const aus: Partial<Record<keyof Stilmerkmale, number>> = {};
  for (const [stil, prozent] of Object.entries(mix) as [Richtungsstil, number][]) {
    const teil = stilverschiebung(stil, prozent / STILPROZENT_GEEICHT);
    for (const [merkmal, wert] of Object.entries(teil) as [keyof Stilmerkmale, number][]) {
      aus[merkmal] = (aus[merkmal] ?? 0) + wert;
    }
  }
  return aus;
}

/**
 * Ein Tipp auf einen Punkt des Netzes: setzt den Stil auf die Ausprägung und nimmt das Gegenüber
 * weg; derselbe Punkt noch einmal nimmt den Stil weg.
 * Beispiel: {} + angreifer 75 → { angreifer: 75 }; + positionsspieler 100 → { positionsspieler: 100 }.
 */
export function mitStil(mix: Stilmix, stil: Richtungsstil, prozent: number): Stilmix {
  const ohne = ohneStile(mix, [stil, GEGENUEBER[stil]]);
  return mix[stil] === prozent ? ohne : { ...ohne, [stil]: prozent };
}

/** Die Mischung ohne die genannten Stile. Beispiel: { angreifer: 50 } ohne [angreifer] → {}. */
export function ohneStile(mix: Stilmix, weg: readonly Richtungsstil[]): Stilmix {
  return Object.fromEntries(
    Object.entries(mix).filter(([stil]) => !(weg as readonly string[]).includes(stil)),
  );
}

/** Die Mischung eines einzelnen Stils (ältere Daten mit nur `stilname`). */
export function mixAusStil(stil: Stilname | undefined): Stilmix {
  return stil && stil !== "universell" ? { [stil]: STILPROZENT_GEEICHT } : {};
}

/** Der erste Stil einer Mischung (für `stilname`, das ältere Versionen lesen), sonst universell. */
export function hauptstil(mix: Stilmix): Stilname {
  return (Object.keys(mix)[0] as Richtungsstil | undefined) ?? "universell";
}
