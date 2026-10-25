/**
 * Partien und Spielstand aus Rohdaten lesen (Laden, Einspielen einer Sicherung).
 *
 * Rolle im Gesamtbild: Teil von speicher/partien.ts, seit 0.2.90 eigene Datei (Dateien unter 400
 * Zeilen, Konzept 12). Gespeicherte Partien werden Feld für Feld geprüft und Zug für Zug
 * nachgespielt; was nicht passt, fällt weg. Das Speicherformat ist unverändert.
 * Abhängigkeiten: speicher/partien.ts (Typen, Vorgaben), spiel/partie.ts, spiel/uhr.ts,
 * spiel/wertung.ts, engine/fehlerart.ts, engine/stufen.ts.
 */
import type { Color } from "chessops/types";
import { BLINDE_FEHLERARTEN, type BlinderFleck } from "../engine/blindeFlecken";
import { FEHLERARTEN, type Fehlerart } from "../engine/fehlerart";
import { STIL_MAX, STIL_MIN } from "../engine/stil";
import { besiegtAus } from "./besiegt";
import {
  blindeFleckenAus,
  eigeneGegnerAus,
  fehlerartenAus,
  reglerstufenAus,
  stilnameAus,
  stilmixAus,
} from "./gegner";
import { menschenwerteAus } from "./menschenwerte";
import type { Stufennummer } from "../engine/stufen";
import type { Phase } from "../schach/phase";
import type { Partieende } from "../spiel/ergebnis";
import {
  ladbar,
  stellungen,
  type Partie,
  type Partieeinstellung,
  type Partiezug,
  type Spielhilfen,
} from "../spiel/partie";
import { neueUhr, type Uhreinstellung, type Uhrstand } from "../spiel/uhr";
import {
  MAX_WERTUNGSPUNKTE,
  OHNE_PHASEN,
  type Punktwert,
  type Wertungspunkt,
} from "../spiel/wertung";
import { WERTUNGSTEMPI } from "../spiel/elomodell";

import {
  LEERER_SPIELSTAND,
  MAX_PARTIEN,
  STANDARD_VORLIEBEN,
  type Partieeintrag,
  type Spielstand,
  type Spielvorlieben,
} from "./partien";

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

const STUFENNUMMERN: readonly Stufennummer[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const QUELLEN: readonly Partiezug["quelle"][] = ["leser", "buch", "engine", "fehler"];
const ENDEN_MIT_SIEGER = ["matt", "aufgabe", "zeit"] as const;
const ENDEN_OHNE_SIEGER = [
  "patt",
  "fuenfzigZuege",
  "wiederholung",
  "material",
  "zeitRemis",
  "vereinbart",
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
export function uhrstandAus(roh: unknown): Uhrstand | null {
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
    // Seit 0.2.143: mit Maia nur, wenn so gespeichert (ältere Partien ohne).
    ...(roh.maia === true ? { maia: true } : {}),
    ...gegnerprofilAus(roh),
  };
}

/**
 * Name, Fehlerarten und Stil eines eigenen Gegners (0.2.42) und die Namen einer eingelesenen
 * Partie (0.2.117), nur wenn sie gespeichert sind.
 */
function gegnerprofilAus(
  roh: Roh,
): Pick<
  Partieeinstellung,
  | "botName"
  | "fehlerarten"
  | "stil"
  | "blindeFlecken"
  | "gewichte"
  | "haeufigkeit"
  | "hoechstverlust"
  | "importiert"
  | "stilname"
  | "stilmix"
> {
  // Nur gespeicherte Felder übernehmen, damit ältere Partien unverändert bleiben.
  const profil: {
    botName?: string;
    fehlerarten?: readonly Fehlerart[];
    stil?: number;
    blindeFlecken?: readonly BlinderFleck[];
    importiert?: { readonly weiss: string; readonly schwarz: string };
  } = {};
  if (Array.isArray(roh.blindeFlecken)) profil.blindeFlecken = blindeFleckenAus(roh.blindeFlecken);
  if (typeof roh.botName === "string") profil.botName = roh.botName;
  const imp = roh.importiert;
  if (istObjekt(imp) && typeof imp.weiss === "string" && typeof imp.schwarz === "string")
    profil.importiert = { weiss: imp.weiss, schwarz: imp.schwarz };
  if (Array.isArray(roh.fehlerarten)) profil.fehlerarten = fehlerartenAus(roh.fehlerarten);
  if (istZahl(roh.stil)) profil.stil = Math.max(STIL_MIN, Math.min(STIL_MAX, Math.round(roh.stil)));
  const stilname = stilnameAus(roh.stilname);
  const stilmix = stilmixAus(roh.stilmix);
  return {
    ...profil,
    ...menschenwerteAus(roh),
    ...(stilname ? { stilname } : {}),
    ...(stilmix ? { stilmix } : {}),
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
    ...feinheitenDerStufeAus(roh),
  };
}

/** Stil, Reglerstufen, Häufigkeit und Höchstverlust der eigenen Stufe (0.2.126), nur vorhandene. */
function feinheitenDerStufeAus(
  roh: Roh,
): Pick<
  Spielvorlieben,
  "stilname" | "stilmix" | "reglerstufen" | "haeufigkeit" | "hoechstverlust"
> {
  const stilname = stilnameAus(roh.stilname);
  const stilmix = stilmixAus(roh.stilmix);
  const reglerstufen = reglerstufenAus(roh.reglerstufen);
  const { haeufigkeit, hoechstverlust } = menschenwerteAus(roh);
  return {
    ...(stilname ? { stilname } : {}),
    ...(stilmix ? { stilmix } : {}),
    ...(reglerstufen ? { reglerstufen } : {}),
    ...(haeufigkeit !== undefined ? { haeufigkeit } : {}),
    ...(hoechstverlust ? { hoechstverlust } : {}),
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
  // Zeitklasse seit 0.2.125; ältere Punkte ohne Angabe zählen als Schnellschach (tempoDesPunkts).
  const tempo = WERTUNGSTEMPI.find((t) => t === roh.tempo);
  return {
    partieId: roh.partieId,
    zeit: roh.zeit,
    gegner: roh.gegner,
    ergebnis,
    wertung: roh.wertung,
    ...(tempo ? { tempo } : {}),
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
  const gueltige = partien.filter((e): e is Partieeintrag => e !== null).slice(0, MAX_PARTIEN);
  return {
    laufend: partieAus(roh.laufend),
    partien: gueltige,
    vorlieben: vorliebenAus(roh.vorlieben),
    wertung: wertung.filter((w): w is Wertungspunkt => w !== null).slice(-MAX_WERTUNGSPUNKTE),
    eigeneGegner: eigeneGegnerAus(roh.eigeneGegner),
    besiegt: besiegtAus(
      roh.besiegt,
      gueltige.map((e) => e.partie),
    ),
  };
}
