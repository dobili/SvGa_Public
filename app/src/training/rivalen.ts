/**
 * Wahl des Rivalen unter den Bots (Gamifizierung P8, Entscheidung E6).
 *
 * Rolle im Gesamtbild: Ein Rivale ist ein Bot, der etwas stärker ist als der Leser und den er
 * noch nie gewertet besiegt hat: ein Gegenüber mit kleiner Geschichte, ohne andere Menschen.
 * Mit Wertung: Stärke 50 bis 150 Punkte über der eigenen Wertung (in der Zeitklasse der letzten
 * gewerteten Partie); bei mehreren der mit den meisten Partien gegen den Leser, dann der mit der
 * Stärke am nächsten an +100. Ohne Wertung: ein Bot der niedrigsten Stufe, in der noch einer
 * unbesiegt ist. Spaß-Bots, Gruppen und eigene Gegner sind keine Rivalen (sie haben keine feste
 * gemessene Zahl oder sind zum Lachen da). Alle Funktionen sind rein; die Bots und ihre Zahl
 * kommen als Eingabe, damit Tests sie festlegen können.
 * Abhängigkeiten: engine/gegner.ts, engine/botstaerke.ts, speicher/besiegt.ts,
 * spiel/wertung.ts, training/duelle.ts, speicher/format.ts (Typ).
 */
import { staerkeDesBots } from "../engine/botstaerke";
import { gegnerDerStufe, gegnerVon, type Gegner } from "../engine/gegner";
import { STUFEN } from "../engine/stufen";
import type { Wertungstempo } from "../spiel/elomodell-daten";
import { aktuelleWertung, tempoDesPunkts, verlaufDerZeitklasse } from "../spiel/wertung";
import { irgendwoBesiegt } from "../speicher/besiegt";
import type { Nutzerdaten } from "../speicher/format";
import { partienImDuell } from "./duelle";

/** Abstand der Stärke des Rivalen zur eigenen Wertung (Vorrecherche P8). */
export const RIVALENABSTAND = { mindestens: 50, hoechstens: 150, ziel: 100 } as const;

/** Vorsilbe in `verdient` für einen besiegten Rivalen: „rivale:<botkennung>“ mit Datum. */
export const RIVALE_VERDIENT = "rivale:";

/** Was die Wahl braucht: Bots je Stufe (schwächste Stufe zuerst) und die Zahl eines Bots. */
export interface Rivalenquelle {
  readonly stufen: readonly (readonly Gegner[])[];
  readonly staerke: (kennung: string, tempo: Wertungstempo) => number | null;
}

/** Die echten Bots der App: Stufe 1 bis 10 ohne Spaß-Bots, Zahl aus der Messung (Anzeigesatz). */
export function botsDerApp(): Rivalenquelle {
  return {
    stufen: STUFEN.map((s) => gegnerDerStufe(s.nummer)),
    staerke: (kennung, tempo) => staerkeDesBots(kennung, tempo),
  };
}

/** Eigene Wertung und Zeitklasse: die der letzten gewerteten Partie; ohne Wertung null. */
export function eigeneWertung(daten: Nutzerdaten): { wert: number; tempo: Wertungstempo } | null {
  const letzter = daten.spiel.wertung.at(-1);
  if (!letzter) return null;
  const tempo = tempoDesPunkts(letzter);
  const wert = aktuelleWertung(verlaufDerZeitklasse(daten.spiel.wertung, tempo));
  return wert === null ? null : { wert, tempo };
}

/** Kann dieser Bot noch Rivale werden? Nicht gewertet besiegt und nicht ausgenommen. */
function offen(daten: Nutzerdaten, ohne: readonly string[]) {
  return (g: Gegner) =>
    !irgendwoBesiegt(daten.spiel.besiegt, g.kennung) && !ohne.includes(g.kennung);
}

/** Mehr Partien gegen den Leser zuerst (Vorrecherche P8: „bei Gleichstand“). */
function nachPartien(daten: Nutzerdaten) {
  return (a: Gegner, b: Gegner) =>
    partienImDuell(daten.duelle[b.kennung]) - partienImDuell(daten.duelle[a.kennung]);
}

