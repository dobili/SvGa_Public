/**
 * Tests zu app/ton.ts, Entsperren und Pflege des Tonerzeugers:
 * - Safari meldet nach einem Anruf oder App-Wechsel „interrupted“ statt „suspended“; auch dann weckt
 *   die nächste Berührung den Ton. Läuft er schon oder ist er geschlossen, geschieht nichts
 *   (iOS-Durchsicht, 20.11.2026).
 * - WebKit stoppt den Erzeuger beim Neuladen; danach wirft jeder neue Knoten „InvalidStateError:
 *   Context is stopped“ (WebKit-Lauf 44657454880). Der Erzeuger wird dann verworfen und neu
 *   angelegt, andere Fehler gehen weiter, nach pagehide entsteht kein Ton mehr.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

type Hoerer = (ereignis: { persisted: boolean }) => void;

/** Ein Tonerzeuger wie im Browser, mit gewähltem Zustand, gezähltem resume() und Seitenereignissen. */
function stelleTonerzeugerBereit(
  zustand: string,
  resumeErgebnis: () => Promise<void> = () => Promise.resolve(),
) {
  const resume = vi.fn(resumeErgebnis);
  const angelegt = vi.fn();
  class TestErzeuger {
    state = zustand;
    resume = resume;
    constructor() {
      angelegt();
    }
  }
  const hoerer = new Map<string, Hoerer>();
  vi.stubGlobal("window", {
    AudioContext: TestErzeuger,
    addEventListener: (art: string, h: Hoerer) => hoerer.set(art, h),
  });
  return { resume, angelegt, hoerer };
}

const gestoppt = () => new DOMException("Context is stopped", "InvalidStateError");

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("entsperreTon", () => {
  it.each([
    ["suspended", 1],
    ["interrupted", 1],
    ["running", 0],
    ["closed", 0],
  ])("Zustand %s → resume %i-mal", async (zustand, aufrufe) => {
    const { resume } = stelleTonerzeugerBereit(zustand);
    const { entsperreTon } = await import("./ton");
    entsperreTon();
    expect(resume).toHaveBeenCalledTimes(aufrufe);
  });

  it("verwirft einen Erzeuger, dessen resume „Context is stopped“ meldet; der nächste ist neu", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { angelegt } = stelleTonerzeugerBereit("suspended", () => Promise.reject(gestoppt()));
    const { entsperreTon } = await import("./ton");
    entsperreTon();
    await Promise.resolve();
    await Promise.resolve();
    entsperreTon();
    expect(angelegt).toHaveBeenCalledTimes(2);
  });
});

describe("istGestoppterTon", () => {
  it("erkennt gestoppte und geschlossene Erzeuger, nicht andere Fehler", async () => {
    stelleTonerzeugerBereit("running");
    const { istGestoppterTon } = await import("./ton");
    expect(istGestoppterTon(gestoppt())).toBe(true);
    expect(
      istGestoppterTon(new DOMException("AudioContext has been closed", "InvalidStateError")),
    ).toBe(true);
    expect(
      istGestoppterTon(new DOMException("cannot call start more than once", "InvalidStateError")),
    ).toBe(false);
    expect(istGestoppterTon(new TypeError("Context is stopped"))).toBe(false);
    expect(istGestoppterTon("Context is stopped")).toBe(false);
  });
});

describe("mitTon", () => {
  it("fängt einen gestoppten Erzeuger ab und legt beim nächsten Ton einen neuen an", async () => {
    const warnung = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { angelegt } = stelleTonerzeugerBereit("running");
    const { mitTon } = await import("./ton");
    expect(
      mitTon(() => {
        throw gestoppt();
      }),
    ).toBeUndefined();
    expect(warnung).toHaveBeenCalledOnce();
    expect(mitTon(() => "klingt")).toBe("klingt");
    expect(angelegt).toHaveBeenCalledTimes(2);
  });

  it("gibt andere Fehler weiter (nichts verschluckt)", async () => {
    stelleTonerzeugerBereit("running");
    const { mitTon } = await import("./ton");
    expect(() =>
      mitTon(() => {
        throw new TypeError("kaputt");
      }),
    ).toThrow("kaputt");
  });

  it("macht nach pagehide keinen Ton mehr, nach pageshow aus dem Zwischenspeicher wieder", async () => {
    const { hoerer } = stelleTonerzeugerBereit("running");
    const { mitTon } = await import("./ton");
    const arbeit = vi.fn(() => "klingt");
    hoerer.get("pagehide")?.({ persisted: false });
    expect(mitTon(arbeit)).toBeUndefined();
    expect(arbeit).not.toHaveBeenCalled();
    hoerer.get("pageshow")?.({ persisted: true });
    expect(mitTon(arbeit)).toBe("klingt");
  });
});
