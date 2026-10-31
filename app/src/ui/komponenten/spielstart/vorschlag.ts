/**
 * Der Vorschlag der Karte „Schnell eine Partie“ auf dem Bildschirm Spielen (Entwurf J3, Wahl des
 * Autors 31.10.2026): ein Bot, der zur Spielstärke des Lesers passt, bevorzugt einer, den er in
 * dieser Zeitklasse noch nicht besiegt hat. Reine Funktionen ohne Oberfläche.
 *
 * Rolle im Gesamtbild: Einsteiger sollen nicht erst 80 Porträts durchsehen, sondern mit einem Tipp
 * spielen können. Die Vorschläge kommen aus einer Liste von Quellen (VORSCHLAGSQUELLEN), die der
 * Reihe nach gefragt werden: zuerst eine Vorbelegung (Revanche gegen den Rivalen P8, Ziel P13,
 * „Revanche“ unter „Zuletzt gespielt“), dann die passenden Bots. Eine spätere Quelle (etwa der
 * Rivale ohne Antippen oder ein Wochenziel) ist eine Zeile mehr in der Liste: eintragen statt
 * umbauen (Wunsch des Autors). „Anderer Vorschlag“ nimmt den nächsten aus der Gesamtliste.
 * Die Stärke des Leser kommt aus seiner Wertung (Profil, wertungskacheln.ts), weil die Bots auf
 * derselben Skala gemessen sind (engine/botstaerke.ts); ohne Wertung ein Bot der Stufe 1 bis 2.
 * Abhängigkeiten: engine/gegner.ts, engine/botstaerke.ts, spiel/elomodell.ts (Typ).
 */
import { staerkeAusStufen, staerkeDesBots, staerkeGeschaetzt } from "../../../engine/botstaerke";
import {
  GEGNER,
  gegnerVon,
  istSpassbot,
  klasseVon,
  type EigenerGegner,
  type Gegner,
} from "../../../engine/gegner";
import type { Wertungstempo } from "../../../spiel/elomodell";

/** Ohne Wertung: Bots dieser Stufen (Neuling und Einsteiger) für den Anfang. */
const EINSTIEG_BIS_STUFE = 2;
/** So weit darf ein Bot von der Stärke des Lesers abweichen und noch „etwa so stark“ heißen. */
export const GLEICH_SPANNE = 100;
/** So weit sucht der Vorschlag höchstens; darüber ist es kein passender Gegner mehr. */
const SUCHSPANNE = 250;
/** Mindestens so viele passende Bots bietet die Liste an, auch wenn sie weiter weg liegen. */
const MINDESTENS = 6;

/** Warum ein Bot vorgeschlagen wird; danach richtet sich der kleine Satz auf der Karte. */
export type Vorschlagsgrund = "vorbelegt" | "gleich" | "staerker" | "schwaecher" | "einstieg";

/** Ein Vorschlag: Bot (vorgefertigt oder eigener) und Grund. */
export interface Vorschlag {
  readonly bot: string;
  readonly grund: Vorschlagsgrund;
}

/** Was die Quellen wissen müssen. */
export interface Vorschlagskontext {
  /** Bot einer Vorbelegung (Revanche, Rivale, Ziel); sonst null. */
  readonly vorbelegt: string | null;
  /** Wertung des Lesers in der Zeitklasse (Skala von Lichess); null ohne gewertete Partie. */
  readonly staerke: number | null;
  readonly tempo: Wertungstempo;
  /** In dieser Zeitklasse schon gewertet besiegte Bots. */
  readonly besiegt: readonly string[];
  readonly eigene: readonly EigenerGegner[];
}

/** Eine Quelle: Kennung (für Tests und Bericht) und ihre Vorschläge in Rangfolge. */
export interface Vorschlagsquelle {
  readonly kennung: string;
  readonly vorschlaege: (k: Vorschlagskontext) => readonly Vorschlag[];
}

/**
 * Die Zahl eines vorgefertigten Bots in der Zeitklasse; ohne Messung aus seinen Stufen.
 * Beispiel: „tom“ in Schnellschach → etwa 400.
 */
export function botzahl(g: Gegner, tempo: Wertungstempo): number {
  return staerkeDesBots(g.kennung, tempo) ?? staerkeAusStufen(g.stufenJePhase);
}

/**
 * Die Zahl eines Bots, gleich ob vorgefertigt oder eigener (geschätzt); null, wenn es ihn nicht gibt.
 */
export function zahlDesBots(
  bot: string,
  tempo: Wertungstempo,
  eigene: readonly EigenerGegner[],
): number | null {
  const g = gegnerVon(bot);
  if (g) return botzahl(g, tempo);
  const eigener = eigene.find((e) => e.kennung === bot);
  return eigener ? staerkeGeschaetzt(eigener) : null;
}

