/**
 * Hilfsfunktion für Bildschirme: lädt Daten und liefert Ladezustand, Ergebnis oder Fehler.
 *
 * Warum: Jeder Bildschirm, der Buchdaten braucht, soll Fehler gleich behandeln: sichtbar für den
 * Leser, nie verschluckt (Konzept 12).
 * Wird die Seite gerade verlassen (Neuladen), endet ein abgebrochener Abruf still: Das ist kein
 * Ladefehler, sondern das Ende der Seite (seitenende.ts, CI-Wackler in WebKit, 18.11.2026).
 * Abhängigkeiten: React, app/seitenende.ts.
 */
import { useEffect, useState } from "react";
import { beobachteSeitenende, seiteWirdVerlassen } from "../../../app/seitenende";

export type Ladezustand<T> =
  | { readonly art: "laedt" }
  | { readonly art: "fertig"; readonly wert: T }
  | { readonly art: "fehler"; readonly meldung: string };

/** Lädt mit `lade`, sobald sich `schluessel` ändert. */
export function useDaten<T>(lade: () => Promise<T>, schluessel: string): Ladezustand<T> {
  const [zustand, setzeZustand] = useState<{ schluessel: string; wert: Ladezustand<T> }>({
    schluessel,
    wert: { art: "laedt" },
  });
  useEffect(() => {
    beobachteSeitenende();
    let aktiv = true;
    lade()
      .then((wert) => aktiv && setzeZustand({ schluessel, wert: { art: "fertig", wert } }))
      .catch((fehler: unknown) => {
        // Abgebrochen, weil die Seite geht: kein Fehler für den Leser, nichts mehr zu zeigen.
        if (seiteWirdVerlassen()) return;
        console.error("Laden fehlgeschlagen:", fehler);
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        if (aktiv) setzeZustand({ schluessel, wert: { art: "fehler", meldung } });
      });
    return () => {
      aktiv = false;
    };
    // `lade` darf bei jedem Aufruf neu sein; maßgeblich ist der Schlüssel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schluessel]);
  return zustand.schluessel === schluessel ? zustand.wert : { art: "laedt" };
}
