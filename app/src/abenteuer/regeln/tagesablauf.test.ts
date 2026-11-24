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
  fortgeschickte,
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
        { art: "nacht", von: 2, bis: 6, karte: "mapleFalls.diner", feld: [3, 4], tut: "sitzt" },
        {
          art: "nacht",
          von: 6,
          bis: 9,
          karte: "mapleFalls.diner",
          feld: [3, 5],
          tut: "steht",
          blick: "rechts",
        },
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

  it("fortgeschickt: alle Figuren der Person tragen ein wenn, keines gilt (Big Joe nach Akt 3)", () => {
    const nurMitWenn = [
      { kennung: "ironwood.bigJoe", sprite: "figuren/big-joe.png", wenn: "nicht endeAkt3Gesehen" },
    ];
    const ablaeufe: Tagesablaeufe = {
      figuren: { bigJoe: { ort: "ironwood", bloecke: [{ art: "nacht", von: 0, bis: 0 }] } },
    };
    const z = personenDerFiguren(nurMitWenn, ablaeufe);
    expect(fortgeschickte(nurMitWenn, z, { endeAkt3Gesehen: true }).has("bigJoe")).toBe(true);
    expect(fortgeschickte(nurMitWenn, z, { endeAkt3Gesehen: false }).size).toBe(0);
    // Carla hat eine Figur ohne wenn: nie fortgeschickt.
    expect(fortgeschickte(FIGUREN, personenDerFiguren(FIGUREN, ABLAEUFE), {}).size).toBe(0);
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

  it("stellt Stehende mit Blick auf (Nachbarn an der Bank schauen sich an, 23.11.2026)", () => {
    const z = personenDerFiguren(FIGUREN, ABLAEUFE);
    const diner = (stunde: number) =>
      nachTagesablauf(karteMitCarla(), {
        karte: "mapleFalls.diner",
        stunde,
        zuordnung: z,
        fest: new Set<string>(),
        ablaeufe: ABLAEUFE,
      }).layers[1]?.objects?.at(-1);
    expect(diner(7)).toMatchObject({
      name: "carla",
      properties: [{ name: "blick", value: "rechts" }],
    });
    expect(diner(3)).toMatchObject({
      properties: [
        { name: "sitzt", value: "unten" },
        { name: "sitzrichtung", value: "moebel" },
      ],
    });
  });
});

describe("Ohne Stuhlbild steht die Figur neben dem Stuhl (Wunsch des Autors, 23.11.2026)", () => {
  it("nimmt das freie Nachbarfeld aus ohnesitzbild.json, sonst null", () => {
    // Seit dem 23.11.2026 kann die Tabelle leer sein (Sitzplätze ohne Grund wurden Stehplätze).
    const personen: Readonly<Record<string, Readonly<Record<string, number[]>>>> =
      ohnesitzbild.personen;
    for (const [person, stellen] of Object.entries(personen)) {
      for (const [stelle, feld] of Object.entries(stellen)) {
        const [karte = "", lage = ""] = stelle.split("@");
        const [x = 0, y = 0] = lage.split(",").map(Number);
        const block = { art: "freizeit", von: 0, bis: 1, karte, feld: [x, y], tut: "sitzt" };
        expect(standStattSitz(person, block)).toEqual(feld);
        expect(standStattSitz(person, { ...block, tut: "steht" })).toBeNull();
      }
    }
    const block = { art: "freizeit", von: 0, bis: 1, karte: "a.b", feld: [1, 1], tut: "sitzt" };
    expect(standStattSitz("niemand", block)).toBeNull();
  });
});
