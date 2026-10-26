/**
 * Messlauf „Spielerprofil“: die Züge ausgewählter Spieler (je 20 bis 30 Partien eines Monats) mit
 * der Engine bewerten, für Fehlerraten je Spieler (Beta-Binomial-Modell, 90-%-Bereich der Spieler).
 *
 * Rolle im Gesamtbild: Plan „Bots, zweite Runde“ (Freigabe des Autors, 22.10.2026). Die Partien
 * sammelt pipeline/menschenprofil/spieler.py. Schlanker als menschenprofil.messung.ts: Bewertet
 * werden nur die Züge des ausgewählten Spielers, und je Stellung nur der beste Zug (eine Variante)
 * und der gespielte Zug mit Fortsetzung; daraus folgen Verlust, Fehlerart (mit der Widerlegung),
 * die blinden Flecken des besten Zuges und der Widerlegung. Werte in Bauerneinheiten aus Sicht des
 * Spielers. Rohdaten nur lokal (SPIELERPROFIL_ORDNER, Vorgabe ../buch/arbeit/spielerprofil).
 * Umgebung: ENGINE_PFAD, TIEFE (Vorgabe 12), LAUF und LAEUFE, MINUTEN. Fortsetzbar: fertige
 * Partien (Kennung und Spieler) stehen in `fertig-<LAUF>.txt`.
 * Aufruf (im Ordner app/): LAUF=0 LAEUFE=4 npx vitest run --config vitest.messung.config.ts
 *   src/engine/spielerprofil.messung.ts
 * Abhängigkeiten: engine/fehlerart.ts, engine/blindeFlecken.ts, engine/messung/nativeEngine.testhilfe.ts,
 * spiel/zuege.ts.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { fenNach, sanZuUci } from "../spiel/zuege";
import { fenNachUci, fleckeVon } from "./blindeFlecken";
import { fehlerartIn, lageVon } from "./fehlerart";
import { nativeEngine } from "./messung/nativeEngine.testhilfe";
import { wertFuer } from "./spielbewerter";

const ORDNER =
  process.env.SPIELERPROFIL_ORDNER ?? join(process.cwd(), "..", "buch", "arbeit", "spielerprofil");
const ENGINE_PFAD =
  process.env.ENGINE_PFAD ??
  join(ORDNER, "..", "werkzeug", "stockfish", "stockfish-ubuntu-x86-64-avx2");
const TIEFE = Number(process.env.TIEFE ?? "12");
const LAUF = Number(process.env.LAUF ?? "0");
const LAEUFE = Number(process.env.LAEUFE ?? "1");
const MINUTEN = Number(process.env.MINUTEN ?? "100000");
const MS_JE_MINUTE = 60_000;
/** Die Tiefe begrenzt; die Rechenzeit ist nur ein Notanker. */
const RECHENZEIT_MS = 60_000;
const FORTSETZUNG_HALBZUEGE = 8;
const STELLEN = 100;
const ZWEI_VARIANTEN = 2;
const HUNDERTSTEL_JE_SEKUNDE = 100;
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

interface Spielerpartie {
  kennung: string;
  spieler: string;
  farbe: "weiss" | "schwarz";
  tempo: string;
  kategorie: number;
  start: number;
  zuschlag: number;
  weiss: number;
  schwarz: number;
  zuege: string[];
  uhren: number[];
}

const engine = nativeEngine(ENGINE_PFAD);

function gerundet(x: number): number {
  return Math.round(x * STELLEN) / STELLEN;
}

