/**
 * Spielstand des Abenteuers lesen und leer anlegen: das Feld `abenteuer` der Nutzerdaten
 * (Format 11, Entscheidung A3).
 *
 * Rolle im Gesamtbild: speicher/format.ts ruft `abenteuerstandAus` beim Lesen der Nutzerdaten
 * auf; alles Unlesbare wird null (kein Spielstand), damit ein kaputtes Spielfeld nie die übrigen
 * Daten des Lesers blockiert. Der Stand hat seine eigene Version (ABENTEUER_VERSION); steigt sie,
 * kommt hier die Umwandlung dazu, ohne dass die App ihr Format erhöht.
 * Im Prototyp (Schritt 5) werden die Felder nur grob geprüft (Typ und Version); die genaue
 * Prüfung je Feld kommt mit den Spielsystemen (Schritt 8).
 * Abhängigkeiten: schnittstelle/spielstand.ts (Typ).
 */
import type { Aufgabenauftrag, Aufgabenergebnis } from "../schnittstelle/aufgaben";
import {
  ABENTEUER_VERSION,
  type Abenteuerstand,
  type Ergebniskarte,
  type Partiekarten,
  type Heldfigur,
  type Weltposition,
} from "../schnittstelle/spielstand";
import { ERSATZFIGUR, heldfigurAus } from "./heldfigur";

/**
 * Wo das Abenteuer beginnt: vor dem Haus an der Birch Lane in Maple Falls, Blick zur Haustür.
 * Gleich dem Auslöser „start“ der Karte (Szene maple-falls-aussen.json); ein Test in
 * pipeline/tests/test_abenteuer_karten.py hält beide gleich, weil Umbauten der Karte die Stelle
 * sonst unbemerkt in ein Möbel legen können. Seit der Einleitung (Wunsch des Autors, 19.11.2026)
 * läuft hier von selbst die Einleitung (orte.json, Feld „eingang“), danach geht es mit Mama ins
 * Wohnzimmer und von dort auf den Dachboden; vorher begann das Spiel auf dem Dachboden auf (2, 9).
 */
export const STARTPOSITION: Weltposition = {
  karte: "mapleFalls.aussen",
  x: 3,
  y: 24,
  richtung: "unten",
};

/**
 * Ein neuer Spielstand beim ersten Start des Abenteuers.
 *
 * Eingaben: Zeitpunkt (für Tests fest), Name des Helden, Eingangswertung (Wertung der App oder
 * null, dann 0 bis zur ersten Partie), ob sie schon fest ist (10 gewertete Partien in der App)
 * und die gewählte Figur (Held oder Heldin, ohne Wahl der Held).
 * Beispiel: leererAbenteuerstand(jetzt, "Kim", 850, true) → Akt 1, Szene „akt1.start“, keine
 * Clubs, keine Karten, Position vor dem Haus.
 */
export function leererAbenteuerstand(
  jetzt: Date,
  heldname: string,
  wertung: number | null,
  wertungFest: boolean,
  figur: Heldfigur = ERSATZFIGUR,
): Abenteuerstand {
  return {
    version: ABENTEUER_VERSION,
    begonnen: jetzt.toISOString(),
    eingangswertung: wertung ?? A_START,
    eingangPartien: wertungFest ? EINGANG_PARTIEN : 0,
    wertung: wertung ?? A_START,
    appWertungZuletzt: wertung,
    wertungPartien: 0,
    laufendeWertung: null,
    held: { name: heldname, figur },
    handlung: { akt: 1, szene: "akt1.start", liga: null, durchlauf: 1 },
    position: STARTPOSITION,
    clubs: [],
    quests: [],
    figuren: [],
    karten: [],
    muenzen: 0,
    gegenstaende: [],
    funde: [],
    besuchteOrte: [],
    fragmente: { gefunden: [] },
    protokoll: [],
    laufendePartie: null,
    partiekarten: null,
    laufendeAufgaben: null,
    aufgabenergebnis: null,
    runden: [],
    dialogvariablen: {},
    spielzeitSekunden: 0,
    spielzeitJeOrt: {},
  };
}

/** Nach so vielen gewerteten Partien ist die Eingangswertung fest (Architektur, Abschnitt 4). */
export const EINGANG_PARTIEN = 10;
/** Startwert der Abenteuerwertung ohne Wertung der App (Regelwerk R2). */
export const A_START = 600;

type Roh = Record<string, unknown>;

