/**
 * Fehlerarten aus Kapitel 1, die nur die Eröffnung betreffen: verfrühte Dame, König in der Mitte.
 *
 * Rolle im Gesamtbild: Ausgelagert aus fehlerart.ts (0.2.39), damit die Datei mit den Befunden
 * für den Rückblick unter 400 Zeilen bleibt. Die Regeln sind die Todsünden aus Kapitel 1
 * (k1-todsuenden.ts) in der Fassung für die Fehlersuche der Engine (Konzept 8.2).
 * Abhängigkeiten: fehlerart.ts (Typen Lage und Zugprobe), schach/todsuenden.ts.
 */
import type { Chess } from "chessops/chess";
import { leichtfigurenZuHause } from "../schach/todsuenden";
import type { Lage, Zugprobe } from "./fehlerart";

/** Leichtfiguren zu Hause, ab denen ein Damenzug „verfrüht“ ist (wie k1-todsuenden). */
const ZU_HAUSE_DAME = 2;
/** Ab diesem Zug gilt eine ausgelassene mögliche Rochade als „König in der Mitte“. */
const ROCHADE_SPAETESTENS = 10;
const DAMENLINIE = 3;
const GRUNDREIHE = { white: 0, black: 7 } as const;
const AUF_REIHE = 8;

/**
 * Verfrühte Dame (Kapitel 1): vom Startfeld ohne Schlag, zwei Leichtfiguren noch zu Hause.
 * Beispiel: Abb. 1.8, 3... Df6 mit Springern und Läufern zu Hause → ja.
 */
export function istVerfruehteDame(lage: Lage, p: Zugprobe): boolean {
  const startfeld = GRUNDREIHE[lage.regeln.turn] * AUF_REIHE + DAMENLINIE;
  return (
    p.figur.role === "queen" &&
    p.zug.from === startfeld &&
    p.geschlagen === null &&
    leichtfigurenZuHause(lage.regeln.board, lage.regeln.turn) >= ZU_HAUSE_DAME
  );
}

/** Kann die Seite am Zug jetzt rochieren (ein Königszug auf den eigenen Turm)? */
function kannRochieren(regeln: Chess): boolean {
  const koenig = regeln.board.kingOf(regeln.turn);
  if (koenig === undefined) return false;
  for (const ziel of regeln.dests(koenig)) {
    const figur = regeln.board.get(ziel);
    if (figur?.role === "rook" && figur.color === regeln.turn) return true;
  }
  return false;
}

/** König in der Mitte (Kapitel 1): ab Zug 10 eine mögliche Rochade ausgelassen. */
export function istKoenigMitte(lage: Lage, p: Zugprobe): boolean {
  return (
    lage.regeln.fullmoves >= ROCHADE_SPAETESTENS &&
    p.figur.role !== "king" &&
    kannRochieren(lage.regeln)
  );
}
