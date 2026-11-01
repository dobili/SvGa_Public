/**
 * Verschieben und Zoomen der Variantenkarte: ein Finger oder die Maus verschiebt, zwei Finger
 * oder das Mausrad zoomen, Pfeiltasten und Plus/Minus für die Tastatur; ein kurzer Tipp auf
 * einen Knoten wählt ihn.
 *
 * Rolle im Gesamtbild: Die Karte (Kartenflaeche.tsx) ist größer als der Bildschirm und soll „in
 * alle Richtungen scrollbar“ sein (Wunsch des Autors, 1.11.2026). Eigene Zeigerbedienung statt
 * des Scrollens der Seite, damit Verschieben und Zoomen mit zwei Fingern auf dem Handy
 * zusammengehen (die Fläche hat touch-action: none). Ohne Bibliothek, wegen des Größenbudgets.
 * Ein Tipp zählt, solange der Finger weniger als TIPP_WEG Bildpunkte wandert; gewählt wird der
 * Knoten unter dem Finger beim Aufsetzen (Attribut data-knoten).
 * Abhängigkeiten: React.
 */
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent as ZeigerEreignis, RefObject } from "react";

/** Grenzen und Schritte des Zooms. */
export const ZOOM = { kleinste: 0.3, groesste: 2.5, schritt: 1.25, rad: 0.002 } as const;
/** So weit (Bildpunkte) darf ein Finger wandern, ohne dass ein Tipp verfällt. */
const TIPP_WEG = 8;
/** Schritt der Pfeiltasten in Bildpunkten. */
const TASTENSCHRITT = 60;

/** Lage der Karte: Verschiebung der linken oberen Ecke und Zoom. */
export interface Ansichtslage {
  readonly x: number;
  readonly y: number;
  readonly s: number;
}

/** Ein Punkt auf dem Bildschirm, relativ zur Fläche. */
interface Punkt {
  readonly x: number;
  readonly y: number;
}

/** Was der Zeiger beim Aufsetzen traf. */
interface Aufsetzen {
  readonly zeiger: number;
  readonly punkt: Punkt;
  readonly knoten: number | null;
  gewandert: boolean;
}

/** Zoom auf einen Wert innerhalb der Grenzen. */
export function begrenzt(s: number): number {
  return Math.min(ZOOM.groesste, Math.max(ZOOM.kleinste, s));
}

/**
 * Neue Lage nach einem Zoom um ``faktor`` mit festem Punkt ``mitte`` (unter Finger oder Maus).
 * Beispiel: Lage (0, 0, 1), Faktor 2, Mitte (100, 100) → (−100, −100, 2): der Punkt bleibt stehen.
 */
export function gezoomt(lage: Ansichtslage, faktor: number, mitte: Punkt): Ansichtslage {
  const s = begrenzt(lage.s * faktor);
  const echt = s / lage.s;
  return { s, x: mitte.x - (mitte.x - lage.x) * echt, y: mitte.y - (mitte.y - lage.y) * echt };
}

/** Lage eines Zeigers relativ zur Fläche. */
function relativ(e: { clientX: number; clientY: number }, element: Element): Punkt {
  const rahmen = element.getBoundingClientRect();
  return { x: e.clientX - rahmen.left, y: e.clientY - rahmen.top };
}

/** Der Knoten unter dem Zeiger (data-knoten), sonst null. */
function knotenUnter(ziel: EventTarget | null): number | null {
  const element = ziel instanceof Element ? ziel.closest("[data-knoten]") : null;
  const wert = element?.getAttribute("data-knoten");
  return wert === null || wert === undefined ? null : Number(wert);
}

/** Abstand und Mitte zweier Zeiger. */
function paar(punkte: readonly Punkt[]): { abstand: number; mitte: Punkt } | null {
  const [a, b] = punkte;
  if (!a || !b) return null;
  return {
    abstand: Math.hypot(a.x - b.x, a.y - b.y),
    mitte: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
  };
}

type Paar = ReturnType<typeof paar>;

/**
 * Neue Lage nach einer Bewegung: zwei Finger zoomen um ihre Mitte und schieben mit ihr, ein
 * Finger (oder die Maus) schiebt.
 */
function nachBewegung(
  l: Ansichtslage,
  vorher: Punkt,
  jetzt: Punkt,
  alt: Paar,
  neu: Paar,
): Ansichtslage {
  if (!alt || !neu || alt.abstand <= 0)
    return { ...l, x: l.x + jetzt.x - vorher.x, y: l.y + jetzt.y - vorher.y };
  const z = gezoomt(l, neu.abstand / alt.abstand, neu.mitte);
  return { ...z, x: z.x + neu.mitte.x - alt.mitte.x, y: z.y + neu.mitte.y - alt.mitte.y };
}

