/**
 * Marken auf dem Brett: Schimmer, Zielpunkte und -ringe, Feldrahmen und Pfeile im Stil des Buches.
 *
 * Rolle im Gesamtbild: Bausteine für Brett.tsx, seit 0.2.92 in einer eigenen Datei, damit das
 * Brett mit dem Ziehen per Wischen unter 400 Zeilen bleibt.
 * Abhängigkeiten: analyse/werkzeug.ts (Markierungsfarben), geometrie.ts, masse.ts.
 */
import type { Markierungsfarbe } from "../../analyse/werkzeug";
import { feldEcke, pfeilform } from "./geometrie";
import { FARBEN, FELD, PFEIL, RAHMEN } from "./masse";

/** Heller Schimmer über einem Feld: angetippt oder letzter Zug, nie Gold, Rot oder Grau. */
export function Schimmer({
  feld,
  gedreht,
  farbe,
}: {
  feld: string;
  gedreht: boolean;
  farbe: string;
}) {
  const ecke = feldEcke(feld, gedreht);
  return ecke ? <rect {...ecke} width={FELD} height={FELD} fill={farbe} /> : null;
}

/** Anteil der Feldbreite für den Punkt auf einem möglichen Zielfeld. */
const ZIELPUNKT_RADIUS = 0.14 * FELD;
/** Ring um eine schlagbare Figur (0.2.58: der Punkt war auf dunklen Figuren kaum zu sehen). */
const ZIELRING_RADIUS = 0.42 * FELD;
const ZIELRING_BREITE = 0.07 * FELD;
/** Rot mit Durchsicht für eine angetippte Figur, die nicht ziehen darf (0.2.58). */
export const SPERRFARBE = "rgba(220, 68, 68, 0.45)";

/** Ring um eine Figur, die geschlagen werden kann: Gold mit dunklem Rand, auf jeder Figur sichtbar. */
export function Zielring({ feld, gedreht }: { feld: string; gedreht: boolean }) {
  const ecke = feldEcke(feld, gedreht);
  if (!ecke) return null;
  const mitte = { cx: ecke.x + FELD / 2, cy: ecke.y + FELD / 2 };
  return (
    <g pointerEvents="none">
      <circle
        {...mitte}
        r={ZIELRING_RADIUS}
        fill="none"
        stroke={FARBEN.navy}
        strokeWidth={ZIELRING_BREITE * 1.6}
        strokeOpacity={0.5}
      />
      <circle
        {...mitte}
        r={ZIELRING_RADIUS}
        fill="none"
        stroke={FARBEN.gold}
        strokeWidth={ZIELRING_BREITE}
      />
    </g>
  );
}

/** Kleiner Punkt in der Feldmitte für ein mögliches Zielfeld. */
export function Zielpunkt({ feld, gedreht }: { feld: string; gedreht: boolean }) {
  const ecke = feldEcke(feld, gedreht);
  if (!ecke) return null;
  return (
    <circle
      cx={ecke.x + FELD / 2}
      cy={ecke.y + FELD / 2}
      r={ZIELPUNKT_RADIUS}
      fill={FARBEN.navy}
      fillOpacity={0.35}
    />
  );
}

/** Strichmuster je Farbe: Gold durchgezogen, Rot gestrichelt, Grau gepunktet (Buch, Teil 1). */
function strichmuster(farbe: Markierungsfarbe, art: "pfeil" | "rahmen"): string | undefined {
  const masse = art === "pfeil" ? PFEIL : RAHMEN;
  if (farbe === "rot") return masse.strichRot.join(" ");
  if (farbe === "grau") return masse.punktGrau.join(" ");
  return undefined;
}

/** Ein Feldrahmen (Rot, Grau) oder vier Ecken (Gold), jeweils mit dünner Navy-Kontur. */
export function Feldmarke({
  feld,
  farbe,
  gedreht,
}: {
  feld: string;
  farbe: Markierungsfarbe;
  gedreht: boolean;
}) {
  const ecke = feldEcke(feld, gedreht);
  if (!ecke) return null;
  const halb = RAHMEN.breite / 2;
  const x0 = ecke.x + halb;
  const y0 = ecke.y + halb;
  const x1 = ecke.x + FELD - halb;
  const y1 = ecke.y + FELD - halb;
  const s = RAHMEN.eckschenkel;
  const pfad =
    farbe === "gold"
      ? `M${x0} ${y0 + s}V${y0}H${x0 + s} M${x1 - s} ${y0}H${x1}V${y0 + s} M${x1} ${y1 - s}V${y1}H${x1 - s} M${x0 + s} ${y1}H${x0}V${y1 - s}`
      : `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;
  const kappe = farbe === "grau" ? "round" : "butt";
  return (
    <g fill="none" strokeLinecap={kappe} strokeLinejoin="miter">
      <path
        d={pfad}
        stroke={FARBEN.navy}
        strokeWidth={RAHMEN.breite + 2 * PFEIL.kontur}
        strokeDasharray={strichmuster(farbe, "rahmen")}
      />
      <path
        d={pfad}
        stroke={FARBEN[farbe]}
        strokeWidth={RAHMEN.breite}
        strokeDasharray={strichmuster(farbe, "rahmen")}
      />
    </g>
  );
}

/** Ein Pfeil im Stil des Buches, mit Kontur. */
export function Pfeil({
  von,
  nach,
  farbe,
  gedreht,
  versatz,
}: {
  von: string;
  nach: string;
  farbe: Markierungsfarbe;
  gedreht: boolean;
  versatz: number;
}) {
  const form = pfeilform(von, nach, gedreht, versatz);
  if (!form) return null;
  const spitze = form.spitze.map((p) => `${p.x},${p.y}`).join(" ");
  const kappe = farbe === "rot" ? "butt" : "round";
  const muster = strichmuster(farbe, "pfeil");
  const linie = {
    x1: form.schaftVon.x,
    y1: form.schaftVon.y,
    x2: form.schaftBis.x,
    y2: form.schaftBis.y,
  };
  return (
    <g>
      <line
        {...linie}
        stroke={FARBEN.navy}
        strokeWidth={PFEIL.breite + 2 * PFEIL.kontur}
        strokeLinecap={kappe}
        strokeDasharray={muster}
      />
      <polygon
        points={spitze}
        fill={FARBEN[farbe]}
        stroke={FARBEN.navy}
        strokeWidth={PFEIL.kontur}
      />
      <line
        {...linie}
        stroke={FARBEN[farbe]}
        strokeWidth={PFEIL.breite}
        strokeLinecap={kappe}
        strokeDasharray={muster}
      />
    </g>
  );
}
