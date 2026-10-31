/**
 * Taktikaufgaben als Herausforderung (Gamifizierung P9): welche Aufgaben geteilt werden dürfen,
 * ihre Kennung in der Adresse und der Satz dazu.
 *
 * Rolle im Gesamtbild: Entscheidung E7: Geteilt werden nur Aufgaben aus freien Quellen. Im
 * Taktiktrainer sind das die Aufgaben der Lichess-Datenbank (CC0, Kennung „taktik-l-…“); die
 * Aufgaben aus den Abbildungen des Buches bleiben im Buch. In der Adresse steht die Kennung ohne
 * die Vorsilbe „taktik-“, damit der Link kurz bleibt („#aufgabe-taktik-l-1Vybh“).
 * Abhängigkeiten: daten/trainerdaten.ts (Typ).
 */
import type { Taktikaufgabe } from "../../../daten/trainerdaten";

/** Vorsilbe der Kennungen im Taktiktrainer. */
const VORSILBE = "taktik-";

/** Darf diese Aufgabe geteilt werden? Nur freie Quellen (Lichess, CC0), nie das Buch. */
export function taktikFrei(aufgabe: Taktikaufgabe): boolean {
  return aufgabe.herkunft.quelle === "lichess";
}

/** Kennung in der Adresse. Beispiel: „taktik-l-1Vybh“ → „l-1Vybh“. */
export function taktikKurz(aufgabe: Taktikaufgabe): string {
  return aufgabe.id.startsWith(VORSILBE) ? aufgabe.id.slice(VORSILBE.length) : aufgabe.id;
}

/**
 * Die freie Aufgabe zu einer Kennung aus der Adresse; null, wenn es sie nicht gibt oder sie aus
 * dem Buch stammt (ein Link auf eine Buchaufgabe öffnet nichts).
 */
export function findeFreieTaktik(
  aufgaben: readonly Taktikaufgabe[],
  kurz: string,
): Taktikaufgabe | null {
  const aufgabe = aufgaben.find((a) => a.id === `${VORSILBE}${kurz}`);
  return aufgabe && taktikFrei(aufgabe) ? aufgabe : null;
}
