/**
 * Dauerprüfung der Codepflege im Abenteuer (CLAUDE.md Regel 4, Auftrag 20.11.2026): Keine Datei in
 * src/abenteuer und tests/durchlauf hat mehr als 400 Zeilen, und keine nutzt `any`.
 *
 * Warum: Die Regel galt, wurde aber nur von Hand geprüft; drei Dateien waren darüber gewachsen.
 * ESLint verbietet `any` schon (no-explicit-any), die Prüfung hier fängt auch Dateien, die ESLint
 * nicht sieht, und nennt den Fund mit Datei und Zeile. Die Python- und Node-Werkzeuge in
 * pipeline/abenteuer prüft pipeline/tests/test_abenteuer_codepflege.py.
 * Ausnahmen stehen in AUSNAHMEN, je mit Grund.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Höchstzahl der Zeilen einer Datei (Regel 4). */
const HOECHSTENS_ZEILEN = 400;

/** Dateien, die vorerst darüber liegen dürfen, mit Grund. Pfade relativ zu app/. */
const AUSNAHMEN: Readonly<Record<string, string>> = {
  "src/abenteuer/oberwelt/Oberwelt.tsx":
    "404 Zeilen (20.11.2026); die Oberwelt ist gerade Baustelle von mittel-3, Aufteilen danach.",
};

const APP = new URL("../../", import.meta.url).pathname;
const ORDNER = ["src/abenteuer", "tests/durchlauf"];

/** Alle TypeScript-Dateien unter einem Ordner, relativ zu app/. */
function dateien(ordner: string): string[] {
  return readdirSync(join(APP, ordner), { withFileTypes: true }).flatMap((e) => {
    const pfad = `${ordner}/${e.name}`;
    if (e.isDirectory()) return dateien(pfad);
    return /\.tsx?$/.test(e.name) ? [pfad] : [];
  });
}

const alle = ORDNER.flatMap(dateien);
const zeilenVon = (pfad: string) => readFileSync(join(APP, pfad), "utf8").split("\n");

describe("Codepflege im Abenteuer (Regel 4)", () => {
  it("findet die Dateien", () => {
    expect(alle.length).toBeGreaterThan(HOECHSTENS_ZEILEN);
  });

  it("keine Datei über 400 Zeilen, außer den Ausnahmen mit Grund", () => {
    const zuLang = alle
      .map((p) => ({ p, n: zeilenVon(p).filter((z, i, a) => i < a.length - 1 || z).length }))
      .filter(({ p, n }) => n > HOECHSTENS_ZEILEN && !AUSNAHMEN[p])
      .map(({ p, n }) => `${p}: ${n} Zeilen`);
    expect(zuLang).toEqual([]);
  });

  it("kein `any` (Typ, Umwandlung, Typargument)", () => {
    const muster = /(:\s*any\b|\bas any\b|<any>|any\[\])/;
    // Diese Datei selbst enthält das Muster als Text.
    const funde = alle
      .filter((p) => !p.endsWith("codepflege.test.ts"))
      .flatMap((p) =>
        zeilenVon(p)
          .map((z, i) => ({ z, i }))
          .filter(({ z }) => muster.test(z) && !/^\s*(\/\/|\*)/.test(z))
          .map(({ i }) => `${p}:${i + 1}`),
      );
    expect(funde).toEqual([]);
  });
});
