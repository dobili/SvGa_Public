/**
 * Varianten als PGN schreiben und lesen: mit Nebenvarianten, Kommentaren und Zugzeichen.
 *
 * Rolle im Gesamtbild: Frage g des Entwurfs (Empfehlung C): Export pro Variante oder alle
 * zusammen (eine Partie je Variante), Import der ersten Partie einer Datei mit allen Varianten.
 * Lichess liest die Dateien als Studie. Geschrieben und gelesen wird über chessops/pgn (makePgn,
 * parsePgn); Kommentare werden beim Lesen von Befehlen wie „[%cal …]“ befreit (parseComment).
 * Zugzeichen stehen direkt am Zug („Sxe4?!“), wie im Buch. Pfeile, Felder und Engine-Werte
 * kommen mit Stufe 2 und 3 dazu. Deutsche Figurenbuchstaben übersetzt der Import wie beim
 * Einlesen von Partien (spiel/pgnimport.ts). Reine Funktionen.
 * Abhängigkeiten: chessops, spiel/pgnimport.ts, spiel/pgn.ts, training/variationen.ts,
 * training/variationsquellen.ts.
 */
import type { Position } from "chessops/chess";
import { makeFen } from "chessops/fen";
import {
  ChildNode,
  defaultGame,
  makePgn,
  parseComment,
  parsePgn,
  startingPosition,
  type Node,
  type PgnNodeData,
} from "chessops/pgn";
import { makeSan, parseSan } from "chessops/san";
import { GRUNDSTELLUNG } from "../training/lernsammlung";
import {
  HOECHSTENS_FORTSETZUNGEN,
  HOECHSTENS_KNOTEN,
  ZUGKOMMENTAR_HOECHSTENS,
  ZUGZEICHEN,
  type Variation,
  type Variationsknoten,
} from "../training/variationen";
import { entwurf } from "../training/variationsquellen";
import { pgnDatum } from "./pgn";
import { inEnglischerNotation, normalesSchach, type Importfehler } from "./pgnimport";

/** Der Zugbaum als Knoten von chessops; das Zugzeichen hängt am Zug. */
function alsPgnKnoten(zuege: readonly Variationsknoten[]): ChildNode<PgnNodeData>[] {
  return zuege.map((k) => {
    const knoten = new ChildNode<PgnNodeData>({
      san: k.zug + (k.zeichen ?? ""),
      ...(k.kommentar ? { comments: [k.kommentar] } : {}),
    });
    knoten.children = alsPgnKnoten(k.weiter);
    return knoten;
  });
}

/**
 * Eine Variante als PGN.
 *
 * Kopf: Event = Titel, Date = Tag des Anlegens, bei anderer Startstellung SetUp und FEN.
 * Kommentar zur Variante und zur Startstellung stehen vor dem ersten Zug.
 * Beispiel: Petroff-Falle → „[Event "Petroff-Falle"] … 1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6
 * (3... Nxe4?! 4. Qe2) *“.
 */
export function variationAlsPgn(variation: Variation): string {
  const spiel = defaultGame<PgnNodeData>(() => new Map());
  spiel.headers.set("Event", variation.titel || "?");
  spiel.headers.set("Site", "Schach von Grund auf");
  spiel.headers.set("Date", pgnDatum(variation.angelegt));
  if (variation.startFen !== GRUNDSTELLUNG) {
    spiel.headers.set("SetUp", "1");
    spiel.headers.set("FEN", variation.startFen);
  }
  spiel.headers.set("Result", "*");
  const vorweg = [variation.kommentar, variation.start.kommentar ?? ""].filter((s) => s !== "");
  if (vorweg.length > 0) spiel.comments = vorweg;
  spiel.moves.children = alsPgnKnoten(variation.zuege);
  return makePgn(spiel);
}

/** Alle Varianten in einer Datei, eine Partie je Variante. */
export function variationenAlsPgn(liste: readonly Variation[]): string {
  return liste.map(variationAlsPgn).join("\n");
}

/** Text eines PGN-Kommentars ohne Befehle wie „[%cal Ge2e4]“. */
function kommentartext(kommentare: readonly string[] | undefined): string {
  return (kommentare ?? [])
    .map((k) => parseComment(k).text.trim())
    .filter((k) => k !== "")
    .join(" ");
}

/** NAG $1 bis $6 sind die Zugzeichen ! ? !! ?? !? ?! in dieser Reihenfolge (PGN-Standard). */
const ERSTES_ZEICHEN_NAG = 1;

