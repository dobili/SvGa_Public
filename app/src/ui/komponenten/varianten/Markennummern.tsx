/**
 * Die Nummern der eigenen Pfeile und Rahmen am Brett: ein kleiner Kreis in der Farbe, bei
 * Pfeilen in der Mitte des Schafts, bei Feldern in der oberen rechten Ecke.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 2 (Frage e: „Die Nummern stehen am Brett, damit
 * Kommentare darauf zeigen können („Rot 2“)“). Die Pfeile und Rahmen selbst zeichnet das Brett
 * (Brett.tsx, Brettmarken.tsx); diese Schicht liegt darüber (Überlagerung, lässt Tipps durch)
 * und rechnet die Lage der Pfeile genauso wie das Brett (pfeilform, querversaetze), damit der
 * Kreis auf dem Schaft sitzt, auch wenn zwei Pfeile nebeneinander verlaufen.
 * Abhängigkeiten: ui/brett (Geometrie, Maße), training/variationsmarken.ts.
 */
import type { Markierungsfarbe } from "../../../analyse/werkzeug";
import type { Nummerierte } from "../../../training/variationsmarken";
import { feldEcke, pfeilform } from "../../brett/geometrie";
import { BRETT, FARBEN, FELD, PFEIL } from "../../brett/masse";
import { querversaetze } from "../../brett/versatz";

/** Radius des Kreises und Schriftgröße darin, als Anteil eines Feldes. */
const KREIS = 0.15 * FELD;
const SCHRIFT = 0.2 * FELD;
/** Die Schrift sitzt optisch mittig, wenn die Grundlinie um ein Drittel der Größe tiefer liegt. */
const GRUNDLINIE = SCHRIFT / 3;
/** Abstand des Kreises vom Rand des Feldes (obere rechte Ecke). */
const ECKE = 0.2 * FELD;

/** Schrift im Kreis: dunkel auf Gold (hell), sonst hell. */
function schriftfarbe(farbe: Markierungsfarbe): string {
  return farbe === "gold" ? FARBEN.navy : FARBEN.creme;
}

/** Ein Kreis mit Nummer. */
function Kreis({ x, y, marke }: { x: number; y: number; marke: Nummerierte }) {
  return (
    <g data-testid="markennummer" data-schluessel={marke.schluessel}>
      <circle
        cx={x}
        cy={y}
        r={KREIS}
        fill={FARBEN[marke.farbe]}
        stroke={FARBEN.navy}
        strokeWidth={PFEIL.kontur * 2}
      />
      <text
        x={x}
        y={y + GRUNDLINIE}
        textAnchor="middle"
        fontSize={SCHRIFT}
        fontWeight={700}
        fill={schriftfarbe(marke.farbe)}
        fontFamily="'Source Sans 3', sans-serif"
      >
        {marke.nummer}
      </text>
    </g>
  );
}

/** Die Lage des Kreises einer Marke; null, wenn das Feld nicht auf dem Brett liegt. */
function lage(m: Nummerierte, gedreht: boolean, versatz: number): { x: number; y: number } | null {
  if (m.nach) {
    const form = pfeilform(m.von, m.nach, gedreht, versatz);
    if (!form) return null;
    return {
      x: (form.schaftVon.x + form.schaftBis.x) / 2,
      y: (form.schaftVon.y + form.schaftBis.y) / 2,
    };
  }
  const ecke = feldEcke(m.von, gedreht);
  return ecke ? { x: ecke.x + FELD - ECKE, y: ecke.y + ECKE } : null;
}

/**
 * Alle Nummern der Stellung; ohne Marken nichts.
 * Beispiel: ["Ge2e4", "Rd1h5", "Ge8"] → Kreis „1“ gold auf e2–e4, „1“ rot auf d1–h5, „2“ gold
 * in der Ecke von e8.
 */
export function Markennummern({
  marken,
  gedreht,
}: {
  marken: readonly Nummerierte[];
  gedreht: boolean;
}) {
  if (marken.length === 0) return null;
  const pfeile = marken.filter((m) => m.nach !== null);
  const versaetze = querversaetze(
    pfeile.map((m) => ({ von: m.von, nach: m.nach ?? m.von })),
    PFEIL.versatz,
  );
  return (
    <svg className="markennummern" viewBox={`0 0 ${BRETT} ${BRETT}`} aria-hidden="true">
      {marken.map((m) => {
        const stelle = pfeile.indexOf(m);
        const punkt = lage(m, gedreht, stelle >= 0 ? (versaetze[stelle] ?? 0) : 0);
        return punkt && <Kreis key={m.schluessel} x={punkt.x} y={punkt.y} marke={m} />;
      })}
    </svg>
  );
}
