/**
 * Rekordtafel (Gamifizierung P5): Rekorde prüfen und schreiben, nur echte Verbesserungen zählen.
 *
 * Rolle im Gesamtbild: Wettbewerb mit sich selbst statt Bestenliste (Vorrecherche
 * docs/nebenchat/gamifizierung.md, P5). Welche Rekorde es gibt, steht als Liste in
 * training/rekordarten.ts; ein späterer Trainer trägt dort eine Zeile ein und meldet seinen Wert mit
 * pruefeRekorde(daten, { quelle: "<seine Quelle>", wert }, jetzt). Gespeichert wird im Feld
 * „rekorde“ (Wert und Datum der letzten Verbesserung), das erste Datum zusätzlich in „verdient“
 * als „rekord:<kennung>“ (speicher/verdient.ts). Reine Funktionen.
 * Abhängigkeiten: speicher/format.ts (Typen), speicher/verdient.ts, app/stapel.ts (Typ Ansicht).
 */
import type { Ansicht } from "../app/stapel";
import type { Nutzerdaten } from "../speicher/format";
import { mitVerdient } from "../speicher/verdient";

/**
 * Anlass einer Prüfung: eine Quelle und, wenn die Quelle den Wert selbst kennt, der Wert.
 * Beispiele: { quelle: "zeitrunde", wert: 14 } nach der Zeitrunde; { quelle: "runde" } am Ende
 * jeder Trainerrunde; { quelle: "partie" } nach dem Partieende.
 */
export interface Rekordanlass {
  readonly quelle: string;
  readonly wert?: number;
}

/** Quelle, die alle Rekordarten mit Wert aus den Nutzerdaten prüft (Rekordtafel beim Öffnen). */
export const ALLE_QUELLEN = "alle";

/** Eine Art von Rekord. Größer ist immer besser. */
export interface Rekordart {
  /** Schlüssel im Feld „rekorde“ und der Texte „rekorde.art.<k>“ und „rekorde.wert.<k>“. */
  readonly kennung: string;
  /** Anlässe, bei denen der Rekord geprüft wird (etwa „runde“, „partie“, „zeitrunde“). */
  readonly quellen: readonly string[];
  /** Wert aus den Nutzerdaten; fehlt er, bringt der Anlass den Wert mit. */
  readonly ausDaten?: (daten: Nutzerdaten) => number | null;
  /** Wohin der Knopf „Versuchen“ führt; null ohne Knopf. */
  readonly versuchen: Ansicht | null;
}

/** Ein neuer Rekord: vorher null, wenn es noch keinen Wert gab. */
export interface Verbesserung {
  readonly kennung: string;
  readonly wert: number;
  readonly vorher: number | null;
}

/**
 * Der Wert einer Rekordart bei diesem Anlass, oder null, wenn sie nicht geprüft wird.
 * Beispiel: Art „taktikZeit“ (Quelle „zeitrunde“), Anlass { quelle: "zeitrunde", wert: 14 } → 14.
 * Sonderfall: Anlass „alle“ prüft nur Arten mit Wert aus den Nutzerdaten.
 */
export function rekordwert(
  art: Rekordart,
  daten: Nutzerdaten,
  anlass: Rekordanlass,
): number | null {
  const alle = anlass.quelle === ALLE_QUELLEN;
  if (!alle && !art.quellen.includes(anlass.quelle)) return null;
  if (art.ausDaten) return art.ausDaten(daten);
  return alle ? null : (anlass.wert ?? null);
}

/**
 * Prüft die Rekordarten und schreibt jede echte Verbesserung mit Datum.
 *
 * Warum: Nur ein größerer Wert ist ein Rekord (gleich viel ist keiner); 0 ist nie ein Rekord.
 * Eingaben: Daten, Anlass, Zeitpunkt, Liste der Arten. Ausgabe: neue Daten (dieselben, wenn nichts
 * neu ist; der Speicher schreibt dann nichts) und die Verbesserungen in der Reihenfolge der Liste.
 * Beispiel: Rekord taktikZeit 11, Zeitrunde mit 14 → Rekord 14 heute, Verbesserung { 14, vorher 11 }.
 */
export function pruefeRekorde(
  daten: Nutzerdaten,
  anlass: Rekordanlass,
  jetzt: Date,
  arten: readonly Rekordart[],
): { readonly daten: Nutzerdaten; readonly neue: readonly Verbesserung[] } {
  const neue: Verbesserung[] = [];
  for (const art of arten) {
    const wert = rekordwert(art, daten, anlass);
    const vorher = daten.rekorde[art.kennung]?.wert ?? null;
    if (wert === null || !Number.isFinite(wert) || wert <= (vorher ?? 0)) continue;
    neue.push({ kennung: art.kennung, wert, vorher });
  }
  if (neue.length === 0) return { daten, neue };
  const datum = jetzt.toISOString();
  const rekorde = { ...daten.rekorde };
  for (const { kennung, wert } of neue) rekorde[kennung] = { wert, datum };
  const schluessel = neue.map((v) => `rekord:${v.kennung}`);
  return { daten: mitVerdient({ ...daten, rekorde }, schluessel, jetzt), neue };
}
