/**
 * Die Typen der Werkzeugwahl: was am Abbildung-Bildschirm gewählt sein kann (Zählen, Ziehen,
 * Engine oder ein Werkzeug des Buches).
 *
 * Rolle im Gesamtbild: Gemeinsame Typen für Werkzeugleiste.tsx, useWerkzeugwahl.ts und
 * werkzeugordnung.ts. Eigene Datei, damit diese drei Dateien sich nicht gegenseitig importieren:
 * Werkzeugleiste.tsx braucht die beiden anderen, die beiden anderen brauchen nur die Typen.
 * Werkzeugleiste.tsx gibt die Typen an Dateien weiter, die sie von dort importieren.
 * Abhängigkeiten: keine.
 */

/** Kennung eines angemeldeten Werkzeugs wie „k1-roentgen“ (analyse/register.ts). */
export type Werkzeugkennung = `k${number}-${string}`;
/** Was gewählt sein kann: Zählen, ein Werkzeug des Buches, Ziehen oder die Engine. */
export type Werkzeugwahl = "zaehlen" | "ziehen" | "engine" | Werkzeugkennung;
