/**
 * Typen der Phaser-Szene der Oberwelt: was die Szene meldet (Auslösertreffer, Melder) und was sie
 * zum Aufbau braucht (Szenendaten).
 *
 * Rolle im Gesamtbild: ausgelagert aus oberwelt/szene.ts, damit die Szene unter 400 Zeilen bleibt;
 * szene.ts gibt die Typen weiter, Aufrufer importieren sie wie bisher von dort.
 * Abhängigkeiten: schnittstelle/spielstand.ts, moebel.ts, belebungsschicht.ts, toenung.ts,
 * teilchen.ts (nur Typen).
 */
import type { Standbildindex } from "./figurzustand";
import type { Weltposition } from "../schnittstelle/spielstand";
import type { Belebungsbilder } from "./belebungsschicht";
import type { Heldhaelfte } from "./heldhaelfte";
import type { Moebel } from "./moebel";
import type { Teilchenart } from "./teilchen";
import type { Toenung } from "./toenung";

/** Ein Auslöser, auf dem der Held steht oder den er ansieht: Name und Art aus der Tiled-Datei. */
export interface Ausloesertreffer {
  readonly name: string;
  /**
   * „ausloeser“ (Übergang, Gegenstand, Start), „figur“ (Objekt mit type = figur) oder „statist“
   * (ansprechbarer Statist der Belebung, mit `sagt`).
   */
  readonly typ: "ausloeser" | "figur" | "statist";
  /** Der Held steht selbst darauf (true) oder nur davor (false). */
  readonly darauf: boolean;
  /** Er steht darauf und geht in den Durchgang: Erst dann wechselt ein Übergang die Karte. */
  readonly durch: boolean;
}

/** Was die Szene nach oben meldet. */
export interface Melder {
  /** Der Held steht auf einem Auslöser oder vor einer Figur, oder auf nichts (null). */
  readonly beiAusloeser: (treffer: Ausloesertreffer | null) => void;
  /** Der Held hat eine neue Kachel erreicht (für Anzeige und Oberflächentests), nur bei Änderung. */
  readonly beiKachel?: (x: number, y: number) => void;
  /** Der Held wechselt die Bildhälfte (heldhaelfte.ts): Hinweise an den anderen Rand legen. */
  readonly beiHeldhaelfte?: (haelfte: Heldhaelfte) => void;
}

/** Was die Szene zum Aufbau braucht. */
export interface Szenendaten {
  /** Die Tiled-Karte als Objekt (aus dem Paket gelesen). */
  readonly karte: object;
  /** Adressen der Bilder (Objekt-Adressen aus dem Paket). */
  readonly kachelbild: string;
  readonly heldbild: string;
  /** Spritesheet für alle Figuren ohne eigenes Bild (Platzhalter, 16 × 16). */
  readonly figurbild: string;
  /** Bogen des Helden im Format von LimeZu (figurbilder.ts); ohne gilt heldbild. */
  readonly heldfigur?: string | null;
  /** Bögen der Figuren dieser Karte im Format von LimeZu, nach Objektname. */
  readonly figurenbilder?: Readonly<Record<string, string>>;
  /** Figuren mit geist: true (geistfigur.ts, regeln/geist.ts), nach Objektname. */
  /** Weitere Standbilder je Figur der Karte (Objektname → Index, figurzustand.ts, Editor 1.9). */
  readonly figurstandbilder?: Readonly<Record<string, Standbildindex>>;
  readonly geister?: ReadonlySet<string>;
  /** Möbel und Schmuck der Karte (moebel.ts). */
  readonly moebel?: readonly Moebel[];
  /**
   * Hintergrundbild aus dem Kartenbauer (Boden und Wände der gekauften Grafik); mit ihm werden die
   * Kachelebenen nur noch für die Kollision gebraucht und nicht gezeichnet.
   */
  readonly hintergrund?: string | null;
  readonly kachelsatz: string; // Name des Kachelsatzes in der Tiled-Datei
  readonly start: Weltposition;
  /** Namen der Auslöser, die Übergänge sind: Sie lösen erst beim Gehen in den Durchgang aus. */
  readonly uebergaenge?: readonly string[];
  readonly melder: Melder;
  /** Rennen erlaubt (draußen, nicht auf dem Fahrrad; gangart.ts). */
  readonly rennenErlaubt?: boolean;
  readonly tempofaktor?: number; // Faktor auf das Lauftempo (Fahrrad draußen: 2; sonst 1)
  /** Faktor auf die Größe der Figuren (Innenräume: INNEN_FIGURFAKTOR, weltmassstab.ts; sonst 1). */
  readonly figurfaktor?: number;
  /** Bögen der Statisten und Tiere (belebungsschicht.ts), Pfad im Paket → Adresse. */
  readonly belebungsbilder?: Belebungsbilder;
  readonly stunde?: number; // Stunde der Spieluhr für die Statisten (`wann`); sonst die Uhr des Geräts
  readonly toenung?: Toenung | null; // Tönung der Karte (toenung.ts)
  readonly laterne?: boolean; // Der Held trägt eine Laterne (Lichtkreis bei „dunkel“)
  /** Winterkarte (winter.ts): Möbel umfärben, Schnee fallen lassen; sonst Teilchen der Karte (T8). */
  readonly winter?: boolean;
  readonly teilchen?: Teilchenart | null;
}
