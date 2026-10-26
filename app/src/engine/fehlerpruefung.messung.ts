/**
 * Gegenprüfung der Fehlererkennung mit tieferer Engine: Für eine Stichprobe gespielter Züge
 * (buch/arbeit/menschenprofil2/pruefung-auswahl.jsonl, auswahl.py) bewertet Stockfish in Tiefe 20
 * den besten Zug und den gespielten Zug neu. Daraus: Ist ein Fehler (ab 0,5) auch in Tiefe 20 einer,
 * bleibt die Fehlerart mit der tieferen Widerlegung gleich, und gehören bester Zug und Widerlegung
 * in Tiefe 20 zu denselben blinden Flecken?
 *
 * Rolle im Gesamtbild: Plan „Bots, zweite Runde“, Teil A (Wunsch des Autors, 22.10.2026: Fehler-,
 * Fleckraten und Kopplungen möglichst genau). Rohdaten nur lokal. Fortsetzbar: fertige Züge in der
 * Ausgabe `pruefung-<LAUF>.jsonl` werden übersprungen.
 * Umgebung: ENGINE_PFAD, TIEFE (Vorgabe 20), LAUF und LAEUFE (Aufteilung auf mehrere Prozesse),
 * AUSGABE (Vorsilbe der Ausgabedatei, Vorgabe „pruefung“; „schnell“ für die Gegenprobe der
 * schnellen Auswertung der Spielerprofile in Tiefe 12).
 * Aufruf (im Ordner app/): LAUF=0 LAEUFE=4 npx vitest run --config vitest.messung.config.ts
 *   src/engine/fehlerpruefung.messung.ts
 * Abhängigkeiten: engine/fehlerart.ts, engine/blindeFlecken.ts, engine/messung/nativeEngine.testhilfe.ts.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { fenNachUci, fleckeVon } from "./blindeFlecken";
import { fehlerartIn, lageVon } from "./fehlerart";
import { nativeEngine } from "./messung/nativeEngine.testhilfe";
import { wertFuer } from "./spielbewerter";

const ORDNER =
  process.env.MENSCHENPROFIL_ORDNER ??
  join(process.cwd(), "..", "buch", "arbeit", "menschenprofil2");
const ENGINE_PFAD =
  process.env.ENGINE_PFAD ??
  join(ORDNER, "..", "werkzeug", "stockfish", "stockfish-ubuntu-x86-64-avx2");
const TIEFE = Number(process.env.TIEFE ?? "20");
const LAUF = Number(process.env.LAUF ?? "0");
const LAEUFE = Number(process.env.LAEUFE ?? "1");
/** Die Tiefe begrenzt; die Rechenzeit ist nur ein Notanker. */
const RECHENZEIT_MS = 120_000;
const FORTSETZUNG_HALBZUEGE = 8;
const STELLEN = 100;

interface Auswahl {
  g: string;
  p: number;
  f: string;
  m: string;
  schicht: string;
}

const engine = nativeEngine(ENGINE_PFAD);

/** Neubewertung eines gespielten Zuges in der Tiefe der Prüfung; null, wenn etwas fehlt. */
async function pruefe(a: Auswahl) {
  const lage = lageVon(a.f);
  if (!lage) return null;
  const staerke = { art: "tiefe", tiefe: TIEFE } as const;
  const weiss = a.f.split(" ")[1] === "w";
  const beste = await engine.bewerte(a.f, RECHENZEIT_MS, 1, staerke);
  const gespielt = await engine.bewerte(a.f, RECHENZEIT_MS, 1, staerke, [a.m]);
  const b = beste.varianten[0];
  const s = gespielt.varianten[0];
  const bester = b?.zuege[0];
  if (!b || !s || !bester) return null;
  const bestwert = Math.max(wertFuer(b.wert, weiss), wertFuer(s.wert, weiss));
  const wert = wertFuer(s.wert, weiss);
  const verlust = bestwert - wert;
  const antwort = s.zuege.slice(1, 1 + FORTSETZUNG_HALBZUEGE);
  const danach = fenNachUci(a.f, a.m);
  return {
    g: a.g,
    p: a.p,
    bester,
    verlust: Math.round(verlust * STELLEN) / STELLEN,
    art: fehlerartIn(lage, a.m, antwort, verlust, bester),
    b: fleckeVon(a.f, bester),
    w: danach && antwort[0] ? fleckeVon(danach, antwort[0]) : [],
    antwort,
  };
}

describe("Fehlerprüfung", () => {
  it("bewertet die Stichprobe in größerer Tiefe neu", async () => {
    const ziel = join(ORDNER, `${process.env.AUSGABE ?? "pruefung"}-${LAUF}.jsonl`);
    const fertig = new Set(
      existsSync(ziel)
        ? readFileSync(ziel, "utf8")
            .split("\n")
            .filter((z) => z.trim())
            .map((z) => {
              const d = JSON.parse(z) as { g: string; p: number };
              return `${d.g}:${d.p}`;
            })
        : [],
    );
    const auswahl = readFileSync(join(ORDNER, "pruefung-auswahl.jsonl"), "utf8")
      .split("\n")
      .filter((z) => z.trim())
      .map((z) => JSON.parse(z) as Auswahl)
      .filter((_, i) => i % LAEUFE === LAUF);
    for (const a of auswahl) {
      if (fertig.has(`${a.g}:${a.p}`)) continue;
      const ergebnis = await pruefe(a);
      if (ergebnis) appendFileSync(ziel, JSON.stringify(ergebnis) + "\n");
    }
    expect(auswahl.length).toBeGreaterThan(0);
  });
});
