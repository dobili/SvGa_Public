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
import {
  ABENTEUER_VERSION,
  type Abenteuerstand,
  type Partiekarten,
  type Weltposition,
} from "../schnittstelle/spielstand";

/** Wo das Abenteuer beginnt: der Dachboden in Maple Falls, Blick nach oben (zum Brett). */
export const STARTPOSITION: Weltposition = {
  karte: "mapleFalls.dachboden",
  x: 2,
  y: 7,
  richtung: "oben",
};

/**
 * Ein neuer Spielstand beim ersten Start des Abenteuers.
 *
 * Eingaben: Zeitpunkt (für Tests fest), Name des Helden, Eingangswertung (Wertung der App oder
 * null, dann 0 bis zur ersten Partie) und ob sie schon fest ist (10 gewertete Partien in der App).
 * Beispiel: leererAbenteuerstand(jetzt, "Kim", 850, true) → Akt 1, Szene „akt1.start“, keine
 * Clubs, keine Karten, Position Dachboden.
 */
export function leererAbenteuerstand(
  jetzt: Date,
  heldname: string,
  wertung: number | null,
  wertungFest: boolean,
): Abenteuerstand {
  return {
    version: ABENTEUER_VERSION,
    begonnen: jetzt.toISOString(),
    eingangswertung: wertung ?? 0,
    eingangPartien: wertungFest ? EINGANG_PARTIEN : 0,
    held: { name: heldname, variante: 0 },
    handlung: { akt: 1, szene: "akt1.start", liga: null, durchlauf: 1 },
    position: STARTPOSITION,
    clubs: [],
    quests: [],
    figuren: [],
    karten: [],
    fragmente: { gefunden: [] },
    protokoll: [],
    laufendePartie: null,
    partiekarten: null,
    dialogvariablen: {},
    spielzeitSekunden: 0,
  };
}

/** Nach so vielen gewerteten Partien ist die Eingangswertung fest (Architektur, Abschnitt 4). */
export const EINGANG_PARTIEN = 10;

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
    held: { name: text(roh.held.name), variante: zahl(roh.held.variante) },
    handlung,
    position: position ?? STARTPOSITION,
    clubs: liste(roh.clubs),
    quests: liste(roh.quests),
    figuren: liste(roh.figuren),
    karten: liste(roh.karten),
    fragmente: { gefunden: liste(istObjekt(roh.fragmente) ? roh.fragmente.gefunden : []) },
    protokoll: liste(roh.protokoll),
    laufendePartie: typeof roh.laufendePartie === "string" ? roh.laufendePartie : null,
    partiekarten: partiekartenAus(roh.partiekarten),
    dialogvariablen: istObjekt(roh.dialogvariablen)
      ? (roh.dialogvariablen as Abenteuerstand["dialogvariablen"])
      : {},
    spielzeitSekunden: zahl(roh.spielzeitSekunden),
  };
}

/** Die Karten der laufenden Partie; null, wenn keine oder unlesbar. */
function partiekartenAus(roh: unknown): Partiekarten | null {
  if (!istObjekt(roh) || !Array.isArray(roh.deck)) return null;
  return {
    deck: roh.deck.filter((k): k is string => typeof k === "string"),
    gespielt: liste(roh.gespielt),
    wiedereinstieg: roh.wiedereinstieg === true,
    letzterHalbzug: typeof roh.letzterHalbzug === "number" ? roh.letzterHalbzug : null,
  };
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
