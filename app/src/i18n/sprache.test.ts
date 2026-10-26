/** Tests der Sprachtechnik: Startsprache nach Wahl oder Gerät, Wechsel, Namen. */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  beiSprachwechsel,
  datensprache,
  fertigeSprachen,
  GRUNDSPRACHE,
  istGeladen,
  ladeSprache,
  setzeSprache,
  sprache,
  sprachname,
  startsprache,
  t,
  trainerdatensprache,
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
    expect(sprachname("en")).toBe("English (preview)");
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

describe("Laden einer weiteren Sprache (V4)", () => {
  it("nimmt Englisch erst nach dem Laden an und lehnt Unbekanntes ab", async () => {
    expect(istGeladen("de")).toBe(true);
    if (!istGeladen("en")) expect(setzeSprache("en")).toBe(false);
    await ladeSprache("en");
    expect(istGeladen("en")).toBe(true);
    expect(setzeSprache("en")).toBe(true);
    expect(t("einstellungen.sprache")).toBe("Language");
    await expect(ladeSprache("xx")).rejects.toThrow("Unbekannte Sprache");
  });
});

describe("Datensprache (P6)", () => {
  it("Buch- und Trainerdaten auf Englisch englisch (Trainerdaten seit R25)", async () => {
    expect(datensprache()).toBe("de");
    expect(trainerdatensprache()).toBe("de");
    await ladeSprache("en");
    setzeSprache("en");
    expect(datensprache()).toBe("en");
    expect(trainerdatensprache()).toBe("en");
  });
});
