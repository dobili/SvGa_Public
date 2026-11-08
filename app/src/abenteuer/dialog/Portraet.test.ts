// Porträts im Dialog (Q17-2): Dateinamen und für jeden Sprecher der Dialoge ein Bild.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { portraetpfad } from "./portraetpfad";

const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);

describe("Porträts", () => {
  it("bildet den Sprecher auf die Datei ab", () => {
    expect(portraetpfad("coachDelgado", null)).toBe("portraets/coach-delgado.svg");
    expect(portraetpfad("ambrose", "jung")).toBe("portraets/ambrose-jung.svg");
    expect(portraetpfad("ambrose", "froh")).toBe("portraets/ambrose.svg");
  });

  it("jeder Sprecher in den Dialogen hat ein Porträt", () => {
    const ordner = new URL("dialoge/de/", INHALTE);
    const sprecher = new Set<string>();
    for (const datei of readdirSync(ordner).filter((d) => d.endsWith(".ink"))) {
      const text = readFileSync(new URL(datei, ordner), "utf8");
      for (const m of text.matchAll(/#sprecher:([A-Za-z]+)/g)) if (m[1]) sprecher.add(m[1]);
    }
    const fehlen = [...sprecher]
      .filter((s) => s !== "erzaehler" && s !== "held")
      .filter((s) => !existsSync(new URL(portraetpfad(s, null), INHALTE)));
    expect(fehlen).toEqual([]);
  });
});
