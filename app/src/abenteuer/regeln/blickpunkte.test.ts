/**
 * Tests für regeln/blickpunkte.ts: Ein Blickpunkt löst im Radius aus, je Knoten nur einmal, nicht
 * bei Abwesenheit, nicht während ein Fenster offen ist oder die Ankunftsruhe läuft, und höchstens
 * einer je 30 Sekunden. Dazu: Die Probeeinträge in ambrose_blickpunkte.json haben ihre Knoten.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ANKUNFTSRUHE_MS,
  BLICKPAUSE_MS,
  BLICKUHR_START,
  blickBereit,
  blickpunktHier,
  blicktakt,
  blickvariable,
  liesBlickpunkte,
  nachAnkunft,
  nachBlickpunkt,
  type Blicklage,
  type Blickpunkt,
  type Blickuhr,
} from "./blickpunkte";

const lies = (pfad: string) =>
  readFileSync(new URL(`../../../../inhalte/abenteuer/${pfad}`, import.meta.url), "utf8");

const KIOSK: Blickpunkt = {
  karte: "mapleFalls.park",
  feld: [25, 13],
  radius: 3,
  knoten: "blick_mapleFalls_park_kiosk",
};
const BANK: Blickpunkt = {
  karte: "mapleFalls.park",
  feld: [24, 17],
  radius: 2,
  knoten: "blick_mapleFalls_park_bank",
};
const WACH = { ersteLektionBesprochen: true };
const lage: Blicklage = {
  karte: "mapleFalls.park",
  x: 25,
  y: 16,
  variablen: WACH,
  knoten: new Set([KIOSK.knoten, BANK.knoten]),
};
const TAKT = 250;

/** Lässt die Uhr `takte` Takte laufen. */
function laufe(uhr: Blickuhr, takte: number, frei = true): Blickuhr {
  let u = uhr;
  for (let i = 0; i < takte; i++) u = blicktakt(u, TAKT, frei);
  return u;
}

describe("Blickpunkte: Daten", () => {
  it("liest eine Liste oder { blickpunkte } und lässt Unvollständiges weg", () => {
    expect(liesBlickpunkte([KIOSK])).toEqual([KIOSK]);
    expect(liesBlickpunkte({ blickpunkte: [KIOSK, { karte: "x" }] })).toEqual([KIOSK]);
    expect(
      liesBlickpunkte([
        { ...KIOSK, feld: [1] },
        { ...KIOSK, radius: "3" },
      ]),
    ).toEqual([]);
    expect(liesBlickpunkte(null)).toEqual([]);
  });

  it("die Variable heißt wie der Knoten mit _gesehen", () => {
    expect(blickvariable(KIOSK.knoten)).toBe("blick_mapleFalls_park_kiosk_gesehen");
  });
});

describe("Blickpunkte: wo und wann einer auslöst", () => {
  const hier = (aenderung: Partial<Blicklage>, punkte = [KIOSK]) =>
    blickpunktHier(punkte, { ...lage, ...aenderung });

  it("im Radius (Luftlinie), nicht außerhalb und nicht auf einer anderen Karte", () => {
    expect(hier({})).toBe(KIOSK);
    expect(hier({ x: 27, y: 15 })).toBe(KIOSK);
    expect(hier({ y: 17 })).toBeNull();
    expect(hier({ x: 28, y: 16 })).toBeNull();
    expect(hier({ karte: "mapleFalls.aussen" })).toBeNull();
  });

  it("mehrere Stellen je Karte: die nächste zuerst, danach die andere", () => {
    expect(hier({}, [KIOSK, BANK])).toBe(BANK);
    const variablen = { ...WACH, [blickvariable(BANK.knoten)]: true };
    expect(hier({ variablen }, [KIOSK, BANK])).toBe(KIOSK);
  });

  it("nur einmal: nicht mehr, wenn die Variable gesetzt ist", () => {
    expect(hier({ variablen: { ...WACH, [blickvariable(KIOSK.knoten)]: true } })).toBeNull();
  });

  it("nicht bei Abwesenheit: vor dem Erwachen, im Tiefpunkt, nach dem Abschied", () => {
    expect(hier({ variablen: {} })).toBeNull();
    const tief = { ...WACH, tiefpunktGesehen: true };
    expect(hier({ variablen: tief })).toBeNull();
    // Er spricht bei der Familie wieder, ist aber bis zur Versöhnung nicht da.
    expect(hier({ variablen: { ...tief, ambroseSprichtWieder: true } })).toBeNull();
    expect(hier({ variablen: { ...tief, versoehnungGesehen: true } })).toBe(KIOSK);
    expect(hier({ variablen: { ...WACH, abschiedGesehen: true } })).toBeNull();
  });

  it("`wann` muss gelten, und der Knoten muss in der Ink-Datei stehen", () => {
    const mitWann = [{ ...KIOSK, wann: "kioskOffen" }];
    expect(hier({}, mitWann)).toBeNull();
    expect(hier({ variablen: { ...WACH, kioskOffen: true } }, mitWann)).toEqual(mitWann[0]);
    expect(hier({ knoten: new Set() })).toBeNull();
  });
});