/** Ohne Wertung: die niedrigste Stufe mit einem offenen Bot, darin der mit den meisten Partien. */
function ohneWertung(daten: Nutzerdaten, quelle: Rivalenquelle, ohne: readonly string[]) {
  for (const stufe of quelle.stufen) {
    const kandidaten = stufe.filter(offen(daten, ohne));
    // sort ist stabil: Bei gleich vielen Partien bleibt der schwächere Bot der Stufe vorn.
    if (kandidaten.length > 0) return [...kandidaten].sort(nachPartien(daten))[0] ?? null;
  }
  return null;
}

/**
 * Mit Wertung: im Abstand 50 bis 150 der mit den meisten Partien, dann am nächsten an +100.
 * Liegt keiner im Abstand, der offene Bot am nächsten an +100 (lieber etwas zu stark oder
 * schwach als gar kein Rivale).
 */
function mitWertung(
  daten: Nutzerdaten,
  quelle: Rivalenquelle,
  ohne: readonly string[],
  wertung: { wert: number; tempo: Wertungstempo },
) {
  const mitZahl = quelle.stufen
    .flat()
    .filter(offen(daten, ohne))
    .map((g) => ({ g, abstand: (quelle.staerke(g.kennung, wertung.tempo) ?? NaN) - wertung.wert }))
    .filter((k) => Number.isFinite(k.abstand));
  const naeher = (a: { abstand: number }, b: { abstand: number }) =>
    Math.abs(a.abstand - RIVALENABSTAND.ziel) - Math.abs(b.abstand - RIVALENABSTAND.ziel);
  const imAbstand = mitZahl.filter(
    (k) => k.abstand >= RIVALENABSTAND.mindestens && k.abstand <= RIVALENABSTAND.hoechstens,
  );
  const reihe = imAbstand.length > 0 ? imAbstand : mitZahl;
  const partien = nachPartien(daten);
  return [...reihe].sort((a, b) => partien(a.g, b.g) || naeher(a, b))[0]?.g ?? null;
}

/**
 * Wählt einen neuen Rivalen (rein).
 *
 * Eingaben: Nutzerdaten, ausgenommene Bots (etwa der bisherige Rivale beim Wechsel), Quelle der
 * Bots. Ausgabe: der Bot oder null, wenn alle schon besiegt sind.
 * Beispiel: Wertung 1200 in Schnellschach, Bots mit 1180, 1290 und 1400 → der mit 1290.
 * Sonderfall: ohne Wertung → der erste offene Bot der Stufe 1 (oder der nächsten Stufe).
 */
export function waehleRivale(
  daten: Nutzerdaten,
  ohne: readonly string[] = [],
  quelle: Rivalenquelle = botsDerApp(),
): Gegner | null {
  const wertung = eigeneWertung(daten);
  return wertung
    ? mitWertung(daten, quelle, ohne, wertung)
    : ohneWertung(daten, quelle, ohne);
}

/**
 * Der Rivale, der jetzt gilt: der gespeicherte, solange es ihn gibt und er nicht gewertet besiegt
 * ist; sonst ein neu gewählter (noch nicht gespeichert). Beispiel: gespeichert „lotte“, noch
 * nicht besiegt → Lotte.
 */
export function aktuellerRivale(
  daten: Nutzerdaten,
  quelle: Rivalenquelle = botsDerApp(),
): Gegner | null {
  const gespeichert = gegnerVon(daten.rivale?.kennung ?? null);
  if (gespeichert && !irgendwoBesiegt(daten.spiel.besiegt, gespeichert.kennung)) return gespeichert;
  return waehleRivale(daten, [], quelle);
}

/** Die besiegten Rivalen (Kennungen) in der Reihenfolge ihres Sieges. */
export function besiegteRivalen(daten: Nutzerdaten): string[] {
  return Object.entries(daten.verdient)
    .filter(([schluessel]) => schluessel.startsWith(RIVALE_VERDIENT))
    .sort(([, a], [, b]) => a.localeCompare(b))
    .map(([schluessel]) => schluessel.slice(RIVALE_VERDIENT.length));
}

/** Speichert einen Rivalen ab jetzt (rein). Beispiel: mitRivale(d, "lotte", jetzt). */
export function mitRivale(daten: Nutzerdaten, kennung: string, jetzt: Date): Nutzerdaten {
  return { ...daten, rivale: { kennung, seit: jetzt.toISOString() } };
}
