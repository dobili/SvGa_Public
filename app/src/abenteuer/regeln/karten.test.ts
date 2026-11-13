// Regeln der Hilfskarten und Clubnadeln (docs/spiel/06_Regelwerk.md, R17 bis R26).
import { describe, expect, it } from "vitest";
import kartendatei from "../../../../inhalte/abenteuer/karten.json";
import type { Kartensorte, Kartenspiel } from "../schnittstelle/karten";
import type { Partiekarten } from "../schnittstelle/spielstand";
import {
  besteNadel,
  clubnadel,
  deckErlaubt,
  gespiegelt,
  kartenSpielbar,
  kartenstufeDerPartie,
  mitGespielterKarte,
  nurAnwesenheit,
  vorgabeFen,
} from "./karten";
import { leererAbenteuerstand } from "./spielstand";

const SORTEN = kartendatei.karten as unknown as Kartensorte[];
const sorte = (kennung: string): Kartensorte => {
  const s = SORTEN.find((x) => x.kennung === kennung);
  if (!s) throw new Error(`Karte ${kennung} fehlt`);
  return s;
};
const spiel = (kennung: string, halbzug = 4): Kartenspiel => ({
  kennung,
  stufe: sorte(kennung).stufe,
  halbzug,
});
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("Kartenstufe und Clubnadel (R17 bis R20)", () => {
  it("ohne Karten Gold, bis zwei leichte Silber, sonst Bronze; Sanduhr zählt nicht", () => {
    expect(kartenstufeDerPartie([])).toBe("gold");
    expect(kartenstufeDerPartie([spiel("fingerzeig"), spiel("zweiteChance")])).toBe("silber");
    expect(
      kartenstufeDerPartie([spiel("fingerzeig"), spiel("zweiteChance"), spiel("gefahrenradar")]),
    ).toBe("bronze");
    expect(kartenstufeDerPartie([spiel("fluestern")])).toBe("bronze");
    expect(kartenstufeDerPartie([spiel("sanduhr")])).toBe("gold");
  });

  it("Remis Bronze, Niederlage keine, Wiedereinstieg höchstens Silber außer mit Sanduhr", () => {
    const ohne: Partiekarten = {
      deck: [],
      gespielt: [],
      wiedereinstieg: false,
      letzterHalbzug: null,
    };
    expect(clubnadel("sieg", ohne)).toBe("gold");
    expect(clubnadel("remis", ohne)).toBe("bronze");
    expect(clubnadel("niederlage", ohne)).toBeNull();
    expect(clubnadel("abgebrochen", ohne)).toBeNull();
    expect(clubnadel("sieg", { ...ohne, wiedereinstieg: true })).toBe("silber");
    expect(
      clubnadel("sieg", { ...ohne, wiedereinstieg: true, gespielt: [spiel("fluestern")] }),
    ).toBe("bronze");
    expect(clubnadel("sieg", { ...ohne, wiedereinstieg: true, gespielt: [spiel("sanduhr")] })).toBe(
      "gold",
    );
  });

  it("die beste Nadel bleibt (R21)", () => {
    expect(besteNadel(null, "bronze")).toBe("bronze");
    expect(besteNadel("silber", "bronze")).toBe("silber");
    expect(besteNadel("silber", "gold")).toBe("gold");
    expect(besteNadel("gold", null)).toBe("gold");
  });
});

