/**
 * Zeichnung der Brettstile des Schach-Abenteuers: Pixelfiguren, Feldstruktur, Marke des letzten
 * Zuges und die Vorgabe für das Brett der App (ui/brett/brettstil.ts).
 *
 * Rolle im Gesamtbild: Aus einer Zeile der Stiltabelle (brettstile.ts) entsteht hier eine
 * Brettstilvorgabe, die Brett.tsx, Figur.tsx und Brettmarken.tsx statt der Wahl des Lesers
 * zeichnen. Jede Vorgabe entsteht einmal je Stil und bleibt dieselbe, damit React die Figuren
 * beim Ziehen nicht neu aufbaut. Pixel bleiben scharf (shape-rendering „crispEdges“).
 * Abhängigkeiten: brettstile.ts, pixelfiguren.ts, feldstruktur.ts, ui/brett (Maße, Geometrie).
 */
import { useId } from "react";
import type {
  Brettstilvorgabe,
  Figurzeichnung,
  Zugmarkenzeichnung,
} from "../../ui/brett/brettstil";
import { feldEcke } from "../../ui/brett/geometrie";
import { BRETT, FELD } from "../../ui/brett/masse";
import { figurfarben, STILTABELLE, type Brettstilkennung } from "./brettstile";
import { KACHEL_FELDER, STRUKTURPIXEL_JE_FELD, strukturpixel } from "./feldstruktur";
import { figurenraster, pixellaeufe, RASTERGROESSE } from "./pixelfiguren";

/** Klasse des Rahmens um das Brett (brettstil.css). */
const RAHMENKLASSE = "abenteuer-brettstil";

/** Eine Figur als Pixelbild in den Farben ihres Materials auf diesem Brett. */
function pixelfigur(kennung: Brettstilkennung) {
  return function Pixelfigur({ zeichen, x, y }: Figurzeichnung) {
    const raster = figurenraster(zeichen);
    if (!raster) return null;
    const farben = figurfarben(kennung, zeichen === zeichen.toUpperCase());
    return (
      <svg
        className="brett-figur"
        x={x}
        y={y}
        width={FELD}
        height={FELD}
        viewBox={`0 0 ${RASTERGROESSE} ${RASTERGROESSE}`}
        shapeRendering="crispEdges"
        overflow="visible"
      >
        {pixellaeufe(raster).map((lauf) => (
          <rect
            key={`${lauf.x}-${lauf.y}`}
            x={lauf.x}
            y={lauf.y}
            width={lauf.laenge}
            height={1}
            fill={farben[lauf.klasse]}
          />
        ))}
      </svg>
    );
  };
}

/** Die feine Pixelstruktur über allen Feldern, als SVG-Muster aus einer Kachel. */
function feldstruktur(kennung: Brettstilkennung) {
  const pixel = strukturpixel(kennung, STILTABELLE[kennung].struktur);
  const einheit = FELD / STRUKTURPIXEL_JE_FELD;
  const kachel = FELD * KACHEL_FELDER;
  return function Feldstruktur() {
    const muster = `${useId().replace(/:/g, "")}-struktur`;
    return (
      <g pointerEvents="none" aria-hidden="true">
        <defs>
          <pattern id={muster} patternUnits="userSpaceOnUse" width={kachel} height={kachel}>
            {pixel.map((p, i) => (
              <rect
                key={i}
                x={p.x * einheit}
                y={p.y * einheit}
                width={p.breite * einheit}
                height={einheit}
                fill={p.hell ? "#FFFFFF" : "#000000"}
                fillOpacity={p.deckkraft}
                shapeRendering="crispEdges"
              />
            ))}
          </pattern>
        </defs>
        <rect width={BRETT} height={BRETT} fill={`url(#${muster})`} />
      </g>
    );
  };
}

/** Breite der Linie des Zugrahmens: ein Strukturpixel, die Kante ein halbes zu jeder Seite. */
const ZUGLINIE = FELD / STRUKTURPIXEL_JE_FELD;

/** Start- und Zielfeld des letzten Zuges: Schimmer und ein Rahmen aus Farbe mit Kante im Feld. */
function zugmarke(kennung: Brettstilkennung) {
  const { farbe, kante } = STILTABELLE[kennung].zug;
  return function Zugmarke({ feld, gedreht, farbe: schimmer }: Zugmarkenzeichnung) {
    const ecke = feldEcke(feld, gedreht);
    if (!ecke) return null;
    const rahmen = {
      x: ecke.x + ZUGLINIE,
      y: ecke.y + ZUGLINIE,
      width: FELD - 2 * ZUGLINIE,
      height: FELD - 2 * ZUGLINIE,
      fill: "none",
    };
    return (
      <g pointerEvents="none" shapeRendering="crispEdges">
        <rect x={ecke.x} y={ecke.y} width={FELD} height={FELD} fill={schimmer} />
        <rect {...rahmen} stroke={kante} strokeWidth={ZUGLINIE * 2} />
        <rect {...rahmen} stroke={farbe} strokeWidth={ZUGLINIE} />
      </g>
    );
  };
}

/** Rahmenfarben als CSS-Variablen für brettstil.css. */
function rahmenvariablen(kennung: Brettstilkennung): Record<string, string> {
  const [aussen, mitte, innen] = STILTABELLE[kennung].rahmen;
  return {
    "--brettstil-rahmen-aussen": aussen,
    "--brettstil-rahmen-mitte": mitte,
    "--brettstil-rahmen-innen": innen,
  };
}

const VORGABEN = new Map<Brettstilkennung, Brettstilvorgabe>();

/**
 * Die Vorgabe für das Brett der App zu einem Stil, einmal gebaut und dann wiederverwendet.
 *
 * Beispiel: „stahl“ → blaugraue Felder mit Platten und Nieten, Metallfiguren, schwarze Figuren
 * mit heller Kante, Rahmen in drei Blautönen.
 */
export function brettstilvorgabe(kennung: Brettstilkennung): Brettstilvorgabe {
  const fertig = VORGABEN.get(kennung);
  if (fertig) return fertig;
  const stil = STILTABELLE[kennung];
  const vorgabe: Brettstilvorgabe = {
    palette: {
      hell: stil.hell,
      dunkel: stil.dunkel,
      schimmer: stil.zug.schimmer,
      figur: "#111111",
    },
    Figur: pixelfigur(kennung),
    Unterlage: feldstruktur(kennung),
    Zugmarke: zugmarke(kennung),
    markenfarben: { kontur: stil.kontur, farben: stil.marken },
    klasse: RAHMENKLASSE,
    stil: rahmenvariablen(kennung),
  };
  VORGABEN.set(kennung, vorgabe);
  return vorgabe;
}
