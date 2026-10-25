/** Tests der zwei Zahlensätze (engine/zahlensatz.ts) und ihrer Wirkung auf die Gegnerwertung. */
import { afterEach, describe, expect, it } from "vitest";
import { gegnerstaerke, staerkeDerStufe, staerkeDesBots } from "./botstaerke";
import { BOT_STAERKE, STUFEN_STAERKE } from "./botstaerke-daten";
import { BOT_STAERKE_MAIA, STUFEN_STAERKE_MAIA } from "./botstaerke-maia-daten";
import { aktiverAnzeigesatz, satzFuer, setzeAnzeigesatz } from "./zahlensatz";

const FUENF = { eroeffnung: 5, mittelspiel: 5, endspiel: 5 } as const;

describe("Zahlensatz ohne und mit Maia", () => {
  afterEach(() => setzeAnzeigesatz(false));

  it("Anzeige folgt dem Schalter, die Partie ihrem eigenen Satz", () => {
    expect(aktiverAnzeigesatz()).toBe("ohne");
    setzeAnzeigesatz(true);
    expect(satzFuer(undefined)).toBe("mit");
    expect(satzFuer(false)).toBe("ohne");
    expect(staerkeDerStufe(5)).toBe(STUFEN_STAERKE_MAIA[5]);
    expect(staerkeDesBots("tom")).toBe(BOT_STAERKE_MAIA.tom);
    expect(staerkeDerStufe(5, "rapid", false)).toBe(STUFEN_STAERKE[5]);
  });

  it("Gegnerwertung: maia an der Partie zählt, alte Partien ohne Angabe ohne Maia", () => {
    setzeAnzeigesatz(true);
    expect(gegnerstaerke({ bot: "tom", stufenJePhase: FUENF })).toBe(BOT_STAERKE.tom);
    expect(gegnerstaerke({ bot: "tom", stufenJePhase: FUENF, maia: true })).toBe(
      BOT_STAERKE_MAIA.tom,
    );
  });
});
