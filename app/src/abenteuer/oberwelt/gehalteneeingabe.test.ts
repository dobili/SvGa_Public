/**
 * Tests der gehaltenen Eingaben (gehalteneeingabe.ts): Taste und Joystick überleben den
 * Kartenwechsel, die neue Heldsteuerung und Gangartsteuerung übernehmen sie. Ohne DOM: Fenster
 * und Dokument sind einfache EventTargets.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Modul = typeof import("./gehalteneeingabe");

/** Ein Tastenereignis mit `code`, wie der Browser es schickt. */
function taste(art: "keydown" | "keyup", code: string): Event {
  return Object.assign(new Event(art), { code });
}

let fenster: EventTarget;
let dokument: EventTarget & { visibilityState: string };
let m: Modul;

beforeEach(async () => {
  vi.resetModules();
  fenster = new EventTarget();
  dokument = Object.assign(new EventTarget(), { visibilityState: "visible" });
  vi.stubGlobal("window", fenster);
  vi.stubGlobal("document", dokument);
  m = await import("./gehalteneeingabe");
});

afterEach(() => {
  m.vergissEingaben();
  vi.unstubAllGlobals();
});

describe("Tastatur", () => {
  it("Pfeil und WASD zählen, bis sie losgelassen werden", () => {
    expect(m.richtungGehalten("rechts")).toBe(false);
    fenster.dispatchEvent(taste("keydown", "ArrowRight"));
    fenster.dispatchEvent(taste("keydown", "KeyW"));
    expect(m.richtungGehalten("rechts")).toBe(true);
    expect(m.richtungGehalten("oben")).toBe(true);
    fenster.dispatchEvent(taste("keyup", "ArrowRight"));
    expect(m.richtungGehalten("rechts")).toBe(false);
  });

  it("Fokus weg oder Seite unsichtbar: nichts klemmt", () => {
    m.richtungGehalten("links");
    fenster.dispatchEvent(taste("keydown", "ArrowLeft"));
    fenster.dispatchEvent(new Event("blur"));
    expect(m.richtungGehalten("links")).toBe(false);
    fenster.dispatchEvent(taste("keydown", "ShiftLeft"));
    expect(m.umschaltGehalten()).toBe(true);
    dokument.visibilityState = "hidden";
    dokument.dispatchEvent(new Event("visibilitychange"));
    expect(m.umschaltGehalten()).toBe(false);
  });
});

describe("Joystick", () => {
  it("Die Steuerung der neuen Karte übernimmt den gehaltenen Daumen", async () => {
    const { Heldsteuerung } = await import("./heldsteuerung");
    const { Gangartsteuerung } = await import("./gangart");
    m.merkeJoystickRennen(true);
    m.merkeJoystick({ richtung: "rechtsOben", blick: "rechts" });
    expect(new Heldsteuerung().wunsch("unten")).toEqual({
      richtung: "rechtsOben",
      blick: "rechts",
    });
    expect(new Gangartsteuerung(true).rennt()).toBe(true);
    // Innen wird nicht gerannt, auch mit gehaltenem großem Ausschlag.
    expect(new Gangartsteuerung(false).rennt()).toBe(false);
  });

  it("Loslassen vergisst Richtung und Rennen", async () => {
    const { Heldsteuerung } = await import("./heldsteuerung");
    const { Gangartsteuerung } = await import("./gangart");
    m.merkeJoystickRennen(true);
    m.merkeJoystick({ richtung: "links", blick: "links" });
    m.merkeJoystick(null);
    expect(new Heldsteuerung().wunsch("unten")).toBeNull();
    expect(new Gangartsteuerung(true).rennt()).toBe(false);
  });
});
