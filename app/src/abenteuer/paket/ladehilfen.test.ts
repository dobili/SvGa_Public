/** Tests für ladehilfen.ts: gleichzeitige Abrufe je Protokoll des Servers (20.11.2026). */
import { describe, expect, it } from "vitest";
import { bisZumFehler, gleichzeitigFuer, jeGleichzeitig, protokollVon } from "./ladehilfen";

describe("gleichzeitigFuer", () => {
  it("lädt unter HTTP/2 und HTTP/3 16 Dateien zugleich", () => {
    expect(gleichzeitigFuer("h2")).toBe(16);
    expect(gleichzeitigFuer("h3")).toBe(16);
  });

  it("bleibt unter HTTP/1.x bei sechs", () => {
    expect(gleichzeitigFuer("http/1.1")).toBe(6);
    expect(gleichzeitigFuer("http/1.0")).toBe(6);
  });

  it("nimmt ohne Angabe 16 (unter HTTP/1.1 reiht der Browser den Rest selbst ein)", () => {
    expect(gleichzeitigFuer("")).toBe(16);
  });
});

describe("protokollVon", () => {
  it("ist leer für eine Adresse, die nie geladen wurde", () => {
    expect(protokollVon("https://beispiel.invalid/abenteuer/paket.json")).toBe("");
  });
});

describe("Laden nach einem Fehler (Befund 23.11.2026)", () => {
  it("nimmt nach dem ersten Fehler keine neue Datei mehr", async () => {
    const begonnen: number[] = [];
    const lauf = jeGleichzeitig([1, 2, 3, 4, 5, 6], 2, async (n) => {
      begonnen.push(n);
      await Promise.resolve();
      if (n === 1) throw new Error("Prüfsumme");
    });
    await expect(lauf).rejects.toThrow("Prüfsumme");
    expect(begonnen.length).toBeLessThan(6);
  });

  it("meldet nach dem Fehler keinen Fortschritt mehr", () => {
    const gemeldet: number[] = [];
    const melder = bisZumFehler((geladen) => gemeldet.push(geladen));
    melder.melde(1, 10);
    melder.stoppe();
    melder.melde(2, 10);
    expect(gemeldet).toEqual([1]);
  });
});
