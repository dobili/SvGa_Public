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
import { sanZuUci, uciZuSan } from "../../spiel/zuege";
import { abweichzug } from "../../training/abweichungstrainer";

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

/**
 * Der Zug, mit dem die Engine das Buch verlässt (Kurznotation), oder null, wenn alle ihre
 * Kandidaten Buchzüge sind. Ohne Eröffnungsindex (lädt noch) rechnet sie nicht.
 */
export function useAbweichzug(
  fen: string,
  index: Eroeffnungsindex | undefined,
): Rechenstand<string | null> | null {
  return useRechnung(index ? `abweichung ${fen}` : null, async () => {
    const buch = index ? buchzuegeAb(index, fen).flatMap((san) => sanZuUci(fen, san) ?? []) : [];
    const b = await engine.bewerte(fen, ABWEICH_MS, KANDIDATEN);
    const uci = abweichzug(
      b.varianten.flatMap((v) => v.zuege[0] ?? []),
      buch,
    );
    return uci ? uciZuSan(fen, uci) : null;
  });
}

/** Bewertung der Antwort: Verlust gegenüber dem besten Zug und der beste Zug selbst. */
export interface Antwortbewertung {
  readonly verlust: number;
  readonly besterZug: string | null;
}

/** Bewertet den Zug des Lesers (Kurznotation) in der Stellung davor; null, solange keiner da ist. */
export function useAntwortbewertung(
  fen: string,
  zug: string | null,
): Rechenstand<Antwortbewertung> | null {
  return useRechnung(zug ? `antwort ${fen} ${zug}` : null, async () => {
    const weiss = fen.split(" ")[1] !== "b";
    const uci = zug ? (sanZuUci(fen, zug) ?? "") : "";
    const bester = await engine.bewerte(fen, STANDARD_RECHENZEIT_MS, EINE);
    const eigen = await engine.bewerte(fen, STANDARD_RECHENZEIT_MS, EINE, VOLLE_STAERKE, [uci]);
    const besterWert = bester.varianten[0] ? wertFuer(bester.varianten[0].wert, weiss) : 0;
    const eigenerWert = eigen.varianten[0] ? wertFuer(eigen.varianten[0].wert, weiss) : besterWert;
    const besterUci = bester.varianten[0]?.zuege[0];
    return {
      verlust: Math.max(0, besterWert - eigenerWert),
      besterZug: besterUci ? uciZuSan(fen, besterUci) : null,
    };
  });
}
