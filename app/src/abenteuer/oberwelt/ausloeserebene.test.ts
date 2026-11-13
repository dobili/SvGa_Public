/** Tests für ausloeserebene.ts: Auslöser aus der Tiled-Ebene lesen und den Treffer finden. */
import { describe, expect, it } from "vitest";
import {
  MELDE_START,
  liesAusloeser,
  meldeschritt,
  mitDurchgang,
  triffAusloeser,
  type Ausloeser,
} from "./ausloeserebene";

const KACHEL = 16;

describe("Auslöser der Karte", () => {
  it("liest Auslöser und Figuren, lässt Belebung, Möbel und Namenlose weg", () => {
    const objekte = [
      { name: "brett", x: 48, y: 32 },
      { name: "jo", type: "figur", x: 16, y: 16 },
      { name: "taube", type: "tier", x: 0, y: 0 },
      { name: "bank", type: "moebel", x: 0, y: 0 },
      { name: "passant", type: "statist", x: 0, y: 0 },
      { name: "", x: 0, y: 0 },
    ];
    expect(liesAusloeser(objekte, KACHEL)).toEqual([
      { name: "brett", typ: "ausloeser", x: 3, y: 2 },
      { name: "jo", typ: "figur", x: 1, y: 1 },
    ]);
  });

  it("trifft zuerst die eigene Kachel, sonst die davor", () => {
    const brett = { name: "brett", typ: "ausloeser" as const, x: 3, y: 2 };
    const tuer = { name: "tuer", typ: "ausloeser" as const, x: 3, y: 3 };
    expect(triffAusloeser([brett], { x: 3, y: 3, richtung: "oben" })).toEqual({
      treffer: brett,
      darauf: null,
    });
    expect(triffAusloeser([brett, tuer], { x: 3, y: 3, richtung: "oben" })).toEqual({
      treffer: tuer,
      darauf: tuer,
    });
    expect(triffAusloeser([brett], { x: 3, y: 3, richtung: "unten" }).treffer).toBeNull();
  });

  // Gehweg (Reihe 3) vor einem Haus (Reihe 2 gesperrt), Türfeld auf (3, 3); R060.
  const gehweg = (x: number, y: number) => x >= 0 && x < 8 && y >= 3 && y < 6;
  const tuer: Ausloeser = { name: "tuer", typ: "ausloeser", x: 3, y: 3 };

  it("leitet den Durchgang aus der Wand ab und liest die Angabe der Szene", () => {
    expect(mitDurchgang([tuer], gehweg, ["tuer"])[0]?.durchgang).toEqual(["oben"]);
    // Kein Übergang (Gegenstand): bleibt ohne Durchgang.
    expect(mitDurchgang([tuer], gehweg, [])[0]?.durchgang).toBeUndefined();
    const treppe = {
      name: "treppe",
      x: 64,
      y: 64,
      properties: [{ name: "durchgang", value: "unten" }],
    };
    expect(liesAusloeser([treppe], KACHEL)[0]?.durchgang).toEqual(["unten"]);
    // Frei im Raum und zwei Felder breit: Man geht tiefer hinein.
    const luke = [
      { name: "luke", typ: "ausloeser" as const, x: 3, y: 4 },
      { name: "luke", typ: "ausloeser" as const, x: 4, y: 4 },
    ];
    expect(mitDurchgang(luke, gehweg, ["luke"]).map((a) => a.durchgang)).toEqual([
      ["rechts"],
      ["links"],
    ]);
  });

  it("wechselt nicht beim Darüberlaufen oder Stehen, nur beim Gehen zur Tür", () => {
    const alle = mitDurchgang([tuer], gehweg, ["tuer"]);
    const frisch = { letzter: null, startOffen: false };
    // Von links über das Türfeld gelaufen: darauf, aber nicht durch.
    const quer = meldeschritt(frisch, alle, { x: 3, y: 3, richtung: "rechts", geht: true });
    expect(quer.meldung).toEqual({ name: "tuer", typ: "ausloeser", darauf: true, durch: false });
    // Stehen mit Blick zur Tür: weiter nicht durch.
    const steht = meldeschritt(quer.zustand, alle, { x: 3, y: 3, richtung: "oben", geht: false });
    expect(steht.meldung).toBeUndefined();
    // Taste nach oben: jetzt durch.
    const hinein = meldeschritt(steht.zustand, alle, { x: 3, y: 3, richtung: "oben", geht: true });
    expect(hinein.meldung).toEqual({ name: "tuer", typ: "ausloeser", darauf: true, durch: true });
  });

  it("schweigt auf dem Auslöser der Ankunft, bis der Held ihn verlassen hat", () => {
    const alle = mitDurchgang([tuer], gehweg, ["tuer"]);
    const an = meldeschritt(MELDE_START, alle, { x: 3, y: 3, richtung: "unten", geht: false });
    expect(an.meldung).toBeUndefined();
    // Sofort wieder zur Tür gedrückt: kein Rückwechsel.
    const zurueck = meldeschritt(an.zustand, alle, { x: 3, y: 3, richtung: "oben", geht: true });
    expect(zurueck.meldung).toBeUndefined();
    // Einen Schritt weg und wieder hinein: Jetzt zählt die Tür.
    const weg = meldeschritt(zurueck.zustand, alle, { x: 3, y: 4, richtung: "unten", geht: true });
    const wieder = meldeschritt(weg.zustand, alle, { x: 3, y: 3, richtung: "oben", geht: true });
    expect(wieder.meldung?.durch).toBe(true);
  });
});
