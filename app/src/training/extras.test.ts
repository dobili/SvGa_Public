/**
 * Tests der Freischaltregeln für Extras (training/extras.ts, Gamifizierung P7): Stufen, Orden,
 * „nie wegnehmen“ und Vollständigkeit der Liste.
 */
import { describe, expect, it } from "vitest";
import {
  bedingungErfuellt,
  EXTRAARTEN,
  EXTRAS,
  extrasDerArt,
  extraZu,
  freieExtras,
  sperre,
  type Extralage,
  type Ordengruppe,
} from "./extras";

function lage(
  stufe: number,
  gruppen: readonly Ordengruppe[] = [],
  themenstufen: Extralage["themenstufen"] = {},
): Extralage {
  return { stufe, volleOrdengruppen: new Set(gruppen), themenstufen };
}

describe("Freischaltregeln", () => {
  it("Stufe 1 schaltet nichts frei", () => {
    expect(freieExtras(lage(1)).size).toBe(0);
  });

  it("Stufe 2 bringt die Konfettifarben, Stufe 3 den Bronzerahmen", () => {
    expect([...freieExtras(lage(2))]).toEqual(["konfetti-bunt"]);
    expect([...freieExtras(lage(3))].sort()).toEqual(["konfetti-bunt", "rahmen-bronze"]);
  });

  it("Rahmen kommen bei Stufe 3, 6 und 9", () => {
    const ab = extrasDerArt("rahmen").map((e) => (e.bedingung.art === "stufe" ? e.bedingung.ab : 0));
    expect(ab).toEqual([3, 6, 9]);
    expect(freieExtras(lage(9)).has("rahmen-gold")).toBe(true);
    expect(freieExtras(lage(8)).has("rahmen-gold")).toBe(false);
  });

  it("Figurensatz Gold ab Stufe 5", () => {
    expect(freieExtras(lage(4)).has("figuren-gold")).toBe(false);
    expect(freieExtras(lage(5)).has("figuren-gold")).toBe(true);
  });

  it("Brett Nacht und Gold nur mit allen Orden der Buchteile, nicht über die Stufe", () => {
    expect(freieExtras(lage(10)).has("brett-nacht-gold")).toBe(false);
    expect(freieExtras(lage(1, ["buchteile"]))).toEqual(new Set(["brett-nacht-gold"]));
    expect(bedingungErfuellt({ art: "orden", gruppe: "buchteile" }, lage(1, ["buchteile"]))).toBe(
      true,
    );
  });
});

describe("Sperre und nie wegnehmen", () => {
  it("gesperrt nur, wenn ein Extra dahinter steht und die Bedingung fehlt", () => {
    expect(sperre("figuren", "gold", "buch", lage(4))?.kennung).toBe("figuren-gold");
    expect(sperre("figuren", "gold", "buch", lage(5))).toBeUndefined();
    expect(sperre("figuren", "klassisch-cburnett", "buch", lage(1))).toBeUndefined();
  });

  it("ein gewähltes Extra bleibt frei, auch ohne Bedingung (Sicherung aus einer anderen App)", () => {
    expect(sperre("brett", "nacht-gold", "nacht-gold", lage(1))).toBeUndefined();
  });

  it("extraZu findet nur Werte der passenden Art", () => {
    expect(extraZu("rahmen", "gold")?.kennung).toBe("rahmen-gold");
    expect(extraZu("figuren", "gold")?.kennung).toBe("figuren-gold");
    expect(extraZu("brett", "gold")).toBeUndefined();
  });
});

describe("Liste der Extras", () => {
  it("Kennungen sind eindeutig, je Art und Wert nur ein Extra", () => {
    const kennungen = EXTRAS.map((e) => e.kennung);
    expect(new Set(kennungen).size).toBe(kennungen.length);
    const paare = EXTRAS.map((e) => `${e.art}:${e.wert}`);
    expect(new Set(paare).size).toBe(paare.length);
  });

  it("jede Art hat mindestens ein Extra und jedes Extra ein Bild", () => {
    for (const art of EXTRAARTEN) expect(extrasDerArt(art).length).toBeGreaterThan(0);
    for (const e of EXTRAS) expect(e.bild).toMatch(/\.svg$/);
  });
});

describe("Titel aus der Meisterschaft (P3)", () => {
  const gold = (praefix: string, anzahl: number) =>
    Object.fromEntries(
      Array.from({ length: anzahl }, (_, i) => [`${praefix}:thema${i}`, "gold" as const]),
    );

  it("„Taktiker“ erst mit fünf Taktikmotiven in Gold", () => {
    expect(freieExtras(lage(1, [], gold("taktik", 4))).has("titel-taktiker")).toBe(false);
    expect(freieExtras(lage(1, [], gold("taktik", 5))).has("titel-taktiker")).toBe(true);
  });

  it("Gold in anderen Trainern zählt nicht für „Taktiker“", () => {
    expect(freieExtras(lage(1, [], gold("endspiel", 5))).has("titel-taktiker")).toBe(false);
    expect(freieExtras(lage(1, [], gold("endspiel", 3))).has("titel-endspielkenner")).toBe(true);
  });

  it("Silber reicht nicht", () => {
    const silber = { ...gold("taktik", 4), "taktik:x": "silber" as const };
    expect(bedingungErfuellt(EXTRAS[6].bedingung, lage(1, [], silber))).toBe(false);
  });
});
