/**
 * Wiederholungssystem mit fünf Kästen (Konzept 9.1).
 *
 * Rolle im Gesamtbild: Die Übungen des Buches, der Taktiktrainer, „Falle oder Köder“, der
 * Strukturerkenner und der Endspieltrainer teilen sich diese Karten. Eine
 * Karte wandert bei richtiger Antwort einen Kasten weiter, bei falscher zurück in Kasten 1; nur
 * mit Hilfe gelöst bleibt sie, wo sie ist. Der Bereich „Training“ zeigt, wie viele Karten fällig
 * sind. Reine Funktionen; gespeichert werden die Karten in den Nutzerdaten (speicher/format.ts,
 * Format 3).
 * Abhängigkeiten: keine.
 */

/** Wieder fällig nach so vielen Tagen, je Kasten 1 bis 5 (Konzept 9.1). */
export const TAGE_JE_KASTEN = [1, 3, 7, 16, 35] as const;
export const ERSTER_KASTEN = 1;
export const LETZTER_KASTEN = TAGE_JE_KASTEN.length;
const MS_JE_TAG = 24 * 60 * 60 * 1000;
/** So viele Einträge merkt sich eine Karte im Verlauf (genug für eine Statistik über Wochen). */
const VERLAUF_HOECHSTENS = 20;

/** Ergebnis einer Antwort: richtig, nur mit Hilfe gelöst oder falsch (Konzept 9.2 „antworte“). */
export type Antwortergebnis = "richtig" | "mitHilfe" | "falsch";

export interface Verlaufseintrag {
  readonly datum: string;
  readonly ergebnis: Antwortergebnis;
}

/** Eine Wiederholungskarte. Die Kennung sagt, woher sie stammt („uebung:ueb:droh-ignorieren“). */
export interface Karte {
  readonly kasten: number;
  /** Ab wann die Karte wieder fällig ist, ISO 8601. */
  readonly faellig: string;
  readonly verlauf: readonly Verlaufseintrag[];
}

export type Karten = Readonly<Record<string, Karte>>;

/** Kennung der Karte zu einer Übung des Buches. */
export function uebungskarte(uebungsId: string): string {
  return `uebung:${uebungsId}`;
}

/** Die Übung zu einer Kartenkennung, sonst null (Karten anderer Trainer). */
export function uebungAusKarte(kennung: string): string | null {
  return kennung.startsWith("uebung:") ? kennung.slice("uebung:".length) : null;
}

/**
 * Trainer, deren Aufgaben in die Wiederholung kommen (Empfehlung U9, umgesetzt in 0.2.47; seit
 * 0.2.90 auch Strukturerkenner und Endspieltrainer, Pflichtenheft 7): Ihre Aufgaben haben feste
 * Kennungen. Zähltrainer, Röntgen und Koordinaten erzeugen ihre Aufgaben zufällig; dort ergibt
 * eine Wiederholung keinen Sinn. Das Speicherformat bleibt gleich: Karten sind nach Kennung
 * abgelegt („struktur:…“, „endspiel:…“).
 */
export const WIEDERHOLTE_TRAINER = ["taktik", "falle", "struktur", "endspiel"] as const;
export type WiederholterTrainer = (typeof WIEDERHOLTE_TRAINER)[number];

/** Kennung der Karte zu einer Trainer-Aufgabe („taktik:taktik-b-7.6“). */
export function trainerkarte(trainer: WiederholterTrainer, aufgabe: string): string {
  return `${trainer}:${aufgabe}`;
}

/** Die Aufgaben eines Trainers aus Kartenkennungen, in derselben Reihenfolge. */
export function aufgabenAusKarten(
  kennungen: readonly string[],
  trainer: WiederholterTrainer,
): string[] {
  const vorsatz = `${trainer}:`;
  return kennungen.filter((k) => k.startsWith(vorsatz)).map((k) => k.slice(vorsatz.length));
}

