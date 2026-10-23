/**
 * Notmodus der Bots in äußerster Zeitnot: Vorzüge („Premoves“) statt Bedenkzeit.
 *
 * Rolle im Gesamtbild: Idee des Autors vom 21.10.2026. Sagt die simulierte Bedenkzeit
 * (spiel/botzeit.ts), dass der Bot auf Zeit verlieren würde, verliert er nicht sofort: Er spielt
 * seinen Zug, seine Uhr steht danach auf einer Sekunde, und er zieht ab jetzt wie ein Mensch, der
 * nur noch vorauszieht. Nach jedem eigenen Zug sagt er die drei wahrscheinlichsten Antworten des
 * Gegners voraus und legt für jede seine Erwiderung zurecht, mit der Zugwahl seiner Stufe in
 * Zeitnot (engine/menschenwahl.ts, Zeitnot unter 10 Sekunden). Ist er wieder am Zug, muss er
 * einen dieser Züge spielen: den, der die Stellung am wenigsten verschlechtert. Geht keiner mehr,
 * ist seine Zeit um. Ein Vorzug kostet eine Zehntelsekunde (wie bei chess.com). Mit Zuschlag
 * verlässt er den Modus, sobald er wieder mehr als fünf Sekunden hat.
 * Die App (ui/komponenten/usePartie.ts) und die Messung (engine/stufen.messung.ts) nutzen
 * dieselben Funktionen.
 * Abhängigkeiten: engine/spielbewerter.ts, engine/engineDienst.ts (Typ), spiel/partie.ts,
 * spiel/ablauf.ts, spiel/uhr.ts, spiel/zuege.ts.
 */
import type { Color } from "chessops/types";
import type { Staerke } from "../engine/engineDienst";
import type { Spielbewerter } from "../engine/spielbewerter";
import { zieheMitUhr } from "./ablauf";
import { amZug, mitUhr, zeitUeberschritten, type Partie, type Partiezug } from "./partie";
import { halte } from "./uhr";
import { fenNach, uciZuSan } from "./zuege";

/** Restzeit des Bots nach dem Zug, mit dem er in den Notmodus kommt. */
export const NOTMODUS_REST_MS = 1000;
/** Mit mehr Restzeit als dieser verlässt er den Modus wieder (nur mit Zuschlag möglich). */
export const NOTMODUS_ENDE_MS = 5000;
/** Was ein Vorzug von der Uhr nimmt. */
export const VORZUG_MS = 100;
/** So viele Antworten des Gegners sagt der Bot voraus. */
export const VORZUG_ANTWORTEN = 3;
/** Vorhersage und Auswahl rechnen flach: Wer vorauszieht, schaut nicht tief. */
const VORHERSAGE: Staerke = { art: "tiefe", tiefe: 8 };
const VORHERSAGE_MS = 800;

/** Eine vorbereitete Erwiderung: auf die Antwort des Gegners (UCI) dieser eigene Zug (UCI). */
export interface Vorzug {
  readonly antwort: string;
  readonly zug: string;
}

/** Würde der Bot mit dieser Bedenkzeit auf Zeit verlieren? Dann kommt er in den Notmodus. */
export function brauchtNotmodus(bedenkMs: number | null, restMs: number | null): boolean {
  return bedenkMs !== null && restMs !== null && bedenkMs >= restMs;
}

/** Bleibt der Bot nach seinem Zug im Notmodus? Erst mit mehr als fünf Sekunden ist er draußen. */
export function bleibtImNotmodus(restNachZugMs: number): boolean {
  return restNachZugMs <= NOTMODUS_ENDE_MS;
}

/** Die Stellung nach einem UCI-Zug, null, wenn er nicht geht. */
function nach(fen: string, uci: string): string | null {
  const san = uciZuSan(fen, uci);
  return san ? fenNach(fen, san) : null;
}

/**
 * Legt die Vorzüge nach dem eigenen Zug zurecht.
 *
 * Eingaben: Bewerter, Stellung nach dem eigenen Zug (Gegner am Zug), die Zugwahl des Bots für
 * eine Stellung (gibt UCI oder null). Ausgabe: bis zu drei Vorzüge; leer, wenn der Gegner keinen
 * Zug hat. Beispiel: nach 1. e4 sagt der Bot etwa e5, c5 und e6 voraus und legt für jede Antwort
 * seinen zweiten Zug zurecht.
 */
