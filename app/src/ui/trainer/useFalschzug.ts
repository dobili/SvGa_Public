/**
 * Merkt in Trainern mit fester Lösung den letzten falschen Zug und rechnet ihn gegen den Zug der
 * Lösung; dazu die Pfeile (rot der eigene Zug, gold die Lösung, sobald sie aufgedeckt ist).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (27.10.2026): in allen Trainern mit Zugaufgaben nach einem
 * falschen Zug den eigenen Zug rot, den richtigen gold und den Verlust der Engine zeigen, wie schon
 * bei „Zug erraten“ und „Studien“. Bei Aufgaben mit fester Buchlösung ist der richtige Zug der Zug
 * der Lösung. Solange man es noch einmal versuchen darf, bleibt er verdeckt: nur der rote Pfeil und
 * wie viel der Zug verliert. Den Satz dazu schreibt Falschzugmeldung.tsx.
 * Abhängigkeiten: useRatevergleich (Engine), vergleichspfeile, analyse/werkzeug.ts (Markierung).
 * Buchbezug: Kapitel 12, „erst selbst denken und dann vergleichen“.
 */
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { useRatevergleich, type Fehlversuch, type Vergleichsstand } from "./useRatevergleich";
import { vergleichspfeile } from "./vergleichspfeile";

/** Der letzte falsche Zug einer Aufgabe und der Stand der Rechnung. */
export interface Falschzug {
  readonly versuch: Fehlversuch | null;
  readonly stand: Vergleichsstand | null;
  /** Merkt einen falschen Zug; ohne Zug der Lösung (null) gibt es keinen Vergleich. */
  readonly merke: (vorherFen: string, eigen: string, loesung: string | null) => void;
}

/**
 * Merkt den letzten falschen Zug und lässt die Engine ihn gegen den Zug der Lösung rechnen.
 * Beispiel: Taktiktrainer, Lösung „Sxf7“, gespielt „Dh5“ → rechnet, dann etwa „schwächer um 2,1“.
 */
export function useFalschzug(): Falschzug {
  const [versuch, setzeVersuch] = useState<Fehlversuch | null>(null);
  const stand = useRatevergleich(versuch);
  const merke = (vorherFen: string, eigen: string, loesung: string | null) =>
    setzeVersuch(loesung ? { vorherFen, eigen, partie: loesung } : null);
  return { versuch, stand, merke };
}

/**
 * Die Pfeile zum falschen Zug, nur solange das Brett die Stellung davor zeigt: rot der eigene Zug,
 * gold die Lösung erst, wenn sie aufgedeckt ist.
 * Sonderfall: Ohne Versuch oder in einer anderen Stellung keine Pfeile.
 */
export function falschzugpfeile(
  falschzug: Falschzug,
  fen: string,
  aufgedeckt: boolean,
): Markierung[] {
  const versuch = falschzug.versuch;
  if (!versuch || versuch.vorherFen !== fen) return [];
  const pfeile = vergleichspfeile(versuch);
  return aufgedeckt ? pfeile : pfeile.filter((p) => p.typ !== "pfeil" || p.farbe === "rot");
}
