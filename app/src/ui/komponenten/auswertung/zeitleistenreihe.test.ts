/**
 * Tests der waagerechten Zeitleiste (1.11.2026): welcher Moment vorn steht („3 von 12“) und wohin
 * „Zur Stellung“ scrollt, damit das Brett ganz zu sehen ist.
 */
import { describe, expect, it } from "vitest";
import { scrollzielZumBrett } from "./brettsprung";
import { vorneIndex } from "./useWischreihe";

describe("vorneIndex", () => {
  it("die erste Karte, deren Mitte rechts vom linken Rand liegt", () => {
    expect(vorneIndex([150, 460, 770], 0, false)).toBe(0);
    expect(vorneIndex([150, 460, 770], 320, false)).toBe(1);
    expect(vorneIndex([150, 460, 770], 151, false)).toBe(1);
  });

  it("am Ende der Reihe die letzte, ohne Karten 0", () => {
    expect(vorneIndex([150, 460, 770], 320, true)).toBe(2);
    expect(vorneIndex([], 0, false)).toBe(0);
    expect(vorneIndex([150], 400, false)).toBe(0);
  });
});

describe("scrollzielZumBrett", () => {
  /** Handy 360 × 640, Leiste unten 64, Brett 353 hoch, 330 ab Seitenanfang. */
  const handy = {
    brettOben: 330 - 1500,
    brettUnten: 683 - 1500,
    bereichUnten: 730 - 1500,
    scrollY: 1500,
    fensterHoehe: 640,
    untenVerdeckt: 64,
  };

  it("kleiner Bildschirm: die Zeile unter dem Brett an den unteren Rand, Brett ganz im Bild", () => {
    const ziel = scrollzielZumBrett(handy);
    expect(ziel).toBe(730 + 8 - 576);
    const oben = 330 - (ziel ?? 0);
    expect(oben).toBeGreaterThanOrEqual(0);
    expect(683 - (ziel ?? 0)).toBeLessThanOrEqual(576);
  });

  it("großer Bildschirm: ganz nach oben, wenn das Brett dort ganz zu sehen ist", () => {
    expect(scrollzielZumBrett({ ...handy, fensterHoehe: 851 })).toBe(0);
  });

  it("schon ganz zu sehen (etwa Brett links im Querformat): kein Scrollen", () => {
    expect(scrollzielZumBrett({ ...handy, brettOben: 20, brettUnten: 373, scrollY: 900 })).toBe(
      null,
    );
  });

  it("Brett höher als der sichtbare Bereich: Oberkante oben", () => {
    const hoch = { ...handy, brettUnten: 1100 - 1500, bereichUnten: 1150 - 1500 };
    expect(scrollzielZumBrett(hoch)).toBe(330 - 8);
  });
});
