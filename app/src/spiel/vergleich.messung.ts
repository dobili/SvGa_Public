/**
 * Messlauf: Partien des Autors mit der Bewertung von chess.com (Genauigkeit, Spielbewertung,
 * Phasen-Symbole) gegen unsere Auswertung (Genauigkeit, Spielstärke, Spielstärke je Phase,
 * Zugklassen).
 *
 * Rolle im Gesamtbild: Kein Test der Prüfkette, sondern ein Messlauf wie opfer.messung.ts
 * (Wunsch des Autors, 18.10.2026: Spielbewertung und Phasen genauer justieren). Die Datei mit
 * den Partien liegt nur lokal (MESSUNG_VERGLEICH_DATEI, Vorgabe ../buch/arbeit/chesscom/
 * vergleich.json): je Partie PGN, Namen und die Werte von chess.com. Jede Stellung bewertet die
 * Engine wie in der App (zwei Varianten, MESSUNG_VERGLEICH_MS, Vorgabe 500 ms); dann laufen
 * zugurteile, spielstaerke und spielstaerkeJePhase. Ausgabe: Tabelle als bericht.md neben der
 * Datei.
 * Abhängigkeiten: engine/nodeEngine.testhilfe.ts, spiel/auswertung.ts, spiel/genauigkeit.ts,
 * spiel/partie.ts, spiel/phasen.ts.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { makeUci } from "chessops";
import { parsePgn, startingPosition } from "chessops/pgn";
import { parseSan } from "chessops/san";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import { wertFuer } from "../engine/spielbewerter";
import { endwert, zugurteile, type Zugklasse } from "./auswertung";
import {
  phasenurteil,
  spielstaerke,
  spielstaerkeImMittelspiel,
  spielstaerkeJePhase,
  type Seitenbilanz,
} from "./genauigkeit";
import { leserzug, neuePartie, stellungen, ziehe, type Partie } from "./partie";
import { phasenJeStellung, type Phase } from "./phasen";
import { zugartJeStellung } from "./taktik";

const DATEI =
  process.env.MESSUNG_VERGLEICH_DATEI ??
  join(process.cwd(), "..", "buch", "arbeit", "chesscom", "vergleich.json");
const RECHENZEIT_MS = Number(process.env.MESSUNG_VERGLEICH_MS ?? 500);
const VARIANTEN = 2;
const PHASEN: readonly Phase[] = ["eroeffnung", "mittelspiel", "endspiel"];
const KLASSEN: readonly Zugklasse[] = [
  "brillant",
  "stark",
  "bester",
  "sehrGut",
  "gut",
  "buch",
  "ungenau",
  "fehler",
  "verpasst",
  "patzer",
];

interface Eintrag {
  readonly name: string;
  readonly weiss: string;
  readonly schwarz: string;
  readonly pgn: string;
  readonly chesscom: {
    readonly genauigkeit: Record<"weiss" | "schwarz", number>;
    readonly spielbewertung: Record<"weiss" | "schwarz", number>;
    readonly phasen?: Partial<Record<"weiss" | "schwarz", Record<string, string>>>;
    readonly klassen?: Partial<Record<"weiss" | "schwarz", Record<string, number>>>;
  };
}

/** Baut eine Partie der App aus einer PGN (beide Seiten als Leserzüge). */
function partieAus(pgn: string): Partie {
  const spiel = parsePgn(pgn)[0];
  if (!spiel) throw new Error("PGN unlesbar");
  const pos = startingPosition(spiel.headers).unwrap();
  let partie = neuePartie(
    {
      startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      eigeneFarbe: "white",
      stufe: 1,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      gegner: "mensch",
      bot: null,
      hilfen: { symbole: false, werkzeuge: false },
      gewertet: false,
      eroeffnung: null,
    },
    "vergleich",
    new Date().toISOString(),
  );
  if (!partie) throw new Error("Partie nicht anlegbar");
  for (const knoten of spiel.moves.mainline()) {
    const zug = parseSan(pos, knoten.san);
    if (!zug) throw new Error(`Zug unlesbar: ${knoten.san}`);
    const weiter = ziehe(partie, leserzug(knoten.san));
    if (!weiter) throw new Error(`Zug geht nicht: ${knoten.san} (${makeUci(zug)})`);
    partie = weiter;
    pos.play(zug);
  }
  return partie;
}

function zahl(wert: number | null | undefined): string {
  return wert === null || wert === undefined ? "–" : String(Math.round(wert * 10) / 10);
}

