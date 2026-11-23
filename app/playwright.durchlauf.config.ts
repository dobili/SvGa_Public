/**
 * Einstellungen für den Spieler-Durchlauf des Schach-Abenteuers (tests/durchlauf): ein eigener
 * Lauf außerhalb der gewöhnlichen Oberflächentests und außerhalb von CI.
 *
 * Warum: Der Durchlauf spielt das ganze Spiel mit den Eingaben eines Spielers und dauert Stunden;
 * er misst die Spielzeit je Akt (Wunsch des Autors, 18.11.2026). Er läuft in Etappen: Der
 * Browser behält sein Profil (DURCHLAUF_ORDNER/profil-<format>), der nächste Lauf spielt dort
 * weiter, wo der letzte aufgehört hat.
 * Aufruf (vorher `npm run build`):
 *   DURCHLAUF_ORDNER=/tmp/durchlauf DURCHLAUF_MINUTEN=60 CHROMIUM_PFAD=… \
 *     npx playwright test --config playwright.durchlauf.config.ts
 * Weitere Angaben: DURCHLAUF_FORMAT=hoch|quer (Vorgabe hoch), DURCHLAUF_EINGABE=kreuz|tasten
 * (Vorgabe kreuz), DURCHLAUF_BIS_AKT=N (hört auf, sobald Akt N beginnt).
 */
import { defineConfig } from "@playwright/test";

/** Eigener Port, damit der Lauf nicht den Vorschau-Server der Oberflächentests benutzt. */
const PORT = process.env.PLAYWRIGHT_PORT ?? "4183";
const ADRESSE = `http://localhost:${PORT}`;
/** Zuschlag auf die Spielzeit für Start und Abschluss (Minuten). */
const ZUSCHLAG_MINUTEN = 10;
const MS_JE_MINUTE = 60_000;
const minuten = Number(process.env.DURCHLAUF_MINUTEN ?? "30");

export default defineConfig({
  testDir: "tests/durchlauf",
  testMatch: [
    "durchlauf.spec.ts",
    "ansprechprobe.spec.ts",
    "neuladeprobe.spec.ts",
    "tierfoto.spec.ts",
    "figurenwahlprobe.spec.ts",
  ],
  timeout: (minuten + ZUSCHLAG_MINUTEN) * MS_JE_MINUTE,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { baseURL: ADRESSE },
  webServer: {
    command: `npm run vorschau -- --port ${PORT} --strictPort`,
    url: ADRESSE,
    reuseExistingServer: true,
  },
});
