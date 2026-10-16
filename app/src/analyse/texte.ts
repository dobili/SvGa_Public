/**
 * Gemeinsame Textbausteine der Werkzeuge: Figuren und Farben, wie sie im Buch heißen.
 *
 * Rolle im Gesamtbild: Jedes Werkzeug nennt Figuren als „Springer f6“ und Farben als „Weiß“
 * (Pflichtenheft 6.1: Buch und App sprechen eine Sprache). Die Texte kommen aus i18n.
 * Abhängigkeiten: i18n, schach/stellung.ts, schach/notation.ts.
 */
import type { Color } from "chessops/types";
import { sprache, t } from "../i18n/sprache";
import type { Figurenstand } from "../schach/angriffskarte";
import { sanInSprache } from "../schach/notation";
import { farbkuerzel, feldname, ROLLENBUCHSTABE } from "../schach/stellung";

/** „Springer f6“: Figurenname und Feld (Beispiel: Abb. 4.13, die gefesselte Figur). */
export function figurenname(stand: Figurenstand): string {
  return `${t(`figur.${ROLLENBUCHSTABE[stand.figur.role]}`)} ${feldname(stand.feld)}`;
}

/** „Weiß“ oder „Schwarz“. */
export function farbname(farbe: Color): string {
  return t(`farbe.${farbkuerzel(farbe)}`);
}

/** Ein Zug in der Sprache des Buches, etwa „Sxd5“ aus „Nxd5“. */
export function zugtext(san: string): string {
  return sanInSprache(san, sprache());
}

/**
 * Aufzählung wie im Buch: „d4, e4 und d5“ (Abb. 2.11: „Rochiert, der Bauernschild f2, g2, h3
 * steht“; die App setzt vor das letzte Glied „und“).
 */
export function aufzaehlung(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")}${t("text.und")}${teile.at(-1) ?? ""}`;
}

/** „einen Zug“ oder „3 Züge“ (Kapitel 8: „Beide Bauern brauchen zwei Züge“). */
export function zugzahl(anzahl: number): string {
  return anzahl === 1 ? t("text.einZug") : t("text.zuege", { anzahl });
}

/** „einen Punkt“ oder „2 Punkte“ (Kapitel 1: Bauer 1, Springer und Läufer 3, Turm 5, Dame 9). */
export function punktzahl(anzahl: number): string {
  return anzahl === 1 ? t("text.einPunkt") : t("text.punkte", { anzahl });
}

/** „eine Linie“ oder „3 Linien“ (Kapitel 9: „mindestens drei Linien“). */
export function linienzahl(anzahl: number): string {
  return anzahl === 1 ? t("text.eineLinie") : t("text.linien", { anzahl });
}

/** „+3“, „−1“ oder „0“: eine Bilanz mit Vorzeichen (Kapitel 7, Bilanz am Ende der Variante). */
export function mitVorzeichen(zahl: number): string {
  if (zahl > 0) return `+${zahl}`;
  if (zahl < 0) return `−${-zahl}`;
  return "0";
}

/** Kurzform einer Figur wie im Buch: „Sc3“, „Dd1“ (Kapitel 0, Notation). */
export function figurkurz(stand: Figurenstand): string {
  return zugtext(`${ROLLENBUCHSTABE[stand.figur.role].toUpperCase()}${feldname(stand.feld)}`);
}
