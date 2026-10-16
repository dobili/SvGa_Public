/**
 * Referenztests für k9-erkennungsbilder: jede Zeile der Rückblick-Tabelle an einer Abbildung
 * des Kapitels und Kalibrierung an den Übungen 9.45 bis 9.53.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { erkennungsbilder } from "./k9-erkennungsbilder";

function bild(nummer: string) {
  const s = stellungVon(nummer);
  const e = erkennungsbilder(s, s.amZug);
  return {
    art: e.art,
    titel: e.befunde[0]?.titel ?? "",
    zeilen: e.befunde[0]?.zeilen ?? [],
    plan: e.befunde[1]?.zeilen[0] ?? "",
    fazit: e.fazit,
  };
}

describe("k9-erkennungsbilder", () => {
  it("Abb. 9.3 Philidor (E): Turm auf der 6. Reihe; Abb. 9.4 Schachs von hinten", () => {
    const b = bild("9.3");
    expect(b.art).toBe("E");
    expect(b.titel).toBe("Philidor-Stellung (Plan für Schwarz)");
    expect(b.zeilen[1]).toBe(
      "Der Turm sperrt die 6. Reihe seitlich, weit weg vom gegnerischen König ✓",
    );
    expect(b.plan).toBe(
      "Der Turm sperrt die Reihe direkt vor dem Bauern, damit der König des Angreifers nicht nach vorn kommt. Betritt der Bauer diese Reihe, wechselt der Turm nach hinten und gibt Schach um Schach.",
    );
    expect(bild("9.4").zeilen[1]).toBe(
      "Der Bauer steht auf der 6. Reihe: Der Turm wechselt nach hinten und gibt Schachs ✓",
    );
  });

  it("Abb. 9.5 kurze Seite (E), Abb. 9.6 mit dem Turm auf b8 nur das Bild (N)", () => {
    expect(bild("9.5").art).toBe("E");
    expect(bild("9.5").zeilen).toEqual([
      "Der König des Verteidigers ist vom Umwandlungsfeld abgedrängt.",
      "König auf der kurzen Seite ✓",
      "Turm auf der langen Seite mit Schachdistanz 3 Linien (nötig: 3 Linien) ✓",
    ]);
    expect(bild("9.6").art).toBe("N");
    expect(bild("9.6").zeilen[2]).toBe(
      "Turm auf der langen Seite mit Schachdistanz 2 Linien (nötig: 3 Linien) – noch nicht",
    );
  });

  it("Abb. 9.8 Lucena (E) mit dem Brückenbau als Plan", () => {
    const b = bild("9.8");
    expect(b.art).toBe("E");
    expect(b.titel).toBe("Lucena-Stellung (Plan für Weiß)");
    expect(b.zeilen[1]).toBe(
      "Der gegnerische König steht 2 Linien neben dem Bauern, vom Turm abgeschnitten ✓",
    );
    expect(b.plan).toMatch(/Brückenbau/);
  });

  it("Abb. 9.15 Vancura (E), Abb. 9.16 mit dem König f7 nur das Bild (N)", () => {
    expect(bild("9.15").art).toBe("E");
    expect(bild("9.15").zeilen.slice(1)).toEqual([
      "Der verteidigende Turm greift den Bauern von der Seite an ✓",
      "Der verteidigende König wartet auf g7/h7 ✓",
    ]);
    expect(bild("9.16").art).toBe("N");
    expect(bild("9.16").zeilen[2]).toBe("Der verteidigende König wartet auf g7/h7 – noch nicht");
  });

  it("Abb. 9.18 und 9.22: Turm gegen Bauer, abgeschnitten, zwei verbundene Bauern", () => {
    expect(bild("9.18").zeilen[1]).toBe(
      "Der König der Bauernseite ist abgeschnitten (2 Linien dazwischen)",
    );
    expect(bild("9.22").zeilen[1]).toBe(
      "Zwei verbundene Bauern auf der 6. Reihe: Sie schlagen den Turm (Abb. 9.22)",
    );
  });

  it("Abb. 9.25: Der Turm a1 steht hinter dem eigenen Freibauern a5", () => {
    expect(bild("9.25").zeilen[1]).toBe(
      "Der Turm a1 steht hinter dem eigenen Freibauern a5 (gold)",
    );
  });

  it("Abb. 9.28, 9.31, 9.32: Dame gegen Bauer, Pattalarm beim Läuferbauern", () => {
    expect(bild("9.28").zeilen[1]).toBe(
      "Bauer d2 auf der b-, d-, e- oder g-Linie: Die Dame gewinnt",
    );
    expect(bild("9.31").zeilen.slice(1)).toEqual([
      "Läuferbauer c2: Pattalarm, oft remis (Abb. 9.31)",
      "Vorsicht: Der Schlag auf c2 setzt patt",
    ]);
    expect(bild("9.32").zeilen[2]).toBe("Vorsicht: Der Schlag auf f2 setzt patt");
  });

  it("Abb. 9.34 Dame gegen Dame, 9.35 ungleich, 9.38 gleich, 9.41 falscher Läufer, 9.42 Läufer gegen Springer", () => {
    expect(bild("9.34").titel).toBe("Dame gegen Dame (Plan für Schwarz)");
    expect(bild("9.35").zeilen[1]).toBe("Ungleichfarbige Läufer: Festungsremis möglich");
    expect(bild("9.38").zeilen[1]).toBe("Gleichfarbige Läufer: Der Freibauer entscheidet");
    expect(bild("9.41").zeilen[1]).toMatch(
      /^Falscher Läufer: Der Läufer erreicht das Umwandlungsfeld h8 nicht, der König steht in der Ecke/,
    );
    expect(bild("9.42").zeilen[1]).toBe("Bauern auf beiden Flügeln: Vorteil Läufer");
  });

  it("Abb. 9.37 (C1.26): getrennte Freibauern b5 und g5, meist gewonnen; 9.36 verbunden: Festung", () => {
    expect(bild("9.37").zeilen.slice(1)).toEqual([
      "Ungleichfarbige Läufer, getrennte Freibauern b5 und g5: meist gewonnen, denn König und Läufer können nicht an beiden Flügeln zugleich blockieren",
      "Regel des Buches: Zähle die Freibauern, die sich nicht blockieren lassen",
    ]);
    const s = stellungVon("9.37");
    expect(erkennungsbilder(s, s.amZug).markierungen).toEqual([
      { typ: "feld", farbe: "gold", feld: "b5" },
      { typ: "feld", farbe: "gold", feld: "g5" },
    ]);
    expect(bild("9.36").zeilen[1]).toBe("Ungleichfarbige Läufer: Festungsremis möglich");
    expect(bild("9.36").zeilen[2]).toBe(
      "Regel des Buches: Zähle die Freibauern, die sich nicht blockieren lassen",
    );
  });

  it("Abb. 9.43 richtige Ecke, 9.44 falsche Ecke", () => {
    expect(bild("9.43").zeilen[1]).toBe(
      "Die Ecke a8 hat die andere Farbe als der Läufer: die richtige Ecke ✓",
    );
    expect(bild("9.44").zeilen[1]).toBe(
      "Die Ecke h8 hat die Farbe des Läufers: die falsche Ecke ✓",
    );
  });

  it("Kalibrierung an den Übungen 9.45 bis 9.53", () => {
    expect(bild("9.45").titel).toMatch(/^Philidor/);
    expect(bild("9.45").art).toBe("N");
    expect(bild("9.46").titel).toMatch(/^König auf die kurze Seite/);
    expect(bild("9.47").titel).toMatch(/^Lucena/);
    expect(bild("9.48").titel).toMatch(/^Vancura/);
    expect(bild("9.49").titel).toMatch(/^Turm gegen Bauer/);
    expect(bild("9.51").titel).toMatch(/^Turm gegen Bauer/);
    expect(bild("9.52").zeilen[1]).toBe("Randbauer a2: Pattalarm, oft remis");
    expect(bild("9.53").zeilen[1]).toMatch(/^Falscher Läufer/);
  });

  it("kein Bild (Abb. 8.19)", () => {
    expect(bild("8.19").titel).toBe("Kein Bild der Tabelle");
  });
});