function istObjekt(wert: unknown): wert is Roh {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

/**
 * Der Spielstand aus Rohdaten (IndexedDB oder Sicherung), oder null ohne Spielstand.
 *
 * Sonderfälle: Eine neuere Version als ABENTEUER_VERSION wird null (das Spiel sagt dann „Spielstand
 * aus einer neueren Version“, die übrigen Daten bleiben nutzbar); fehlende Listen werden leer.
 */
export function abenteuerstandAus(roh: unknown): Abenteuerstand | null {
  if (!istObjekt(roh) || roh.version !== ABENTEUER_VERSION) return null;
  if (typeof roh.begonnen !== "string" || !istObjekt(roh.held) || !istObjekt(roh.handlung)) {
    return null;
  }
  const position = istObjekt(roh.position) ? (roh.position as unknown as Weltposition) : null;
  const handlung = roh.handlung as unknown as Abenteuerstand["handlung"];
  return {
    version: ABENTEUER_VERSION,
    begonnen: roh.begonnen,
    eingangswertung: zahl(roh.eingangswertung),
    eingangPartien: zahl(roh.eingangPartien),
    wertung: zahl(roh.wertung) || zahl(roh.eingangswertung) || A_START,
    appWertungZuletzt: typeof roh.appWertungZuletzt === "number" ? roh.appWertungZuletzt : null,
    wertungPartien: zahl(roh.wertungPartien),
    laufendeWertung: laufendeWertungAus(roh.laufendeWertung),
    held: { name: text(roh.held.name), figur: heldfigurAus(roh.held.figur) },
    handlung,
    position: position ?? STARTPOSITION,
    ...listenAus(roh),
    laufendePartie: typeof roh.laufendePartie === "string" ? roh.laufendePartie : null,
    partiekarten: partiekartenAus(roh.partiekarten),
    ...aufgabenAus(roh),
    runden: liste(roh.runden),
    ...ergebniskarteAus(roh.ergebniskarte),
    ...(typeof roh.nachErgebnis === "string" ? { nachErgebnis: roh.nachErgebnis } : {}),
    ...(typeof roh.rueckmeldungOffen === "string"
      ? { rueckmeldungOffen: roh.rueckmeldungOffen }
      : {}),
    dialogvariablen: istObjekt(roh.dialogvariablen)
      ? (roh.dialogvariablen as Abenteuerstand["dialogvariablen"])
      : {},
    vorratGenutzt: liste<unknown>(roh.vorratGenutzt).filter(
      (k): k is string => typeof k === "string",
    ),
    spielzeitSekunden: zahl(roh.spielzeitSekunden),
    spielzeitJeOrt: istObjekt(roh.spielzeitJeOrt)
      ? (roh.spielzeitJeOrt as Readonly<Record<string, number>>)
      : {},
    ...(typeof roh.verfolgteQuest === "string" ? { verfolgteQuest: roh.verfolgteQuest } : {}),
    // Spieluhr (regeln/spieluhr.ts): ohne diese Zeile stand sie nach jedem Neuladen wieder auf 6 Uhr
    // (Befund der Verdeckungs- und Tierfotos, 23.11.2026).
    ...(typeof roh.spieluhr === "number" && Number.isFinite(roh.spieluhr)
      ? { spieluhr: roh.spieluhr }
      : {}),
    ...(typeof roh.zuletztGespielt === "string" ? { zuletztGespielt: roh.zuletztGespielt } : {}),
    // Wer den Helden schon angesprochen hat (regeln/ansprechen.ts); fehlt in älteren Ständen.
    ...(Array.isArray(roh.ansprachen)
      ? { ansprachen: roh.ansprachen.filter((k): k is string => typeof k === "string") }
      : {}),
  };
}

/** Die Wertung der laufenden Partie (R8, R9), oder null. */
function laufendeWertungAus(w: unknown): Abenteuerstand["laufendeWertung"] {
  if (!istObjekt(w)) return null;
  return {
    zielElo: zahl(w.zielElo),
    zaehlt: w.zaehlt === true,
    zustand: istObjekt(w.zustand)
      ? {
          gegner: text(w.zustand.gegner),
          grund: text(w.zustand.grund),
        }
      : null,
    ...(w.zeitwahl === true ? { zeitwahl: true } : {}),
    ...(typeof w.uhrAbzug === "number" ? { uhrAbzug: w.uhrAbzug } : {}),
  };
}

/** Felder des Spielstands, die listenAus füllt (Listen, Münzen, Fragmente). */
type Listenfelder = Pick<
  Abenteuerstand,
  | "clubs"
  | "quests"
  | "figuren"
  | "karten"
  | "muenzen"
  | "gegenstaende"
  | "besuchteOrte"
  | "funde"
  | "eintraege"
  | "fragmente"
  | "protokoll"
>;

/** Die Listen des Spielstands; fehlende werden leer, fremde Einträge fallen weg. */
function listenAus(roh: Roh): Listenfelder {
  return {
    clubs: liste(roh.clubs),
    quests: liste(roh.quests),
    figuren: liste(roh.figuren),
    karten: liste(roh.karten),
    muenzen: zahl(roh.muenzen),
    gegenstaende: liste<string>(roh.gegenstaende).filter((g) => typeof g === "string"),
    besuchteOrte: liste<string>(roh.besuchteOrte).filter((o) => typeof o === "string"),
    funde: liste<{ kennung: string; gefunden: string }>(roh.funde).filter(
      (f) => istObjekt(f) && typeof f.kennung === "string",
    ),
    eintraege: liste<{ name: string; geschrieben: string }>(roh.eintraege).filter(
      (e) => istObjekt(e) && typeof e.name === "string" && typeof e.geschrieben === "string",
    ),
    fragmente: { gefunden: liste(istObjekt(roh.fragmente) ? roh.fragmente.gefunden : []) },
    protokoll: liste(roh.protokoll),
  };
}

/** Laufende Aufgabenrunde, ihr Ergebnis und ihr Zwischenstand (R30 bis R32), grob geprüft. */
function aufgabenAus(
  roh: Roh,
): Pick<Abenteuerstand, "laufendeAufgaben" | "aufgabenergebnis" | "aufgabenzwischenstand"> {
  return {
    laufendeAufgaben: istObjekt(roh.laufendeAufgaben)
      ? (roh.laufendeAufgaben as unknown as Aufgabenauftrag)
      : null,
    aufgabenergebnis: istObjekt(roh.aufgabenergebnis)
      ? (roh.aufgabenergebnis as unknown as Aufgabenergebnis)
      : null,
    aufgabenzwischenstand:
      istObjekt(roh.aufgabenzwischenstand) &&
      typeof roh.aufgabenzwischenstand.kennung === "string" &&
      Array.isArray(roh.aufgabenzwischenstand.ergebnisse)
        ? (roh.aufgabenzwischenstand as unknown as Aufgabenergebnis)
        : null,
  };
}

/** Die offene Ergebniskarte (R6), grob geprüft; unlesbar → kein Feld. */
function ergebniskarteAus(roh: unknown): { ergebniskarte?: Ergebniskarte } {
  if (!istObjekt(roh)) return {};
  const passt =
    (roh.art === "partie" && istObjekt(roh.ergebnis)) ||
    (roh.art === "runde" && istObjekt(roh.auftrag) && typeof roh.punkte === "number");
  return passt ? { ergebniskarte: roh as unknown as Ergebniskarte } : {};
}

/** Die Karten der laufenden Partie; null, wenn keine oder unlesbar. */
function partiekartenAus(roh: unknown): Partiekarten | null {
  if (!istObjekt(roh) || !Array.isArray(roh.deck)) return null;
  return {
    deck: roh.deck.filter((k): k is string => typeof k === "string"),
    gespielt: liste(roh.gespielt),
    wiedereinstieg: roh.wiedereinstieg === true,
    letzterHalbzug: typeof roh.letzterHalbzug === "number" ? roh.letzterHalbzug : null,
    ...(typeof roh.gegner === "string" ? { gegner: roh.gegner } : {}),
    ...uhrAus(roh.uhr),
    ...(Array.isArray(roh.frei)
      ? { frei: roh.frei.filter((k): k is string => typeof k === "string") }
      : {}),
  };
}

/** Die Uhr der laufenden Partie, nur wenn lesbar (Sekunden und Zuschlag als Zahlen). */
function uhrAus(roh: unknown): Pick<Partiekarten, "uhr"> {
  if (!istObjekt(roh) || typeof roh.sekunden !== "number" || typeof roh.zuschlag !== "number")
    return {};
  return { uhr: { sekunden: roh.sekunden, zuschlag: roh.zuschlag } };
}

function zahl(wert: unknown): number {
  return typeof wert === "number" && Number.isFinite(wert) ? wert : 0;
}

function text(wert: unknown): string {
  return typeof wert === "string" ? wert : "";
}

/** Eine Liste aus Rohdaten; der Prototyp prüft die Einträge noch nicht einzeln. */
function liste<T>(wert: unknown): readonly T[] {
  return Array.isArray(wert) ? (wert as T[]) : [];
}
