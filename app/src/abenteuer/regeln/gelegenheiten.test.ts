/** Tests für gelegenheiten.ts: Köderbauer und Turmopfer vor dem Zug des Helden (T11). */
import { describe, expect, it } from "vitest";
import { stellungAusFen } from "../../schach/stellung";
import { gelegenheit, hatKoeder, hatTurmopfer } from "./gelegenheiten";

/** Regelstellung aus einer FEN (Test bricht ab, wenn sie unmöglich ist). */
function pos(fen: string) {
  const s = stellungAusFen(fen);
  if (!s.ok || !s.wert.regeln) throw new Error(`Stellung unmöglich: ${fen}`);
  return s.wert.regeln;
}

/** Grundreihe: Txd7 sieht gut aus, dann De1 matt (der König hat kein Luftloch). */
const GRUNDREIHE = "4q1k1/3p1ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1";
/** Dasselbe mit Luftloch auf h2: Kein Matt, kein Köder. */
const MIT_LUFTLOCH = "4q1k1/3p1ppp/8/8/8/7P/5PP1/3R2K1 w - - 0 1";
/** Txh7 neben dem König: Der König schlägt den Turm. */
const OPFER = "6k1/5ppp/8/8/8/8/8/4K2R w K - 0 1";
/** Der Turm kommt nicht neben den König. */
const OHNE_OPFER = "6k1/5ppp/8/8/8/8/8/R3K3 w Q - 0 1";

describe("Gelegenheiten", () => {
  it("erkennt den vergifteten Bauern", () => {
    expect(hatKoeder(pos(GRUNDREIHE))).toBe(true);
    expect(hatKoeder(pos(MIT_LUFTLOCH))).toBe(false);
  });

  it("erkennt das Turmopfer neben dem König", () => {
    expect(hatTurmopfer(pos(OPFER))).toBe(true);
    expect(hatTurmopfer(pos(OHNE_OPFER))).toBe(false);
  });

  it("merkt sich Ergebnisse je Stellung", () => {
    expect(gelegenheit("koeder", GRUNDREIHE, pos(GRUNDREIHE))).toBe(true);
    expect(gelegenheit("koeder", GRUNDREIHE, pos(MIT_LUFTLOCH))).toBe(true);
  });
});
