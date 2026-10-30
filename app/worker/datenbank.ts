/**
 * Tabellen des Dashboards in D1 und ihr Anlegen beim ersten Aufruf (R57).
 *
 * Rolle im Gesamtbild: Der Autor legt nur die leere Datenbank `svga-admin` an (PLAN_DASHBOARD.md);
 * die Tabellen legt der Worker selbst an, damit es keinen eigenen Einrichtungsschritt gibt.
 * „CREATE TABLE IF NOT EXISTS“ ist harmlos, wenn sie schon da sind; je laufender Instanz wird es
 * nur einmal ausgeführt.
 * Abhängigkeiten: worker/umgebung.ts.
 */
import type { D1Datenbank } from "./umgebung";

/**
 * meldungen: Fehler, Wünsche, Buchbefunde und Absturzberichte aus App und Website.
 * berichte: die Prüfberichte aus GitHub Actions (Ampel je Punkt als JSON).
 * wiki: die Seiten des Wikis (worker/wiki.ts), bei jedem Hochladen ganz ersetzt.
 * drossel: Zähler je Absender (nur ein Hash der IP-Adresse mit Tag) und Stunde gegen Flut.
 */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS meldungen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zeit TEXT NOT NULL,
    art TEXT NOT NULL,
    text TEXT NOT NULL,
    version TEXT,
    geraet TEXT,
    bildschirm TEXT,
    sprache TEXT,
    stellung TEXT,
    abbildung TEXT,
    seite TEXT,
    status TEXT NOT NULL DEFAULT 'neu',
    doppelt_von INTEGER,
    notiz TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS berichte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zeit TEXT NOT NULL,
    stand TEXT,
    lauf TEXT,
    rot INTEGER NOT NULL,
    gelb INTEGER NOT NULL,
    punkte TEXT NOT NULL
  )`,
  // Wiki des Dashboards (Paket D, 0.3.12): Seiten aus docs/, vom Lauf „Wartung“ geschickt.
  `CREATE TABLE IF NOT EXISTS wiki (
    pfad TEXT PRIMARY KEY,
    bereich TEXT NOT NULL,
    titel TEXT NOT NULL,
    inhalt TEXT NOT NULL,
    quelle TEXT NOT NULL,
    stand TEXT,
    zeit TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS drossel (
    schluessel TEXT NOT NULL,
    stunde TEXT NOT NULL,
    anzahl INTEGER NOT NULL,
    PRIMARY KEY (schluessel, stunde)
  )`,
];

let angelegt = false;

/** Legt fehlende Tabellen an (einmal je Instanz). */
export async function sorgeFuerTabellen(db: D1Datenbank): Promise<void> {
  if (angelegt) return;
  await db.batch(SCHEMA.map((sql) => db.prepare(sql)));
  angelegt = true;
}

/** Nur für Tests: vergisst, dass die Tabellen angelegt sind (neue Testdatenbank). */
export function vergissTabellen(): void {
  angelegt = false;
}
