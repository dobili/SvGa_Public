/**
 * Abweichungsmodus: Die Engine wählt den Zug, der das Buch verlässt, und bewertet danach die
 * Antwort des Lesers.
 *
 * Rolle im Gesamtbild: Teil von ui/trainer/Abweichungsaufgabe.tsx. Beide Rechnungen laufen
 * nacheinander (es gibt nur eine Engine): erst der Abweichzug, nach dem Zug des Leser die
 * Bewertung (bester Zug, dann nur der Zug des Lesers).
 * Abhängigkeiten: engine/engineDienst.ts (nur aufgerufen), engine/spielbewerter.ts,
 * schach/eroeffnungsindex.ts, spiel/zuege.ts, training/abweichungstrainer.ts, React.
 */
import { useEffect, useState } from "react";
import {
  AuftragAbgebrochen,
  engine,
  STANDARD_RECHENZEIT_MS,
  VOLLE_STAERKE,
} from "../../engine/engineDienst";
import { wertFuer } from "../../engine/spielbewerter";
import { buchzuegeAb, type Eroeffnungsindex } from "../../schach/eroeffnungsindex";
import { fenNach, sanZuUci, uciZuSan } from "../../spiel/zuege";
import { abweichzug } from "../../training/abweichungstrainer";
import { zielkandidaten } from "../../training/zielzug";

/** So viele Kandidaten rechnet die Engine für den Abweichzug. */
const KANDIDATEN = 4;
const ABWEICH_MS = 1500;
const EINE = 1;

export type Rechenstand<T> =
  | { readonly art: "rechnet" }
  | { readonly art: "fertig"; readonly wert: T }
  | { readonly art: "fehler"; readonly meldung: string };

