/**
 * Blaue, gepunktete Pfeile zu den Fortsetzungen am Abzweig, mit Nummer oder Stern im Kreis.
 *
 * Rolle im Gesamtbild: Wunsch des Autors zu Frage b (1.11.2026): „Pfeile aus C einbauen, aber
 * eine eigene Farbe, nur blau mit Nummer, gepunktet. Dann kollidiert es auch nicht mit unseren
 * anderen Pfeilen. Der Kreis am Pfeil des Hauptzuges kann meinetwegen ein Stern sein.“ Die Pfeile
 * liegen als eigene Schicht über dem Brett (Überlagerung von Brett.tsx) und lassen Tipps durch.
 * Geometrie wie die Buchpfeile (geometrie.ts, versatz.ts), Farbe Blau aus masse.ts.
 * Abhängigkeiten: ui/brett (Geometrie, Maße), fortsetzungen.ts.
 */
import { pfeilform } from "../../brett/geometrie";
import { BRETT, FARBEN, FELD, PFEIL } from "../../brett/masse";
import { querversaetze } from "../../brett/versatz";
import type { Fortsetzungschip } from "./fortsetzungen";

/** Punkte der Linie: Abstand von Punkt zu Punkt (Bretteinheiten), runde Enden zeichnen die Punkte. */
const PUNKTABSTAND = PFEIL.punktGrau[1];
/** Radius des Kreises mit der Nummer und Schriftgröße darin, als Anteil eines Feldes. */
const KREIS = 0.17 * FELD;
const SCHRIFT = 0.22 * FELD;
/** Die Schrift sitzt optisch mittig, wenn die Grundlinie um ein Drittel der Größe tiefer liegt. */
const GRUNDLINIE = SCHRIFT / 3;

/** Gepunktete Linie mit Navy-Kontur wie die Buchpfeile; ``faktor`` macht sie dicker. */
function Punktlinie({
  linie,
  faktor,
}: {
  linie: { x1: number; y1: number; x2: number; y2: number };
  faktor: number;
}) {
  const muster = `0 ${PUNKTABSTAND * faktor}`;
  return (
    <>
      <line
        {...linie}
        stroke={FARBEN.navy}
        strokeWidth={(PFEIL.breite + 2 * PFEIL.kontur) * faktor}
        strokeLinecap="round"
        strokeDasharray={muster}
      />
      <line
        {...linie}
        stroke={FARBEN.blau}
        strokeWidth={PFEIL.breite * faktor}
        strokeLinecap="round"
        strokeDasharray={muster}
      />
    </>
  );
}

/** Kreis mit Nummer oder Stern in der Mitte des Pfeils. */
function Nummernkreis({
  mitte,
  marke,
  faktor,
}: {
  mitte: { x: number; y: number };
  marke: string;
  faktor: number;
}) {
  return (
    <>
      <circle
        cx={mitte.x}
        cy={mitte.y}
        r={KREIS * faktor}
        fill={FARBEN.blau}
        stroke={FARBEN.creme}
        strokeWidth={PFEIL.kontur * 2 * faktor}
      />
      <text
        x={mitte.x}
        y={mitte.y + GRUNDLINIE * faktor}
        textAnchor="middle"
        fontSize={SCHRIFT * faktor}
        fontWeight={700}
        fill={FARBEN.creme}
        fontFamily="'Source Sans 3', sans-serif"
      >
        {marke}
      </text>
    </>
  );
}

/** Ein Fortsetzungspfeil mit Kreis in der Mitte. */
function Fortsetzungspfeil({
  chip,
  gedreht,
  versatz,
  faktor,
}: {
  chip: Fortsetzungschip;
  gedreht: boolean;
  versatz: number;
  faktor: number;
}) {
  const form = chip.von && chip.nach ? pfeilform(chip.von, chip.nach, gedreht, versatz) : null;
  if (!form) return null;
  const linie = {
    x1: form.schaftVon.x,
    y1: form.schaftVon.y,
    x2: form.schaftBis.x,
    y2: form.schaftBis.y,
  };
  const mitte = { x: (linie.x1 + linie.x2) / 2, y: (linie.y1 + linie.y2) / 2 };
  return (
    <g data-testid="fortsetzungspfeil">
      <Punktlinie linie={linie} faktor={faktor} />
      <polygon
        points={form.spitze.map((p) => `${p.x},${p.y}`).join(" ")}
        fill={FARBEN.blau}
        stroke={FARBEN.navy}
        strokeWidth={PFEIL.kontur}
      />
      <Nummernkreis mitte={mitte} marke={chip.marke} faktor={faktor} />
    </g>
  );
}

/**
 * Alle Pfeile eines Abzweigs; ohne Abzweig (eine oder keine Fortsetzung) nichts.
 * Beispiel: Petroff nach 3. Sxe5 → Pfeil d7–d6 mit Stern, Pfeil f6–e4 mit „2“.
 * ``faktor`` macht Linie, Punkte und Kreis dicker (kleine Bretter der Karte, Kartenbrett.tsx).
 */
export function Fortsetzungspfeile({
  chips,
  gedreht,
  faktor = 1,
}: {
  chips: readonly Fortsetzungschip[];
  gedreht: boolean;
  faktor?: number;
}) {
  if (chips.length < 2) return null;
  const wege = chips.map((c) => ({ von: c.von ?? "", nach: c.nach ?? "" }));
  const versaetze = querversaetze(wege, PFEIL.versatz);
  return (
    <svg className="fortsetzungspfeile" viewBox={`0 0 ${BRETT} ${BRETT}`} aria-hidden="true">
      {chips.map((chip, i) => (
        <Fortsetzungspfeil
          key={chip.pfad.join(" ")}
          chip={chip}
          gedreht={gedreht}
          versatz={versaetze[i] ?? 0}
          faktor={faktor}
        />
      ))}
    </svg>
  );
}
