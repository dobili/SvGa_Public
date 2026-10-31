/**
 * Was die Karte „Deine Rekorde“ zeigt (Profil neu, Entwurf R1 „Erreichtes und Herausforderung“,
 * Wahl des Autors 31.10.2026): groß die aufgestellten Rekorde, darunter zwei Vorschläge für den
 * nächsten Rekord und die übrigen zum Aufklappen. Reine Funktionen ohne Oberfläche.
 *
 * Rolle im Gesamtbild: Die frühere Tafel zeigte jede Rekordart mit „noch keiner“; für Einsteiger
 * war das eine Liste leerer Stellen. Jetzt wird aus jeder Leerstelle ein nächster Schritt. Quelle
 * bleibt REKORDARTEN (training/rekordarten.ts): Eine neue Art erscheint von selbst, mit Zeichen aus
 * REKORDZEICHEN (sonst ein Pokal) und dem Satz „profil.rekorde.vorschlag.<k>“ (Test prüft ihn).
 * „Höchste Wertung“ zählt erst ab der zehnten gewerteten Partie einer Zeitklasse
 * (training/rekordwerte.ts); bis dahin ist sie kein Vorschlag und sagt, wie viele Partien fehlen.
 * Abhängigkeiten: training/rekorde.ts (Typ), spiel/wertung.ts, speicher/format.ts (Typ),
 * lucide-react (Zeichen).
 */
import {
  Bot,
  Brain,
  CalendarDays,
  Clock,
  Eye,
  Flame,
  ShieldCheck,
  TrendingUp,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Nutzerdaten } from "../../../speicher/format";
import {
  ANFANGSPARTIEN,
  verlaufDerZeitklasse,
  zeitklassenMitWertung,
} from "../../../spiel/wertung";
import type { Rekordart } from "../../../training/rekorde";

/** Zeichen je Rekordart; eine neue Art ohne Eintrag bekommt den Pokal. */
const REKORDZEICHEN: Readonly<Record<string, LucideIcon>> = {
  taktikZeit: Clock,
  tagesserie: Flame,
  taktikSerie: Zap,
  trainerTag: Brain,
  lerntageWoche: CalendarDays,
  zugErraten: Eye,
  wertung: TrendingUp,
  bot: Bot,
  ohnePatzer: ShieldCheck,
};

/** Größe der Zeichen in der Karte (Bildpunkte). */
export const REKORDZEICHEN_GROESSE = 22;

/** So viele Vorschläge stehen offen da; die übrigen zum Aufklappen. */
export const VORSCHLAEGE = 2;

/** Kennung der Rekordart „Höchste Wertung“ (training/rekordarten.ts). */
export const REKORD_WERTUNG = "wertung";

/** Das Zeichen einer Rekordart. Beispiel: „taktikZeit“ → Uhr. */
export function rekordzeichen(kennung: string): LucideIcon {
  return REKORDZEICHEN[kennung] ?? Trophy;
}

/**
 * Wie viele gewertete Partien noch fehlen, bis „Höchste Wertung“ zählt: zehn in einer
 * Zeitklasse, gezählt in der Zeitklasse mit den meisten. Beispiel: 3 Schnellschach-Partien → 7.
 */
export function partienBisWertung(daten: Nutzerdaten): number {
  const punkte = daten.spiel.wertung;
  const meiste = Math.max(
    0,
    ...zeitklassenMitWertung(punkte).map((z) => verlaufDerZeitklasse(punkte, z).length),
  );
  return Math.max(0, ANFANGSPARTIEN - meiste);
}

/** Die Einteilung der Karte. */
export interface Rekordstand {
  /** Arten mit aufgestelltem Rekord, in der Reihenfolge von REKORDARTEN. */
  readonly aufgestellt: readonly Rekordart[];
  /** Die (höchstens zwei) Vorschläge mit Knopf „Los“. */
  readonly vorschlaege: readonly Rekordart[];
  /** Alle übrigen Arten ohne Rekord. */
  readonly weitere: readonly Rekordart[];
}

/**
 * Teilt die Rekordarten ein: aufgestellt, Vorschläge, weitere.
 * Warum diese Vorschläge: die ersten Arten der Liste ohne Rekord, die einen Knopf haben und sofort
 * erreichbar sind (nicht „Höchste Wertung“ vor zehn Partien). Beispiel: frischer Start → Vorschläge
 * „Taktik auf Zeit“ und „Beste Tagesserie“, sieben weitere.
 */
export function rekordstand(daten: Nutzerdaten, arten: readonly Rekordart[]): Rekordstand {
  const aufgestellt = arten.filter((a) => daten.rekorde[a.kennung] !== undefined);
  const offen = arten.filter((a) => daten.rekorde[a.kennung] === undefined);
  const wertungFehlt = partienBisWertung(daten) > 0;
  const vorschlaege = offen
    .filter((a) => a.versuchen !== null && !(a.kennung === REKORD_WERTUNG && wertungFehlt))
    .slice(0, VORSCHLAEGE);
  return { aufgestellt, vorschlaege, weitere: offen.filter((a) => !vorschlaege.includes(a)) };
}