/** Eine Rechnung der Engine für einen Schlüssel; ein neuer Schlüssel verwirft die alte. */
function useRechnung<T>(
  schluessel: string | null,
  rechne: () => Promise<T>,
): Rechenstand<T> | null {
  const [ergebnis, setzeErgebnis] = useState<{ fuer: string; stand: Rechenstand<T> } | null>(null);
  useEffect(() => {
    if (schluessel === null) return undefined;
    let aktiv = true;
    rechne()
      .then((wert) => {
        if (aktiv) setzeErgebnis({ fuer: schluessel, stand: { art: "fertig", wert } });
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        console.error("Rechnung im Abweichungsmodus fehlgeschlagen:", fehler);
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        setzeErgebnis({ fuer: schluessel, stand: { art: "fehler", meldung } });
      });
    return () => {
      aktiv = false;
    };
    // Die Rechnung hängt nur am Schlüssel; „rechne“ ist bei gleichem Schlüssel dieselbe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schluessel]);
  if (schluessel === null) return null;
  return ergebnis?.fuer === schluessel ? ergebnis.stand : { art: "rechnet" };
}

/** Rechenzeit je Prüfung eines Kandidaten (bester Zug und Planzug), kurz gehalten. */
const PRUEF_MS = 500;
/** So viele Abweichungen prüft die App, ob der Planzug danach schlechter ist. */
const GEPRUEFTE_ABWEICHUNGEN = 3;
/** Ab diesem Verlust des Planzuges verlangt eine Abweichung eine echte Reaktion (Bauern). */
const REAKTION_AB = 0.5;
/** Höchstens so viele Halbzüge zeigt eine Fortsetzung der Engine. */
const FOLGE_HALBZUEGE = 6;

/** Die Züge einer Engine-Variante (UCI) als Kurznotation, höchstens FOLGE_HALBZUEGE. */
function alsFolge(fen: string, ucis: readonly string[]): string[] {
  const folge: string[] = [];
  let stand = fen;
  for (const uci of ucis.slice(0, FOLGE_HALBZUEGE)) {
    const san = uciZuSan(stand, uci);
    const danach = san ? fenNach(stand, san) : null;
    if (!san || !danach) break;
    folge.push(san);
    stand = danach;
  }
  return folge;
}

/**
 * Wie viel der Planzug nach einer Abweichung hinter dem besten Zug liegt (Bauern); ist er gar
 * nicht erlaubt, gilt die Abweichung als „verlangt Reaktion“ (unendlich).
 */
async function planverlust(fen: string, planzug: string | null): Promise<number> {
  const plan = planzug ? sanZuUci(fen, planzug) : null;
  if (!plan) return Number.POSITIVE_INFINITY;
  const weiss = fen.split(" ")[1] !== "b";
  const bester = await engine.bewerte(fen, PRUEF_MS, EINE);
  const eigen = await engine.bewerte(fen, PRUEF_MS, EINE, VOLLE_STAERKE, [plan]);
  const b = bester.varianten[0] ? wertFuer(bester.varianten[0].wert, weiss) : 0;
  const e = eigen.varianten[0] ? wertFuer(eigen.varianten[0].wert, weiss) : b;
  return Math.max(0, b - e);
}

/**
 * Der Zug, mit dem die Engine das Buch verlässt (Kurznotation), oder null, wenn alle ihre
 * Kandidaten Buchzüge sind. Ohne Eröffnungsindex (lädt noch) rechnet sie nicht.
 * Seit dem Nebenchat (30.10.2026, Punkt O): Unter den ersten Abweichungen bevorzugt die App eine,
 * nach der der Planzug des Lesers (der nächste Buchzug) mindestens einen halben Bauern verliert;
 * dann lohnt es sich, auf den neuen Zug einzugehen. Sonst bleibt es die beste Abweichung.
 */
export function useAbweichzug(
  fen: string,
  index: Eroeffnungsindex | undefined,
  planzug: string | null = null,
): Rechenstand<string | null> | null {
  return useRechnung(index ? `abweichung ${fen}` : null, async () => {
    const buch = index ? buchzuegeAb(index, fen).flatMap((san) => sanZuUci(fen, san) ?? []) : [];
    const b = await engine.bewerte(fen, ABWEICH_MS, KANDIDATEN);
    const kandidaten = b.varianten
      .flatMap((v) => v.zuege[0] ?? [])
      .filter((uci) => !buch.includes(uci));
    const erste = abweichzug(kandidaten, buch);
    for (const uci of kandidaten.slice(0, GEPRUEFTE_ABWEICHUNGEN)) {
      const san = uciZuSan(fen, uci);
      const danach = san ? fenNach(fen, san) : null;
      if (san && danach && (await planverlust(danach, planzug)) >= REAKTION_AB) return san;
    }
    return erste ? uciZuSan(fen, erste) : null;
  });
}

/** Ein Zug mit Wert (Bauern aus Sicht des Lesers) und der Fortsetzung der Engine danach. */
export interface Bewerteter {
  readonly zug: string;
  readonly wert: number;
  /** Der Zug selbst und die beste Fortsetzung, in Kurznotation. */
  readonly folge: readonly string[];
}

/** Bewertung der Antwort: bester Zug, Zug für die Ziele, eigener Zug (Nebenchat, Punkt D7). */
export interface Antwortbewertung {
  readonly verlust: number;
  readonly besterZug: string | null;
  readonly bester: Bewerteter | null;
  readonly eigener: Bewerteter | null;
  /** Der Zug, der die Eröffnungsziele am meisten voranbringt (unter Gleichen der beste). */
  readonly ziel: Bewerteter | null;
}

/** Bewertet einen Zug oder eine Zugmenge (UCI) und liefert den besten davon mit Folge. */
async function bewerteZuege(fen: string, nur: readonly string[]): Promise<Bewerteter | null> {
  const weiss = fen.split(" ")[1] !== "b";
  const b = await engine.bewerte(fen, STANDARD_RECHENZEIT_MS, EINE, VOLLE_STAERKE, nur);
  const v = b.varianten[0];
  if (!v) return null;
  const folge = alsFolge(fen, v.zuege);
  const zug = folge[0];
  return zug ? { zug, wert: wertFuer(v.wert, weiss), folge } : null;
}

/** Bewertet den Zug des Lesers (Kurznotation) in der Stellung davor; null, solange keiner da ist. */
export function useAntwortbewertung(
  fen: string,
  zug: string | null,
): Rechenstand<Antwortbewertung> | null {
  return useRechnung(zug ? `antwort ${fen} ${zug}` : null, async () => {
    const uci = zug ? (sanZuUci(fen, zug) ?? "") : "";
    const bester = await bewerteZuege(fen, []);
    const eigener = await bewerteZuege(fen, [uci]);
    const zielUcis = zielkandidaten(fen).flatMap((san) => sanZuUci(fen, san) ?? []);
    const ziel = zielUcis.length > 0 ? await bewerteZuege(fen, zielUcis) : null;
    const besterWert = bester?.wert ?? 0;
    return {
      verlust: Math.max(0, besterWert - (eigener?.wert ?? besterWert)),
      besterZug: bester?.zug ?? null,
      bester,
      eigener,
      ziel,
    };
  });
}
