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
import type { Aufgabenauftrag, Aufgabenergebnis, Rundenstand } from "./aufgaben";
import type { Kartenbesitz, Kartenspiel } from "./karten";
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
  /** War diese Partie ein Wiedereinstieg (R14: einmal je Begegnung)? Fehlend: nein. */
  readonly wiedereinstieg?: boolean;
}

/**
 * Die Karten der laufenden Partie (Regelwerk R24): das gewählte Deck, was davon schon gespielt
 * wurde, und ob die Partie ein Wiedereinstieg ist (R20). Liegt im Spielstand, nicht in der Partie
 * der App, damit ein Neuladen mitten in der Partie nichts vergisst.
 */
export interface Partiekarten {
  readonly deck: readonly string[];
  readonly gespielt: readonly Kartenspiel[];
  readonly wiedereinstieg: boolean;
  /** Halbzug, in dem zuletzt eine Karte gespielt wurde (höchstens eine je eigenem Zug). */
  readonly letzterHalbzug: number | null;
  /**
   * Gegnerkennung der Partie (Schritt 13): Die Kartenleiste liest daraus, ob Sprüche erlaubt sind
   * (nur Straßengegner), gegen welche er immun ist und wie er antwortet. Fehlt in älteren Ständen.
   */
  readonly gegner?: string;
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
  /** Wann das Abenteuer begann (ISO). */
  readonly begonnen: string;
  /**
   * Eingangswertung E (Entscheidung A6, Architektur Abschnitt 4): läuft in den ersten 10 gewerteten
   * Partien mit der aktuellen Wertung mit und ist danach fest; `eingangPartien` zählt sie.
   */
  readonly eingangswertung: number;
  readonly eingangPartien: number;
  /**
   * Abenteuerwertung A (Regelwerk R2, Vorschlag V1): startet mit der Wertung der App oder 600,
   * folgt Änderungen der App-Wertung und wächst mit Story-Partien, die nach R38 zählen.
   */
  readonly wertung: number;
  /** Zuletzt gelesene Wertung der App, um ihre Änderung auf A zu übertragen; null ohne Wertung. */
  readonly appWertungZuletzt: number | null;
  /** Zahl der Story-Partien, die für A gezählt haben (K = 32 in den ersten 10, dann 20). */
  readonly wertungPartien: number;
  /**
   * Zielstärke der laufenden Partie vor dem Zustandsfaktor und ob sie für A zählt (R38, geprüft
   * beim Start); null ohne laufende Partie.
   */
  readonly laufendeWertung: {
    readonly zielElo: number;
    readonly zaehlt: boolean;
    /** Sichtbarer Zustand des Gegners (R8, R9): Textschlüssel von Name und Grund; null ohne. */
    readonly zustand: { readonly gegner: string; readonly grund: string } | null;
  } | null;
  /** Name und Figurvariante des Helden (nur Vorname oder Spitzname, bleibt lokal). */
  readonly held: { readonly name: string; readonly variante: number };
  readonly handlung: Handlungsstand;
  readonly position: Weltposition;
  readonly clubs: readonly Clubstand[];
  readonly quests: readonly Queststand[];
  readonly figuren: readonly Figurenstand[];
  readonly karten: readonly Kartenbesitz[];
  /** Münzen, reine Spielwährung ohne Echtgeld (docs/spiel/08, G1). */
  readonly muenzen: number;
  /** Gegenstände im Besitz (docs/spiel/08: fahrrad, taschenlampe, fahrkarte …). */
  readonly gegenstaende: readonly string[];
  /** Gefundene Dinge (docs/spiel/08, E1): Kennung aus funde.json und Zeitpunkt (ISO). */
  readonly funde: readonly { readonly kennung: string; readonly gefunden: string }[];
  /** Orte, die der Held schon betreten hat (W2: Schnellreise erst nach dem ersten Fußweg). */
  readonly besuchteOrte: readonly string[];
  readonly fragmente: Fragmente;
  readonly protokoll: readonly Protokolleintrag[];
  /** Kennung der laufenden Begegnung, solange die Partie in der App offen ist; null sonst. */
  readonly laufendePartie: string | null;
  /** Deck und gespielte Karten der laufenden Partie; null ohne laufende Partie. */
  readonly partiekarten: Partiekarten | null;
  /** Die Aufgabenrunde, die gerade in der App läuft (R30); null sonst. */
  readonly laufendeAufgaben: Aufgabenauftrag | null;
  /** Ergebnis der zuletzt beendeten Runde, bis die Oberwelt es ausgewertet hat. */
  readonly aufgabenergebnis: Aufgabenergebnis | null;
  /** Stand je gespielter Runde (bestanden, Versuche), Grundlage für Clubstand.aufgabenreihe. */
  readonly runden: readonly Rundenstand[];
  /** Globale Ink-Variablen (über alle Szenen), etwa „ambroseVertrauen“: 3. */
  readonly dialogvariablen: Readonly<Record<string, number | string | boolean>>;
  /** Gesamte Spielzeit in Sekunden, für den Vergleich mit dem Zeitbudget je Club (Entscheidung A7). */
  readonly spielzeitSekunden: number;
  /** Spielzeit je Ort in Sekunden (Vorschlag V7), um die Richtwerte R39/R40 nachzumessen. */
  readonly spielzeitJeOrt: Readonly<Record<string, number>>;
}
