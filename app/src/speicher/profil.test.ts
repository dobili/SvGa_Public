/** Tests des Spielerprofils: Lesen aus Rohdaten, Grenzen, Adresse des Bildes. */
import { describe, expect, it } from "vitest";
import { wandleUm } from "./format";
import { bildadresse, LEERES_PROFIL, MAX_PROFILNAME, MAX_SVG_ZEICHEN, profilAus } from "./profil";

const JETZT = new Date("2026-10-25T12:00:00Z");

describe("profilAus", () => {
  it("liest Namen und ein gewähltes Porträt, kürzt und trimmt den Namen", () => {
    const p = profilAus({ name: "  Dana  ", bild: { art: "wahl", kennung: "wahl-07" } });
    expect(p).toEqual({ name: "Dana", bild: { art: "wahl", kennung: "wahl-07" } });
    expect(profilAus({ name: "x".repeat(MAX_PROFILNAME + 5) }).name).toHaveLength(MAX_PROFILNAME);
  });

  it("liest ein gebautes Porträt nur mit SVG und in der Größengrenze", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
    expect(profilAus({ bild: { art: "bau", merkmale: { haar: "long" }, svg } }).bild).toEqual({
      art: "bau",
      merkmale: { haar: "long" },
      svg,
    });
    expect(profilAus({ bild: { art: "bau", svg: "<script>" } }).bild).toBeNull();
    const riesig = `<svg>${"a".repeat(MAX_SVG_ZEICHEN)}</svg>`;
    expect(profilAus({ bild: { art: "bau", svg: riesig } }).bild).toBeNull();
  });

  it("verwirft Fremdes: Kennung eines Bots, kaputte Werte", () => {
    expect(profilAus({ bild: { art: "wahl", kennung: "lotta" } }).bild).toBeNull();
    expect(profilAus("kaputt")).toEqual(LEERES_PROFIL);
    expect(profilAus({ name: 7 })).toEqual(LEERES_PROFIL);
  });

  it("ältere Nutzerdaten ohne Profil bekommen das leere; ein Profil übersteht das Umwandeln", () => {
    const alt = wandleUm({ schemaVersion: 6 }, JETZT);
    expect(alt.ok && alt.daten.profil).toEqual(LEERES_PROFIL);
    const mit = wandleUm({ schemaVersion: 6, profil: { name: "Dana" } }, JETZT);
    expect(mit.ok && mit.daten.profil.name).toBe("Dana");
  });
});

describe("bildadresse", () => {
  it("Datei der Porträtwahl oder data-Adresse des SVG", () => {
    expect(bildadresse({ art: "wahl", kennung: "wahl-07" }, "/app/")).toBe(
      "/app/gegner/wahl-07.svg",
    );
    const adresse = bildadresse({ art: "bau", merkmale: {}, svg: "<svg></svg>" }, "/app/");
    expect(adresse.startsWith("data:image/svg+xml")).toBe(true);
  });
});
