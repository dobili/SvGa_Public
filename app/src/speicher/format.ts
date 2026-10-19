/**
 * Format der Nutzerdaten mit Versionsnummer, leere Daten und Umwandlung älterer Formate.
 *
 * Rolle im Gesamtbild: Vertrag des Moduls Speicher (Konzept 4.7 „Nutzerdaten“, 6.4, 9.4). Alles,
 * was der Leser selbst erarbeitet, steht in einem Objekt mit `schemaVersion`. Jede neue Version
 * der App wandelt ältere Formate um (Konzept 9.4); die Umwandlung ist rein und getestet
 * (Konzept 13: „Jedes frühere Format wird korrekt umgewandelt“).
 * Formate:
 * - Format 0: die Merker der Versionen 0.2.0 bis 0.2.20 im localStorage („svga.einstellungen“,
 *   „svga.lernstand“). Sie werden beim ersten Laden übernommen (merkerAlsFormat0, wandleUm).
 * - Format 1 (0.2.21 bis 0.2.25): Einstellungen, Lernstand, Fortschritt, letzte Sicherung.
 * - Format 2 (ab AP 11): dazu „spiel“ mit laufender Partie, beendeten Partien und Vorlieben
 *   (speicher/partien.ts).
 * - Format 3 (ab AP 13): dazu „karten“, die Wiederholungskarten (training/wiederholung.ts).
 * - Format 4 (ab 0.2.65): dazu „fehler“, die Fehlerdatenbank (training/fehlerdatenbank.ts).
 * - Format 5 (ab 0.2.93): dazu „sammlung“, die Lernsammlung aus Konzept 4.7
 *   (training/lernsammlung.ts). Eine ältere App lehnt Format 5 als „neuer“ ab, statt die
 *   Sammlung beim nächsten Speichern stillschweigend zu verlieren.
 * Abhängigkeiten: training/trainer (Kennungen der Trainer), training/wiederholung (Karten),
 * training/fehlerdatenbank (Fehler), training/lernsammlung (Sammlung), speicher/partien.ts.
 */
import {
  GENAUIGKEITSMODI,
  STANDARD_GENAUIGKEITSMODUS,
  type Genauigkeitsmodus,
} from "../spiel/staerkemodell";
import { fehlerAus, type Fehlereintrag } from "../training/fehlerdatenbank";
import { sammlungAus, type Sammeleintrag } from "../training/lernsammlung";
import { TRAINER, type TrainerKennung } from "../training/trainer";
import { kartenAus, type Karten } from "../training/wiederholung";
import { LEERER_SPIELSTAND, type Spielstand } from "./partien";
import { spielstandAus } from "./partienLesen";
import { planstandTextAus, rateverlaufAus, type Rateverlauf } from "./trainerverlauf";

/** Aktuelle Version des Formats. Jede Änderung am Aufbau erhöht sie und ergänzt wandleUm. */
export const SCHEMA_VERSION = 5;

/**
 * Die Bretter zur Wahl (seit 0.2.84 Auswahl des Autors vom 18.10.2026): acht Farben, das Holzbrett
 * und drei Materialbretter (ganze Brettbilder von Lichess). Werte und Herkunft in
 * pipeline/bretter/ (farben.json, LIZENZEN.md) und ui/brett/masse.ts.
 */
export const BRETTARTEN = [
  "buch",
  "gruen",
  "braun",
  "blau",
  "sand",
  "koralle",
  "lavendel",
  "nacht",
  "holz",
  "intarsie-ahorn",
  "holz-klassisch",
  "marmor-gruen",
] as const;
export type Brettfarben = (typeof BRETTARTEN)[number];
export type Strenge = "locker" | "streng";
/** „Erst selbst denken“ auch vor Werkzeugen und Engine an den Abbildungen (seit 0.2.90). */
export type VorWerkzeugen = "aus" | "an";
/**
 * Die Bildsätze der Figuren (seit 0.2.82, Auswahl des Autors vom 18.10.2026), je Gruppe drei:
 * Klassisch, Modern, Holz. Die Dateien liegen in public/figuren/<satz>/, Herkunft und Lizenz in
 * pipeline/figuren/saetze/LIZENZEN.md.
 */
