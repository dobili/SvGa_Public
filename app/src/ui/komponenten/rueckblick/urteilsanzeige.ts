/**
 * Rechnungen für den Kopf der Rückblickkarte (Urteilskopf.tsx): die Veränderung der Bewertung als
 * Pfeil mit Zahl und die Zugklassen, deren Satz nur im ⓘ steht.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, Punkt P13 (31.10.2026). Notiz des Autors: Eine
 * Veränderung zeigt man als Pfeil mit Zahl („▲ 0,1“ grün, „▼ 11,6“ rot), nicht als Balken. Die
 * Richtung gilt aus Sicht der Seite, die gezogen hat, wie der Verlust in der Falle (Bewertung
 * vorher minus nachher). Eigene Datei, damit Urteilskopf.tsx nur Komponenten ausführt.
 * Abhängigkeiten: spiel/auswertung.ts (Typ Zugklasse), i18n (zahlText).
 */
import { zahlText } from "../../../i18n/sprache";
import type { Zugklasse } from "../../../spiel/auswertung";

/** Ab dieser Bewertung (Bauerneinheiten) steht ein Matt (wie spiel/rueckblick.ts). */
const MATTWERT = 10;
/** Unter dieser Veränderung zeigt die Anzeige „± 0,0“ (rundet auf eine Stelle). */
const UNVERAENDERT_UNTER = 0.05;

/** Klassen, deren Satz nichts über Marke und Zug hinaus sagt: Er steht nur im ⓘ. */
export const NUR_MARKE: ReadonlySet<Zugklasse> = new Set(["brillant", "stark", "bester", "buch"]);

/**
 * Die Veränderung als Pfeil und Zahl; Richtung aus Sicht der ziehenden Seite. Werte aus Sicht von
 * Weiß in Bauerneinheiten (wie der Balken am Brett).
 * Beispiel: Weiß zieht, +1,5 → +1,6 → { pfeil: "auf", text: "▲ 0,1" }; Schwarz zieht, +0,2 →
 * +3,4 → „▼ 3,2“. Sonderfälle: unter 0,05 „± 0,0“; ist ein Matt beteiligt, steht „M“ statt Zahl.
 */
export function aenderungstext(
  vorher: number,
  nachher: number,
  weissZog: boolean,
): { pfeil: "auf" | "ab" | "gleich"; text: string } {
  const mattBeteiligt = Math.abs(vorher) >= MATTWERT || Math.abs(nachher) >= MATTWERT;
  const roh = (nachher - vorher) * (weissZog ? 1 : -1);
  if (Math.abs(roh) < UNVERAENDERT_UNTER) return { pfeil: "gleich", text: "± 0,0" };
  const pfeil = roh > 0 ? "auf" : "ab";
  const zeichen = pfeil === "auf" ? "▲" : "▼";
  return { pfeil, text: `${zeichen} ${mattBeteiligt ? "M" : zahlText(Math.abs(roh), 1)}` };
}
