/**
 * Welche Trainer Aufgaben als Herausforderung anbieten (Gamifizierung P9), als Liste zum
 * Eintragen, dazu der Sprung „#aufgabe-…“ und der Bildschirm für app/spruenge.ts und
 * app/zusatzansichten.ts.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (31.10.2026): später kommen weitere Trainer dazu, ohne
 * Umbau. Ein Trainer mit Aufgaben aus freien Quellen trägt eine Zeile ein: seine Kennung und die
 * Komponente, die eine Aufgabe aus ihrer Kennung in der Adresse zeigt; den Knopf zum Teilen setzt
 * er mit Herausforderungsknopf.tsx in seine Aufgabe. Adresse und Ansicht sind für alle gleich.
 * Abhängigkeiten: herausforderungslink.ts, TaktikHerausforderung.tsx, training/trainer.ts,
 * app/spruenge.ts (Typ).
 */
import type { ComponentType } from "react";
import type { Sprung } from "../../../app/spruenge";
import type { TrainerKennung } from "../../../training/trainer";
import {
  alsAnsichtswert,
  HERAUSFORDERUNG_ANSICHT,
  leseHerausforderung,
} from "./herausforderungslink";
import { TaktikHerausforderung } from "./TaktikHerausforderung";

/** Ein Trainer, dessen Aufgaben sich als Link teilen lassen. */
export interface Herausforderungsart {
  readonly trainer: TrainerKennung;
  /** Zeigt die Aufgabe zur Kennung aus der Adresse (oder einen Hinweis, wenn es sie nicht gibt). */
  readonly Aufgabe: ComponentType<{ readonly aufgabe: string }>;
}

/** Alle Trainer mit Herausforderungen; je Trainer eine Zeile. */
export const HERAUSFORDERUNGEN: readonly Herausforderungsart[] = [
  { trainer: "taktik", Aufgabe: TaktikHerausforderung },
];

/** Der Eintrag zu einem Trainer, oder undefined. */
export function herausforderungsart(
  trainer: string,
  liste: readonly Herausforderungsart[] = HERAUSFORDERUNGEN,
): Herausforderungsart | undefined {
  return liste.find((h) => h.trainer === trainer);
}

/** Der Sprung „#aufgabe-<trainer>-<aufgabe>“ für app/spruenge.ts; „Zurück“ führt ins Training. */
export const HERAUSFORDERUNGSSPRUNG: Sprung = {
  muster: /^#aufgabe-.+$/,
  bereich: "training",
  ansicht: (treffer) => {
    const ziel = leseHerausforderung(
      treffer[0],
      HERAUSFORDERUNGEN.map((h) => h.trainer),
    );
    return ziel
      ? { bildschirm: "zusatz", kennung: HERAUSFORDERUNG_ANSICHT, wert: alsAnsichtswert(ziel) }
      : null;
  },
};
