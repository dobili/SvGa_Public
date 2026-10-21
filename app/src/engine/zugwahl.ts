/**
 * Der Zug der Engine im Spiel gegen den Leser, je nach Stufe und Profil des Gegners.
 *
 * Rolle im Gesamtbild: „waehleZug“ aus Konzept 8.1. Reihenfolge je Zug:
 * 1. Spaß-Bots (0.2.88) ziehen mit ihrem Anteil an Zufallszügen irgendeinen legalen Zug.
 * 2. Eröffnungsmodus (Konzept 8.3): Gibt der Aufrufer Buchzüge aus Kapitel 2 und 3 mit, spielt die
 *    Engine meist einen davon (Buchtreue 0,85, bei vorgegebener Eröffnung 1).
 * 3. Seit 0.2.117 (zehn Stufen, Vorschlag des Autors vom 21.10.2026): Ohne Zusatzfehler zieht die
 *    Grundschicht der Stufe (engine/grundschicht.ts), Stufe 10 die volle Engine. Mit
 *    Zusatzfehlern (Bots) kommen Fehler je Gelegenheit und blinde Flecken nach den Zahlen von
 *    Menschen der Ziel-Elo der Stufe dazu (engine/menschenwahl.ts); das Profil stellt Gewichte,
 *    Fehlerhäufigkeit und Höchstverluste, die Restzeit der Uhr die Zeitnot.
 * 4. Die volle Engine verteilt mit Stil auf mehrere nahezu gleich gute Kandidaten.
 * Abhängigkeiten: engine/menschenwahl.ts, engine/menschlich.ts (Verlauf), engine/stil.ts,
 * engine/stufen.ts, engine/zufallszug.ts.
 */
import { BLINDE_FLECKEN, type BlinderFleck } from "./blindeFlecken";
import type { Fehlerart } from "./fehlerart";
import { hatZusatzfehler, menschlicheWahl, type Menschenwerte } from "./menschenwahl";
import { RUHIGER_VERLAUF, type Verlauf } from "./menschlich";
import type { Spielbewerter, Zugwahl } from "./spielbewerter";
import { STIL_KANDIDATEN, STIL_NEUTRAL, stilwahl } from "./stil";
import type { Stufe } from "./stufen";
import { zufallszug } from "./zufallszug";

/** Ein Fehler oder Fleck mit Gewicht: 0 aus, 1 wie Menschen, 3 besonders häufig. */
export type Gewichte = Readonly<Partial<Record<Fehlerart | BlinderFleck, number>>>;

/**
 * Profil eines Gegners: erlaubte Fehlerarten (null: alle; nicht erlaubte haben Gewicht 0), Stil
 * (−2 bis 2), blinde Flecken, für die er besonders blind ist (0.2.46; seit 0.2.117 dreifache
 * Wahrscheinlichkeit der Menschen, die übrigen Flecken wie bei Menschen), Verlauf der Partie,
 * Spaß-Zufallszüge, seit 0.2.117 Gewichte je Art, Fehlerhäufigkeit und Höchstverluste
 * (erweiterter Modus der eigenen Bots) und die Restzeit der eigenen Uhr (null: ohne Uhr).
 */
export interface Gegnerprofil {
  readonly fehlerarten: readonly Fehlerart[] | null;
  readonly stil: number;
  readonly blindeFlecken: readonly BlinderFleck[];
  readonly verlauf?: Verlauf;
  /** Anteil der Züge, die ein beliebiger legaler Zug sind (Spaß-Bots, 0.2.88); fehlend: keine. */
  readonly zufallszuege?: number;
  readonly gewichte?: Gewichte;
  readonly haeufigkeit?: number;
  readonly hoechstverlust?: Readonly<Partial<Record<Fehlerart, number>>>;
  readonly restMs?: number | null;
  /**
   * Gewicht der nicht genannten blinden Flecken (Vorgabe 1: wie Menschen, vorgefertigte Bots) und
   * der genannten (Vorgabe 3, „besonders blind“). Eigene Gegner: 0 und 1 (abgehakt heißt an).
   */
  readonly fleckenStandard?: number;
  readonly fleckGewicht?: number;
}

export const STANDARDPROFIL: Gegnerprofil = {
  fehlerarten: null,
  stil: STIL_NEUTRAL,
  blindeFlecken: [],
};

/** Gewicht eines blinden Flecks, für den ein Gegner ausdrücklich blind ist. */
export const BESONDERS_BLIND = 3;

/**
 * Eine Stufe ohne Zusatzfehler (seit 0.2.117, Vorschlag des Autors): keine Fehlerart, kein
 * blinder Fleck, nur die Grundschicht. So spielt die Engine, wenn kein Bot gewählt ist.
 */
