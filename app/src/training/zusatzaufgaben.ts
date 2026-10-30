/**
 * Zusatzaufgaben (nicht aus dem Buch): Lichess-Aufgaben je Thema des Buches für den Taktiktrainer.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026): „Eine Auswahl Lichess-Aufgaben je Thema
 * deines Buches als ‚Zusatzaufgaben (nicht aus dem Buch)‘ im Taktiktrainer, offline, etwa 1000
 * Stück nach Wertung gestaffelt.“ Die Datei public/daten/zusatzaufgaben.json baut
 * pipeline/trainer/zusatzaufgaben.py aus der Lichess-Puzzle-Datenbank (CC0). Jede Aufgabe steht
 * dort wie bei Lichess: die Stellung vor dem Zug des Gegners und die Züge in UCI, der erste ist
 * der Gegnerzug. Hier wird daraus eine Aufgabe im Format des Taktiktrainers (Stellung nach dem
 * Gegnerzug, Lösung in SAN), dazu der Gegnerzug, den die Oberfläche vorspielt. Reine Funktionen.
 * Abhängigkeiten: chessops, daten/trainerdaten.ts (Typ), training/taktiktrainer.ts (Motive),
 * spiel/zuege.ts (Regelstellung), training/zufall.ts.
 * Buchbezug: die Themen und ihre Fundstellen stehen an ZUSATZTHEMEN.
 */
import { normalizeMove } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { makeSanAndPlay } from "chessops/san";
import { parseUci } from "chessops/util";
import type { Taktikaufgabe } from "../daten/trainerdaten";
import type { Taktikmotiv } from "./taktiktrainer";
import { regelstellung } from "../spiel/zuege";
import { mische, type Zufall } from "./zufall";

/**
 * Die Themen der Zusatzaufgaben in der Reihenfolge der Auswahl, mit dem Grundmotiv aus Kapitel 7,
 * zu dem sie gehören (für „Welches Motiv war es?“), sonst null. Dieselbe Liste steht in
 * pipeline/trainer/zusatzaufgaben.py (THEMEN) mit den Lichess-Themen dazu.
 */
export const ZUSATZTHEMEN = {
  haengend: null, // Kapitel 1, „Hängen“: angegriffen und nicht ausreichend gedeckt
  doppelangriff: "doppelangriff", // Kapitel 1 und 7, „Gabel“ (fork)
  fesselung: "fesselung", // Kapitel 7, „Fesselung“ (pin)
  spiess: "spiess", // Kapitel 7, „Spieß“ (skewer)
  abzug: "abzug", // Kapitel 2 und 7, „Abzugsschach“ (discoveredAttack)
  doppelschach: "doppelschach", // Kapitel 7, „Doppelschach“ (doubleCheck)
  hinlenkung: "hinlenkung", // Kapitel 7, „Hinlenkung“ (attraction)
  raeumung: "hinlenkung", // Kapitel 7, „Räumung“, im Buch bei Köder und Hinlenkung (clearance)
  beseitigung: "beseitigung", // Kapitel 7, „Beseitigung der Verteidigung“ (capturingDefender)
  ablenkung: "ueberlastung", // Kapitel 4 und 7, „Ablenkung“, im Buch bei der Überlastung (deflection)
  zwischenzug: "zwischenzug", // Kapitel 4 und 7, „Zwischenzug“ (intermezzo)
  gefangen: "gefangen", // Kapitel 7, „Gefangene Figur“ (trappedPiece)
  umwandlung: "umwandlung", // Kapitel 0 und 7, „Umwandlung“ (promotion, underPromotion)
  wegversperrung: null, // Kapitel 10, „Wegversperrung“ (interference)
  stillerzug: null, // Kapitel 10, „Stiller Zug“ (quietMove)
  zugzwang: null, // Kapitel 8, „Zugzwang“ (zugzwang)
  grundreihenmatt: null, // Kapitel 5 und 7, „Grundreihenmatt“ (backRankMate)
  mattbilder: null, // Kapitel 4 und 7, Mattbilder: Erstickungs-, Anastasia-, Arabisches, Boden-Matt
  matt1: null, // Kapitel 0, „Matt“ in einem Zug (mateIn1)
  matt2: null, // Kapitel 0 und 7, Matt in zwei Zügen (mateIn2)
} as const satisfies Record<string, Taktikmotiv | null>;
export type Zusatzthema = keyof typeof ZUSATZTHEMEN;
export const ZUSATZTHEMENLISTE = Object.keys(ZUSATZTHEMEN) as Zusatzthema[];

