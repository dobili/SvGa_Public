/**
 * Tests des Kartenzustands im Fächer (docs/spiel/29_Tischgespraech.md, Abschnitt Kartenfächer):
 * Zustand und Grund je Karte, im Einklang mit kartenSpielbar und passtZurPartie (R24, S2).
 * Jeder Grund hat einen Satz in den Spieltexten.
 */
import { describe, expect, it } from "vitest";
import kartendatei from "../../../../inhalte/abenteuer/karten.json";
import type { Kartensorte } from "../schnittstelle/karten";
import type { Partiekarten } from "../schnittstelle/spielstand";
import { hatSpieltext } from "../texte/texte";
import { kartenSpielbar } from "./karten";
import { kartenzustand, zustandsschluessel, type Spiellage } from "./kartenzustand";
import { passtZurPartie } from "./zeitkarten";

const SORTEN = kartendatei.karten as unknown as Kartensorte[];
const sorte = (kennung: string): Kartensorte => {
  const s = SORTEN.find((x) => x.kennung === kennung);
  if (!s) throw new Error(`Karte ${kennung} fehlt`);
  return s;
};

/** Halbzug der Beispiele: der Leser ist nach drei eigenen Zügen wieder am Zug. */
const HALBZUG = 6;
const LAGE: Spiellage = {
  leserAmZug: true,
  engineDenkt: false,
  beendet: false,
  halbzug: HALBZUG,
  eigeneZuege: 3,
};
const PARTIE = { uhr: true, sprueche: true, remis: true };
const DECK: Partiekarten = {
  deck: SORTEN.map((s) => s.kennung),
  gespielt: [],
  wiedereinstieg: false,
  letzterHalbzug: null,
};

const mitGespielt = (kennung: string, halbzug: number): Partiekarten => ({
  ...DECK,
  gespielt: [{ kennung, stufe: sorte(kennung).stufe, halbzug }],
  letzterHalbzug: halbzug,
});

describe("Kartenzustand im Fächer", () => {
  it("zeigt eine spielbare Karte ohne Grund", () => {
    expect(kartenzustand(DECK, sorte("fingerzeig"), LAGE, PARTIE, null)).toEqual({
      zustand: "spielbar",
      grund: null,
    });
  });

  it("nennt den Grund je Fall", () => {
    const grund = (k: string, lage = LAGE, partie = PARTIE, karten = DECK) =>
      kartenzustand(karten, sorte(k), lage, partie, null).grund;
    expect(grund("fingerzeig", { ...LAGE, leserAmZug: false })).toBe("faecher.grund.nichtAmZug");
    expect(grund("fingerzeig", { ...LAGE, engineDenkt: true })).toBe("faecher.grund.nichtAmZug");
    expect(grund("fingerzeig", { ...LAGE, beendet: true })).toBe("faecher.grund.beendet");
    expect(grund("zweiteChance", { ...LAGE, eigeneZuege: 0 })).toBe("faecher.grund.ersterZug");
    expect(grund("kuehlerKopf", LAGE, { ...PARTIE, uhr: false })).toBe("faecher.grund.ohneUhr");
    expect(grund("grossesMaul", LAGE, { ...PARTIE, sprueche: false })).toBe(
      "faecher.grund.keinSpruch",
    );
    expect(grund("remisangebot", LAGE, { ...PARTIE, remis: false })).toBe(
      "faecher.grund.keinRemis",
    );
    expect(grund("bauernvorgabe")).toBe("faecher.grund.vorher");
    expect(grund("sanduhr")).toBe("faecher.grund.nachher");
    const andere = mitGespielt("waage", HALBZUG);
    expect(grund("fingerzeig", LAGE, PARTIE, andere)).toBe("faecher.grund.eineJeZug");
  });

  it("sperrt alle anderen Karten, solange eine wirkt", () => {
    const befund = kartenzustand(DECK, sorte("fingerzeig"), LAGE, PARTIE, "fluestern");
    expect(befund).toEqual({ zustand: "gesperrt", grund: "faecher.grund.laeuft" });
  });

  it("dreht Verbrauchskarten um, dauerhafte glänzen nur in ihrer Stellung", () => {
    const waage = kartenzustand(mitGespielt("waage", 2), sorte("waage"), LAGE, PARTIE, null);
    expect(waage.zustand).toBe("verbraucht");
    const jetzt = mitGespielt("fingerzeig", HALBZUG);
    expect(kartenzustand(jetzt, sorte("fingerzeig"), LAGE, PARTIE, null).zustand).toBe("wirkt");
    const frueher = mitGespielt("fingerzeig", 2);
    expect(kartenzustand(frueher, sorte("fingerzeig"), LAGE, PARTIE, null)).toEqual({
      zustand: "gespielt",
      grund: "faecher.grund.einmal",
    });
  });

  it("ist spielbar genau dann, wenn kartenSpielbar und passtZurPartie ja sagen", () => {
    const lagen: Spiellage[] = [LAGE, { ...LAGE, leserAmZug: false }, { ...LAGE, eigeneZuege: 0 }];
    const partien = [PARTIE, { uhr: false, sprueche: false, remis: false }];
    for (const s of SORTEN)
      for (const lage of lagen)
        for (const partie of partien) {
          const geht = kartenSpielbar(DECK, s, lage) && passtZurPartie(s, partie);
          const befund = kartenzustand(DECK, s, lage, partie, null);
          expect(befund.zustand === "spielbar", `${s.kennung}`).toBe(geht);
        }
  });

  it("hat für jeden Grund und Zustand einen Text", () => {
    const gruende = [
      "vorher nachher keinSpruch keinRemis ohneUhr beendet nichtAmZug eineJeZug ersterZug",
      "laeuft sonst verbraucht wirkt einmal",
    ]
      .join(" ")
      .split(" ")
      .map((g) => `faecher.grund.${g}`);
    const zustaende = (["spielbar", "gesperrt", "wirkt", "gespielt", "verbraucht"] as const).map(
      zustandsschluessel,
    );
    for (const schluessel of [...gruende, ...zustaende])
      expect(hatSpieltext(schluessel), schluessel).toBe(true);
  });
});
