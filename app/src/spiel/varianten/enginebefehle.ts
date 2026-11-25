/**
 * Engine-Befehle einer Variante (Auftrag des Hauptchats, 26.11.2026): Was die Engineanbindung vor
 * der Partie an Fairy-Stockfish (oder Stockfish) schickt, und welche Datei sie dafür ablegt.
 *
 * Warum rein und eigen: Die Engineanbindung (engine/) und die Variantenmodule anderer Chats sollen
 * dieselbe Übersetzung benutzen. Eingebaute Varianten von Fairy-Stockfish brauchen nur
 * `setoption name UCI_Variant value <name>`; Varianten mit eigenen Figuren stehen als Abschnitt im
 * Format von variants.ini. Die Engine liest ihn aus einer Datei: Im WebAssembly-Build legt die
 * Anbindung die Datei im Dateisystem der Engine ab (`VARIANTENDATEI`) und setzt `VariantPath`
 * darauf, bevor sie `UCI_Variant` setzt.
 * Abhängigkeiten: spiel/varianten/variante.ts (Typen).
 */
import type { Engineangabe } from "./variante";

/** Pfad der Variantendatei im Dateisystem der Engine (WebAssembly, Emscripten). */
export const VARIANTENDATEI = "/varianten.ini";

/** Was vor der Partie zu tun ist: Dateien ablegen, dann die Befehle in dieser Reihenfolge senden. */
export interface Enginevorbereitung {
  readonly dateien: readonly { readonly pfad: string; readonly inhalt: string }[];
  readonly befehle: readonly string[];
}

/**
 * Die Vorbereitung für eine Engineangabe.
 * Beispiele: { fairy, uciVariante: "3check" } → befehle ["setoption name UCI_Variant value 3check"];
 * { stockfish, optionen: { UCI_Chess960: "true" } } → ["setoption name UCI_Chess960 value true"];
 * { fairy, uciVariante: "drache", ini: "[drache:chess]…" } → Datei /varianten.ini, dann
 * „setoption name VariantPath value /varianten.ini“ und UCI_Variant drache.
 */
export function enginevorbereitung(angabe: Engineangabe): Enginevorbereitung {
  const befehle: string[] = [];
  const dateien = angabe.ini ? [{ pfad: VARIANTENDATEI, inhalt: angabe.ini }] : [];
  if (angabe.ini) befehle.push(`setoption name VariantPath value ${VARIANTENDATEI}`);
  if (angabe.uciVariante) befehle.push(`setoption name UCI_Variant value ${angabe.uciVariante}`);
  for (const [name, wert] of Object.entries(angabe.optionen ?? {})) {
    befehle.push(`setoption name ${name} value ${wert}`);
  }
  return { dateien, befehle };
}
