/** Tests für variantenbrett.ts: Hügel, Explosion im Atomschach, Schachzähler im Drei-Schach. */
import { describe, expect, it } from "vitest";
import { explodierteFelder, variantenmarken, variantenzaehler } from "./variantenbrett";
import { varianteVon } from "../../spiel/varianten/alle";

describe("Brett der Variante", () => {
  it("Atomschach: Der Schlag auf f7 sprengt f7 und die Nachbarn, nicht das Startfeld", () => {
    const v = varianteVon("atomschach");
    const vorher = "rnb1kbnr/pppp1ppp/4p3/4N3/7q/8/PPPPPPPP/RNBQKB1R w KQkq - 2 3";
    const nachher = v?.regeln.ziehe(vorher, "e5f7")?.fen ?? "";
    const felder = explodierteFelder(vorher, nachher, "e5");
    expect(felder).toEqual(expect.arrayContaining(["f7", "e8", "f8", "g8"]));
    expect(felder).not.toContain("e5");
    // Bauern neben dem Schlag bleiben stehen (Regel des Atomschachs).
    expect(felder).not.toContain("g7");
    const marken = variantenmarken("atomschach", nachher, vorher, "e5");
    expect(marken.every((m) => m.typ === "feld" && m.farbe === "rot")).toBe(true);
  });

  it("König der Hügel: vier goldene Felder; ohne Variante nichts", () => {
    expect(
      variantenmarken("koenigDerHuegel", "8/8/8/8/8/3K4/8/k7 w - - 0 1", null, null),
    ).toHaveLength(4);
    expect(variantenmarken(undefined, "8/8/8/8/8/3K4/8/k7 w - - 0 1", null, null)).toEqual([]);
  });

  it("Drei-Schach: Zähler aus der FEN", () => {
    expect(variantenzaehler("dreischach", "8/8/8/8/8/3K4/8/k7 w - - 1+3 0 1")).toEqual({
      text: "variante.dreischach.zaehler",
      werte: { weiss: 2, schwarz: 0 },
    });
    expect(variantenzaehler("atomschach", "8/8/8/8/8/3K4/8/k7 w - - 0 1")).toBeNull();
  });
});
