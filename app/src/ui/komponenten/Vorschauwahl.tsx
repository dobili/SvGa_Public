/**
 * Auswahl mit Vorschau: Brettfarben und Figurensätze als Kacheln mit kleinem Brettausschnitt.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): In der Karte „Darstellung und Training“
 * soll man sehen, wie Brett und Figuren aussehen, bevor man wählt. Jede Kachel zeigt vier Felder
 * (hell, dunkel, hell, dunkel) mit weißem König und Springer und schwarzem Springer und Bauern,
 * gezeichnet wie auf dem Brett (Figur.tsx, Holzfelder.tsx). Für Bildschirmleser eine Gruppe von
 * Radioknöpfen wie Auswahl.tsx; die Vorschau ist Schmuck (aria-hidden).
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

/**
 * Kacheln zur Wahl mit Vorschau; genau eine ist gewählt.
 * Eingaben: Name der Gruppe, Werte, gewählter Wert, Beschriftung, Vorschau je Wert, Wahl.
 */
export function Vorschauwahl<T extends string>({
  name,
  werte,
  gewaehlt,
  text,
  vorschau,
  beiWahl,
}: {
  name: string;
  werte: readonly T[];
  gewaehlt: T;
  text: (wert: T) => string;
  vorschau: (wert: T) => React.ReactNode;
  beiWahl: (wert: T) => void;
}) {
  return (
    <div className="einstellung-auswahl" role="radiogroup" aria-label={name}>
      <span className="einstellung-name">{name}</span>
      <div className="vorschaureihe">
        {werte.map((wert) => (
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
  );
}
