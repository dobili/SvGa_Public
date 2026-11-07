/**
 * Hilfskarten (Joker) des Abenteuers: Sammelobjekt, Deck und Wirkung in der Partie.
 *
 * Rolle im Gesamtbild: Ambrose vergibt Karten als Lernbelohnung (Konzept, Abschnitt Hilfskarten).
 * Vor einer Partie wählt der Leser bis zu drei Karten ins Deck; in der Partie spielt die
 * Kartenleiste (Erweiterungspunkt der Partieansicht, Entscheidung A4) sie aus. Jede gespielte
 * Karte wird im Partieergebnis vermerkt und bestimmt die Clubnadel (Gold ohne Karten).
 * Grundsatz: Karten ändern Informationen, Züge oder die Startstellung, nie die Zugregeln.
 * Hier nur Typen; die Kartendaten liegen als JSON im Zusatzpaket (Schritt 4), die Wirkung ist Code
 * in der Kartenleiste.
 * Abhängigkeiten: keine.
 * Buchbezug: „Gefahrenradar“ zeigt die Warnsignale W1–W7 des Buches (Kapitel 4), „Fingerzeig“
 * nutzt die Kandidatenfrage aus Kapitel 12 („Welche Figur sollte ziehen?“).
 */

/** Stufe einer Karte; bestimmt Seltenheit und die Clubnadel: leicht ×2 → Silber, mittel oder stark → Bronze. */
export type Kartenstufe = "leicht" | "mittel" | "stark";

/**
 * Dauerhafte Karten bleiben im Besitz und sind einmal je Partie spielbar; Verbrauchskarten
 * verschwinden nach dem Spielen (Dokument 02, Vorschlag 3.4).
 */
export type Kartenart = "dauerhaft" | "verbrauch";

/** Wirkung einer Karte; die Kartenleiste kennt für jede Art genau einen Ablauf. */
export type Kartenwirkung =
  /** Markiert die Figur, die ziehen sollte (bester Zug der Engine, nur das Startfeld). */
  | { readonly art: "fingerzeig" }
  /** Zeigt die eigenen bedrohten Figuren (Warnsignale W1–W7, ohne Lösung). */
  | { readonly art: "gefahrenradar" }
  /** Einen eigenen Zug zurücknehmen (nimmZurueck der Partie). */
  | { readonly art: "zweiteChance" }
  /** Zeigt die drei besten Kandidatenzüge als Pfeile (Engine mit drei Varianten). */
  | { readonly art: "fluestern"; readonly kandidaten: number }
  /** Ambrose zieht für den Leser den Engine-Zug (in Akt 3 gesperrt, im Finale freiwillig). */
  | { readonly art: "mentorzug" }
  /**
   * Vorgabe vor Partiebeginn: der Gegner startet ohne die Figur auf diesem Feld. Das Feld gilt aus
   * Sicht eines weißen Gegners („f2“, „g1“); spielt der Gegner Schwarz, wird die Reihe gespiegelt
   * (Regelwerk R26: f2 → f7, g1 → g8).
   */
  | { readonly art: "vorgabe"; readonly feld: string }
  /** Mehr Bedenkzeit, nur gegen den Zeitdruck-Spezialisten der Landesmeisterschaft. */
  | { readonly art: "zeitbonus"; readonly sekunden: number }
  /** Wiedereinstieg am Kipppunkt ohne Abzug bei der Clubnadel (Post-Game, Entscheidung B2). */
  | { readonly art: "sanduhr" };

/** Eine Kartensorte, wie sie in den Spieldaten steht (inhalte/karten.json). */
export interface Kartensorte {
  /** Kennung, zum Beispiel „fingerzeig“, „springervorgabe“. */
  readonly kennung: string;
  /** Textschlüssel für Name und Ambroses Spruch auf der Karte. */
  readonly name: string;
  readonly spruch: string;
  /** Bild im Zusatzpaket, relativ zum Paketordner. */
  readonly bild: string;
  readonly stufe: Kartenstufe;
  readonly art: Kartenart;
  readonly wirkung: Kartenwirkung;
  /**
   * Vor Partiebeginn (Vorgaben, Zeitbonus), während der Partie, oder nachher (Sanduhr beim Angebot
   * des Wiedereinstiegs, Regelwerk R25).
   */
  readonly zeitpunkt: "vorher" | "waehrend" | "nachher";
}

/** Besitz einer Kartensorte im Spielstand: dauerhafte Karten zählen 1, Verbrauchskarten die Anzahl. */
export interface Kartenbesitz {
  readonly kennung: string;
  readonly anzahl: number;
  /** Wann die erste Karte dieser Sorte kam (ISO), für das Album. */
  readonly erhalten: string;
}

/** Die Karten, die der Leser in eine Partie mitnimmt; höchstens DECKGROESSE, jede Sorte einmal. */
export interface Deck {
  readonly karten: readonly string[];
}

/** Höchstens so viele Karten je Partie (Konzept: Deck-Taktik). */
export const DECKGROESSE = 3;

/** Eine in der Partie gespielte Karte; steht im Partieergebnis und bestimmt die Clubnadel. */
export interface Kartenspiel {
  readonly kennung: string;
  readonly stufe: Kartenstufe;
  /** Halbzug der Partie, bei dem die Karte gespielt wurde; 0 für Karten vor Partiebeginn. */
  readonly halbzug: number;
}
