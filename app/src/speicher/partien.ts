/**
 * Partien gegen die Engine im Speicher: laufende Partie, beendete Partien, Vorlieben.
 *
 * Rolle im Gesamtbild: Teil der Nutzerdaten ab Format 2 (Konzept 4.7 „Partien“). Die laufende
 * Partie übersteht ein Neuladen und das Schließen der App; beendete Partien bleiben mit ihrer
 * Auswertung (Wert je Stellung) für den Rückblick und den PGN-Export, höchstens MAX_PARTIEN.
 * Die Vorlieben merken sich die letzte Wahl im Spielen-Bildschirm. Gespeicherte Partien werden
 * beim Laden Feld für Feld geprüft und Zug für Zug nachgespielt; was nicht passt, fällt weg.
 * Abhängigkeiten: spiel/partie.ts, spiel/uhr.ts, engine/fehlerart.ts, engine/stufen.ts.
 */
import type { Color } from "chessops/types";
import type { Fehlerart } from "../engine/fehlerart";
import type { Stufennummer } from "../engine/stufen";
import type { Partieende } from "../spiel/ergebnis";
import { spielbar, stellungen, type Partie, type Partiezug } from "../spiel/partie";
import { neueUhr, type Uhreinstellung, type Uhrstand } from "../spiel/uhr";

/** So viele beendete Partien bleiben gespeichert; ältere fallen weg. */
export const MAX_PARTIEN = 50;

/** Eine beendete Partie mit ihrer Auswertung. */
export interface Partieeintrag {
  readonly partie: Partie;
  /** Wert je Stellung aus Sicht von Weiß in Bauerneinheiten; leer, solange nicht ausgewertet. */
  readonly werte: readonly number[];
  /** Bester Zug der Engine je Stellung (UCI, „“ in Endstellungen); leer wie „werte“. */
  readonly beste: readonly string[];
}

/** Letzte Wahl im Spielen-Bildschirm. */
export interface Spielvorlieben {
  readonly stufe: Stufennummer;
  readonly uhr: Uhreinstellung | null;
  readonly ruecknahmeErlaubt: boolean;
  /** Ruhige Ansicht: nur Brett, Zugnavigation und gespielte Züge (Wunsch des Autors). */
  readonly ruhigeAnsicht: boolean;
}

export interface Spielstand {
  readonly laufend: Partie | null;
  /** Neueste zuerst. */
  readonly partien: readonly Partieeintrag[];
  readonly vorlieben: Spielvorlieben;
}

export const STANDARD_VORLIEBEN: Spielvorlieben = {
  stufe: 1,
  uhr: null,
  ruecknahmeErlaubt: true,
  ruhigeAnsicht: false,
};

export const LEERER_SPIELSTAND: Spielstand = {
  laufend: null,
  partien: [],
  vorlieben: STANDARD_VORLIEBEN,
};

/** Die Partie mit dieser Kennung, laufend oder beendet; null, wenn es sie nicht (mehr) gibt. */
export function findePartie(stand: Spielstand, id: string): Partie | null {
  if (stand.laufend?.id === id) return stand.laufend;
  return stand.partien.find((e) => e.partie.id === id)?.partie ?? null;
}

/** Merkt die laufende Partie (null: keine mehr). */
export function mitLaufender(stand: Spielstand, partie: Partie | null): Spielstand {
  return { ...stand, laufend: partie };
}

/**
 * Legt eine beendete Partie ab: vorne in die Liste, die laufende Partie wird frei.
 *
 * Sonderfall: Liegt die Partie schon in der Liste (gleiche Kennung), wird sie ersetzt.
 */
export function legeAb(stand: Spielstand, partie: Partie): Spielstand {
  const andere = stand.partien.filter((e) => e.partie.id !== partie.id);
  const laufend = stand.laufend?.id === partie.id ? null : stand.laufend;
  const partien = [{ partie, werte: [], beste: [] }, ...andere].slice(0, MAX_PARTIEN);
  return { ...stand, laufend, partien };
}

