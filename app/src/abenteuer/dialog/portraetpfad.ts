/**
 * Dateinamen der Porträts im Zusatzpaket (Q17-2), getrennt von der Komponente Portraet.tsx.
 * Fassungen (Atmosphäre T4): `#stimmung:<fassung>` zeigt ein eigenes Bild, wenn die Fassung in
 * FASSUNGEN steht und die Datei im Paket liegt; sonst die Grundfassung (Portraet.tsx).
 * Abhängigkeiten: keine.
 */

/**
 * Stimmungen mit eigenem Bild: `jung` (Ambroses Erinnerungen) und die Fassungen aus T4 (Bilder
 * folgen). Andere Stimmungen (froh, lacht, …) zeigen die Grundfassung.
 */
export const FASSUNGEN: readonly string[] = [
  "jung",
  "ertappt",
  "riss",
  "alt",
  "lachtOhneSpott",
  "muede",
];

/** camelCase als kebab-case: „lachtOhneSpott“ → „lacht-ohne-spott“. */
function kebab(name: string): string {
  return name.replace(/[A-Z]/g, (b) => `-${b.toLowerCase()}`);
}

/**
 * Dateiname des Porträts.
 * Beispiel: („coachDelgado“, null) → „portraets/coach-delgado.svg“; („mira“, „lachtOhneSpott“) →
 * „portraets/mira-lacht-ohne-spott.svg“. Sonderfall: Stimmung ohne Fassung → Grundfassung.
 */
export function portraetpfad(sprecher: string, stimmung: string | null): string {
  const fassung = stimmung && FASSUNGEN.includes(stimmung) ? `-${kebab(stimmung)}` : "";
  return `portraets/${kebab(sprecher)}${fassung}.svg`;
}
