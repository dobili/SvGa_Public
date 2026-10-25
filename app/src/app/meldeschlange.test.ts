/** Tests für die Warteschlange der Meldungen ohne Netz (V9, Nutzungsprüfung 25.10.2026). */
import { describe, expect, it } from "vitest";
import {
  HOECHSTZAHL,
  mitNeuer,
  ohne,
  schlangeAus,
  type Meldekoerper,
  type Vorgemerkt,
} from "./meldeschlange";

const JETZT = new Date("2026-10-25T10:00:00.000Z");
const TAG_MS = 24 * 60 * 60 * 1000;

function eintrag(kennung: string, tageAlt = 0, koerper?: Meldekoerper): Vorgemerkt {
  return {
    kennung,
    zeit: new Date(JETZT.getTime() - tageAlt * TAG_MS).toISOString(),
    koerper: koerper ?? { art: "fehler", text: `Meldung ${kennung}` },
  };
}

describe("schlangeAus", () => {
  it("liest gültige Einträge, älteste zuerst", () => {
    const schlange = [eintrag("a", 2), eintrag("b", 1)];
    expect(schlangeAus(JSON.stringify(schlange), JETZT)).toEqual(schlange);
  });

  it("verwirft kaputte Merker ohne Fehler", () => {
    expect(schlangeAus(null, JETZT)).toEqual([]);
    expect(schlangeAus("{kein json", JETZT)).toEqual([]);
    expect(schlangeAus('{"a":1}', JETZT)).toEqual([]);
  });

  it("verwirft einzelne unbrauchbare und zu alte Einträge", () => {
    const roh = [
      eintrag("gut"),
      eintrag("alt", 31),
      { kennung: "ohneText", zeit: JETZT.toISOString(), koerper: { art: "fehler" } },
      { kennung: "zahl", zeit: JETZT.toISOString(), koerper: { art: "fehler", text: 3 } },
      { kennung: "ohneZeit", koerper: { art: "fehler", text: "x" } },
      "Unsinn",
    ];
    expect(schlangeAus(JSON.stringify(roh), JETZT).map((e) => e.kennung)).toEqual(["gut"]);
  });
});

describe("mitNeuer und ohne", () => {
  it("hält höchstens zehn Meldungen; die älteste fällt weg", () => {
    const voll = Array.from({ length: HOECHSTZAHL }, (_, i) => eintrag(`m${i}`));
    const neu = mitNeuer(voll, eintrag("neu"));
    expect(neu).toHaveLength(HOECHSTZAHL);
    expect(neu[0]?.kennung).toBe("m1");
    expect(neu.at(-1)?.kennung).toBe("neu");
  });

  it("entfernt genau den gesendeten Eintrag", () => {
    const schlange = [eintrag("a"), eintrag("b"), eintrag("c")];
    expect(ohne(schlange, "b").map((e) => e.kennung)).toEqual(["a", "c"]);
  });
});
