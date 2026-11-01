/**
 * Die Kacheln im Bereich Training (Entwurf C2, 31.10.2026) als Liste zum Eintragen:
 * Lernsammlung, Fehlerdatenbank, Varianten und „Alle Kapitel“ (die Trainingsseiten der
 * Website). Seit 1.11.2026 stehen sie oben unter dem Stapel, und die Fehlerdatenbank hat eine
 * eigene Kachel (Wunsch des Autors: Er fand sie nach „Merken“ in der Reihe „Praxis“ nicht wieder).
 *
 * Rolle im Gesamtbild: Ein späteres Werkzeug mit eigener Seite trägt hier eine Zeile ein (Symbol,
 * Titel, Unterzeile, Ziel); das Ziel ist ein Bildschirm der App oder eine Adresse der Website.
 * Gezeichnet werden die Kacheln in Trainingskacheln.tsx.
 * Abhängigkeiten: lucide, i18n, app/stapel.ts (Ansicht), speicher/format.ts (Nutzerdaten).
 */
import { BookmarkPlus, Database, GitFork, Map as KartenSymbol, type LucideIcon } from "lucide-react";
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
    // Dasselbe Symbol wie der Trainer in der Reihe „Praxis“ (trainersymbole.ts).
    kennung: "fehler",
    symbol: Database,
    titel: "trainer.fehlerdatenbank.name",
    unterzeile: (daten) =>
      tZahl("trainingslook.fehler", daten.fehler.length, { anzahl: daten.fehler.length }),
    ziel: { ansicht: { bildschirm: "trainer", kennung: "fehlerdatenbank" } },
    tour: "training-fehler",
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
