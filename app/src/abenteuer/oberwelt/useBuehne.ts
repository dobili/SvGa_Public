/**
 * Bühnenregie der Oberwelt (Atmosphäre T6 und T9): wendet die Bühnenanweisungen jeder
 * Dialogzeile auf die Karte an und stellt am Dialogende das Licht der Karte wieder her.
 *
 * Rolle im Gesamtbild: Oberwelt.tsx gibt `zeile` und `ende` an den Dialog weiter. Die Anweisungen
 * liest buehne.ts, das Blenden der Figuren macht figurblende.ts, das Licht die Tönungsschicht der
 * Szene (mit zwei Sekunden Umblenden).
 * Abhängigkeiten: kern.ts, buehne.ts, figurblende.ts.
 */
import { useRef } from "react";
import { buehnenanweisung } from "./buehne";
import { blendeFigur } from "./figurblende";
import { szeneAus, type Oberweltkern } from "./kern";

/** Rückrufe für den Dialog. */
export interface Buehne {
  /** Eine neue Zeile mit ihren Tags. */
  readonly zeile: (tags: Readonly<Record<string, string>>) => void;
  /** Der Dialog ist zu Ende: Licht der Karte zurück. */
  readonly ende: () => void;
}

/** Die Bühnenregie für den Kern der Oberwelt. Eingabe: Kern. Ausgabe: Rückrufe für den Dialog. */
export function useBuehne(k: Oberweltkern): Buehne {
  // Hat der Dialog das Licht verändert? Nur dann wird es am Ende zurückgestellt.
  const lichtGeaendert = useRef(false);
  return {
    zeile: (tags) => {
      const szene = szeneAus(k.spiel);
      if (!szene) return;
      const anweisung = buehnenanweisung(tags);
      if (anweisung.licht !== undefined) {
        szene.setzeToenung(anweisung.licht);
        lichtGeaendert.current = true;
      }
      if (anweisung.figur) blendeFigur(szene, anweisung.figur.name, anweisung.figur.deckkraft);
    },
    ende: () => {
      if (!lichtGeaendert.current) return;
      lichtGeaendert.current = false;
      szeneAus(k.spiel)?.setzeToenung(k.toenung);
    },
  };
}
