/**
 * Der Zug der Engine im Spiel gegen den Leser, je nach Stufe, mit Protokoll absichtlicher Fehler.
 *
 * Rolle im Gesamtbild: „waehleZug“ aus Konzept 8.1. Verfahren aus Konzept 8.2: Jede Stufe hat
 * eine Grundstärke (engine/stufen.ts); in den Stufen 1 bis 4 trifft mit der Fehlerquote der Stufe
 * ein Fehlerwurf, dann sucht die Fehlersuche (engine/fehlersuche.ts) einen typischen Fehlerzug
 * mit begrenztem Verlust und merkt sich seine Art für die Auswertung. Sonst spielt die Engine
 * mit der Grundstärke der Stufe. Eröffnungsmodus (Konzept 8.3): Gibt der Aufrufer Buchzüge aus
 * Kapitel 2 und 3 mit, spielt die Engine meist einen davon und verlässt das Buch gewichtet
 * zufällig (Buchtreue 0,85; so bleibt die Engine etwa fünf bis sieben Züge im Buch).
 * Abhängigkeiten: engine/fehlersuche.ts, engine/spielbewerter.ts, engine/stufen.ts.
 */
import { sucheFehlerzug } from "./fehlersuche";
import type { Spielbewerter, Zugwahl } from "./spielbewerter";
import type { Stufe } from "./stufen";

export type { Spielbewerter, Zugwahl } from "./spielbewerter";
export { wertFuer } from "./spielbewerter";

/** Mit dieser Wahrscheinlichkeit bleibt die Engine im Buch, solange es Buchzüge gibt. */
export const BUCHTREUE = 0.85;
/** Hat der Leser eine Eröffnung vorgegeben, folgt die Engine ihr immer (0.2.39). */
export const BUCHTREUE_VORGABE = 1;

function zufallsauswahl<T>(liste: readonly T[], zufall: () => number): T | undefined {
  return liste[Math.floor(zufall() * liste.length)];
}

/**
 * Wählt den Zug der Engine.
 *
 * Warum: Konzept 8.1 „waehleZug“: Stellung, Stufe, Verlauf → Zug und, falls absichtlich, die
 * Fehlerart. Eingaben: Bewerter, Stellung, Stufe, Buchzüge in UCI (leer außerhalb des Buches),
 * Zufallsquelle (für Tests fest), Buchtreue (0,85, bei vorgegebener Eröffnung 1). Ausgabe: Zug
 * oder null, wenn es keinen legalen Zug gibt.
 * Beispiel: Stufe 1 nach 1. e4 e5 2. Dh5: in etwa jedem dritten Zug ein Fehlerzug, sonst der
 * Zug der Engine mit Skill Level 0.
 * Sonderfall: Findet die Fehlersuche keinen Zug in den Grenzen der Stufe, zieht die Engine normal.
 */
export async function waehleZug(
  bewerter: Spielbewerter,
  fen: string,
  stufe: Stufe,
  buchzuege: readonly string[],
  zufall: () => number,
  buchtreue: number = BUCHTREUE,
): Promise<Zugwahl | null> {
  if (buchzuege.length > 0 && zufall() < buchtreue) {
    const buchzug = zufallsauswahl(buchzuege, zufall);
    if (buchzug) return { uci: buchzug, quelle: "buch", fehler: null, verlust: 0 };
  }
  if (stufe.fehlerquote > 0 && zufall() < stufe.fehlerquote) {
    const fehler = await sucheFehlerzug(bewerter, fen, stufe, zufall);
    if (fehler) return fehler;
  }
  const bewertung = await bewerter.bewerte(fen, stufe.rechenzeitMs, 1, stufe.staerke);
  return bewertung.besterZug
    ? { uci: bewertung.besterZug, quelle: "engine", fehler: null, verlust: 0 }
    : null;
}
