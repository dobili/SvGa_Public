/**
 * Die Kapitelaufgaben des Lernpfads (Wunsch des Autors, 31.10.2026: „Auf der Karte darf alles
 * stehen, was man braucht, um am Ende alles geschafft zu haben“): je Kapitel die Übungen, die
 * Lernziele der Checkliste und die Trainer, die zum Kapitel gehören, mit Stand „x von y“.
 *
 * Rolle im Gesamtbild: Diese Aufgaben sind keine Orden oder Abzeichen (keine Feier, kein Teilen),
 * stehen aber im selben Infofenster (erfolge/Infofenster.tsx) und zählen nur aus gespeicherten
 * Daten, ohne neues Speicherfeld:
 * - Übungen: `fortschritt.uebungen[id].geloest` (Regel: jedes Kapitel endet mit seinen Übungen).
 * - Lernziele: der Lernstand der Checkliste (app/lernstand.ts), Zahl der Ziele aus
 *   nachschlagen.json (Regel: die Lernziele stehen am Anfang jedes Kapitels).
 * - Trainer: ein Trainer zählt, sobald er einmal ganz durchgespielt ist
 *   (`fortschritt.trainer[k].durchgaenge > 0`, gespeichert von jeder Runde). Die Fehlerdatenbank
 *   hat keine Runde (TRAINER_OHNE_RUNDE) und fehlt deshalb; sie steht als Abzeichen „Aus Fehlern
 *   lernen“ bei Kapitel 12. Welche Trainer zu welchem Kapitel gehören, sagt training/trainer.ts.
 * Der Knopf „Los geht's“ führt zur ersten offenen Übung, zur Checkliste bzw. zum ersten Trainer,
 * der noch fehlt. Reine Funktionen.
 * Abhängigkeiten: daten/uebungsliste-daten.ts, training/trainer.ts,
 * app/lernstand.ts, speicher (Typen), erfolge/erfolgsstuecke.ts (Typ), i18n, lucide-react.
 */
import { ClipboardCheck, Dumbbell, ListChecks } from "lucide-react";
import { abgehakt } from "../../../app/lernstand";
import type { Ansicht } from "../../../app/stapel";
import { UEBUNGEN_JE_KAPITEL } from "../../../daten/uebungsliste-daten";
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Fortschritt, Lernstand } from "../../../speicher/format";
import type { Anteil } from "../../../speicher/fortschritt";
import {
  TRAINER_OHNE_RUNDE,
  trainerZuKapitel,
  type TrainerKennung,
} from "../../../training/trainer";
import type { Erfolgsstueck } from "../erfolge/erfolgsstuecke";
import { istVoll } from "../fortschritt/ringrechnung";

/** Was die Kapitelaufgaben brauchen. */
export interface Aufgabenquelle {
  readonly fortschritt: Fortschritt;
  readonly lernstand: Lernstand;
  /** Zahl der Lernziele je Kapitel (aus nachschlagen.json); fehlt ein Kapitel, gibt es keine. */
  readonly lernziele: ReadonlyMap<number, number>;
}

/** Eine Kapitelaufgabe als Stück des Infofensters. */
function aufgabe(
  art: "uebungen" | "lernziele" | "trainer",
  kapitel: number,
  anteil: Anteil,
  ziel: Ansicht,
  werte: Readonly<Record<string, string | number>> = {},
): Erfolgsstueck {
  const zeichen = { uebungen: ClipboardCheck, lernziele: ListChecks, trainer: Dumbbell }[art];
  return {
    art: "aufgabe",
    kennung: `${art}-${kapitel}`,
    name: t(`nebenaufgaben.name.${art}` as Textschluessel, { nummer: kapitel }),
    bedingung: t(`nebenaufgaben.bedingung.${art}` as Textschluessel, { nummer: kapitel, ...werte }),
    symbol: zeichen,
    anteil,
    verdient: istVoll(anteil),
    ring: null,
    ziel,
  };
}

/** Übungen des Kapitels; Ziel ist die erste offene Übung. Null ohne Übungen. */
function uebungsaufgabe(kapitel: number, fortschritt: Fortschritt): Erfolgsstueck | null {
  const ids = UEBUNGEN_JE_KAPITEL[kapitel] ?? [];
  if (ids.length === 0) return null;
  const offen = ids.filter((id) => fortschritt.uebungen[id]?.geloest !== true);
  const erste = offen[0];
  const ziel: Ansicht = erste
    ? { bildschirm: "uebung", kapitel, id: erste }
    : { bildschirm: "kapitel", nummer: kapitel };
  return aufgabe(
    "uebungen",
    kapitel,
    { erreicht: ids.length - offen.length, gesamt: ids.length },
    ziel,
  );
}

/** Lernziele des Kapitels (Checkliste). Null ohne Lernziele. */
function lernzielaufgabe(kapitel: number, quelle: Aufgabenquelle): Erfolgsstueck | null {
  const anzahl = quelle.lernziele.get(kapitel) ?? 0;
  if (anzahl === 0) return null;
  const erreicht = abgehakt(quelle.lernstand, kapitel, anzahl);
  return aufgabe("lernziele", kapitel, { erreicht, gesamt: anzahl }, { bildschirm: "checkliste" });
}

/** Die Trainer eines Kapitels mit Runde. Beispiel: Kapitel 1 → Röntgen und Zählen. */
export function trainerMitRunde(kapitel: number): TrainerKennung[] {
  return trainerZuKapitel(kapitel)
    .filter((tr) => tr.fertig && !TRAINER_OHNE_RUNDE.has(tr.kennung))
    .map((tr) => tr.kennung);
}

/** Trainer des Kapitels; Ziel ist der erste ohne Durchgang. Null ohne Trainer. */
function traineraufgabe(kapitel: number, fortschritt: Fortschritt): Erfolgsstueck | null {
  const trainer = trainerMitRunde(kapitel);
  if (trainer.length === 0) return null;
  const offen = trainer.filter((k) => (fortschritt.trainer[k]?.durchgaenge ?? 0) === 0);
  const erster = offen[0];
  const ziel: Ansicht = erster
    ? { bildschirm: "trainer", kennung: erster }
    : { bildschirm: "training" };
  const namen = trainer.map((k) => t(`trainer.${k}.name` as Textschluessel)).join(", ");
  const anteil = { erreicht: trainer.length - offen.length, gesamt: trainer.length };
  return aufgabe("trainer", kapitel, anteil, ziel, { trainer: namen });
}

/**
 * Die Kapitelaufgaben eines Kapitels in fester Reihenfolge (Übungen, Lernziele, Trainer); was ein
 * Kapitel nicht hat, fehlt. Beispiel: Kapitel 0 ohne Fortschritt → „Übungen Kapitel 0“ 0 von 3,
 * „Lernziele Kapitel 0“ 0 von 8, „Trainer Kapitel 0“ 0 von 1 (Koordinaten).
 */
export function kapitelaufgaben(kapitel: number, quelle: Aufgabenquelle): Erfolgsstueck[] {
  return [
    uebungsaufgabe(kapitel, quelle.fortschritt),
    lernzielaufgabe(kapitel, quelle),
    traineraufgabe(kapitel, quelle.fortschritt),
  ].filter((s): s is Erfolgsstueck => s !== null);
}
