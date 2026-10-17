/**
 * Denkroutine-Trainer: Die Engine rechnet die Stellung, die Kandidaten des Lesers und je die
 * stärkste Antwort darauf.
 *
 * Rolle im Gesamtbild: Teil von ui/trainer/Denkroutineaufgabe.tsx. Es gibt nur eine Engine, und
 * ein neuer Auftrag bricht den laufenden ab; deshalb rechnen die Schritte nacheinander: erst der
 * beste Zug, dann nur die Kandidaten („searchmoves“), dann je Kandidat die beste Antwort.
 * Abhängigkeiten: engine/engineDienst.ts (nur aufgerufen), engine/spielbewerter.ts,
 * spiel/zuege.ts, training/denkroutinetrainer.ts, React.
 */
import { useEffect, useState } from "react";
import {
  AuftragAbgebrochen,
  engine,
  STANDARD_RECHENZEIT_MS,
  VOLLE_STAERKE,
} from "../../engine/engineDienst";
import { wertFuer } from "../../engine/spielbewerter";
import { sanZuUci, uciZuSan } from "../../spiel/zuege";
import type { Denkvergleich } from "../../training/denkroutinetrainer";

/** Für die Antworten genügt weniger Rechenzeit. */
const ANTWORT_MS = 1500;
const EINE_VARIANTE = 1;

/** Ein Kandidat: Zug in Kurznotation und die Stellung danach. */
export interface Kandidat {
  readonly zug: string;
  readonly fenDanach: string;
}

/** Rechnet den Vergleich nacheinander; wirft bei Fehlern der Engine. */
async function rechne(fen: string, kandidaten: readonly Kandidat[]): Promise<Denkvergleich> {
  const weiss = fen.split(" ")[1] !== "b";
  const gesamt = await engine.bewerte(fen, STANDARD_RECHENZEIT_MS, EINE_VARIANTE);
  const beste = gesamt.varianten[0];
  const ucis = kandidaten.map((k) => sanZuUci(fen, k.zug) ?? "");
  const nur = await engine.bewerte(
    fen,
    STANDARD_RECHENZEIT_MS,
    kandidaten.length,
    VOLLE_STAERKE,
    ucis,
  );
  const ergebnis: Denkvergleich["kandidaten"][number][] = [];
  for (const [i, k] of kandidaten.entries()) {
    const variante = nur.varianten.find((v) => v.zuege[0] === ucis[i]);
    const antwort = await engine.bewerte(k.fenDanach, ANTWORT_MS, EINE_VARIANTE);
    const antwortUci = antwort.varianten[0]?.zuege[0];
    ergebnis.push({
      zug: k.zug,
      wert: variante ? wertFuer(variante.wert, weiss) : Number.NEGATIVE_INFINITY,
      antwort: antwortUci ? uciZuSan(k.fenDanach, antwortUci) : null,
    });
  }
  return {
    besterZug: beste?.zuege[0] ? (uciZuSan(fen, beste.zuege[0]) ?? "") : "",
    besterWert: beste ? wertFuer(beste.wert, weiss) : 0,
    kandidaten: ergebnis,
  };
}

export type Denkstand =
  | { readonly art: "aus" }
  | { readonly art: "rechnet" }
  | { readonly art: "fertig"; readonly vergleich: Denkvergleich }
  | { readonly art: "fehler"; readonly meldung: string };

/**
 * Eingaben: Stellung und Kandidaten (null, solange der Leser nicht geprüft hat).
 * Ausgabe: Stand der Rechnung. Beispiel: Abb. 12.1, Lxh7+ und Dc2 → „rechnet“, dann der beste
 * Zug der Engine, die Werte beider Kandidaten und je die stärkste Antwort.
 */
export function useDenkvergleich(fen: string, kandidaten: readonly Kandidat[] | null): Denkstand {
  // Das Ergebnis gilt nur für die Kandidaten, für die es gerechnet wurde.
  const [ergebnis, setzeErgebnis] = useState<{
    fuer: readonly Kandidat[];
    stand: Denkstand;
  } | null>(null);
  useEffect(() => {
    if (!kandidaten || kandidaten.length === 0) return undefined;
    let aktiv = true;
    rechne(fen, kandidaten)
      .then((vergleich) => {
        if (aktiv) setzeErgebnis({ fuer: kandidaten, stand: { art: "fertig", vergleich } });
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        console.error("Vergleich im Denkroutine-Trainer fehlgeschlagen:", fehler);
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        setzeErgebnis({ fuer: kandidaten, stand: { art: "fehler", meldung } });
      });
    return () => {
      aktiv = false;
    };
  }, [fen, kandidaten]);
  if (!kandidaten || kandidaten.length === 0) return { art: "aus" };
  return ergebnis?.fuer === kandidaten ? ergebnis.stand : { art: "rechnet" };
}
