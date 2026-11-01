/**
 * Waagerecht wischbare Reihe der Zeitleiste: welcher Moment vorn steht („3 von 12“), Blättern mit
 * den Knöpfen und Sprung zum Abschnitt einer Phase.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): Die Momente standen als hohe Karten
 * untereinander und nahmen viel Platz weg. Jetzt stehen sie in einer Reihe mit Einrasten
 * (CSS scroll-snap, zeitleiste.css); diese Datei misst die Reihe und blättert sie. Bei „Bewegung
 * reduzieren“ springt die Reihe ohne Gleiten.
 * Abhängigkeiten: React, spiel/phasen.ts (Typ).
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import type { Phase } from "../../../spiel/phasen";

/** Karten der Momente tragen ihre Nummer (ab 0) in diesem Attribut. */
const MOMENTKARTE = "[data-nummer]";
/** Bis auf so viele Pixel am rechten Rand gilt die Reihe als ganz durchgewischt. */
const ENDE_TOLERANZ = 2;
const HALB = 2;
/**
 * So lange gilt nach einem Knopfdruck das angesteuerte Ziel als Ausgangspunkt für den nächsten
 * (ms): Während die Reihe noch gleitet, zählt ein zweiter Druck vom Ziel aus weiter, nicht vom
 * Moment, der gerade vorn vorbeizieht.
 */
const ZIEL_HALTEN_MS = 700;
/** Tasten auf der Reihe: Pfeile ein Moment weiter oder zurück, Pos1 und Ende an Anfang und Schluss. */
const TASTEN: Readonly<Record<string, number>> = {
  ArrowRight: 1,
  ArrowLeft: -1,
  Home: -Infinity,
  End: Infinity,
};

