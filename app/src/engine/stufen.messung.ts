/**
 * Messung der Stufen (Konzept 8.2, Abnahme: „Jede Stufe gewinnt die Mehrheit gegen die Stufe
 * darunter. Die Fehlerquote je Stufe liegt im Sollbereich.“): Partien Stufe gegen Stufe mit der
 * echten Engine unter Node, mit der Zugwahl der App (engine/zugwahl.ts, spiel/enginezug.ts).
 *
 * Rolle im Gesamtbild: Kein Test der Prüfkette, sondern ein Messlauf. Start über
 * `npm run messen:stufen` (skripte/messe-stufen.mjs). Umgebung: MESSUNG_PAARUNG („1-2“, auch
 * „3-s5“ für Skill Level 5, „4-e1600“ für die Elo-Begrenzung, „3b-3“ für Stufe 3 mit allen
 * blinden Flecken gegen Stufe 3 ohne, „3@nina-3“ für Stufe 3 mit dem ganzen Profil des
 * Gegners „nina“: Fehlerarten, Stil, blinde Flecken; 0.2.57 und 0.2.65), MESSUNG_PARTIEN (Zahl, gerade;
 * die Farben wechseln), MESSUNG_ZIEL (Ordner für die JSON-Ergebnisse, nur lokal: buch/arbeit/).
 * Jede Partie beginnt mit einer der Eröffnungen aus Kapitel 2 und 3 (zwei Halbzüge), damit die
 * Partien verschieden sind; danach spielt keine Seite aus dem Buch.
 * Abhängigkeiten: engine/nodeEngine.testhilfe.ts, engine/stufen.ts, spiel/.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { BLINDE_FLECKEN } from "./blindeFlecken";
import { GEGNER } from "./gegner";
import type { Fehlerart } from "./fehlerart";
import { nodeEngine } from "./nodeEngine.testhilfe";
import { stufe, type Stufe } from "./stufen";
import { BUCHTREUE, STANDARDPROFIL, type Gegnerprofil } from "./zugwahl";
import { engineZug } from "../spiel/enginezug";
import { leserAmZug, neuePartie, stellungen, ziehe, type Partie } from "../spiel/partie";
import { fenNach } from "../spiel/zuege";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Zwei Halbzüge je Partie aus den Eröffnungen der Kapitel 2 und 3. */
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
/** Nach so vielen Halbzügen gilt eine Partie als remis (Messung, keine Regel des Buches). */
const HOECHSTENS_HALBZUEGE = 240;
const STANDARD_PARTIEN = 10;
/** Rechenzeit für Vergleichsgegner mit festem Skill Level oder fester Elo-Zahl. */
const VERGLEICHS_RECHENZEIT_MS = 600;

interface Seitenstatistik {
  readonly zuege: number;
  readonly fehler: number;
  readonly arten: Partial<Record<Fehlerart, number>>;
  readonly hoechsterVerlust: number;
  readonly verlustSumme: number;
}

interface Partiebericht {
  readonly weiss: string;
  readonly schwarz: string;
  readonly ergebnis: "1-0" | "0-1" | "1/2-1/2";
  readonly ende: string;
  readonly halbzuege: number;
  readonly dauerMs: number;
  readonly statistik: Record<"weiss" | "schwarz", Seitenstatistik>;
}

/** Fester Zufall (LCG), damit der Fehlerwurf je Partie nachvollziehbar ist. */
function zufallsquelle(saat: number): () => number {
  let stand = saat;
  return () => {
    stand = (stand * 48_271) % 2_147_483_647;
    return stand / 2_147_483_647;
  };
}

/** Ein Spieler der Messung: Stufe und Profil (blinde Flecken bei Kürzeln wie „3b“). */
interface Spieler {
  readonly stufe: Stufe;
  readonly profil: Gegnerprofil;
}

/** Alle blinden Flecken, für Kürzel mit „b“ (etwa „3b“). */
const ALLE_FLECKEN: Gegnerprofil = { ...STANDARDPROFIL, blindeFlecken: BLINDE_FLECKEN };

/** Stufe und Profil aus dem Kürzel der Paarung. */
function spieler(kuerzel: string): Spieler {
  const blind = /^(\d)b$/.exec(kuerzel);
  if (blind?.[1]) return { stufe: gegner(blind[1]), profil: ALLE_FLECKEN };
  const bot = /^(\d)@([a-z-]+)$/.exec(kuerzel);
  const vorgefertigt = bot?.[2] ? GEGNER.find((g) => g.kennung === bot[2]) : undefined;
  if (bot?.[1] && vorgefertigt) {
    return {
      stufe: gegner(bot[1]),
      profil: {
        ...STANDARDPROFIL,
        fehlerarten: vorgefertigt.fehlerarten,
        stil: vorgefertigt.stil,
        blindeFlecken: vorgefertigt.blindeFlecken,
      },
    };
  }
  return { stufe: gegner(kuerzel), profil: STANDARDPROFIL };
}

