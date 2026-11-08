/**
 * Partieauftrag und Partieergebnis: der Vertrag für den Weg Oberwelt → Partieansicht der App →
 * Oberwelt.
 *
 * Rolle im Gesamtbild: Das Spiel baut aus Gegnerprofil, Zustand, Deck und Stellung einen
 * Partieauftrag. Die App legt daraus eine Partie an (neuePartie in spiel/partie.ts), spielt sie in
 * der vorhandenen Partieansicht und schreibt am Ende ein Partieergebnis, das das Spiel beim
 * Rückweg liest und sofort in den Spielstand übernimmt (die Partienliste der App hält nur 50
 * Partien, Stellungnahme Abschnitt 6). Die Partie der App trägt dafür ein Feld `abenteuer` in ihrer
 * Einstellung mit der Partiekennung des Spiels (Baustein F2).
 * Hier nur Typen; der Aufbau der Partieeinstellung und das Lesen des Ergebnisses sind spätere
 * Dateien (partiestart.ts, partieergebnis.ts).
 * Abhängigkeiten: spiel/ergebnis.ts (Partieende), spiel/auswertung.ts (Zugklasse),
 * spiel/buchbezug.ts (Buchkennung), schach/phase.ts (Phase), chessops (Color).
 * Buchbezug: Die Schlüsselmomente nennen die Fehlerkategorien des Buches (W1–W10, F1–F10) mit
 * Kapitel und Fundstelle, so wie die Karte „Fehler mit Buchbezug“ der App.
 */
import type { Color } from "chessops/types";
import type { Phase } from "../../schach/phase";
import type { Zugklasse } from "../../spiel/auswertung";
import type { Buchkennung } from "../../spiel/buchbezug";
import type { Partieende } from "../../spiel/ergebnis";
import type { Gegnerprofil, Gegnerzustand, Gerechnetestaerke } from "./gegnerprofil";
import type { Deck, Kartenspiel } from "./karten";

/** Format einer Begegnung; bestimmt Dauer und Siegbedingung (Entscheidung C1). */
export type Partieformat =
  /** Ganze Partie aus der Grundstellung (oder mit Vorgabe). */
  | { readonly art: "partie" }
  /**
   * Stellungsduell: aus einer Stellung mit leichtem Vorteil weiterspielen; gewonnen, wenn nach
   * `zuege` eigenen Zügen die Bewertung mindestens `mindestvorteil` Bauern beträgt oder Matt steht.
   */
  | { readonly art: "stellungsduell"; readonly zuege: number; readonly mindestvorteil: number }
  /**
   * Wiedereinstieg am Kipppunkt (Entscheidung B1): dieselbe Begegnung ab einer Stellung der
   * verlorenen Partie; `vorherigeKennung` nennt die verlorene Partie.
   */
  | { readonly art: "wiedereinstieg"; readonly vorherigeKennung: string };

/** Woher die Startstellung kommt, wenn nicht die Grundstellung. */
export type Startstellung =
  | { readonly art: "grundstellung" }
  /** Beliebige FEN, zum Beispiel nach einer Vorgabe-Karte oder am Kipppunkt. */
  | { readonly art: "fen"; readonly fen: string }
  /** Abbildung des Buches als Ausgangsstellung eines Stellungsduells („5.12“). */
  | { readonly art: "abbildung"; readonly nummer: string }
  /** Stellung aus einer Meisterpartie der App (inhalte/zusatzpartien) nach `halbzug` Halbzügen. */
  | { readonly art: "meisterpartie"; readonly kennung: string; readonly halbzug: number };

/**
 * Alles, was das Spiel der App übergibt, damit sie eine Partie anlegt.
 * Beispiel: Clubkampf in Ironwood → profil Big Joe, zustand abgelenkt (Faktor 1,4), deck
 * [„fingerzeig“, „zweiteChance“], farbe „white“, format partie, startstellung grundstellung,
 * kartenErlaubt true, zaehltFuerApp true.
 */