/** Bewertet einen Zug des Spielers: bester Zug, gespielter Zug, Art und Flecken. */
async function stellung(fen: string, gespielt: string) {
  const lage = lageVon(fen);
  if (!lage) return null;
  const staerke = { art: "tiefe", tiefe: TIEFE } as const;
  const weiss = fen.split(" ")[1] === "w";
  // Zwei Varianten (seit 23.10.2026): Der Abstand zum zweitbesten Zug zeigt, ob der beste Zug klar
  // der beste ist; nur dann ist sein blinder Fleck aussagekräftig (Gegenprobe gegen Tiefe 20)
  const beste = await engine.bewerte(fen, RECHENZEIT_MS, ZWEI_VARIANTEN, staerke);
  const b = beste.varianten[0];
  const zweite = beste.varianten[1];
  const bester = b?.zuege[0];
  if (!b || !bester) return null;
  const s =
    bester === gespielt
      ? b
      : (await engine.bewerte(fen, RECHENZEIT_MS, 1, staerke, [gespielt])).varianten[0];
  if (!s) return null;
  const wert = wertFuer(s.wert, weiss);
  const bestwert = Math.max(wertFuer(b.wert, weiss), wert);
  const verlust = bestwert - wert;
  const antwort = s.zuege.slice(1, 1 + FORTSETZUNG_HALBZUEGE);
  const danach = fenNachUci(fen, gespielt);
  return {
    ph: lage.phase,
    b: bester,
    bw: gerundet(bestwert),
    b2: zweite?.zuege[0] ?? null,
    w2: zweite ? gerundet(wertFuer(zweite.wert, weiss)) : null,
    w: gerundet(wert),
    a: fehlerartIn(lage, gespielt, antwort, verlust, bester),
    fb: fleckeVon(fen, bester),
    fw: danach && antwort[0] ? fleckeVon(danach, antwort[0]) : [],
    pv: antwort,
  };
}

/** Alle Stellungen des Spielers in einer Partie, je eine Zeile. */
async function partie(p: Spielerpartie, ziel: string): Promise<void> {
  const eigene = p.farbe === "weiss" ? 0 : 1;
  let fen = GRUNDSTELLUNG;
  for (let i = 0; i < p.zuege.length; i += 1) {
    const san = p.zuege[i] as string;
    const uci = sanZuUci(fen, san);
    if (!uci) return;
    if (i % 2 === eigene) {
      const daten = await stellung(fen, uci);
      const vorher = i >= 2 ? (p.uhren[i - 2] as number) : p.start * HUNDERTSTEL_JE_SEKUNDE;
      const zeit =
        i >= 2 ? vorher - (p.uhren[i] as number) + p.zuschlag * HUNDERTSTEL_JE_SEKUNDE : null;
      if (daten) {
        const kopf = {
          g: p.kennung,
          s: p.spieler,
          t: p.tempo,
          k: p.kategorie,
          p: i,
          u: vorher,
          v: zeit,
        };
        appendFileSync(ziel, JSON.stringify({ ...kopf, f: fen, m: uci, ...daten }) + "\n");
      }
    }
    const naechste = fenNach(fen, san);
    if (!naechste) return;
    fen = naechste;
  }
}

describe("Spielerprofil", () => {
  it("wertet die Züge der ausgewählten Spieler aus", async () => {
    const quelle = join(ORDNER, "spielerpartien.jsonl");
    expect(existsSync(quelle)).toBe(true);
    const fertigDatei = join(ORDNER, `fertig-${LAUF}.txt`);
    const fertig = new Set(
      existsSync(fertigDatei) ? readFileSync(fertigDatei, "utf8").split("\n") : [],
    );
    const ziel = join(ORDNER, `stellungen-${LAUF}.jsonl`);
    const ende = Date.now() + MINUTEN * MS_JE_MINUTE;
    const alle = readFileSync(quelle, "utf8").split("\n");
    let gemacht = 0;
    for (let i = LAUF; i < alle.length && Date.now() < ende; i += LAEUFE) {
      const zeile = alle[i];
      if (!zeile?.trim()) continue;
      let p: Spielerpartie;
      try {
        p = JSON.parse(zeile) as Spielerpartie;
      } catch {
        // Die letzte Zeile kann noch geschrieben werden, während der Sammler läuft
        continue;
      }
      const schluessel = `${p.kennung}:${p.spieler}`;
      if (fertig.has(schluessel)) continue;
      await partie(p, ziel);
      appendFileSync(fertigDatei, schluessel + "\n");
      gemacht += 1;
    }
    engine.beendeEngine();
    console.log(`Lauf ${LAUF}: ${gemacht} Partien ausgewertet`);
  });
});
