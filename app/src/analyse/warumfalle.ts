/**
 * Warum-Kategorie W1 „Falle aus dem Buch“: Der gespielte Zug ist der Fehlzug einer Falle aus dem
 * Fallenkabinett des Kapitels 4, in genau der Stellung des Buches.
 *
 * Rolle im Gesamtbild: Letzter Teil von Schritt 3 im Konzept docs/KONZEPT_FEHLER_BUCHBEZUG.md
 * (Abschnitt 3.1, W1). Der Vergleich ist ein genauer Stellungsvergleich wie bei den
 * Buchvarianten (Figuren, Zugrecht, Rochaderechte; schach/eroeffnungsindex.ts): Jeder Fallencheck
 * nennt die Fehlzüge mit Zugnummer („5... cxb5??“) und den Stopp-Moment (eine Abbildung). Ein
 * Fehlzug gilt in der Stellung des Stopp-Moments und in jeder Stellung der Zugfolge des Buches zu
 * dieser Falle, in der er mit derselben Zugnummer und Farbe vorkommt. Andere Stellungen, die der
 * Falle nur ähneln, zählen nicht: lieber eine Falle weniger erkannt als eine falsche genannt.
 * Keine Oberfläche, keine Texte; die Anzeige steht in spiel/buchbezug.ts.
 * Abhängigkeiten: chessops, schach/eroeffnungsindex.ts (Stellungsschlüssel), spiel/zuege.ts,
 * erzeugte Typen der Kapiteldaten.
 * Buchbezug: Kapitel 4, „Fallenkabinett“, Stopp-Moment und Fallencheck.
 */
import type { Chess } from "chessops/chess";
import { makeFen } from "chessops/fen";
import { makeSan, parseSan } from "chessops/san";
import type { Color } from "chessops/types";
import type { Knoten } from "../daten/generiert/beispiel";
import type { Fallencheck, Kapitel } from "../daten/generiert/kapitel";
import { stellungsschluessel } from "../schach/eroeffnungsindex";
import { regelstellung, uciZuSan } from "../spiel/zuege";

/** Ein Fehlzug einer Falle, wie der Fallencheck ihn nennt. */
interface Fehlzugangabe {
  readonly nummer: number;
  readonly farbe: Color;
  /** Englische Kurznotation ohne Zeichen, etwa „cxb5“. */
  readonly san: string;
}

/** Was W1 über die Falle meldet. */
export interface Fallentreffer {
  readonly kennung: "W1";
  readonly details: {
    /** Name der Falle, wie im Fallencheck („Elefantenfalle“). */
    readonly falle: string;
    /** Abbildung des Stopp-Moments, etwa „4.13“, falls das Buch eine nennt. */
    readonly stopp: string | null;
    /** Der Fehlzug in englischer Kurznotation. */
    readonly zug: string;
  };
}

/** Stellungsschlüssel und Zug („…|Nxd5“) → Falle. */
export interface Fallenindex {
  readonly fehlzuege: ReadonlyMap<string, Fallentreffer["details"]>;
}

/** Deutsche Figurenbuchstaben in englische (Springer, Läufer, Turm, Dame). */
const FIGUR_EN: Readonly<Record<string, string>> = { S: "N", L: "B", T: "R", D: "Q" };
/** „5... cxb5??“ oder „6. Sxd5??“: Zugnummer, Punkte für Schwarz, Zug. */
const ZUGANGABE = /^(\d+)\.(\.\.)?\s*(\S+)$/;

