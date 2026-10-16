/**
 * App-Version und Datenstand für Einstellungen und „Fehler melden“ (Konzept 11.3 und 14.1).
 * Die Version kommt beim Build aus package.json (siehe vite.config.ts).
 * Abhängigkeiten: keine.
 */
declare const __APP_VERSION__: string;

/** Version der App, etwa „0.1.0“. */
export const APP_VERSION: string = __APP_VERSION__;
