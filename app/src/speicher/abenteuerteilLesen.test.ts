/**
 * Tests: Der Abenteuerteil einer gespeicherten Partie überlebt das Neuladen vollständig
 * (Befund 14.11.2026: Porträt, Kulisse, Kandidaten, Buch und Bruch und „gehoer“ fehlten).
 */
import { describe, expect, it } from "vitest";
import { abenteuerteil } from "./abenteuerteilLesen";

describe("abenteuerteil", () => {
  it("behält alle Teile einer Partie des Abenteuers", () => {
    const roh = {
      kennung: "wegIronwoodSilicon.stream",
      zeitnotBis: 20,
      variante: "gehoer",
      kandidaten: ["g6", "d6"],
      buchbruch: { linie: ["e4", "e5"], stufe: 2 },
      kulisse: "wegCrossroadsPinewood.riesenbaeume",
      portraet: "portraets/kiki.svg",
      staerkeWechsel: [1],
    };
    expect(abenteuerteil(roh).abenteuer).toEqual(roh);
  });

  it("lässt kaputte Teile einzeln weg und ohne Kennung alles", () => {
    const teil = abenteuerteil({
      kennung: "x",
      variante: "unbekannt",
      buchbruch: { linie: ["e4"], stufe: 11 },
      kandidaten: [1],
    }).abenteuer;
    expect(teil).toEqual({ kennung: "x" });
    expect(abenteuerteil({ portraet: "a.svg" })).toEqual({});
  });
});
