/** Tests des kleinen Markdown-Lesers des Wikis (Paket D). */
import { describe, expect, it } from "vitest";
import { bloecke, inline } from "./markdown";

describe("Markdown des Wikis", () => {
  it("Überschrift, Absatz, Liste mit eingerückter Folgezeile", () => {
    const text = "# Titel\n\nErste Zeile\nzweite Zeile\n\n- [ ] N1. Punkt\n      weiter\n- b";
    expect(bloecke(text)).toEqual([
      { art: "ueberschrift", ebene: 1, text: "Titel" },
      { art: "absatz", text: "Erste Zeile zweite Zeile" },
      { art: "liste", punkte: ["[ ] N1. Punkt weiter", "b"] },
    ]);
  });

  it("Codeblock und Tabelle ohne Trennzeile", () => {
    expect(bloecke("```bash\nnpm ci\n```")).toEqual([{ art: "code", text: "npm ci" }]);
    expect(bloecke("| a | b |\n| --- | --- |\n| 1 | 2 |")).toEqual([
      {
        art: "tabelle",
        zeilen: [
          ["a", "b"],
          ["1", "2"],
        ],
      },
    ]);
  });

  it("Hervorhebungen; Links nur mit http(s)", () => {
    expect(inline("Siehe **Regel 1** in `CLAUDE.md`")).toEqual([
      { art: "text", text: "Siehe " },
      { art: "fett", text: "Regel 1" },
      { art: "text", text: " in " },
      { art: "code", text: "CLAUDE.md" },
    ]);
    expect(inline("[Lichess](https://lichess.org)")).toEqual([
      { art: "link", text: "Lichess", ziel: "https://lichess.org" },
    ]);
    expect(inline("[x](javascript:alert(1))")[0]).toMatchObject({ art: "text" });
  });
});
