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
import {
  appendFileSync,
  createReadStream,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
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

/** Prüfzeile der Tiefe 20 (fehlerpruefung.messung.ts): Art mit der aktuellen Erkennung neu. */
interface Pruefzeile {
  g: string;
  p: number;
  bester: string;
  verlust: number;
  art: string;
  antwort: string[];
}

/** Ordnet die Prüfzeilen der Tiefe 20 neu ein (Stellung und Zug aus der Auswahl). */
function pruefzeilenNeu(): void {
  const auswahlDatei = join(ORDNER, "pruefung-auswahl.jsonl");
  if (!existsSync(auswahlDatei)) return;
  const auswahl = new Map<string, { f: string; m: string }>();
  for (const z of readFileSync(auswahlDatei, "utf8")
    .split("\n")
    .filter((x) => x.trim())) {
    const a = JSON.parse(z) as { g: string; p: number; f: string; m: string };
    auswahl.set(`${a.g}:${a.p}`, a);
  }
  for (const datei of readdirSync(ORDNER).filter((d) => /^pruefung-\d+\.jsonl$/.test(d))) {
    const zeilen = readFileSync(join(ORDNER, datei), "utf8")
      .split("\n")
      .filter((x) => x.trim());
    const neu = zeilen.map((z) => {
      const r = JSON.parse(z) as Pruefzeile;
      const a = auswahl.get(`${r.g}:${r.p}`);
      const lage = a ? lageVon(a.f) : null;
      if (a && lage) r.art = fehlerartIn(lage, a.m, r.antwort, r.verlust, r.bester);
      return JSON.stringify(r);
    });
    writeFileSync(join(ORDNER, datei), neu.join("\n") + "\n");
  }
}

describe("Neuauswertung der Fehlerarten", () => {
  it("ordnet die Prüfzeilen der Tiefe 20 neu ein", () => {
    pruefzeilenNeu();
    expect(existsSync(ORDNER)).toBe(true);
  });

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
