/**
 * Beobachtet während einer Tour die Ziele auf dem Bildschirm: wo das Ziel des Schritts gerade
 * steht und welche Schritte sich zeigen lassen.
 *
 * Rolle im Gesamtbild: Teil von TourEbene.tsx. Ein Ziel kann sich bewegen (Scrollen, Drehen des
 * Handys, nachladende Daten) oder verschwinden; deshalb liest ein Takt je Bildschirmbild
 * (requestAnimationFrame) das Rechteck neu und meldet nur Änderungen an React.
 * Abhängigkeiten: React, tourlogik.ts, touren.ts.
 */
import { useLayoutEffect, useState } from "react";
import { schrittart } from "./tourlogik";
import type { Tourschritt } from "./touren";

/**
 * Das erste sichtbare Element mit dieser Ziel-Kennung; zugeklappt oder ausgeblendet zählt nicht.
 * Beispiel: „trainer-wahl“ im Taktiktrainer → die Wahl von Thema und Stufe.
 */
export function findeZiel(kennung: string): HTMLElement | null {
  const alle = document.querySelectorAll<HTMLElement>(`[data-tour="${kennung}"]`);
  return [...alle].find((element) => element.getClientRects().length > 0) ?? null;
}

/** Ob ein Ziel gerade sichtbar auf dem Bildschirm ist. */
export function zielDa(kennung: string): boolean {
  return findeZiel(kennung) !== null;
}

/** Ein Rechteck auf dem Bildschirm in Pixeln. */
export interface Rechteck {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
  readonly bottom: number;
}

/** Was die Beobachtung liefert: Rechteck des Ziels (oder null) und die zeigbaren Schritte. */
export interface Zielstand {
  readonly rechteck: Rechteck | null;
  readonly zeigbar: readonly number[];
}

function gleich(a: Zielstand, b: Zielstand): boolean {
  const ra = a.rechteck;
  const rb = b.rechteck;
  const rechteckGleich =
    ra === rb ||
    (ra !== null &&
      rb !== null &&
      ra.top === rb.top &&
      ra.left === rb.left &&
      ra.width === rb.width &&
      ra.height === rb.height);
  return rechteckGleich && a.zeigbar.join() === b.zeigbar.join();
}

/** Liest den Stand einmal vom Bildschirm. */
function lies(schritte: readonly Tourschritt[], stelle: number | null): Zielstand {
  const zeigbar = schritte.flatMap((s, i) =>
    schrittart(s, zielDa) === "ueberspringen" ? [] : [i],
  );
  const ziel = stelle === null ? null : schritte[stelle]?.ziel;
  const element = ziel ? findeZiel(ziel) : null;
  if (!element) return { rechteck: null, zeigbar };
  const r = element.getBoundingClientRect();
  return {
    rechteck: {
      top: Math.round(r.top),
      left: Math.round(r.left),
      width: Math.round(r.width),
      height: Math.round(r.height),
      bottom: Math.round(r.bottom),
    },
    zeigbar,
  };
}

/**
 * Hält Rechteck und zeigbare Schritte aktuell, solange die Tour läuft.
 *
 * Beispiel: Schritt „brett“ an der Abbildung; das Handy wird quer gedreht → neues Rechteck.
 */
export function useZielbeobachtung(
  schritte: readonly Tourschritt[],
  stelle: number | null,
): Zielstand {
  const [stand, setzeStand] = useState<Zielstand>({ rechteck: null, zeigbar: [] });
  // Vor dem ersten Zeichnen lesen, damit die Karte nicht kurz in der Mitte aufblitzt.
  useLayoutEffect(() => {
    let takt = 0;
    let letzter: Zielstand = { rechteck: null, zeigbar: [] };
    const schritt = () => {
      const neu = lies(schritte, stelle);
      if (!gleich(neu, letzter)) {
        letzter = neu;
        setzeStand(neu);
      }
      takt = window.requestAnimationFrame(schritt);
    };
    schritt();
    return () => window.cancelAnimationFrame(takt);
  }, [schritte, stelle]);
  return stand;
}
