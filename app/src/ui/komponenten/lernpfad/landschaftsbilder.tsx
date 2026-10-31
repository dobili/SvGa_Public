/**
 * Die fünf Landschaften hinter dem Lernpfad (Gestaltung B1 „Fünf Landschaften“, Wahl des Autors
 * vom 31.10.2026): Grundlagen als Schachbrettmuster, Eröffnung als Morgendämmerung mit Sonne,
 * Mittelspiel als Hügel mit Türmen, Endspiel als Nachthimmel mit wenigen Sternen und Mond,
 * Praxis als Turniersaal mit Lampen, Tischen und Uhren.
 *
 * Rolle im Gesamtbild: Die Liste LANDSCHAFTEN (landschaften.ts) ordnet jedem Teil eines dieser
 * Bilder zu; Landschaft.tsx zeichnet es in das Band der Etappe. Alles selbst gezeichnet (SVG),
 * nichts Fremdes eingebunden.
 * Die Farben stehen als Größen --land-* in lernpfad.css, je eine Fassung für hell und dunkel;
 * die Bilder bewegen sich nicht (Rücksicht auf „Bewegung reduzieren“, ruhiger Hintergrund).
 * Abhängigkeiten: wegform.ts (BREITE), React.
 */
import { useId } from "react";
import { BREITE } from "./wegform";

/** Größe eines Bildes im Koordinatensystem des Weges (Breite immer BREITE). */
export interface Flaeche {
  readonly hoehe: number;
}

const FELD = 40;
const LINIEN = "abcdefgh";

/** Grundlagen: Schachbrettmuster, unten die Linien a bis h. */
export function Schachbrett({ hoehe }: Flaeche) {
  const id = useId();
  return (
    <>
      <defs>
        <pattern id={id} width={FELD * 2} height={FELD * 2} patternUnits="userSpaceOnUse">
          <rect width={FELD} height={FELD} className="land-brett-feld" />
          <rect x={FELD} y={FELD} width={FELD} height={FELD} className="land-brett-feld" />
        </pattern>
      </defs>
      <rect width={BREITE} height={hoehe} className="land-brett" />
      <rect width={BREITE} height={hoehe} fill={`url(#${id})`} />
      {[...LINIEN].map((b, i) => (
        <text key={b} x={i * (BREITE / 8) + 18} y={hoehe - 10} className="land-brett-schrift">
          {b}
        </text>
      ))}
    </>
  );
}

/** Verlauf von oben nach unten über drei Farben (Klassen der Haltepunkte). */
function Verlauf({
  id,
  klassen,
  hoehe,
}: {
  id: string;
  klassen: readonly string[];
  hoehe: number;
}) {
  const letzter = klassen.length - 1;
  // In Einheiten der Fläche, damit auch der Schatten des Mondes genau die Farbe des Himmels trifft.
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2={hoehe} gradientUnits="userSpaceOnUse">
      {klassen.map((k, i) => (
        <stop key={k} offset={letzter > 0 ? i / letzter : 0} className={k} />
      ))}
    </linearGradient>
  );
}

const STRAHLEN = 9;
const SONNE_X = 290;

/** Eröffnung: Morgendämmerung, die Sonne geht rechts am Horizont auf. */
export function Morgen({ hoehe }: Flaeche) {
  const id = useId();
  const cy = hoehe - 36;
  return (
    <>
      <defs>
        <Verlauf
          id={id}
          klassen={["land-morgen-1", "land-morgen-2", "land-morgen-3"]}
          hoehe={hoehe}
        />
      </defs>
      <rect width={BREITE} height={hoehe} fill={`url(#${id})`} />
      {Array.from({ length: STRAHLEN }, (_, i) => {
        const winkel = Math.PI + (i + 0.5) * (Math.PI / STRAHLEN);
        const [c, s] = [Math.cos(winkel), Math.sin(winkel)];
        return (
          <line
            key={i}
            x1={SONNE_X + c * 48}
            y1={cy + s * 48}
            x2={SONNE_X + c * 120}
            y2={cy + s * 120}
            className="land-strahl"
          />
        );
      })}
      <circle cx={SONNE_X} cy={cy} r={34} className="land-sonne" />
      <path
        d={`M0 ${hoehe - 28} Q 90 ${hoehe - 56} 180 ${hoehe - 32} T ${BREITE} ${hoehe - 38} V ${hoehe} H 0 Z`}
        className="land-horizont"
      />
    </>
  );
}

