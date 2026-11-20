/**
 * Adressen und Cache-Namen des Abenteuerpakets (paket/paketlader.ts, paket/dateiladen.ts).
 * Ausgelagert aus dem Paketlader (Codepflege 20.11.2026, Regel 4: Dateien unter 400 Zeilen).
 * Abhängigkeiten: schnittstelle/paket.ts (PAKET_PFAD).
 */
import { PAKET_PFAD } from "../schnittstelle/paket";

/** So beginnen die Namen der Caches des Pakets: „abenteuer-<version>“. */
export const CACHE_PRAEFIX = "abenteuer-";

/** Pfad des Pakets unter der Basis der App, etwa „/abenteuer/“. */
export function basis(): string {
  return `${import.meta.env.BASE_URL}${PAKET_PFAD}`;
}

/** Volle Adresse einer Paketdatei. Beispiel: „karten/x.json“ → „https://…/abenteuer/karten/x.json“. */
export function adresse(pfad: string): string {
  return new URL(`${basis()}${pfad}`, window.location.href).href;
}

/** Name des Caches einer Paketversion. Beispiel: „0.3.56-ed15“ → „abenteuer-0.3.56-ed15“. */
export function cachename(version: string): string {
  return `${CACHE_PRAEFIX}${version}`;
}

/** Gibt es Cache Storage (alte Browser und manche Testläufe nicht)? */
export function mitCache(): boolean {
  return typeof window !== "undefined" && "caches" in window;
}
