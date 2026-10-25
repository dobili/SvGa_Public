// Build-Einstellungen der App: React, Progressive Web App (Service Worker, Manifest) und Tests.
//
// Rolle im Gesamtbild: Vite baut aus src/ die ausgelieferte App in dist/. Das Plugin
// vite-plugin-pwa erzeugt den Service Worker aus src/sw.ts und trägt die Liste aller Dateien ein,
// die das Gerät für die Offline-Nutzung vorab lädt (Konzept Abschnitt 11).
import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";
import {
  kapitelseite,
  uebersichtsseite,
  werkzeugkastenseite,
} from "./src/startseite/trainingsrahmen";
import type { Trainingsseite } from "./src/startseite/trainingsseiten";
import { eingebetteteSkripte, sicherheitsregel } from "./src/startseite/csp";

/** App-Version aus package.json, sichtbar in den Einstellungen (Konzept Abschnitt 14.1). */
const paket = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
  version: string;
};

/** Größte Einzeldatei, die vorab geladen wird: die Engine (WASM, etwa 1,8 MB) mit Reserve. */
const GROESSTE_DATEI_BYTES = 4 * 1024 * 1024;

/** Quelle der Trainingsseiten (pipeline/training.py, danach von Hand gepflegt). */
const TRAININGSQUELLE = new URL("../inhalte/de/training/", import.meta.url);
/** Hier legt der Build die erzeugten Trainingsseiten ab (in .gitignore). */
const TRAININGSZIEL = new URL("./training/", import.meta.url);

function schreibeSeite(pfad: string, html: string): void {
  const datei = new URL(pfad, TRAININGSZIEL);
  mkdirSync(new URL("./", datei), { recursive: true });
  writeFileSync(datei, html);
}

/**
 * Erzeugt die Seiten „Training zu diesem Kapitel“ (/training/kap00/ bis /training/kap12/), den
 * Werkzeugkasten und die Übersicht aus inhalte/de/training/*.json (Entscheidung des Autors,
 * 16.10.2026) und liefert ihre Einträge für die Seitenliste des Builds.
 */
function erzeugeTrainingsseiten(): Record<string, string> {
  const lies = (name: string) =>
    JSON.parse(readFileSync(new URL(name, TRAININGSQUELLE), "utf8")) as Trainingsseite;
  const kapitel = readdirSync(TRAININGSQUELLE)
    .filter((name) => /^kap\d{2}\.json$/.test(name))
    .sort()
    .map(lies);
  const seiten: Record<string, string> = {};
  kapitel.forEach((daten, i) => {
    const name = `kap${String(daten.kapitel).padStart(2, "0")}`;
    schreibeSeite(
      `${name}/index.html`,
      kapitelseite(daten, kapitel[i - 1] ?? null, kapitel[i + 1] ?? null),
    );
    seiten[`training-${name}`] = `training/${name}/index.html`;
  });
  schreibeSeite("werkzeugkasten/index.html", werkzeugkastenseite(lies("werkzeugkasten.json")));
  schreibeSeite("index.html", uebersichtsseite(kapitel));
  seiten["training-werkzeugkasten"] = "training/werkzeugkasten/index.html";
  seiten["training"] = "training/index.html";
  return seiten;
}

/**
 * Die Seiten der Website (Entscheidung 15.10.2026): die statische Startseite des Buches unter /,
 * der Installationsteil für den QR-Code, die App unter /app/, Impressum und Datenschutz; seit
 * 16.10.2026 die Trainingsseiten der Kapitel unter /training/.
 */
const SEITEN = {
  startseite: "index.html",
  installieren: "installieren/index.html",
  app: "app/index.html",
  impressum: "impressum/index.html",
  datenschutz: "datenschutz/index.html",
  // Seit R57 (24.10.2026) das Dashboard des Autors, hinter Cloudflare Access.
  admin: "admin/index.html",
  ...erzeugeTrainingsseiten(),
};

/** Ordner der Bausteine, die mehrere statische Seiten teilen (etwa der Installationsteil). */
const TEILE = new URL("./src/startseite/teile/", import.meta.url);

function maskiere(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Setzt in die statischen Seiten Bausteine und Texte ein.
 *
 * Warum: Regel 6 aus CLAUDE.md, alle Oberflächentexte stehen in src/i18n/de.json, auch die der
 * statischen Startseite. „<!-- teil: name -->“ wird durch src/startseite/teile/name.html ersetzt
 * (ohne dessen Kopfkommentar), danach jedes Doppelklammer-Feld mit Schlüssel durch den Text aus
 * de.json. Ein fehlender Schlüssel bricht den Build ab, damit kein Platzhalter online geht.
 */
function texteInHtml(): Plugin {
  const texte = JSON.parse(
    readFileSync(new URL("./src/i18n/de.json", import.meta.url), "utf8"),
  ) as Record<string, string>;
  return {
    name: "texte-in-html",
    transformIndexHtml(html) {
      const mitTeilen = html.replace(/<!-- teil: ([a-z]+) -->/g, (_ganz, name: string) =>
        readFileSync(new URL(`${name}.html`, TEILE), "utf8").replace(/^<!--[\s\S]*?-->\s*/, ""),
      );
      return mitTeilen.replace(/\{\{([\w.-]+)\}\}/g, (_ganz, schluessel: string) => {
        const text = texte[schluessel];
        if (text === undefined) throw new Error(`Text fehlt in de.json: ${schluessel}`);
        return maskiere(text);
      });
    },
  };
}

/**
 * Legt /version.json mit der App-Version in die Auslieferung (R57). Die Wartungsprüfung
 * (pipeline/wartung) vergleicht sie mit main, um zu sehen, ob Cloudflare den Stand ausliefert.
 */
function versionsdatei(): Plugin {
  return {
    name: "versionsdatei",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: JSON.stringify({ version: paket.version }),
      });
    },
  };
}

