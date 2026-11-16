/**
 * Geräusche als Text (Barrierefreiheit, Auftrag „Zugänglichkeit“, 16.11.2026): Ist die Einstellung
 * an, zeigt eine kleine Zeile unten für ein paar Sekunden, was zu hören ist, etwa „[Tür knarrt]“
 * oder „[Musik: ruhig]“. Musik erscheint nur beim Wechsel, Dauergeräusche beim Betreten einer
 * Karte, einmalige Geräusche, wenn sie klingen (Regeln in ton/tonregie.ts).
 *
 * Rolle im Gesamtbild: Diese Datei hält nur, was gerade angezeigt wird, und rechnet die
 * Textschlüssel aus; die Texte selbst stehen in den Spieltexten (inhalte/abenteuer/texte/de.json,
 * `untertitel.musik.*` und `untertitel.klang.*`) und liest ton/Untertitelzeile.tsx. So zieht die
 * Tonregie, die schon mit der App geladen wird, die großen Spieltexte nicht in den Kern der App.
 * Abhängigkeiten: ton/tonplan.ts (Dateinamen), ton/tonangaben.ts (Stamm).
 */
import { stammVon } from "./tonangaben";
import { dateienFuer } from "./tonplan";

/** Musik („[Musik: …]“) oder Geräusch („[…]“), einmalig wie dauerhaft. */
export type Untertitelart = "musik" | "klang";

/** Eine angezeigte Zeile: was klingt und eine laufende Nummer für React. */
export interface Untertitel {
  readonly nummer: number;
  readonly art: Untertitelart;
  readonly angabe: string;
}

/** So lange steht eine Zeile (Millisekunden). */
export const UNTERTITEL_DAUER_MS = 4000;
/** Höchstens so viele Zeilen zugleich; die älteste weicht. */
export const UNTERTITEL_HOECHSTENS = 2;

/**
 * Die Textschlüssel zu einer Angabe, vom genauesten zum allgemeinsten. Der Name folgt der Datei
 * (ton/tonplan.ts `dateienFuer`), Bindestriche und Unterstriche werden zu Binnenmajuskeln (die
 * Schlüssel der Spieltexte erlauben nur Buchstaben und Ziffern), eine Variante „-2“ fällt weg.
 * Danach: ohne Ziffern am Ende (nur ohne Punkt), dann ohne den letzten Teil nach einem Punkt.
 * Beispiele: („klang“, „klang/uhr_ticken.m4a“) → [untertitel.klang.uhrTicken];
 * („musik“, „riverton.pavillon“) → [untertitel.musik.riverton.pavillon, untertitel.musik.riverton];
 * („klang“, „blindschach.e4“) → [untertitel.klang.blindschach.e4, untertitel.klang.blindschach].
 */
export function untertitelschluessel(art: Untertitelart, angabe: string): string[] {
  const datei = dateienFuer(art, angabe)[0] ?? angabe;
  const stamm = stammVon(datei).replace(/-\d+$/, "");
  const name = stamm.replace(/[-_]+([a-zA-Z0-9])/g, (_, b: string) => b.toUpperCase());
  // Ziffern am Ende fallen nur bei Namen ohne Punkt weg („turmuhr12“, nicht „blindschach.e4“).
  const namen = [name, name.includes(".") ? name : name.replace(/\d+$/, "")];
  for (let teil = name; teil.includes(".");) {
    teil = teil.slice(0, teil.lastIndexOf("."));
    namen.push(teil);
  }
  return [...new Set(namen.filter((n) => n !== ""))].map((n) => `untertitel.${art}.${n}`);
}

let zeilen: readonly Untertitel[] = [];
let zaehler = 0;
const beobachter = new Set<() => void>();

function setze(neu: readonly Untertitel[]): void {
  zeilen = neu;
  for (const b of beobachter) b();
}

/**
 * Zeigt eine Zeile für `UNTERTITEL_DAUER_MS`. Steht dieselbe schon da, beginnt ihre Zeit neu
 * (sie rückt ans Ende), statt doppelt zu erscheinen.
 */
export function meldeUntertitel(art: Untertitelart, angabe: string): void {
  const nummer = ++zaehler;
  const ohne = zeilen.filter((z) => z.art !== art || z.angabe !== angabe);
  setze([...ohne, { nummer, art, angabe }].slice(-UNTERTITEL_HOECHSTENS));
  setTimeout(() => setze(zeilen.filter((z) => z.nummer !== nummer)), UNTERTITEL_DAUER_MS);
}

/** Die angezeigten Zeilen (für useSyncExternalStore). */
export function aktuelleUntertitel(): readonly Untertitel[] {
  return zeilen;
}

/** Meldet Änderungen; Ausgabe: Abmelden. */
export function beiUntertitel(b: () => void): () => void {
  beobachter.add(b);
  return () => beobachter.delete(b);
}

/** Alle Zeilen weg (Abenteuer verlassen, Einstellung aus). */
export function leereUntertitel(): void {
  if (zeilen.length > 0) setze([]);
}
