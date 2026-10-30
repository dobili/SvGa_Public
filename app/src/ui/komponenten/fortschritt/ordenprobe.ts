/**
 * Probe der Orden für den Autor: einen Ring zum Test auf 100 % setzen, ohne echte Fortschritte zu
 * ändern.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (26.10.2026): Im Menü mit seinen Aufgaben per Klick
 * einstellen können, dass ein Ring gerade voll wurde, um Gratulation, Ton, Orden und
 * Startanimation zu prüfen. Die Probe ist ein Merker auf dem Gerät (Liste der Ringe); die Ringe
 * (fortschrittsringe.ts) zeigen geprobte Ringe als voll. „Probe beenden“ entfernt die Liste und
 * vergisst die Gratulation dieser Ringe, damit eine echte später wieder kommt.
 * Abhängigkeiten: app/merker.ts, React (useSyncExternalStore).
 */
import { useSyncExternalStore } from "react";
import { entferneMerker, liesMerker, schreibeMerker } from "../../../app/merker";

/** Name des Merkers mit den geprobten Ringen („ich-uebungen,ich-bots-10“). */
const MERKER_PROBE = "ordenProbe";
/** Name des Merkers mit den gefeierten Ringen (fortschrittsringe.ts). */
const MERKER_GEFEIERT = "ringeGefeiert";

const zuhoerer = new Set<() => void>();
let stand = lies();

function lies(): ReadonlySet<string> {
  return new Set((liesMerker(MERKER_PROBE) ?? "").split(",").filter(Boolean));
}

function melde(): void {
  stand = lies();
  for (const z of zuhoerer) z();
}

/** Die Ringe, die gerade zur Probe als voll gelten; ändert sich die Probe, zeichnet React neu. */
export function useOrdenprobe(): ReadonlySet<string> {
  return useSyncExternalStore(
    (z) => {
      zuhoerer.add(z);
      return () => zuhoerer.delete(z);
    },
    () => stand,
  );
}

/** Setzt einen Ring zur Probe auf 100 %. Beispiel: probeRing("ich-uebungen"). */
export function probeRing(testid: string): void {
  schreibeMerker(MERKER_PROBE, [...lies(), testid].join(","));
  melde();
}

/** Beendet die Probe: Alle Ringe zählen wieder echt, ihre Probe-Gratulation ist vergessen. */
export function beendeProbe(): void {
  const geprobt = lies();
  const gefeiert = (liesMerker(MERKER_GEFEIERT) ?? "").split(",").filter(Boolean);
  schreibeMerker(MERKER_GEFEIERT, gefeiert.filter((r) => !geprobt.has(r)).join(","));
  entferneMerker(MERKER_PROBE);
  melde();
}
