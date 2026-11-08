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
import { liesPaketJson, paketdateiAlsAdresse } from "../paket/paketlader";
import { tSpiel } from "../texte/texte";
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
  readonly karte: object;
  readonly kachelbild: string;
  readonly heldbild: string;
  readonly figurbild: string;
}

/** Lädt Spieldaten, Karte und Bilder für die Karte des Spielstands. */
export async function ladeWelt(kartenkennung: string): Promise<Weltdaten> {
  const daten = await ladeSpieldaten();
  const fund = findeKarte(daten, kartenkennung);
  if (!fund) throw new Error(`Karte ${kartenkennung} fehlt in orte.json`);
  const [karte, kachelbild, heldbild, figurbild] = await Promise.all([
    liesPaketJson<object>(fund.karte.datei),
    paketdateiAlsAdresse(KACHELBILD),
    paketdateiAlsAdresse(HELDBILD),
    paketdateiAlsAdresse(FIGURBILD),
  ]);
  return { kennung: kartenkennung, daten, ort: fund.ort, karte, kachelbild, heldbild, figurbild };
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
