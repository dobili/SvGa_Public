/**
 * Ordnung der Werkzeuge auf dem Abbildung-Bildschirm: Symbole am Brett, Bündel in der Leiste,
 * Reiter im Bündel, und welche davon ein Kapitel zeigt.
 *
 * Rolle im Gesamtbild: Werkzeug-Umbau 0.2.30 nach Vorschlag C in
 * `VORSCHLAEGE_0.2.26.md` (im privaten Archiv-Repository), mit den Entscheidungen des Autors vom
 * 15.10.2026:
 * - Am Brett stehen als Symbole Zählen, Ziehen, Engine, Röntgen (ab Kapitel 1) und Warnsignale
 *   (Kapitel 4 bis 6 W1–W5, ab Kapitel 7 W1–W7), sobald das Buch sie eingeführt hat. „Zählen“
 *   steht seit 0.2.31 am Brett statt in der Leiste (Wunsch des Autors: es ist immer da und
 *   arbeitet mit dem Brett), auch bei Lehrbildern ohne König.
 * - Die Leiste unter dem Brett zeigt Bündel statt Einzelwerkzeuge, ein Knopf je Verfahren des
 *   Buches; die Teile schaltet man in der Karte wie Reiter um, in der Reihenfolge des Buches.
 * - In jedem Kapitel zuerst nur die Bündel, die das Kapitel behandelt; „◀ frühere“ und
 *   „spätere ▶“ schalten die übrigen zu, spätere als Vorschau.
 * - Die Bündel stehen in der Reihenfolge, in der das Buch sie einführt (seit 0.2.31, Wunsch des
 *   Autors: „◀ frühere“ und „spätere ▶“ fügen hinzu, ohne die Reihenfolge der schon gezeigten
 *   Knöpfe zu ändern; bis 0.2.30 galt die Reihenfolge der Denkroutine).
 * Die Kennungen der Werkzeuge (k1-roentgen …) bleiben, damit vorbereitete Texte und Tests
 * weiter passen. Abhängigkeiten: analyse/register.ts, i18n.
 */
import { werkzeugeFuer } from "../../analyse/register";
import type { Textschluessel } from "../../i18n/sprache";
import type { Werkzeugwahl } from "./Werkzeugleiste";

/** Letztes Kapitel des Buches: bis dahin sind alle Werkzeuge angemeldet. */
const LETZTES_KAPITEL = 12;
/** Kapitel, ab dem die Warnsignale am Brett stehen (Kapitel 4) und ab dem W1–W7 gilt (Kapitel 7). */
const WARNSIGNALE_AB = 4;
const SIEBEN_SIGNALE_AB = 7;
const ROENTGEN_AB = 1;

export type Buendelkennung =
  | "denkroutine"
  | "eroeffnung"
  | "angriffsregel"
  | "skelett"
  | "planfindung"
  | "endspiel"
  | "taktik"
  | "fallencheck";

interface Buendelvorlage {
  readonly kennung: Buendelkennung;
  readonly name: Textschluessel;
  readonly teile: readonly Werkzeugwahl[];
  /**
   * Die Kapitel, deren Thema das Bündel ist. Ausdrücklich festgelegt und nicht aus den Teilen
   * abgeleitet: Die Planfindung enthält die Angriffsregel aus Kapitel 1, gehört aber zu Kapitel 6;
   * Kapitel 10 (Studien) zeigt das Endspiel-Bündel (Entscheidung des Autors), Kapitel 11 die
   * Denkroutine, weil „Phase“ Teil von Schritt 1 ist.
   */
  readonly kapitel: readonly number[];
}

/**
 * Die Bündel in der Reihenfolge ihrer Einführung im Buch (Kapitel 1: Todsünden in 1.2 vor der
 * Angriffsregel in 1.6), die Teile in der Reihenfolge des Buches. Ein Test prüft die Reihenfolge.
 * Planfindung: die Angriffsregel steht bei „Wo?“ (Vorschlag C, Kapitel 6).
 */
