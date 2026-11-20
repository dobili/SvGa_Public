/** Tests für ladehilfen.ts: gleichzeitige Abrufe je Protokoll des Servers (20.11.2026). */
import { describe, expect, it } from "vitest";
import { gleichzeitigFuer, protokollVon } from "./ladehilfen";

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
