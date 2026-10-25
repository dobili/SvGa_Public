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
 * acht Bots (Vorschlag des Autors, 18.10.2026; seit 0.2.109 ohne Überschneidungen); die Zahl
 * der reinen Stufe dient der Schätzung eigener Stufen.
 * Abhängigkeiten: engine/botgruppe.ts, engine/botstaerke-daten.ts, engine/gegnerliste.ts, engine/stufen.ts (Typ),
 * schach/phase.ts (Typ).
 */
import { REINE_STUFEN_STAERKE } from "./reinestufen-daten";
import type { Phase } from "../schach/phase";
import { gruppeDesBots } from "./botgruppe";
import { BLINDE_FLECKEN, type BlinderFleck } from "./blindeFlecken";
import { BOT_STAERKE, STUFEN_STAERKE, UHR_ABZUG } from "./botstaerke-daten";
import { zahlInZeitklasse } from "./zeitklassenabstand";
import { wertungstempo, type Wertungstempo } from "../spiel/elomodell";
import type { Fehlerart } from "./fehlerart";
import { GELEGENHEITSARTEN } from "./menschenprofil";
import { GEGNER } from "./gegnerliste";
import { gruppenstufe, gruppenwertung } from "./gruppe";
import { STUFEN_ZAHL, type Stufennummer } from "./stufen";

/**
 * Bereich, in dem die Zahl eine Bedeutung hat. Unten: Die Eichung von „Deine Spielstärke“ beruht
 * auf Partien ab 400; darunter zeigt die App „unter 400“. Oben: Bis 0.2.87 stand über 2200 (Ende
 * der Eichdaten) nur „über 2200“; damit sahen Stufe 5 bis 8 gleich aus, obwohl die Ergebnisse sie
 * klar trennen (Rückmeldung des Autors, 18.10.2026 abends). Seit 0.2.88 zeigt die App auch darüber
 * die Zahl der Elo-Leiter: Sie kommt dort allein aus den Ergebnissen gegen die tieferen, an der
 * Skala verankerten Stufen. Die Grenze liegt über der vollen Engine (Stufe 8, etwa 3000), weil es
 * darüber nichts mehr zu messen gibt.
 */
export const ANGABE_HOECHSTENS = 3300;
export const ANGABE_MINDESTENS = 400;
const RUNDUNG = 50;
const ERSTE_STUFE = 1;
const LETZTE_STUFE = STUFEN_ZAHL;
const PHASEN_ZAHL = 3;

/** Was die App zu einer Zahl zeigt. */
export type Staerkeangabe =
  | { readonly art: "etwa"; readonly wert: number }
  | { readonly art: "ueber"; readonly wert: number }
  | { readonly art: "unter"; readonly wert: number };

/**
 * Die Zahl einer Stufe (gemessen in Schnellschach), in Blitz und Klassisch umgerechnet wie bei
 * einem Menschen dieser Stärke (seit 0.2.131, engine/zeitklassenabstand.ts).
 * Beispiel: Stufe 3 → 1239 (angezeigt „etwa 1250“).
 */
export function staerkeDerStufe(nummer: Stufennummer, tempo: Wertungstempo = "rapid"): number {
  return zahlInZeitklasse(STUFEN_STAERKE[nummer], tempo);
}

/**
 * Die Zahl eines vorgefertigten Bots (gemessen in Schnellschach), in Blitz und Klassisch
 * umgerechnet wie bei einem Menschen dieser Stärke; null für unbekannte und eigene Bots.
 */
export function staerkeDesBots(
  kennung: string | null,
  tempo: Wertungstempo = "rapid",
): number | null {
  const schnellschach = kennung === null ? undefined : BOT_STAERKE[kennung];
  return schnellschach === undefined ? null : zahlInZeitklasse(schnellschach, tempo);
}

/**
 * Geschätzte Zahl für Stufen je Phase (eigene Stufen, eigene Bots): der Mittelwert der drei
 * Stufen, zwischen den gemessenen Stufen linear. Ungenauer als eine Messung, weil eine Mischung
 * nie gemessen wurde und Fehlerarten, blinde Flecken und Stil nicht eingehen.
 * Beispiel: 3 · 4 · 3 → ein Drittel des Wegs von Stufe 3 zu Stufe 4.
 */
