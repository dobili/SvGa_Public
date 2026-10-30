/**
 * Alle Orden im Hintergrund der Startanimation: verdiente golden, offene als Silhouette.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (26.10.2026): Um die Startanimation herum, im einfarbigen
 * Rand, stehen alle Orden verteilt, zuerst nur als Silhouette; jeder freigeschaltete Orden wird dort
 * dauerhaft sichtbar. So sieht man bei jedem Start, was man gesammelt hat und was noch offen ist.
 * Die Plätze liegen auf einem Kranz um die Mitte, leicht versetzt, damit es verstreut wirkt; sie
 * hängen nur von der Reihenfolge ab, damit jeder Orden immer an derselben Stelle steht.
 * Abhängigkeiten: fortschrittsringe.ts (Ringe), ringrechnung.ts (voll), bausteine/Orden.tsx.
 */
import { Orden } from "../bausteine/Orden";
import { useFortschrittsringe } from "./fortschrittsringe";
import { istVoll } from "./ringrechnung";

const PROZENT = 100;
const MITTE = PROZENT / 2;
/** Halbachsen des Kranzes in Prozent der Fläche, außen um Springer und Titel herum. */
const KRANZ_X = 40;
const KRANZ_Y = 42;
/** Versatz je Orden (Prozentpunkte), abwechselnd nach innen und außen. */
const VERSATZ = 4;
const VOLLKREIS = 2 * Math.PI;
/** Der Kranz beginnt oben links, nicht genau oben über dem Titel. */
const BEGINN = -2.2;

/** Platz eines Ordens: Winkel gleichmäßig verteilt, Abstand abwechselnd etwas größer. */
function platz(nummer: number, anzahl: number): { left: string; top: string } {
  const winkel = BEGINN + (nummer / anzahl) * VOLLKREIS;
  const weite = nummer % 2 === 0 ? 1 : (KRANZ_X - VERSATZ) / KRANZ_X;
  return {
    left: `${MITTE + Math.cos(winkel) * KRANZ_X * weite}%`,
    top: `${MITTE + Math.sin(winkel) * KRANZ_Y * weite}%`,
  };
}

/** Der Kranz aller Orden; ohne geladene Ringe (erster Start) nichts. */
export function OrdenHintergrund() {
  const ringe = useFortschrittsringe();
  if (!ringe) return null;
  const alle = [...ringe.buchringe, ...ringe.teilringe, ...ringe.botringe];
  return (
    <span className="startanimation-orden" aria-hidden="true" data-testid="startanimation-orden">
      {alle.map((ring, i) => {
        const verdient = istVoll(ring.anteil);
        return (
          <span
            key={ring.testid}
            className={verdient ? "startorden verdient" : "startorden"}
            style={platz(i, alle.length)}
          >
            <Orden symbol={ring.symbol} beschriftung={ring.name} silhouette={!verdient} />
          </span>
        );
      })}
    </span>
  );
}
