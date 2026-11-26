/** Tests für oberwelt/auftrittsziele.ts: Welche `#gehe` in einen Übergang führen, Auslöser rücken mit. */
import { describe, expect, it } from "vitest";
import type { Ausloeser } from "./ausloeserebene";
import { istAusgang, rueckeAusloeser, uebergangsfelder } from "./auftrittsziele";
import type { Fuehrungszugang } from "./fuehrungsschicht";

/** Ein Zugang nur mit Auslösern und Übergängen (mehr lesen diese Hilfen nicht). */
function clubraum(): Fuehrungszugang {
  const ausloeser: Ausloeser[] = [
    { name: "schule", typ: "ausloeser", x: 13, y: 14 },
    { name: "schule", typ: "ausloeser", x: 14, y: 14 },
    { name: "brettOhneDame", typ: "ausloeser", x: 18, y: 7 },
    { name: "haleClub", typ: "figur", x: 18, y: 5 },
  ];
  return { ausloeser, uebergaenge: ["schule"] } as unknown as Fuehrungszugang;
}

describe("auftrittsbild", () => {
  it("Übergänge der Karte: die Felder der Tür", () => {
    expect(uebergangsfelder(clubraum()).map((u) => `${u.x},${u.y}`)).toEqual(["13,14", "14,14"]);
  });

  it("#gehe in die Tür (Name oder Feld) führt hinaus, ins Feld davor nicht", () => {
    const z = clubraum();
    expect(istAusgang(z, { name: "schule" })).toBe(true);
    expect(istAusgang(z, { feld: { x: 14, y: 14 } })).toBe(true);
    expect(istAusgang(z, { feld: { x: 13, y: 13 } })).toBe(false);
    expect(istAusgang(z, { name: "coachDelgado" })).toBe(false);
  });

  it("der Auslöser einer Figur rückt mit ihr", () => {
    const z = clubraum();
    rueckeAusloeser(z, "haleClub", { x: 14, y: 13 });
    expect(z.ausloeser.find((a) => a.name === "haleClub")).toMatchObject({ x: 14, y: 13 });
  });
});
