/**
 * Opfererkennung: Welche eigene Figur ein Zug laut Abtauschrechnung hergibt. Grundlage der
 * Zugklasse „brillant“ (spiel/auswertung.ts) und von „Figur hängen lassen“ (W1, engine/fehlerart.ts).
 *
 * Rolle im Gesamtbild: chess.com nennt einen Zug brillant, wenn er gut ist und eine Figur opfert.
 * Hier steht, was „opfert“ heißt: Nach dem Zug gewinnt der Gegner laut Abtauschrechnung (Kapitel 1)
 * auf dem Feld einer eigenen Figur ab Leichtfigur mindestens zwei Bauern, und er kann sie wirklich
 * nehmen (seit 0.2.59 wie bei chess.com: Es gibt einen legalen Schlag auf das Feld, also keinen an
 * den König gefesselten Angreifer und kein Schach, das vorgeht). Was der Zug selbst schlägt, wird
 * abgezogen (ein Abtausch ist kein Opfer). Geprüft an 100 Brillant-Zügen von chess.com
 * (Chessigma-Vergleich, Datei nur lokal; Messlauf spiel/opfer.messung.ts; Entscheidung „Brillant am
 * Prüfstand von chess.com“ in docs/ENTSCHEIDUNGEN.md).
 * Abhängigkeiten: chessops, schach/abtausch.ts, schach/stellung.ts (Figurenwerte),
 * engine/zugprobe.ts; aus engine/fehlerart-typen.ts nur der Typ Lage.
 */
import type { Chess } from "chessops/chess";
import type { Square } from "chessops/types";
import { opposite } from "chessops/util";
import { abtausch } from "../schach/abtausch";
import { FIGURENWERT } from "../schach/stellung";
import type { Lage } from "./fehlerart-typen";
import { probe, type Zugprobe } from "./zugprobe";

/** Faustwert aus Kapitel 1: Figuren unter einer Leichtfigur (Bauern) zählen nicht als Opfer. */
const LEICHTFIGUR = 3;
/** Ab diesem Abtauschergebnis des Gegners gilt eine Figur als verloren (mehr als ein Bauer). */
const VERLOREN_AB = 2;

/**
 * Welche schon vor dem Zug verlorenen Figuren trotzdem zählen: „keine“ (nur, was erst durch den
 * Zug verloren geht), „gezogene“ (dazu die gezogene Figur: Dxc6+ mit einer angegriffenen Dame
 * bleibt ein Opfer, ein Königszug neben einer längst hängenden Dame nicht) oder „alle“ (auch eine
 * angegriffene Figur, die der Zug stehen lässt).
 */
export type AltVerlorene = "keine" | "gezogene" | "alle";

/**
 * Die Fassung der App für den Opferwert, am Prüfstand von chess.com gewählt (0.2.59, Rückfrage
 * S19: lieber ein verpasstes „!!“ als ein grundloses). Messung mit der Nehmbarkeitsprüfung:
 * „keine“ 50 von 100 Brillanten bei 20 Fehlalarmen, „gezogene“ 59 bei 19, „alle“ 81 bei 59.
 */
export const OPFER_ALT_VERLORENE: AltVerlorene = "gezogene";

/** Eine Figur, die der Gegner laut Abtauschrechnung gewinnt, mit seinem Gewinn in Bauerneinheiten. */
export interface Verlorene {
  readonly feld: Square;
  readonly wert: number;
}

function zaehltAltVerlorene(gezogene: boolean, fassung: AltVerlorene): boolean {
  return fassung === "alle" || (fassung === "gezogene" && gezogene);
}

/**
 * Alle eigenen Figuren (ab Leichtfigur), die nach dem Zug laut Abtauschrechnung verloren sind.
 *
 * Regel: Kapitel 4, W1, mit der Abtauschrechnung aus Kapitel 1 (Fesselungen bleiben wie im Buch
 * unberücksichtigt). Gibt der Zug Schach, zählt nichts, außer der Aufrufer will es (`mitSchach`;
 * für W1 muss der Gegner erst das Schach beantworten, für ein Opfer wie 16. Db8+!! in der
 * Opernpartie zählt die Dame trotzdem). Eine schon vorher verlorene Figur zählt je `altVerlorene`.
 * Beispiel: Abb. 1.13, 2. Dh5 Sc6 3. Dxe5+?? → Dame auf e5, Gewinn 9 − 0 (Sxe5 ohne Rückschlag).
 */
