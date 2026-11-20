/**
 * Tests der Wege des Zielpfeils (oberwelt/zielwege.ts) mit den echten Orten aus inhalte/abenteuer:
 * Haltestellen als Ausgang und die Orte auf dem Weg zwischen zwei Orten.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Spieldaten } from "../daten/laden";
import { ausgangsziel, ortsstufen, ortsweg } from "./zielwege";

const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);
const daten = {
  orte: (JSON.parse(readFileSync(new URL("orte.json", INHALTE), "utf8")) as Spieldaten).orte,
} as unknown as Spieldaten;
const ort = (kennung: string) => {
  const o = daten.orte.find((x) => x.kennung === kennung);
  if (!o) throw new Error(`Ort ${kennung} fehlt`);
  return o;
};

describe("ausgangsziel", () => {
  it("nennt das Ziel eines Übergangs", () => {
    const tuer = ort("mapleFalls").ausloeser.find(
      (a) => a.art === "uebergang" && a.karte === "mapleFalls.aussen" && a.ziel,
    );
    expect(tuer).toBeDefined();
    expect(ausgangsziel(daten, ort("mapleFalls"), "mapleFalls.aussen", tuer?.name ?? "")).toBe(
      tuer?.ziel?.karte,
    );
  });

  it("führt von der Bushaltestelle in Ironwood zur Raststätte (Haltestelle, kein Übergang)", () => {
    expect(ausgangsziel(daten, ort("ironwood"), "ironwood.aussen", "busSiliconBay")).toBe(
      "wegIronwoodSilicon.raststaette",
    );
  });

  it("gibt null für einen gewöhnlichen Auslöser", () => {
    expect(ausgangsziel(daten, ort("mapleFalls"), "mapleFalls.aussen", "gibtEsNicht")).toBeNull();
  });
});

describe("ortsweg", () => {
  it("geht von Maple Falls über die Landstraße nach Cedar Creek", () => {
    expect(ortsweg(daten, "mapleFalls", "cedarCreek")).toEqual([
      "mapleFalls",
      "wegMapleCedar",
      "cedarCreek",
    ]);
  });

  it("findet von Maple Falls einen Weg bis in die späteren Akte (über den Bus)", () => {
    const weg = ortsweg(daten, "mapleFalls", "siliconBay");
    expect(weg.at(-1)).toBe("siliconBay");
    expect(weg).toContain("wegIronwoodSilicon");
    expect(weg.length).toBeGreaterThan(3);
  });

  it("bleibt im selben Ort bei sich", () => {
    expect(ortsweg(daten, "ironwood", "ironwood")).toEqual(["ironwood"]);
  });
});

describe("ortsstufen", () => {
  it("nimmt in der zweiten Stufe die Nachbarorte dazu (Zedernpfad zur Landstraße)", () => {
    const stufen = ortsstufen(daten, "wegMapleCedar", "wegMapleCedar");
    expect(stufen[0]).toEqual(["wegMapleCedar"]);
    expect(stufen[1]).toEqual(
      expect.arrayContaining(["wegMapleCedar", "mapleFalls", "cedarCreek"]),
    );
  });
});
