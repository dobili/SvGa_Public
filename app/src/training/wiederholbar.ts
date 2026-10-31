/**
 * Feste Kennungen für Aufgaben, die die Trainer an den Buchstellungen erzeugen, und das
 * Zurückholen der Aufgaben aus diesen Kennungen für die Wiederholung (Punkt B4 des Nebenchats).
 *
 * Rolle im Gesamtbild: Bisher kamen falsch gelöste Aufgaben nur aus Taktik, Falle, Struktur und
 * Endspiel wieder, weil nur deren Aufgaben feste Kennungen hatten. Zählen, Röntgen und LAP erzeugen
 * ihre Aufgaben aus Buchstellungen; dieselbe Stellung ergibt aber immer dieselbe Aufgabe (bis auf
 * das gewählte Feld beim Zählen, das in der Kennung steht). Die Karten liegen im bestehenden Format
 * unter „zaehlen:…“, „roentgen:…“, „planbilanz:…“ (training/wiederholung.ts).
 * Nicht dabei ist der Abweichungsmodus: Die Engine wählt die Abweichung jedes Mal neu, eine
 * Wiederholung wäre eine andere Aufgabe (Entscheidung des Nebenchats, zur Durchsicht).
 * Abhängigkeiten: training/zaehltrainer.ts, roentgentrainer.ts, roentgenstufen.ts,
 * planbilanztrainer.ts, buchstellungen.ts.
 */
import type { Buchstellung } from "./buchstellungen";
import { lapaufgabe, type Lapaufgabe } from "./planbilanztrainer";
import { roentgenaufgabe, type Roentgenaufgabe } from "./roentgentrainer";
import {
  haengendeFiguren,
  zaehlfelder,
  type Haengeaufgabe,
  type Zaehlaufgabe,
} from "./zaehltrainer";

/** „bilanz-1.26-d4“: Abbildung und Feld. */
export const bilanzkennung = (a: Pick<Zaehlaufgabe, "nummer" | "feld">) => `bilanz-${a.nummer}-${a.feld}`;
/** „haengen-4.2“: die Abbildung. */
export const haengekennung = (a: Pick<Haengeaufgabe, "nummer">) => `haengen-${a.nummer}`;
/** „lap-6.20“: die Abbildung. */
export const lapkennung = (a: Pick<Lapaufgabe, "nummer">) => `lap-${a.nummer}`;

/** „roentgen-1.12“ oder bei Zugfolgen „roentgen-k02-a1-12b“ (Zug und Seite am Zug). */
export function roentgenkennung(a: Roentgenaufgabe): string {
  const zusatz = a.zugfolge ? `-${a.zugfolge.zug}${a.eigen === "white" ? "w" : "b"}` : "";
  return `roentgen-${a.nummer}${zusatz}`;
}

/** Die Zähl- und Hängeaufgaben zu Kennungen, in der Reihenfolge der Kennungen. */
export function zaehlaufgabenAus(
  stellungen: readonly Buchstellung[],
  kennungen: readonly string[],
): (Zaehlaufgabe | Haengeaufgabe)[] {
  const gesucht = new Set(kennungen);
  const gefunden = new Map<string, Zaehlaufgabe | Haengeaufgabe>();
  for (const buch of stellungen) {
    if (!kennungen.some((k) => k.includes(`-${buch.nummer}`))) continue;
    for (const a of zaehlfelder(buch)) if (gesucht.has(bilanzkennung(a))) gefunden.set(bilanzkennung(a), a);
    const haengend = haengendeFiguren(buch.stellung);
    const h = haengend ? { nummer: buch.nummer, fen: buch.stellung.fen, haengend } : null;
    if (h && gesucht.has(haengekennung(h))) gefunden.set(haengekennung(h), h);
  }
  return kennungen.flatMap((k) => gefunden.get(k) ?? []);
}

/** Die Röntgen-Aufgaben zu Kennungen (Abbildungen und Zugfolgen). */
export function roentgenaufgabenAus(
  stellungen: readonly Buchstellung[],
  kennungen: readonly string[],
): Roentgenaufgabe[] {
  const gesucht = new Set(kennungen);
  const gefunden = new Map<string, Roentgenaufgabe>();
  for (const buch of stellungen) {
    if (!kennungen.some((k) => k.startsWith(`roentgen-${buch.nummer}`))) continue;
    const a = roentgenaufgabe(buch);
    if (a && gesucht.has(roentgenkennung(a))) gefunden.set(roentgenkennung(a), a);
  }
  return kennungen.flatMap((k) => gefunden.get(k) ?? []);
}

/** Die LAP-Aufgaben zu Kennungen. */
export function lapaufgabenAus(
  stellungen: readonly Buchstellung[],
  kennungen: readonly string[],
): Lapaufgabe[] {
  const gesucht = new Set(kennungen);
  const gefunden = new Map<string, Lapaufgabe>();
  for (const buch of stellungen) {
    if (!gesucht.has(`lap-${buch.nummer}`)) continue;
    const a = lapaufgabe(buch);
    if (a) gefunden.set(lapkennung(a), a);
  }
  return kennungen.flatMap((k) => gefunden.get(k) ?? []);
}

/** Ist es eine Hängeaufgabe (statt einer Bilanzaufgabe)? */
export function istHaengeaufgabe(a: Zaehlaufgabe | Haengeaufgabe): a is Haengeaufgabe {
  return "haengend" in a;
}
