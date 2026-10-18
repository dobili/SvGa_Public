/**
 * Hilfe für Tests mit der echten Engine: ein Kanal zu Stockfish lite (ein Kern) unter Node.
 *
 * Rolle im Gesamtbild: In der App spricht der Engine-Dienst über einen Web Worker mit Stockfish;
 * die Tests ersetzen den Kanal durch das npm-Paket „stockfish“ (Konzept 8, austauschbarer Kanal).
 * Kein Test im Namen, damit Vitest die Datei nicht als Testdatei sammelt.
 * Abhängigkeiten: engineDienst.ts (Kanal), npm-Paket stockfish.
 */
import { createRequire } from "node:module";
import { EngineDienst, type Bewertung, type Kanal } from "./engineDienst";

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

/**
 * Suchtiefe der Engine-Tests. Warum feste Tiefe statt fester Zeit: Mit fester Zeit hängt das
 * Ergebnis von der Last des Rechners ab; auf dem ausgelasteten Prüfrechner (GitHub Actions) kam
 * Stockfish dann ab und zu zu einer anderen Fortsetzung, und ein Test scheiterte ohne Änderung am
 * Code. Mit fester Tiefe, einem Kern und derselben Reihenfolge der Aufträge rechnet Stockfish auf
 * jedem Rechner gleich.
 */
export const TESTTIEFE = Number(process.env.TESTTIEFE ?? "16");
/** Rechenzeit für Aufrufe über festeTiefe(): Sie wird dort nicht beachtet. */
export const ZEIT_UNBEACHTET_MS = 0;
/** Obergrenze je Auftrag bei fester Tiefe; die Tiefe beendet die Suche lange vorher. */
const FRIST_BEI_FESTER_TIEFE_MS = 45_000;

/**
 * Ein Bewerter wie der Engine-Dienst, der die Rechenzeit des Aufrufers durch eine feste Tiefe
 * ersetzt (siehe TESTTIEFE).
 * Eingaben: Engine-Dienst, Tiefe. Ausgabe: Objekt mit bewerte(fen, rechenzeitMs, varianten).
 * Beispiel: pruefeZentrumsschlag(festeTiefe(dienst), abbildung("2.40").fen, "e4", 0).
 */
export function festeTiefe(
  dienst: EngineDienst,
  tiefe = TESTTIEFE,
): { bewerte(fen: string, rechenzeitMs: number, varianten: number): Promise<Bewertung> } {
  return {
    bewerte: (fen, _rechenzeitMs, varianten) =>
      dienst.bewerte(fen, FRIST_BEI_FESTER_TIEFE_MS, varianten, { art: "tiefe", tiefe }),
  };
}
