/**
 * Prinzipien gegen Engine: Wer steht nach der Bilanz des Buches vorn, und was sagt die Engine?
 *
 * Rolle im Gesamtbild: Punkt B3 des Nebenchats (Wunsch des Autors, 30.10.2026). Nach der Antwort
 * in Zielbilanz, Faktorenbilanz und Planbilanz zeigt die App den Bewertungsbalken; dieser Baustein
 * vergleicht das Urteil der Bilanz mit dem Wert der Engine und sagt in einem Satz, ob beide
 * übereinstimmen. Gerade der Widerspruch ist lehrreich: Die Bilanz ist eine Faustregel, die Engine
 * rechnet konkret.
 * Abhängigkeiten: training/zielzug.ts (Zielpunkte), training/faktorentrainer.ts (Vorn), i18n.
 * Buchbezug: Kapitel 2, Zielbilanz; Kapitel 3, „Ob die Kompensation reicht, beurteilt erst die
 * Engine“.
 */
import type { Color } from "chessops/types";
import { t, zahlText } from "../i18n/sprache";
import type { Zielbilanz } from "../schach/zielbilanz";
import type { Vorn } from "./faktorentrainer";
import { zielpunkte } from "./zielzug";

/** Unter diesem Betrag (Bauern) gilt die Stellung für die Engine als ausgeglichen. */
export const AUSGEGLICHEN_BIS = 0.5;
const NACHKOMMA = 1;
/**
 * Unter diesem Abstand der Zielpunkte gilt die Zielbilanz als ausgeglichen: eine volle Stufe
 * einer Wertung (training/zielzug.ts, Gewicht 3). Sonst trennten schon ein kontrolliertes
 * Zentrumsfeld mehr die Seiten, und Bilanz und Engine wären fast immer „uneinig“ (Prüfung beim
 * Übernehmen, 31.10.2026).
 */
export const ZIELBILANZ_GLEICH_BIS = 3;

/** Wen sieht die Engine vorn (Wert aus Sicht von Weiß)? */
export function engineVorn(wert: number): Vorn {
  if (Math.abs(wert) < AUSGEGLICHEN_BIS) return "gleich";
  return wert > 0 ? "white" : "black";
}

/** Wen sieht die Zielbilanz vorn? Nach den Zielpunkten beider Seiten. */
export function zielbilanzVorn(weiss: Zielbilanz, schwarz: Zielbilanz): Vorn {
  const differenz = zielpunkte(weiss) - zielpunkte(schwarz);
  if (Math.abs(differenz) < ZIELBILANZ_GLEICH_BIS) return "gleich";
  return differenz > 0 ? "white" : "black";
}

/**
 * Wen sieht die Faktorenbilanz vorn? Mehrheit der Faktoren (Material, Zeit, Königssicherheit,
 * Aktivität), bei Gleichstand „gleich“.
 */
export function faktorenVorn(faktoren: readonly Vorn[]): Vorn {
  const zaehle = (c: Color) => faktoren.filter((f) => f === c).length;
  const w = zaehle("white");
  const b = zaehle("black");
  if (w === b) return "gleich";
  return w > b ? "white" : "black";
}

/** „Weiß vorn“, „ausgeglichen“, „Schwarz vorn“. */
function vornText(v: Vorn): string {
  return t(`prinzip.vorn.${v}`);
}

/**
 * Der Satz zum Vergleich. Beispiel: Bilanz Weiß vorn, Engine −0,8 → „Nach der Bilanz steht
 * Weiß vorn, die Engine sieht Schwarz vorn (−0,8). …“
 * Sonderfall: Sieht nur die Bilanz eine Seite vorn und die Engine nichts Konkretes (unter 0,5),
 * ist das kein Widerspruch: Die Vorteile der Bilanz sind langfristig (eigener, ruhiger Satz).
 */
export function vergleichssatz(bilanz: Vorn, wert: number): string {
  const engine = engineVorn(wert);
  const zahl = `${wert >= 0 ? "+" : "−"}${zahlText(Math.abs(wert), NACHKOMMA)}`;
  const daten = { bilanz: vornText(bilanz), engine: vornText(engine), wert: zahl };
  if (engine === bilanz) return t("prinzip.einig", daten);
  return engine === "gleich" ? t("prinzip.langfristig", daten) : t("prinzip.uneinig", daten);
}
