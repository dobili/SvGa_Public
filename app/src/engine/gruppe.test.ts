/** Tests des Gruppenmodus (engine/gruppe.ts): Kennungen, Freischaltung, Stufen, Wertung. */
import { describe, expect, it } from "vitest";
import { gegnerDerStufe } from "./gegner";
import {
  freieGruppen,
  gemesseneGruppenstaerke,
  gruppeFrei,
  gruppenkennung,
  gruppenstaerkeSichtbar,
  gruppenstufe,
  gruppenstufen,
  gruppenwertung,
  istGruppe,
  mitgliederDerGruppe,
} from "./gruppe";
import { KEINE_BESIEGTEN, type Besiegte } from "../speicher/besiegt";

/** Eine Stufe mit Bots (die Gruppen folgen der gemessenen Zahl, nicht jede Stufe hat welche). */
const STUFE = ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const).find((n) => gegnerDerStufe(n).length > 1);
if (STUFE === undefined) throw new Error("keine Stufe mit Bots");
const BOTS = gegnerDerStufe(STUFE).map((g) => g.kennung);

describe("Gruppenmodus", () => {
  it("Kennung „gruppe-N“ hin und zurück; alles andere ist keine Gruppe", () => {
    expect(gruppenkennung(3)).toBe("gruppe-3");
    expect(gruppenstufe("gruppe-3")).toBe(3);
    expect(istGruppe("gruppe-10")).toBe(true);
    expect(istGruppe("lotta")).toBe(false);
    expect(istGruppe(null)).toBe(false);
    expect(gruppenstufe("gruppe-11")).toBeNull();
    expect(gruppenstufe("gruppe-x")).toBeNull();
  });

  it("frei erst, wenn jeder Bot der Stufe in irgendeiner Zeitklasse besiegt ist", () => {
    expect(gruppeFrei(KEINE_BESIEGTEN, STUFE)).toBe(false);
    const fastAlle: Besiegte = { ...KEINE_BESIEGTEN, rapid: BOTS.slice(1) };
    expect(gruppeFrei(fastAlle, STUFE)).toBe(false);
    // Der letzte Bot im Blitz besiegt: zählt, egal in welcher Zeitklasse.
    const alle: Besiegte = { ...fastAlle, blitz: [BOTS[0] ?? ""] };
    expect(gruppeFrei(alle, STUFE)).toBe(true);
    expect(freieGruppen(alle)).toEqual([STUFE]);
    expect(freieGruppen(KEINE_BESIEGTEN)).toEqual([]);
  });

  it("Stufen der Gruppe: je Phase die höchste ihrer Bots; Mitglieder ohne Spaß-Bots", () => {
    const je = gruppenstufen(STUFE);
    for (const g of mitgliederDerGruppe(STUFE)) {
      expect(g.zufallszuege ?? 0).toBe(0);
      expect(je.mittelspiel).toBeGreaterThanOrEqual(g.stufenJePhase.mittelspiel);
      expect(je.endspiel).toBeGreaterThanOrEqual(g.stufenJePhase.endspiel);
    }
  });

  it("Wertung aus der Messung (0.2.126); Zahl erst nach dem ersten Sieg sichtbar", () => {
    const gemessen = gemesseneGruppenstaerke(STUFE);
    expect(gemessen).not.toBeNull();
    expect(gruppenwertung(STUFE)).toBe(gemessen);
    const besiegt: Besiegte = { ...KEINE_BESIEGTEN, rapid: [gruppenkennung(STUFE)] };
    expect(gruppenstaerkeSichtbar(besiegt, STUFE)).toBe(true);
    expect(gruppenstaerkeSichtbar(KEINE_BESIEGTEN, STUFE)).toBe(false);
  });
  it("alle zehn Gruppen sind gemessen", () => {
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const) {
      expect(gemesseneGruppenstaerke(n), `Gruppe ${n}`).not.toBeNull();
    }
  });
});
