/**
 * Kontext der Navigation und der Zugriff darauf aus den Bildschirmen (useNavigation).
 *
 * Rolle im Gesamtbild: navigation.tsx stellt den Kontext bereit, alle Bildschirme lesen ihn.
 * Die Trennung in zwei Dateien hält das schnelle Neuladen während der Entwicklung zuverlässig.
 * Abhängigkeiten: stapel.ts, React.
 */
import { createContext, useContext } from "react";
import type { Ansicht, Bereich, Stapel } from "./stapel";

/** Was ein Bildschirm über die Navigation weiß und tun kann (Konzept 6.6). */
export interface Navigation {
  readonly stapel: Stapel;
  readonly ansicht: Ansicht;
  readonly navigiere: (ansicht: Ansicht) => void;
  readonly ersetze: (ansicht: Ansicht) => void;
  readonly zurueck: () => void;
  readonly wechsleBereich: (bereich: Bereich) => void;
}

export const NavigationsKontext = createContext<Navigation | null>(null);

/** Zugriff auf die Navigation aus einem Bildschirm. */
export function useNavigation(): Navigation {
  const navigation = useContext(NavigationsKontext);
  if (!navigation) {
    throw new Error("useNavigation außerhalb von NavigationsRahmen");
  }
  return navigation;
}
