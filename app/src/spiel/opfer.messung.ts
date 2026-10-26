/**
 * Messlauf für die Zugklasse „brillant“: 100 Brillant-Züge aus chess.com-Partien (Chessigma-
 * Vergleich, Datei nur lokal) gegen unsere Opfererkennung und Brillant-Regel.
 *
 * Rolle im Gesamtbild: Kein Test der Prüfkette, sondern ein Messlauf wie engine/stufen.messung.ts
 * (Entscheidung „Brillant am Prüfstand von chess.com“). Für jeden Zug der 100 Partien
 * prüft die Abtauschrechnung, ob er ein Opfer ist; jeden Opferkandidaten bewertet die Engine vor
 * und nach dem Zug (zwei Varianten, für den Abstand zum zweitbesten), dann entscheidet
 * `klasseVon`. Ausgabe: Treffer unter den 100 Brillanten, Fehlalarme (weitere Züge, die wir
 * brillant nennen) und die nicht erkannten Züge, als Bericht in den Ordner der Datei.
 * Start über `npm run messen:opfer` (Datei: MESSUNG_OPFER_DATEI, Vorgabe
 * ../buch/arbeit/chessigma/brillant.json; Rechenzeit MESSUNG_OPFER_MS, Vorgabe 500; Fassung der
 * schon verlorenen Figuren MESSUNG_OPFER_ALT, Vorgabe die der App; der Bericht heißt
 * bericht-<Fassung>.md und nennt auch die Fehlalarme).
 * Abhängigkeiten: engine/nodeEngine.testhilfe.ts, engine/fehlerart.ts, engine/opfer.ts,
 * spiel/auswertung.ts.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { makeUci } from "chessops";
import { makeFen } from "chessops/fen";
import { parsePgn, startingPosition } from "chessops/pgn";
import { parseSan } from "chessops/san";
import { lageVon } from "../engine/fehlerart";
import { OPFER_ALT_VERLORENE, opferwert, type AltVerlorene } from "../engine/opfer";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import { wertFuer } from "../engine/spielbewerter";
import { endwert, klasseVon, OPFER_AB, WERTGRENZE } from "./auswertung";

const DATEI =
  process.env.MESSUNG_OPFER_DATEI ??
  join(process.cwd(), "..", "buch", "arbeit", "chessigma", "brillant.json");
const RECHENZEIT_MS = Number(process.env.MESSUNG_OPFER_MS ?? 500);
const FASSUNGEN: readonly AltVerlorene[] = ["keine", "gezogene", "alle"];
const FASSUNG = FASSUNGEN.find((f) => f === process.env.MESSUNG_OPFER_ALT) ?? OPFER_ALT_VERLORENE;
const VARIANTEN = 2;
const PROZENT = 100;

/** Ein Eintrag der Datei: die Partie als PGN und der Halbzug des Brillant-Zuges (ab 1). */
interface Eintrag {
  readonly pgn: string;
  readonly ply: number;
}

/** Eine Partie als Stellungen (FEN) und Züge (SAN, UCI). */
interface Partiezuege {
  readonly fens: string[];
  readonly sans: string[];
  readonly ucis: string[];
}

/** Wert aus Sicht von Weiß, bester Zug und Abstand zum zweitbesten einer Stellung. */
interface Stellungswert {
  readonly wert: number;
  readonly bester: string;
  readonly abstand: number;
}

function begrenzt(wert: number): number {
  return Math.max(-WERTGRENZE, Math.min(WERTGRENZE, wert));
}

/** Liest die Hauptvariante einer PGN-Partie in Stellungen und Züge. */
function zuegeVon(pgn: string): Partiezuege {
  const spiel = parsePgn(pgn)[0];
  if (!spiel) throw new Error("PGN unlesbar");
  const pos = startingPosition(spiel.headers).unwrap();
  const fens = [makeFen(pos.toSetup())];
  const sans: string[] = [];
  const ucis: string[] = [];
  for (const knoten of spiel.moves.mainline()) {
    const zug = parseSan(pos, knoten.san);
    if (!zug) throw new Error(`Zug unlesbar: ${knoten.san}`);
    sans.push(knoten.san);
    ucis.push(makeUci(zug));
    pos.play(zug);
    fens.push(makeFen(pos.toSetup()));
  }
  return { fens, sans, ucis };
}

