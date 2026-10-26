/** Tests für die Schritte des Engine-Knopfes während der Partie. */
import { describe, expect, it } from "vitest";
import type { LetzterZugUrteil } from "../../../engine/letzterzug";
import {
  brauchtWarum,
  eigenerLetzterZug,
  naechsterSchritt,
  urteilsschluessel,
  zugtext,
  type EigenesUrteil,
} from "./spielEngineSchritte";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function urteil(zeichen: LetzterZugUrteil["zeichen"], warBester = false): LetzterZugUrteil {
  return { zeichen, verlust: 0, besterWert: 0, gespielterWert: 0, besterZug: null, warBester };
}

function eigenes(zeichen: LetzterZugUrteil["zeichen"]): EigenesUrteil {
  const zug = { vorherFen: GRUNDSTELLUNG, danachFen: GRUNDSTELLUNG, uci: "e2e4" };
  return { zug, urteil: urteil(zeichen), erklaerung: null };
}

describe("eigenerLetzterZug", () => {
  it("nimmt den vorletzten Halbzug: nach 1. e4 e5 ist es e2e4", () => {
    const zug = eigenerLetzterZug(GRUNDSTELLUNG, ["e4", "e5"]);
    expect(zug?.uci).toBe("e2e4");
    expect(zug?.vorherFen).toBe(GRUNDSTELLUNG);
    expect(zug?.danachFen.split(" ")[1]).toBe("b");
  });

  it("gibt null ohne eigenen Zug (erster Zug der Partie)", () => {
    expect(eigenerLetzterZug(GRUNDSTELLUNG, [])).toBeNull();
    expect(eigenerLetzterZug(GRUNDSTELLUNG, ["e4"])).toBeNull();
  });
});

describe("naechsterSchritt", () => {
  const zug = eigenerLetzterZug(GRUNDSTELLUNG, ["e4", "e5"]);

  it("beginnt mit der Bewertung", () => {
    expect(naechsterSchritt(0, zug, null)).toBe(1);
  });

  it("überspringt das Urteil ohne eigenen Zug", () => {
    expect(naechsterSchritt(1, null, null)).toBe(4);
    expect(naechsterSchritt(1, zug, null)).toBe(2);
  });

  it("fragt „Warum?“ nur bei ?!, ? und ??", () => {
    expect(naechsterSchritt(2, zug, eigenes("?"))).toBe(3);
    expect(naechsterSchritt(2, zug, eigenes("?!"))).toBe(3);
    expect(naechsterSchritt(2, zug, eigenes("!"))).toBe(4);
    expect(naechsterSchritt(2, zug, eigenes(null))).toBe(4);
  });

  it("zeigt die Zeile „Warum“ nur zu schlechten Zügen", () => {
    expect(brauchtWarum(eigenes("??"))).toBe(true);
    expect(brauchtWarum(eigenes(null))).toBe(false);
    expect(brauchtWarum(null)).toBe(false);
  });

  it("endet nach dem besten Zug", () => {
    expect(naechsterSchritt(3, zug, eigenes("??"))).toBe(4);
    expect(naechsterSchritt(4, zug, eigenes("??"))).toBeNull();
  });
});

describe("urteilsschluessel", () => {
  it("ordnet die Zeichen den Klassen der Auswertung zu", () => {
    expect(urteilsschluessel(urteil("??"))).toBe("spielengine.urteil.patzer");
    expect(urteilsschluessel(urteil("?"))).toBe("spielengine.urteil.fehler");
    expect(urteilsschluessel(urteil("?!"))).toBe("spielengine.urteil.ungenau");
    expect(urteilsschluessel(urteil("!"))).toBe("spielengine.urteil.einziger");
    expect(urteilsschluessel(urteil(null, true))).toBe("spielengine.urteil.bester");
    expect(urteilsschluessel(urteil(null))).toBe("spielengine.urteil.gut");
    expect(urteilsschluessel(null)).toBe("spielengine.urteil.keins");
  });
});

describe("zugtext", () => {
  it("schreibt den Zug mit Nummer in deutscher Notation", () => {
    expect(zugtext(GRUNDSTELLUNG, "g1f3")).toBe("1. Sf3");
  });
});
