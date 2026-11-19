/**
 * Wertung je Zeitklasse für die Abenteuerwertung A (Wunsch des Autors, 19.11.2026): Bei
 * Begegnungen mit Zeitwahl (Deckwahl: ohne Uhr, Schnellschach, Blitz) rechnet das Spiel eine
 * Partie so wie die App in ihrer Zeitklasse und hebt das Ergebnis zurück auf den
 * Schnellschach-Maßstab, auf dem A steht.
 *
 * Rolle im Gesamtbild: reine Funktionen für regeln/wertung.ts (nachStoryPartie) und
 * regeln/rueckweg.ts. Die App liefert alles, hier wird nur importiert:
 * - spiel/elomodell.ts `wertungstempo`: Uhr → blitz, rapid oder classical (ohne Uhr rapid).
 * - engine/zeitklassenabstand.ts `wertungInZeitklasse`, `zahlInZeitklasse`: dieselbe Zahl als
 *   Blitz- oder Klassisch-Zahl desselben Menschen (Lichess-Profile, Abstand bei Einsteigern um
 *   −200 im Blitz).
 * - engine/botstaerke.ts `uhrAbzug`: was die Uhr einen Bot dieser Stufen kostet (derzeit überall 0).
 * Regel (wie die App, spiel/wertung.ts, wertungspunktFuer, Wertung je Zeitklasse):
 * 1. Klasse der Partie: `wertungstempo` der gewählten Uhr; die genutzte Zeit stuft nur herab
 *    (regeln/zeitwertung.ts, ab 20 eigenen Zügen). Ohne Uhr: Schnellschach.
 * 2. A und die Zielstärke Z des Gegners in dieser Klasse: A_k = wertungInZeitklasse(A),
 *    Z_k = zahlInZeitklasse(Z) + uhrAbzug (die Gegnerzahl je Zeitklasse wie in der App; der
 *    Bot spielt in der App wie ein Mensch dieser Klasse, engine/wahlkorrektur.ts).
 * 3. Elo-Schritt in der Klasse: A_k' = A_k + K · Gewicht · (Ergebnis − Erwartung(A_k, Z_k)),
 *    Gewicht 0,5 für Blitz, sonst 1 (Entscheidung des Autors, 19.11.2026, GEWICHT_DER_KLASSE).
 * 4. Zurück auf Schnellschach mit derselben Abstandsrechnung: A' = die Schnellschach-Zahl, deren
 *    Klassenzahl A_k' ist.
 * Warum das Gewicht: Ohne es zählte eine Blitzpartie für A so viel wie eine Schnellschachpartie,
 * bei Einsteigern sogar etwas mehr. Spieler und Gegner werden um denselben Abstand verschoben, die
 * Erwartung bleibt fast gleich, und die Blitz-Skala ist dort gestaucht (1000 → 882, 1290 → 1121),
 * ein Blitz-Punkt ist also bis zu ein Viertel mehr Schnellschach-Punkte. Der Autor wollte, dass
 * eine geblitzte Niederlage A weniger senkt und ein geblitzter Sieg nicht mehr bringt als nötig.
 * Folge (Lichess-Abstände, K = 20; in Klammern der Schritt in Schnellschach):
 * Clubchef 1 in Maple Falls (A = 800, Z = 1020): Niederlage im Blitz → 797,0 (795,6), Sieg →
 * 808,6 (815,6). A = 1000 gegen Z = 1000: Niederlage 993,6 (990), Sieg 1006,4 (1010).
 * A = 1500 gegen Z = 1700: Sieg 1507,6 (1515,2), Niederlage 1497,8 (1495,2).
 * Abhängigkeiten: spiel/elomodell.ts, spiel/wertung.ts (erwartung), engine/zeitklassenabstand.ts,
 * engine/botstaerke.ts, engine/stufen.ts (Typ), regeln/zeitwertung.ts.
 */
import { uhrAbzug } from "../../engine/botstaerke";
import type { Stufennummer } from "../../engine/stufen";
import { wertungInZeitklasse, zahlInZeitklasse } from "../../engine/zeitklassenabstand";
import type { Phase } from "../../schach/phase";
import { WERTUNGSTEMPI, wertungstempo, type Wertungstempo } from "../../spiel/elomodell";
import { erwartung } from "../../spiel/wertung";
import { zeitwertung, type Uhrbilanz, type Zeitwertungsklasse } from "./zeitwertung";

/** Die Zeitklasse der Wertung zu einer Klasse der Zeitwertung (A und die App kennen kein Bullet). */
const TEMPO_DER_KLASSE: Readonly<Record<Zeitwertungsklasse, Wertungstempo>> = {
  bullet: "blitz",
  blitz: "blitz",
  schnell: "rapid",
  klassisch: "classical",
};
/** Schritte der Umkehrung (die Abstandskurve ist flach; 8 genügen auf 0,01 Elo). */
const UMKEHR_SCHRITTE = 8;
/**
 * Gewicht von K je Zeitklasse (Entscheidung des Autors, 19.11.2026): Eine Blitzpartie zählt für A
 * halb, wie beim Weltschachbund, wo Blitz die Zahl für lange Partien nicht berührt.
 */
