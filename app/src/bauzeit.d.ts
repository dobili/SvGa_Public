/**
 * Konstanten, die Vite beim Bauen einsetzt (vite.config.ts, `define`).
 *
 * Rolle im Gesamtbild: `__VEROEFFENTLICHUNG__` ist true, wenn mit VEROEFFENTLICHUNG=1 gebaut wird
 * (Fassung für die Leser ab 1.0, AP 17). Dann fehlen die Aufgabenseite des Autors und die
 * englische Vorschau; als feste Zahl im Code entfernt der Bundler die Teile ganz.
 * Abhängigkeiten: keine.
 */
declare const __VEROEFFENTLICHUNG__: boolean;
