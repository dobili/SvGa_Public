/**
 * Varianten als PGN schreiben und lesen: mit Nebenvarianten, Kommentaren und Zugzeichen.
 *
 * Rolle im Gesamtbild: Frage g des Entwurfs (Empfehlung C): Export pro Variante oder alle
 * zusammen (eine Partie je Variante), Import der ersten Partie einer Datei mit allen Varianten.
 * Lichess liest die Dateien als Studie. Geschrieben und gelesen wird über chessops/pgn (makePgn,
 * parsePgn); Kommentare werden beim Lesen von Befehlen wie „[%cal …]“ befreit (parseComment).
 * Zugzeichen stehen direkt am Zug („Sxe4?!“), wie im Buch. Seit Stufe 2 reisen Pfeile, Felder,
 * Nummerntexte und Legende mit (spiel/variationsformen.ts), seit Stufe 3 die Engine-Werte als
 * „[%eval …]“ (spiel/variationseval.ts). Deutsche Figurenbuchstaben übersetzt der Import wie beim
 * Einlesen von Partien (spiel/pgnimport.ts). Reine Funktionen.
 * Abhängigkeiten: chessops, spiel/pgnimport.ts, spiel/pgn.ts, spiel/variationsformen.ts,
 * spiel/formwoerter.ts, training/variationen.ts, training/variationsquellen.ts.
 */
import type { Position } from "chessops/chess";
import { makeFen } from "chessops/fen";
import {
  ChildNode,
  defaultGame,
  makePgn,
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
  MARKEN_HOECHSTENS,
  ZUGKOMMENTAR_HOECHSTENS,
  ZUGZEICHEN,
  type Knotendaten,
  type Variation,
  type Variationsknoten,
} from "../training/variationen";
import { entwurf } from "../training/variationsquellen";
import { formwoerter } from "./formwoerter";
import { pgnDatum } from "./pgn";
import {
  formenAusKommentar,
  kommentarMitFormen,
  legendeAusKommentar,
  legendenzeilen,
  type Formwoerter,
} from "./variationsformen";
import { inEnglischerNotation, normalesSchach, type Importfehler } from "./pgnimport";

/** Der Zugbaum als Knoten von chessops; das Zugzeichen hängt am Zug, Formen am Kommentar. */
function alsPgnKnoten(
  zuege: readonly Variationsknoten[],
  woerter: Formwoerter,
): ChildNode<PgnNodeData>[] {
  return zuege.map((k) => {
    const kommentar = kommentarMitFormen(k, woerter);
    const knoten = new ChildNode<PgnNodeData>({
      san: k.zug + (k.zeichen ?? ""),
      ...(kommentar ? { comments: [kommentar] } : {}),
    });
    knoten.children = alsPgnKnoten(k.weiter, woerter);
    return knoten;
  });
}

/** Kommentar zur Variante mit den Legendenzeilen, danach die Startstellung mit ihren Formen. */
function vorwegkommentare(variation: Variation, woerter: Formwoerter): string[] {
  const zurVariante = [variation.kommentar, ...legendenzeilen(variation.legende, woerter)];
  const vorweg = [
    zurVariante.filter(Boolean).join("\n"),
    kommentarMitFormen(variation.start, woerter),
  ];
  return vorweg.filter((s) => s !== "");
}

/**
 * Eine Variante als PGN.
 *
 * Kopf: Event = Titel, Date = Tag des Anlegens, bei anderer Startstellung SetUp und FEN.
 * Kommentar zur Variante (mit der Legende) und zur Startstellung stehen vor dem ersten Zug.
 * Beispiel: Petroff-Falle → „[Event "Petroff-Falle"] … 1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6
 * (3... Nxe4?! 4. Qe2) *“.
 */
export function variationAlsPgn(
  variation: Variation,
  woerter: Formwoerter = formwoerter()[0],
): string {
  const spiel = defaultGame<PgnNodeData>(() => new Map());
  spiel.headers.set("Event", variation.titel || "?");
  spiel.headers.set("Site", "Schach von Grund auf");
  spiel.headers.set("Date", pgnDatum(variation.angelegt));
  if (variation.startFen !== GRUNDSTELLUNG) {
    spiel.headers.set("SetUp", "1");
    spiel.headers.set("FEN", variation.startFen);
  }
  spiel.headers.set("Result", "*");
  const vorweg = vorwegkommentare(variation, woerter);
  if (vorweg.length > 0) spiel.comments = vorweg;
  spiel.moves.children = alsPgnKnoten(variation.zuege, woerter);
  return makePgn(spiel);
}

