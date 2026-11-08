// Schnellreise mit der Monatskarte (docs/spiel/11, I6): nur besuchte Städte, ohne die aktuelle.
import { describe, expect, it } from "vitest";
import ortedatei from "../../../../inhalte/abenteuer/orte.json";
import type { Ortdaten } from "../daten/laden";
import { reiseziele } from "./reiseziele";

const ORTE = ortedatei.orte as unknown as Ortdaten[];

describe("Reiseziele", () => {
  it("nennt besuchte Städte in ihrer Reihenfolge, ohne Wege, Erinnerungen und die aktuelle", () => {
    const besucht = ["riverton", "mapleFalls", "wegMapleCedar", "cedarCreek", "erinnerungLondon"];
    const ziele = reiseziele(ORTE, besucht, "riverton");
    expect(ziele.map((z) => z.ort.kennung)).toEqual(["mapleFalls", "cedarCreek"]);
    for (const z of ziele) expect(z.karte).toMatch(/\.aussen$/);
  });
});
