/**
 * Anbindung der Nebenaufgaben des Lernpfads an Speicher, Erfolge und nachschlagen.json.
 *
 * Rolle im Gesamtbild: Holt die Stücke der Karte „Deine Erfolge“ (erfolge/useErfolge.ts, dieselbe
 * Rechnung wie im Profil, mit Probe des Autors), den Lernstand, den Fortschritt und die Zahl der
 * Lernziele je Kapitel und rechnet daraus mit nebenaufgaben.ts und kapitelaufgaben.ts die
 * Nebenaufgaben je Kapitel. Nichts wird gespeichert.
 * Abhängigkeiten: nebenaufgaben.ts, kapitelaufgaben.ts, erfolge/useErfolge.ts, daten/laden.ts,
 * bausteine/useDaten.ts, app/lernstand.ts, speicher, React.
 */
import { useMemo } from "react";
import { useLernstand } from "../../../app/lernstand";
import { ladeNachschlagen } from "../../../daten/laden";
import { useSpeicher } from "../../../speicher/speicher";
import { useDaten } from "../bausteine/useDaten";
import type { Erfolgsstueck } from "../erfolge/erfolgsstuecke";
import { useErfolge } from "../erfolge/useErfolge";
import { kapitelaufgaben } from "./kapitelaufgaben";
import { nebenaufgabenJeKapitel } from "./nebenaufgaben";

/** Kein Lernziel, solange nachschlagen.json lädt. */
const OHNE_LERNZIELE: ReadonlyMap<number, number> = new Map();

/**
 * Die Nebenaufgaben je Kapitel für diese Kapitelnummern; null, solange Erfolge oder Speicher
 * laden. Beispiel: useNebenaufgaben([0, 1, …, 12]).get(4) → Übungen, Lernziele, Trainer,
 * „Kurzer Prozess“, „Drei Rivalen besiegt“.
 */
export function useNebenaufgaben(
  kapitel: readonly number[],
): ReadonlyMap<number, readonly Erfolgsstueck[]> | null {
  const erfolge = useErfolge();
  const fortschritt = useSpeicher((z) => z.daten.fortschritt);
  const lernstand = useLernstand();
  const nachschlagen = useDaten(ladeNachschlagen, "nachschlagen");
  const lernziele = useMemo(
    () =>
      nachschlagen.art === "fertig"
        ? new Map(nachschlagen.wert.lernziele.map((z) => [z.kapitel, z.punkte.length]))
        : OHNE_LERNZIELE,
    [nachschlagen],
  );
  return useMemo(() => {
    if (!erfolge) return null;
    const alle = erfolge.regale.flatMap((r) => r.stuecke);
    const quelle = { fortschritt, lernstand, lernziele };
    return nebenaufgabenJeKapitel(alle, kapitel, (k) => kapitelaufgaben(k, quelle));
  }, [erfolge, fortschritt, lernstand, lernziele, kapitel]);
}
