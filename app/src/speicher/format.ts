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
 *   (speicher/partien.ts). Karten, Fehlerdatenbank, Lernsammlung und „Zug erraten“ aus
 *   Konzept 4.7 kommen mit den Trainern (AP 13, AP 15) als Format 3 hinzu.
 * Abhängigkeiten: training/trainer (Kennungen der Trainer), speicher/partien.ts.
 */
import { TRAINER, type TrainerKennung } from "../training/trainer";
import { LEERER_SPIELSTAND, spielstandAus, type Spielstand } from "./partien";

/** Aktuelle Version des Formats. Jede Änderung am Aufbau erhöht sie und ergänzt wandleUm. */
export const SCHEMA_VERSION = 2;

export type Brettfarben = "buch" | "holz" | "gruen";
export type Strenge = "locker" | "streng";
/** „buch“: Figuren wie in den Diagrammen des Buches; „kontrastreich“: Figuren von Colin Burnett. */
export type Figurensatz = "buch" | "kontrastreich";
export type Ton = "aus" | "an";

export interface Einstellungen {
  readonly brettfarben: Brettfarben;
  /** „locker“: ein Tipp auf „Ich habe nachgedacht“ genügt; „streng“: echte Eingabe nötig. */
  readonly strenge: Strenge;
  /** Seit 0.2.33; ältere Stände ohne diesen Eintrag lesen sich als „buch“. */
  readonly figurensatz: Figurensatz;
  /** Seit 0.2.33; ältere Stände ohne diesen Eintrag lesen sich als „aus“. */
  readonly ton: Ton;
}

export const STANDARD_EINSTELLUNGEN: Einstellungen = {
  brettfarben: "buch",
  strenge: "locker",
  figurensatz: "buch",
  ton: "aus",
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
    fortschritt: { gesehen: {}, uebungen: {}, trainer: {} },
    letzteSicherung: null,
    spiel: LEERER_SPIELSTAND,
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
export function einstellungenAus(roh: unknown): Einstellungen {
  if (!istObjekt(roh)) return STANDARD_EINSTELLUNGEN;
  const farbe = roh.brettfarben;
  return {
    brettfarben:
      farbe === "buch" || farbe === "holz" || farbe === "gruen"
        ? farbe
        : STANDARD_EINSTELLUNGEN.brettfarben,
    strenge: roh.strenge === "streng" ? "streng" : "locker",
    figurensatz: roh.figurensatz === "kontrastreich" ? "kontrastreich" : "buch",
    ton: roh.ton === "an" ? "an" : "aus",
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
  };
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
 * Holzbrett; Format 1 → Format 2 ohne Partien.
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
  // Version, Format 1 ohne „spiel“. Fehlende Teile ergänzt das Lesen leer.
  return { ok: true, daten: aktuellesFormatAus(roh, jetzt), vonVersion: version };
}
