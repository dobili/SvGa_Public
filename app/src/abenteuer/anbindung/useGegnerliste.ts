/**
 * Die Gegnerprofile aus den Spieldaten (gegner.json), für das Tischgespräch in Partie und Rätsel
 * (Temperament und eigene Zeilen einer Figur, docs/spiel/29_Tischgespraech.md).
 *
 * Rolle im Gesamtbild: daten/laden.ts hält die Spieldaten vor; dieser Haken liefert die Liste,
 * leer, solange sie lädt oder wenn sie fehlt (dann spricht der Tisch mit dem Vorgabe-Temperament).
 * Abhängigkeiten: daten/laden.ts.
 */
import { useEffect, useState } from "react";
import { ladeSpieldaten, type Gegnerdaten } from "../daten/laden";

/** Alle Gegnerprofile oder eine leere Liste; `geladen` sagt, ob die Liste schon da ist. */
export function useGegnerliste(): {
  readonly liste: readonly Gegnerdaten[];
  readonly geladen: boolean;
} {
  const [zustand, setzeZustand] = useState<{ liste: readonly Gegnerdaten[]; geladen: boolean }>({
    liste: [],
    geladen: false,
  });
  useEffect(() => {
    let aktiv = true;
    ladeSpieldaten()
      .then((d) => {
        if (aktiv) setzeZustand({ liste: d.gegner, geladen: true });
      })
      .catch((fehler: unknown) => {
        // Ohne Gegnerdaten spricht der Tisch mit dem Vorgabe-Temperament weiter.
        console.warn("Tischgespräch ohne Gegnerdaten", fehler);
        if (aktiv) setzeZustand({ liste: [], geladen: true });
      });
    return () => {
      aktiv = false;
    };
  }, []);
  return zustand;
}
