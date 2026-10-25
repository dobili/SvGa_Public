/**
 * Die Uhr der Bots in der Partie: Lage des Zuges, simulierte Bedenkzeit und
 * der Zug mit Abzug von der Uhr (auch Zeitverlust).
 *
 * Rolle im Gesamtbild: Plan „menschlichere Bots und Uhr der Bots“ (vom Autor freigegeben am
 * 20.10.2026). Die Engine rechnet in etwa einer Sekunde; mit Uhr zieht ihr die App stattdessen
 * die Zeit ab, die ein Mensch dieser Stärke gebraucht hätte (engine/bedenkzeit.ts). Seit 0.2.126
 * zieht der Bot, sobald die Engine fertig ist, und seine Uhr springt auf den Stand nach der
 * simulierten Bedenkzeit (Klarstellung des Autors, 24.10.2026: Die Uhr läuft künstlich herunter,
 * der Zug kommt nicht künstlich später; bis dahin wartete er sichtbar bis zu 2,5 Sekunden).
 * Reicht seine Zeit nicht, verliert er auf Zeit, wie ein Mensch. Ohne Uhr bleibt alles wie bisher.
 * Abhängigkeiten: engine/bedenkzeit.ts, spiel/partie.ts, spiel/uhr.ts, spiel/ablauf.ts,
 * spiel/zuege.ts.
 */
import type { Color } from "chessops/types";
import { bedenkzeitMs, type Zuglage } from "../engine/bedenkzeit";
import { wertungInZeitklasse } from "../engine/zeitklassenabstand";
import { wertungstempo } from "./elomodell";
import { zieheMitUhr } from "./ablauf";
import {
  amZug,
  mitUhr,
  stellungen,
  zeitUeberschritten,
  type Partie,
  type Partiezug,
} from "./partie";
import { halte, restzeit } from "./uhr";
import { sanZuUci } from "./zuege";

/** Die volle Engine (Stufe 8) denkt wie Menschen über 2400. */
export const WERTUNG_VOLLE_ENGINE = 2600;
const BEZUGSFELD_LAENGE = 2;
const BRETTREIHEN = 8;

/** Die Restzeit der Seite am Zug (null ohne Uhr). */
export function eigeneRestzeit(partie: Partie, jetztMs: number): number | null {
  if (!partie.uhr || !partie.einstellung.uhr) return null;
  return restzeit(partie.uhr, amZug(partie), jetztMs);
}

/** Zielfeld eines UCI-Zuges („e4d5“ → „d5“). */
function ziel(uci: string): string {
  return uci.slice(BEZUGSFELD_LAENGE, 2 * BEZUGSFELD_LAENGE);
}

/**
 * Die Lage des Zuges für die Bedenkzeit: Wiederschlag (Schlag auf das Feld, auf dem der Gegner
 * eben geschlagen hat), Schach, ein einziger guter Zug, wenige oder viele gleich gute.
 * Beispiel: nach 1. e4 d5 2. exd5 ist 2... Dxd5 ein Wiederschlag.
 */
export function zuglage(partie: Partie, uci: string, breite: number | undefined): Zuglage {
  const fens = stellungen(partie);
  const jetzt = fens.at(-1) ?? "";
  const vorher = fens.at(-2);
  const letzter = partie.zuege.at(-1);
  if (vorher && letzter && letzter.san.includes("x")) {
    const vorigerUci = sanZuUci(vorher, letzter.san);
    if (vorigerUci && istSchlag(jetzt, uci) && ziel(vorigerUci) === ziel(uci))
      return "wiederschlag";
  }
  if (letzter?.san.includes("+")) return "schach";
  if (breite === undefined) return "eng";
  return breite <= 1 ? "einzig" : breite <= 3 ? "eng" : "offen";
}

/** Schlägt der UCI-Zug in der Stellung eine Figur? (Zielfeld besetzt; en passant zählt nicht.) */
function istSchlag(fen: string, uci: string): boolean {
  const brett = fen.split(" ")[0] ?? "";
  const reihen = brett.split("/");
  const linie = uci.charCodeAt(BEZUGSFELD_LAENGE) - "a".charCodeAt(0);
  const reihe = Number(uci[BEZUGSFELD_LAENGE + 1]);
  const zeile = reihen[BRETTREIHEN - reihe] ?? "";
  let spalte = 0;
  for (const zeichen of zeile) {
    if (/\d/.test(zeichen)) spalte += Number(zeichen);
    else {
      if (spalte === linie) return true;
      spalte += 1;
    }
  }
  return false;
}

/**
 * Simulierte Bedenkzeit des Bots für diesen Zug (null ohne Uhr).
 * Eingaben: Partie vor dem Zug, Zug (UCI, Herkunft, Breite), Stärke, Zeit, Zufall.
 */
export function botBedenkzeit(
  partie: Partie,
  zug: { readonly uci: string; readonly quelle: string; readonly breite?: number },
  wertung: number | null,
  jetztMs: number,
  zufall: () => number,
): number | null {
  const rest = eigeneRestzeit(partie, jetztMs);
  if (rest === null) return null;
  const tempo = wertungstempo(partie.einstellung.uhr);
  return bedenkzeitMs(
    {
      // Seit 0.2.131 die Wertung desselben Menschen in dieser Zeitklasse (engine/zeitklassenabstand.ts).
      wertung: wertungInZeitklasse(wertung ?? WERTUNG_VOLLE_ENGINE, tempo),
      tempo,
      restMs: rest,
      zugnummer: Math.floor(partie.zuege.length / 2) + 1,
      lage: zuglage(partie, zug.uci, zug.breite),
      buchzug: zug.quelle === "buch",
    },
    zufall,
  );
}

/**
 * Spielt den Zug des Bots und zieht ihm die simulierte Bedenkzeit ab (statt der echten Zeit);
 * reicht seine Restzeit nicht, verliert er auf Zeit, und der Zug wird nicht mehr gespielt.
 * Ohne laufende Uhr der Seite (erster Zug, Pause) wie zieheMitUhr.
 * Beispiel: 5 + 3, Bot mit 4:00, Bedenkzeit 7 s → 3:53 und der Zuschlag, also 3:56.
 */
export function zieheBotMitUhr(
  partie: Partie,
  zug: Partiezug,
  bedenkMs: number | null,
  jetztMs: number,
  appSichtbar = true,
): Partie | null {
  const uhr = partie.uhr;
  const gezogen: Color = amZug(partie);
  if (bedenkMs === null || !uhr || uhr.laeuft !== gezogen) {
    return zieheMitUhr(partie, zug, jetztMs, appSichtbar);
  }
  const rest = uhr.restMs[gezogen];
  const simuliert = { ...uhr, seitMs: jetztMs - bedenkMs };
  if (bedenkMs >= rest) {
    return mitUhr(zeitUeberschritten(partie, gezogen), halte(simuliert, jetztMs));
  }
  return zieheMitUhr(mitUhr(partie, simuliert), zug, jetztMs, appSichtbar);
}
