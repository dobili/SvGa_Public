/**
 * Den Wert der Engine in Worte fassen: „ausgeglichen“, „Weiß steht leicht besser“ …
 *
 * Rolle im Gesamtbild: Leser des Buches denken in Worten, nicht in Hundertstel Bauern.
 * Abhängigkeiten: i18n, uci.ts.
 * Buchbezug: Konzept Abschnitt 8.1, „Wert in Worten“. Die Grenzen sind Startwerte und werden im
 * Test mit dem Autor angepasst.
 */
import { t, zahlText } from "../i18n/sprache";
import type { Wert } from "./uci";

/** Bis zu diesem Betrag gilt die Stellung als ausgeglichen (Konzept 8.1). */
export const GRENZE_AUSGEGLICHEN = 0.3;
/** Bis zu diesem Betrag steht eine Seite leicht besser (Konzept 8.1). */
export const GRENZE_LEICHT_BESSER = 0.8;
/** Bis zu diesem Betrag steht eine Seite deutlich besser, darüber auf Gewinn (Konzept 8.1). */
export const GRENZE_DEUTLICH_BESSER = 2.0;

/** Nachkommastellen bei der Anzeige von Bauerneinheiten. */
const NACHKOMMASTELLEN = 2;

/**
 * Formatiert einen Wert als Zahl wie im Buch: „+0,25“, „−1,40“, „#3“.
 *
 * Eingabe: Wert aus Sicht von Weiß. Ausgabe: Text mit deutschem Komma.
 */
export function wertAlsZahl(wert: Wert): string {
  if (wert.art === "matt") {
    return `${wert.zuege < 0 ? "−" : ""}#${Math.abs(wert.zuege)}`;
  }
  const betrag = zahlText(Math.abs(wert.bauern), NACHKOMMASTELLEN);
  return `${wert.bauern < 0 ? "−" : "+"}${betrag}`;
}

/**
 * Fasst einen Wert in Worte.
 *
 * Warum: Pflichtenheft und Konzept 8.1 verlangen eine verbale Einschätzung neben der Zahl.
 * Eingabe: Wert aus Sicht von Weiß. Ausgabe: Satz.
 * Beispiel: +0,25 → „ausgeglichen“; −1,40 → „Schwarz steht deutlich besser“; Matt −3 →
 * „Matt in 3 für Schwarz“.
 */
export function wertInWorten(wert: Wert): string {
  if (wert.art === "matt") {
    const farbe = t(wert.zuege > 0 ? "farbe.w" : "farbe.b");
    return t("engine.matt", { zuege: Math.abs(wert.zuege), farbe });
  }
  const betrag = Math.abs(wert.bauern);
  const farbe = t(wert.bauern > 0 ? "farbe.w" : "farbe.b");
  if (betrag <= GRENZE_AUSGEGLICHEN) return t("engine.ausgeglichen");
  if (betrag <= GRENZE_LEICHT_BESSER) return t("engine.leichtBesser", { farbe });
  if (betrag <= GRENZE_DEUTLICH_BESSER) return t("engine.deutlichBesser", { farbe });
  return t("engine.aufGewinn", { farbe });
}