export function staerkeAusStufen(
  stufen: Readonly<Record<Phase, Stufennummer>>,
  tabelle: Readonly<Record<Stufennummer, number>> = STUFEN_STAERKE,
): number {
  const mittel = mittelDerStufen(stufen);
  const unten = Math.max(ERSTE_STUFE, Math.min(LETZTE_STUFE, Math.floor(mittel))) as Stufennummer;
  const oben = Math.min(LETZTE_STUFE, unten + 1) as Stufennummer;
  const anteil = mittel - unten;
  return tabelle[unten] + anteil * (tabelle[oben] - tabelle[unten]);
}

/** Was an Zusatzfehlern eingestellt ist (eigene Gegner, eigene Stufe mit blinden Flecken). */
export interface Zusatzfehlerangabe {
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
  readonly fehlerarten?: readonly Fehlerart[] | null;
  readonly blindeFlecken?: readonly BlinderFleck[];
  readonly gewichte?: Readonly<Partial<Record<Fehlerart | BlinderFleck, number>>>;
  readonly haeufigkeit?: number;
}

/**
 * Anteil der Zusatzfehler eines eigenen Gegners an denen der Menschen (0: keine, 1: alle wie
 * Menschen): Mittel der Gewichte aller Fehlerarten und blinden Flecken (abgehakt 1, sonst 0, im
 * erweiterten Modus das Gewicht), mal Fehlerhäufigkeit. Eine grobe Schätzung: Die Arten zählen
 * gleich, obwohl sie verschieden oft vorkommen.
 * Beispiel: alle Haken, keine Flecken, Häufigkeit 1 → 12 von 22 Gewichten → etwa 0,55.
 */
export function zusatzanteil(e: Zusatzfehlerangabe): number {
  const arten = GELEGENHEITSARTEN.map(
    (a) => e.gewichte?.[a] ?? ((e.fehlerarten ?? []).includes(a) ? 1 : 0),
  );
  const flecken = BLINDE_FLECKEN.map(
    (f) => e.gewichte?.[f] ?? ((e.blindeFlecken ?? []).includes(f) ? 1 : 0),
  );
  const alle = [...arten, ...flecken];
  return ((e.haeufigkeit ?? 1) * alle.reduce((s, w) => s + w, 0)) / alle.length;
}

/**
 * Geschätzte Zahl eines eigenen Gegners oder einer eigenen Stufe: aus den Stufen je Phase. Bis
 * 0.2.124 kam ein Abzug für Zusatzfehler dazu; seit 0.2.125 spielt eine Stufe mit dem Wahlmodell
 * bei der Wertung der Stufe, und die Haken ändern nur, welche Fehler vorkommen, nicht wie viele
 * (Variante A, ENTSCHEIDUNGEN „Messung der Bots gegen menschlich spielende Stufen“).
 * Beispiel: 4 · 4 · 4 → die Zahl der Stufe 4, mit oder ohne Haken.
 * Sonderfall (seit 0.2.126): Ist keine Fehlerart angehakt, spielt nur die Grundschicht; dann gilt
 * die gemessene Zahl der reinen Stufen (engine/reinestufen-daten.ts), etwa 720 statt 1700 bei
 * Stufe 5.
 */
export function staerkeGeschaetzt(e: Zusatzfehlerangabe): number {
  const rein = Array.isArray(e.fehlerarten) && e.fehlerarten.length === 0;
  return staerkeAusStufen(e.stufenJePhase, rein ? REINE_STUFEN_STAERKE : STUFEN_STAERKE);
}

/**
 * Die feste Gegnerwertung einer Partie gegen die Engine: der gemessene Bot, sonst die Schätzung
 * aus den Stufen je Phase und den Zusatzfehlern.
 * Beispiel: Bot „ayse“ → 1553; eigene Stufen 5 · 5 · 5 ohne Zusatzfehler → die Zahl der Stufe 5.
 */
export function gegnerstaerke(
  einstellung: Zusatzfehlerangabe & {
    readonly bot: string | null;
    readonly uhr?: Uhrangabe | null;
    /** Seit 0.2.126 an jeder neuen Partie gegen die eigene Stufe (engine/stile.ts). */
    readonly stilname?: string;
  },
): number {
  // Ohne Bot spielte die Stufe bis 0.2.125 rein (nur abgehakte blinde Flecken); seit 0.2.126
  // trägt eine neue Partie den Stil und spielt mit den angehakten Fehlerarten wie ein eigener Bot.
  const altRein = einstellung.bot === null && einstellung.stilname === undefined;
  const eigen = altRein ? { ...einstellung, fehlerarten: [] } : einstellung;
  // Gruppenmodus (engine/gruppe.ts): gemessene Zahl der Gruppe, sonst stärkster Bot plus Zuschlag.
  const gruppe = gruppenstufe(einstellung.bot);
  const tempo = wertungstempo(einstellung.uhr ?? null);
  // Seit 0.2.131 jede Gegnerzahl in der Zeitklasse der Uhr (auch Gruppen, eigene Stufen und Bots).
  const schnellschach =
    gruppe !== null
      ? gruppenwertung(gruppe)
      : (staerkeDesBots(einstellung.bot) ?? staerkeGeschaetzt(eigen));
  const ohneUhr = zahlInZeitklasse(schnellschach, tempo);
  return ohneUhr + uhrAbzug(einstellung.stufenJePhase, einstellung.uhr ?? null);
}