/** Ob das Gerät „Bewegung reduzieren“ wünscht (dann springt die Ansicht ohne Gleiten). */
export function bewegungReduziert(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** „smooth“ oder, bei „Bewegung reduzieren“, „auto“. */
export function gleiten(): ScrollBehavior {
  return bewegungReduziert() ? "auto" : "smooth";
}

/**
 * Der Moment, der vorn steht: die erste Karte, deren Mitte noch rechts vom linken Rand liegt; am
 * Ende der Reihe die letzte (die letzten Karten können nicht ganz nach links rücken).
 *
 * Eingaben: Mitte jeder Momentkarte in der Reihe (Pixel ab Anfang der Reihe), linker Rand der
 * Sicht (scrollLeft), ob die Reihe ganz durchgewischt ist. Ausgabe: Index ab 0.
 * Beispiel: Mitten [150, 460, 770], Rand 320 → 1 („2 von 3“). Sonderfall: ohne Karten 0.
 */
export function vorneIndex(mitten: readonly number[], rand: number, amEnde: boolean): number {
  if (mitten.length === 0) return 0;
  if (amEnde) return mitten.length - 1;
  const index = mitten.findIndex((mitte) => mitte >= rand);
  return index < 0 ? mitten.length - 1 : index;
}

/** Die Momentkarten der Reihe in ihrer Reihenfolge. */
function momentkarten(reihe: HTMLElement): HTMLElement[] {
  return Array.from(reihe.querySelectorAll<HTMLElement>(MOMENTKARTE));
}

/** Rückt eine Karte an den linken Rand der Reihe (die Reihe ist ihr offsetParent). */
function rueckeVor(reihe: HTMLElement, karte: HTMLElement | null | undefined): void {
  if (!karte) return;
  reihe.scrollTo({ left: karte.offsetLeft, behavior: gleiten() });
}

/** Was die Zeitleiste von der Reihe braucht. */
export interface Wischreihe {
  /** Index des Moments, der vorn steht. */
  readonly vorn: number;
  /** Ist die Reihe breiter als ihre Sicht? Sonst braucht es weder Stand noch Knöpfe. */
  readonly ueberlauf: boolean;
  /** Ein Moment weiter (1) oder zurück (−1); größere Schritte enden am Anfang oder Schluss. */
  readonly blaettere: (schritt: number) => void;
  /** Für onKeyDown der Reihe (Pfeile, Pos1, Ende). */
  readonly beiTaste: (e: KeyboardEvent<HTMLElement>) => void;
  /** Rückt den Abschnitt einer Phase nach vorn; null: an den Anfang. */
  readonly zeigeAbschnitt: (phase: Phase | null) => void;
  /** Für onScroll der Reihe. */
  readonly beiScroll: () => void;
}

/**
 * Misst die Reihe beim Wischen und bei Größenänderung, einmal je Bild: Moment vorn und Überlauf.
 * Erreicht die Reihe das angesteuerte Ziel eines Knopfes, gilt es als erledigt.
 */
function useMessung(
  ref: RefObject<HTMLOListElement | null>,
  angesteuertRef: RefObject<number | null>,
): Pick<Wischreihe, "vorn" | "ueberlauf" | "beiScroll"> {
  const [vorn, setzeVorn] = useState(0);
  const [ueberlauf, setzeUeberlauf] = useState(true);
  const bild = useRef<number | null>(null);
  const miss = useCallback(() => {
    bild.current = null;
    const reihe = ref.current;
    if (!reihe) return;
    const mitten = momentkarten(reihe).map((k) => k.offsetLeft + k.offsetWidth / HALB);
    const amEnde = reihe.scrollLeft + reihe.clientWidth >= reihe.scrollWidth - ENDE_TOLERANZ;
    const index = vorneIndex(mitten, reihe.scrollLeft, amEnde && reihe.scrollLeft > 0);
    if (index === angesteuertRef.current) angesteuertRef.current = null;
    setzeVorn(index);
    setzeUeberlauf(reihe.scrollWidth > reihe.clientWidth + ENDE_TOLERANZ);
  }, [ref, angesteuertRef]);
  const beiScroll = useCallback(() => {
    if (bild.current === null) bild.current = requestAnimationFrame(miss);
  }, [miss]);
  useEffect(() => {
    beiScroll();
    window.addEventListener("resize", beiScroll);
    return () => {
      window.removeEventListener("resize", beiScroll);
      if (bild.current !== null) cancelAnimationFrame(bild.current);
    };
  }, [beiScroll]);
  return { vorn, ueberlauf, beiScroll };
}

/**
 * Misst die Reihe (die Liste hinter `ref`) beim Wischen und blättert sie.
 * Beispiel: zwölf Momente, nach zwei Wischern steht der dritte vorn → vorn = 2.
 */
export function useWischreihe(ref: RefObject<HTMLOListElement | null>): Wischreihe {
  const angesteuertRef = useRef<number | null>(null);
  const { vorn, ueberlauf, beiScroll } = useMessung(ref, angesteuertRef);
  const blaettere = useCallback(
    (schritt: number) => {
      const reihe = ref.current;
      if (!reihe) return;
      const karten = momentkarten(reihe);
      const ziel = Math.max(
        0,
        Math.min(karten.length - 1, (angesteuertRef.current ?? vorn) + schritt),
      );
      angesteuertRef.current = ziel;
      window.setTimeout(() => {
        if (angesteuertRef.current === ziel) angesteuertRef.current = null;
      }, ZIEL_HALTEN_MS);
      // Der erste Moment ganz am Anfang, damit die Karte seiner Phase davor mit im Bild steht.
      if (ziel === 0) reihe.scrollTo({ left: 0, behavior: gleiten() });
      else rueckeVor(reihe, karten[ziel]);
    },
    [ref, vorn],
  );
  const beiTaste = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const schritt = TASTEN[e.key];
      if (schritt === undefined || e.target !== e.currentTarget) return;
      e.preventDefault();
      blaettere(schritt);
    },
    [blaettere],
  );
  const zeigeAbschnitt = useCallback(
    (phase: Phase | null) => {
      const reihe = ref.current;
      if (!reihe) return;
      if (phase === null) reihe.scrollTo({ left: 0, behavior: gleiten() });
      else rueckeVor(reihe, reihe.querySelector<HTMLElement>(`[data-phase="${phase}"]`));
    },
    [ref],
  );
  return { vorn, ueberlauf, blaettere, beiTaste, zeigeAbschnitt, beiScroll };
}
