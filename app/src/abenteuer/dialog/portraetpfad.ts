/**
 * Dateinamen der Porträts im Zusatzpaket (Q17-2), getrennt von der Komponente Portraet.tsx.
 * Abhängigkeiten: keine.
 */
/** Dateiname des Porträts. Beispiel: („coachDelgado“, null) → „portraets/coach-delgado.svg“. */
export function portraetpfad(sprecher: string, stimmung: string | null): string {
  const name = sprecher.replace(/[A-Z]/g, (b) => `-${b.toLowerCase()}`);
  return `portraets/${name}${stimmung === "jung" ? "-jung" : ""}.svg`;
}
