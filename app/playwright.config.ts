/**
 * Einstellungen für die Oberflächentests mit Playwright (Konzept 13).
 *
 * Geprüft wird die gebaute App (npm run build, dann vite preview) in Handygröße, mit Chromium
 * (wie Chrome auf Android) und WebKit (wie Safari auf dem iPhone). Lokal ohne WebKit:
 * PLAYWRIGHT_NUR_CHROMIUM=1; ein vorhandenes Chromium über CHROMIUM_PFAD. Laufen mehrere
 * Arbeitskopien zugleich, bekommt jede mit PLAYWRIGHT_PORT einen eigenen Vorschau-Server (sonst
 * prüft ein Lauf womöglich den Server einer anderen Kopie).
 */
import { defineConfig, devices } from "@playwright/test";

/** Standardport von vite preview. */
const STANDARDPORT = "4173";
const PORT = process.env.PLAYWRIGHT_PORT ?? STANDARDPORT;
const ADRESSE = `http://localhost:${PORT}`;
const chromiumPfad = process.env.CHROMIUM_PFAD;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: ADRESSE,
    serviceWorkers: "allow",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "android-chromium",
      use: {
        ...devices["Pixel 7"],
        launchOptions: chromiumPfad ? { executablePath: chromiumPfad } : {},
      },
    },
    ...(process.env.PLAYWRIGHT_NUR_CHROMIUM
      ? []
      : [{ name: "iphone-webkit", use: { ...devices["iPhone 15"] } }]),
  ],
  webServer: {
    command: `npm run vorschau -- --port ${PORT} --strictPort`,
    url: ADRESSE,
    reuseExistingServer: !process.env.CI,
  },
});
