/**
 * Hält eine fest verankerte Blase vom Brett fern (Rechnung: anbindung/blasenlage.ts).
 *
 * Warum (Wunsch des Autors, 19.11.2026): Während einer Partie soll nichts über dem Brett
 * erscheinen; Sprechblasen liegen ober- oder unterhalb. Die Blase wird zuerst in ihre Lage aus
 * der CSS zurückgesetzt und gemessen, dann, falls sie das Brett schneidet, verschoben. Das
 * geschieht vor dem Zeichnen und bei jeder Größenänderung oder jedem Rollen.
 * Eingaben: Verweis auf die Blase, Anker. Sonderfälle: Ohne Brett im Dokument bleibt alles,
 * wie es ist; das Brett ist das erste `.brett` der Spielhülle.
 */
import { useLayoutEffect, type RefObject } from "react";
import { brettfreieLage, type Anker } from "./blasenlage";

const BRETT = ".abenteuer-huelle .brett";

function setze(blase: HTMLElement, anker: Anker): void {
  const s = blase.style;
  s.top = s.bottom = s.maxHeight = s.overflowY = "";
  const brett = document.querySelector(BRETT);
  if (!brett) return;
  const lage = brettfreieLage(
    blase.getBoundingClientRect(),
    brett.getBoundingClientRect(),
    window.innerHeight,
    anker,
  );
  if (!lage) return;
  s.top = lage.top === undefined ? "auto" : `${lage.top}px`;
  s.bottom = lage.bottom === undefined ? "auto" : `${lage.bottom}px`;
  if (lage.maxHeight !== undefined) {
    s.maxHeight = `${lage.maxHeight}px`;
    s.overflowY = "auto";
  }
}

/** Verschiebt die Blase hinter `verweis`, bis sie das Brett nicht mehr berührt. */
export function useBrettfrei(verweis: RefObject<HTMLElement | null>, anker: Anker): void {
  useLayoutEffect(() => {
    const blase = verweis.current;
    if (!blase) return;
    const neu = () => setze(blase, anker);
    neu();
    // Auch die Blase selbst kann wachsen (Porträt lädt nach, Schrift).
    const beobachter = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(neu);
    beobachter?.observe(blase);
    window.addEventListener("resize", neu);
    window.addEventListener("scroll", neu, true);
    return () => {
      beobachter?.disconnect();
      window.removeEventListener("resize", neu);
      window.removeEventListener("scroll", neu, true);
    };
  }, [verweis, anker]);
}
