/**
 * Gemeinsame Helfer der Fundstücke (Gamifizierung P10 b) für Meldung, Karte, Profilkarte und
 * Album: Kennung des Albums in der Ansicht „zusatz“ (app/zusatzansichten.ts), Texte und Zählung.
 * Eigene Datei, damit die Komponentendateien nur Komponenten enthalten (schnelles Neuladen).
 * Abhängigkeiten: training/fundstuecke.ts, i18n.
 */
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Nutzerdaten } from "../../../speicher/format";
import { fundstueck, type Fundstueck } from "../../../training/fundstuecke";

/** Kennung des Albums: navigiere({ bildschirm: "zusatz", kennung: ALBUM }). */
export const ALBUM = "fundstuecke";

/** Der Text eines Fundstücks in der gewählten Sprache (fundstueck.text.<kennung>). */
export function fundstuecktext(kennung: string): string {
  return t(`fundstueck.text.${kennung}` as Textschluessel);
}

/** Die Zeile über dem Text, etwa „Merksatz · Kapitel 7“ oder „Aus der Geschichte“. */
export function fundstueckzeile({ art, kapitel }: Fundstueck): string {
  const name = t(`fundstueck.art.${art}` as Textschluessel);
  return kapitel === null ? name : `${name} · ${t("fundstueck.kapitel", { kapitel })}`;
}

/** Zahl der gefundenen, die dieser Katalog kennt. Beispiel: ["gabel", "unbekannt"] → 1. */
export function gefundeneAnzahl(gefunden: readonly string[]): number {
  return gefunden.filter((k) => fundstueck(k) !== undefined).length;
}

/**
 * Ist die Profilkarte zu zeigen? Erst ab dem ersten Fund, damit das Album eine Überraschung
 * bleibt und nicht als Versprechen wirkt (Vorrecherche, P10 b).
 */
export function fundstueckeSichtbar(daten: Nutzerdaten): boolean {
  return gefundeneAnzahl(daten.fundstuecke) > 0;
}
