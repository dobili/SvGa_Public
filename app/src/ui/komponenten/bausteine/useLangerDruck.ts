/**
 * Langer Druck auf einen Knopf: nach einer festen Zeit eine andere Handlung als beim Tippen.
 *
 * Rolle im Gesamtbild: Drei Sekunden auf „Profil“ in der Leiste öffnen die Aufgabenseite des
 * Autors (Wunsch des Autors vom 18.10.2026); ein kurzer Tipp bleibt der Wechsel zum
 * Profil. Das Kontextmenü des Handys (lange Berührung) wird auf diesem Knopf
 * unterdrückt, sonst bricht es den Druck ab.
 * Abhängigkeiten: React.
 */
import { useEffect, useRef } from "react";

export interface LangerDruck {
  readonly onPointerDown: () => void;
  readonly onPointerUp: () => void;
  readonly onPointerLeave: () => void;
  readonly onPointerCancel: () => void;
  readonly onContextMenu: (e: { preventDefault: () => void }) => void;
  /** Wahr, wenn der letzte Druck lang war; der folgende Klick soll dann nichts tun. Setzt zurück. */
  readonly warLang: () => boolean;
}

/**
 * Eingaben: Dauer in Millisekunden, Handlung nach dieser Dauer.
 * Ausgabe: Ereignisse für den Knopf und `warLang` für seinen Klick.
 * Sonderfall: Loslassen, Wegziehen oder Abbruch vor Ablauf der Zeit → nur ein normaler Klick.
 */
export function useLangerDruck(dauerMs: number, beiLang: () => void): LangerDruck {
  const zeitgeber = useRef<number | null>(null);
  const lang = useRef(false);
  const handlung = useRef(beiLang);
  useEffect(() => {
    handlung.current = beiLang;
  });
  const halt = () => {
    if (zeitgeber.current !== null) window.clearTimeout(zeitgeber.current);
    zeitgeber.current = null;
  };
  useEffect(() => halt, []);
  return {
    onPointerDown: () => {
      halt();
      lang.current = false;
      zeitgeber.current = window.setTimeout(() => {
        zeitgeber.current = null;
        lang.current = true;
        handlung.current();
      }, dauerMs);
    },
    onPointerUp: halt,
    onPointerLeave: halt,
    onPointerCancel: halt,
    onContextMenu: (e) => e.preventDefault(),
    warLang: () => {
      const war = lang.current;
      lang.current = false;
      return war;
    },
  };
}
