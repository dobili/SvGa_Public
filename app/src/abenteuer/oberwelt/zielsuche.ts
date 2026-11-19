/**
 * Zielsuche für den Zielhinweis auf der Karte (Spieltest „einstieg“, 15.11.2026, R1): Wohin soll
 * der Held als Nächstes? Aus dem laufenden Questschritt (oder „Was jetzt?“) wird eine Zielangabe
 * (Karte und Objekt der Tiled-Karte); liegt das Ziel auf einer anderen Karte, zeigt der Hinweis
 * auf den Ausgang, der auf dem kürzesten Weg dorthin führt.
 *
 * Warum: Ein Kind von 11 Jahren fand Mama in der Küche, die Schule 45 Kacheln weiter und Juno an
 * der Bushaltestelle nicht. Gute Einsteigerspiele zeigen das nächste Ziel im Bild; die
 * Questtexte allein reichen nicht.
 * Rolle im Gesamtbild: Reine Funktionen ohne Phaser und React; oberwelt/useZielhinweis.ts lädt die
 * Karten und gibt das Feld an die Szene (oberwelt/zielmarker.ts zeichnet es).
 * Seit dem 19.11.2026 zeigt der Pfeil nur auf das Ziel der verfolgten Quest (verfolgtesZiel);
 * zielangaben bleibt für den Planer des Spieler-Durchlaufs (tests/durchlauf/planer.ts).
 * Abhängigkeiten: daten/laden.ts (Typen), schnittstelle/spielstand.ts, oberwelt/wasjetzt.ts,
 * regeln/verfolgung.ts.
 */
import type { Questdaten, Spieldaten } from "../daten/laden";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { verfolgteLaufendeQuest } from "../regeln/verfolgung";
import { wasJetzt } from "./wasjetzt";

/** Kantenlänge einer Kachel der Tiled-Karten in Pixeln. */
const KACHEL = 16;

/** Wohin der Hinweis will: Karte (falls bekannt), Objekt (falls bekannt), Ort zum Suchen. */
export interface Zielangabe {
  readonly karte?: string;
  readonly objekt?: string;
  readonly ort?: string;
}

/** Ein Feld in Kachelkoordinaten. */
export interface Feld {
  readonly x: number;
  readonly y: number;
}

/** Was die Zielsuche von einer Karte braucht: Objekte mit Feld und Ausgänge zu anderen Karten. */
export interface Kartenbild {
  readonly kennung: string;
  readonly objekte: ReadonlyMap<string, Feld>;
  /** Ausgänge: Name des Auslösers auf dieser Karte und die Karte, zu der er führt. */
  readonly ausgaenge: readonly { readonly name: string; readonly nach: string }[];
}

type Schritt = Questdaten["schritte"][number];

/** Ziele für die Lücken zwischen den Quests (wasjetzt.ts), nach Textschlüssel. */
const LUECKENZIELE: Readonly<Record<string, Zielangabe>> = {
  "tagebuch.wasJetzt.ersteNacht": { karte: "mapleFalls.zimmer", objekt: "brettSchreibtisch" },
  "tagebuch.wasJetzt.juno": { karte: "mapleFalls.aussen", objekt: "juno" },
  "tagebuch.wasJetzt.club": { karte: "mapleFalls.clubraum", objekt: "coachDelgado" },
};

/** Figur nach Kennung („mapleFalls.sam“) als Zielangabe: Objektname „sam“ im Ort. */
function figurangabe(kennung: string | undefined): Zielangabe | null {
  if (!kennung) return null;
  const punkt = kennung.indexOf(".");
  return { ort: kennung.slice(0, punkt), objekt: kennung.slice(punkt + 1) };
}

