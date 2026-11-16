// Typen zu skripte/abenteuerpaket-moebel.mjs, damit der Komponententest sie ohne any nutzen kann.

/** Name des Bogens für Möbel, die keine Karte zeigt. */
export const UEBRIGE: string;

/** Die Möbel je Ort (Kennung aus orte.json) aus den Objekten vom Typ „moebel“ seiner Karten. */
export function moebelJeOrt(
  orte: {
    readonly orte: readonly {
      readonly kennung: string;
      readonly karten: readonly {
        readonly datei: string;
        readonly zustaende?: Readonly<Record<string, string>>;
      }[];
    }[];
  },
  kartentexte: ReadonlyMap<string, string>,
  moebel: Readonly<Record<string, unknown>>,
): Map<string, string[]>;

/** Schreibt die Möbelbögen je Ort und daten/moebel.json; Ausgabe: Zahlen für die Konsole. */
export function schreibeMoebel(eingaben: {
  readonly quelle: string;
  readonly privatWurzel: string;
  readonly texte: readonly string[];
  readonly orte: unknown;
  readonly kartentexte: ReadonlyMap<string, string>;
  readonly schreibe: (pfad: string, inhalt: string | Uint8Array, gruppe: string) => Promise<void>;
  readonly platzhalter: (breite: number, hoehe: number) => Uint8Array;
}): Promise<{ boegen: number; moebel: number; doppelt: number }>;