/** Der Grund nach dem Abstand zur Stärke des Lesers. Beispiel: Leser 640, Bot 900 → „staerker“. */
export function grundNachAbstand(botStaerke: number, staerke: number): Vorschlagsgrund {
  const abstand = botStaerke - staerke;
  if (Math.abs(abstand) <= GLEICH_SPANNE) return "gleich";
  return abstand > 0 ? "staerker" : "schwaecher";
}

/** Die Bots in den Stufen (ohne Spaß-Bots), die der Vorschlag kennt. */
function stufenbots(): Gegner[] {
  return GEGNER.filter((g) => !istSpassbot(g));
}

/**
 * Die passenden Bots in Rangfolge.
 *
 * Eingaben: Kontext. Ausgabe: Vorschläge; noch nicht besiegte zuerst, dann nach Abstand zur
 * Stärke des Lesers (ohne Wertung: Stufe 1 bis 2, schwächster zuerst).
 * Beispiel: Wertung 640 in Schnellschach, Felix (580) besiegt, Yusuf (600) nicht → Yusuf vor Felix.
 * Sonderfall: Liegen weniger als MINDESTENS Bots in der Suchspanne, kommen die nächstliegenden dazu.
 */
export function passendeBots(k: Vorschlagskontext): Vorschlag[] {
  const ungeschlagenZuerst = (a: Gegner, b: Gegner) =>
    Number(k.besiegt.includes(a.kennung)) - Number(k.besiegt.includes(b.kennung));
  if (k.staerke === null) {
    return stufenbots()
      .filter((g) => klasseVon(g).nummer <= EINSTIEG_BIS_STUFE)
      .sort((a, b) => ungeschlagenZuerst(a, b) || botzahl(a, k.tempo) - botzahl(b, k.tempo))
      .map((g) => ({ bot: g.kennung, grund: "einstieg" }));
  }
  const staerke = k.staerke;
  const abstand = (g: Gegner) => Math.abs(botzahl(g, k.tempo) - staerke);
  const nach = stufenbots().sort((a, b) => abstand(a) - abstand(b));
  const nah = nach.filter((g, i) => abstand(g) <= SUCHSPANNE || i < MINDESTENS);
  return [...nah]
    .sort((a, b) => ungeschlagenZuerst(a, b) || abstand(a) - abstand(b))
    .map((g) => ({ bot: g.kennung, grund: grundNachAbstand(botzahl(g, k.tempo), staerke) }));
}

/** Quelle „vorbelegt“: der Bot einer Vorbelegung, wenn es ihn gibt. */
const VORBELEGT: Vorschlagsquelle = {
  kennung: "vorbelegt",
  vorschlaege: (k) =>
    k.vorbelegt !== null && zahlDesBots(k.vorbelegt, k.tempo, k.eigene) !== null
      ? [{ bot: k.vorbelegt, grund: "vorbelegt" }]
      : [],
};

/** Quelle „passend“: Bots in der Nähe der eigenen Stärke. */
const PASSEND: Vorschlagsquelle = { kennung: "passend", vorschlaege: passendeBots };

/**
 * Die Quellen in Rangfolge; eine neue Quelle (Rivale, Ziele P13) ist eine Zeile mehr.
 */
export const VORSCHLAGSQUELLEN: readonly Vorschlagsquelle[] = [VORBELEGT, PASSEND];

/**
 * Alle Vorschläge aller Quellen in Rangfolge, jeder Bot nur einmal.
 * Beispiel: Revanche gegen Pia, Wertung 640 → Pia (vorbelegt), dann die passenden Bots ohne Pia.
 */
export function vorschlaege(
  k: Vorschlagskontext,
  quellen: readonly Vorschlagsquelle[] = VORSCHLAGSQUELLEN,
): Vorschlag[] {
  const gesehen = new Set<string>();
  return quellen.flatMap((q) =>
    q.vorschlaege(k).filter((v) => {
      if (gesehen.has(v.bot)) return false;
      gesehen.add(v.bot);
      return true;
    }),
  );
}

/**
 * Der Vorschlag an einer Stelle der Liste, rundum („Anderer Vorschlag“ zählt weiter); null nur bei
 * leerer Liste. Beispiel: drei Vorschläge, Stelle 4 → der zweite.
 */
export function vorschlagAn(liste: readonly Vorschlag[], stelle: number): Vorschlag | null {
  if (liste.length === 0) return null;
  return liste[((stelle % liste.length) + liste.length) % liste.length] ?? null;
}
