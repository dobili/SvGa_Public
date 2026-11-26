/**
 * Joystick und Aktionsknopf für das Handy (Wunsch des Autors, 26.11.2026: „die Pfeiltasten gegen
 * einen Joystick austauschen … minimalistisch wie in anderen Mobile-Games, zwei Kreise ineinander“).
 *
 * Bedienung: Ein durchscheinender Ring mit Rand, darin ein Knopf, der dem Daumen folgt (höchstens
 * bis zum Ring). Der Joystick sitzt fest unten auf der gewählten Seite (Vorgabe rechts, quer links,
 * bedienung.css); die Fangfläche ist größer als der Ring, damit ein Daumen, der knapp daneben
 * aufsetzt, trotzdem greift. Laufrichtung in acht Sektoren, Blick als vorherrschende Hauptrichtung,
 * gehen bei kleinem, rennen bei großem Ausschlag (joystick.ts, gangart.ts); Loslassen hält an.
 * Warum fest und nicht schwebend: siehe docs/spiel/ENTSCHEIDUNGEN.md (26.11.2026): Die Kamera hält
 * den Helden aus den festen Bedienflächen heraus (kamera.ts), Hinweise liegen über dem Joystick,
 * und ein sichtbarer Joystick erklärt sich Kindern selbst.
 * Barrierefreiheit und Tests: Vier unsichtbare Knöpfe „Nach oben“ usw. liegen auf halbem Radius im
 * Ring. Ein Daumen darauf ist gewöhnliche Joystick-Eingabe; mit der Tastatur ausgelöst (Enter,
 * Leertaste) machen sie einen Schritt. Die Oberflächentests tippen sie an wie früher die Pfeile.
 * Für Tests steht die Lage an `data-richtung`, `data-blick` und `data-gangart` des Joysticks.
 * Abhängigkeiten: joystick.ts, joystick.css, achtrichtung.ts, heldsteuerung.ts (Typ).
 */
import { useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { tSpiel } from "../texte/texte";
import type { Hauptrichtung } from "./achtrichtung";
import type { Steuereingabe } from "./heldsteuerung";
import { joystickLage, RUHE, type Joysticklage } from "./joystick";
import "./joystick.css";

const MARKEN: readonly Hauptrichtung[] = ["oben", "links", "rechts", "unten"];

/** Mitte des Joysticks (Bildschirmkoordinaten) aus seinem Rechteck. */
function mitteVon(feld: HTMLElement): { readonly x: number; readonly y: number } {
  const r = feld.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** Die Eingabe zu einer Lage (null ohne Richtung). */
function eingabeAus(lage: Joysticklage): Steuereingabe | null {
  return lage.richtung && lage.blick ? { richtung: lage.richtung, blick: lage.blick } : null;
}

/** Zeiger auf dem Joystick: Lage verfolgen, Wechsel melden, Loslassen hält an. */
function useJoystickzeiger(
  beiSteuerung: (eingabe: Steuereingabe | null) => void,
  beiGangart: ((rennen: boolean) => void) | undefined,
) {
  const finger = useRef<number | null>(null);
  const lageRef = useRef<Joysticklage>(RUHE);
  const [lage, setzeLage] = useState<Joysticklage>(RUHE);

  const melde = (neu: Joysticklage) => {
    const alt = lageRef.current;
    lageRef.current = neu;
    setzeLage(neu);
    if (alt.gangart !== neu.gangart) beiGangart?.(neu.gangart === "rennen");
    if (alt.richtung !== neu.richtung || alt.blick !== neu.blick) beiSteuerung(eingabeAus(neu));
  };
  const folge = (e: PointerEvent<HTMLDivElement>) => {
    const mitte = mitteVon(e.currentTarget);
    melde(joystickLage(e.clientX - mitte.x, e.clientY - mitte.y, lageRef.current));
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
    melde(RUHE);
  };
  return { lage, beginne, bewege, ende };
}

/**
 * Joystick, Aktionsknopf und zweite Wahl. Eingaben: Rückruf der Steuerung (Richtung und Blick
 * oder null), Rückruf der Gangart (fehlt: kein Rennen), Text und Rückruf des Aktionsknopfs.
 * Sonderfälle: nur ein Finger zugleich (ein zweiter auf dem Joystick wird übergangen).
 */
export function Joystick({
  beiSteuerung,
  beiGangart,
  aktion,
  beiAktion,
  zweiteAktion = null,
}: {
  readonly beiSteuerung: (eingabe: Steuereingabe | null) => void;
  readonly beiGangart?: (rennen: boolean) => void;
  /** Text des Aktionsknopfs oder null, wenn gerade nichts zu tun ist. */
  readonly aktion: string | null;
  readonly beiAktion: () => void;
  /** Zweite Wahl neben dem Aktionsknopf (Tier vor dem Helden: „Verscheuchen“, useVerscheuchen.ts). */
  readonly zweiteAktion?: { readonly text: string; readonly tu: () => void } | null;
}) {
  const { lage, beginne, bewege, ende } = useJoystickzeiger(beiSteuerung, beiGangart);
  // Tastatur auf einer Marke (detail 0): ein Schritt; Klicks mit Zeiger sind schon Joystick-Eingabe.
  const schritt = (richtung: Hauptrichtung) => (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail !== 0) return;
    beiSteuerung({ richtung, blick: richtung });
    beiSteuerung(null);
  };
  const knopf = { "--knopf-x": `${lage.knopf.x}px`, "--knopf-y": `${lage.knopf.y}px` };
  return (
    <>
      <div
        className="abenteuer-steuerkreuz abenteuer-joystick"
        data-testid="abenteuer-joystick"
        data-gangart={lage.gangart}
        data-richtung={lage.richtung ?? undefined}
        data-blick={lage.blick ?? undefined}
        role="group"
        aria-label={tSpiel("oberwelt.steuerkreuz")}
        onPointerDown={beginne}
        onPointerMove={bewege}
        onPointerUp={ende}
        onPointerCancel={ende}
        // Verliert der Joystick den Finger ohne Loslassen (Safari bei Systemgesten), bliebe der
        // Held sonst in Bewegung.
        onLostPointerCapture={ende}
      >
        <span className="abenteuer-joystick-ring" aria-hidden="true" />
        <span
          className="abenteuer-joystick-knopf"
          aria-hidden="true"
          style={knopf as CSSProperties}
        />
        {MARKEN.map((richtung) => (
          <button
            key={richtung}
            type="button"
            className="abenteuer-joystick-marke"
            data-richtung={richtung}
            data-gedrueckt={lage.blick === richtung ? "ja" : undefined}
            aria-label={tSpiel(`oberwelt.richtung.${richtung}`)}
            onClick={schritt(richtung)}
          />
        ))}
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
      {zweiteAktion && (
        <button
          type="button"
          className="abenteuer-aktion abenteuer-aktion-zweite"
          onClick={zweiteAktion.tu}
          data-testid="abenteuer-aktion-zweite"
        >
          {zweiteAktion.text}
        </button>
      )}
    </>
  );
}
