/**
 * Fehlerprofil eines eigenen Gegners ohne Oberfläche: Gruppen der Fehlerarten, Stufe je Art oder
 * Fleck lesen und setzen, Vorlagen (seit 0.2.129, Vorschlag DS38, vom Autor am 25.10.2026
 * freigegeben).
 *
 * Rolle im Gesamtbild: Bis 0.2.128 stellte man jede Fehlerart an drei Stellen ein (Haken, Regler
 * „Häufigkeit“, Regler „Höchstverlust“ im erweiterten Modus). Fehlerprofil.tsx zeigt jede Art
 * genau einmal mit einem Schalter in Stufen; „aus“ ersetzt den Haken. Gespeichert wird wie bisher
 * (EigenerGegner: fehlerarten, blindeFlecken, reglerstufen, haeufigkeit, hoechstverlust), es gibt
 * also kein neues Datenformat. Die Stufen −4 bis 4 sind die Quantile der Menschen
 * (engine/eigenstufen.ts): 0 wie der Median, ±2 wie die 5 % auffälligsten oder unauffälligsten.
 * Abhängigkeiten: engine/eigenstufen.ts, engine/fehlerart.ts, engine/blindeFlecken.ts,
 * engine/botstaerke.ts, i18n.
 */
import { BLINDE_FLECKEN, type BlinderFleck } from "../../engine/blindeFlecken";
import { staerkeGeschaetzt } from "../../engine/botstaerke";
import { naechsteStufe, REGLERARTEN, type Reglerstufen } from "../../engine/eigenstufen";
import { FEHLERARTEN, type Fehlerart } from "../../engine/fehlerart";
import type { EigenerGegner } from "../../engine/gegner";
import { t, type Textschluessel } from "../../i18n/sprache";

export type Profilart = Fehlerart | BlinderFleck;

/** Die Gruppen der Fehlerarten mit ihren Arten, in der Reihenfolge der Anzeige. */
export const FEHLERGRUPPEN = [
  {
    kennung: "material",
    arten: ["figurHaengen", "bauerEingestellt", "schlagreflex", "falscherAbtausch", "bauernraub"],
  },
  { kennung: "taktik", arten: ["taktikUebersehen", "drohungIgnoriert", "schlagVerpasst"] },
  {
    kennung: "koenig",
    arten: ["koenigMitte", "koenigsschild", "koenigPassiv", "koenigszugOhneNot", "pattGesetzt"],
  },
  {
    kennung: "eroeffnung",
    arten: ["verfruehteDame", "tempoverlust", "bauernvorstoss", "bauernzugOhneNot"],
  },
  { kennung: "allgemein", arten: ["ungenau"] },
] as const satisfies readonly { kennung: string; arten: readonly Fehlerart[] }[];

export type Fehlergruppe = (typeof FEHLERGRUPPEN)[number]["kennung"];

/** Stufen ohne Schalter „unmenschlich“ und mit; null heißt „aus“. */
export const STUFEN_MENSCHLICH: readonly (number | null)[] = [null, -2, -1, 0, 1, 2];
export const STUFEN_ALLE: readonly (number | null)[] = [null, -4, -3, -2, -1, 0, 1, 2, 3, 4];
/** Ab dieser Stufe (Betrag) liegt ein Wert außerhalb dessen, was echte Spieler zeigen. */
export const UNMENSCHLICH_AB = 3;
/** Wahl des Höchstverlusts in Bauern; null heißt unbegrenzt. */
export const VERLUSTWAHL: readonly (number | null)[] = [0.5, 1, 2, 3, null];

/** Hat die Art einen Regler (Daten der Spieler), oder lässt sie sich nur ein- und ausschalten? */
export function hatStufen(art: Profilart): boolean {
  return REGLERARTEN.includes(art);
}

function istFleck(art: Profilart): art is BlinderFleck {
  return (BLINDE_FLECKEN as readonly string[]).includes(art);
}