export const BILDSAETZE = [
  "klassisch-cburnett",
  "klassisch-merida",
  "klassisch-chessnut",
  "modern-mpchess",
  "modern-celtic",
  "modern-spatial",
  "holz-kiefer-kirsche",
  "holz-eiche-mahagoni",
  "holz-esche-ebenholz",
] as const;
export type Bildsatz = (typeof BILDSAETZE)[number];
/** „buch“: Figuren wie in den Diagrammen des Buches; sonst ein Bildsatz. */
export type Figurensatz = "buch" | Bildsatz;
export type Ton = "aus" | "an";

export interface Einstellungen {
  readonly brettfarben: Brettfarben;
  /** „locker“: ein Tipp auf „Ich habe nachgedacht“ genügt; „streng“: echte Eingabe nötig. */
  readonly strenge: Strenge;
  /** Seit 0.2.33; ältere Stände ohne diesen Eintrag lesen sich als „buch“. */
  readonly figurensatz: Figurensatz;
  /** Seit 0.2.33; ältere Stände ohne diesen Eintrag lesen sich als „aus“. */
  readonly ton: Ton;
  /**
   * Seit 0.2.83: Genauigkeit wie Lichess, als Mittelweg oder nahe chess.com
   * (spiel/staerkemodell.ts); ältere Stände ohne diesen Eintrag lesen sich als „mittelweg“.
   */
  readonly genauigkeitsmodus: Genauigkeitsmodus;
  /**
   * Seit 0.2.90 (Wunsch des Autors, Pflichtenheft 4 und 5.1): An den Abbildungen erst selbst
   * einschätzen, dann Werkzeuge und Engine. Ältere Stände ohne diesen Eintrag lesen sich als „aus“.
   */
  readonly vorWerkzeugen: VorWerkzeugen;
}

export const STANDARD_EINSTELLUNGEN: Einstellungen = {
  brettfarben: "buch",
  strenge: "locker",
  figurensatz: "buch",
  ton: "aus",
  genauigkeitsmodus: STANDARD_GENAUIGKEITSMODUS,
  vorWerkzeugen: "aus",
};

/** Je Kapitelnummer die Positionen der abgehakten Lernziele (0 = erster Punkt der Buchliste). */
export type Lernstand = Readonly<Record<number, readonly number[]>>;

/** Stand einer Übung des Buches (Kennung wie im LaTeX, etwa „ueb:droh-ignorieren“). */
export interface Uebungsstand {
  readonly kapitel: number;
  readonly versuche: number;
  readonly geloest: boolean;
  /** Datum des letzten Versuchs, ISO 8601. */
  readonly zuletzt: string;
}

/** Stand eines Trainers: Durchgänge, gestellte und richtig gelöste Aufgaben. */
export interface Trainerstand {
  readonly durchgaenge: number;
  readonly aufgaben: number;
  readonly richtig: number;
  readonly zuletzt: string;
}

export interface Fortschritt {
  /** Abbildungsnummer („1.26“) → Datum des ersten Ansehens. */
  readonly gesehen: Readonly<Record<string, string>>;
  readonly uebungen: Readonly<Record<string, Uebungsstand>>;
  readonly trainer: Readonly<Partial<Record<TrainerKennung, Trainerstand>>>;
  /**
   * Seit 0.2.99: beantwortete Warum-Fragen je Abbildung („1.26“ → Stellen der Fragen, etwa [0]).
   * Zusätzliches Feld wie 0.2.90; ältere Daten ohne Feld bekommen ein leeres.
   */
  readonly warum: Readonly<Record<string, readonly number[]>>;
  /**
   * Seit 0.2.117 (NA1): richtig eingeschätzte Abbildungen („1.26“ → Datum). Dort zeigt „Erst
   * selbst denken“ die Werkzeuge gleich. Zusätzliches Feld wie „warum“; ältere Daten bekommen
   * ein leeres.
   */
  readonly eingeschaetzt: Readonly<Record<string, string>>;
}

