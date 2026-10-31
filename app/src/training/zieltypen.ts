/**
 * Gemeinsame Typen der eigenen Ziele (Gamifizierung P13): Kontext der Rechnung, Text mit Werten,
 * Anzeige eines Ziels mit Knopf und wohin der Knopf führt.
 *
 * Rolle im Gesamtbild: Die reinen Module zielringe.ts, zielarten.ts, ziele.ts und
 * zielvorschlaege.ts rechnen nur mit diesen Typen; erst die Oberfläche (start/Zielabschnitt.tsx)
 * übersetzt die Texte und führt den Knopf aus. So bleiben alle Rechnungen ohne React testbar.
 * Abhängigkeiten: app/stapel.ts (Ansicht), i18n (Typen), speicher (Typen), spiel/elomodell.ts.
 */
import type { Ansicht } from "../app/stapel";
import type { Textschluessel, Textwerte } from "../i18n/sprache";
import type { Wertungstempo } from "../spiel/elomodell";
import type { Nutzerdaten } from "../speicher/format";
import type { Kapitelangabe } from "../ui/komponenten/fortschritt/ringrechnung";

/** Alles, woraus sich der Stand eines Ziels ergibt. */
export interface Zielkontext {
  readonly daten: Nutzerdaten;
  /** Kapitel mit Abbildungen (index.json); null, wenn es nicht geladen ist (nach einer Partie). */
  readonly kapitel: readonly Kapitelangabe[] | null;
}

/**
 * Ein Text mit Werten; `namen` sind Werte, die selbst Textschlüssel sind (Zeitart, Teil), `unter`
 * eingesetzte Texte mit eigenen Werten (der Name des Ordens in „Noch 3 Übungen bis zum Orden …“).
 */
export interface Zieltext {
  readonly schluessel: Textschluessel;
  readonly werte: Textwerte;
  readonly namen?: Readonly<Record<string, Textschluessel>>;
  readonly unter?: Readonly<Record<string, Zieltext>>;
}

/** Wohin der Knopf eines Ziels führt: Partie gegen einen Bot (vorbelegt) oder eine Ansicht. */
export type Hinfuehrung =
  | { readonly art: "spielen"; readonly bot: string; readonly tempo: Wertungstempo | null }
  | { readonly art: "ansicht"; readonly ansicht: Ansicht };

/** Die Anzeige eines Ziels: was fehlt, Knopf und Ziel des Knopfes. */
export interface Zielanzeige {
  readonly text: Zieltext;
  readonly knopf: Textschluessel;
  /** null: nichts mehr zu tun (Ziel erreicht). */
  readonly hin: Hinfuehrung | null;
}
