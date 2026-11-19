/**
 * Kartenwissen des Spieler-Durchlaufs: Spieldaten und Tiled-Karten aus inhalte/abenteuer, die
 * Begehbarkeit je Karte und die Ausgänge zu anderen Karten.
 *
 * Warum: Der Durchlauf (durchlauf.spec.ts) drückt nur, was ein Mensch drücken kann. Um zu wissen,
 * wohin er laufen soll, liest er dieselben Daten, die ins Spielpaket gehen, und rechnet mit den
 * Regeln der App (oberwelt/begehbar.ts, mittenkacheln.ts, ausloeserebene.ts, kartenfassung.ts),
 * damit er dieselbe Karte sieht wie die gespielte.
 * Abhängigkeiten: inhalte/abenteuer (orte.json, quests.json, karten, moebel), Regeln der App.
 * Beispiel: kartenwissen(daten, "mapleFalls.dachboden", stand) → Luke „treppe“ auf ihrem Feld,
 * frei(x, y) ohne den Tisch und ohne Ambrose.
 */
import { readdirSync, readFileSync } from "node:fs";
import {
  liesAusloeser,
  mitDurchgang,
  type Ausloeser,
} from "../../src/abenteuer/oberwelt/ausloeserebene";
import {
  begehbar,
  laufwege,
  sperrkacheln,
  type Sperrangabe,
  type Tiledkarte,
} from "../../src/abenteuer/oberwelt/begehbar";
import { kartenfassung } from "../../src/abenteuer/oberwelt/kartenfassung";
import { freiMitMitte } from "../../src/abenteuer/oberwelt/mittenkacheln";
import { ohneAbwesende } from "../../src/abenteuer/regeln/abwesenheit";
import { erfuellt } from "../../src/abenteuer/regeln/bedingung";
import { variablenAusBesitz } from "../../src/abenteuer/regeln/dialogvariablen";
import { ohneFigurenNachBedingung } from "../../src/abenteuer/regeln/figurbedingung";
import type { Abenteuerstand } from "../../src/abenteuer/schnittstelle/spielstand";

/** Kantenlänge einer Kachel in Pixeln. */
export const KACHEL = 16;

const INHALTE = new URL("../../../inhalte/abenteuer/", import.meta.url);

/** Schon gelesene Dateien: Die Wegsuche über viele Karten läse sonst jede Karte immer wieder. */
const gelesen = new Map<string, unknown>();

/**
 * Liest eine JSON-Datei aus inhalte/abenteuer (einmal je Lauf; die Daten ändern sich nicht).
 * Warum gemerkt: Ohne das brauchte ein einziger Schritt zu einem fernen Ziel Minuten (jede
 * Wegsuche las über hundert Karten neu, Befund vom 18.11.2026).
 */
export function lies<T>(pfad: string): T {
  if (!gelesen.has(pfad)) {
    gelesen.set(pfad, JSON.parse(readFileSync(new URL(pfad, INHALTE), "utf8")));
  }
  return gelesen.get(pfad) as T;
}

/** Ein Auslöser aus orte.json. */
export interface Ausloeserregel {
  readonly name: string;
  readonly art: "start" | "uebergang" | "gegenstand" | "dialog";
  readonly karte?: string;
  readonly dialog?: string;
  readonly wenn?: string;
  readonly ziel?: { readonly karte: string; readonly ausloeser: string };
}

/** Eine Figur aus orte.json. */
export interface Figurregel {
  readonly kennung: string;
  readonly dialog: string;
  readonly wenn?: string;
  readonly gegner?: string;
}

/** Eine Karte eines Ortes aus orte.json. */
export interface Karteneintrag {
  readonly kennung: string;
  readonly datei: string;
  readonly innen: boolean;
  readonly zustaende?: Readonly<Record<string, string>>;
}

/** Ein Ort aus orte.json, so weit der Durchlauf ihn braucht. */
export interface Ort {
  readonly kennung: string;
  readonly name: string;
  readonly art?: string;
  readonly karten: readonly Karteneintrag[];
  readonly figuren: readonly Figurregel[];
  readonly ausloeser: readonly Ausloeserregel[];
}

/** Ein Questschritt und eine Quest aus quests.json. */
export interface Questschritt {
  readonly text: string;
  readonly ereignis: {
    readonly art: "dialog" | "aufgaben" | "partie" | "ort";
    readonly knoten?: string;
    readonly runde?: string;
    readonly begegnung?: string;
    readonly karte?: string;
    readonly ausloeser?: string;
  };
  readonly ziel?: { readonly karte?: string; readonly objekt?: string; readonly ort?: string };
}
export interface Quest {
  readonly kennung: string;
  readonly ort: string;
  readonly haupt?: boolean;
  readonly start: Questschritt["ereignis"];
  readonly schritte: readonly Questschritt[];
}