/** „1750 sehrGut (12)“ oder „–“. */
function phasenzelle(b: Seitenbilanz): string {
  if (b.zuege === 0 || b.genauigkeit === null) return "–";
  return `${zahl(b.spielstaerke)} ${phasenurteil(b.genauigkeit)} (${b.zuege})`;
}

function klassenzeile(b: Seitenbilanz): string {
  return KLASSEN.map((k) => `${k} ${b.klassen[k]}`).join(", ");
}

describe("Vergleich mit chess.com", () => {
  const engine = nodeEngine();
  afterAll(() => engine.beendeEngine());

  async function bewerte(partie: Partie) {
    const werte: number[] = [];
    const beste: string[] = [];
    const abstaende: number[] = [];
    for (const fen of stellungen(partie)) {
      const ende = endwert(fen);
      if (ende !== null) {
        werte.push(ende);
        beste.push("");
        abstaende.push(0);
        continue;
      }
      const b = await engine.bewerte(fen, RECHENZEIT_MS, VARIANTEN);
      const [erste, zweite] = b.varianten;
      const weissAmZug = fen.split(" ")[1] !== "b";
      werte.push(erste ? wertFuer(erste.wert, true) : 0);
      beste.push(b.besterZug ?? "");
      abstaende.push(
        erste && zweite
          ? Math.max(0, wertFuer(erste.wert, weissAmZug) - wertFuer(zweite.wert, weissAmZug))
          : 0,
      );
    }
    return { werte, beste, abstaende };
  }

  it("rechnet alle Partien durch und schreibt den Bericht", async () => {
    const eintraege = JSON.parse(readFileSync(DATEI, "utf8")) as Eintrag[];
    const zeilen = [
      `# Vergleich mit chess.com (${new Date().toISOString().slice(0, 10)}, ${RECHENZEIT_MS} ms je Stellung)`,
      "",
      "| Partie | Seite | Genauigkeit chess.com / App | Spielbewertung chess.com / App | App Eröffnung | App Taktik / Strategie (Mittelspiel) | App Endspiel | chess.com Phasen |",
      "|---|---|---|---|---|---|---|---|",
    ];
    const klassen: string[] = [];
    for (const e of eintraege) {
      const partie = partieAus(e.pgn);
      const { werte, beste, abstaende } = await bewerte(partie);
      const urteile = zugurteile(partie, werte, beste, abstaende);
      const gespielte = partie.zuege.map(() => null);
      const bilanz = spielstaerke(partie, werte, urteile, beste, gespielte);
      const phasen = phasenJeStellung(partie);
      const jePhase = spielstaerkeJePhase(partie, werte, urteile, beste, gespielte, phasen);
      const zugarten = zugartJeStellung(partie);
      const imMittelspiel = spielstaerkeImMittelspiel(
        partie,
        werte,
        urteile,
        beste,
        gespielte,
        phasen,
        zugarten,
      );
      for (const [farbe, seite] of [
        ["white", "weiss"],
        ["black", "schwarz"],
      ] as const) {
        const b = bilanz[farbe];
        const [eroeffnung, mittelspiel, endspiel] = PHASEN.map((p) =>
          phasenzelle(jePhase[p][farbe]),
        );
        const mitte = `${phasenzelle(imMittelspiel.taktik[farbe])} / ${phasenzelle(imMittelspiel.strategie[farbe])} · gesamt ${mittelspiel}`;
        const cc = e.chesscom.phasen?.[seite];
        const ccText = cc
          ? Object.entries(cc)
              .map(([k, v]) => `${k} ${v}`)
              .join(", ")
          : "–";
        zeilen.push(
          `| ${e.name} | ${seite === "weiss" ? e.weiss : e.schwarz} | ${e.chesscom.genauigkeit[seite]} / ${zahl(b.genauigkeit)} | ${e.chesscom.spielbewertung[seite]} / ${zahl(b.spielstaerke)} | ${eroeffnung} | ${mitte} | ${endspiel} | ${ccText} |`,
        );
        const ccK = e.chesscom.klassen?.[seite];
        klassen.push(
          `- ${e.name}, ${seite}: App ${klassenzeile(b)}; chess.com ${
            ccK
              ? Object.entries(ccK)
                  .map(([k, v]) => `${k} ${v}`)
                  .join(", ")
              : "–"
          }`,
        );
      }
    }
    const bericht = [...zeilen, "", "Zugklassen:", ...klassen, ""].join("\n");
    writeFileSync(join(dirname(DATEI), "bericht.md"), bericht);
    console.log(bericht);
    expect(eintraege.length).toBeGreaterThan(0);
  });
});