/** Alle Varianten in einer Datei, eine Partie je Variante. */
export function variationenAlsPgn(liste: readonly Variation[]): string {
  const woerter = formwoerter()[0];
  return liste.map((v) => variationAlsPgn(v, woerter)).join("\n");
}

/**
 * Kommentar, Marken und Nummerntexte aus den PGN-Kommentaren eines Zuges (Befehle wie
 * „[%cal Ge2e4]“ werden zu Marken, spiel/variationsformen.ts); gekürzt auf die Grenzen.
 */
function knotendatenAus(
  kommentare: readonly string[],
  woerter: readonly Formwoerter[],
): Knotendaten {
  const daten = formenAusKommentar(kommentare.join("\n"), woerter);
  const kommentar = (daten.kommentar ?? "").slice(0, ZUGKOMMENTAR_HOECHSTENS);
  return {
    ...daten,
    ...(daten.marken ? { marken: daten.marken.slice(0, MARKEN_HOECHSTENS) } : {}),
    ...(kommentar ? { kommentar } : {}),
  };
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
  readonly woerter: readonly Formwoerter[];
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
    const daten = knotendatenAus(
      [...(kind.data.startingComments ?? []), ...(kind.data.comments ?? [])],
      stand.woerter,
    );
    ergebnis.push({
      zug: san,
      ...(zeichen ? { zeichen } : {}),
      ...daten,
      weiter: ausPgnKnoten(kind, danach, stand),
    });
  }
  return ergebnis;
}

/**
 * Die Kommentare vor dem ersten Zug: Pfeile, Felder und Nummerntexte gehören zur Startstellung
 * (so schreibt sie der Export, so schreibt Lichess die Formen der Startstellung), der Text ist
 * wie in Stufe 1 der Kommentar zur Variante; Zeilen „Legende Rot: …“ werden zur Legende.
 */
function vorwegAus(kommentare: readonly string[], woerter: readonly Formwoerter[]) {
  const daten = formenAusKommentar(kommentare.join("\n"), woerter);
  const gelesen = legendeAusKommentar(daten.kommentar ?? "", woerter);
  const { w, b, a } = daten;
  const start: Knotendaten = {
    // Stufe 3: Engine-Werte der Startstellung („[%eval …]“ vor dem ersten Zug).
    ...(w !== undefined ? { w, ...(b ? { b } : {}), ...(a !== undefined ? { a } : {}) } : {}),
    ...(daten.marken ? { marken: daten.marken.slice(0, MARKEN_HOECHSTENS) } : {}),
    ...(daten.nummerntexte ? { nummerntexte: daten.nummerntexte } : {}),
  };
  return { kommentar: gelesen.text, legende: gelesen.legende, start };
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
export function variationAusPgn(
  text: string,
  ersatztitel: string,
  jetzt: Date,
  woerter: readonly Formwoerter[] = formwoerter(),
): Variationsimport {
  if (text.trim() === "") return { ok: false, fehler: { art: "leer" } };
  const englisch = inEnglischerNotation(text);
  if (englisch.unbekannt) return { ok: false, fehler: { art: "zug", ...englisch.unbekannt } };
  const spiel = parsePgn(englisch.text)[0];
  const start = spiel ? startingPosition(spiel.headers) : null;
  if (!spiel || !start || start.isErr) return { ok: false, fehler: { art: "unlesbar" } };
  if (!normalesSchach(start.value.rules, spiel.headers.get("Variant"))) {
    return { ok: false, fehler: { art: "variante" } };
  }
  const stand: Lesestand = { rest: HOECHSTENS_KNOTEN, gekuerzt: false, woerter };
  const zuege = ausPgnKnoten(spiel.moves, start.value, stand);
  const vorweg = vorwegAus(spiel.comments ?? [], woerter);
  const variation = entwurf(
    {
      titel: titelAus(spiel.headers, ersatztitel),
      quelle: { art: "pgn" },
      startFen: makeFen(start.value.toSetup()),
      zuege,
      kommentar: vorweg.kommentar,
    },
    jetzt,
  );
  if (!variation) return { ok: false, fehler: { art: "unlesbar" } };
  const mitFormen = { ...variation, start: vorweg.start, legende: vorweg.legende };
  return { ok: true, variation: mitFormen, gekuerzt: stand.gekuerzt };
}
