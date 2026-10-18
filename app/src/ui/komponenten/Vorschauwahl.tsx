/**
 * Auswahl mit Vorschau: Brettfarben und Figurensätze als Kacheln mit kleinem Brettausschnitt.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): In der Karte „Darstellung und Training“
 * soll man sehen, wie Brett und Figuren aussehen, bevor man wählt. Jede Kachel zeigt vier Felder
 * (hell, dunkel, hell, dunkel) mit weißem König und Springer und schwarzem Springer und Bauern,
 * gezeichnet wie auf dem Brett (Figur.tsx, Holzfelder.tsx). Für Bildschirmleser eine Gruppe von
 * Radioknöpfen wie Auswahl.tsx; die Vorschau ist Schmuck (aria-hidden). Seit 0.2.81 lassen sich
 * die Kacheln in Gruppen mit Überschrift teilen (Figurensätze: Klassisch, Modern, Holz).
 * Abhängigkeiten: app/einstellungen.ts (Typen), ui/brett/Figur.tsx, Holzfelder.tsx, masse.ts.
 */
import { useId } from "react";
import type { Brettfarben, Figurensatz } from "../../app/einstellungen";
import { Figur } from "../brett/Figur";
import { Holzfelder } from "../brett/Holzfelder";
import { BRETTFARBEN, FELD, holzmuster } from "../brett/masse";

/** Die vier Felder der Vorschau mit ihren Figuren (FEN-Zeichen). */
const FELDER: readonly { hell: boolean; figur: string }[] = [
  { hell: true, figur: "K" },
  { hell: false, figur: "N" },
  { hell: true, figur: "n" },
  { hell: false, figur: "p" },
];

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
      viewBox={`0 0 ${FELDER.length * FELD} ${FELD}`}
      aria-hidden="true"
    >
      {farben === "holz" && <Holzfelder kennung={kennung} />}
      {FELDER.map((f, i) => (
        <g key={i}>
          <rect x={i * FELD} y={0} width={FELD} height={FELD} fill={fuellung(f.hell)} />
          <Figur zeichen={f.figur} x={i * FELD} y={0} satz={satz} farbe={palette.figur} />
        </g>
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
