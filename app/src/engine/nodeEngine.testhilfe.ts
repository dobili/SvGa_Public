/**
 * Hilfe für Tests mit der echten Engine: ein Kanal zu Stockfish lite (ein Kern) unter Node.
 *
 * Rolle im Gesamtbild: In der App spricht der Engine-Dienst über einen Web Worker mit Stockfish;
 * die Tests ersetzen den Kanal durch das npm-Paket „stockfish“ (Konzept 8, austauschbarer Kanal).
 * Kein Test im Namen, damit Vitest die Datei nicht als Testdatei sammelt.
 * Abhängigkeiten: engineDienst.ts (Kanal), npm-Paket stockfish.
 */
import { createRequire } from "node:module";
import { EngineDienst, type Kanal } from "./engineDienst";

interface NodeEngine {
  processCommand(befehl: string): void;
  terminate(): void;
}
type EngineFabrik = (art: string, beiZeile: (zeile: string) => void) => NodeEngine;
const benoetige = createRequire(import.meta.url);

/** Ein Kanal zu Stockfish lite unter Node. */
export function nodeKanal(): Kanal {
  const ladeEngine = benoetige("stockfish") as EngineFabrik;
  let empfaenger: (zeile: string) => void = () => undefined;
  const sf = ladeEngine("lite-single", (zeile) => empfaenger(zeile));
  return {
    senden: (befehl) => sf.processCommand(befehl),
    beiZeile: (neu) => {
      empfaenger = neu;
    },
    beenden: () => sf.terminate(),
  };
}

/** Ein eigener Engine-Dienst für einen Test; nach dem Test mit beendeEngine() schließen. */
export function nodeEngine(): EngineDienst {
  return new EngineDienst(nodeKanal);
}
