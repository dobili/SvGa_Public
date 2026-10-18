/**
 * Ziehen per Wischen: eine Figur mit Finger oder Maus greifen und auf dem Zielfeld ablegen.
 *
 * Rolle im Gesamtbild: Ergänzt das Antippen von Figur und Zielfeld (Konzept 10.2), seit 0.2.92
 * (Wunsch des Autors, 18.10.2026). Brett.tsx hängt die Zeiger-Ereignisse an die Knopfschicht über
 * dem Bild; ein Wischen beginnt nur auf Feldern mit ziehbaren Figuren, damit das Scrollen der
 * Seite auf allen anderen Feldern frei bleibt (dort gilt weiter touch-action des Brettes).
 * Ohne Bewegung über die Schwelle bleibt alles beim Antippen: Der Klick des Knopfes kommt wie
 * bisher an. Nach einem Wischen sperrt der Baustein den folgenden Klick kurz, sonst wählte er die
 * gerade abgelegte Figur gleich wieder ab.
 * In den Einstellungen abschaltbar (Merker „wischen“ auf dem Gerät, wie die Koordinaten), weil
 * es von Gerät und Hand abhängt, nicht vom Lernstand.
 * Abhängigkeiten: geometrie.ts, masse.ts, app/merker.ts, React.
 */
import { useRef, useState } from "react";
import type { PointerEvent as ZeigerEreignis } from "react";
import { liesMerker } from "../../app/merker";
import { feldAnPunkt, type Punkt } from "./geometrie";
import { BRETT } from "./masse";

/** Name des Merkers auf dem Gerät; Wert „aus“ schaltet das Wischen ab. */
export const MERKER_WISCHEN = "wischen";
/** Ab so vielen Bildpunkten Bewegung wird aus einem Tipp ein Wischen. */
const SCHWELLE_PX = 6;
/** So lange nach dem Ablegen gilt ein Klick als Teil des Wischens (ms). */
const KLICKSPERRE_MS = 400;

/** Was das Brett zum Ziehen per Wischen von der Bedienung braucht. */
export interface Ziehbedienung {
  /** Felder mit Figuren, die jetzt ziehen dürfen; nur dort beginnt ein Wischen. */
  readonly felder: readonly string[];
  /** Wählt die Figur, sobald sie sich bewegt (zeigt die Zielfelder), ohne sie abzuwählen. */
  readonly beginne: (feld: string) => void;
  /** Legt die Figur ab: regelgerecht ist es ein Zug, sonst bleibt die Figur gewählt. */
  readonly lege: (von: string, nach: string) => void;
}

/** Die gerade gezogene Figur: Startfeld, Ort unter dem Zeiger und Feld darunter. */
export interface Ziehstand {
  readonly von: string;
  readonly punkt: Punkt;
  readonly ueber: string | null;
}

/** Ereignisse für die Knopfschicht; leer, wenn nicht gewischt werden kann. */
type Zeigerereignisse = Partial<
  Record<
    "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel",
    (ereignis: ZeigerEreignis<HTMLDivElement>) => void
  >
>;

/** Ist Ziehen per Wischen auf diesem Gerät an? Voreinstellung: an. */
export function wischenAn(): boolean {
  return liesMerker(MERKER_WISCHEN) !== "aus";
}

/** Rechnet die Lage des Zeigers in Einheiten des Brettes um (0 bis 8000). */
function punktIm(element: HTMLElement, x: number, y: number): Punkt {
  const rahmen = element.getBoundingClientRect();
  return {
    x: ((x - rahmen.left) / rahmen.width) * BRETT,
    y: ((y - rahmen.top) / rahmen.height) * BRETT,
  };
}

/**
 * Verwaltet ein Wischen von der Berührung bis zum Ablegen.
 *
 * Eingaben: Ziehbedienung (null: kein Wischen, etwa im Modus „Zählen“ oder abgeschaltet), ob das
 * Brett gedreht ist. Ausgabe: gezogene Figur zum Zeichnen, Ereignisse für die Knopfschicht und
 * klickGilt (false direkt nach einem Wischen).
 * Beispiel: Grundstellung, Bauer e2 nach e4 wischen → beginne("e2"), lege("e2", "e4").
 * Sonderfälle: Ablegen auf dem Startfeld oder neben dem Brett ist kein Zug, die Figur bleibt
 * gewählt; ein Abbruch durch das Gerät (pointercancel) vergisst das Wischen.
 */
export function useZiehen(ziehen: Ziehbedienung | null, gedreht: boolean) {
  const start = useRef<{ feld: string; x: number; y: number; zeiger: number } | null>(null);
  const laeuft = useRef(false);
  const abgelegt = useRef(Number.NEGATIVE_INFINITY);
  const [gezogen, setzeGezogen] = useState<Ziehstand | null>(null);

  const vergiss = () => {
    start.current = null;
    laeuft.current = false;
    setzeGezogen(null);
  };
  const ereignisse: Zeigerereignisse = !ziehen
    ? {}
    : {
        onPointerDown: (e) => {
          if (!e.isPrimary || e.button !== 0) return;
          const feld = feldAnPunkt(punktIm(e.currentTarget, e.clientX, e.clientY), gedreht);
          if (!feld || !ziehen.felder.includes(feld)) return;
          start.current = { feld, x: e.clientX, y: e.clientY, zeiger: e.pointerId };
        },
        onPointerMove: (e) => {
          const s = start.current;
          if (!s || e.pointerId !== s.zeiger) return;
          // Eine Maus ohne gedrückte Taste wischt nicht (losgelassen außerhalb des Brettes).
          if (e.pointerType === "mouse" && e.buttons === 0) return vergiss();
          if (!laeuft.current) {
            if (Math.hypot(e.clientX - s.x, e.clientY - s.y) < SCHWELLE_PX) return;
            laeuft.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            ziehen.beginne(s.feld);
          }
          const punkt = punktIm(e.currentTarget, e.clientX, e.clientY);
          setzeGezogen({ von: s.feld, punkt, ueber: feldAnPunkt(punkt, gedreht) });
        },
        onPointerUp: (e) => {
          const s = start.current;
          const warWischen = laeuft.current;
          vergiss();
          if (!s || !warWischen) return;
          abgelegt.current = performance.now();
          const nach = feldAnPunkt(punktIm(e.currentTarget, e.clientX, e.clientY), gedreht);
          if (nach && nach !== s.feld) ziehen.lege(s.feld, nach);
        },
        onPointerCancel: vergiss,
      };
  const klickGilt = () => performance.now() - abgelegt.current > KLICKSPERRE_MS;
  return { gezogen: ziehen ? gezogen : null, ereignisse, klickGilt };
}
