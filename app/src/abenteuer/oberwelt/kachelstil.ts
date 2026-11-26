/**
 * Kachelstil einer Karte (gekaufte Grafik im Raster des Platzhalters): Eigenschaft `stil`, sonst
 * innen, Wüste, Weg (Natur) oder Stadt.
 *
 * Rolle im Gesamtbild: ausgelagert aus oberwelt/weltdaten.ts (Größengrenze 400 Zeilen, Auftritte
 * kamen dazu); weltdaten.ts gibt `kachelstil` wie bisher weiter.
 * Abhängigkeiten: daten/laden.ts (Typ Ortdaten).
 */
import type { Ortdaten } from "../daten/laden";

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