/** Alle Spieldaten des Durchlaufs. */
export interface Spieldaten {
  readonly orte: readonly Ort[];
  readonly quests: readonly Quest[];
  readonly runden: readonly { readonly kennung: string; readonly steller: string }[];
  readonly begegnungen: readonly { readonly kennung: string; readonly gegner: string }[];
  readonly moebel: Readonly<Record<string, Sperrangabe>>;
  readonly texte: Readonly<Record<string, string>>;
}

/** Lädt Orte, Quests, Runden, Begegnungen, Möbelliste und die deutschen Spieltexte. */
export function ladeSpieldaten(): Spieldaten {
  const moebel: Record<string, Sperrangabe> = {};
  for (const datei of readdirSync(new URL("moebel/", INHALTE))) {
    if (!datei.endsWith(".json")) continue;
    Object.assign(moebel, lies<{ moebel: Record<string, Sperrangabe> }>(`moebel/${datei}`).moebel);
  }
  return {
    orte: lies<{ orte: Ort[] }>("orte.json").orte,
    quests: lies<{ quests: Quest[] }>("quests.json").quests,
    runden: lies<{ runden: Spieldaten["runden"] }>("runden.json").runden,
    begegnungen: lies<{ begegnungen: Spieldaten["begegnungen"] }>("begegnungen.json").begegnungen,
    moebel,
    texte: lies<Record<string, string>>("texte/de.json"),
  };
}

/** Ort und Karteneintrag zu einer Kartenkennung, oder null. */
export function findeKarte(
  daten: Spieldaten,
  kennung: string,
): { readonly ort: Ort; readonly karte: Karteneintrag } | null {
  for (const ort of daten.orte) {
    const karte = ort.karten.find((k) => k.kennung === kennung);
    if (karte) return { ort, karte };
  }
  return null;
}

/** Der Eintrag aus orte.json zu einem Auslöser (mit Karte geht vor dem des Ortes, wie in der App). */
export function regelFuer(ort: Ort, karte: string, name: string): Ausloeserregel | undefined {
  const passende = ort.ausloeser.filter((a) => a.name === name);
  return passende.find((a) => a.karte === karte) ?? passende.find((a) => !a.karte);
}

/** Die Figur eines Ortes zu einem Objektnamen der Karte. */
export function figurFuer(ort: Ort, name: string): Figurregel | undefined {
  return ort.figuren.find((f) => f.kennung === `${ort.kennung}.${name}` || f.kennung === name);
}

/** Die Variablen, mit denen die App Fassungen und Bedingungen rechnet (Dialogvariablen und Besitz). */
export function variablenVon(stand: Abenteuerstand): Readonly<Record<string, unknown>> {
  return { ...stand.dialogvariablen, ...variablenAusBesitz(stand) };
}

/** Ein ansprechbares Ding der Karte: Figur oder Auslöser mit seiner Regel. */
export interface Ding {
  readonly name: string;
  readonly typ: "figur" | "ausloeser";
  readonly felder: readonly { readonly x: number; readonly y: number }[];
  readonly regel: Ausloeserregel | null;
  readonly figur: Figurregel | null;
}

/** Was der Durchlauf von der Karte weiß, auf der der Held steht. */
export interface Kartenwissen {
  readonly kennung: string;
  readonly ort: Ort;
  readonly innen: boolean;
  readonly datei: string;
  readonly breite: number;
  readonly hoehe: number;
  /** Frei für den Helden (mit Figuren und festen Statisten als Sperre). */
  readonly frei: (x: number, y: number) => boolean;
  /** Ganz frei: ohne die Kacheln, auf denen nur die Mitte des Helden Platz hat (Kollision fein). */
  readonly freiStreng: (x: number, y: number) => boolean;
  /** Felder von Übergängen („x,y“): Wer dort in den Durchgang drückt, wechselt die Karte. */
  readonly uebergangsfelder: ReadonlySet<string>;
  /** Felder, auf denen wandernde Statisten und Tiere stehen können. */
  readonly belebt: ReadonlySet<string>;
  readonly ausloeser: readonly Ausloeser[];
  readonly dinge: readonly Ding[];
}

/**
 * Das Kartenwissen zur Karte `kennung` für diesen Spielstand: Fassung nach den Zuständen, ohne
 * Figuren, deren Bedingung nicht gilt, mit Durchgängen wie in der Szene.
 * Wirft, wenn die Karte in orte.json fehlt.
 */
