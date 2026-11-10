/** Tests für simultan.ts: mehrere Duelle hintereinander mit Gesamtwertung (Runde 6). */
import { describe, expect, it } from "vitest";
import { laufendesSimultan, nachSimultanpartie, starteSimultan } from "./simultan";

const TAFEL = {
  kennung: "wegGhostCapital.simultan",
  begegnungen: ["wegGhostCapital.brett1", "wegGhostCapital.brett2", "wegGhostCapital.brett3"],
  mindestens: 2,
};

describe("Simultan", () => {
  it("führt Brett für Brett und wertet am Ende", () => {
    let v = starteSimultan({}, TAFEL);
    expect(laufendesSimultan(v)).toBe(TAFEL.kennung);
    const eins = nachSimultanpartie(v, TAFEL, "wegGhostCapital.brett1", "sieg");
    expect(eins.naechste).toBe("wegGhostCapital.brett2");
    v = eins.variablen;
    const zwei = nachSimultanpartie(v, TAFEL, "wegGhostCapital.brett2", "remis");
    expect(zwei.naechste).toBe("wegGhostCapital.brett3");
    const drei = nachSimultanpartie(zwei.variablen, TAFEL, "wegGhostCapital.brett3", "sieg");
    expect(drei.naechste).toBeNull();
    expect(drei.ende).toEqual({ punkte: 2.5, bestanden: true });
    expect(drei.variablen.simultanBestanden).toBe(true);
    expect(drei.variablen.simultanPunkte).toBe(2.5);
    expect(laufendesSimultan(drei.variablen)).toBeNull();
  });

  it("besteht nicht unter der Mindestzahl und ignoriert fremde Partien", () => {
    let v = starteSimultan({}, TAFEL);
    expect(nachSimultanpartie(v, TAFEL, "anders.partie", "sieg").variablen).toBe(v);
    for (const b of TAFEL.begegnungen) {
      const schritt = nachSimultanpartie(v, TAFEL, b, "niederlage");
      v = schritt.variablen;
      if (schritt.ende) expect(schritt.ende).toEqual({ punkte: 0, bestanden: false });
    }
    expect(v.simultanBestanden).toBeUndefined();
  });
});
