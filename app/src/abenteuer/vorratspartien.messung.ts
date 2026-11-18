/**
 * Partien App-Bot gegen App-Bot für den Stellungsvorrat der kurzen Partieformen (Regelwerk R13).
 *
 * Warum: Der Autor wünscht (18.11.2026), dass die Startstellungen von Stellungsduell, „Vorteil
 * herausarbeiten“ und Endspiel menschlich aussehen: mit typischen Fehlern, Stilen und Maia, nicht
 * wie aus Stockfish mit Skill Level. Deshalb spielen hier zwei vorgefertigte Bots der App
 * gegeneinander, über denselben Zugweg wie in einer Partie der App: Stufen je Phase (höchstens eine
 * Stufe je Zug weiter), Fehlerarten und Gewichte der Persönlichkeit, Stil, Maia an (wie
 * abenteuer/anbindung/partiestart.ts mit „mitMaia“) und die Eröffnung aus dem Praxisbuch
 * (EROEFFNUNG_PRAXIS, Buchtiefe des Bots wie ui/komponenten/partie/botzug.ts).
 *
 * Rolle im Gesamtbild: Erster Schritt der Vorratserzeugung. Dieser Lauf schreibt nur die Partien
 * (Züge und Herkunft) nach buch/arbeit/vorratspartien/BAND.json (nur lokal); die Auswahl der
 * Stellungen (Phase, Fenster je Format, Tiefe 12) macht danach
 * `python -m pipeline.abenteuer.stellungsvorrat --aus-partien buch/arbeit/vorratspartien`.
 * Kein Test der Prüfkette (vitest.messung.config.ts), dauert je Partie etwa eine bis drei Minuten.
 *
 * Aufruf (im Ordner app/, je Band ein Lauf, gern parallel):
 *   VORRAT_BAND=band3 VORRAT_PARTIEN=24 npx vitest run --config vitest.messung.config.ts \
 *     src/abenteuer/vorratspartien.messung.ts
 * Weitere Umgebung: VORRAT_SAAT_AB (zweite Stichprobe), VORRAT_ZIEL (Ordner der Ergebnisse).
 * Abhängigkeiten: engine/messung/messspieler.testhilfe.ts (Bots wie in der App, Maia unter Node),
 * engine/messung/messbuch.testhilfe.ts (Praxisbuch), spiel/enginezug.ts, spiel/partie.ts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { tagesform } from "../engine/menschlich";
import { buchzug } from "../engine/messung/messbuch.testhilfe";
import { alleGleich, spieler, type Spieler } from "../engine/messung/messspieler.testhilfe";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import type { EngineDienst } from "../engine/engineDienst";
import { GEGNER } from "../engine/gegner";
import { naechsteStufe, stufe, type Stufe, type Stufennummer } from "../engine/stufen";
import { BUCHTREUE } from "../engine/zugwahl";
import { engineZugMitLage } from "../spiel/enginezug";
import { neuePartie, stellungen, ziehe, type Partie } from "../spiel/partie";
import { phaseVon } from "../spiel/phasen";
import { vorratspaarungen, VORRATSBOTS, type Vorratsband } from "./vorratsbots";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Wie LETZTER_HALBZUG der Pipeline: später sucht die Auswahl keine Stellung mehr. */
const HOECHSTENS_HALBZUEGE = 160;
const STANDARD_PARTIEN = 24;

/** Eine gespielte Partie mit Herkunft (welche Bots, welche Stile). */
interface Vorratspartie {
  readonly band: Vorratsband;
  readonly saat: number;
  readonly weiss: { readonly bot: string; readonly stil: string };
  readonly schwarz: { readonly bot: string; readonly stil: string };
  readonly ergebnis: string;
  /** Alle Züge ab der Grundstellung in SAN (englisch). */
  readonly zuege: readonly string[];
}

/** Fester Zufall (LCG wie engine/stufen.messung.ts), damit jede Partie nachvollziehbar ist. */
function zufallsquelle(saat: number): () => number {
  let stand = saat;
  return () => {
    stand = (stand * 48_271) % 2_147_483_647;
    return stand / 2_147_483_647;
  };
}