/** Vorsatz der Kennungen; Karten der Wiederholung heißen damit „taktik:lichess:…“. */
export const ZUSATZ_VORSATZ = "lichess:";
const ZIELE = ["matt", "gewinn", "rettung"] as const;
/** Stufengrenzen nach Lichess-Wertung wie im Taktiktrainer (pipeline/trainer/schwierigkeit.py). */
const STUFENGRENZEN = [1000, 1300, 1600, 1900] as const;
const KLASSE_LICHESS = "lichess";

/** Eine Aufgabe wie in der Datei. */
export interface Zusatzeintrag {
  readonly id: string;
  /** Stellung vor dem Zug des Gegners (wie bei Lichess). */
  readonly fen: string;
  /** Züge in UCI, durch Leerzeichen getrennt; der erste ist der Gegnerzug. */
  readonly zuege: string;
  readonly wertung: number;
  readonly thema: Zusatzthema;
  readonly ziel: (typeof ZIELE)[number];
}

/** Eine Zusatzaufgabe, bereit für den Taktiktrainer. */
export interface Zusatzaufgabe {
  readonly aufgabe: Taktikaufgabe;
  readonly thema: Zusatzthema;
  /** Stellung vor dem Gegnerzug und der Gegnerzug selbst (SAN, Felder für die Markierung). */
  readonly vorher: { readonly fen: string; readonly zug: string };
}

function istEintrag(roh: unknown): roh is Zusatzeintrag {
  if (typeof roh !== "object" || roh === null) return false;
  const e = roh as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.fen === "string" &&
    typeof e.zuege === "string" &&
    typeof e.wertung === "number" &&
    typeof e.thema === "string" &&
    e.thema in ZUSATZTHEMEN &&
    (ZIELE as readonly unknown[]).includes(e.ziel)
  );
}

/**
 * Liest die Datei; unbekannte oder kaputte Einträge fallen weg (eine neuere Pipeline mit neuen
 * Themen bricht die App nicht).
 * Ausgabe: die Einträge oder null, wenn das Format nicht passt.
 */
export function zusatzeintraegeAus(roh: unknown): Zusatzeintrag[] | null {
  if (typeof roh !== "object" || roh === null) return null;
  const aufgaben = (roh as Record<string, unknown>).aufgaben;
  return Array.isArray(aufgaben) ? aufgaben.filter(istEintrag) : null;
}

/** Stufe 1 bis 5 aus der Lichess-Wertung. Beispiel: 1450 → 3. */
export function stufeAusWertung(wertung: number): number {
  return 1 + STUFENGRENZEN.filter((grenze) => wertung >= grenze).length;
}

/** Spielt die UCI-Züge und liefert sie als SAN; null, wenn einer nicht legal ist. */
function sanFolge(fen: string, zuege: readonly string[]): { san: string[]; fens: string[] } | null {
  const pos = regelstellung(fen);
  if (!pos) return null;
  const san: string[] = [];
  const fens: string[] = [];
  for (const uci of zuege) {
    // Rochade steht bei Lichess als Königszug (e1g1); chessops erwartet König nach Turm.
    const gelesen = parseUci(uci);
    const zug = gelesen ? normalizeMove(pos, gelesen) : null;
    if (!zug || !pos.isLegal(zug)) return null;
    san.push(makeSanAndPlay(pos, zug));
    fens.push(makeFen(pos.toSetup()));
  }
  return { san, fens };
}

