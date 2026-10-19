/**
 * Fehlerdatenbank (Kapitel 12): eigene Fehler mit Stellung, einem Satz und einer Fehlerart aus der
 * Gesamt-Checkliste, ausgewertet je Fehlerart über die Wochen, mit Vorschlag für den Trainer.
 *
 * Rolle im Gesamtbild: Trainer „fehlerdatenbank“ (Pflichtenheft 5.3, Konzept 4.7 und 9, AP 13).
 * Die Einträge liegen in den Nutzerdaten (speicher/format.ts, Feld „fehler“ ab Format 4). Die
 * Fehlerarten sind die Zeilen der Gesamt-Checkliste (Kapitel 12, nachschlagen.json): je Kapitel
 * eine Fehlerart, gespeichert wird die Kapitelnummer, damit Texte sich ändern dürfen.
 * Der Vorschlag nimmt die häufigste Fehlerart der letzten vier Wochen und einen fertigen Trainer
 * zu ihrem Kapitel. Reine Funktionen.
 * Abhängigkeiten: training/trainer.ts (Trainer je Kapitel).
 * Buchbezug: Kapitel 12, Gesamt-Checkliste (Spalte „Fehlerart“) und Partieanalyse.
 */
import { TRAINER, type TrainerKennung } from "./trainer";

/** Ein Fehler des Lesers. */
export interface Fehlereintrag {
  readonly id: string;
  /** Wann eingetragen, ISO 8601. */
  readonly datum: string;
  /** Stellung vor dem Fehler (FEN). */
  readonly fen: string;
  /** Ein Satz des Lesers: Was war falsch, was hätte er prüfen müssen? */
  readonly satz: string;
  /** Kapitel der Gesamt-Checkliste, dessen Fehlerart passt (0 bis 12). */
  readonly fehlerart: number;
  /** Der gespielte Zug (Kurznotation, englisch), wenn er aus einer Partie kommt. */
  readonly zug?: string;
}

/** Höchstens so viele Einträge; ältere fallen weg, damit der Speicher klein bleibt. */
export const HOECHSTENS_EINTRAEGE = 500;
/** Längster Satz in Zeichen. */
export const SATZ_HOECHSTENS = 300;
const LETZTES_KAPITEL = 12;
const TAG_MS = 86_400_000;
const WOCHE_TAGE = 7;
/** So viele Wochen zeigt die Auswertung. */
export const WOCHEN = 8;
/** Der Vorschlag schaut auf die letzten vier Wochen. */
const VORSCHLAG_WOCHEN = 4;

type Roh = Record<string, unknown>;
const istObjekt = (w: unknown): w is Roh =>
  typeof w === "object" && w !== null && !Array.isArray(w);

/** Ein Eintrag aus Rohdaten, oder null, wenn etwas Wesentliches fehlt. */
function eintragAus(roh: unknown): Fehlereintrag | null {
  if (!istObjekt(roh)) return null;
  const { id, datum, fen, satz, fehlerart, zug } = roh;
  if (typeof id !== "string" || typeof datum !== "string" || typeof fen !== "string") return null;
  if (typeof fehlerart !== "number" || !Number.isInteger(fehlerart)) return null;
  if (fehlerart < 0 || fehlerart > LETZTES_KAPITEL) return null;
  return {
    id,
    datum,
    fen,
    satz: typeof satz === "string" ? satz.slice(0, SATZ_HOECHSTENS) : "",
    fehlerart,
    ...(typeof zug === "string" ? { zug } : {}),
  };
}

/**
 * Die Fehlerdatenbank aus Rohdaten (Speicher oder Sicherung); Unlesbares fällt weg.
 * Beispiel: undefined (Format 3 und älter) → [].
 */
export function fehlerAus(roh: unknown): Fehlereintrag[] {
  if (!Array.isArray(roh)) return [];
  return roh.flatMap((r) => eintragAus(r) ?? []).slice(-HOECHSTENS_EINTRAEGE);
}

/**
 * Hängt einen Eintrag an; der älteste fällt weg, wenn die Liste voll ist.
 * Beispiel: [] + Eintrag → [Eintrag].
 */
export function mitEintrag(
  liste: readonly Fehlereintrag[],
  eintrag: Fehlereintrag,
): Fehlereintrag[] {
  return [...liste, eintrag].slice(-HOECHSTENS_EINTRAEGE);
}

/** Entfernt einen Eintrag. */
export function ohneEintrag(liste: readonly Fehlereintrag[], id: string): Fehlereintrag[] {
  return liste.filter((e) => e.id !== id);
}

/** Je Fehlerart: Einträge gesamt und je Woche (Index 0 = diese Woche). */
export interface Fehlerartzahl {
  readonly fehlerart: number;
  readonly gesamt: number;
  readonly jeWoche: readonly number[];
}

/** Wie viele ganze Wochen liegt das Datum zurück (0 = in den letzten sieben Tagen)? */
function wochenZurueck(datum: string, jetzt: Date): number {
  const ms = jetzt.getTime() - new Date(datum).getTime();
  return Math.max(0, Math.floor(ms / (TAG_MS * WOCHE_TAGE)));
}

/**
 * Auswertung je Fehlerart über die Wochen, häufigste zuerst.
 *
 * Warum: Kapitel 12 lässt Fehler nach Art sammeln, damit sich zeigt, was immer wiederkehrt.
 * Beispiel: drei Einträge „Schach oder Schlag übersehen“ diese Woche, einer vor drei Wochen →
 * {fehlerart: 1, gesamt: 4, jeWoche: [3, 0, 0, 1, 0, 0, 0, 0]}.
 */
export function auswertung(liste: readonly Fehlereintrag[], jetzt: Date): Fehlerartzahl[] {
  const zahlen = new Map<number, { gesamt: number; jeWoche: number[] }>();
  for (const e of liste) {
    const z = zahlen.get(e.fehlerart) ?? { gesamt: 0, jeWoche: Array<number>(WOCHEN).fill(0) };
    z.gesamt += 1;
    const woche = wochenZurueck(e.datum, jetzt);
    if (woche < WOCHEN) z.jeWoche[woche] = (z.jeWoche[woche] ?? 0) + 1;
    zahlen.set(e.fehlerart, z);
  }
  return [...zahlen.entries()]
    .map(([fehlerart, z]) => ({ fehlerart, gesamt: z.gesamt, jeWoche: z.jeWoche }))
    .sort((a, b) => b.gesamt - a.gesamt || a.fehlerart - b.fehlerart);
}

/**
 * Der Trainer für die häufigste Fehlerart der letzten vier Wochen, oder null.
 *
 * Beispiel: meist „Schach oder Schlag übersehen“ (Kapitel 1) → „roentgen“, der erste fertige
 * Trainer zu Kapitel 1. Sonderfall: Kapitel ohne fertigen Trainer (etwa 11) → null.
 */
export function vorschlag(
  zahlen: readonly Fehlerartzahl[],
): { fehlerart: number; trainer: TrainerKennung } | null {
  const juengst = (z: Fehlerartzahl) =>
    z.jeWoche.slice(0, VORSCHLAG_WOCHEN).reduce((a, b) => a + b, 0);
  const sortiert = [...zahlen]
    .filter((z) => juengst(z) > 0)
    .sort((a, b) => juengst(b) - juengst(a));
  for (const z of sortiert) {
    const trainer = TRAINER.find(
      (tr) => tr.fertig && tr.kennung !== "fehlerdatenbank" && tr.kapitel.includes(z.fehlerart),
    );
    if (trainer) return { fehlerart: z.fehlerart, trainer: trainer.kennung };
  }
  return null;
}
