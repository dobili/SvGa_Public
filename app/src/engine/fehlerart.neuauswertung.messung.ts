/**
 * Neuauswertung der Fehlerarten ohne Engine: ordnet jeden Kandidaten der gespeicherten Stellungen
 * (menschenprofil.messung.ts) mit der aktuellen Erkennung neu ein.
 *
 * Rolle im Gesamtbild: Plan „Bots, zweite Runde“, Teil A (0.2.118). Die Stellungen enthalten je
 * Kandidat die Fortsetzung der Engine (acht Halbzüge); daraus folgen Widerlegung und Verlust, die
 * Erkennung braucht also keine neue Engine-Rechnung. Rohdaten nur lokal (MENSCHENPROFIL_ORDNER,
 * Vorgabe ../buch/arbeit/menschenprofil2), Ausgabe `neu-<Datei>` daneben.
 * Aufruf (im Ordner app/): npx vitest run --config vitest.messung.config.ts
 *   src/engine/fehlerart.neuauswertung.messung.ts
 * Abhängigkeiten: engine/fehlerart.ts.
 */
import { createReadStream, existsSync, readdirSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { describe, expect, it } from "vitest";
import { fehlerartIn, lageVon } from "./fehlerart";

const ORDNER =
  process.env.MENSCHENPROFIL_ORDNER ??
  join(process.cwd(), "..", "buch", "arbeit", "menschenprofil2");
/** Kandidat wie gespeichert: Zug, Wert, Art, blinde Flecken, Fortsetzung. */
type Kandidat = [string, number, string, string[], string[]?];
/** So viele Zeilen sammelt der Lauf, bevor er schreibt. */
const PUFFER = 2000;

/** Ordnet die Kandidaten einer gespeicherten Zeile neu ein; unlesbare Zeilen bleiben. */
function neuEingeordnet(zeile: string): string {
  const roh = JSON.parse(zeile) as { f: string; k?: Kandidat[]; x?: Kandidat[] };
  const lage = roh.k && roh.k.length > 0 ? lageVon(roh.f) : null;
  if (!lage || !roh.k) return zeile;
  // Gezielt bewertete Züge (Gelegenheiten und der gespielte Zug) gehören dazu
  const bester = roh.k[0];
  const bestwert = Math.max(...roh.k.map((k) => k[1]));
  const besterZug = bester ? bester[0] : null;
  for (const k of [...roh.k, ...(roh.x ?? [])]) {
    k[2] = fehlerartIn(lage, k[0], k[4] ?? [], bestwert - k[1], besterZug);
  }
  return JSON.stringify(roh);
}

describe("Neuauswertung der Fehlerarten", () => {
  it("ordnet alle gespeicherten Stellungen neu ein", async () => {
    const dateien = readdirSync(ORDNER).filter((d) => /^stellungen-\d+\.jsonl$/.test(d));
    for (const datei of dateien) {
      const ziel = join(ORDNER, `neu-${datei}`);
      writeFileSync(ziel, "");
      const zeilen = createInterface({ input: createReadStream(join(ORDNER, datei)) });
      let puffer: string[] = [];
      for await (const zeile of zeilen) {
        if (zeile.trim()) puffer.push(neuEingeordnet(zeile));
        if (puffer.length >= PUFFER) {
          appendFileSync(ziel, puffer.join("\n") + "\n");
          puffer = [];
        }
      }
      appendFileSync(ziel, puffer.length > 0 ? puffer.join("\n") + "\n" : "");
      expect(existsSync(ziel)).toBe(true);
    }
  });
});
