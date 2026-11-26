/**
 * Auftritte (Befund des Autors, 26.11.2026): Eine Figur, deren Bedingung umschlägt, während der
 * Held auf ihrer Karte ist, erscheint nicht einfach neben ihm. Sie kommt durch einen Übergang der
 * Karte (Tür, Treppe, Kartenrand) herein und geht zu ihrem Feld; schlägt die Bedingung ins Falsche
 * um, geht sie sichtbar hinaus.
 *
 * Warum: „Ich habe meine erste Partie gegen den Coach beendet und gewonnen … und plötzlich stehen
 * Victoria und der Typ von Perfect Move im Raum.“ Die Karte filterte Figuren mit `wenn` nur beim
 * Aufbau (regeln/figurbedingung.ts); nach einer Partie, einer Runde oder einem Gespräch wird sie neu
 * aufgebaut, und wer neu dazukam, stand schon an seinem Platz.
 *
 * Wie: Die Oberwelt merkt sich, wer beim letzten Aufbau einer Karte wo stand (Aufstellung, beim
 * Abbau aus der Szene gelesen, oberwelt/auftrittsgedaechtnis.ts). Baut sie dieselbe Karte wieder
 * auf, vergleicht `auftrittsplan` beide Aufstellungen: Neue kommen herein, Fehlende gehen hinaus.
 * Eine Figur mit `auftritt.wartet` in orte.json steht, solange diese Bedingung gilt, unsichtbar am
 * Übergang, bis ein `#gehe` ihrer Erzählzeile sie hereinholt (Hale und {rivale} im Clubraum).
 * Rolle im Gesamtbild: reine Regeln ohne Phaser für oberwelt/useWeltladen.ts, oberwelt/weltdaten.ts
 * und oberwelt/auftrittsschicht.ts; dieselbe Regel prüft pipeline/abenteuer/auftritt.py.
 * Abhängigkeiten: regeln/bedingung.ts.
 */
import { erfuellt } from "./bedingung";

/** Ein Feld der Karte in Kachelkoordinaten. */
export interface Auftrittsfeld {
  readonly x: number;
  readonly y: number;
}

/** Wer beim letzten Aufbau einer Karte wo stand (nur sichtbare Figuren der Karte). */
export interface Aufstellung {
  readonly karte: string;
  readonly figuren: ReadonlyMap<string, Auftrittsfeld>;
}

/** Was die Szene beim Aufbau mit den Figuren tun soll. */
export interface Auftrittsplan {
  /** Neu auf der Karte: erscheinen am Übergang und gehen zu ihrem Feld. */
  readonly kommen: readonly string[];
  /** Nicht mehr auf der Karte: stehen noch, wo sie zuletzt standen, und gehen hinaus. */
  readonly gehen: readonly { readonly name: string; readonly feld: Auftrittsfeld }[];
  /** Warten unsichtbar am Übergang auf das `#gehe` ihrer Erzählzeile. */
  readonly wartend: readonly string[];
}

/** Kein Auftritt: erster Aufbau einer Karte, Neuladen, Warten. */
export const OHNE_AUFTRITT: Auftrittsplan = { kommen: [], gehen: [], wartend: [] };

/** Die Angabe `auftritt` einer Figur in orte.json, soweit diese Regel sie liest. */
export interface Auftrittsangabe {
  readonly von?: string;
  readonly wartet?: string;
}

/**
 * Die Figuren, die gerade unsichtbar warten: `auftritt.wartet` gilt.
 * Beispiel: haleClub mit wartet „nicht victorGesehen“, victorGesehen fehlt → ["haleClub"].
 * Eingaben: Objektnamen der Karte, Angabe je Name, Dialogvariablen. Wirft bei fehlerhafter Bedingung.
 */
export function wartendeFiguren(
  namen: readonly string[],
  angabeZu: (name: string) => Auftrittsangabe | undefined,
  variablen: Readonly<Record<string, unknown>>,
): string[] {
  return namen.filter((name) => {
    const wartet = angabeZu(name)?.wartet;
    return wartet !== undefined && erfuellt(wartet, variablen);
  });
}

/**
 * Vergleicht die letzte Aufstellung derselben Karte mit dem neuen Aufbau.
 * Eingaben: gemerkte Aufstellung (oder null), Kennung der Karte, Figuren des neuen Aufbaus (ohne die
 * nur zum Hinausgehen behaltenen), Figuren, die nur noch zum Hinausgehen stehen, Wartende, Geister
 * (sie blenden sich selbst ein und aus, regeln/geist.ts).
 * Beispiel: vorher Coach und Sam, jetzt Coach, Sam, Pratt → Pratt kommt; Hale wartet.
 * Sonderfall: andere Karte oder nichts gemerkt → OHNE_AUFTRITT (nur die Wartenden warten).
 */
