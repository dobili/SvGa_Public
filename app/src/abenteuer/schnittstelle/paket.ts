/**
 * Zusatzpaket „Abenteuer“: der optionale Download mit Programm, Grafik, Musik, Karten und
 * Dialogen, außerhalb des Kerns der App.
 *
 * Rolle im Gesamtbild: Vorbild ist das Maia-Paket (app/maiapaket.ts): Die Seite lädt die Dateien
 * selbst in einen eigenen Cache, außerhalb des Workbox-Precache und des Größenbudgets
 * (skripte/pruefe-groesse.mjs, globIgnores in vite.config.ts). Unterschied zu Maia (Stellungnahme,
 * Abschnitt 4): Das Verzeichnis trägt eine Version und je Datei eine Prüfsumme, damit ein Update
 * des Spiels geänderte Dateien erkennt und nur sie nachlädt. Der Cache heißt
 * „abenteuer-<version>“; ältere Caches löscht das Spiel nach erfolgreichem Laden selbst.
 * Der Code des Spiels (Phaser, inkjs, Spiellogik) ist ein eigener Chunk mit dem Namensmuster
 * „assets/abenteuer-*.js“, der wie die Sprachpakete nicht zum Kern gehört (sw/dateiliste.ts).
 * Hier nur Typen; Laden, Prüfen und Löschen sind eine spätere Datei (paketlader.ts).
 * Abhängigkeiten: keine.
 */

/** Pfad des Pakets auf dem Server und im Build, relativ zur Basis der App. */
export const PAKET_PFAD = "abenteuer/";
/** Name der Verzeichnisdatei; sie wird zuletzt in den Cache gelegt und markiert „vollständig“. */
export const VERZEICHNIS_DATEI = "paket.json";
/** Höchste Dateigröße; Cloudflare nimmt höchstens 25 MiB, wir bleiben bei 15 MB wie Maia. */
export const HOECHSTE_DATEI_BYTES = 15 * 1024 * 1024;

/** Gruppe einer Datei; das Spiel kann Gruppen getrennt laden (Staffel 2 später, Musik zuletzt). */
export type Dateigruppe = "code" | "grafik" | "karten" | "dialoge" | "musik" | "klang" | "daten";

/** Eine Datei des Pakets. */
export interface Paketdatei {
  /** Pfad relativ zu PAKET_PFAD, zum Beispiel „grafik/karten/ironwood.aussen.webp“ (Rasterbilder als WebP). */
  readonly pfad: string;
  readonly bytes: number;
  /** SHA-256 als Hexzahl; geprüft nach dem Laden, wie beim Maia-Paket. */
  readonly sha256: string;
  readonly gruppe: Dateigruppe;
  /** Staffel, zu der die Datei gehört (1, 2); Staffel 2 wird erst geladen, wenn sie beginnt. */
  readonly staffel: number;
  /**
   * Nur Musik und Geräusche (seit 15.11.2026 aller Akte, auch Akt 1): Sie gehören nicht zum
   * Grundpaket. Der Ton des laufenden Akts lädt im Hintergrund nach, sobald das Spiel läuft, die
   * übrigen beim Betreten ihres Akts oder auf Wunsch im Spielmenü (paket/aktton.ts). Fehlt das
   * Feld, gehört die Datei zum Grundpaket. Ein Paket von vorher trägt es nur ab Akt 2.
   */
  readonly akt?: number;
  /**
   * Lädt nach dem Start im Hintergrund mit dem Ton des laufenden Akts, gehört aber zu keinem Akt
   * (seit 20.11.2026: Großbilder der Dialoge, bilder/). Warum: 3,3 MB weniger vor der ersten Karte
   * (Auftrag „Größe und Startzeit“); bis sie da sind, holt der Paketlader ein Bild aus dem Netz.
   */
  readonly hintergrund?: boolean;
}

/** Die Verzeichnisdatei des Pakets, beim Build erzeugt (skripte/baue-abenteuerpaket.mjs, später). */
export interface Paketverzeichnis {
  /** Version des Pakets, zum Beispiel „1.0.3“; neue Version = neuer Cache-Name. */
  readonly version: string;
  /** Version der App, mit der das Paket gebaut wurde; ein zu altes Paket wird neu geladen. */
  readonly appVersion: string;
  readonly dateien: readonly Paketdatei[];
  /** Summe der Bytes des Grundpakets (ohne Ton), für die Anzeige vor dem Laden. */
  readonly bytes: number;
}

/** Zustand des Pakets auf dem Gerät, für die Anzeige in den Einstellungen und auf der Startkarte. */
export type Paketzustand =
  /**
   * Fehlt; `bytes` ist die Größe des Grundpakets auf dem Server, wenn er antwortete. `neuerStand`:
   * Ein älteres Paket ist da, auf dem Server liegt eine neue Version (wird geladen, der Spielstand
   * bleibt; anbindung/maiapflicht.ts).
   */
  | { readonly art: "fehlt"; readonly bytes?: number; readonly neuerStand?: boolean }
  | { readonly art: "laedt"; readonly geladen: number; readonly gesamt: number }
  | { readonly art: "vorhanden"; readonly version: string; readonly bytes: number }
  /** Vorhanden, aber eine neuere Version liegt auf dem Server. */
  | { readonly art: "veraltet"; readonly version: string; readonly neu: string }
  | {
      readonly art: "fehler";
      readonly grund: "ohneNetz" | "pruefsumme" | "speicher" | "unbekannt";
    };

/** Fortschrittsmeldung beim Laden, byteweise wie beim Maia-Paket. */
export type Ladefortschritt = (geladen: number, gesamt: number) => void;
