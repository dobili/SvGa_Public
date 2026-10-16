/**
 * Jeden erzwingenden Kandidaten bis zur Ruhe rechnen: Die Engine spielt nach dem Kandidaten die
 * beste Fortsetzung beider Seiten, die Rechnung endet an der ersten Ruhe, und die Bilanz zählt das
 * Material vorher und nachher.
 *
 * Rolle im Gesamtbild: liefert die Zeilen der Karte ErzwingendKarte (Werkzeug k7-erzwingend,
 * seit 0.2.33, Vorschlag B1, Antwort des Autors „einverstanden“). Dieselbe Ruhe wie im Werkzeug
 * „Ruhe“ (ruhe.ts, bisZurRuhe), nur je Kandidat statt für die Hauptvariante.
 * Abhängigkeiten: chessops, ruhe.ts (bisZurRuhe, material), engineDienst.ts (Bewertung).
 * Buchbezug: Kapitel 7, Schritt 2 und 3 („Rechne sie in dieser Reihenfolge … jeden Ast bis zur
 * Ruhe“; „Die Bilanz: Zähle am Ende der Variante nach“).
 */
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import type { Color, Role } from "chessops/types";
import { parseUci } from "chessops/util";
import { FIGURENWERT } from "../schach/stellung";
import { bisZurRuhe, material, type Bewerter, type Ruhe } from "./ruhe";
import type { Wert } from "./uci";

/** So viele Züge zählt ein Matt höchstens; ein Matt wiegt mehr als jeder Materialwert. */
const MATT_GEWICHT = 1000;

/** Das Ergebnis eines Kandidaten bis zur Ruhe. */
export interface Kandidatenruhe {
  /** Der Kandidat (UCI). */
  readonly zug: string;
  /** Der Kandidat und die Fortsetzung der Engine bis zur Ruhe (UCI). */
  readonly zuege: readonly string[];
  /** Wie die Folge endet (wie bei „Ruhe“). */
  readonly ende: Ruhe["ende"];
  /** Materialänderung aus Sicht der Seite am Zug in Bauerneinheiten, etwa +5 oder −2. */
  readonly bilanz: number;
  /** Die wertvollste Figur, die netto gewonnen (bilanz > 0) oder verloren (bilanz < 0) wird. */
  readonly figur: Role | null;
  /** Wert der Engine nach dem Kandidaten, aus Sicht von Weiß. */
  readonly wert: Wert;
  /** Setzt die Folge matt (die eigene Seite) oder wird die eigene Seite matt? */
  readonly matt: "setzt" | "wird" | null;
}

/** Die Stellung aus einer FEN, oder null. */
function stellungAus(fen: string): Chess | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  return pos.isErr ? null : pos.value;
}

/**
 * Die wertvollste Figur, die eine Seite netto verliert: Gleiche Figuren, die beide Seiten
 * verlieren, heben sich auf (Turm gegen Turm ist ein Tausch).
 */
function nettoFigur(verlorenEigen: Role[], verlorenGegner: Role[], gewinnt: boolean): Role | null {
  const eigene = [...verlorenEigen];
  const fremde: Role[] = [];
  for (const rolle of verlorenGegner) {
    const stelle = eigene.indexOf(rolle);
    if (stelle >= 0) eigene.splice(stelle, 1);
    else fremde.push(rolle);
  }
  const liste = gewinnt ? fremde : eigene;
  return [...liste].sort((a, b) => FIGURENWERT[b] - FIGURENWERT[a])[0] ?? null;
}

/** Die Figuren, die jede Seite in der Folge verliert (eigene, gegnerische). */
function verluste(pos: Chess, zuege: readonly string[], eigen: Color): [Role[], Role[]] {
  const kopie = pos.clone();
  const eigene: Role[] = [];
  const fremde: Role[] = [];
  for (const uci of zuege) {
    const zug = parseUci(uci);
    if (!zug || !kopie.isLegal(zug)) break;
    const opfer = "from" in zug ? kopie.board.get(zug.to) : undefined;
    if (opfer && opfer.role !== "king") (opfer.color === eigen ? eigene : fremde).push(opfer.role);
    kopie.play(zug);
  }
  return [eigene, fremde];
}

/**
 * Wie viel ein Kandidat aus Sicht der eigenen Seite wert ist, zum Vergleichen: ein eigenes Matt
 * zählt am meisten, ein Matt gegen die eigene Seite am wenigsten, sonst der Wert der Engine.
 *
 * Eingaben: Ergebnis, eigene Farbe. Ausgabe: Zahl, größer ist besser.
 * Beispiel: Abb. 7.14, 2. Th8+ (Engine etwa +6) vor 1. Te8+ (etwa −4).
 */
export function kandidatenwert(k: Kandidatenruhe, eigen: Color): number {
  if (k.matt === "setzt") return MATT_GEWICHT;
  if (k.matt === "wird") return -MATT_GEWICHT;
  const sicht = eigen === "white" ? 1 : -1;
  if (k.wert.art === "matt")
    return sicht * Math.sign(k.wert.zuege) * (MATT_GEWICHT - Math.abs(k.wert.zuege));
  return sicht * k.wert.bauern;
}

/** Der Wert eines Matts aus Sicht von Weiß, wenn die Seite `matt` gesetzt hat. */
function mattwert(gesetztVon: Color): Wert {
  return { art: "matt", zuege: gesetztVon === "white" ? 1 : -1 };
}

/**
 * Rechnet einen Kandidaten bis zur Ruhe.
 *
 * Eingaben: Bewerter, Stellung mit der eigenen Seite am Zug (FEN), Kandidat (UCI), Rechenzeit.
 * Ausgabe: Folge bis zur Ruhe, Bilanz, gewonnene oder verlorene Figur, Wert; null, wenn der
 * Kandidat in der Stellung nicht geht.
 * Beispiel: Abb. 7.14, Kandidat Th8+: „Th8+ Kxh8 Sxf7+ Kg8 Sxd6“, Bilanz +5, gewinnt die Dame.
 * Sonderfälle: Setzt der Kandidat selbst matt oder patt, rechnet die Engine nicht.
 */
export async function rechneKandidatenruhe(
  bewerter: Bewerter,
  fen: string,
  uci: string,
  rechenzeitMs: number,
): Promise<Kandidatenruhe | null> {
  const pos = stellungAus(fen);
  const zug = parseUci(uci);
  if (!pos || !zug || !pos.isLegal(zug)) return null;
  const eigen = pos.turn;
  const nach = pos.clone();
  nach.play(zug);
  let fortsetzung: readonly string[] = [];
  let wert: Wert = nach.isCheckmate() ? mattwert(eigen) : { art: "bauern", bauern: 0 };
  if (!nach.isEnd()) {
    const variante = (await bewerter.bewerte(makeFen(nach.toSetup()), rechenzeitMs, 1))
      .varianten[0];
    fortsetzung = variante?.zuege ?? [];
    wert = variante?.wert ?? wert;
  }
  const { zuege, ende, danach } = bisZurRuhe(pos, [uci, ...fortsetzung]);
  const bilanz = material(danach, eigen) - material(pos, eigen);
  const [eigene, fremde] = verluste(pos, zuege, eigen);
  const matt = ende !== "matt" ? null : danach.turn === eigen ? "wird" : "setzt";
  return {
    zug: uci,
    zuege,
    ende,
    bilanz,
    figur: bilanz === 0 ? null : nettoFigur(eigene, fremde, bilanz > 0),
    wert,
    matt,
  };
}
