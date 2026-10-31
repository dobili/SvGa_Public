/**
 * Nachrichten zwischen der App und dem Maia-Worker (engine/maiaWorker.ts).
 *
 * Rolle im Gesamtbild: Seit 0.3.39 rechnet Maia in einem eigenen Thread (Wunsch des Autors,
 * 31.10.2026: Auf einem älteren Handy hing die Zuganimation, weil das Netz im selben Thread wie
 * die Oberfläche rechnete). Die App liest Laufzeit und Netze wie bisher aus dem Speicher des
 * Pakets und reicht sie einmal hinüber; je Zug geht nur das Brett hin und die Logits zurück.
 * Jede Anfrage trägt eine Nummer, die Antwort dieselbe.
 * Abhängigkeiten: engine/maia.ts (Modellnamen).
 */
import type { Maiamodell } from "./maia";

/** Von der App an den Worker. */
export type AnMaia =
  | {
      /** Lädt die Laufzeit (WebAssembly) und das Netz eines Modells. */
      readonly art: "lade";
      readonly nr: number;
      readonly modell: Maiamodell;
      readonly laufzeit: ArrayBuffer;
      readonly netz: ArrayBuffer;
    }
  | {
      /** Rechnet die Logits für ein Brett (Eingabe wie engine/maia.ts, kodiere). */
      readonly art: "rechne";
      readonly nr: number;
      readonly modell: Maiamodell;
      readonly brett: Float32Array;
      readonly eloSelbst: number;
      readonly eloGegner: number;
    };

/** Vom Worker an die App: Ergebnis (bei „lade“ ohne Logits) oder Fehler. */
export type VonMaia =
  | { readonly nr: number; readonly art: "fertig"; readonly logits?: Float32Array }
  | { readonly nr: number; readonly art: "fehler"; readonly meldung: string };
