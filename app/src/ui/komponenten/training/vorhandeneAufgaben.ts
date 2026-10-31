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
import type { Uebungsverweis } from "../../../app/stapel";
import { ladeStrukturen } from "../../../daten/trainerdaten";
import { useSpeicher } from "../../../speicher/speicher";
import { ladeBuchstellungen, type Buchstellung } from "../../../training/buchstellungen";
import {
  lapaufgabenAus,
  roentgenaufgabenAus,
  zaehlaufgabenAus,
} from "../../../training/wiederholbar";
import {
  aufgabenAusKarten,
  faellige,
  uebungAusKarte,
  WIEDERHOLTE_TRAINER,
  type WiederholterTrainer,
} from "../../../training/wiederholung";
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

/** Fällige Wiederholungen, wie die Übersicht im Training sie zählt. */
export interface FaelligeUebersicht {
  /** Fällige Übungen des Buches als Reihe für den Bildschirm „Übung“. */
  readonly reihe: readonly Uebungsverweis[];
  /** Je Trainer die fälligen Aufgaben, die es noch gibt (nur Trainer mit mehr als null). */
  readonly trainer: readonly { kennung: WiederholterTrainer; anzahl: number }[];
  readonly gesamt: number;
}

/**
 * Hook: die fälligen Wiederholungen ohne verwaiste Karten, für die Übersicht im Training und die
 * Karte „Dein nächster Schritt“. Beide zeigen so dieselbe Zahl (beim Übernehmen am 31.10.2026: die
 * Karte meldete 9, das Training 6, weil sie verwaiste Karten mitzählte).
 */
export function useFaelligeUebersicht(): FaelligeUebersicht {
  const karten = useSpeicher((z) => z.daten.karten);
  const staende = useSpeicher((z) => z.daten.fortschritt.uebungen);
  const vorhanden = useVorhandeneAufgaben();
  const faellig = faellige(karten, new Date());
  const reihe = faellig.flatMap((kennung): Uebungsverweis[] => {
    const id = uebungAusKarte(kennung);
    const kapitel = id ? staende[id]?.kapitel : undefined;
    return id && kapitel !== undefined ? [{ kapitel, id }] : [];
  });
  const trainer = WIEDERHOLTE_TRAINER.map((kennung) => ({
    kennung,
    anzahl: vorhanden(kennung, aufgabenAusKarten(faellig, kennung)),
  })).filter((z) => z.anzahl > 0);
  const gesamt = reihe.length + trainer.reduce((summe, z) => summe + z.anzahl, 0);
  return { reihe, trainer, gesamt };
}
