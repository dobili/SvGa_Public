/**
 * Der Kopf der Partie als Sprechzeile (Wunsch des Autors, 28.11.2026): Was während der Partie
 * gesagt wird, steht rechts neben dem Porträt statt in einem eigenen Fenster über dem Brett.
 * Diese Datei rechnet, was der Kopf zeigt (Porträt, Name, Text), und wann eine Zeile weicht; die
 * Komponente steht in anbindung/Sprechkopf.tsx (getestet in sprechkopfanzeige.test.ts).
 *
 * Rolle im Gesamtbild: Die Zeilen kommen wie bisher aus der Warteschlange der Sprechblasen
 * (anbindung/tischblasen.ts, `ersteZeile`); hier wird nur entschieden, wie der Kopf sie zeigt.
 * Spricht der Gegner, bleibt sein Porträt; spricht jemand anderes (Ambrose, Juno, der Coach am
 * Rand), steht für die Dauer der Zeile dessen Porträt da, Ambrose leicht durchsichtig wie im
 * Dialog (regeln/geist.ts, „geisterhaft“). Erzählzeilen ohne Sprecher zeigen den Gegner, der Text
 * steht kursiv wie im Dialog. Der Held hat kein Porträt (er ist der Leser): leeres Bildfeld.
 * Abhängigkeiten: anbindung/tischblasen.ts.
 */
import { lesedauer, type Blasenzeile } from "./tischblasen";

/** Was der Kopf gerade zeigt: den Ort (keine Zeile), eine Rede oder eine Erzählzeile. */
export type Kopfart = "ort" | "rede" | "erzaehlung";

/** Wer im Bild ist: der Gegner, jemand anderes oder niemand (Held). */
export type Kopfbild = "gegner" | "andere" | "ohne";

/** Die Anzeige des Kopfs. */
export interface Kopfanzeige {
  readonly art: Kopfart;
  readonly bild: Kopfbild;
  /** Sprecherkennung für das Porträt; null ohne Bild. */
  readonly sprecher: string | null;
  readonly stimmung: string | null;
  /** Ambrose leicht durchsichtig (data-erscheinung „geisterhaft“ wie im Dialog). */
  readonly geist: boolean;
  /** Der kleine Name über dem Text. */
  readonly name: string;
  /** Der Text der Zeile; leer, wenn der Kopf den Ort zeigt. */
  readonly text: string;
}

/** Wer der Gegner im Kopf ist: Porträtkennung und Name. */
export interface Kopfgegner {
  readonly sprecher: string | null;
  readonly name: string;
}

/** camelCase und kebab-case gleich behandeln: „coachDelgado“ und „coach-delgado“ sind einer. */
function gleicheKennung(a: string, b: string): boolean {
  const norm = (n: string) => n.replace(/[A-Z]/g, (z) => `-${z.toLowerCase()}`);
  return norm(a) === norm(b);
}

/**
 * Was der Kopf zur Zeile zeigt.
 * Beispiele: keine Zeile → Gegner, Name, Ort (art „ort“). Coach Delgado sagt „Gut gesehen.“ →
 * sein Porträt in der Stimmung der Zeile. Ambrose flüstert → Ambroses Porträt, leicht
 * durchsichtig, Name „Ambrose“. Erzähler „Delgado trommelt mit den Fingern.“ → Delgado, kursiv.
 * Sonderfälle: Held (ohne Sprecher, mit Namen) → kein Porträt; Gegner ohne Porträt → ohne Bild.
 */
export function kopfanzeige(gegner: Kopfgegner, zeile: Blasenzeile | null): Kopfanzeige {
  const grund = { sprecher: gegner.sprecher, stimmung: null, geist: false, name: gegner.name };
  if (!zeile) return { ...grund, art: "ort", bild: gegner.sprecher ? "gegner" : "ohne", text: "" };
  if (!zeile.sprecher && !zeile.name) {
    return {
      ...grund,
      art: "erzaehlung",
      bild: gegner.sprecher ? "gegner" : "ohne",
      text: zeile.text,
    };
  }
  if (!zeile.sprecher) {
    return {
      ...grund,
      art: "rede",
      bild: "ohne",
      sprecher: null,
      name: zeile.name ?? "",
      text: zeile.text,
    };
  }
  const istGegner = gegner.sprecher !== null && gleicheKennung(zeile.sprecher, gegner.sprecher);
  return {
    art: "rede",
    bild: istGegner ? "gegner" : "andere",
    sprecher: zeile.sprecher,
    stimmung: zeile.stimmung,
    geist: zeile.geist,
    name: zeile.name ?? gegner.name,
    text: zeile.text,
  };
}

/** So lange steht eine Seite mindestens (ms), auch wenn der Text auf viele Seiten verteilt ist. */
const SEITE_MINDESTENS_MS = 3000;

/**
 * Wie lange eine Seite einer Zeile steht: die Lesedauer der ganzen Zeile, auf ihre Seiten verteilt,
 * aber nie kürzer als SEITE_MINDESTENS_MS. Beispiel: 40 Zeichen auf einer Seite → 5 Sekunden;
 * 300 Zeichen auf drei Seiten → je 3 Sekunden.
 */
export function seitendauer(text: string, seiten: number): number {
  return Math.max(SEITE_MINDESTENS_MS, lesedauer(text) / Math.max(1, seiten));
}

/** So lange (ms) muss eine Zeile stehen, bevor ein Zug des Helden sie wegnimmt. */
export const ZUG_NIMMT_AB_MS = 2000;

/**
 * Nimmt der Zug des Helden die gezeigte Zeile weg? Erst nach ZUG_NIMMT_AB_MS: Ambroses Satz zum
 * eigenen Zug kommt mit dem Zug selbst und soll nicht sofort verschwinden.
 * Beispiel: Zeile steht seit 4 s, der Held zieht → weg; seit 0,3 s → bleibt.
 */
export function zugNimmtWeg(gezeigtSeitMs: number): boolean {
  return gezeigtSeitMs >= ZUG_NIMMT_AB_MS;
}
