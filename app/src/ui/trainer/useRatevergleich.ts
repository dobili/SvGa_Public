/**
 * Zug erraten: rechnet nach einem verfehlten Zug den eigenen Zug gegen den Partiezug (W12).
 *
 * Rolle im Gesamtbild: Die Engine rechnet nur die beiden Züge („searchmoves“), das Urteil kommt
 * aus training/rateurteil.ts. Ein neuer Versuch bricht die alte Rechnung ab.
 * Abhängigkeiten: engine/engineDienst.ts, spiel/zuege.ts, training/rateurteil.ts, React.
 */
import { useEffect, useState } from "react";
import {
  AuftragAbgebrochen,
  engine,
  STANDARD_RECHENZEIT_MS,
  VOLLE_STAERKE,
} from "../../engine/engineDienst";
import { sanZuUci } from "../../spiel/zuege";
import { rateurteil, type Rateurteil } from "../../training/rateurteil";

/** Zwei Züge, je eine Variante. */
const ZWEI_VARIANTEN = 2;

/** Ein verfehlter Zug: Stellung davor, eigener Zug und Partiezug (Kurznotation, englisch). */
export interface Fehlversuch {
  readonly vorherFen: string;
  readonly eigen: string;
  readonly partie: string;
}

export type Vergleichsstand =
  { readonly art: "rechnet" } | { readonly art: "fertig"; readonly urteil: Rateurteil | null };

/**
 * Eingabe: der letzte Fehlversuch oder null. Ausgabe: Stand des Vergleichs, null ohne Versuch.
 * Beispiel: Opernpartie, eigener Zug 4. Sc3 statt 4. Lxf6 → „rechnet“, dann etwa „schwächer um
 * 0,8“.
 */
export function useRatevergleich(versuch: Fehlversuch | null): Vergleichsstand | null {
  const [ergebnis, setzeErgebnis] = useState<{
    versuch: Fehlversuch;
    urteil: Rateurteil | null;
  } | null>(null);
  useEffect(() => {
    if (!versuch) return undefined;
    const eigen = sanZuUci(versuch.vorherFen, versuch.eigen);
    const partie = sanZuUci(versuch.vorherFen, versuch.partie);
    if (!eigen || !partie) return undefined;
    let aktiv = true;
    const weissZieht = versuch.vorherFen.split(" ")[1] !== "b";
    engine
      .bewerte(versuch.vorherFen, STANDARD_RECHENZEIT_MS, ZWEI_VARIANTEN, VOLLE_STAERKE, [
        eigen,
        partie,
      ])
      .then((b) => {
        if (aktiv) {
          setzeErgebnis({ versuch, urteil: rateurteil(b.varianten, eigen, partie, weissZieht) });
        }
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        console.error("Vergleich beim Zugerraten fehlgeschlagen:", fehler);
        setzeErgebnis({ versuch, urteil: null });
      });
    return () => {
      aktiv = false;
    };
  }, [versuch]);
  if (!versuch) return null;
  return ergebnis?.versuch === versuch
    ? { art: "fertig", urteil: ergebnis.urteil }
    : { art: "rechnet" };
}
