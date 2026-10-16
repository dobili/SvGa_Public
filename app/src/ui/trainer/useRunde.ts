/**
 * Ablauf einer Trainingsrunde: Aufgabe für Aufgabe, Zählung, Zeit und Speichern am Ende.
 *
 * Rolle im Gesamtbild: Gemeinsamer Zustand aller Trainer (Konzept 9.2: starte, naechste,
 * antworte, beende). Die Aufgabe meldet „richtig“ oder „falsch“ mit `beantworte`; `weiter`
 * führt zur nächsten Aufgabe. Nach der letzten zählt die Runde als Durchgang im Fortschritt
 * (speicher/fortschritt.ts, notiereDurchgang).
 * Abhängigkeiten: speicher, training/trainer.ts.
 */
import { useEffect, useReducer } from "react";
import { notiereDurchgang } from "../../speicher/fortschritt";
import { aendere } from "../../speicher/speicher";
import type { TrainerKennung } from "../../training/trainer";

interface Zustand {
  readonly index: number;
  readonly richtig: number;
  /** Ergebnis der aktuellen Aufgabe, null solange offen. */
  readonly ergebnis: boolean | null;
  readonly fertig: boolean;
  readonly beginn: number;
  readonly ende: number | null;
}

type Aktion =
  | { readonly art: "beantworte"; readonly richtig: boolean }
  | { readonly art: "weiter"; readonly anzahl: number; readonly jetzt: number };

function schritt(zustand: Zustand, aktion: Aktion): Zustand {
  if (aktion.art === "beantworte") {
    if (zustand.ergebnis !== null) return zustand;
    return {
      ...zustand,
      ergebnis: aktion.richtig,
      richtig: zustand.richtig + (aktion.richtig ? 1 : 0),
    };
  }
  if (zustand.fertig) return zustand;
  if (zustand.index + 1 >= aktion.anzahl) return { ...zustand, fertig: true, ende: aktion.jetzt };
  return { ...zustand, index: zustand.index + 1, ergebnis: null };
}

export interface Runde {
  readonly index: number;
  readonly anzahl: number;
  readonly richtig: number;
  readonly ergebnis: boolean | null;
  readonly fertig: boolean;
  /** Dauer der Runde in Sekunden, sobald sie fertig ist. */
  readonly sekunden: number | null;
  readonly beantworte: (richtig: boolean) => void;
  readonly weiter: () => void;
}

const MS_JE_SEKUNDE = 1000;

/**
 * Zustand einer Runde.
 *
 * Eingaben: Kennung des Trainers (für den Fortschritt), Anzahl der Aufgaben.
 * Sonderfall: Eine zweite Antwort auf dieselbe Aufgabe zählt nicht (erste Antwort gilt).
 */
export function useRunde(kennung: TrainerKennung, anzahl: number): Runde {
  const [zustand, sende] = useReducer(schritt, null, () => ({
    index: 0,
    richtig: 0,
    ergebnis: null,
    fertig: false,
    beginn: Date.now(),
    ende: null,
  }));
  useEffect(() => {
    if (!zustand.fertig) return;
    void aendere((daten) =>
      notiereDurchgang(daten, kennung, { aufgaben: anzahl, richtig: zustand.richtig }, new Date()),
    );
  }, [zustand.fertig, zustand.richtig, kennung, anzahl]);
  return {
    index: zustand.index,
    anzahl,
    richtig: zustand.richtig,
    ergebnis: zustand.ergebnis,
    fertig: zustand.fertig,
    sekunden:
      zustand.ende === null ? null : Math.round((zustand.ende - zustand.beginn) / MS_JE_SEKUNDE),
    beantworte: (richtig) => sende({ art: "beantworte", richtig }),
    weiter: () => sende({ art: "weiter", anzahl, jetzt: Date.now() }),
  };
}
