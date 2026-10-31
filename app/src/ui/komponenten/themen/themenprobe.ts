/**
 * Probe der Meisterschaft für den Autor (Gamifizierung P3): ein Thema zur Probe auf Silber oder
 * Gold setzen, ohne echte Antworten zu ändern.
 *
 * Rolle im Gesamtbild: Wie die Probe der Orden (fortschritt/ordenprobe.ts): Der Autor prüft auf der
 * Aufgabenseite Medaille, Profilkarte, Teilen und die Titel der Extras, ohne erst 15 Aufgaben
 * eines Themas zu lösen. Die Probe ist ein Merker auf dem Gerät („silber:taktik:fesselung,…“);
 * Profilkarte und Lage der Extras zählen sie mit, Erfahrung, Abzeichen und „verdient“ nicht.
 * Abhängigkeiten: app/merker.ts, training/meisterschaft.ts, React (useSyncExternalStore).
 */
import { useSyncExternalStore } from "react";
import { entferneMerker, liesMerker, schreibeMerker } from "../../../app/merker";
import {
  ausVerdientSchluessel,
  verdientSchluessel,
  type Medaillenstufe,
} from "../../../training/meisterschaft";
import type { Themenprobe } from "../../../training/meisterschaftsstand";

/** Name des Merkers. */
const MERKER_PROBE = "themenProbe";

const zuhoerer = new Set<() => void>();
let stand = lies();

/** Liest den Merker; jeder Eintrag hat die Form des Schlüssels in „verdient“ ohne Vorsilbe. */
function lies(): Themenprobe {
  const ergebnis: Record<string, Medaillenstufe> = {};
  for (const eintrag of (liesMerker(MERKER_PROBE) ?? "").split(",").filter(Boolean)) {
    const teil = ausVerdientSchluessel(`meisterschaft:${eintrag}`);
    if (teil) ergebnis[teil.thema] = teil.stufe;
  }
  return ergebnis;
}

function melde(): void {
  stand = lies();
  for (const z of zuhoerer) z();
}

/** Die Probe (Thema → Stufe); ändert sie sich, zeichnet React neu. */
export function useThemenprobe(): Themenprobe {
  return useSyncExternalStore(
    (z) => {
      zuhoerer.add(z);
      return () => zuhoerer.delete(z);
    },
    () => stand,
  );
}

/** Setzt ein Thema zur Probe auf eine Stufe. Beispiel: probeThema("taktik:fesselung", "silber"). */
export function probeThema(thema: string, stufe: Medaillenstufe): void {
  const neu = { ...lies(), [thema]: stufe };
  const eintraege = Object.entries(neu).map(([t, s]) =>
    verdientSchluessel(s, t).replace(/^meisterschaft:/, ""),
  );
  schreibeMerker(MERKER_PROBE, eintraege.join(","));
  melde();
}

/** Beendet die Probe: Alle Themen zählen wieder echt. */
export function beendeThemenprobe(): void {
  entferneMerker(MERKER_PROBE);
  melde();
}
