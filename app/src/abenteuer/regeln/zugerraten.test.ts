/** Tests für regeln/zugerraten.ts: wann das Zugerraten läuft, Trefferprüfung, Hinweis. */
import { describe, expect, it } from "vitest";
import type { Partiemoment, Partieverlauf } from "./partiemomente";
import {
  HINWEIS_ALLGEMEIN,
  HINWEIS_TURM,
  hinweisschluessel,
  versuchTrifft,
  zugerratenLaeuft,
} from "./zugerraten";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Weißer Turm auf f1 kann nach f7 schlagen (Turmopfer vor dem König). */
const TURMSTELLUNG = "6k1/5p1p/8/8/8/8/6PP/5RK1 w - - 0 1";

/** Verlauf mit `zuege` Halbzügen, der Held (Weiß) zieht die ungeraden. */
function verlauf(halbzuege: number): Partieverlauf {
  return {
    fens: Array.from({ length: halbzuege + 1 }, () => GRUND),
    vomHelden: Array.from({ length: halbzuege }, (_, i) => i % 2 === 0),
    held: "white",
  };
}

const MOMENT: Partiemoment = {
  wenn: { abZug: 2 },
  sprecher: "erzaehler",
  dialog: "capital-arena-halle.halbfinale_turm",
  zugerraten: true,
};

describe("zugerratenLaeuft", () => {
  it("läuft nach dem Moment, bis der Held wieder zieht", () => {
    // Halbzug 3 ist der 2. Zug des Helden: der Moment spricht.
    expect(zugerratenLaeuft([MOMENT], verlauf(3))).toBe(true);
    expect(zugerratenLaeuft([MOMENT], verlauf(4))).toBe(true);
    expect(zugerratenLaeuft([MOMENT], verlauf(5))).toBe(false);
  });

  it("läuft nicht vor dem Moment und nicht ohne zugerraten", () => {
    expect(zugerratenLaeuft([MOMENT], verlauf(2))).toBe(false);
    expect(zugerratenLaeuft([{ ...MOMENT, zugerraten: false }], verlauf(4))).toBe(false);
  });
});

describe("versuchTrifft", () => {
  it("vergleicht in UCI, gleich wie der Zug geschrieben ist", () => {
    expect(versuchTrifft(TURMSTELLUNG, "f1f7", "Rxf7")).toBe(true);
    expect(versuchTrifft(TURMSTELLUNG, "f1f7", "h3")).toBe(false);
  });
});

describe("hinweisschluessel", () => {
  it("fragt beim Turmzug nach dem Turm, sonst allgemein", () => {
    expect(hinweisschluessel(TURMSTELLUNG, "f1f7")).toBe(HINWEIS_TURM);
    expect(hinweisschluessel(TURMSTELLUNG, "h2h3")).toBe(HINWEIS_ALLGEMEIN);
  });
});
