/**
 * Texte der Rekordtafel (Gamifizierung P5): Name und Wert einer Rekordart aus „rekorde.art.<k>“ und
 * „rekorde.wert.<k>“ (Test in training/rekorde.test.ts).
 * Abhängigkeiten: i18n.
 */
import { t, tZahl, type Textschluessel } from "../../../i18n/sprache";

/**
 * Der Wert eines Rekords als Satzteil, mit Einzahl („…Eins“), wo es sie gibt.
 * Beispiel: ("taktikZeit", 14) → „14 richtig in 3 Minuten“; ("tagesserie", 1) → „1 Tag in Folge“.
 */
export function rekordtext(kennung: string, wert: number): string {
  return tZahl(`rekorde.wert.${kennung}` as Textschluessel, wert, { wert });
}

/** Der Name einer Rekordart. Beispiel: „taktikZeit“ → „Taktik auf Zeit“. */
export function rekordname(kennung: string): string {
  return t(`rekorde.art.${kennung}` as Textschluessel);
}
