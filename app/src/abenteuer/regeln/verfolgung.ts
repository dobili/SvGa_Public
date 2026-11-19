/**
 * Verfolgte Quest: zu welcher Aufgabe der Zielpfeil zeigt (Wunsch des Autors, 19.11.2026).
 *
 * Warum: Der Pfeil lief bisher immer mit und zeigte auf das erste Ziel aller laufenden Quests; der
 * Autor will ihn nur auf Wunsch. Im Tagebuch hat jede laufende Aufgabe ein Symbol; Antippen
 * verfolgt sie, noch einmal Antippen hört auf. Immer höchstens eine Quest.
 * Regel: Geht die Quest einen Schritt weiter, folgt der Pfeil dem neuen Schritt (wer verfolgt,
 * will durch die Aufgabe geführt werden, und müsste sonst nach jedem Schritt neu tippen). Ist sie
 * erledigt oder unbekannt, zeigt er nirgends hin.
 * Rolle im Gesamtbild: Tagebuch.tsx schaltet, oberwelt/useZielhinweis.ts fragt das Ziel ab.
 * Abhängigkeiten: schnittstelle/spielstand.ts.
 */
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/**
 * Die Kennung der verfolgten Quest, wenn sie noch läuft, sonst null.
 * Beispiel: verfolgteQuest „mapleFalls.ersterAbend“, Quest läuft → „mapleFalls.ersterAbend“;
 * dieselbe Quest erledigt → null.
 */
export function verfolgteLaufendeQuest(stand: Abenteuerstand): string | null {
  const kennung = stand.verfolgteQuest ?? null;
  if (!kennung) return null;
  return stand.quests.some((q) => q.kennung === kennung && !q.erledigt) ? kennung : null;
}

/**
 * Antippen des Symbols einer Quest: verfolgt sie, oder hört auf, wenn sie schon verfolgt wird.
 * Beispiel: nichts verfolgt, „mapleFalls.dasBrett“ angetippt → verfolgteQuest „mapleFalls.dasBrett“;
 * noch einmal → null. Eine andere Quest antippen wechselt die Verfolgung.
 */
export function schalteVerfolgung(stand: Abenteuerstand, kennung: string): Abenteuerstand {
  const aktuell = verfolgteLaufendeQuest(stand);
  return { ...stand, verfolgteQuest: aktuell === kennung ? null : kennung };
}
