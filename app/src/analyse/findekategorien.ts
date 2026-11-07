/**
 * Finde-Kategorien F1 bis F10: Mit welcher Idee des Buches hätte der Leser den besseren Zug
 * gefunden? Reine Erkennungsschicht ohne Oberfläche und ohne Texte.
 *
 * Rolle im Gesamtbild: Schritt 3 der Umsetzung im Konzept docs/KONZEPT_FEHLER_BUCHBEZUG.md
 * (Abschnitt 3.2, vom Autor freigegeben). Der Einbau in Zeitleiste und Rückblick und die
 * Empfehlungen auf der Startseite kommen danach; die Anzeige je Kennung (Name, Kapitel, Trainer)
 * steht in spiel/buchbezug.ts. Diese Datei liefert nur Kennung und Details.
 * Die zwei Grundbedingungen des Konzepts gelten für jede Kategorie: Die Idee erklärt den Vorteil
 * selbst, und der gespielte Zug erfüllt sie nicht ebenso. Dazu verliert der gespielte Zug
 * mindestens einen halben Bauern (darunter ist eine Buchidee Haarspalterei, Konzept 3).
 * Priorität (Konzept 4.1, Konkretes vor Faustregel): F1 > F2 > F3 > F4 > F5 > F6 > F7 > F8 > F9 > F10.
 * Die Schwellen stehen gesammelt in findekategorien-lage.ts (FINDE_SCHWELLEN), damit der Messlauf
 * sie nachstellen kann.
 * Abhängigkeiten: findekategorien-lage.ts, findekategorien-taktik.ts, findekategorien-endspiel.ts,
 * findekategorien-plan.ts.
 * Buchbezug: Kapitel 1, 2, 3, 6, 7 und 8 (je Kategorie in der Teildatei).
 */
import { f6Opposition, f7Freibauer } from "./findekategorien-endspiel";
import {
  baueFindelage,
  FINDE_SCHWELLEN,
  verliertMerklich,
  type Findeeingabe,
  type Findekennung,
  type Findelage,
  type Findeschwellen,
  type Findetreffer,
} from "./findekategorien-lage";
import { f10Lap, f8Buchzug, f9Eroeffnungsziel } from "./findekategorien-plan";
import { f1Matt, f2Rettung, f3Motiv, f4Schlag, f5Roentgen } from "./findekategorien-taktik";

export { FINDE_SCHWELLEN };
export type {
  Buchkontext,
  Findedetails,
  Findeeingabe,
  Findekennung,
  Findemotiv,
  Findeschwellen,
  Findetreffer,
} from "./findekategorien-lage";

type Pruefung = (lage: Findelage) => Findetreffer | null;

/** Die Prüfungen in der Reihenfolge der Priorität. */
const PRUEFUNGEN: readonly (readonly [Findekennung, Pruefung])[] = [
  ["F1", f1Matt],
  ["F2", f2Rettung],
  ["F3", f3Motiv],
  ["F4", f4Schlag],
  ["F5", f5Roentgen],
  ["F6", f6Opposition],
  ["F7", f7Freibauer],
  ["F8", f8Buchzug],
  ["F9", f9Eroeffnungsziel],
  ["F10", f10Lap],
];

/** Die Kennungen in der Reihenfolge der Priorität (für Statistiken und Tests). */
export const FINDEKENNUNGEN: readonly Findekennung[] = PRUEFUNGEN.map(([kennung]) => kennung);

/** Die Lage, wenn der Zug überhaupt etwas zu finden lässt (Grundbedingung Verlust). */
function lageFuer(eingabe: Findeeingabe, schwellen: Findeschwellen): Findelage | null {
  const lage = baueFindelage(eingabe, schwellen);
  return lage && verliertMerklich(lage) ? lage : null;
}

/**
 * Die Finde-Kategorie eines Zuges: der erste Treffer in der Reihenfolge der Priorität.
 *
 * Warum: Die Karte zeigt höchstens eine Findezeile (Konzept 4.1); die genaueste Idee zuerst.
 * Eingaben: Stellung vor dem Zug, gespielter und bester Zug (UCI), beide Varianten, die drei
 * Werte aus Sicht der Seite am Zug, Phase, wahlweise Stellung davor, Abstand zum zweitbesten Zug
 * und Buchkontext (Eröffnungsindex für F8); dazu wahlweise geänderte Schwellen (Messlauf).
 * Ausgabe: Kennung „F1“ bis „F10“ mit Details (bester Zug in SAN, Feld, Motiv, Mattbild …) oder
 * null, wenn keine Kategorie sicher passt („besser keine Erklärung als eine falsche“).
 * Beispiel: Abb. 7.46 (Opernpartie), gespielt 16. Td2 statt 16. Db8+ Sxb8 17. Td8# → F1, Matt in 2.
 * Sonderfälle: gespielter gleich bester Zug, unmöglicher Zug oder Verlust unter einem halben
 * Bauern → null.
 */
export function findeKategorie(
  eingabe: Findeeingabe,
  schwellen: Findeschwellen = FINDE_SCHWELLEN,
): Findetreffer | null {
  const lage = lageFuer(eingabe, schwellen);
  if (!lage) return null;
  for (const [, pruefe] of PRUEFUNGEN) {
    const treffer = pruefe(lage);
    if (treffer) return treffer;
  }
  return null;
}

/**
 * Alle Finde-Kategorien eines Zuges, in der Reihenfolge der Priorität.
 *
 * Warum: Für Statistiken und den Messlauf (Konzept, Abschnitt 7, Schritt 4) zählt, wie oft eine
 * Kategorie überhaupt zutrifft, auch wenn eine höhere sie auf der Karte verdeckt.
 * Eingaben und Sonderfälle wie bei findeKategorie. Ausgabe: alle Treffer, leer ohne Treffer.
 * Beispiel: Abb. 7.47, 1. Sc7+ Kd8 2. Sxa8 statt eines ruhigen Zuges → F3 (Gabel) und F5 (Schach).
 */
export function alleFindeKategorien(
  eingabe: Findeeingabe,
  schwellen: Findeschwellen = FINDE_SCHWELLEN,
): Findetreffer[] {
  const lage = lageFuer(eingabe, schwellen);
  if (!lage) return [];
  return PRUEFUNGEN.flatMap(([, pruefe]) => pruefe(lage) ?? []);
}