function plusTage(jetzt: Date, tage: number): string {
  return new Date(jetzt.getTime() + tage * MS_JE_TAG).toISOString();
}

function tageFuer(kasten: number): number {
  return TAGE_JE_KASTEN[Math.min(Math.max(kasten, ERSTER_KASTEN), LETZTER_KASTEN) - 1] ?? 1;
}

/**
 * Neuer Stand einer Karte nach einer Antwort.
 *
 * Warum: Konzept 9.1. Eine neue Karte (alt null) beginnt in Kasten 1: richtig gelöst rückt sie
 * sofort in Kasten 2.
 * Eingaben: bisherige Karte oder null, Ergebnis, Zeitpunkt.
 * Ausgabe: Karte mit Kasten, nächster Fälligkeit (heute plus Tage des Kastens) und Verlauf.
 * Beispiel: neu, „richtig“ → Kasten 2, fällig in 3 Tagen; Kasten 4, „falsch“ → Kasten 1,
 * fällig morgen; Kasten 3, „mitHilfe“ → bleibt in Kasten 3, fällig in 7 Tagen.
 */
export function beantworte(alt: Karte | null, ergebnis: Antwortergebnis, jetzt: Date): Karte {
  const kasten = alt?.kasten ?? ERSTER_KASTEN;
  const neuerKasten =
    ergebnis === "richtig"
      ? Math.min(kasten + 1, LETZTER_KASTEN)
      : ergebnis === "falsch"
        ? ERSTER_KASTEN
        : kasten;
  const verlauf = [...(alt?.verlauf ?? []), { datum: jetzt.toISOString(), ergebnis }];
  return {
    kasten: neuerKasten,
    faellig: plusTage(jetzt, tageFuer(neuerKasten)),
    verlauf: verlauf.slice(-VERLAUF_HOECHSTENS),
  };
}

/**
 * Die fälligen Karten, die am längsten wartenden zuerst.
 *
 * Beispiel: Karte fällig gestern und Karte fällig nächste Woche → nur die erste.
 */
export function faellige(karten: Karten, jetzt: Date): string[] {
  const grenze = jetzt.getTime();
  return Object.entries(karten)
    .filter(([, karte]) => Date.parse(karte.faellig) <= grenze)
    .sort(([, a], [, b]) => Date.parse(a.faellig) - Date.parse(b.faellig))
    .map(([kennung]) => kennung);
}

/** Karten aus Rohdaten (Sicherung, IndexedDB): nur gültige Einträge, Unbekanntes fällt weg. */
export function kartenAus(roh: unknown): Karten {
  if (typeof roh !== "object" || roh === null || Array.isArray(roh)) return {};
  const ergebnis: Record<string, Karte> = {};
  for (const [kennung, wert] of Object.entries(roh as Record<string, unknown>)) {
    const karte = karteAus(wert);
    if (karte) ergebnis[kennung] = karte;
  }
  return ergebnis;
}

function karteAus(roh: unknown): Karte | null {
  if (typeof roh !== "object" || roh === null) return null;
  const { kasten, faellig, verlauf } = roh as Record<string, unknown>;
  if (typeof kasten !== "number" || !Number.isInteger(kasten)) return null;
  if (typeof faellig !== "string" || Number.isNaN(Date.parse(faellig))) return null;
  const eintraege = Array.isArray(verlauf) ? verlauf.filter(istVerlaufseintrag) : [];
  return {
    kasten: Math.min(Math.max(kasten, ERSTER_KASTEN), LETZTER_KASTEN),
    faellig,
    verlauf: eintraege,
  };
}

function istVerlaufseintrag(wert: unknown): wert is Verlaufseintrag {
  if (typeof wert !== "object" || wert === null) return false;
  const { datum, ergebnis } = wert as Record<string, unknown>;
  return (
    typeof datum === "string" &&
    (ergebnis === "richtig" || ergebnis === "mitHilfe" || ergebnis === "falsch")
  );
}
