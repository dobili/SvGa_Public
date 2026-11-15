/**
 * Steckbriefzeilen eines Gegners als Text (Vorschlag C7, docs/spiel/11, I1 „Lupe des Uhrmachers“).
 *
 * Rolle im Gesamtbild: Die Deckwahl zeigt mit der Lupe vor der Partie zwei Zeilen aus dem Steckbrief
 * und die Sprüche, gegen die der Gegner immun ist (docs/spiel/10, S4). Zeilen, die Quests und
 * Dialoge freischalten (Spielstand je Gegner, N2621), zeigen Deckwahl und Tagebuch auch ohne Lupe. Die Zeilen stehen in
 * gegner.json als Art und Wert; die Namen der Fehlerarten und Stile kommen aus den Texten der App
 * (dieselben Bots, Entscheidung A3), Flecken, Eröffnungen und freie Sätze (Art „text“) aus den
 * Texten des Spiels.
 * Abhängigkeiten: i18n/sprache.ts, texte/texte.ts, daten/laden.ts.
 */
import { istTextschluessel, t } from "../../i18n/sprache";
import type { Gegnerdaten } from "../daten/laden";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
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
  return [...zeilen, ...immunzeile(gegner)];
}

/** Die Zeile „Diese Sprüche verpuffen hier: …“, leer ohne Immunität. */
function immunzeile(gegner: Gegnerdaten): readonly string[] {
  const immun = gegner.immunGegen ?? [];
  if (immun.length === 0) return [];
  const namen = immun.map((k) => tSpiel(`karte.${k}.name`)).join(", ");
  return [tSpiel("steckbrief.immun", { karten: namen })];
}

/**
 * Die freigeschalteten Zeilen eines Gegners als Sätze, in der Reihenfolge des Freischaltens.
 * Beispiel: Jo nach der Limo (Zeile 0) → „Blinder Fleck: übersieht Rückzüge“. Unbekannte Nummern
 * (Daten geändert) fallen weg.
 */
export function freigeschalteteZeilen(stand: Abenteuerstand, gegner: Gegnerdaten): string[] {
  const nummern = stand.figuren.find((f) => f.kennung === gegner.kennung)?.steckbrief ?? [];
  return nummern.flatMap((i) => {
    const zeile = gegner.steckbrief[i];
    return zeile ? [steckbriefzeile(zeile)] : [];
  });
}

/** Der Steckbrief über der Deckwahl: Überschrift und Zeilen (leer: kein Kasten). */
export interface Deckwahlsteckbrief {
  readonly titel: string;
  readonly zeilen: readonly string[];
}

/**
 * Was die Deckwahl über den Gegner zeigt: mit der Lupe ihre Zeilen, dazu immer die
 * freigeschalteten, ohne Doppelungen; die Immunität nur mit der Lupe. Beispiel: Jo ohne Lupe nach
 * der Limo → „Was du über den Gegner weißt“ mit „Blinder Fleck: übersieht Rückzüge“.
 */
export function deckwahlsteckbrief(
  stand: Abenteuerstand,
  gegnerliste: readonly Gegnerdaten[],
  kennung: string,
  mitLupe: boolean,
): Deckwahlsteckbrief {
  const gegner = gegnerliste.find((g) => g.kennung === kennung);
  if (!gegner) return { titel: "", zeilen: [] };
  const lupe = mitLupe ? gegner.steckbrief.slice(0, LUPENZEILEN).map(steckbriefzeile) : [];
  const zeilen = [...new Set([...lupe, ...freigeschalteteZeilen(stand, gegner)])];
  return {
    titel: tSpiel(mitLupe ? "steckbrief.titel" : "steckbrief.titelBekannt"),
    zeilen: mitLupe ? [...zeilen, ...immunzeile(gegner)] : zeilen,
  };
}

/** Ein Gegner im Tagebuch: Name, freigeschaltete Zeilen und ob er vorbereitet ist. */
export interface Gegnerakte {
  readonly kennung: string;
  readonly name: string;
  readonly zeilen: readonly string[];
  readonly analysiert: boolean;
}

/**
 * Die Gegner, über die der Leser etwas weiß (Abschnitt „Gegner“ im Tagebuch, N2621): jede Figur
 * mit freigeschalteten Zeilen oder dem Zustand „analysiert“, in der Reihenfolge des Spielstands.
 * Beispiel: nach Sams Runde Sam mit „Schwäche: …“ und Coach Delgado als „vorbereitet“.
 */
export function gegnerakten(
  stand: Abenteuerstand,
  gegnerliste: readonly Gegnerdaten[],
): Gegnerakte[] {
  return stand.figuren.flatMap((f) => {
    const gegner = gegnerliste.find((g) => g.kennung === f.kennung);
    if (!gegner) return [];
    const zeilen = freigeschalteteZeilen(stand, gegner);
    if (zeilen.length === 0 && !f.analysiert) return [];
    return [{ kennung: f.kennung, name: tSpiel(gegner.name), zeilen, analysiert: f.analysiert }];
  });
}
