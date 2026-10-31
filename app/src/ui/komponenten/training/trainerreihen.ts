/**
 * Trainer je Buchteil für die Wischreihen im Bereich Training (Entwurf C2, 31.10.2026), dazu der
 * Stand eines Trainers für seine Karte.
 *
 * Rolle im Gesamtbild: Die Reihen leiten sich aus TRAINER (training/trainer.ts) und den Teilen
 * des Buches (BUCHTEILE) ab, nichts ist fest aufgezählt: Ein neuer Trainer erscheint mit seinem
 * ersten Kapitel von selbst im passenden Teil. Ein Trainer für mehrere Kapitel steht nur einmal,
 * im Teil seines ersten Kapitels (Abweichungsmodus „Kap. 2–3“, Endspieltrainer „Kap. 8–9“).
 * Abhängigkeiten: training/trainer.ts, fortschritt/ringrechnung.ts (BUCHTEILE),
 * speicher/format.ts (Trainerstand), training/rekordarten.ts.
 */
import type { Gamifizierungsdaten } from "../../../speicher/gamifizierung";
import type { Trainerstand } from "../../../speicher/format";
import { REKORDARTEN } from "../../../training/rekordarten";
import type { Trainer, TrainerKennung } from "../../../training/trainer";
import { BUCHTEILE, type Buchteil } from "../fortschritt/ringrechnung";

/** Eine Reihe: ein Teil des Buches mit seinen Kapiteln und Trainern. */
export interface Trainerreihe {
  readonly teil: Buchteil;
  readonly kapitel: readonly number[];
  readonly trainer: readonly Trainer[];
}

/**
 * Die Reihen nach den Teilen des Buches; Teile ohne Trainer fallen weg.
 *
 * Beispiel: Grundlagen (Kapitel 0–1) → Koordinaten, Röntgen-Trainer, Zähltrainer.
 */
export function trainerreihen(alle: readonly Trainer[]): Trainerreihe[] {
  return BUCHTEILE.map(({ kennung, kapitel }) => ({
    teil: kennung,
    kapitel,
    trainer: alle.filter((t) => (kapitel as readonly number[]).includes(t.kapitel[0] ?? -1)),
  })).filter((reihe) => reihe.trainer.length > 0);
}

/**
 * Kapitel als kurzer Bereich. Beispiel: [2, 3] → „2–3“, [7] → „7“, [8, 9, 10] → „8–10“.
 * Sonderfall: Lücken gibt es in den Daten nicht; dann zählen nur erstes und letztes Kapitel.
 */
export function kapitelbereich(kapitel: readonly number[]): string {
  const erstes = kapitel[0];
  const letztes = kapitel[kapitel.length - 1];
  if (erstes === undefined || letztes === undefined) return "";
  return erstes === letztes ? String(erstes) : `${String(erstes)}–${String(letztes)}`;
}

const PROZENT = 100;

/** Was die Karte eines Trainers über den Stand des Lesers zeigt. */
export interface Trainerkartenstand {
  /** Gespielte Runden; 0 heißt „neu“. */
  readonly runden: number;
  /** Anteil richtiger Antworten in Prozent (gerundet); null ohne Antworten. */
  readonly quote: number | null;
  /** Bester Rekord, den man in diesem Trainer aufstellt (Kennung und Wert), sonst null. */
  readonly rekord: { readonly kennung: string; readonly wert: number } | null;
}

/**
 * Der Stand eines Trainers aus Trainerstand und Rekorden.
 *
 * Ein Rekord gehört zu dem Trainer, in dem man ihn verbessert (REKORDARTEN, Feld „versuchen“);
 * so bekommt ein neuer Trainer seinen Bestwert, sobald er eine Rekordart einträgt.
 * Beispiel: Taktiktrainer, 3 Runden, 8 von 10 richtig, Taktikserie 5 → 3, 80, taktikSerie 5.
 */
export function trainerkartenstand(
  kennung: TrainerKennung,
  stand: Trainerstand | undefined,
  rekorde: Gamifizierungsdaten["rekorde"],
): Trainerkartenstand {
  const art = REKORDARTEN.find(
    (r) =>
      r.versuchen?.bildschirm === "trainer" &&
      r.versuchen.kennung === kennung &&
      rekorde[r.kennung] !== undefined,
  );
  const wert = art ? rekorde[art.kennung]?.wert : undefined;
  const aufgaben = stand?.aufgaben ?? 0;
  return {
    runden: stand?.durchgaenge ?? 0,
    quote: aufgaben > 0 ? Math.round(((stand?.richtig ?? 0) / aufgaben) * PROZENT) : null,
    rekord: art && wert !== undefined ? { kennung: art.kennung, wert } : null,
  };
}
