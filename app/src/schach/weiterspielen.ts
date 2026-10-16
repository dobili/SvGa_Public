/**
 * Eigene Züge ab einer Stellung: legale Ziele, Zug ausführen, eigene Zeile, Skelett-Ansicht.
 *
 * Rolle im Gesamtbild: „Weiterspielen“ aus Pflichtenheft 4: Der Leser zieht ab jeder Stellung
 * selbst weiter; die Zugleiste zeigt seine Züge hinter den Buchzügen und bietet „Zurück zur
 * Buchvariante“. Dazu die „Skelett-Ansicht“ (nur Bauern und Könige, Kapitel 5).
 * Abhängigkeiten: chessops, schach/notation.ts.
 * Buchbezug: Kapitel 5, „Skelett-Röntgen“ (Figuren ausblenden, Bauernstruktur sehen).
 */
import { Chess, normalizeMove } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { makeSanAndPlay, parseSan } from "chessops/san";
import type { NormalMove, Role } from "chessops/types";
import { makeSquare, parseSquare } from "chessops/util";
import { sanInSprache } from "./notation";

/** Die eigenen Züge hinter der Buchstellung und wie viele davon gerade gezeigt werden. */
export interface EigeneZuege {
  readonly zuege: readonly string[];
  readonly stelle: number;
}

export const KEINE_EIGENEN: EigeneZuege = { zuege: [], stelle: 0 };

/** Figuren, in die ein Bauer umwandeln kann, in der Reihenfolge der Auswahl. */
export const UMWANDLUNGEN: readonly Role[] = ["queen", "rook", "bishop", "knight"];

function stellung(fen: string): Chess | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const ergebnis = Chess.fromSetup(setup.value);
  return ergebnis.isOk ? ergebnis.value : null;
}

/** Linie des Königs nach der kurzen (g) und der langen (c) Rochade. */
const KOENIG_KURZ = 6;
const KOENIG_LANG = 2;

/**
 * Zielfeld des Königs für einen Rochadezug, den chessops als „König schlägt eigenen Turm“ führt.
 *
 * Regel: Kapitel 0, Rochade (der König zieht zwei Felder zum Turm). Der Leser tippt wie bei
 * Chess.com das Feld, auf dem der König landet (g1, c1, g8, c8), nicht den Turm (Wunsch des Autors).
 */
function rochadeziel(pos: Chess, von: number, ziel: number): number {
  const figur = pos.board.get(von);
  const turm = pos.board.get(ziel);
  const eigenerTurm = turm?.role === "rook" && turm.color === figur?.color;
  if (figur?.role !== "king" || !eigenerTurm) return ziel;
  const reihe = von & ~7;
  return reihe + (ziel > von ? KOENIG_KURZ : KOENIG_LANG);
}

/**
 * Felder, auf die die Figur auf ``von`` ziehen darf.
 *
 * Beispiel: Grundstellung, „g1“ → [„f3“, „h3“]. Mit Rochaderecht nennt der König die Felder, auf
 * denen er nach der Rochade steht (g1, c1), nicht die Türme. Sonderfälle: Figur der falschen
 * Farbe, leeres Feld oder Stellung ohne Regeln (Lehrbild ohne König) → leere Liste.
 */
export function legaleZiele(fen: string, von: string): string[] {
  const pos = stellung(fen);
  const feld = parseSquare(von);
  if (!pos || feld === undefined) return [];
  return [...pos.dests(feld)].map((ziel) => makeSquare(rochadeziel(pos, feld, ziel)));
}

/** Ergebnis eines Zugversuchs. */
export type Zugversuch =
  | { readonly art: "gespielt"; readonly san: string; readonly fen: string }
  | { readonly art: "umwandlung" }
  | { readonly art: "ungueltig" };