/**
 * Schreibt den neuen Stand einer Partie: beendet → abgelegt, sonst die laufende Partie.
 *
 * Warum: Nach einer Rücknahme am Ende (etwa nach Matt) läuft die Partie wieder; sie verlässt
 * dann die Liste der beendeten Partien und ist wieder die laufende.
 */
export function mitPartie(stand: Spielstand, partie: Partie): Spielstand {
  if (partie.ende) return legeAb(stand, partie);
  const partien = stand.partien.filter((e) => e.partie.id !== partie.id);
  return { ...stand, laufend: partie, partien };
}

/** Schreibt die Auswertung einer abgelegten Partie: Werte und beste Züge je Stellung. */
export function mitWerten(
  stand: Spielstand,
  id: string,
  werte: readonly number[],
  beste: readonly string[],
): Spielstand {
  const partien = stand.partien.map((e) => (e.partie.id === id ? { ...e, werte, beste } : e));
  return { ...stand, partien };
}

export function mitVorlieben(stand: Spielstand, vorlieben: Spielvorlieben): Spielstand {
  return { ...stand, vorlieben };
}

// ---------------------------------------------------------------------------------------------
// Lesen aus Rohdaten (Laden, Einspielen einer Sicherung)
// ---------------------------------------------------------------------------------------------

type Roh = Record<string, unknown>;

