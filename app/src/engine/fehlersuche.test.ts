/** Tests der typischen Fehlerzüge nach den Werkzeugen des Buches (engine/fehlersuche.ts). */
import { describe, expect, it } from "vitest";
import { lageVon } from "./fehlerart";
import { typischeFehlerzuege } from "./fehlersuche";

const NACH_DH5 = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";

describe("Typische Fehlerzüge aus den Werkzeugen", () => {
  it("Abb. 1.13: Drohung ignoriert, Figur hängen, verfrühte Dame", () => {
    const lage = lageVon(NACH_DH5);
    const typische = lage ? typischeFehlerzuege(lage) : [];
    expect(typische).toContainEqual({ uci: "g8f6", art: "drohungIgnoriert" });
    expect(typische).toContainEqual({ uci: "f8a3", art: "figurHaengen" });
    expect(typische).toContainEqual({ uci: "d8f6", art: "verfruehteDame" });
    expect(typische.find((k) => k.uci === "b8c6")).toBeUndefined();
  });
});
