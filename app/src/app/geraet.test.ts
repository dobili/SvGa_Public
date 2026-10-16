/** Tests für die Erkennung des Gerätetyps (Installationsanleitung, Konzept 11.1). */
import { describe, expect, it } from "vitest";
import { geraet } from "./geraet";

describe("geraet", () => {
  it.each([
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1",
      5,
      "iphone",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
      5,
      "iphone",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
      0,
      "mac-safari",
    ],
    [
      "Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36",
      5,
      "android",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36 Edg/140.0",
      0,
      "chromium",
    ],
    ["Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0", 0, "anderer"],
  ])("%s", (kennung, punkte, erwartet) => {
    expect(geraet(kennung, punkte)).toBe(erwartet);
  });
});
