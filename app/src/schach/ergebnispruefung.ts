/**
 * Halten die Oppositionszüge das Ergebnis? Und wenn keiner hält: Was entscheidet stattdessen?
 *
 * Rolle im Gesamtbild: Baustein für k8-opposition und k8-regeln (Regel 2). Entscheidung des
 * Autors vom 16.10.2026 zu C1.19: „Die App nennt nur Oppositionszüge, die das Ergebnis halten;
 * gibt es keinen, sagt sie: Hier entscheidet nicht die Opposition, sondern …“.
 * Abhängigkeiten: chessops, kpk.ts, opposition.ts, quadrat.ts, drohungen.ts (Züge, Nullzug).
 * Buchbezug: Kapitel 8, „Die Opposition“ (Abb. 8.20, 8.23, 8.24, 8.28, 8.30), „Patt am Rand“
 * (Abb. 8.31), „Die Regel des Quadrats“ (Abb. 8.36) und „Reserve-Tempo“ (Abb. 8.53).
 *
 * Zwei Prüfarten:
 * - exakt: König und Bauer gegen König, mit der Endspieldatenbank (kpk.ts). Die Bauernseite hält
 *   das Ergebnis, wenn der Zug gewinnt; der Verteidiger, wenn der Zug remis hält.
 * - bauernverlust: reines Bauernendspiel mit mehr Bauern. Ein Oppositionszug hält nicht, wenn der
 *   gegnerische König danach einen Bauern schlagen kann, den er vorher nicht schlagen konnte
 *   (Abb. 8.53: „Wer mit dem König ziehen muss, verliert seinen Bauern“).
 */
import type { Chess } from "chessops/chess";
import { makeSan } from "chessops/san";
import type { Color, NormalMove, Role, Square } from "chessops/types";
import { eigeneReihe } from "./bauernprofil";
import { legaleZuege, nullzug } from "./drohungen";
import { istKpk, kpkErgebnis, type KpkErgebnis } from "./kpk";
import { oppositionszuege, type Oppositionszug } from "./opposition";
import { quadrat } from "./quadrat";
import { gegner, type Stellung } from "./stellung";

/** Wie geprüft wurde: exakt (Datenbank) oder nach der Regel „gibt keinen Bauern auf“. */
export type Pruefart = "exakt" | "bauernverlust";

/** Was statt der Opposition entscheidet (Kapitel 8). */
export type Grund =
  | "patt"
  | "quadrat"
  | "bauernzug"
  | "reservetempo"
  | "koenigszug"
  | "remis"
  | "verloren"
  | "bauernverlust";

/** Ein Zug, der statt der Opposition das Ergebnis hält (oder beim Patt: der Pattzug). */
export interface Stattzug {
  readonly zug: NormalMove;
  readonly san: string;
}

/** Ergebnis der Prüfung. */
export interface Oppositionspruefung {
  /** null: keine Prüfung (Figuren außer Königen und Bauern am Brett). */
  readonly art: Pruefart | null;
  /** Die Oppositionszüge, die das Ergebnis halten (ohne Prüfung: alle). */
  readonly haltende: readonly Oppositionszug[];
  /** Gesetzt, wenn es Oppositionszüge gibt, aber keiner das Ergebnis hält. */
  readonly grund: Grund | null;
  /** Die Züge, die stattdessen entscheiden (Quadrat, Bauernzug, Reserve-Tempo, Patt). */
  readonly stattdessen: readonly Stattzug[];
}

/** Umwandlungsfiguren, die gegen den nackten König gewinnen können. */
const UMWANDLUNGEN: readonly Role[] = ["queen", "rook"];
const LETZTE_REIHE = 7;

/** Alle legalen Züge, Umwandlungen in Dame und Turm. */
function alleZuege(regeln: Chess): NormalMove[] {
  return legaleZuege(regeln).flatMap((zug) => {
    const figur = regeln.board.get(zug.from);
    const umwandlung = figur?.role === "pawn" && eigeneReihe(zug.to, figur.color) === LETZTE_REIHE;
    return umwandlung ? UMWANDLUNGEN.map((promotion) => ({ ...zug, promotion })) : [zug];
  });
}