export interface Nutzerdaten {
  readonly schemaVersion: typeof SCHEMA_VERSION;
  readonly angelegt: string;
  readonly einstellungen: Einstellungen;
  readonly lernstand: Lernstand;
  readonly fortschritt: Fortschritt;
  /** Datum der letzten Datensicherung (Export), für den sanften Hinweis alle vier Wochen. */
  readonly letzteSicherung: string | null;
  /** Partien gegen die Engine (ab Format 2). */
  readonly spiel: Spielstand;
  /** Wiederholungskarten aller Trainer und der Übungen (ab Format 3, Konzept 9.1). */
  readonly karten: Karten;
  /** Fehlerdatenbank des Lesers (ab Format 4, Kapitel 12). */
  readonly fehler: readonly Fehlereintrag[];
  /** Lernsammlung: eigene Stellungen mit Notiz und Plan (ab Format 5, Kapitel 12). */
  readonly sammlung: readonly Sammeleintrag[];
  /** Seit 0.2.90: Trefferzahlen bei „Zug erraten“ je Partie (speicher/trainerverlauf.ts). */
  readonly zugErraten: Rateverlauf;
  /** Seit 0.2.90: Stand des 30-Minuten-Plans als JSON, damit er in der Sicherung steckt. */
  readonly planstand: string | null;
}

/** Ergebnis einer Prüfung: umgewandelte Daten oder ein Grund für den Leser. */
export type Pruefergebnis =
  | { readonly ok: true; readonly daten: Nutzerdaten; readonly vonVersion: number }
  | { readonly ok: false; readonly grund: "kaputt" | "neuer"; readonly version?: number };

/**
 * Leere Nutzerdaten für den ersten Start.
 *
 * Eingabe: Zeitpunkt (für Tests fest). Ausgabe: aktuelles Format ohne Fortschritt und Partien,
 * Standardeinstellungen.
 */
export function leereDaten(jetzt: Date): Nutzerdaten {
  return {
    schemaVersion: SCHEMA_VERSION,
    angelegt: jetzt.toISOString(),
    einstellungen: STANDARD_EINSTELLUNGEN,
    lernstand: {},
    fortschritt: { gesehen: {}, uebungen: {}, trainer: {}, warum: {}, eingeschaetzt: {} },
    letzteSicherung: null,
    spiel: LEERER_SPIELSTAND,
    karten: {},
    fehler: [],
    sammlung: [],
    zugErraten: {},
    planstand: null,
  };
}

type Roh = Record<string, unknown>;

