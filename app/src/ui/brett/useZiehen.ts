/**
 * Zeigerbedienung des Brettes: Antippen von Feldern und Ziehen per Wischen.
 *
 * Rolle im Gesamtbild: Ergänzt das Antippen von Figur und Zielfeld (Konzept 10.2), seit 0.2.92
 * (Wunsch des Autors, 18.10.2026) um das Wischen. Brett.tsx hängt die Zeiger-Ereignisse an die
 * Knopfschicht über dem Bild; ein Wischen beginnt nur auf Feldern mit ziehbaren Figuren, damit
 * das Scrollen der Seite auf allen anderen Feldern frei bleibt (dort gilt weiter touch-action
 * des Brettes).
 * Seit R35 (23.10.2026) erkennt der Baustein auch das Antippen selbst, statt auf den Klick des
 * Knopfes zu warten: Der Klick kam nicht, wenn der Finger beim Tippen etwas rutschte oder der
 * Tipp knapp nach einem Wischen folgte (die alte Klicksperre galt 400 ms für jeden Klick). Jetzt
 * zählt ein Tipp, solange der Finger weniger als TIPP_SPIEL Feldbreiten wandert, und das Feld
 * bestimmt treffer.ts großzügig. Der Klick des Knopfes danach wird verschluckt; Tastatur und
 * Bildschirmleser lösen weiter über den Klick aus.
 * In den Einstellungen abschaltbar ist nur das Wischen (Merker „wischen“ auf dem Gerät, wie die
 * Koordinaten), weil es von Gerät und Hand abhängt, nicht vom Lernstand.
 * Abhängigkeiten: geometrie.ts, masse.ts, app/merker.ts, React.
 */
import { useRef, useState } from "react";
import type { PointerEvent as ZeigerEreignis } from "react";
import { liesMerker } from "../../app/merker";
import { feldAnPunkt, type Punkt } from "./geometrie";
import { BRETT } from "./masse";

const FELDER_JE_REIHE = 8;

/** Name des Merkers auf dem Gerät; Wert „aus“ schaltet das Wischen ab. */
export const MERKER_WISCHEN = "wischen";
/**
 * Ab so vielen Bildpunkten Bewegung wird aus einem Tipp auf eine ziehbare Figur ein Wischen.
 * Bis R35 waren es 6; ein leicht rutschender Finger zog dann schon und traf ein Nachbarfeld.
 */
const SCHWELLE_PX = 10;
/** So weit (Anteil der Feldbreite) darf der Finger auf anderen Feldern wandern, ohne dass ein Tipp verfällt. */
const TIPP_SPIEL = 0.4;
/** So lange nach einem erkannten Tipp oder Ablegen gilt ein Klick als Teil davon (ms). */
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

/** Zeiger-Ereignisse für die Knopfschicht. */
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

/** Rechnet die Lage des Zeigers in Einheiten des Brettes um (0 bis 8000); null ohne Größe (jsdom). */
function punktIm(element: HTMLElement, x: number, y: number): Punkt | null {
  const rahmen = element.getBoundingClientRect();
  if (rahmen.width <= 0 || rahmen.height <= 0) return null;
  return {
    x: ((x - rahmen.left) / rahmen.width) * BRETT,
    y: ((y - rahmen.top) / rahmen.height) * BRETT,
  };
}

/** Breite eines Feldes auf dem Bildschirm in Bildpunkten. */
function feldbreitePx(element: HTMLElement): number {
  return element.getBoundingClientRect().width / FELDER_JE_REIHE;
}

/** Was useZiehen von Brett.tsx braucht. */
export interface Zeigerbedienung {
  /** Ziehen per Wischen (null: nur Antippen, etwa im Modus „Zählen“ oder abgeschaltet). */
  readonly ziehen: Ziehbedienung | null;
  /** Das gemeinte Feld unter einem Punkt, großzügig nach treffer.ts; null: nichts tun. */
  readonly treffe: (punkt: Punkt) => string | null;
  /** Ein erkannter Tipp auf ein Feld. */
  readonly tippe: (feld: string) => void;
}

