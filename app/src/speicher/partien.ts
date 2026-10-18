/**
 * Partien gegen die Engine im Speicher: laufende Partie, beendete Partien, Vorlieben.
 *
 * Rolle im Gesamtbild: Teil der Nutzerdaten ab Format 2 (Konzept 4.7 „Partien“). Die laufende
 * Partie übersteht ein Neuladen und das Schließen der App; beendete Partien bleiben mit ihrer
 * Auswertung (Wert je Stellung) für den Rückblick und den PGN-Export, höchstens MAX_PARTIEN.
 * Die Vorlieben merken sich die letzte Wahl im Spielen-Bildschirm. Gespeicherte Partien werden
 * beim Laden Feld für Feld geprüft und Zug für Zug nachgespielt; was nicht passt, fällt weg.
 * Seit 0.2.41 liegt hier auch der Wertungsverlauf des Lesers (spiel/wertung.ts): Er wächst mit
 * jeder fertig ausgewerteten gewerteten Partie und überlebt das Wegfallen alter Partien.
 * Abhängigkeiten: spiel/partie.ts, spiel/uhr.ts, spiel/wertung.ts, engine/fehlerart.ts,
 * engine/stufen.ts.
 */
import type { Color } from "chessops/types";
import { BLINDE_FEHLERARTEN, type BlinderFleck } from "../engine/blindeFlecken";
import { FEHLERARTEN, type Fehlerart } from "../engine/fehlerart";
import type { EigenerGegner } from "../engine/gegner";
import { STIL_MAX, STIL_MIN } from "../engine/stil";
import { blindeFleckenAus, eigeneGegnerAus, fehlerartenAus } from "./gegner";
import type { Stufennummer } from "../engine/stufen";
import type { Phase } from "../schach/phase";
import type { Partieende } from "../spiel/ergebnis";
import {
  ladbar,
  stellungen,
  type Gegnerart,
  type Partie,
  type Partieeinstellung,
  type Partiezug,
  type Spielhilfen,
} from "../spiel/partie";
import { neueUhr, type Uhreinstellung, type Uhrstand } from "../spiel/uhr";
import {
  MAX_WERTUNGSPUNKTE,
  mitGewerteterPartie,
  OHNE_PHASEN,
  type Punktwert,
  type Wertungspunkt,
} from "../spiel/wertung";

/** So viele beendete Partien bleiben gespeichert; ältere fallen weg. */
export const MAX_PARTIEN = 50;

/** Eine beendete Partie mit ihrer Auswertung. */
export interface Partieeintrag {
  readonly partie: Partie;
  /** Wert je Stellung aus Sicht von Weiß in Bauerneinheiten; leer, solange nicht ausgewertet. */
  readonly werte: readonly number[];
  /** Bester Zug der Engine je Stellung (UCI, „“ in Endstellungen); leer wie „werte“. */
  readonly beste: readonly string[];
  /**
   * Abstand des besten zum zweitbesten Zug je Stellung in Bauerneinheiten (für das „!“ des
   * einzigen guten Zuges, seit 0.2.39); leer bei Auswertungen aus älteren Versionen.
   */
  readonly abstaende: readonly number[];
  /**
   * Hauptvariante der Engine je Stellung (UCI, bis sechs Halbzüge, beginnt mit dem besten Zug;
   * für „Danach etwa …“ in der Rückblickkarte, Empfehlung R5, 0.2.56); leer bei älteren
   * Auswertungen.
   */
  readonly varianten: readonly (readonly string[])[];
}

/** Letzte Wahl im Spielen-Bildschirm. */
export interface Spielvorlieben {
  /** Gegner, vorgefertigter Gegner, Spielhilfen und Wertung (0.2.41). */
  readonly gegner: Gegnerart;
  readonly bot: string | null;
  readonly hilfen: Spielhilfen;
  readonly gewertet: boolean;
  /** Stufe im Mittelspiel. */
  readonly stufe: Stufennummer;
  /** Stufe je Phase (0.2.40); `mittelspiel` ist gleich `stufe`. */
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
  readonly uhr: Uhreinstellung | null;
  readonly ruecknahmeErlaubt: boolean;
  /** Ruhige Ansicht: nur Brett, Zugnavigation und gespielte Züge (Wunsch des Autors). */
  readonly ruhigeAnsicht: boolean;
  /**
   * Abhakliste der Fehlerarten (0.2.60, Rest aus S7): welche absichtlichen Fehler die
   * Engine-Stufen 1 bis 4 und die vorgefertigten Gegner machen dürfen; Vorgabe alle.
   */
  readonly erlaubteFehlerarten: readonly Fehlerart[];
  /**
   * Blinde Flecken der eigenen Stufe (0.2.81, Wunsch des Autors): Zugarten, die die Engine ohne
   * vorgefertigten Gegner oft nicht sieht; Vorgabe keine. Fehlt die Angabe in älteren Daten,
   * gilt die Vorgabe.
   */
  readonly blindeFlecken: readonly BlinderFleck[];
}

