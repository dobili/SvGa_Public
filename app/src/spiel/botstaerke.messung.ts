/**
 * Messlauf „Spielstärke der Stufen“ (Rückfrage S23, 18.10.2026): Jede Stufe spielt gegen sich
 * selbst; die Partien gehen danach durch dieselbe Rechnung wie die Partien des Lesers.
 *
 * Rolle im Gesamtbild: Die Kurven Genauigkeit → Wertung (spiel/staerkemodell.ts) sind an Partien
 * zwischen etwa gleich starken Menschen geeicht (gewertete Partien von chess.com und Lichess).
 * Damit die Zahl einer Stufe nicht vom Gegner abhängt, spielt sie hier gegen eine gleich starke
 * Seite, nämlich sich selbst. Ablauf in drei Schritten, alles im Ordner app/:
 * 1. Partien spielen (dieser Lauf, Teil „spielen“): BOTSTAERKE_STUFEN="1,8" npm run messen:botstaerke
 *    (je Stufe 16 Partien, eine Datei je Stufe; mehrere Läufe nebeneinander mit anderen Stufen).
 * 2. Mit Tiefe 18 nachrechnen: node skripte/eichung-rechnen.mjs --ordner ../buch/arbeit/botstaerke
 *    --plattformen stufe-1,…,stufe-8
 * 3. Auswerten (Teil „auswerten“, BOTSTAERKE_AUSWERTEN=1): Genauigkeit je Seite, Spielstärke je
 *    Stufe mit der Rechnung über viele Partien; Ergebnis in ergebnis.json (lokal), die Zahlen
 *    kommen als Konstanten nach spiel/botstaerke.ts.
 * Die Spielschleife ist eine Abschrift aus engine/stufen.messung.ts: Jene Datei betreut die
 * Bot-Messung des anderen Arbeitsstrangs, und Messdateien lassen sich nicht importieren, ohne
 * ihre Läufe mitzustarten.
 * Abhängigkeiten: engine/nodeEngine.testhilfe.ts, engine/stufen.ts, spiel/, eichungsrechnung.ts.
 */
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import { stufe, type Stufe } from "../engine/stufen";
import { BUCHTREUE, STANDARDPROFIL } from "../engine/zugwahl";
import { werteAusEngine, type Rohwert } from "./eichungsrechnung";
import { engineZug } from "./enginezug";
import { LICHESS_REGLER, seitengenauigkeit } from "./genauigkeitsmodell";
import { neuePartie, stellungen, ziehe, type Partie } from "./partie";
import { staerkeUeberPartien } from "./staerkemodell";
import { fenNach } from "./zuege";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Zwei Halbzüge je Partie aus den Eröffnungen der Kapitel 2 und 3 (wie die Bot-Messung). */
const ANFAENGE: readonly (readonly string[])[] = [
  ["e4", "e5"],
  ["d4", "d5"],
  ["e4", "c5"],
  ["d4", "Nf6"],
  ["e4", "e6"],
  ["c4", "e5"],
  ["e4", "c6"],
  ["Nf3", "d5"],
];
const HOECHSTENS_HALBZUEGE = 240;
const STANDARD_PARTIEN = 16;
/** Wie die Eichung: Seiten mit weniger eigenen Zügen zählen nicht. */
const MINDESTENS_ZUEGE = 10;
const ORDNER =
  process.env.BOTSTAERKE_ORDNER ?? join(process.cwd(), "..", "buch", "arbeit", "botstaerke");
const STUFEN = (process.env.BOTSTAERKE_STUFEN ?? "1")
  .split(",")
  .map((s) => Number(s.trim()))
  .filter((n) => n >= 1);
const PARTIEN = Number(process.env.BOTSTAERKE_PARTIEN ?? STANDARD_PARTIEN);
const AUSWERTEN = process.env.BOTSTAERKE_AUSWERTEN === "1";

/** Fester Zufall (LCG) wie in der Bot-Messung, damit jede Partie nachvollziehbar ist. */
function zufallsquelle(saat: number): () => number {
  let stand = saat;
  return () => {
    stand = (stand * 48_271) % 2_147_483_647;
    return stand / 2_147_483_647;
  };
}

