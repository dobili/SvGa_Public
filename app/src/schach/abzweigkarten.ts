/**
 * Inhalt der Abzweig-Karten unter dem Brett: je Abzweig die Stellung, der Weg dorthin und die
 * Fortsetzungen mit kurzer Beschreibung.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 2, Baum-Ansicht C (Entscheidung des Autors):
 * „Je Abzweig eine Karte: Brett mit nummerierten Pfeilen und daneben die Fortsetzungen als
 * Knöpfe. Verschachtelte Abzweige stehen eingerückt darunter.“ Grundlage sind die Abzweigpunkte
 * in Lesereihenfolge (schach/variationsbaum.ts, abzweigpunkte); hier kommen die Texte dazu, die die
 * Karte zeigt („nach 3. Sxe5“, „in 3... Sxe4?!“, „6 Züge · 1 Abzweig“). Reine Funktionen.
 * Abhängigkeiten: schach/variationsbaum.ts, schach/notation.ts, chessops.
 * Buchbezug: Kapitel 0, „Wie liest man Schachzüge?“ (Haupt- und Nebenvariante).
 */
import { parseSan } from "chessops/san";
import type { Variationsknoten } from "../training/variationen";
import { sanInSprache } from "./notation";
import {
  abzweigpunkte,
  abzweigzahl,
  knotenEntlang,
  knotenzahl,
  stellungAus,
  type Pfad,
  type Zugbaum,
} from "./variationsbaum";

/** Eine Fortsetzung auf der Karte. */
export interface Kartenfortsetzung {
  readonly pfad: Pfad;
  /** „4... De7“ mit Zugzeichen. */
  readonly text: string;
  /** Züge in diesem Ast, diesen Zug eingeschlossen. */
  readonly zuege: number;
  /** Abzweige in diesem Ast (nach diesem Zug). */
  readonly abzweige: number;
  /** Herkunft des Zuges; undefined bei eigenen Zügen. */
  readonly herkunft: Variationsknoten["herkunft"];
}

/** Eine Abzweig-Karte. */
export interface Abzweigkarte {
  readonly pfad: Pfad;
  /** Der Zug, nach dem es abzweigt („3. Sxe5“); null an der Startstellung. */
  readonly nach: string | null;
  /** Der Zug, mit dem der Weg die Hauptvariante zuletzt verlassen hat; null auf der Hauptvariante. */
  readonly in: string | null;
  readonly tiefe: number;
  readonly fortsetzungen: readonly Kartenfortsetzung[];
}

/** Die Texte aller Züge eines Pfades („1. e4“, „1... e5“ …) in der Sprache. */
function zugtexte(baum: Zugbaum, pfad: Pfad, sprachcode: string): string[] {
  const pos = stellungAus(baum.startFen);
  const knoten = knotenEntlang(baum, pfad) ?? [];
  const texte: string[] = [];
  for (const k of knoten) {
    const zug = pos ? parseSan(pos, k.zug) : undefined;
    if (!pos || !zug) break;
    const nummer = pos.turn === "white" ? `${pos.fullmoves}. ` : `${pos.fullmoves}... `;
    texte.push(nummer + sanInSprache(k.zug, sprachcode) + (k.zeichen ?? ""));
    pos.play(zug);
  }
  return texte;
}

/** Stelle des letzten Zuges im Pfad, der nicht die erste Fortsetzung war; -1 ohne solchen. */
function letzteAbweichung(baum: Zugbaum, pfad: Pfad): number {
  let auswahl = baum.zuege;
  let stelle = -1;
  pfad.forEach((san, i) => {
    const k = auswahl.find((x) => x.zug === san);
    if (auswahl[0]?.zug !== san) stelle = i;
    auswahl = k?.weiter ?? [];
  });
  return stelle;
}

/**
 * Alle Abzweig-Karten einer Variante in Lesereihenfolge.
 * Beispiel aus dem Buch: Abb. 2.40 mit 3... d6, 3... Sxe4?! und eigenem 4... De7 nach 4. De2 →
 * Karte „nach 3. Sxe5“ (Tiefe 0) und Karte „nach 4. De2“ in „3... Sxe4?!“ (Tiefe 1).
 */
export function abzweigkarten(baum: Zugbaum, sprachcode: string): Abzweigkarte[] {
  return abzweigpunkte(baum).map((punkt) => {
    const texte = zugtexte(baum, punkt.pfad, sprachcode);
    const fortsetzungstexte = (k: Variationsknoten) =>
      zugtexte(baum, [...punkt.pfad, k.zug], sprachcode).at(-1) ?? k.zug;
    const knoten = knotenEntlang(baum, punkt.pfad);
    const weiter = knoten?.at(-1)?.weiter ?? baum.zuege;
    const abweichung = letzteAbweichung(baum, punkt.pfad);
    return {
      pfad: punkt.pfad,
      nach: texte.at(-1) ?? null,
      in: abweichung >= 0 ? (texte[abweichung] ?? null) : null,
      tiefe: punkt.tiefe,
      fortsetzungen: weiter.map((k) => ({
        pfad: [...punkt.pfad, k.zug],
        text: fortsetzungstexte(k),
        zuege: 1 + knotenzahl(k.weiter),
        abzweige: abzweigzahl({ startFen: baum.startFen, zuege: k.weiter }),
        herkunft: k.herkunft,
      })),
    };
  });
}
