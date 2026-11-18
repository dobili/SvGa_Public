/** Tests für den Merker „Seite wird verlassen“ (seitenende.ts), in Node mit einem Ersatzfenster. */
import { afterAll, describe, expect, it } from "vitest";

const fenster = new EventTarget();
(globalThis as unknown as { window: EventTarget }).window = fenster;
const { seiteWirdVerlassen } = await import("./seitenende");

afterAll(() => {
  delete (globalThis as unknown as { window?: EventTarget }).window;
});

describe("seitenende", () => {
  it("meldet das Verlassen ab pagehide und vergisst es nach pageshow aus dem Zwischenspeicher", () => {
    expect(seiteWirdVerlassen()).toBe(false);
    fenster.dispatchEvent(new Event("pagehide"));
    expect(seiteWirdVerlassen()).toBe(true);
    const zurueck = Object.assign(new Event("pageshow"), { persisted: true });
    fenster.dispatchEvent(zurueck);
    expect(seiteWirdVerlassen()).toBe(false);
    fenster.dispatchEvent(new Event("beforeunload"));
    expect(seiteWirdVerlassen()).toBe(true);
  });
});
