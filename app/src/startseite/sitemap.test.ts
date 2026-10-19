/**
 * Tests für sitemap.xml und robots.txt (19.10.2026): Jede Seite der Website steht in der Sitemap,
 * damit Suchmaschinen Buch, Installation und Trainingsseiten finden.
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const DOMAIN = "https://schach-von-grund-auf.com";
const sitemap = readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
const adressen = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

describe("Sitemap", () => {
  it("nennt jede Trainingsseite eines Kapitels", () => {
    const kapitel = readdirSync(new URL("../../../inhalte/de/training/", import.meta.url))
      .filter((name) => /^kap\d{2}\.json$/.test(name))
      .map((name) => `${DOMAIN}/training/${name.replace(".json", "")}/`);
    expect(kapitel.length).toBe(13);
    expect(adressen).toEqual(expect.arrayContaining(kapitel));
  });

  it("nennt Startseite, Installation, Impressum und Datenschutz, jede Adresse einmal", () => {
    for (const pfad of ["/", "/installieren/", "/impressum/", "/datenschutz/"]) {
      expect(adressen).toContain(`${DOMAIN}${pfad}`);
    }
    expect(new Set(adressen).size).toBe(adressen.length);
  });

  it("robots.txt verweist auf die Sitemap", () => {
    const robots = readFileSync(new URL("../../public/robots.txt", import.meta.url), "utf8");
    expect(robots).toContain(`Sitemap: ${DOMAIN}/sitemap.xml`);
  });
});
