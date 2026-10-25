/** Tests des Vorrats für den Eröffnungsindex (V6): einmal bauen, gleiche Objekte, neu nach Wechsel. */
import { describe, expect, it } from "vitest";
import type { Eroeffnungsliste } from "../daten/laden";
import { ladeKapitel } from "./buchabbildungen.testhilfe";
import { buchzuegeAb } from "./eroeffnungsindex";
import {
  eroeffnungsindexBereit,
  eroeffnungsindexFuer,
  eroeffnungsnamenFuer,
} from "./eroeffnungsindexVorrat";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("Vorrat des Eröffnungsindex", () => {
  it("baut zu denselben Kapiteln einmal und liefert dasselbe Objekt", () => {
    const kapitel = [ladeKapitel(2), ladeKapitel(3)];
    expect(eroeffnungsindexBereit(kapitel)).toBe(false);
    const index = eroeffnungsindexFuer(kapitel);
    expect(eroeffnungsindexBereit(kapitel)).toBe(true);
    expect(eroeffnungsindexFuer([...kapitel])).toBe(index);
    expect(buchzuegeAb(index, GRUNDSTELLUNG)).toContain("e4");
  });

  it("hängt die Namen an, ohne neu zu bauen, und bleibt dabei stabil", () => {
    const kapitel = [ladeKapitel(2), ladeKapitel(3)];
    const liste = {
      stellungen: [["schluessel", "C60", "Ruy Lopez"]],
    } as unknown as Eroeffnungsliste;
    const namen = eroeffnungsnamenFuer(liste);
    expect(eroeffnungsnamenFuer(liste)).toBe(namen);
    const mitNamen = eroeffnungsindexFuer(kapitel, namen);
    expect(mitNamen.bekannte?.get("schluessel")).toEqual({ eco: "C60", name: "Ruy Lopez" });
    expect(mitNamen.stellungen).toBe(eroeffnungsindexFuer(kapitel).stellungen);
    expect(eroeffnungsindexFuer(kapitel, namen)).toBe(mitNamen);
  });

  it("baut für neue Kapitelobjekte (etwa nach einem Sprachwechsel) neu", () => {
    const alt = eroeffnungsindexFuer([ladeKapitel(2), ladeKapitel(3)]);
    const neueKapitel = [structuredClone(ladeKapitel(2)), structuredClone(ladeKapitel(3))];
    expect(eroeffnungsindexBereit(neueKapitel)).toBe(false);
    expect(eroeffnungsindexFuer(neueKapitel)).not.toBe(alt);
  });
});
