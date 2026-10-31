/**
 * Freischaltbare Extras (Gamifizierung P7, Entscheidung E8): die Liste der Extras und ihre
 * Freischaltregeln.
 *
 * Rolle im Gesamtbild: Etwas zum Vorzeigen, das man nur durch Lernen bekommt. Alles, was es schon
 * gab, bleibt frei; freischaltbar ist nur Neues. Jedes Extra steht als eine Zeile in `EXTRAS`
 * (Kennung, Art, Wert, Bedingung, Bild); spätere Pakete (Titel und Zubehör aus der Meisterschaft
 * P3) tragen eine Zeile ein, neue Arten eine Zeile in `EXTRAARTEN` und, falls nötig, eine neue
 * Bedingungsart in `PRUEFUNGEN`. Die Freischaltung wird nur abgeleitet (Stufe, Orden,
 * Meisterschaft P3), nichts wird gespeichert. Grundsatz „nie wegnehmen“: Ein schon gewähltes
 * Extra bleibt gewählt, auch wenn seine Bedingung (etwa nach dem Laden einer Sicherung) nicht
 * erfüllt ist.
 * Die Oberfläche (Profilkarte „Deine Extras“, Kacheln in den Einstellungen) liest diese Datei
 * über ui/komponenten/extras/.
 * Abhängigkeiten: training/meisterschaft.ts, training/meisterschaftsstand.ts (Meisterschaft, P3).
 */
import type { Medaillenstufe } from "./meisterschaft";
import { zaehleThemen } from "./meisterschaftsstand";

/** Die Arten von Extras; je Art eine Zeile, neue Arten (Titel, Zubehör) kommen dazu. */
export const EXTRAARTEN = ["rahmen", "brett", "figuren", "konfetti", "titel"] as const;
export type Extraart = (typeof EXTRAARTEN)[number];

/** Gruppen von Orden, die zusammen eine Bedingung bilden (Ringe des Profils). */
export const ORDENGRUPPEN = ["buchteile"] as const;
export type Ordengruppe = (typeof ORDENGRUPPEN)[number];

/**
 * Wann ein Extra frei ist: ab einer Stufe der Erfahrung, mit allen Orden einer Gruppe oder mit
 * einer Zahl von Themen in einer Stufe der Meisterschaft (P3; `praefix` null: alle Trainer).
 */
export type Bedingung =
  | { readonly art: "stufe"; readonly ab: number }
  | { readonly art: "orden"; readonly gruppe: Ordengruppe }
  | {
      readonly art: "meisterschaft";
      readonly stufe: Medaillenstufe;
      readonly anzahl: number;
      readonly praefix: string | null;
    };

/** Was die Regeln über den Leser wissen müssen; die Oberfläche rechnet es aus. */
export interface Extralage {
  /** Stufe der Erfahrung, 1 bis 10 (mit Probe der Aufgabenseite). */
  readonly stufe: number;
  /** Ordengruppen, deren Orden alle verdient sind. */
  readonly volleOrdengruppen: ReadonlySet<Ordengruppe>;
  /** Thema → erreichte Stufe der Meisterschaft (mit Probe der Aufgabenseite). */
  readonly themenstufen: Readonly<Record<string, Medaillenstufe>>;
}

/** Ein Extra: Kennung, Art, Wert in der Wahl seiner Art, Bedingung und Bild (Pfad in der App). */
export interface Extra {
  readonly kennung: string;
  readonly art: Extraart;
  /** Der Wert, den die Wahl der Art bekommt (Brettfarben, Figurensatz, Rahmen, Konfetti). */
  readonly wert: string;
  readonly bedingung: Bedingung;
  /** Bild der Kachel, relativ zur App; gesperrt erscheint es als Silhouette. */
  readonly bild: string;
}

/**
 * Alle Extras (Auswahl E8 nach Empfehlung). Stufen nach dem Vorschlag der Vorrecherche:
 * Rahmen Bronze, Silber, Gold ab Stufe 3, 6, 9; Konfettifarben ab Stufe 2; Figurensatz „Gold“
 * ab Stufe 5; Brett „Nacht und Gold“ mit allen Orden der Buchteile.
 */
