/**
 * Wiedereinstieg nach einer Pause (Durchgang „Aktübergänge und Wiedereinstieg“, 20.11.2026): Wer
 * nach mehr als einem Tag weiterspielt, bekommt einmal eine Zeile aus dem Tagebuch, die Aufgabe
 * und ihren nächsten Schritt.
 *
 * Warum: Das Spiel dauert 13 bis 18 Stunden und wird über viele Tage gespielt. Beim Laden stand der
 * Held einfach da; was er gerade vorhatte, stand nur im Tagebuch, und das öffnet nicht jeder.
 * Gute Abenteuer erinnern nach einer Pause in einem Satz an das laufende Ziel, ohne Rückblende.
 * Rolle im Gesamtbild: reine Regel für oberwelt/useWiedereinstieg.ts (zeigt die Meldung) und
 * oberwelt/useWeltladen.ts (stempelt „zuletztGespielt“ beim Sichern der Sitzung).
 * Abhängigkeiten: daten/laden.ts (Questdaten), regeln/quests.ts, regeln/verfolgung.ts.
 */
import type { Questdaten } from "../daten/laden";
import type { Abenteuerstand, Queststand } from "../schnittstelle/spielstand";
import { naechsterSchritt } from "./quests";
import { verfolgteLaufendeQuest } from "./verfolgung";

/** Ab dieser Pause (ein Tag) kommt die Erinnerung. */
export const PAUSE_MS = 24 * 60 * 60 * 1000;

/** Titel und nächster Schritt der Aufgabe, an die erinnert wird (Textschlüssel). */
export interface Erinnerungszeile {
  readonly titel: string;
  readonly schritt: string;
}

/** Die zuletzt angenommene laufende Quest aus der Liste, oder null. */
function zuletztAngenommen(laufend: readonly Queststand[]): Queststand | null {
  return laufend.reduce<Queststand | null>(
    (beste, q) => (beste === null || q.angenommen > beste.angenommen ? q : beste),
    null,
  );
}

/**
 * Die Quest, an die erinnert wird: die verfolgte (Zielpfeil), sonst die zuletzt angenommene
 * Hauptquest, sonst die zuletzt angenommene überhaupt.
 * Beispiel: verfolgt nichts, laufend „mapleFalls.ersterAbend“ (Haupt) und „mapleFalls.samsDame“
 * → „mapleFalls.ersterAbend“.
 */
export function erinnerungsquest(
  stand: Abenteuerstand,
  quests: readonly Questdaten[],
): Queststand | null {
  const laufend = stand.quests.filter((q) => !q.erledigt);
  const verfolgt = verfolgteLaufendeQuest(stand);
  const v = laufend.find((q) => q.kennung === verfolgt);
  if (v) return v;
  const haupt = laufend.filter((q) => quests.find((d) => d.kennung === q.kennung)?.haupt === true);
  return zuletztAngenommen(haupt) ?? zuletztAngenommen(laufend);
}

/**
 * Die Erinnerungszeile nach einer Pause, oder null (keine Pause, kein Zeitstempel, keine Aufgabe).
 * Eingaben: Spielstand beim Laden, Questdaten, Jetzt.
 * Beispiel: zuletzt gespielt vor zwei Tagen, Quest „Ein Abend im neuen Haus“ im zweiten Schritt →
 * { titel: „quest.ersterAbend.titel“, schritt: „quest.ersterAbend.schritt2“ }.
 * Sonderfall: Alte Spielstände ohne „zuletztGespielt“ bekommen keine Erinnerung.
 */
export function erinnerungNachPause(
  stand: Abenteuerstand,
  quests: readonly Questdaten[],
  jetzt: Date,
): Erinnerungszeile | null {
  if (!stand.zuletztGespielt) return null;
  const pause = jetzt.getTime() - new Date(stand.zuletztGespielt).getTime();
  if (!(pause >= PAUSE_MS)) return null;
  const q = erinnerungsquest(stand, quests);
  const daten = q ? quests.find((d) => d.kennung === q.kennung) : undefined;
  const schritt = q && daten ? naechsterSchritt(daten, q) : null;
  return daten && schritt ? { titel: daten.titel, schritt } : null;
}
