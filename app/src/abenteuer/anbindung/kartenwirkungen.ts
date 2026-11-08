/**
 * Wirkungen der Werkzeug- und Engine-Karten in der Partie (docs/spiel/11, K1 bis K6): ein Werkzeug
 * des Buches auf die aktuelle Stellung, „Was droht?“, „Waage“ und „Remisangebot“.
 *
 * Rolle im Gesamtbild: Hilfe der Kartenleiste (anbindung/KartenleisteAnzeige.tsx), App-Seite der
 * Modulgrenze (nutzt Analyse und Engine der App). Jede Karte nutzt ein vorhandenes Werkzeug, damit
 * sie lehrt, was ein guter Spieler sich selbst fragt (Grundsatz G2 in docs/spiel/11).
 * Abhängigkeiten: analyse/register.ts, analyse/einschaetzung.ts, engine/engineDienst.ts,
 * schach/stellung.ts, spiel/zuege.ts, spiel/ablauf.ts, texte/texte.ts.
 */
import { makeSquare } from "chessops/util";
import type { Color } from "chessops/types";
import { AUSGEGLICHEN_BIS, einschaetzungDerEngine } from "../../analyse/einschaetzung";
import { wende } from "../../analyse/register";
import type { Markierung } from "../../analyse/werkzeug";
import { engine } from "../../engine/engineDienst";
import { wertFuer } from "../../engine/fallenurteil";
import { stellungAusFen, type Stellung } from "../../schach/stellung";
import { pausiere } from "../../spiel/ablauf";
import type { Partie } from "../../spiel/partie";
import { uciZuSan } from "../../spiel/zuege";
import { tSpiel } from "../texte/texte";

/** Rechenzeit für Drohung, Waage und Remis (wie der Fingerzeig, R23). */
const RECHENZEIT_MS = 1500;
/** Das Zählwerkzeug braucht ein Feld; die übrigen Werkzeugkarten nur die Stellung. */
const ZAEHLWERKZEUG = "k1-zaehlen";

/** Was eine Karte zeigt: Markierungen am Brett und ein Satz für die Sprechblase. */
export interface Kartenanzeige {
  readonly markierungen: readonly Markierung[];
  readonly text: string;
}

const NICHTS: Kartenanzeige = { markierungen: [], text: "" };

/**
 * Ein Werkzeug des Buches auf die Stellung, aus Sicht des Lesers.
 * Beispiel: Bauernkompass (k5-bauern) → Markierungen der schwachen Bauern und das Fazit des Werkzeugs.
 * Sonderfall: Abzählen wählt das heißeste Feld selbst (waehleZaehlfeld).
 */
export function werkzeugkarte(fen: string, werkzeug: string, eigene: Color): Kartenanzeige {
  const gelesen = stellungAusFen(fen);
  if (!gelesen.ok) return NICHTS;
  const stellung = gelesen.wert;
  const feld = werkzeug === ZAEHLWERKZEUG ? waehleZaehlfeld(stellung, eigene) : undefined;
  const ergebnis = wende(werkzeug, { stellung, perspektive: eigene, ...(feld ? { feld } : {}) });
  // Ohne Ergebnis (Abzählen ohne angegriffene Figur) sagt die Karte ehrlich, dass nichts ist.
  if (!ergebnis) return { markierungen: [], text: tSpiel("karte.werkzeug.nichts") };
  const text = ergebnis.fazit || tSpiel("karte.werkzeug.nichts");
  return { markierungen: ergebnis.markierungen, text };
}

/**
 * Das Feld für „Abzählen“: die eigene Figur mit dem größten Überhang an Angreifern; greift der
 * Gegner nichts an, das Zielfeld seines letzten Zuges nicht bekannt, dann null.
 * Regel: Kapitel 1, Zählen von Angreifern und Verteidigern.
 */