export function auftrittsplan(
  vorher: Aufstellung | null,
  karte: string,
  lage: {
    readonly jetzt: readonly string[];
    readonly gehend: readonly string[];
    readonly wartend: readonly string[];
    readonly geister: ReadonlySet<string>;
  },
): Auftrittsplan {
  const wartend = [...lage.wartend];
  if (!vorher || vorher.karte !== karte) return { ...OHNE_AUFTRITT, wartend };
  const still = (name: string) => lage.geister.has(name) || wartend.includes(name);
  const kommen = lage.jetzt.filter((name) => !still(name) && !vorher.figuren.has(name));
  const gehen = lage.gehend.flatMap((name) => {
    const feld = vorher.figuren.get(name);
    return feld && !still(name) ? [{ name, feld }] : [];
  });
  return { kommen, gehen, wartend };
}

/**
 * Die Figuren, die nur noch zum Hinausgehen auf der Karte bleiben: Sie standen beim letzten Aufbau
 * dieser Karte, ihre Bedingung gilt nicht mehr.
 * Beispiel: Pratt stand da, heimwegNadelGesehen ist jetzt wahr → ["prattClub"].
 */
export function gehendeFiguren(
  vorher: Aufstellung | null,
  karte: string,
  wennZu: (name: string) => string | undefined,
  variablen: Readonly<Record<string, unknown>>,
): string[] {
  if (!vorher || vorher.karte !== karte) return [];
  return [...vorher.figuren.keys()].filter((name) => {
    const wenn = wennZu(name);
    return wenn !== undefined && !erfuellt(wenn, variablen);
  });
}

/** Ein Übergang der Karte mit seinem Feld. */
export interface Uebergangsfeld extends Auftrittsfeld {
  readonly name: string;
}

/** Abstand in vier Richtungen (Felder). */
const abstand = (a: Auftrittsfeld, b: Auftrittsfeld) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

/**
 * Durch welches Feld kommt oder geht eine Figur? Das Feld des Übergangs `von`, sonst das des
 * nächsten Übergangs zu ihrem Feld; schon vergebene Felder (`belegt`, „x,y“) nur, wenn es kein
 * anderes gibt.
 * Beispiel: Clubraum, Tür „schule“ auf 13,14 und 14,14, Hale nach 18,5 → 14,14; Victor danach → 13,14.
 * Sonderfall: Karte ohne Übergang → null (die Figur blendet sich an ihrem Platz ein oder aus).
 */
export function eingangsfeld(
  ziel: Auftrittsfeld,
  uebergaenge: readonly Uebergangsfeld[],
  von?: string,
  belegt: ReadonlySet<string> = new Set(),
): Auftrittsfeld | null {
  const genannt = von ? uebergaenge.filter((u) => u.name === von) : [];
  const kandidaten = genannt.length > 0 ? genannt : uebergaenge;
  const sortiert = [...kandidaten].sort((a, b) => abstand(a, ziel) - abstand(b, ziel));
  const frei = sortiert.find((u) => !belegt.has(`${u.x},${u.y}`));
  const feld = frei ?? sortiert[0];
  return feld ? { x: feld.x, y: feld.y } : null;
}

/** Was ladeWelt über die Auftritte weiß (der Vergleich mit dem Gedächtnis folgt in useWeltladen). */
export interface Weltauftritt {
  readonly wartend: readonly string[];
  /** Nur zum Hinausgehen behalten (gehendeFiguren), soweit noch auf der Karte. */
  readonly gehend: readonly string[];
  /** Übergang je Figur aus orte.json (`auftritt.von`). */
  readonly von: Readonly<Record<string, string>>;
}

/**
 * Wartende, Gehende und Übergang je Figur einer aufgebauten Karte.
 * Beispiel: Clubraum nach dem Clubkampf → wartend [haleClub, victorClub], gehend [], von {}.
 */
export function weltauftritt(
  namen: readonly string[],
  angabeZu: (name: string) => Auftrittsangabe | undefined,
  lage: {
    readonly gehend: readonly string[];
    readonly variablen: Readonly<Record<string, unknown>>;
  },
): Weltauftritt {
  const von: Record<string, string> = {};
  for (const name of namen) {
    const ueber = angabeZu(name)?.von;
    if (ueber) von[name] = ueber;
  }
  return {
    wartend: wartendeFiguren(namen, angabeZu, lage.variablen),
    gehend: lage.gehend.filter((n) => namen.includes(n)),
    von,
  };
}
