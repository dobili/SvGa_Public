/**
 * Tischgespräch (docs/spiel/29_Tischgespraech.md, Abschnitte 3 und 4): Wann sagt der Gegner oder
 * Ambrose etwas zu einem Ereignis der Partie, und in welchem Ton?
 *
 * Rolle im Gesamtbild: reine Regeln ohne React. regeln/tischereignisse.ts erkennt die Ereignisse,
 * diese Datei wählt mit festem Zufall je Partie, wer spricht (Wahrscheinlichkeit, Pause,
 * Höchstzahl), anbindung/tischtexte.ts sucht die Zeile, anbindung/Tischgespraech.tsx zeigt sie.
 * Grundsatz wie bei den Partiemomenten: Alles folgt aus dem Verlauf und der Kennung der Partie;
 * nach dem Neuladen ist der Plan derselbe, ohne Speicher.
 * Leitsatz 5 (docs/spiel/19): kein Spott bei Niederlage oder nicht geschafftem Rätsel; dafür
 * sorgen die Texte, die Regeln legen nur fest, wer wann spricht.
 * Abhängigkeiten: regeln/tischereignisse.ts, regeln/partiemomente.ts (Typ des Verlaufs).
 */
import type { Gegnerrolle } from "../schnittstelle/gegnerprofil";
import type { Partieverlauf } from "./partiemomente";
import { tischereignis, type Partieereignis, type Tischereignis } from "./tischereignisse";

/** Temperamente der Gegner (Abschnitt 4), wie im Schema der Gegner. */
export const TEMPERAMENTE = [
  "frech",
  "herzlich",
  "trocken",
  "ehrgeizig",
  "kuehl",
  "verschmitzt",
] as const;

export type Temperament = (typeof TEMPERAMENTE)[number];

/** Vorgabe je Rolle, wenn gegner.json kein Temperament nennt. */
const TEMPERAMENT_DER_ROLLE: Readonly<Record<Gegnerrolle, Temperament>> = {
  strasse: "frech",
  clubmitglied: "herzlich",
  clubchef: "trocken",
  turnier: "ehrgeizig",
  story: "trocken",
};

/** Wer Aufgaben stellt und kein Profil hat, spricht wie ein Rätselsteller. */
export const TEMPERAMENT_DER_RAETSEL: Temperament = "verschmitzt";

/**
 * Das Temperament eines Gegners: die Angabe in gegner.json, sonst die Vorgabe der Rolle.
 * Beispiel: Skater Jo (strasse, ohne Angabe) → „frech“; Big Joe (clubchef, „herzlich“) → „herzlich“.
 */
export function temperamentVon(profil: {
  readonly rolle: Gegnerrolle;
  readonly temperament?: Temperament;
}): Temperament {
  return profil.temperament ?? TEMPERAMENT_DER_ROLLE[profil.rolle];
}

/** Regeln der Häufigkeit (Abschnitt 3). */
export const TISCHREGELN = {
  /** Wahrscheinlichkeit, dass zu einem Ereignis jemand spricht. */
  chance: 0.35,
  /** So viele Halbzüge schweigt der Tisch nach einer Zeile mindestens. */
  pauseHalbzuege: 4,
  /** Höchstens so viele Zeilen je Partie (ohne die Zeilen, die immer kommen). */
  hoechstens: 6,
} as const;

/** Diese Ereignisse sprechen immer: der Rückstand und das Ende der Partie. */
const IMMER: ReadonlySet<Tischereignis> = new Set(["hinten", "sieg", "remis", "niederlage"]);

/** Zu diesen Ereignissen spricht Ambrose unten (Abschnitt 3, „Wer antwortet“). */
const AMBROSE_SPRICHT: ReadonlySet<Tischereignis> = new Set(["hinten", "zeitnot", "hinweis"]);

const FNV_START = 2166136261;
const FNV_FAKTOR = 16777619;
const ZWEI_HOCH_32 = 4294967296;
/** Nachmischen nach MurmurHash3 (Schiebeweiten und Faktor). */
const MISCH_SCHIEB_1 = 16;
const MISCH_SCHIEB_2 = 13;
const MISCH_FAKTOR = 0x85ebca6b;

/**
 * Fester Zufall aus Text: dieselbe Kennung und derselbe Teil geben immer dieselbe Zahl in [0, 1).
 * Warum: Der Zufall ist je Partie fest (Kennung der Partie als Startwert), damit Neuladen nichts
 * ändert. Beispiel: festerZufall("p1", "7:schach") ist bei jedem Aufruf gleich.
 */
export function festerZufall(kennung: string, teil: string): number {
  let h = FNV_START;
  for (const zeichen of `${kennung}|${teil}`) {
    h = (h ^ (zeichen.codePointAt(0) ?? 0)) >>> 0;
    h = Math.imul(h, FNV_FAKTOR) >>> 0;
  }
  // Nachmischen, damit ähnliche Texte weit auseinanderliegen.
  h = (h ^ (h >>> MISCH_SCHIEB_1)) >>> 0;
  h = Math.imul(h, MISCH_FAKTOR) >>> 0;
  h = (h ^ (h >>> MISCH_SCHIEB_2)) >>> 0;
  return h / ZWEI_HOCH_32;
}

/** Eine gesprochene Zeile im Plan der Partie. */
export interface Tischzeile {
  readonly halbzug: number;
  readonly ereignis: Partieereignis;
  readonly sprecher: "gegner" | "ambrose";
}

