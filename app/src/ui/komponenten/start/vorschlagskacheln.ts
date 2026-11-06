/**
 * Bild und Kurztext je Vorschlagsart für die Kacheln der Karte „Heute“ (Gestaltung A2, 31.10.2026).
 *
 * Rolle im Gesamtbild: training/vorschlagsarten.ts liefert die Vorschläge mit ganzem Satz
 * („9 Wiederholungen sind fällig. Etwa 6 Minuten.“). Die Kachel zeigt stattdessen ein Symbol, einen
 * Titel und eine kurze Zeile („9 Stellungen · etwa 6 Min“); der ganze Satz bleibt für Vorlesehilfen.
 * Eine neue Vorschlagsart trägt hier eine Zeile ein (eintragen statt umbauen, Wunsch des Autors
 * 31.10.2026); ohne Zeile zeigt die Kachel den Knopftext als Titel und den ganzen Satz.
 * Abhängigkeiten: training/naechsterSchritt.ts (Typ Vorschlag), lucide-react (Symbole), i18n.
 */
import {
  BookOpen,
  Dumbbell,
  LineChart,
  ListChecks,
  Puzzle,
  RefreshCw,
  Sparkles,
  Swords,
  Target,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Vorschlag } from "../../../training/naechsterSchritt";
import { vorschlagstext } from "./naechsterLage";

/** Aussehen einer Vorschlagsart als Kachel. */
export interface Kachelart {
  readonly Symbol: LucideIcon;
  /** Titel; ohne Angabe der Knopftext des Vorschlags (etwa „Weiterlesen“). */
  readonly titel?: Textschluessel;
  /** Platzhalter des Vorschlags, dessen Name als Titel dient (etwa „thema“). */
  readonly titelAusNamen?: string;
  /** Kurze Zeile mit den Werten des Vorschlags; ohne Angabe der ganze Satz. */
  readonly kurz?: Textschluessel;
  /** Noch kürzere Zeile für die kleinen Kacheln, wenn `kurz` dort umbräche. */
  readonly kurzKlein?: Textschluessel;
}

/** Je Vorschlagsart (Kennung aus VORSCHLAGSARTEN) eine Zeile. */
export const KACHELARTEN: Readonly<Record<string, Kachelart>> = {
  faellig: { Symbol: RefreshCw, titel: "buchlook.kachel.faellig", kurz: "buchlook.kurz.faellig" },
  tagesaufgabe: {
    Symbol: Puzzle,
    titel: "buchlook.kachel.tagesaufgabe",
    kurz: "buchlook.kurz.tagesaufgabe",
  },
  weiterlesen: {
    Symbol: BookOpen,
    kurz: "buchlook.kurz.weiterlesen",
    kurzKlein: "buchlook.kurz.weiterlesenKlein",
  },
  uebungen: { Symbol: Dumbbell, titel: "buchlook.kachel.uebungen", kurz: "buchlook.kurz.uebungen" },
  thema: { Symbol: Target, titelAusNamen: "thema", kurz: "buchlook.kurz.thema" },
  fehler: { Symbol: ListChecks, titelAusNamen: "trainer", kurz: "buchlook.kurz.fehler" },
  phase: { Symbol: LineChart, titel: "buchlook.kachel.phase", kurz: "buchlook.kurz.phase" },
  kurzplan: { Symbol: Timer, titel: "buchlook.kachel.kurzplan", kurz: "buchlook.kurz.kurzplan" },
  partie: { Symbol: Swords, titel: "buchlook.kachel.partie", kurz: "buchlook.kurz.partie" },
};

/** Für unbekannte Arten: Funkeln, Knopftext und ganzer Satz. */
export const KACHEL_SONST: Kachelart = { Symbol: Sparkles };

/** Die Kachelart eines Vorschlags. Beispiel: art „faellig“ → Pfeilkreis, „Wiederholen“. */
export function kachelart(vorschlag: Pick<Vorschlag, "art">): Kachelart {
  return KACHELARTEN[vorschlag.art] ?? KACHEL_SONST;
}

/**
 * Titel und Kurzzeile einer Kachel; ohne Eintrag Knopftext und ganzer Satz. `klein`: die kleine
 * Kachel der Alternativen (Beispiel Weiterlesen: groß „Kapitel 6 · Abb. 6.20“, klein „Abb. 6.20“).
 */
export function kacheltexte(vorschlag: Vorschlag, klein = false): { titel: string; kurz: string } {
  const art = kachelart(vorschlag);
  const name = art.titelAusNamen ? vorschlag.namen?.[art.titelAusNamen] : undefined;
  const titel = name ? t(name) : t(art.titel ?? vorschlag.knopf);
  const zeile = vorschlag.kurz ?? (klein ? (art.kurzKlein ?? art.kurz) : art.kurz);
  const kurz = zeile ? t(zeile, vorschlag.werte) : vorschlagstext(vorschlag);
  return { titel, kurz };
}
