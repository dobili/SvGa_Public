/**
 * Die Wörter, mit denen Pfeile, Nummerntexte und Legende im PGN-Kommentar lesbar stehen.
 *
 * Rolle im Gesamtbild: spiel/variationsformen.ts bleibt rein und bekommt die Wörter als Eingabe;
 * diese Datei holt sie aus den Texten der App. Geschrieben wird in der eingestellten Sprache,
 * gelesen werden die eingestellte Sprache und Deutsch (die Grundsprache ist immer geladen). So
 * kommt eine PGN aus der App mit ihren Texten zurück, auch nach einem Umweg über Lichess.
 * Abhängigkeiten: i18n (de.json, sprache.ts), analyse/werkzeug.ts.
 */
import type { Markierungsfarbe } from "../analyse/werkzeug";
import de from "../i18n/de.json";
import { GRUNDSPRACHE, sprache, t, type Textschluessel } from "../i18n/sprache";
import type { Formwoerter } from "./variationsformen";

/** Die Wörter aus einer Textquelle. */
function woerterAus(text: (schluessel: Textschluessel) => string): Formwoerter {
  const farbe: Record<Markierungsfarbe, string> = {
    gold: text("varianten.farbe.gold"),
    rot: text("varianten.farbe.rot"),
    grau: text("varianten.farbe.grau"),
    gruen: text("varianten.farbe.gruen"),
    blau: text("varianten.farbe.blau"),
  };
  return { farbe, legende: text("varianten.legende.wort") };
}

/** Die deutschen Wörter (Grundsprache, immer geladen). */
export function deutscheFormwoerter(): Formwoerter {
  return woerterAus((s) => de[s]);
}

/**
 * Die Wörter zum Schreiben (zuerst) und alle zum Lesen.
 * Beispiel: Sprache Englisch → [„Red“ …, „Rot“ …]; Deutsch → nur [„Rot“ …].
 */
export function formwoerter(): [Formwoerter, ...Formwoerter[]] {
  const jetzt = woerterAus((s) => t(s));
  return sprache() === GRUNDSPRACHE ? [jetzt] : [jetzt, deutscheFormwoerter()];
}
