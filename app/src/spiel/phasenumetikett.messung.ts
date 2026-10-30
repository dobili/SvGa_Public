/**
 * Messhilfe (nur lokal): setzt in gespeicherten Stellungsdateien die Phase neu nach der Regel der
 * App, ohne die Engine-Bewertungen anzufassen.
 *
 * Rolle im Gesamtbild: Entscheidung 13 des Autors (30.10.2026): Nach der neuen Phasengrenze
 * (schach/phase.ts, 0.3.14) werden die Eichungen neu gerechnet. Die teure Arbeit (Bewertung jeder
 * Stellung in Tiefe 18) bleibt gültig; nur das Feld der Phase je Stellung ändert sich. Danach
 * rechnen die Skripte der Pipeline (etwa pipeline/menschenprofil/daten.py) wie gewohnt.
 * Aufruf: PHASE_EIN=<Ordner> PHASE_AUS=<Ordner> PHASE_FEN=f PHASE_FELD=ph \
 *   npx vitest run --config vitest.messung.config.ts src/spiel/phasenumetikett.messung.ts
 * Je Datei „*.jsonl“ im Eingangsordner entsteht dieselbe Datei im Ausgangsordner; Zeilen ohne
 * Stellung bleiben unverändert. Am Ende stehen die Zahl der geänderten Phasen und die Verteilung.
 * Mit PHASE_KARTE=1 entsteht statt der Kopien nur die Karte „phasenkarte.tsv“ (Partie, Halbzug,
 * neue Phase), für Dateien ohne Stellung (zuege.jsonl, zugwahl/stellungen.jsonl), die ein
 * Python-Schritt damit umschreibt; das spart Platz.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { it } from "vitest";
import { phaseVon } from "./phasen";

const EIN = process.env.PHASE_EIN ?? "";
const AUS = process.env.PHASE_AUS ?? "";
const FEN = process.env.PHASE_FEN ?? "f";
const FELD = process.env.PHASE_FELD ?? "ph";
const KARTE = process.env.PHASE_KARTE === "1";

/** Setzt die Phase einer Zeile neu; zählt Änderungen je Übergang. */
function umetikettieren(zeile: string, zaehler: Map<string, number>): string {
  if (!zeile.trim()) return zeile;
  const daten = JSON.parse(zeile) as Record<string, unknown>;
  const fen = daten[FEN];
  if (typeof fen !== "string") return zeile;
  const neu = phaseVon(fen);
  if (!neu) return zeile;
  const alt = String(daten[FELD] ?? "");
  const schluessel = `${alt}→${neu}`;
  zaehler.set(schluessel, (zaehler.get(schluessel) ?? 0) + 1);
  return JSON.stringify({ ...daten, [FELD]: neu });
}

it("setzt die Phase je Stellung neu", () => {
  if (!EIN || !AUS) throw new Error("PHASE_EIN und PHASE_AUS fehlen");
  mkdirSync(AUS, { recursive: true });
  const zaehler = new Map<string, number>();
  const karte: string[] = [];
  for (const datei of readdirSync(EIN).filter((d) => /^stellungen-\d+\.jsonl$/.test(d) || !KARTE)) {
    if (!datei.endsWith(".jsonl")) continue;
    const zeilen = readFileSync(join(EIN, datei), "utf8").split("\n");
    const neu = zeilen.map((z) => umetikettieren(z, zaehler));
    if (!KARTE) {
      writeFileSync(join(AUS, datei), neu.join("\n"));
      continue;
    }
    for (const z of neu) {
      if (!z.trim()) continue;
      const d = JSON.parse(z) as Record<string, unknown>;
      karte.push(`${String(d.g)}\t${String(d.p)}\t${String(d[FELD])}`);
    }
  }
  if (KARTE) writeFileSync(join(AUS, "phasenkarte.tsv"), `${karte.join("\n")}\n`);
  writeFileSync(join(AUS, "umetikett.json"), JSON.stringify(Object.fromEntries(zaehler), null, 1));
});
