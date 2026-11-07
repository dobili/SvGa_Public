/**
 * Steuerkreuz und Aktionsknopf für das Handy (docs/spiel/04_Architektur.md, Abschnitt 8).
 *
 * Rolle im Gesamtbild: Phaser bekommt nur „Richtung gedrückt / losgelassen“; die Knöpfe sind
 * React, damit sie wie die übrige App aussehen und groß genug für Daumen sind (48 px). Tastatur
 * (Pfeile, WASD) behandelt die Szene selbst.
 * Abhängigkeiten: keine.
 */
import type { PointerEvent } from "react";
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

/** Vier Richtungsknöpfe; Druck und Loslassen gehen an die Szene. */
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
  const halte = (richtung: Richtung) => (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    beiRichtung(richtung, true);
  };
  const lass = (richtung: Richtung) => () => beiRichtung(richtung, false);
  return (
    <>
      <div className="abenteuer-steuerkreuz" aria-label={tSpiel("oberwelt.steuerkreuz")}>
        {KREUZ.map(([richtung, zeichen], i) =>
          richtung ? (
            <button
              key={richtung}
              type="button"
              aria-label={tSpiel(`oberwelt.richtung.${richtung}`)}
              onPointerDown={halte(richtung)}
              onPointerUp={lass(richtung)}
              onPointerCancel={lass(richtung)}
              onPointerLeave={lass(richtung)}
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
