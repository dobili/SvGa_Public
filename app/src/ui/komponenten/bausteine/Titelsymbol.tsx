/**
 * Zeichen vor Abschnittsköpfen, damit lange Seiten beim Scrollen Ankerpunkte haben (Symbolsprache
 * DS24).
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 19.10.2026. Wer eine Seite überfliegt, liest vor
 * allem Überschriften (NN/g, „Layer-Cake“-Muster); ein Zeichen in Gold vor jeder Überschrift macht
 * die Anker auch ohne Lesen sichtbar. Wo ein Bereich schon ein Zeichen hat, wird es übernommen:
 * Einstellungen das Zahnrad, Training das Fadenkreuz, Eröffnung das Buch der Phasentabelle
 * (zeilensymbole.ts), Spielstärke der Tacho der Auswertung.
 * Abhängigkeiten: lucide-react.
 */
import {
  BookOpen,
  ChartLine,
  ChartNoAxesColumnIncreasing,
  Contrast,
  Crosshair,
  Gauge,
  HardDrive,
  Info,
  LayoutGrid,
  LifeBuoy,
  Repeat,
  ScrollText,
  Settings,
  Timer,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react";

/** Größe des Zeichens (Bildpunkte). */
const GROESSE = 18;

/** Die Abschnitte und ihre Zeichen. */
const ZEICHEN = {
  ueberApp: Info,
  wertung: Trophy,
  daten: HardDrive,
  wiederholung: Repeat,
  training: Crosshair,
  fortschritt: TrendingUp,
  einstellungen: Settings,
  partien: ScrollText,
  auswertung: ChartLine,
  spielstaerke: Gauge,
  abbildungen: LayoutGrid,
  farbe: Contrast,
  bedenkzeit: Timer,
  hilfen: LifeBuoy,
  stufe: ChartNoAxesColumnIncreasing,
  eroeffnung: BookOpen,
} as const satisfies Readonly<Record<string, LucideIcon>>;

export type Abschnittsart = keyof typeof ZEICHEN;

/**
 * Das Zeichen eines Abschnitts, vor die Überschrift gesetzt; für Bildschirmleser verborgen.
 * Beispiel: <h2><Titelsymbol art="wertung" />Deine Wertung</h2> → Pokal + Text.
 */
export function Titelsymbol({ art }: { art: Abschnittsart }) {
  const Bild = ZEICHEN[art];
  return <Bild className="titel-symbol" size={GROESSE} aria-hidden="true" />;
}
