/** Tests zu app/seitenabschied.ts: nur nach pagehide und nur „Context is stopped“ gilt als erwartet. */
import { describe, expect, it, vi } from "vitest";
import { beachteSeitenabschied, istAbschiedsablehnung } from "./seitenabschied";

const gestoppt = () => new DOMException("Context is stopped", "InvalidStateError");

describe("istAbschiedsablehnung", () => {
  it("erkennt die Ablehnung beim Entladen", () => {
    expect(istAbschiedsablehnung(gestoppt(), true)).toBe(true);
    expect(istAbschiedsablehnung("Context is stopped", true)).toBe(true);
  });

  it("lässt sie vor dem Abschied und andere Gründe immer gelten", () => {
    expect(istAbschiedsablehnung(gestoppt(), false)).toBe(false);
    expect(istAbschiedsablehnung(new TypeError("kaputt"), true)).toBe(false);
    expect(istAbschiedsablehnung(undefined, true)).toBe(false);
  });
});

describe("beachteSeitenabschied", () => {
  /** Ein Fenster, das Hörer sammelt und Ereignisse auslöst. */
  function fenster() {
    const hoerer = new Map<string, (e: Event) => void>();
    return {
      addEventListener: (art: string, h: (e: Event) => void) => hoerer.set(art, h),
      sende: (art: string, e: object) => hoerer.get(art)?.(e as Event),
    };
  }
  /** Ein Ereignis „unhandledrejection“ mit Grund und gezähltem preventDefault. */
  function ablehnung(reason: unknown) {
    return { reason, preventDefault: vi.fn() };
  }

  it("vermerkt „Context is stopped“ nach pagehide, statt es als Fehler zu melden", () => {
    const warnung = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const f = fenster();
    beachteSeitenabschied(f);
    f.sende("pagehide", {});
    const e = ablehnung(gestoppt());
    f.sende("unhandledrejection", e);
    expect(e.preventDefault).toHaveBeenCalledOnce();
    expect(warnung).toHaveBeenCalledOnce();
    warnung.mockRestore();
  });

  it("lässt andere Ablehnungen und die Zeit vor pagehide unberührt", () => {
    const f = fenster();
    beachteSeitenabschied(f);
    const vorher = ablehnung(gestoppt());
    f.sende("unhandledrejection", vorher);
    f.sende("pagehide", {});
    const andere = ablehnung(new TypeError("kaputt"));
    f.sende("unhandledrejection", andere);
    expect(vorher.preventDefault).not.toHaveBeenCalled();
    expect(andere.preventDefault).not.toHaveBeenCalled();
  });

  it("gilt nach pageshow aus dem Zwischenspeicher wieder alles", () => {
    const f = fenster();
    beachteSeitenabschied(f);
    f.sende("pagehide", {});
    f.sende("pageshow", { persisted: true });
    const e = ablehnung(gestoppt());
    f.sende("unhandledrejection", e);
    expect(e.preventDefault).not.toHaveBeenCalled();
  });
});
