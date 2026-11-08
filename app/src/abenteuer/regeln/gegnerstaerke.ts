/**
 * Gegnerstärke: aus Zielstärke, Zustand und Wertung des Lesers die Stufe je Phase und die
 * Fehlerhäufigkeit rechnen (docs/spiel/04_Architektur.md, Abschnitt 4; Entscheidung A6).
 *
 * Rolle im Gesamtbild: Das Spiel kennt Gegner nur als Ziel-Elo; die App kennt zehn Stufen zu je
 * 300 Elo (engine/stufen.ts) und eine Fehlerhäufigkeit als Faktor (1 = wie Menschen der Stufe).
 * Diese Datei übersetzt. Reine Funktionen, keine Abhängigkeit von Oberfläche oder Speicher.
 * Abhängigkeiten: engine/stufen.ts (Stufennummer, ELO_JE_STUFE), schnittstelle/gegnerprofil.ts.
 * Regeln: docs/spiel/06_Regelwerk.md, R6 bis R10 (Stufe gerundet, Eichpunkt in der Mitte).
 * Beispiel: Eingangswertung 800, Clubchef 1 (eingang + 220) → Ziel 1020 → Stufe 3 (Eichpunkt
 * 900), Abstand +120 → Häufigkeit 0,76 (spielt genauer als der Durchschnitt der Stufe);
 * abgelenkt mit Faktor 1,4 → 1,07.
 */
import type { Stufennummer } from "../../engine/stufen";
import type { Phase } from "../../schach/phase";
import type {
  Gegnerprofil,
  Gegnerzustand,
  Gerechnetestaerke,
  Zielstaerke,
} from "../schnittstelle/gegnerprofil";

/** Elo je Stufe der App (engine/stufen.ts: zehn Stufen zu je 300). */
export const ELO_JE_STUFE = 300;
const STUFE_MIN: Stufennummer = 1;
const STUFE_MAX: Stufennummer = 10;
/** Unter dieser Wertung spielt niemand; die Bots der Stufe 1 messen etwa 330. */
export const ELO_MIN = 300;
/** Häufigkeit 150 Elo unter dem Eichpunkt einer Stufe (R6); darüber der Kehrwert. */
const HAEUFIGKEIT_BASIS = 1.4;
const HALBE_STUFE = ELO_JE_STUFE / 2;
/** Grenzen der Häufigkeit nach dem Zustandsfaktor (R7) und des Zustandsfaktors selbst (R9). */
const HAEUFIGKEIT_MIN = 0.5;
const HAEUFIGKEIT_MAX = 2.5;
const ZUSTAND_MAX = 2.0;
/** Ohne Wertung (erste Story-Partie, Entscheidung A5) gilt diese Annahme für Einsteiger. */
export const WERTUNG_OHNE = 600;
/** Aufschlag auf die Zielstärke im zweiten Durchlauf (Post-Game, R10). */
export const POST_GAME_AUFSCHLAG = 300;

const PHASEN: readonly Phase[] = ["eroeffnung", "mittelspiel", "endspiel"];

/** Der Ziel-Elo eines Gegners aus seiner Zielstärke und den Wertungen des Lesers. */
export function zielElo(
  staerke: Zielstaerke,
  wertung: { readonly aktuell: number | null; readonly eingang: number | null },
): number {
  const aktuell = wertung.aktuell ?? wertung.eingang ?? WERTUNG_OHNE;
  const eingang = wertung.eingang ?? aktuell;
  switch (staerke.art) {
    case "fest":
      return staerke.elo;
    case "aktuell":
      return aktuell + staerke.versatz;
    case "eingang":
      return eingang + staerke.versatz;
  }
}

/**
 * Die Stufe zu einem Elo-Wert (R6): Z / 300 kaufmännisch gerundet, begrenzt auf 1 bis 10; der
 * Eichpunkt 300 · s liegt in der Mitte der Stufe. 1020 → 3, 1050 → 4, 5000 → 10.
 */
export function stufeZu(elo: number): Stufennummer {
  const stufe = Math.round(Math.max(elo, 1) / ELO_JE_STUFE);
  return Math.min(STUFE_MAX, Math.max(STUFE_MIN, stufe)) as Stufennummer;
}

/**
 * Die Grundhäufigkeit (R6): h₀ = 1,4^(−d / 150) mit d = Z − 300 · s. 150 unter dem Eichpunkt 1,4
 * (mehr Fehler), auf dem Eichpunkt 1,0, 150 darüber etwa 0,71. An den Rändern (unter 150, über
 * 3150) läuft die Formel weiter, damit der Gegner dort nicht plötzlich anders spielt.
 */
export function haeufigkeitZu(elo: number): number {
  const abstand = elo - stufeZu(elo) * ELO_JE_STUFE;
  return HAEUFIGKEIT_BASIS ** (-abstand / HALBE_STUFE);
}

/**
 * Stufe je Phase und Häufigkeit für eine Partie (R1).
 *
 * Eingaben: Profil (Zielstärke, Phasenversatz), Zustand (abgelenkt und überheblich als Faktoren),
 * Wertungen (A und E), Aufschlag auf Z (Post-Game, R10; sonst 0).
 * Ausgabe: Ziel-Elo, Stufe je Phase (mit Versatz, begrenzt auf 1 bis 10), Häufigkeit (Zustand
 * höchstens 2,0, Ergebnis 0,5 bis 2,5, auf zwei Nachkommastellen gerundet).
 */
export function gerechneteStaerke(
  profil: Pick<Gegnerprofil, "staerke" | "phasenversatz">,
  zustand: Pick<Gegnerzustand, "haeufigkeitsfaktor" | "ueberheblich">,
  wertung: { readonly aktuell: number | null; readonly eingang: number | null },
  aufschlag = 0,
): Gerechnetestaerke {
  const ziel = Math.max(ELO_MIN, Math.round(zielElo(profil.staerke, wertung) + aufschlag));
  const grund = stufeZu(ziel);
  const stufenJePhase = Object.fromEntries(
    PHASEN.map((phase) => {
      const versatz = profil.phasenversatz?.[phase] ?? 0;
      const stufe = Math.min(STUFE_MAX, Math.max(STUFE_MIN, grund + versatz));
      return [phase, stufe as Stufennummer];
    }),
  ) as Record<Phase, Stufennummer>;
  const faktor = Math.min(ZUSTAND_MAX, zustand.haeufigkeitsfaktor * zustand.ueberheblich);
  const roh = Math.min(HAEUFIGKEIT_MAX, Math.max(HAEUFIGKEIT_MIN, haeufigkeitZu(ziel) * faktor));
  return { zielElo: ziel, stufenJePhase, haeufigkeit: Math.round(roh * 100) / 100 };
}
