/**
 * Navigation als Stapel von Ansichten, ohne Adressen.
 *
 * Rolle im Gesamtbild: Die App wechselt Bildschirme intern; die Adresse im Browser bleibt gleich
 * (Konzept 6.6, „navigiere“ und „zurueck“). Diese Datei enthält nur die reine Logik des Stapels,
 * damit sie ohne Browser testbar ist. Die Verbindung zur Zurück-Taste steht in navigation.tsx.
 * Abhängigkeiten: nur der Typ der Trainerkennungen (training/trainer.ts).
 */
import type { TrainerKennung } from "../training/trainer";

/** Die fünf Bereiche der Leiste unten. */
export type Bereich = "buch" | "training" | "spielen" | "nachschlagen" | "ich";

/** Eine Ansicht mit ihren Parametern. */
export type Ansicht =
  | { readonly bildschirm: "buch" }
  | { readonly bildschirm: "abbildung"; readonly nummer: string }
  | { readonly bildschirm: "kapitel"; readonly nummer: number }
  | { readonly bildschirm: "nachschlagen" }
  | { readonly bildschirm: "training" }
  | { readonly bildschirm: "glossar" }
  | { readonly bildschirm: "begriff"; readonly begriff: string }
  | { readonly bildschirm: "denkroutine" }
  | { readonly bildschirm: "checkliste" }
  /** Spiel gegen die Engine vorbereiten; mit Stellung, wenn es von einer Abbildung aus beginnt. */
  | {
      readonly bildschirm: "spielen";
      readonly startFen?: string;
      readonly abbildung?: string;
    }
  /** Eine Partie gegen die Engine, laufend oder beendet (mit Auswertung). */
  | { readonly bildschirm: "partie"; readonly id: string }
  | { readonly bildschirm: "ich" }
  | { readonly bildschirm: "lizenzen" }
  /** Aufgabenseite des Autors (langer Druck aufs Zahnrad, seit 0.2.75). */
  | { readonly bildschirm: "autoraufgaben" }
  /** Eine Übung des Buches lösen (AP 13); mit Reihe, wenn „Nächste Übung“ weiterführt. */
  | ({
      readonly bildschirm: "uebung";
      readonly reihe?: readonly Uebungsverweis[];
    } & Uebungsverweis)
  /** Ein Trainer: Übungsart wählen und Runden spielen (AP 13). */
  | { readonly bildschirm: "trainer"; readonly kennung: TrainerKennung };

/** Eine Übung: Kapitel (zum Laden) und Kennung wie im LaTeX („ueb:droh-ignorieren“). */
export interface Uebungsverweis {
  readonly kapitel: number;
  readonly id: string;
}

/** Der Stapel: unten die Startansicht des Bereichs, oben die sichtbare Ansicht. */
export interface Stapel {
  readonly bereich: Bereich;
  readonly ansichten: readonly [Ansicht, ...Ansicht[]];
}

/** Aktionen, die den Stapel verändern. */
export type Schritt =
  | { readonly art: "navigiere"; readonly ansicht: Ansicht }
  | { readonly art: "ersetze"; readonly ansicht: Ansicht }
  | { readonly art: "zurueck" }
  | { readonly art: "bereich"; readonly bereich: Bereich };

/** Die erste Ansicht jedes Bereichs. */
export function startansicht(bereich: Bereich): Ansicht {
  if (bereich === "buch") return { bildschirm: "buch" };
  if (bereich === "ich") return { bildschirm: "ich" };
  if (bereich === "nachschlagen") return { bildschirm: "nachschlagen" };
  if (bereich === "training") return { bildschirm: "training" };
  return { bildschirm: "spielen" };
}

/** Ein neuer Stapel für einen Bereich. */
export function neuerStapel(bereich: Bereich): Stapel {
  return { bereich, ansichten: [startansicht(bereich)] };
}

/**
 * Führt einen Schritt auf dem Stapel aus.
 *
 * Warum: Eine reine Funktion statt verstreuter Zustände macht die Navigation vorhersagbar.
 * Eingaben: alter Stapel, Schritt. Ausgabe: neuer Stapel (der alte bleibt unverändert).
 * Beispiel: Buch → Abb. 1.26 öffnen (navigiere) → Abb. 1.27 (ersetze) → zurück → Buch.
 * Sonderfälle: „zurueck“ auf der untersten Ansicht ändert nichts.
 */
export function schritt(stapel: Stapel, aktion: Schritt): Stapel {
  const [unten, ...darueber] = stapel.ansichten;
  switch (aktion.art) {
    case "navigiere":
      return { ...stapel, ansichten: [unten, ...darueber, aktion.ansicht] };
    case "ersetze":
      return darueber.length === 0
        ? { ...stapel, ansichten: [aktion.ansicht] }
        : { ...stapel, ansichten: [unten, ...darueber.slice(0, -1), aktion.ansicht] };
    case "zurueck":
      return darueber.length === 0
        ? stapel
        : { ...stapel, ansichten: [unten, ...darueber.slice(0, -1)] };
    case "bereich":
      return neuerStapel(aktion.bereich);
  }
}

/** Die sichtbare Ansicht (oberste des Stapels). */
export function oben(stapel: Stapel): Ansicht {
  return stapel.ansichten[stapel.ansichten.length - 1] ?? stapel.ansichten[0];
}
