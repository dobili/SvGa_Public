/**
 * Tests der Opfererkennung (engine/opfer.ts): Opferwert an der Opernpartie (Abb. 11.4) und an
 * der Berliner Partie, dazu seit 0.2.59 die Frage, ob der Gegner die Figur wirklich nehmen kann.
 */
import { describe, expect, it } from "vitest";
import { lageVon } from "./fehlerart";
import { opferwert, type AltVerlorene } from "./opfer";

const OPERNPARTIE_VOR_16 = "4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 16";
const OPERNPARTIE_VOR_13 = "3rkb1r/p2nqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR3R w k - 3 13";
const BERLIN_VOR_14 = "r3k3/ppp1bpp1/2p1b2r/4PnNp/5B2/2N3PP/PPP2P2/3R1RK1 b - - 0 14";
/** Weiß am Zug: Lc7 stellt den Läufer vor den Turm e7, der durch Te1 an den König gefesselt ist. */
const FESSELUNG = "4k3/4r3/8/B7/8/8/8/4RK2 w - - 0 1";
/** Dieselbe Stellung mit dem Turm auf a1: Der Turm e7 ist frei und nimmt den Läufer. */
const OHNE_FESSELUNG = "4k3/4r3/8/B7/8/8/8/R4K2 w - - 0 1";
/** Schwarz am Zug, der Springer c6 hängt schon (Lb5 gegen den ungedeckten Springer): 1... Sg4. */
const SPRINGER_HAENGT = "r1bqk2r/p1p2ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 0 1";

function wert(fen: string, uci: string, alt?: AltVerlorene): number {
  const lage = lageVon(fen);
  if (!lage) throw new Error("Stellung unlesbar");
  return opferwert(lage, uci, alt);
}

describe("Opferwert für die Zugklasse „brillant“ (0.2.51)", () => {
  it("16. Db8+ in der Opernpartie (Abb. 11.4) gibt die Dame, auch mit Schach", () => {
    expect(wert(OPERNPARTIE_VOR_16, "b3b8")).toBe(9);
  });
  it("10. Sxb5 gibt den Springer für zwei Bauern (cxb5, Lxb5): Netto 1", () => {
    const vor10 = "rn2kb1r/p3qppp/2p2n2/1p2p1B1/2B1P3/1QN5/PPP2PPP/R3K2R w KQkq - 0 10";
    expect(wert(vor10, "c3b5")).toBe(1);
  });
  it("13. Txd7 gibt den Turm für einen Springer: 5 − 3 = 2", () => {
    expect(wert(OPERNPARTIE_VOR_13, "d1d7")).toBe(2);
  });
  it("ein Abtausch ist kein Opfer: 14... Lxg5 gegen den Springer, danach Lxg5", () => {
    expect(wert(BERLIN_VOR_14, "e7g5")).toBe(0);
  });
});

describe("Wirklich zu nehmen (0.2.59)", () => {
  it("eine Figur, die nur ein gefesselter Angreifer schlagen könnte, ist kein Opfer", () => {
    expect(wert(FESSELUNG, "a5c7")).toBe(0);
  });
  it("ohne die Fesselung gibt derselbe Zug den Läufer her", () => {
    expect(wert(OHNE_FESSELUNG, "a5c7")).toBe(3);
  });
  it("eine schon vorher hängende, stehengelassene Figur zählt nur in der Fassung „alle“", () => {
    expect(wert(SPRINGER_HAENGT, "f6g4", "keine")).toBe(0);
    expect(wert(SPRINGER_HAENGT, "f6g4", "gezogene")).toBe(0);
    expect(wert(SPRINGER_HAENGT, "f6g4", "alle")).toBe(3);
  });
});
