/**
 * Engine-Folgen einer ausgewerteten Partie als Abzweige: „Besser war …“ und „So wird bestraft“.
 *
 * Rolle im Gesamtbild: Ergänzung des Autors (1.11.2026): Auf Wunsch (Schalter „Engine-Folgen
 * übernehmen“, Vorgabe aus) legt die App an jedem Fehler, Patzer und verpassten Gewinn des Lesers
 * die Folge des besseren Zuges und die Bestrafung als Abzweige an. Genutzt wird, was die
 * Auswertung schon gespeichert hat (speicher/partieeintrag.ts: beste Züge und Hauptvarianten je
 * Stellung, dieselben Folgen wie im Rückblick, spiel/nebenzweig.ts); fehlt eine Folge, kommt nur
 * der eine beste Zug, gerechnet wird nicht neu. Die Züge tragen die Herkunft „engine“, damit die
 * Leiste sie von eigenen Zügen unterscheidet; jeder Abzweig lässt sich mit „Ab hier löschen“
 * einzeln entfernen. Reine Funktionen.
 * Abhängigkeiten: schach/variationsbaum.ts, schach/variationsaenderung.ts, spiel/zuege.ts,
 * spiel/nebenzweig.ts (welche Klassen eine Strafe zeigen), training/variationen.ts.
 */
import type { Color } from "chessops/types";
import { mitLinie, mitZugdaten } from "../schach/variationsaenderung";
import { fenAm, knotenzahl, type Pfad, type Zugbaum } from "../schach/variationsbaum";
import type { Zugklasse } from "../spiel/auswertung";
import { MIT_STRAFE } from "../spiel/nebenzweig";
import { fenNach, uciZuSan } from "../spiel/zuege";
import { HOECHSTENS_KNOTEN, type Variationsknoten } from "./variationen";
import { linieAlsKnoten } from "./variationsquellen";

/** An diesen Zügen des Lesers kommen die Engine-Folgen in den Baum (Wunsch des Autors). */
export const FOLGEN_BEI: ReadonlySet<Zugklasse> = new Set(["fehler", "patzer", "verpasst"]);

/** Was die Auswertung einer Partie für die Engine-Folgen liefert. */
export interface Partieauswertung {
  readonly startFen: string;
  /** Die Züge der Partie (englische Kurznotation). */
  readonly zuege: readonly string[];
  readonly eigeneFarbe: Color;
  /** Zugklasse je Halbzug (spiel/auswertung.ts, zugurteile); leer ohne Auswertung. */
  readonly klassen: readonly (Zugklasse | null)[];
  /** Bester Zug je Stellung (UCI). */
  readonly beste: readonly string[];
  /** Hauptvariante der Engine je Stellung (UCI, beginnt mit dem besten Zug); darf fehlen. */
  readonly varianten: readonly (readonly string[])[];
}

/** Kurze Kommentare am ersten Zug jeder Folge (aus den Sprachdateien). */
export interface Folgentexte {
  readonly besser: string;
  readonly strafe: string;
}

/** Eine Folge in UCI ab ``fen`` als Kurznotation; bricht beim ersten unmöglichen Zug ab. */
function alsKurznotation(fen: string, uci: readonly string[]): string[] {
  const sans: string[] = [];
  let stellung = fen;
  for (const zug of uci) {
    const san = uciZuSan(stellung, zug);
    const danach = san ? fenNach(stellung, san) : null;
    if (!san || !danach) break;
    sans.push(san);
    stellung = danach;
  }
  return sans;
}

/** Die Folge der Stellung ``index``: Hauptvariante, sonst nur der beste Zug, sonst nichts. */
function folgeAm(auswertung: Partieauswertung, index: number): readonly string[] {
  const variante = auswertung.varianten[index] ?? [];
  if (variante.length > 0) return variante;
  const bester = auswertung.beste[index] ?? "";
  return bester ? [bester] : [];
}

/** Hängt eine Folge an; ist ihr erster Zug neu, bekommt er den Kommentar. */
function mitFolge(baum: Zugbaum, pfad: Pfad, uci: readonly string[], kommentar: string) {
  const fen = fenAm(baum, pfad);
  const sans = fen ? alsKurznotation(fen, uci) : [];
  if (sans.length === 0) return { zuege: baum.zuege, gekuerzt: false };
  if (knotenzahl(baum.zuege) + sans.length > HOECHSTENS_KNOTEN) {
    return { zuege: baum.zuege, gekuerzt: true };
  }
  const linie = mitLinie(baum, pfad, sans, "engine");
  const erster = linie.ersterNeuer;
  const zuege =
    erster && erster.length === pfad.length + 1
      ? mitZugdaten({ startFen: baum.startFen, zuege: linie.zuege }, erster, { kommentar })
      : linie.zuege;
  return { zuege, gekuerzt: linie.abgebrochen };
}

/**
 * Legt die Engine-Folgen an allen Fehlern, Patzern und verpassten Gewinnen des Lesers an.
 *
 * Warum: Der Autor möchte „besserer Zug“ und „Bestrafung“ auf Wunsch gleich im Baum haben, um
 * sie dort zu kommentieren und weiterzuspielen.
 * Eingaben: Baum mit der Partie als Hauptlinie (variationsquellen.ts, ausPartie), Auswertung,
 * Texte. Ausgabe: neuer Baum; „gekürzt“, wenn eine Folge an der Grenze von 600 Zügen oder 30
 * Fortsetzungen nicht mehr passte (die Oberfläche sagt es dem Leser).
 * Beispiel: 1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6?? (Leser Schwarz) → nach 3. Lc4 ein Abzweig mit dem
 * besseren Zug und „Besser war“, nach 3... Sf6 ein Abzweig 4. Dxf7# mit „So wird bestraft“.
 * Sonderfall: Züge des Gegners bekommen keine Folgen; ohne Auswertung bleibt der Baum gleich.
 */
export function mitEngineFolgen(
  baum: Zugbaum,
  auswertung: Partieauswertung,
  texte: Folgentexte,
): { zuege: readonly Variationsknoten[]; gekuerzt: boolean } {
  const { pfad } = linieAlsKnoten(auswertung.startFen, auswertung.zuege);
  const weissBeginnt = auswertung.startFen.split(" ")[1] !== "b";
  let stand = { zuege: baum.zuege, gekuerzt: false };
  auswertung.klassen.forEach((klasse, index) => {
    const weiss = index % 2 === 0 ? weissBeginnt : !weissBeginnt;
    const seite: Color = weiss ? "white" : "black";
    if (!klasse || !FOLGEN_BEI.has(klasse) || seite !== auswertung.eigeneFarbe) return;
    // Ein unlesbarer Partiezug beendet die Hauptlinie; dahinter gibt es keinen Platz für Folgen.
    if (index >= pfad.length) return;
    const hier = () => ({ startFen: baum.startFen, zuege: stand.zuege });
    const besser = mitFolge(hier(), pfad.slice(0, index), folgeAm(auswertung, index), texte.besser);
    stand = { zuege: besser.zuege, gekuerzt: stand.gekuerzt || besser.gekuerzt };
    if (!MIT_STRAFE.has(klasse)) return;
    const strafe = mitFolge(hier(), pfad.slice(0, index + 1), folgeAm(auswertung, index + 1), texte.strafe);
    stand = { zuege: strafe.zuege, gekuerzt: stand.gekuerzt || strafe.gekuerzt };
  });
  return stand;
}
