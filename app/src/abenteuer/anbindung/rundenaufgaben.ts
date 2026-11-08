/**
 * Zusammenstellung einer Aufgabenrunde des Abenteuers aus den Trainerdaten der App (Regelwerk
 * R30, R31): zuerst die Buchübungen, dann Motivaufgaben abwechselnd nach Thema in der
 * Zielschwierigkeit. Reine Funktion, damit sie ohne Oberfläche prüfbar ist.
 *
 * Rolle im Gesamtbild: anbindung/AufgabenAnsicht.tsx ruft sie mit dem Auftrag und den geladenen
 * Aufgaben (Taktiktrainer, Lichess-Zusatzaufgaben). Buchübungen sind die Taktikaufgaben mit
 * `herkunft.uebung`; „falle“ und „struktur“ kommen aus den Trainern Falle oder Köder und Strukturen;
 * Themen, die kein Trainer kennt (etwa „zaehlen“), fallen weg.
 * Abhängigkeiten: training/taktiktrainer.ts, training/zusatzaufgaben.ts, training/zufall.ts.
 * Beispiel: Sams Block (Buchübung „ueb:droh-ignorieren“, Thema „haengend“, anzahl 3,
 * Schwierigkeit 2) → vier Aufgaben: die Übung aus Abbildung 1.40, dann drei Hängeaufgaben.
 */
import type {
  Endspielaufgabe,
  Fallenaufgabe,
  Strukturaufgabe,
  Taktikaufgabe as Aufgabe,
} from "../../daten/trainerdaten";
import { endspielrunde, type Massstab } from "../../training/endspieltrainer";
import { fallenrunde } from "../../training/fallentrainer";
import { strukturrunde } from "../../training/strukturtrainer";
import { MOTIVE, taktikrunde, type Taktikthema } from "../../training/taktiktrainer";
import { ZUFALL, type Zufall } from "../../training/zufall";
import {
  ZUSATZTHEMEN,
  zusatzrunde,
  type Zusatzaufgabe,
  type Zusatzthema,
} from "../../training/zusatzaufgaben";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";

/** Eine Aufgabe der Runde: Buchübung oder Taktikaufgabe (ohne Vorzug) oder Zusatzaufgabe. */
export type Rundenaufgabe =
  | { readonly art: "taktik"; readonly aufgabe: Aufgabe; readonly motivAbfragen: boolean }
  | { readonly art: "zusatz"; readonly aufgabe: Zusatzaufgabe }
  | { readonly art: "falle"; readonly aufgabe: Fallenaufgabe }
  | { readonly art: "struktur"; readonly aufgabe: Strukturaufgabe }
  | { readonly art: "endspiel"; readonly aufgabe: Endspielaufgabe };

/** Aufgaben der Trainer „Falle oder Köder“ (Kapitel 4) und „Strukturen“ (Kapitel 5), falls geladen. */
export interface Weitere {
  readonly fallen: readonly Fallenaufgabe[];
  readonly strukturen: readonly Strukturaufgabe[];
  /** Aufgaben des Endspieltrainers (Kapitel 8 und 9) und sein Maßstab, falls geladen. */
  readonly endspiele?: readonly Endspielaufgabe[];
  readonly massstab?: Massstab;
}

/** Mischt die Listen abwechselnd, bis `anzahl` erreicht ist (jedes Thema kommt gleich oft dran). */
function abwechselnd<T>(listen: readonly (readonly T[])[], anzahl: number): T[] {
  const ergebnis: T[] = [];
  const laengste = Math.max(0, ...listen.map((l) => l.length));
  for (let i = 0; i < laengste && ergebnis.length < anzahl; i++) {
    for (const liste of listen) {
      const eintrag = liste[i];
      if (eintrag !== undefined && ergebnis.length < anzahl) ergebnis.push(eintrag);
    }
  }
  return ergebnis;
}

/**
 * Stellt die Aufgaben des Auftrags zusammen: zuerst die Buchübungen (R31), dann die Motive
 * abwechselnd nach Thema in der Zielschwierigkeit. Unbekannte Themen fallen weg.
 */
export function rundenaufgaben(
  auftrag: Aufgabenauftrag,
  taktik: readonly Aufgabe[],
  zusaetze: readonly Zusatzaufgabe[],
  zufall: Zufall = ZUFALL,
  weitere: Weitere = { fallen: [], strukturen: [] },
): Rundenaufgabe[] {
  const buch: Rundenaufgabe[] = auftrag.buchuebungen.flatMap((id) =>
    taktik
      .filter((a) => a.herkunft.quelle === "buch" && a.herkunft.uebung === id)
      .slice(0, 1)
      .map((aufgabe) => ({ art: "taktik" as const, aufgabe, motivAbfragen: false })),
  );
  const buchkennungen = new Set(buch.flatMap((b) => (b.art === "taktik" ? [b.aufgabe.id] : [])));
  const stufe = auftrag.schwierigkeit;
  const jeThema = auftrag.themen.map((thema): Rundenaufgabe[] => {
    if (thema in ZUSATZTHEMEN) {
      return zusatzrunde(zusaetze, { thema: thema as Zusatzthema, stufe }, auftrag.anzahl, zufall)
        .filter((z) => !buchkennungen.has(z.aufgabe.id))
        .map((aufgabe) => ({ art: "zusatz" as const, aufgabe }));
    }
    if ((MOTIVE as readonly string[]).includes(thema) || thema === "mattbilder") {
      return taktikrunde(taktik, { thema: thema as Taktikthema, stufe }, auftrag.anzahl, zufall)
        .filter((a) => !buchkennungen.has(a.id))
        .map((aufgabe) => ({ art: "taktik" as const, aufgabe, motivAbfragen: false }));
    }
    // Themen „falle“ (Falle oder Köder, Kapitel 4) und „struktur“ (Bauernstrukturen, Kapitel 5).
    if (thema === "falle") {
      return fallenrunde(weitere.fallen, stufe, auftrag.anzahl, zufall).map((aufgabe) => ({
        art: "falle" as const,
        aufgabe,
      }));
    }
    if (thema === "endspiel") {
      return endspielrunde(
        weitere.endspiele ?? [],
        { gruppe: "alle", stufe },
        auftrag.anzahl,
        zufall,
      ).map((aufgabe) => ({ art: "endspiel" as const, aufgabe }));
    }
    if (thema === "struktur") {
      return strukturrunde(weitere.strukturen, stufe, auftrag.anzahl, zufall).map((aufgabe) => ({
        art: "struktur" as const,
        aufgabe,
      }));
    }
    return [];
  });
  return [...buch, ...abwechselnd(jeThema, auftrag.anzahl)];
}
