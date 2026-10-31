/**
 * Eine Runde ohne feste Länge für die Kurzpläne: Aufgabe für Aufgabe, Zählung von richtig und
 * falsch, ohne den Rundenrahmen (Zeitrunde „Taktik auf Zeit“ und Tagesaufgabe).
 *
 * Rolle im Gesamtbild: Die Aufgaben der Trainer (Taktikaufgabe.tsx) melden ihr Ergebnis an eine
 * `Runde` (useRunde.ts). Die Kurzpläne brauchen eine Runde, die der Plan selbst beendet (Zeit
 * um, drei Fehler) und die erst am Ende in den Fortschritt geht; deshalb dieser kleine Zustand.
 * Abhängigkeiten: useRunde.ts (nur der Typ), React.
 */
import { useState } from "react";
import type { Runde } from "./useRunde";

interface Stand {
  readonly index: number;
  readonly richtig: number;
  readonly falsch: number;
  /** Richtige Antworten in Folge (Kombo, P10); hier nur gezählt, der Kurzplan zeigt sie nicht. */
  readonly folge: number;
  readonly ergebnis: boolean | null;
  readonly versuch: number;
}

const ANFANG: Stand = { index: 0, richtig: 0, falsch: 0, folge: 0, ergebnis: null, versuch: 0 };

/**
 * Die Runde und ihre Zählung. Eingabe: Zahl der vorbereiteten Aufgaben. Die erste Antwort auf eine
 * Aufgabe zählt; „wiederhole“ spielt dieselbe Aufgabe noch einmal, ohne neu zu zählen.
 * Beispiel: richtig, falsch, richtig → richtig 2, falsch 1.
 */
export function useFreieRunde(anzahl: number): { runde: Runde; richtig: number; falsch: number } {
  const [stand, setzeStand] = useState<Stand>(ANFANG);
  const runde: Runde = {
    index: stand.index,
    anzahl,
    richtig: stand.richtig,
    folge: stand.folge,
    ergebnis: stand.ergebnis,
    versuch: stand.versuch,
    fertig: false,
    sekunden: null,
    beantworte: (richtig) =>
      setzeStand((alt) =>
        alt.ergebnis !== null
          ? alt
          : {
              ...alt,
              ergebnis: richtig,
              richtig: alt.richtig + (richtig ? 1 : 0),
              falsch: alt.falsch + (richtig ? 0 : 1),
              folge: richtig ? alt.folge + 1 : 0,
            },
      ),
    weiter: () =>
      setzeStand((alt) => ({ ...alt, index: alt.index + 1, ergebnis: null, versuch: 0 })),
    wiederhole: () => setzeStand((alt) => ({ ...alt, ergebnis: null, versuch: alt.versuch + 1 })),
  };
  return { runde, richtig: stand.richtig, falsch: stand.falsch };
}
