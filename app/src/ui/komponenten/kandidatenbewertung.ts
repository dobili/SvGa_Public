/**
 * Bewertung der Kandidaten durch die Engine, in Worten: Wie verändert ein Kandidat die
 * Stellungsbewertung gegenüber der Stellung jetzt?
 *
 * Rolle im Gesamtbild: Reiner Rechen- und Textteil für KandidatenKarte.tsx (Werkzeug
 * k12-kandidaten, Schritt 4). Wunsch des Autors (R43, 23.10.2026): Bei ruhigen Zügen sagt
 * „Material −1“ nach einem Zug Tiefe nichts; stattdessen zeigt die Karte die Bewertung der Engine
 * und ob der Kandidat die Stellung hält, verbessert oder verschlechtert.
 * Abhängigkeiten: engine/uci.ts (Wert), engine/wertInWorten.ts (Zahl, Grenze), i18n.
 * Buchbezug: Kapitel 12, Denkroutine Schritt 4 („Am Ende bewerten und vergleichen … Wähle den
 * Kandidaten, der gegen die stärkste Antwort das beste Ergebnis bringt“).
 */
import type { Color } from "chessops/types";
import type { Wert } from "../../engine/uci";
import { GRENZE_AUSGEGLICHEN, wertAlsZahl } from "../../engine/wertInWorten";
import { t, zahlText } from "../../i18n/sprache";

/** Nachkommastellen für den Unterschied zweier Werte in Bauerneinheiten. */
const NACHKOMMASTELLEN = 2;

/** Das Urteil über einen Kandidaten gegenüber der Stellung jetzt. */
export type Kandidatenurteil =
  | { readonly art: "haelt" }
  | { readonly art: "besser"; readonly betrag: number }
  | { readonly art: "schlechter"; readonly betrag: number }
  | { readonly art: "setztMatt"; readonly zuege: number }
  | { readonly art: "wirdMatt"; readonly zuege: number };

/**
 * Ein Wert der Engine (aus Sicht von Weiß) aus Sicht einer Seite: Für Schwarz drehen sich das
 * Vorzeichen der Bauern und das des Matts. Beispiel: +0,80 für Schwarz → −0,80; #3 → −#3.
 */
export function wertAusSicht(wert: Wert, seite: Color): Wert {
  if (seite === "white") return wert;
  return wert.art === "bauern"
    ? { art: "bauern", bauern: -wert.bauern }
    : { art: "matt", zuege: -wert.zuege };
}

/**
 * Das Urteil über einen Kandidaten: Verglichen wird seine Bewertung mit der Bewertung der
 * Stellung jetzt (beide aus Sicht der eigenen Seite).
 *
 * Regel: Bis zur Grenze „ausgeglichen“ (0,3 Bauern, Konzept 8.1) hält der Kandidat die
 * Stellung; darüber verbessert oder verschlechtert er sie um den Betrag. Ein Matt geht vor.
 * Beispiel: jetzt +0,40, Kandidat +0,30 → hält; Kandidat −1,20 → verschlechtert um 1,60.
 */
export function kandidatenurteil(jetzt: Wert, danach: Wert): Kandidatenurteil {
  if (danach.art === "matt")
    return danach.zuege > 0
      ? { art: "setztMatt", zuege: danach.zuege }
      : { art: "wirdMatt", zuege: -danach.zuege };
  // Jetzt steht ein Matt, der Kandidat gibt es her: das zählt als Verschlechterung.
  if (jetzt.art === "matt")
    return jetzt.zuege > 0
      ? { art: "schlechter", betrag: Number.POSITIVE_INFINITY }
      : { art: "besser", betrag: Number.POSITIVE_INFINITY };
  const unterschied = danach.bauern - jetzt.bauern;
  if (Math.abs(unterschied) <= GRENZE_AUSGEGLICHEN) return { art: "haelt" };
  return unterschied > 0
    ? { art: "besser", betrag: unterschied }
    : { art: "schlechter", betrag: -unterschied };
}

/** Der Betrag als Text: „1,60“; ein verschenktes Matt ohne Zahl. */
function betragtext(betrag: number): string {
  return Number.isFinite(betrag)
    ? zahlText(betrag, NACHKOMMASTELLEN)
    : t("kandidaten.engine.dasMatt");
}

/**
 * Das Urteil in Worten. Beispiel: „hält die Stellung“, „verschlechtert um 1,60“, „setzt matt
 * in 2“.
 */
export function urteiltext(urteil: Kandidatenurteil): string {
  switch (urteil.art) {
    case "haelt":
      return t("kandidaten.engine.haelt");
    case "besser":
      return t("kandidaten.engine.besser", { betrag: betragtext(urteil.betrag) });
    case "schlechter":
      return t("kandidaten.engine.schlechter", { betrag: betragtext(urteil.betrag) });
    case "setztMatt":
      return t("kandidaten.engine.setztMatt", { zuege: urteil.zuege });
    case "wirdMatt":
      return t("kandidaten.engine.wirdMatt", { zuege: urteil.zuege });
  }
}

/** Ein Wert aus Sicht der eigenen Seite als Zahl: „+0,40“, „−1,20“, „#2“. */
export function wertzahl(wert: Wert, seite: Color): string {
  return wertAlsZahl(wertAusSicht(wert, seite));
}

/**
 * Zahl zum Vergleichen der Kandidaten: größer ist besser, ein eigenes Matt am größten.
 * Beispiel: #2 → 998, −0,50 → −0,5.
 */
export function vergleichswert(wert: Wert): number {
  const MATT = 1000;
  if (wert.art === "bauern") return wert.bauern;
  return Math.sign(wert.zuege) * (MATT - Math.abs(wert.zuege));
}
