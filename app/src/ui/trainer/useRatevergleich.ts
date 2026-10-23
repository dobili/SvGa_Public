/**
 * Zug erraten und Studien: rechnet nach einem verfehlten Zug den eigenen Zug gegen den Zug der
 * Partie oder der Studie (W12, R46).
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
 * Lässt die Engine die beiden Züge eines Fehlversuchs rechnen.
 *
 * Ausgabe: das Urteil, oder null, wenn ein Zug nicht lesbar ist oder in der Rechnung fehlt.
 * Bricht ein neuerer Engine-Auftrag diesen ab, lehnt das Versprechen mit AuftragAbgebrochen ab.
 * Beispiel: Opernpartie, 4. Sc3 statt 4. Lxf6 → etwa „schwächer um 0,8“.
 */
export async function vergleicheZuege(versuch: Fehlversuch): Promise<Rateurteil | null> {
  const eigen = sanZuUci(versuch.vorherFen, versuch.eigen);
  const partie = sanZuUci(versuch.vorherFen, versuch.partie);
  if (!eigen || !partie) return null;
  const weissZieht = versuch.vorherFen.split(" ")[1] !== "b";
  const bewertung = await engine.bewerte(
    versuch.vorherFen,
    STANDARD_RECHENZEIT_MS,
    ZWEI_VARIANTEN,
    VOLLE_STAERKE,
    [eigen, partie],
  );
  return rateurteil(bewertung.varianten, eigen, partie, weissZieht);
}

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
    let aktiv = true;
    vergleicheZuege(versuch)
      .then((urteil) => {
        if (aktiv) setzeErgebnis({ versuch, urteil });
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        console.error("Vergleich der Züge fehlgeschlagen:", fehler);
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
