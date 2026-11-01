/**
 * Prüft die Lizenzseite gegen das, was die App wirklich ausliefert (Prüfung der Lizenzen,
 * 1.11.2026).
 *
 * Warum: MIT, ISC, BSD und Apache verlangen, dass ihr Lizenztext mitkommt; die GPL der App
 * verträgt nur bestimmte Lizenzen. Kommt ein neues npm-Paket in die Auslieferung (als
 * Abhängigkeit, im Service Worker oder gebündelt in onnxruntime-web), soll dieser Test es melden,
 * bis es einen Eintrag auf der Lizenzseite (lizenzbausteine.ts, Sprachdateien) und in
 * docs/LIZENZEN.md hat.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import de from "../../i18n/de.json";
import en from "../../i18n/en.json";
import { BAUSTEINE, TEXTE_AUS_DEM_BUILD } from "./lizenzbausteine";

const APP = new URL("../../../", import.meta.url);
const lies = (pfad: string): string => readFileSync(new URL(pfad, APP), "utf8");

/** Ein Eintrag in package-lock.json (nur die Felder, die der Test braucht). */
interface Sperreintrag {
  readonly version?: string;
  readonly license?: string;
  readonly dev?: boolean;
}
const SPERRE = JSON.parse(lies("package-lock.json")) as {
  packages: Record<string, Sperreintrag>;
};

/** Paketname aus einem Pfad der Sperrdatei („node_modules/a/node_modules/@b/c“ → „@b/c“). */
function paketname(pfad: string): string {
  return pfad.slice(pfad.lastIndexOf("node_modules/") + "node_modules/".length);
}

/** Version eines Pakets laut Sperrdatei (oberste Ebene). */
function version(name: string): string {
  return SPERRE.packages[`node_modules/${name}`]?.version ?? "";
}

/** Pakete nur mit Typangaben: Sie landen nie in der Auslieferung. */
function nurTypen(name: string): boolean {
  return name.startsWith("@types/") || name === "csstype" || name === "undici-types";
}

/**
 * Pakete im Abhängigkeitsbaum, die nachweislich nicht ausgeliefert werden, mit Grund.
 * platform: onnxruntime-web verlangt es, die gebündelte Fassung ort.bundle.min.mjs enthält es
 * laut Quellkarte nicht.
 */
const NICHT_AUSGELIEFERT: Readonly<Record<string, string>> = {
  platform: "nicht in ort.bundle.min.mjs (Quellkarte)",
};

/**
 * Lizenzen, die mit der GPL 3.0 oder neuer der App zusammengehen. Die Schriften (OFL) und die
 * Zeichnungen der Porträts (CC BY 4.0) sind eigene Werke neben dem Code; die FSF nennt beide
 * Lizenzen frei, CC BY 4.0 auch ausdrücklich verträglich.
 */
const VERTRAEGLICH = new Set([
  "MIT",
  "ISC",
  "0BSD",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "Apache-2.0",
  "OFL-1.1",
  "GPL-3.0",
  "GPL-3.0-only",
  "GPL-3.0-or-later",
  "(MIT AND CC-BY-4.0)",
]);

/** Von Hand geprüfte Angaben, wo das Paket keinen SPDX-Namen nennt. */
const GEPRUEFTE_LIZENZ: Readonly<Record<string, string>> = {
  // LICENSE.txt im Paket ist die Apache License 2.0 (geprüft 1.11.2026).
  flatbuffers: "Apache-2.0",
};

/** Laufzeitpakete laut Sperrdatei (ohne Entwicklungspakete und reine Typen). */
function laufzeitpakete(): Set<string> {
  const namen = Object.entries(SPERRE.packages)
    .filter(([pfad, eintrag]) => pfad !== "" && eintrag.dev !== true)
    .map(([pfad]) => paketname(pfad));
  return new Set(namen.filter((name) => !nurTypen(name) && !(name in NICHT_AUSGELIEFERT)));
}

