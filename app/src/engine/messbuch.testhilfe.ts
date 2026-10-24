/**
 * Zug aus dem Praxisbuch in den Messläufen (0.2.128), wie in der App (ui/komponenten/botzug.ts).
 *
 * Rolle im Gesamtbild: Ausgelagert aus engine/stufen.messung.ts (Dateien unter 400 Zeilen). Die
 * Messung lädt das Buch der App aus public/daten/praxisbuch.json und verlangt es, damit gemessen
 * wird, was die App spielt. Abhängigkeiten: engine/praxisbuch.ts, engine/wahlmodell.ts,
 * spiel/zuege.ts.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Partiezug } from "../spiel/partie";
import { sanZuUci } from "../spiel/zuege";
import { praxisbuchAus, praxiszug } from "./praxisbuch";
import { wahltempo } from "./wahlmodell";

const PRAXISBUCH = praxisbuchAus(
  JSON.parse(readFileSync(join(process.cwd(), "public", "daten", "praxisbuch.json"), "utf8")),
);
if (!PRAXISBUCH) throw new Error("public/daten/praxisbuch.json fehlt oder ist kaputt");

/**
 * Ein Zug aus dem Praxisbuch oder null (Buchtiefe 0, Buch zu Ende oder Zug unpassend).
 * Eingaben: Buchtiefe des Spielers, seine Uhr (Zeitklasse; ohne Uhr Schnellschach), Wertung der
 * Stufe, alle Züge ab der Grundstellung (SAN), Stellung, Zufallsquelle.
 */
export function buchzug(
  buchtiefe: number,
  uhr: { readonly grundzeitMs: number; readonly zuschlagMs: number } | null,
  wertung: number,
  verlauf: readonly string[],
  fen: string,
  zufall: () => number,
): { zug: Partiezug; uci: string; breite?: number } | null {
  if (!PRAXISBUCH || buchtiefe === 0) return null;
  const tempo = uhr ? wahltempo(uhr) : "rapid";
  const san = praxiszug(PRAXISBUCH, verlauf, { tempo, wertung, tiefe: buchtiefe }, zufall);
  const uci = san ? sanZuUci(fen, san) : null;
  if (!san || !uci) return null;
  return { zug: { san, von: "engine", quelle: "buch", fehler: null, verlust: 0 }, uci };
}
