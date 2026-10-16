/**
 * Der Zug der Engine im Spiel gegen den Leser, je nach Stufe, mit Protokoll absichtlicher Fehler.
 *
 * Rolle im Gesamtbild: „waehleZug“ aus Konzept 8.1. Verfahren aus Konzept 8.2: Die Engine
 * liefert mehrere Kandidaten mit Bewertung; in den Stufen 1 bis 3 wählt die Zugwahl mit der
 * Fehlerquote der Stufe einen typischen Fehlerzug (Verlust höchstens der Höchstverlust der Stufe)
 * und merkt sich seine Art für die Auswertung. Ab Stufe 4 begrenzt die Engine sich selbst.
 * Eröffnungsmodus (Konzept 8.3): Gibt der Aufrufer Buchzüge aus Kapitel 2 und 3 mit, spielt die
 * Engine meist einen davon und verlässt das Buch gewichtet zufällig.
 *
 * PLATZHALTER (AP 11, Opus): Kandidatenzahl, Mindestverlust, Buchtreue und die Auswahl unter den
 * Fehlerzügen sind Startwerte; Fable kalibriert sie mit den Fehlerprofilen.
 * Abhängigkeiten: engine/engineDienst.ts, engine/stufen.ts, engine/fehlerart.ts, uci.ts.
 */
import { VOLLE_STAERKE, type Bewertung, type Staerke } from "./engineDienst";
import { fehlerartVon, type Fehlerart } from "./fehlerart";
import type { Stufe } from "./stufen";
import type { Variante, Wert } from "./uci";

/** Was die Zugwahl von der Engine braucht (der Engine-Dienst erfüllt das). */
export interface Spielbewerter {
  bewerte(
    fen: string,
    rechenzeitMs: number,
    varianten: number,
    staerke?: Staerke,
  ): Promise<Bewertung>;
}

/** Der gewählte Zug: UCI, Herkunft und, falls absichtlich, die Fehlerart. */
export interface Zugwahl {
  readonly uci: string;
  readonly quelle: "buch" | "engine" | "fehler";
  readonly fehler: Fehlerart | null;
  /** Verlust gegenüber dem besten Zug in Bauerneinheiten (nur bei Fehlern). */
  readonly verlust: number;
}

/** So viele Kandidaten rechnet die Engine in den Stufen 1 bis 3. */
const KANDIDATEN = 8;
/** Ein Fehlerzug verliert mindestens so viel; kleinere Abweichungen sind keine Fehler. */
const MINDESTVERLUST = 0.5;
/** Mit dieser Wahrscheinlichkeit bleibt die Engine im Buch, solange es Buchzüge gibt. */
const BUCHTREUE = 0.85;
/** Ein Matt zählt wie dieser Wert (in Bauerneinheiten), minus der Züge bis zum Matt. */
const MATTWERT = 100;

/** Wert aus Sicht der Seite am Zug in Bauerneinheiten (Matt als großer Wert). */
export function wertFuer(wert: Wert, weissAmZug: boolean): number {
  const ausSichtWeiss =
    wert.art === "bauern" ? wert.bauern : Math.sign(wert.zuege) * (MATTWERT - Math.abs(wert.zuege));
  return weissAmZug ? ausSichtWeiss : -ausSichtWeiss;
}

function zufallsauswahl<T>(liste: readonly T[], zufall: () => number): T | undefined {
  return liste[Math.floor(zufall() * liste.length)];
}

/**
 * Sucht unter den Kandidaten einen Fehlerzug: Verlust zwischen Mindest- und Höchstverlust,
 * am liebsten einer mit erkannter Fehlerart.
 */
function fehlerzug(
  fen: string,
  varianten: readonly Variante[],
  hoechstverlust: number,
  zufall: () => number,
): Zugwahl | null {
  const weissAmZug = fen.split(" ")[1] !== "b";
  const beste = varianten[0];
  if (!beste) return null;
  const bestwert = wertFuer(beste.wert, weissAmZug);
  const moegliche = varianten
    .slice(1)
    .map((v) => ({ v, verlust: bestwert - wertFuer(v.wert, weissAmZug) }))
    .filter(({ verlust }) => verlust >= MINDESTVERLUST && verlust <= hoechstverlust)
    .map(({ v, verlust }) => ({ v, verlust, art: fehlerartVon(fen, v.zuege, verlust) }));
  const typische = moegliche.filter((m) => m.art !== "ungenau");
  const wahl = zufallsauswahl(typische.length > 0 ? typische : moegliche, zufall);
  const uci = wahl?.v.zuege[0];
  return wahl && uci ? { uci, quelle: "fehler", fehler: wahl.art, verlust: wahl.verlust } : null;
}

/**
 * Wählt den Zug der Engine.
 *
 * Warum: Konzept 8.1 „waehleZug“: Stellung, Stufe, Verlauf → Zug und, falls absichtlich, die
 * Fehlerart. Eingaben: Bewerter, Stellung, Stufe, Buchzüge in UCI (leer außerhalb des Buches),
 * Zufallsquelle (für Tests fest). Ausgabe: Zug oder null, wenn es keinen legalen Zug gibt.
 * Beispiel: Stufe 1 nach 1. e4 e5 2. Dh5: in etwa jedem dritten Zug ein Fehlerzug, sonst der
 * beste Zug der Engine.
 */
export async function waehleZug(
  bewerter: Spielbewerter,
  fen: string,
  stufe: Stufe,
  buchzuege: readonly string[],
  zufall: () => number,
): Promise<Zugwahl | null> {
  if (buchzuege.length > 0 && zufall() < BUCHTREUE) {
    const buchzug = zufallsauswahl(buchzuege, zufall);
    if (buchzug) return { uci: buchzug, quelle: "buch", fehler: null, verlust: 0 };
  }
  const v = stufe.verfahren;
  if (v.art === "engine") {
    const bewertung = await bewerter.bewerte(fen, stufe.rechenzeitMs, 1, v.staerke);
    return bewertung.besterZug
      ? { uci: bewertung.besterZug, quelle: "engine", fehler: null, verlust: 0 }
      : null;
  }
  const bewertung = await bewerter.bewerte(fen, stufe.rechenzeitMs, KANDIDATEN, VOLLE_STAERKE);
  if (zufall() < v.fehlerquote) {
    const fehler = fehlerzug(fen, bewertung.varianten, v.hoechstverlust, zufall);
    if (fehler) return fehler;
  }
  const bester = bewertung.varianten[0]?.zuege[0] ?? bewertung.besterZug;
  return bester ? { uci: bester, quelle: "engine", fehler: null, verlust: 0 } : null;
}
