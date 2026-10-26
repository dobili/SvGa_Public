/**
 * Hilfsfunktion für Bildschirme: lädt Daten und liefert Ladezustand, Ergebnis oder Fehler.
 *
 * Warum: Jeder Bildschirm, der Buchdaten braucht, soll Fehler gleich behandeln: sichtbar für den
 * Leser, nie verschluckt (Konzept 12).
 * Abhängigkeiten: React.
 */
import { useEffect, useState } from "react";

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
    let aktiv = true;
    lade()
      .then((wert) => aktiv && setzeZustand({ schluessel, wert: { art: "fertig", wert } }))
      .catch((fehler: unknown) => {
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
