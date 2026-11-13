/**
 * Die Daten der Begegnung einer laufenden Partie (begegnungen.json), für die Spielhülle:
 * Partiemomente (Momentzeile.tsx) und Stärkewechsel (useStaerkewechsel.ts).
 *
 * Rolle im Gesamtbild: lädt die Spieldaten einmal (daten/laden.ts hält sie vor). Die Kennung der
 * Partie trägt hinter „#“ eine Wiederholungsmarke; sie zählt hier nicht (wie regeln/rueckweg.ts).
 * Abhängigkeiten: daten/laden.ts.
 */
import { useEffect, useState } from "react";
import { ladeSpieldaten, type Begegnungsdaten } from "../daten/laden";

/** Kennung der Begegnung aus der Kennung der Partie. Beispiel: „a.b#x1“ → „a.b“. */
export function begegnungVonPartie(kennung: string): string {
  return kennung.split("#")[0] ?? "";
}

/** Die Begegnung oder null (lädt noch, unbekannt oder ohne Spieldaten). */
export function useBegegnung(partiekennung: string): Begegnungsdaten | null {
  const begegnung = begegnungVonPartie(partiekennung);
  const [geladen, setzeGeladen] = useState<{
    begegnung: string;
    daten: Begegnungsdaten | null;
  } | null>(null);
  useEffect(() => {
    let aktiv = true;
    ladeSpieldaten()
      .then((daten) => {
        const b = daten.begegnungen.find((x) => x.kennung === begegnung) ?? null;
        if (aktiv) setzeGeladen({ begegnung, daten: b });
      })
      .catch((fehler: unknown) => {
        // Ohne Spieldaten keine Momente und keine Stärkewechsel; die Partie läuft trotzdem.
        console.warn("Begegnung nicht geladen", fehler);
      });
    return () => {
      aktiv = false;
    };
  }, [begegnung]);
  return geladen?.begegnung === begegnung ? geladen.daten : null;
}
