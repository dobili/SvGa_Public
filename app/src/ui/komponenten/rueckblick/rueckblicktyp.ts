/**
 * Der Typ der Daten, die der Rückblick nach einer ausgewerteten Partie braucht: Werte, beste
 * Züge, Urteile, Varianten und Theoriequellen je Stellung.
 *
 * Rolle im Gesamtbild: Gemeinsamer Typ für useRueckblick.tsx (rechnet den Rückblick) und
 * Rueckblickkarte.tsx (zeigt ihn). Eigene Datei, damit sich die beiden nicht gegenseitig
 * importieren: useRueckblick.tsx braucht die Karte, die Karte nur diesen Typ. useRueckblick.tsx
 * gibt ihn an Dateien weiter, die ihn von dort importieren (bildschirme/Partie.tsx).
 * Abhängigkeiten: spiel/auswertung.ts (Zugurteil), schach/theorie.ts (Theoriequellen).
 */
import type { Theoriequellen } from "../../../schach/theorie";
import type { Zugurteil } from "../../../spiel/auswertung";

/** Was der Rückblick nach der ausgewerteten Partie braucht. */
export interface Rueckblick {
  readonly werte: readonly number[];
  readonly beste: readonly string[];
  readonly urteile: readonly Zugurteil[];
  /** Hauptvariante der Engine je Stellung (UCI); leer bei älteren Auswertungen (R5). */
  readonly varianten?: readonly (readonly string[])[];
  /** Quellen der Theorie-Erkennung für die Namen bei einem Theoriezug (25.10.2026). */
  readonly theorie?: Theoriequellen | null;
}