/** Ein Dialogknoten als Zielangabe: Auslöser oder Figur mit genau diesem Knoten, sonst die Karte. */
function dialogangabe(knoten: string, daten: Spieldaten): Zielangabe | null {
  const datei = knoten.split(".")[0] ?? "";
  for (const ort of daten.orte) {
    const karte = ort.karten.find((k) => k.datei.endsWith(`/${datei}.json`))?.kennung;
    const ausloeser = ort.ausloeser.find((a) => a.dialog === knoten);
    const ausloeserkarte = ausloeser?.karte ?? karte;
    if (ausloeser) {
      return {
        ort: ort.kennung,
        objekt: ausloeser.name,
        ...(ausloeserkarte ? { karte: ausloeserkarte } : {}),
      };
    }
    const figur = ort.figuren.find((f) => f.dialog === knoten);
    if (figur) return { ...figurangabe(figur.kennung), ...(karte ? { karte } : {}) };
    if (karte) return { karte };
  }
  return null;
}

/**
 * Die Zielangabe eines Questschritts: das Feld `ziel` der Questdaten, sonst aus dem Ereignis
 * abgeleitet (Ort und Auslöser, Steller der Runde, Gegner der Begegnung, Dialogknoten).
 * Beispiel: Schritt „Aufgabenrunde mapleFalls.reiheSam“ → { ort: "mapleFalls", objekt: "sam" }.
 * Sonderfall: Nichts ableitbar → null (dann kein Hinweis).
 */
export function zielangabe(schritt: Schritt, daten: Spieldaten): Zielangabe | null {
  if (schritt.ziel) return schritt.ziel;
  const e = schritt.ereignis;
  if (e.art === "ort") return { karte: e.karte, ...(e.ausloeser ? { objekt: e.ausloeser } : {}) };
  if (e.art === "aufgaben") {
    return figurangabe(daten.runden.find((r) => r.kennung === e.runde)?.steller);
  }
  if (e.art === "partie") {
    return figurangabe(daten.begegnungen.find((b) => b.kennung === e.begegnung)?.gegner);
  }
  return dialogangabe(e.knoten, daten);
}

/**
 * Die Zielangaben der laufenden Quests in der Reihenfolge, in der der Hinweis sie versucht:
 * Hauptquests vor Nebenquests, jeweils die zuletzt angenommene zuerst; ohne laufende Quest das
 * Ziel aus „Was jetzt?“. Beispiel: nach dem Abend mit Mama ohne Quest → Brett im Zimmer.
 */
export function zielangaben(stand: Abenteuerstand, daten: Spieldaten): Zielangabe[] {
  const laufend = stand.quests
    .filter((q) => !q.erledigt)
    .map((q) => ({ q, d: daten.quests.find((x) => x.kennung === q.kennung) }))
    .filter((x) => x.d !== undefined)
    .sort((a, b) => {
      const haupt = Number(b.d?.haupt === true) - Number(a.d?.haupt === true);
      return haupt !== 0 ? haupt : b.q.angenommen.localeCompare(a.q.angenommen);
    });
  const angaben = laufend.flatMap(({ q, d }) => {
    const schritt = d?.schritte[q.schritt];
    const angabe = schritt ? zielangabe(schritt, daten) : null;
    return angabe ? [angabe] : [];
  });
  if (laufend.length > 0) return angaben;
  const luecke = wasJetzt(stand.dialogvariablen);
  const ziel = luecke ? LUECKENZIELE[luecke] : undefined;
  return ziel ? [ziel] : [];
}

/**
 * Die Zielangabe der verfolgten Quest (regeln/verfolgung.ts): ihr laufender Schritt, oder null,
 * wenn nichts verfolgt wird, die Quest erledigt ist oder der Schritt kein Ziel hat. Der Pfeil zeigt
 * seit dem 19.11.2026 nur noch hierhin (Wunsch des Autors: Pfeile nur auf Wunsch).
 * Beispiel: verfolgt „mapleFalls.ersterAbend“ im ersten Schritt → { karte: „mapleFalls.wohnzimmer“,
 * objekt: „mutter“ }.
 */