function istObjekt(wert: unknown): wert is Roh {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

function alsText(wert: unknown, ersatz: string): string {
  return typeof wert === "string" ? wert : ersatz;
}

function alsZahl(wert: unknown): number {
  return typeof wert === "number" && Number.isFinite(wert) && wert >= 0 ? Math.floor(wert) : 0;
}

/**
 * Einstellungen aus Rohdaten; Unbekanntes ergibt den Standard (Format 0 und 1 gleich). Figurensatz
 * und Ton kamen in 0.2.33 ohne neue Formatversion dazu: Fehlen sie, gilt der Standard.
 */

/**
 * Alte Namen der Figurensätze und ihr Nachfolger: „kontrastreich“ (bis 0.2.38) und „klassisch“
 * (bis 0.2.80) waren die Figuren von Colin Burnett; „holz“ (bis 0.2.80, umgefärbte Merida-Figuren)
 * wird der erste neue Holzsatz, damit der Leser weiter Holzfiguren sieht.
 */
const ALTE_SAETZE: ReadonlyMap<string, Bildsatz> = new Map([
  ["kontrastreich", "klassisch-cburnett"],
  ["klassisch", "klassisch-cburnett"],
  ["holz", "holz-kiefer-kirsche"],
]);

/** Der Figurensatz aus Rohdaten; alte Namen werden übernommen, Unbekanntes ist „buch“. */
function figurensatzAus(roh: unknown): Figurensatz {
  if (typeof roh !== "string") return "buch";
  const alt = ALTE_SAETZE.get(roh);
  if (alt) return alt;
  return BILDSAETZE.find((satz) => satz === roh) ?? "buch";
}
export function einstellungenAus(roh: unknown): Einstellungen {
  if (!istObjekt(roh)) return STANDARD_EINSTELLUNGEN;
  const farbe = roh.brettfarben;
  return {
    brettfarben: BRETTARTEN.find((art) => art === farbe) ?? STANDARD_EINSTELLUNGEN.brettfarben,
    strenge: roh.strenge === "streng" ? "streng" : "locker",
    figurensatz: figurensatzAus(roh.figurensatz),
    ton: roh.ton === "an" ? "an" : "aus",
    genauigkeitsmodus:
      GENAUIGKEITSMODI.find((m) => m === roh.genauigkeitsmodus) ?? STANDARD_GENAUIGKEITSMODUS,
    vorWerkzeugen: roh.vorWerkzeugen === "an" ? "an" : "aus",
  };
}

/** Lernstand aus Rohdaten: nur ganze Zahlen, sortiert, ohne Doppelte. */
export function lernstandAus(roh: unknown): Lernstand {
  if (!istObjekt(roh)) return {};
  const ergebnis: Record<number, number[]> = {};
  for (const [kapitel, punkte] of Object.entries(roh)) {
    if (!Number.isInteger(Number(kapitel)) || !Array.isArray(punkte)) continue;
    const ganze = punkte.filter((p): p is number => Number.isInteger(p) && p >= 0);
    ergebnis[Number(kapitel)] = [...new Set(ganze)].sort((a, b) => a - b);
  }
  return ergebnis;
}

function eintraege<T>(roh: unknown, lies: (wert: unknown) => T | null): Record<string, T> {
  if (!istObjekt(roh)) return {};
  const ergebnis: Record<string, T> = {};
  for (const [schluessel, wert] of Object.entries(roh)) {
    const gelesen = lies(wert);
    if (gelesen !== null) ergebnis[schluessel] = gelesen;
  }
  return ergebnis;
}

function uebungsstandAus(roh: unknown): Uebungsstand | null {
  if (!istObjekt(roh)) return null;
  return {
    kapitel: alsZahl(roh.kapitel),
    versuche: alsZahl(roh.versuche),
    geloest: roh.geloest === true,
    zuletzt: alsText(roh.zuletzt, ""),
  };
}

function trainerstandAus(roh: unknown): Trainerstand | null {
  if (!istObjekt(roh)) return null;
  return {
    durchgaenge: alsZahl(roh.durchgaenge),
    aufgaben: alsZahl(roh.aufgaben),
    richtig: alsZahl(roh.richtig),
    zuletzt: alsText(roh.zuletzt, ""),
  };
}

const KENNUNGEN = new Set<string>(TRAINER.map((trainer) => trainer.kennung));

function fortschrittAus(roh: unknown): Fortschritt {
  const teil = istObjekt(roh) ? roh : {};
  const trainer = eintraege(teil.trainer, trainerstandAus);
  return {
    gesehen: eintraege(teil.gesehen, (wert) => (typeof wert === "string" ? wert : null)),
    uebungen: eintraege(teil.uebungen, uebungsstandAus),
    // Unbekannte Trainer (aus einer späteren Version) fallen weg statt die Typen zu verletzen.
    trainer: Object.fromEntries(Object.entries(trainer).filter(([k]) => KENNUNGEN.has(k))),
    warum: eintraege(teil.warum, stellenAus),
    eingeschaetzt: eintraege(teil.eingeschaetzt, (wert) =>
      typeof wert === "string" ? wert : null,
    ),
  };
}

/** Stellen beantworteter Fragen: ganze Zahlen ab 0, jede einmal; sonst nichts. */
function stellenAus(roh: unknown): readonly number[] | null {
  if (!Array.isArray(roh)) return null;
  const stellen = roh.filter((s): s is number => Number.isInteger(s) && s >= 0);
  return stellen.length > 0 ? [...new Set(stellen)].sort((a, b) => a - b) : null;
}

/** Aktuelles Format aus Rohdaten, Feld für Feld geprüft; Fehlendes wird leer ergänzt. */
function aktuellesFormatAus(roh: Roh, jetzt: Date): Nutzerdaten {
  return {
    schemaVersion: SCHEMA_VERSION,
    angelegt: alsText(roh.angelegt, jetzt.toISOString()),
    einstellungen: einstellungenAus(roh.einstellungen),
    lernstand: lernstandAus(roh.lernstand),
    fortschritt: fortschrittAus(roh.fortschritt),
    letzteSicherung: typeof roh.letzteSicherung === "string" ? roh.letzteSicherung : null,
    spiel: spielstandAus(roh.spiel),
    karten: kartenAus(roh.karten),
    fehler: fehlerAus(roh.fehler),
    sammlung: sammlungAus(roh.sammlung),
    zugErraten: rateverlaufAus(roh.zugErraten),
    planstand: planstandTextAus(roh.planstand),
  };
}

/**
 * Die Merker aus Format 0 als Rohobjekt (ohne schemaVersion).
 *
 * Eingaben: die Texte der Merker „einstellungen“ und „lernstand“ (null, wenn nicht vorhanden).
 * Ausgabe: Rohobjekt für wandleUm, kaputtes JSON zählt als nicht vorhanden.
 * Beispiel: {"brettfarben":"holz"} und {"1":[0,2]} → Holzbrett, in Kapitel 1 zwei Haken.
 */
export function merkerAlsFormat0(einstellungen: string | null, lernstand: string | null): Roh {
  const lies = (text: string | null): unknown => {
    if (!text) return undefined;
    try {
      return JSON.parse(text);
    } catch (fehler) {
      console.warn("Merker aus Version 0.2 nicht lesbar, wird leer übernommen:", fehler);
      return undefined;
    }
  };
  return { einstellungen: lies(einstellungen), lernstand: lies(lernstand) };
}

/**
 * Prüft Rohdaten und wandelt sie in das aktuelle Format um.
 *
 * Warum: Gespeicherte Daten und eingespielte Sicherungen können aus älteren Versionen stammen
 * oder beschädigt sein; der Leser darf dabei nichts verlieren (Konzept 9.4).
 * Eingaben: Rohdaten (aus IndexedDB oder einer Sicherungsdatei), Zeitpunkt für Fehlendes.
 * Ausgabe: umgewandelte Daten mit der Ausgangsversion, oder der Grund der Ablehnung.
 * Beispiel: {einstellungen:{brettfarben:"holz"}} ohne schemaVersion (Format 0) → Format 2 mit
 * Holzbrett; Format 1 → ohne Partien; Format 2 → ohne Karten; Format 3 → ohne Fehler;
 * Format 4 → ohne Lernsammlung.
 * Sonderfälle: Eine höhere Version als SCHEMA_VERSION stammt aus einer neueren App und wird
 * abgelehnt („neuer“), damit nichts verloren geht; Nicht-Objekte sind „kaputt“.
 */
export function wandleUm(roh: unknown, jetzt: Date): Pruefergebnis {
  if (!istObjekt(roh)) return { ok: false, grund: "kaputt" };
  const version = roh.schemaVersion ?? 0;
  if (typeof version !== "number" || !Number.isInteger(version) || version < 0) {
    return { ok: false, grund: "kaputt" };
  }
  if (version > SCHEMA_VERSION) return { ok: false, grund: "neuer", version };
  // Jedes ältere Format ist eine Teilmenge des neueren: Format 0 (Merker) ohne Fortschritt und
  // Version, Format 1 ohne „spiel“, Format 2 ohne „karten“, Format 3 ohne „fehler“, Format 4 ohne
  // „sammlung“. Fehlende Teile ergänzt das Lesen leer.
  return { ok: true, daten: aktuellesFormatAus(roh, jetzt), vonVersion: version };
}
