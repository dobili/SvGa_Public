/**
 * Die Wegsperren S15 bis S17 des Schach-Abenteuers als Tabelle für die Oberflächentests, dazu die
 * gemeinsamen Schritte: Spielstand vor der Sperre, bis an den Übergang gehen, Fenster wegklicken.
 *
 * Warum: Alle drei Sperren laufen gleich ab (docs/spiel/32_Wegsperren.md, Abschnitt 0): Am
 * Übergang steht das Testteam, eine kurze Partie öffnet. Die Tests unterscheiden sich nur in
 * Karte, Richtung, Sätzen, Variablen und darin, ob ein Remis öffnet (S15, S16) oder als
 * Fehlversuch zählt (S17, „Endspiel gewinnen“); das steht hier an einer Stelle.
 * Abhängigkeiten: abenteuer-affe.ts (Spielstand), abenteuer-karte.ts (Felder aus den Karten).
 * Beispiel: SPERREN.s16 → Raststätte, Übergang „weiterGlasbruecke“ am Westrand, Imani spielt.
 */
import { expect, type Locator, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND } from "./abenteuer-affe";
import { feldVon } from "./abenteuer-karte";

/** Eine Wegsperre mit allem, was die Tests von ihr wissen müssen. */
export interface Sperre {
  /** Nummer aus dem Konzept, für den Namen des Tests. */
  readonly nr: string;
  /** Karte (Dateiname ohne Endung) und Kennung des Orts. */
  readonly karte: string;
  readonly ort: string;
  readonly uebergang: string;
  /** Taste zum Übergang und Schritt je Kachel in x (+1 nach rechts, −1 nach links). */
  readonly taste: "ArrowRight" | "ArrowLeft";
  readonly schritt: 1 | -1;
  /** Figur unter dem Weg; der Held geht in der Reihe direkt über ihr. */
  readonly unten: string;
  /** So viele Kacheln vor dem Übergang beginnt der Held. */
  readonly anlauf: number;
  /** Dialogvariablen, mit denen die Truppe dasteht. */
  readonly voraussetzung: Readonly<Record<string, boolean>>;
  /** Stamm der Variablen („testteamWald“ → testteamWaldDurch, …Gesehen, …Niederlagen). */
  readonly stamm: string;
  /** Stichworte aus dem ersten Treffen, dem Angebot und der Antwort auf „Später.“. */
  readonly erste: string;
  readonly angebot: string;
  readonly spaeter: string;
  /** Meldungen nach dem ersten Gespräch, in dieser Reihenfolge. */
  readonly meldungen: readonly string[];
  /** Ortsschild hier und hinter dem Übergang. */
  readonly schild: string;
  readonly zielschild: string;
  /** Erzählt der offene Übergang etwas (S16: die Glasbrücke), dann ein Stichwort daraus. */
  readonly zielerzaehlung?: string;
  /** Die Partie: eigene Züge bis zur Wertung, Stichworte des Einstiegs und je Ausgang. */
  readonly zuege: number;
  readonly einstieg: string;
  readonly nachher: Readonly<Record<"sieg" | "remis" | "niederlage", string>>;
  /** Stichworte der Truppe danach: durchgelassen, verloren, dritter Fehlversuch. */
  readonly durch: string;
  readonly verloren: string;
  readonly genug: string;
  /**
   * Nur wo ein Remis nicht öffnet (S17): Stichwort der Truppe nach einem Remis. Fehlt es, öffnet
   * das Remis wie der Sieg (S15, S16).
   */
  readonly remisZu?: string;
  /** Zielwert des Spielers für ein Remis (Bauern, aus Sicht des Lesers). */
  readonly remiswert: number;
  /**
   * Schwellen der Wertung in Bauern (regeln/kurzform.ts): ab `sieg` gewonnen, ab `remis` Remis
   * (beim Endspiel knapp darüber), darunter verloren.
   */
  readonly schwellen: { readonly sieg: number; readonly remis: number };
}

/** Ein Ausgang der Partie aus Sicht des Lesers. */
export type Ausgang = "sieg" | "remis" | "niederlage";

/**
 * Zählt dieser Ausgang an der Sperre als Fehlversuch (Sperre bleibt zu, Zähler steigt)?
 * Beispiel: Remis an S16 → nein (öffnet); Remis an S17 → ja (dort öffnet nur der Sieg).
 */
export function istFehlversuch(sperre: Sperre, ausgang: Ausgang): boolean {
  return ausgang === "niederlage" || (ausgang === "remis" && sperre.remisZu !== undefined);
}

/** Der Satz der Truppe nach einem Fehlversuch mit diesem Ausgang (Remis an S17: eigener Satz). */
export function fehlversuchssatz(sperre: Sperre, ausgang: Ausgang): string {
  return ausgang === "remis" && sperre.remisZu ? sperre.remisZu : sperre.verloren;
}

