/**
 * Tausch und Freundeskarte per QR-Code: lokal zwischen zwei Geräten, ohne Konto und Server.
 *
 * Rolle im Gesamtbild: Das Konzept sieht Tauschen „Karte gegen Karte“ und eine Freundeskarte vor,
 * die zur Installation führt und dem Freund eine Starterkarte schenkt (Dokument 02, 3.6). Ein
 * QR-Code trägt höchstens etwa 2,9 KB; deshalb gehen hier nur Karten und Grüße durch, nie der
 * Spielstand (der geht über die Sicherungsdatei der App, Stellungnahme Abschnitt 4).
 * Der Tausch ist ein Zwei-Schritt-Verfahren: Gerät A zeigt ein Angebot, Gerät B liest es und zeigt
 * die Annahme, Gerät A liest die Annahme. Ohne Server kann niemand prüfen, ob eine Karte „echt“ ist;
 * das ist in Ordnung, weil nichts gekauft oder verkauft wird.
 * Hier nur Typen; Erzeugen und Lesen der Codes (Kamera der App ist heute nicht erlaubt, siehe
 * public/_headers Permissions-Policy camera=()) sind eine Frage für den Autor vor der Umsetzung.
 * Abhängigkeiten: keine.
 */

/** Kennzeichen am Anfang jedes Codes, damit die App fremde Codes erkennt. */
export const CODE_KENNUNG = "svga-abenteuer-1";

/** Angebot von Gerät A: diese Karte gegen jene Karte (oder gegen irgendeine). */
export interface Tauschangebot {
  readonly kennung: typeof CODE_KENNUNG;
  readonly art: "angebot";
  /** Zufällige Kennung dieses Tauschs, damit die Annahme passt. */
  readonly tausch: string;
  readonly gebe: string;
  /** null: nimmt jede Karte. */
  readonly moechte: string | null;
  /** Vorname oder Spitzname des Anbietenden, nur zur Anzeige. */
  readonly von: string;
}

/** Annahme von Gerät B. */
export interface Tauschannahme {
  readonly kennung: typeof CODE_KENNUNG;
  readonly art: "annahme";
  readonly tausch: string;
  readonly gebe: string;
  readonly von: string;
}

/** Freundeskarte: führt zur Installationsseite und schenkt eine Starterkarte (einmal je Freund). */
export interface Freundeskarte {
  readonly kennung: typeof CODE_KENNUNG;
  readonly art: "freund";
  readonly von: string;
  readonly starterkarte: string;
}

export type Tauschcode = Tauschangebot | Tauschannahme | Freundeskarte;
