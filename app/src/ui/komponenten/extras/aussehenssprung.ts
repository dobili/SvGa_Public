/**
 * Sprung aus den Einstellungen zur Profilkarte „Dein Aussehen“: welcher Reiter offen stehen soll
 * und dass die Karte ins Bild rücken soll.
 *
 * Rolle im Gesamtbild: Seit „Aussehen im Profil“ (Wunsch des Autors, 7.11.2026) wählt man Brett,
 * Figuren und Rahmen nur noch in der Profilkarte. Der Knopf in den Einstellungen
 * (einstellungen/AussehenKnopf.tsx) merkt sich hier den Reiter und wechselt ins Profil; die Karte
 * (ExtrasKarte.tsx) liest den Sprung beim Zeichnen und löscht ihn, sobald sie ins Bild gerückt
 * ist. Ein Wert im Modul statt eines Feldes der Ansicht: Das Profil bleibt die Startansicht seines
 * Bereichs (stapel.ts), und nach einem Neuladen soll die Seite nicht mehr springen.
 * Abhängigkeiten: training/extras.ts (Typ der Art).
 */
import type { Extraart } from "../../../training/extras";

/** Der offene Sprung oder null. */
let sprung: Extraart | null = null;

/** Merkt einen Sprung zum Reiter `art`. Beispiel: merkeAussehenssprung("brett"). */
export function merkeAussehenssprung(art: Extraart): void {
  sprung = art;
}

/** Der offene Sprung, ohne ihn zu löschen (darf beim Zeichnen mehrfach gelesen werden). */
export function offenerAussehenssprung(): Extraart | null {
  return sprung;
}

/** Löscht den Sprung, nachdem die Karte ins Bild gerückt ist. */
export function loescheAussehenssprung(): void {
  sprung = null;
}