/**
 * Alle Zeilen, die im bisherigen Verlauf gesprochen haben, in der Reihenfolge der Halbzüge.
 *
 * Eingaben: Verlauf, Kennung der Partie (Startwert des Zufalls), ob Ambrose da ist.
 * Ausgabe: je gesprochenem Ereignis eine Zeile des Gegners, bei `hinten` dazu eine Ambroses.
 * Beispiel: Der Gegner schlägt im 9. Halbzug einen Läufer, der Zufall sagt ja → Zeile des Gegners
 * bei Halbzug 9; bis Halbzug 13 schweigt der Tisch danach.
 * Sonderfälle: `hinten` spricht immer, auch in der Pause und über der Höchstzahl.
 */
export function tischplan(
  verlauf: Partieverlauf,
  kennung: string,
  ambroseDa: boolean,
): readonly Tischzeile[] {
  const plan: Tischzeile[] = [];
  let zuletzt = -Infinity;
  let gezaehlt = 0;
  for (let h = 1; h <= verlauf.vomHelden.length; h++) {
    const ereignis = tischereignis(verlauf, h);
    if (!ereignis) continue;
    const immer = IMMER.has(ereignis);
    if (!immer && !spricht(kennung, `${h}:${ereignis}`, h - zuletzt, gezaehlt)) continue;
    plan.push({ halbzug: h, ereignis, sprecher: "gegner" });
    if (ambroseDa && AMBROSE_SPRICHT.has(ereignis)) {
      plan.push({ halbzug: h, ereignis, sprecher: "ambrose" });
    }
    zuletzt = h;
    if (!immer) gezaehlt++;
  }
  return plan;
}

/** Spricht jemand? Pause und Höchstzahl, dann der feste Zufall. */
function spricht(kennung: string, teil: string, abstand: number, gezaehlt: number): boolean {
  if (abstand <= TISCHREGELN.pauseHalbzuege || gezaehlt >= TISCHREGELN.hoechstens) return false;
  return festerZufall(kennung, teil) < TISCHREGELN.chance;
}

/**
 * Würfelt mit festem Zufall, ob zu einem Ereignis ohne Halbzug (Zeitnot, Rätsel) jemand spricht.
 * Beispiel: zufallSprichtBei("runde-1", "3:richtig") → true in etwa 35 von 100 Fällen.
 */
export function zufallSprichtBei(kennung: string, teil: string): boolean {
  return festerZufall(kennung, teil) < TISCHREGELN.chance;
}

/** Spricht Ambrose zu diesem Ereignis unten? (Ohne `falsch`: das zählt erst beim zweiten Mal.) */
export function ambroseSprichtZu(ereignis: Tischereignis): boolean {
  return AMBROSE_SPRICHT.has(ereignis);
}

/** Ab so vielen falschen Antworten in Folge spricht Ambrose (Abschnitt 3). */
export const FALSCH_BIS_AMBROSE = 2;

/** Lage der Rätselrunde, wenn ein Ereignis eintritt. */
export interface Raetsellage {
  /** Kennung der Runde (Startwert des Zufalls). */
  readonly kennung: string;
  /** Index der Aufgabe in der Runde. */
  readonly aufgabe: number;
  /** Falsche Antworten in Folge, diese eingeschlossen. */
  readonly falschInFolge: number;
  /** Bei welcher Aufgabe zuletzt jemand sprach (null: noch nie). */
  readonly gesprochenBei: number | null;
  /** Ist Ambrose da und nicht selbst der, der die Aufgaben stellt? */
  readonly ambroseDa: boolean;
}

/**
 * Wer spricht zu einem Ereignis der Rätsel: wer die Aufgaben stellt (oben), Ambrose (unten) oder
 * niemand. Höchstens eine Zeile je Aufgabe.
 * Beispiel: zweite falsche Antwort in Folge, Ambrose da → „ambrose“; „hinweis“ ohne Ambrose →
 * null; „serie“ → immer „steller“; „richtig“ → in etwa 35 von 100 Fällen „steller“.
 */
export function raetselsprecher(
  ereignis: "richtig" | "falsch" | "hinweis" | "serie" | "letzte",
  lage: Raetsellage,
): "steller" | "ambrose" | null {
  if (lage.gesprochenBei === lage.aufgabe) return null;
  if (ereignis === "hinweis") return lage.ambroseDa ? "ambrose" : null;
  if (ereignis === "falsch" && lage.falschInFolge >= FALSCH_BIS_AMBROSE && lage.ambroseDa) {
    return "ambrose";
  }
  if (ereignis === "serie") return "steller";
  return zufallSprichtBei(lage.kennung, `${lage.aufgabe}:${ereignis}`) ? "steller" : null;
}

/**
 * Die Nummer der Zeile (1 bis anzahl) beim `nutzung`-ten Gebrauch derselben Gruppe, ohne
 * Wiederholung, bis alle einmal dran waren; die Reihenfolge ist je Partie fest gemischt.
 * Beispiel: anzahl 4, nutzung 0 bis 3 → vier verschiedene Nummern; nutzung 4 beginnt von vorn.
 * Sonderfall: anzahl 0 → 0 (keine Zeile).
 */
export function zeilennummer(anzahl: number, nutzung: number, kennung: string, gruppe: string) {
  if (anzahl <= 0) return 0;
  const reihe = Array.from({ length: anzahl }, (_, i) => i + 1);
  // Mischen nach Fisher und Yates mit festem Zufall je Gruppe.
  for (let i = anzahl - 1; i > 0; i--) {
    const j = Math.floor(festerZufall(kennung, `${gruppe}:${i}`) * (i + 1));
    [reihe[i], reihe[j]] = [reihe[j] ?? i + 1, reihe[i] ?? j + 1];
  }
  return reihe[nutzung % anzahl] ?? 1;
}
