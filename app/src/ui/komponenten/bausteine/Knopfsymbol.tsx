/**
 * Zeichen vor der Beschriftung eines Knopfes, nach festen Bedeutungen (seit 0.2.101,
 * Symbolsprache DS22).
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 19.10.2026: allgemein bekannte Zeichen, die man ohne
 * Lesen erkennt, etwa die Diskette fürs Speichern. Jede Bedeutung hat genau ein Zeichen, und jedes
 * Zeichen steht nur für diese Bedeutung (Apple HIG: „Avoid using the same … to mean different
 * things“). Das Wort bleibt immer daneben stehen (NN/g, Icon Usability); das Zeichen ist für
 * Bildschirmleser verborgen.
 * Abhängigkeiten: lucide-react.
 */
import {
  Bug,
  Copy,
  Download,
  Eye,
  Flag,
  Lightbulb,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Settings,
  Share2,
  Trash2,
  Undo2,
  Upload,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

/** Größe des Zeichens (Bildpunkte), passend zur Schrift der Knöpfe. */
const GROESSE = 18;

/** Die Bedeutungen und ihre Zeichen. */
const ZEICHEN = {
  /** Etwas in der App speichern (Gegner, Eintrag der Lernsammlung). */
  speichern: Save,
  /** Eine Datei auf das Gerät legen (Sicherung, PGN). */
  herunterladen: Download,
  /** Eine Datei ins Gerät holen (Sicherung einspielen). */
  einspielen: Upload,
  teilen: Share2,
  kopieren: Copy,
  loeschen: Trash2,
  neu: Plus,
  neuerGegner: UserPlus,
  zuruecknehmen: Undo2,
  aufgeben: Flag,
  nochmal: RotateCcw,
  starten: Play,
  hinweis: Lightbulb,
  loesung: Eye,
  aktualisieren: RefreshCw,
  fehlerMelden: Bug,
  einstellungen: Settings,
} as const satisfies Readonly<Record<string, LucideIcon>>;

export type Knopfaktion = keyof typeof ZEICHEN;

/**
 * Das Zeichen einer Aktion, vor das Wort im Knopf gesetzt.
 * Beispiel: <button><Knopfsymbol art="speichern" />Gegner speichern</button> → Diskette + Text.
 */
export function Knopfsymbol({ art }: { art: Knopfaktion }) {
  const Bild = ZEICHEN[art];
  return <Bild className={`knopfzeichen knopfzeichen-${art}`} size={GROESSE} aria-hidden="true" />;
}
