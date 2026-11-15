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
import { parseFen } from "chessops/fen";
import type { Role } from "chessops/types";
import { parseSquare } from "chessops/util";
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
import { festerZufall, ZUFALL, type Zufall } from "../../training/zufall";
import {
  ZUSATZTHEMEN,
  zusatzrunde,
  type Zusatzaufgabe,
  type Zusatzthema,
} from "../../training/zusatzaufgaben";
import { streuwert } from "../oberwelt/belebung";
import type { Aufgabenauftrag, Aufgabenergebnis, Figurname } from "../schnittstelle/aufgaben";
import type { Rundenstart } from "../../ui/trainer/useRunde";
import { hatSpieltext, tSpiel } from "../texte/texte";

/** Vorsilbe der Übungskennungen des Buches („ueb:droh-ignorieren“). */
const UEBUNGSVORSILBE = "ueb:";

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

/** Die Rolle in chessops zu jedem Figurnamen der Runden (runden.json, `figur`). */
const ROLLE_DER_FIGUR: Readonly<Record<Figurname, Role>> = {
  bauer: "pawn",
  springer: "knight",
  laeufer: "bishop",
  turm: "rook",
  dame: "queen",
  koenig: "king",
};
/** Schwierigkeit der Einsteiger (Wertung bis etwa 700, regeln/aufgaben.ts). */
const EINSTIEGSSTUFE = 1;
/** Einsteiger bekommen Lösungen mit höchstens so vielen Halbzügen (zwei eigene Züge). */
const EINSTIEG_HOECHSTENS_HALBZUEGE = 3;

/** Die Figur, die den ersten Lösungszug macht (auf dem Schlüsselfeld); null bei kaputter FEN. */
export function figurDerLoesung(aufgabe: Aufgabe): Role | null {
  const stellung = parseFen(aufgabe.fen);
  const feld = parseSquare(aufgabe.schluesselfeld);
  if (stellung.isErr || feld === undefined) return null;
  return stellung.value.board.get(feld)?.role ?? null;
}

/**
 * Passt eine Motivaufgabe zur Runde (Spieltest „einstieg“, R4)? Mit `figur` nur Aufgaben, deren
 * erster Zug diese Figur macht (Lilys Springer); in Schwierigkeit 1 nur kurze Lösungen (höchstens
 * zwei eigene Züge: kein Matt in drei mit Damenopfer am ersten Tag).
 * Beispiel: Springergabel Sf5+ Ke4 Sxh4 in Lilys Runde, Schwierigkeit 1 → passt.
 */
export function passtZurRunde(auftrag: Aufgabenauftrag, aufgabe: Aufgabe): boolean {
  if (auftrag.figur && figurDerLoesung(aufgabe) !== ROLLE_DER_FIGUR[auftrag.figur]) return false;
  if (auftrag.schwierigkeit > EINSTIEGSSTUFE) return true;
  return aufgabe.loesung.length <= EINSTIEG_HOECHSTENS_HALBZUEGE;
}

/**
 * Wählt zuerst unter den passenden Einträgen; reichen sie nicht, füllen die übrigen auf (eine
 * Runde bleibt nie kürzer als geplant, auch wenn die Daten zu wenige Springeraufgaben haben).
 */
function mitVorzug<T>(
  liste: readonly T[],
  passt: (eintrag: T) => boolean,
  anzahl: number,
  runde: (auswahl: readonly T[], zahl: number) => T[],
): T[] {
  const zuerst = runde(
    liste.filter((e) => passt(e)),
    anzahl,
  );
  if (zuerst.length >= anzahl) return zuerst;
  const rest = runde(
    liste.filter((e) => !passt(e)),
    anzahl - zuerst.length,
  );
  return [...zuerst, ...rest];
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
      const wahl = { thema: thema as Zusatzthema, stufe };
      return mitVorzug(
        zusaetze,
        (z) => passtZurRunde(auftrag, z.aufgabe),
        auftrag.anzahl,
        (liste, zahl) => zusatzrunde(liste, wahl, zahl, zufall),
      )
        .filter((z) => !buchkennungen.has(z.aufgabe.id))
        .map((aufgabe) => ({ art: "zusatz" as const, aufgabe }));
    }
    if ((MOTIVE as readonly string[]).includes(thema) || thema === "mattbilder") {
      const wahl = { thema: thema as Taktikthema, stufe };
      return mitVorzug(
        taktik,
        (a) => passtZurRunde(auftrag, a),
        auftrag.anzahl,
        (liste, zahl) => taktikrunde(liste, wahl, zahl, zufall),
      )
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

/**
 * Die Zufallsquelle einer Runde, fest nach der Kennung des Auftrags („mapleFalls.springerLily#…“,
 * die Startzeit gehört dazu). Warum: Spieltest „einstieg“ (15.11.2026) – wer die App während einer
 * Runde schloss und mit „Weitermachen“ zurückkam, bekam jedes Mal andere Aufgaben. Mit fester
 * Saat sind es dieselben; ein neuer Versuch (neue Kennung) bringt neue.
 * Beispiel: zufallDerRunde("r#1") liefert bei jedem Aufruf dieselbe Folge.
 */
export function zufallDerRunde(kennung: string): Zufall {
  return festerZufall(streuwert(kennung));
}

/**
 * Die eigene Frage einer Buchübung in der Runde (N2614): Im Spiel stehen keine Buchtexte
 * (docs/spiel/05, Entscheidung 10.11.2026), deshalb hat jede Übung, deren Frage mehr ist als das
 * Ziel des Trainers, einen eigenen Satz in den Spieltexten (`runde.buchfrage.<übung>`, die Kennung
 * ohne „ueb:“ in Binnenmajuskeln: „ueb:droh-ignorieren“ → „drohIgnorieren“). null für
 * andere Aufgaben und Übungen ohne eigenen Satz (Kapitel 7: „Finde die Kombination“ sagt das Ziel).
 * Beispiel: Abb. 1.40 → „Dein Springer auf b5 wird vom Bauern a6 angegriffen …“.
 */
export function buchfrage(aufgabe: Aufgabe): string | null {
  const uebung = aufgabe.herkunft.quelle === "buch" ? aufgabe.herkunft.uebung : undefined;
  if (!uebung) return null;
  const name = uebung
    .replace(UEBUNGSVORSILBE, "")
    .replace(/-([a-z0-9])/g, (_, b: string) => b.toUpperCase());
  const schluessel = `runde.buchfrage.${name}`;
  return hatSpieltext(schluessel) ? tSpiel(schluessel) : null;
}

/**
 * Der Start einer unterbrochenen Runde aus den gesicherten Antworten (R5): erste offene Aufgabe,
 * richtige bisher, verbrauchte Sekunden. Beispiel: [richtig, falsch], 95 s → Aufgabe 3, 1, 95.
 */
export function rundenstartAus(bisher: Aufgabenergebnis | null): Rundenstart | null {
  if (!bisher || bisher.ergebnisse.length === 0) return null;
  return {
    index: bisher.ergebnisse.length,
    richtig: bisher.ergebnisse.filter((e) => e === "richtig").length,
    sekunden: bisher.sekunden,
  };
}