export const REINES_PROFIL: Gegnerprofil = {
  fehlerarten: [],
  stil: STIL_NEUTRAL,
  blindeFlecken: [],
  fleckenStandard: 0,
};

export type { Spielbewerter, Zugwahl } from "./spielbewerter";
export { wertFuer } from "./spielbewerter";

/** Mit dieser Wahrscheinlichkeit bleibt die Engine im Buch, solange es Buchzüge gibt. */
export const BUCHTREUE = 0.85;
/** Hat der Leser eine Eröffnung vorgegeben, folgt die Engine ihr immer (0.2.39). */
export const BUCHTREUE_VORGABE = 1;

function zufallsauswahl<T>(liste: readonly T[], zufall: () => number): T | undefined {
  return liste[Math.floor(zufall() * liste.length)];
}

/**
 * Die Stellschrauben der menschlichen Zugwahl aus einem Profil.
 * Beispiel: Profil mit Fehlerarten [„figurHaengen“] und blindem Fleck „rueckzug“ → alle anderen
 * Fehlerarten Gewicht 0, „figurHaengen“ 1, Fleck „rueckzug“ 3, übrige Flecken 1; ein eigener
 * Gegner (fleckenStandard 0, fleckGewicht 1): „rueckzug“ 1, übrige Flecken 0.
 */
export function menschenwerteAus(profil: Gegnerprofil): Menschenwerte {
  const gewichte: Partial<Record<Fehlerart | BlinderFleck, number>> = {};
  for (const fleck of BLINDE_FLECKEN) {
    const genannt = profil.blindeFlecken.includes(fleck);
    gewichte[fleck] = genannt
      ? (profil.fleckGewicht ?? BESONDERS_BLIND)
      : (profil.fleckenStandard ?? 1);
  }
  return {
    haeufigkeit: profil.haeufigkeit ?? 1,
    gewichte: { ...gewichte, ...profil.gewichte },
    standardgewicht: 1,
    erlaubt: profil.fehlerarten,
    hoechstverlust: profil.hoechstverlust ?? {},
  };
}

/** Stufe 10: der beste Zug, mit Stil unter mehreren nahezu gleich guten Kandidaten. */
async function engineZug(
  bewerter: Spielbewerter,
  fen: string,
  stufe: Stufe,
  stil: number,
): Promise<Zugwahl | null> {
  const varianten = stil === STIL_NEUTRAL ? 1 : STIL_KANDIDATEN;
  const b = await bewerter.bewerte(fen, stufe.rechenzeitMs, varianten, stufe.staerke);
  const uci =
    stil === STIL_NEUTRAL ? b.besterZug : (stilwahl(fen, b.varianten, stil) ?? b.besterZug);
  return uci ? { uci, quelle: "engine", fehler: null, verlust: 0 } : null;
}

/**
 * Wählt den Zug der Engine.
 *
 * Warum: Konzept 8.1 „waehleZug“: Stellung, Stufe, Profil → Zug und, falls ein Fehler, dessen
 * Art. Eingaben: Bewerter, Stellung, Stufe, Buchzüge in UCI (leer außerhalb des Buches),
 * Zufallsquelle (für Tests fest), Buchtreue, Profil. Ausgabe: Zug oder null ohne legalen Zug.
 * Beispiel: Stufe 1 (Menschen um 600) nach 1. e4 e5 2. Dh5 Sc6 3. Lc4: Die Mattdrohung auf f7
 * übersieht sie in gut einem Viertel der Fälle (Sf6??, „drohungIgnoriert“).
 */
export async function waehleZug(
  bewerter: Spielbewerter,
  fen: string,
  stufe: Stufe,
  buchzuege: readonly string[],
  zufall: () => number,
  buchtreue: number = BUCHTREUE,
  profil: Gegnerprofil = STANDARDPROFIL,
): Promise<Zugwahl | null> {
  // Spaß-Bots (0.2.88): der Zufallszug kommt vor allem anderen, auch vor dem Buch.
  if (profil.zufallszuege && zufall() < profil.zufallszuege) {
    const zug = zufallszug(fen, zufall);
    if (zug) return zug;
  }
  if (buchzuege.length > 0 && zufall() < buchtreue) {
    const buchzug = zufallsauswahl(buchzuege, zufall);
    if (buchzug) return { uci: buchzug, quelle: "buch", fehler: null, verlust: 0 };
  }
  const werte = menschenwerteAus(profil);
  if (!stufe.grund && !hatZusatzfehler(werte)) return engineZug(bewerter, fen, stufe, profil.stil);
  const kontext = {
    wertung: stufe.wertung,
    restMs: profil.restMs ?? null,
    verlauf: profil.verlauf ?? RUHIGER_VERLAUF,
    stil: profil.stil,
  };
  return menschlicheWahl(bewerter, fen, stufe, werte, kontext, zufall);
}
