/**
 * Hält eine fest verankerte Blase vom Brett fern (Rechnung: anbindung/blasenlage.ts).
 *
 * Warum (Wunsch des Autors, 19.11.2026): Während einer Partie soll nichts über dem Brett
 * erscheinen; Sprechblasen liegen ober- oder unterhalb. Seit dem 24.11.2026 meiden sie auch
 * die sichtbaren Hauptknöpfe unter dem Brett („Weiter“ nach einer Antwort; sperrflaeche in
 * blasenlage.ts). Die Blase wird zuerst in ihre Lage aus der CSS zurückgesetzt und gemessen,
 * dann, falls sie das Brett schneidet, verschoben. Das
 * geschieht vor dem Zeichnen und bei jeder Größenänderung oder jedem Rollen.
 * Eingaben: Verweis auf die Blase, Anker. Sonderfälle: Ohne Brett im Dokument bleibt alles,
 * wie es ist; das Brett ist das erste `.brett` der Spielhülle.
 */
import { useLayoutEffect, type RefObject } from "react";
import {
  brettfreieLage,
  knopfflaeche,
  sperrflaeche,
  type Anker,
  type Blasenstil,
} from "./blasenlage";

const BRETT = ".abenteuer-huelle .brett";
/** Hauptknöpfe der Hülle, die eine Blase freilassen muss („Weiter“ nach einer Antwort). */
const HAUPTKNOEPFE = ".abenteuer-huelle .knopf-haupt";

function setze(blase: HTMLElement, anker: Anker): void {
  const s = blase.style;
  s.top = s.bottom = s.maxHeight = s.overflowY = "";
  const brett = document.querySelector(BRETT);
  if (!brett) return;
  const knoepfe = [...document.querySelectorAll(HAUPTKNOEPFE)]
    .filter((k) => !blase.contains(k))
    .map((k) => k.getBoundingClientRect())
    .filter((r) => r.bottom > 0 && r.top < window.innerHeight);
  const brettflaeche = brett.getBoundingClientRect();
  const flaeche = sperrflaeche(brettflaeche, knoepfe);
  wende(blase, brettfreieLage(blase.getBoundingClientRect(), flaeche, window.innerHeight, anker));
  // Querformat: Knöpfe neben dem Brett in der Spalte der Blase (knopfflaeche in blasenlage.ts).
  const daneben = knopfflaeche(brettflaeche, blase.getBoundingClientRect(), knoepfe);
  if (daneben) {
    wende(blase, brettfreieLage(blase.getBoundingClientRect(), daneben, window.innerHeight, anker));
  }
}

/** Setzt eine berechnete Lage (null: die Lage bleibt). */
function wende(blase: HTMLElement, lage: Blasenstil | null): void {
  if (!lage) return;
  const s = blase.style;
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
    // Ein Knopf, der nach der Antwort erscheint, verschiebt die Blase ebenfalls.
    const huelle = document.querySelector(".abenteuer-huelle");
    const wandel = typeof MutationObserver === "undefined" ? null : new MutationObserver(neu);
    if (huelle) wandel?.observe(huelle, { childList: true, subtree: true });
    window.addEventListener("resize", neu);
    window.addEventListener("scroll", neu, true);
    return () => {
      beobachter?.disconnect();
      wandel?.disconnect();
      window.removeEventListener("resize", neu);
      window.removeEventListener("scroll", neu, true);
    };
  }, [verweis, anker]);
}
