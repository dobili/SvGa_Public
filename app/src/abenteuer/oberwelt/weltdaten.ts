/**
 * Weltdaten der Oberwelt: Laden von Spieldaten, Karte und Bildern für eine Karte des Spielstands,
 * dazu die Deutung der Tiled-Objekte über orte.json (Auslöser je Karte, Figuren, Aktionsknopf).
 *
 * Rolle im Gesamtbild: Reine Hilfen für oberwelt/Oberwelt.tsx, ausgelagert, damit der Bildschirm
 * lesbar bleibt. Platzhalterbilder des Prototyps bis zur eigentlichen Grafik (Entscheidung A10).
 * Abhängigkeiten: paket/paketlader.ts, daten/laden.ts, oberwelt/szene.ts (Treffer), texte/texte.ts.
 * Beispiel: `ausloeserFuer(ort, "mapleFalls.clubraum", "schule")` liefert den Eintrag mit
 * `karte: "mapleFalls.clubraum"` (Rückweg nach draußen), auf der Außenkarte den Eintrag ohne Karte.
 */
import { findeKarte, ladeSpieldaten, type Ortdaten, type Spieldaten } from "../daten/laden";
import {
  liesPaketJson,
  paketdateiAlsAdresse,
  paketdateiAlsAdresseOderNull,
} from "../paket/paketlader";
import { Spielfehler } from "../schnittstelle/spielfehler";
import { sprache } from "../../i18n/sprache";
import { hatSpieltext, ladeSpieltexte, tSpiel } from "../texte/texte";
export { ladeDialog } from "../dialog/dialogdatei";
import { liesBelebung, statistenbild, statistensatz } from "./belebung";
import type { SprechblasenInhalt } from "./Sprechblase";
import { ohneAbwesende } from "../regeln/abwesenheit";
import { ohneFigurenNachBedingung } from "../regeln/figurbedingung";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { figurenbildAdresse } from "./figurbogen";
import { geisterDerKarte } from "../regeln/geist";
import { kartenfassung } from "./kartenfassung";
import { istWinter } from "./winter";
import { ladeMoebel, type Moebel } from "./moebel";
import { tierartVon } from "./tiere";
import type { Ausloesertreffer } from "./szene";

/** Bilder des Prototyps im Paket (bis die LimeZu-Kacheln da sind, Entscheidung A10). */
const KACHELBILD = "grafik/platzhalter.png";
const HELDBILD = "grafik/held.png";
const FIGURBILD = "grafik/figur.png";
export const KACHELSATZ = "platzhalter";

/** Was zum Aufbau der Szene geladen wurde. */
export interface Weltdaten {
  /** Kennung der geladenen Karte; passt sie nicht mehr zum Spielstand, gilt die Welt als alt. */
  readonly kennung: string;
  readonly daten: Spieldaten;
  readonly ort: Ortdaten;
  /** Innenraum (kein Fahrrad, keine Tiere draußen)? */
  readonly innen: boolean;
  /**
   * Erinnerung Ambroses (Ort-Art „erinnerung“, docs/spiel/08, F1 und F3): Sepia-Tönung, Ambrose
   * als Held (Bild einer Figur statt des Helden), kein Tagebuch.
   */
  readonly erinnerung: boolean;
  readonly karte: object;
  readonly kachelbild: string;
  readonly heldbild: string;
  readonly figurbild: string;
  /** Bogen des Helden im Format von LimeZu (gekaufte Grafik); null ohne. */
  readonly heldfigur: string | null;
  /** Bögen der Figuren dieser Karte im Format von LimeZu, nach Objektname. */
  readonly figurenbilder: Readonly<Record<string, string>>;
  /** Figuren dieser Karte, die als Geist erscheinen (regeln/geist.ts), nach Objektname. */
  readonly geister: ReadonlySet<string>;
  /** Möbel und Schmuck der Karte. */
  readonly moebel: readonly Moebel[];
  /** Hintergrundbild aus dem Kartenbauer (grafik/karten/<kennung>.png), sonst null. */
  readonly hintergrund: string | null;
  /** Zweite Fassung der Karte (zustand_der_karte), sonst null. */
  readonly zustand: string | null;
  /** Winterkarte (Eigenschaft `jahreszeit`, winter.ts): Schnee und umgefärbte Möbel. */
  readonly winter: boolean;
  /** Bögen der Statisten und Tiere dieser Karte, Pfad im Paket → Adresse (nur vorhandene). */
  readonly belebungsbilder: Readonly<Record<string, string>>;
}

/**
 * Die Bögen der Belebung einer Karte: Statisten aus dem Vorrat (`figuren/statist-NN.png`), Tiere
 * nach Art (`tiere/<art>.png`), nur wo das Paket ein Bild hat (ohne private Grafik: keins).
 */
