/**
 * Gemeinsame Begriffe der Zugwahl im Spiel gegen die Engine: Bewerter, gewählter Zug, Werte.
 *
 * Rolle im Gesamtbild: engine/zugwahl.ts (Zug je Stufe) und engine/fehlersuche.ts (Fehlerzüge
 * der Stufen 1 bis 4) teilen diese Typen; die Auswertung (ui/komponenten/useAuswertung.ts)
 * rechnet mit „wertFuer“ die Werte der Engine in Bauerneinheiten um.
 * Abhängigkeiten: engine/engineDienst.ts, engine/fehlerart-typen.ts, engine/uci.ts.
 */
import type { Bewertung, Staerke } from "./engineDienst";
import type { Fehlerart } from "./fehlerart-typen";
import type { Wert } from "./uci";

/** Was die Zugwahl von der Engine braucht (der Engine-Dienst erfüllt das). */
export interface Spielbewerter {
  bewerte(
    fen: string,
    rechenzeitMs: number,
    varianten: number,
    staerke?: Staerke,
    nurZuege?: readonly string[],
  ): Promise<Bewertung>;
}

/** Der gewählte Zug: UCI, Herkunft und, falls absichtlich, die Fehlerart. */
export interface Zugwahl {
  readonly uci: string;
  readonly quelle: "buch" | "engine" | "fehler";
  readonly fehler: Fehlerart | null;
  /** Verlust gegenüber dem besten Zug in Bauerneinheiten (nur bei Fehlern). */
  readonly verlust: number;
  /**
   * Zahl der Kandidaten höchstens 0,3 Bauern hinter dem besten (seit 0.2.117, für die Bedenkzeit
   * der Bots: ein einziger guter Zug kostet Menschen mehr Zeit als viele gleich gute).
   */
  readonly breite?: number;
}

/** Ein Matt zählt wie dieser Wert (in Bauerneinheiten), minus der Züge bis zum Matt. */
const MATTWERT = 100;

/**
 * Wert aus Sicht der Seite am Zug in Bauerneinheiten (Matt als großer Wert).
 *
 * Beispiel: Matt in 2 für Weiß, Weiß am Zug → 98; Matt in 3 gegen Weiß → −97.
 */
export function wertFuer(wert: Wert, weissAmZug: boolean): number {
  const ausSichtWeiss =
    wert.art === "bauern" ? wert.bauern : Math.sign(wert.zuege) * (MATTWERT - Math.abs(wert.zuege));
  return weissAmZug ? ausSichtWeiss : -ausSichtWeiss;
}
