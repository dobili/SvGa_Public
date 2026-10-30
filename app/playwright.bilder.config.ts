/**
 * Einstellungen für den Bild-Erzeuger (`npm run bilder:werkzeuge`, Paket F der Ideensammlung):
 * dieselben wie für die Oberflächentests, aber nur Chromium in Handygröße und nur der Ordner
 * tests/bilder. Die normalen Prüfungen und GitHub Actions starten ihn nicht; er schreibt die Bilder
 * nach public/bilder/werkzeuge, die dann mit dem Stand committet werden.
 * Lokal wie die Oberflächentests: vorher `npm run build`, ein vorhandenes Chromium über
 * CHROMIUM_PFAD, eigener Port über PLAYWRIGHT_PORT.
 */
import { defineConfig } from "@playwright/test";
import grundlage from "./playwright.config";

export default defineConfig({
  ...grundlage,
  testDir: "tests/bilder",
  retries: 0,
  reporter: "list",
  projects: (grundlage.projects ?? []).filter((p) => p.name === "android-chromium"),
});
