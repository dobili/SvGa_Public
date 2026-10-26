/**
 * Holzfelder für die Brettfarbe „Holz“: die Felder zeigen Fotos echten Holzes.
 *
 * Rolle im Gesamtbild: Wunsch des Autors: Eine gerechnete Maserung sah zu unecht aus; Vorbild ist
 * das Holzbrett von Lichess. Zwei Muster (hell, dunkel) legen je ein Holzfoto über das ganze
 * Brett; jedes Feld zeigt den Ausschnitt an seiner Stelle, so läuft die Faser wie bei einem
 * echten Brett weiter. Bis das Bild geladen ist, gilt die Grundfarbe. Die Bilder liegen offline
 * im App-Speicher (vite-plugin-pwa, Muster *.webp). Hier steht auch das ganze Brettbild der
 * Materialbretter (Brettbild).
 * Abhängigkeiten: masse.ts.
 */
import { BRETT, BRETTFARBEN, HOLZ, holzmuster } from "./masse";

/**
 * Die beiden Muster als SVG-Definitionen; Felder füllen sich mit ``url(#holzmuster(…))``.
 *
 * Eingabe: Kennung des Brettes (useId), damit mehrere Bretter auf einer Seite getrennt bleiben.
 * Beispiel: Abb. 1.26 mit Brettfarbe „Holz“: helles Ahorn, dunkles Nussbaumholz.
 */
export function Holzfelder({ kennung }: { kennung: string }) {
  const teile = [
    { hell: true, bild: HOLZ.hell, grund: BRETTFARBEN.holz.hell },
    { hell: false, bild: HOLZ.dunkel, grund: BRETTFARBEN.holz.dunkel },
  ];
  return (
    <defs>
      {teile.map(({ hell, bild, grund }) => (
        <pattern
          key={bild}
          id={holzmuster(kennung, hell)}
          patternUnits="userSpaceOnUse"
          width={BRETT}
          height={BRETT}
        >
          <rect width={BRETT} height={BRETT} fill={grund} />
          <image
            href={`${import.meta.env.BASE_URL}${bild}`}
            width={BRETT}
            height={BRETT}
            preserveAspectRatio="none"
          />
        </pattern>
      ))}
    </defs>
  );
}

/**
 * Ein ganzes Brettbild (Materialbretter, seit 0.2.84). Das Muster heller und dunkler Felder ist
 * punktsymmetrisch (a8 und h1 hell), deshalb passt das Bild auch auf das gedrehte Brett.
 */
export function Brettbild({ pfad }: { pfad: string }) {
  return (
    <image
      href={`${import.meta.env.BASE_URL}${pfad}`}
      width={BRETT}
      height={BRETT}
      preserveAspectRatio="none"
    />
  );
}
