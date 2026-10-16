/**
 * Einstellungen für die Messläufe mit der echten Engine (Kalibrierung der Stufen, Konzept 8.2).
 *
 * Warum eigene Datei: Die Messungen spielen ganze Partien und dauern Minuten; sie gehören nicht
 * in „npm run pruefen“. Start über `npm run messen:stufen` (skripte/messe-stufen.mjs), das je
 * Paarung einen eigenen Lauf startet und die Ergebnisse zusammenfasst.
 */
import { defineConfig } from "vitest/config";

/** Eine Partie darf lange dauern; die Frist je Lauf setzt das Skript. */
const OHNE_FRIST = 0;

export default defineConfig({
  test: {
    include: ["src/**/*.messung.ts"],
    environment: "node",
    testTimeout: OHNE_FRIST,
    hookTimeout: OHNE_FRIST,
    fileParallelism: false,
  },
});