const BUENDEL: readonly Buendelvorlage[] = [
  {
    kennung: "eroeffnung",
    name: "buendel.eroeffnung",
    teile: ["k1-todsuenden", "k2-zielbilanz", "k3-faktorenbilanz", "k2-eroeffnung"],
    kapitel: [1, 2, 3],
  },
  {
    kennung: "angriffsregel",
    name: "werkzeug.k1-angriffsregel.name",
    teile: ["k1-angriffsregel"],
    kapitel: [1],
  },
  {
    kennung: "fallencheck",
    name: "buendel.fallencheck",
    teile: ["k4-prueffragen", "k4-falle"],
    kapitel: [4],
  },
  {
    kennung: "skelett",
    name: "buendel.skelett",
    teile: ["k5-vorher", "k5-felder", "k5-bauern", "k5-richtung", "k5-figuren"],
    kapitel: [5],
  },
  {
    kennung: "planfindung",
    name: "buendel.planfindung",
    teile: ["k6-wo", "k1-angriffsregel", "k6-gegner", "k6-lap", "k6-planbilanz"],
    kapitel: [6],
  },
  {
    kennung: "taktik",
    name: "buendel.taktik",
    teile: ["k7-erzwingend", "k7-ruhe", "k7-motiv"],
    kapitel: [7],
  },
  {
    kennung: "endspiel",
    name: "buendel.endspiel",
    teile: [
      "k8-regeln",
      "k8-opposition",
      "k8-schluesselfelder",
      "k8-quadrat",
      "k8-elementarmatt",
      "k9-turmbegriffe",
      "k9-erkennungsbilder",
    ],
    kapitel: [8, 9, 10],
  },
  {
    kennung: "denkroutine",
    name: "buendel.denkroutine",
    teile: ["k12-erfassen", "k11-phase", "k12-kandidaten", "k12-sicherheitsblick"],
    kapitel: [11, 12],
  },
];

/** Namen der Wahlen, die kein Werkzeug des Verzeichnisses sind. */
const EIGENE_NAMEN: ReadonlyMap<string, Textschluessel> = new Map([
  ["ziehen", "werkzeug.ziehen.name"],
  ["engine", "werkzeug.engine.name"],
]);
/** Namen der Werkzeuge aus dem Verzeichnis. */
const NAMEN: ReadonlyMap<string, Textschluessel> = new Map(
  werkzeugeFuer(LETZTES_KAPITEL).map((w) => [w.id, w.name] as const),
);

/** Name einer Wahl für Knöpfe und Reiter. Beispiel: „k7-erzwingend“ → „Erzwingende Züge“. */
export function werkzeugname(wahl: Werkzeugwahl): Textschluessel {
  return NAMEN.get(wahl) ?? EIGENE_NAMEN.get(wahl) ?? "werkzeug.k1-zaehlen.name";
}

/** Kapitel jedes Werkzeugs aus dem Verzeichnis; „Zählen“, „Ziehen“ und „Engine“ gelten ab 1. */
const KAPITEL_DES_WERKZEUGS: ReadonlyMap<string, number> = new Map(
  werkzeugeFuer(LETZTES_KAPITEL).map((w) => [w.id, w.kapitel] as const),
);

/** Kapitel, in dem das Buch ein Werkzeug einführt. */
export function kapitelVon(wahl: Werkzeugwahl): number {
  return KAPITEL_DES_WERKZEUGS.get(wahl) ?? 1;
}

/** Ein Teil (Reiter) eines Bündels, wie die Karte ihn zeigt. */
export interface Teil {
  readonly wahl: Werkzeugwahl;
  readonly kapitel: number;
  /** Erst in einem späteren Kapitel eingeführt: mit Plakette „Vorschau“. */
  readonly vorschau: boolean;
}