/** Die Stufe für diesen Zug: Stufe der Phase, Zug für Zug höchstens eine Stufe weiter (App). */
function stufeFuer(s: Spieler, fen: string, letzte: Stufennummer | null): Stufe {
  const ziel = s.stufen[phaseVon(fen) ?? "mittelspiel"];
  return stufe(letzte ? naechsteStufe(letzte, ziel) : ziel);
}

function neueVorratspartie(): Partie {
  const partie = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "black",
      stufe: 1,
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: alleGleich(1),
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: false,
    },
    "vorrat",
    new Date().toISOString(),
  );
  if (!partie) throw new Error("Grundstellung nicht spielbar");
  return partie;
}

/** Spielt eine Partie; beide Seiten ziehen über Praxisbuch und Zugwahl der App. */
async function spiele(
  engine: EngineDienst,
  weiss: Spieler,
  schwarz: Spieler,
  saat: number,
): Promise<Partie> {
  const zufall = zufallsquelle(saat);
  const letzte: (Stufennummer | null)[] = [null, null];
  let lauf = neueVorratspartie();
  while (lauf.ende === null && lauf.zuege.length < HOECHSTENS_HALBZUEGE) {
    const seite = lauf.zuege.length % 2;
    const s = seite === 0 ? weiss : schwarz;
    const fen = stellungen(lauf).at(-1) ?? GRUNDSTELLUNG;
    const st = stufeFuer(s, fen, letzte[seite] ?? null);
    letzte[seite] = st.nummer;
    const verlauf = { tagesform: tagesform(`${saat}-${seite}`) };
    const profil = { ...s.profil, verlauf };
    const san = lauf.zuege.map((z) => z.san);
    const ergebnis =
      buchzug(s.buchtiefe, s.uhr, st.wertung, san, fen, zufall) ??
      (await engineZugMitLage(engine, fen, st, [], zufall, BUCHTREUE, profil));
    if (!ergebnis) break;
    const weiter = ziehe(lauf, { ...ergebnis.zug, von: "engine" });
    if (!weiter) throw new Error(`Zug geht nicht: ${ergebnis.zug.san} in ${fen}`);
    lauf = weiter;
  }
  return lauf;
}

function ergebnisVon(partie: Partie): string {
  if (!partie.ende) return "abbruch";
  if (!("sieger" in partie.ende)) return "1/2-1/2";
  return partie.ende.sieger === "white" ? "1-0" : "0-1";
}

const band = (process.env.VORRAT_BAND ?? "band3") as Vorratsband;
const partienZahl = Number(process.env.VORRAT_PARTIEN ?? STANDARD_PARTIEN);
const saatAb = Number(process.env.VORRAT_SAAT_AB ?? 0);
const ziel =
  process.env.VORRAT_ZIEL ?? join(process.cwd(), "..", "buch", "arbeit", "vorratspartien");

describe(`Vorratspartien ${band}`, () => {
  if (!(band in VORRATSBOTS)) throw new Error(`Unbekanntes Band: ${band}`);
  const engine = nodeEngine();
  afterAll(() => engine.beendeEngine());

  it(`${partienZahl} Partien`, async () => {
    const partien: Vorratspartie[] = [];
    const stilVon = (bot: string) =>
      GEGNER.find((g) => g.kennung === bot)?.stilname ?? "universell";
    const paarungen = vorratspaarungen(band, partienZahl, saatAb, stilVon);
    for (const [nummer, p] of paarungen.entries()) {
      const saat = saatAb + nummer + 1;
      // „*“: mit Maia wie in der App (engine/messung/messspieler.testhilfe.ts)
      const lauf = await spiele(
        engine,
        spieler(`@${p.weiss.bot}*`),
        spieler(`@${p.schwarz.bot}*`),
        saat,
      );
      partien.push({
        band,
        saat,
        weiss: p.weiss,
        schwarz: p.schwarz,
        ergebnis: ergebnisVon(lauf),
        zuege: lauf.zuege.map((z) => z.san),
      });
      mkdirSync(ziel, { recursive: true });
      const datei = join(ziel, saatAb ? `${band}-${saatAb}.json` : `${band}.json`);
      writeFileSync(datei, JSON.stringify({ band, partien }, null, 1));
    }
    expect(partien).toHaveLength(partienZahl);
  });
});