/** Eine Stufe oder ein Vergleichsgegner aus dem Kürzel der Paarung. */
function gegner(kuerzel: string): Stufe {
  const skill = /^s(\d+)$/.exec(kuerzel);
  const elo = /^e(\d+)$/.exec(kuerzel);
  const vergleich = {
    name: "stufe.8" as const,
    fehlerquote: 0,
    hoechstverlust: 0,
    damenopferErlaubt: false,
    rechenzeitMs: VERGLEICHS_RECHENZEIT_MS,
    menschlich: null,
  };
  if (skill?.[1]) {
    return { ...vergleich, nummer: 8, staerke: { art: "skill", stufe: Number(skill[1]) } };
  }
  if (elo?.[1]) {
    return { ...vergleich, nummer: 8, staerke: { art: "elo", elo: Number(elo[1]) } };
  }
  return stufe(Number(kuerzel));
}

function statistik(partie: Partie, farbe: "white" | "black"): Seitenstatistik {
  const eigene = partie.zuege.filter((_, i) => (i % 2 === 0) === (farbe === "white"));
  const fehler = eigene.filter((z) => z.quelle === "fehler");
  const arten: Partial<Record<Fehlerart, number>> = {};
  for (const z of fehler) if (z.fehler) arten[z.fehler] = (arten[z.fehler] ?? 0) + 1;
  return {
    zuege: eigene.length,
    fehler: fehler.length,
    arten,
    hoechsterVerlust: Math.max(0, ...fehler.map((z) => z.verlust)),
    verlustSumme: fehler.reduce((s, z) => s + z.verlust, 0),
  };
}

/** Spielt eine Partie zwischen zwei Stufen; beide Seiten ziehen über die Zugwahl der App. */
async function spiele(
  engine: ReturnType<typeof nodeEngine>,
  weiss: Spieler,
  schwarz: Spieler,
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
      stufe: weiss.stufe.nummer,
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: {
        eroeffnung: weiss.stufe.nummer,
        mittelspiel: weiss.stufe.nummer,
        endspiel: weiss.stufe.nummer,
      },
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
    const amZug = leserAmZug(lauf) ? schwarz : weiss;
    const fen = stellungen(lauf).at(-1) ?? GRUNDSTELLUNG;
    const zug = await engineZug(engine, fen, amZug.stufe, [], zufall, BUCHTREUE, amZug.profil);
    if (!zug) break;
    const weiter = ziehe(lauf, { ...zug, von: "engine" });
    if (!weiter) throw new Error(`Zug geht nicht: ${zug.san} in ${fen}`);
    lauf = weiter;
  }
  return lauf;
}

function ergebnisVon(partie: Partie): Partiebericht["ergebnis"] {
  if (!partie.ende || !("sieger" in partie.ende)) return "1/2-1/2";
  return partie.ende.sieger === "white" ? "1-0" : "0-1";
}

const paarung = process.env.MESSUNG_PAARUNG ?? "1-2";
const partienZahl = Number(process.env.MESSUNG_PARTIEN ?? STANDARD_PARTIEN);
const ziel =
  process.env.MESSUNG_ZIEL ?? join(process.cwd(), "..", "buch", "arbeit", "stufenmessung");
const [a = "1", b = "2"] = paarung.split("-");

describe(`Messung ${paarung}`, () => {
  const engine = nodeEngine();
  afterAll(() => engine.beendeEngine());

  it(`${partienZahl} Partien ${a} gegen ${b}`, async () => {
    const berichte: Partiebericht[] = [];
    for (let nummer = 0; nummer < partienZahl; nummer += 1) {
      const aWeiss = nummer % 2 === 0;
      const weiss = aWeiss ? spieler(a) : spieler(b);
      const schwarz = aWeiss ? spieler(b) : spieler(a);
      const anfang = ANFAENGE[Math.floor(nummer / 2) % ANFAENGE.length] ?? [];
      const beginn = performance.now();
      const partie = await spiele(engine, weiss, schwarz, anfang, zufallsquelle(nummer + 1));
      berichte.push({
        weiss: aWeiss ? a : b,
        schwarz: aWeiss ? b : a,
        ergebnis: ergebnisVon(partie),
        ende: partie.ende?.art ?? "abbruch",
        halbzuege: partie.zuege.length,
        dauerMs: Math.round(performance.now() - beginn),
        statistik: { weiss: statistik(partie, "white"), schwarz: statistik(partie, "black") },
      });
      mkdirSync(ziel, { recursive: true });
      writeFileSync(join(ziel, `${paarung}.json`), JSON.stringify({ paarung, berichte }, null, 1));
    }
    expect(berichte).toHaveLength(partienZahl);
  });
});