function istAn(g: EigenerGegner, art: Profilart): boolean {
  return istFleck(art) ? g.blindeFlecken.includes(art) : g.fehlerarten.includes(art);
}

/**
 * Die Stufen aller eingeschalteten Arten: gespeichert, sonst aus einem alten Gewicht übersetzt,
 * sonst 0. Beispiel: alter Gegner mit Gewicht 3 für Bauernraub → Stufe etwa 3.
 */
export function aktuelleStufen(g: EigenerGegner): Reglerstufen {
  const wertung = staerkeGeschaetzt(g);
  const aus: Partial<Record<Profilart, number>> = {};
  for (const art of REGLERARTEN) {
    if (!istAn(g, art)) continue;
    const gewicht = g.gewichte?.[art];
    aus[art] =
      g.reglerstufen?.[art] ?? (gewicht === undefined ? 0 : naechsteStufe(art, gewicht, wertung));
  }
  return aus;
}

/**
 * Die Stufe einer Art: null, wenn sie aus ist; bei Arten ohne Regler 0, wenn sie an ist.
 * Beispiel: „figurHaengen“ angehakt ohne gespeicherte Stufe → 0 („normal“).
 */
export function stufeVon(g: EigenerGegner, art: Profilart): number | null {
  if (!istAn(g, art)) return null;
  return hatStufen(art) ? (aktuelleStufen(g)[art] ?? 0) : 0;
}

/** Die Liste mit einer Art mehr oder weniger, in der festen Reihenfolge. */
function umgeschaltet<T extends string>(
  alle: readonly T[],
  liste: readonly T[],
  art: T,
  an: boolean,
) {
  return an ? alle.filter((a) => a === art || liste.includes(a)) : liste.filter((a) => a !== art);
}

/**
 * Setzt die Stufe einer Art (null schaltet sie aus). Ab dem ersten gesetzten Wert gelten Stufen,
 * alte freie Gewichte fallen weg (wie bisher im erweiterten Modus).
 * Beispiel: setzeStufe(g, "bauernraub", 2) → Bauernraub an, „sehr oft“.
 */
export function setzeStufe(g: EigenerGegner, art: Profilart, stufe: number | null): EigenerGegner {
  const an = stufe !== null;
  const neu: EigenerGegner = {
    ...g,
    fehlerarten: istFleck(art) ? g.fehlerarten : umgeschaltet(FEHLERARTEN, g.fehlerarten, art, an),
    blindeFlecken: istFleck(art)
      ? umgeschaltet(BLINDE_FLECKEN, g.blindeFlecken, art, an)
      : g.blindeFlecken,
  };
  if (!an || !hatStufen(art)) return neu;
  const mitStufe: EigenerGegner = { ...neu, reglerstufen: { ...aktuelleStufen(g), [art]: stufe } };
  delete (mitStufe as { gewichte?: unknown }).gewichte;
  return mitStufe;
}

/** Der Höchstverlust einer Art in Bauern, null für unbegrenzt. */
export function verlustVon(g: EigenerGegner, art: Fehlerart): number | null {
  return g.hoechstverlust?.[art] ?? null;
}

/** Setzt den Höchstverlust einer Art; null nimmt die Grenze weg (Vorgabe wie Menschen). */
export function setzeVerlust(
  g: EigenerGegner,
  art: Fehlerart,
  bauern: number | null,
): EigenerGegner {
  const uebrige = Object.entries(g.hoechstverlust ?? {}).filter(([a]) => a !== art);
  const eintraege = bauern === null ? uebrige : [...uebrige, [art, bauern] as const];
  return { ...g, hoechstverlust: Object.fromEntries(eintraege) };
}

/**
 * Eine Vorlage: Stufe je Fehlerart (fehlende Arten 0) und die blinden Flecken mit Stufe; `keine`:
 * alle Fehlerarten und Flecken aus, die Stufe spielt rein.
 */
