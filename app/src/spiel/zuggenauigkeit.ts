/**
 * Genauigkeit nach der Rechnung von Lichess: Gewinnwahrscheinlichkeit aus dem Wert,
 * Genauigkeit eines Zuges, Gewichte je Zug und Genauigkeit der Partie.
 *
 * Rolle im Gesamtbild: die offen dokumentierte Rechnung von Lichess, auf der Genauigkeit,
 * Spielstärke und Urteilswort aufbauen (spiel/genauigkeit.ts, spiel/messung/genauigkeitsmodell.ts).
 * Reine Funktionen ohne Zustand.
 * Warum eigene Datei: spiel/genauigkeit.ts lag über 400 Zeilen (Regel 4 in CLAUDE.md); die
 * Rechnung ist ein eigener, in sich geschlossener Teil. spiel/genauigkeit.ts gibt sie weiter,
 * damit alle Importe gleich bleiben.
 * Abhängigkeiten: spiel/auswertung.ts (WERTGRENZE).
 */
import { WERTGRENZE } from "./auswertung";
/** Steilheit der Gewinnwahrscheinlichkeit (Lichess: 0,00368208 je Centibauer). */
const STEILHEIT = 0.00368208;
const CENTI = 100;
const HALB = 50;
const PROZENT = 100;
/** Lichess: Genauigkeit eines Zuges = 103,1668 · e^(−0,04354 · Verlust in Prozentpunkten) − 3,1669. */
const GENAUIGKEIT_FAKTOR = 103.1668;
const GENAUIGKEIT_ABFALL = 0.04354;
const GENAUIGKEIT_VERSATZ = 3.1669;
/**
 * Lichess: Das Gewicht eines Zuges ist die Standardabweichung der Gewinnwahrscheinlichkeit in einem
 * Fenster, das mit der Stellung nach dem Zug endet; Fensterbreite ein Zehntel der Züge (2 bis 8),
 * Gewicht 0,5 bis 12.
 */
const FENSTER_JE_ZUEGE = 10;
const FENSTER_MINDESTENS = 2;
const FENSTER_HOECHSTENS = 8;
export const GEWICHT_MINDESTENS = 0.5;
const GEWICHT_HOECHSTENS = 12;
/** Kleinste Genauigkeit eines Zuges im harmonischen Mittel; sonst teilt eine 0 alles weg. */
const GENAUIGKEIT_MINDESTENS = 1;

/** Gewinnwahrscheinlichkeit von Weiß in Prozent aus dem Wert in Bauerneinheiten. */
export function gewinnwahrscheinlichkeit(wert: number): number {
  const begrenzt = Math.max(-WERTGRENZE, Math.min(WERTGRENZE, wert));
  return HALB + HALB * (2 / (1 + Math.exp(-STEILHEIT * begrenzt * CENTI)) - 1);
}

/** Genauigkeit eines Zuges (0 bis 100) aus dem Verlust an Gewinnwahrscheinlichkeit (Prozentpunkte). */
export function zuggenauigkeit(verlustProzent: number): number {
  const roh = GENAUIGKEIT_FAKTOR * Math.exp(-GENAUIGKEIT_ABFALL * Math.max(0, verlustProzent));
  return Math.max(0, Math.min(PROZENT, roh - GENAUIGKEIT_VERSATZ));
}

/** Standardabweichung einer Reihe (Lichess: Schwankung der Gewinnwahrscheinlichkeit). */
function standardabweichung(reihe: readonly number[]): number {
  if (reihe.length === 0) return 0;
  const mittel = reihe.reduce((summe, x) => summe + x, 0) / reihe.length;
  const varianz = reihe.reduce((summe, x) => summe + (x - mittel) ** 2, 0) / reihe.length;
  return Math.sqrt(varianz);
}

/**
 * Gewicht je Halbzug für die Genauigkeit der Partie (Lichess): die Schwankung der
 * Gewinnwahrscheinlichkeit im Fenster, das mit der Stellung nach dem Zug endet.
 *
 * Warum: In einer längst gewonnenen Stellung ist jeder Zug „genau“; ohne Gewichtung gleichen
 * dreißig solcher Züge den Fehler aus, der die Partie entschieden hat.
 * Eingabe: Werte je Stellung (Startstellung bis Ende). Ausgabe: ein Gewicht je Zug.
 * Beispiel: Beispielpartie des Autors (17.10.2026, 1. d4 Sf6 2. Lg5 Sh5? 3. Sf3? Sf4?? 4. e3?? …,
 * 73 Halbzüge), Fenster 7: die Züge 1 bis 8 (Werte zwischen 0 und +7)
 * wiegen 12, die Züge ab 25 (Wert immer um +10) wiegen 0,5.
 */
export function zuggewichte(werte: readonly number[]): number[] {
  const wahrscheinlichkeiten = werte.map(gewinnwahrscheinlichkeit);
  const zuege = Math.max(0, werte.length - 1);
  const fenster = Math.max(
    FENSTER_MINDESTENS,
    Math.min(FENSTER_HOECHSTENS, Math.floor(zuege / FENSTER_JE_ZUEGE)),
  );
  return Array.from({ length: zuege }, (_, i) => {
    const ende = Math.min(wahrscheinlichkeiten.length, Math.max(fenster, i + 2));
    const ausschnitt = wahrscheinlichkeiten.slice(Math.max(0, ende - fenster), ende);
    const schwankung = standardabweichung(ausschnitt);
    return Math.max(GEWICHT_MINDESTENS, Math.min(GEWICHT_HOECHSTENS, schwankung));
  });
}

/**
 * Genauigkeit einer Seite (Lichess): Mittel aus dem gewichteten Mittel und dem harmonischen Mittel
 * der Zuggenauigkeiten; null ohne Züge. Mit `polster` unter 1 zählen Züge in entschiedener
 * Stellung (`entschieden`) in beiden Mitteln nur mit diesem Faktor (seit 0.2.83, Modus).
 * Beispiel: Beispielpartie des Autors (siehe zuggewichte), Weiß: einfaches Mittel 97, gewichtet 84, harmonisch 90 → 87 (chess.com
 * 86,8). Sonderfall: Eine Zuggenauigkeit unter 1 zählt im harmonischen Mittel als 1.
 */
export function partiegenauigkeit(
  zuege: readonly {
    readonly genauigkeit: number;
    readonly gewicht: number;
    readonly entschieden?: boolean;
  }[],
  polster = 1,
): number | null {
  let gewichtet = 0;
  let gewichte = 0;
  let anzahl = 0;
  let kehrwerte = 0;
  for (const z of zuege) {
    const faktor = z.entschieden ? polster : 1;
    gewichtet += z.genauigkeit * z.gewicht * faktor;
    gewichte += z.gewicht * faktor;
    anzahl += faktor;
    kehrwerte += faktor / Math.max(GENAUIGKEIT_MINDESTENS, z.genauigkeit);
  }
  if (gewichte <= 0 || kehrwerte <= 0) return null;
  return (gewichtet / gewichte + anzahl / kehrwerte) / 2;
}
