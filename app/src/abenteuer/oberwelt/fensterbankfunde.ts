/**
 * Funde für die Fensterbank (Atmosphäre T15), getrennt von der Ansicht Fensterbank.tsx.
 * Abhängigkeiten: daten/laden.ts.
 */
import type { Funddaten } from "../daten/laden";
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/**
 * Die Funde in der Reihenfolge des Findens, mit ihren Daten; unbekannte Kennungen (Fund aus
 * einer älteren Fassung) fallen weg. Beispiel: [finchLaeuferA, schluessel] → beide mit Namen.
 */
export function fensterbankfunde(
  gefunden: Abenteuerstand["funde"],
  funde: readonly Funddaten[],
): Funddaten[] {
  return gefunden.flatMap((g) => funde.filter((f) => f.kennung === g.kennung).slice(0, 1));
}

/**
 * Das Bild eines Fundes: das Feld `bild` aus funde.json, sonst der Name nach der Regel der
 * Lieferungen, „bilder/fund-<kennung>.webp“. Warum: Ein Bild, das der Autor hochlädt (Paketbau,
 * skripte/grossbilder.mjs), soll sofort im Spiel erscheinen, auch bevor jemand funde.json ergänzt
 * (20.11.2026). Fehlt die Datei, zeigt Fundbild.tsx nichts, wie bisher.
 * Beispiel: { kennung: "finchBauerB" } → „bilder/fund-finch-bauer-b.webp“.
 */
export function bildDesFundes(fund: Pick<Funddaten, "kennung" | "bild">): string {
  if (fund.bild) return fund.bild;
  const name = fund.kennung.replace(/[A-Z]/g, (b) => `-${b.toLowerCase()}`).replace(/_/g, "-");
  return `bilder/fund-${name}.webp`;
}
