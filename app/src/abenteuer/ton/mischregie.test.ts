/**
 * Tests für mischregie.ts: Siege zählen für das zuletzt gespielte Kampfthema, eine neue Karte setzt
 * zurück, Musiker nah über die Abstandskurve, Innenraum.
 */
import { describe, expect, it } from "vitest";
import { Mischregie, MUSIKERART } from "./mischregie";
import type { Mischlage } from "./spurenmischung";

function regie() {
  const lagen: Mischlage[] = [];
  let neueKarten = 0;
  const r = new Mischregie((arbeit) =>
    arbeit({ setzeMischlage: (l) => lagen.push(l), neueKarte: () => (neueKarten += 1) }),
  );
  return { r, lagen, karten: () => neueKarten };
}

const CLUB = "mapleFalls.clubkampf";

describe("Mischregie", () => {
  it("zählt Siege im Kampfthema, auch wenn zwischen den Partien die Kartenmusik lief", () => {
    const { r } = regie();
    r.betreten("mapleFalls.clubraum", true, []);
    r.musikJetzt(CLUB, CLUB);
    expect(r.lage.siege).toBe(0);
    // Für die Partie endet der Dialog: kurz die Kartenmusik.
    r.musikJetzt("mapleFalls.club", undefined);
    r.ergebnis(true);
    expect(r.lage.siege).toBe(0);
    r.musikJetzt(CLUB, CLUB);
    expect(r.lage.siege).toBe(1);
    r.ergebnis(false);
    r.ergebnis(true);
    expect(r.lage.siege).toBe(2);
  });

  it("ein anderes Kampfthema oder eine andere Karte beginnt bei 0; dieselbe Karte nicht", () => {
    const { r, karten } = regie();
    r.betreten("a", false, []);
    r.musikJetzt(CLUB, CLUB);
    r.ergebnis(true);
    r.betreten("a", false, []);
    r.musikJetzt(CLUB, CLUB);
    expect(r.lage.siege).toBe(1);
    expect(karten()).toBe(1);
    r.betreten("b", false, []);
    expect(r.lage.siege).toBe(0);
    expect(karten()).toBe(2);
    r.musikJetzt("riverton.clubkampf", "riverton.clubkampf");
    r.ergebnis(true);
    expect(r.lage.siege).toBe(1);
  });

  it("Musiker nah: Zusatz nach der Abstandskurve, Innenraum gemeldet", () => {
    const { r, lagen } = regie();
    r.betreten("jahrmarkt.festplatz", true, [
      { art: MUSIKERART, felder: [[10, 10, 1, 1]] },
      { art: "bach", felder: [[0, 0, 1, 1]] },
    ]);
    r.heldBei(0, 0);
    expect(r.lage.musikerNaehe).toBe(0);
    r.heldBei(10, 12);
    expect(r.lage).toEqual({ innen: true, siege: 0, musikerNaehe: 1 });
    r.heldBei(10, 17);
    expect(r.lage.musikerNaehe).toBeCloseTo(0.5, 6);
    // Gleiche Lage meldet nichts doppelt.
    const vorher = lagen.length;
    r.heldBei(10, 17);
    expect(lagen.length).toBe(vorher);
  });
});
