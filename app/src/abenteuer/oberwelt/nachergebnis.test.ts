/**
 * Tests der Rückmeldung nach dem Ergebnis (oberwelt/nachergebnis.ts).
 * Warum: Nach der ersten Partie gegen Ambrose kam keine Reaktion (Wunsch des Autors, 19.11.2026);
 * der Dialog, der die Partie startete, muss sich danach wieder öffnen.
 */
import { describe, expect, it, vi } from "vitest";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import type { Oberweltkern } from "./kern";
import { mitGemerktemDialog, nachErgebnis, rueckmeldedialog } from "./nachergebnis";

const LEKTION = "maple-falls-dachboden.dachboden_brett";

function kern(stand: Partial<Abenteuerstand>): {
  k: Oberweltkern;
  geschrieben: Abenteuerstand[];
} {
  const geschrieben: Abenteuerstand[] = [];
  const ref = { current: stand as Abenteuerstand };
  const k = {
    standRef: ref,
    schreibe: (neu: Abenteuerstand) => {
      ref.current = neu;
      geschrieben.push(neu);
    },
  } as unknown as Oberweltkern;
  return { k, geschrieben };
}

describe("Rückmeldung nach dem Ergebnis", () => {
  it("danach geht vor, sonst der gemerkte Dialog", () => {
    expect(rueckmeldedialog({ nachErgebnis: LEKTION }, undefined)).toBe(LEKTION);
    expect(rueckmeldedialog({ nachErgebnis: LEKTION }, "a.b")).toBe("a.b");
    expect(rueckmeldedialog({}, undefined)).toBeNull();
  });

  it("merkt den Dialog nur, wenn er eine Folge startet", () => {
    const stand = {} as Abenteuerstand;
    expect(mitGemerktemDialog(stand, LEKTION, true).nachErgebnis).toBe(LEKTION);
    expect(mitGemerktemDialog(stand, LEKTION, false)).toBe(stand);
    expect(mitGemerktemDialog(stand, null, true)).toBe(stand);
  });

  it("reagiere öffnet den Dialog der ersten Lektion und vergisst ihn", () => {
    const { k, geschrieben } = kern({ nachErgebnis: LEKTION });
    const oeffne = vi.fn();
    nachErgebnis(k, oeffne).reagiere();
    expect(oeffne).toHaveBeenCalledWith(LEKTION);
    expect(geschrieben.at(-1)?.nachErgebnis).toBeNull();
    // Bis zum Ende des Gesprächs gilt sie als offen (Neuladen mitten darin öffnet sie wieder).
    expect(geschrieben.at(-1)?.rueckmeldungOffen).toBe(LEKTION);
  });

  it("vergiss öffnet nichts", () => {
    const { k } = kern({ nachErgebnis: LEKTION });
    const oeffne = vi.fn();
    const r = nachErgebnis(k, oeffne);
    r.vergiss();
    r.reagiere();
    expect(oeffne).not.toHaveBeenCalled();
  });
});