/** Die Zeigerbedienung: verschieben, zwei Finger zoomen, Tipp auf einen Knoten. */
function useZeiger(
  setzeLage: (f: (l: Ansichtslage) => Ansichtslage) => void,
  beiTipp: (k: number) => void,
) {
  const zeiger = useRef(new Map<number, Punkt>());
  const aufsetzen = useRef<Aufsetzen | null>(null);
  const runter = (e: ZeigerEreignis<HTMLDivElement>) => {
    const punkt = relativ(e, e.currentTarget);
    zeiger.current.set(e.pointerId, punkt);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    aufsetzen.current =
      zeiger.current.size === 1
        ? { zeiger: e.pointerId, punkt, knoten: knotenUnter(e.target), gewandert: false }
        : null;
  };
  const bewege = (e: ZeigerEreignis<HTMLDivElement>) => {
    const vorher = zeiger.current.get(e.pointerId);
    if (!vorher) return;
    const punkt = relativ(e, e.currentTarget);
    const altesPaar = paar([...zeiger.current.values()]);
    zeiger.current.set(e.pointerId, punkt);
    const neuesPaar = paar([...zeiger.current.values()]);
    const a = aufsetzen.current;
    if (a && Math.hypot(punkt.x - a.punkt.x, punkt.y - a.punkt.y) > TIPP_WEG) a.gewandert = true;
    setzeLage((l) => nachBewegung(l, vorher, punkt, altesPaar, neuesPaar));
  };
  // Loslassen und Abbruch: ein Tipp zählt nur beim Loslassen ohne Wandern.
  const hoch = (e: ZeigerEreignis<HTMLDivElement>, abgebrochen = false) => {
    zeiger.current.delete(e.pointerId);
    const a = aufsetzen.current;
    aufsetzen.current = null;
    if (abgebrochen || !a || a.zeiger !== e.pointerId || a.gewandert || a.knoten === null) return;
    beiTipp(a.knoten);
  };
  return {
    onPointerDown: runter,
    onPointerMove: bewege,
    onPointerUp: (e: ZeigerEreignis<HTMLDivElement>) => hoch(e),
    onPointerCancel: (e: ZeigerEreignis<HTMLDivElement>) => hoch(e, true),
  };
}

/** Pfeiltasten verschieben, Plus und Minus zoomen um die Mitte der Fläche. */
function tastenlage(taste: string, l: Ansichtslage, mitte: Punkt): Ansichtslage | null {
  if (taste === "ArrowLeft") return { ...l, x: l.x + TASTENSCHRITT };
  if (taste === "ArrowRight") return { ...l, x: l.x - TASTENSCHRITT };
  if (taste === "ArrowUp") return { ...l, y: l.y + TASTENSCHRITT };
  if (taste === "ArrowDown") return { ...l, y: l.y - TASTENSCHRITT };
  if (taste === "+" || taste === "=") return gezoomt(l, ZOOM.schritt, mitte);
  if (taste === "-") return gezoomt(l, 1 / ZOOM.schritt, mitte);
  return null;
}

/**
 * Lage der Karte und alle Bedienungen der Fläche.
 * Eingaben: Element der Fläche, Anfangslage, was bei einem Tipp auf einen Knoten geschieht.
 * Ausgabe: Lage, Ereignisse für die Fläche, Tasten, Zoom um die Mitte, Lage setzen.
 * Sonderfall: Das Mausrad zoomt um den Mauszeiger; die Seite scrollt dabei nicht mit.
 */
export function useKartenbewegung(
  flaeche: RefObject<HTMLDivElement | null>,
  anfang: Ansichtslage,
  beiTipp: (knoten: number) => void,
) {
  const [lage, setzeLage] = useState<Ansichtslage>(anfang);
  const ereignisse = useZeiger(setzeLage, beiTipp);
  const mitte = (): Punkt => {
    const rahmen = flaeche.current?.getBoundingClientRect();
    return { x: (rahmen?.width ?? 0) / 2, y: (rahmen?.height ?? 0) / 2 };
  };
  useEffect(() => {
    const element = flaeche.current;
    if (!element) return;
    const rad = (e: WheelEvent) => {
      e.preventDefault();
      const punkt = relativ(e, element);
      setzeLage((l) => gezoomt(l, Math.exp(-e.deltaY * ZOOM.rad), punkt));
    };
    element.addEventListener("wheel", rad, { passive: false });
    return () => element.removeEventListener("wheel", rad);
  }, [flaeche]);
  const taste = (e: KeyboardEvent<HTMLDivElement>) => {
    const neu = tastenlage(e.key, lage, mitte());
    if (!neu) return;
    e.preventDefault();
    setzeLage(neu);
  };
  const zoome = (faktor: number) => setzeLage((l) => gezoomt(l, faktor, mitte()));
  return { lage, setzeLage, ereignisse, taste, zoome, mitte };
}
