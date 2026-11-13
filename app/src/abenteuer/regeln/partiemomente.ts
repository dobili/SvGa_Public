/**
 * Partiemomente (Atmosphäre T5, docs/spiel/23_Technik_Atmosphaere.md): Welche Sprechzeile ist
 * nach dem letzten Halbzug einer Partie fällig?
 *
 * Rolle im Gesamtbild: reine Regeln ohne React. Die Begegnung trägt ihre Momente in
 * begegnungen.json (`momente`); anbindung/Momentzeile.tsx zeigt den fälligen Moment über dem
 * Brett. Die Engine wartet nie auf einen Moment.
 * Grundsatz: Jeder Moment kommt höchstens einmal je Partie, und zwar beim ersten Halbzug, der ihn
 * auslöst. Weil das allein aus dem Partieverlauf folgt, braucht es keinen Speicher: Nach dem
 * Neuladen kommt ein schon gezeigter Moment nicht wieder.
 * Merkmale gelten für den letzten Halbzug (Flanke, nicht Zustand): `materialMinus3` löst aus, wenn
 * der Held mit diesem Halbzug auf drei Bauerneinheiten Rückstand fällt, nicht bei jedem Zug danach.
 * Geführte Momente (T11): `koeder` und `turmopfer` gelten vor dem Zug des Helden
 * (regeln/gelegenheiten.ts); `uhrUnter` vergleicht die Uhr des Helden. Weil die Uhr nicht im
 * Verlauf steht, merkt sich die Anzeige solche Momente selbst (anbindung/Momentzeile.tsx).
 * Buchbezug: Kapitel 1, Faustwerte der Figuren (Bauer 1, Springer und Läufer 3, Turm 5, Dame 9).
 * Abhängigkeiten: schach/stellung.ts, daten/laden.ts (Typ der Begegnung).
 */
import type { Color, Role } from "chessops/types";
import { FIGURENWERT, gegner, stellungAusFen, type Stellung } from "../../schach/stellung";
import type { Begegnungsdaten } from "../daten/laden";
import { gelegenheit } from "./gelegenheiten";

/** Ein Moment einer Begegnung, wie in begegnungen.json. */
export type Partiemoment = NonNullable<Begegnungsdaten["momente"]>[number];

/** Der Verlauf einer Partie: Stellungen ab dem Start (FEN) und wer jeden Halbzug zog. */
export interface Partieverlauf {
  /** FEN vor dem ersten Halbzug und nach jedem Halbzug (Länge: Halbzüge + 1). */
  readonly fens: readonly string[];
  /** Je Halbzug: true, wenn der Held zog. */
  readonly vomHelden: readonly boolean[];
  /** Farbe des Helden. */
  readonly held: Color;
  /** Restzeit des Helden jetzt (ms); fehlt ohne Uhr. Gilt nur für den letzten Halbzug. */
  readonly uhrHeldMs?: number;
}

/** Millisekunden je Sekunde (für `uhrUnter`). */
const MS_JE_SEKUNDE = 1000;

/** Rückstand in Bauerneinheiten, ab dem `materialMinus3` auslöst. */
const RUECKSTAND = 3;
const PRAEFIX_GESCHLAGEN = "geschlagen:";

/** Figurennamen der Daten (wie im Buch, ohne Umlaute) zu den Rollen von chessops. */
const ROLLE: Readonly<Record<string, Role>> = {
  bauer: "pawn",
  springer: "knight",
  laeufer: "bishop",
  turm: "rook",
  dame: "queen",
};

const GEZAEHLTE_ROLLEN: readonly Role[] = ["pawn", "knight", "bishop", "rook", "queen"];

/** Material einer Seite in Bauerneinheiten (ohne König). */
function material(s: Stellung, farbe: Color): number {
  return GEZAEHLTE_ROLLEN.reduce(
    (summe, rolle) => summe + FIGURENWERT[rolle] * s.brett.pieces(farbe, rolle).size(),
    0,
  );
}

/** Materialbilanz aus Sicht des Helden (positiv: Held vorn). */
function bilanz(s: Stellung, held: Color): number {
  return material(s, held) - material(s, gegner(held));
}

/** Zahl der Damen beider Seiten. */
function damen(s: Stellung): number {
  return s.brett.queen.size();
}

/** Gelesene Stellungen je Verlauf: Jede FEN wird nur einmal gelesen, auch bei vielen Momenten. */
const gelesen = new WeakMap<readonly string[], readonly (Stellung | null)[]>();

function stellungenVon(verlauf: Partieverlauf): readonly (Stellung | null)[] {
  let liste = gelesen.get(verlauf.fens);
  if (!liste) {
    liste = verlauf.fens.map((fen) => {
      const s = stellungAusFen(fen);
      return s.ok ? s.wert : null;
    });
    gelesen.set(verlauf.fens, liste);
  }
  return liste;
}

/** Die Stellungen vor und nach Halbzug `h` (1-basiert), sonst null. */
function paar(verlauf: Partieverlauf, h: number): { vor: Stellung; nach: Stellung } | null {
  const liste = stellungenVon(verlauf);
  const vor = liste[h - 1];
  const nach = liste[h];
  return vor && nach ? { vor, nach } : null;
}

