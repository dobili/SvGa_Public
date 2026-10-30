/**
 * Alle Orden im Hintergrund der Startanimation: verdiente golden, offene als Silhouette.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (26.10.2026): Um die Startanimation herum, im einfarbigen
 * Rand, stehen alle Orden verteilt, zuerst nur als Silhouette; jeder freigeschaltete Orden wird dort
 * dauerhaft sichtbar. So sieht man bei jedem Start, was man gesammelt hat und was noch offen ist.
 * Seit 0.3.13 zufällig verstreut im Rand (ordenplaetze.ts, Wunsch des Autors „zufällig verteilt“),
 * mit festem Zufall, damit jeder Orden immer an derselben Stelle steht; vorher ein Kranz.
 * Abhängigkeiten: fortschrittsringe.ts (Ringe), ringrechnung.ts (voll), ordenplaetze.ts,
 * bausteine/Orden.tsx.
 */
import { Orden } from "../bausteine/Orden";
import { useFortschrittsringe } from "./fortschrittsringe";
import { ordenplaetze } from "./ordenplaetze";
import { istVoll } from "./ringrechnung";

/** Alle Orden, verstreut; ohne geladene Ringe (erster Start) nichts. */
export function OrdenHintergrund() {
  const ringe = useFortschrittsringe();
  if (!ringe) return null;
  const alle = [...ringe.buchringe, ...ringe.teilringe, ...ringe.botringe];
  const plaetze = ordenplaetze(alle.length);
  return (
    <span className="startanimation-orden" aria-hidden="true" data-testid="startanimation-orden">
      {alle.map((ring, i) => {
        const verdient = istVoll(ring.anteil);
        return (
          <span
            key={ring.testid}
            className={verdient ? "startorden verdient" : "startorden"}
            style={{ left: `${plaetze[i]?.x ?? 0}%`, top: `${plaetze[i]?.y ?? 0}%` }}
          >
            <Orden symbol={ring.symbol} beschriftung={ring.name} silhouette={!verdient} />
          </span>
        );
      })}
    </span>
  );
}
