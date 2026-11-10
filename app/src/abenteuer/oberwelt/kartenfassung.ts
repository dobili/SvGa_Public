/**
 * Zweite Fassungen einer Karte (zustand_der_karte, Runde 6): Ein Ort sieht nach einer Szene anders
 * aus (Musikhaus erst Ruine, nach musikhausOffen der neue Clubraum).
 *
 * Rolle im Gesamtbild: Reine Logik für weltdaten.ts (getestet in kartenfassung.test.ts), ohne
 * Phaser. Die Fassungen stehen in orte.json unter `zustaende` der Karte (Variable → Datei); der
 * Hintergrund heißt dann grafik/karten/<kennung>-<variable>.png.
 */

/**
 * Die Fassung einer Karte (zustand_der_karte, Runde 6): die erste in `zustaende`, deren
 * Dialogvariable wahr ist, sonst die gewöhnliche Datei.
 * Beispiel: Musikhaus mit musikhausOffen = true → port-delacroix-musikhaus-neu.json, Zustand
 * „musikhausOffen“ (Hintergrund portDelacroix.musikhaus-musikhausOffen.png).
 */
export function kartenfassung(
  karte: { readonly datei: string; readonly zustaende?: Readonly<Record<string, string>> },
  variablen: Readonly<Record<string, unknown>>,
): { readonly datei: string; readonly zustand: string | null } {
  const treffer = Object.entries(karte.zustaende ?? {}).find(([flag]) => Boolean(variablen[flag]));
  return treffer
    ? { datei: treffer[1], zustand: treffer[0] }
    : { datei: karte.datei, zustand: null };
}