/**
 * Trifft das Merkmal auf Halbzug `h` zu?
 *
 * Beispiel: Der Gegner schlägt mit Lxf7+ einen Bauern und gibt Schach: `schachGegen` und
 * `geschlagen:bauer` treffen zu. Sonderfall: unbekanntes Merkmal → nie.
 */
export function merkmalTrifft(merkmal: string, verlauf: Partieverlauf, h: number): boolean {
  const s = paar(verlauf, h);
  if (!s) return false;
  const heldZog = verlauf.vomHelden[h - 1] === true;
  const schach = s.nach.regeln?.isCheck() === true;
  if (merkmal === "schachGegen") return !heldZog && schach;
  if (merkmal === "schachGegeben") return heldZog && schach;
  if (merkmal === "damenTausch") return damen(s.vor) > 0 && damen(s.nach) === 0;
  if (merkmal === "materialMinus3") {
    return bilanz(s.vor, verlauf.held) > -RUECKSTAND && bilanz(s.nach, verlauf.held) <= -RUECKSTAND;
  }
  if (merkmal === "koeder" || merkmal === "turmopfer") {
    // Gelegenheiten gelten vor dem Zug des Helden: nach einem Zug des Gegners.
    const fen = verlauf.fens[h] ?? "";
    return !heldZog && s.nach.regeln !== null && gelegenheit(merkmal, fen, s.nach.regeln);
  }
  if (merkmal.startsWith(PRAEFIX_GESCHLAGEN)) {
    const rolle = ROLLE[merkmal.slice(PRAEFIX_GESCHLAGEN.length)];
    if (!rolle || heldZog) return false;
    return (
      s.nach.brett.pieces(verlauf.held, rolle).size() <
      s.vor.brett.pieces(verlauf.held, rolle).size()
    );
  }
  return false;
}

/**
 * Löst der Moment auf Halbzug `h` aus? Alle Bedingungen in `wenn` müssen gelten. `zug` und
 * `abZug` zählen die Züge des Helden (1, 2, …); `uhrUnter` gilt nur für den letzten Halbzug, weil
 * die Partie keine Uhrzeiten je Zug speichert.
 */
function loestAus(moment: Partiemoment, verlauf: Partieverlauf, h: number): boolean {
  const { zug, abZug, merkmal, uhrUnter } = moment.wenn;
  const heldenzuege = verlauf.vomHelden.slice(0, h).filter(Boolean).length;
  if (zug !== undefined && (verlauf.vomHelden[h - 1] !== true || heldenzuege !== zug)) return false;
  if (abZug !== undefined && heldenzuege < abZug) return false;
  if (uhrUnter !== undefined) {
    const rest = h === verlauf.vomHelden.length ? verlauf.uhrHeldMs : undefined;
    if (rest === undefined || rest >= uhrUnter * MS_JE_SEKUNDE) return false;
  }
  return merkmal === undefined || merkmalTrifft(merkmal, verlauf, h);
}

/**
 * Der Moment, der genau mit dem letzten Halbzug fällig wird, oder null.
 *
 * Warum: Ein Moment soll in dem Augenblick erscheinen, in dem das Ereignis geschieht, und nie ein
 * zweites Mal. Deshalb zählt für jeden Moment nur der erste Halbzug, der ihn auslöst.
 * Eingaben: Momente der Begegnung, Verlauf der Partie. Ausgabe: Index des Moments und Halbzug.
 * Beispiel: `{ "wenn": { "zug": 12 } }` erscheint direkt nach dem zwölften Zug des Helden.
 * Sonderfälle: Lösen mehrere Momente zugleich aus, gewinnt der erste in der Liste; die anderen
 * sind damit verbraucht. Ohne Halbzug kein Moment.
 */
export function faelligerMoment(
  momente: readonly Partiemoment[],
  verlauf: Partieverlauf,
): { index: number; halbzug: number } | null {
  const letzter = verlauf.vomHelden.length;
  const zuletzt = gesprocheneMomente(momente, verlauf).at(-1);
  return zuletzt && zuletzt.halbzug === letzter ? zuletzt : null;
}

/**
 * Alle Momente, die im bisherigen Verlauf gesprochen haben, in der Reihenfolge der Halbzüge.
 * Gleiche Regel wie faelligerMoment (der erste ausgelöste Moment spricht, gleichzeitig ausgelöste
 * gelten als verbraucht). Gebraucht vom Zugerraten (regeln/zugerraten.ts): Es beginnt mit dem
 * Halbzug, an dem sein Moment sprach.
 */
export function gesprocheneMomente(
  momente: readonly Partiemoment[],
  verlauf: Partieverlauf,
): readonly { index: number; halbzug: number }[] {
  const gesprochen: { index: number; halbzug: number }[] = [];
  const verbraucht = new Set<number>();
  for (let h = 1; h <= verlauf.vomHelden.length; h++) {
    const treffer = momente.findIndex((m, i) => !verbraucht.has(i) && loestAus(m, verlauf, h));
    if (treffer < 0) continue;
    // Gleichzeitig ausgelöste Momente gelten als verbraucht (nur einer spricht).
    momente.forEach((m, i) => {
      if (!verbraucht.has(i) && loestAus(m, verlauf, h)) verbraucht.add(i);
    });
    gesprochen.push({ index: treffer, halbzug: h });
  }
  return gesprochen;
}