async function belebungsbilderFuer(karte: object): Promise<Record<string, string>> {
  const pfade = new Set(
    liesBelebung(karte).flatMap((b) => {
      if (b.typ === "statist") return [statistenbild(b)];
      const art = tierartVon(b.name, b.bild);
      return art ? [`tiere/${art}.png`] : [];
    }),
  );
  const paare = await Promise.all(
    // Statisten wie Figuren: PixelLab-Bogen vor LimeZu (figurbogen.ts); Tiere gehen durch.
    [...pfade].map(async (pfad) => [pfad, await figurenbildAdresse(pfad)] as const),
  );
  return Object.fromEntries(paare.filter((p): p is readonly [string, string] => p[1] !== null));
}

/** Objektnamen der Figuren einer Tiled-Karte (Objekte mit type „figur“). */
function figurennamen(karte: object): string[] {
  const ebenen = (karte as { layers?: readonly { objects?: readonly unknown[] }[] }).layers ?? [];
  return ebenen.flatMap((e) =>
    (e.objects ?? []).flatMap((o) => {
      const objekt = o as { name?: string; type?: string };
      return objekt.type === "figur" && objekt.name ? [objekt.name] : [];
    }),
  );
}

/**
 * Die Bögen der Figuren einer Karte (Pfad aus `sprite` in orte.json), nur wo das Paket ein Bild hat.
 * Beispiel: Objekt „juno“, Sprite „figuren/juno.png“ → { juno: "blob:…" }.
 */
async function figurenbilderFuer(ort: Ortdaten, karte: object): Promise<Record<string, string>> {
  const paare = await Promise.all(
    figurennamen(karte).map(async (name) => {
      const sprite = figurZu(ort, name)?.sprite;
      const adresse = sprite ? await figurenbildAdresse(sprite) : null;
      return adresse ? ([name, adresse] as const) : null;
    }),
  );
  return Object.fromEntries(paare.filter((p) => p !== null));
}

/** Orte in Wüste und Canyon (Weltbeschreibung): Sandboden statt Gras. */
const WUESTE = new Set([
  "desertSprings",
  "ghostTown",
  "wegDelacroixDesert",
  "wegDesertSummit",
  "wegPinewoodGhost",
]);

/** Eigenschaft `stil` einer Tiled-Karte (etwa „kueste“ für Fähre, Deich, Bayou), sonst null. */
function kartenstil(karte?: object): string | null {
  const eigenschaften = (karte as { properties?: readonly { name?: string; value?: unknown }[] })
    ?.properties;
  const stil = eigenschaften?.find((e) => e.name === "stil")?.value;
  return typeof stil === "string" ? stil : null;
}

/**
 * Kachelstil einer Karte (gekaufte Grafik, `grafik/stil-<stil>.png` im Raster des Platzhalters):
 * Eigenschaft `stil` der Karte, sonst innen, Wüste, Weg (Natur) oder Stadt.
 * Beispiel: Clubraum → „innen“, Landstraße → „natur“, Ghost Town draußen → „wueste“.
 */
export function kachelstil(ort: Ortdaten, innen: boolean, karte?: object): string {
  const eigener = kartenstil(karte);
  if (eigener) return eigener;
  if (innen) return "innen";
  if (WUESTE.has(ort.kennung)) return "wueste";
  return ort.art === "weg" ? "natur" : "aussen";
}

/** Bild des Helden: in Erinnerungen der junge Ambrose, sonst die gewählte Heldenvariante. */
function heldfigurpfad(erinnerung: boolean, variante: number): string {
  return erinnerung ? "figuren/ambrose-jung.png" : `figuren/held-${variante}.png`;
}

/**
 * Lädt Spieldaten, Karte und Bilder für die Karte des Spielstands. `variablen` (Dialogvariablen)
 * wählen die Fassung der Karte (zustand_der_karte).
 */
