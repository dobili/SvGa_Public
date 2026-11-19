/**
 * Ansprechprobe des Spieler-Durchlaufs: auf einer Karte jede Figur und jeden Auslöser mit Dialog
 * aufsuchen und nachsehen, ob der Aktionsknopf erscheint. Gespielt mit dem Finger wie im
 * Durchlauf (laufen.ts), ab einem simulierten Stand (aktstand.cjs, simstand.ts).
 *
 * Warum: Der Durchlauf meldete im Musikhaus von Port Delacroix vier Figuren ohne Aktionsknopf
 * (19.11.2026) und kam nie wieder dorthin; ein ganzer Lauf bis zu dieser Stelle dauert Stunden.
 * Die Probe prüft eine Karte in einer Minute.
 * Aufruf (nach npm run build):
 *   PROBE_STAND=/tmp/akt4.json PROBE_KARTE=portDelacroix.musikhaus \
 *   PROBE_VARIABLEN='{"musikhausOffen":true}' CHROMIUM_PFAD=… \
 *   npx playwright test --config playwright.durchlauf.config.ts ansprechprobe
 * Ergebnis: eine Zeile je Ding im Testbericht; der Test scheitert, wenn ein Ding ohne Knopf bleibt.
 * Abhängigkeiten: simstand.ts, welt.ts, laufen.ts, eingabe.ts, messung.ts, lage.ts.
 */
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, devices, expect, test } from "@playwright/test";
import { starteMitStand } from "../e2e/abenteuer-affe";
import { tippe, type Lauf } from "./eingabe";
import { geheAn } from "./laufen";
import { liesLage, liesStand } from "./lage";
import { Messung } from "./messung";
import { Schwaechling } from "./schwach";
import { standAus } from "./simstand";
import { kartenwissen, ladeSpieldaten } from "./welt";

const STAND = process.env.PROBE_STAND ?? "";
const KARTE = process.env.PROBE_KARTE ?? "";
const VARIABLEN = JSON.parse(process.env.PROBE_VARIABLEN ?? "{}") as Record<string, unknown>;
const ADRESSE = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "4183"}`;
/** So lange darf die Probe insgesamt laufen (ms). */
const PROBE_MS = 10 * 60_000;
/** So lange wartet die Probe nach einem Dialog, bis die Welt wieder frei ist (ms). */
const DIALOG_FRIST_MS = 15_000;

/** Schließt einen offenen Dialog, indem sie ihn durchtippt (letzte Antwort, sonst „Weiter“). */
async function schliesseDialog(lauf: Lauf): Promise<string> {
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

test("Ansprechprobe einer Karte", async () => {
  test.skip(!STAND || !KARTE, "nur mit PROBE_STAND und PROBE_KARTE");
  test.setTimeout(PROBE_MS);
  const ordner = mkdtempSync(join(tmpdir(), "ansprechprobe-"));
  const daten = ladeSpieldaten();
  const sim = JSON.parse(readFileSync(STAND, "utf8")) as Record<string, unknown>;
  const datei = join(ordner, "stand.json");
  writeFileSync(
    datei,
    JSON.stringify({ ...sim, karte: KARTE, vars: { ...(sim.vars as object), ...VARIABLEN } }),
  );
  const stand = standAus(daten, datei);
  const geraet = devices["Pixel 7"];
  const pfad = process.env.CHROMIUM_PFAD;
  const browser = await chromium.launch(pfad ? { executablePath: pfad } : {});
  const kontext = await browser.newContext({ ...geraet, baseURL: ADRESSE });
  kontext.setDefaultTimeout(5000);
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
  };
  const wissen = kartenwissen(daten, KARTE, await liesStand(seite));
  const ohne: string[] = [];
  for (const ding of wissen.dinge) {
    if (!ding.figur && ding.regel?.art !== "dialog") continue;
    const ergebnis = await geheAn(lauf, wissen, ding.felder);
    let text = "";
    if (ergebnis === "aktion") {
      await tippe(lauf, seite.getByTestId("abenteuer-aktion"), "Aktionsknopf");
      text = await schliesseDialog(lauf);
    } else {
      ohne.push(`${ding.name}: ${ergebnis}`);
      await seite.screenshot({ path: join(ordner, `${ding.name}.png`) });
    }
    console.log(`${KARTE}.${ding.name} ${JSON.stringify(ding.felder)}: ${ergebnis} ${text}`);
  }
  console.log(`Bilder und Protokoll: ${ordner}`);
  await browser.close();
  expect(ohne).toEqual([]);
});
