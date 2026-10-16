/**
 * Linienmotive aus den Strahlen: Fesselung, Spieß, Abzug und Batterie.
 *
 * Rolle im Gesamtbild: Zweite Stufe des Bausteins „Strahlen“ (Konzept 7.2): Aus „erste und
 * zweite Figur auf dem Strahl“ werden die Motive des Buches. Die Warnsignale W2 (AP 8) und
 * das Motiv-Werkzeug k7-motiv (AP 9) lesen nur noch diese Liste.
 * Abhängigkeiten: strahlen.ts, angriffskarte.ts, stellung.ts.
 * Buchbezug: Kapitel 7, Motive 2 (Fesselung), 3 (Spieß), 4 (Batterie und Abzug); Glossar.
 */
import type { Board } from "chessops/board";
import type { Color } from "chessops/types";
import { Angriffskarte, type Figurenstand } from "./angriffskarte";
import { FIGURENWERT, gegner } from "./stellung";
import { strahlen, ziehtInRichtung, type Strahl } from "./strahlen";

/** Ein Linienmotiv: die Langschrittfigur, ihr Strahl und die beiden Figuren darauf. */
export type Linienmotiv =
  | {
      /**
       * Fesselung: vorn eine gegnerische Figur, dahinter eine wertvollere gegnerische Figur.
       * Absolut, wenn dahinter der König steht (Abb. 7.4), sonst relativ (Abb. 7.5).
       */
      readonly art: "fesselung";
      readonly absolut: boolean;
      readonly strahl: Strahl;
      readonly vorn: Figurenstand;
      readonly hinten: Figurenstand;
    }
  | {
      /**
       * Spieß: vorn die wertvollere gegnerische Figur, dahinter eine weniger wertvolle.
       * Mit Schach, wenn vorn der König steht (Abb. 7.7). `hintenUngedeckt` sagt, ob die hintere
       * Figur wirklich fällt, wenn die vordere ausweicht.
       */
      readonly art: "spiess";
      readonly mitSchach: boolean;
      readonly hintenUngedeckt: boolean;
      readonly strahl: Strahl;
      readonly vorn: Figurenstand;
      readonly hinten: Figurenstand;
    }
  | {
      /**
       * Abzug: vorn eine eigene Figur, dahinter eine gegnerische. Zieht die vordere weg, greift
       * die Langschrittfigur an (Abb. 7.9); steht hinten der König, droht Abzugsschach.
       */
      readonly art: "abzug";
      readonly mitSchach: boolean;
      readonly strahl: Strahl;
      readonly vorn: Figurenstand;
      readonly hinten: Figurenstand;
    }
  | {
      /**
       * Batterie: vorn eine eigene Langschrittfigur, die in dieselbe Richtung zieht (Abb. 7.8:
       * Läufer c2 hinter der Dame d3, Ziel h7). `ziel` ist die gegnerische Figur dahinter, falls
       * eine dort steht.
       */
      readonly art: "batterie";
      readonly strahl: Strahl;
      readonly vorn: Figurenstand;
      readonly ziel: Figurenstand | null;
    };

/** Der König ist „unbezahlbar“ (stellung.ts): Er gilt immer als wertvollste Figur. */
function wert(stand: Figurenstand): number {
  return FIGURENWERT[stand.figur.role];
}

/**
 * Ordnet einen Strahl mit zwei Figuren einem Motiv zu, oder null.
 *
 * Regeln: Kapitel 7, Motiv 2 („Eine Figur steht zwischen einer gegnerischen Langschrittfigur und
 * einer wertvolleren eigenen Figur“), Motiv 3 („Die wertvollere Figur steht vorn“), Motiv 4
 * („Steht eine eigene Figur vor einer eigenen Langschrittfigur, ist ein Abzugsangriff möglich“;
 * „Stehen zwei eigene Langschrittfiguren hintereinander, bilden sie eine Batterie“).
 * Sonderfälle: Gleich wertvolle gegnerische Figuren hintereinander (Turm vor Turm) sind weder
 * Fesselung noch Spieß. Eine Batterie braucht keine zweite Figur auf dem Strahl.
 */
function motivAus(strahl: Strahl, karte: Angriffskarte): Linienmotiv | null {
  const { erste: vorn, zweite: hinten } = strahl;
  if (!vorn) return null;
  const eigene: Color = strahl.figur.color;
  if (vorn.figur.color === eigene) {
    if (ziehtInRichtung(vorn.figur.role, strahl.richtung)) {
      const ziel = hinten && hinten.figur.color !== eigene ? hinten : null;
      return { art: "batterie", strahl, vorn, ziel };
    }
    if (!hinten || hinten.figur.color === eigene) return null;
    return { art: "abzug", mitSchach: hinten.figur.role === "king", strahl, vorn, hinten };
  }
  if (!hinten || hinten.figur.color === eigene) return null;
  if (wert(hinten) > wert(vorn)) {
    return { art: "fesselung", absolut: hinten.figur.role === "king", strahl, vorn, hinten };
  }
  if (wert(vorn) > wert(hinten)) {
    const hintenUngedeckt = karte.angreiferVon(hinten.feld, gegner(eigene), true).length === 0;
    return {
      art: "spiess",
      mitSchach: vorn.figur.role === "king",
      hintenUngedeckt,
      strahl,
      vorn,
      hinten,
    };
  }
  return null;
}

/**
 * Alle Linienmotive einer Stellung, auf Wunsch nur die der Langschrittfiguren einer Farbe.
 *
 * Eingaben: Brett, Angriffskarte (für „ungedeckt“ beim Spieß), optional die Farbe der
 * Langschrittfiguren. Ausgabe: Motive in der Reihenfolge der Strahlen.
 * Beispiel: Abb. 7.5, Weiß → Fesselung relativ: Läufer g5, vorn Springer f6, hinten Dame d8.
 * Abb. 7.9, Weiß → Abzug: Turm d1, vorn Läufer d3, hinten Dame d7.
 */
export function linienmotive(brett: Board, karte: Angriffskarte, farbe?: Color): Linienmotiv[] {
  const motive: Linienmotiv[] = [];
  for (const einStrahl of strahlen(brett, farbe)) {
    const motiv = motivAus(einStrahl, karte);
    if (motiv) motive.push(motiv);
  }
  return motive;
}

/** Nur die Fesselungen; `absolut` wählt absolute oder relative, ohne Angabe beide. */
export function fesselungen(
  motive: readonly Linienmotiv[],
  absolut?: boolean,
): Extract<Linienmotiv, { art: "fesselung" }>[] {
  return motive.flatMap((motiv) =>
    motiv.art === "fesselung" && (absolut === undefined || motiv.absolut === absolut)
      ? [motiv]
      : [],
  );
}