/** Ein Bündel, wie die Leiste es zeigt. */
export interface Leistenbuendel {
  readonly kennung: Buendelkennung;
  readonly name: Textschluessel;
  /** Kapitel, in dem das Buch das Bündel einführt (sein frühestes Werkzeug). */
  readonly einfuehrung: number;
  /** Erst in einem späteren Kapitel eingeführt: mit Plakette „Kap. N“. */
  readonly vorschau: boolean;
}

/** Wie ein Bündel zum Kapitel steht: Thema des Kapitels, früher eingeführt, später eingeführt. */
type Bezug = "kapitel" | "frueher" | "spaeter";

/** Kapitel, in dem das Buch das Bündel einführt (das erste seiner Kapitel). */
export function einfuehrungVon(vorlage: Buendelvorlage): number {
  return Math.min(...vorlage.kapitel);
}

function bezug(vorlage: Buendelvorlage, kapitel: number): Bezug {
  if (vorlage.kapitel.includes(kapitel)) return "kapitel";
  return einfuehrungVon(vorlage) < kapitel ? "frueher" : "spaeter";
}

/** Was die Leiste eines Kapitels zeigt, und ob es frühere oder spätere Bündel gibt. */
export interface Leiste {
  readonly buendel: readonly Leistenbuendel[];
  readonly hatFruehere: boolean;
  readonly hatSpaetere: boolean;
}

/**
 * Die Bündel der Leiste für ein Kapitel.
 *
 * Eingaben: Kapitel der Abbildung, ob frühere und spätere zugeschaltet sind, ob die Stellung
 * Regeln hat (Lehrbilder ohne König, Kapitel 0 und 5, haben keine Bündel).
 * Beispiel: Kapitel 6 → Planfindung; mit „◀ frühere“ davor Eröffnung prüfen, Angriffsregel,
 * Fallencheck und Skelett-Röntgen; mit „spätere ▶“ dahinter Taktik, Endspiel und Denkroutine
 * als Vorschau.
 */
export function leiste(
  kapitel: number,
  zugeschaltet: { readonly frueher: boolean; readonly spaeter: boolean },
  mitRegeln: boolean,
): Leiste {
  const vorlagen = mitRegeln ? BUENDEL : [];
  const mitBezug = vorlagen.map((vorlage) => ({ vorlage, bezug: bezug(vorlage, kapitel) }));
  const sichtbar = mitBezug.filter(
    ({ bezug: b }) =>
      b === "kapitel" ||
      (b === "frueher" && zugeschaltet.frueher) ||
      (b === "spaeter" && zugeschaltet.spaeter),
  );
  return {
    buendel: sichtbar.map(({ vorlage, bezug: b }) => ({
      kennung: vorlage.kennung,
      name: vorlage.name,
      einfuehrung: einfuehrungVon(vorlage),
      vorschau: b === "spaeter",
    })),
    hatFruehere: mitBezug.some(({ bezug: b }) => b === "frueher"),
    hatSpaetere: mitBezug.some(({ bezug: b }) => b === "spaeter"),
  };
}

const VORLAGEN: ReadonlyMap<Buendelkennung, Buendelvorlage> = new Map(
  BUENDEL.map((b) => [b.kennung, b] as const),
);

function vorlageVon(kennung: Buendelkennung): Buendelvorlage {
  const vorlage = VORLAGEN.get(kennung);
  if (!vorlage) throw new Error(`Unbekanntes Bündel: ${kennung}`);
  return vorlage;
}

/** Name eines Bündels. Beispiel: „eroeffnung“ → „Eröffnung prüfen“. */
export function buendelname(kennung: Buendelkennung): Textschluessel {
  return vorlageVon(kennung).name;
}

/**
 * Die Reiter eines Bündels für ein Kapitel: bis zum Kapitel eingeführte Teile, spätere nur mit
 * „spätere ▶“ (als Vorschau). Ist das ganze Bündel später eingeführt, zeigt es alle Teile.
 * Beispiel: Eröffnung prüfen in Kapitel 2 → Todsünden, Zielbilanz, Eröffnung (Faktorenbilanz erst
 * ab Kapitel 3).
 */