/** Ein Zug aus dem Fallencheck („5... cxb5??“) als Angabe; null, wenn er nicht so geschrieben ist. */
function fehlzugAus(text: string): Fehlzugangabe | null {
  const teile = ZUGANGABE.exec(text.trim());
  const [, nummer, punkte, zug] = teile ?? [];
  if (!nummer || !zug) return null;
  const ohneZeichen = zug.replace(/[!?+#]/g, "");
  const san = ohneZeichen.replace(/[SLTD]/g, (b) => FIGUR_EN[b] ?? b);
  return { nummer: Number(nummer), farbe: punkte ? "black" : "white", san };
}

/** Die Fehlzüge eines Fallenchecks aus der Zeile „Wer tappt hinein?“. */
function fehlzuegeVon(check: Fallencheck): Fehlzugangabe[] {
  return check.wer.flatMap((teil) => {
    if (teil.art !== "zug") return [];
    const angabe = fehlzugAus(teil.text);
    return angabe ? [angabe] : [];
  });
}

/** Trägt die Fehlzüge ein, die in dieser Stellung mit Zugnummer und Farbe passen. */
function trageEin(
  ziel: Map<string, Fallentreffer["details"]>,
  pos: Chess,
  fehlzuege: readonly Fehlzugangabe[],
  check: Fallencheck,
): void {
  for (const f of fehlzuege) {
    if (f.nummer !== pos.fullmoves || f.farbe !== pos.turn) continue;
    const zug = parseSan(pos, f.san);
    if (!zug) continue;
    const san = makeSan(pos, zug);
    const schluessel = `${stellungsschluessel(makeFen(pos.toSetup()))}|${san}`;
    ziel.set(schluessel, { falle: check.name, stopp: check.stopp, zug: san });
  }
}

/** Läuft den Variantenbaum eines Beispiels ab und ruft für jede Stellung vor einem Zug `besuche`. */
function laufe(knoten: readonly Knoten[], pos: Chess, besuche: (pos: Chess) => void): void {
  besuche(pos);
  for (const k of knoten) {
    const zug = parseSan(pos, k.zug);
    if (!zug) continue;
    const danach = pos.clone();
    danach.play(zug);
    laufe(k.weiter, danach, besuche);
  }
}

/**
 * Baut den Fallenindex aus den Fallenchecks eines Kapitels (Kapitel 4).
 *
 * Eingaben: Kapiteldaten mit Fallenchecks, Abbildungen und Beispielen. Ausgabe: der Index.
 * Beispiel: Elefantenfalle, Stopp-Moment Abb. 4.13, Fehlzug „6. Sxd5??“ → Schlüssel der
 * Stellung 4.13 mit „Nxd5“.
 * Sonderfall: Ein Fallencheck ohne Stopp-Moment trägt nur die Züge seiner Zugfolge ein, findet er
 * keine, gar nichts.
 */
export function baueFallenindex(
  kapitel: Pick<Kapitel, "fallenchecks" | "abbildungen" | "beispiele">,
): Fallenindex {
  const fehlzuege = new Map<string, Fallentreffer["details"]>();
  for (const check of kapitel.fallenchecks) {
    const angaben = fehlzuegeVon(check);
    const bild = kapitel.abbildungen.find((a) => a.id === check.stopp);
    const stopp = bild ? regelstellung(bild.fen) : null;
    if (stopp) trageEin(fehlzuege, stopp, angaben, check);
    const beispiel = kapitel.beispiele.find((b) => b.id === bild?.beispiel?.id);
    const start = beispiel ? regelstellung(beispiel.startFen) : null;
    if (beispiel && start)
      laufe(beispiel.zuege, start, (pos) => trageEin(fehlzuege, pos, angaben, check));
  }
  return { fehlzuege };
}

/**
 * W1 Falle aus dem Buch: Ist der gespielte Zug in dieser Stellung der Fehlzug einer Falle?
 *
 * Eingaben: Stellung vor dem Zug (FEN), gespielter Zug (UCI), Fallenindex.
 * Ausgabe: W1 mit Name der Falle, Stopp-Moment und Zug, sonst null.
 * Regel: Kapitel 4, Fallenkabinett („Stopp-Moment“).
 * Beispiel: Abb. 4.13, 6. Sxd5?? („c3d5“) → Elefantenfalle, Stopp-Moment 4.13.
 * Sonderfälle: Zugzähler zählen nicht (wie bei den Buchvarianten); unmöglicher Zug → null.
 */
export function warumFalle(
  fenVorher: string,
  gespielterZugUci: string,
  index: Fallenindex,
): Fallentreffer | null {
  const san = uciZuSan(fenVorher, gespielterZugUci);
  if (!san) return null;
  const details = index.fehlzuege.get(`${stellungsschluessel(fenVorher)}|${san}`);
  return details ? { kennung: "W1", details } : null;
}
