/**
 * Notstand: der letzte Stand eines Tabs, dessen Speichern beim Verlassen der Seite noch lief.
 *
 * Rolle im Gesamtbild: Ergänzt speicher/speicher.ts. Jedes Speichern ist ein Schreibvorgang in
 * IndexedDB, der einige Millisekunden braucht. Wird die Seite in dieser Zeit neu geladen oder
 * geschlossen, verwirft der Browser den unfertigen Vorgang (gemessen in Chromium, 17.11.2026:
 * Zug in einer Variante, sofort danach Neuladen, der Zug fehlt). Deshalb schreibt der Speicher
 * beim Verlassen (pagehide), solange ein Schreibvorgang aussteht, den Stand zusätzlich
 * synchron in den Gerätespeicher (localStorage). Beim nächsten Laden gilt dieser Notstand nur,
 * wenn IndexedDB noch einen Stand hält, den der Tab selbst kannte und schon überholt hatte
 * (Prüfsummen „bekannt“). Hat inzwischen ein anderer Tab geschrieben oder ist das Speichern doch
 * fertig geworden, bleibt IndexedDB maßgeblich und der Notstand wird verworfen.
 * Abhängigkeiten: app/merker.ts.
 */
import { entferneMerker, liesMerker, schreibeMerker } from "../app/merker";

/** Name des Merkers im Gerätespeicher (mit der Vorsilbe „svga.“ aus merker.ts). */
export const NOTSTAND_MERKER = "notstand";

/** Startwerte und Faktoren der Prüfsumme (cyrb53, zwei 32-Bit-Hälften, öffentlich bekannt). */
const SAAT_A = 0xdeadbeef;
const SAAT_B = 0x41c6ce57;
const FAKTOR_A = 2654435761;
const FAKTOR_B = 1597334677;
const MISCH_A = 2246822507;
const MISCH_B = 3266489909;
const OBERE_BITS = 2097152;
const BASIS = 36;

/** So steht der Notstand im Gerätespeicher. */
interface Notstand {
  readonly daten: unknown;
  readonly bekannt: readonly string[];
}

/**
 * Prüfsumme eines gespeicherten Standes über seine JSON-Form.
 *
 * Warum: Der Notstand muss erkennen, ob IndexedDB noch einen alten Stand dieses Tabs hält. Ein
 * Vergleich ganzer Stände im Gerätespeicher wäre doppelt so groß; die Prüfsumme genügt.
 * Eingabe: ein Stand, wie er in IndexedDB liegt. Ausgabe: kurze Zeichenkette (Basis 36).
 * Beispiel: zweimal derselbe Stand → dieselbe Prüfsumme; ein Zug mehr → eine andere.
 * Sonderfall: undefined (nichts gespeichert) → "".
 */
export function pruefsumme(stand: unknown): string {
  const text = JSON.stringify(stand);
  if (text === undefined) return "";
  let a = SAAT_A;
  let b = SAAT_B;
  for (let i = 0; i < text.length; i++) {
    const zeichen = text.charCodeAt(i);
    a = Math.imul(a ^ zeichen, FAKTOR_A);
    b = Math.imul(b ^ zeichen, FAKTOR_B);
  }
  a = Math.imul(a ^ (a >>> 16), MISCH_A) ^ Math.imul(b ^ (b >>> 13), MISCH_B);
  b = Math.imul(b ^ (b >>> 16), MISCH_A) ^ Math.imul(a ^ (a >>> 13), MISCH_B);
  return (OBERE_BITS * (b >>> 0) + (a >>> 0)).toString(BASIS);
}

/**
 * Schreibt den Notstand synchron in den Gerätespeicher (beim Verlassen der Seite).
 *
 * Eingaben: der aktuelle Stand des Tabs und die Stände, die IndexedDB womöglich noch hält (der
 * zuletzt bestätigte und der gerade geschriebene). Ein bekannter Stand gleich dem aktuellen
 * zählt nicht: Hält IndexedDB ihn, ist nichts verloren.
 * Beispiel: Variante „1. e4“ gespeichert, Zug 1... e5, sofort Neuladen → Notstand mit „1. e4 e5“,
 * bekannt die Prüfsumme des Standes mit „1. e4“.
 * Sonderfall: Ist der Gerätespeicher voll oder gesperrt, meldet merker.ts das im Protokoll.
 */
export function sichereNotstand(daten: unknown, moeglicheStaende: readonly unknown[]): void {
  const eigene = pruefsumme(daten);
  const bekannt = moeglicheStaende
    .filter((stand) => stand !== undefined)
    .map(pruefsumme)
    .filter((summe) => summe !== eigene);
  if (bekannt.length === 0) return;
  const notstand: Notstand = { daten, bekannt };
  schreibeMerker(NOTSTAND_MERKER, JSON.stringify(notstand));
}

/** Entfernt einen Notstand, sobald der Stand sicher in IndexedDB liegt. */
export function verwirfNotstand(): void {
  if (liesMerker(NOTSTAND_MERKER) !== null) entferneMerker(NOTSTAND_MERKER);
}

/** Liest den Notstand; ein unlesbarer gilt als keiner. */
function liesNotstand(): Notstand | null {
  const text = liesMerker(NOTSTAND_MERKER);
  if (text === null) return null;
  try {
    const wert: unknown = JSON.parse(text);
    if (typeof wert !== "object" || wert === null) return null;
    const { daten, bekannt } = wert as Record<string, unknown>;
    if (!Array.isArray(bekannt) || !bekannt.every((s) => typeof s === "string")) return null;
    return { daten, bekannt };
  } catch (fehler) {
    console.warn("Notstand unlesbar, verworfen:", fehler);
    return null;
  }
}

/**
 * Nimmt den Notstand beim Laden: Ausgabe der Stand, der statt des gelesenen gelten soll, sonst
 * null. Der Merker ist danach in jedem Fall entfernt.
 *
 * Beispiel: IndexedDB hält „1. e4“, der Notstand „1. e4 e5“ mit „1. e4“ als bekannt → „1. e4 e5“.
 * Sonderfälle: IndexedDB hält einen fremden Stand (anderer Tab) oder schon den Notstand → null.
 */
export function nimmNotstand(gelesen: unknown): unknown {
  const notstand = liesNotstand();
  verwirfNotstand();
  if (!notstand || gelesen === undefined) return null;
  return notstand.bekannt.includes(pruefsumme(gelesen)) ? notstand.daten : null;
}
