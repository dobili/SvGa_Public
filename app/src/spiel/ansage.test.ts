/** Tests für ansage.ts: Ansagen der Partie nach Gehör erreichen ihre Zuhörer (Runde 6). */
import { describe, expect, it } from "vitest";
import { beiAnsage, letzteAnsage, sageAn, type Ansage } from "./ansage";

describe("Ansage", () => {
  it("benachrichtigt Zuhörer und merkt sich die letzte Ansage", () => {
    const gehoert: (Ansage | null)[] = [];
    const ab = beiAnsage((a) => gehoert.push(a));
    sageAn({ partie: "weg7.funk#1", san: "Nf3" });
    expect(letzteAnsage()).toEqual({ partie: "weg7.funk#1", san: "Nf3" });
    ab();
    sageAn(null);
    expect(gehoert).toEqual([{ partie: "weg7.funk#1", san: "Nf3" }]);
    expect(letzteAnsage()).toBeNull();
  });
});
