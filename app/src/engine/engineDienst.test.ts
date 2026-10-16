/**
 * Test des Engine-Dienstes mit der echten Engine (Stockfish 19 lite, ein Kern) unter Node.
 *
 * Prüft den ganzen Weg: Start, Bewertung mit mehreren Varianten, Abbruch durch einen neuen Auftrag,
 * Stärkebegrenzung für das Spiel gegen die Engine (Konzept 8.2) und zurück zur vollen Stärke.
 * Stellung: Abb. 1.26 (Kapitel 1, Französisch Vorstoß nach 5... Db6).
 */
import { createRequire } from "node:module";
import { afterAll, describe, expect, it } from "vitest";
import { AuftragAbgebrochen, EngineDienst, staerkebefehle, type Kanal } from "./engineDienst";

interface NodeEngine {
  processCommand(befehl: string): void;
  terminate(): void;
}
type EngineFabrik = (art: string, beiZeile: (zeile: string) => void) => NodeEngine;

const benoetige = createRequire(import.meta.url);
const ladeEngine = benoetige("stockfish") as EngineFabrik;

/** Kanal zur Engine unter Node: Zeilen kommen über einen Rückruf. */
function nodeKanal(): Kanal {
  let empfaenger: (zeile: string) => void = () => undefined;
  const sf = ladeEngine("lite-single", (zeile) => empfaenger(zeile));
  return {
    senden: (befehl) => sf.processCommand(befehl),
    beiZeile: (neu) => {
      empfaenger = neu;
    },
    beenden: () => sf.terminate(),
  };
}

const ABB_1_26 = "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 4 6";
const RECHENZEIT_MS = 400;
const TESTFRIST_MS = 30_000;

describe("EngineDienst mit Stockfish", () => {
  const dienst = new EngineDienst(nodeKanal);
  afterAll(() => dienst.beendeEngine());

  it(
    "bewertet Abb. 1.26 mit drei Varianten",
    async () => {
      const bewertung = await dienst.bewerte(ABB_1_26, RECHENZEIT_MS, 3);
      expect(bewertung.varianten).toHaveLength(3);
      expect(bewertung.tiefe).toBeGreaterThan(4);
      expect(bewertung.besterZug).toMatch(/^[a-h][1-8][a-h][1-8]/);
      expect(bewertung.startzeitMs).toBeGreaterThan(0);
    },
    TESTFRIST_MS,
  );

  it(
    "ein neuer Auftrag bricht den alten ab",
    async () => {
      const alt = dienst.bewerte(ABB_1_26, 10_000, 1);
      const neu = dienst.bewerte(ABB_1_26, RECHENZEIT_MS, 1);
      await expect(alt).rejects.toBeInstanceOf(AuftragAbgebrochen);
      expect((await neu).varianten).toHaveLength(1);
    },
    TESTFRIST_MS,
  );

  it(
    "spielt mit Elo-Begrenzung und danach wieder voll",
    async () => {
      const begrenzt = await dienst.bewerte(ABB_1_26, RECHENZEIT_MS, 1, { art: "elo", elo: 1600 });
      expect(begrenzt.besterZug).toMatch(/^[a-h][1-8][a-h][1-8]/);
      const schwach = await dienst.bewerte(ABB_1_26, RECHENZEIT_MS, 1, { art: "skill", stufe: 3 });
      expect(schwach.besterZug).toMatch(/^[a-h][1-8][a-h][1-8]/);
      const voll = await dienst.bewerte(ABB_1_26, RECHENZEIT_MS, 3);
      expect(voll.varianten).toHaveLength(3);
    },
    TESTFRIST_MS,
  );
});

describe("staerkebefehle", () => {
  it("volle Stärke schaltet jede Begrenzung ab", () => {
    expect(staerkebefehle({ art: "voll" })).toEqual([
      "setoption name UCI_LimitStrength value false",
      "setoption name Skill Level value 20",
    ]);
  });

  it("Skill Level ohne Elo-Begrenzung", () => {
    expect(staerkebefehle({ art: "skill", stufe: 3 })).toEqual([
      "setoption name UCI_LimitStrength value false",
      "setoption name Skill Level value 3",
    ]);
  });

  it("Elo-Begrenzung mit Zahl", () => {
    expect(staerkebefehle({ art: "elo", elo: 1600 })).toEqual([
      "setoption name UCI_LimitStrength value true",
      "setoption name Skill Level value 20",
      "setoption name UCI_Elo value 1600",
    ]);
  });
});
