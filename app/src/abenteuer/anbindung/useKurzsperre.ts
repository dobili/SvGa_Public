/**
 * Kurze Sperre nach dem Öffnen eines Fensters: Knöpfe, die an derselben Stelle liegen wie der
 * Knopf davor, sind die ersten 600 ms gesperrt (`disabled`).
 *
 * Warum: Ein doppelter Tipp traf den Knopf des gerade geöffneten Fensters (eiliger Spieler-Durchlauf,
 * 23. und 24.11.2026). „Weiter“ der Tagebuchmeldung traf „Aufgeben“ der Partie. Die Antwort an Mira
 * traf im Querformat „Zurück“ der Kartenwahl; der Clubkampf begann dann nicht.
 * Rolle im Gesamtbild: anbindung/PartieHuelle.tsx (Aufgeben), oberwelt/Deckwahl.tsx (Los, Zurück).
 * Gesperrte Knöpfe nehmen keinen Tipp an; Playwright wartet beim Klick von selbst, bis sie frei sind.
 */
import { useEffect, useState } from "react";

/** So lange nach dem Öffnen sind die Knöpfe gesperrt (ms). */
export const KURZSPERRE_MS = 600;

/**
 * Ob die Knöpfe schon bedienbar sind: zuerst false, nach KURZSPERRE_MS true.
 * Beispiel: Partie öffnet → „Aufgeben“ 600 ms grau, dann wie immer.
 */
export function useKurzsperre(): boolean {
  const [bereit, setzeBereit] = useState(false);
  useEffect(() => {
    const uhr = setTimeout(() => setzeBereit(true), KURZSPERRE_MS);
    return () => clearTimeout(uhr);
  }, []);
  return bereit;
}
