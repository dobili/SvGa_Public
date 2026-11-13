/**
 * Porträtblätter (Wunsch des Haupt-Chats, 13.11.2026): je Figur ein Blatt mit sechs Fassungen à
 * 64 × 64 (3 × 2: neutral, lächelt, nachdenklich, überrascht, bitter, lacht) im privaten Paket.
 * Welche Fassung in welchem Feld liegt und welche Stimmung (#stimmung) welche Fassung zeigt, steht
 * in inhalte/abenteuer/portraetblatt.json (Schema abenteuer-portraetblatt), nicht im Code.
 *
 * Rolle im Gesamtbild: reine Rechnung für dialog/Portraet.tsx.
 * Abhängigkeiten: daten/generiert/abenteuer-portraetblatt.ts (Typ).
 */
import type { PortratblatterDesSchachAbenteuers } from "../../daten/generiert/abenteuer-portraetblatt";

export type Blattaufbau = PortratblatterDesSchachAbenteuers;

/** Lage eines Feldes auf dem Blatt (Spalte und Zeile, ab 0). */
export interface Blattfeld {
  readonly spalte: number;
  readonly zeile: number;
}

/** Fassung, die ein eigenes Gesicht ist (Ambrose jung), kein Ausdruck: eigenes Blatt. */
const EIGENES_BLATT = "jung";

/**
 * Pfad des Blatts. Beispiel: („coachDelgado“, „froh“) → „portraets/blatt/coach-delgado.png“;
 * („ambrose“, „jung“) → „portraets/blatt/ambrose-jung.png“.
 */
export function blattpfad(sprecher: string, stimmung: string | null): string {
  const name = sprecher.replace(/[A-Z]/g, (b) => `-${b.toLowerCase()}`);
  return `portraets/blatt/${name}${stimmung === EIGENES_BLATT ? "-jung" : ""}.png`;
}

/**
 * Das Feld zur Stimmung: Stimmung → Fassung (stimmungen), Fassung → Feld (fassungen); eine
 * Stimmung, die selbst eine Fassung ist, gilt direkt. Sonst die Grundfassung.
 * Beispiel (3 × 2): „froh“ → „laechelt“ → Feld 1 → Spalte 1, Zeile 0; „bitter“ → Feld 4 → (1, 1).
 */
export function blattfeld(aufbau: Blattaufbau, stimmung: string | null): Blattfeld {
  const fassung =
    (stimmung &&
      (aufbau.stimmungen[stimmung] ?? (stimmung in aufbau.fassungen ? stimmung : null))) ||
    aufbau.grundfassung;
  const feld = aufbau.fassungen[fassung] ?? aufbau.fassungen[aufbau.grundfassung] ?? 0;
  const gueltig = feld < aufbau.spalten * aufbau.zeilen ? feld : 0;
  return { spalte: gueltig % aufbau.spalten, zeile: Math.floor(gueltig / aufbau.spalten) };
}
