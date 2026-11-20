/**
 * Tests für maiapflicht.ts: „Spiel laden“ zählt Maia mit (Wunsch des Autors, 18.11.2026); seit
 * dem 20.11.2026 lädt Maia im Hintergrund, das vorhandene Spiel startet ohne zu warten.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ladeMaiaImHintergrund,
  maiaImHintergrundAus,
  mitMaiaPflicht,
  TESTSCHALTER_OHNE_MAIA,
  type Maiazugriff,
} from "./maiapflicht";

const MAIA_BYTES = 96_000_000;
const SPIEL_BYTES = 40_000_000;

function zugriff(
  geladen: boolean,
  online = true,
): Maiazugriff & { lade: ReturnType<typeof vi.fn> } {
  return {
    geladen: () => Promise.resolve(geladen),
    groesse: () => Promise.resolve(MAIA_BYTES),
    lade: vi.fn((fortschritt: (g: number, t: number) => void) => {
      fortschritt(MAIA_BYTES, MAIA_BYTES);
      return Promise.resolve();
    }),
    melde: () => Promise.resolve(true),
    online: () => online,
  };
}

describe("mitMaiaPflicht", () => {
  it("lässt das vorhandene Paket gelten, wenn Maia da ist", async () => {
    const spiel = { art: "vorhanden", version: "1", bytes: SPIEL_BYTES } as const;
    expect(await mitMaiaPflicht(spiel, zugriff(true))).toEqual(spiel);
  });

  it("startet ein vorhandenes Spiel, auch wenn Maia noch fehlt (lädt im Hintergrund)", async () => {
    const spiel = { art: "vorhanden", version: "1", bytes: SPIEL_BYTES } as const;
    expect(await mitMaiaPflicht(spiel, zugriff(false))).toEqual(spiel);
  });

  it("lässt ein vorhandenes Spiel ohne Netz auch ohne Maia gelten", async () => {
    const spiel = { art: "vorhanden", version: "1", bytes: SPIEL_BYTES } as const;
    expect(await mitMaiaPflicht(spiel, zugriff(false, false))).toEqual(spiel);
  });

  it("zählt beide Größen zusammen, wenn beides fehlt", async () => {
    const spiel = { art: "fehlt", bytes: SPIEL_BYTES } as const;
    expect(await mitMaiaPflicht(spiel, zugriff(false))).toEqual({
      art: "fehlt",
      bytes: SPIEL_BYTES + MAIA_BYTES,
    });
  });

  it("lässt einen Fehler unverändert", async () => {
    const fehler = { art: "fehler", grund: "unbekannt" } as const;
    expect(await mitMaiaPflicht(fehler, zugriff(false))).toEqual(fehler);
  });
});

describe("ladeMaiaImHintergrund", () => {
  it("lädt Maia, wenn es fehlt, und meldet den Fortschritt", async () => {
    const maia = zugriff(false);
    const meldungen: number[] = [];
    expect(await ladeMaiaImHintergrund((g) => meldungen.push(g), maia)).toBe(true);
    expect(maia.lade).toHaveBeenCalledOnce();
    expect(meldungen.at(-1)).toBe(MAIA_BYTES);
  });

  it("lädt Maia nicht doppelt, wenn es schon da ist", async () => {
    const maia = zugriff(true);
    expect(await ladeMaiaImHintergrund(() => undefined, maia)).toBe(true);
    expect(maia.lade).not.toHaveBeenCalled();
  });

  it("lädt bei zwei Aufrufen zugleich nur einmal", async () => {
    const maia = zugriff(false);
    await Promise.all([
      ladeMaiaImHintergrund(() => undefined, maia),
      ladeMaiaImHintergrund(() => undefined, maia),
    ]);
    expect(maia.lade).toHaveBeenCalledOnce();
  });

  it("ergibt false ohne Netz und bei Netzfehlern, ohne zu werfen", async () => {
    expect(await ladeMaiaImHintergrund(() => undefined, zugriff(false, false))).toBe(false);
    const kaputt = { ...zugriff(false), lade: vi.fn(() => Promise.reject(new Error("Netz"))) };
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(await ladeMaiaImHintergrund(() => undefined, kaputt)).toBe(false);
  });
});

describe("neue Version des Spiels", () => {
  const alt = { art: "veraltet", version: "1", neu: "2" } as const;

  it("lädt mit Netz die neue Version (fehlt mit neuerStand)", async () => {
    expect(await mitMaiaPflicht(alt, zugriff(true))).toEqual({ art: "fehlt", neuerStand: true });
  });

  it("spielt ohne Netz die alte Fassung weiter", async () => {
    expect(await mitMaiaPflicht(alt, zugriff(true, false))).toEqual(alt);
  });
});

describe("maiaImHintergrundAus (Testschalter der Oberflächentests)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("ist ohne Fenster und ohne Schalter aus, nur mit true an", () => {
    expect(maiaImHintergrundAus()).toBe(false);
    vi.stubGlobal("window", {});
    expect(maiaImHintergrundAus()).toBe(false);
    vi.stubGlobal("window", { [TESTSCHALTER_OHNE_MAIA]: "ja" });
    expect(maiaImHintergrundAus()).toBe(false);
    vi.stubGlobal("window", { [TESTSCHALTER_OHNE_MAIA]: true });
    expect(maiaImHintergrundAus()).toBe(true);
  });
});
