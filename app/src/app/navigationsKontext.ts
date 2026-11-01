/**
 * Kontext der Navigation und der Zugriff darauf aus den Bildschirmen (useNavigation).
 *
 * Rolle im Gesamtbild: navigation.tsx stellt den Kontext bereit, alle Bildschirme lesen ihn.
 * Die Trennung in zwei Dateien hält das schnelle Neuladen während der Entwicklung zuverlässig.
 * Abhängigkeiten: stapel.ts, React.
 */
import { createContext, useContext } from "react";
import { bereichDerStartansicht, type Ansicht, type Bereich, type Stapel } from "./stapel";

/** Was ein Bildschirm über die Navigation weiß und tun kann (Konzept 6.6). */
export interface Navigation {
  readonly stapel: Stapel;
  readonly ansicht: Ansicht;
  readonly navigiere: (ansicht: Ansicht) => void;
  readonly ersetze: (ansicht: Ansicht) => void;
  readonly zurueck: () => void;
  readonly wechsleBereich: (bereich: Bereich) => void;
}

/** Reicht die Navigation an alle Bildschirme weiter; außerhalb des Rahmens leer. */
export const NavigationsKontext = createContext<Navigation | null>(null);

/** Zugriff auf die Navigation aus einem Bildschirm. */
export function useNavigation(): Navigation {
  const navigation = useContext(NavigationsKontext);
  if (!navigation) {
    throw new Error("useNavigation außerhalb von NavigationsRahmen");
  }
  return navigation;
}

/**
 * Öffnet ein Ziel wie die Knöpfe „Los geht's“, die Sprünge der Touren und die Wege der Startwahl.
 * Warum: Ist das Ziel die Startseite eines Bereichs (Buch, Spielen, Profil …), wechselt die App in
 * diesen Bereich; so stimmt der goldene Strich der Leiste, und „Buch“ auf „Buch“ legt keine
 * zweite, unsichtbare Ansicht auf den Stapel (Fehlertest f3, 01.11.2026). Jedes andere Ziel legt
 * sich wie bisher auf den Stapel. Beispiel: „Los geht's“ zu „Erste Partie“ im Profil → Bereich
 * Spielen; zu „Nachgefragt“ → Kapitelübersicht über dem Profil, „Zurück“ führt zurück.
 */
export function useOeffne(): (ziel: Ansicht) => void {
  const { navigiere, wechsleBereich } = useNavigation();
  return (ziel) => {
    const bereich = bereichDerStartansicht(ziel);
    if (bereich) wechsleBereich(bereich);
    else navigiere(ziel);
  };
}
