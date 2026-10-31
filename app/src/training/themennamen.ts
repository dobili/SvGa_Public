/**
 * Name und Trainer zu einer Themenkennung des Antwortprotokolls (G1), etwa „taktik:fesselung“.
 *
 * Rolle im Gesamtbild: „Dein nächster Schritt“ (P1) nennt das schwächste Thema beim Namen und
 * öffnet den passenden Trainer. Die Kennung beginnt mit dem Präfix des Trainers (taktik, endspiel,
 * struktur, falle); der Trainer ergibt sich daher aus training/trainer.ts (TRAINER), ohne feste
 * Aufzählung. Für den Namen gibt es eine Liste von Mustern: Ein neuer Trainer mit eigenem Präfix
 * („zaehlen:batterie“) braucht nur einen Text unter `themen.name.<präfix>.<teil>` oder eine neue
 * Zeile in NAMENSMUSTER. Ohne Namen steht der Name des Trainers.
 * Abhängigkeiten: training/trainer.ts, i18n/sprache.ts (nur Schlüsselprüfung).
 */
import { istTextschluessel, type Textschluessel } from "../i18n/sprache";
import { TRAINER, type TrainerKennung } from "./trainer";

/** Ein Muster: Schlüsselvorschlag aus Präfix und Teil, oder null, wenn es nicht passt. */
type Namensmuster = (praefix: string, teil: string) => string | null;

/**
 * Wo der Name eines Themas stehen kann, in dieser Reihenfolge. Der erste vorhandene Schlüssel
 * gewinnt. Beispiel: „endspiel:opposition“ → endspiel.thema.opposition; „struktur:isolani“ →
 * struktur.art.isolani; „taktik:fesselung“ → zusatzaufgaben.thema.fesselung.
 */
export const NAMENSMUSTER: readonly Namensmuster[] = [
  (p, k) => `themen.name.${p}.${k}`,
  (p, k) => `${p}.thema.${k}`,
  (p, k) => `${p}.art.${k}`,
  (p, k) => (p === "taktik" ? `zusatzaufgaben.thema.${k}` : null),
  // P3: Motive des Taktiktrainers ohne Zusatzaufgabe (Überlastung, Rettung) und spätere Trainer.
  (p, k) => `${p}trainer.motiv.${k}`,
];

/** Präfix und Teil einer Kennung. Beispiel: „taktik:gabel“ → [„taktik“, „gabel“]; „falle“ → [„falle“, „“]. */
export function zerlegeThema(thema: string): readonly [string, string] {
  const trenner = thema.indexOf(":");
  return trenner < 0 ? [thema, ""] : [thema.slice(0, trenner), thema.slice(trenner + 1)];
}

/**
 * Der spielbare Trainer eines Themas, oder null.
 * Beispiel: „endspiel:opposition“ → „endspiel“; „kapitel:3“ → null (kein Trainer „kapitel“).
 */
export function trainerZumThema(thema: string): TrainerKennung | null {
  const [praefix] = zerlegeThema(thema);
  return TRAINER.find((tr) => tr.fertig && tr.kennung === praefix)?.kennung ?? null;
}

/**
 * Der Textschlüssel für den Namen eines Themas; sonst der Name des Trainers; sonst null.
 * Beispiel: „falle“ → trainer.falle.name („Falle oder Köder“).
 */
export function themennameSchluessel(thema: string): Textschluessel | null {
  const [praefix, teil] = zerlegeThema(thema);
  if (teil !== "") {
    for (const muster of NAMENSMUSTER) {
      const schluessel = muster(praefix, teil);
      if (schluessel !== null && istTextschluessel(schluessel)) return schluessel;
    }
  }
  const trainer = trainerZumThema(thema);
  return trainer ? `trainer.${trainer}.name` : null;
}