export interface Spielstand {
  readonly laufend: Partie | null;
  /** Neueste zuerst. */
  readonly partien: readonly Partieeintrag[];
  readonly vorlieben: Spielvorlieben;
  /** Wertungsverlauf des Lesers, älteste zuerst (0.2.41). */
  readonly wertung: readonly Wertungspunkt[];
  /** Eigene Gegner des Lesers (0.2.42, speicher/gegner.ts). */
  readonly eigeneGegner: readonly EigenerGegner[];
}

export const STANDARD_VORLIEBEN: Spielvorlieben = {
  gegner: "engine",
  bot: null,
  hilfen: { symbole: true, werkzeuge: true },
  gewertet: true,
  stufe: 1,
  stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
  uhr: null,
  ruecknahmeErlaubt: true,
  ruhigeAnsicht: false,
  erlaubteFehlerarten: FEHLERARTEN,
  blindeFlecken: [],
};

export const LEERER_SPIELSTAND: Spielstand = {
  laufend: null,
  partien: [],
  vorlieben: STANDARD_VORLIEBEN,
  wertung: [],
  eigeneGegner: [],
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
  const partien = [{ partie, werte: [], beste: [], abstaende: [], varianten: [] }, ...andere].slice(
    0,
    MAX_PARTIEN,
  );
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

/**
 * Schreibt die Auswertung einer abgelegten Partie: Werte, beste Züge, Abstände und Hauptvarianten
 * je Stellung. Zählt die Partie für die Wertung, kommt zugleich ihr Wertungspunkt dazu
 * (spiel/wertung.ts).
 */
export function mitWerten(
  stand: Spielstand,
  id: string,
  werte: readonly number[],
  beste: readonly string[],
  abstaende: readonly number[] = [],
  varianten: readonly (readonly string[])[] = [],
): Spielstand {
  const partien = stand.partien.map((e) =>
    e.partie.id === id ? { ...e, werte, beste, abstaende, varianten } : e,
  );
  const eintrag = partien.find((e) => e.partie.id === id);
  const wertung = eintrag ? mitGewerteterPartie(stand.wertung, eintrag) : stand.wertung;
  return { ...stand, partien, wertung };
}

export function mitVorlieben(stand: Spielstand, vorlieben: Spielvorlieben): Spielstand {
  return { ...stand, vorlieben };
}

/** Schreibt die Liste der eigenen Gegner (speicher/gegner.ts rechnet sie aus). */
export function mitEigenenGegnern(
  stand: Spielstand,
  eigeneGegner: readonly EigenerGegner[],
): Spielstand {
  return { ...stand, eigeneGegner };
}

/**
 * Setzt die Wertung zurück (Wunsch des Autors, 17.10.2026): Der Verlauf wird leer, und alle bis
 * dahin gespielten Partien (auch die laufende) gelten dauerhaft als ungewertet, damit sie nicht
 * beim nächsten Speichern einer Auswertung wieder zählen.
 */
export function setzeWertungZurueck(stand: Spielstand): Spielstand {
  const ungewertet = (p: Partie): Partie => ({
    ...p,
    einstellung: { ...p.einstellung, gewertet: false },
  });
  return {
    ...stand,
    laufend: stand.laufend ? ungewertet(stand.laufend) : null,
    partien: stand.partien.map((e) => ({ ...e, partie: ungewertet(e.partie) })),
    wertung: [],
  };
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

/**
 * Ein Uhrstand aus Rohdaten. Eine Uhr, die beim Speichern lief, steht danach: Die App lief
 * inzwischen nicht (Neuladen, Schließen), und die Zeit dazwischen soll dem Leser nicht fehlen
 * (wie beim Wechsel in den Hintergrund). Beim Öffnen der Partie läuft sie weiter (spiel/ablauf.ts,
 * setzeUhrFort); die Restzeit bleibt, wie sie beim Speichern war.
 */
function uhrstandAus(roh: unknown): Uhrstand | null {
  if (!istObjekt(roh) || !istObjekt(roh.restMs) || !istZahl(roh.seitMs)) return null;
  const { white, black } = roh.restMs;
  if (!istZahl(white) || !istZahl(black)) return null;
  return { restMs: { white, black }, laeuft: null, seitMs: roh.seitMs };
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
  const fehler = auswahl([...FEHLERARTEN, ...BLINDE_FEHLERARTEN], roh.fehler) ?? null;
  const verlust = istZahl(roh.verlust) ? roh.verlust : 0;
  const stufe = auswahl(STUFENNUMMERN, roh.stufe);
  return stufe
    ? { san: roh.san, von, quelle, fehler, verlust, stufe }
    : { san: roh.san, von, quelle, fehler, verlust };
}

/** Stufen je Phase; ältere Stände (vor 0.2.40) ohne diese Angabe bekommen überall die Stufe. */
function stufenJePhaseAus(
  roh: unknown,
  stufe: Stufennummer,
): Readonly<Record<Phase, Stufennummer>> {
  const je = (name: Phase) => (istObjekt(roh) ? auswahl(STUFENNUMMERN, roh[name]) : null) ?? stufe;
  return { eroeffnung: je("eroeffnung"), mittelspiel: je("mittelspiel"), endspiel: je("endspiel") };
}

/** Spielhilfen; ohne Angabe (vor 0.2.41) beide an. */
function hilfenAus(roh: unknown): Spielhilfen {
  if (!istObjekt(roh)) return { symbole: true, werkzeuge: true };
  return { symbole: roh.symbole !== false, werkzeuge: roh.werkzeuge !== false };
}

function einstellungAus(roh: unknown): Partie["einstellung"] | null {
  if (!istObjekt(roh) || typeof roh.startFen !== "string" || !ladbar(roh.startFen)) return null;
  const eigeneFarbe = farbeAus(roh.eigeneFarbe);
  const stufe = auswahl(STUFENNUMMERN, roh.stufe);
  if (!eigeneFarbe || !stufe) return null;
  return {
    startFen: roh.startFen,
    eigeneFarbe,
    stufe,
    stufenJePhase: stufenJePhaseAus(roh.stufenJePhase, stufe),
    uhr: uhreinstellungAus(roh.uhr),
    ruecknahmeErlaubt: roh.ruecknahmeErlaubt !== false,
    abbildung: typeof roh.abbildung === "string" ? roh.abbildung : null,
    eroeffnung: typeof roh.eroeffnung === "string" ? roh.eroeffnung : null,
    gegner: roh.gegner === "mensch" ? "mensch" : "engine",
    bot: typeof roh.bot === "string" ? roh.bot : null,
    hilfen: hilfenAus(roh.hilfen),
    // Partien vor 0.2.41 zählen nicht für die Wertung.
    gewertet: roh.gewertet === true,
    ...gegnerprofilAus(roh),
  };
}

/** Name, Fehlerarten und Stil eines eigenen Gegners (0.2.42), nur wenn sie gespeichert sind. */
function gegnerprofilAus(
  roh: Roh,
): Pick<Partieeinstellung, "botName" | "fehlerarten" | "stil" | "blindeFlecken"> {
  // Nur gespeicherte Felder übernehmen, damit ältere Partien unverändert bleiben.
  const profil: {
    botName?: string;
    fehlerarten?: readonly Fehlerart[];
    stil?: number;
    blindeFlecken?: readonly BlinderFleck[];
  } = {};
  if (Array.isArray(roh.blindeFlecken)) profil.blindeFlecken = blindeFleckenAus(roh.blindeFlecken);
  if (typeof roh.botName === "string") profil.botName = roh.botName;
  if (Array.isArray(roh.fehlerarten)) {
    const roheArten: readonly unknown[] = roh.fehlerarten;
    profil.fehlerarten = FEHLERARTEN.filter((art) => roheArten.includes(art));
  }
  if (istZahl(roh.stil)) profil.stil = Math.max(STIL_MIN, Math.min(STIL_MAX, Math.round(roh.stil)));
  return profil;
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
  const stufe = auswahl(STUFENNUMMERN, roh.stufe) ?? STANDARD_VORLIEBEN.stufe;
  return {
    gegner: roh.gegner === "mensch" ? "mensch" : "engine",
    bot: typeof roh.bot === "string" ? roh.bot : null,
    hilfen: hilfenAus(roh.hilfen),
    gewertet: roh.gewertet !== false,
    stufe,
    stufenJePhase: stufenJePhaseAus(roh.stufenJePhase, stufe),
    uhr: uhreinstellungAus(roh.uhr),
    ruecknahmeErlaubt: roh.ruecknahmeErlaubt !== false,
    ruhigeAnsicht: roh.ruhigeAnsicht === true,
    erlaubteFehlerarten: fehlerartenAus(roh.erlaubteFehlerarten),
    blindeFlecken: blindeFleckenAus(roh.blindeFlecken),
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
    return { partie, werte: [], beste: [], abstaende: [], varianten: [] };
  }
  // Abstände gibt es erst seit 0.2.39; ohne sie bleibt die Auswertung gültig, nur ohne „!“.
  const abstaende =
    Array.isArray(roh.abstaende) && roh.abstaende.every(istZahl) ? roh.abstaende : [];
  // Hauptvarianten seit 0.2.56; ohne sie fehlt nur „Danach etwa …“ in der Rückblickkarte.
  const varianten = variantenAus(roh.varianten);
  return {
    partie,
    werte,
    beste,
    abstaende: abstaende.length === werte.length ? abstaende : [],
    varianten: varianten.length === werte.length ? varianten : [],
  };
}

/** Hauptvarianten aus Rohdaten: eine Liste von Zuglisten (UCI); sonst leer. */
function variantenAus(roh: unknown): string[][] {
  if (!Array.isArray(roh)) return [];
  const gueltig = roh.every(
    (v): v is string[] => Array.isArray(v) && v.every((z) => typeof z === "string"),
  );
  return gueltig ? roh : [];
}

const ERGEBNISSE: readonly Punktwert[] = [0, 0.5, 1];

/** Ein Wertungspunkt aus Rohdaten; null, wenn ein Feld fehlt oder nicht passt. */
function wertungspunktAus(roh: unknown): Wertungspunkt | null {
  if (!istObjekt(roh) || typeof roh.partieId !== "string" || typeof roh.zeit !== "string") {
    return null;
  }
  if (!istZahl(roh.gegner) || !istZahl(roh.wertung)) return null;
  const ergebnis = ERGEBNISSE.find((e) => e === roh.ergebnis);
  if (ergebnis === undefined) return null;
  const ph = istObjekt(roh.phasen) ? roh.phasen : {};
  const zahlOderNull = (w: unknown) => (istZahl(w) ? w : null);
  return {
    partieId: roh.partieId,
    zeit: roh.zeit,
    gegner: roh.gegner,
    ergebnis,
    wertung: roh.wertung,
    phasen: {
      eroeffnung: zahlOderNull(ph.eroeffnung) ?? OHNE_PHASEN.eroeffnung,
      mittelspiel: zahlOderNull(ph.mittelspiel) ?? OHNE_PHASEN.mittelspiel,
      endspiel: zahlOderNull(ph.endspiel) ?? OHNE_PHASEN.endspiel,
    },
  };
}

/** Der Spielstand aus Rohdaten; ohne Daten (Format 0 und 1) leer. */
export function spielstandAus(roh: unknown): Spielstand {
  if (!istObjekt(roh)) return LEERER_SPIELSTAND;
  const partien = Array.isArray(roh.partien) ? roh.partien.map(eintragAus) : [];
  const wertung = Array.isArray(roh.wertung) ? roh.wertung.map(wertungspunktAus) : [];
  return {
    laufend: partieAus(roh.laufend),
    partien: partien.filter((e): e is Partieeintrag => e !== null).slice(0, MAX_PARTIEN),
    vorlieben: vorliebenAus(roh.vorlieben),
    wertung: wertung.filter((w): w is Wertungspunkt => w !== null).slice(-MAX_WERTUNGSPUNKTE),
    eigeneGegner: eigeneGegnerAus(roh.eigeneGegner),
  };
}
