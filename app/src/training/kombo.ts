/**
 * Kombo beim Üben (Gamifizierung P10 a): ab drei richtigen Antworten in Folge ein kleines
 * Abzeichen am Brettrand, bei fünf und zehn ein kurzes Funkeln, der Ton jeweils einen Halbton
 * höher.
 *
 * Rolle im Gesamtbild: Die Runde zählt die Folge (ui/trainer/useRunde.ts, Feld `folge`), der
 * Rundenrahmen zeigt sie mit bausteine/Kombo.tsx. Hier stehen nur die reinen Regeln. Die Stufen
 * sind eine Liste: Eine weitere Stufe (etwa 20 in Folge) ist eine Zeile in KOMBOSTUFEN; ein neuer
 * Trainer mit Rundenrahmen bekommt die Kombo von selbst (Wunsch des Autors, 31.10.2026: eintragen
 * statt umbauen).
 * Warum klein und leise: Feiern sollen kurz und abschaltbar sein, ein Fehler beendet die Kombo
 * ohne Meldung (Leitlinien der Vorrecherche, docs/nebenchat/gamifizierung.md, Abschnitt 1).
 * Abhängigkeiten: keine.
 */

/** Eine Stufe der Kombo: ab welcher Folge sie gilt und ob sie beim Erreichen funkelt. */
export interface Kombostufe {
  readonly ab: number;
  readonly funkeln: boolean;
}

/** Alle Stufen, aufsteigend; je weitere Stufe eine Zeile. */
export const KOMBOSTUFEN: readonly Kombostufe[] = [
  { ab: 3, funkeln: false },
  { ab: 5, funkeln: true },
  { ab: 10, funkeln: true },
];

/** Höher als eine Oktave steigt der Ton nicht (danach bleibt er gleich). */
const HOECHSTE_HALBTOENE = 12;

/** Ab dieser Folge gibt es die Kombo (die erste Stufe). */
export function komboAb(stufen: readonly Kombostufe[] = KOMBOSTUFEN): number {
  return stufen[0]?.ab ?? Number.POSITIVE_INFINITY;
}

/**
 * Ist die Kombo bei dieser Folge sichtbar?
 * Beispiel: 2 → false, 3 → true, 7 → true.
 */
export function komboSichtbar(folge: number, stufen: readonly Kombostufe[] = KOMBOSTUFEN): boolean {
  return folge >= komboAb(stufen);
}

/**
 * Funkelt es genau bei dieser Folge (beim Erreichen einer Stufe mit Funkeln)?
 * Beispiel: 5 → true, 6 → false, 10 → true, 3 → false.
 */
export function komboFunkelt(folge: number, stufen: readonly Kombostufe[] = KOMBOSTUFEN): boolean {
  return stufen.some((s) => s.ab === folge && s.funkeln);
}

/**
 * Tonhöhe der Kombo in Halbtönen über dem Grundton: jede weitere richtige Antwort einen höher,
 * höchstens eine Oktave.
 * Beispiel: 3 → 0, 4 → 1, 5 → 2, 20 → 12. Sonderfall: unter der ersten Stufe → null (kein Ton).
 */
export function komboHalbtoene(
  folge: number,
  stufen: readonly Kombostufe[] = KOMBOSTUFEN,
): number | null {
  if (!komboSichtbar(folge, stufen)) return null;
  return Math.min(folge - komboAb(stufen), HOECHSTE_HALBTOENE);
}