export function kartenwissen(
  daten: Spieldaten,
  kennung: string,
  stand: Abenteuerstand,
): Kartenwissen {
  const fund = findeKarte(daten, kennung);
  if (!fund) throw new Error(`Karte ${kennung} fehlt in orte.json`);
  const variablen = variablenVon(stand);
  const datei = kartenfassung(fund.karte, variablen).datei;
  const karte = ohneFigurenNachBedingung(
    ohneAbwesende(lies<Tiledkarte>(datei), stand.dialogvariablen),
    (name) => figurFuer(fund.ort, name)?.wenn,
    variablen,
  );
  const roh = liesAusloeser(
    karte.layers.flatMap((e) => e.objects ?? []),
    KACHEL,
  );
  const statisch = begehbar(karte, sperrkacheln(karte, daten.moebel, KACHEL, false));
  const namen = [...new Set(roh.map((a) => a.name))];
  const uebergaenge = namen.filter((n) => regelFuer(fund.ort, kennung, n)?.art === "uebergang");
  const ausloeser = mitDurchgang(roh, statisch, uebergaenge);
  const gesperrt = sperrkacheln(karte, daten.moebel, KACHEL);
  const frei = freiMitMitte(karte, daten.moebel, KACHEL, gesperrt);
  const belebt = new Set(
    laufwege(karte, KACHEL).flatMap((w) => w.felder.map((f) => `${f.x},${f.y}`)),
  );
  const dinge = namen.map((name): Ding => {
    const felder = ausloeser.filter((a) => a.name === name);
    const typ = felder[0]?.typ === "figur" ? "figur" : "ausloeser";
    return {
      name,
      typ,
      felder: felder.map((a) => ({ x: a.x, y: a.y })),
      regel: typ === "ausloeser" ? (regelFuer(fund.ort, kennung, name) ?? null) : null,
      figur: typ === "figur" ? (figurFuer(fund.ort, name) ?? null) : null,
    };
  });
  return {
    kennung,
    ort: fund.ort,
    innen: fund.karte.innen,
    datei,
    breite: karte.width,
    hoehe: karte.height,
    frei,
    freiStreng: (x, y) => frei(x, y) && !gesperrt.has(`${x},${y}`),
    uebergangsfelder: new Set(
      ausloeser.filter((a) => uebergaenge.includes(a.name)).map((a) => `${a.x},${a.y}`),
    ),
    belebt,
    ausloeser,
    dinge,
  };
}

/** Ein Ausgang einer Karte: Name des Übergangs, Zielkarte und Bedingung. */
export interface Ausgang {
  readonly von: string;
  readonly name: string;
  readonly nach: string;
  readonly wenn?: string;
  readonly dialog?: string;
}

/**
 * Alle Ausgänge einer Karte (Übergänge mit Ziel auf einer anderen Karte), aus allen Fassungen.
 * Beispiel: Dachboden → [{ name: "treppe", nach: "mapleFalls.zimmer" }].
 */
export function ausgaengeVon(daten: Spieldaten, kennung: string): Ausgang[] {
  const bekannt = ausgangsmerker.get(kennung);
  if (bekannt) return bekannt;
  const liste = berechneAusgaenge(daten, kennung);
  ausgangsmerker.set(kennung, liste);
  return liste;
}

/** Gemerkte Ausgänge je Karte (sie hängen nur von den Daten ab). */
const ausgangsmerker = new Map<string, Ausgang[]>();

function berechneAusgaenge(daten: Spieldaten, kennung: string): Ausgang[] {
  const fund = findeKarte(daten, kennung);
  if (!fund) return [];
  const dateien = [fund.karte.datei, ...Object.values(fund.karte.zustaende ?? {})];
  const namen = new Set(
    dateien.flatMap((d) =>
      lies<Tiledkarte>(d).layers.flatMap((e) => (e.objects ?? []).map((o) => o.name ?? "")),
    ),
  );
  const ausgaenge: Ausgang[] = [];
  for (const name of namen) {
    const r = regelFuer(fund.ort, kennung, name);
    if (r?.art !== "uebergang" || !r.ziel || r.ziel.karte === kennung) continue;
    ausgaenge.push({
      von: kennung,
      name,
      nach: r.ziel.karte,
      ...(r.wenn ? { wenn: r.wenn } : {}),
      ...(r.dialog ? { dialog: r.dialog } : {}),
    });
  }
  return ausgaenge;
}

/**
 * Der kürzeste Weg über Karten von `start` nach `ziel` als Liste der Ausgänge. `gesperrt` nennt
 * Ausgänge („karte.name“), die gerade nicht gehen; Ausgänge ohne Dialog, deren Bedingung nicht
 * gilt, zählen nicht. null, wenn es keinen Weg gibt; [] wenn Start und Ziel gleich sind.
 */
export function kartenweg(
  daten: Spieldaten,
  start: string,
  ziel: string,
  variablen: Readonly<Record<string, unknown>>,
  gesperrt: ReadonlySet<string> = new Set(),
): Ausgang[] | null {
  const woher = new Map<string, Ausgang | null>([[start, null]]);
  const offen = [start];
  for (let i = 0; i < offen.length; i++) {
    const hier = offen[i] as string;
    if (hier === ziel) {
      const weg: Ausgang[] = [];
      for (let a = woher.get(hier) ?? null; a; a = woher.get(a.von) ?? null) weg.unshift(a);
      return weg;
    }
    for (const a of ausgaengeVon(daten, hier)) {
      if (woher.has(a.nach) || gesperrt.has(`${a.von}.${a.name}`)) continue;
      if (a.wenn && !a.dialog && !erfuellt(a.wenn, variablen)) continue;
      woher.set(a.nach, a);
      offen.push(a.nach);
    }
  }
  return null;
}
