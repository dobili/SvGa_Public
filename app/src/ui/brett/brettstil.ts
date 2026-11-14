/**
 * Brettstil von außen: eine Überschreibung von Feldfarben, Figuren und Markierungsfarben für alle
 * Bretter darunter, ohne die Wahl des Lesers in den Einstellungen anzutasten.
 *
 * Rolle im Gesamtbild: Das Schach-Abenteuer zeigt je Ort und Gegner ein eigenes Brett mit
 * Pixelfiguren (docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5; abenteuer/brett/). Seine
 * Vollbildansichten setzen den Stil, solange sie offen sind (setzeBrettstil); Brett.tsx,
 * Figur.tsx und Brettmarken.tsx lesen ihn. Ohne Stil (die ganze App) gilt die Wahl des Lesers.
 * Warum ein kleiner Speicher statt eines React-Kontexts: So genügt in den Ansichten ein Hook,
 * ohne ihren Aufbau umzustellen; es ist immer höchstens eine Vollbildansicht offen.
 * Abhängigkeiten: masse.ts (Brettpalette), analyse/werkzeug.ts (Markierungsfarben).
 */
import { useSyncExternalStore, type ComponentType, type CSSProperties } from "react";
import type { Markierungsfarbe } from "../../analyse/werkzeug";
import { FARBEN, type Brettpalette } from "./masse";

/** Eingaben einer Figur, wie Figur.tsx sie bekommt (linke obere Ecke des Feldes). */
export interface Figurzeichnung {
  readonly zeichen: string;
  readonly x: number;
  readonly y: number;
}

/** Eingaben einer Feldmarke für den letzten Zug, wie Schimmer in Brettmarken.tsx. */
export interface Zugmarkenzeichnung {
  readonly feld: string;
  readonly gedreht: boolean;
  readonly farbe: string;
}

/** Farben der Markierungen (Pfeile, Feldrahmen) und ihre Kontur. */
export interface Markenfarben {
  readonly kontur: string;
  readonly farben: Readonly<Record<Markierungsfarbe, string>>;
}

/** Was ein Brettstil überschreibt; jedes Feld ist für sich wahlweise. */
export interface Brettstilvorgabe {
  /** Feldfarben, Schimmer und Buchfigurenfarbe statt der Einstellung „Brettfarben“. */
  readonly palette: Brettpalette;
  /** Zeichnet eine Figur statt des Figurensatzes des Lesers (Klasse „brett-figur“ setzen). */
  readonly Figur?: ComponentType<Figurzeichnung>;
  /** Liegt über den Feldern und unter allen Marken, etwa eine feine Pixelstruktur. */
  readonly Unterlage?: ComponentType;
  /** Marke für Start- und Zielfeld des letzten Zuges statt des Schimmers. */
  readonly Zugmarke?: ComponentType<Zugmarkenzeichnung>;
  readonly markenfarben?: Markenfarben;
  /** Zusätzliche Klasse und Stil für das äußere Element des Brettes (Rahmen). */
  readonly klasse?: string;
  readonly stil?: CSSProperties;
}

/** Der gesetzte Stil; null heißt: kein Stil von außen, es gilt die Wahl des Lesers. */
let gesetzt: Brettstilvorgabe | null = null;
const hoerer = new Set<() => void>();

/**
 * Setzt den Stil für alle Bretter und gibt zurück, wie er wieder entfernt wird.
 *
 * Eingabe: Vorgabe oder null. Ausgabe: Aufräumen; es entfernt den Stil nur, wenn noch derselbe
 * gilt, damit eine schon geöffnete neue Ansicht ihren Stil behält.
 * Beispiel: Die Partie gegen Big Joe in Ironwood setzt „stahl“ und räumt beim Verlassen auf.
 */
export function setzeBrettstil(vorgabe: Brettstilvorgabe | null): () => void {
  gesetzt = vorgabe;
  hoerer.forEach((h) => h());
  return () => {
    if (gesetzt !== vorgabe) return;
    gesetzt = null;
    hoerer.forEach((h) => h());
  };
}

function abonniere(hoere: () => void): () => void {
  hoerer.add(hoere);
  return () => hoerer.delete(hoere);
}

/** Der Stil von außen oder null; Bretter zeichnen sich bei einem Wechsel neu. */
export function useBrettstil(): Brettstilvorgabe | null {
  return useSyncExternalStore(
    abonniere,
    () => gesetzt,
    () => null,
  );
}

/** Markierungsfarben wie im Buch (Konzept 10.3), wenn kein Stil sie ändert. */
const BUCHMARKEN: Markenfarben = {
  kontur: FARBEN.navy,
  farben: {
    gold: FARBEN.gold,
    rot: FARBEN.rot,
    grau: FARBEN.grau,
    gruen: FARBEN.gruen,
    blau: FARBEN.blau,
  },
};

/**
 * Farben der Markierungen für Brettmarken.tsx: die des Stils oder die des Buches.
 *
 * Beispiel: ohne Stil ist Rot „#DC4444“ mit Navy-Kontur; auf dem Schieferbrett des Abenteuers
 * ein helleres Rot mit dunkler Kontur, damit der Pfeil auf beiden Feldfarben sichtbar bleibt.
 */
export function useMarkenfarben(): Markenfarben {
  return useBrettstil()?.markenfarben ?? BUCHMARKEN;
}