export const GEWICHT_DER_KLASSE: Readonly<Record<Wertungstempo, number>> = {
  blitz: 0.5,
  rapid: 1,
  classical: 1,
};
const MS_JE_SEKUNDE = 1000;

/** Uhr einer Begegnung im Spielstand (Sekunden und Zuschlag, wie schnittstelle/partie.ts). */
export interface Spieluhr {
  readonly sekunden: number;
  readonly zuschlag: number;
}

/** Was die Wertung über die Zeit der Partie wissen muss. */
export interface Zeitlage {
  /** Durfte der Leser die Bedenkzeit wählen (Deckwahl)? Sonst bleibt alles wie bisher. */
  readonly zeitwahl: boolean;
  readonly uhr: Spieluhr | null;
  /** Uhrstand am Ende aus Sicht des Lesers (null ohne Uhr oder unbekannt). */
  readonly bilanz: Uhrstandende | null;
  /** Abzug der Uhr für den Bot (beim Start gerechnet, abzugDerUhr). */
  readonly abzug: number;
}

/** Der Uhrstand am Ende einer Partie aus Sicht des Lesers (für regeln/zeitwertung.ts). */
export type Uhrstandende = Pick<Uhrbilanz, "eigeneZuege" | "begann" | "restMs">;

/** Uhr des Spiels in Millisekunden (wie anbindung/partiestart.ts). */
function inMs(uhr: Spieluhr): { grundzeitMs: number; zuschlagMs: number } {
  return { grundzeitMs: uhr.sekunden * MS_JE_SEKUNDE, zuschlagMs: uhr.zuschlag * MS_JE_SEKUNDE };
}

/**
 * Die Zeitklasse, in der die Partie gewertet wird.
 * Beispiel: Zeitwahl Schnellschach 10 + 5, im Schnitt 4 s je Zug über 25 Züge → „blitz“;
 * Zeitwahl Blitz → „blitz“; ohne Uhr oder ohne Zeitwahl → „rapid“.
 */
export function wertungsklasse(lage: Zeitlage): Wertungstempo {
  if (!lage.zeitwahl || !lage.uhr) return "rapid";
  const uhr = inMs(lage.uhr);
  const eingestellt = wertungstempo(uhr);
  const genutzt = lage.bilanz ? zeitwertung({ ...uhr, ...lage.bilanz }) : null;
  if (!genutzt) return eingestellt;
  const effektiv = TEMPO_DER_KLASSE[genutzt.gewertet];
  return WERTUNGSTEMPI.indexOf(effektiv) < WERTUNGSTEMPI.indexOf(eingestellt)
    ? effektiv
    : eingestellt;
}

/**
 * Die Schnellschach-Zahl zu einer Zahl in einer Zeitklasse (Umkehrung von wertungInZeitklasse).
 * Beispiel: Blitz 1090 → Schnellschach etwa 1290.
 */
export function schnellschachAus(wert: number, tempo: Wertungstempo): number {
  if (tempo === "rapid") return wert;
  let schnell = wert;
  for (let i = 0; i < UMKEHR_SCHRITTE; i += 1) {
    schnell -= wertungInZeitklasse(schnell, tempo) - wert;
  }
  return schnell;
}

/**
 * Ein Elo-Schritt von A in der Zeitklasse der Partie, zurück auf Schnellschach (Schritte 2 bis 4
 * im Dateikopf). Eingaben: A (Schnellschach), Zielstärke Z (Schnellschach-Maßstab der Gegner),
 * Ergebnis (1, ½, 0), K, Zeitklasse, Abzug der Uhr für den Bot. Ausgabe: neues A, ungerundet.
 * Beispiel: rapid → A + K · (s − E(A, Z)), wie bisher.
 */
export function schrittInKlasse(
  a: number,
  z: number,
  ergebnis: number,
  k: number,
  tempo: Wertungstempo,
  abzug: number,
): number {
  if (tempo === "rapid" && abzug === 0) return a + k * (ergebnis - erwartung(a, z));
  const aKlasse = wertungInZeitklasse(a, tempo);
  const zKlasse = zahlInZeitklasse(z, tempo) + abzug;
  const gewichtet = k * GEWICHT_DER_KLASSE[tempo];
  const neu = aKlasse + gewichtet * (ergebnis - erwartung(aKlasse, zKlasse));
  return schnellschachAus(neu, tempo);
}

/**
 * Abzug der Uhr für den Bot dieser Stufen (engine/botstaerke.ts, derzeit überall 0), beim Start
 * der Partie gerechnet; ohne Zeitwahl oder Uhr 0.
 */
export function abzugDerUhr(
  zeitwahl: boolean,
  uhr: Spieluhr | null,
  stufenJePhase: Readonly<Record<Phase, Stufennummer>>,
): number {
  if (!zeitwahl || !uhr) return 0;
  return uhrAbzug(stufenJePhase, inMs(uhr));
}
