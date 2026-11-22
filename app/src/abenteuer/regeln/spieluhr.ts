/**
 * Spieluhr des Abenteuers (Wunsch des Autors, 22.11.2026): Kinder sollen die Nacht erleben, ohne
 * nachts spielen zu müssen. Ein Spieltag dauert 2 echte Stunden, ungleichmäßig verteilt (der Tag
 * ist lang, Morgen und Abend kurz, die Nacht lang genug zum Staunen), und eine Wartefunktion stellt
 * die Uhr weiter.
 *
 * Gezählt wird in Spielminuten seit Spielbeginn (Feld `spieluhr` im Spielstand); ein neuer Stand
 * beginnt am ersten Morgen um 6 Uhr. Die Uhr läuft nur in freier Oberwelt (useSpieluhr.ts), nicht
 * in Dialogen, Partien, Läden, im Tagebuch und nicht, während die App zu ist. Die Geschichte geht
 * vor: Ink setzt die Uhr mit `#uhr:abend` oder `#uhr:22` (uhrNachAngabe).
 *
 * Schnittstelle für andere Teile (Statisten, Tagesabläufe der Figuren, Tönung, Musik):
 * stundeJetzt(stand), phase(stunde), spieltag(stand).
 * Rolle im Gesamtbild: reine Regeln ohne React und Phaser. Abhängigkeiten: schnittstelle/spielstand.ts.
 */
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/** Die vier Tagesphasen. */
export type Tagesphase = "morgen" | "tag" | "abend" | "nacht";

/** Phasen mit Beginn (Stunde) und Dauer in echten Minuten; zusammen ein Spieltag von 2 Stunden. */
export const PHASEN: readonly {
  readonly phase: Tagesphase;
  readonly von: number;
  readonly echteMinuten: number;
}[] = [
  { phase: "morgen", von: 6, echteMinuten: 15 },
  { phase: "tag", von: 9, echteMinuten: 50 },
  { phase: "abend", von: 18, echteMinuten: 15 },
  { phase: "nacht", von: 21, echteMinuten: 40 },
];

export const MINUTEN_JE_STUNDE = 60;
export const STUNDEN_JE_TAG = 24;
export const MINUTEN_JE_TAG = MINUTEN_JE_STUNDE * STUNDEN_JE_TAG;
const MS_JE_MINUTE = 60_000;
/** Ein neuer Spielstand beginnt am ersten Morgen um 6 Uhr. */
export const START_SPIELMINUTE = 6 * MINUTEN_JE_STUNDE;

/** Ziele zum Warten und für `#uhr:<name>` (Stunde des Tages). */
export const ZIELE: Readonly<Record<string, number>> = {
  morgen: 7,
  mittag: 12,
  tag: 12,
  abend: 19,
  nacht: 22,
};

/** Spielminute des Stands; ältere Stände ohne Uhr stehen am ersten Morgen. */
export function spielminuteJetzt(stand: Pick<Abenteuerstand, "spieluhr">): number {
  return stand.spieluhr ?? START_SPIELMINUTE;
}

/** Stunde (0 bis 23) zu einer Spielminute. Beispiel: 1500 (Tag 2, 1 Uhr) → 1. */
export function stundeAus(spielminute: number): number {
  const imTag = ((spielminute % MINUTEN_JE_TAG) + MINUTEN_JE_TAG) % MINUTEN_JE_TAG;
  return Math.floor(imTag / MINUTEN_JE_STUNDE);
}

/** Stunde (0 bis 23) der Spieluhr. Beispiel: neuer Stand → 6. */
export function stundeJetzt(stand: Pick<Abenteuerstand, "spieluhr">): number {
  return stundeAus(spielminuteJetzt(stand));
}

/** Spieltag (ab 1, wechselt um Mitternacht). Beispiel: neuer Stand → 1. */
export function spieltag(stand: Pick<Abenteuerstand, "spieluhr">): number {
  return Math.floor(spielminuteJetzt(stand) / MINUTEN_JE_TAG) + 1;
}

