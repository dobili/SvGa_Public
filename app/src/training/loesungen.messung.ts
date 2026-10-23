/**
 * Messlauf: Prüft die Musterlösungen des Taktiktrainers mit der Engine (R21, Wunsch des Autors
 * vom 19.10.2026: keine Musterlösung, die katastrophal schlechter ist als der beste Zug).
 *
 * Rolle im Gesamtbild: Läuft nicht in „npm run pruefen“, sondern einmalig über
 * `npx vitest run --config vitest.messung.config.ts src/training/loesungen.messung.ts`. Für
 * jeden Zug des Lesers in der Lösung rechnet Stockfish (feste Tiefe, ein Kern) den besten Zug und
 * genau den Lösungszug („searchmoves“). Katastrophal heißt: mehr als zwei Bauern schlechter, wobei
 * Werte über sechs Bauern (klar gewonnen, Matt) als gleich gelten. Das Ergebnis schreibt der Lauf
 * als JSON nach LOESUNGEN_ZIEL (Standard: Arbeitsordner der Pipeline, nur lokal).
 * Abhängigkeiten: engine/nodeEngine.testhilfe.ts, engine/spielbewerter.ts, spiel/zuege.ts.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { it } from "vitest";
import type { Taktikdaten } from "../daten/trainerdaten";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import { wertFuer } from "../engine/spielbewerter";
import { fenNach, sanZuUci } from "../spiel/zuege";

const DATEI = resolve(__dirname, "../../../inhalte/de/trainer/taktik.json");
const ZIEL = process.env.LOESUNGEN_ZIEL ?? resolve(__dirname, "../../../buch/arbeit/loesungen.json");
const TIEFE = Number(process.env.LOESUNGEN_TIEFE ?? "14");
const FRIST_MS = 60_000;
/** Ab hier gilt eine Stellung als klar entschieden; darüber zählt kein Unterschied mehr. */
const DECKEL = 6;
/** Mehr als so viele Bauern schlechter als der beste Zug ist katastrophal (Wunsch des Autors). */
export const KATASTROPHE_AB = 2;

const gedeckelt = (wert: number) => Math.max(-DECKEL, Math.min(DECKEL, wert));

interface Befund {
  readonly id: string;
  readonly quelle: string;
  readonly halbzug: number;
  readonly loesungszug: string;
  readonly besterZug: string;
  readonly verlust: number;
}

it("Musterlösungen des Taktiktrainers gegen die Engine", async () => {
  const daten = JSON.parse(readFileSync(DATEI, "utf8")) as Taktikdaten;
  const dienst = nodeEngine();
  const staerke = { art: "tiefe", tiefe: TIEFE } as const;
  const befunde: Befund[] = [];
  let geprueft = 0;
  for (const aufgabe of daten.aufgaben) {
    let fen = aufgabe.fen;
    for (const [i, zug] of aufgabe.loesung.entries()) {
      if (i % 2 === 0) {
        const weiss = fen.split(" ")[1] !== "b";
        const uci = sanZuUci(fen, zug);
        const beste = await dienst.bewerte(fen, FRIST_MS, 1, staerke);
        const eigen = uci ? await dienst.bewerte(fen, FRIST_MS, 1, staerke, [uci]) : null;
        const b = beste.varianten[0];
        const e = eigen?.varianten[0];
        geprueft += 1;
        if (b && e) {
          const verlust = gedeckelt(wertFuer(b.wert, weiss)) - gedeckelt(wertFuer(e.wert, weiss));
          if (verlust > KATASTROPHE_AB)
            befunde.push({
              id: aufgabe.id,
              quelle: aufgabe.herkunft.quelle,
              halbzug: i,
              loesungszug: zug,
              besterZug: b.zuege[0] ?? "",
              verlust: Math.round(verlust * 100) / 100,
            });
        }
      }
      const weiter = fenNach(fen, zug);
      if (!weiter) break;
      fen = weiter;
    }
  }
  dienst.beendeEngine();
  mkdirSync(dirname(ZIEL), { recursive: true });
  writeFileSync(ZIEL, JSON.stringify({ tiefe: TIEFE, geprueft, befunde }, null, 2));
  console.log(`geprüft ${geprueft} Züge, ${befunde.length} katastrophal → ${ZIEL}`);
});
