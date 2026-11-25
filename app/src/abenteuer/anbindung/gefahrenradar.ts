/**
 * Karte „Gefahrenradar“ im Partie-Deck: Welche eigenen Figuren sind wirklich in Gefahr?
 *
 * Warum neu (Befund des Autors, 25.11.2026): Die Karte zeigte bisher die roten Warnsignale aus
 * Kapitel 4 (W1 ungedeckte Figur, W2 gefährliche Linie …) mit der Kennung „W1“ in der Feldecke.
 * Ein ungedeckter Turm auf h1, den nichts angriff, stand so rot umrandet da, und „W1“ erklärte
 * nichts. Ein Radar für Gefahren zeigt jetzt nur, was der Gegner sofort mit Gewinn schlagen
 * könnte: angegriffen und nicht ausreichend gedeckt, gezählt wie im Buch (Abtauschbilanz), dazu
 * ein drohendes Matt. Die Markierung trägt keine Kennung; eine Zeile beim Ausspielen sagt, was
 * Rot bedeutet.
 * Regel: Kapitel 1, „Werte von Angreifer und Verteidiger zählen“ (schach/drohungen.ts,
 * drohungenVon: Schläge mit positiver Bilanz für den Gegner, Matt in einem Zug).
 * Rolle im Gesamtbild: gerufen von KartenleisteAnzeige.tsx. Abhängigkeiten: schach/drohungen.ts,
 * schach/stellung.ts, analyse/werkzeug.ts (Typ), texte/texte.ts.
 */
import type { Color } from "chessops/types";
import type { Markierung } from "../../analyse/werkzeug";
import { drohungenVon } from "../../schach/drohungen";
import { feldname, gegner, stellungAusFen } from "../../schach/stellung";
import { tSpiel } from "../texte/texte";

/** Was die Karte am Brett zeigt und als Zeile dazu sagt. */
export interface Radarbild {
  readonly markierungen: readonly Markierung[];
  readonly text: string;
}

/**
 * Die eigenen Figuren in Gefahr, als rote Felder ohne Beschriftung, und die Zeile dazu.
 * Eingaben: FEN der Partie, eigene Farbe. Beispiel: weißer Turm h1 ungedeckt, aber von nichts
 * angegriffen → keine Markierung, „Gerade ist keine deiner Figuren in Gefahr.“; schwarzer Läufer
 * greift den ungedeckten Springer c3 an → c3 rot.
 * Sonderfälle: Steht der eigene König im Schach, ist der König markiert (das Schach geht vor);
 * eine unlesbare Stellung ergibt nichts und keine Zeile.
 */
export function gefahrenradar(fen: string, eigene: Color): Radarbild {
  const stellung = stellungAusFen(fen);
  const regeln = stellung.ok ? stellung.wert.regeln : null;
  if (!regeln) return { markierungen: [], text: "" };
  const koenig = regeln.board.kingOf(eigene);
  const drohungen = drohungenVon(regeln, gegner(eigene));
  if (drohungen === null) {
    const feld = koenig === undefined ? [] : [rot(feldname(koenig))];
    return { markierungen: feld, text: tSpiel("karte.gefahrenradar.schach") };
  }
  const matt = drohungen.some((d) => d.art === "matt");
  const felder = new Set(drohungen.filter((d) => d.art === "material").map((d) => d.zug.nach));
  if (matt && koenig !== undefined) felder.add(koenig);
  const markierungen = [...felder].map((f) => rot(feldname(f)));
  const schluessel = matt ? "matt" : markierungen.length > 0 ? "gefahr" : "keine";
  return { markierungen, text: tSpiel(`karte.gefahrenradar.${schluessel}`) };
}

/** Ein rotes Feld ohne Beschriftung. */
function rot(feld: string): Markierung {
  return { typ: "feld", farbe: "rot", feld };
}