/** Phase zu einer Stunde. Beispiel: 7 → morgen, 12 → tag, 19 → abend, 2 → nacht. */
export function phase(stunde: number): Tagesphase {
  const s = ((stunde % STUNDEN_JE_TAG) + STUNDEN_JE_TAG) % STUNDEN_JE_TAG;
  let gefunden: Tagesphase = "nacht";
  for (const p of PHASEN) if (s >= p.von) gefunden = p.phase;
  return gefunden;
}

/** Länge einer Phase in Spielstunden. Beispiel: tag → 9, nacht → 9. */
function spielstunden(i: number): number {
  const von = PHASEN[i]?.von ?? 0;
  const bis = PHASEN[(i + 1) % PHASEN.length]?.von ?? 0;
  return (bis - von + STUNDEN_JE_TAG) % STUNDEN_JE_TAG;
}

/** Spielminuten je echter Millisekunde in der Phase zur Spielminute. */
function tempo(spielminute: number): number {
  const i = PHASEN.findIndex((p) => p.phase === phase(stundeAus(spielminute)));
  const echt = (PHASEN[i]?.echteMinuten ?? 1) * MS_JE_MINUTE;
  return (spielstunden(i) * MINUTEN_JE_STUNDE) / echt;
}

/** Nächste volle Stunde, an der eine Phase beginnt, nach der Spielminute (in Spielminuten). */
function naechsteGrenze(spielminute: number): number {
  const tagbeginn =
    spielminute - (((spielminute % MINUTEN_JE_TAG) + MINUTEN_JE_TAG) % MINUTEN_JE_TAG);
  const grenzen = PHASEN.flatMap((p) => [p.von, p.von + STUNDEN_JE_TAG]).map(
    (s) => tagbeginn + s * MINUTEN_JE_STUNDE,
  );
  return Math.min(...grenzen.filter((g) => g > spielminute));
}

/**
 * Rückt die Uhr um echte Millisekunden in freier Oberwelt vor, Phase für Phase im eigenen Tempo.
 * Beispiel: 6:00 und 15 echte Minuten → 9:00; 9:00 und 50 echte Minuten → 18:00.
 */
export function rueckeVor(spielminute: number, echteMs: number): number {
  let minute = spielminute;
  let rest = echteMs;
  while (rest > 0) {
    const grenze = naechsteGrenze(minute);
    const t = tempo(minute);
    const bisGrenze = (grenze - minute) / t;
    if (rest < bisGrenze) return minute + rest * t;
    minute = grenze;
    rest -= bisGrenze;
  }
  return minute;
}

/**
 * Die nächste Spielminute nach `spielminute`, zu der es `stunde` Uhr ist (nie zurück).
 * Beispiel: Tag 1, 14 Uhr, Ziel 22 → Tag 1, 22 Uhr; Tag 1, 23 Uhr, Ziel 7 → Tag 2, 7 Uhr.
 */
export function naechsteStunde(spielminute: number, stunde: number): number {
  const tagbeginn =
    spielminute - (((spielminute % MINUTEN_JE_TAG) + MINUTEN_JE_TAG) % MINUTEN_JE_TAG);
  const heute = tagbeginn + stunde * MINUTEN_JE_STUNDE;
  return heute > spielminute ? heute : heute + MINUTEN_JE_TAG;
}

/**
 * Die Uhr nach einer Angabe aus Ink (`#uhr:abend`, `#uhr:22`): die nächste solche Zeit, oder die
 * Uhr unverändert, wenn sie schon in derselben Stunde (Zahl) oder Phase (Name) steht.
 * Ausgabe: null bei unbekannter Angabe.
 * Beispiel: 14 Uhr, „abend“ → 19 Uhr desselben Tages; 19:30, „abend“ → bleibt; „22“ um 22:10 → bleibt.
 */
export function uhrNachAngabe(spielminute: number, angabe: string): number | null {
  const text = angabe.trim().toLowerCase();
  const zahl = /^\d{1,2}$/.test(text) ? Number(text) : null;
  if (zahl !== null && zahl < STUNDEN_JE_TAG) {
    return stundeAus(spielminute) === zahl ? spielminute : naechsteStunde(spielminute, zahl);
  }
  const ziel = ZIELE[text];
  if (ziel === undefined) return null;
  const gleichePhase = phase(stundeAus(spielminute)) === phase(ziel);
  return gleichePhase ? spielminute : naechsteStunde(spielminute, ziel);
}
