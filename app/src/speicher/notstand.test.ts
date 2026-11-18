/**
 * Tests für den Notstand: Ein Schreibvorgang, den das Verlassen der Seite abbricht, wird beim
 * nächsten Laden nachgeholt, aber nie über einen neueren Stand eines anderen Tabs hinweg
 * (Fehlertest „zwei Tabs“ in varianten.spec.ts, 17.11.2026).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Nutzerdaten } from "./format";
import { frischeUmgebung } from "./testhilfen";

const JETZT = new Date("2026-11-17T10:00:00.000Z");

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Frische Umgebung mit einem Fenster, das die Abonnenten von pagehide sammelt. */
function umgebungMitVerlassen(): { verlasse: () => void } {
  const geraet = frischeUmgebung();
  const beimVerlassen: (() => void)[] = [];
  vi.stubGlobal("window", {
    localStorage: geraet,
    sessionStorage: geraet,
    addEventListener: (art: string, rueckruf: () => void) => {
      if (art === "pagehide") beimVerlassen.push(rueckruf);
    },
  });
  return { verlasse: () => beimVerlassen.forEach((rueckruf) => rueckruf()) };
}

/** Setzt die Strenge, eine leicht prüfbare Einstellung. */
function mitStrenge(strenge: "locker" | "streng") {
  return (d: Nutzerdaten): Nutzerdaten => ({
    ...d,
    einstellungen: { ...d.einstellungen, strenge },
  });
}

/**
 * Lädt, speichert „locker“ fertig und beginnt „streng“, dessen Schreiben nie fertig wird (wie
 * ein Neuladen mitten im Schreibvorgang); danach verlässt der Tab die Seite.
 */
async function abgebrochenesSpeichern(verlasse: () => void): Promise<void> {
  const speicher = await import("./speicher");
  const datenbank = await import("./datenbank");
  await speicher.lade(JETZT);
  expect(await speicher.aendere(mitStrenge("locker"))).toBe(true);
  const schreiben = vi
    .spyOn(datenbank, "schreibeAbgeglichen")
    .mockReturnValueOnce(new Promise<never>(() => undefined));
  void speicher.aendere(mitStrenge("streng"));
  await vi.waitFor(() => expect(schreiben).toHaveBeenCalled());
  verlasse();
  vi.restoreAllMocks();
}

describe("Notstand", () => {
  it("holt einen beim Verlassen abgebrochenen Schreibvorgang beim nächsten Laden nach", async () => {
    const { verlasse } = umgebungMitVerlassen();
    await abgebrochenesSpeichern(verlasse);
    expect(window.localStorage.getItem("svga.notstand")).not.toBeNull();
    vi.resetModules();
    const neu = await import("./speicher");
    await neu.lade(JETZT);
    expect(neu.speicherzustand().daten.einstellungen.strenge).toBe("streng");
    const datenbank = await import("./datenbank");
    expect(await datenbank.liesRoh()).toMatchObject({ einstellungen: { strenge: "streng" } });
    expect(window.localStorage.getItem("svga.notstand")).toBeNull();
  });

  it("nimmt nach einem fremden Schreiben dessen Stand und nur die eigenen Teile dazu", async () => {
    // Fehlertest „zwei Tabs“ (18.11.2026): Tab B schrieb seine Auswertung, während Tab A neu lud;
    // der Zug in A's Variante ging verloren, weil der Notstand ganz verworfen wurde.
    const { verlasse } = umgebungMitVerlassen();
    await abgebrochenesSpeichern(verlasse);
    const datenbank = await import("./datenbank");
    const fremd = (await datenbank.liesRoh()) as Nutzerdaten;
    await datenbank.schreibeRoh({ ...fremd, lernstand: { 3: [1] } });
    vi.resetModules();
    const neu = await import("./speicher");
    await neu.lade(JETZT);
    expect(neu.speicherzustand().daten.lernstand).toEqual({ 3: [1] });
    expect(neu.speicherzustand().daten.einstellungen.strenge).toBe("streng");
    expect(await datenbank.liesRoh()).toMatchObject({
      lernstand: { 3: [1] },
      einstellungen: { strenge: "streng" },
    });
    expect(window.localStorage.getItem("svga.notstand")).toBeNull();
  });

  it("verwirft den Notstand, wenn der fremde Stand die eigenen Teile schon enthält", async () => {
    const { verlasse } = umgebungMitVerlassen();
    await abgebrochenesSpeichern(verlasse);
    const datenbank = await import("./datenbank");
    const fremd = (await datenbank.liesRoh()) as Nutzerdaten;
    await datenbank.schreibeRoh(mitStrenge("streng")({ ...fremd, lernstand: { 3: [1] } }));
    const { nimmNotstand } = await import("./notstand");
    expect(nimmNotstand(await datenbank.liesRoh())).toBeNull();
  });

  it("lässt den Notstand einer anderen Seite stehen (gemeinsamer Gerätespeicher der Tabs)", async () => {
    const geraet = frischeUmgebung();
    const fremd = JSON.stringify({ daten: {}, bekannt: ["x"], geaendert: [], seite: "andere" });
    geraet.setItem("svga.notstand", fremd);
    const { verwirfNotstand } = await import("./notstand");
    verwirfNotstand();
    expect(geraet.getItem("svga.notstand")).toBe(fremd);
  });

  it("legt ohne ausstehendes Schreiben keinen Notstand an", async () => {
    const { verlasse } = umgebungMitVerlassen();
    const speicher = await import("./speicher");
    await speicher.lade(JETZT);
    expect(await speicher.aendere(mitStrenge("streng"))).toBe(true);
    verlasse();
    expect(window.localStorage.getItem("svga.notstand")).toBeNull();
  });

  it("Prüfsumme: gleicher Stand gleich, anderer Stand anders, nichts gespeichert leer", async () => {
    const { pruefsumme } = await import("./notstand");
    expect(pruefsumme({ zuege: ["e4"] })).toBe(pruefsumme({ zuege: ["e4"] }));
    expect(pruefsumme({ zuege: ["e4"] })).not.toBe(pruefsumme({ zuege: ["e4", "e5"] }));
    expect(pruefsumme(undefined)).toBe("");
  });

  it("ein unlesbarer Notstand gilt als keiner und wird entfernt", async () => {
    const geraet = frischeUmgebung();
    geraet.setItem("svga.notstand", "{kaputt");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { nimmNotstand } = await import("./notstand");
    expect(nimmNotstand({ schemaVersion: 1 })).toBeNull();
    expect(geraet.getItem("svga.notstand")).toBeNull();
  });
});
