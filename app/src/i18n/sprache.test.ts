/** Tests der Sprachtechnik (seit 0.2.94): Startsprache nach Wahl oder Gerät, Wechsel, Namen. */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  beiSprachwechsel,
  fertigeSprachen,
  GRUNDSPRACHE,
  setzeSprache,
  sprache,
  sprachname,
  startsprache,
  t,
  verfuegbareSprachen,
} from "./sprache";

afterEach(() => {
  setzeSprache(GRUNDSPRACHE);
});

describe("Startsprache", () => {
  it("nimmt die Wahl des Lesers, sonst die erste passende Sprache des Geräts", () => {
    expect(startsprache(null, ["en-US", "de-DE"], ["de", "en"])).toBe("en");
    expect(startsprache("de", ["en-US"], ["de", "en"])).toBe("de");
    expect(startsprache(null, ["de-AT"], ["de", "en"])).toBe("de");
  });

  it("fällt auf Deutsch zurück, wenn nichts passt oder die Wahl verschwunden ist", () => {
    expect(startsprache(null, ["fr-FR"], ["de"])).toBe("de");
    expect(startsprache("fr", [], ["de", "en"])).toBe("de");
    expect(startsprache(null, [], ["en"])).toBe("en");
  });
});

describe("Sprachwechsel", () => {
  it("kennt Deutsch und die englische Vorschau, mit Namen in der eigenen Sprache", () => {
    expect(verfuegbareSprachen()).toEqual(["de", "en"]);
    expect(fertigeSprachen()).toEqual(["de"]);
    expect(sprachname("de")).toBe("Deutsch");
    expect(sprachname("xx")).toBe("xx");
  });

  it("lehnt unbekannte Sprachen ab und meldet nur echte Wechsel", () => {
    const melde = vi.fn();
    const abmelden = beiSprachwechsel(melde);
    expect(setzeSprache("xx")).toBe(false);
    expect(setzeSprache("de")).toBe(true);
    expect(melde).not.toHaveBeenCalled();
    expect(sprache()).toBe("de");
    expect(t("einstellungen.sprache")).toBe("Sprache");
    abmelden();
  });
});