export function verfolgtesZiel(stand: Abenteuerstand, daten: Spieldaten): Zielangabe | null {
  const kennung = verfolgteLaufendeQuest(stand);
  const q = stand.quests.find((x) => x.kennung === kennung && !x.erledigt);
  const schritt = q ? daten.quests.find((d) => d.kennung === q.kennung)?.schritte[q.schritt] : null;
  return schritt ? zielangabe(schritt, daten) : null;
}

/** Rohe Tiled-Objekte einer Karte (alle Objektebenen). */
function tiledObjekte(karte: object): readonly { name?: string; x?: number; y?: number }[] {
  const ebenen = (karte as { layers?: readonly { type?: string; objects?: readonly object[] }[] })
    .layers;
  return (ebenen ?? []).flatMap((e) => (e.type === "objectgroup" ? (e.objects ?? []) : []));
}

/**
 * Das Kartenbild einer geladenen Tiled-Karte. `ausgangVon(name)` sagt, wohin ein Auslöser dieses
 * Namens führt (orte.json, nur Übergänge mit Ziel), sonst null. Mehrere Objekte gleichen Namens
 * (breite Türen) zählen mit dem ersten. Mehrere Fassungen einer Karte werden vereinigt.
 */
export function kartenbildAus(
  kennung: string,
  fassungen: readonly object[],
  ausgangVon: (name: string) => string | null,
): Kartenbild {
  const objekte = new Map<string, Feld>();
  for (const o of fassungen.flatMap(tiledObjekte)) {
    if (!o.name || objekte.has(o.name)) continue;
    objekte.set(o.name, {
      x: Math.floor((o.x ?? 0) / KACHEL),
      y: Math.floor((o.y ?? 0) / KACHEL),
    });
  }
  const ausgaenge = [...objekte.keys()].flatMap((name) => {
    const nach = ausgangVon(name);
    return nach && nach !== kennung ? [{ name, nach }] : [];
  });
  return { kennung, objekte, ausgaenge };
}

/** Die Karte, auf der eine Zielangabe liegt: angegeben, sonst die erste mit dem Objekt. */
export function zielkarte(angabe: Zielangabe, karten: readonly Kartenbild[]): string | null {
  if (angabe.karte) return angabe.karte;
  const objekt = angabe.objekt;
  if (!objekt) return null;
  const imOrt = (k: Kartenbild) => !angabe.ort || k.kennung.startsWith(`${angabe.ort}.`);
  return karten.find((k) => imOrt(k) && k.objekte.has(objekt))?.kennung ?? null;
}

/**
 * Das Feld, auf das der Hinweis auf der Karte `start` zeigt: das Zielobjekt selbst, oder der erste
 * Ausgang auf dem kürzesten Weg (Breitensuche über die Ausgänge) zur Zielkarte.
 * Beispiel: Held im Zimmer, Ziel Mama im Wohnzimmer → Feld des Auslösers „treppeUnten“.
 * Sonderfälle: Ziel auf dieser Karte ohne Objekt (nur die Karte) → null; kein Weg → null.
 */
export function wegweiser(
  start: string,
  angabe: Zielangabe,
  karten: readonly Kartenbild[],
): Feld | null {
  const ziel = zielkarte(angabe, karten);
  const hier = karten.find((k) => k.kennung === start);
  if (!ziel || !hier) return null;
  if (ziel === start) return angabe.objekt ? (hier.objekte.get(angabe.objekt) ?? null) : null;
  const erster = new Map<string, string>(hier.ausgaenge.map((a) => [a.nach, a.name]));
  const schlange = [...new Set(hier.ausgaenge.map((a) => a.nach))];
  const besucht = new Set([start, ...schlange]);
  while (schlange.length > 0) {
    const karte = schlange.shift() ?? "";
    if (karte === ziel) return hier.objekte.get(erster.get(karte) ?? "") ?? null;
    for (const a of karten.find((k) => k.kennung === karte)?.ausgaenge ?? []) {
      if (besucht.has(a.nach)) continue;
      besucht.add(a.nach);
      erster.set(a.nach, erster.get(karte) ?? "");
      schlange.push(a.nach);
    }
  }
  return null;
}