export async function planeVorzuege(
  bewerter: Spielbewerter,
  fenNachZug: string,
  waehle: (fen: string) => Promise<string | null>,
): Promise<Vorzug[]> {
  const b = await bewerter.bewerte(fenNachZug, VORHERSAGE_MS, VORZUG_ANTWORTEN, VORHERSAGE);
  const antworten = [...new Set(b.varianten.map((v) => v.zuege[0] ?? ""))].filter(Boolean);
  const vorzuege: Vorzug[] = [];
  for (const antwort of antworten.slice(0, VORZUG_ANTWORTEN)) {
    const danach = nach(fenNachZug, antwort);
    const zug = danach ? await waehle(danach) : null;
    if (zug) vorzuege.push({ antwort, zug });
  }
  return vorzuege;
}

/**
 * Der Vorzug, den der Bot jetzt spielt: unter den vorbereiteten Zügen, die in der Stellung gehen,
 * der mit der besten Bewertung (verschlechtert die Stellung am wenigsten).
 * Ausgabe: UCI oder null, wenn keiner geht (dann ist die Zeit um).
 * Beispiel: vorbereitet Sf3 (auf e5) und d4 (auf c5); der Gegner spielt e6 → beide gehen, der
 * bessere wird gespielt, auch wenn er nicht zur Antwort passt.
 */
export async function waehleVorzug(
  bewerter: Spielbewerter,
  fen: string,
  vorzuege: readonly Vorzug[],
): Promise<string | null> {
  const legal = [...new Set(vorzuege.map((v) => v.zug))].filter((u) => uciZuSan(fen, u) !== null);
  const [erster] = legal;
  if (legal.length <= 1) return erster ?? null;
  const b = await bewerter.bewerte(fen, VORHERSAGE_MS, legal.length, VORHERSAGE, legal);
  const bester = b.varianten[0]?.zuege[0];
  return bester && legal.includes(bester) ? bester : (erster ?? null);
}

/**
 * Spielt den Zug des Bots mit der Uhr des Notmodus.
 *
 * Eintritt: Die Uhr des Bots steht danach auf einer Sekunde (plus Zuschlag), statt dass er auf
 * Zeit verliert. Vorzug: Er verbraucht eine Zehntelsekunde von der Zeit, die er zu Beginn seines
 * Zuges hatte (Rechenzeit der App zählt nicht); hat er nicht mehr, ist seine Zeit um.
 * Ausgabe: neue Partie oder null, wenn der Zug nicht geht. Ohne laufende Uhr wie zieheMitUhr.
 */
export function zieheImNotmodus(
  partie: Partie,
  zug: Partiezug,
  jetztMs: number,
  eintritt: boolean,
  appSichtbar = true,
): Partie | null {
  const uhr = partie.uhr;
  const gezogen: Color = amZug(partie);
  if (!uhr || uhr.laeuft !== gezogen) return zieheMitUhr(partie, zug, jetztMs, appSichtbar);
  if (eintritt) {
    const gestellt = {
      ...uhr,
      restMs: { ...uhr.restMs, [gezogen]: NOTMODUS_REST_MS },
      seitMs: jetztMs,
    };
    return zieheMitUhr(mitUhr(partie, gestellt), zug, jetztMs, appSichtbar);
  }
  const simuliert = { ...uhr, seitMs: jetztMs - VORZUG_MS };
  if (uhr.restMs[gezogen] <= VORZUG_MS) {
    return mitUhr(zeitUeberschritten(partie, gezogen), halte(simuliert, jetztMs));
  }
  return zieheMitUhr(mitUhr(partie, simuliert), zug, jetztMs, appSichtbar);
}

/** Zeit um im Notmodus (kein Vorzug geht mehr): Die Uhr des Bots steht auf null. */
export function notmodusZeitUm(partie: Partie, jetztMs: number): Partie {
  const uhr = partie.uhr;
  const gezogen = amZug(partie);
  if (!uhr) return zeitUeberschritten(partie, gezogen);
  const leer = { ...uhr, restMs: { ...uhr.restMs, [gezogen]: 0 }, seitMs: jetztMs };
  return mitUhr(zeitUeberschritten(partie, gezogen), halte(leer, jetztMs));
}
