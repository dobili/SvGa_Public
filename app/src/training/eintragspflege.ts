/**
 * Pflege der eigenen Einträge (Kapitel 12): Lernsammlung und Fehlerdatenbank bearbeiten, löschen
 * und das Löschen rückgängig machen, jeweils auf den ganzen Nutzerdaten.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): jede Karte der Lernsammlung und jeden
 * Eintrag der Fehlerdatenbank nachträglich ändern und direkt löschen können. Die Bildschirme
 * rufen nur diese Funktionen über speicher.aendere auf; so steht an einer Stelle, was ein
 * Löschen sonst noch berührt.
 * Stimmigkeit mit den Wiederholungskarten (Stand 1.11.2026): Weder die Lernsammlung noch die
 * Fehlerdatenbank legen Karten an. Die Abfrage der Sammlung speichert nichts, und die Karten der
 * Trainer hängen an der Aufgabe („taktik:…“), nicht am Eintrag. Ein gelöschter Eintrag lässt
 * darum keine verwaisten Karten zurück, und die Karte einer Trainer-Aufgabe bleibt, auch wenn ihre
 * Stellung aus der Sammlung fliegt. Sobald ein Eintrag eigene Karten bekommt (etwa Variationen der
 * Lernsammlung), räumt das Löschen sie hier mit ab.
 * Das Speicherformat bleibt unverändert (speicher/format.ts). Reine Funktionen.
 * Abhängigkeiten: training/lernsammlung.ts, training/fehlerdatenbank.ts, speicher/format.ts (Typ).
 * Buchbezug: Kapitel 12, Abschnitt 12.4 „Lernsammlung“ und Partieanalyse (Fehlerdatenbank).
 */
import type { Nutzerdaten } from "../speicher/format";
import {
  geaenderterFehler,
  HOECHSTENS_EINTRAEGE,
  ohneEintrag,
  type Fehleraenderung,
  type Fehlereintrag,
} from "./fehlerdatenbank";
import {
  geaenderterEintrag,
  HOECHSTENS_SAMMLUNG,
  ohneSammeleintrag,
  type Sammelaenderung,
  type Sammeleintrag,
} from "./lernsammlung";

/** Ein gelöschter Eintrag mit seiner alten Stelle in der Liste, für „Rückgängig“. */
export interface Geloescht<T> {
  readonly eintrag: T;
  readonly stelle: number;
}

/**
 * Setzt einen Eintrag wieder an seine alte Stelle (oder ans Ende, wenn die Liste kürzer ist).
 * Sonderfall: Steht die Kennung schon in der Liste (doppelt getippt), bleibt sie unverändert.
 * Beispiel: [a, c], b an Stelle 1 → [a, b, c].
 */
export function wiederEingesetzt<T extends { readonly id: string }>(
  liste: readonly T[],
  geloescht: Geloescht<T>,
  hoechstens: number,
): T[] {
  if (liste.some((e) => e.id === geloescht.eintrag.id)) return [...liste];
  const stelle = Math.min(Math.max(0, geloescht.stelle), liste.length);
  return [...liste.slice(0, stelle), geloescht.eintrag, ...liste.slice(stelle)].slice(-hoechstens);
}

/** Der Eintrag zur Kennung mit seiner Stelle, oder null. */
export function fundstelleIn<T extends { readonly id: string }>(
  liste: readonly T[],
  id: string,
): Geloescht<T> | null {
  const stelle = liste.findIndex((e) => e.id === id);
  const eintrag = liste[stelle];
  return eintrag ? { eintrag, stelle } : null;
}

/** Ändert Plan, Notiz oder Eröffnung eines Eintrags der Lernsammlung. */
export function mitGeaendertemSammeleintrag(
  daten: Nutzerdaten,
  id: string,
  teil: Sammelaenderung,
): Nutzerdaten {
  return { ...daten, sammlung: geaenderterEintrag(daten.sammlung, id, teil) };
}

/**
 * Löscht einen Eintrag der Lernsammlung. Die Wiederholungskarten bleiben, wie sie sind (siehe
 * Dateikopf: kein Eintrag hat eigene Karten).
 */
export function ohneSammeleintragIn(daten: Nutzerdaten, id: string): Nutzerdaten {
  return { ...daten, sammlung: ohneSammeleintrag(daten.sammlung, id) };
}

/** Holt einen gelöschten Eintrag der Lernsammlung an seine alte Stelle zurück. */
export function mitSammeleintragZurueck(
  daten: Nutzerdaten,
  geloescht: Geloescht<Sammeleintrag>,
): Nutzerdaten {
  return {
    ...daten,
    sammlung: wiederEingesetzt(daten.sammlung, geloescht, HOECHSTENS_SAMMLUNG),
  };
}

/** Ändert Fehlerart oder Satz eines Eintrags der Fehlerdatenbank. */
export function mitGeaendertemFehler(
  daten: Nutzerdaten,
  id: string,
  teil: Fehleraenderung,
): Nutzerdaten {
  return { ...daten, fehler: geaenderterFehler(daten.fehler, id, teil) };
}

/** Löscht einen Eintrag der Fehlerdatenbank (die Auswertung zählt ihn dann nicht mehr). */
export function ohneFehlerIn(daten: Nutzerdaten, id: string): Nutzerdaten {
  return { ...daten, fehler: ohneEintrag(daten.fehler, id) };
}

/** Holt einen gelöschten Eintrag der Fehlerdatenbank an seine alte Stelle zurück. */
export function mitFehlerZurueck(
  daten: Nutzerdaten,
  geloescht: Geloescht<Fehlereintrag>,
): Nutzerdaten {
  return { ...daten, fehler: wiederEingesetzt(daten.fehler, geloescht, HOECHSTENS_EINTRAEGE) };
}
