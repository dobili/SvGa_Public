/**
 * Modulgrenze zwischen App und Abenteuer: Was die App dem Spiel gibt (Dienste) und was das Spiel
 * der App gibt (Ansichten und Einhängepunkte).
 *
 * Rolle im Gesamtbild: Die App kennt vom Spiel nur diese Datei und den dynamischen Import des
 * Moduls; das Spiel kennt von der App nur die Dienste, die es hier bekommt. So bleibt die
 * Buchbegleitung (Stufe 1 der App) unberührt, und das Spiel lässt sich später in ein privates
 * Repository verschieben (Wunsch des Autors, Entscheidung A10), ohne dass die App sich ändert.
 * Einhängepunkte der App (alle klein, Stellungnahme Abschnitt 2):
 *   1. app/zusatzansichten.ts: eine Zeile { kennung: "abenteuer", Bildschirm } (Oberwelt).
 *   2. ui/bildschirme/Partie.tsx: Liste PARTIE_ERWEITERUNGEN, in die das Spiel die Kartenleiste
 *      einträgt (Entscheidung A4).
 *   3. spiel/partie.ts: optionales Feld `abenteuer` in der Partieeinstellung (Partiekennung).
 *   4. speicher/format.ts: Feld `abenteuer` in den Nutzerdaten, Format 11.
 *   5. vite.config.ts, skripte/pruefe-groesse.mjs, sw/dateiliste.ts, public/_headers: das Paket
 *      liegt außerhalb von Precache und Budget.
 * Hier nur Typen; die Verdrahtung ist Schritt 5 (Prototyp).
 * Abhängigkeiten: React (Komponententypen), schnittstelle/*, spiel/partie.ts (Partieeinstellung),
 * ui/komponenten/partie/usePartie.ts (Partiesteuerung), training/wiederholung.ts.
 */
import type { ComponentType } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import type { Partieeinstellung } from "../../spiel/partie";
import type { Partiesteuerung } from "../../ui/komponenten/partie/usePartie";
import type { Gegnerprofil, Gegnerzustand, Gerechnetestaerke } from "./gegnerprofil";
import type { Paketzustand } from "./paket";
import type { Kipppunkt, Partieauftrag, Partieergebnis } from "./partie";
import type { Aufgabenauftrag, Aufgabenergebnis } from "./aufgaben";
import type { Abenteuerstand } from "./spielstand";

/** Kennung der Zusatzansicht in app/zusatzansichten.ts; der Wert ist frei für die Oberwelt. */
export const ANSICHT_ABENTEUER = "abenteuer";

/** Der Vertrag für Aufgabenrunden liegt in schnittstelle/aufgaben.ts. */
export type { Aufgabenauftrag, Aufgabenergebnis } from "./aufgaben";
/** Kennung der Zusatzansicht, in der die App eine Aufgabenrunde des Spiels spielt. */
export const ANSICHT_AUFGABEN = "abenteuer-aufgaben";
/**
 * Kennung der Zusatzansicht, in der eine Partie des Spiels läuft (Spielhülle, docs/spiel/18):
 * Brett, Uhren, Kartenleiste im Aussehen des Spiels statt der Partieansicht der App. Wert: Id der Partie.
 */
export const ANSICHT_PARTIE = "abenteuer-partie";

/**
 * Dienste, die die App dem Spiel beim Laden übergibt. Alles, was das Spiel von der App braucht,
 * geht durch dieses Objekt; nichts anderes importiert das Spiel aus `ui/` oder `speicher/`.
 */
