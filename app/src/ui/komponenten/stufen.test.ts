/** Tests für die gestuften Werkzeugkarten (Vorschlag D6, seit 0.2.30). */
import { describe, expect, it } from "vitest";
import type { Befund, Werkzeugergebnis } from "../../analyse/werkzeug";
import { stufenansicht } from "./stufen";

function befund(kennung: string): Befund {
  return { kennung, art: "E", titel: kennung, zeilen: [kennung], farbe: null };
}

function ergebnis(kennungen: string[], stufen: [string[], string[], string[]]): Werkzeugergebnis {
  return {
    werkzeug: "k4-prueffragen",
    art: "E",
    ueberschrift: "Test",
    befunde: kennungen.map(befund),
    fazit: "Fazit",
    markierungen: [],
    stufen,
    regel: "Regel",
  };
}

const kennungenVon = (ansicht: ReturnType<typeof stufenansicht>) =>
  ansicht.befunde.map((b) => b.kennung);

describe("Gestufte Karten", () => {
  const pruef = ergebnis(["f1", "f2", "f3", "f3-nach"], [["f1"], ["f1", "f2"], ["f1"]]);

  it("Stufe 1 zuerst, „Mehr …“ öffnet Stufe 2, dann alles", () => {
    expect(kennungenVon(stufenansicht(pruef, 0))).toEqual(["f1"]);
    expect(stufenansicht(pruef, 0).naechste).toBe(1);
    expect(kennungenVon(stufenansicht(pruef, 1))).toEqual(["f1", "f2"]);
    expect(stufenansicht(pruef, 1).naechste).toBe(2);
    // Stufe 3 zeigt alle Befunde, auch wenn die Stufenliste sie nicht nennt.
    expect(kennungenVon(stufenansicht(pruef, 2))).toEqual(["f1", "f2", "f3", "f3-nach"]);
    expect(stufenansicht(pruef, 2).naechste).toBeNull();
  });

  it("überspringt leere Stufen und Stufen ohne Neues", () => {
    const leer = ergebnis(["a", "b"], [[], ["a", "b"], ["a", "b"]]);
    expect(kennungenVon(stufenansicht(leer, 0))).toEqual(["a", "b"]);
    expect(stufenansicht(leer, 0).naechste).toBeNull();
    const gleich = ergebnis(["a", "b"], [["a"], ["a"], ["a"]]);
    expect(stufenansicht(gleich, 0).naechste).toBe(2);
  });

  it("ohne Befunde: nichts zu zeigen, kein „Mehr …“", () => {
    const nichts = ergebnis([], [[], [], []]);
    expect(stufenansicht(nichts, 0)).toEqual({ befunde: [], naechste: null });
  });
});
