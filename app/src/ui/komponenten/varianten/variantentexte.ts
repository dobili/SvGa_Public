/**
 * Kleine Textbausteine der Varianten: Zugnummer vor einem Zug, Marke der Quelle, Dateiname,
 * die Quellen des Blatts „Neue Variante“.
 *
 * Rolle im Gesamtbild: Von mehreren Komponenten in komponenten/varianten genutzt; in einer
 * eigenen Datei, damit die Komponentendateien nur Komponenten ausgeben (schnelles Neuladen).
 * Abhängigkeiten: schach/variationsbaum.ts (Typ), training/variationen.ts (Typ), i18n.
 */
import { t } from "../../../i18n/sprache";
import type { Leistenzug } from "../../../schach/variationsbaum";
import type { Variationsquelle } from "../../../training/variationen";
import type { Markierungsfarbe } from "../../../analyse/werkzeug";

/** Der Name einer Stiftfarbe in der Sprache („Rot“). */
export function farbname(farbe: Markierungsfarbe): string {
  return t(`varianten.farbe.${farbe}`);
}

/**
 * „5.“ vor weißen Zügen, „5...“ vor einem schwarzen Zug am Anfang der Zeile.
 * Regel: Kapitel 0, „Wie liest man Schachzüge?“ („...“ für Schwarz).
 */
export function nummerVor(zug: Pick<Leistenzug, "weiss" | "nummer">, erster: boolean): string {
  if (zug.weiss) return `${zug.nummer}. `;
  return erster ? `${zug.nummer}... ` : "";
}

/** Die Marke der Quelle: „Abb. 2.40“, „Partie“, „Fehler“, „Lernsammlung“, „PGN“, „Stellung“. */
export function quellenmarke(quelle: Variationsquelle): string {
  if (quelle.art === "abbildung") return t("abbildung.titel", { nummer: quelle.nummer });
  return t(`varianten.quelle.${quelle.art}`);
}

/** Dateiname aus einem Titel: „petroff-falle“; Umlaute umschrieben, Leeres als „variante“. */
export function dateiteil(titel: string): string {
  const teil = titel
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return teil || "variante";
}

/**
 * Die Quellen des Blatts „Neue Variante aus …“ in der Reihenfolge des Bildes h; dahinter die
 * Quellen der Stufe 4 (ganze Eröffnung, Meisterpartie aus Kapitel 11 oder den Zusatzpartien; bis 1.11.2026 Studie aus Kapitel 10).
 */
export const NEUQUELLEN = [
  "grund",
  "abbildung",
  "partie",
  "stellung",
  "einfuegen",
  "fehler",
  "sammlung",
  "eroeffnung",
  "meisterpartie",
] as const;
export type Neuquelle = (typeof NEUQUELLEN)[number];
