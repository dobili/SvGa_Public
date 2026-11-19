/**
 * Messung des Spieler-Durchlaufs: je Akt die Laufzeit der Figur, Dialogzeilen und Wörter, Partien
 * mit ihren Halbzügen, Aufgabenrunden und Ladezeiten; dazu die Funde (Stellen, an denen ein
 * Spieler nicht weiterkommt) und ein Protokoll. Alles liegt in einem Ordner außerhalb des
 * Repositorys (DURCHLAUF_ORDNER) und wird nach jedem Eintrag gesichert, damit ein Abbruch nichts
 * kostet und der nächste Lauf weiterzählt.
 *
 * Warum: Wunsch des Autors (18.11.2026): die Spielzeit je Akt für einen zügigen und einen
 * gründlichen Spieler schätzen. Gemessen wird, was der Durchlauf wirklich getan hat; die
 * Schätzung daraus (Lesezeit, Bedenkzeit) rechnet auswertung.ts.
 * Abhängigkeiten: Node (Dateien).
 * Beispiel: messung.zeile("Staub, Kisten, ein Brett.") zählt eine Zeile und vier Wörter im Akt.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Eine gespielte Partie. */
export interface Partiemessung {
  readonly kennung: string;
  readonly halbzuege: number;
  readonly eigeneZuege: number;
  readonly ende: string | null;
  readonly ausgang: "sieg" | "remis" | "niederlage" | "offen";
  readonly ms: number;
  readonly karte: string;
}

/** Eine gespielte Aufgabenrunde. */
export interface Rundenmessung {
  readonly kennung: string;
  readonly aufgaben: number;
  readonly richtig: number;
  readonly ms: number;
}

/** Die Zahlen eines Akts. */
export interface Aktmessung {
  laufMs: number;
  schritte: number;
  dialogzeilen: number;
  dialogwoerter: number;
  wahlen: number;
  meldungen: number;
  meldungswoerter: number;
  ladeMs: number;
  ladevorgaenge: number;
  kartenwechsel: number;
  echtMs: number;
  partien: Partiemessung[];
  runden: Rundenmessung[];
}

/** Ein Fund: Art, Beschreibung, wo und wann. */
export interface Fund {
  readonly art: string;
  readonly text: string;
  readonly karte: string;
  readonly akt: number;
  readonly zeit: string;
}

interface Abbild {
  akte: Record<string, Aktmessung>;
  funde: Fund[];
  abspann: boolean;
  laeufe: number;
}

const LEER: Aktmessung = {
  laufMs: 0,
  schritte: 0,
  dialogzeilen: 0,
  dialogwoerter: 0,
  wahlen: 0,
  meldungen: 0,
  meldungswoerter: 0,
  ladeMs: 0,
  ladevorgaenge: 0,
  kartenwechsel: 0,
  echtMs: 0,
  partien: [],
  runden: [],
};

/** Zahl der Wörter eines Textes (durch Leerraum getrennt). */
export function woerter(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Sammelt die Messwerte und sichert sie nach jeder Änderung. */
export class Messung {
  private readonly datei: string;
  private readonly protokolldatei: string;
  private daten: Abbild = { akte: {}, funde: [], abspann: false, laeufe: 0 };
  /** Akt und Karte, in denen gerade gezählt wird. */
  akt = 1;
  karte = "";
  private gemeldet = new Set<string>();

  constructor(readonly ordner: string) {
    mkdirSync(ordner, { recursive: true });
    this.datei = join(ordner, "messung.json");
    this.protokolldatei = join(ordner, "protokoll.log");
    if (existsSync(this.datei)) {
      this.daten = JSON.parse(readFileSync(this.datei, "utf8")) as Abbild;
    }
    this.daten.laeufe += 1;
    for (const f of this.daten.funde) this.gemeldet.add(`${f.art}|${f.text}`);
    this.sichere();
  }

  /** Die Zahlen des laufenden Akts (angelegt beim ersten Zugriff). */
  get jetzt(): Aktmessung {
    const k = String(this.akt);
    this.daten.akte[k] ??= { ...LEER, partien: [], runden: [] };
    return this.daten.akte[k];
  }

  /** Schreibt die Messung in die Datei. */
  sichere(): void {
    writeFileSync(this.datei, JSON.stringify(this.daten, null, 1));
  }

  /** Eine Zeile ins Protokoll (mit Uhrzeit, Akt und Karte). */
  log(text: string): void {
    const zeit = new Date().toISOString().slice(11, 19);
    appendFileSync(this.protokolldatei, `${zeit} A${this.akt} ${this.karte} | ${text}\n`);
  }

  /** Eine Dialogzeile wurde gelesen. */
  zeile(text: string): void {
    this.jetzt.dialogzeilen += 1;
    this.jetzt.dialogwoerter += woerter(text);
  }

  /** Eine Meldung, Ergebniskarte oder Erzählung außerhalb des Dialogs wurde gelesen. */
  meldung(text: string): void {
    this.jetzt.meldungen += 1;
    this.jetzt.meldungswoerter += woerter(text);
  }

  /** Ein Fund; derselbe Text wird nur einmal festgehalten. Ausgabe: ob er neu war. */
  fund(art: string, text: string): boolean {
    const schluessel = `${art}|${text}`;
    this.log(`FUND ${art}: ${text}`);
    if (this.gemeldet.has(schluessel)) return false;
    this.gemeldet.add(schluessel);
    this.daten.funde.push({
      art,
      text,
      karte: this.karte,
      akt: this.akt,
      zeit: new Date().toISOString(),
    });
    this.sichere();
    return true;
  }

  /** Der Abspann wurde erreicht. */
  meldeAbspann(): void {
    this.daten.abspann = true;
    this.sichere();
  }

  get abspann(): boolean {
    return this.daten.abspann;
  }

  /** Alle Messwerte (für die Auswertung). */
  get abbild(): Readonly<Abbild> {
    return this.daten;
  }
}
