/**
 * Referenztests für k5-figuren an Kapitel 5, Leitfrage 4 (Abb. 5.35 bis 5.43) und Kapitel 6.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { figuren } from "./k5-figuren";

function ergebnis(nummer: string, farbe: "white" | "black" = "white") {
  return figuren(stellungVon(nummer), farbe);
}
function zeilen(nummer: string, farbe: "white" | "black"): readonly string[] {
  return ergebnis(nummer, farbe).befunde.find((b) => b.kennung === farbe)?.zeilen ?? [];
}

describe("k5-figuren", () => {
  it("Stellungstypen wie im Buch: 5.35 geschlossen, 5.36 halboffen, 5.37 offen, 5.38 beweglich", () => {
    expect(ergebnis("5.35").befunde[0]?.titel).toBe("Stellungstyp: geschlossen");
    expect(ergebnis("5.36").befunde[0]?.titel).toBe("Stellungstyp: halboffen");
    expect(ergebnis("5.37").befunde[0]?.titel).toBe("Stellungstyp: offen");
    expect(ergebnis("5.38").befunde[0]?.titel).toBe("Stellungstyp: beweglich");
    expect(ergebnis("5.38").befunde[0]?.zeilen).toContain("Bauernduo von Weiß: d4 und e4");
  });

  it("Abb. 6.3 (Isolani): offenes Zentrum wie in Kapitel 6", () => {
    expect(ergebnis("6.3").befunde[0]?.titel).toBe("Stellungstyp: offen");
  });

  it("Abb. 5.43 (London): Läufer d3 gut, Läufer d7 schlecht (rot)", () => {
    expect(zeilen("5.43", "white")[0]).toMatch(/^Läufer d3: gut/);
    expect(zeilen("5.43", "black")[0]).toMatch(
      /^Läufer d7: schlecht \(festgelegte Bauern auf seinen hellen Feldern: d5/,
    );
    expect(ergebnis("5.43", "black").markierungen).toContainEqual({
      typ: "feld",
      farbe: "rot",
      feld: "d7",
    });
  });

  it("Abb. 5.24 (Vorstoßvariante): Läufer c8 schlecht und passiv, Läufer c1 schlecht, aber nicht passiv", () => {
    expect(zeilen("5.24", "black")[0]).toBe(
      "Läufer c8: schlecht (festgelegte Bauern auf seinen hellen Feldern: d5 und e6; auf der anderen Farbe: 0), passiv hinter der eigenen Kette",
    );
    expect(zeilen("5.24", "white")[0]).toBe(
      "Läufer c1: schlecht (festgelegte Bauern auf seinen dunklen Feldern: d4 und e5; auf der anderen Farbe: 0)",
    );
  });

  it("Abb. 5.26: Türme auf die offene c-Linie, Tauschfrage nach Schwäche und Raum", () => {
    const weiss = zeilen("5.26", "white");
    expect(weiss).toContain("Türme gehören auf: c-Linie (offen)");
    expect(weiss).toContain(
      "Tauschfrage: Du hast Schwächen (d4) – behalte Figuren und suche Aktivität.",
    );
    expect(weiss).toContain("Mehr Raum: Meide den Abtausch.");
    expect(zeilen("5.26", "black")).toContain(
      "Weniger Raum: Tausche Figuren und befreie dich mit einem Hebel.",
    );
  });

  // C1.11: „Unterscheide dabei ‚schlecht‘ und ‚passiv‘ … Entscheidend ist also nicht nur die Farbe“.
  it("Abb. 5.40 (London): Läufer f4 schlecht nach der Farbe, aber aktiv vor der Kette (nicht rot)", () => {
    expect(zeilen("5.40", "white")).toContain(
      "Läufer f4: schlecht nach der Farbe, aber aktiv: steht vor der eigenen Kette (festgelegte Bauern auf seinen dunklen Feldern: d4; auf der anderen Farbe: 0)",
    );
    const weiss = ergebnis("5.40", "white").markierungen;
    expect(weiss).not.toContainEqual({ typ: "feld", farbe: "rot", feld: "f4" });
    expect(weiss).toContainEqual({ typ: "feld", farbe: "gold", feld: "f4" });
    // „Rot: Der Läufer c8 steht hinter den eigenen Bauern d5 und e6.“
    expect(zeilen("5.40", "black")[0]).toMatch(
      /^Läufer c8: schlecht .*passiv hinter der eigenen Kette$/,
    );
    expect(ergebnis("5.40", "black").markierungen).toContainEqual({
      typ: "feld",
      farbe: "rot",
      feld: "c8",
    });
  });

  it("Abb. 5.8 (Najdorf): Springer gehören nach d5", () => {
    expect(zeilen("5.8", "white").find((z) => z.startsWith("Springer gehören nach"))).toContain(
      "d5",
    );
  });
});
