/**
 * Blickprobe (Auftrag des Hauptchats, 24.11.2026): jeden Blickpunkt aus ambrose_blickpunkte.json im
 * Spiel ablaufen. Je Punkt ein frischer Browser mit dem Stand der Gesamtsimulation in dem
 * Augenblick, in dem der Punkt fällig wurde (pipeline/abenteuer/blickstaende.cjs), der Held einige
 * Schritte außerhalb des Radius; er geht mit dem Steuerkreuz hinein (laufen.ts).
 * Geprüft wird: Löst der Punkt im Vorbeigehen aus (Dialog „Ambrose“, der richtige Knoten als
 * gesehen)? Steht der Geist auf einem Nachbarfeld (`data-begleiter`)? Sind die Antworten Gedanken?
 * Ist der Geist danach weg, und kommt der Punkt nicht noch einmal, auch nach der Pause von 30
 * Sekunden? Dazu je Punkt ein Foto der Seite und ein Ausschnitt um die Stelle (Sichtprüfung: Ist
 * das Ding gut zu sehen?).
 * Andere Blickpunkte derselben Karte gelten als gesehen, damit nur dieser auslösen kann.
 * Aufruf (nach npm run build mit privatem Paket; Stände vorher mit blickstaende.cjs):
 *   BLICK_STAENDE=ORDNER BLICK_FOTOS=ORDNER CHROMIUM_PFAD=… \
 *   npx playwright test --config playwright.durchlauf.config.ts blickprobe
 * Weiter: BLICK_NUR=teil,des,knotens; BLICK_TEIL=2/3 (jeder dritte, für parallele Läufe gegen
 * denselben Server); BLICK_FORMAT=quer; BLICK_DOPPELT_MS (Vorgabe 33000, 0 lässt die Prüfung aus).
 * Ergebnis: BLICK_FOTOS/ergebnis-<teil>.jsonl, eine Zeile je Punkt. Fotos nur lokal oder privat.
 * Abhängigkeiten: blickprobe.ts, simstand.ts, welt.ts, laufen.ts, lage.ts, e2e/abenteuer-affe.ts.
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, devices, test, type Browser, type Page } from "@playwright/test";
import { starteMitStand } from "../e2e/abenteuer-affe";
import { geraet } from "../e2e/abenteuer-quer";
import {
  begleiter,
  begleiterfeld,
  fotografiere,
  imRadius,
  kernfelder,
  zielfelder,
  startfeld,
  type Blickeintrag,
} from "./blickprobe";
import type { Lauf } from "./eingabe";
import { Eiliger } from "./eilig";
import { geheZu } from "./laufen";
import { feldAus, liesLage, liesStand } from "./lage";
import { Messung } from "./messung";
import { Schwaechling } from "./schwach";
import { standAus } from "./simstand";
import { kartenwissen, ladeSpieldaten, type Spieldaten } from "./welt";

const STAENDE = process.env.BLICK_STAENDE ?? "";
const FOTOS = process.env.BLICK_FOTOS ?? "/tmp/blickprobe";
const NUR = (process.env.BLICK_NUR ?? "").split(",").filter(Boolean);
const [TEIL, TEILE] = (process.env.BLICK_TEIL ?? "1/1").split("/").map(Number) as [number, number];
const QUER = process.env.BLICK_FORMAT === "quer";
/** Länger als die Pause zwischen zwei Blickpunkten (BLICKPAUSE_MS, regeln/blickpunkte.ts). */
const DOPPELT_MS = Number(process.env.BLICK_DOPPELT_MS ?? "33000");
const ADRESSE = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "4183"}`;
/** Länger als die Ankunftsruhe (ANKUNFTSRUHE_MS), bevor der Held losgeht. */
const RUHE_MS = 2500;
/** So lange wartet die Probe im Radius auf den Dialog. */
const AUSLOESEN_MS = 4000;
const GRIFF_MS = 5000;
const KURZ_MS = 250;
const EINBLENDEN_MS = 800;
/** Ein Blickpunkt hat höchstens drei Zeilen, eine Wahl und eine Antwort; dazu Luft. */
const TIPPS_HOECHSTENS = 12;
const HINWEISE_HOECHSTENS = 5;
const GESAMT_MS = 6 * 60 * 60_000;

/**
 * Einmalige Hinweise und Erklärungen als gesehen: Die Simulation zeigt sie nicht, und solange
 * einer offen ist, ruht jeder Blickpunkt (erste Probe im Park, 24.11.2026). Ein Spieler hat sie
 * lange vor den meisten Blickpunkten gesehen.
 */
const HINWEISE_GESEHEN = {
  hinweisSteuerkreuz: true,
  hinweisMenue: true,
  hinweisTagebuch: true,
  muenzenErklaert: true,
  staerkeErklaert: true,
  spruchErklaert: true,
};

/** Was die Probe zu einem Punkt festhält. */
interface Befund {
  knoten: string;
  karte: string;
  feld: readonly [number, number];
  radius: number;
  stand: string;
  start?: string;
  stunde?: string | null;
  ausgeloest?: boolean;
  bei?: string;
  sprecher?: string;
  text?: string;
  geist?: string;
  nebenHeld?: boolean;
  gedanken?: boolean;
  weg?: string;
  gesehen?: boolean;
  doppelt?: boolean;
  imBild?: boolean;
  unterDialog?: boolean;
  fehler?: string;
  /** Ohne Auslösen: Aktionsknopf und offene Rückmeldung (beides hält Blickpunkte an). */
  aktion?: string | null;
  rueckmeldung?: boolean;
}

/** Der Stand eines Punkts; ohne eigenen der eines anderen Punkts im selben Ort. */
function standdatei(p: Blickeintrag, alle: readonly Blickeintrag[]): string {
  const ort = p.karte.split(".")[0];
  const ersatz =
    p.stand ??
    alle.find((q) => q.stand && q.karte.split(".")[0] === ort)?.stand ??
    alle.filter((q) => q.stand).at(-1)?.stand;
  return ersatz ?? "";
}

/** Tippt Hinweise nach dem Start weg (Weiter, kein Dialog). */
async function schliesseHinweise(seite: Page): Promise<void> {
  for (let i = 0; i < HINWEISE_HOECHSTENS; i++) {
    if ((await liesLage(seite)).dialog) return;
    const weiter = seite.getByRole("button", { name: "Weiter", exact: true }).first();
    if (!(await weiter.isVisible().catch(() => false))) return;
    await weiter.click().catch(() => undefined);
    await seite.waitForTimeout(KURZ_MS);
  }
}

/** Tippt den Dialog durch: zuerst einen Gedanken, sonst „Weiter“. Gibt zurück, ob alle Wahlen Gedanken waren. */
async function tippeDurch(seite: Page): Promise<boolean> {
  let gedanken = true;
  const dialog = seite.getByTestId("abenteuer-dialog");
  for (let i = 0; i < TIPPS_HOECHSTENS && (await dialog.isVisible()); i++) {
    const wahlen = seite.locator(".abenteuer-dialog-wahlen button");
    if ((await wahlen.count()) > 0) {
      const anzahl = await wahlen.count();
      const als = await seite.locator(".abenteuer-dialog-wahlen button[data-gedanke='ja']").count();
      if (als !== anzahl) gedanken = false;
      await seite.waitForTimeout(400);
      await wahlen
        .first()
        .click({ timeout: GRIFF_MS })
        .catch(() => undefined);
    } else {
      await seite
        .locator(".abenteuer-dialog-weiter")
        .click({ timeout: GRIFF_MS })
        .catch(() => undefined);
    }
    await seite.waitForTimeout(KURZ_MS);
  }
  return gedanken;
}

/** Der Finger des Durchlaufs auf dieser Seite. */
async function fingerAuf(seite: Page): Promise<Lauf> {
  return {
    seite,
    cdp: await seite.context().newCDPSession(seite),
    messung: new Messung(FOTOS),
    tasten: false,
    frist: Date.now() + GESAMT_MS,
    gehalten: null,
    schwach: new Schwaechling(FOTOS),
    eilig: new Eiliger(),
  };
}

/** Wartet bis zu `ms`, ob ein Dialog aufgeht. */
async function warteAufDialog(seite: Page, ms: number): Promise<boolean> {
  return seite
    .getByTestId("abenteuer-dialog")
    .waitFor({ state: "visible", timeout: ms })
    .then(
      () => true,
      () => false,
    );
}

/** Läuft einen Punkt ab und füllt den Befund. */
async function pruefePunkt(
  seite: Page,
  daten: Spieldaten,
  p: Blickeintrag,
  b: Befund,
): Promise<void> {
  const geladen = standAus(daten, join(FOTOS, `${p.knoten}.stand.json`));
  const wissen = kartenwissen(daten, p.karte, geladen);
  // Zuerst auf die Mitte zu; liegt sie in einer Tasche ohne Zugang von außen, auf den Radius zu.
  let ziele = kernfelder(wissen, p);
  let start = startfeld(wissen, p, ziele);
  if (!start) {
    ziele = zielfelder(wissen, p);
    start = startfeld(wissen, p, ziele);
  }
  if (!start) throw new Error("kein Startfeld außerhalb des Radius");
  b.start = `${start.x},${start.y}`;
  await starteMitStand(seite, {
    ...geladen,
    position: { karte: p.karte, x: start.x, y: start.y, richtung: "unten" },
  });
  await schliesseHinweise(seite);
  b.stunde = await seite
    .locator("[data-stunde]")
    .first()
    .getAttribute("data-stunde")
    .catch(() => null);
  if ((await liesLage(seite)).dialog) throw new Error("Dialog schon beim Start (vor dem Gang)");
  await seite.waitForTimeout(RUHE_MS);
  const lauf = await fingerAuf(seite);
  const gang = await geheZu(lauf, wissen, ziele);
  // Auch nach „fenster“ warten: Der Gang meldet schon das Verschwinden des Steuerkreuzes, der
  // Dialog steht einen Augenblick später (Canyonpfad, 24.11.2026).
  b.ausgeloest = await warteAufDialog(seite, AUSLOESEN_MS);
  if (!b.ausgeloest) {
    // Eine Meldung, die erst nach dem Laden kam („Neu im Tagebuch“), hält Blickpunkte an; ein
    // Spieler tippt sie weg (Bahnhofshalle Riverton, 24.11.2026).
    await schliesseHinweise(seite);
    b.ausgeloest = await warteAufDialog(seite, AUSLOESEN_MS);
  }
  await seite.waitForTimeout(EINBLENDEN_MS);
  const lage = await liesLage(seite);
  b.bei = `${lage.kachel} (${gang})`;
  if (!b.ausgeloest || !lage.dialog) {
    b.aktion = lage.aktion;
    b.rueckmeldung = Boolean((await liesStand(seite)).rueckmeldungOffen);
    await seite.screenshot({ path: join(FOTOS, `${p.knoten}-still.png`) });
    return;
  }
  b.sprecher = lage.dialog.sprecher;
  b.text = lage.dialog.text.slice(0, 100);
  b.geist = await begleiter(seite);
  const held = feldAus(lage.kachel);
  const geist = begleiterfeld(b.geist);
  b.nebenHeld = Boolean(
    held && geist && Math.max(Math.abs(held.x - geist.x), Math.abs(held.y - geist.y)) === 1,
  );
  await seite.waitForTimeout(EINBLENDEN_MS);
  if (held) {
    const versatz = { x: p.feld[0] - held.x, y: p.feld[1] - held.y };
    const stelle = await fotografiere(seite, FOTOS, p.knoten, versatz);
    b.imBild = stelle.imBild;
    b.unterDialog = stelle.unterDialog;
  }
  b.gedanken = await tippeDurch(seite);
  await seite.waitForTimeout(KURZ_MS);
  b.weg = await begleiter(seite);
  b.gesehen = (await liesStand(seite)).dialogvariablen[`${p.knoten}_gesehen`] === true;
  if (DOPPELT_MS > 0) {
    const jetzt = feldAus((await liesLage(seite)).kachel);
    b.doppelt = await warteAufDialog(seite, DOPPELT_MS);
    if (jetzt && !imRadius(p, jetzt.x, jetzt.y)) b.fehler = "nach dem Dialog nicht mehr im Radius";
  }
}

/** Schreibt den Stand des Punkts: Karte des Punkts, andere Punkte der Karte als gesehen. */
function schreibeStand(p: Blickeintrag, alle: readonly Blickeintrag[], datei: string): void {
  const sim = JSON.parse(readFileSync(join(STAENDE, `${datei}.json`), "utf8")) as {
    vars: Record<string, unknown>;
  };
  const vars: Record<string, unknown> = { ...sim.vars, ...HINWEISE_GESEHEN };
  for (const q of alle) if (q.karte === p.karte && q !== p) vars[`${q.knoten}_gesehen`] = true;
  vars[`${p.knoten}_gesehen`] = false;
  writeFileSync(
    join(FOTOS, `${p.knoten}.stand.json`),
    JSON.stringify({ ...sim, karte: p.karte, vars }),
  );
}

/** Ein neuer Browserkontext im gewählten Format. */
function kontextAus(browser: Browser) {
  const format = QUER ? geraet("iPhone 15 landscape") : devices["Pixel 7"];
  return browser.newContext({ ...format, baseURL: ADRESSE });
}

/** Die Blickpunkte im Inhalt, wie die App sie bekommt (Feld und Radius können neuer sein als die Stände). */
const INHALT = join(process.cwd(), "../inhalte/abenteuer/ambrose_blickpunkte.json");

/**
 * Feld und Radius aus dem Inhalt, der Stand aus der Liste der Stände. Warum: Nach einer Korrektur
 * der Felder braucht es keine neuen Stände (die hängen nur am Knoten); die Probe lief sonst auf die
 * alten Felder zu (Nachprobe, 24.11.2026).
 */
function mitAktuellenFeldern(liste: readonly Blickeintrag[]): Blickeintrag[] {
  const aktuell = JSON.parse(readFileSync(INHALT, "utf8")) as Blickeintrag[];
  const nach = new Map(aktuell.map((p) => [p.knoten, p]));
  return liste.map((p) => {
    const neu = nach.get(p.knoten);
    return neu ? { ...p, feld: neu.feld, radius: neu.radius } : p;
  });
}

/** Ein Versuch an einem Punkt in einem frischen Kontext; Fehler stehen im Befund. */
async function versuche(
  browser: Browser,
  daten: Spieldaten,
  p: Blickeintrag,
  alle: readonly Blickeintrag[],
  datei: string,
): Promise<Befund> {
  const b: Befund = {
    knoten: p.knoten,
    karte: p.karte,
    feld: p.feld,
    radius: p.radius,
    stand: datei,
  };
  const kontext = await kontextAus(browser);
  kontext.setDefaultTimeout(GRIFF_MS);
  const seite = await kontext.newPage();
  try {
    schreibeStand(p, alle, datei);
    await pruefePunkt(seite, daten, p, b);
  } catch (fehler) {
    // Ein Punkt, der nicht lädt, steht im Ergebnis; die übrigen gehen weiter.
    b.fehler = String(fehler).slice(0, 300);
    await seite.screenshot({ path: join(FOTOS, `${p.knoten}-fehler.png`) }).catch(() => undefined);
  }
  await kontext.close();
  return b;
}

test("Blickprobe: jeder Blickpunkt im Spiel", async () => {
  test.skip(!STAENDE, "nur mit BLICK_STAENDE (pipeline/abenteuer/blickstaende.cjs)");
  test.setTimeout(GESAMT_MS);
  mkdirSync(FOTOS, { recursive: true });
  const daten = ladeSpieldaten();
  const alle = mitAktuellenFeldern(
    JSON.parse(readFileSync(join(STAENDE, "liste.json"), "utf8")) as Blickeintrag[],
  );
  const auswahl = alle
    .filter((p) => NUR.length === 0 || NUR.some((n) => p.knoten.includes(n)))
    .filter((_, i) => i % TEILE === TEIL - 1);
  const pfad = process.env.CHROMIUM_PFAD;
  const browser = await chromium.launch(pfad ? { executablePath: pfad } : {});
  const ergebnis = join(FOTOS, `ergebnis-${TEIL}.jsonl`);
  for (const p of auswahl) {
    const datei = standdatei(p, alle);
    let b = await versuche(browser, daten, p, alle, datei);
    // Ein Ladefehler unter Last (drei Läufe gegen einen Server) bekommt einen zweiten Versuch.
    if (b.fehler && b.ausgeloest === undefined) b = await versuche(browser, daten, p, alle, datei);
    appendFileSync(ergebnis, `${JSON.stringify(b)}\n`);
    console.log(JSON.stringify(b));
  }
  await browser.close();
});
