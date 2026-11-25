/**
 * Tests für belebungsbewegung.ts: Laufweg mit Pausen, Ausweichen, Folgen, stehende Tiere
 * (Dokument 16, Abschnitt 5.1).
 */
import { describe, expect, it } from "vitest";
import type { Belebung, Tierverhalten } from "./belebung";
import {
  fluchtziel,
  haeltAuf,
  HELDKOERPER,
  neueBewegung,
  schritt,
  sperreAn,
  steht,
  type Umgebung,
} from "./belebungsbewegung";

function eintrag(typ: "statist" | "tier", verhalten: Tierverhalten = "sitzen"): Belebung {
  return {
    name: "x",
    typ,
    feld: { x: 5, y: 5 },
    von: { x: 5, y: 5 },
    bis: { x: 8, y: 5 },
    wann: "immer",
    sagt: null,
    zeigt: null,
    bild: null,
    verhalten,
    sitzt: null,
  };
}

function umgebung(held: { x: number; y: number }, frei: Umgebung["frei"] = () => true): Umgebung {
  return { held, frei, zufall: () => 0 };
}

/** Viele kleine Schritte (Sekunden). */
function laufe(b: ReturnType<typeof neueBewegung>, v: Belebung, sekunden: number, u: Umgebung) {
  for (let t = 0; t < sekunden; t += 0.05) schritt(b, v, 0.05, u);
}

describe("Statisten", () => {
  it("laufen von von nach bis und machen dort Pause", () => {
    const v = eintrag("statist");
    const b = neueBewegung(v.feld);
    laufe(b, v, 2.2, umgebung({ x: 20, y: 20 }));
    expect(b.x).toBeCloseTo(8);
    expect(steht(b)).toBe(true);
    expect(b.pause).toBeGreaterThan(0);
  });

  it("bleiben stehen, solange der Held sie still ansieht, und gehen weiter, wenn er geht", () => {
    const v = eintrag("statist");
    const b = neueBewegung(v.feld);
    // Der Held steht links davor und blickt nach rechts auf den Statisten (Befund 20.11.2026).
    const ansehen: Umgebung = { ...umgebung({ x: 4, y: 5 }), heldBlick: "rechts", heldGeht: false };
    laufe(b, v, 30, ansehen);
    expect(b.x).toBeCloseTo(5);
    expect(steht(b)).toBe(true);
    // Er schaut den Helden an, nach links (22.11.2026); die Laufrichtung bleibt.
    expect(b.schaut).toBe("links");
    laufe(b, v, 2.2, { ...ansehen, heldGeht: true });
    expect(b.x).toBeCloseTo(8);
    expect(b.schaut).toBeNull();
  });

  it("hören höchstens eine Minute zu, dann geht der Laufweg weiter", () => {
    const v = eintrag("statist");
    const b = neueBewegung(v.feld);
    const ansehen: Umgebung = { ...umgebung({ x: 4, y: 5 }), heldBlick: "rechts", heldGeht: false };
    laufe(b, v, 65, ansehen);
    expect(b.x).toBeGreaterThan(5);
  });

  it("bleiben auch mitten im Gehen stehen, wenn der Held sie anspricht", () => {
    // Befund Statist im Bergladen (20.11.2026): Lief die Ladenhilfe beim Ansprechen schon, ging
    // sie weiter, und ihre Sprechblase schloss sich mitten im Satz (auf langsamen Geräten öfter).
    const v = eintrag("statist");
    const b = neueBewegung(v.feld);
    laufe(b, v, 0.3, umgebung({ x: 20, y: 20 }));
    expect(steht(b)).toBe(false);
    const x = b.x;
    const ansehen: Umgebung = {
      ...umgebung({ x: Math.round(x) - 1, y: 5 }),
      heldBlick: "rechts",
      heldGeht: false,
    };
    laufe(b, v, 30, ansehen);
    expect(b.x).toBeCloseTo(x);
    // Danach geht der Laufweg weiter, wenn der Held geht.
    laufe(b, v, 3, { ...ansehen, heldGeht: true });
    expect(b.x).toBeGreaterThan(x);
  });

  it("gehen weiter, wenn der Held woandershin blickt", () => {
    const v = eintrag("statist");
    const b = neueBewegung(v.feld);
    laufe(b, v, 2.2, { ...umgebung({ x: 4, y: 5 }), heldBlick: "links", heldGeht: false });
    expect(b.x).toBeCloseTo(8);
  });

  it("warten, wenn der Held im Weg steht", () => {
    const v = eintrag("statist");
    const b = neueBewegung(v.feld);
    b.richtung = "rechts";
    laufe(b, v, 1, umgebung({ x: 6, y: 5 }));
    expect(b.x).toBeCloseTo(5);
  });
});

