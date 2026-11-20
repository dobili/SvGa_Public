/**
 * Tests zu phaserNachlass.ts: Der Sichtbarkeitshörer, den Phaser beim Start an das Dokument hängt,
 * verschwindet beim Beenden wieder; Hörer vor READY und nach dem Takt bleiben; window.onblur und
 * onfocus werden nur zurückgesetzt, wenn sie noch dem Spiel gehören.
 */
import { describe, expect, it } from "vitest";
import { raeumePhaserNachlassAuf, type Fensterfokus } from "./phaserNachlass";

/** Ein Dokument, das nur zählt, welche Hörer hängen. */
function testdokument() {
  const hoerer = new Set<EventListenerOrEventListenerObject>();
  const dokument = {
    addEventListener(_art: string, fn: EventListenerOrEventListenerObject) {
      hoerer.add(fn);
    },
    removeEventListener(_art: string, fn: EventListenerOrEventListenerObject) {
      hoerer.delete(fn);
    },
  } as unknown as Pick<Document, "addEventListener" | "removeEventListener">;
  return { dokument, hoerer };
}

/** Ein Spiel mit Ereignissen wie Phaser (once, emit). */
function testspiel() {
  const fns = new Map<string, (() => void)[]>();
  return {
    events: {
      once(name: string, fn: () => void) {
        fns.set(name, [...(fns.get(name) ?? []), fn]);
      },
    },
    melde(name: string) {
      for (const fn of fns.get(name) ?? []) fn();
      fns.delete(name);
    },
  };
}

const takt = () => new Promise<void>((fertig) => queueMicrotask(fertig));

describe("raeumePhaserNachlassAuf", () => {
  it("nimmt den Sichtbarkeitshörer des Spiels beim Beenden ab, andere bleiben", async () => {
    const { dokument, hoerer } = testdokument();
    const fenster: Fensterfokus = { onblur: null, onfocus: null };
    const spiel = testspiel();
    const vorher = () => undefined;
    dokument.addEventListener("visibilitychange", vorher);
    raeumePhaserNachlassAuf(spiel, dokument, fenster);
    spiel.melde("ready");
    // Wie Game.start im selben Takt: Hörer und Fokusfelder des Spiels.
    const vomSpiel = () => undefined;
    dokument.addEventListener("visibilitychange", vomSpiel);
    const blur = () => undefined;
    fenster.onblur = blur;
    await takt();
    const spaeter = () => undefined;
    dokument.addEventListener("visibilitychange", spaeter);
    expect(hoerer.size).toBe(3);
    spiel.melde("destroy");
    expect([...hoerer]).toEqual([vorher, spaeter]);
    expect(fenster.onblur).toBeNull();
  });

  it("lässt window.onblur stehen, wenn ein neueres Spiel es schon gesetzt hat", async () => {
    const { dokument } = testdokument();
    const fenster: Fensterfokus = { onblur: null, onfocus: null };
    const spiel = testspiel();
    raeumePhaserNachlassAuf(spiel, dokument, fenster);
    spiel.melde("ready");
    fenster.onblur = () => "alt";
    await takt();
    const neu = () => "neu";
    fenster.onblur = neu;
    spiel.melde("destroy");
    expect(fenster.onblur).toBe(neu);
  });
});
