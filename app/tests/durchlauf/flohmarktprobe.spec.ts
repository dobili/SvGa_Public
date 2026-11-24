/**
 * Flohmarktprobe: Nach einer abgebrochenen Runde an Odettes Flohmarkt ist der Aktionsknopf sofort
 * wieder da (schwacher Spieler-Durchlauf Akt 1, Querformat, 24.11.2026; Fix in ausloeserebene.ts).
 *
 * Warum: Nach der Runde lädt die Welt neu, der Held steht auf dem Auslöser. Vorher schwieg er bis
 * zum Verlassen, und der Knopf fehlte. Diese Probe spielt genau das im Browser nach.
 * Aufruf (nach npm run build mit dem privaten Paket; Stand aus aktstand.cjs --akt 2):
 *   PROBE_STAND=/tmp/akt2.json CHROMIUM_PFAD=… \
 *   npx playwright test --config playwright.durchlauf.config.ts flohmarktprobe
 * Abhängigkeiten: simstand.ts, welt.ts, e2e/abenteuer-affe.ts.
 */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, devices, expect, test } from "@playwright/test";
import { starteMitStand } from "../e2e/abenteuer-affe";
import { standAus } from "./simstand";
import { ladeSpieldaten } from "./welt";

const STAND = process.env.PROBE_STAND ?? "";
const ADRESSE = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "4183"}`;
const KARTE = "wegMapleCedar.landstrasse";
/** Auslöser „ereignisFlohmarkt“ (Szene weg-maple-cedar-landstrasse.json); der Held steht darauf. */
const FLOHMARKT = { x: 95, y: 21 };
/** Odette stellt die Fallen wieder, als wäre man das erste Mal da. */
const VARIABLEN = { wegMapleCedarFinchFallenBestanden: false, flohmarktKarteErhalten: false };
const PROBE_MS = 3 * 60_000;
/** Bis dahin muss der Knopf nach dem Abbruch da sein (ms). */
const KNOPF_MS = 3000;

test("Flohmarkt: nach abgebrochener Runde ist der Aktionsknopf sofort da", async () => {
  test.skip(!STAND, "nur mit PROBE_STAND");
  test.setTimeout(PROBE_MS);
  const ordner = mkdtempSync(join(tmpdir(), "flohmarkt-"));
  const sim = JSON.parse(readFileSync(STAND, "utf8")) as Record<string, unknown>;
  const datei = join(ordner, "stand.json");
  writeFileSync(
    datei,
    JSON.stringify({ ...sim, karte: KARTE, vars: { ...(sim.vars as object), ...VARIABLEN } }),
  );
  const stand = standAus(ladeSpieldaten(), datei);
  const pfad = process.env.CHROMIUM_PFAD;
  const browser = await chromium.launch(pfad ? { executablePath: pfad } : {});
  const kontext = await browser.newContext({ ...devices["Pixel 7"], baseURL: ADRESSE });
  const seite = await kontext.newPage();
  await starteMitStand(seite, {
    ...stand,
    position: { ...stand.position, ...FLOHMARKT, richtung: "oben" },
  });
  const aktion = seite.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 15000 });
  await aktion.click();
  // Durch Odettes Einleitung bis zur Wahl „Die Fallen lösen“.
  const dialog = seite.getByTestId("abenteuer-dialog");
  const fallen = dialog.getByRole("button", { name: "Die Fallen lösen" });
  for (let i = 0; i < 10 && !(await fallen.isVisible().catch(() => false)); i++) {
    await dialog.getByRole("button", { name: "Weiter" }).click({ timeout: 3000 });
  }
  await fallen.click();
  await expect(seite.getByRole("button", { name: "Ich komme nicht drauf" })).toBeVisible({
    timeout: 15000,
  });
  // Mitten in der Runde zurück, dann „Runde abbrechen“ (wie der schwache Spieler).
  await seite.goBack();
  await seite.getByRole("button", { name: "Runde abbrechen" }).click({ timeout: 10000 });
  await expect(aktion).toBeVisible({ timeout: KNOPF_MS });
  await seite.screenshot({ path: join(ordner, "nach-abbruch.png") });
  await browser.close();
});
