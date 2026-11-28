/**
 * Tests der Auslosung des Rivalen (rivalzufall.ts, Wunsch des Autors, 28.11.2026): beide Fassungen
 * gleich wahrscheinlich, der Testschalter steuert fest.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { TESTSCHALTER_RIVALIN, zufallsrivalin } from "./rivalzufall";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Rivale ausgelost", () => {
  it("unter der Hälfte Victoria, sonst Victor", () => {
    expect(zufallsrivalin(() => 0)).toBe(true);
    expect(zufallsrivalin(() => 0.49)).toBe(true);
    expect(zufallsrivalin(() => 0.5)).toBe(false);
    expect(zufallsrivalin(() => 0.99)).toBe(false);
  });

  it("der Testschalter gilt vor dem Zufall", () => {
    vi.stubGlobal("window", { [TESTSCHALTER_RIVALIN]: true });
    expect(zufallsrivalin(() => 0.9)).toBe(true);
    vi.stubGlobal("window", { [TESTSCHALTER_RIVALIN]: false });
    expect(zufallsrivalin(() => 0.1)).toBe(false);
  });
});