/** Bedenkzeit einer Partie (wie spiel/uhr.ts, Uhreinstellung). */
export interface Uhrangabe {
  readonly grundzeitMs: number;
  readonly zuschlagMs: number;
}

/**
 * Was die Uhr einen Bot dieser Stufen kostet (seit 0.2.117, gemessen: jede Stufe mit Uhr gegen
 * sich selbst ohne Uhr, engine/botstaerke.messung.ts): Mittel der drei Phasen; ohne Uhr 0. Seit
 * 0.2.125 je Zeitklasse (Blitz, Schnellschach, Klassisch) statt je genauer Bedenkzeit, damit auch
 * 3+0, 5+3, 15+10 und 60+0 einen Wert haben. Beispiel: Stufe 5 in allen Phasen, 5 + 3 → Blitz.
 */
export function uhrAbzug(
  stufen: Readonly<Record<Phase, Stufennummer>>,
  uhr: Uhrangabe | null,
): number {
  if (!uhr) return 0;
  const je = UHR_ABZUG[wertungstempo(uhr)];
  if (!je) return 0;
  const phasen = [stufen.eroeffnung, stufen.mittelspiel, stufen.endspiel];
  return phasen.reduce((summe, n) => summe + (je[n] ?? 0), 0) / PHASEN_ZAHL;
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

/** Durchschnitt der Stufen je Phase eines Bots (seine Gruppe: engine/botgruppe.ts). */
function mittelDerStufen(stufen: Readonly<Record<Phase, Stufennummer>>): number {
  return (stufen.eroeffnung + stufen.mittelspiel + stufen.endspiel) / PHASEN_ZAHL;
}

/**
 * Der Bereich einer Stufe: kleinste und größte Zahl ihrer acht vorgefertigten Bots (ohne
 * gemessene Bots die Zahl der reinen Stufe für beide Enden). Seit 0.2.109 überschneiden sich
 * benachbarte Stufen nicht mehr (acht Bots in der Nachbargruppe, engine/botgruppe.ts).
 * Beispiel: Stufe 1 mit Bots von 830 (Oma Gerda) bis 1089 (Leon) → { von: 830, bis: 1089 }.
 */
export function bereichDerStufe(
  nummer: Stufennummer,
  tempo: Wertungstempo = "rapid",
): {
  readonly von: number;
  readonly bis: number;
} {
  const bots = GEGNER.filter(
    (g) => !g.zufallszuege && gruppeDesBots(g.kennung, mittelDerStufen(g.stufenJePhase)) === nummer,
  );
  const werte = gemesseneZahlen(bots, tempo);
  const rein = staerkeDerStufe(nummer, tempo);
  if (werte.length === 0) return { von: rein, bis: rein };
  return { von: Math.min(...werte), bis: Math.max(...werte) };
}

/** Die gemessenen Zahlen einer Gruppe von Bots in der Zeitklasse (ungemessene fallen weg). */
function gemesseneZahlen(
  bots: readonly { readonly kennung: string }[],
  tempo: Wertungstempo,
): number[] {
  return bots.map((g) => staerkeDesBots(g.kennung, tempo)).filter((w): w is number => w !== null);
}

/**
 * Der Bereich der Spaß-Bots (0.2.88, eigene Gruppe unter Stufe 1); null, solange keiner gemessen
 * ist. Beispiel: vier Bots von 520 bis 940 → { von: 520, bis: 940 }.
 */
export function bereichDerSpassbots(
  tempo: Wertungstempo = "rapid",
): { readonly von: number; readonly bis: number } | null {
  const werte = gemesseneZahlen(
    GEGNER.filter((g) => (g.zufallszuege ?? 0) > 0),
    tempo,
  );
  if (werte.length === 0) return null;
  return { von: Math.min(...werte), bis: Math.max(...werte) };
}
