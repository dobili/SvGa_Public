/** Tests der Tönung nach der Spieluhr (uhrtoenung.ts): Uhr, Vorrang der Geschichte, innen. */
import { describe, expect, it } from "vitest";
import { MINUTEN_JE_TAG } from "../regeln/spieluhr";
import { toenungJetzt, uhrToenung, type Toenungswelt } from "./uhrtoenung";

const um = (stunde: number) => MINUTEN_JE_TAG + stunde * 60;
const karte = (toenung?: string) =>
  toenung ? { properties: [{ name: "toenung", value: toenung }] } : {};
function welt(teil: Partial<Toenungswelt> = {}): Toenungswelt {
  return {
    karte: karte(),
    kennung: "mapleFalls.aussen",
    innen: false,
    erinnerung: false,
    ort: { karten: [{ kennung: "mapleFalls.aussen" }] },
    ...teil,
  };
}
const stand = (stunde: number, dialogvariablen: Record<string, string> = {}) => ({
  spieluhr: um(stunde),
  dialogvariablen,
});

describe("Tönung nach der Spieluhr", () => {
  it("draußen: Morgen, Tag ohne, Abend, Nacht", () => {
    expect([7, 12, 19, 23].map((s) => toenungJetzt(welt(), stand(s)))).toEqual([
      "morgen",
      null,
      "abend",
      "nacht",
    ]);
  });

  it("innen ohne Tönung, nachts nur gedämpft", () => {
    expect(uhrToenung("abend", true)).toBeNull();
    expect(toenungJetzt(welt({ innen: true }), stand(23))).toBe("innennacht");
  });

  it("Geschichte geht vor: Dialog, Szene, Licht aus orte.json", () => {
    expect(toenungJetzt(welt(), stand(23, { "toenung.mapleFalls.aussen": "keine" }))).toBeNull();
    expect(toenungJetzt(welt({ karte: karte("nebel") }), stand(23))).toBe("nebel");
    const ort = { karten: [{ kennung: "mapleFalls.aussen", licht: "dunst" }] };
    expect(toenungJetzt(welt({ ort }), stand(12))).toBe("dunst");
  });

  it("licht „tag“ aus orte.json lässt die Uhr gelten, Erinnerungen bleiben ohne Uhr", () => {
    const ort = { karten: [{ kennung: "mapleFalls.aussen", licht: "tag" }] };
    expect(toenungJetzt(welt({ ort, karte: karte("nebel") }), stand(23))).toBe("nacht");
    expect(toenungJetzt(welt({ erinnerung: true }), stand(23))).toBeNull();
  });
});
