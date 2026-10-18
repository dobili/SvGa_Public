/**
 * Elo-Zahl der Stufen und der vorgefertigten Bots, auf der Skala von „Deine Spielstärke“.
 *
 * Rolle im Gesamtbild: Rückfrage S23 (Wunsch des Autors, 18.10.2026). Die Gegnerwahl zeigt je
 * Stufe und je Bot „etwa 1100“, und die Elo-Wertung des Lesers rechnet mit dieser festen Zahl als
 * Gegnerwertung statt mit der Schätzung aus der Genauigkeit einer einzelnen Partie (die streut um
 * etwa ±400 und ist nach oben gedeckelt). Die Zahlen stammen aus der Elo-Leiter
 * (engine/eloleiter.ts, Messlauf engine/botstaerke.messung.ts) und stehen in
 * engine/botstaerke-daten.ts. Eigene Stufen und eigene Bots wurden nie gemessen; ihre Zahl wird
 * aus den drei Stufen je Phase geschätzt. An der Überschrift einer Stufe steht der Bereich ihrer
 * acht Bots (Vorschlag des Autors, 18.10.2026: Bereiche mit leichten Überschneidungen); die Zahl
 * der reinen Stufe dient der Schätzung eigener Stufen.
 * Abhängigkeiten: engine/botstaerke-daten.ts, engine/gegnerliste.ts, engine/stufen.ts (Typ),
 * schach/phase.ts (Typ).
 */
import type { Phase } from "../schach/phase";
import { BOT_STAERKE, STUFEN_STAERKE } from "./botstaerke-daten";
import { GEGNER } from "./gegnerliste";
import type { Stufennummer } from "./stufen";

/**
 * Bereich, in dem die Zahl eine Bedeutung hat. Unten: Die Eichung von „Deine Spielstärke“ beruht
 * auf Partien ab 400; darunter zeigt die App „unter 400“. Oben: Bis 0.2.86 stand über 2200 (Ende
 * der Eichdaten) nur „über 2200“; damit sahen Stufe 5 bis 8 gleich aus, obwohl die Ergebnisse sie
 * klar trennen (Rückmeldung des Autors, 18.10.2026 abends). Seit 0.2.87 zeigt die App auch darüber
 * die Zahl der Elo-Leiter: Sie kommt dort allein aus den Ergebnissen gegen die tieferen, an der
 * Skala verankerten Stufen. Die Grenze liegt über der vollen Engine (Stufe 8, etwa 3200), weil es
 * darüber nichts mehr zu messen gibt.
 */
export const ANGABE_HOECHSTENS = 3300;
export const ANGABE_MINDESTENS = 400;
const RUNDUNG = 50;
const ERSTE_STUFE = 1;
const LETZTE_STUFE = 8;
const PHASEN_ZAHL = 3;

/** Was die App zu einer Zahl zeigt. */
export type Staerkeangabe =
  | { readonly art: "etwa"; readonly wert: number }
  | { readonly art: "ueber"; readonly wert: number }
  | { readonly art: "unter"; readonly wert: number };

/** Die Zahl einer reinen Stufe (gemessen). Beispiel: Stufe 3 → 1911 (angezeigt „etwa 1900“). */
export function staerkeDerStufe(nummer: Stufennummer): number {
  return STUFEN_STAERKE[nummer];
}

/** Die Zahl eines vorgefertigten Bots (gemessen); null für unbekannte und eigene Bots. */
export function staerkeDesBots(kennung: string | null): number | null {
  if (kennung === null) return null;
  return BOT_STAERKE[kennung] ?? null;
}

/**
 * Geschätzte Zahl für Stufen je Phase (eigene Stufen, eigene Bots): der Mittelwert der drei
 * Stufen, zwischen den gemessenen Stufen linear. Ungenauer als eine Messung, weil eine Mischung
 * nie gemessen wurde und Fehlerarten, blinde Flecken und Stil nicht eingehen.
 * Beispiel: 3 · 4 · 3 → ein Drittel des Wegs von Stufe 3 zu Stufe 4.
 */
