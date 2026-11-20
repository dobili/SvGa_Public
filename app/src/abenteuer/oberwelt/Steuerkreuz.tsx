/**
 * Steuerkreuz und Aktionsknopf für das Handy (docs/spiel/04_Architektur.md, Abschnitt 8).
 *
 * Rolle im Gesamtbild: Phaser bekommt nur „Richtung gedrückt / losgelassen“; die Knöpfe sind
 * React, damit sie wie die übrige App aussehen und groß genug für Daumen sind (48 px). Tastatur
 * (Pfeile, WASD) behandelt die Szene selbst.
 * Wischen zwischen den Richtungen (Wunsch des Autors, 19.11.2026): Das Kreuz verfolgt den Finger
 * als Ganzes, nicht jede Taste für sich. Gleitet der Daumen gedrückt auf eine andere Pfeiltaste,
 * springt die Richtung um; in der Lücke oder außerhalb ruht die Figur, bis der Finger wieder auf
 * einer Taste liegt; Loslassen hält an.
 * Abhängigkeiten: keine.
 */
import { useRef, useState, type PointerEvent } from "react";
import { tSpiel } from "../texte/texte";
import type { Richtung } from "./szene";

const KREUZ: readonly (readonly [Richtung | null, string])[] = [
  [null, ""],
  ["oben", "▲"],
  [null, ""],
  ["links", "◀"],
  [null, ""],
  ["rechts", "▶"],
  [null, ""],
  ["unten", "▼"],
  [null, ""],
];

/** Die Richtung der Taste unter einem Punkt des Bildschirms, oder null (Lücke, außerhalb). */
function richtungAn(x: number, y: number): Richtung | null {
  const taste = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-richtung]");
  return (taste?.dataset["richtung"] as Richtung | undefined) ?? null;
}

/**
 * Vier Richtungsknöpfe; Druck, Wechsel und Loslassen gehen an die Szene.
 * Eingaben: Rückruf je Richtung (gedrückt ja/nein), Text des Aktionsknopfs, Rückruf der Aktion.
 * Sonderfälle: nur ein Finger zugleich (ein zweiter Finger auf dem Kreuz wird übergangen).
 */
export function Steuerkreuz({
  beiRichtung,
  aktion,
  beiAktion,
}: {
  readonly beiRichtung: (richtung: Richtung, gedrueckt: boolean) => void;
  /** Text des Aktionsknopfs oder null, wenn gerade nichts zu tun ist. */
  readonly aktion: string | null;
  readonly beiAktion: () => void;
}) {
  const finger = useRef<number | null>(null);
  const [aktiv, setzeAktiv] = useState<Richtung | null>(null);
  const aktivRef = useRef<Richtung | null>(null);

  /** Setzt die gedrückte Richtung; meldet Loslassen der alten und Druck der neuen. */
  const wechsle = (neu: Richtung | null) => {
    const alt = aktivRef.current;
    if (alt === neu) return;
    if (alt) beiRichtung(alt, false);
    if (neu) beiRichtung(neu, true);
    aktivRef.current = neu;
    setzeAktiv(neu);
  };
  const beginne = (e: PointerEvent<HTMLDivElement>) => {
    if (finger.current !== null) return;
    e.preventDefault();
    finger.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    wechsle(richtungAn(e.clientX, e.clientY));
  };
  const bewege = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerId === finger.current) wechsle(richtungAn(e.clientX, e.clientY));
  };
  const ende = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== finger.current) return;
    finger.current = null;
    wechsle(null);
  };
  return (
    <>
      <div
        className="abenteuer-steuerkreuz"
        aria-label={tSpiel("oberwelt.steuerkreuz")}
        onPointerDown={beginne}
        onPointerMove={bewege}
        onPointerUp={ende}
        onPointerCancel={ende}
        // Verliert das Kreuz den Finger ohne Loslassen (Safari bei Systemgesten), bleibt der Held
        // sonst in Bewegung.
        onLostPointerCapture={ende}
      >
        {KREUZ.map(([richtung, zeichen], i) =>
          richtung ? (
            <button
              key={richtung}
              type="button"
              data-richtung={richtung}
              data-gedrueckt={aktiv === richtung ? "ja" : undefined}
              aria-label={tSpiel(`oberwelt.richtung.${richtung}`)}
            >
              {zeichen}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
      <button
        type="button"
        className="abenteuer-aktion"
        hidden={aktion === null}
        onClick={beiAktion}
        data-testid="abenteuer-aktion"
      >
        {aktion ?? ""}
      </button>
    </>
  );
}