describe("Hindernisse für den Helden", () => {
  it("Statist kehrt um, wenn der Held ihm länger im Weg steht", () => {
    const v = eintrag("statist");
    const b = neueBewegung(v.feld);
    // Der Held steht auf (7, 5) mitten im Laufweg nach (8, 5): Der Statist kommt bis kurz davor,
    // wartet anderthalb Sekunden und geht dann zurück zum Anfang, statt für immer zu warten.
    laufe(b, v, 1.2, umgebung({ x: 7, y: 5 }));
    expect(b.richtung).toBe("rechts");
    expect(b.x).toBeGreaterThan(5);
    laufe(b, v, 0.8, umgebung({ x: 7, y: 5 }));
    expect(b.richtung).toBe("links");
    expect(b.x).toBeCloseTo(5, 1);
  });

  // Folgende Tiere halten seit dem 25.11.2026 auch auf: Sie weichen nach einer Sekunde Drängen aus
  // oder lassen sich verscheuchen (tierweg.ts), sperren also nie ein.
  // Vögel seit dem 25.11.2026 abends auch (im Flug ist ihre Sperre aus, tierweg.ts, sperreAus).
  it("Statisten, Tiere am Boden, folgende und Vögel halten auf, schwimmende nicht", () => {
    expect(haeltAuf(eintrag("statist"))).toBe(true);
    expect(haeltAuf(eintrag("tier", "sitzen"))).toBe(true);
    expect(haeltAuf(eintrag("tier", "ausweichen"))).toBe(true);
    expect(haeltAuf(eintrag("tier", "fliegen"))).toBe(true);
    expect(haeltAuf(eintrag("tier", "schwimmen"))).toBe(false);
    expect(haeltAuf(eintrag("tier", "folgen"))).toBe(true);
  });

  it("die Sperre ist aus, solange der Held in ihr steckt", () => {
    expect(sperreAn({ x: 5, y: 5 }, 6, 5)).toBe(true);
    expect(sperreAn({ x: 5.4, y: 5.6 }, 6, 6)).toBe(false);
    expect(sperreAn({ x: 5, y: 5 }, 5, 5)).toBe(false);
  });

  it("die Sperre bleibt an, wenn der Held geradeaus an sie stößt", () => {
    // Der Körper des Helden ist 12 Pixel breit: Er stößt bei 14 Pixeln Abstand der Mitten an.
    const anstoss = 0.5 + HELDKOERPER / 2;
    expect(sperreAn({ x: 6 - anstoss, y: 5 }, 6, 5)).toBe(true);
    expect(sperreAn({ x: 6, y: 5 + anstoss }, 6, 5)).toBe(true);
    // Zwei Pixel vor dem Anstoßen ging sie früher aus; dann lief der Held durch den Statisten.
    expect(sperreAn({ x: 5.05, y: 5 }, 6, 5)).toBe(true);
    // Erst wer wirklich in der Fläche steckt (etwa nach dem Laden), schaltet sie aus.
    expect(sperreAn({ x: 5.3, y: 5 }, 6, 5)).toBe(false);
  });

  it("die Fläche einer Sitzenden reicht bis zu ihrem Sitzpunkt", () => {
    // Um neun Pixel nach oben gerückt: Die Fläche beginnt neun Pixel über der Fußkachel.
    const sitzend = { x: -0.5, y: -0.5 - 9 / 16, breite: 1, hoehe: 1 + 9 / 16 };
    // Der Held steht mittig auf der Kachel darüber: Er steckte in der Fläche, sie bleibt aus.
    expect(sperreAn({ x: 6, y: 4 }, 6, 5, sitzend)).toBe(false);
    // Zwei Kacheln darüber berührt er sie nicht.
    expect(sperreAn({ x: 6, y: 3 }, 6, 5, sitzend)).toBe(true);
  });
});

describe("Tiere", () => {
  it("sitzen bleiben stehen, auch wenn der Held kommt", () => {
    const v = eintrag("tier", "sitzen");
    const b = neueBewegung(v.feld);
    laufe(b, v, 3, umgebung({ x: 5, y: 6 }));
    expect([b.x, b.y]).toEqual([5, 5]);
  });

  it("ausweichen: läuft vom nahen Helden weg", () => {
    const v = { ...eintrag("tier", "ausweichen"), bis: { x: 5, y: 5 } };
    const b = neueBewegung(v.feld);
    laufe(b, v, 2, umgebung({ x: 3, y: 5 }));
    expect(b.x).toBeCloseTo(7);
  });

  it("ausweichen: läuft nicht in Wände, sondern quer", () => {
    const b = neueBewegung({ x: 5, y: 5 });
    const nurQuer = (x: number) => x === 5;
    expect(fluchtziel(b, 2, umgebung({ x: 3, y: 5 }, nurQuer))).toEqual({ x: 5, y: 7 });
    expect(
      fluchtziel(
        b,
        2,
        umgebung({ x: 3, y: 5 }, () => false),
      ),
    ).toBeNull();
  });

  it("flitzen: schneller und weiter als ausweichen", () => {
    const v = { ...eintrag("tier", "flitzen"), bis: { x: 5, y: 5 } };
    const b = neueBewegung(v.feld);
    laufe(b, v, 1, umgebung({ x: 3, y: 5 }));
    expect(b.x).toBeCloseTo(10);
  });

  it("folgen: läuft ein paar Kacheln nach und bleibt dann stehen", () => {
    const v = eintrag("tier", "folgen");
    const b = neueBewegung(v.feld);
    const held = { x: 8, y: 5 };
    laufe(b, v, 3, umgebung(held));
    expect(b.x).toBeGreaterThan(6);
    expect(b.x).toBeLessThan(8);
    // Der Held geht weiter weg (aber nicht ganz fort): nach sechs Kacheln ist Schluss.
    for (const x of [10, 12, 14, 16]) laufe(b, v, 3, umgebung({ x, y: 5 }));
    expect(b.gefolgt).toBeGreaterThanOrEqual(6);
    const jetzt = b.x;
    laufe(b, v, 3, umgebung({ x: jetzt + 2, y: 5 }));
    expect(b.x).toBeCloseTo(jetzt);
  });
});

describe("Blickrichtung im Stand (R008)", () => {
  it("beginnt in der Richtung von blick, sonst nach unten", () => {
    expect(neueBewegung({ x: 2, y: 3 }, "links").richtung).toBe("links");
    expect(neueBewegung({ x: 2, y: 3 }).richtung).toBe("unten");
  });
});
