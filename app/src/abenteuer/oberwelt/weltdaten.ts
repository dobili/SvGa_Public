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
import { tSpiel } from "../texte/texte";
import { ladeMoebel, type Moebel } from "./moebel";
import type { Ausloesertreffer } from "./szene";

/** Bilder des Prototyps im Paket (bis die LimeZu-Kacheln da sind, Entscheidung A10). */
const KACHELBILD = "grafik/platzhalter.png";
const HELDBILD = "grafik/held.png";
const FIGURBILD = "grafik/figur.png";
export const KACHELSATZ = "platzhalter";
export const SPRACHE = "de";

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
  /** Möbel und Schmuck der Karte. */
  readonly moebel: readonly Moebel[];
  /** Hintergrundbild aus dem Kartenbauer (grafik/karten/<kennung>.png), sonst null. */
  readonly hintergrund: string | null;
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
      const adresse = sprite ? await paketdateiAlsAdresseOderNull(sprite) : null;
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

/** Lädt Spieldaten, Karte und Bilder für die Karte des Spielstands. */
export async function ladeWelt(kartenkennung: string, heldvariante = 0): Promise<Weltdaten> {
  const daten = await ladeSpieldaten();
  const fund = findeKarte(daten, kartenkennung);
  if (!fund) throw new Error(`Karte ${kartenkennung} fehlt in orte.json`);
  const [karte, kachelbild, heldbild, figurbild] = await Promise.all([
    liesPaketJson<object>(fund.karte.datei),
    paketdateiAlsAdresse(KACHELBILD),
    paketdateiAlsAdresse(fund.ort.art === "erinnerung" ? FIGURBILD : HELDBILD),
    paketdateiAlsAdresse(FIGURBILD),
  ]);
  const erinnerung = fund.ort.art === "erinnerung";
  const [stilbild, heldfigur, figurenbilder, moebel, hintergrund] = await Promise.all([
    paketdateiAlsAdresseOderNull(
      `grafik/stil-${kachelstil(fund.ort, fund.karte.innen, karte)}.png`,
    ),
    paketdateiAlsAdresseOderNull(heldfigurpfad(erinnerung, heldvariante)),
    figurenbilderFuer(fund.ort, karte),
    ladeMoebel(karte),
    paketdateiAlsAdresseOderNull(`grafik/karten/${kartenkennung}.png`),
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
    moebel,
    hintergrund,
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
  if (treffer.typ === "figur") {
    return figurZu(w.ort, treffer.name) ? tSpiel("oberwelt.aktion.sprechen") : null;
  }
  const a = ausloeserFuer(w.ort, w.kennung, treffer.name);
  if (!a) return null;
  if (a.art === "gegenstand") return tSpiel("oberwelt.aktion.ansehen");
  if (a.art === "dialog") return tSpiel("oberwelt.aktion.sprechen");
  return null;
}
