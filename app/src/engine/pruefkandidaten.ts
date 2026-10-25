/**
 * Prüfkandidaten für drei Fehlerarten, die die Werkzeuge ohne Engine nicht erkennen (Plan C,
 * Freigabe des Autors 25.10.2026): Bauernzug ohne Not, Königszug ohne Not, Bauer eingestellt.
 *
 * Rolle im Gesamtbild: Die menschliche Zugwahl (engine/menschenwahl.ts) lässt typische Fehlerzüge
 * gezielt von der Engine bewerten, denn grobe Fehler fehlen unter ihren sechs besten Zügen. Die
 * typischen Fehlerzüge kommen aus den Werkzeugen (engine/fehlersuche.ts); diese drei Arten
 * brauchen aber Verlust und Antwort der Engine (engine/fehlerart-neu.ts) und kamen deshalb nie in
 * den Kandidatenpool, obwohl Menschen sie oft spielen (Bauernzug ohne Not etwa 4 % der Züge bei
 * 400). Hier entstehen Züge, die eine Gelegenheit zu diesen Arten sind; ob sie wirklich ein
 * Fehler sind, entscheidet danach die Engine (Verlust ab einem halben Bauern) wie bei allen.
 * Regeln: Kapitel 8 (Bauern gehen nicht zurück), Kapitel 11 (König vor dem Endspiel in
 * Sicherheit), Kapitel 1 (Zählen von Angreifern und Verteidigern).
 * Abhängigkeiten: engine/fehlerart.ts (Lage, alle Züge), engine/zugprobe.ts, schach/abtausch.ts.
 */
import type { Chess } from "chessops/chess";
import { abtausch } from "../schach/abtausch";
import { alleZuege, type Fehlerart, type Lage } from "./fehlerart";
import { probe, type Zugprobe } from "./zugprobe";

/** Die Arten mit eigenem Erzeuger. */
export const GEZIELTE_ARTEN = [
  "bauernzugOhneNot",
  "koenigszugOhneNot",
  "bauerEingestellt",
] as const;
export type GezielteArt = (typeof GEZIELTE_ARTEN)[number];

/** Höchstens so viele Prüfzüge je Art (wie bei den übrigen Arten, engine/menschenwahl.ts). */
const JE_ART = 2;
const LINIEN = 8;
const MITTE = 3.5;
/** Ein Bauer gilt als eingestellt, wenn der Abtausch auf seinem Feld den Gegner ihn gewinnen lässt. */
const BAUERNWERT = 1;
const ROCHADE_LINIEN = 2;

/** Ruhiger Zug: kein Schlag, kein Schach danach, keine Umwandlung. */
function ruhig(p: Zugprobe): boolean {
  return p.geschlagen === null && !p.danach.isCheck() && p.zug.promotion === undefined;
}

/** Abstand der Linie von der Mitte: Randbauern (a3, h3, g4) zuerst, wie Menschen sie „ohne Not“ ziehen. */
function randnaehe(p: Zugprobe): number {
  return Math.abs((p.zug.from % LINIEN) - MITTE);
}

/** Eigene Bauern, die der Gegner mit Gewinn schlagen kann (Kapitel 1, Abtausch). */
function bauernInGefahr(stellung: Chess, farbe: "white" | "black"): number {
  let anzahl = 0;
  for (const feld of stellung.board.pieces(farbe, "pawn")) {
    const bilanz = abtausch(stellung.board, feld)?.bilanz ?? 0;
    if (bilanz >= BAUERNWERT) anzahl += 1;
  }
  return anzahl;
}

function istRochade(lage: Lage, p: Zugprobe): boolean {
  const linien = Math.abs((p.zug.to % LINIEN) - (p.zug.from % LINIEN));
  return linien >= ROCHADE_LINIEN || lage.regeln.board.get(p.zug.to)?.role === "rook";
}

/**
 * Die Prüfzüge je Art für eine Stellung: ruhige Bauernzüge (Randbauern zuerst), ruhige
 * Königszüge ohne Rochade vor dem Endspiel, Züge, nach denen ein eigener Bauer mehr hängt als
 * vorher. Je Art höchstens zwei, ohne die schon bekannten Kandidaten.
 * Eingaben: Lage, aktive Arten, schon bewertete Züge. Ausgabe: Züge (UCI), ohne Doppelte.
 * Beispiel: Grundstellung nach 1. e4 e5 2. Sf3 Sc6 (Weiß am Zug) → für den Bauernzug a2a3 und
 * h2h3, für den Königszug e1e2.
 * Sonderfall: im Schach keine (der Zug ist dann nie „ohne Not“).
 */
export function gezielteKandidaten(
  lage: Lage,
  aktiv: ReadonlySet<Fehlerart>,
  schon: ReadonlySet<string>,
): string[] {
  if (lage.regeln.isCheck()) return [];
  const farbe = lage.regeln.turn;
  const proben = alleZuege(lage).flatMap((uci) => {
    const p = schon.has(uci) ? null : probe(lage.regeln, uci);
    return p ? [{ uci, p }] : [];
  });
  const vorher = bauernInGefahr(lage.regeln, farbe);
  const je: Record<GezielteArt, string[]> = {
    bauernzugOhneNot: aktiv.has("bauernzugOhneNot")
      ? proben
          .filter(({ p }) => p.figur.role === "pawn" && ruhig(p))
          .sort((a, b) => randnaehe(b.p) - randnaehe(a.p) || a.uci.localeCompare(b.uci))
          .map((k) => k.uci)
      : [],
    koenigszugOhneNot:
      aktiv.has("koenigszugOhneNot") && lage.phase !== "endspiel"
        ? proben
            .filter(({ p }) => p.figur.role === "king" && ruhig(p) && !istRochade(lage, p))
            .map((k) => k.uci)
        : [],
    bauerEingestellt: aktiv.has("bauerEingestellt")
      ? proben.filter(({ p }) => bauernInGefahr(p.danach, farbe) > vorher).map((k) => k.uci)
      : [],
  };
  return [...new Set(GEZIELTE_ARTEN.flatMap((art) => je[art].slice(0, JE_ART)))];
}
