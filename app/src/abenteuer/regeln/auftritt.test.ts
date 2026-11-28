/** Tests für regeln/auftritt.ts: wer beim Neuaufbau einer Karte hereinkommt, hinausgeht oder wartet. */
import { describe, expect, it } from "vitest";
import {
  aufstellungsstunde,
  auftrittsplan,
  eingangsfeld,
  gehendeFiguren,
  OHNE_AUFTRITT,
  wartendeFiguren,
  weltauftritt,
  type Aufstellung,
} from "./auftritt";
import {
  gemerkteAufstellung,
  merkeAufstellung,
  naechsterAufbauOhneAuftritt,
  vergissAufstellung,
} from "../oberwelt/auftrittsgedaechtnis";

const CLUBRAUM = "mapleFalls.clubraum";
const vorDemClubkampf: Aufstellung = {
  karte: CLUBRAUM,
  figuren: new Map([
    ["coachDelgado", { x: 15, y: 4 }],
    ["sam", { x: 5, y: 8 }],
  ]),
};
const ohneGeister = new Set<string>();
const TUER = [
  { name: "schule", x: 13, y: 14 },
  { name: "schule", x: 14, y: 14 },
];

describe("auftrittsplan", () => {
  it("nach dem gewonnenen Clubkampf kommt Pratt herein, Hale und {rivale} warten in der Tür", () => {
    const plan = auftrittsplan(vorDemClubkampf, CLUBRAUM, {
      jetzt: ["coachDelgado", "sam", "prattClub", "haleClub", "victorClub"],
      gehend: [],
      wartend: ["haleClub", "victorClub"],
      geister: ohneGeister,
    });
    expect(plan.kommen).toEqual(["prattClub"]);
    expect(plan.wartend).toEqual(["haleClub", "victorClub"]);
    expect(plan.gehen).toEqual([]);
  });

  it("wer nicht mehr darf, geht von dort, wo er zuletzt stand", () => {
    const vorher: Aufstellung = {
      karte: CLUBRAUM,
      figuren: new Map([["victorClub", { x: 9, y: 3 }]]),
    };
    const plan = auftrittsplan(vorher, CLUBRAUM, {
      jetzt: [],
      gehend: ["victorClub"],
      wartend: [],
      geister: ohneGeister,
    });
    expect(plan.gehen).toEqual([{ name: "victorClub", feld: { x: 9, y: 3 } }]);
  });

  it("andere Karte, erster Aufbau: niemand kommt, nur die Wartenden warten", () => {
    const lage = { jetzt: ["prattClub"], gehend: [], wartend: ["haleClub"], geister: ohneGeister };
    expect(auftrittsplan(null, CLUBRAUM, lage)).toEqual({
      ...OHNE_AUFTRITT,
      wartend: ["haleClub"],
    });
    const draussen = { ...vorDemClubkampf, karte: "mapleFalls.aussen" };
    expect(auftrittsplan(draussen, CLUBRAUM, lage).kommen).toEqual([]);
  });

  it("Geister blenden sich selbst ein und aus", () => {
    const plan = auftrittsplan(vorDemClubkampf, CLUBRAUM, {
      jetzt: ["coachDelgado", "sam", "ambrose"],
      gehend: [],
      wartend: [],
      geister: new Set(["ambrose"]),
    });
    expect(plan.kommen).toEqual([]);
  });
});

