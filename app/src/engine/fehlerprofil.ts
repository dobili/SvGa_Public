/**
 * Fehlerprofile je Phase und Stufe: wie wahrscheinlich welche Fehlerart ist.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (17.10.2026): die typischen Fehler von Menschen je
 * Niveau und Phase als Vorgaben für die Engine. Die Fehlersuche (engine/fehlersuche.ts) wählt
 * unter den gefundenen Fehlerzügen gewichtet nach diesem Profil; die Fehlerquote je Stufe bleibt
 * (engine/stufen.ts). Die Gewichte folgen der Liste in docs/ENTSCHEIDUNGEN.md: Einsteiger
 * (Stufe 1 und 2) lassen Figuren hängen, übersehen Drohungen, ziehen die Dame zu früh, rochieren
 * nicht und setzen patt; Anfänger (Stufe 3 und 4) machen vor allem kleinere Fehler: Tempoverlust,
 * Bauernraub, geschwächter Königsschild, falscher Abtausch, passiver König, Bauernvorstoß.
 * Abhängigkeiten: fehlerart.ts (Fehlerart), schach/phase.ts (Phase), stufen.ts (Stufennummer).
 */
import type { Phase } from "../schach/phase";
import type { Fehlerart } from "./fehlerart";
import type { Stufennummer } from "./stufen";

type Gewichte = Readonly<Partial<Record<Fehlerart, number>>>;
type Niveau = "einsteiger" | "anfaenger";

/** Ab dieser Stufe gilt das Profil „Anfänger“ statt „Einsteiger“. */
const ANFAENGER_AB: Stufennummer = 3;

const PROFIL: Readonly<Record<Niveau, Readonly<Record<Phase, Gewichte>>>> = {
  einsteiger: {
    eroeffnung: {
      figurHaengen: 3,
      drohungIgnoriert: 3,
      verfruehteDame: 3,
      koenigMitte: 2,
      bauernraub: 2,
      tempoverlust: 2,
      schlagreflex: 2,
      taktikUebersehen: 1,
    },
    mittelspiel: {
      figurHaengen: 3,
      drohungIgnoriert: 3,
      schlagreflex: 2,
      taktikUebersehen: 2,
      koenigsschild: 1,
      falscherAbtausch: 1,
    },
    endspiel: {
      figurHaengen: 2,
      drohungIgnoriert: 2,
      pattGesetzt: 2,
      koenigPassiv: 2,
      bauernvorstoss: 2,
      taktikUebersehen: 1,
    },
  },
  anfaenger: {
    eroeffnung: {
      tempoverlust: 3,
      bauernraub: 2,
      koenigMitte: 2,
      taktikUebersehen: 2,
      verfruehteDame: 1,
      drohungIgnoriert: 1,
      figurHaengen: 1,
    },
    mittelspiel: {
      taktikUebersehen: 3,
      koenigsschild: 2,
      falscherAbtausch: 2,
      schlagreflex: 1,
      drohungIgnoriert: 1,
      figurHaengen: 1,
    },
    endspiel: {
      koenigPassiv: 3,
      bauernvorstoss: 3,
      taktikUebersehen: 2,
      falscherAbtausch: 1,
      pattGesetzt: 1,
      drohungIgnoriert: 1,
    },
  },
};

/** Fehlerarten ohne Eintrag im Profil bekommen dieses Gewicht (sie bleiben möglich, aber selten). */
const GRUNDGEWICHT = 0.5;

/**
 * Das Gewicht einer Fehlerart in einer Phase auf einer Stufe; „ungenau“ hat immer 0.
 * Beispiel: Stufe 1, Eröffnung, verfrühte Dame → 3; Stufe 4, Endspiel, passiver König → 3.
 */
export function gewicht(phase: Phase, stufe: Stufennummer, art: Fehlerart): number {
  if (art === "ungenau") return 0;
  const niveau: Niveau = stufe >= ANFAENGER_AB ? "anfaenger" : "einsteiger";
  return PROFIL[niveau][phase][art] ?? GRUNDGEWICHT;
}

/**
 * Wählt gewichtet zufällig aus Kandidaten; ohne positives Gesamtgewicht gleichverteilt.
 * Eingaben: Kandidaten, Gewicht je Kandidat, Zufallsquelle (0 bis 1).
 * Beispiel: zwei Kandidaten mit Gewicht 3 und 1, Zufall 0,5 → der erste (0,5 · 4 = 2 < 3).
 */
export function gewichteteWahl<T>(
  kandidaten: readonly T[],
  gewichtVon: (k: T) => number,
  zufall: () => number,
): T | undefined {
  const gewichte = kandidaten.map(gewichtVon);
  const summe = gewichte.reduce((a, b) => a + b, 0);
  if (summe <= 0) return kandidaten[Math.floor(zufall() * kandidaten.length)];
  let rest = zufall() * summe;
  for (let i = 0; i < kandidaten.length; i += 1) {
    rest -= gewichte[i] ?? 0;
    if (rest < 0) return kandidaten[i];
  }
  return kandidaten[kandidaten.length - 1];
}
