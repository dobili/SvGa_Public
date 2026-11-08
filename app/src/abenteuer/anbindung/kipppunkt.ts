/**
 * Kipppunkt einer verlorenen Partie (Regelwerk R14; Entscheidung B1 des Autors): die letzte
 * Stellung mit dem Leser am Zug, die noch nicht gekippt war, als Start für den Wiedereinstieg.
 *
 * Rolle im Gesamtbild: Nach einer Niederlage bietet Ambrose an, „noch einmal von hier“ zu
 * spielen. Die Suche geht vom Ende rückwärts über die Stellungen, in denen der Leser am Zug war,
 * und nimmt die erste, deren Bewertung aus seiner Sicht innerhalb ±KIPPGRENZE Bauern liegt. Die
 * Bewertung liefert ein Bewerter (in der App die Auswertungs-Engine mit kleiner Tiefe), damit
 * die Suche ohne Engine prüfbar ist. Höchstens HOECHSTENS_STELLUNGEN Bewertungen, damit das
 * Angebot nach ein paar Sekunden da ist.
 * Abhängigkeiten: spiel/partie.ts (Stellungen, Züge), spiel/phasen.ts, schnittstelle/partie.ts.
 * Beispiel: Leser Weiß verliert im 30. Zug, der grobe Fehler fiel im 22. Zug → Kipppunkt ist die
 * Stellung vor dem 22. Zug (Halbzug 42), Bewertung +0,3.
 */
import { phasenJeStellung } from "../../spiel/phasen";
import { stellungen, type Partie } from "../../spiel/partie";
import type { Kipppunkt } from "../schnittstelle/partie";

/** Bewertung einer Stellung aus Sicht einer Farbe in Bauern (positiv = gut für diese Farbe). */
export type Bewerter = (
  fen: string,
  farbe: Partie["einstellung"]["eigeneFarbe"],
) => Promise<number>;

/** Noch nicht gekippt: Bewertung innerhalb dieser Grenze (R14, Punkt 3). */
export const KIPPGRENZE = 1.0;
/** Der Kipppunkt liegt nach Zug 10 (R14, Punkt 4). */
export const FRUEHESTER_HALBZUG = 20;
/** Höchstens so viele Stellungen werden bewertet (etwa 10 Sekunden mit kleiner Tiefe). */
export const HOECHSTENS_STELLUNGEN = 20;

/**
 * Sucht den Kipppunkt. Null, wenn die Partie nicht verloren ist, zu kurz war oder keine
 * Stellung im Fenster liegt.
 */
export async function sucheKipppunkt(partie: Partie, bewerte: Bewerter): Promise<Kipppunkt | null> {
  if (!partie.ende || !("sieger" in partie.ende)) return null;
  const farbe = partie.einstellung.eigeneFarbe;
  if (partie.ende.sieger === farbe) return null;
  const fens = stellungen(partie);
  const phasen = phasenJeStellung(partie);
  // Halbzüge, in denen der Leser gezogen hat, vom letzten zum ersten; das ist die Stellung vor
  // seinem Zug (Index = Halbzug).
  const kandidaten = partie.zuege
    .map((zug, halbzug) => ({ zug, halbzug }))
    .filter(({ zug, halbzug }) => zug.von === "leser" && halbzug >= FRUEHESTER_HALBZUG)
    .reverse()
    .slice(0, HOECHSTENS_STELLUNGEN);
  let letzterWert: number | null = null;
  for (const { zug, halbzug } of kandidaten) {
    const fen = fens[halbzug];
    if (!fen) continue;
    const wert = await bewerte(fen, farbe);
    if (Math.abs(wert) <= KIPPGRENZE) {
      const verlust = letzterWert === null ? 0 : Math.max(0, wert - letzterWert);
      return {
        halbzug,
        fen,
        bewertung: wert,
        fehler: {
          halbzug,
          fen,
          gespielt: zug.san,
          besser: null,
          klasse: verlust >= PATZER_AB ? "patzer" : "fehler",
          verlust: Math.round(verlust * 100) / 100,
          buchbezug: null,
          wessen: "leser",
          phase: phasen[halbzug] ?? "mittelspiel",
        },
      };
    }
    letzterWert = wert;
  }
  return null;
}

/** Ab diesem Verlust in Bauern heißt der Zug Patzer (wie in partieergebnis.ts). */
const PATZER_AB = 3;