/**
 * Das Ergebnis nach einem Zug aus Sicht der Bauernseite (König und Bauer gegen König).
 *
 * Nach einer Umwandlung gewinnt die neue Dame oder der Turm, wenn der König sie nicht schlagen
 * kann und kein Patt entsteht; schlägt der König den Bauern, bleibt König gegen König (remis).
 */
function ergebnisNach(regeln: Chess, zug: NormalMove): KpkErgebnis {
  const danach = regeln.clone();
  danach.play(zug);
  if (danach.isStalemate()) return "remis";
  if (danach.isCheckmate()) return "gewinn";
  const tabelle = kpkErgebnis(danach.board, danach.turn);
  if (tabelle !== null) return tabelle;
  if (zug.promotion === undefined) return "remis";
  const schlaegt = legaleZuege(danach).some((antwort) => antwort.to === zug.to);
  return schlaegt ? "remis" : "gewinn";
}

/** Hat eine Farbe den Bauern (König und Bauer gegen König)? */
function bauernseite(stellung: Stellung): Color | null {
  const bauer = stellung.brett.pawn.first();
  return bauer === undefined ? null : (stellung.brett.get(bauer)?.color ?? null);
}

/** Die Züge, die stattdessen halten, sortiert: zuerst die zum Umwandlungsfeld hin. */
function sortiertNachVorn(zuege: Stattzug[], farbe: Color): Stattzug[] {
  return [...zuege].sort((a, b) => eigeneReihe(b.zug.to, farbe) - eigeneReihe(a.zug.to, farbe));
}

/** Warum keiner der Oppositionszüge hält (exakte Prüfung). */
function grundExakt(
  stellung: Stellung,
  regeln: Chess,
  halten: readonly Stattzug[],
  bauernfarbe: Color,
): { grund: Grund; stattdessen: Stattzug[] } {
  const angreifer = stellung.amZug === bauernfarbe;
  if (halten.length === 0) {
    const patt = alleZuege(regeln)
      .filter((zug) => {
        const danach = regeln.clone();
        danach.play(zug);
        return danach.isStalemate();
      })
      .map((zug) => ({ zug, san: makeSan(regeln, zug) }));
    if (patt.length > 0) return { grund: "patt", stattdessen: patt };
    return { grund: angreifer ? "remis" : "verloren", stattdessen: [] };
  }
  const geordnet = sortiertNachVorn([...halten], bauernfarbe);
  const bauer = stellung.brett.pawn.first();
  const q = bauer === undefined ? null : quadrat(stellung, bauer);
  if (halten.every((z) => regeln.board.get(z.zug.from)?.role === "pawn")) {
    // Abb. 8.35: Der König erreicht das Quadrat nicht, der Bauer läuft allein (Quadrat).
    return { grund: q?.haeltAuf === false ? "quadrat" : "bauernzug", stattdessen: geordnet };
  }
  const felder = q?.felder ?? [];
  const insQuadrat = halten.every(
    (z) => regeln.board.get(z.zug.from)?.role === "king" && felder.includes(z.zug.to),
  );
  return { grund: !angreifer && insQuadrat ? "quadrat" : "koenigszug", stattdessen: geordnet };
}

/** Exakte Prüfung mit der Datenbank. */
function exakt(stellung: Stellung, regeln: Chess, zuege: Oppositionszug[]): Oppositionspruefung {
  const bauernfarbe = bauernseite(stellung) ?? stellung.amZug;
  const ziel: KpkErgebnis = stellung.amZug === bauernfarbe ? "gewinn" : "remis";
  const haltende = zuege.filter((z) => ergebnisNach(regeln, z.zug) === ziel);
  if (haltende.length > 0 || zuege.length === 0) {
    return { art: "exakt", haltende, grund: null, stattdessen: [] };
  }
  const halten = alleZuege(regeln)
    .filter((zug) => ergebnisNach(regeln, zug) === ziel)
    .map((zug) => ({ zug, san: makeSan(regeln, zug) }));
  return { art: "exakt", haltende, ...grundExakt(stellung, regeln, halten, bauernfarbe) };
}

