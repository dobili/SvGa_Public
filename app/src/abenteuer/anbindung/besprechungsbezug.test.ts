/**
 * Tests der Rückbezüge (besprechungsbezug.ts): Lehrer nur für versuchte Runden, frühere Partien nur
 * mit derselben Ursache und nur, wenn sie früher waren.
 */
import { describe, expect, it } from "vitest";
import type { Partieeintrag } from "../../speicher/partien";
import { versuchtVariable } from "../regeln/besprechung";
import { fruehereFehler, lehrerJeBegriff } from "./besprechungsbezug";

const RUNDEN = [
  { kennung: "mapleFalls.reiheSam", themen: ["haengend"], steller: "mapleFalls.sam" },
  { kennung: "riverton.reiheTamsin", themen: ["doppelangriff"], steller: "riverton.unbekannt" },
];

/** Eine beendete, ausgewertete Abenteuerpartie: Weiß (der Held) stellt mit 1. Lg5?? den Läufer ein. */
function partie(id: string, begonnen: string, gegner: string): Partieeintrag {
  return {
    partie: {
      id,
      begonnen,
      einstellung: {
        startFen: "4k3/8/7p/8/8/8/8/2B1K3 w - - 0 1",
        eigeneFarbe: "white",
        botName: gegner,
        abenteuer: { kennung: "mapleFalls.clubkampf" },
      },
      zuege: [{ san: "Bg5", von: "leser", quelle: "leser", fehler: null, verlust: 3 }],
      ruecknahmen: 0,
      uhr: null,
      ende: { art: "aufgabe", sieger: "black" },
    },
    werte: [0, -3],
    beste: ["e1e2", "h6g5"],
    abstaende: [0, 0],
    varianten: [["e1e2"], ["h6g5", "e1e2"]],
  } as unknown as Partieeintrag;
}

describe("lehrerJeBegriff", () => {
  it("nennt den Lehrer nur für versuchte Runden mit bekanntem Namen", () => {
    const sam = versuchtVariable("mapleFalls.reiheSam");
    expect(lehrerJeBegriff({}, RUNDEN).size).toBe(0);
    expect(lehrerJeBegriff({ [sam]: true }, RUNDEN).get("haengend")).toBe("Sam");
    const tamsin = versuchtVariable("riverton.reiheTamsin");
    expect(lehrerJeBegriff({ [tamsin]: true }, RUNDEN).has("gabel")).toBe(false);
  });
});

describe("fruehereFehler", () => {
  const heute = partie("heute", "2026-11-26T10:00:00.000Z", "Coach Delgado");

  it("findet dieselbe Ursache in einer früheren Partie, mit dem Gegner von damals", () => {
    const damals = partie("damals", "2026-11-25T10:00:00.000Z", "Skater Jo");
    const fehler = fruehereFehler([heute, damals], heute);
    expect(fehler.get("haengt")).toEqual({ gegner: "Skater Jo", gleicherGegner: false });
  });

  it("zählt keine spätere Partie und nicht die eigene", () => {
    const spaeter = partie("spaeter", "2026-11-27T10:00:00.000Z", "Skater Jo");
    expect(fruehereFehler([spaeter, heute], heute).size).toBe(0);
  });

  it("erkennt denselben Gegner", () => {
    const damals = partie("damals", "2026-11-25T10:00:00.000Z", "Coach Delgado");
    expect(fruehereFehler([damals], heute).get("haengt")?.gleicherGegner).toBe(true);
  });
});
