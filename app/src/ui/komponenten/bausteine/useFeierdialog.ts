/**
 * Bedienung der Gratulationen als modaler Dialog (Ring voll, neue Abzeichen): Fokus auf „Weiter“,
 * Tab bleibt in der Karte, Esc wirkt wie „Weiter“, danach kehrt der Fokus zurück.
 *
 * Rolle im Gesamtbild: Ringfeier.tsx und Abzeichenmeldung.tsx liegen als `aria-modal` über jedem
 * Bildschirm. Im Fehlertest f3 (01.11.2026) blieb der Fokus dabei hinter der Karte (Tab und
 * Bildschirmleser landeten auf Knöpfen, die gerade nicht bedienbar sind), und Esc tat nichts,
 * anders als bei Tour, Startwahl und Blättern (WCAG 2.4.3).
 * Die Zurück-Taste des Geräts wirkt ebenfalls wie „Weiter“ (app/blattstapel.ts).
 * Abhängigkeiten: React, app/blattstapel.ts, tour/haltFokus.ts.
 */
import { useEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import { useZurueckSchliesst } from "../../../app/blattstapel";
import { haltFokus } from "../../../tour/haltFokus";

/**
 * Fokus und Tasten einer Gratulation.
 * Eingaben: `schluessel` (wechselt er, etwa beim nächsten Ring, bekommt „Weiter“ den Fokus neu;
 * null: gerade keine Gratulation) und `weiter` (was „Weiter“ tut).
 * Ausgabe: Verweis für den Knopf „Weiter“ und der Tastenhorcher für die Karte.
 * Beispiel: const { knopf, tasten } = useFeierdialog(ring.testid, weiter).
 */
export function useFeierdialog(
  schluessel: string | null,
  weiter: () => void,
): {
  readonly knopf: RefObject<HTMLButtonElement | null>;
  readonly tasten: (ereignis: KeyboardEvent<HTMLDivElement>) => void;
} {
  const knopf = useRef<HTMLButtonElement>(null);
  useZurueckSchliesst(schluessel !== null, weiter);
  useEffect(() => {
    if (schluessel === null) return;
    const vorher = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    knopf.current?.focus();
    return () => {
      if (vorher?.isConnected) vorher.focus();
    };
  }, [schluessel]);
  const tasten = (ereignis: KeyboardEvent<HTMLDivElement>) => {
    if (ereignis.key === "Escape") weiter();
    else if (ereignis.key === "Tab") haltFokus(ereignis);
  };
  return { knopf, tasten };
}
