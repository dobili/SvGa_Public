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
/**
 * Die wählbaren Figuren des Helden, als Name des Bogens im Paket (figuren32/<name>.png). Die
 * Heldin erstellt der Autor noch in PixelLab; bis dahin gilt im Spiel der Bogen held-0.
 */
export type Heldfigur = "held-0" | "heldin-0";
import type { Aufgabenauftrag, Aufgabenergebnis, Rundenstand } from "./aufgaben";
import type { Kartenbesitz, Kartenspiel } from "./karten";
import type { Nadelstufe, Partieergebnis } from "./partie";
import type { Partie } from "../../spiel/partie";

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
}

/** Zustand einer Figur der Welt, soweit er sich ändert (Gegnerzustand, Dialogfortschritt). */
export interface Figurenstand {
  readonly kennung: string;
  /** Faktor auf die Fehlerhäufigkeit und Grund, wie Gegnerzustand; null: normal. */
  readonly abgelenkt: { readonly faktor: number; readonly grund: string } | null;
  readonly analysiert: boolean;
  /**
   * Freigeschaltete Steckbriefzeilen dieses Gegners (Index in Gegnerprofil.steckbrief), in der
   * Reihenfolge des Freischaltens. Seit 15.11.2026 je Gegner statt je Club (N2621: Jo und Sam
   * teilten sich sonst den Eintrag von Maple Falls). Fehlend: keine.
   */
  readonly steckbrief?: readonly number[];
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
  /** Bedenkzeit der Partie (Schritt 13); ein Wiedereinstieg spielt mit derselben Uhr. */
  readonly uhr?: { readonly sekunden: number; readonly zuschlag: number } | null;
  /** Freie Karten der Begegnung (R29), liegen zusätzlich im Deck und kosten nichts. */
  readonly frei?: readonly string[];
}

/**
 * Die Ergebniskarte, die nach einer Partie oder Aufgabenrunde offen ist (Spieltest „einstieg“,
 * 15.11.2026, R6): Sie liegt im Spielstand, damit sie ein Neuladen übersteht (vorher war sie nach
 * dem Schließen der App weg). „Weiter“ auf der Karte löscht sie.
 */