/** Eine Partie einer Stufe gegen sich selbst; beide Seiten ziehen über die Zugwahl der App. */
async function spiele(
  engine: ReturnType<typeof nodeEngine>,
  s: Stufe,
  anfang: readonly string[],
  zufall: () => number,
): Promise<Partie> {
  const start = anfang.reduce<string | null>(
    (fen, san) => (fen ? fenNach(fen, san) : null),
    GRUNDSTELLUNG,
  );
  const partie = neuePartie(
    {
      startFen: start ?? GRUNDSTELLUNG,
      eigeneFarbe: "black",
      stufe: s.nummer,
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: s.nummer, mittelspiel: s.nummer, endspiel: s.nummer },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: true,
    },
    "messung",
    new Date().toISOString(),
  );
  if (!partie) throw new Error("Startstellung nicht spielbar");
  let lauf = partie;
  while (lauf.ende === null && lauf.zuege.length < HOECHSTENS_HALBZUEGE) {
    const fen = stellungen(lauf).at(-1) ?? GRUNDSTELLUNG;
    const zug = await engineZug(engine, fen, s, [], zufall, BUCHTREUE, STANDARDPROFIL);
    if (!zug) break;
    const weiter = ziehe(lauf, { ...zug, von: "engine" });
    if (!weiter) throw new Error(`Zug geht nicht: ${zug.san} in ${fen}`);
    lauf = weiter;
  }
  return lauf;
}

/** Die Zeilen einer JSONL-Datei als Objekte. */
function zeilen(datei: string): Record<string, unknown>[] {
  if (!existsSync(datei)) return [];
  return readFileSync(datei, "utf8")
    .split("\n")
    .filter((z) => z.trim())
    .map((z) => JSON.parse(z) as Record<string, unknown>);
}

/** Innere Genauigkeit (Lichess-Rechnung) beider Seiten je bewerteter Partie, nach Stufe. */
function genauigkeitenJeStufe(): Map<string, number[]> {
  const ergebnis = new Map<string, number[]>();
  for (const name of readdirSync(ORDNER).filter((n) => /^bewertet-\d+\.jsonl$/.test(n))) {
    for (const z of zeilen(join(ORDNER, name))) {
      const werte = werteAusEngine(z.stellungen as Rohwert[]);
      const liste = ergebnis.get(String(z.plattform)) ?? [];
      for (const seite of ["white", "black"] as const) {
        const eigene = Math.floor((werte.length - (seite === "white" ? 0 : 1)) / 2);
        const g = seitengenauigkeit(werte, seite, LICHESS_REGLER);
        if (g !== null && eigene >= MINDESTENS_ZUEGE) liste.push(g);
      }
      ergebnis.set(String(z.plattform), liste);
    }
  }
  return ergebnis;
}

describe.skipIf(AUSWERTEN)(`Spielstärke der Stufen ${STUFEN.join(", ")}: spielen`, () => {
  const engine = nodeEngine();
  afterAll(() => engine.beendeEngine());

  it(`${PARTIEN} Partien je Stufe gegen sich selbst`, async () => {
    mkdirSync(ORDNER, { recursive: true });
    for (const nummer of STUFEN) {
      const datei = join(ORDNER, `stufe-${nummer}.jsonl`);
      const fertig = zeilen(datei).length;
      for (let i = fertig; i < PARTIEN; i += 1) {
        const anfang = ANFAENGE[i % ANFAENGE.length] ?? [];
        const partie = await spiele(engine, stufe(nummer), anfang, zufallsquelle(i + 1));
        const zeile = {
          plattform: `stufe-${nummer}`,
          kennung: `stufe-${nummer}-${String(i + 1).padStart(2, "0")}`,
          zuege: [...anfang, ...partie.zuege.map((z) => z.san)],
          ende: partie.ende?.art ?? "abbruch",
        };
        appendFileSync(datei, JSON.stringify(zeile) + "\n");
      }
      expect(zeilen(datei).length).toBeGreaterThanOrEqual(PARTIEN);
    }
  });
});

describe.skipIf(!AUSWERTEN)("Spielstärke der Stufen: auswerten", () => {
  it("Genauigkeit und Spielstärke je Stufe", () => {
    const jeStufe = genauigkeitenJeStufe();
    const ergebnis = [...jeStufe.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, liste]) => {
        const mittel = liste.reduce((s, x) => s + x, 0) / liste.length;
        return {
          stufe: name,
          seiten: liste.length,
          genauigkeit: Math.round(mittel * 10) / 10,
          staerke: staerkeUeberPartien(liste, liste.length),
        };
      });
    writeFileSync(join(ORDNER, "ergebnis.json"), JSON.stringify(ergebnis, null, 1));
    console.log(JSON.stringify(ergebnis, null, 1));
    expect(ergebnis.length).toBeGreaterThan(0);
  });
});