export function waehleZaehlfeld(stellung: Stellung, eigene: Color): string | null {
  let bestes: { feld: string; ueberhang: number } | null = null;
  for (const feld of stellung.brett[eigene]) {
    const name = makeSquare(feld);
    const ergebnis = wende(ZAEHLWERKZEUG, { stellung, perspektive: eigene, feld: name });
    if (!ergebnis) continue;
    const rot = ergebnis.markierungen.filter((m) => m.typ === "pfeil" && m.farbe === "rot").length;
    const gold = ergebnis.markierungen.filter(
      (m) => m.typ === "pfeil" && m.farbe === "gold",
    ).length;
    if (rot === 0) continue;
    const ueberhang = rot - gold;
    if (!bestes || ueberhang > bestes.ueberhang) bestes = { feld: name, ueberhang };
  }
  return bestes?.feld ?? null;
}

/**
 * Die Stellung mit dem Gegner am Zug (Nullzug), ohne en passant. Null, wenn die Seite am Zug im
 * Schach steht (dann gibt es keinen Nullzug).
 */
export function mitGegnerAmZug(fen: string): string | null {
  const gelesen = stellungAusFen(fen);
  if (!gelesen.ok || gelesen.wert.regeln?.isCheck()) return null;
  const teile = fen.split(" ");
  teile[1] = teile[1] === "w" ? "b" : "w";
  teile[3] = "-";
  return teile.join(" ");
}

/**
 * „Was droht?“: der beste Zug des Gegners, wenn er jetzt am Zug wäre, als roter Pfeil.
 * Regel: Kapitel 4 und 12, Frage „Was will der Gegner?“.
 */
export async function drohung(fen: string): Promise<Kartenanzeige> {
  const nullzug = mitGegnerAmZug(fen);
  if (!nullzug) return { markierungen: [], text: tSpiel("karte.drohung.schach") };
  const bewertung = await engine.bewerte(nullzug, RECHENZEIT_MS, 1);
  const uci = bewertung.besterZug;
  const san = uci ? uciZuSan(nullzug, uci) : null;
  if (!uci || !san || !istDrohung(san)) {
    return { markierungen: [], text: tSpiel("karte.drohung.keine") };
  }
  return {
    markierungen: [{ typ: "pfeil", farbe: "rot", von: uci.slice(0, 2), nach: uci.slice(2, 4) }],
    text: tSpiel("karte.drohung.zug", { zug: san }),
  };
}

/**
 * Droht der Zug etwas? Ein Schlag, ein Schach oder ein Matt ist eine Drohung; ein ruhiger Zug
 * nicht (dann sagt die Karte ehrlich, dass gerade nichts droht).
 */
function istDrohung(san: string): boolean {
  return /[x+#]/.test(san);
}

/** „Waage“: wer besser steht, ohne Zahl (Kapitel 12, Stellungsbeurteilung). */
export async function waage(fen: string): Promise<Kartenanzeige> {
  const bewertung = await engine.bewerte(fen, RECHENZEIT_MS, 1);
  const wert = bewertung.varianten[0]?.wert;
  const urteil = wert ? einschaetzungDerEngine(wert) : "gleich";
  return { markierungen: [], text: tSpiel(`karte.waage.${urteil}`) };
}

/**
 * „Remisangebot“: Der Gegner nimmt an, wenn die Stellung höchstens ±AUSGEGLICHEN_BIS steht.
 * Ausgabe: die Partie mit vereinbartem Remis (Uhr angehalten) oder null bei Ablehnung.
 */
export async function remisangebot(partie: Partie, fen: string): Promise<Partie | null> {
  const bewertung = await engine.bewerte(fen, RECHENZEIT_MS, 1);
  const wert = bewertung.varianten[0]?.wert;
  if (!wert || Math.abs(wertFuer(wert, "white")) > AUSGEGLICHEN_BIS) return null;
  return { ...pausiere(partie, Date.now()), ende: { art: "vereinbart" } };
}
