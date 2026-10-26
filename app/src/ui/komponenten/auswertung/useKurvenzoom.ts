/**
 * Zoom und Fingerfahren für die Verlaufskurve (R56, Wunsch des Autors, 23.10.2026).
 *
 * Rolle im Gesamtbild: Bei einem kurzen Mittelspiel trifft man auf dem Handy einzelne Züge der
 * Kurve kaum. Drei Wege helfen (Verlaufskurve.tsx): eine Phase antippen zieht ihren Abschnitt auf
 * die volle Breite („Ganze Partie“ zurück); den Finger auf der Kurve halten und seitwärts fahren
 * zeigt Zug für Zug, wo man ist, und Loslassen springt dorthin; mit zwei Fingern aufziehen oder
 * zusammenschieben vergrößert oder verkleinert den Ausschnitt um seine Mitte.
 * Abhängigkeiten: React, spiel/phasen.ts.
 */
import { useRef, useState, type PointerEvent } from "react";
import type { Phase } from "../../../spiel/phasen";

/** Ein Ausschnitt der Partie: erste und letzte Stelle (Stellungsindex, beide eingeschlossen). */
export interface Ausschnitt {
  readonly von: number;
  readonly bis: number;
}

/** Wenigstens so viele Stellungen zeigt ein Ausschnitt (sonst ist keine Kurve mehr zu sehen). */
const MINDESTSTELLEN = 4;

/**
 * Die Ausschnitte der Phasen aus den Übergängen.
 * Beispiel: 41 Stellungen, Mittelspiel ab 8, Endspiel ab 30 → Eröffnung 0–7, Mittelspiel 8–29,
 * Endspiel 30–40. Fehlt eine Phase, fehlt ihr Ausschnitt.
 */
export function phasenausschnitte(
  stellen: number,
  wechsel: Readonly<Record<Phase, number | null>> | undefined,
): Partial<Record<Phase, Ausschnitt>> {
  const letzte = stellen - 1;
  const m = wechsel?.mittelspiel ?? null;
  const e = wechsel?.endspiel ?? null;
  const ende = (naechste: number | null) => (naechste !== null ? naechste - 1 : letzte);
  const ergebnis: Partial<Record<Phase, Ausschnitt>> = {};
  const erster = m ?? e;
  if (erster === null || erster > 0) ergebnis.eroeffnung = { von: 0, bis: ende(erster) };
  if (m !== null) ergebnis.mittelspiel = { von: m, bis: ende(e) };
  if (e !== null) ergebnis.endspiel = { von: e, bis: letzte };
  return ergebnis;
}

/** Ausschnitt auf die Partie begrenzen und auf die Mindestbreite bringen. */
function begrenzt(a: Ausschnitt, stellen: number): Ausschnitt {
  const letzte = stellen - 1;
  const breite = Math.max(a.bis - a.von, Math.min(MINDESTSTELLEN, letzte));
  const von = Math.max(0, Math.min(a.von, letzte - breite));
  return { von, bis: Math.min(letzte, von + breite) };
}

/**
 * Zustand und Griffe der Kurve.
 * Eingaben: Zahl der Stellungen, Sprung beim Loslassen. Ausgabe: Ausschnitt, die Stelle unter
 * dem Finger (null ohne Finger) und die Griffe für das SVG.
 */
export function useKurvenzoom(stellen: number, beiStelle: (stelle: number) => void) {
  const ganz: Ausschnitt = { von: 0, bis: Math.max(0, stellen - 1) };
  const [ausschnitt, setzeAusschnitt] = useState<Ausschnitt>(ganz);
  const [finger, setzeFinger] = useState<number | null>(null);
  const zeiger = useRef(new Map<number, number>());
  const abstand = useRef<number | null>(null);
  const a = begrenzt(ausschnitt.bis < stellen ? ausschnitt : ganz, stellen);

  /** Stelle unter einer x-Koordinate des Bildschirms. */
  const stelleBei = (ziel: Element, x: number): number => {
    const rahmen = ziel.getBoundingClientRect();
    const anteil = rahmen.width > 0 ? (x - rahmen.left) / rahmen.width : 0;
    return a.von + Math.round(Math.max(0, Math.min(1, anteil)) * (a.bis - a.von));
  };

  /** Zwei Finger: Abstand vorher gegen nachher, Ausschnitt um seine Mitte enger oder weiter. */
  const zieheAuf = () => {
    const [x1, x2] = [...zeiger.current.values()];
    if (x1 === undefined || x2 === undefined) return;
    const jetzt = Math.abs(x2 - x1);
    const vorher = abstand.current;
    abstand.current = jetzt;
    if (vorher === null || vorher === 0 || jetzt === 0) return;
    const mitte = (a.von + a.bis) / 2;
    const halb = (a.bis - a.von) / 2 / (jetzt / vorher);
    setzeAusschnitt(
      begrenzt({ von: Math.round(mitte - halb), bis: Math.round(mitte + halb) }, stellen),
    );
  };

  const griffe = {
    onPointerDown: (e: PointerEvent<Element>) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      zeiger.current.set(e.pointerId, e.clientX);
      if (zeiger.current.size === 1) setzeFinger(stelleBei(e.currentTarget, e.clientX));
      else setzeFinger(null);
    },
    onPointerMove: (e: PointerEvent<Element>) => {
      if (!zeiger.current.has(e.pointerId)) return;
      zeiger.current.set(e.pointerId, e.clientX);
      if (zeiger.current.size >= 2) zieheAuf();
      else setzeFinger(stelleBei(e.currentTarget, e.clientX));
    },
    onPointerUp: (e: PointerEvent<Element>) => {
      const einzeln = zeiger.current.size === 1;
      zeiger.current.delete(e.pointerId);
      if (zeiger.current.size < 2) abstand.current = null;
      if (einzeln && finger !== null) beiStelle(finger);
      setzeFinger(null);
    },
    onPointerCancel: (e: PointerEvent<Element>) => {
      zeiger.current.delete(e.pointerId);
      abstand.current = null;
      setzeFinger(null);
    },
  };
  return {
    ausschnitt: a,
    ganz: a.von === ganz.von && a.bis === ganz.bis,
    finger,
    griffe,
    zeige: (neu: Ausschnitt | null) => setzeAusschnitt(neu ?? ganz),
  };
}
