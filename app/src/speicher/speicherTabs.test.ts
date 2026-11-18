/**
 * Tests für zwei Tabs, die abwechselnd schreiben: Keiner überschreibt die Änderung des anderen,
 * auch wenn die Meldung des anderen Tabs nicht ankam oder zu spät kam (Fehlertest „zwei Tabs“ in
 * varianten.spec.ts, 18.11.2026: ein Zug in einer Variante ging verloren, weil der zweite Tab
 * während seiner Auswertung seinen alten Stand schrieb).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Nutzerdaten } from "./format";
import { frischeUmgebung } from "./testhilfen";

const JETZT = new Date("2026-11-18T10:00:00.000Z");

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Setzt die Strenge, eine leicht prüfbare Einstellung. */
function mitStrenge(strenge: "locker" | "streng") {
  return (d: Nutzerdaten): Nutzerdaten => ({
    ...d,
    einstellungen: { ...d.einstellungen, strenge },
  });
}

describe("Zwei Tabs", () => {
  it("setzt die eigene Änderung auf den Stand eines anderen Tabs, statt ihn zu überschreiben", async () => {
    frischeUmgebung();
    const speicher = await import("./speicher");
    const datenbank = await import("./datenbank");
    await speicher.lade(JETZT);
    // Der andere Tab schreibt; seine Meldung kommt hier nicht an.
    const fremd = (await datenbank.liesRoh()) as Nutzerdaten;
    await datenbank.schreibeRoh({ ...fremd, lernstand: { 3: [1] } });
    expect(await speicher.aendere(mitStrenge("streng"))).toBe(true);
    const gespeichert = (await datenbank.liesRoh()) as Nutzerdaten;
    expect(gespeichert.lernstand).toEqual({ 3: [1] });
    expect(gespeichert.einstellungen.strenge).toBe("streng");
    // Auch der Tab selbst zeigt jetzt beides.
    expect(speicher.speicherzustand().daten.lernstand).toEqual({ 3: [1] });
  });

  it("schreibt ohne fremden Stand dazwischen einfach den eigenen", async () => {
    frischeUmgebung();
    const speicher = await import("./speicher");
    const datenbank = await import("./datenbank");
    await speicher.lade(JETZT);
    expect(await speicher.aendere(mitStrenge("streng"))).toBe(true);
    expect(await speicher.aendere(mitStrenge("locker"))).toBe(true);
    const gespeichert = (await datenbank.liesRoh()) as Nutzerdaten;
    expect(gespeichert.einstellungen.strenge).toBe("locker");
    expect(gespeichert).toEqual(speicher.speicherzustand().daten);
  });

  it("ein eingespieltes Backup ersetzt auch einen fremden Stand ganz", async () => {
    frischeUmgebung();
    const speicher = await import("./speicher");
    const datenbank = await import("./datenbank");
    await speicher.lade(JETZT);
    const backup = speicher.speicherzustand().daten;
    const fremd = (await datenbank.liesRoh()) as Nutzerdaten;
    await datenbank.schreibeRoh({ ...fremd, lernstand: { 3: [1] } });
    expect(await speicher.speichere({ ...backup, lernstand: { 5: [2] } })).toBe(true);
    expect(((await datenbank.liesRoh()) as Nutzerdaten).lernstand).toEqual({ 5: [2] });
  });
});