/** Die drei Sperren und die Neon-Fassung des Diners (dieselbe Sperre auf der zweiten Karte). */
const S17: Sperre = {
  nr: "S17 am Diner",
  karte: "weg-desert-summit-diner",
  ort: "wegDesertSummit.diner",
  uebergang: "weiterBergstrasse",
  taste: "ArrowLeft",
  schritt: -1,
  unten: "testteamImani",
  anlauf: 6,
  voraussetzung: { endeAkt3Gesehen: true },
  stamm: "testteamGitter",
  erste: "Viehgitter",
  angebot: "Ein Endspiel, fünfzehn Züge",
  spaeter: "Das Gitter liegt morgen auch noch hier.",
  meldungen: ["Neu im Tagebuch: Die Wahrheit des Endspiels"],
  schild: "Diner an der Wüstenstraße",
  zielschild: "Bergstraße",
  zuege: 15,
  einstieg: "Zoe will die Damen behalten",
  nachher: {
    sieg: "Dein Mehrbauer hat gereicht",
    remis: "Der Bauer ist noch da",
    niederlage: "Der Mehrbauer ist weg",
  },
  durch: "Ehrlich gespielt",
  verloren: "Das zähle ich nicht mehr",
  genug: "Dreimal ehrlich versucht",
  remisZu: "Gehalten ist nicht gewonnen",
  remiswert: 0,
  schwellen: { sieg: 3, remis: -1.5 },
};

export const SPERREN = {
  s15: {
    nr: "S15 im Zedernwald",
    karte: "weg-cedar-riverton-zedernwald",
    ort: "wegCedarRiverton.zedernwald",
    uebergang: "weiterBahndamm",
    taste: "ArrowRight",
    schritt: 1,
    unten: "testteamBenji",
    anlauf: 4,
    voraussetzung: { endeAkt1Gesehen: true },
    stamm: "testteamWald",
    erste: "Klapptisch",
    angebot: "Zehn Züge gegen Benji",
    spaeter: "Der Wald läuft nicht weg.",
    meldungen: ["Neu im Tagebuch: Der letzte Tisch", "Neu im Tagebuch: Das Testteam"],
    schild: "Zedernwald",
    zielschild: "Am Bahndamm",
    zuege: 10,
    einstieg: "Eine Gabel",
    nachher: {
      sieg: "Die Gabel war gut",
      remis: "Unentschieden ist auch ein Datenpunkt",
      niederlage: "Er beißt in seinen Apfel",
    },
    durch: "Das war ich. Nicht das Tablet.",
    verloren: "Datenpunkt 4113",
    genug: "Drei Datenpunkte von derselben Person",
    remiswert: 0.1,
    schwellen: { sieg: 1, remis: 0 },
  },
  s16: {
    nr: "S16 an der Raststätte",
    karte: "weg-ironwood-silicon-raststaette",
    ort: "wegIronwoodSilicon.raststaette",
    uebergang: "weiterGlasbruecke",
    taste: "ArrowLeft",
    schritt: -1,
    unten: "testteamImani",
    anlauf: 5,
    voraussetzung: { einladungGesehen: true },
    stamm: "testteamBruecke",
    erste: "Am Brückenkopf",
    angebot: "Zwölf Züge gegen Imani",
    spaeter: "Sie hält auch noch morgen.",
    meldungen: ["Neu im Tagebuch: Die Stadt aus Glas"],
    schild: "Raststätte an der Schnellstraße",
    zielschild: "Glasbrücke",
    zielerzaehlung: "Der Boden, das Geländer, alles.",
    zuege: 12,
    einstieg: "Imani antwortet auf deinen Springer",
    nachher: {
      sieg: "Du hast einfach deine Figuren herausgebracht",
      remis: "Du bist nicht hereingefallen",
      niederlage: "Imanis Figuren stehen besser",
    },
    durch: "Das war meine Variante",
    verloren: "Datenpunkt 19870",
    genug: "Drei Datenpunkte von derselben Person",
    remiswert: 0.1,
    schwellen: { sieg: 1, remis: 0 },
  },
  s17: S17,
  s17neon: {
    ...S17,
    nr: "S17 am Diner mit Neonschild",
    karte: "weg-desert-summit-diner-neon",
    voraussetzung: { ...S17.voraussetzung, neonRepariert: true },
  },
} as const satisfies Record<string, Sperre>;

/** Höchstens so viele Schritte bis zum Rand, so viele Fenster hintereinander. */
const MAX_SCHRITTE = 12;
const MAX_FENSTER = 30;
/** So lange muss die Welt frei sein, bis kein Fenster mehr nachkommt. */
const RUHE_MS = 700;
/** So lange wartet ein Griff nach einem Fenster, das gerade verschwindet. */
const KLICK_MS = 1500;

/** Reihe des Wegs direkt über der Figur, die unter dem Weg steht. */
export function wegreihe(sperre: Sperre): number {
  return feldVon(sperre.karte, sperre.unten).y - 1;
}

/** Kachel des Übergangs in der Wegreihe („x,y“) und die letzte Kachel davor. */
export function uebergangskachel(sperre: Sperre): string {
  return `${feldVon(sperre.karte, sperre.uebergang).x},${wegreihe(sperre)}`;
}
export function randkachel(sperre: Sperre): string {
  const x = feldVon(sperre.karte, sperre.uebergang).x - sperre.schritt;
  return `${x},${wegreihe(sperre)}`;
}
export function startkachel(sperre: Sperre): { x: number; y: number } {
  const x = feldVon(sperre.karte, sperre.uebergang).x - sperre.schritt * sperre.anlauf;
  return { x, y: wegreihe(sperre) };
}

