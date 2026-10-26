/**
 * Das eigene Spielerprofil: ein Name und ein Porträt, beides freiwillig (Wunsch des Autors vom
 * 25.10.2026).
 *
 * Rolle im Gesamtbild: Oben auf der Profilseite, an der eigenen Seite der Partie, in der
 * Partienliste und als eigener Name im PGN steht dann der Leser mit Bild und Namen statt „Du“.
 * Das Porträt ist entweder eines der 30 Porträts für eigene Bots (engine/portraetwahl.ts) oder
 * selbst gebaut aus den Merkmalen der DiceBear-„Personas“ (ui/profil/merkmale.ts). Vom selbst
 * gebauten wird das fertige SVG mitgespeichert, damit die übrigen Bildschirme den Baukasten nicht
 * laden müssen; es wird nur als Bild (img) gezeigt, dort läuft kein Skript.
 * Zusätzliches Feld der Nutzerdaten wie „zugErraten“, ohne neue Formatversion: Fehlt
 * es, gibt es kein Profil.
 * Abhängigkeiten: engine/portraetwahl.ts.
 */
import {
  istPortraetwahl,
  type GebautesPortraet,
  type Portraetkennung,
} from "../engine/portraetwahl";

/** Längster Name (wie bei eigenen Bots, speicher/gegner.ts). */
export const MAX_PROFILNAME = 24;
/** Größtes gespeichertes SVG eines gebauten Porträts (ein Personas-Bild hat etwa 6 000 Zeichen). */
export const MAX_SVG_ZEICHEN = 40_000;

/** Merkmale eines gebauten Porträts: je Feld der Wert aus ui/profil/merkmale.ts. */
export type Merkmale = GebautesPortraet["merkmale"];

export type Profilbild =
  | { readonly art: "wahl"; readonly kennung: Portraetkennung }
  | ({ readonly art: "bau" } & GebautesPortraet);

export interface Spielerprofil {
  /** Leer: kein Name, die App sagt „Du“. */
  readonly name: string;
  readonly bild: Profilbild | null;
}

/** Kein Profil angelegt: ohne Namen und ohne Porträt (die App zeigt dann „Du“). */
export const LEERES_PROFIL: Spielerprofil = { name: "", bild: null };

type Roh = Record<string, unknown>;

function istObjekt(wert: unknown): wert is Roh {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

/** Merkmale aus Rohdaten: nur kurze Texte; Unbekanntes fällt weg. */
function merkmaleAus(roh: unknown): Merkmale {
  if (!istObjekt(roh)) return {};
  const KURZ = 40;
  return Object.fromEntries(
    Object.entries(roh).filter(
      (eintrag): eintrag is [string, string] =>
        typeof eintrag[1] === "string" && eintrag[1].length <= KURZ,
    ),
  );
}

/**
 * Ein gebautes Porträt aus Rohdaten (Profil und eigene Bots): nur mit SVG am Anfang und in der
 * Größengrenze, sonst null. Es wird nur als Bild gezeigt, dort läuft kein Skript.
 */
export function gebautesPortraetAus(roh: unknown): GebautesPortraet | null {
  if (!istObjekt(roh)) return null;
  const svg = roh.svg;
  if (typeof svg !== "string" || svg.length > MAX_SVG_ZEICHEN) return null;
  return svg.trimStart().startsWith("<svg") ? { merkmale: merkmaleAus(roh.merkmale), svg } : null;
}

/** Ein Porträt aus Rohdaten; ungültig (fremde Kennung, kein SVG, zu groß) ergibt null. */
function bildAus(roh: unknown): Profilbild | null {
  if (!istObjekt(roh)) return null;
  if (roh.art === "wahl" && typeof roh.kennung === "string" && istPortraetwahl(roh.kennung)) {
    return { art: "wahl", kennung: roh.kennung };
  }
  const gebaut = roh.art === "bau" ? gebautesPortraetAus(roh) : null;
  return gebaut ? { art: "bau", ...gebaut } : null;
}

/**
 * Das Profil aus Rohdaten (Speicher und Sicherung); fehlt es oder ist es kaputt, das leere.
 * Beispiel: { name: "  Dana  ", bild: { art: "wahl", kennung: "wahl-07" } } → Name „Dana“.
 */
export function profilAus(roh: unknown): Spielerprofil {
  if (!istObjekt(roh)) return LEERES_PROFIL;
  const name = typeof roh.name === "string" ? roh.name.trim().slice(0, MAX_PROFILNAME) : "";
  return { name, bild: bildAus(roh.bild) };
}

/** Ein gespeichertes SVG als Adresse für ein img. */
export function svgAdresse(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Das Bild als Adresse für ein img: Datei der Porträtwahl oder das gespeicherte SVG. */
export function bildadresse(bild: Profilbild, basis: string): string {
  if (bild.art === "wahl") return `${basis}gegner/${bild.kennung}.svg`;
  return svgAdresse(bild.svg);
}
