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
import { Rueckblick } from "../ui/bildschirme/Rueckblick";
import { EINSTELLUNGSANSICHTEN } from "../ui/komponenten/einstellungen/einstellungsansichten";
import {
  ANSICHT_FALLENCHECKS,
  ANSICHT_STECKBRIEF,
  FallencheckAnsicht,
  SteckbriefAnsicht,
} from "../ui/bildschirme/Steckbriefe";
import { Variante } from "../ui/bildschirme/Variante";
import { Varianten } from "../ui/bildschirme/Varianten";
import { VariantenAbfrage } from "../ui/bildschirme/VariantenAbfrage";
import { ANSICHT_VARIANTENKARTE, Variantenkarte } from "../ui/bildschirme/Variantenkarte";
import { AbenteuerAnsicht } from "../abenteuer/anbindung/AbenteuerAnsicht";
import { AufgabenAnsicht } from "../abenteuer/anbindung/AufgabenAnsicht";
import { ANSICHT_ABENTEUER, ANSICHT_AUFGABEN } from "../abenteuer/schnittstelle/modul";

/** Ein Bildschirm eines Pakets. */
export interface Zusatzansicht {
  /** Kennung in der Ansicht, etwa „lernpfad“, „themen“, „rekorde“, „rueckblick“, „fundstuecke“. */
  readonly kennung: string;
  readonly Bildschirm: ComponentType<{ readonly wert: string | null }>;
  /**
   * Vollbild (Entscheidung D1 des Autors, 07.11.2026, Schach-Abenteuer): Die App zeigt keine
   * untere Leiste; der Bildschirm bringt seinen eigenen Rückweg mit (Spielmenü).
   */
  readonly vollbild?: boolean;
}

/** Alle Bildschirme der Pakete; je Paket eine Zeile (Konfliktkarte, gamifizierung.md). */
export const ZUSATZANSICHTEN: readonly Zusatzansicht[] = [
  // P2 Lernpfad durchs Buch (ui/bildschirme/Lernpfad.tsx)
  { kennung: "lernpfad", Bildschirm: Lernpfad },
  // P9: geteilte Aufgabe aus einem Link (ui/komponenten/teilen/Herausforderung.tsx).
  { kennung: "herausforderung", Bildschirm: Herausforderung },
  { kennung: ALBUM, Bildschirm: Fundstueckalbum },
  { kennung: "naechster", Bildschirm: NaechsterSchrittAnsicht },
  // P12 Monatsrückblick, Wert ist der Monat „2026-10“ (ui/bildschirme/Rueckblick.tsx).
  { kennung: "rueckblick", Bildschirm: Rueckblick },
  // Unterseiten der Einstellungen (Entwurf K2, 31.10.2026): Bots und Wertung, Daten, Über die App.
  ...EINSTELLUNGSANSICHTEN,
  // Steckbriefe nach Entwurf H2 (31.10.2026): ein Steckbrief (Wert: Name), die Fallenchecks.
  { kennung: ANSICHT_STECKBRIEF, Bildschirm: SteckbriefAnsicht },
  { kennung: ANSICHT_FALLENCHECKS, Bildschirm: FallencheckAnsicht },
  // Variationsbrowser Stufe 1 (1.11.2026): Liste (Wert: Filter) und eine Variante (Wert: Kennung
  // oder Quelle eines Entwurfs, ui/komponenten/varianten/variantenwert.ts).
  { kennung: "varianten", Bildschirm: Varianten },
  { kennung: "variante", Bildschirm: Variante },
  // Stufe 4: eine Variante oder die Varianten eines Eintrags abfragen (Wert: variantenwert.ts).
  { kennung: "variante-abfrage", Bildschirm: VariantenAbfrage },
  // Stufe 2: der ganze Baum als verschiebbare Karte (Wert: Kennung der Variante).
  { kennung: ANSICHT_VARIANTENKARTE, Bildschirm: Variantenkarte },
  // Schach-Abenteuer (docs/spiel/, Schritt 5): die Hülle lädt das Spiel erst auf Wunsch.
  { kennung: ANSICHT_ABENTEUER, Bildschirm: AbenteuerAnsicht, vollbild: true },
  // Aufgabenrunde des Abenteuers im Trainer der App (Regelwerk R30 bis R32), Wert: Auftragskennung.
  { kennung: ANSICHT_AUFGABEN, Bildschirm: AufgabenAnsicht, vollbild: true },
];

/** Der eingetragene Bildschirm zu einer Kennung; undefined, wenn es ihn (noch) nicht gibt. */
export function zusatzansicht(
  kennung: string,
  liste: readonly Zusatzansicht[] = ZUSATZANSICHTEN,
): Zusatzansicht | undefined {
  return liste.find((a) => a.kennung === kennung);
}
