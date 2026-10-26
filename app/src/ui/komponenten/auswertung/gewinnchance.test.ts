/** Test der Gewinnchance vor und nach einem Zug, am Beispiel 10. Tab1?? (Partie gegen Mia). */
import { describe, expect, it } from "vitest";
import { gewinnchanceVorNach } from "./gewinnchance";

describe("Gewinnchance vor und nach dem Zug", () => {
  it("Weiß zieht: +0,1 → −5,8 fällt von etwa 51 % auf etwa 10 %", () => {
    const c = gewinnchanceVorNach([0.1, -5.8], 0, true);
    expect(c.seite).toBe("Weiß");
    expect(c.vorher).toBe(51);
    expect(c.nachher).toBeLessThan(15);
  });

  it("Schwarz zieht: Werte aus Sicht von Weiß werden umgedreht", () => {
    const c = gewinnchanceVorNach([-0.1, 5.8], 0, false);
    expect(c.seite).toBe("Schwarz");
    expect(c.vorher).toBe(51);
    expect(c.nachher).toBeLessThan(15);
  });
});