interface Vorlage {
  readonly keine?: boolean;
  readonly alle?: number;
  readonly arten?: Readonly<Partial<Record<Fehlerart, number>>>;
  readonly flecken?: Readonly<Partial<Record<BlinderFleck, number>>>;
}

/** Vorlagen als Schnellstart; danach lässt sich jede Zeile einzeln nachstellen. */
export const VORLAGEN = {
  wieMenschen: {},
  solide: { alle: -1, arten: { figurHaengen: -2, taktikUebersehen: -2 } },
  leichtsinnig: { arten: { figurHaengen: 2, schlagreflex: 2, bauernraub: 1, drohungIgnoriert: 1 } },
  koenigsunsicher: { arten: { koenigMitte: 2, koenigsschild: 2, koenigPassiv: 1 } },
  taktischBlind: {
    arten: { taktikUebersehen: 2, drohungIgnoriert: 2 },
    flecken: { zwischenzug: 1, abzug: 1, roentgen: 1 },
  },
  fehlerfrei: { keine: true },
} as const satisfies Readonly<Record<string, Vorlage>>;

export type Vorlagenname = keyof typeof VORLAGEN;

/**
 * Wendet eine Vorlage an: alle Fehlerarten an mit der Stufe der Vorlage, nur die Flecken der
 * Vorlage an, Häufigkeit und Höchstverluste wie Menschen; „fehlerfrei“ schaltet alles aus.
 * Beispiel: „leichtsinnig“ → Figur hängen und Schlagreflex „sehr oft“, Rest „normal“.
 */
export function mitVorlage(g: EigenerGegner, name: Vorlagenname): EigenerGegner {
  const v: Vorlage = VORLAGEN[name];
  const stufen: Partial<Record<Profilart, number>> = {};
  for (const art of FEHLERARTEN) if (hatStufen(art)) stufen[art] = v.arten?.[art] ?? v.alle ?? 0;
  for (const [fleck, stufe] of Object.entries(v.flecken ?? {}))
    stufen[fleck as BlinderFleck] = stufe;
  const neu: EigenerGegner = {
    ...g,
    fehlerarten: v.keine ? [] : FEHLERARTEN,
    blindeFlecken: BLINDE_FLECKEN.filter((f) => v.flecken?.[f] !== undefined),
    reglerstufen: stufen,
    haeufigkeit: 1,
    hoechstverlust: {},
  };
  delete (neu as { gewichte?: unknown }).gewichte;
  return neu;
}

/** Ist der Gegner genau auf einer Vorlage (für die Markierung der Vorlage)? */
export function istVorlage(g: EigenerGegner, name: Vorlagenname): boolean {
  const soll = mitVorlage(g, name);
  const gleich = (art: Profilart) => stufeVon(g, art) === stufeVon(soll, art);
  return (
    (g.haeufigkeit ?? 1) === 1 &&
    Object.keys(g.hoechstverlust ?? {}).length === 0 &&
    FEHLERARTEN.every(gleich) &&
    BLINDE_FLECKEN.every(gleich)
  );
}

/** Kurzes Wort einer Stufe auf dem Schalter („oft“); null heißt „aus“. */
export function stufenwort(stufe: number | null): string {
  return t(
    stufe === null ? "spielen.profil.aus" : (`spielen.profil.stufe.${stufe}` as Textschluessel),
  );
}

/** Reihenfolge der blinden Flecken beim Weiterschalten (Fleckenkacheln.tsx); null heißt aus. */
const FLECKFOLGE: readonly (number | null)[] = [null, -1, 0, 1, 2];

/**
 * Die nächste Stufe eines Flecks nach einem Tipp; unbekannte (etwa unmenschliche) Stufen springen
 * auf aus. Beispiel: null → −1 („selten“), 2 → null.
 */
export function naechsterFleckstand(stufe: number | null): number | null {
  const stelle = FLECKFOLGE.indexOf(stufe);
  return stelle < 0 ? null : (FLECKFOLGE[(stelle + 1) % FLECKFOLGE.length] ?? null);
}
