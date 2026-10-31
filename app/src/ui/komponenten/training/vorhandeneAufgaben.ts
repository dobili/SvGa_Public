/**
 * Welche fälligen Trainer-Aufgaben gibt es noch? Filter für die Übersicht der Wiederholungen.
 *
 * Rolle im Gesamtbild: Eine Wiederholungskarte bleibt im Speicher, auch wenn ihre Aufgabe
 * wegfällt (aussortierte Strukturaufgabe, eine Stellung, die eine spätere Eignungsregel
 * ausschließt, neue Daten der Pipeline). Der Trainer bietet dann nichts an, die Übersicht zählte
 * die Karte aber weiter („Zähltrainer: 1 fällig“ ohne Knopf; Prüfung beim Übernehmen des
 * Trainer-Feinschliffs 2, 31.10.2026). Hier steht je Trainer, wie er seine Aufgaben aus den
 * Kennungen wiederfindet; ein neuer wiederholter Trainer mit wandelbaren Aufgaben trägt eine
 * Zeile ein. Trainer ohne Eintrag zählen alle Karten (feste Kennungen aus den Trainerdaten).
 * Abhängigkeiten: training/wiederholbar.ts, training/buchstellungen.ts, daten/trainerdaten.ts.
 */
import { useMemo } from "react";
import { ladeStrukturen } from "../../../daten/trainerdaten";
import { ladeBuchstellungen, type Buchstellung } from "../../../training/buchstellungen";
import {
  lapaufgabenAus,
  roentgenaufgabenAus,
  zaehlaufgabenAus,
} from "../../../training/wiederholbar";
import type { WiederholterTrainer } from "../../../training/wiederholung";
import { useDaten } from "../bausteine/useDaten";

/** Was die Filter brauchen: Buchstellungen und Kennungen der Strukturaufgaben (null: lädt). */
interface Quellen {
  readonly buch: readonly Buchstellung[] | null;
  readonly struktur: ReadonlySet<string> | null;
}

/** Wie viele der Kennungen gibt es noch? null: Daten laden noch (dann zählen alle). */
type Zaehler = (ids: readonly string[], q: Quellen) => number | null;

const mitBuch =
  (finde: (b: readonly Buchstellung[], ids: readonly string[]) => readonly unknown[]): Zaehler =>
  (ids, q) =>
    q.buch ? finde(q.buch, ids).length : null;

/** Je Trainer mit wandelbaren Aufgaben: wie er sie wiederfindet. */
const ZAEHLER: Partial<Record<WiederholterTrainer, Zaehler>> = {
  struktur: (ids, q) => (q.struktur ? ids.filter((id) => q.struktur?.has(id)).length : null),
  zaehlen: mitBuch(zaehlaufgabenAus),
  roentgen: mitBuch(roentgenaufgabenAus),
  planbilanz: mitBuch(lapaufgabenAus),
};

/**
 * Hook: eine Funktion, die zu den fälligen Kennungen eines Trainers zählt, wie viele es noch gibt.
 * Beispiel: zwei Karten „zaehlen:bilanz-1.26-d4“ und eine verwaiste → 1.
 * Sonderfall: Solange die Daten laden, zählen alle Karten (wie bisher).
 */
export function useVorhandeneAufgaben(): (
  trainer: WiederholterTrainer,
  ids: readonly string[],
) => number {
  const buchDaten = useDaten(ladeBuchstellungen, "buchstellungen");
  const strukturDaten = useDaten(ladeStrukturen, "trainer-struktur");
  const quellen = useMemo<Quellen>(
    () => ({
      buch: buchDaten.art === "fertig" ? buchDaten.wert : null,
      struktur:
        strukturDaten.art === "fertig"
          ? new Set(strukturDaten.wert.aufgaben.map((a) => a.id))
          : null,
    }),
    [buchDaten, strukturDaten],
  );
  return (trainer, ids) => {
    if (ids.length === 0) return 0;
    return ZAEHLER[trainer]?.(ids, quellen) ?? ids.length;
  };
}