export async function ladeWelt(
  kartenkennung: string,
  heldvariante = 0,
  variablen: Readonly<Record<string, unknown>> = {},
): Promise<Weltdaten> {
  // Spieltexte in der Sprache der App (Dokument 17); ohne Übersetzung im Paket bleibt Deutsch.
  await ladeSpieltexte(sprache());
  const daten = await ladeSpieldaten();
  const fund = findeKarte(daten, kartenkennung);
  if (!fund) throw new Spielfehler("fehler.welt.karteFehlt", { karte: kartenkennung });
  const fassung = kartenfassung(fund.karte, variablen);
  const [geladen, kachelbild, heldbild, figurbild] = await Promise.all([
    liesPaketJson<object>(fassung.datei),
    paketdateiAlsAdresse(KACHELBILD),
    paketdateiAlsAdresse(fund.ort.art === "erinnerung" ? FIGURBILD : HELDBILD),
    paketdateiAlsAdresse(FIGURBILD),
  ]);
  // Im Tiefpunkt steht Ambrose auf keiner Karte (regeln/abwesenheit.ts); Figuren mit `wenn`
  // und Möbel stehen nur, wenn ihre Bedingung gilt (regeln/figurbedingung.ts).
  const karte = ohneFigurenNachBedingung(
    ohneAbwesende(geladen, variablen as Abenteuerstand["dialogvariablen"]),
    (name) => figurZu(fund.ort, name)?.wenn,
    variablen,
  );
  const erinnerung = fund.ort.art === "erinnerung";
  const [stilbild, heldfigur, figurenbilder, moebel, hintergrund, belebungsbilder] =
    await Promise.all([
      paketdateiAlsAdresseOderNull(
        `grafik/stil-${kachelstil(fund.ort, fund.karte.innen, karte)}.png`,
      ),
      figurenbildAdresse(heldfigurpfad(erinnerung, heldvariante)),
      figurenbilderFuer(fund.ort, karte),
      ladeMoebel(karte),
      paketdateiAlsAdresseOderNull(
        `grafik/karten/${kartenkennung}${fassung.zustand ? `-${fassung.zustand}` : ""}.png`,
      ),
      belebungsbilderFuer(karte),
    ]);
  return {
    kennung: kartenkennung,
    daten,
    ort: fund.ort,
    innen: fund.karte.innen,
    erinnerung: fund.ort.art === "erinnerung",
    karte,
    kachelbild: stilbild ?? kachelbild,
    heldbild,
    figurbild,
    heldfigur,
    figurenbilder,
    geister: geisterDerKarte(
      figurennamen(karte),
      (n) => figurZu(fund.ort, n)?.geist === true,
      erinnerung,
    ),
    moebel,
    hintergrund,
    belebungsbilder,
    zustand: fassung.zustand,
    winter: istWinter(karte),
  };
}

/** Das Objekt `name` einer Tiled-Karte in Kachelkoordinaten, oder null. */
export function objektposition(karte: object, name: string): { x: number; y: number } | null {
  const ebenen = (karte as { layers?: readonly { type?: string; objects?: readonly unknown[] }[] })
    .layers;
  for (const ebene of ebenen ?? []) {
    if (ebene.type !== "objectgroup") continue;
    for (const o of ebene.objects ?? []) {
      const objekt = o as { name?: string; x?: number; y?: number };
      if (objekt.name === name) {
        return { x: Math.round((objekt.x ?? 0) / 16), y: Math.round((objekt.y ?? 0) / 16) };
      }
    }
  }
  return null;
}

/**
 * Die Bedeutung eines Auslösers auf einer Karte: Ein Eintrag mit passendem Feld `karte` geht vor
 * (der Rückweg einer Tür), sonst gilt der Eintrag des Ortes ohne Karte.
 */
export function ausloeserFuer(ort: Ortdaten, karte: string, name: string) {
  const passende = ort.ausloeser.filter((x) => x.name === name);
  return passende.find((x) => x.karte === karte) ?? passende.find((x) => !x.karte);
}

/** Figur einer Karte zu einem Objektnamen („coachDelgado“ → Figur `ort.coachDelgado`). */
export function figurZu(ort: Ortdaten, name: string) {
  return ort.figuren.find((f) => f.kennung === `${ort.kennung}.${name}` || f.kennung === name);
}

/** Der Knopftext zu einem Treffer der Karte; null, wenn er nichts auslöst. */
export function aktionFuer(w: Weltdaten, treffer: Ausloesertreffer | null): string | null {
  if (!treffer) return null;
  if (treffer.typ === "statist") return tSpiel("oberwelt.aktion.sprechen");
  if (treffer.typ === "figur") {
    return figurZu(w.ort, treffer.name) ? tSpiel("oberwelt.aktion.sprechen") : null;
  }
  const a = ausloeserFuer(w.ort, w.kennung, treffer.name);
  if (!a) return null;
  if (a.art === "gegenstand") return tSpiel("oberwelt.aktion.ansehen");
  if (a.art === "dialog") return tSpiel("oberwelt.aktion.sprechen");
  return null;
}

/**
 * Was ein ansprechbarer Statist beim n-ten Ansprechen (ab 0) sagt, fertig übersetzt; {held} wird
 * durch den Namen des Helden ersetzt. Null, wenn der Statist keinen Satz hat.
 * Beispiel: Ladenhilfe im Bergladen, erstes Ansprechen → Satz „statist.summitCity.bergladen.ladenhilfe“.
 */
export function sprechblaseFuer(
  w: Weltdaten,
  name: string,
  besuch: number,
  held: string,
): SprechblasenInhalt | null {
  const statist = liesBelebung(w.karte).find((b) => b.typ === "statist" && b.name === name);
  const sagt = statist?.sagt;
  const s = sagt ? statistensatz(sagt, besuch, hatSpieltext) : null;
  if (!s) return null;
  const ambrose = s.ambrose
    ? tSpiel("oberwelt.ambroseSagt", {
        name: tSpiel("figur.ambrose.name"),
        satz: tSpiel(s.ambrose, { held }),
      })
    : null;
  return { satz: tSpiel(s.satz, { held }), ambrose, zeigt: statist?.zeigt ?? null };
}