describe("Vorgaben (R26)", () => {
  it("spiegelt Reihen und entfernt die Figur des Gegners", () => {
    expect(gespiegelt("f2")).toBe("f7");
    expect(gespiegelt("g1")).toBe("g8");
    expect(vorgabeFen(GRUNDSTELLUNG, "g1", "black")).toBe(
      "rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    );
    expect(vorgabeFen(GRUNDSTELLUNG, "f2", "black")).toBe(
      "rnbqkbnr/ppppp1pp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    );
    expect(vorgabeFen(GRUNDSTELLUNG, "g1", "white")).toBe(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1",
    );
  });

  it("verweigert Felder ohne Figur des Gegners", () => {
    expect(vorgabeFen(GRUNDSTELLUNG, "e4", "black")).toBeNull();
    expect(vorgabeFen(GRUNDSTELLUNG, "f2", "white")).toBe(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPP1PP/RNBQKBNR w KQkq - 0 1",
    );
  });
});

describe("Deck und Spielen (R24)", () => {
  it("höchstens drei Karten, jede einmal, höchstens eine Vorgabe, keine Sanduhr", () => {
    expect(deckErlaubt([], "fingerzeig", SORTEN)).toBe(true);
    expect(deckErlaubt(["fingerzeig"], "fingerzeig", SORTEN)).toBe(false);
    expect(deckErlaubt(["a", "b", "c"], "fingerzeig", SORTEN)).toBe(false);
    expect(deckErlaubt(["bauernvorgabe"], "springervorgabe", SORTEN)).toBe(false);
    expect(deckErlaubt(["bauernvorgabe"], "fluestern", SORTEN)).toBe(true);
    expect(deckErlaubt([], "sanduhr", SORTEN)).toBe(false);
  });

  it("spielbar nur am Zug, ohne denkende Engine, einmal je Zug, Zweite Chance erst nach dem ersten Zug", () => {
    const karten: Partiekarten = {
      deck: ["fingerzeig", "zweiteChance"],
      gespielt: [],
      wiedereinstieg: false,
      letzterHalbzug: null,
    };
    const lage = {
      leserAmZug: true,
      engineDenkt: false,
      beendet: false,
      halbzug: 2,
      eigeneZuege: 1,
    };
    expect(kartenSpielbar(karten, sorte("fingerzeig"), lage)).toBe(true);
    expect(kartenSpielbar(karten, sorte("fluestern"), lage)).toBe(false);
    expect(kartenSpielbar(karten, sorte("fingerzeig"), { ...lage, leserAmZug: false })).toBe(false);
    expect(kartenSpielbar(karten, sorte("fingerzeig"), { ...lage, engineDenkt: true })).toBe(false);
    expect(kartenSpielbar({ ...karten, letzterHalbzug: 2 }, sorte("fingerzeig"), lage)).toBe(false);
    expect(kartenSpielbar(karten, sorte("zweiteChance"), { ...lage, eigeneZuege: 0 })).toBe(false);
    expect(
      kartenSpielbar({ ...karten, gespielt: [spiel("fingerzeig")] }, sorte("fingerzeig"), lage),
    ).toBe(false);
  });

  it("verbucht Verbrauchskarten im Besitz, dauerhafte nicht", () => {
    const stand = {
      ...leererAbenteuerstand(new Date("2026-11-07T20:00:00Z"), "Kim", 800, true),
      karten: [
        { kennung: "fingerzeig", anzahl: 1, erhalten: "x" },
        { kennung: "zweiteChance", anzahl: 1, erhalten: "x" },
      ],
      partiekarten: {
        deck: ["fingerzeig", "zweiteChance"],
        gespielt: [],
        wiedereinstieg: false,
        letzterHalbzug: null,
      },
    };
    const nachFingerzeig = mitGespielterKarte(stand, sorte("fingerzeig"), 2);
    expect(nachFingerzeig.karten).toHaveLength(2);
    expect(nachFingerzeig.partiekarten?.gespielt).toEqual([spiel("fingerzeig", 2)]);
    expect(nachFingerzeig.partiekarten?.letzterHalbzug).toBe(2);
    const nachChance = mitGespielterKarte(nachFingerzeig, sorte("zweiteChance"), 4);
    expect(nachChance.karten.map((k) => k.kennung)).toEqual(["fingerzeig"]);
  });
});

describe("nurAnwesenheit (Mentor-Zug im Halbfinale, R29)", () => {
  const basis: Partiekarten = {
    deck: ["mentorzug"],
    gespielt: [],
    wiedereinstieg: false,
    letzterHalbzug: null,
  };

  it("zeigt bei freier Karte keinen Zug, nur Ambrose", () => {
    expect(nurAnwesenheit({ ...basis, frei: ["mentorzug"] }, "mentorzug")).toBe(true);
  });

  it("spielt den Zug wie bisher, wenn die Karte aus dem Besitz kommt", () => {
    expect(nurAnwesenheit(basis, "mentorzug")).toBe(false);
  });

  it("setzt beim Spielen der freien Karte mentorzugFreiGespielt", () => {
    const sorte = SORTEN.find((s) => s.kennung === "mentorzug");
    if (!sorte) throw new Error("Mentor-Zug fehlt in karten.json");
    const stand = {
      ...leererAbenteuerstand(new Date("2026-11-13T18:00:00Z"), "Kim", 800, true),
      partiekarten: { ...basis, frei: ["mentorzug"] },
    };
    expect(mitGespielterKarte(stand, sorte, 41).dialogvariablen.mentorzugFreiGespielt).toBe(true);
  });
});
