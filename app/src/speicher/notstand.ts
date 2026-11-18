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
 * (Prüfsummen „bekannt“). Ist das Speichern doch fertig geworden, wird er verworfen. Hat
 * inzwischen ein anderer Tab geschrieben, gilt dessen Stand, und nur die Teile der Nutzerdaten,
 * die dieser Tab geändert hatte („geaendert“, etwa „variationen“), kommen aus dem Notstand dazu
 * (Fehlertest „zwei Tabs“, 18.11.2026: Tab B schrieb Auswertungen, der Zug in Tab A ging verloren).
 * Der Gerätespeicher gehört allen Tabs gemeinsam; deshalb trägt der Notstand die Kennung der
 * Seite, die ihn schrieb, und ein Tab verwirft nach eigenem Schreiben nur seinen eigenen (Tab B
 * löschte sonst den Notstand von Tab A, während A neu lud).
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
  /** Oberste Schlüssel der Nutzerdaten, die dieser Tab gegenüber dem bestätigten Stand änderte. */
  readonly geaendert?: readonly string[];
  /** Kennung der Seite, die ihn schrieb (SEITE). */
  readonly seite?: string;
}

/** Kennung dieser Seite (gilt bis zum nächsten Laden; ein Neuladen ist eine neue Seite). */
const SEITE = Math.random().toString(BASIS).slice(2);

/** Ist der Wert ein einfaches Objekt (die Nutzerdaten)? */
function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

/**
 * Die obersten Schlüssel, in denen sich `daten` von `basis` unterscheiden.
 * Beispiel: Basis mit einer Variante „1. e4“, Daten mit „1. e4 e5“ → ["variationen"].
 */
function geaenderteTeile(daten: unknown, basis: unknown): string[] {
  if (!istObjekt(daten)) return [];
  const alt = istObjekt(basis) ? basis : {};
  return Object.keys(daten).filter((k) => pruefsumme(daten[k]) !== pruefsumme(alt[k]));
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
  const notstand: Notstand = {
    daten,
    bekannt,
    geaendert: geaenderteTeile(daten, moeglicheStaende[0]),
    seite: SEITE,
  };
  schreibeMerker(NOTSTAND_MERKER, JSON.stringify(notstand));
}

/**
 * Entfernt den eigenen Notstand, sobald der Stand dieser Seite sicher in IndexedDB liegt; den
 * Notstand einer anderen Seite (ein anderer Tab, der gerade neu lädt) lässt sie stehen.
 */
export function verwirfNotstand(): void {
  if (liesNotstand()?.seite === SEITE) entferneMerker(NOTSTAND_MERKER);
}

/** Liest den Notstand; ein unlesbarer gilt als keiner. */
function liesNotstand(): Notstand | null {
  const text = liesMerker(NOTSTAND_MERKER);
  if (text === null) return null;
  try {
    const wert: unknown = JSON.parse(text);
    if (typeof wert !== "object" || wert === null) return null;
    const { daten, bekannt, geaendert, seite } = wert as Record<string, unknown>;
    if (!Array.isArray(bekannt) || !bekannt.every((s) => typeof s === "string")) return null;
    const teile = Array.isArray(geaendert) ? geaendert.filter((s) => typeof s === "string") : [];
    return { daten, bekannt, geaendert: teile, seite: typeof seite === "string" ? seite : "" };
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
 * Hat ein anderer Tab inzwischen seine Auswertung geschrieben → dessen Stand mit den Varianten
 * aus dem Notstand.
 * Sonderfälle: IndexedDB hält schon den Notstand, oder der Tab hatte nichts geändert → null.
 */
export function nimmNotstand(gelesen: unknown): unknown {
  const notstand = liesNotstand();
  if (liesMerker(NOTSTAND_MERKER) !== null) entferneMerker(NOTSTAND_MERKER);
  if (!notstand || gelesen === undefined) return null;
  if (notstand.bekannt.includes(pruefsumme(gelesen))) return notstand.daten;
  const { daten, geaendert = [] } = notstand;
  if (!istObjekt(daten) || !istObjekt(gelesen)) return null;
  const eigene = geaendert.filter((k) => pruefsumme(daten[k]) !== pruefsumme(gelesen[k]));
  if (eigene.length === 0) return null;
  return { ...gelesen, ...Object.fromEntries(eigene.map((k) => [k, daten[k]])) };
}
