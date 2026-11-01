/** Tests für das Verknüpfen von Varianten mit Lernsammlung und Fehlerdatenbank (Stufe 4). */
import { describe, expect, it } from "vitest";
import {
  KEINE_WAHL,
  mitVariantenwahl,
  verknuepfte,
  waehlbare,
  WAHL_NEU,
} from "./variantenverknuepfung";
import { HOECHSTENS_VARIATIONEN, type Variation } from "./variationen";
import { ausStellung } from "./variationsquellen";

const JETZT = new Date("2026-11-01T10:00:00.000Z");
const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ZIEL = { art: "sammlung", id: "s-1" } as const;

function variation(id: string, geaendert = "2026-10-01T00:00:00.000Z"): Variation {
  const v = ausStellung("grund", GRUND, id, JETZT);
  if (!v) throw new Error("keine Grundstellung");
  return { ...v, id, geaendert };
}

describe("mitVariantenwahl", () => {
  it("keine Wahl ändert nichts", () => {
    const liste = [variation("a")];
    expect(mitVariantenwahl(liste, ZIEL, KEINE_WAHL, () => null, JETZT)).toEqual({ liste, grenze: false });
  });

  it("eine vorhandene Variante verknüpfen setzt ihre Quelle", () => {
    const { liste } = mitVariantenwahl([variation("a"), variation("b")], ZIEL, { wahl: "b", loesen: [] }, () => null, JETZT);
    expect(verknuepfte(liste, ZIEL).map((v) => v.id)).toEqual(["b"]);
    expect(waehlbare(liste, ZIEL).map((v) => v.id)).toEqual(["a"]);
  });

  it("lösen setzt die Quelle auf „Stellung“", () => {
    const verknuepft = { ...variation("a"), quelle: ZIEL };
    const { liste } = mitVariantenwahl([verknuepft], ZIEL, { wahl: "", loesen: ["a"] }, () => null, JETZT);
    expect(liste[0]?.quelle).toEqual({ art: "fen" });
  });

  it("neu legt eine Variante mit der Quelle des Eintrags an", () => {
    const { liste, grenze } = mitVariantenwahl([], ZIEL, { wahl: WAHL_NEU, loesen: [] }, () => variation(""), JETZT);
    expect(grenze).toBe(false);
    expect(liste).toHaveLength(1);
    expect(liste[0]?.quelle).toEqual(ZIEL);
    expect(liste[0]?.id).toMatch(/^var-/);
  });

  it("an der Grenze bleibt die neue weg und es wird gemeldet", () => {
    const voll = Array.from({ length: HOECHSTENS_VARIATIONEN }, (_, i) => variation(`v${i}`));
    const ergebnis = mitVariantenwahl(voll, ZIEL, { wahl: WAHL_NEU, loesen: [] }, () => variation(""), JETZT);
    expect(ergebnis.grenze).toBe(true);
    expect(ergebnis.liste).toHaveLength(HOECHSTENS_VARIATIONEN);
  });
});
