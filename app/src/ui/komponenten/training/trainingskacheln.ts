/**
 * Die Kacheln unten im Bereich Training (Entwurf C2, 31.10.2026) als Liste zum Eintragen:
 * Lernsammlung, Varianten und „Alle Kapitel“ (die Trainingsseiten der Website).
 *
 * Rolle im Gesamtbild: Ein späteres Werkzeug mit eigener Seite trägt hier eine Zeile ein (Symbol,
 * Titel, Unterzeile, Ziel); das Ziel ist ein Bildschirm der App oder eine Adresse der Website.
 * Gezeichnet werden die Kacheln in Trainingskacheln.tsx.
 * Abhängigkeiten: lucide, i18n, app/stapel.ts (Ansicht), speicher/format.ts (Nutzerdaten).
 */
import { BookmarkPlus, GitFork, Map as KartenSymbol, type LucideIcon } from "lucide-react";
import type { Ansicht } from "../../../app/stapel";
import { t, tZahl, type Textschluessel } from "../../../i18n/sprache";
import type { Nutzerdaten } from "../../../speicher/format";

/** Eine Kachel: Ziel ist ein Bildschirm der App oder eine Adresse der Website. */
export interface Trainingskachel {
  readonly kennung: string;
  readonly symbol: LucideIcon;
  readonly titel: Textschluessel;
  /** Unterzeile aus den Nutzerdaten, etwa „noch leer“ oder „3 Stellungen“. */
  readonly unterzeile: (daten: Nutzerdaten) => string;
  readonly ziel: { readonly ansicht: Ansicht } | { readonly adresse: string };
  /** Für die Tour (tour/touren.ts). */
  readonly tour: string;
}

/** Die Kacheln in ihrer Reihenfolge; je neue Kachel eine Zeile. */
export const TRAININGSKACHELN: readonly Trainingskachel[] = [
  {
    kennung: "sammlung",
    symbol: BookmarkPlus,
    titel: "sammlung.titel",
    unterzeile: (daten) =>
      tZahl("trainingslook.sammlung", daten.sammlung.length, { anzahl: daten.sammlung.length }),
    ziel: { ansicht: { bildschirm: "lernsammlung" } },
    tour: "training-sammlung",
  },
  // Variationsbrowser (Frage a, Empfehlung A, 1.11.2026): eigene Varianten neben der Sammlung.
  {
    kennung: "varianten",
    symbol: GitFork,
    titel: "varianten.titel",
    unterzeile: (daten) =>
      tZahl("varianten.kachel", daten.variationen.length, { anzahl: daten.variationen.length }),
    ziel: { ansicht: { bildschirm: "zusatz", kennung: "varianten" } },
    tour: "training-varianten",
  },
  {
    kennung: "kapitel",
    symbol: KartenSymbol,
    titel: "trainingslook.alleKapitel",
    unterzeile: () => t("trainingslook.alleKapitelText"),
    ziel: { adresse: "/training/" },
    tour: "training-website",
  },
];
