/**
 * Regelschichten der Sonderformen Nebel und Ente für die Variantenschnittstelle von mittel-3
 * (spiel/varianten/variante.ts): legale Züge, Ziehen und Ende über FEN und UCI.
 *
 * Warum: Jede Variante meldet ihre Regeln in derselben Form an, damit Speicher, Hülle und Prüfungen
 * sie verstehen. Gespielt werden Nebel und Ente in der eigenen Partie (Variantenpartien.tsx); die
 * Schicht hier ist die Brücke von FEN/UCI zu freistellung.ts, nebel.ts und ente.ts.
 * Abhängigkeiten: freistellung.ts, nebel.ts, ente.ts, spiel/varianten/variante.ts (Typen).
 *
 * Regel (L5, L6): Im Nebel und mit Ente gibt es kein Schach (Königsfang); die FEN darf deshalb eine
 * Stellung beschreiben, in der der König des Gegners angegriffen ist. Die Ente steht in der FEN als
 * „*“ (Fairy-Stockfish `duck`), ein Zug mit Ente heißt „e2e4,e4d5“; schlägt der Zug den König,
 * steht als Entenfeld das Zielfeld („e2e1,e1e1“), weil keine Ente mehr gesetzt wird.
 */
import type { Color } from "chessops/types";
import { makeSquare, opposite } from "chessops/util";
import type { Regelschicht, Variantenende } from "../../spiel/varianten/variante";
import {
  entenFen,
  entenfelder,
  entenzuege,
  spieleEntenzug,
  zieheFigur,
  type Entenpartie,
} from "./ente";
import { alsFen, alsUci, ausFen, ausUci, hatKoenig } from "./freistellung";
import { neueNebelpartie, nebelzuege, spieleNebelzug } from "./nebel";

const FARBE: Record<Color, "weiss" | "schwarz"> = { white: "weiss", black: "schwarz" };
const REIHE = 8;

/** Ende als Sieg einer Farbe (oder remis) mit dem Spieltext der Variante. */
const ende = (sieger: Color | null, kennung: string): Variantenende => ({
  sieger: sieger ? FARBE[sieger] : null,
  grund: `variante.${kennung}.ende`,
});

/** Nebel: Regeln nach Gangart, Königsfang (nebel.ts). Patt ist remis. */
export const NEBELREGELN: Regelschicht = {
  chessops: null,
  stellung: () => null,
  legaleZuege: (fen) => nebelzuege(neueNebelpartie(fen)).map(alsUci),
  ziehe: (fen, uci) => {
    const zug = ausUci(uci);
    if (!zug) return null;
    try {
      return { fen: alsFen(spieleNebelzug(neueNebelpartie(fen), zug, uci).stellung), san: uci };
    } catch {
      return null; // nicht erlaubt: die Schnittstelle erwartet dann null
    }
  },
  ende: (fen) => {
    const p = neueNebelpartie(fen);
    if (!hatKoenig(p.stellung, p.stellung.amZug)) return ende(opposite(p.stellung.amZug), "nebel");
    return nebelzuege(p).length === 0 ? ende(null, "nebel") : null;
  },
};

/**
 * Liest eine Enten-FEN: das Feld der Ente („*“) und das Brett ohne sie.
 * Beispiel: „…/4*3/4P3/…“ → Ente auf e5.
 */
export function entenpartieAus(fen: string): Entenpartie {
  const [brett = "", ...rest] = fen.split(" ");
  let ente: number | null = null;
  brett.split("/").forEach((reihe, i) => {
    const spalte = reihe.replace(/\d/g, (n) => ".".repeat(Number(n))).indexOf("*");
    if (spalte >= 0) ente = (REIHE - 1 - i) * REIHE + spalte;
  });
  // „*“ wird ein leeres Feld; Ziffernfolgen („413“) werden zu ihrer Summe („8“).
  const ohne = brett
    .replace(/\*/g, "1")
    .replace(/\d+/g, (n) => String([...n].reduce((a, b) => a + Number(b), 0)));
  return { stellung: ausFen([ohne, ...rest].join(" ")), ente, phase: "zug", zuege: [], ende: null };
}

/** Alle ganzen Entenzüge der Seite am Zug („Figur,Ente“). */
function ganzeZuege(p: Entenpartie): string[] {
  return entenzuege(p).flatMap((zug) => {
    const uci = alsUci(zug);
    const ziel = uci.slice(2, 4);
    const nach = zieheFigur(p, zug);
    if (nach.ende) return [`${uci},${ziel}${ziel}`];
    return entenfelder(nach).map((f) => `${uci},${ziel}${makeSquare(f)}`);
  });
}

/** Ente: Regeln nach duckchess.com (ente.ts). Wer keinen Zug hat, gewinnt. */
export const ENTENREGELN: Regelschicht = {
  chessops: null,
  stellung: () => null,
  legaleZuege: (fen) => ganzeZuege(entenpartieAus(fen)),
  ziehe: (fen, uci) => {
    try {
      return { fen: entenFen(spieleEntenzug(entenpartieAus(fen), uci)), san: uci };
    } catch {
      return null; // nicht erlaubt
    }
  },
  ende: (fen) => {
    const p = entenpartieAus(fen);
    if (!hatKoenig(p.stellung, p.stellung.amZug)) return ende(opposite(p.stellung.amZug), "ente");
    return entenzuege(p).length === 0 ? ende(p.stellung.amZug, "ente") : null;
  },
};
