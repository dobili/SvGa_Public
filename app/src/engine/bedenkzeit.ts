/**
 * Bedenkzeit der Bots: wie lange ein Mensch dieser Stärke für einen Zug brauchen würde.
 *
 * Rolle im Gesamtbild: Plan „menschlichere Bots und Uhr der Bots“ (vom Autor freigegeben am
 * 20.10.2026). Die Engine rechnet in einer Sekunde; mit Uhr zieht die App ihr stattdessen eine
 * menschliche Bedenkzeit ab (spiel/ablauf.ts), so dass auch ein Bot in Zeitnot geraten und auf
 * Zeit verlieren kann. Die Zahlen stammen aus gewerteten Lichess-Partien (engine/menschenprofil-
 * daten.ts): Bei mindestens einer Minute Restzeit braucht ein Mensch einen Anteil seiner Restzeit,
 * der mit der Zugnummer wächst (Eröffnungszüge kommen schnell, gute Spieler kennen mehr Theorie)
 * und nach der Lage schwankt (ein Wiederschlag halb so lang, ein einziger guter Zug länger). Unter
 * 60, 30 und 10 Sekunden zieht er im Schnitt in festen, kurzen Zeiten (Schnell- und Notmodus).
 * Seit 0.2.125 (Restplan 8b) gelten Anteile und Zeitnot-Sekunden je Zeitklasse
 * (engine/bedenkzeit-daten.ts, aus 390 000 Zügen der Spielerprofile): Im Blitz braucht ein Zug
 * etwa den doppelten Anteil der Restzeit wie im Schnellschach, im Klassischen etwa die Hälfte.
 * Abhängigkeiten: engine/menschenprofil.ts, engine/bedenkzeit-daten.ts, spiel/elomodell-daten.ts.
 */
import type { Wertungstempo } from "../spiel/elomodell-daten";
import { BEDENKZEIT_JE_TEMPO, BEDENKZEIT_ZUGSTUFEN } from "./bedenkzeit-daten";
import { bandwert, BAND_UNTERGRENZEN, BEDENKZEIT_DATEN, zeitnotstufe } from "./menschenprofil";

/** Wie schwer die Wahl war (wie in der Auswertung der Lichess-Partien). */
export type Zuglage = "wiederschlag" | "schach" | "einzig" | "eng" | "offen";

export interface Bedenklage {
  /** Spielstärke (Wertung der Stufe; volle Engine wie 2600). */
  readonly wertung: number;
  /** Zeitklasse der Partie (Blitz, Schnellschach, Klassisch wie Lichess). */
  readonly tempo: Wertungstempo;
  readonly restMs: number;
  /** Zugnummer (1 für den ersten Zug jeder Seite). */
  readonly zugnummer: number;
  readonly lage: Zuglage;
  /** Ein Buchzug (Eröffnungsmodus): Theorie, kaum Bedenkzeit. */
  readonly buchzug: boolean;
}

const SEKUNDE_MS = 1000;
/** Streuung der Bedenkzeit (log-normal) in ruhiger Zeit, gedeckelt; in Zeitnot enger. */
const STREUUNG_HOECHSTENS = 1;
const STREUUNG_ZEITNOT = 0.5;
/** Ein Buchzug braucht so viel der üblichen Zeit. */
const BUCHZUG = 0.3;
/** Nie mehr als dieser Anteil der Restzeit für einen Zug, nie weniger als diese Zeit. */
const HOECHSTENS_ANTEIL = 0.25;
const MINDESTENS_MS = 200;
const ZWEI_PI = 2 * Math.PI;
const KLEIN = 1e-9;

/** Eine Normalverteilte Zahl (Box-Muller) aus zwei Zufallszahlen. */
function normal(zufall: () => number): number {
  const u = Math.max(KLEIN, zufall());
  const v = zufall();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(ZWEI_PI * v);
}

/** Anteil der Restzeit für einen Zug dieser Nummer bei dieser Stärke und Zeitklasse (Median der Menschen). */
function anteilNachZug(tempo: Wertungstempo, wertung: number, zugnummer: number): number {
  const anteile = BEDENKZEIT_JE_TEMPO[tempo].anteil;
  let index = 0;
  BEDENKZEIT_ZUGSTUFEN.forEach((s, i) => {
    if (zugnummer >= s) index = i;
  });
  const jeBand = BAND_UNTERGRENZEN.map((b) => anteile[String(b)]?.[index] ?? 0);
  return bandwert(jeBand, wertung);
}

/**
 * Die simulierte Bedenkzeit in Millisekunden.
 *
 * Eingaben: Stärke, Restzeit, Zugnummer, Lage, Buchzug; Zufall (für Tests fest).
 * Ausgabe: Millisekunden, mindestens 0,2 s; kann über der Restzeit liegen (dann ist die Zeit um).
 * Beispiel: Stärke 1200, Schnellschach, 4 Minuten Rest, Zug 20, enge Lage → etwa 1,5 % der
 * Restzeit, also um 4 Sekunden (je nach Zufall 1 bis 12); im Blitz etwa das Doppelte; dieselbe
 * Lage mit 8 Sekunden Rest → etwa 2 Sekunden.
 */
export function bedenkzeitMs(lage: Bedenklage, zufall: () => number): number {
  const stufe = zeitnotstufe(lage.restMs);
  const daten = BEDENKZEIT_DATEN;
  if (stufe) {
    const sekunden = bandwert(BEDENKZEIT_JE_TEMPO[lage.tempo].zeitnotSekunden[stufe], lage.wertung);
    const ms = sekunden * SEKUNDE_MS * Math.exp(STREUUNG_ZEITNOT * normal(zufall));
    return Math.max(MINDESTENS_MS, lage.buchzug ? ms * BUCHZUG : ms);
  }
  const streuung = Math.min(STREUUNG_HOECHSTENS, daten.streuung);
  const faktor = daten.lage[lage.lage] * Math.exp(streuung * normal(zufall));
  const anteil =
    anteilNachZug(lage.tempo, lage.wertung, lage.zugnummer) * faktor * (lage.buchzug ? BUCHZUG : 1);
  return Math.max(MINDESTENS_MS, Math.min(HOECHSTENS_ANTEIL, anteil) * lage.restMs);
}
