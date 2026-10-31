/**
 * Tests des Vorschlags „Schnell eine Partie“ (Entwurf J3): passender Bot zur Wertung, ohne
 * Wertung Stufe 1 bis 2, noch nicht besiegte zuerst, Vorbelegung vorn, Quellen als Liste.
 */
import { describe, expect, it } from "vitest";
import { GEGNER, gegnerVon, istSpassbot, klasseVon } from "../../../engine/gegner";
import {
  GLEICH_SPANNE,
  botzahl,
  grundNachAbstand,
  passendeBots,
  vorschlaege,
  vorschlagAn,
  type Vorschlagskontext,
} from "./vorschlag";

const LEER: Vorschlagskontext = {
  vorbelegt: null,
  staerke: null,
  tempo: "rapid",
  besiegt: [],
  eigene: [],
};
const MITTLERE_WERTUNG = 1200;

/** Die Zahl eines vorgeschlagenen Bots in Schnellschach. */
function zahl(bot: string): number {
  const g = gegnerVon(bot);
  if (!g) throw new Error(`unbekannter Bot ${bot}`);
  return botzahl(g, "rapid");
}

describe("passendeBots", () => {
  it("schlägt ohne Wertung nur Bots der Stufe 1 bis 2 vor, schwächster zuerst", () => {
    const liste = passendeBots(LEER);
    expect(liste.length).toBeGreaterThan(0);
    for (const v of liste) {
      const g = gegnerVon(v.bot);
      expect(g && klasseVon(g).nummer).toBeLessThanOrEqual(2);
      expect(v.grund).toBe("einstieg");
    }
    const zahlen = liste.map((v) => zahl(v.bot));
    expect([...zahlen].sort((a, b) => a - b)).toEqual(zahlen);
  });

  it("schlägt mit Wertung den nächstliegenden Bot vor, nie einen Spaß-Bot", () => {
    const liste = passendeBots({ ...LEER, staerke: MITTLERE_WERTUNG });
    const erster = liste[0];
    expect(erster?.grund).toBe("gleich");
    const naechster = Math.min(
      ...GEGNER.filter((g) => !istSpassbot(g)).map((g) =>
        Math.abs(botzahl(g, "rapid") - MITTLERE_WERTUNG),
      ),
    );
    expect(Math.abs(zahl(erster?.bot ?? "") - MITTLERE_WERTUNG)).toBe(naechster);
    expect(liste.some((v) => GEGNER.some((g) => g.kennung === v.bot && istSpassbot(g)))).toBe(
      false,
    );
  });

  it("stellt schon besiegte Bots hinter die noch nicht besiegten", () => {
    const vorher = passendeBots({ ...LEER, staerke: MITTLERE_WERTUNG });
    const erster = vorher[0]?.bot ?? "";
    const nachher = passendeBots({ ...LEER, staerke: MITTLERE_WERTUNG, besiegt: [erster] });
    expect(nachher[0]?.bot).not.toBe(erster);
    expect(nachher.at(-1)?.bot).toBe(erster);
  });
});

describe("grundNachAbstand", () => {
  it("nennt nahe Bots gleich stark, ferne stärker oder schwächer", () => {
    expect(grundNachAbstand(700, 700 - GLEICH_SPANNE)).toBe("gleich");
    expect(grundNachAbstand(1000, 640)).toBe("staerker");
    expect(grundNachAbstand(400, 640)).toBe("schwaecher");
  });
});

describe("vorschlaege", () => {
  it("setzt die Vorbelegung an den Anfang und nennt jeden Bot nur einmal", () => {
    const passend = passendeBots({ ...LEER, staerke: MITTLERE_WERTUNG });
    const dritter = passend[2]?.bot ?? "";
    const liste = vorschlaege({ ...LEER, staerke: MITTLERE_WERTUNG, vorbelegt: dritter });
    expect(liste[0]).toEqual({ bot: dritter, grund: "vorbelegt" });
    expect(liste.filter((v) => v.bot === dritter)).toHaveLength(1);
  });

  it("übergeht eine Vorbelegung mit unbekanntem Bot", () => {
    const liste = vorschlaege({ ...LEER, vorbelegt: "eigen-geloescht" });
    expect(liste[0]?.grund).toBe("einstieg");
  });

  it("nimmt neue Quellen aus der Liste in ihrer Reihenfolge", () => {
    const quelle = {
      kennung: "test",
      vorschlaege: () => [{ bot: "tom", grund: "gleich" as const }],
    };
    expect(vorschlaege(LEER, [quelle])).toEqual([{ bot: "tom", grund: "gleich" }]);
  });
});

describe("vorschlagAn", () => {
  it("zählt rundum weiter und liefert ohne Vorschlag null", () => {
    const liste = [
      { bot: "a", grund: "gleich" as const },
      { bot: "b", grund: "gleich" as const },
      { bot: "c", grund: "gleich" as const },
    ];
    expect(vorschlagAn(liste, 4)?.bot).toBe("b");
    expect(vorschlagAn([], 0)).toBeNull();
  });
});