describe("Blickpunkte: Ankunftsruhe und Pause", () => {
  const TAKTE_RUHE = Math.ceil(ANKUNFTSRUHE_MS / TAKT);
  const TAKTE_PAUSE = Math.ceil(BLICKPAUSE_MS / TAKT);

  it("nicht während der Ankunftsruhe, danach ja", () => {
    expect(blickBereit(BLICKUHR_START)).toBe(false);
    expect(blickBereit(laufe(BLICKUHR_START, TAKTE_RUHE - 1))).toBe(false);
    expect(blickBereit(laufe(BLICKUHR_START, TAKTE_RUHE))).toBe(true);
  });

  it("ein Aktionsknopf hält die Uhr nur an, die Ruhe beginnt nicht neu", () => {
    const halb = laufe(BLICKUHR_START, TAKTE_RUHE - 1);
    let u = halb;
    for (let i = 0; i < 4; i++) u = blicktakt(u, TAKT, true, true);
    expect(u).toEqual(halb);
    expect(blickBereit(laufe(u, 1))).toBe(true);
  });

  it("nicht während ein Fenster offen ist; danach beginnt die Ruhe neu", () => {
    const bereit = laufe(BLICKUHR_START, TAKTE_RUHE);
    const imDialog = laufe(bereit, 4, false);
    expect(blickBereit(imDialog)).toBe(false);
    expect(blickBereit(laufe(imDialog, TAKTE_RUHE - 1))).toBe(false);
    expect(blickBereit(laufe(imDialog, TAKTE_RUHE))).toBe(true);
  });

  it("nach einem Kartenwechsel beginnt die Ankunftsruhe neu", () => {
    const angekommen = nachAnkunft(laufe(BLICKUHR_START, TAKTE_RUHE));
    expect(blickBereit(angekommen)).toBe(false);
    expect(blickBereit(laufe(angekommen, TAKTE_RUHE))).toBe(true);
  });

  it("höchstens einer je 30 Sekunden freie Spielzeit, auch über Kartenwechsel hinweg", () => {
    const danach = nachBlickpunkt();
    expect(blickBereit(laufe(danach, TAKTE_PAUSE - 1))).toBe(false);
    expect(blickBereit(nachAnkunft(laufe(danach, TAKTE_PAUSE - 1)))).toBe(false);
    expect(blickBereit(laufe(danach, TAKTE_PAUSE))).toBe(true);
    // Zeit in Fenstern zählt nicht zur Pause.
    expect(laufe(danach, TAKTE_PAUSE, false).seitLetztemMs).toBe(0);
  });
});

describe("ambrose_blickpunkte.json und ambrose-blick.ink", () => {
  const punkte = liesBlickpunkte(JSON.parse(lies("ambrose_blickpunkte.json")));
  const ink = lies("dialoge/de/ambrose-blick.ink");
  const knoten = [...ink.matchAll(/^=== (\w+) ===$/gm)].map((m) => m[1] ?? "");

  it("es gibt Blickpunkte, und keiner ging beim Lesen verloren", () => {
    const roh = JSON.parse(lies("ambrose_blickpunkte.json")) as unknown;
    const liste = Array.isArray(roh) ? roh : (roh as { blickpunkte: unknown[] }).blickpunkte;
    const anzahl = liste.length;
    expect(punkte.length).toBeGreaterThan(0);
    expect(punkte.length).toBe(anzahl);
  });

  it("jeder Eintrag hat seinen Knoten und jeder Knoten seinen Eintrag", () => {
    expect(punkte.map((p) => p.knoten).sort()).toEqual([...knoten].sort());
  });

  it("die Ink-Datei verwaltet die Merker nicht selbst (das tut die Hülle)", () => {
    expect(ink.replace(/^\/\/.*$/gm, "")).not.toMatch(/_gesehen/);
  });
});
