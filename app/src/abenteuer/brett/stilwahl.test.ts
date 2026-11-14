/**
 * Tests der Stilwahl mit den echten Spieldaten aus inhalte/abenteuer/ und der Pixelfiguren.
 *
 * Regel: docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5 – Feld `brett` in
 * begegnungen.json überschreibt die Vorgabe aus orte.json; Erinnerungen in Sepia; Blindschach
 * bleibt, wie es ist.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Partie } from "../../spiel/partie";
import { BRETTSTILE } from "./brettstile";
import { figurenraster, pixellaeufe, PIXELRASTER, RASTERGROESSE } from "./pixelfiguren";
import { waehleBrettstil, type Stildaten } from "./stilwahl";
import { partieBrettquelle, rundenBrettquelle } from "./useAbenteuerBrettstil";

/** Liest eine JSON-Datei relativ zu dieser Datei. */
function lies<T>(pfad: string): T {
  return JSON.parse(readFileSync(new URL(pfad, import.meta.url), "utf8")) as T;
}

const INHALTE = "../../../../inhalte/abenteuer/";
const daten: Stildaten = {
  orte: lies<{ orte: Stildaten["orte"] }>(`${INHALTE}orte.json`).orte,
  begegnungen: lies<{ begegnungen: Stildaten["begegnungen"] }>(`${INHALTE}begegnungen.json`)
    .begegnungen,
  runden: lies<{ runden: Stildaten["runden"] }>(`${INHALTE}runden.json`).runden,
};

/** Eine Partie des Abenteuers, nur mit den Feldern, die die Stilwahl liest. */
function partie(kennung: string, variante?: "blind"): Partie {
  return { einstellung: { abenteuer: { kennung, variante } } } as unknown as Partie;
}

describe("Stilwahl", () => {
  it("nimmt den Stil des Ortes der Begegnung", () => {
    expect(waehleBrettstil(partieBrettquelle(partie("ironwood.clubkampf#a1")), daten)).toBe(
      "stahl",
    );
    expect(waehleBrettstil({ art: "partie", begegnung: "capitalArena.finale" }, daten)).toBe(
      "turnier",
    );
  });

  it("lässt das Feld brett der Begegnung den Ort überschreiben", () => {
    expect(waehleBrettstil({ art: "partie", begegnung: "reisebrett.ambrose" }, daten)).toBe(
      "dachboden",
    );
    expect(waehleBrettstil({ art: "partie", begegnung: "mapleFalls.clubkampf" }, daten)).toBe(
      "turniervinyl",
    );
    expect(
      waehleBrettstil({ art: "partie", begegnung: "desertSprings.erinnerung1858" }, daten),
    ).toBe("sepia");
  });

  it("gibt Wegen und Orten ohne Stil das abgegriffene Holz", () => {
    expect(waehleBrettstil({ art: "partie", begegnung: "wegGhostCapital.simultan1" }, daten)).toBe(
      "abgegriffen",
    );
  });

  it("gibt Rätselrunden den Stil ihres Ortes und Erinnerungen Sepia", () => {
    const runde = { runde: "summitCity.reiheKit", kennung: "x", steller: "y" };
    const auftrag = { ...runde, kapitel: 1, buchuebungen: [], themen: [], anzahl: 1 };
    const voll = { ...auftrag, schwierigkeit: 1, versuch: 1, zaehltFuerApp: false };
    expect(waehleBrettstil(rundenBrettquelle(voll), daten)).toBe("schiefer");
    const erinnerung = { ...voll, erinnerung: { partie: "p", abZug: 1, seite: "white" as const } };
    expect(waehleBrettstil(rundenBrettquelle(erinnerung), daten)).toBe("sepia");
  });

  it("zeigt Blindschach ohne Stil", () => {
    expect(partieBrettquelle(partie("wegCrossroadsPinewood.blindschach", "blind"))).toBeNull();
    expect(waehleBrettstil(null, daten)).toBeNull();
  });

  it("kennt alle Stile, die die Spieldaten nennen, und das Schema nennt dieselben", () => {
    const genannt = [...daten.orte, ...daten.begegnungen].flatMap((x) =>
      x.brett ? [x.brett] : [],
    );
    expect(genannt.every((b) => (BRETTSTILE as readonly string[]).includes(b))).toBe(true);
    for (const schema of ["abenteuer-orte", "abenteuer-begegnungen"]) {
      const text = readFileSync(
        new URL(`../../../../schemas/${schema}.schema.json`, import.meta.url),
        "utf8",
      );
      const json = JSON.parse(text) as { $defs: Record<string, { properties?: object }> };
      const def = schema === "abenteuer-orte" ? json.$defs.ort : json.$defs.begegnung;
      const brett = (def?.properties as Record<string, { enum?: string[] }> | undefined)?.brett;
      expect(brett?.enum).toEqual([...BRETTSTILE]);
    }
  });
});

describe("Pixelfiguren", () => {
  it("haben sechs Figuren mit 18 Zeilen zu 18 Zeichen", () => {
    expect(Object.keys(PIXELRASTER).sort()).toEqual(["B", "K", "N", "P", "Q", "R"]);
    for (const raster of Object.values(PIXELRASTER)) {
      expect(raster).toHaveLength(RASTERGROESSE);
      for (const zeile of raster) expect(zeile).toMatch(/^[.123]{18}$/);
    }
  });

  it("geben Weiß und Schwarz dieselbe Zeichnung mit Schatten rechts", () => {
    expect(figurenraster("p")).toEqual(figurenraster("P"));
    expect(figurenraster("x")).toBeNull();
    expect(figurenraster("R")?.[7]).toBe("....1222222231....");
  });

  it("fassen Zeilen zu Läufen zusammen", () => {
    expect(pixellaeufe(["..111.22", "........"])).toEqual([
      { x: 2, y: 0, laenge: 3, klasse: "umriss" },
      { x: 6, y: 0, laenge: 2, klasse: "koerper" },
    ]);
  });

  it("nimmt für Vorführung und Gedächtnisstellung den Ort, an dem der Held steht", () => {
    expect(waehleBrettstil({ art: "ort", ort: "ironwood" }, daten)).toBe("stahl");
    expect(waehleBrettstil({ art: "ort", ort: "unbekannterWeg" }, daten)).toBe("abgegriffen");
  });
});
