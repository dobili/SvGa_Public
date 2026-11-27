/**
 * Die Speicherplätze für die Hülle des Abenteuers: Liste und Wechsel (Hauptmenü, 27.11.2026).
 *
 * Rolle im Gesamtbild: verbindet die reinen Funktionen aus speicherplaetze.ts mit dem Speicher der
 * App. Jeder Wechsel ist eine Änderung der Nutzerdaten (aendere): Sie geht in IndexedDB, an die
 * anderen Tabs und in die nächste Sicherung, wie jede Änderung am Spielstand.
 * Abhängigkeiten: speicher/speicher.ts, speicherplaetze.ts.
 */
import { useMemo } from "react";
import { aendere, speicherzustand, useSpeicher } from "../../speicher/speicher";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import {
  mitGeladenemPlatz,
  mitNeuemSpiel,
  ohnePlatz,
  platzkennung,
  platzliste,
  type Platzzeile,
} from "./speicherplaetze";

/** Was die Hülle von den Plätzen braucht. */
export interface Speicherplaetze {
  /** Alle Plätze, der gespielte (oder zuletzt gespielte) zuerst. */
  readonly plaetze: readonly Platzzeile[];
  /** Ist der Speicher gelesen (oder endgültig nicht lesbar)? Vorher ist die Liste leer. */
  readonly bereit: boolean;
  /** Macht den Platz zum gespielten; Ausgabe: ob das Speichern gelang. */
  readonly lade: (kennung: string) => Promise<boolean>;
  /** Legt einen neuen Platz an und spielt ihn; Ausgabe: seine Kennung. */
  readonly beginne: (neu: Abenteuerstand) => Promise<string>;
  /** Löscht einen Platz endgültig. */
  readonly loesche: (kennung: string) => Promise<boolean>;
}

/** Die Plätze reaktiv, dazu die Wechsel. */
export function useSpeicherplaetze(): Speicherplaetze {
  const abenteuer = useSpeicher((z) => z.daten.abenteuer);
  const abenteuerplaetze = useSpeicher((z) => z.daten.abenteuerplaetze);
  const bereit = useSpeicher((z) => z.geladen || z.fehler !== null);
  const plaetze = useMemo(
    () => platzliste({ abenteuer, abenteuerplaetze }),
    [abenteuer, abenteuerplaetze],
  );
  return useMemo(
    () => ({
      plaetze,
      bereit,
      lade: (kennung) => aendere((d) => mitGeladenemPlatz(d, kennung)),
      beginne: async (neu) => {
        await aendere((d) => mitNeuemSpiel(d, neu));
        // Der Beginn kann beim Anlegen vorgerückt sein (gleiche Millisekunde, speicherplaetze.ts).
        const gespielt = speicherzustand().daten.abenteuer;
        return gespielt ? platzkennung(gespielt) : platzkennung(neu);
      },
      loesche: (kennung) => aendere((d) => ohnePlatz(d, kennung)),
    }),
    [plaetze, bereit],
  );
}
