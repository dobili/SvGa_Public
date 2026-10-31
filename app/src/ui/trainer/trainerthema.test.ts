/** Tests des Themas beim Öffnen eines Trainers (Welle 2: P3, P1, P12). */
import { describe, expect, it } from "vitest";
import { themaFuer } from "./trainerthema";

describe("themaFuer", () => {
  it("liefert den Teil nach dem Präfix des Trainers", () => {
    expect(themaFuer("taktik:gabel", "taktik")).toBe("gabel");
    expect(themaFuer("endspiel:opposition", "endspiel")).toBe("opposition");
  });

  it("nimmt ein Thema ohne Teil (Falle oder Köder) ganz", () => {
    expect(themaFuer("falle", "falle")).toBe("falle");
  });

  it("gibt null ohne Thema oder bei einem fremden Präfix", () => {
    expect(themaFuer(null, "taktik")).toBeNull();
    expect(themaFuer("endspiel:opposition", "taktik")).toBeNull();
    expect(themaFuer("taktikx:gabel", "taktik")).toBeNull();
  });
});