/** Das erste Zugzeichen unter den NAGs eines Zuges; andere NAGs (etwa $10 „ausgeglichen“) fallen weg. */
function zeichenAus(nags: readonly number[] | undefined) {
  const nag = (nags ?? []).find(
    (n) => n >= ERSTES_ZEICHEN_NAG && n < ERSTES_ZEICHEN_NAG + ZUGZEICHEN.length,
  );
  return nag === undefined ? undefined : ZUGZEICHEN[nag - ERSTES_ZEICHEN_NAG];
}

/** Zähler und Merker beim Lesen eines Baums. */
interface Lesestand {
  rest: number;
  gekuerzt: boolean;
}

/** Die Fortsetzungen eines PGN-Knotens; ein unmöglicher Zug beendet seinen Ast. */
function ausPgnKnoten(
  knoten: Node<PgnNodeData>,
  pos: Position,
  stand: Lesestand,
): Variationsknoten[] {
  const ergebnis: Variationsknoten[] = [];
  for (const kind of knoten.children) {
    const zug = parseSan(pos, kind.data.san);
    if (!zug) continue;
    const san = makeSan(pos, zug);
    if (ergebnis.some((k) => k.zug === san)) continue;
    if (stand.rest <= 0 || ergebnis.length >= HOECHSTENS_FORTSETZUNGEN) {
      stand.gekuerzt = true;
      break;
    }
    stand.rest -= 1;
    const danach = pos.clone();
    danach.play(zug);
    const zeichen = zeichenAus(kind.data.nags);
    const kommentar = kommentartext([
      ...(kind.data.startingComments ?? []),
      ...(kind.data.comments ?? []),
    ]).slice(0, ZUGKOMMENTAR_HOECHSTENS);
    ergebnis.push({
      zug: san,
      ...(zeichen ? { zeichen } : {}),
      ...(kommentar ? { kommentar } : {}),
      weiter: ausPgnKnoten(kind, danach, stand),
    });
  }
  return ergebnis;
}

/** Ergebnis des Imports: Entwurf (Quelle „pgn“), ob gekürzt wurde, oder der Grund. */
export type Variationsimport =
  | { readonly ok: true; readonly variation: Variation; readonly gekuerzt: boolean }
  | { readonly ok: false; readonly fehler: Importfehler };

/** Titel aus dem Kopf: Event, sonst „Weiß – Schwarz“, sonst der Ersatz. */
function titelAus(kopf: Map<string, string>, ersatz: string): string {
  const leer = (s: string | undefined) => !s || s === "?" || s.trim() === "";
  const ereignis = kopf.get("Event");
  if (!leer(ereignis)) return ereignis ?? ersatz;
  const weiss = kopf.get("White");
  const schwarz = kopf.get("Black");
  return leer(weiss) || leer(schwarz) ? ersatz : `${weiss} – ${schwarz}`;
}

/**
 * Liest die erste Partie einer PGN als Variante mit allen Nebenvarianten und Kommentaren.
 *
 * Eingaben: PGN-Text, Ersatztitel, jetzt. Ausgabe: Entwurf oder Grund (wie beim Einlesen von
 * Partien: leer, unlesbar, Schachvariante, unbekannter Zug).
 * Beispiel: „1. e4 e5 (1... c5 {Sizilianisch}) 2. Nf3 $1“ → e4, darauf e5 (Haupt) und c5 mit
 * Kommentar, nach e5 2. Sf3!.
 * Sonderfälle: Über 600 Züge oder 30 Fortsetzungen je Stellung wird gekürzt und das gemeldet
 * („gekuerzt“). Eine Partie ganz ohne Züge ist erlaubt (nur die Stellung aus FEN).
 */
export function variationAusPgn(text: string, ersatztitel: string, jetzt: Date): Variationsimport {
  if (text.trim() === "") return { ok: false, fehler: { art: "leer" } };
  const englisch = inEnglischerNotation(text);
  if (englisch.unbekannt) return { ok: false, fehler: { art: "zug", ...englisch.unbekannt } };
  const spiel = parsePgn(englisch.text)[0];
  const start = spiel ? startingPosition(spiel.headers) : null;
  if (!spiel || !start || start.isErr) return { ok: false, fehler: { art: "unlesbar" } };
  if (!normalesSchach(start.value.rules, spiel.headers.get("Variant"))) {
    return { ok: false, fehler: { art: "variante" } };
  }
  const stand: Lesestand = { rest: HOECHSTENS_KNOTEN, gekuerzt: false };
  const zuege = ausPgnKnoten(spiel.moves, start.value, stand);
  const variation = entwurf(
    {
      titel: titelAus(spiel.headers, ersatztitel),
      quelle: { art: "pgn" },
      startFen: makeFen(start.value.toSetup()),
      zuege,
      kommentar: kommentartext(spiel.comments),
    },
    jetzt,
  );
  if (!variation) return { ok: false, fehler: { art: "unlesbar" } };
  return { ok: true, variation, gekuerzt: stand.gekuerzt };
}
