/**
 * Steckbriefzeilen eines Gegners als Text (Vorschlag C7, docs/spiel/11, I1 „Lupe des Uhrmachers“).
 *
 * Rolle im Gesamtbild: Die Deckwahl zeigt mit der Lupe vor der Partie zwei Zeilen aus dem Steckbrief
 * und die Sprüche, gegen die der Gegner immun ist (docs/spiel/10, S4). Die Zeilen stehen in
 * gegner.json als Art und Wert; die Namen der Fehlerarten und Stile kommen aus den Texten der App
 * (dieselben Bots, Entscheidung A3), Flecken, Eröffnungen und freie Sätze (Art „text“) aus den
 * Texten des Spiels.
 * Abhängigkeiten: i18n/sprache.ts, texte/texte.ts, daten/laden.ts.
 */
import { istTextschluessel, t } from "../../i18n/sprache";
import type { Gegnerdaten } from "../daten/laden";
import { tSpiel } from "../texte/texte";

/** So viele Zeilen verrät die Lupe. */
export const LUPENZEILEN = 2;
/** Präfix der Eröffnungen aus der Praxis („praxis:Italian Game“). */
const PRAXIS = "praxis:";

/**
 * Eine Zeile als Satz. Beispiel: { art: „fehlerart“, wert: „figurHaengen“ } → „Schwäche: eine
 * Figur hängen lassen (W1)“; { art: „stil“, wert: „angreifer“ } → „Stil: Angreifer“.
 */
export function steckbriefzeile(zeile: Gegnerdaten["steckbrief"][number]): string {
  switch (zeile.art) {
    case "fehlerart": {
      const schluessel = `fehlerart.${zeile.wert}`;
      return tSpiel("steckbrief.schwaeche", {
        text: istTextschluessel(schluessel) ? t(schluessel) : zeile.wert,
      });
    }
    case "stil": {
      const schluessel = `stil.${zeile.wert}`;
      return tSpiel("steckbrief.stil", {
        text: istTextschluessel(schluessel) ? t(schluessel) : zeile.wert,
      });
    }
    case "fleck":
      return tSpiel(`steckbrief.fleck.${zeile.wert}`);
    case "eroeffnung":
      return tSpiel("steckbrief.eroeffnung", { text: zeile.wert.replace(PRAXIS, "") });
    case "text":
      // Freier Satz (Mrs. Okafor: Lagos); der Wert ist ein Textschlüssel der Spieltexte.
      return tSpiel(zeile.wert);
  }
}

/**
 * Was die Lupe vor der Partie verrät: die ersten Zeilen des Steckbriefs und die Immunität gegen
 * Sprüche. Beispiel Rosa: „Stil: Verteidiger“, „…“, „Sprüche verpuffen: Großes Maul, Grübelfalle“.
 */
export function lupenzeilen(gegner: Gegnerdaten): readonly string[] {
  const zeilen = gegner.steckbrief.slice(0, LUPENZEILEN).map(steckbriefzeile);
  const immun = gegner.immunGegen ?? [];
  if (immun.length === 0) return zeilen;
  const namen = immun.map((k) => tSpiel(`karte.${k}.name`)).join(", ");
  return [...zeilen, tSpiel("steckbrief.immun", { karten: namen })];
}
