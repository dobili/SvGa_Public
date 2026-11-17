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
 * wikiseiten: die Seiten der Wikis „app“ und „spiel“ (worker/wiki.ts), je Wiki beim Hochladen ganz
 * ersetzt. Die frühere Tabelle „wiki“ (nur das Wiki der App) übernimmt MIGRATION_WIKI.
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
  // Wikis des Dashboards (Paket D, 0.3.12; seit 17.11.2026 zwei Wikis: „app“ und „spiel“):
  // Seiten aus docs/, vom Lauf „Wartung“ geschickt; der Pfad ist je Wiki eindeutig.
  `CREATE TABLE IF NOT EXISTS wikiseiten (
    wiki TEXT NOT NULL,
    pfad TEXT NOT NULL,
    bereich TEXT NOT NULL,
    titel TEXT NOT NULL,
    inhalt TEXT NOT NULL,
    quelle TEXT NOT NULL,
    stand TEXT,
    zeit TEXT NOT NULL,
    PRIMARY KEY (wiki, pfad)
  )`,
  `CREATE TABLE IF NOT EXISTS drossel (
    schluessel TEXT NOT NULL,
    stunde TEXT NOT NULL,
    anzahl INTEGER NOT NULL,
    PRIMARY KEY (schluessel, stunde)
  )`,
];

/**
 * Migration der Tabelle „wiki“ (bis 17.11.2026, nur das Wiki der App, Pfad als Schlüssel) in
 * „wikiseiten“: alle Seiten als Wiki „app“ übernehmen, dann die alte Tabelle löschen. So bleiben
 * die App-Seiten erreichbar, bis der nächste Lauf „Wartung“ sie ohnehin neu schickt.
 */
const MIGRATION_WIKI = [
  `INSERT OR IGNORE INTO wikiseiten (wiki, pfad, bereich, titel, inhalt, quelle, stand, zeit)
    SELECT 'app', pfad, bereich, titel, inhalt, quelle, stand, zeit FROM wiki`,
  "DROP TABLE wiki",
];

let angelegt = false;

/** Gibt es die Tabelle? (sqlite_master; D1 ist SQLite.) */
async function gibtTabelle(db: D1Datenbank, name: string): Promise<boolean> {
  const zeile = await db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .bind(name)
    .first();
  return zeile !== null;
}

/** Legt fehlende Tabellen an und übernimmt die alte Wikitabelle (einmal je Instanz). */
export async function sorgeFuerTabellen(db: D1Datenbank): Promise<void> {
  if (angelegt) return;
  await db.batch(SCHEMA.map((sql) => db.prepare(sql)));
  if (await gibtTabelle(db, "wiki")) await db.batch(MIGRATION_WIKI.map((sql) => db.prepare(sql)));
  angelegt = true;
}

/** Nur für Tests: vergisst, dass die Tabellen angelegt sind (neue Testdatenbank). */
export function vergissTabellen(): void {
  angelegt = false;
}
