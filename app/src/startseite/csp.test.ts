/**
 * Tests für die Content Security Policy der öffentlichen Seiten (csp.ts, T4).
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { eingebetteteSkripte, sicherheitsregel } from "./csp";

describe("eingebetteteSkripte", () => {
  it("findet nur Skripte ohne src", () => {
    const html =
      '<script>a()</script><script type="module" src="/x.js"></script><script>\nb()\n</script>';
    expect(eingebetteteSkripte(html)).toEqual(["a()", "\nb()\n"]);
  });

  it("gibt eine leere Liste ohne eingebettete Skripte", () => {
    expect(eingebetteteSkripte("<p>Text</p>")).toEqual([]);
  });
});

describe("sicherheitsregel", () => {
  it("erlaubt nur eigene Dateien, WebAssembly und die Prüfsummen, jede einmal", () => {
    const regel = sicherheitsregel(["b=", "a=", "b="]);
    expect(regel).toContain("default-src 'self'");
    expect(regel).toContain("script-src 'self' 'wasm-unsafe-eval' 'sha256-a=' 'sha256-b='");
    expect(regel).toContain("object-src 'none'");
    expect(regel).not.toMatch(/ 'unsafe-eval'/);
  });
});

describe("Seiten ohne eingebettete Ereignis-Handler", () => {
  // Ein onclick-Attribut bräuchte 'unsafe-inline' für script-src-attr; neuere Chromium melden
  // es, auch wenn der Knopf nie erscheint (GitHub-Lauf vom 25.10.2026, Startproblem-Knopf).
  const SEITEN = [
    "../../index.html",
    "../../app/index.html",
    "../../installieren/index.html",
    "../../datenschutz/index.html",
    "../../impressum/index.html",
    "./teile/installationsteil.html",
  ];
  it.each(SEITEN)("%s hat kein on…=-Attribut", (seite) => {
    const html = readFileSync(new URL(seite, import.meta.url), "utf8");
    expect(html).not.toMatch(/\son[a-z]+\s*=\s*["']/i);
  });
});
