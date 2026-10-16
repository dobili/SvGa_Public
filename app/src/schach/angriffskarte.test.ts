/**
 * Tests der Angriffskarte an den Abbildungen aus Kapitel 1, 4 und 7.
 * Regel: Kapitel 7, „Figuren hinter Figuren zählen mit“; Pflichtenheft 6.6, W1.
 */
import { describe, expect, it } from "vitest";
import { feldname } from "./stellung";
import { Angriffskarte } from "./angriffskarte";
import { abbildung, feld, stellungVon } from "./buchabbildungen.testhilfe";

function karte(nummer: string): Angriffskarte {
  return new Angriffskarte(stellungVon(nummer).brett);
}

/** Die Pfeile einer Farbe aus der Abbildung, die auf ein Feld zeigen, als sortierte Startfelder. */
function pfeileAuf(nummer: string, farbe: string, nach: string): string[] {
  return abbildung(nummer)
    .pfeile.filter((p) => p.farbe === farbe && p.nach === nach)
    .map((p) => p.von)
    .sort();
}

function felder(liste: readonly { feld: number }[]): string[] {
  return liste.map((f) => feldname(f.feld)).sort();
}

describe("Angriffskarte", () => {
  it("Abb. 7.30: drei Angreifer (rot) und drei Verteidiger (grau) auf d5", () => {
    const k = karte("7.30");
    expect(felder(k.angreiferVon(feld("d5"), "white"))).toEqual(pfeileAuf("7.30", "rot", "d5"));
    expect(felder(k.angreiferVon(feld("d5"), "black"))).toEqual(pfeileAuf("7.30", "grau", "d5"));
  });

  it("Abb. 7.33: der Turm d1 hinter dem Turm d2 ist der dritte Angreifer (gold)", () => {
    const k = karte("7.33");
    expect(felder(k.angreiferVon(feld("d5"), "white", false))).toEqual(
      pfeileAuf("7.33", "rot", "d5"),
    );
    const mitBatterie = k.angreiferVon(feld("d5"), "white");
    expect(felder(mitBatterie)).toEqual(["c3", "d1", "d2"]);
    expect(mitBatterie.find((f) => feldname(f.feld) === "d1")?.hinter).toBe(feld("d2"));
  });

  it("liefert dieselbe Liste bei wiederholter Anfrage (gemerkt)", () => {
    const k = karte("7.33");
    expect(k.angreiferVon(feld("d5"), "white")).toBe(k.angreiferVon(feld("d5"), "white"));
  });

  it("Abb. 7.7: der Turm a1 hinter dem König ist ungedeckt (W1)", () => {
    expect(felder(karte("7.7").ungedeckte("white"))).toEqual(["a1"]);
  });

  it("W1 zählt Bauern nur, wenn sie angegriffen sind", () => {
    // Abb. 7.6: Der Bauer fehlt, aber in Abb. 1.26 ist a2 ungedeckt und nicht angegriffen.
    const k = karte("1.26");
    expect(felder(k.ungedeckte("white"))).not.toContain("a2");
  });

  it("Abb. 1.34: der Springer b4 greift a2, c2 und die Dame d3 an, nichts hängt", () => {
    const k = karte("1.34");
    expect(felder(k.angegriffene("white"))).toEqual(["a2", "c2", "d3", "g5"]);
    expect(k.haengende("white")).toEqual([]);
  });

  it("Abb. 7.7 nach 2. Kd2: der Turm a1 hängt", () => {
    const k = new Angriffskarte(stellungVon("7.7").brett.clone());
    k.brett.take(feld("e1"));
    k.brett.set(feld("d2"), { role: "king", color: "white" });
    expect(felder(k.haengende("white"))).toEqual(["a1"]);
  });
});
