/**
 * Tests der Vorbelegung „Partie gegen diesen Bot“ (P8 Rivalen, P13 eigene Ziele): Bot mit seinen
 * Stufen, gewertet, Bedenkzeit der Zeitart; die übrigen Vorlieben bleiben.
 */
import { describe, expect, it } from "vitest";
import { gegnerVon } from "../../../engine/gegner";
import { wertungstempo } from "../../../spiel/elomodell";
import { STANDARD_VORLIEBEN } from "../../../speicher/partien";
import { uhrFuerTempo, vorbelegteVorlieben } from "./vorbelegung";

const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;
const BLITZ_3_2 = { grundzeitMs: 3 * MINUTE_MS, zuschlagMs: 2 * SEKUNDE_MS };

describe("uhrFuerTempo", () => {
  it("behält die zuletzt gewählte Bedenkzeit, wenn sie zur Zeitart passt", () => {
    expect(uhrFuerTempo(BLITZ_3_2, "blitz")).toBe(BLITZ_3_2);
    expect(uhrFuerTempo(BLITZ_3_2, null)).toBe(BLITZ_3_2);
  });

  it("nimmt sonst die erste Vorgabe der Zeitart", () => {
    const schnell = uhrFuerTempo(BLITZ_3_2, "rapid");
    expect(schnell && wertungstempo(schnell)).toBe("rapid");
    expect(schnell?.grundzeitMs).toBe(10 * MINUTE_MS);
    const klassisch = uhrFuerTempo(null, "classical");
    expect(klassisch && wertungstempo(klassisch)).toBe("classical");
  });
});

describe("vorbelegteVorlieben", () => {
  it("setzt Engine, Bot mit seinen Stufen, Wertung und Zeitart", () => {
    const alt = { ...STANDARD_VORLIEBEN, gegner: "mensch" as const, gewertet: false };
    const neu = vorbelegteVorlieben(alt, { bot: "lotte", tempo: "blitz" }, []);
    const lotte = gegnerVon("lotte");
    expect(neu.gegner).toBe("engine");
    expect(neu.bot).toBe("lotte");
    expect(neu.gewertet).toBe(true);
    expect(neu.stufenJePhase).toEqual(lotte?.stufenJePhase);
    expect(neu.stufe).toBe(lotte?.stufenJePhase.mittelspiel);
    expect(neu.uhr && wertungstempo(neu.uhr)).toBe("blitz");
    expect(neu.hilfen).toBe(alt.hilfen);
  });

  it("findet eigene Bots des Lesers", () => {
    const stufen = { eroeffnung: 4, mittelspiel: 5, endspiel: 6 } as const;
    const eigener = {
      kennung: "eigen-1",
      name: "Onkel Paul",
      stufenJePhase: stufen,
      fehlerarten: [],
      stil: 0,
      blindeFlecken: [],
    };
    const neu = vorbelegteVorlieben(STANDARD_VORLIEBEN, { bot: "eigen-1", tempo: null }, [eigener]);
    expect(neu.bot).toBe("eigen-1");
    expect(neu.stufenJePhase).toEqual(stufen);
    expect(neu.uhr).toBe(STANDARD_VORLIEBEN.uhr);
  });

  it("lässt die Vorlieben bei einem unbekannten Bot unverändert", () => {
    expect(vorbelegteVorlieben(STANDARD_VORLIEBEN, { bot: "weg", tempo: "blitz" }, [])).toBe(
      STANDARD_VORLIEBEN,
    );
  });
});