export function verloreneNach(
  lage: Lage,
  p: Zugprobe,
  mitSchach: boolean,
  altVerlorene: AltVerlorene,
): Verlorene[] {
  if (!mitSchach && p.danach.isCheck()) return [];
  const eigen = opposite(p.danach.turn);
  const gefunden: Verlorene[] = [];
  for (const feld of p.danach.board[eigen]) {
    const figur = p.danach.board.get(feld);
    if (!figur || figur.role === "king" || FIGURENWERT[figur.role] < LEICHTFIGUR) continue;
    const jetzt = abtausch(p.danach.board, feld);
    if (!jetzt || jetzt.bilanz < VERLOREN_AB) continue;
    const gezogene = feld === p.zug.to;
    const vorher = abtausch(lage.regeln.board, gezogene ? p.zug.from : feld);
    const altVerloren = vorher !== null && vorher.bilanz >= VERLOREN_AB;
    if (altVerloren && !zaehltAltVerlorene(gezogene, altVerlorene)) continue;
    gefunden.push({ feld, wert: jetzt.bilanz });
  }
  return gefunden;
}

/**
 * Die Figur, die erst durch den Zug verloren geht, mit dem größten Gewinn des Gegners; Wert 0 ohne
 * Feld, wenn keine. Für „Figur hängen lassen“ (W1): ohne Schachgebote, ohne schon verlorene Figuren.
 * Beispiel: Mittelspiel, 11. Sxd5?? mit exd5 → Springer d5, Gewinn 3 − 1.
 */
export function neuVerlorene(lage: Lage, p: Zugprobe): { wert: number; feld: Square | null } {
  let groesste: { wert: number; feld: Square | null } = { wert: 0, feld: null };
  for (const v of verloreneNach(lage, p, false, "keine")) {
    if (v.wert > groesste.wert) groesste = v;
  }
  return groesste;
}

/**
 * Kann der Gegner die Figur auf dem Feld wirklich nehmen? Regel wie bei chess.com (0.2.59): Es
 * gibt einen legalen Schlag auf das Feld. Das schließt einen an den eigenen König gefesselten
 * Angreifer aus und ebenso eine Figur, die stehen bleibt, während der Gegner ein Schach beantworten
 * muss, das nicht von ihr ausgeht. Beispiel: 16. Db8+ in der Opernpartie, Sxb8 ist legal → ja.
 */
function annehmbar(danach: Chess, feld: Square): boolean {
  for (const ziele of danach.allDests().values()) {
    if (ziele.has(feld)) return true;
  }
  return false;
}

/**
 * Was der Zug laut Abtauschrechnung hergibt: der größte Gewinn des Gegners an einer eigenen Figur
 * ab Leichtfigur, die er wirklich nehmen kann, abzüglich dessen, was der Zug selbst schlägt; 0,
 * wenn nichts. Für die Zugklasse „brillant“ im Rückblick (0.2.40; Grenze OPFER_AB in
 * spiel/auswertung.ts).
 * Beispiel: Abb. 7.14, 2. Th8+ gibt den Turm → 5; 10. Sxb5 in der Opernpartie (Springer für zwei
 * Bauern: cxb5, dann Lxb5) → 1. Sonderfälle: Ein Abtausch ist kein Opfer (0.2.51: Lxg5 gegen einen
 * Springer, danach Lxg5 → 3 − 3 = 0); eine Figur, die nur ein gefesselter Angreifer „schlagen“
 * könnte, ist kein Opfer (0.2.59). `altVerlorene` nur für den Messlauf; die App nimmt die Fassung
 * OPFER_ALT_VERLORENE.
 */
export function opferwert(
  lage: Lage,
  uci: string,
  altVerlorene: AltVerlorene = OPFER_ALT_VERLORENE,
): number {
  const p = probe(lage.regeln, uci);
  if (!p) return 0;
  const geschlagen = p.geschlagen === null ? 0 : FIGURENWERT[p.geschlagen];
  let groesster = 0;
  for (const v of verloreneNach(lage, p, true, altVerlorene)) {
    if (v.wert > groesster && annehmbar(p.danach, v.feld)) groesster = v.wert;
  }
  return Math.max(0, groesster - geschlagen);
}
