/**
 * Auswahl mit Vorschau: Brettfarben und Figurensätze als Kacheln mit kleinem Brettausschnitt.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): In der Karte „Einstellungen“ soll man
 * sehen, wie Brett und Figuren aussehen, bevor man wählt. Jede Kachel zeigt die Ecke a8 bis b7
 * (2 × 2 Felder, quadratisch, Wunsch des Autors) mit weißem König und Springer und schwarzem
 * Springer und Bauern, gezeichnet wie auf dem Brett (Figur.tsx, Holzfelder.tsx). Für
 * Bildschirmleser eine Gruppe von Radioknöpfen wie Auswahl.tsx; die Vorschau ist Schmuck
 * (aria-hidden). Die Kacheln lassen sich in Gruppen mit Überschrift teilen (Figurensätze:
 * Klassisch, Modern, Holz).
 * Abhängigkeiten: app/einstellungen.ts (Typen), ui/brett/Figur.tsx, Holzfelder.tsx, masse.ts.
 */
import { useId } from "react";
import type { Brettfarben, Figurensatz } from "../../../app/einstellungen";
import { Figur } from "../../brett/Figur";
import { Brettbild, Holzfelder } from "../../brett/Holzfelder";
import { BRETTFARBEN, FELD, holzmuster } from "../../brett/masse";

/** Die vier Felder der Vorschau (a8, b8, a7, b7) mit ihren Figuren (FEN-Zeichen). */
const FELDER: readonly { hell: boolean; figur: string; spalte: number; reihe: number }[] = [
  { hell: true, figur: "K", spalte: 0, reihe: 0 },
  { hell: false, figur: "N", spalte: 1, reihe: 0 },
  { hell: false, figur: "n", spalte: 0, reihe: 1 },
  { hell: true, figur: "p", spalte: 1, reihe: 1 },
];
/** Seitenlänge der Vorschau in Feldern. */
const SEITE = 2;

/**
 * Ein Brettausschnitt aus vier Feldern mit Figuren.
 * Beispiel: Brettfarben „Holz“ mit Figurensatz „klassisch“.
 */
export function Brettausschnitt({ farben, satz }: { farben: Brettfarben; satz: Figurensatz }) {
  const kennung = useId();
  const palette = BRETTFARBEN[farben];
  const fuellung = (hell: boolean) =>
    farben === "holz" ? `url(#${holzmuster(kennung, hell)})` : hell ? palette.hell : palette.dunkel;
  return (
    <svg
      className="brettausschnitt"
      viewBox={`0 0 ${SEITE * FELD} ${SEITE * FELD}`}
      aria-hidden="true"
    >
      {farben === "holz" && <Holzfelder kennung={kennung} />}
      {FELDER.map((f, i) => (
        <rect
          key={i}
          x={f.spalte * FELD}
          y={f.reihe * FELD}
          width={FELD}
          height={FELD}
          fill={fuellung(f.hell)}
        />
      ))}
      {/* Die obere linke Ecke des Brettbildes: a8, b8, a7, b7. */}
      {palette.bild && <Brettbild pfad={palette.bild} />}
      {FELDER.map((f, i) => (
        <Figur
          key={i}
          zeichen={f.figur}
          x={f.spalte * FELD}
          y={f.reihe * FELD}
          satz={satz}
          farbe={palette.figur}
        />
      ))}
    </svg>
  );
}

/** Eine Gruppe von Kacheln, optional mit Überschrift. */
export interface Kachelgruppe<T extends string> {
  readonly titel?: string;
  readonly werte: readonly T[];
}

/**
 * Kacheln zur Wahl mit Vorschau; genau eine ist gewählt.
 * Eingaben: Name der Wahl, Werte (oder Gruppen von Werten), gewählter Wert, Beschriftung,
 * Vorschau je Wert, Wahl. Beispiel: Figurensätze in den Gruppen Klassisch, Modern, Holz.
 */
export function Vorschauwahl<T extends string>({
  name,
  werte,
  gruppen,
  gewaehlt,
  text,
  vorschau,
  beiWahl,
}: {
  name: string;
  werte?: readonly T[];
  gruppen?: readonly Kachelgruppe<T>[];
  gewaehlt: T;
  text: (wert: T) => string;
  vorschau: (wert: T) => React.ReactNode;
  beiWahl: (wert: T) => void;
}) {
  const alle: readonly Kachelgruppe<T>[] = gruppen ?? [{ werte: werte ?? [] }];
  return (
    <div className="einstellung-auswahl" role="radiogroup" aria-label={name}>
      <span className="einstellung-name">{name}</span>
      {alle.map((gruppe, stelle) => (
        <div key={gruppe.titel ?? stelle} className="vorschaugruppe">
          {gruppe.titel && <span className="vorschaugruppe-titel">{gruppe.titel}</span>}
          <div className="vorschaureihe">
            {gruppe.werte.map((wert) => (
              <button
                key={wert}
                type="button"
                role="radio"
                aria-checked={wert === gewaehlt}
                className="vorschaukachel"
                onClick={() => beiWahl(wert)}
              >
                {vorschau(wert)}
                <span>{text(wert)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
