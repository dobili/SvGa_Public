/**
 * Ward spricht dort, wo sie sitzt (summit-city-huette.ink): tagsüber im Sessel in der Hütte, abends
 * und nachts nach ihrem Tagesablauf auf der Parkbank in Summit City. Die App gibt dem Dialog die
 * Karte unter dem Helden als `hierKarte` mit (regeln/dialogvariablen.ts, variablenAusBesitz).
 *
 * Warum (schwacher Spieler-Durchlauf Akt 4, 24.11.2026): Auf der Parkbank begann Wards erstes
 * Gespräch mit „Eleanor Ward sitzt im Sessel am Feuer“, und sie bot dort Tee aus der Kanne an.
 */
import { readFileSync } from "node:fs";
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";
import { describe, expect, it } from "vitest";
import { Geschichte, type Dialogvariablen, type Wirkungen } from "./geschichte";

const DATEI = new URL(
  "../../../../inhalte/abenteuer/dialoge/de/summit-city-huette.ink",
  import.meta.url,
);
const HUETTE = "summitCity.huette";
const BANK = "summitCity.aussen";
/** So oft wird Wards Alltag gesprochen ({~…} zieht zufällig; dass eine Zeile fehlt: (2/3)^30). */
const ALLTAG_RUNDEN = 30;

const quelle =
  new Compiler(readFileSync(DATEI, "utf8"), new CompilerOptions(null, [], true))
    .Compile()
    .ToJson() ?? "";
const still = new Proxy<Wirkungen>({} as Wirkungen, { get: () => () => undefined });

/** Die erste Zeile eines Gesprächs ab `knoten`. */
function ersteZeile(knoten: string, variablen: Dialogvariablen): string {
  const geschichte = new Geschichte(quelle, still, variablen, "Kim");
  geschichte.starte(knoten);
  const schritt = geschichte.weiter();
  return schritt.art === "zeile" ? schritt.zeile.text : "";
}

describe("Ward spricht dort, wo sie sitzt", () => {
  it("erste Begegnung: im Sessel in der Hütte, auf der Parkbank draußen", () => {
    expect(ersteZeile("ward_lektion", { hierKarte: HUETTE })).toMatch(/im Sessel am Feuer/);
    const draussen = ersteZeile("ward_lektion", { hierKarte: BANK });
    expect(draussen).toMatch(/Parkbank/);
    expect(draussen).not.toMatch(/Sessel|Feuer/);
  });

  it("Tee bietet sie nur in der Hütte an", () => {
    // Eine Geschichte für alle Runden; {~…} zieht bei jedem Besuch neu.
    const geschichte = new Geschichte(quelle, still, { hierKarte: BANK }, "Kim");
    const zeilen: string[] = [];
    for (let i = 0; i < ALLTAG_RUNDEN; i++) {
      geschichte.starte("ward_alltag");
      const schritt = geschichte.weiter();
      if (schritt.art === "zeile") zeilen.push(schritt.zeile.text);
    }
    expect(zeilen.join(" ")).not.toMatch(/Tee/);
    expect(zeilen.join(" ")).toMatch(/Seilbahn/);
  });
});
