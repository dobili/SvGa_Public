/**
 * Typen der Erkennungsbilder (Kapitel 9): Name des Bildes, Merkmal, Feld zum Markieren und das
 * erkannte Bild.
 *
 * Rolle im Gesamtbild: schach/erkennungsbilder.ts und schach/laeuferbilder.ts brauchen beide diese
 * Typen. Stehen sie hier, benutzen sich die zwei Dateien nicht mehr gegenseitig (Ordnung im Code,
 * docs/codefuehrer/8-verbesserungen.md). Von außen geht der Import weiter über
 * schach/erkennungsbilder.ts, das die Typen weiterreicht.
 * Abhängigkeiten: chessops (Typen).
 * Buchbezug: Kapitel 9, „Rückblick: die Erkennungsbilder“ (Tabelle mit Bild, Erkennungsfrage und
 * Plan).
 */
import type { Color, Square } from "chessops/types";

/** Die Bilder der Tabelle des Buches. */
export type Bildname =
  | "philidor"
  | "kurzeSeite"
  | "lucena"
  | "vancura"
  | "turmGegenBauer"
  | "mehrbauern"
  | "dameGegenBauer"
  | "dameGegenDame"
  | "laeufer"
  | "springer"
  | "laeuferGegenSpringer"
  | "turmGegenLaeufer";

/** Ein Merkmal des Bildes mit Textschlüssel-Endung und Werten. */
export interface Merkmal {
  readonly kennung: string;
  readonly werte: Readonly<Record<string, string | number>>;
  /** Trifft die Standardstellung des Buches zu (E), oder nur das Bild (N)? */
  readonly standard?: boolean;
}

/** Ein Feld zum Markieren: gold gut, rot Gefahr, grau Linie. */
export interface Bildfeld {
  readonly feld: Square;
  readonly farbe: "gold" | "rot" | "grau";
}

/** Ein erkanntes Bild. */
export interface Erkennungsbild {
  readonly bild: Bildname;
  /** E, wenn die Standardstellung des Buches erreicht ist, sonst N. */
  readonly art: "E" | "N";
  /** Die Seite, der der Plan des Buches gilt. */
  readonly seite: Color;
  readonly merkmale: readonly Merkmal[];
  readonly felder: readonly Bildfeld[];
}
