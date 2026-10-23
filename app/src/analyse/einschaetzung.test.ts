/** Tests des Engine-Urteils als Einschätzung (NA1): Grenze ein halber Bauer, Matt, Vorzeichen. */
import { describe, expect, it } from "vitest";
import { einschaetzungDerEngine } from "./einschaetzung";

describe("einschaetzungDerEngine", () => {
  it("bis ein halber Bauer ausgeglichen, darüber die bessere Seite", () => {
    expect(einschaetzungDerEngine({ art: "bauern", bauern: 0.3 })).toBe("gleich");
    expect(einschaetzungDerEngine({ art: "bauern", bauern: -0.5 })).toBe("gleich");
    expect(einschaetzungDerEngine({ art: "bauern", bauern: 0.6 })).toBe("weiss");
    expect(einschaetzungDerEngine({ art: "bauern", bauern: -1.2 })).toBe("schwarz");
  });

  it("Matt zählt für die mattsetzende Seite", () => {
    expect(einschaetzungDerEngine({ art: "matt", zuege: 2 })).toBe("weiss");
    expect(einschaetzungDerEngine({ art: "matt", zuege: -3 })).toBe("schwarz");
  });
});
