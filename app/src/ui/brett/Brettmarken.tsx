/**
 * Marken auf dem Brett: Schimmer, Zielpunkte und -ringe, Feldrahmen und Pfeile im Stil des Buches.
 *
 * Rolle im Gesamtbild: Bausteine für Brett.tsx, in einer eigenen Datei, damit das Brett unter 400
 * Zeilen bleibt. Benachbarte Feldmarkierungen gleicher Farbe teilen sich einen Umriss (umriss.ts,
 * R36). Der goldene Umriss hat zu den Ecken einen dünnen gepunkteten Rahmen (Goldpunktrahmen).
 * Abhängigkeiten: analyse/werkzeug.ts (Markierungen), geometrie.ts, masse.ts, umriss.ts.
 */
import type { Markierung, Markierungsfarbe } from "../../analyse/werkzeug";
import { feldEcke, pfeilform, type Punkt } from "./geometrie";
import { FARBEN, FELD, PFEIL, RAHMEN } from "./masse";
import { umrisse } from "./umriss";

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

/** Pfad eines geschlossenen Umrisses durch seine Eckpunkte. */
function rahmenpfad(punkte: readonly Punkt[]): string {
  return `${punkte.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join("")}Z`;
}

/** Ein Schritt der Länge ``laenge`` von ``a`` in Richtung ``b``. */
function schrittZu(a: Punkt, b: Punkt, laenge: number): Punkt {
  const abstand = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: a.x + ((b.x - a.x) / abstand) * laenge, y: a.y + ((b.y - a.y) / abstand) * laenge };
}

/**
 * Nur die Ecken eines Umrisses (Gold): an jedem Knick zwei Schenkel, höchstens halb so lang wie
 * die angrenzende Strecke, damit sich zwei Ecken auf einer kurzen Strecke nicht berühren.
 */
function eckenpfad(punkte: readonly Punkt[]): string {
  return punkte
    .map((ecke, i) => {
      const davor = punkte[(i + punkte.length - 1) % punkte.length] ?? ecke;
      const danach = punkte[(i + 1) % punkte.length] ?? ecke;
      const halb = (p: Punkt) => Math.hypot(p.x - ecke.x, p.y - ecke.y) / 2;
      const a = schrittZu(ecke, davor, Math.min(RAHMEN.eckschenkel, halb(davor)));
      const b = schrittZu(ecke, danach, Math.min(RAHMEN.eckschenkel, halb(danach)));
      return `M${a.x} ${a.y}L${ecke.x} ${ecke.y}L${b.x} ${b.y}`;
    })
    .join(" ");
}

/**
 * Dünner gepunkteter Goldrahmen um den ganzen Umriss, zusätzlich zu den goldenen Ecken.
 *
 * Warum: Bei mehreren benachbarten goldenen Feldern zeigen die Ecken allein schwer, welche
 * Fläche gemeint ist (Wunsch des Autors, 25.10.2026). Der Rahmen läuft auf derselben Linie wie
 * die Ecken und der Rahmen von Grau und Rot, aber dünn und gepunktet, damit die Ecken die
 * Buchdarstellung bleiben. Unter den Punkten liegt wie überall eine Navy-Kontur, damit sie auf
 * hellen und dunklen Feldern sichtbar sind; das Brett hat in beiden Farbschemata dieselben Farben.
 * Eingabe: Pfad aller Züge (rahmenpfad). Ausgabe: zwei Pfade, Kontur und Gold.
 * Beispiel: ein einzelnes goldenes Feld zeigt vier Ecken und dazwischen eine Punktreihe.
 */
function Goldpunktrahmen({ pfad }: { pfad: string }) {
  const muster = RAHMEN.goldpunkt.join(" ");
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d={pfad}
        stroke={FARBEN.navy}
        strokeWidth={RAHMEN.goldpunktBreite + 2 * PFEIL.kontur}
        strokeDasharray={muster}
      />
      <path
        d={pfad}
        stroke={FARBEN.gold}
        strokeWidth={RAHMEN.goldpunktBreite}
        strokeDasharray={muster}
      />
    </g>
  );
}

/**
 * Die Feldmarkierungen einer Farbe als gemeinsamer Umriss (umriss.ts, R36): Rot gestrichelt,
 * Grau gepunktet, Gold an den Ecken (dazu dünn gepunktet rundum, Goldpunktrahmen), die übrigen
 * Farben durchgezogen, jeweils mit dünner Navy-Kontur wie im Buch.
 * Beispiel: Zentrum d4, e4, d5, e5 in Gold → vier Ecken um das ganze Quadrat statt sechzehn.
 */
function Umrissmarke({
  felder,
  farbe,
  gedreht,
}: {
  felder: readonly string[];
  farbe: Markierungsfarbe;
  gedreht: boolean;
}) {
  const zuege = umrisse(felder, gedreht, RAHMEN.breite / 2);
  const pfad = zuege.map(farbe === "gold" ? eckenpfad : rahmenpfad).join(" ");
  const kappe = farbe === "grau" ? "round" : "butt";
  return (
    <g fill="none" strokeLinecap={kappe} strokeLinejoin="miter">
      {farbe === "gold" && <Goldpunktrahmen pfad={zuege.map(rahmenpfad).join(" ")} />}
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

/** Die markierten Felder je Farbe, in der Reihenfolge, in der die Farben zuerst vorkommen. */
function felderJeFarbe(markierungen: readonly Markierung[]): Map<Markierungsfarbe, string[]> {
  const gruppen = new Map<Markierungsfarbe, string[]>();
  for (const m of markierungen) {
    if (m.typ === "feld") gruppen.set(m.farbe, [...(gruppen.get(m.farbe) ?? []), m.feld]);
  }
  return gruppen;
}

/**
 * Alle Feldmarkierungen des Brettes, je Farbe ein gemeinsamer Umriss.
 *
 * Eingaben: Markierungen (Pfeile werden übergangen), Drehung.
 * Beispiel: Abb. 1.6, die gezählten Felder; nebeneinanderliegende rote Felder teilen einen
 * gestrichelten Rahmen.
 * Sonderfälle: Felder verschiedener Farbe verschmelzen nie; doppelte Felder zählen einmal.
 */
export function Feldmarken({
  markierungen,
  gedreht,
}: {
  markierungen: readonly Markierung[];
  gedreht: boolean;
}) {
  return [...felderJeFarbe(markierungen)].map(([farbe, felder]) => (
    <Umrissmarke key={farbe} felder={felder} farbe={farbe} gedreht={gedreht} />
  ));
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
