/**
 * Steuerkreuz und Aktionsknopf für das Handy (docs/spiel/04_Architektur.md, Abschnitt 8).
 *
 * Rolle im Gesamtbild: Phaser bekommt nur „Richtung gedrückt / losgelassen“; die Knöpfe sind
 * React, damit sie wie die übrige App aussehen und groß genug für Daumen sind (48 px). Tastatur
 * (Pfeile, WASD) behandelt die Szene selbst.
 * Wischen zwischen den Richtungen (Wunsch des Autors, 19.11.2026): Das Kreuz verfolgt den Finger
 * als Ganzes, nicht jede Taste für sich. Seit dem 20.11.2026 (Wunsch des Autors: „zwischen zwei
 * Pfeilen gar keine Reaktion“) zählt dabei die Taste, die dem Finger am nächsten ist, auch in den
 * Lücken, in der Mitte und außerhalb des Kreuzes (steuerrichtung.ts, mit totem Kern und Hysterese);
 * erst Loslassen hält an. Gilt hoch und quer und für beide Seiten des Kreuzes.
 * Rennen (Wunsch des Autors, 21.11.2026): Zieht der Finger weit über den Rand hinaus nach außen,
 * meldet das Kreuz „rennen“ (gangart.ts); zurück nach innen oder Loslassen heißt wieder gehen.
 * Abhängigkeiten: steuerrichtung.ts, gangart.ts.
 */
import { useRef, useState, type PointerEvent } from "react";
import { tSpiel } from "../texte/texte";
import { gangartZu, type Gangart } from "./gangart";
import { richtungZu } from "./steuerrichtung";
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

/** Mitte des Kreuzes (Bildschirmkoordinaten) aus seinem Rechteck. */
function mitteVon(kreuz: HTMLElement): { readonly x: number; readonly y: number } {
  const r = kreuz.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/**
 * Vier Richtungsknöpfe; Druck, Wechsel und Loslassen gehen an die Szene.
 * Eingaben: Rückruf je Richtung (gedrückt ja/nein), Text des Aktionsknopfs, Rückruf der Aktion.
 * Sonderfälle: nur ein Finger zugleich (ein zweiter Finger auf dem Kreuz wird übergangen).
 */
export function Steuerkreuz({
  beiRichtung,
  beiGangart,
  aktion,
  beiAktion,
}: {
  readonly beiRichtung: (richtung: Richtung, gedrueckt: boolean) => void;
  /** Rennen an oder aus (Finger weit draußen); fehlt der Rückruf, gibt es kein Rennen. */
  readonly beiGangart?: (rennen: boolean) => void;
  /** Text des Aktionsknopfs oder null, wenn gerade nichts zu tun ist. */
  readonly aktion: string | null;
  readonly beiAktion: () => void;
}) {
  const finger = useRef<number | null>(null);
  const [aktiv, setzeAktiv] = useState<Richtung | null>(null);
  const aktivRef = useRef<Richtung | null>(null);
  const gangartRef = useRef<Gangart>("gehen");
  const [gangart, setzeGangart] = useState<Gangart>("gehen");

  /** Setzt die Gangart und meldet nur Wechsel. */
  const wechsleGangart = (neu: Gangart) => {
    if (gangartRef.current === neu) return;
    gangartRef.current = neu;
    setzeGangart(neu);
    beiGangart?.(neu === "rennen");
  };
  /** Richtung und Gangart aus der Lage des Fingers. */
  const folge = (e: PointerEvent<HTMLDivElement>) => {
    const mitte = mitteVon(e.currentTarget);
    wechsleGangart(gangartZu(e.clientX - mitte.x, e.clientY - mitte.y, gangartRef.current));
    wechsle(richtungZu(e.clientX - mitte.x, e.clientY - mitte.y, aktivRef.current));
  };

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
    folge(e);
  };
  const bewege = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerId === finger.current) folge(e);
  };
  const ende = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== finger.current) return;
    finger.current = null;
    wechsleGangart("gehen");
    wechsle(null);
  };
  return (
    <>
      <div
        className="abenteuer-steuerkreuz"
        data-gangart={gangart}
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
