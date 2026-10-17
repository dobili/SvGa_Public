/**
 * Tests der Leerfälle (U12) an Buchabbildungen: Greift ein Werkzeug nicht, steht nur ein Satz;
 * Buchtabellen (Zielbilanz im Mittelspiel, Faktorenbilanz im Endspiel) bleiben voll; der doppelte
 * Satz aus Befund und Fazit fällt weg.
 */
import { describe, expect, it } from "vitest";
import { wende } from "../../analyse/register";
import {
  bilanzfaelle,
  naechsterBuchzug,
  stellungVon,
  verlaufBis,
} from "../../schach/buchabbildungen.testhilfe";
import { phasenregel } from "../../schach/phase";
import { mitLeerfall, WERKZEUGE_MIT_LEERFALL } from "./leerfall";

/** Das Ergebnis eines Werkzeugs an einer Abbildung, wie die Karte es zeigt. */
function karte(id: string, nummer: string) {
  const stellung = stellungVon(nummer);
  const verlauf = verlaufBis(nummer);
  const e = wende(id, {
    stellung,
    perspektive: stellung.amZug,
    zug: naechsterBuchzug(nummer) ?? undefined,
    verlauf,
    buchstellung: true,
  });
  if (!e) throw new Error(`${id} fehlt`);
  return mitLeerfall(e, { stellung, regel: phasenregel(true, verlauf) });
}

describe("Leerfälle der Werkzeugkarten (U12)", () => {
  it("14 Werkzeuge haben eine Bedingung (das Turmendspiel hat seine Sätze schon)", () => {
    expect(WERKZEUGE_MIT_LEERFALL).toHaveLength(14);
  });

  it("Abb. 8.2 (Damen am Brett): Opposition, Schlüsselfelder und Quadrat greifen nicht", () => {
    for (const id of ["k8-opposition", "k8-schluesselfelder", "k8-quadrat"]) {
      const e = karte(id, "8.2");
      expect(e.befunde, id).toEqual([]);
      expect(e.markierungen, id).toEqual([]);
      expect(e.fazit, id).toMatch(/Hier nicht: Es stehen noch Figuren außer Königen und Bauern/);
    }
  });

  it("Abb. 1.26 (Eröffnung): Endspielregeln greifen nicht, Todsünden schon", () => {
    expect(karte("k8-regeln", "1.26").fazit).toBe(
      "Die sechs Endspielregeln gelten im Endspiel und auf dem Weg dorthin. Hier nicht: Es ist Eröffnung.",
    );
    expect(karte("k1-todsuenden", "1.26").befunde.length).toBeGreaterThan(0);
  });

  it("Abb. 8.1 (Endspiel): Angriffsregel und Zielbilanz greifen nicht", () => {
    expect(karte("k1-angriffsregel", "8.1").fazit).toMatch(/Hier nicht: Es ist Endspiel\.$/);
    expect(karte("k2-zielbilanz", "8.1").befunde).toEqual([]);
  });

  it("keine Buchtabelle wird verdeckt: Ziel- und Faktorenbilanzen behalten ihre Befunde", () => {
    for (const fall of bilanzfaelle("ziel"))
      expect(karte("k2-zielbilanz", fall.abbildung).befunde.length, fall.abbildung).toBeGreaterThan(
        0,
      );
    for (const fall of bilanzfaelle("faktor"))
      expect(
        karte("k3-faktorenbilanz", fall.abbildung).befunde.length,
        fall.abbildung,
      ).toBeGreaterThan(0);
  });

  it("der doppelte Satz fällt weg: Fazit nie noch einmal als Befundzeile", () => {
    for (const [id, nummer] of [
      ["k8-elementarmatt", "1.26"],
      ["k9-turmbegriffe", "1.26"],
      ["k6-lap", "0.20"],
    ] as const) {
      const e = karte(id, nummer);
      expect(
        e.befunde.flatMap((b) => b.zeilen),
        `${id} ${nummer}`,
      ).not.toContain(e.fazit);
    }
  });
});
