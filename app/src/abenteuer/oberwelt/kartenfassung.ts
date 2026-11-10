/**
 * Zustände einer Karte (zustand_der_karte, Runde 6; Bedingungen seit Runde 8): Ein Ort sieht nach
 * einer Szene anders aus (Musikhaus erst Ruine, nach musikhausOffen der neue Clubraum; Steg im Park
 * gesperrt bis zur ersten Nadel).
 *
 * Rolle im Gesamtbild: Reine Logik für weltdaten.ts (getestet in kartenfassung.test.ts), ohne
 * Phaser. Die Zustände stehen in orte.json unter `zustaende` der Karte: Bedingung (regeln/
 * bedingung.ts, dieselbe Sprache wie `wenn`) → Datei `karten/<basis>-<zustand>.json`. Der Name
 * des Zustands ist der Teil hinter der Basis; der Hintergrund heißt
 * grafik/karten/<kennung>-<zustand>.png (pipeline/abenteuer/kartenbild.py schreibt ihn so).
 */
import { erfuellt } from "../regeln/bedingung";

/** „karten/port-delacroix-musikhaus.json“ → „port-delacroix-musikhaus“. */
function stamm(datei: string): string {
  return datei.replace(/^karten\//, "").replace(/\.json$/, "");
}

/**
 * Name eines Zustands aus seiner Datei und der Datei der Grundkarte.
 * Beispiel: karten/port-delacroix-musikhaus-neu.json zur Basis karten/port-delacroix-musikhaus.json
 * → „neu“. Passt die Datei nicht zur Basis, gilt ihr ganzer Stamm.
 */
export function zustandsname(datei: string, basis: string): string {
  const s = stamm(datei);
  const b = `${stamm(basis)}-`;
  return s.startsWith(b) && s.length > b.length ? s.slice(b.length) : s;
}

/**
 * Die Fassung einer Karte: der letzte Eintrag in `zustaende`, dessen Bedingung gilt, sonst die
 * Grundkarte. Beispiel: Musikhaus mit musikhausOffen = true → port-delacroix-musikhaus-neu.json,
 * Zustand „neu“ (Hintergrund portDelacroix.musikhaus-neu.png). Wirft bei einer fehlerhaften
 * Bedingung (Fehler in den Spieldaten).
 */
export function kartenfassung(
  karte: { readonly datei: string; readonly zustaende?: Readonly<Record<string, string>> },
  variablen: Readonly<Record<string, unknown>>,
): { readonly datei: string; readonly zustand: string | null } {
  const passend = Object.entries(karte.zustaende ?? {}).filter(([b]) => erfuellt(b, variablen));
  const letzter = passend[passend.length - 1];
  return letzter
    ? { datei: letzter[1], zustand: zustandsname(letzter[1], karte.datei) }
    : { datei: karte.datei, zustand: null };
}
