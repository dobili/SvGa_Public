/**
 * Tests für den Speicher auf IndexedDB: erster Start, Übernahme der Merker, sofortiges Speichern,
 * sichtbare Fehler, aufgehobene unlesbare Daten (Konzept 9.4).
 */
import { openDB } from "idb";
import { afterEach, describe, expect, it, vi } from "vitest";
import { frischeUmgebung } from "./testhilfen";

const JETZT = new Date("2026-10-15T10:00:00.000Z");

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Speicher", () => {
  it("legt beim ersten Start leere Daten an", async () => {
    frischeUmgebung();
    const speicher = await import("./speicher");
    await speicher.lade(JETZT);
    const zustand = speicher.speicherzustand();
    expect(zustand.geladen).toBe(true);
    expect(zustand.fehler).toBeNull();
    expect(zustand.daten.einstellungen.brettfarben).toBe("buch");
    const datenbank = await import("./datenbank");
    expect(await datenbank.liesRoh()).toEqual(zustand.daten);
  });

  it("übernimmt die Merker von 0.2.x und entfernt sie danach", async () => {
    const geraet = frischeUmgebung();
    geraet.setItem("svga.einstellungen", '{"brettfarben":"holz","strenge":"locker"}');
    geraet.setItem("svga.lernstand", '{"1":[0,2]}');
    geraet.setItem("svga.zuletzt", "1.26");
    const speicher = await import("./speicher");
    // Schon vor dem Laden gilt der Stand der Merker (kein Aufblitzen des Standardbretts).
    expect(speicher.speicherzustand().daten.einstellungen.brettfarben).toBe("holz");
    await speicher.lade(JETZT);
    expect(speicher.speicherzustand().daten.lernstand).toEqual({ 1: [0, 2] });
    expect(geraet.getItem("svga.einstellungen")).toBeNull();
    expect(geraet.getItem("svga.lernstand")).toBeNull();
    expect(geraet.getItem("svga.zuletzt")).toBe("1.26");
  });

  it("speichert jede Änderung sofort und lädt sie beim nächsten Start", async () => {
    frischeUmgebung();
    const speicher = await import("./speicher");
    await speicher.lade(JETZT);
    const ok = await speicher.aendere((d) => ({
      ...d,
      einstellungen: { ...d.einstellungen, strenge: "streng" },
    }));
    expect(ok).toBe(true);
    vi.resetModules();
    const neu = await import("./speicher");
    await neu.lade(JETZT);
    expect(neu.speicherzustand().daten.einstellungen.strenge).toBe("streng");
  });

  it("wartet mit einer frühen Änderung, bis geladen ist", async () => {
    frischeUmgebung();
    const datenbank = await import("./datenbank");
    const gespeichert = { schemaVersion: 1, lernstand: { 2: [1] } };
    await datenbank.schreibeRoh(gespeichert);
    const speicher = await import("./speicher");
    await speicher.aendere((d) => ({
      ...d,
      einstellungen: { ...d.einstellungen, strenge: "streng" },
    }));
    expect(speicher.speicherzustand().daten.lernstand).toEqual({ 2: [1] });
    expect(speicher.speicherzustand().daten.einstellungen.strenge).toBe("streng");
  });

  it("zeigt einen Fehler beim Speichern und nimmt ihn nach Erfolg zurück", async () => {
    frischeUmgebung();
    const speicher = await import("./speicher");
    const datenbank = await import("./datenbank");
    await speicher.lade(JETZT);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const schreiben = vi.spyOn(datenbank, "schreibeRoh");
    schreiben.mockRejectedValueOnce(new Error("QuotaExceededError"));
    // Eine Kopie gilt als Änderung; dieselben Daten schreiben nichts (siehe nächster Test).
    expect(await speicher.aendere((d) => ({ ...d }))).toBe(false);
    expect(speicher.speicherzustand().fehler?.art).toBe("speichern");
    expect(await speicher.aendere((d) => ({ ...d }))).toBe(true);
    expect(speicher.speicherzustand().fehler).toBeNull();
  });

  it("schreibt nichts, wenn sich nichts ändert", async () => {
    frischeUmgebung();
    const speicher = await import("./speicher");
    const datenbank = await import("./datenbank");
    await speicher.lade(JETZT);
    const schreiben = vi.spyOn(datenbank, "schreibeRoh");
    expect(await speicher.aendere((d) => d)).toBe(true);
    expect(schreiben).not.toHaveBeenCalled();
  });

  it("hebt Daten einer neueren App auf und beginnt neu", async () => {
    frischeUmgebung();
    const datenbank = await import("./datenbank");
    await datenbank.schreibeRoh({ schemaVersion: 99, geheim: 1 });
    const speicher = await import("./speicher");
    await speicher.lade(JETZT);
    expect(speicher.speicherzustand().fehler).toEqual({ art: "neuer", meldung: "Format 99" });
    const offen = await openDB(datenbank.DATENBANK);
    const schluessel = await offen.getAllKeys("nutzerdaten");
    offen.close();
    expect(schluessel).toEqual(["aktuell", `defekt-${JETZT.toISOString()}`]);
  });
});

describe("Bitte um dauerhaften Speicher (V8)", () => {
  /** Ein Browser, der den Speicher noch nicht (oder schon) dauerhaft hält. */
  function browserspeicher(schonDauerhaft: boolean) {
    const storage = {
      persisted: vi.fn(() => Promise.resolve(schonDauerhaft)),
      persist: vi.fn(() => Promise.resolve(true)),
    };
    vi.stubGlobal("navigator", { storage });
    return storage;
  }

  it("bittet auch bei späteren Starts, solange der Speicher nicht dauerhaft ist", async () => {
    frischeUmgebung();
    const datenbank = await import("./datenbank");
    const formate = await import("./format");
    await datenbank.schreibeRoh(formate.leereDaten(JETZT));
    const storage = browserspeicher(false);
    const speicher = await import("./speicher");
    await speicher.lade(JETZT);
    await vi.waitFor(() => expect(speicher.speicherzustand().dauerhaft).toBe(true));
    expect(storage.persist).toHaveBeenCalledOnce();
  });

  it("fragt nicht, wenn der Speicher schon dauerhaft ist", async () => {
    frischeUmgebung();
    const storage = browserspeicher(true);
    const speicher = await import("./speicher");
    await speicher.lade(JETZT);
    await vi.waitFor(() => expect(speicher.speicherzustand().dauerhaft).toBe(true));
    expect(storage.persist).not.toHaveBeenCalled();
  });
});