/**
 * Macht aus einem Eintrag eine Aufgabe des Taktiktrainers.
 *
 * Warum: So lösen Zusatzaufgaben mit derselben Oberfläche wie die Buchaufgaben (Hilfen, falscher
 * Zug mit Vergleich, Wiederholung). Die Schlüsselfigur (Hilfe 3) steht auf dem Startfeld des
 * ersten Lösungszugs.
 * Beispiel: Lichess „00008“ (Gegnerzug f2g3, Lösung e6e7 …) → Kennung „lichess:00008“.
 * Sonderfall: Ist ein Zug nicht legal oder fehlt die Lösung, null.
 */
export function alsZusatzaufgabe(eintrag: Zusatzeintrag): Zusatzaufgabe | null {
  const uci = eintrag.zuege.split(" ").filter((z) => z.length > 0);
  const gespielt = sanFolge(eintrag.fen, uci);
  const [vorzug, schluesselzug, ...weiter] = gespielt?.san ?? [];
  const fen = gespielt?.fens[0];
  const schluesselfeld = uci[1]?.slice(0, 2);
  if (!vorzug || !fen || !schluesselfeld || !schluesselzug) return null;
  const loesung: Taktikaufgabe["loesung"] = [schluesselzug, ...weiter];
  const amZug = fen.split(" ")[1] === "b" ? "b" : "w";
  const aufgabe: Taktikaufgabe = {
    id: `${ZUSATZ_VORSATZ}${eintrag.id}`,
    fen,
    amZug,
    loesung,
    akzeptiert: [],
    motiv: ZUSATZTHEMEN[eintrag.thema],
    mattbild: eintrag.thema === "grundreihenmatt" ? "grundreihe" : null,
    schluesselfeld,
    ziel: eintrag.ziel,
    schwierigkeit: stufeAusWertung(eintrag.wertung),
    herkunft: { quelle: "lichess", puzzle: eintrag.id, wertung: eintrag.wertung },
    messung: { tiefe: null, laenge: Math.ceil(loesung.length / 2), klasse: KLASSE_LICHESS },
  };
  return { aufgabe, thema: eintrag.thema, vorher: { fen: eintrag.fen, zug: vorzug } };
}

/** Was der Leser bei den Zusatzaufgaben übt: alle Themen gemischt oder eines; Stufe oder alle. */
export interface Zusatzwahl {
  readonly thema: Zusatzthema | "gemischt";
  readonly stufe: number | null;
}

/** Wie viele Zusatzaufgaben es je Thema gibt (für die Auswahl), „gemischt“ zählt alle. */
export function zusatzJeThema(
  aufgaben: readonly Zusatzaufgabe[],
): Map<Zusatzthema | "gemischt", number> {
  const anzahl = new Map<Zusatzthema | "gemischt", number>([["gemischt", aufgaben.length]]);
  for (const a of aufgaben) anzahl.set(a.thema, (anzahl.get(a.thema) ?? 0) + 1);
  return anzahl;
}

/**
 * Eine Runde Zusatzaufgaben, leichteste zuerst.
 *
 * Warum: wie taktikrunde (Themenblock, Kapitel 12): zum Thema, mit gewählter Stufe zuerst die
 * Aufgaben dieser Stufe, reichen sie nicht, die der Nachbarstufen.
 * Ausgabe: höchstens `anzahl` Aufgaben, nach Wertung sortiert.
 */
export function zusatzrunde(
  aufgaben: readonly Zusatzaufgabe[],
  wahl: Zusatzwahl,
  anzahl: number,
  zufall: Zufall,
): Zusatzaufgabe[] {
  const zumThema = aufgaben.filter((a) => wahl.thema === "gemischt" || a.thema === wahl.thema);
  const abstand = (a: Zusatzaufgabe) =>
    wahl.stufe === null ? 0 : Math.abs(a.aufgabe.schwierigkeit - wahl.stufe);
  const auswahl = [...mische(zumThema, zufall)]
    .sort((a, b) => abstand(a) - abstand(b))
    .slice(0, anzahl);
  return auswahl.sort((a, b) => wertungVon(a) - wertungVon(b));
}

function wertungVon(a: Zusatzaufgabe): number {
  return a.aufgabe.herkunft.quelle === "lichess" ? a.aufgabe.herkunft.wertung : 0;
}
