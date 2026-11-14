/**
 * Der Kartenfächer (docs/spiel/29_Tischgespraech.md, Abschnitt Kartenfächer): die Karten
 * waagerecht nebeneinander, zum Durchwischen mit Einrasten (Scroll-Snap), unter dem Brett in der
 * Partie und in der Deckwahl.
 *
 * Rolle im Gesamtbild: Rahmen um die Karten (anbindung/Spielkarte.tsx). Er bestimmt nur die
 * Reihe; was eine Karte zeigt und was ein Tipp tut, geben Kartenleiste und Deckwahl vor.
 * Warum eine Liste: Der Vorleser sagt „Liste, 3 Einträge“ und dann je Karte Name und Zustand.
 * Der Fächer wischt in sich und wird nie breiter als die Spalte, damit das Brett seine Größe
 * behält. Abhängigkeiten: React, Stil in spielkarte.css.
 */
import type { ReactNode } from "react";

/** Eine Karte im Fächer: Schlüssel für React und die fertige Karte. */
export interface Faecherkarte {
  readonly kennung: string;
  readonly karte: ReactNode;
}

/**
 * Die Reihe der Karten. `beschriftung` nennt die Liste für Vorleser („Deine Karten“).
 * Beispiel: <Kartenfaecher beschriftung="Deine Karten" karten={[{kennung, karte}]} />.
 */
export function Kartenfaecher({
  beschriftung,
  karten,
  testid,
}: {
  readonly beschriftung: string;
  readonly karten: readonly Faecherkarte[];
  readonly testid?: string;
}) {
  return (
    <ul className="abenteuer-faecher" aria-label={beschriftung} data-testid={testid}>
      {karten.map((k) => (
        <li key={k.kennung}>{k.karte}</li>
      ))}
    </ul>
  );
}
