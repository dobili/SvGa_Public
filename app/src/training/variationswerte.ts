/**
 * Engine-Werte im Zugbaum einer Variante: welche Stellungen noch fehlen, Werte eintragen, zählen.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 3 (Entscheidung f = A des Autors, 1.11.2026:
 * „Analyse auf Knopfdruck“). Die Engine rechnet im Hintergrund jede Stellung der Variante
 * (ui/komponenten/varianten/variantenanalyse.ts); hier steht, was davon in den Baum kommt. Die
 * Werte liegen in den Feldern w, b und a der Knoten, die Format 8 schon trägt
 * (training/variationen.ts, Knotendaten): Das Speicherformat ändert sich nicht. Eine Stellung gilt
 * als bewertet, wenn sie einen Wert und einen besten Zug hat (eine Endstellung braucht keinen).
 * Ein Wert ohne besten Zug (etwa aus „[%eval …]“ einer fremden PGN) zeigt den Balken, wird bei der
 * Analyse aber neu gerechnet, weil die Zugarten den besten Zug brauchen (Q12-3).
 * Ergebnisse gehören zu einer Stellung (FEN), nicht zu einem Pfad: Wird ein Zug zur Hauptvariante
 * gemacht oder eine Stellung auf anderem Weg erreicht, bleibt der Wert gültig; neue Züge sind neue
 * Knoten ohne Wert, also rechnet die Engine nach Änderungen nur sie. Reine Funktionen.
 * Abhängigkeiten: chessops, schach/variationsbaum.ts, spiel/auswertung.ts (endwert).
 */
import { makeFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { stellungAus, type Pfad } from "../schach/variationsbaum";
import { endwert } from "../spiel/auswertung";
import type { Knotendaten, Variation, Variationsknoten } from "./variationen";

/** Hundertstel je Bauer: Die Werte stehen als ganze Zahlen im Speicher (Format 8). */
export const HUNDERTSTEL = 100;

/** Das Ergebnis der Engine für eine Stellung, so wie es in den Knoten kommt. */
export interface Engineergebnis {
  /** Wert aus Sicht von Weiß in Hundertstel (Matt als großer Wert, engine/spielbewerter.ts). */
  readonly w: number;
  /** Bester Zug (UCI); fehlt in einer Endstellung. */
  readonly b?: string;
  /** Abstand zum zweitbesten Zug in Hundertstel (0, wenn es nur einen Zug gibt). */
  readonly a: number;
}

/** Eine Stellung des Baums mit ihrem Pfad und ihren Daten (Startstellung: leerer Pfad). */
export interface Baumstellung {
  readonly pfad: Pfad;
  readonly fen: string;
  readonly daten: Knotendaten;
}

/**
 * Alle Stellungen des Baums: Startstellung, dann jeder Zug (Hauptvariante zuerst, Tiefensuche).
 * Ein unmöglicher Zug beendet seinen Ast (wie beim Lesen, training/variationenLesen.ts).
 */
export function baumstellungen(v: Variation): Baumstellung[] {
  const start = stellungAus(v.startFen);
  if (!start) return [];
  const liste: Baumstellung[] = [{ pfad: [], fen: makeFen(start.toSetup()), daten: v.start }];
  const lauf = (zuege: readonly Variationsknoten[], pfad: Pfad, fen: string): void => {
    for (const k of zuege) {
      const pos = stellungAus(fen);
      const zug = pos ? parseSan(pos, k.zug) : undefined;
      if (!pos || !zug) continue;
      pos.play(zug);
      const danach = makeFen(pos.toSetup());
      const weiter = [...pfad, k.zug];
      liste.push({ pfad: weiter, fen: danach, daten: k });
      lauf(k.weiter, weiter, danach);
    }
  };
  lauf(v.zuege, [], liste[0]?.fen ?? v.startFen);
  return liste;
}

/**
 * Ist die Stellung fertig bewertet? Wert und bester Zug, oder Wert in einer Endstellung.
 * Beispiel: { w: 35, b: "e2e4", a: 12 } → ja; { w: 35 } (aus einer fremden PGN) → nein.
 */
export function istBewertet(daten: Knotendaten, fen: string): boolean {
  return daten.w !== undefined && (daten.b !== undefined || endwert(fen) !== null);
}

/** Die Stellungen (FEN, ohne doppelte), denen noch ein Ergebnis fehlt, in Lesereihenfolge. */
export function offeneStellungen(v: Variation): string[] {
  const offen = baumstellungen(v).filter((s) => !istBewertet(s.daten, s.fen));
  return [...new Set(offen.map((s) => s.fen))];
}

/** Wie viele Stellungen bewertet sind und wie viele es gibt (doppelte zählen einmal). */
export function bewertungsstand(v: Variation): { bewertet: number; gesamt: number } {
  const alle = baumstellungen(v);
  const gesamt = new Set(alle.map((s) => s.fen));
  const offen = new Set(alle.filter((s) => !istBewertet(s.daten, s.fen)).map((s) => s.fen));
  return { bewertet: gesamt.size - offen.size, gesamt: gesamt.size };
}

/** Hat irgendeine Stellung einen Wert (dann zeigt die Variante Balken und Schalter)? */
export function hatWerte(v: Variation): boolean {
  return baumstellungen(v).some((s) => s.daten.w !== undefined);
}

/** Knotendaten mit einem Ergebnis; ohne besten Zug fällt ein alter weg. */
function mitErgebnis<T extends Knotendaten>(k: T, e: Engineergebnis): T {
  // Wie in useMarkierstift.ts (mitDaten): Felder nur, wenn sie einen Wert haben.
  const ohneB = Object.fromEntries(Object.entries(k).filter(([feld]) => feld !== "b")) as T;
  return { ...ohneB, w: e.w, a: e.a, ...(e.b ? { b: e.b } : {}) };
}

/**
 * Trägt Ergebnisse in alle Stellungen ein, die noch nicht bewertet sind.
 *
 * Eingaben: Variante, Ergebnisse je FEN. Ausgabe: die Variante mit Werten; dieselbe Variante
 * (gleiches Objekt), wenn sich nichts ändert (dann muss nichts gespeichert werden).
 * Beispiel: Petroff-Falle, Ergebnis für die Stellung nach 3... Sxe4 → dieser Knoten bekommt w, b, a.
 * Sonderfall: Bewertete Stellungen bleiben, wie sie sind (kein Überschreiben einer fertigen Analyse).
 */
export function mitWerten(v: Variation, ergebnisse: ReadonlyMap<string, Engineergebnis>): Variation {
  let geaendert = false;
  const fuer = <T extends Knotendaten>(k: T, fen: string): T => {
    const e = ergebnisse.get(fen);
    if (!e || istBewertet(k, fen)) return k;
    geaendert = true;
    return mitErgebnis(k, e);
  };
  const lauf = (zuege: readonly Variationsknoten[], fen: string): Variationsknoten[] =>
    zuege.map((k) => {
      const pos = stellungAus(fen);
      const zug = pos ? parseSan(pos, k.zug) : undefined;
      if (!pos || !zug) return k;
      pos.play(zug);
      const danach = makeFen(pos.toSetup());
      return { ...fuer(k, danach), weiter: lauf(k.weiter, danach) };
    });
  const startpos = stellungAus(v.startFen);
  if (!startpos) return v;
  const startFen = makeFen(startpos.toSetup());
  const neu = { ...v, start: fuer(v.start, startFen), zuege: lauf(v.zuege, startFen) };
  return geaendert ? neu : v;
}

/** Züge und Werte eines Teilbaums als Text (ohne Kommentare und Marken). */
function teilsignatur(daten: Knotendaten, weiter: readonly Variationsknoten[]): string {
  const kinder = weiter.map((k) => `${k.zug}${teilsignatur(k, k.weiter)}`).join(",");
  return `:${daten.w ?? ""}:${daten.b ?? ""}:${daten.a ?? ""}(${kinder})`;
}

/**
 * Ein Text, der sich genau dann ändert, wenn sich Züge oder Werte ändern, nicht bei Kommentaren
 * oder Marken. Warum: Die Zugarten (spiel/variationsurteile.ts) sind teurer als ein Tastendruck;
 * die Oberfläche rechnet sie nur neu, wenn sich diese Signatur ändert.
 * Beispiel: 1. e4 mit Wert 30 → „…:30:e7e5:5(…)“; ein Kommentar ändert nichts daran.
 */
export function wertesignatur(v: Variation): string {
  return `${v.startFen}${teilsignatur(v.start, v.zuege)}`;
}

/**
 * Die gespeicherte Auswertung einer Partie als Ergebnisse je Stellung, damit eine Variante aus
 * dieser Partie nicht neu rechnen muss (Wunsch des Autors, 1.11.2026: „Warum nimmt man nicht die
 * gespeicherte?“). Gleiche Engine und Tiefe wie die Analyse der Varianten.
 * Eingaben: Stellungen der Partie (Start und nach jedem Zug), Werte in Bauern aus Sicht von Weiß,
 * beste Züge (UCI) und Abstände in Bauern, je Stellung. Ausgabe: FEN → Ergebnis in Hundertstel.
 * Sonderfall: Passt die Zahl der Werte nicht zu den Stellungen (nicht ausgewertete oder alte
 * Partie), gibt es nichts; dann rechnet die Analyse wie bisher selbst.
 * Beispiel: 1. e4 mit Werten [0,3, 0,25] → zwei Ergebnisse, { w: 30, b: "e2e4", … } für den Start.
 */
export function ergebnisseAusPartie(
  fens: readonly string[],
  werte: readonly number[],
  beste: readonly string[],
  abstaende: readonly number[],
): Map<string, Engineergebnis> {
  const ergebnisse = new Map<string, Engineergebnis>();
  if (werte.length === 0 || werte.length !== fens.length) return ergebnisse;
  fens.forEach((fen, i) => {
    const wert = werte[i];
    if (wert === undefined) return;
    const bester = beste[i];
    ergebnisse.set(fen, {
      w: Math.round(wert * HUNDERTSTEL),
      a: Math.round((abstaende[i] ?? 0) * HUNDERTSTEL),
      ...(bester ? { b: bester } : {}),
    });
  });
  return ergebnisse;
}