/** Alle HTML-Dateien unterhalb eines Ordners. */
function htmlDateien(ordner: string): string[] {
  return readdirSync(ordner, { withFileTypes: true }).flatMap((eintrag) => {
    const pfad = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) return htmlDateien(pfad);
    return eintrag.name.endsWith(".html") ? [pfad] : [];
  });
}

/**
 * T4 (Nutzungsprüfung 25.10.2026): Hängt an dist/_headers die Content Security Policy als
 * „Report-Only“ an, mit den Prüfsummen aller eingebetteten Skripte der gebauten Seiten. So
 * passt die Regel nach jedem Build zu den Seiten, ohne Prüfsummen von Hand zu pflegen.
 */
function sicherheitsregelDatei(): Plugin {
  let ausgabe = "dist";
  return {
    name: "sicherheitsregel",
    apply: "build",
    configResolved(konfiguration) {
      ausgabe = konfiguration.build.outDir;
    },
    closeBundle() {
      const summen = htmlDateien(ausgabe).flatMap((datei) =>
        eingebetteteSkripte(readFileSync(datei, "utf8")).map((skript) =>
          createHash("sha256").update(skript).digest("base64"),
        ),
      );
      appendFileSync(
        join(ausgabe, "_headers"),
        `# Content Security Policy, beim Bauen erzeugt (T4, vite.config.ts)\n/*\n  Content-Security-Policy-Report-Only: ${sicherheitsregel(summen)}\n`,
      );
    },
  };
}

/** Farben aus dem Buch für Startbildschirm und Statusleiste (Konzept Abschnitt 10.3). */
const NAVY = "#16253D";
const CREME = "#F5F0E6";

/**
 * Lässt die WebAssembly-Datei von onnxruntime-web aus dem Bündel (Maia, 0.2.141). Das Bündel der
 * Bibliothek verweist auf sie, die App übergibt sie aber selbst aus dem Maia-Paket
 * (engine/maia-web.ts, env.wasm.wasmBinary); eine zweite Kopie unter assets/ würde 11 MB zur
 * Installation legen, die niemand lädt.
 */
function ohneOrtWasm(): Plugin {
  return {
    name: "ohne-ort-wasm",
    apply: "build",
    generateBundle(_optionen, buendel) {
      for (const name of Object.keys(buendel)) {
        if (/ort-wasm-simd-threaded[^/]*\.wasm$/.test(name)) delete buendel[name];
      }
    },
  };
}

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(paket.version),
    // Fassung für die Leser (AP 17): ohne Aufgabenseite des Autors und ohne englische Vorschau.
    __VEROEFFENTLICHUNG__: JSON.stringify(process.env.VEROEFFENTLICHUNG === "1"),
  },
  build: {
    // Lizenztexte aller eingebauten npm-Pakete (MIT, ISC, GPL) in einer Datei, verlinkt unter
    // Einstellungen › Lizenzen: MIT und ISC verlangen, dass der Text mit ausgeliefert wird
    // (Prüfung der Lizenzseite, 19.10.2026). Als .txt, damit der Offline-Speicher sie vorhält.
    license: { fileName: "lizenzen/bausteine.txt" },
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(SEITEN).map(([name, pfad]) => [
          name,
          fileURLToPath(new URL(pfad, import.meta.url)),
        ]),
      ),
    },
  },
  plugins: [
    ohneOrtWasm(),
    texteInHtml(),
    versionsdatei(),
    sicherheitsregelDatei(),
    react(),
    VitePWA({
      // Eigener Service Worker (src/sw.ts), damit die Installationsseite den Ladefortschritt
      // abfragen kann und Updates erst nach Tippen aktiviert werden.
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "prompt",
      injectRegister: false,
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,json,wasm,webp,png,svg,woff2,txt}"],
        // Das Dashboard (R57) liegt hinter Cloudflare Access; auf Lesergeräten würde das
        // Vorabladen umgeleitet und die Installation scheitern.
        // Maia (0.2.141) ist ein Zusatzpaket von etwa 96 MB; der Leser lädt es nur auf Wunsch
        // (src/engine/maiapaket.ts), es gehört nicht zur Installation.
        globIgnores: ["admin/**", "maia/**"],
        maximumFileSizeToCacheInBytes: GROESSTE_DATEI_BYTES,
      },
      manifest: {
        id: "/",
        name: "Schach von Grund auf",
        short_name: "Schach",
        description: "Die App zum Buch „Schach von Grund auf“",
        lang: "de",
        // Die App liegt unter /app/; die Kennung bleibt „/“, damit bestehende Installationen
        // dieselbe App bleiben (Entscheidung 15.10.2026).
        start_url: "/app/",
        scope: "/",
        display: "standalone",
        // DS57 (0.2.131): Die App folgt der Drehung des Geräts. „portrait“ sperrte die
        // installierte Android-App im Hochformat, obwohl es seit DS2 ein Querformat gibt.
        orientation: "any",
        theme_color: NAVY,
        background_color: CREME,
        icons: [
          { src: "/symbole/symbol-192.png", sizes: "192x192", type: "image/png" },
          { src: "/symbole/symbol-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/symbole/symbol-maskierbar-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "worker/**/*.test.ts"],
    environment: "node",
  },
});