export type Ergebniskarte =
  | {
      readonly art: "partie";
      readonly ergebnis: Partieergebnis;
      readonly nadel: Nadelstufe | null;
      /** Deck der Partie, für den Wiedereinstieg am Kipppunkt (R15). */
      readonly karten: Partiekarten | null;
      /** Ist ein Wiedereinstieg möglich (dann sucht die Oberwelt den Kipppunkt erneut)? */
      readonly wiedereinstieg: boolean;
    }
  | {
      readonly art: "runde";
      readonly auftrag: Aufgabenauftrag;
      readonly punkte: number;
      readonly moeglich: number;
      readonly bestanden: boolean;
      readonly reiheGeschafft: boolean;
    };

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
    /** Begegnung mit Zeitwahl (19.11.2026): dann zählt A je Zeitklasse (regeln/zeitklassenwertung.ts). */
    readonly zeitwahl?: boolean;
    /** Abzug der Uhr für den Bot in Elo, beim Start gerechnet (engine/botstaerke.ts). */
    readonly uhrAbzug?: number;
  } | null;
  /**
   * Name und Figur des Helden (nur Vorname oder Spitzname, bleibt lokal). Die Figur wählt der
   * Leser beim Spielbeginn: Held oder Heldin (Wunsch des Autors, 22.11.2026; regeln/heldfigur.ts).
   */
  readonly held: { readonly name: string; readonly figur: Heldfigur };
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
  /**
   * Eigene Seiten im Tagebuch (Roman Kap. 9, „Ich will besser werden.“): Name des Eintrags
   * (Text tagebuch.eintrag.<name>) und Zeitpunkt (ISO). Fehlt bei älteren Spielständen.
   */
  readonly eintraege?: readonly { readonly name: string; readonly geschrieben: string }[];
  /**
   * Schon gespielte Stellungen aus dem Vorrat Bot gegen Bot (regeln/vorrat.ts), damit keine sich
   * wiederholt, bis ein Format durch ist. Fehlt bei älteren Spielständen.
   */
  readonly vorratGenutzt?: readonly string[];
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
  /** Offene Ergebniskarte nach Partie oder Runde (R6); fehlt oder null: keine. */
  readonly ergebniskarte?: Ergebniskarte | null;
  /**
   * Rückmeldung nach dem Ergebnis (Wunsch des Autors, 19.11.2026): der Dialog („datei.knoten“),
   * der die laufende Partie, Runde, das Simultan oder die Gedächtnisstellung gestartet hat. Nach
   * der Ergebniskarte öffnet die Oberwelt ihn wieder (oberwelt/nachergebnis.ts); fehlt oder null:
   * keiner.
   */
  readonly nachErgebnis?: string | null;
  /**
   * Die Rückmeldung, die gerade offen ist (geöffnet, aber nicht zu Ende gelesen). Lädt der Spieler
   * mitten darin neu, öffnet die Oberwelt sie wieder (oberwelt/nachergebnis.ts); fehlt oder null:
   * keine.
   */
  readonly rueckmeldungOffen?: string | null;
  /** Ergebnis der zuletzt beendeten Runde, bis die Oberwelt es ausgewertet hat. */
  readonly aufgabenergebnis: Aufgabenergebnis | null;
  /**
   * Antworten der laufenden Runde bis jetzt, nach jeder Aufgabe gesichert (Spieltest „einstieg“,
   * R5): Wer die App schließt, macht bei der nächsten offenen Aufgabe weiter; dieselben Aufgaben
   * kommen aus der festen Saat der Kennung (anbindung/rundenaufgaben.ts). Fehlend oder null: keine.
   */
  readonly aufgabenzwischenstand?: Aufgabenergebnis | null;
  /** Stand je gespielter Runde (bestanden, Versuche), Grundlage für Clubstand.aufgabenreihe. */
  readonly runden: readonly Rundenstand[];
  /** Globale Ink-Variablen (über alle Szenen), etwa „ambroseVertrauen“: 3. */
  readonly dialogvariablen: Readonly<Record<string, number | string | boolean>>;
  /** Gesamte Spielzeit in Sekunden, für den Vergleich mit dem Zeitbudget je Club (Entscheidung A7). */
  readonly spielzeitSekunden: number;
  /** Spielzeit je Ort in Sekunden (Vorschlag V7), um die Richtwerte R39/R40 nachzumessen. */
  readonly spielzeitJeOrt: Readonly<Record<string, number>>;
  /**
   * Die Quest, zu deren Ziel der Pfeil zeigt (Kennung), sonst keine. Wunsch des Autors (19.11.2026):
   * Pfeile nur auf Wunsch, angetippt im Tagebuch; der Pfeil folgt den Schritten dieser Quest, bis
   * sie erledigt ist. Im Spielstand, damit er ein Neuladen übersteht. Fehlt in älteren Ständen.
   */
  readonly verfolgteQuest?: string | null;
  /**
   * Wann zuletzt gespielt wurde (ISO), gesetzt beim Sichern der Sitzung (Kartenwechsel, App in den
   * Hintergrund). Daraus die Erinnerung nach einer Pause (regeln/wiedereinstieg.ts, 20.11.2026).
   * Fehlt in älteren Ständen.
   */
  readonly zuletztGespielt?: string;
  /**
   * Spieluhr (Wunsch des Autors, 22.11.2026): Spielminuten seit Spielbeginn, ein Tag hat 1440.
   * Läuft nur in freier Oberwelt, ein Spieltag dauert 2 echte Stunden (regeln/spieluhr.ts). Fehlt:
   * erster Morgen, 6 Uhr.
   */
  readonly spieluhr?: number;
  /**
   * Hauptfiguren, die den Helden schon angesprochen haben (Wunsch des Autors, 25.11.2026,
   * regeln/ansprechen.ts): je Questschritt und Figur ein Schlüssel „quest#schritt:figur“, damit
   * jede höchstens einmal je Schritt auf ihn zugeht. Fehlt in älteren Ständen.
   */
  readonly ansprachen?: readonly string[];
}

/**
 * Ein ruhender Speicherplatz (Wunsch des Autors, 27.11.2026: beliebig viele Spielstände, ein
 * Hauptmenü zum Fortsetzen, Laden und Löschen). Der gespielte Stand liegt wie bisher im Feld
 * `abenteuer` der Nutzerdaten, damit Oberwelt, Partie und Sicherung nichts davon merken; die
 * übrigen ruhen im Feld `abenteuerplaetze` (anbindung/speicherplaetze.ts). Kennung eines Platzes
 * ist der Beginn seines Spielstands (`begonnen`, ISO, je Platz verschieden).
 */
export interface Ruheplatz {
  readonly stand: Abenteuerstand;
  /**
   * Die offene Partie der App, die zu diesem Stand gehörte, als er ruhen ging (die App hält nur
   * eine laufende Partie); null ohne. Beim Laden des Platzes kommt sie zurück.
   */
  readonly laufend: Partie | null;
}
