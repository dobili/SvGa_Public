/**
 * Die gemeinsame Form aller Werkzeuge des Buches und ihres Ergebnisses.
 *
 * Rolle im Gesamtbild: Über 30 Werkzeuge haben dieselbe Schnittstelle (Konzept 7.1). Ein neues
 * Werkzeug wird nur in register.ts angemeldet, die Oberfläche bleibt unverändert.
 * Abhängigkeiten: schach/stellung.ts, i18n.
 */
import type { Bilanz, Fallencheck, Uebung } from "../daten/generiert/kapitel";
import type { Textschluessel } from "../i18n/sprache";
import type { Eroeffnungsindex } from "../schach/eroeffnungsindex";
import type { Farbe, Stellung } from "../schach/stellung";
import type { Verlauf } from "../schach/todsuenden";

/** Grundart eines Befundes: E exakt, N Näherung, V vorbereiteter Text (Konzept 7.1). */
export type Befundart = "E" | "N" | "V";

/** Farbe einer Markierung, wie im Buch (Konzept 10.3). */
/** Gold, Rot, Grau wie im Buch; Grün und Blau nur für die Zugklassen im Rückblick (0.2.40). */
export type Markierungsfarbe = "gold" | "rot" | "grau" | "gruen" | "blau";

/** Eine Markierung auf dem Brett: Pfeil von Feld zu Feld oder ein markiertes Feld. */
export type Markierung =
  | {
      readonly typ: "pfeil";
      readonly farbe: Markierungsfarbe;
      readonly von: string;
      readonly nach: string;
    }
  | {
      readonly typ: "feld";
      readonly farbe: Markierungsfarbe;
      readonly feld: string;
      /** Kurze Beschriftung in der Feldecke, etwa „W1“ (Pflichtenheft 6.2). */
      readonly text?: string;
    };

/** Ein einzelner Befund eines Werkzeugs, etwa „Schwarz greift an: Bauer c5, Springer c6“. */
export interface Befund {
  /** Kennung innerhalb des Werkzeugs, etwa „angreifer“. */
  readonly kennung: string;
  readonly art: Befundart;
  readonly titel: string;
  /** Zeilen des Befundes, fertig übersetzt. */
  readonly zeilen: readonly string[];
  /** Farbe, mit der der Befund in der Karte gekennzeichnet wird (Linienart wie am Brett). */
  readonly farbe: Markierungsfarbe | null;
  /** Vergleich mit Waage wie in der Faktorenbilanz des Buches (Kapitel 3: Material und Zeit). */
  readonly waage?: Waagenanzeige;
  /** Knopf, der zu einer Abbildung im Buch springt (etwa zum Steckbrief einer Eröffnung). */
  readonly sprung?: { readonly text: string; readonly abbildung: string };
}

/** Eine Waage: links und rechts je eine Seite; sie neigt sich zu der Seite, die vorn liegt. */
export interface Waagenanzeige {
  readonly links: string;
  readonly rechts: string;
  readonly neigung: "links" | "rechts" | "gerade";
  /** Kurzer Text an der Waage, etwa „+1“. */
  readonly vorsprung: string;
}

/** Ergebnis eines Werkzeugs (Konzept 4.6), nur zur Laufzeit. */
export interface Werkzeugergebnis {
  readonly werkzeug: string;
  readonly art: Befundart;
  readonly ueberschrift: string;
  readonly befunde: readonly Befund[];
  /** Zusammenfassung in einem Satz, etwa „3 gegen 3: Noch geht nichts.“ */
  readonly fazit: string;
  readonly markierungen: readonly Markierung[];
  /** Kennungen der Befunde je Hinweisstufe 1, 2 und 3. */
  readonly stufen: readonly [readonly string[], readonly string[], readonly string[]];
  /** Text für „So prüft die App“. */
  readonly regel: string;
  /**
   * Gut sichtbarer kurzer Hinweis oben in der Karte, etwa dass die Todsünden nur Kandidaten sind
   * (Wunsch des Autors zu C2.3, 16.10.2026). Fehlt bei den meisten Werkzeugen.
   */
  readonly hinweis?: string;
}

/** Was ein Werkzeug als Eingabe bekommen kann (Konzept 7.1). */
export interface Werkzeugeingabe {
  readonly stellung: Stellung;
  /** Für welche Farbe gewertet wird. */
  readonly perspektive: Farbe;
  /** Ein angetipptes Feld wie „d4“, für Zählwerkzeuge. */
  readonly feld?: string;
  /** Geplanter Zug in SAN (englisch), etwa der nächste Zug im Buch, für k4-prueffragen. */
  readonly zug?: string;
  /** Die Züge bis zur Stellung, für k1-todsuenden (ohne: nur die Stellung selbst). */
  readonly verlauf?: Verlauf;
  /** Fallencheck des Buches, wenn die Abbildung ein Stopp-Moment ist (für k4-falle). */
  readonly fallencheck?: Fallencheck;
  /** Stellungen der Buchvarianten aus Kapitel 2 und 3, für k2-eroeffnung (sobald geladen). */
  readonly eroeffnungen?: Eroeffnungsindex;
  /** Die Planbilanz des Buches zur Abbildung, wenn es eine gibt (für k6-planbilanz). */
  readonly bilanz?: Bilanz;
  /** Die Buchzüge nach dem geplanten Zug entlang der Hauptvariante (für k7-motiv). */
  readonly fortsetzung?: readonly string[];
  /** Die Übung des Buches zur Abbildung, wenn es eine gibt (für k7-motiv). */
  readonly uebung?: Uebung;
  /** Anker des Buchabschnitts der Abbildung, etwa „sec:k11-morphy“ (für k11-phase). */
  readonly abschnitt?: string;
}

/** Welche Eingaben ein Werkzeug braucht. */
export type Bedarf =
  | "stellung"
  | "feld"
  | "verlauf"
  | "zug"
  | "engine"
  | "eroeffnungen"
  | "fallencheck"
  | "bilanz"
  | "fortsetzung"
  | "uebung";

/** Ein Werkzeug des Buches. */
export interface Werkzeug {
  /** Eindeutige Kennung wie „k1-zaehlen“: Kapitel und Name. */
  readonly id: `k${number}-${string}`;
  /** Ab welchem Kapitel das Werkzeug freigeschaltet ist. */
  readonly kapitel: number;
  readonly name: Textschluessel;
  readonly regel: Textschluessel;
  /** Kurze Bedienungserklärung beim zweiten Antippen des Knopfes (Werkzeugleiste). */
  readonly erklaerung: Textschluessel;
  readonly art: Befundart;
  readonly braucht: readonly Bedarf[];
  /** Die eigentliche Rechnung. Verändert nie die Stellung, hat keine Nebenwirkungen. */
  readonly berechne: (eingabe: Werkzeugeingabe) => Werkzeugergebnis | null;
}
