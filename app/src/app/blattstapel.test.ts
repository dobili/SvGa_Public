/**
 * Tests für den Stapel der offenen Blätter (app/blattstapel.ts): Die Zurück-Taste schließt das
 * zuletzt geöffnete Blatt, Abmelden ist mehrfach möglich, Horcher hören jede Änderung.
 * Den Weg mit dem Browserverlauf prüft tests/e2e/zurueck-blatt.spec.ts.
 */
import { describe, expect, it, vi } from "vitest";
import {
  abonniereBlaetter,
  anzahlOffenerBlaetter,
  meldeBlattAn,
  schliesseOberstesBlatt,
} from "./blattstapel";

describe("Blattstapel", () => {
  it("schließt das zuletzt geöffnete Blatt zuerst", () => {
    const infofenster = vi.fn();
    const teilen = vi.fn();
    const abInfo = meldeBlattAn(infofenster);
    const abTeilen = meldeBlattAn(teilen);
    expect(anzahlOffenerBlaetter()).toBe(2);
    expect(schliesseOberstesBlatt()).toBe(true);
    expect(teilen).toHaveBeenCalledOnce();
    expect(infofenster).not.toHaveBeenCalled();
    // Das Blatt meldet sich beim Schließen selbst noch einmal ab: ohne Wirkung.
    abTeilen();
    expect(anzahlOffenerBlaetter()).toBe(1);
    abInfo();
    expect(anzahlOffenerBlaetter()).toBe(0);
  });

  it("ohne offenes Blatt geht die Navigation selbst zurück", () => {
    expect(schliesseOberstesBlatt()).toBe(false);
  });

  it("meldet jede Änderung an die Horcher", () => {
    const horch = vi.fn();
    const abbestellen = abonniereBlaetter(horch);
    const ab = meldeBlattAn(vi.fn());
    ab();
    expect(horch).toHaveBeenCalledTimes(2);
    abbestellen();
    meldeBlattAn(vi.fn())();
    expect(horch).toHaveBeenCalledTimes(2);
  });
});
