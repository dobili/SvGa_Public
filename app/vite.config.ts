// Build-Einstellungen der App: React, Progressive Web App (Service Worker, Manifest) und Tests.
//
// Rolle im Gesamtbild: Vite baut aus src/ die ausgelieferte App in dist/. Das Plugin
// vite-plugin-pwa erzeugt den Service Worker aus src/sw.ts und trägt die Liste aller Dateien ein,
// die das Gerät für die Offline-Nutzung vorab lädt (Konzept Abschnitt 11).
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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

/** Farben aus dem Buch für Startbildschirm und Statusleiste (Konzept Abschnitt 10.3). */
const NAVY = "#16253D";
const CREME = "#F5F0E6";

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(paket.version),
  },
  build: {
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
    texteInHtml(),
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
        orientation: "portrait",
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
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "node",
  },
});