export function staerkeAusStufen(stufen: Readonly<Record<Phase, Stufennummer>>): number {
  const mittel = (stufen.eroeffnung + stufen.mittelspiel + stufen.endspiel) / PHASEN_ZAHL;
  const unten = Math.max(ERSTE_STUFE, Math.min(LETZTE_STUFE, Math.floor(mittel))) as Stufennummer;
  const oben = Math.min(LETZTE_STUFE, unten + 1) as Stufennummer;
  const anteil = mittel - unten;
  return STUFEN_STAERKE[unten] + anteil * (STUFEN_STAERKE[oben] - STUFEN_STAERKE[unten]);
}

/**
 * Die feste Gegnerwertung einer Partie gegen die Engine: der gemessene Bot, sonst die Schätzung
 * aus den Stufen je Phase.
 * Beispiel: Bot „ayse“ → 1553; eigene Stufen 5 · 5 · 5 → die Zahl der Stufe 5.
 */
export function gegnerstaerke(einstellung: {
  readonly bot: string | null;
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
}): number {
  return staerkeDesBots(einstellung.bot) ?? staerkeAusStufen(einstellung.stufenJePhase);
}

/**
 * Was zu einer Zahl angezeigt wird: auf 50 gerundet; über 3300 und unter 400 nur die Grenze.
 * Beispiel: 1083 → etwa 1100; 2650 → etwa 2650; 3400 → über 3300; 310 → unter 400.
 */
export function staerkeangabe(wert: number): Staerkeangabe {
  if (wert > ANGABE_HOECHSTENS) return { art: "ueber", wert: ANGABE_HOECHSTENS };
  if (wert < ANGABE_MINDESTENS) return { art: "unter", wert: ANGABE_MINDESTENS };
  return { art: "etwa", wert: Math.round(wert / RUNDUNG) * RUNDUNG };
}

/** Die Stufe eines vorgefertigten Bots: gerundeter Durchschnitt seiner Stufen je Phase. */
function stufeVon(stufen: Readonly<Record<Phase, Stufennummer>>): number {
  return Math.round((stufen.eroeffnung + stufen.mittelspiel + stufen.endspiel) / PHASEN_ZAHL);
}

/**
 * Der Bereich einer Stufe: kleinste und größte Zahl ihrer acht vorgefertigten Bots (ohne
 * gemessene Bots die Zahl der reinen Stufe für beide Enden). Benachbarte Stufen dürfen sich
 * überschneiden, denn die Bots einer Stufe streuen.
 * Beispiel: Stufe 1 mit Bots von 1042 (Oma Gerda) bis 1301 (Leon) → { von: 1042, bis: 1301 }.
 */
export function bereichDerStufe(nummer: Stufennummer): {
  readonly von: number;
  readonly bis: number;
} {
  const bots = GEGNER.filter((g) => !g.zufallszuege && stufeVon(g.stufenJePhase) === nummer);
  const werte = gemesseneZahlen(bots);
  if (werte.length === 0) return { von: STUFEN_STAERKE[nummer], bis: STUFEN_STAERKE[nummer] };
  return { von: Math.min(...werte), bis: Math.max(...werte) };
}

/** Die gemessenen Zahlen einer Gruppe von Bots (ungemessene fallen weg). */
function gemesseneZahlen(bots: readonly { readonly kennung: string }[]): number[] {
  return bots.map((g) => staerkeDesBots(g.kennung)).filter((w): w is number => w !== null);
}

/**
 * Der Bereich der Spaß-Bots (0.2.87, eigene Gruppe unter Stufe 1); null, solange keiner gemessen
 * ist. Beispiel: vier Bots von 520 bis 940 → { von: 520, bis: 940 }.
 */
export function bereichDerSpassbots(): { readonly von: number; readonly bis: number } | null {
  const werte = gemesseneZahlen(GEGNER.filter((g) => (g.zufallszuege ?? 0) > 0));
  if (werte.length === 0) return null;
  return { von: Math.min(...werte), bis: Math.max(...werte) };
}
