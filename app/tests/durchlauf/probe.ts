/**
 * Gemeinsamer Start der Proben des Spieler-Durchlaufs (ansprechprobe.spec.ts, neuladeprobe.spec.ts):
 * ein frischer Browser im Hochformat, ein simulierter Stand (aktstand.cjs) auf einer gewählten
 * Karte, der Finger des Durchlaufs.
 *
 * Warum: Proben prüfen eine Stelle in einer Minute, für die ein ganzer Lauf Stunden bräuchte.
 * Eingaben aus der Umgebung: PROBE_STAND (Datei der Simulation), PROBE_KARTE (Kennung),
 * PROBE_VARIABLEN (JSON, überschreibt Dialogvariablen), PROBE_STUNDE (Spieluhr am zweiten Spieltag;
 * für Figuren nach dem Tagesablauf, etwa Kit und Sol abends vor dem Plakat in Summit City),
 * PROBE_FELD (Startfeld des Helden „x,y,richtung“, etwa über Ward an der Bank: 41,35,unten),
 * PROBE_FORMAT=quer (Querformat).
 * Abhängigkeiten: simstand.ts, welt.ts, eingabe.ts, messung.ts, schwach.ts, e2e/abenteuer-affe.ts.
 */
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, devices, type Browser, type Page } from "@playwright/test";
import { starteMitStand } from "../e2e/abenteuer-affe";
import { geraet } from "../e2e/abenteuer-quer";
import type { Lauf } from "./eingabe";
import { liesLage } from "./lage";
import { Messung } from "./messung";
import { Eiliger } from "./eilig";
import { Schwaechling } from "./schwach";
import { standAus } from "./simstand";
import { ladeSpieldaten, type Spieldaten } from "./welt";

export const STAND = process.env.PROBE_STAND ?? "";
export const KARTE = process.env.PROBE_KARTE ?? "";
const VARIABLEN = JSON.parse(process.env.PROBE_VARIABLEN ?? "{}") as Record<string, unknown>;
/** Stunde der Spieluhr (regeln/spieluhr.ts), leer: die des Stands. */
const STUNDE = process.env.PROBE_STUNDE ?? "";
/** Startfeld des Helden „x,y,richtung“ (PROBE_FELD), leer: Tür oder Start der Karte. */
const FELD = process.env.PROBE_FELD ?? "";
/** Querformat (PROBE_FORMAT=quer, wie ein iPhone 15 quer), sonst hoch wie ein Pixel 7. */
const QUER = process.env.PROBE_FORMAT === "quer";
/** Spielminuten je Stunde und der zweite Spieltag (wie verdeckungsfoto.spec.ts). */
const MINUTEN_JE_STUNDE = 60;
const ZWEITER_TAG = 24 * MINUTEN_JE_STUNDE;
const ADRESSE = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "4183"}`;
/** So lange darf eine Probe insgesamt laufen (ms). */
export const PROBE_MS = 10 * 60_000;
/** So lange wartet die Probe nach einem Dialog, bis die Welt wieder frei ist (ms). */
const DIALOG_FRIST_MS = 15_000;
/** So lange darf ein Griff nach einem Element dauern (ms). */
const GRIFF_MS = 5000;

/** Was eine Probe braucht: Finger, Spieldaten, Ordner für Bilder, Browser zum Schließen. */
export interface Probe {
  readonly lauf: Lauf;
  readonly daten: Spieldaten;
  readonly ordner: string;
  readonly browser: Browser;
}

/** So oft tippt die Probe nach dem Start Hinweise weg (je einer pro Tipp). */
const HINWEISE_HOECHSTENS = 5;

/**
 * Tippt Hinweise nach dem Start weg („Deine ersten Münzen“): Der simulierte Stand kennt die
 * gezeigten Erklärungen nicht, und solange ein Hinweis offen ist, fehlt der Aktionsknopf
 * (Ansprechprobe Ward in Summit City, 24.11.2026: jede Figur „ohneAktion“).
 */
async function schliesseHinweise(seite: Page): Promise<void> {
  for (let i = 0; i < HINWEISE_HOECHSTENS; i++) {
    const weiter = seite.getByRole("button", { name: "Weiter", exact: true }).first();
    await weiter.waitFor({ state: "visible", timeout: 2000 }).catch(() => undefined);
    if (!(await weiter.isVisible().catch(() => false))) return;
    await weiter.click().catch(() => undefined);
    await seite.waitForTimeout(300);
  }
}

/** Startet Browser und Abenteuer mit dem Stand aus PROBE_STAND auf PROBE_KARTE. */
export async function starteProbe(name: string): Promise<Probe> {
  const ordner = mkdtempSync(join(tmpdir(), `${name}-`));
  const daten = ladeSpieldaten();
  const sim = JSON.parse(readFileSync(STAND, "utf8")) as Record<string, unknown>;
  const datei = join(ordner, "stand.json");
  const vars = { ...(sim.vars as object), ...VARIABLEN };
  writeFileSync(datei, JSON.stringify({ ...sim, karte: KARTE, vars }));
  const geladen = standAus(daten, datei);
  const [x, y, richtung = "unten"] = FELD.split(",");
  const stand = FELD
    ? { ...geladen, position: { karte: KARTE, x: Number(x), y: Number(y), richtung } }
    : geladen;
  const pfad = process.env.CHROMIUM_PFAD;
  const browser = await chromium.launch(pfad ? { executablePath: pfad } : {});
  const format = QUER ? geraet("iPhone 15 landscape") : devices["Pixel 7"];
  const kontext = await browser.newContext({ ...format, baseURL: ADRESSE });
  kontext.setDefaultTimeout(GRIFF_MS);
  const seite = await kontext.newPage();
  const uhr = STUNDE ? { spieluhr: ZWEITER_TAG + Number(STUNDE) * MINUTEN_JE_STUNDE } : {};
  await starteMitStand(seite, { ...stand, ...uhr });
  await schliesseHinweise(seite);
  const lauf: Lauf = {
    seite,
    cdp: await kontext.newCDPSession(seite),
    messung: new Messung(ordner),
    tasten: false,
    frist: Date.now() + PROBE_MS,
    gehalten: null,
    schwach: new Schwaechling(ordner),
    eilig: new Eiliger(),
  };
  return { lauf, daten, ordner, browser };
}

/** Schließt einen offenen Dialog, indem sie ihn durchtippt (letzte Antwort, sonst „Weiter“). */
export async function schliesseDialog(lauf: Lauf): Promise<string> {
  let erste = "";
  // Der Dialog öffnet erst nach einem Augenblick.
  await lauf.seite
    .getByTestId("abenteuer-dialog")
    .first()
    .waitFor({ state: "visible", timeout: 3000 })
    .catch(() => undefined);
  const ende = Date.now() + DIALOG_FRIST_MS;
  while (Date.now() < ende) {
    const lage = await liesLage(lauf.seite);
    if (!lage.dialog && lage.bild === "welt") return erste;
    if (lage.dialog && !erste) erste = lage.dialog.text.slice(0, 80);
    // Die letzte Antwort ist meist der Abschied („Bis später“); sonst führt „Weiter“ durch.
    const knopf = lauf.seite.getByTestId("abenteuer-dialog").getByRole("button").last();
    await knopf.click({ timeout: 2000 }).catch(() => lauf.seite.mouse.click(1, 1));
    await lauf.seite.waitForTimeout(250);
  }
  return erste;
}
