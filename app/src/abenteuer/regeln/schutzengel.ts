/**
 * Karte Schutzengel (K4, docs/spiel/11 Abschnitt 2; Wunsch des Autors, 13.11.2026): Für die nächsten
 * fünf eigenen Züge hält Ambrose einen Zug, der deutlich an Bewertung verliert, einmal auf („Das
 * spielst du besser nicht.“); der Zug wird nicht ausgeführt, der Held zieht neu.
 *
 * Rolle im Gesamtbild: reine Regeln. Wann die Karte wacht und ob ein Zug ein grober Fehler ist,
 * entscheidet diese Datei; die Spielhülle fragt die Engine und zeigt Ambroses Zeile
 * (anbindung/useSchutzengel.ts). Als Begründung nennt Ambrose höchstens die Art des Fehlers, nie
 * den besseren Zug.
 * Regel: Kapitel 4, Vorsichtsprüfung vor jedem Zug (Warnsignale W1 bis W7).
 * Abhängigkeiten: engine/spielbewerter.ts (Wert aus Sicht einer Seite).
 */
import { wertFuer } from "../../engine/spielbewerter";
import { ambroseFehlt } from "./abwesenheit";
import type { Wert } from "../../engine/uci";
import type { Kartenspiel } from "../schnittstelle/karten";
import type { Abenteuerstand, Partiekarten } from "../schnittstelle/spielstand";

/** Kennung der Karte in karten.json. */
export const SCHUTZENGEL = "schutzengel";
/** Wie viele eigene Züge die Karte wacht, wenn karten.json nichts anderes sagt. */
export const SCHUTZENGEL_ZUEGE = 5;
/** Ab so viel Verlust gegenüber dem besten Zug (Bauerneinheiten) ist ein Zug ein grober Fehler. */
export const SCHWELLE_BAUERN = 2;

/** Art des Fehlers, die Ambrose nennen darf. */
export type Schutzgrund = "haengt" | "koenig" | "matt";

/** Ist der Wert ein Matt für die Seite (weiss: Sicht von Weiß)? */
function mattFuer(wert: Wert, weiss: boolean): boolean {
  return wert.art === "matt" && (weiss ? wert.zuege > 0 : wert.zuege < 0);
}

/**
 * Ist der Zug ein grober Fehler, und welcher Art? Eingaben: bester Wert vor dem Zug und Wert nach
 * dem Zug (beide aus Sicht von Weiß, wie die Engine sie liefert), Farbe des Helden.
 * Beispiel: vorher +0,3, nachher −2,5 (Turm hängt) → „haengt“; nachher Matt gegen den Helden →
 * „koenig“; vorher Matt für den Helden, nachher keins → „matt“; vorher +0,3, nachher −0,5 → null.
 */
export function schutzgrund(vorher: Wert, nachher: Wert, heldWeiss: boolean): Schutzgrund | null {
  if (mattFuer(nachher, !heldWeiss)) return "koenig";
  if (mattFuer(vorher, heldWeiss) && !mattFuer(nachher, heldWeiss)) return "matt";
  const verlust = wertFuer(vorher, heldWeiss) - wertFuer(nachher, heldWeiss);
  return verlust >= SCHWELLE_BAUERN ? "haengt" : null;
}

/** Der noch wache Schutzengel der Partie oder null. */
function wacherEngel(karten: Partiekarten | null): Kartenspiel | null {
  return karten?.gespielt.find((k) => k.kennung === SCHUTZENGEL && k.ausgeloest !== true) ?? null;
}

/**
 * Wacht der Schutzengel über den nächsten Zug? Ja, wenn er gespielt und noch nicht ausgelöst ist
 * und der Held seitdem weniger als `zuege` Züge gemacht hat.
 * Eingaben: Karten der Partie, je Halbzug ob der Held zog, Zahl der Züge aus karten.json.
 * Beispiel: gespielt bei Halbzug 10, seitdem 4 eigene Züge → wacht; nach 5 nicht mehr.
 */
export function schutzengelWacht(
  karten: Partiekarten | null,
  vomHelden: readonly boolean[],
  zuege = SCHUTZENGEL_ZUEGE,
): boolean {
  const engel = wacherEngel(karten);
  if (!engel) return false;
  return vomHelden.slice(engel.halbzug).filter(Boolean).length < zuege;
}

/** Der Spielstand, nachdem Ambrose einen Zug aufgehalten hat: Der Schutzengel ist verbraucht. */
export function mitAusgeloestemSchutzengel(stand: Abenteuerstand): Abenteuerstand {
  const karten = stand.partiekarten;
  if (!karten) return stand;
  const gespielt = karten.gespielt.map((k) =>
    k.kennung === SCHUTZENGEL ? { ...k, ausgeloest: true } : k,
  );
  return { ...stand, partiekarten: { ...karten, gespielt } };
}

/** Begegnungen ohne Ambrose an der Seite (Finale); dort gibt es den Schutzengel nicht. */
const OHNE_AMBROSE: readonly string[] = ["capitalArena.finale"];

/**
 * Ist der Schutzengel gesperrt? Ohne Ambrose: zwischen Tiefpunkt und Versöhnung (wie der
 * Mentor-Zug, R29) und im Finale. Beispiel: tiefpunktGesehen ohne versoehnungGesehen → gesperrt.
 */
export function schutzengelGesperrt(
  variablen: Abenteuerstand["dialogvariablen"],
  begegnung: string,
): boolean {
  return ambroseFehlt(variablen) || OHNE_AMBROSE.includes(begegnung.split("#")[0] ?? "");
}