/** Die Bauern von `farbe`, die der König am Zug (der Gegner von `farbe`) legal schlagen kann. */
function schlagbareBauern(regeln: Chess, farbe: Color): Set<Square> {
  const koenig = regeln.board.kingOf(gegner(farbe));
  const bauern = regeln.board.pieces(farbe, "pawn");
  if (koenig === undefined) return new Set();
  return new Set([...regeln.dests(koenig)].filter((feld) => bauern.has(feld)));
}

/** Gibt der Zug der Seite am Zug einen Bauern auf (neu schlagbar für den gegnerischen König)? */
function gibtBauernAuf(regeln: Chess, zug: NormalMove): boolean {
  const farbe = regeln.turn;
  const vorher = schlagbareBauern(nullzug(regeln, gegner(farbe)), farbe);
  const danach = regeln.clone();
  danach.play(zug);
  return [...schlagbareBauern(danach, farbe)].some((feld) => !vorher.has(feld));
}

/**
 * Reserve-Tempo: ein Bauernzug, der keinen Bauern aufgibt und nach dem der Gegner nur noch mit
 * dem König ziehen kann, wobei jeder Königszug einen seiner Bauern aufgibt (Abb. 8.53: 1. h4!).
 */
function reservetempo(regeln: Chess): Stattzug[] {
  return legaleZuege(regeln)
    .filter((zug) => regeln.board.get(zug.from)?.role === "pawn" && !gibtBauernAuf(regeln, zug))
    .filter((zug) => {
      const danach = regeln.clone();
      danach.play(zug);
      const antworten = legaleZuege(danach);
      return (
        antworten.length > 0 &&
        antworten.every(
          (a) => danach.board.get(a.from)?.role === "king" && gibtBauernAuf(danach, a),
        )
      );
    })
    .map((zug) => ({ zug, san: makeSan(regeln, zug) }));
}

/** Regelprüfung im Bauernendspiel mit mehr Bauern. */
function nachRegel(regeln: Chess, zuege: Oppositionszug[]): Oppositionspruefung {
  const haltende = zuege.filter((z) => !gibtBauernAuf(regeln, z.zug));
  if (haltende.length > 0 || zuege.length === 0) {
    return { art: "bauernverlust", haltende, grund: null, stattdessen: [] };
  }
  const tempo = reservetempo(regeln);
  return {
    art: "bauernverlust",
    haltende,
    grund: tempo.length > 0 ? "reservetempo" : "bauernverlust",
    stattdessen: tempo,
  };
}

/**
 * Prüft die Oppositionszüge der Seite am Zug.
 *
 * Warum: „Nur der Zug, der die Opposition nimmt, gewinnt“ gilt nicht immer; in Abb. 8.20 hält
 * nur Ke5 (Kg5 nimmt auch die Opposition, aber nur remis), in Abb. 8.36 entscheidet das Quadrat.
 * Eingaben: Stellung. Ausgabe: haltende Oppositionszüge, sonst der Grund und die Züge, die
 * stattdessen entscheiden.
 * Beispiele: Abb. 8.23 → nur Kf3 (Kf1 nur remis). Abb. 8.31 → Patt (Ka6). Abb. 8.36 → Quadrat
 * (Kf6, Kf5, Kf4). Abb. 8.53 → Reserve-Tempo (h4).
 * Sonderfall: Mit Figuren außer Königen und Bauern prüft die App nicht (art null, alle Züge).
 */
export function pruefeOpposition(stellung: Stellung): Oppositionspruefung {
  const zuege = oppositionszuege(stellung);
  const { regeln, brett } = stellung;
  if (regeln && istKpk(brett)) return exakt(stellung, regeln, zuege);
  const nurBauern = brett.occupied.diff(brett.king).diff(brett.pawn).isEmpty();
  if (regeln && nurBauern && brett.pawn.nonEmpty()) return nachRegel(regeln, zuege);
  return { art: null, haltende: zuege, grund: null, stattdessen: [] };
}
