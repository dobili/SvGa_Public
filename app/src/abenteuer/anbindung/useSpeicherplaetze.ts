/**
 * Die Speicherplätze für die Hülle des Abenteuers: Liste und Wechsel (Hauptmenü, 27.11.2026), dazu
 * die Sicherungen des Lesers (Speichern im Spielmenü, Laden in der Ladeliste, 28.11.2026).
 *
 * Rolle im Gesamtbild: verbindet die reinen Funktionen aus speicherplaetze.ts und sicherungen.ts
 * mit dem Speicher der App. Jeder Wechsel ist eine Änderung der Nutzerdaten (aendere): Sie geht in
 * IndexedDB, an die anderen Tabs und in die nächste Sicherung, wie jede Änderung am Spielstand.
 * Abhängigkeiten: speicher/speicher.ts, speicherplaetze.ts, sicherungen.ts.
 */
import { useMemo } from "react";
import { aendere, speicherzustand, useSpeicher } from "../../speicher/speicher";
import type { Abenteuerstand, Sicherung } from "../schnittstelle/spielstand";
import {
  aeltesteFaelltWeg,
  mitGeladenerSicherung,
  mitSicherung,
  ohneSicherung,
  ohneSicherungenDes,
} from "./sicherungen";
import {
  mitGeladenemPlatz,
  mitNeuemSpiel,
  ohnePlatz,
  platzkennung,
  platzliste,
  type Platzzeile,
} from "./speicherplaetze";

/** Ergebnis von „Speichern“: gelungen, und ob dabei die älteste Sicherung wegfiel. */
export interface Sicherungsergebnis {
  readonly gespeichert: boolean;
  readonly aeltesteWeg: boolean;
}

/** Was die Hülle von den Plätzen braucht. */
export interface Speicherplaetze {
  /** Alle Plätze, der gespielte (oder zuletzt gespielte) zuerst. */
  readonly plaetze: readonly Platzzeile[];
  /** Alle Sicherungen des Lesers (die Ladeliste ordnet sie ihren Plätzen zu). */
  readonly sicherungen: readonly Sicherung[];
  /** Ist der Speicher gelesen (oder endgültig nicht lesbar)? Vorher ist die Liste leer. */
  readonly bereit: boolean;
  /** Macht den Platz zum gespielten; Ausgabe: ob das Speichern gelang. */
  readonly lade: (kennung: string) => Promise<boolean>;
  /** Legt einen neuen Platz an und spielt ihn; Ausgabe: seine Kennung. */
  readonly beginne: (neu: Abenteuerstand) => Promise<string>;
  /** Löscht einen Platz endgültig, mit seinen Sicherungen. */
  readonly loesche: (kennung: string) => Promise<boolean>;
  /** Sichert den Stand des gespielten Platzes (Spielmenü „Speichern“). */
  readonly sichere: (stand: Abenteuerstand) => Promise<Sicherungsergebnis>;
  /** Lädt eine Sicherung (Platz und Zeitpunkt). */
  readonly ladeSicherung: (platz: string, gesichert: string) => Promise<boolean>;
  /** Löscht eine Sicherung. */
  readonly loescheSicherung: (platz: string, gesichert: string) => Promise<boolean>;
}

/** Speichern: die Sicherung schreiben und sagen, ob die älteste wegfiel. */
async function sichereStand(stand: Abenteuerstand): Promise<Sicherungsergebnis> {
  const aeltesteWeg = aeltesteFaelltWeg(speicherzustand().daten, platzkennung(stand));
  const gespeichert = await aendere((d) => mitSicherung(d, stand, new Date()));
  return { gespeichert, aeltesteWeg };
}

/** Die Plätze reaktiv, dazu die Wechsel. */
export function useSpeicherplaetze(): Speicherplaetze {
  const abenteuer = useSpeicher((z) => z.daten.abenteuer);
  const abenteuerplaetze = useSpeicher((z) => z.daten.abenteuerplaetze);
  const sicherungen = useSpeicher((z) => z.daten.abenteuersicherungen);
  const bereit = useSpeicher((z) => z.geladen || z.fehler !== null);
  const plaetze = useMemo(
    () => platzliste({ abenteuer, abenteuerplaetze }),
    [abenteuer, abenteuerplaetze],
  );
  return useMemo(
    () => ({
      plaetze,
      sicherungen,
      bereit,
      lade: (kennung) => aendere((d) => mitGeladenemPlatz(d, kennung)),
      beginne: async (neu) => {
        await aendere((d) => mitNeuemSpiel(d, neu));
        // Der Beginn kann beim Anlegen vorgerückt sein (gleiche Millisekunde, speicherplaetze.ts).
        const gespielt = speicherzustand().daten.abenteuer;
        return gespielt ? platzkennung(gespielt) : platzkennung(neu);
      },
      loesche: (kennung) => aendere((d) => ohneSicherungenDes(ohnePlatz(d, kennung), kennung)),
      sichere: sichereStand,
      ladeSicherung: (platz, gesichert) =>
        aendere((d) => mitGeladenerSicherung(d, platz, gesichert)),
      loescheSicherung: (platz, gesichert) => aendere((d) => ohneSicherung(d, platz, gesichert)),
    }),
    [plaetze, sicherungen, bereit],
  );
}
