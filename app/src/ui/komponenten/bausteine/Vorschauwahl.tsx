/**
 * Auswahl mit Vorschau: Brettfarben und Figurensätze als Kacheln mit kleinem Brettausschnitt.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): In der Karte „Einstellungen“ soll man
 * sehen, wie Brett und Figuren aussehen, bevor man wählt. Jede Kachel zeigt die Ecke a8 bis b7
 * (2 × 2 Felder, quadratisch, Wunsch des Autors) mit weißem König und Springer und schwarzem
 * Springer und Bauern, gezeichnet wie auf dem Brett (Figur.tsx, Holzfelder.tsx). Für
 * Bildschirmleser eine Gruppe von Radioknöpfen wie Auswahl.tsx; die Vorschau ist Schmuck
 * (aria-hidden). Die Kacheln lassen sich in Gruppen mit Überschrift teilen (Figurensätze:
 * Klassisch, Modern, Holz). Seit Gamifizierung P7 kann eine Kachel gesperrt sein (freischaltbares
 * Extra): Dann zeigt sie die echte Vorschau abgedunkelt mit Schloss (Sperrbild.tsx, seit
 * 31.10.2026 statt einer grauen Silhouette) und darunter die Bedingung und lässt sich nicht wählen.
 * Abhängigkeiten: app/einstellungen.ts (Typen), ui/brett/Figur.tsx, Holzfelder.tsx, masse.ts,
 * Sperrbild.tsx.
 */
import { useId } from "react";
import type { Brettfarben, Figurensatz } from "../../../app/einstellungen";
import { Figur } from "../../brett/Figur";
import { Brettbild, Holzfelder } from "../../brett/Holzfelder";
import { BRETTFARBEN, FELD, holzmuster } from "../../brett/masse";
import { Sperrbild } from "./Sperrbild";

/** Ein Feld der Vorschau: hell oder dunkel, Figur als FEN-Zeichen ("" ohne Figur), Lage. */
export interface Vorschaufeld {
  readonly hell: boolean;
  readonly figur: string;
  readonly spalte: number;
  readonly reihe: number;
}

/** Die vier Felder der Vorschau (a8, b8, a7, b7) mit ihren Figuren (FEN-Zeichen). */
const FELDER: readonly Vorschaufeld[] = [
  { hell: true, figur: "K", spalte: 0, reihe: 0 },
  { hell: false, figur: "N", spalte: 1, reihe: 0 },
  { hell: false, figur: "n", spalte: 0, reihe: 1 },
  { hell: true, figur: "p", spalte: 1, reihe: 1 },
];
/** Seitenlänge der Vorschau in Feldern. */
const SEITE = 2;

/**
 * Ein Brettausschnitt aus vier Feldern mit Figuren; mit `felder` und `seite` auch größer
 * (Mini-Brett der Profilkarte „Deine Extras“, 4 × 4 Felder).
 * Beispiel: Brettfarben „Holz“ mit Figurensatz „klassisch“.
 */
export function Brettausschnitt({
  farben,
  satz,
  felder = FELDER,
  seite = SEITE,
}: {
  farben: Brettfarben;
  satz: Figurensatz;
  felder?: readonly Vorschaufeld[];
  seite?: number;
}) {
  const kennung = useId();
  const palette = BRETTFARBEN[farben];
  const fuellung = (hell: boolean) =>
    farben === "holz" ? `url(#${holzmuster(kennung, hell)})` : hell ? palette.hell : palette.dunkel;
  return (
    <svg
      className="brettausschnitt"
      viewBox={`0 0 ${seite * FELD} ${seite * FELD}`}
      aria-hidden="true"
    >
      {farben === "holz" && <Holzfelder kennung={kennung} />}
      {felder.map((f, i) => (
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
      {felder.map((f, i) => (
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

/** Eine Kachel; mit Bedingung gesperrt (abgedunkelt, Schloss, nicht wählbar). */
function Kachel({
  gewaehlt,
  text,
  bedingung,
  beiWahl,
  children,
}: {
  gewaehlt: boolean;
  text: string;
  bedingung: string | undefined;
  beiWahl: () => void;
  children: React.ReactNode;
}) {
  const gesperrt = bedingung !== undefined;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={gewaehlt}
      aria-disabled={gesperrt || undefined}
      className={`vorschaukachel${gesperrt ? " vorschaukachel-gesperrt" : ""}`}
      onClick={gesperrt ? undefined : beiWahl}
    >
      <Sperrbild gesperrt={gesperrt}>{children}</Sperrbild>
      <span>{text}</span>
      {gesperrt && <span className="vorschaukachel-bedingung">{bedingung}</span>}
    </button>
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
 * Vorschau je Wert, Wahl, wahlweise eine Sperre je Wert (Text der Bedingung oder undefined).
 * Beispiel: Figurensätze in den Gruppen Klassisch, Modern, Holz; „Gold“ gesperrt „Ab Stufe 5“.
 */
export function Vorschauwahl<T extends string>({
  name,
  werte,
  gruppen,
  gewaehlt,
  text,
  vorschau,
  beiWahl,
  sperre = () => undefined,
}: {
  name: string;
  werte?: readonly T[];
  gruppen?: readonly Kachelgruppe<T>[];
  gewaehlt: T;
  text: (wert: T) => string;
  vorschau: (wert: T) => React.ReactNode;
  beiWahl: (wert: T) => void;
  sperre?: (wert: T) => string | undefined;
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
              <Kachel
                key={wert}
                gewaehlt={wert === gewaehlt}
                text={text(wert)}
                bedingung={sperre(wert)}
                beiWahl={() => beiWahl(wert)}
              >
                {vorschau(wert)}
              </Kachel>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