/** Beginn einer Berührung: Feld, Lage auf dem Bildschirm und im Brett, ob dort gewischt wird. */
interface Beruehrung {
  readonly feld: string;
  readonly x: number;
  readonly y: number;
  readonly punkt: Punkt;
  readonly zeiger: number;
  readonly greifbar: boolean;
}

/**
 * Verwaltet eine Berührung vom Aufsetzen bis zum Loslassen: Tipp oder Wischen.
 *
 * Eingaben: Zeigerbedienung, ob das Brett gedreht ist. Ausgabe: gezogene Figur zum Zeichnen,
 * Ereignisse für die Knopfschicht und klickGilt (false direkt nach einem erkannten Tipp oder
 * Wischen, damit der Klick des Knopfes nicht ein zweites Mal wirkt).
 * Beispiel: Grundstellung, Bauer e2 nach e4 wischen → beginne("e2"), lege("e2", "e4");
 * e2 antippen → tippe("e2").
 * Sonderfälle: Ablegen auf dem Startfeld oder neben dem Brett ist kein Zug, die Figur bleibt
 * gewählt; ein Abbruch durch das Gerät (pointercancel, etwa beim Scrollen) vergisst alles.
 */
export function useZiehen({ ziehen, treffe, tippe }: Zeigerbedienung, gedreht: boolean) {
  const start = useRef<Beruehrung | null>(null);
  const laeuft = useRef(false);
  const behandelt = useRef(Number.NEGATIVE_INFINITY);
  const [gezogen, setzeGezogen] = useState<Ziehstand | null>(null);

  const vergiss = () => {
    start.current = null;
    laeuft.current = false;
    setzeGezogen(null);
  };
  const setzeAuf = (e: ZeigerEreignis<HTMLDivElement>) => {
    behandelt.current = Number.NEGATIVE_INFINITY;
    if (!e.isPrimary || e.button !== 0) return;
    const punkt = punktIm(e.currentTarget, e.clientX, e.clientY);
    const feld = punkt ? feldAnPunkt(punkt, gedreht) : null;
    if (!punkt || !feld) return;
    const greifbar = ziehen?.felder.includes(feld) ?? false;
    start.current = { feld, x: e.clientX, y: e.clientY, punkt, zeiger: e.pointerId, greifbar };
  };
  const bewege = (e: ZeigerEreignis<HTMLDivElement>) => {
    const s = start.current;
    if (!s || e.pointerId !== s.zeiger) return;
    // Eine Maus ohne gedrückte Taste wischt nicht (losgelassen außerhalb des Brettes).
    if (e.pointerType === "mouse" && e.buttons === 0) return vergiss();
    const weg = Math.hypot(e.clientX - s.x, e.clientY - s.y);
    if (!laeuft.current) {
      if (!s.greifbar || !ziehen) {
        if (weg > TIPP_SPIEL * feldbreitePx(e.currentTarget)) start.current = null;
        return;
      }
      if (weg < SCHWELLE_PX) return;
      laeuft.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      ziehen.beginne(s.feld);
    }
    const punkt = punktIm(e.currentTarget, e.clientX, e.clientY);
    if (punkt) setzeGezogen({ von: s.feld, punkt, ueber: feldAnPunkt(punkt, gedreht) });
  };
  const hebeAb = (e: ZeigerEreignis<HTMLDivElement>) => {
    const s = start.current;
    const warWischen = laeuft.current;
    vergiss();
    if (!s || e.pointerId !== s.zeiger) return;
    behandelt.current = performance.now();
    if (!warWischen) {
      const feld = treffe(s.punkt);
      if (feld) tippe(feld);
      return;
    }
    const punkt = punktIm(e.currentTarget, e.clientX, e.clientY);
    const nach = punkt ? treffe(punkt) : null;
    if (ziehen && nach && nach !== s.feld) ziehen.lege(s.feld, nach);
  };
  const ereignisse: Zeigerereignisse = {
    onPointerDown: setzeAuf,
    onPointerMove: bewege,
    onPointerUp: hebeAb,
    onPointerCancel: vergiss,
  };
  const klickGilt = () => performance.now() - behandelt.current > KLICKSPERRE_MS;
  return { gezogen: ziehen ? gezogen : null, ereignisse, klickGilt };
}