function istObjekt(wert: unknown): wert is Roh {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

function istZahl(wert: unknown): wert is number {
  return typeof wert === "number" && Number.isFinite(wert);
}

function farbeAus(wert: unknown): Color | null {
  return wert === "white" || wert === "black" ? wert : null;
}

const STUFENNUMMERN: readonly Stufennummer[] = [1, 2, 3, 4, 5, 6, 7, 8];
const FEHLERARTEN: readonly Fehlerart[] = [
  "figurHaengen",
  "schlagreflex",
  "verfruehteDame",
  "koenigMitte",
  "taktikUebersehen",
  "drohungIgnoriert",
  "ungenau",
];
const QUELLEN: readonly Partiezug["quelle"][] = ["leser", "buch", "engine", "fehler"];
const ENDEN_MIT_SIEGER = ["matt", "aufgabe", "zeit"] as const;
const ENDEN_OHNE_SIEGER = [
  "patt",
  "fuenfzigZuege",
  "wiederholung",
  "material",
  "zeitRemis",
] as const;

function auswahl<T>(liste: readonly T[], wert: unknown): T | undefined {
  return liste.find((eintrag) => eintrag === wert);
}

function uhreinstellungAus(roh: unknown): Uhreinstellung | null {
  if (!istObjekt(roh) || !istZahl(roh.grundzeitMs) || !istZahl(roh.zuschlagMs)) return null;
  if (roh.grundzeitMs <= 0 || roh.zuschlagMs < 0) return null;
  return { grundzeitMs: roh.grundzeitMs, zuschlagMs: roh.zuschlagMs };
}

function uhrstandAus(roh: unknown): Uhrstand | null {
  if (!istObjekt(roh) || !istObjekt(roh.restMs) || !istZahl(roh.seitMs)) return null;
  const { white, black } = roh.restMs;
  if (!istZahl(white) || !istZahl(black)) return null;
  return { restMs: { white, black }, laeuft: farbeAus(roh.laeuft), seitMs: roh.seitMs };
}

function partieendeAus(roh: unknown): Partieende | null {
  if (!istObjekt(roh)) return null;
  const mitSieger = auswahl(ENDEN_MIT_SIEGER, roh.art);
  const sieger = farbeAus(roh.sieger);
  if (mitSieger && sieger) return { art: mitSieger, sieger };
  const ohneSieger = auswahl(ENDEN_OHNE_SIEGER, roh.art);
  return ohneSieger ? { art: ohneSieger } : null;
}

function partiezugAus(roh: unknown): Partiezug | null {
  if (!istObjekt(roh) || typeof roh.san !== "string") return null;
  const von = roh.von === "engine" ? "engine" : "leser";
  const quelle = auswahl(QUELLEN, roh.quelle) ?? von;
  const fehler = auswahl(FEHLERARTEN, roh.fehler) ?? null;
  const verlust = istZahl(roh.verlust) ? roh.verlust : 0;
  return { san: roh.san, von, quelle, fehler, verlust };
}

function einstellungAus(roh: unknown): Partie["einstellung"] | null {
  if (!istObjekt(roh) || typeof roh.startFen !== "string" || !spielbar(roh.startFen)) return null;
  const eigeneFarbe = farbeAus(roh.eigeneFarbe);
  const stufe = auswahl(STUFENNUMMERN, roh.stufe);
  if (!eigeneFarbe || !stufe) return null;
  return {
    startFen: roh.startFen,
    eigeneFarbe,
    stufe,
    uhr: uhreinstellungAus(roh.uhr),
    ruecknahmeErlaubt: roh.ruecknahmeErlaubt !== false,
    abbildung: typeof roh.abbildung === "string" ? roh.abbildung : null,
  };
}

/**
 * Eine Partie aus Rohdaten, oder null, wenn sie nicht zu retten ist.
 *
 * Sonderfall: Passt ein Zug nicht zur Stellung (beschädigte Daten), endet die Partie vor ihm.
 */
export function partieAus(roh: unknown): Partie | null {
  if (!istObjekt(roh) || typeof roh.id !== "string" || typeof roh.begonnen !== "string") {
    return null;
  }
  const einstellung = einstellungAus(roh.einstellung);
  if (!einstellung) return null;
  const roheZuege: readonly unknown[] = Array.isArray(roh.zuege) ? roh.zuege : [];
  const zuege: Partiezug[] = [];
  for (const rohzug of roheZuege) {
    const zug = partiezugAus(rohzug);
    if (!zug) break;
    zuege.push(zug);
  }
  const partie: Partie = {
    id: roh.id,
    begonnen: roh.begonnen,
    einstellung,
    zuege,
    ruecknahmen: istZahl(roh.ruecknahmen) ? Math.max(0, Math.floor(roh.ruecknahmen)) : 0,
    uhr: einstellung.uhr ? (uhrstandAus(roh.uhr) ?? neueUhr(einstellung.uhr)) : null,
    ende: partieendeAus(roh.ende),
  };
  const gespielt = stellungen(partie).length - 1;
  if (gespielt === roheZuege.length) return partie;
  return { ...partie, zuege: zuege.slice(0, gespielt), ende: null };
}

function vorliebenAus(roh: unknown): Spielvorlieben {
  if (!istObjekt(roh)) return STANDARD_VORLIEBEN;
  return {
    stufe: auswahl(STUFENNUMMERN, roh.stufe) ?? STANDARD_VORLIEBEN.stufe,
    uhr: uhreinstellungAus(roh.uhr),
    ruecknahmeErlaubt: roh.ruecknahmeErlaubt !== false,
    ruhigeAnsicht: roh.ruhigeAnsicht === true,
  };
}

function eintragAus(roh: unknown): Partieeintrag | null {
  const partie = istObjekt(roh) ? partieAus(roh.partie) : null;
  if (!istObjekt(roh) || !partie) return null;
  const werte = Array.isArray(roh.werte) && roh.werte.every(istZahl) ? roh.werte : [];
  const beste =
    Array.isArray(roh.beste) && roh.beste.every((z) => typeof z === "string") ? roh.beste : [];
  // Werte und Züge gehören zusammen; passen sie nicht, wird neu ausgewertet.
  if (werte.length !== partie.zuege.length + 1 || beste.length !== werte.length) {
    return { partie, werte: [], beste: [] };
  }
  return { partie, werte, beste };
}

/** Der Spielstand aus Rohdaten; ohne Daten (Format 0 und 1) leer. */
export function spielstandAus(roh: unknown): Spielstand {
  if (!istObjekt(roh)) return LEERER_SPIELSTAND;
  const partien = Array.isArray(roh.partien) ? roh.partien.map(eintragAus) : [];
  return {
    laufend: partieAus(roh.laufend),
    partien: partien.filter((e): e is Partieeintrag => e !== null).slice(0, MAX_PARTIEN),
    vorlieben: vorliebenAus(roh.vorlieben),
  };
}
