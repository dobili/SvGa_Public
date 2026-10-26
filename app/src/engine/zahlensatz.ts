/**
 * Zwei Zahlensätze der Bot-Stärke: ohne und mit Maia (Neumessung Plan C).
 *
 * Rolle im Gesamtbild: Mit dem Maia-Zusatzpaket wählen die Bots menschlicher und spielen ab Stufe 4
 * deutlich stärker (Neumessung 25.10.2026: um 200 Elo, weit über der Grenze von ±65, die der Autor
 * für einen gemeinsamen Satz gesetzt hatte). Deshalb gibt es je Stufe, Bot und Gruppe zwei Zahlen.
 * Die Wertung einer Partie nimmt den Satz, mit dem sie gespielt wurde (Partieeinstellung „maia“);
 * die Anzeige in Gegnerwahl, Sprechblase und Startstärke nimmt den Satz, der jetzt gilt (Paket
 * geladen und eingeschaltet). Die Oberfläche stellt diesen Satz beim Zeichnen ein
 * (ui/komponenten/maiastand.ts, useAnzeigesatz).
 * Sonderfall: Uhrabzüge sind nur ohne Maia gemessen und gelten für beide Sätze.
 * Abhängigkeiten: engine/botstaerke-daten.ts, engine/botstaerke-maia-daten.ts,
 * engine/gruppenstaerke-daten.ts, engine/stufen.ts (Typ).
 */
import { BOT_STAERKE, STUFEN_STAERKE } from "./botstaerke-daten";
import {
  BOT_STAERKE_MAIA,
  GRUPPEN_STAERKE_MAIA,
  STUFEN_STAERKE_MAIA,
} from "./botstaerke-maia-daten";
import { GRUPPEN_STAERKE } from "./gruppenstaerke-daten";
import type { Stufennummer } from "./stufen";

export type Zahlensatz = "ohne" | "mit";

let anzeigesatz: Zahlensatz = "ohne";

/**
 * Stellt den Satz der Anzeige ein (Maia geladen und eingeschaltet → „mit“).
 * Beispiel: setzeAnzeigesatz(true) → Gegnerwahl zeigt die Zahlen mit Maia.
 */
export function setzeAnzeigesatz(mitMaia: boolean): void {
  anzeigesatz = mitMaia ? "mit" : "ohne";
}

/** Der Satz, der jetzt gilt (für die Anzeige). */
export function aktiverAnzeigesatz(): Zahlensatz {
  return anzeigesatz;
}

/**
 * Der Satz zu einer Angabe: true/false aus einer Partie, sonst der Satz der Anzeige.
 * Beispiel: satzFuer(undefined) bei eingeschaltetem Maia → „mit“; satzFuer(false) → „ohne“.
 */
export function satzFuer(maia: boolean | undefined): Zahlensatz {
  if (maia === undefined) return anzeigesatz;
  return maia ? "mit" : "ohne";
}

/** Die Zahlen der Stufen (Schnellschach) im Satz. */
export function stufentabelle(satz: Zahlensatz): Readonly<Record<Stufennummer, number>> {
  return satz === "mit" ? STUFEN_STAERKE_MAIA : STUFEN_STAERKE;
}

/** Die Zahlen der vorgefertigten Bots (Schnellschach) im Satz. */
export function bottabelle(satz: Zahlensatz): Readonly<Record<string, number>> {
  return satz === "mit" ? BOT_STAERKE_MAIA : BOT_STAERKE;
}

/** Die gemessenen Zahlen des Gruppenmodus im Satz. */
export function gruppentabelle(satz: Zahlensatz): Readonly<Partial<Record<Stufennummer, number>>> {
  return satz === "mit" ? GRUPPEN_STAERKE_MAIA : GRUPPEN_STAERKE;
}