/**
 * Führt einen Zug von Feld zu Feld aus.
 *
 * Warum: Tippen auf Figur und Zielfeld (Konzept 10.2). Zieht ein Bauer auf die letzte Reihe und
 * fehlt die Figur, meldet die Funktion „umwandlung“; die Oberfläche fragt dann nach.
 * Ausgabe: Zug in Kurznotation (englisch, wie in den Daten) und neue Stellung.
 * Beispiel: Abb. 1.26, „f1“ → „d3“ → { san: „Bd3“ } (6. Ld3 wie im Buch).
 */
export function spieleZug(fen: string, von: string, nach: string, umwandlung?: Role): Zugversuch {
  const pos = stellung(fen);
  const a = parseSquare(von);
  const b = parseSquare(nach);
  if (!pos || a === undefined || b === undefined) return { art: "ungueltig" };
  // Rochade: Das Zielfeld des Königs (g1) wird zum Zug „König auf Turm“, den chessops erwartet.
  const ziel = normalizeMove(pos, { from: a, to: b }).to;
  if (!pos.dests(a).has(ziel) || rochadeziel(pos, a, ziel) !== b) return { art: "ungueltig" };
  const bauer = pos.board.get(a)?.role === "pawn";
  const letzteReihe = b >> 3 === 0 || b >> 3 === 7;
  if (bauer && letzteReihe && !umwandlung) return { art: "umwandlung" };
  const zug: NormalMove = {
    from: a,
    to: ziel,
    ...(bauer && letzteReihe ? { promotion: umwandlung } : {}),
  };
  const san = makeSanAndPlay(pos, zug);
  return { art: "gespielt", san, fen: makeFen(pos.toSetup()) };
}

/** Stellung nach den ersten ``anzahl`` Zügen einer Liste; null, wenn einer nicht passt. */
export function fenNachZuegen(
  fen: string,
  zuege: readonly string[],
  anzahl = zuege.length,
): string | null {
  const pos = stellung(fen);
  if (!pos) return null;
  for (const san of zuege.slice(0, anzahl)) {
    const zug = parseSan(pos, san);
    if (!zug) return null;
    pos.play(zug);
  }
  return makeFen(pos.toSetup());
}

/** Start- und Zielfeld eines Zuges in einer Stellung (für den hellen Schimmer des letzten Zuges). */
export function zugFelder(fen: string, san: string): { von: string; nach: string } | null {
  const pos = stellung(fen);
  const zug = pos ? parseSan(pos, san) : undefined;
  if (!pos || !zug || !("from" in zug)) return null;
  // Nach einer Rochade schimmert das Feld, auf dem der König landet (g1), nicht der Turm.
  return { von: makeSquare(zug.from), nach: makeSquare(rochadeziel(pos, zug.from, zug.to)) };
}

/** Eigene Züge als Text mit Zugnummern („6. Sxe5 Sxe5 7. Dxd5“), je Zug ein Eintrag. */
export function eigeneAlsText(fen: string, zuege: readonly string[], sprachcode: string): string[] {
  const pos = stellung(fen);
  if (!pos) return [];
  return zuege.map((san, index) => {
    const nummer =
      pos.turn === "white" ? `${pos.fullmoves}. ` : index === 0 ? `${pos.fullmoves}... ` : "";
    const zug = parseSan(pos, san);
    if (zug) pos.play(zug);
    return nummer + sanInSprache(san, sprachcode);
  });
}

/**
 * Die Skelett-Ansicht: nur Bauern und Könige bleiben stehen.
 *
 * Regel: Kapitel 5, „Skelett-Röntgen“: Wer die Figuren ausblendet, sieht die Bauernstruktur,
 * die den Plan bestimmt. Nur zur Anzeige; Werkzeuge rechnen weiter mit der vollen Stellung.
 * Beispiel: Grundstellung → Brettteil „4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3“, der Rest der FEN bleibt.
 */
export function skelettFen(fen: string): string {
  const [brett = "", ...rest] = fen.split(" ");
  const nur = brett.replace(/[nbrqNBRQ]/g, "1");
  const zusammen = nur.replace(/\d+/g, (zahlen) =>
    String([...zahlen].reduce((summe, ziffer) => summe + Number(ziffer), 0)),
  );
  return [zusammen, ...rest].join(" ");
}
