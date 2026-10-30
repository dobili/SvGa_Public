/**
 * Welche Abbildung des Buches ein Steckbrief als Diagramm zeigt: die Schlussstellung der
 * Hauptvariante (Eröffnungen) oder den Stopp-Moment (Fallenchecks).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung 26.10.2026, Paket F): „bei Steckbriefen
 * einmal die Endstellung zeigen“; bestätigt als Stellung am Ende der Hauptvariante aus dem Buch.
 * Das Buch hat dafür in jedem Eröffnungsabschnitt eine Abbildung „Schlussstellung der
 * Hauptvariante nach …“; diese wird gesucht, nichts wird neu gerechnet (Regel 1: das Buch ist die
 * Quelle). In Abschnitt 2.10 stehen vier Eröffnungen; dort entscheidet der Unterabschnitt, der wie
 * der Steckbrief heißt.
 * Abhängigkeiten: daten/laden.ts (Typen).
 */
import type { Abbildung, Kapitel, Textteil } from "../../../daten/laden";

type Steckbrief = Kapitel["steckbriefe"][number];

/** Anfang der Bildunterschrift, an dem das Buch die Schlussstellung kennzeichnet. */
const SCHLUSS_KENNUNG = "Schlussstellung der Hauptvariante";

/** Die Bildunterschrift als schlichter Text. */
function klartext(teile: readonly Textteil[]): string {
  return teile.map((teil) => teil.text).join("");
}

/** Alle Abbildungen der Kapitel in einer Liste. */
function alleAbbildungen(kapitel: readonly Kapitel[]): readonly Abbildung[] {
  return kapitel.flatMap((k) => k.abbildungen);
}

/**
 * Die Abbildung mit der Schlussstellung der Hauptvariante zu einem Eröffnungs-Steckbrief.
 *
 * Eingaben: alle geladenen Kapitel, der Steckbrief. Ausgabe: die Abbildung oder null.
 * Beispiel aus dem Buch: „Spanische Partie“ (Abschnitt 2.2) → Abb. 2.11, „Schlussstellung der
 * Hauptvariante nach 16... Ld7“; „Caro-Kann-Verteidigung“ (2.10) → Abb. 2.109.
 * Sonderfälle: Hat ein Unterabschnitt zwei solche Abbildungen (Zweispringerspiel und
 * Läuferspiel), gilt die erste; ohne Abschnitt oder ohne passende Abbildung → null.
 */
export function schlussstellung(
  kapitel: readonly Kapitel[],
  steckbrief: Steckbrief,
): Abbildung | null {
  if (!steckbrief.abschnitt) return null;
  const kandidaten = alleAbbildungen(kapitel).filter(
    (a) =>
      a.abschnitt?.nummer === steckbrief.abschnitt &&
      klartext(a.unterschrift).includes(SCHLUSS_KENNUNG),
  );
  const imUnterabschnitt = kandidaten.find((a) => a.unterabschnitt === steckbrief.name);
  return imUnterabschnitt ?? kandidaten[0] ?? null;
}

/**
 * Die Abbildung mit einer bestimmten Nummer, etwa der Stopp-Moment eines Fallenchecks.
 * Beispiel: „4.21“ (Kieninger-Falle) → Abb. 4.21. Sonderfall: unbekannte Nummer → null.
 */
export function abbildungMitNummer(
  kapitel: readonly Kapitel[],
  nummer: string | null,
): Abbildung | null {
  if (!nummer) return null;
  return alleAbbildungen(kapitel).find((a) => a.id === nummer) ?? null;
}
