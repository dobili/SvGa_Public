/**
 * Gemeinsamer Start der Proben des Spieler-Durchlaufs (ansprechprobe.spec.ts, neuladeprobe.spec.ts):
 * ein frischer Browser im Hochformat, ein simulierter Stand (aktstand.cjs) auf einer gewählten
 * Karte, der Finger des Durchlaufs.
 *
 * Warum: Proben prüfen eine Stelle in einer Minute, für die ein ganzer Lauf Stunden bräuchte.
 * Eingaben aus der Umgebung: PROBE_STAND (Datei der Simulation), PROBE_KARTE (Kennung),
 * PROBE_VARIABLEN (JSON, überschreibt Dialogvariablen).
 * Abhängigkeiten: simstand.ts, welt.ts, eingabe.ts, messung.ts, schwach.ts, e2e/abenteuer-affe.ts.
 */
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, devices, expect, type Browser, type Page } from "@playwright/test";
import { schreibeStandImBrowser, starteMitStand } from "../e2e/abenteuer-affe";
import type { Lauf } from "./eingabe";
import { liesLage } from "./lage";
import { Messung } from "./messung";
import { Eiliger } from "./eilig";
import { Schwaechling } from "./schwach";
import { standAus } from "./simstand";
import type { Abenteuerstand } from "../../src/abenteuer/schnittstelle/spielstand";
import { ladeSpieldaten, type Spieldaten } from "./welt";

export const STAND = process.env.PROBE_STAND ?? "";
export const KARTE = process.env.PROBE_KARTE ?? "";
const VARIABLEN = JSON.parse(process.env.PROBE_VARIABLEN ?? "{}") as Record<string, unknown>;
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
  /** Der Startstand, um nach einer Reise wieder auf die Karte der Probe zu kommen. */
  readonly stand: Abenteuerstand;
}

/** Startet Browser und Abenteuer mit dem Stand aus PROBE_STAND auf PROBE_KARTE. */
export async function starteProbe(name: string): Promise<Probe> {
  const ordner = mkdtempSync(join(tmpdir(), `${name}-`));
  const daten = ladeSpieldaten();
  const sim = JSON.parse(readFileSync(STAND, "utf8")) as Record<string, unknown>;
  const datei = join(ordner, "stand.json");
  const vars = { ...(sim.vars as object), ...VARIABLEN };
  writeFileSync(datei, JSON.stringify({ ...sim, karte: KARTE, vars }));
  const stand = standAus(daten, datei);
  const pfad = process.env.CHROMIUM_PFAD;
  const browser = await chromium.launch(pfad ? { executablePath: pfad } : {});
  const kontext = await browser.newContext({ ...devices["Pixel 7"], baseURL: ADRESSE });
  kontext.setDefaultTimeout(GRIFF_MS);
  const seite = await kontext.newPage();
  await starteMitStand(seite, stand);
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
  return { lauf, daten, ordner, browser, stand };
}

/** Schließt einen offenen Dialog, indem sie ihn durchtippt (letzte Antwort, sonst „Weiter“). */
export async function schliesseDialog(lauf: Lauf): Promise<string> {
  let erste = "";
  // Der Dialog öffnet erst nach einem Augenblick.
  const fertig = lauf.seite.locator(
    "[data-testid='abenteuer-laden'] .abenteuer-menue-fuss .knopf-haupt",
  );
  await lauf.seite
    .getByTestId("abenteuer-dialog")
    .first()
    .or(fertig)
    .waitFor({ state: "visible", timeout: 3000 })
    .catch(() => undefined);
  const ende = Date.now() + DIALOG_FRIST_MS;
  // Ein Laden (Fanshop in der Halle der Capital Arena) ist kein Dialog; offen gelassen, sperrte er
  // alle weiteren Gänge (Ansprechprobe, 24.11.2026). Schließen wie ein Mensch: „Fertig“.
  while (Date.now() < ende) {
    const lage = await liesLage(lauf.seite);
    if (await fertig.isVisible().catch(() => false)) {
      await fertig.click({ timeout: 2000 }).catch(() => undefined);
      await lauf.seite.waitForTimeout(250);
      continue;
    }
    if (!lage.dialog && lage.bild === "welt") return erste;
    if (lage.dialog && !erste) erste = lage.dialog.text.slice(0, 80);
    // Die letzte Antwort ist meist der Abschied („Bis später“); sonst führt „Weiter“ durch.
    const knopf = lauf.seite.getByTestId("abenteuer-dialog").getByRole("button").last();
    await knopf.click({ timeout: 2000 }).catch(() => lauf.seite.mouse.click(1, 1));
    await lauf.seite.waitForTimeout(250);
  }
  return erste;
}

/**
 * Zurück auf die Karte der Probe: den Startstand neu schreiben und die Welt neu laden. Warum: Ein
 * Übergang mit Dialog (Deich in Port Delacroix) schickt den Helden auf eine andere Karte; ein
 * zweites starteMitStand scheitert, weil die App schon läuft (Ansprechprobe, 24.11.2026).
 */
export async function zurueckAufKarte(seite: Page, stand: Abenteuerstand): Promise<void> {
  await expect.poll(() => seite.evaluate(schreibeStandImBrowser, stand)).toBe(true);
  await seite.reload();
  await seite.goto("/app/#abenteuer");
  await expect(seite.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
  await seite.waitForTimeout(500);
}
