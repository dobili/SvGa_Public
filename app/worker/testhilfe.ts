/**
 * Testersatz für Cloudflare D1 und die Umgebung des Workers (nur für Vitest).
 *
 * Rolle im Gesamtbild: D1 ist SQLite; node:sqlite (Node 22) spricht dieselbe Sprache. So prüfen
 * die Tests die echten SQL-Befehle des Workers, ohne Cloudflare.
 * Abhängigkeiten: node:sqlite, worker/umgebung.ts, worker/datenbank.ts.
 */
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { vergissTabellen } from "./datenbank";
import type { D1Abfrage, D1Datenbank, Umgebung } from "./umgebung";

class Abfrage implements D1Abfrage {
  private werte: SQLInputValue[] = [];
  constructor(
    private readonly db: DatabaseSync,
    private readonly sql: string,
  ) {}
  bind(...werte: (string | number | null)[]): D1Abfrage {
    this.werte = werte;
    return this;
  }
  async all<T>(): Promise<{ results: T[] }> {
    return { results: this.db.prepare(this.sql).all(...this.werte) as T[] };
  }
  async first<T>(): Promise<T | null> {
    return (this.db.prepare(this.sql).get(...this.werte) as T | undefined) ?? null;
  }
  async run(): Promise<unknown> {
    return this.db.prepare(this.sql).run(...this.werte);
  }
}

/** Eine frische Datenbank im Speicher mit der Schnittstelle von D1. */
export function testdatenbank(): D1Datenbank {
  vergissTabellen();
  const db = new DatabaseSync(":memory:");
  return {
    prepare: (sql) => new Abfrage(db, sql),
    batch: async (abfragen) => Promise.all(abfragen.map((a) => a.run())),
  };
}

/** Umgebung mit Testdatenbank und Dateien, die jede Anfrage mit „Datei“ beantworten. */
export function testumgebung(zusatz: Partial<Umgebung> = {}): Umgebung {
  return {
    ASSETS: { fetch: async () => new Response("Datei", { status: 200 }) },
    ADMIN_DB: testdatenbank(),
    ...zusatz,
  };
}

/** Sammelt die Aufgaben aus waitUntil, damit Tests sie abwarten können. */
export function testausfuehrung(): {
  waitUntil: (p: Promise<unknown>) => void;
  alle: () => Promise<unknown[]>;
} {
  const offen: Promise<unknown>[] = [];
  return { waitUntil: (p) => offen.push(p), alle: () => Promise.all(offen) };
}