/** Ein Turm (Burg) als Schattenriss mit kleiner Fahne. */
function Turm({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 11} ${y - 30})`}>
      <path d="M0 0h5v4h4V0h4v4h4V0h5v8l-3 3v15h3v4H0v-4h3V11L0 8z" className="land-turm" />
      <path d="M11 0v-14l11 4-11 4" className="land-fahne" />
    </g>
  );
}

/** Mittelspiel: drei Hügelketten hintereinander, auf ihnen Türme. */
export function Huegel({ hoehe }: Flaeche) {
  const kette = (oben: number, welle: number) =>
    `M0 ${oben} Q 60 ${oben - welle} 120 ${oben} T 240 ${oben} T ${BREITE} ${oben} V ${hoehe} H 0 Z`;
  return (
    <>
      <rect width={BREITE} height={hoehe} className="land-huegel-grund" />
      <path d={kette(hoehe * 0.3, 40)} className="land-huegel-1" />
      <Turm x={60} y={hoehe * 0.3 - 18} />
      <path d={kette(hoehe * 0.58, 34)} className="land-huegel-2" />
      <Turm x={300} y={hoehe * 0.58 - 4} />
      <path d={kette(hoehe * 0.84, 26)} className="land-huegel-3" />
    </>
  );
}

/** Sterne der Nacht als Anteile der Fläche (x, y, Radius); wenige, ruhig verteilt. */
const STERNE: readonly (readonly [number, number, number])[] = [
  [0.06, 0.12, 1.2],
  [0.22, 0.34, 1],
  [0.41, 0.08, 1.4],
  [0.55, 0.52, 1],
  [0.72, 0.2, 1.2],
  [0.93, 0.36, 1],
  [0.12, 0.7, 1.3],
  [0.84, 0.78, 1.1],
  [0.35, 0.9, 1],
];

/** Ein funkelnder Stern mit vier Zacken. */
function Funkeln({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y - 9}L${x + 2} ${y - 2}L${x + 9} ${y}L${x + 2} ${y + 2}L${x} ${y + 9}L${x - 2} ${y + 2}L${x - 9} ${y}L${x - 2} ${y - 2}Z`}
      className="land-stern"
    />
  );
}

/** Endspiel: Nachthimmel mit wenigen Sternen und Mondsichel. */
export function Nacht({ hoehe }: Flaeche) {
  const id = useId();
  return (
    <>
      <defs>
        <Verlauf id={id} klassen={["land-nacht-1", "land-nacht-2"]} hoehe={hoehe} />
      </defs>
      <rect width={BREITE} height={hoehe} fill={`url(#${id})`} />
      {STERNE.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x * BREITE} cy={y * hoehe} r={r} className="land-stern" />
      ))}
      <Funkeln x={BREITE * 0.86} y={hoehe * 0.16} />
      <Funkeln x={BREITE * 0.94} y={hoehe * 0.62} />
      <circle cx={BREITE * 0.88} cy={hoehe * 0.4} r={20} className="land-mond" />
      <circle cx={BREITE * 0.88 + 8} cy={hoehe * 0.4 - 6} r={18} fill={`url(#${id})`} />
    </>
  );
}

/** Eine Lampe an der Decke mit Lichtkegel. */
function Lampe({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 14} 34 L${x - 70} 220 H${x + 70} L${x + 14} 34 Z`} className="land-licht" />
      <line x1={x} y1={0} x2={x} y2={24} className="land-kabel" />
      <path d={`M${x - 13} 34 Q ${x} 18 ${x + 13} 34 Z`} className="land-lampe" />
    </g>
  );
}

/** Ein Turniertisch mit Brettchen und Uhr. */
function Tisch({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={70} height={8} rx={2} className="land-tisch" />
      <rect x={x + 4} y={y + 8} width={3} height={18} className="land-tisch" />
      <rect x={x + 63} y={y + 8} width={3} height={18} className="land-tisch" />
      <rect x={x + 12} y={y - 7} width={16} height={7} className="land-brettchen" />
      <rect x={x + 44} y={y - 9} width={13} height={9} rx={1.5} className="land-uhr" />
      <rect x={x + 46} y={y - 12} width={4} height={3} className="land-fahne" />
    </g>
  );
}

const TISCHREIHEN = [0.45, 0.78];
const TISCHE_X = [8, 104, 200, 284];

/** Praxis: Turniersaal mit drei Lampen und zwei Reihen Tische. */
export function Saal({ hoehe }: Flaeche) {
  const id = useId();
  return (
    <>
      <defs>
        <Verlauf id={id} klassen={["land-saal-1", "land-saal-2"]} hoehe={hoehe} />
      </defs>
      <rect width={BREITE} height={hoehe} fill={`url(#${id})`} />
      {[60, 180, 300].map((x) => (
        <Lampe key={x} x={x} />
      ))}
      {TISCHREIHEN.flatMap((reihe) =>
        TISCHE_X.map((x) => <Tisch key={`${reihe}-${x}`} x={x} y={reihe * hoehe} />),
      )}
    </>
  );
}
