/**
 * Auswertung des Spieler-Durchlaufs (auswertung.ts): Die Schätzung rechnet mit den Annahmen des
 * Auftrags (180 und 120 Wörter je Minute, 15 Sekunden je eigenem Zug); die Laufzeit kommt aus den
 * gelaufenen Kacheln (840 Kacheln sind 240 Sekunden).
 */
import { describe, expect, it } from "vitest";
import { GRUENDLICH, schaetze, tabellen, ZUEGIG } from "./auswertung";
import type { Aktmessung } from "./messung";

const AKT: Aktmessung = {
  laufMs: 240_000,
  schritte: 840,
  dialogzeilen: 120,
  dialogwoerter: 1700,
  wahlen: 10,
  meldungen: 0,
  meldungswoerter: 100,
  ladeMs: 30_000,
  ladevorgaenge: 5,
  kartenwechsel: 12,
  echtMs: 600_000,
  partien: [
    {
      kennung: "a",
      halbzuege: 80,
      eigeneZuege: 40,
      ende: "matt",
      ausgang: "sieg",
      ms: 1,
      karte: "k",
    },
    {
      kennung: "b",
      halbzuege: 41,
      eigeneZuege: 20,
      ende: "matt",
      ausgang: "sieg",
      ms: 1,
      karte: "k",
    },
  ],
  runden: [{ kennung: "r", aufgaben: 4, richtig: 3, ms: 1 }],
};

describe("Auswertung des Spieler-Durchlaufs", () => {
  it("schätzt den zügigen Spieler: 180 Wörter je Minute, 15 Sekunden je Zug", () => {
    const s = schaetze(AKT, ZUEGIG);
    expect(s.lesen).toBeCloseTo(1800 / 180 + (120 * 0.5) / 60);
    expect(s.laufen).toBeCloseTo(4);
    expect(s.partien).toBeCloseTo(15);
    expect(s.aufgaben).toBeCloseTo(3);
    expect(s.laden).toBeCloseTo(0.5);
    expect(s.summe).toBeCloseTo(11 + 4 + 15 + 3 + 0.5);
  });

  it("der gründliche Spieler liest mit 120 Wörtern je Minute und läuft Umwege", () => {
    const s = schaetze(AKT, GRUENDLICH);
    expect(s.lesen).toBeCloseTo(1800 / 120 + 2);
    expect(s.laufen).toBeCloseTo(6);
    expect(s.summe).toBeGreaterThan(schaetze(AKT, ZUEGIG).summe);
  });

  it("die Tabellen nennen jeden Akt und die Summe je Spielertyp", () => {
    const text = tabellen({ "2": AKT, "1": AKT });
    expect(text).toContain(
      "| 1 | 840 | 4,0 | 12 | 120 | 1800 | 2 | 121 (60) | 1 (4) | 0,5 | 10,0 |",
    );
    expect(text.indexOf("| 1 | zügig")).toBeLessThan(text.indexOf("| 2 | zügig"));
    expect(text).toContain("| alle | gründlich |");
  });
});
