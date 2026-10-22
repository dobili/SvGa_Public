/**
 * Kopplung blinder Flecken mit Fehlerarten: Für jeden gespielten Zug der gespeicherten Stellungen
 * die Flecken des besten Zuges (eigener Zug übersehen) und der Widerlegung (Zug des Gegners
 * übersehen), ohne Engine.
 *
 * Rolle im Gesamtbild: Plan „Bots, zweite Runde“, Teil A (Hinweis des Autors, 22.10.2026: blinde
 * Flecken sind Ursachen, die sich mit den Fehlerarten überschneiden). Ausgabe `flecken.jsonl` im
 * Ordner der Rohdaten (nur lokal, MENSCHENPROFIL_ORDNER, Vorgabe ../buch/arbeit/menschenprofil2/neu).
 * Aufruf (im Ordner app/): npx vitest run --config vitest.messung.config.ts
 *   src/engine/blindeFlecken.kopplung.messung.ts
 * Abhängigkeiten: engine/blindeFlecken.ts.
 */
import { appendFileSync, createReadStream, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { describe, expect, it } from "vitest";
import { fenNachUci, fleckeVon } from "./blindeFlecken";

const ORDNER =
  process.env.MENSCHENPROFIL_ORDNER ??
  join(process.cwd(), "..", "buch", "arbeit", "menschenprofil2", "neu");
type Kandidat = [string, number, string, string[], string[]?];
const PUFFER = 2000;

/** Flecken von bestem Zug und Widerlegung des gespielten Zuges; null ohne gespielten Zug. */
function kopplung(zeile: string): string | null {
  const z = JSON.parse(zeile) as {
    g: string;
    p: number;
    f: string;
    m: string;
    k?: Kandidat[];
    x?: Kandidat[];
  };
  const gespielt = [...(z.k ?? []), ...(z.x ?? [])].find((k) => k[0] === z.m);
  const bester = z.k?.[0];
  if (!gespielt || !bester) return null;
  const danach = fenNachUci(z.f, z.m);
  const widerlegung = gespielt[4]?.[0];
  const gegner = danach && widerlegung ? fleckeVon(danach, widerlegung) : [];
  return JSON.stringify({ g: z.g, p: z.p, b: bester[3], w: gegner, e: fleckeVon(z.f, z.m) });
}

describe("Kopplung blinder Flecken", () => {
  it("schreibt die Flecken je gespieltem Zug", async () => {
    const ziel = join(ORDNER, "flecken.jsonl");
    writeFileSync(ziel, "");
    let zahl = 0;
    for (const datei of readdirSync(ORDNER).filter((d) => /^stellungen-\d+\.jsonl$/.test(d))) {
      let puffer: string[] = [];
      for await (const zeile of createInterface({ input: createReadStream(join(ORDNER, datei)) })) {
        const aus = zeile.trim() ? kopplung(zeile) : null;
        if (aus) puffer.push(aus);
        if (puffer.length >= PUFFER) {
          appendFileSync(ziel, puffer.join("\n") + "\n");
          zahl += puffer.length;
          puffer = [];
        }
      }
      appendFileSync(ziel, puffer.length > 0 ? puffer.join("\n") + "\n" : "");
      zahl += puffer.length;
    }
    expect(zahl).toBeGreaterThan(0);
  });
});