export interface Partieauftrag {
  /** Kennung dieses Versuchs, eindeutig (Begegnung plus Zeitstempel), zum Beispiel „ironwood.clubkampf#m3k9“. */
  readonly kennung: string;
  /** Die Begegnung aus den Spieldaten (inhalte/abenteuer/begegnungen.json), auf die Quests warten. */
  readonly begegnung: string;
  readonly profil: Gegnerprofil;
  readonly zustand: Gegnerzustand;
  /** Die aus Profil, Zustand und Wertung gerechnete Stärke, damit das Ergebnis sie festhalten kann. */
  readonly staerke: Gerechnetestaerke;
  /** Farbe des Lesers. */
  readonly farbe: Color;
  readonly format: Partieformat;
  readonly startstellung: Startstellung;
  readonly deck: Deck;
  /** Story-Sperre (Tiefpunkt, Finale gegen Victor): keine Karten, auch nicht aus dem Deck. */
  readonly kartenErlaubt: boolean;
  /**
   * Zählt die Partie für Partienliste, Tagesprotokoll, Erfahrung und Rekorde der App
   * (Entscheidung A2)? Für Elo-Wertung, Rivalen und Duelle zählt sie nie.
   */
  readonly zaehltFuerApp: boolean;
  /**
   * Bedenkzeit der Partie; null: ohne Uhr. Fest aus der Begegnung (Schaffner 3 + 2) oder vom
   * Leser vor der Partie gewählt (Schritt 13, Deckwahl).
   */
  readonly uhr: { readonly sekunden: number; readonly zuschlag: number } | null;
  /** Darf der Leser die Bedenkzeit vor der Partie wählen (Begegnung „zeit“: „wahl“)? */
  readonly zeitwahl?: boolean;
  /** Wird die Farbe ausgelost (Begegnung „farbe“: „zufall“)? Dann darf die Karte Farbwahl sie bestimmen. */
  readonly farbeFrei?: boolean;
  /** Freie Karten der Begegnung (R29: Mentor-Zug im Halbfinale), ohne Besitz im Deck. */
  readonly freieKarten?: readonly string[];
}

/**
 * Ein Schlüsselmoment für Ambroses Rückblick: höchstens zwei je Partie, aus den Bot-Zügen (die
 * App speichert Verlust und Fehlerart je Zug) und einem kurzen Engine-Durchgang über die Züge des
 * Lesers (Baustein F6).
 */
export interface Schluesselmoment {
  /** Halbzug (0 = erster Zug von Weiß). */
  readonly halbzug: number;
  /** Stellung vor dem Zug, zum Zeigen auf dem Brett. */
  readonly fen: string;
  /** Der gespielte Zug und der bessere Zug, beide als SAN. */
  readonly gespielt: string;
  readonly besser: string | null;
  readonly klasse: Zugklasse;
  /** Verlust in Bauerneinheiten aus Sicht des Ziehenden, positiv = schlechter geworden. */
  readonly verlust: number;
  /** Fehlerkategorie des Buches, wenn erkannt (W1–W10, F1–F10); daraus Kapitel und Fundstelle. */
  readonly buchbezug: Buchkennung | null;
  /** Zug des Lesers oder des Gegners? */
  readonly wessen: "leser" | "gegner";
  readonly phase: Phase;
}

/** Stellung für den Wiedereinstieg: die letzte, in der die Partie noch nicht gekippt war. */
export interface Kipppunkt {
  readonly halbzug: number;
  readonly fen: string;
  /** Bewertung in Bauern aus Sicht des Lesers, bevor es kippte (etwa innerhalb ±1). */
  readonly bewertung: number;
  /** Der Fehler, der folgte, als Schlüsselmoment für Ambroses Satz „Hier ist es passiert“. */
  readonly fehler: Schluesselmoment;
}

/** Ausgang aus Sicht des Lesers. */
export type Ausgang = "sieg" | "remis" | "niederlage" | "abgebrochen";

/**
 * Was die App dem Spiel nach der Partie zurückgibt. Das Spiel kopiert es vollständig in den
 * Spielstand (Partieprotokoll des Abenteuers) und entscheidet daraus über Clubnadel, Belohnung
 * und Wiedereinstieg.
 */
export interface Partieergebnis {
  /** Kennung des Partieauftrags. */
  readonly kennung: string;
  /** Kennung der Partie in der App, solange sie dort noch liegt (höchstens 50 Partien). */
  readonly appPartieId: string;
  readonly ausgang: Ausgang;
  readonly ende: Partieende | null;
  /** Vollständige Zugfolge als PGN mit Kopfzeilen (Namen, Datum, Ergebnis). */
  readonly pgn: string;
  readonly halbzuege: number;
  /** Dauer der Partie in Sekunden (Summe der Bedenkzeit beider Seiten, ohne Pausen). */
  readonly sekunden: number;
  readonly gespielteKarten: readonly Kartenspiel[];
  /** Rücknahmen ohne Karte gibt es im Abenteuer nicht; die App zählt sie trotzdem, hier zur Kontrolle. */
  readonly ruecknahmen: number;
  readonly momente: readonly Schluesselmoment[];
  /** Nur nach einer Niederlage und nur, wenn die Partie einen Kipppunkt nach Zug 10 hatte. */
  readonly kipppunkt: Kipppunkt | null;
  /** Genauigkeit des Lesers in Prozent und Stärkeschätzung aus den Zügen (spiel/genauigkeit.ts, spiel/elomodell.ts), wenn gerechnet. */
  readonly genauigkeit: number | null;
  readonly geschaetzteStaerke: number | null;
  /** Zeitpunkt des Endes (ISO). */
  readonly beendet: string;
}

/** Stufe der Clubnadel (Entscheidung C6); Regeln in Dokument 02, Abschnitt 2.7 und Entscheidung B2. */
export type Nadelstufe = "gold" | "silber" | "bronze";