describe("wartende und gehende Figuren", () => {
  const angabe = (name: string) =>
    name === "haleClub" ? { wartet: "nicht victorGesehen" } : undefined;
  it("warten, solange die Bedingung gilt", () => {
    expect(wartendeFiguren(["haleClub", "sam"], angabe, {})).toEqual(["haleClub"]);
    expect(wartendeFiguren(["haleClub"], angabe, { victorGesehen: true })).toEqual([]);
  });
  it("gehen, wenn sie zuletzt da standen und ihre Bedingung nicht mehr gilt", () => {
    const vorher: Aufstellung = {
      karte: CLUBRAUM,
      figuren: new Map([["prattClub", { x: 10, y: 12 }]]),
    };
    const wenn = () => "nadelMapleFalls > 0 und nicht heimwegNadelGesehen";
    const nachHeimweg = { nadelMapleFalls: 1, heimwegNadelGesehen: true };
    expect(gehendeFiguren(vorher, CLUBRAUM, wenn, nachHeimweg)).toEqual(["prattClub"]);
    expect(gehendeFiguren(vorher, CLUBRAUM, wenn, { nadelMapleFalls: 1 })).toEqual([]);
    expect(gehendeFiguren(vorher, "mapleFalls.aussen", wenn, nachHeimweg)).toEqual([]);
  });
  it("weltauftritt sammelt Wartende, Gehende auf der Karte und den Übergang je Figur", () => {
    const mitVon = (name: string) =>
      name === "mama" ? { wartet: "nicht mamaInKantine", von: "kantineAusgang" } : undefined;
    const lage = { gehend: ["fort", "hank"], variablen: {} };
    expect(weltauftritt(["mama", "hank"], mitVon, lage)).toEqual({
      wartend: ["mama"],
      gehend: ["hank"],
      von: { mama: "kantineAusgang" },
    });
  });
});

describe("eingangsfeld", () => {
  it("der nächste Übergang, ein zweiter Auftritt nimmt das andere Feld", () => {
    const belegt = new Set<string>();
    const hale = eingangsfeld({ x: 18, y: 5 }, TUER, undefined, belegt);
    expect(hale).toEqual({ x: 14, y: 14 });
    belegt.add("14,14");
    expect(eingangsfeld({ x: 9, y: 3 }, TUER, undefined, belegt)).toEqual({ x: 13, y: 14 });
  });
  it("`von` geht vor, ohne Übergang null", () => {
    const zwei = [...TUER, { name: "hof", x: 0, y: 5 }];
    expect(eingangsfeld({ x: 14, y: 13 }, zwei, "hof")).toEqual({ x: 0, y: 5 });
    expect(eingangsfeld({ x: 1, y: 1 }, [])).toBeNull();
  });
});

describe("Gedächtnis der Auftritte", () => {
  it("merkt die Aufstellung; nach dem Warten zählt der nächste Aufbau nicht", () => {
    vergissAufstellung();
    merkeAufstellung(vorDemClubkampf);
    expect(gemerkteAufstellung()).toBe(vorDemClubkampf);
    naechsterAufbauOhneAuftritt();
    expect(gemerkteAufstellung()).toBeNull();
    expect(gemerkteAufstellung()).toBe(vorDemClubkampf);
    vergissAufstellung();
    expect(gemerkteAufstellung()).toBeNull();
  });

  it("gilt nur für den Spielstand, auf dem sie gemerkt wurde (Hauptmenü, 27.11.2026)", () => {
    vergissAufstellung();
    merkeAufstellung(vorDemClubkampf, "2026-11-08T05:00:00.000Z");
    expect(gemerkteAufstellung("2026-11-20T05:00:00.000Z")).toBeNull();
    expect(gemerkteAufstellung("2026-11-08T05:00:00.000Z")).toBe(vorDemClubkampf);
    vergissAufstellung();
  });
});

describe("aufstellungsstunde (Befund des Autors, 28.11.2026: Coach nach der Partie fort)", () => {
  it("auf derselben Karte gilt die Stunde des letzten Aufbaus, auch nach #uhr:abend", () => {
    const um15 = { ...vorDemClubkampf, stunde: 15 };
    expect(aufstellungsstunde(um15, CLUBRAUM, 19)).toBe(15);
  });

  it("andere Karte, nichts gemerkt (Neuladen, Warten) oder ohne Stunde: die Uhr jetzt", () => {
    const um15 = { ...vorDemClubkampf, stunde: 15 };
    expect(aufstellungsstunde(um15, "mapleFalls.park", 19)).toBe(19);
    expect(aufstellungsstunde(null, CLUBRAUM, 19)).toBe(19);
    expect(aufstellungsstunde(vorDemClubkampf, CLUBRAUM, 19)).toBe(19);
  });
});
