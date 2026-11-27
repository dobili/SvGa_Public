/**
 * Die Reiter der Leiste unten (Leiste.tsx): fünf Bereiche mit Symbol, Wort und Tourziel und der
 * Reiter „Abenteuer“ (seit 27.11.2026, Wunsch des Autors: das Spiel in der Oberfläche der Beta).
 *
 * Rolle im Gesamtbild: Reine Liste ohne Zeichnen, damit Leiste.tsx nur Komponenten ausführt und
 * die Reihenfolge ohne Browser prüfbar ist (Leiste.test.tsx).
 * Warum Landkarte als Symbol: Das Spiel ist eine Reise durch Städte mit Weltkarte; der Kompass
 * steht schon oben rechts für den Rundgang, die Schwerter für „Spielen“.
 * Abhängigkeiten: app/stapel.ts (Bereiche), i18n (Textschlüssel), Lucide-Symbole.
 */
import {
  BookOpen,
  CircleUserRound,
  Crosshair,
  Map as Landkarte,
  Search,
  Swords,
  type LucideIcon,
} from "lucide-react";
import type { Bereich } from "../../../app/stapel";
import type { Textschluessel } from "../../../i18n/sprache";

/** Ein Bereich der Leiste mit Symbol, Wort und Ziel der Haupttour. */
export interface Bereichsknopf {
  readonly bereich: Bereich;
  readonly symbol: LucideIcon;
  readonly text: Textschluessel;
  /** Ziel-Kennung für die Haupttour (tour/touren.ts). */
  readonly tour: string;
}

/** Die fünf Bereiche in ihrer Reihenfolge. */
const BEREICHE: readonly Bereichsknopf[] = [
  { bereich: "buch", symbol: BookOpen, text: "leiste.buch", tour: "leiste-buch" },
  { bereich: "training", symbol: Crosshair, text: "leiste.training", tour: "leiste-training" },
  { bereich: "spielen", symbol: Swords, text: "leiste.spielen", tour: "leiste-spielen" },
  {
    bereich: "nachschlagen",
    symbol: Search,
    text: "leiste.nachschlagen",
    tour: "leiste-nachschlagen",
  },
  { bereich: "ich", symbol: CircleUserRound, text: "leiste.profil", tour: "leiste-einstellungen" },
];

/** Der Reiter „Abenteuer“: Landkarte wie die Weltkarte der Reise, steht hinter „Spielen“. */
export const ABENTEUERREITER = {
  symbol: Landkarte,
  text: "leiste.abenteuer",
  tour: "leiste-abenteuer",
} as const satisfies Omit<Bereichsknopf, "bereich">;

/** Hinter diesem Bereich steht der Reiter „Abenteuer“ (beides Spiel, Wunsch des Autors). */
const ABENTEUER_NACH: Bereich = "spielen";

/**
 * Die Reiter der Leiste in ihrer Reihenfolge: die fünf Bereiche und, wenn `mitAbenteuer`, hinter
 * „Spielen“ der Reiter „Abenteuer“ (als „abenteuer“ in der Liste).
 * Warum als Funktion: Die Fassung für die Leser zeigt ihn (noch) nicht; so bleibt das prüfbar.
 * Beispiel: reiterDerLeiste(true) → buch, training, spielen, abenteuer, nachschlagen, ich.
 */
export function reiterDerLeiste(mitAbenteuer: boolean): readonly (Bereichsknopf | "abenteuer")[] {
  return BEREICHE.flatMap((knopf) =>
    mitAbenteuer && knopf.bereich === ABENTEUER_NACH ? [knopf, "abenteuer" as const] : [knopf],
  );
}
