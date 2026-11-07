/**
 * Spielstand des Abenteuers: das Feld `abenteuer` in den Nutzerdaten der App (Format 11,
 * Entscheidung A3).
 *
 * Rolle im Gesamtbild: Alles, was der Leser im Spiel erreicht, steht hier und nirgends sonst.
 * Weil es ein Feld der Nutzerdaten ist, kommen Sicherung, Import, „Alle Daten löschen“ und der
 * dauerhafte Speicher der App mit (speicher/sicherung.ts, app/loeschen.ts). Das Zusatzpaket
 * (Programm und Grafik) kann fehlen oder neu geladen werden, der Spielstand bleibt.
 * Der Stand hat eine eigene kleine Versionsnummer (`version`), damit das Spiel sein Format ändern
 * kann, ohne das Format der App zu erhöhen; die Umwandlung ist eine reine Funktion in einer
 * späteren Datei (spielstandformat.ts).
 * Hier nur Typen. Zustände der Oberwelt (Ort, Position, offene Quests) liegen auch hier, nicht in
 * Phaser, damit Zurück-Taste, Neuladen und Gerätewechsel sie behalten.
 * Abhängigkeiten: schnittstelle/partie.ts, schnittstelle/karten.ts.
 */
import type { Kartenbesitz } from "./karten";
import type { Nadelstufe, Partieergebnis } from "./partie";

/** Version dieses Spielstandformats; wächst unabhängig von SCHEMA_VERSION der App. */
export const ABENTEUER_VERSION = 1;

/** Stand einer Quest (Haupt- oder Nebenaufgabe); die Schritte stehen in den Questdaten (Schritt 4). */
export interface Queststand {
  readonly kennung: string;
  /** Erreichter Schritt (0 = angenommen, letzter Schritt = erledigt). */
  readonly schritt: number;
  readonly erledigt: boolean;
  /** Wann angenommen und erledigt (ISO). */
  readonly angenommen: string;
  readonly erledigtAm: string | null;
}

/** Was der Leser in einem Club erreicht hat. */
export interface Clubstand {
  /** Kennung des Clubs, zum Beispiel „ironwood“. */
  readonly kennung: string;
  /** Beste erreichte Clubnadel; null: noch keine. Eine Nadel lässt sich durch eine neue Partie verbessern. */
  readonly nadel: Nadelstufe | null;
  /** Aufgabenreihe des Clubs bestanden? */
  readonly aufgabenreihe: boolean;
  /** Versuche gegen den Clubchef, für die sichtbare Überheblichkeit nach Niederlagen (Dokument 02, 2.7). */
  readonly versuche: number;
  /** Freigeschaltete Steckbriefzeilen des Clubchefs (Index in Gegnerprofil.steckbrief). */
  readonly steckbrief: readonly number[];
}

/** Zustand einer Figur der Welt, soweit er sich ändert (Gegnerzustand, Dialogfortschritt). */
export interface Figurenstand {
  readonly kennung: string;
  /** Faktor auf die Fehlerhäufigkeit und Grund, wie Gegnerzustand; null: normal. */
  readonly abgelenkt: { readonly faktor: number; readonly grund: string } | null;
  readonly analysiert: boolean;
  /** Ink-Variablen dieser Figur, die über Szenen hinweg gelten (etwa „begruesst“: 1). */
  readonly dialogvariablen: Readonly<Record<string, number | string | boolean>>;
}

/** Wo der Held gerade steht; Phaser liest das beim Aufbau und schreibt es beim Verlassen. */
export interface Weltposition {
  /** Kennung der Karte (Tiled-Datei), zum Beispiel „ironwood.aussen“. */
  readonly karte: string;
  /** Kachelkoordinaten und Blickrichtung. */
  readonly x: number;
  readonly y: number;
  readonly richtung: "oben" | "unten" | "links" | "rechts";
}

/** Fortschritt in der Haupthandlung, als Kapitelmarke statt Wahrheitstabelle. */
export interface Handlungsstand {
  /** Akt 1 bis 4, Post-Game 5. */
  readonly akt: number;
  /** Letzte erreichte Szene der Haupthandlung, zum Beispiel „akt2.perfectMoveKauftRiverton“. */
  readonly szene: string;
  /** Liga nach der Landesmeisterschaft; null: noch nicht qualifiziert. */
  readonly liga: "bronze" | "silber" | "gold" | null;
  /** Zweiter Durchlauf (Post-Game) begonnen? */
  readonly durchlauf: number;
}

/** Ein Eintrag im Partieprotokoll des Abenteuers; die Partie der App kann längst gelöscht sein. */
export interface Protokolleintrag {
  readonly ergebnis: Partieergebnis;
  /** Ort und Rolle, damit das Clubtagebuch die Partie einordnen kann. */
  readonly ort: string;
  readonly gegner: string;
}

/** Gesammelte Partiefragmente von Ambroses alter Partie (Dokument 02, 3.3), als Halbzugindizes. */
export interface Fragmente {
  readonly gefunden: readonly number[];
}

/**
 * Der vollständige Spielstand. Alles readonly; Änderungen erzeugen einen neuen Stand (wie überall
 * im Speicher der App). Größe: wenige Kilobyte; das Partieprotokoll trägt PGN-Texte und ist der
 * größte Teil (bei 60 Partien etwa 60 KB).
 */
export interface Abenteuerstand {
  readonly version: typeof ABENTEUER_VERSION;
  /** Wann das Abenteuer begann (ISO) und mit welcher Eingangswertung (Entscheidung A6). */
  readonly begonnen: string;
  readonly eingangswertung: number;
  /** Name und Figurvariante des Helden (nur Vorname oder Spitzname, bleibt lokal). */
  readonly held: { readonly name: string; readonly variante: number };
  readonly handlung: Handlungsstand;
  readonly position: Weltposition;
  readonly clubs: readonly Clubstand[];
  readonly quests: readonly Queststand[];
  readonly figuren: readonly Figurenstand[];
  readonly karten: readonly Kartenbesitz[];
  readonly fragmente: Fragmente;
  readonly protokoll: readonly Protokolleintrag[];
  /** Kennung der laufenden Begegnung, solange die Partie in der App offen ist; null sonst. */
  readonly laufendePartie: string | null;
  /** Globale Ink-Variablen (über alle Szenen), etwa „ambroseVertrauen“: 3. */
  readonly dialogvariablen: Readonly<Record<string, number | string | boolean>>;
  /** Gesamte Spielzeit in Sekunden, für den Vergleich mit dem Zeitbudget je Club (Entscheidung A7). */
  readonly spielzeitSekunden: number;
}
