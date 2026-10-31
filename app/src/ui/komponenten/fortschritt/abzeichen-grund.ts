/**
 * Die 18 Grundabzeichen (Paket 10, 30.10.2026) als erste Teilliste von ABZEICHEN.
 *
 * Rolle im Gesamtbild: Seit Welle 0 der Gamifizierung setzt sich die Liste der Abzeichen aus
 * Teillisten zusammen (fortschritt/abzeichen.ts), damit parallele Arbeitschats eigene Abzeichen in
 * eigenen Dateien beitragen. Bedingungen auf der Grundlage aus abzeichen.ts.
 * Abhängigkeiten: abzeichen.ts (Typen, Schwellen), lucide-react (Zeichen).
 */
import {
  Award,
  BookCheck,
  Bookmark,
  Brain,
  CalendarCheck,
  CircleQuestionMark,
  Crown,
  Eye,
  Flag,
  Gem,
  Handshake,
  Hand,
  Medal,
  Mountain,
  NotebookPen,
  Swords,
  Trophy,
} from "lucide-react";
import type { Abzeichenangabe } from "./abzeichen";
import { zielanteil } from "./abzeichenanteil";

/** Tage hintereinander für das Abzeichen „Eine Woche dabei“. */
export const WOCHE = 7;
/** Partien für die drei Abzeichen der Partienzahl. */
const PARTIEN_ZIELE = [10, 50, 100] as const;
const WARUM_ZIEL = 10;
const EINGESCHAETZT_ZIEL = 10;
const FEHLER_ZIEL = 5;
const TRAINER_ZIEL = 100;

/** Die 18 Grundabzeichen in der Reihenfolge des Gitters: erst Spielen, dann Lernen am Buch, dann Übung. */
export const GRUNDABZEICHEN: readonly Abzeichenangabe[] = [
  {
    kennung: "erstePartie",
    symbol: Flag,
    erfuellt: (g) => g.partien >= 1,
    fortschritt: (g) => zielanteil(g.partien, 1),
  },
  {
    kennung: "ersterSieg",
    symbol: Trophy,
    erfuellt: (g) => g.siege >= 1,
    fortschritt: (g) => zielanteil(g.siege, 1),
  },
  {
    kennung: "partien10",
    symbol: Swords,
    erfuellt: (g) => g.partien >= PARTIEN_ZIELE[0],
    fortschritt: (g) => zielanteil(g.partien, PARTIEN_ZIELE[0]),
  },
  {
    kennung: "partien50",
    symbol: Swords,
    erfuellt: (g) => g.partien >= PARTIEN_ZIELE[1],
    fortschritt: (g) => zielanteil(g.partien, PARTIEN_ZIELE[1]),
  },
  {
    kennung: "partien100",
    symbol: Crown,
    erfuellt: (g) => g.partien >= PARTIEN_ZIELE[2],
    fortschritt: (g) => zielanteil(g.partien, PARTIEN_ZIELE[2]),
  },
  { kennung: "erstesMatt", symbol: Medal, erfuellt: (g) => g.mattGesetzt },
  { kennung: "siegOhneHilfe", symbol: Hand, erfuellt: (g) => g.siegOhneHilfe },
  { kennung: "siegGegenStaerkeren", symbol: Mountain, erfuellt: (g) => g.siegGegenStaerkeren },
  { kennung: "remisGegenStaerkeren", symbol: Handshake, erfuellt: (g) => g.remisGegenStaerkeren },
  { kennung: "brillant", symbol: Gem, erfuellt: (g) => g.brillant },
  {
    kennung: "ersteUebung",
    symbol: Award,
    erfuellt: (g) => g.uebungen >= 1,
    fortschritt: (g) => zielanteil(g.uebungen, 1),
  },
  { kennung: "kapitelUebungen", symbol: BookCheck, erfuellt: (g) => g.kapitelKomplett },
  {
    kennung: "warum",
    symbol: CircleQuestionMark,
    erfuellt: (g) => g.warum >= WARUM_ZIEL,
    fortschritt: (g) => zielanteil(g.warum, WARUM_ZIEL),
  },
  {
    kennung: "eingeschaetzt",
    symbol: Eye,
    erfuellt: (g) => g.eingeschaetzt >= EINGESCHAETZT_ZIEL,
    fortschritt: (g) => zielanteil(g.eingeschaetzt, EINGESCHAETZT_ZIEL),
  },
  {
    kennung: "sammlung",
    symbol: Bookmark,
    erfuellt: (g) => g.sammlung >= 1,
    fortschritt: (g) => zielanteil(g.sammlung, 1),
  },
  {
    kennung: "fehler",
    symbol: NotebookPen,
    erfuellt: (g) => g.fehler >= FEHLER_ZIEL,
    fortschritt: (g) => zielanteil(g.fehler, FEHLER_ZIEL),
  },
  {
    kennung: "trainer",
    symbol: Brain,
    erfuellt: (g) => g.trainerRichtig >= TRAINER_ZIEL,
    fortschritt: (g) => zielanteil(g.trainerRichtig, TRAINER_ZIEL),
  },
  {
    kennung: "woche",
    symbol: CalendarCheck,
    erfuellt: (g) => g.tagesfolge >= WOCHE || g.tagesserie >= WOCHE,
    fortschritt: (g) => zielanteil(Math.max(g.tagesfolge, g.tagesserie), WOCHE),
  },
];
