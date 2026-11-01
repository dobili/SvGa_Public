/**
 * „Zur Stellung“ in der Auswertung: so scrollen, dass das Brett der Partie ganz zu sehen ist.
 *
 * Rolle im Gesamtbild: Jeder Moment der Zeitleiste und ein Tipp auf die Verlaufskurve springen aufs
 * Brett oben (ui/bildschirme/Partie.tsx). Bis 1.11.2026 scrollte der Sprung ganz nach oben; auf
 * kleinen Bildschirmen stand dann der Kopf mit Ergebnis und Zugliste oben und das Brett war unten
 * angeschnitten (Befund des Autors). Jetzt rechnet diese Datei das Ziel aus dem Rechteck des
 * Brettes und der Leiste unten; bei „Bewegung reduzieren“ springt die Seite ohne Gleiten.
 * Abhängigkeiten: useWischreihe.ts (gleiten).
 */
import { gleiten } from "./useWischreihe";

/** Abstand zwischen Brett und Rand des sichtbaren Bereichs (Pixel). */
const RAND = 8;
/** Das Brett der Partie (mit Bewertungsleiste) und sein Bereich mit der Zeile darunter. */
const BRETT = ".bildschirm-partie [data-tour='brett']";
const BRETTBEREICH = ".brettbereich";
/** Die Leiste unten (Leiste.tsx); im Querformat steht sie als Schiene links und verdeckt unten nichts. */
const LEISTE = "nav.leiste";

/** Was die Rechnung braucht, alles in Pixeln des Fensters (wie getBoundingClientRect). */
export interface Brettmasse {
  readonly brettOben: number;
  readonly brettUnten: number;
  /** Unterkante des Bereichs mit der Zeile unter dem Brett (Drehen, Merken). */
  readonly bereichUnten: number;
  readonly scrollY: number;
  readonly fensterHoehe: number;
  /** So viel verdeckt die Leiste unten. */
  readonly untenVerdeckt: number;
}

/**
 * Wohin die Seite scrollen soll, damit das Brett ganz zu sehen ist; null: Es ist schon ganz zu sehen.
 *
 * Regel: Passt das Brett ganz oben auf der Seite in den sichtbaren Bereich, geht es nach oben (dann
 * stehen Ergebnis und Zugliste mit im Bild). Sonst rückt die Zeile unter dem Brett an den unteren
 * Rand über der Leiste, aber nie so weit, dass die Oberkante des Brettes aus dem Bild rückt.
 * Beispiel: 360 × 640, Brett 330 bis 683 ab Seitenanfang, Leiste 64 → Ziel 683 + 8 − 576 = 115.
 * Sonderfall: Ist das Brett höher als der sichtbare Bereich, steht seine Oberkante oben.
 */
export function scrollzielZumBrett(m: Brettmasse): number | null {
  const sichtUnten = m.fensterHoehe - m.untenVerdeckt;
  if (m.brettOben >= 0 && m.brettUnten <= sichtUnten) return null;
  const oben = m.brettOben + m.scrollY;
  if (m.brettUnten + m.scrollY + RAND <= sichtUnten) return 0;
  const zeileUnten = Math.max(m.bereichUnten, m.brettUnten) + m.scrollY;
  const ziel = Math.min(zeileUnten + RAND - sichtUnten, oben - RAND);
  return Math.max(0, Math.round(ziel));
}

/** Wie viel die Leiste unten vom Fenster verdeckt (0, wenn sie als Schiene an der Seite steht). */
function untenVerdeckt(): number {
  const leiste = document.querySelector<HTMLElement>(LEISTE)?.getBoundingClientRect();
  if (!leiste || leiste.width < window.innerWidth / 2) return 0;
  return Math.max(0, window.innerHeight - leiste.top);
}

/**
 * Scrollt die Seite so, dass das Brett der Partie ganz zu sehen ist (Regel in scrollzielZumBrett).
 * Ohne Brett im Dokument geschieht nichts.
 */
export function scrolleZumBrett(): void {
  const brett = document.querySelector<HTMLElement>(BRETT);
  if (!brett) return;
  const r = brett.getBoundingClientRect();
  const bereich = brett.closest<HTMLElement>(BRETTBEREICH)?.getBoundingClientRect() ?? r;
  const ziel = scrollzielZumBrett({
    brettOben: r.top,
    brettUnten: r.bottom,
    bereichUnten: bereich.bottom,
    scrollY: window.scrollY,
    fensterHoehe: window.innerHeight,
    untenVerdeckt: untenVerdeckt(),
  });
  if (ziel !== null) window.scrollTo({ top: ziel, behavior: gleiten() });
}