/**
 * Spielstand vor der Sperre: Die Truppe steht da, der Held ein paar Kacheln vor dem Übergang.
 * Beispiel: standVor(SPERREN.s15, { testteamWaldDurch: true }) → offene Sperre im Zedernwald.
 */
export function standVor(sperre: Sperre, variablen: Record<string, boolean | number> = {}): object {
  return {
    ...GRUNDSTAND,
    position: {
      karte: sperre.ort,
      ...startkachel(sperre),
      richtung: sperre.schritt === 1 ? "rechts" : "links",
    },
    dialogvariablen: { ...EINLEITUNG_GESEHEN, ...sperre.voraussetzung, ...variablen },
  };
}

/**
 * Bildschirmfoto für die Durchsicht, nur wenn die Umgebungsvariable FOTO_ORDNER gesetzt ist
 * (sonst geschieht nichts). Beispiel: FOTO_ORDNER=/tmp/fotos → /tmp/fotos/s16_gespraech.png.
 * Die Tests, die Fotos machen, stellen dafür mit FOTO_MASSSTAB das Pixelverhältnis 2 ein.
 */
export async function foto(seite: Page, name: string): Promise<void> {
  const ordner = process.env.FOTO_ORDNER;
  if (ordner) await seite.screenshot({ path: `${ordner}/${name}.png` });
}

/** Pixelverhältnis der Fotos; ohne FOTO_ORDNER gilt das des Geräts aus der Playwright-Einstellung. */
export const FOTO_MASSSTAB = process.env.FOTO_ORDNER ? { deviceScaleFactor: 2 } : {};

/** Kurzname einer Sperre für Dateinamen: „S17 am Diner mit Neonschild“ → „s17_am_diner_mit_neonschild“. */
export function dateiname(sperre: Sperre): string {
  return sperre.nr.toLowerCase().replaceAll(" ", "_").replaceAll("ä", "ae");
}

/** Die Kachel des Helden („x,y“) aus dem versteckten Feld der Oberwelt. */
export async function kachel(seite: Page): Promise<string> {
  return (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "";
}

/** Geht Kachel für Kachel bis zur letzten Kachel vor dem Übergang. */
export async function geheZumRand(seite: Page, sperre: Sperre): Promise<void> {
  const rand = randkachel(sperre);
  for (let i = 0; i < MAX_SCHRITTE && (await kachel(seite)) !== rand; i++) {
    const vorher = await kachel(seite);
    await seite.keyboard.down(sperre.taste);
    try {
      await expect.poll(() => kachel(seite), { timeout: 3000, intervals: [20] }).not.toBe(vorher);
    } finally {
      await seite.keyboard.up(sperre.taste);
    }
    // Der Held beendet den angefangenen Schritt; erst danach zählt die Kachel.
    await seite.waitForTimeout(150);
  }
  await expect.poll(() => kachel(seite), { timeout: 2000 }).toBe(rand);
}

/**
 * Klickt Dialog, Ergebniskarte und Meldungen weg, bis die Welt frei ist, und gibt alle gelesenen
 * Texte zurück. Bei einer Auswahl nimmt sie die Antwort `wahl`, sonst die letzte („Später.“).
 * Mit `bis` hört sie auf, sobald dieses Element zu sehen ist (etwa die Deckwahl vor der Partie:
 * unter ihr liegt eine Meldung, die sich nicht anklicken lässt).
 * Beispiel: klickeDurch(seite, "„Nicht jetzt.“") nach einer Niederlage → Texte der Truppe.
 */
export async function klickeDurch(seite: Page, wahl?: string, bis?: Locator): Promise<string> {
  const fenster = seite.locator(
    "[data-testid='abenteuer-dialog'], [data-testid='abenteuer-ergebnis'], [data-testid='abenteuer-meldung']",
  );
  const texte: string[] = [];
  let freiSeit = Date.now();
  let geklickt = 0;
  while (geklickt < MAX_FENSTER && Date.now() - freiSeit < RUHE_MS) {
    if (bis && (await bis.isVisible().catch(() => false))) break;
    const oben = fenster.last();
    if (!(await oben.isVisible().catch(() => false))) {
      await seite.waitForTimeout(100);
      continue;
    }
    geklickt++;
    texte.push((await oben.innerText({ timeout: KLICK_MS }).catch(() => "")).replace(/\s+/g, " "));
    const gewollt = wahl ? oben.getByRole("button", { name: wahl }) : null;
    const knopf =
      gewollt && (await gewollt.isVisible().catch(() => false))
        ? gewollt
        : oben.getByRole("button").last();
    // Das Fenster kann zwischen Lesen und Klicken wechseln; dann zählt der nächste Durchgang.
    await knopf.click({ timeout: KLICK_MS }).catch(() => undefined);
    await seite.waitForTimeout(150);
    freiSeit = Date.now();
  }
  return texte.join(" | ");
}