export interface Appdienste {
  /** Aktuelle Wertung des Lesers (klassische Zeitklasse) oder null ohne Wertung. */
  readonly wertung: () => number | null;
  /**
   * Rechnet Profil und Zustand in Stufe je Phase und Häufigkeit um (reine Funktion des Spiels, hier
   * damit die App die Partieeinstellung bauen kann, ohne das Spiel zu kennen).
   */
  readonly baueEinstellung: (
    auftrag: Partieauftrag,
    staerke: Gerechnetestaerke,
  ) => Partieeinstellung;
  /** Legt die Partie an und wechselt in die Partieansicht; Ergebnis kommt über `liesErgebnis`. */
  readonly startePartie: (auftrag: Partieauftrag) => Promise<void>;
  /** Ergebnis einer beendeten Partie des Abenteuers, solange die App sie hält; null sonst. */
  readonly liesErgebnis: (kennung: string) => Promise<Partieergebnis | null>;
  /** Öffnet eine noch laufende Partie des Abenteuers wieder (Kennung des Partieauftrags). */
  readonly zeigePartie: (kennung: string) => void;
  /** Öffnet eine beendete Partie zum Nachspielen in der Hülle (Id der Partie in der App). */
  readonly zeigeBeendetePartie: (id: string) => void;
  /**
   * Sucht in einer verlorenen Partie den Kipppunkt (Regelwerk R14) mit der Engine der App; null,
   * wenn es keinen gibt oder die Partie nicht mehr in der App liegt.
   */
  readonly sucheKipppunkt: (kennung: string) => Promise<Kipppunkt | null>;
  /** Startet eine Aufgabenrunde in der App; das Ergebnis kommt beim Rückweg. */
  readonly starteAufgaben: (auftrag: Aufgabenauftrag) => Promise<void>;
  readonly liesAufgabenergebnis: (kennung: string) => Promise<Aufgabenergebnis | null>;
  /** Spielstand lesen und als Ganzes schreiben (Feld `abenteuer` der Nutzerdaten). */
  readonly liesStand: () => Abenteuerstand | null;
  readonly schreibeStand: (stand: Abenteuerstand) => Promise<void>;
  /** Löscht den Spielstand (neu beginnen); das Paket bleibt. */
  readonly loescheStand: () => Promise<void>;
  /** Zustand des Zusatzpakets und Laden mit Fortschritt. */
  readonly paket: () => Paketzustand;
  readonly ladePaket: (fortschritt: (geladen: number, gesamt: number) => void) => Promise<void>;
  /** Zurück zur vorigen Ansicht der App (Stapel), zum Beispiel nach dem Spielende. */
  readonly zurueck: () => void;
  /**
   * Buchkapitel, deren Übungen der Leser in der App alle gelöst hat (Lernkarten, docs/spiel/11,
   * Abschnitt 5). Beispiel: Kapitel 1 und 4 fertig → [1, 4].
   */
  readonly fertigeKapitel: () => readonly number[];
}

/** Was die Partieansicht einer Leiste gibt (ui/komponenten/partie/usePartie.ts, Partiesteuerung). */
export interface Leisteneigenschaften {
  readonly partiekennung: string;
  readonly steuerung: Partiesteuerung;
  readonly beiMarkierungen: (markierungen: readonly Markierung[]) => void;
}

/** Eine Partie-Erweiterung für den Erweiterungspunkt in Partie.tsx (Entscheidung A4). */
export interface Partieerweiterung {
  readonly kennung: string;
  /** Zeigt die Erweiterung diese Partie an? Nur für Partien mit Feld `abenteuer`. */
  readonly passt: (einstellung: Partieeinstellung) => boolean;
  /**
   * Die Leiste unter dem Brett: Partiekennung des Abenteuers, die Steuerung der Partie (Züge
   * spielen, zurücknehmen, ob die Engine denkt) und ein Rückruf für Markierungen am Brett.
   */
  readonly Leiste: ComponentType<Leisteneigenschaften>;
}

/**
 * Was das dynamisch geladene Modul exportiert. Die App ruft `verbinde(dienste)` einmal auf und
 * trägt danach `Oberwelt` als Zusatzansicht und `partieerweiterung` in Partie.tsx ein.
 */
export interface Abenteuermodul {
  readonly verbinde: (dienste: Appdienste) => void;
  /** Bildschirm der Oberwelt; der Wert der Ansicht ist frei (etwa „start“, „ort:ironwood“). */
  readonly Oberwelt: ComponentType<{ readonly wert: string | null }>;
  readonly partieerweiterung: Partieerweiterung;
  /** Für die Startkarte der App: Kurzstand („Club 3 von 8, 2 Clubnadeln“) oder null ohne Spielstand. */
  readonly kurzstand: () => { readonly clubs: number; readonly nadeln: number } | null;
}

/** Signatur des dynamischen Imports in der App; die Datei ist der Einstieg des Chunks. */
export type Modullader = () => Promise<Abenteuermodul>;

/** Für die Einstufung beim ersten Start (Entscheidung A5): Wertung der App oder erste Story-Partie. */
export type Eingangswertung =
  | { readonly art: "appWertung"; readonly elo: number }
  | { readonly art: "erstePartie"; readonly profil: Gegnerprofil; readonly zustand: Gegnerzustand };
