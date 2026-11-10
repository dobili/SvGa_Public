// Typen zu skripte/abenteuerpaket-auswahl.mjs, damit der Komponententest sie ohne any nutzen kann.

/** Tiled-Karte kompakt, ohne rotation 0 und visible true an Objekten. */
export function kompakteKarte(text: string): string;

/** Kartendateien und Hintergründe, die die App über orte.json laden kann. */
export function ladbareKarten(orte: {
  readonly orte: readonly {
    readonly karten: readonly {
      readonly kennung: string;
      readonly datei: string;
      readonly zustaende?: Readonly<Record<string, string>>;
    }[];
  }[];
}): { dateien: Set<string>; hintergruende: Set<string> };

/** Möbel, deren Name als Wort in einem der Texte vorkommt. */
export function genutzteMoebel<T>(
  moebel: Readonly<Record<string, T>>,
  texte: readonly string[],
): Record<string, T>;
