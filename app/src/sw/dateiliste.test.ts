/** Tests der geteilten Dateiliste (V4): Kern vorab, weitere Sprachen als Sprachpaket. */
import { describe, expect, it } from "vitest";
import { sprachpaketVon, teileDateiliste } from "./dateiliste";

describe("Sprachpaket einer Datei", () => {
  it("ordnet Daten und Sprachbaustein einer weiteren Sprache ihrem Paket zu", () => {
    expect(sprachpaketVon("daten/en/a1/kap01.json")).toBe("en");
    expect(sprachpaketVon("/daten/en/trainer/taktik.json")).toBe("en");
    expect(sprachpaketVon("daten/en/eroeffnungen-lichess.json")).toBe("en");
    expect(sprachpaketVon("assets/sprachpaket-en-Bx3f_9.js")).toBe("en");
  });

  it("lässt Deutsches und Gemeinsames im Kern", () => {
    expect(sprachpaketVon("daten/de/a1/kap01.json")).toBeNull();
    expect(sprachpaketVon("daten/praxisbuch.json")).toBeNull();
    expect(sprachpaketVon("assets/sprache-CJmRdSmH.js")).toBeNull();
    expect(sprachpaketVon("assets/sprachpaket-de-Ab12.js")).toBeNull();
    expect(sprachpaketVon("app/index.html")).toBeNull();
  });
});

describe("Teilen der Dateiliste", () => {
  it("trennt Kern und Pakete und behält die Revisionen", () => {
    const { kern, pakete } = teileDateiliste([
      "app/index.html",
      { url: "daten/de/a1/index.json", revision: "d1" },
      { url: "daten/en/a1/index.json", revision: "e1" },
      "assets/sprachpaket-en-Xy.js",
    ]);
    expect(kern).toEqual(["app/index.html", { url: "daten/de/a1/index.json", revision: "d1" }]);
    expect(pakete).toEqual({
      en: [
        { url: "daten/en/a1/index.json", revision: "e1" },
        { url: "assets/sprachpaket-en-Xy.js", revision: null },
      ],
    });
  });

  it("ergibt ohne fremde Sprache nur den Kern", () => {
    expect(teileDateiliste(["index.html"])).toEqual({ kern: ["index.html"], pakete: {} });
  });
});