describe("Brillant am Prüfstand von chess.com", () => {
  const engine = nodeEngine();
  const speicher = new Map<string, Stellungswert>();
  afterAll(() => engine.beendeEngine());

  async function bewerte(fen: string): Promise<Stellungswert> {
    const bekannt = speicher.get(fen);
    if (bekannt) return bekannt;
    const ende = endwert(fen);
    let ergebnis: Stellungswert = { wert: ende ?? 0, bester: "", abstand: 0 };
    if (ende === null) {
      const bewertung = await engine.bewerte(fen, RECHENZEIT_MS, VARIANTEN);
      const [erste, zweite] = bewertung.varianten;
      const weissAmZug = fen.split(" ")[1] !== "b";
      const abstand =
        erste && zweite
          ? Math.max(0, wertFuer(erste.wert, weissAmZug) - wertFuer(zweite.wert, weissAmZug))
          : 0;
      ergebnis = {
        wert: erste ? wertFuer(erste.wert, true) : 0,
        bester: bewertung.besterZug ?? "",
        abstand,
      };
    }
    speicher.set(fen, ergebnis);
    return ergebnis;
  }

  /** Ist der Zug nach unserer Regel brillant? Nur für Opferkandidaten (braucht die Engine). */
  async function istBrillant(partie: Partiezuege, i: number): Promise<boolean> {
    const fen = partie.fens[i] ?? "";
    const vorher = await bewerte(fen);
    const nachher = await bewerte(partie.fens[i + 1] ?? "");
    const weiss = fen.split(" ")[1] !== "b";
    const wertVorher = weiss ? begrenzt(vorher.wert) : -begrenzt(vorher.wert);
    const wertNachher = weiss ? begrenzt(nachher.wert) : -begrenzt(nachher.wert);
    const verlust = Math.max(0, wertVorher - wertNachher);
    const lage = lageVon(fen);
    const klasse = klasseVon(verlust, {
      warBester: vorher.bester === partie.ucis[i],
      einziger: false,
      opfer: true,
      vorherVerlust: 0,
      wertVorher,
      abstand: vorher.abstand,
      imSchach: lage?.regeln.isCheck() ?? false,
      buch: false,
    });
    return klasse === "brillant";
  }

  it("misst Treffer und Fehlalarme", async () => {
    const eintraege = JSON.parse(readFileSync(DATEI, "utf8")) as Eintrag[];
    let treffer = 0;
    let opferErkannt = 0;
    let fehlalarme = 0;
    let kandidaten = 0;
    let zuege = 0;
    const partienMitFehlalarm = new Set<number>();
    const nichtErkannt: string[] = [];
    const fehlalarmZuege: string[] = [];
    for (const [nummer, eintrag] of eintraege.entries()) {
      const partie = zuegeVon(eintrag.pgn);
      for (let i = 0; i < partie.sans.length; i += 1) {
        zuege += 1;
        const chesscomBrillant = i === eintrag.ply - 1;
        const lage = lageVon(partie.fens[i] ?? "");
        const opfer = lage ? opferwert(lage, partie.ucis[i] ?? "", FASSUNG) : 0;
        if (opfer < OPFER_AB) {
          if (chesscomBrillant)
            nichtErkannt.push(`${nummer}: ${partie.sans[i]} (kein Opfer, ${opfer})`);
          continue;
        }
        kandidaten += 1;
        if (chesscomBrillant) opferErkannt += 1;
        const brillant = await istBrillant(partie, i);
        if (brillant && chesscomBrillant) treffer += 1;
        else if (brillant) {
          fehlalarme += 1;
          partienMitFehlalarm.add(nummer);
          fehlalarmZuege.push(`${nummer}: ${partie.sans[i]} (Halbzug ${i + 1}, Opfer ${opfer})`);
        } else if (chesscomBrillant)
          nichtErkannt.push(`${nummer}: ${partie.sans[i]} (Opfer, aber nicht brillant)`);
      }
    }
    const bericht = [
      `# Brillant am Prüfstand (${new Date().toISOString().slice(0, 10)}, ${RECHENZEIT_MS} ms je Stellung, Fassung „${FASSUNG}“)`,
      "",
      `- Partien: ${eintraege.length}, Züge: ${zuege}, Opferkandidaten: ${kandidaten} (${((PROZENT * kandidaten) / zuege).toFixed(1)} %)`,
      `- Opfer erkannt: ${opferErkannt} von ${eintraege.length}`,
      `- Brillant erkannt: ${treffer} von ${eintraege.length}`,
      `- Fehlalarme: ${fehlalarme} in ${partienMitFehlalarm.size} Partien`,
      "",
      "Nicht erkannt:",
      ...nichtErkannt.map((z) => `- ${z}`),
      "",
      "Fehlalarme:",
      ...fehlalarmZuege.map((z) => `- ${z}`),
      "",
    ].join("\n");
    writeFileSync(join(dirname(DATEI), `bericht-${FASSUNG}.md`), bericht);
    console.log(bericht);
    expect(treffer).toBeGreaterThan(0);
  });
});
