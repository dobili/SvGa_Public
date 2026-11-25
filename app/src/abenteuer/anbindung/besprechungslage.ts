/**
 * Spielphase und Lage vor dem Zug, und was ein brillanter oder starker Zug hergibt (Wunsch des
 * Autors, 26.11.2026; Entwurf docs/spiel/auftraege/partiebesprechung_25-11.md, Abschnitt 11,
 * Punkte 3 und 4): „Dabei standest du im Endspiel gut da.“, „Du gibst den Turm her, und es lohnt
 * sich.“
 *
 * Rolle im Gesamtbild: reine Rechnung für anbindung/besprechungsdaten.ts. Die Phase kommt aus der
 * Lage der App (engine/fehlerart.ts, lageVon; Kapitel 8), die Lage aus dem gespeicherten Wert vor
 * dem Zug (aus Sicht des Helden), das Opfer aus der Abtauschrechnung (engine/opfer.ts, wie die
 * Zugklasse „brillant“). Nur sichere Aussagen: zwischen den Schwellen der Lage gibt es keinen Satz.
 * Regel: Kapitel 1 (Wert der Figuren, Abtausch), Kapitel 8 (Phasen).
 * Abhängigkeiten: engine/fehlerart.ts (lageVon), engine/opfer.ts, engine/zugprobe.ts,
 * spiel/zuege.ts, schach/phase.ts (Typ).
 */
import type { Role } from "chessops/types";
import { lageVon } from "../../engine/fehlerart";
import { OPFER_ALT_VERLORENE, opferwert, verloreneNach } from "../../engine/opfer";
import { probe } from "../../engine/zugprobe";
import type { Phase } from "../../schach/phase";
import { sanZuUci } from "../../spiel/zuege";
import type { Besprechungsmoment } from "../regeln/besprechungsmomente";
import type { Motivgrundlage } from "./besprechungsmotiv";

/** Die Lage des Helden vor dem Zug. */
export type Lagewort = "gut" | "gleich" | "schlecht";

/** Phase und Lage vor dem Zug. */
export interface Lagebefund {
  readonly lage: Lagewort;
  readonly phase: Phase;
}

/** Ab so vielen Bauern Vorteil (Sicht des Helden) stand er klar besser oder schlechter. */
const KLAR_AB = 2;
/** Bis zu so vielen Bauern gilt die Stellung als ausgeglichen. */
const GLEICH_BIS = 0.6;
/** Ab diesem Abtauschgewinn des Gegners gibt der Zug eine Figur her (wie spiel/auswertung.ts). */
const OPFER_AB = 2;

/** Kategorien mit einem Satz zur Lage (Fehler des Helden). */
const MIT_LAGE: ReadonlySet<string> = new Set(["fehler", "patzer"]);
/** Kategorien mit einem Lob, das ein Opfer nennen kann. */
const MIT_OPFER: ReadonlySet<string> = new Set(["brillant", "stark"]);

/** Das Lagewort zu einem Wert aus Sicht des Helden, oder null zwischen den Schwellen. */
function lagewort(wert: number): Lagewort | null {
  if (wert >= KLAR_AB) return "gut";
  if (wert <= -KLAR_AB) return "schlecht";
  return Math.abs(wert) <= GLEICH_BIS ? "gleich" : null;
}

/**
 * Phase und Lage vor dem Fehler des Helden, oder null.
 * Eingaben: Grundlage (mit Werten je Stellung aus Sicht von Weiß), Moment.
 * Beispiel: Endspiel, Wert vor dem Zug +2,5 für Weiß, der Held ist Weiß → { gut, endspiel }.
 * Sonderfälle: kein Wert, Lage zwischen den Schwellen oder keine Fehlerkategorie → null.
 */
export function lageVor(g: Motivgrundlage, moment: Besprechungsmoment): Lagebefund | null {
  if (!MIT_LAGE.has(moment.kategorie)) return null;
  const fen = g.fens[moment.index] ?? "";
  const lage = lageVon(fen);
  const wert = g.werte?.[moment.index];
  if (!lage || wert === undefined) return null;
  const sicht = lage.regeln.turn === "white" ? wert : -wert;
  const wort = lagewort(sicht);
  return wort ? { lage: wort, phase: lage.phase } : null;
}

/**
 * Die Figur, die ein brillanter oder starker Zug hergibt, oder null.
 * Beispiel: Abb. 7.14, 2. Th8+ gibt den Turm → "rook". Ohne Opfer (gewöhnlicher starker Zug) → null.
 * Sonderfall: Die gezogene Figur zählt zuerst; sonst die Figur, die der Gegner am meisten gewinnt.
 */
export function opferVon(g: Motivgrundlage, moment: Besprechungsmoment): Role | null {
  if (!MIT_OPFER.has(moment.kategorie)) return null;
  const fen = g.fens[moment.index] ?? "";
  const lage = lageVon(fen);
  const uci = sanZuUci(fen, g.sans[moment.index] ?? "");
  if (!lage || !uci || opferwert(lage, uci) < OPFER_AB) return null;
  const p = probe(lage.regeln, uci);
  if (!p) return null;
  const verlorene = verloreneNach(lage, p, true, OPFER_ALT_VERLORENE);
  const gezogen = verlorene.find((v) => v.feld === p.zug.to);
  const groesste = [...verlorene].sort((a, b) => b.wert - a.wert)[0];
  const feld = (gezogen ?? groesste)?.feld;
  return feld === undefined ? null : (p.danach.board.get(feld)?.role ?? null);
}
