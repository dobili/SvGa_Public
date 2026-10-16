/**
 * Skelett-Röntgen „Vorher“: Was ein Bauernzug vorn gewinnt und hinten für immer aufgibt, und
 * welchen der vier Gründe aus Kapitel 5 er erfüllt.
 *
 * Rolle im Gesamtbild: Baustein für k5-vorher. Pflichtenheft 6.3: „Bei jedem Bauernzug: welche
 * Felder er neu kontrolliert und welche Felder dahinter kein Bauer mehr kontrollieren kann.“
 * Abhängigkeiten: chessops, bauernprofil.ts (Löcher), bauernschwaechen.ts (Deckungstest).
 * Buchbezug: Kapitel 5, „Das Grundgesetz der Bauern: vorn gewinnen, hinten verlieren“ (Abb. 5.1,
 * 5.2) und die vier Gründe: Felder, Bauernschwäche, Richtung, Figur.
 */
import { attacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import type { Chess } from "chessops/chess";
import { parseSan } from "chessops/san";
import { SquareSet } from "chessops/squareSet";
import type { Color, NormalMove, Square } from "chessops/types";
import { makeUci, squareFile } from "chessops/util";
import type { Figurenstand } from "./angriffskarte";
import { bauernprofil, eigeneReihe } from "./bauernprofil";
import { bauernschwaechen } from "./bauernschwaechen";
import { schwacheBauern } from "./skelettfiguren";
import { FIGURENWERT, gegner, type Stellung } from "./stellung";
import { ZENTRUM } from "./zielbilanz";

/** Ab dieser eigenen Reihe (Index) liegt ein Feld in der gegnerischen Hälfte. */
const GEGNERISCHE_HAELFTE_AB = 4;
/** Figuren, denen ein Bauernzug Linien öffnen kann. */
const LINIENFIGUREN = new Set(["bishop", "rook", "queen"]);
/** Die eigene Grundreihe (Index) und die Linien, auf denen ein rochierter König steht. */
const GRUNDREIHE = 0;
const LETZTE_DAMENSEITE = 2;
const ERSTE_KOENIGSSEITE = 6;

/** Die vier Gründe für einen Bauernzug (Kapitel 5, Grundgesetz der Bauern). */
export interface Bauernzuggruende {
  /** Neu kontrollierte Felder im Zentrum oder in der gegnerischen Hälfte. */
  readonly felder: readonly Square[];
  /** Gegnerische Bauern, die nach dem Zug neu eine Schwäche sind (Deckungstest, isoliert …). */
  readonly neueSchwaechenGegner: readonly Square[];
  /** Eigene Bauern, die vorher schwach waren und es danach nicht mehr sind. */
  readonly beseitigteSchwaechen: readonly Square[];
  /** Gegnerische Bauern, die der Bauer nach dem Zug angreift (Hebel). */
  readonly hebelGegen: readonly Square[];
  /** Eigene Läufer, Türme und Damen, die nach dem Zug mehr Felder erreichen. */
  readonly geoeffnetFuer: readonly Figurenstand[];
  /** Der Zug gibt dem eigenen König ein Fluchtfeld (Luftloch, Abb. 5.13). */
  readonly luftloch: boolean;
}

/** Was ein Bauernzug vorn gewinnt und hinten aufgibt. */
export interface Bauernzug {
  readonly farbe: Color;
  readonly san: string;
  readonly uci: string;
  readonly von: Square;
  readonly nach: Square;
  readonly schlaegt: boolean;
  /** Felder, die der Bauer nach dem Zug deckt und vorher nicht (Abb. 5.2: d5 und f5). */
  readonly neuKontrolliert: readonly Square[];
  /** Felder, die dieser Bauer nie wieder decken kann (Abb. 5.2: d3 und f3). */
  readonly aufgegeben: readonly Square[];
  /** Davon die Felder, die danach kein eigener Bauer mehr kontrollieren kann (neue Löcher). */
  readonly neueLoecher: readonly Square[];
  readonly gruende: Bauernzuggruende;
  /** Die Stellung nach dem Zug, für weitere Prüfungen. */
  readonly danach: Chess;
}

/** Felder, die ein Bauer von einem Feld aus deckt. */
function bauerndeckung(feld: Square, farbe: Color): SquareSet {
  return attacks({ role: "pawn", color: farbe }, feld, SquareSet.empty());
}

/** Alle schwachen Bauern einer Seite nach der Tabelle in Kapitel 5 (auch Kettenbasis ohne Stütze). */
function schwache(brett: Board, farbe: Color): Set<Square> {
  return new Set(schwacheBauern(bauernschwaechen(brett, farbe), bauernprofil(brett, farbe)));
}

function ohne<T>(menge: Set<T>, andere: Set<T>): T[] {
  return [...menge].filter((x) => !andere.has(x));
}

/** Figuren, die nach dem Zug mehr Felder erreichen als vorher (der Zug räumt ihnen den Weg). */
function geoeffnet(vorher: Board, danach: Board, farbe: Color): Figurenstand[] {
  const figuren: Figurenstand[] = [];
  for (const feld of danach[farbe]) {
    const figur = danach.get(feld);
    if (!figur || !LINIENFIGUREN.has(figur.role) || !vorher[farbe].has(feld)) continue;
    const vorherFelder = attacks(figur, feld, vorher.occupied).size();
    const danachFelder = attacks(figur, feld, danach.occupied).size();
    if (danachFelder > vorherFelder) figuren.push({ feld, figur });
  }
  // Leichtfiguren vor Schwerfiguren, wie das Buch sie nennt („öffnet Läufer und Dame den Weg“).
  return figuren.sort((a, b) => FIGURENWERT[a.figur.role] - FIGURENWERT[b.figur.role]);
}

/**
 * Ob der Zug dem eigenen König ein Nachbarfeld freimacht (Luftloch, Abb. 5.13: h3). Das gilt
 * für den rochierten König auf der Grundreihe (Linien a bis c oder g bis h); in der
 * Grundstellung öffnet e2–e4 dem König kein Luftloch, sondern Läufer und Dame den Weg.
 */
function istLuftloch(brett: Board, von: Square, farbe: Color): boolean {
  const koenig = brett.kingOf(farbe);
  if (koenig === undefined || eigeneReihe(koenig, farbe) !== GRUNDREIHE) return false;
  const linie = squareFile(koenig);
  const rochiert = linie <= LETZTE_DAMENSEITE || linie >= ERSTE_KOENIGSSEITE;
  return rochiert && attacks({ role: "king", color: farbe }, koenig, SquareSet.empty()).has(von);
}

function gruendeVon(
  vorher: Board,
  danach: Board,
  zug: NormalMove,
  farbe: Color,
  neuKontrolliert: readonly Square[],
): Bauernzuggruende {
  const feind = gegner(farbe);
  const zentrum = new Set(ZENTRUM);
  const felder = neuKontrolliert.filter(
    (f) => zentrum.has(f) || eigeneReihe(f, farbe) >= GEGNERISCHE_HAELFTE_AB,
  );
  const gegnerVorher = schwache(vorher, feind);
  const gegnerDanach = schwache(danach, feind);
  const eigeneVorher = schwache(vorher, farbe);
  const eigeneDanach = schwache(danach, farbe);
  const hebelGegen = [
    ...bauerndeckung(zug.to, farbe).intersect(danach.pawn.intersect(danach[feind])),
  ];
  return {
    felder,
    neueSchwaechenGegner: ohne(gegnerDanach, gegnerVorher),
    beseitigteSchwaechen: ohne(eigeneVorher, eigeneDanach).filter((f) => f !== zug.from),
    hebelGegen,
    geoeffnetFuer: geoeffnet(vorher, danach, farbe),
    luftloch: istLuftloch(vorher, zug.from, farbe),
  };
}

/**
 * Prüft einen Bauernzug nach dem Grundgesetz der Bauern.
 *
 * Warum: „Jeder Bauernzug gewinnt Felder vorn und gibt Felder hinten für immer auf“; das
 * Skelett-Röntgen fragt vor jedem Bauernzug, was er bringt und was er kostet.
 * Eingaben: Stellung mit Regeln und der Zug in Kurznotation (englisch, wie in den Daten).
 * Ausgabe: Bauernzug, oder null, wenn der Zug kein legaler Bauernzug ist.
 * Beispiel: Abb. 5.1 ist ein Lehrbild; an der Grundstellung ergibt e2–e4: neu kontrolliert d5
 * und f5, aufgegeben d3 und f3 (wie Abb. 5.2: „wird er nie wieder decken können“), Grund
 * „Felder“ (d5 und f5 sind Zentrum und gegnerische Hälfte), geöffnet für Läufer f1 und Dame d1.
 * Sonderfälle: Ein Schlagzug zählt ebenso („auch ein Schlagzug“, Kapitel 5); Umwandlungen
 * werden wie der Zug auf die letzte Reihe behandelt. Aufgegeben zählt je Bauer (das Buch zeigt
 * d3 und f3 rot, obwohl c2 und g2 sie noch decken könnten); die neuen Löcher stehen daneben.
 */
export function bauernzug(stellung: Stellung, san: string): Bauernzug | null {
  const { regeln } = stellung;
  if (!regeln) return null;
  const zug = parseSan(regeln, san);
  if (!zug || !("from" in zug)) return null;
  const figur = regeln.board.get(zug.from);
  if (figur?.role !== "pawn") return null;
  const farbe = figur.color;
  const danach = regeln.clone();
  danach.play(zug);
  const vorher = regeln.board;
  const neuKontrolliert = [...bauerndeckung(zug.to, farbe).diff(bauerndeckung(zug.from, farbe))];
  const aufgegeben = [...bauerndeckung(zug.from, farbe).diff(bauerndeckung(zug.to, farbe))];
  const loecherVorher = new Set(bauernprofil(vorher, farbe).loecher);
  const neueLoecher = bauernprofil(danach.board, farbe).loecher.filter(
    (f) => !loecherVorher.has(f),
  );
  return {
    farbe,
    san,
    uci: makeUci(zug),
    von: zug.from,
    nach: zug.to,
    schlaegt: vorher.occupied.has(zug.to) || zug.to === regeln.epSquare,
    neuKontrolliert,
    aufgegeben,
    neueLoecher,
    gruende: gruendeVon(vorher, danach.board, zug, farbe, neuKontrolliert),
    danach,
  };
}
