/**
 * Gesprächsprobe (Auftrag des Hauptchats, 24.11.2026): ein Gespräch mit einer Figur führen, in dem
 * Ambrose dazwischenredet, und jede seiner Zeilen fotografieren. Geprüft wird: Seine Zeile ist
 * geflüstert („nur du hörst ihn“, `abenteuer-fluestern`), und der Geist steht dabei neben dem
 * Helden (`data-begleiter`). Gedanken des Helden (`data-gedanke`) werden mitfotografiert, wenn es
 * welche gibt.
 * Aufruf (nach npm run build mit privatem Paket):
 *   PROBE_STAND=DATEI.json PROBE_KARTE=mapleFalls.aussen PROBE_DING=calloway \
 *   PROBE_VARIABLEN='{"nadelMapleFalls":1}' GESPRAECH_FOTOS=ORDNER [PROBE_FORMAT=quer] \
 *   CHROMIUM_PFAD=… npx playwright test --config playwright.durchlauf.config.ts gespraechsprobe
 * Ergebnis: je Zeile von Ambrose eine Zeile im Testbericht, Fotos nur lokal.
 * Abhängigkeiten: probe.ts, laufen.ts, eingabe.ts, lage.ts, blickprobe.ts.
 */
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { begleiter } from "./blickprobe";
import { tippe } from "./eingabe";
import { bedieneFenster, neuesFenstergedaechtnis } from "./fenster";
import { spielePartie } from "./partie";
import { geheAn } from "./laufen";
import { liesLage, liesStand } from "./lage";
import { KARTE, PROBE_MS, STAND, starteProbe } from "./probe";
import { kartenwissen } from "./welt";

const DING = process.env.PROBE_DING ?? "";
const FOTOS = process.env.GESPRAECH_FOTOS ?? "";
const FORMAT = process.env.PROBE_FORMAT === "quer" ? "quer" : "hoch";
/** GESPRAECH_ALLE=1: jede Zeile fotografieren, nicht nur die von Ambrose (Auftritte, 28.11.2026). */
const ALLE = process.env.GESPRAECH_ALLE === "1";
/**
 * GESPRAECH_PARTIEN=1: Partien, die das Gespräch startet, spielen (partie.ts), Fenster bedienen
 * (Deckwahl, Ergebniskarte) und das Gespräch danach weiterführen, etwa Clubkampf → Hale und
 * {rivale} kommen herein → Partie gegen {rivale} → Nachgespräch (Auftritte, 28.11.2026).
 */
const PARTIEN = process.env.GESPRAECH_PARTIEN === "1";
/** Höchstens so viele Schritte durch das Gespräch (mit Partien mehr). */
const SCHRITTE = PARTIEN ? 160 : 40;
const EINBLENDEN_MS = 700;
const KURZ_MS = 300;

test("Gesprächsprobe: Ambrose flüstert neben dem Helden", async () => {
  test.skip(!STAND || !KARTE || !DING, "nur mit PROBE_STAND, PROBE_KARTE und PROBE_DING");
  test.setTimeout(PROBE_MS);
  const { lauf, daten, ordner, browser } = await starteProbe("gespraechsprobe");
  const seite = lauf.seite;
  const wissen = kartenwissen(daten, KARTE, await liesStand(seite));
  const ding = wissen.dinge.find((d) => d.name === DING);
  expect(ding, `${DING} auf ${KARTE}`).toBeTruthy();
  const gang = await geheAn(lauf, wissen, ding?.felder ?? []);
  // Feld des Helden vor und nach dem Gespräch (Befund des Autors 28.11.2026: nach dem Gespräch
  // mit Juno stand der Held wieder vor der Haustür).
  const vorher = (await liesLage(seite)).kachel;
  console.log(`Gang zu ${DING}: ${gang}, Held auf ${vorher}`);
  if (gang === "aktion") {
    await tippe(lauf, seite.getByTestId("abenteuer-aktion"), "Aktionsknopf");
  }
  const zeilen: string[] = [];
  const g = neuesFenstergedaechtnis();
  for (let i = 0, foto = 0; i < SCHRITTE; i++) {
    await seite.waitForTimeout(EINBLENDEN_MS);
    const lage = await liesLage(seite);
    if (PARTIEN && lage.bild === "partie") {
      const partie = await spielePartie(lauf, g);
      console.log(`  Partie ${partie?.kennung ?? "?"}: ${partie?.ausgang ?? "?"}`);
      continue;
    }
    if (!lage.dialog && PARTIEN && (await bedieneFenster(lauf, lage, g))) continue;
    if (!lage.dialog) break;
    console.log(`  ${lage.dialog.sprecher}: ${lage.dialog.text.slice(0, 50)}`);
    const fluestert = await seite.getByTestId("abenteuer-fluestern").isVisible();
    const gedanke = (await seite.locator("[data-gedanke='ja']").count()) > 0;
    if (ALLE || lage.dialog.sprecher.startsWith("Ambrose") || gedanke) {
      const geist = await begleiter(seite);
      const name = `${DING}-${FORMAT}-${++foto}`;
      await seite.screenshot({ path: join(FOTOS || ordner, `${name}.png`) });
      zeilen.push(
        `${name}: ${lage.dialog.sprecher} geflüstert=${fluestert} Geist=${geist} Held=${lage.kachel} Gedanke=${gedanke} „${lage.dialog.text.slice(0, 60)}“`,
      );
    }
    const wahlen = seite.locator(".abenteuer-dialog-wahlen button");
    if ((await wahlen.count()) > 0)
      await wahlen
        .first()
        .click()
        .catch(() => undefined);
    else
      await seite
        .locator(".abenteuer-dialog-weiter")
        .click()
        .catch(() => undefined);
    await seite.waitForTimeout(KURZ_MS);
  }
  await seite.waitForTimeout(EINBLENDEN_MS * 2);
  const nachher = (await liesLage(seite)).kachel;
  console.log(`Held nach dem Gespräch auf ${nachher} (vorher ${vorher})`);
  await seite.screenshot({ path: join(FOTOS || ordner, `${DING}-${FORMAT}-nachher.png`) });
  for (const z of zeilen) console.log(z);
  await browser.close();
  expect(zeilen.length).toBeGreaterThan(0);
});
