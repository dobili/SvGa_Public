/**
 * Abweichungsmodus (Kapitel 2 und 3): Die Engine verlässt die Buchvariante, der Leser antwortet
 * nach den Prinzipien, danach die Einschätzung.
 *
 * Rolle im Gesamtbild: Trainer „abweichung“ (Pflichtenheft 5.3, AP 13 Stufe 3). Der Leser wählt
 * eine Eröffnung aus Kapitel 2 und seine Seite. Die App spielt eine Variante des Buches ein Stück
 * weit, dann wählt die Engine für die Gegenseite einen guten Zug, der in keiner Zugfolge der
 * Kapitel 2 und 3 steht. Der Leser antwortet; die Engine bewertet seinen Zug, die Werkzeuge
 * Zielbilanz und Todsünden zeigen, was die Prinzipien sagen. Rechnen tut die Engine in
 * ui/trainer/useAbweichung.ts; hier stehen die reinen Teile.
 * Abhängigkeiten: training/repertoiretrainer.ts (Varianten), training/zufall.ts.
 * Buchbezug: Kapitel 2, „Wenn der Gegner das Buch verlässt“: die drei Eröffnungsziele; Kapitel 1,
 * die Todsünden.
 */
import type { Color } from "chessops/types";
import type { Kapitel } from "../daten/generiert/kapitel";
import { buchbeispiele } from "../daten/buchbeispiele";
import { eroeffnungenAus, varianten, type Repertoireeroeffnung } from "./repertoiretrainer";
import { mische, type Zufall } from "./zufall";

/** Frühestens nach so vielen Halbzügen verlässt die Engine das Buch. */
const AB_HALBZUG = 4;
/** Spätestens nach so vielen Halbzügen. */
const BIS_HALBZUG = 12;
/** Bis zu diesem Verlust (Bauern) gilt die Antwort als gut. */
export const GUT_BIS = 0.5;
/** Bis hierhin ungenau, darüber ein Fehler (wie die Auswertung nach der Partie, „?“ ab 1,2). */
export const UNGENAU_BIS = 1.2;

export interface Abweichungsaufgabe {
  readonly titel: string;
  readonly startFen: string;
  /** Die Züge des Buches bis zur Abweichung (englische Kurznotation). */
  readonly buchzuege: readonly string[];
  readonly seite: Color;
  /**
   * Der Zug des Buches für die eigene Seite nach dem ursprünglichen Gegnerzug (der „Planzug“),
   * oder null am Ende der Variante. Spielt der Leser ihn nach der Abweichung, sagt die App, ob
   * er damit auf den neuen Zug eingeht (Nebenchat, 30.10.2026).
   */
  readonly planzug: string | null;
}

/** Halbzüge, nach denen die Gegenseite am Zug ist (dort weicht die Engine ab). */
function abweichstellen(laenge: number, seite: Color): number[] {
  const stellen: number[] = [];
  for (let k = AB_HALBZUG; k <= Math.min(BIS_HALBZUG, laenge); k++) {
    const weissAmZug = k % 2 === 0;
    if (weissAmZug !== (seite === "white")) stellen.push(k);
  }
  return stellen;
}

/**
 * Die Aufgaben einer Runde: je Variante der Eröffnung eine Abweichung an einer zufälligen Stelle,
 * an der die Gegenseite am Zug ist.
 * Beispiel: Spanische Partie, Seite Weiß → etwa 1. e4 e5 2. Sf3 Sc6 3. Lb5, dann weicht Schwarz ab.
 */
export function abweichungsrunde(
  eroeffnung: Repertoireeroeffnung,
  seite: Color,
  anzahl: number,
  zufall: Zufall,
): Abweichungsaufgabe[] {
  return mische(varianten(eroeffnung.beispiel), zufall)
    .slice(0, anzahl)
    .flatMap((linie) => {
      const stellen = abweichstellen(linie.length, seite);
      const k = stellen[Math.floor(zufall() * stellen.length)];
      if (k === undefined) return [];
      return [
        {
          titel: eroeffnung.titel,
          startFen: eroeffnung.beispiel.startFen,
          buchzuege: linie.slice(0, k),
          seite,
          planzug: linie[k + 1] ?? null,
        },
      ];
    });
}

/**
 * Der Zug, mit dem die Engine das Buch verlässt: der beste ihrer Kandidaten, der kein Buchzug ist.
 * Eingaben: Kandidaten der Engine (UCI, beste zuerst), Buchzüge der Stellung (UCI).
 * Beispiel: Kandidaten [g8f6, b8c6], Buch [b8c6] → g8f6. Ohne passenden Kandidaten null.
 */
export function abweichzug(kandidaten: readonly string[], buch: readonly string[]): string | null {
  return kandidaten.find((k) => !buch.includes(k)) ?? null;
}

export type Antwortklasse = "gut" | "ungenau" | "fehler";

/** Wie gut war die Antwort? Nach dem Verlust gegenüber dem besten Zug der Engine. */
export function antwortklasse(verlust: number): Antwortklasse {
  if (verlust <= GUT_BIS) return "gut";
  return verlust <= UNGENAU_BIS ? "ungenau" : "fehler";
}

/** Abschnitte von Kapitel 3 mit den Gambits (3.4 Königsgambit bis 3.10 Gambits gegen 1. e4). */
const GAMBITABSCHNITT = /^3\.(?:[4-9]|10)$/;
/** Das Damengambit aus Kapitel 2 gehört ebenfalls dazu (Wunsch des Autors, 30.10.2026). */
const DAMENGAMBIT = /Damengambit/;

/**
 * Die Gambits für den Abweichungsmodus in Kapitel 3: die Zugfolgen der Gambit-Abschnitte von
 * Kapitel 3 (nur solche mit „Gambit“ im Titel und übbaren Varianten) und das Damengambit aus
 * Kapitel 2.
 * Warum: Kapitel 3 hat keine Steckbriefe; ohne diese Auswahl fehlten die Gambits ganz.
 * Beispiel: Königsgambit, Evans-Gambit, Dänisches Gambit, …, Lettisches Gambit, Damengambit.
 */
export function gambitsAus(kapitel3: Kapitel, kapitel2: Kapitel): Repertoireeroeffnung[] {
  const gambits = buchbeispiele(kapitel3)
    .filter((b) => b.abschnitt !== null && GAMBITABSCHNITT.test(b.abschnitt))
    .filter((b) => /gambit/i.test(b.titel) && varianten(b).length > 0)
    .map((b) => ({ id: b.id, titel: b.titel.replace(/\\,/g, " "), beispiel: b }));
  const damengambit = eroeffnungenAus(kapitel2).filter((e) => DAMENGAMBIT.test(e.titel));
  return [...gambits, ...damengambit];
}