/** npm-Pakete, die der Service Worker einbindet (src/sw.ts und src/sw/), auch Entwicklungspakete. */
function paketeImServiceWorker(): Set<string> {
  const dateien = [
    "src/sw.ts",
    ...readdirSync(new URL("src/sw/", APP))
      .filter((datei) => datei.endsWith(".ts") && !datei.includes(".test."))
      .map((datei) => `src/sw/${datei}`),
  ];
  const namen = new Set<string>();
  for (const datei of dateien) {
    for (const treffer of lies(datei).matchAll(/from "([^".][^"]*)"/g)) {
      const pfad = treffer[1] ?? "";
      if (pfad.startsWith("virtual:")) continue;
      const teile = pfad.split("/");
      namen.add(pfad.startsWith("@") ? teile.slice(0, 2).join("/") : (teile[0] ?? pfad));
    }
  }
  return namen;
}

/** Pakete, die onnxruntime-web in seine gebündelte Fassung eingebaut hat (laut Quellkarte). */
function paketeInOrt(): Set<string> {
  const karte = JSON.parse(lies("node_modules/onnxruntime-web/dist/ort.bundle.min.mjs.map")) as {
    sources: string[];
  };
  const namen = new Set<string>();
  for (const quelle of karte.sources.filter((q) => q.includes("node_modules/"))) {
    const teile = paketname(quelle).split("/");
    namen.add(teile[0]?.startsWith("@") ? teile.slice(0, 2).join("/") : (teile[0] ?? quelle));
  }
  return namen;
}

/** Deckt ein Eintrag der Lizenzseite das Paket ab? */
function abgedeckt(name: string): boolean {
  return BAUSTEINE.some((baustein) =>
    (baustein.pakete ?? []).some((p) => p === name || (p.endsWith("/") && name.startsWith(p))),
  );
}

describe("Lizenzseite gegen die Auslieferung", () => {
  const ausgeliefert = new Set([...laufzeitpakete(), ...paketeImServiceWorker(), ...paketeInOrt()]);

  it("nennt jedes ausgelieferte npm-Paket", () => {
    const fehlend = [...ausgeliefert].filter((name) => !abgedeckt(name));
    expect(fehlend, "Eintrag in lizenzbausteine.ts und docs/LIZENZEN.md fehlt").toEqual([]);
    expect(ausgeliefert.has("react")).toBe(true);
    expect(ausgeliefert.has("workbox-precaching")).toBe(true);
    expect(ausgeliefert.has("protobufjs")).toBe(true);
  });

  it("liefert nur Pakete mit einer Lizenz aus, die zur GPL der App passt", () => {
    const fremd = [...laufzeitpakete()]
      .map((name) => {
        const eintrag = SPERRE.packages[`node_modules/${name}`];
        return [name, GEPRUEFTE_LIZENZ[name] ?? eintrag?.license ?? "?"] as const;
      })
      .filter(([, lizenz]) => !VERTRAEGLICH.has(lizenz));
    expect(fremd).toEqual([]);
  });

  it("verweist nur auf Lizenztexte, die es gibt", () => {
    for (const baustein of BAUSTEINE) {
      if (!baustein.text || TEXTE_AUS_DEM_BUILD.includes(baustein.text)) continue;
      expect(existsSync(new URL(`public${baustein.text}`, APP)), baustein.text).toBe(true);
    }
  });

  it("hat zu jedem Eintrag Name, Lizenz und Herkunft auf Deutsch und Englisch", () => {
    const texte = [de as Record<string, string>, en as Record<string, string>];
    for (const baustein of BAUSTEINE) {
      const vorsilbe = baustein.extra ? "extras.lizenz" : "lizenzen";
      for (const feld of ["name", "lizenz", "herkunft"]) {
        const schluessel = `${vorsilbe}.${baustein.kennung}.${feld}`;
        for (const sprache of texte) expect(sprache[schluessel], schluessel).toBeTruthy();
      }
    }
  });

  it("nennt die Versionen, die wirklich eingebaut sind", () => {
    const ort = version("onnxruntime-web");
    expect(de["lizenzen.onnxruntime.name"]).toContain(ort);
    expect(lies("public/lizenzen/onnxruntime-bausteine.txt")).toContain(`onnxruntime-web ${ort}`);
    expect(lies("public/lizenzen/mit-onnxruntime.txt")).toContain(ort);
    expect(de["lizenzen.stockfish.herkunft"]).toContain(`stockfish ${version("stockfish")}`);
    const werkzeuge = lies("public/lizenzen/mit-bauwerkzeuge.txt");
    for (const name of ["vite", "rolldown", "vite-plugin-pwa"]) {
      expect(werkzeuge, name).toContain(version(name));
    }
  });
});
