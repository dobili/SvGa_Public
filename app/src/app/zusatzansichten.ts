/**
 * Bildschirme der Pakete (Gamifizierung G5) und später neuer Werkzeuge oder Trainer, ohne den
 * Router zu ändern: eine allgemeine Ansicht „zusatz“ mit Kennung und Liste zum Eintragen.
 *
 * Rolle im Gesamtbild: Die Vorrecherche sah feste Platzhalter für „lernpfad“, „themen“,
 * „rekorde“, „rueckblick“ und „fundstuecke“ vor. Auf Wunsch des Autors (31.10.2026, „später noch
 * ergänzen können“) gibt es stattdessen eine Liste: Jedes Paket trägt seinen Bildschirm mit einer
 * Zeile ein und öffnet ihn mit navigiere({ bildschirm: "zusatz", kennung: "rekorde" }); ein
 * optionaler Wert (etwa der Monat „2026-10“ des Rückblicks) reist mit. App.tsx und stapel.ts
 * bleiben unverändert; der gesicherte Stapel kennt „zusatz“ (stapelMerker.ts).
 * Abhängigkeiten: die eingetragenen Bildschirme (ui/komponenten/teilen/Herausforderung.tsx).
 */
import type { ComponentType } from "react";
import { Lernpfad } from "../ui/bildschirme/Lernpfad";
import { Herausforderung } from "../ui/komponenten/teilen/Herausforderung";
import { ALBUM } from "../ui/komponenten/fundstuecke/album";
import { Fundstueckalbum } from "../ui/komponenten/fundstuecke/Fundstueckalbum";
import { NaechsterSchrittAnsicht } from "../ui/komponenten/start/NaechsterSchrittAnsicht";

/** Ein Bildschirm eines Pakets. */
export interface Zusatzansicht {
  /** Kennung in der Ansicht, etwa „lernpfad“, „themen“, „rekorde“, „rueckblick“, „fundstuecke“. */
  readonly kennung: string;
  readonly Bildschirm: ComponentType<{ readonly wert: string | null }>;
}

/** Alle Bildschirme der Pakete; je Paket eine Zeile (Konfliktkarte, gamifizierung.md). */
export const ZUSATZANSICHTEN: readonly Zusatzansicht[] = [
  // P2 Lernpfad durchs Buch (ui/bildschirme/Lernpfad.tsx)
  { kennung: "lernpfad", Bildschirm: Lernpfad },
  // P9: geteilte Aufgabe aus einem Link (ui/komponenten/teilen/Herausforderung.tsx).
  { kennung: "herausforderung", Bildschirm: Herausforderung },
  { kennung: ALBUM, Bildschirm: Fundstueckalbum },
  { kennung: "naechster", Bildschirm: NaechsterSchrittAnsicht },
];

/** Der eingetragene Bildschirm zu einer Kennung; undefined, wenn es ihn (noch) nicht gibt. */
export function zusatzansicht(
  kennung: string,
  liste: readonly Zusatzansicht[] = ZUSATZANSICHTEN,
): Zusatzansicht | undefined {
  return liste.find((a) => a.kennung === kennung);
}