export const EXTRAS = [
  {
    kennung: "rahmen-bronze",
    art: "rahmen",
    wert: "bronze",
    bedingung: { art: "stufe", ab: 3 },
    bild: "extras/rahmen-bronze.svg",
  },
  {
    kennung: "rahmen-silber",
    art: "rahmen",
    wert: "silber",
    bedingung: { art: "stufe", ab: 6 },
    bild: "extras/rahmen-silber.svg",
  },
  {
    kennung: "rahmen-gold",
    art: "rahmen",
    wert: "gold",
    bedingung: { art: "stufe", ab: 9 },
    bild: "extras/rahmen-gold.svg",
  },
  {
    kennung: "brett-nacht-gold",
    art: "brett",
    wert: "nacht-gold",
    bedingung: { art: "orden", gruppe: "buchteile" },
    bild: "extras/brett-nacht-gold.svg",
  },
  {
    kennung: "figuren-gold",
    art: "figuren",
    wert: "gold",
    bedingung: { art: "stufe", ab: 5 },
    bild: "figuren/gold/wK.svg",
  },
  {
    kennung: "konfetti-bunt",
    art: "konfetti",
    wert: "bunt",
    bedingung: { art: "stufe", ab: 2 },
    bild: "extras/konfetti-bunt.svg",
  },
  // P3 Meisterschaft: Titel unter dem Namen im Profil.
  {
    kennung: "titel-taktiker",
    art: "titel",
    wert: "taktiker",
    bedingung: { art: "meisterschaft", stufe: "gold", anzahl: 5, praefix: "taktik" },
    bild: "extras/titel-taktiker.svg",
  },
  {
    kennung: "titel-endspielkenner",
    art: "titel",
    wert: "endspielkenner",
    bedingung: { art: "meisterschaft", stufe: "gold", anzahl: 3, praefix: "endspiel" },
    bild: "extras/titel-endspielkenner.svg",
  },
] as const satisfies readonly Extra[];
export type Extrakennung = (typeof EXTRAS)[number]["kennung"];

/** Je Bedingungsart eine Prüfung; eine neue Art (etwa Meisterschaft) bekommt hier eine Zeile. */
const PRUEFUNGEN: {
  readonly [A in Bedingung["art"]]: (
    bedingung: Extract<Bedingung, { art: A }>,
    lage: Extralage,
  ) => boolean;
} = {
  stufe: (b, lage) => lage.stufe >= b.ab,
  orden: (b, lage) => lage.volleOrdengruppen.has(b.gruppe),
  meisterschaft: (b, lage) => zaehleThemen(lage.themenstufen, b.stufe, b.praefix) >= b.anzahl,
};

/**
 * Ist die Bedingung erfüllt? Beispiel: { art: "stufe", ab: 3 } bei Stufe 4 → true.
 */
export function bedingungErfuellt(bedingung: Bedingung, lage: Extralage): boolean {
  // Die Prüfung gehört zur Art der Bedingung (PRUEFUNGEN ist danach getippt).
  const pruefe = PRUEFUNGEN[bedingung.art] as (b: Bedingung, l: Extralage) => boolean;
  return pruefe(bedingung, lage);
}

/** Die Kennungen aller freien Extras. Beispiel: Stufe 3 → Konfetti und Rahmen Bronze. */
export function freieExtras(
  lage: Extralage,
  extras: readonly Extra[] = EXTRAS,
): ReadonlySet<string> {
  return new Set(extras.filter((e) => bedingungErfuellt(e.bedingung, lage)).map((e) => e.kennung));
}

/** Das Extra zu einem Wert einer Art; undefined, wenn der Wert immer frei ist (etwa „holz“). */
export function extraZu(
  art: Extraart,
  wert: string,
  extras: readonly Extra[] = EXTRAS,
): Extra | undefined {
  return extras.find((e) => e.art === art && e.wert === wert);
}

/** Die Extras einer Art in der Reihenfolge der Liste. Beispiel: „rahmen“ → Bronze, Silber, Gold. */
export function extrasDerArt(art: Extraart, extras: readonly Extra[] = EXTRAS): readonly Extra[] {
  return extras.filter((e) => e.art === art);
}

/**
 * Das sperrende Extra zu einem Wert, sonst undefined. Frei sind alle Werte ohne Extra, alle
 * Extras mit erfüllter Bedingung und der gerade gewählte Wert (nie wegnehmen, E8).
 * Beispiel: Figurensatz „gold“ bei Stufe 4, gewählt ist „buch“ → das Extra „figuren-gold“.
 */
export function sperre(
  art: Extraart,
  wert: string,
  gewaehlt: string,
  lage: Extralage,
  extras: readonly Extra[] = EXTRAS,
): Extra | undefined {
  if (wert === gewaehlt) return undefined;
  const extra = extraZu(art, wert, extras);
  return extra && !bedingungErfuellt(extra.bedingung, lage) ? extra : undefined;
}
