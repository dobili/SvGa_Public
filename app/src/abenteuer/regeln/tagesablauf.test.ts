/**
 * Tests der Tagesabläufe (regeln/tagesablauf.ts): Blöcke über Mitternacht, Zuordnung der
 * Szenenvarianten zur Person, Regel 1 (Geschichte geht vor) und die Aufstellung auf der Karte.
 */
import { describe, expect, it } from "vitest";
import ohnesitzbild from "./ohnesitzbild.json";
import {
  standStattSitz,
  blockZur,
  festgehaltene,
  imBlock,
  nachTagesablauf,
  personenDerFiguren,
  type Tagesablaeufe,
} from "./tagesablauf";

const ABLAEUFE: Tagesablaeufe = {
  figuren: {
    carla: {
      ort: "mapleFalls",
      bloecke: [
        {
          art: "arbeit",
          von: 9,
          bis: 17,
          karte: "mapleFalls.aussen",
          feld: [28, 24],
          tut: "steht",
        },
        {
          art: "freizeit",
          von: 17,
          bis: 23,
          karte: "mapleFalls.park",
          feld: [22, 24],
          tut: "sitzt",
        },
        { art: "schlaf", von: 23, bis: 2 },
        { art: "nacht", von: 2, bis: 9, karte: "mapleFalls.diner", feld: [3, 4], tut: "sitzt" },
      ],
    },
    victor: { folgt_geschichte: true },
  },
};
const FIGUREN = [
  { kennung: "mapleFalls.carla", sprite: "figuren/carla.png" },
  { kennung: "mapleFalls.carlaClub", sprite: "figuren/carla.png", wenn: "clubabend" },
  { kennung: "mapleFalls.victor", sprite: "figuren/victor.png" },
];

/** Eine kleine Tiled-Karte mit Carla vor ihrem Haus. */
function karteMitCarla() {
  return {
    layers: [
      { name: "boden" },
      {
        name: "ausloeser",
        objects: [
          { name: "carla", type: "figur", x: 448, y: 384 },
          { name: "victor", type: "figur", x: 16, y: 16 },
        ],
      },
    ],
  };
}

describe("Tagesablauf", () => {
  it("Blöcke über Mitternacht und ganze Tage", () => {
    expect(imBlock({ von: 23, bis: 2 }, 0)).toBe(true);
    expect(imBlock({ von: 23, bis: 2 }, 2)).toBe(false);
    expect(imBlock({ von: 0, bis: 0 }, 13)).toBe(true);
    expect(blockZur(ABLAEUFE.figuren.carla, 1)?.art).toBe("schlaf");
  });

  it("ordnet Szenenvarianten der Person zu", () => {
    const z = personenDerFiguren(FIGUREN, ABLAEUFE);
    expect(z.get("carlaClub")).toBe("carla");
    expect(z.get("victor")).toBe("victor");
  });

  it("Regel 1: Questziel und gültige Variante halten die Figur fest", () => {
    const z = personenDerFiguren(FIGUREN, ABLAEUFE);
    expect(festgehaltene(FIGUREN, z, new Set(["carla"]), {}).has("carla")).toBe(true);
    expect(festgehaltene(FIGUREN, z, new Set(), { clubabend: true }).has("carla")).toBe(true);
    expect(festgehaltene(FIGUREN, z, new Set(), {}).size).toBe(0);
  });

  it("stellt nach der Uhr auf: abends im Park, nachts unsichtbar, festgehalten am Platz", () => {
    const z = personenDerFiguren(FIGUREN, ABLAEUFE);
    const aufstellung = (karte: string, stunde: number, fest: Set<string> = new Set()) =>
      nachTagesablauf(karteMitCarla(), { karte, stunde, zuordnung: z, fest, ablaeufe: ABLAEUFE });
    const namen = (k: ReturnType<typeof karteMitCarla>) =>
      k.layers[1]?.objects?.map((o) => o.name) ?? [];
    expect(namen(aufstellung("mapleFalls.aussen", 12))).toEqual(["victor", "carla"]);
    expect(namen(aufstellung("mapleFalls.aussen", 19))).toEqual(["victor"]);
    expect(namen(aufstellung("mapleFalls.aussen", 0))).toEqual(["victor"]);
    const park = aufstellung("mapleFalls.park", 19).layers[1]?.objects?.at(-1);
    expect(park).toMatchObject({ name: "carla", x: 352, y: 384 });
    // Außerhalb ihres Heimatorts stellt die Geschichte sie hin (Mama in Ironwood): sie bleibt.
    expect(namen(aufstellung("ironwood.aussen", 0))).toEqual(["carla", "victor"]);
    expect(namen(aufstellung("mapleFalls.aussen", 0, new Set(["carla"])))).toEqual([
      "carla",
      "victor",
    ]);
  });

  it("behält auf dem Feld der Szene Zustand und Standbild aus dem Editor (1.9)", () => {
    const z = personenDerFiguren(FIGUREN, ABLAEUFE);
    const zustand = { name: "zustand", value: "sitzboden" };
    const karte = karteMitCarla();
    const carla = karte.layers[1]?.objects?.[0];
    if (carla) Object.assign(carla, { properties: [zustand] });
    const um = (stunde: number) =>
      nachTagesablauf(karte, {
        karte: "mapleFalls.aussen",
        stunde,
        zuordnung: z,
        fest: new Set<string>(),
        ablaeufe: ABLAEUFE,
      }).layers[1]?.objects?.at(-1);
    // Um 12 steht sie laut Ablauf auf (28, 24), dem Feld der Szene: Zustand bleibt.
    expect(um(12)).toMatchObject({ name: "carla", x: 448, y: 384, properties: [zustand] });
  });
});

describe("Ohne Stuhlbild steht die Figur neben dem Stuhl (Wunsch des Autors, 23.11.2026)", () => {
  it("nimmt das freie Nachbarfeld aus ohnesitzbild.json, sonst null", () => {
    const [person, stellen] = Object.entries(ohnesitzbild.personen)[0] ?? ["", {}];
    const [stelle, feld] = Object.entries(stellen)[0] ?? ["", []];
    const [karte = "", lage = ""] = stelle.split("@");
    const [x, y] = lage.split(",").map(Number);
    const block = { art: "freizeit", von: 0, bis: 1, karte, feld: [x ?? 0, y ?? 0], tut: "sitzt" };
    expect(standStattSitz(person, block)).toEqual(feld);
    expect(standStattSitz(person, { ...block, tut: "steht" })).toBeNull();
    expect(standStattSitz("niemand", block)).toBeNull();
  });
});
