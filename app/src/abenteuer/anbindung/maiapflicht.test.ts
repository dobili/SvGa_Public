/**
 * Tests für maiapflicht.ts: Das Spielpaket gilt nur mit Maia als vorhanden, und „Spiel laden“
 * lädt Maia mit, wenn es fehlt (Wunsch des Autors, 18.11.2026).
 */
import { describe, expect, it, vi } from "vitest";
import { ladeSpielMitMaia, mitMaiaPflicht, type Maiazugriff } from "./maiapflicht";

const MAIA_BYTES = 96_000_000;
const SPIEL_BYTES = 40_000_000;

function zugriff(geladen: boolean): Maiazugriff & { lade: ReturnType<typeof vi.fn> } {
  return {
    geladen: () => Promise.resolve(geladen),
    groesse: () => Promise.resolve(MAIA_BYTES),
    lade: vi.fn((fortschritt: (g: number, t: number) => void) => {
      fortschritt(MAIA_BYTES, MAIA_BYTES);
      return Promise.resolve();
    }),
    melde: () => Promise.resolve(true),
  };
}

describe("mitMaiaPflicht", () => {
  it("lässt das vorhandene Paket gelten, wenn Maia da ist", async () => {
    const spiel = { art: "vorhanden", version: "1", bytes: SPIEL_BYTES } as const;
    expect(await mitMaiaPflicht(spiel, zugriff(true))).toEqual(spiel);
  });

  it("meldet „fehlt“ mit der Größe von Maia, wenn nur Maia fehlt", async () => {
    const spiel = { art: "vorhanden", version: "1", bytes: SPIEL_BYTES } as const;
    expect(await mitMaiaPflicht(spiel, zugriff(false))).toEqual({
      art: "fehlt",
      bytes: MAIA_BYTES,
    });
  });

  it("zählt beide Größen zusammen, wenn beides fehlt", async () => {
    const spiel = { art: "fehlt", bytes: SPIEL_BYTES } as const;
    expect(await mitMaiaPflicht(spiel, zugriff(false))).toEqual({
      art: "fehlt",
      bytes: SPIEL_BYTES + MAIA_BYTES,
    });
  });

  it("lässt veraltet und Fehler unverändert", async () => {
    const veraltet = { art: "veraltet", version: "1", neu: "2" } as const;
    expect(await mitMaiaPflicht(veraltet, zugriff(false))).toEqual(veraltet);
  });
});

describe("ladeSpielMitMaia", () => {
  it("lädt Maia nach dem Spielpaket, mit gemeinsamem Fortschritt", async () => {
    const maia = zugriff(false);
    const meldungen: [number, number][] = [];
    await ladeSpielMitMaia(
      (f) => {
        f(SPIEL_BYTES, SPIEL_BYTES);
        return Promise.resolve();
      },
      (g, t) => meldungen.push([g, t]),
      maia,
    );
    expect(maia.lade).toHaveBeenCalledOnce();
    expect(meldungen.at(-1)).toEqual([SPIEL_BYTES + MAIA_BYTES, SPIEL_BYTES + MAIA_BYTES]);
  });

  it("lädt Maia nicht doppelt, wenn es schon da ist", async () => {
    const maia = zugriff(true);
    await ladeSpielMitMaia(
      () => Promise.resolve(),
      () => undefined,
      maia,
    );
    expect(maia.lade).not.toHaveBeenCalled();
  });
});
