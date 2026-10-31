/**
 * Medaillen aller Themen aus dem Speicher, mit Probe (Gamifizierung P3).
 *
 * Rolle im Gesamtbild: Profilkarte „Deine Themen“, Probe der Aufgabenseite und Lage der Extras
 * lesen dieselben Medaillen. Nur Themen mit Namen (training/themennamen.ts) erscheinen; ein neuer
 * Trainer erscheint, sobald er Antworten mit eigenem Präfix notiert und sein Thema einen Namen hat.
 * Abhängigkeiten: training/meisterschaftsstand.ts, themenprobe.ts, thementexte.ts, Speicher.
 */
import { useMemo } from "react";
import { useSpeicher } from "../../../speicher/speicher";
import { themenmedaillen, type Themenmedaille } from "../../../training/meisterschaftsstand";
import { useThemenprobe } from "./themenprobe";
import { hatThemenname } from "./thementexte";

/** Alle Medaillen mit Namen, sortiert nach Kennung (Präfix zuerst, so stehen Trainer beisammen). */
export function useThemenmedaillen(): readonly Themenmedaille[] {
  const themen = useSpeicher((z) => z.daten.themen);
  const verdient = useSpeicher((z) => z.daten.verdient);
  const probe = useThemenprobe();
  return useMemo(
    () =>
      themenmedaillen({ themen, verdient }, new Date(), probe).filter((m) =>
        hatThemenname(m.thema),
      ),
    [themen, verdient, probe],
  );
}
