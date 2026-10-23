/**
 * Zug erraten: Kommentar zum letzten Rateversuch nach Motiven und Fehlerarten (R45).
 *
 * Rolle im Gesamtbild: Unter dem Brett, nach Meldung und Vergleich. Der Partiezug bekommt seine
 * Motive aus Kapitel 7 sofort; der eigene, abweichende Zug erst, wenn die Engine verglichen hat
 * (Fehlerart bei einem Fehler, sonst seine Motive). Ruhige Züge bleiben ohne Kommentar.
 * Abhängigkeiten: training/zugkommentar.ts, useRatevergleich (Fehlversuch, Vergleichsstand).
 */
import { useMemo } from "react";
import type { Repertoireaufgabe as Aufgabe } from "../../training/repertoiretrainer";
import { kommentarZumEigenenZug, kommentarZumPartiezug } from "../../training/zugkommentar";
import type { Fehlversuch, Vergleichsstand } from "./useRatevergleich";

/** Ein Rateversuch: wo er stand, was gezogen wurde, was die Partie spielte. */
export interface Rateversuch {
  /** Stelle des Partiezuges in der Linie (Halbzüge ab der Startstellung). */
  readonly index: number;
  readonly vorherFen: string;
  /** Stellung vor dem letzten Zug des Gegners (für den Rückschlag), am Anfang null. */
  readonly davorFen: string | null;
  /** Eigener Zug und Partiezug (SAN, englisch). */
  readonly eigen: string;
  readonly partie: string;
  readonly getroffen: boolean;
  readonly mitHinweis: boolean;
  /** Für den Vergleich der Engine; null bei einem Treffer. */
  readonly fehlversuch: Fehlversuch | null;
}

export function Zugkommentare({
  aufgabe,
  versuch,
  vergleich,
}: {
  aufgabe: Aufgabe;
  versuch: Rateversuch;
  vergleich: Vergleichsstand | null;
}) {
  const umfeld = useMemo(
    () => ({ vorherFen: versuch.vorherFen, davorFen: versuch.davorFen }),
    [versuch],
  );
  const zumPartiezug = useMemo(
    () => kommentarZumPartiezug(umfeld, aufgabe.linie.slice(versuch.index)),
    [umfeld, aufgabe, versuch.index],
  );
  const urteil = vergleich?.art === "fertig" ? vergleich.urteil : null;
  const zumEigenen = useMemo(
    () =>
      urteil && !versuch.getroffen
        ? kommentarZumEigenenZug(
            umfeld,
            versuch.eigen,
            versuch.partie,
            urteil,
            aufgabe.linie[versuch.index - 1] ?? null,
          )
        : null,
    [umfeld, urteil, versuch, aufgabe],
  );
  if (!zumPartiezug && !zumEigenen) return null;
  return (
    <div className="hinweis" data-testid="zugerraten-kommentar">
      {zumEigenen && <p>{zumEigenen}</p>}
      {zumPartiezug && <p>{zumPartiezug}</p>}
    </div>
  );
}