export function teileVon(kennung: Buendelkennung, kapitel: number, spaeter: boolean): Teil[] {
  const teile = vorlageVon(kennung).teile.map((wahl) => ({
    wahl,
    kapitel: kapitelVon(wahl),
    vorschau: kapitelVon(wahl) > kapitel,
  }));
  const ganzSpaeter = teile.every((teil) => teil.vorschau);
  return ganzSpaeter || spaeter ? teile : teile.filter((teil) => !teil.vorschau);
}

/**
 * Der Reiter, den ein Tipp auf das Bündel öffnet: das erste Werkzeug des Kapitels, sonst das
 * erste schon eingeführte, sonst das erste überhaupt (Vorschau).
 * Beispiel: Eröffnung prüfen in Kapitel 3 → Faktorenbilanz; in Kapitel 7 → Todsünden.
 */
export function ersterTeil(kennung: Buendelkennung, kapitel: number): Werkzeugwahl {
  const alle = teileVon(kennung, kapitel, false);
  const desKapitels = alle.find((teil) => teil.kapitel === kapitel);
  const eingefuehrt = alle.find((teil) => !teil.vorschau);
  return (desKapitels ?? eingefuehrt ?? alle[0])?.wahl ?? "zaehlen";
}

/** Die Bündel, in denen ein Werkzeug als Reiter vorkommt (die Angriffsregel in zweien). */
export function buendelMit(wahl: Werkzeugwahl): Buendelkennung[] {
  return BUENDEL.filter((b) => b.teile.includes(wahl)).map((b) => b.kennung);
}

/** Ein Symbol am Brett. */
export interface Brettsymbol {
  readonly wahl: Werkzeugwahl;
  readonly name: Textschluessel;
  /** Kurzes Wort unter dem Symbol (DS5), Teil des Namens für Bildschirmleser. */
  readonly kurz: Textschluessel;
}

/**
 * Die Symbole am Brett eines Kapitels: Zählen immer, Ziehen und Engine (nur mit Regeln), Röntgen
 * ab Kapitel 1, Warnsignale ab Kapitel 4 (bis Kapitel 6 W1–W5, danach W1–W7, Vorschlag C: „Es
 * bleibt ein Werkzeug“). Beispiel: Kapitel 7 → Zählen, Ziehen, Engine, Röntgen, W1–W7; ein
 * Lehrbild ohne König → nur Zählen.
 */
export function brettsymbole(kapitel: number, mitRegeln: boolean): Brettsymbol[] {
  const zaehlen: Brettsymbol = {
    wahl: "zaehlen",
    name: "werkzeug.k1-zaehlen.name",
    kurz: "werkzeug.k1-zaehlen.kurz",
  };
  if (!mitRegeln) return [zaehlen];
  const symbole: Brettsymbol[] = [
    zaehlen,
    { wahl: "ziehen", name: "werkzeug.ziehen.name", kurz: "werkzeug.ziehen.kurz" },
    { wahl: "engine", name: "werkzeug.engine.name", kurz: "werkzeug.engine.kurz" },
  ];
  if (kapitel >= ROENTGEN_AB)
    symbole.push({
      wahl: "k1-roentgen",
      name: "werkzeug.k1-roentgen.name",
      kurz: "werkzeug.k1-roentgen.kurz",
    });
  if (kapitel >= SIEBEN_SIGNALE_AB)
    symbole.push({
      wahl: "k7-warnsignale",
      name: "werkzeug.k7-warnsignale.name",
      kurz: "werkzeug.k7-warnsignale.kurz",
    });
  else if (kapitel >= WARNSIGNALE_AB)
    symbole.push({
      wahl: "k4-warnsignale",
      name: "werkzeug.k4-warnsignale.name",
      kurz: "werkzeug.k4-warnsignale.kurz",
    });
  return symbole;
}
