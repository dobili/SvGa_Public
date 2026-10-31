/**
 * Oberflächentests für den Speicher (AP 12): Fortschritt bleibt nach dem Neuladen, alte Merker
 * werden übernommen, Datensicherung auf ein anderes Gerät (Pflichtenheft 4, Abnahmepunkt
 * „Export auf einem Gerät und Import auf einem anderen“).
 */
import { expect, test } from "@playwright/test";
import {
  klappeAbschnittAuf,
  oeffneAbbildung,
  oeffneEinstellungen,
  oeffneProfil,
  starteImBrowser,
} from "./hilfen";

/** Eine Abbildung zählt erst nach 30 Sekunden am Stück (0.2.27); der Test spult die Uhr vor. */
const VERWEILZEIT_MS = 30_000;

test("Fortschritt: angesehene Abbildung zählt in Kapitel, Buch und Einstellungen, auch nach Neuladen", async ({
  page,
}) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.clock.runFor(VERWEILZEIT_MS);
  // Einen Halbzug weiter steht Abb. 1.27 auf dem Brett: Nach 30 Sekunden zählt auch sie.
  await page.getByRole("button", { name: "Einen Halbzug vor" }).click();
  await page.clock.runFor(VERWEILZEIT_MS);
  // Abb. 1.28 nur kurz: Sie zählt nicht.
  await page.getByRole("button", { name: "Einen Halbzug vor" }).click();
  await page.clock.runFor(VERWEILZEIT_MS / 2);
  await page.goBack();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  const kapitel1 = page.locator(".kapitelliste").getByRole("button", { name: /Grundprinzipien/ });
  await expect(kapitel1).toContainText(/2 von \d+ Abbildungen angesehen/);
  await kapitel1.click();
  await expect(page.getByTestId("fortschritt-abbildungen")).toHaveText(/^2 von \d+$/);
  await klappeAbschnittAuf(page, "1.4");
  const haken = (nummer: string) =>
    page.getByRole("button", { name: `Abb. ${nummer} als angesehen abhaken` });
  await expect(haken("1.26")).toHaveAttribute("aria-pressed", "true");
  await expect(haken("1.28")).toHaveAttribute("aria-pressed", "false");
  // Seit 0.2.134 steht der Fortschritt im Profil.
  await oeffneProfil(page);
  await expect(page.getByTestId("ich-abbildungen")).toHaveText(/^2 von \d+$/);
  // Seit 0.3.7 Orden für Übungen, die fünf Teile des Buches und die Bündel der Bots; seit dem
  // Profil neu (31.10.2026) stehen Teile und Bots als Regale in „Deine Erfolge“.
  await expect(page.getByTestId("ich-uebungen")).toHaveText(/^0 von 86$/);
  const erfolge = page.getByTestId("erfolge");
  await expect(erfolge.getByTestId("erfolge-erstes")).toBeVisible();
  const teile = erfolge.getByTestId("erfolge-regal-teile");
  await expect(teile.getByTestId("erfolge-zaehler-teile")).toHaveText("0 von 5");
  await teile.getByTestId("orden-teil-grundlagen").getByRole("button").click();
  await expect(teile.getByTestId("regal-bedingung")).toContainText(/\(2 von \d+\)$/);
  const bots = erfolge.getByTestId("erfolge-regal-bots");
  await expect(bots.getByTestId("erfolge-zaehler-bots")).toHaveText("0 von 9");
  await expect(bots.getByRole("img", { name: /^Noch offen: Engine \(Stufe 10\)$/ })).toBeAttached();
  // Ohne Partien: die Karte „Deine Partien“ mit kurzem Satz (Wunsch des Autors, 25.10.2026).
  await expect(page.getByRole("heading", { name: "Deine Partien" })).toBeVisible();
  await expect(page.getByText("Noch keine Partie gespielt.", { exact: false })).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/ich-fortschritt.png", fullPage: true });
});

test("Abhaken von Hand in der Kapitelübersicht: einzeln, alle, alle zurücksetzen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page
    .locator(".kapitelliste")
    .getByRole("button", { name: /Grundprinzipien/ })
    .click();
  await klappeAbschnittAuf(page, "1.1");
  const haken = page.getByRole("button", { name: "Abb. 1.3 als angesehen abhaken" });
  await haken.click();
  await expect(haken).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("fortschritt-abbildungen")).toHaveText(/^1 von \d+$/);
  await page.getByRole("button", { name: "Alle abhaken" }).click();
  // Erst nach der Rückfrage (0.2.28); „Abbrechen“ ändert nichts.
  await page.getByRole("button", { name: "Abbrechen" }).click();
  await expect(page.getByTestId("fortschritt-abbildungen")).toHaveText(/^1 von \d+$/);
  await page.getByRole("button", { name: "Alle abhaken" }).click();
  await page.getByRole("button", { name: "Ja, alle abhaken" }).click();
  await expect(page.getByTestId("fortschritt-abbildungen")).toHaveText(/^(\d+) von \1$/);
  await page.screenshot({ path: "test-results/bilder/kapitel-abhaken.png", fullPage: true });
  await page.getByRole("button", { name: "Alle zurücksetzen" }).click();
  await page.getByRole("button", { name: "Ja, Haken entfernen" }).click();
  await expect(page.getByTestId("fortschritt-abbildungen")).toHaveText(/^0 von \d+$/);
});

test("Abschnitte der Kapitelübersicht: anfangs zu, einzeln abhaken, Haken lösen, zuklappen (0.2.82)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page
    .locator(".kapitelliste")
    .getByRole("button", { name: /Grundprinzipien/ })
    .click();
  // Seit 0.2.82 sind alle Abschnitte anfangs eingeklappt.
  await expect(page.locator("details.abschnittsklappe[open]")).toHaveCount(0);
  await klappeAbschnittAuf(page, "1.4");
  const haken = page.getByRole("button", { name: "Abb. 1.26 als angesehen abhaken" });
  await page.getByRole("button", { name: "Abschnitt 1.4 abhaken" }).click();
  await expect(haken).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("fortschritt-abbildungen")).not.toHaveText(/^0 von/);
  await page.screenshot({ path: "test-results/bilder/kapitel-abschnitte.png", fullPage: true });
  await page.getByRole("button", { name: "Haken in 1.4 lösen" }).click();
  await expect(haken).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("fortschritt-abbildungen")).toHaveText(/^0 von \d+$/);
  // Zuklappen blendet die kleinen Bretter des Abschnitts aus.
  await page.getByRole("heading", { name: /^1\.4 / }).click();
  await expect(haken).toBeHidden();
});

test("Merker von 0.2.x werden beim ersten Laden übernommen", async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("test.vorbelegt")) return;
    sessionStorage.setItem("test.vorbelegt", "ja");
    localStorage.setItem("svga.einstellungen", '{"brettfarben":"holz","strenge":"streng"}');
    localStorage.setItem("svga.lernstand", '{"1":[0]}');
  });
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Brett" }).click();
  await expect(
    page
      .getByRole("radiogroup", { name: "Brettfarben" })
      .getByRole("radio", { name: "Ahorn & Nussbaum" }),
  ).toHaveAttribute("aria-checked", "true");
  await oeffneProfil(page);
  await expect(page.getByTestId("ich-lernziele")).toHaveText(/^1 von \d+$/);
  const merker = await page.evaluate(() => [
    localStorage.getItem("svga.einstellungen"),
    localStorage.getItem("svga.lernstand"),
  ]);
  expect(merker).toEqual([null, null]);
  await page.reload();
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Brett" }).click();
  await expect(
    page
      .getByRole("radiogroup", { name: "Brettfarben" })
      .getByRole("radio", { name: "Ahorn & Nussbaum" }),
  ).toHaveAttribute("aria-checked", "true");
});

test("Datensicherung: Export auf einem Gerät, Import auf einem anderen", async ({
  page,
  browser,
}) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneAbbildung(page, "2.1", "2.1");
  await page.clock.runFor(VERWEILZEIT_MS);
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Brett" }).click();
  await page.getByRole("radio", { name: "Grün", exact: true }).click();
  await expect(page.getByTestId("letzte-sicherung")).toHaveText("Noch keine Sicherung angelegt.");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Daten sichern (Datei)" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(
    /^schach-von-grund-auf-sicherung-\d{4}-\d{2}-\d{2}\.json$/,
  );
  await expect(page.getByTestId("letzte-sicherung")).toContainText("Letzte Sicherung:");
  const datei = await download.path();

  // Zweites Gerät: eigener Browserkontext, also eigener Speicher.
  const anderes = await browser.newContext({ ...test.info().project.use });
  const zweite = await anderes.newPage();
  await starteImBrowser(zweite);
  await oeffneProfil(zweite);
  await expect(zweite.getByTestId("ich-abbildungen")).toHaveText(/^0 von/);
  await zweite.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await zweite.getByTestId("sicherung-datei").setInputFiles(datei);
  const frage = zweite.getByRole("alertdialog", { name: "Sicherung einspielen" });
  await expect(frage).toContainText("Abbildungen angesehen: 1");
  await zweite.screenshot({ path: "test-results/bilder/sicherung-rueckfrage.png", fullPage: true });
  await frage.getByRole("button", { name: "Ja, Daten ersetzen" }).click();
  await expect(zweite.getByText("Sicherung eingespielt.")).toBeVisible();
  await zweite.getByRole("tab", { name: "Brett" }).click();
  await expect(zweite.getByRole("radio", { name: "Grün", exact: true })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await oeffneProfil(zweite);
  await expect(zweite.getByTestId("ich-abbildungen")).toHaveText(/^1 von/);
  await zweite.reload();
  await oeffneProfil(zweite);
  await expect(zweite.getByTestId("ich-abbildungen")).toHaveText(/^1 von/);
  await anderes.close();
});

test("Datensicherung: fremde Datei wird abgelehnt, Abbrechen ändert nichts", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  const auswahl = page.getByTestId("sicherung-datei");
  await auswahl.setInputFiles({
    name: "notizen.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"titel":"Einkauf"}'),
  });
  await expect(page.getByText("Diese Datei ist keine Sicherung dieser App.")).toBeVisible();
  const leer = JSON.stringify({
    art: "schach-von-grund-auf/nutzerdaten",
    appVersion: "0.2.22",
    exportiert: "2026-10-15T10:00:00.000Z",
    daten: { schemaVersion: 1, einstellungen: { brettfarben: "holz" } },
  });
  await auswahl.setInputFiles({
    name: "s.json",
    mimeType: "application/json",
    buffer: Buffer.from(leer),
  });
  await page.getByRole("button", { name: "Abbrechen" }).click();
  await page.getByRole("tab", { name: "Brett" }).click();
  const brettfarben = page.getByRole("radiogroup", { name: "Brettfarben" });
  await expect(brettfarben.getByRole("radio", { name: "wie im Buch" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
});

/** Das Löschen der Datenbanken dauert unter Last (parallele Tests) gelegentlich länger als 5 s. */
const LOESCHZEIT_MS = 15_000;

test("Alle Daten löschen entfernt auch die Datenbank mit dem Fortschritt", async ({ page }) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.clock.runFor(VERWEILZEIT_MS);
  await oeffneProfil(page);
  await expect(page.getByTestId("ich-abbildungen")).toHaveText(/^1 von/);
  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await page.getByRole("button", { name: "Alle Daten dieser App löschen" }).click();
  await page.getByRole("button", { name: "Ja, alles löschen" }).click();
  await expect(page.getByText("Alle Daten sind gelöscht.")).toBeVisible({ timeout: LOESCHZEIT_MS });
  await oeffneProfil(page);
  await expect(page.getByTestId("ich-abbildungen")).toHaveText(/^0 von/);
  const datenbanken = await page.evaluate(async () => (await indexedDB.databases()).length);
  expect(datenbanken).toBe(0);
});

test("Hinweis auf die Datensicherung nach vier Stunden App-Zeit, „Später“ und „Nicht mehr nachfragen“ (0.2.32)", async ({
  page,
}) => {
  const ZWEI_MINUTEN_MS = 2 * 60_000;
  // Fast vier Stunden App-Zeit, ohne sie im Browser abzuspulen (die Zählung prüft
  // app/sicherungshinweis.test.ts); der Test spult nur die letzten Minuten vor.
  const fastVierStunden = () =>
    page.evaluate(() =>
      localStorage.setItem("svga.appzeit", JSON.stringify({ seitSicherung: null, ms: 14_340_000 })),
    );
  await page.clock.install();
  await starteImBrowser(page);
  const hinweis = page.getByTestId("sicherungshinweis");
  // Ohne eigene Daten gibt es nichts zu sichern: kein Hinweis.
  await fastVierStunden();
  await page.clock.runFor(ZWEI_MINUTEN_MS);
  await expect(hinweis).toHaveCount(0);
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.clock.runFor(VERWEILZEIT_MS);
  await fastVierStunden();
  await page.clock.runFor(ZWEI_MINUTEN_MS);
  await expect(hinweis).toContainText("ohne Datensicherung");
  // „Später“ blendet ihn aus, die Zählung beginnt neu.
  await hinweis.getByRole("button", { name: "Später" }).click();
  await expect(hinweis).toHaveCount(0);
  await page.clock.runFor(ZWEI_MINUTEN_MS);
  await expect(hinweis).toHaveCount(0);
  await fastVierStunden();
  await page.clock.runFor(ZWEI_MINUTEN_MS);
  await expect(hinweis).toBeVisible();
  // „Nicht mehr nachfragen“: dauerhaft aus, auch nach dem Neuladen.
  await hinweis.getByRole("checkbox", { name: "Nicht mehr nachfragen" }).click();
  await expect(hinweis).toHaveCount(0);
  await page.reload();
  await page.clock.runFor(ZWEI_MINUTEN_MS);
  await expect(hinweis).toHaveCount(0);
});

test("Fehlerarten (0.2.60): eine Achse aus und eine Stufe überleben das Neuladen", async ({
  page,
}) => {
  await starteImBrowser(page);
  // Seit 0.2.80 beim Spielen; seit 0.2.135 (Variante A) im Reiter „Fehler“ als Netz.
  const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
  await leiste.getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("tab", { name: "Fehler (9)" }).click();
  const netz = page.getByTestId("fehlernetz");
  const figuren = netz.getByRole("radio", { name: "Figuren: aus", exact: true });
  const eroeffnung = netz.getByRole("radio", { name: "Eröffnung: oft", exact: true });
  await figuren.click();
  await eroeffnung.click();
  await expect(page.getByRole("tab", { name: "Fehler (7)" })).toBeVisible();
  await page.reload();
  await leiste.getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("tab", { name: "Fehler (7)" }).click();
  await expect(figuren).toHaveAttribute("aria-checked", "true");
  await expect(eroeffnung).toHaveAttribute("aria-checked", "true");
  // Seit 0.2.139 stehen die Vorlagen in einer Auswahlliste wie bei den Stilachsen.
  await page
    .getByTestId("fehlerprofil")
    .getByRole("combobox", { name: "Vorlage" })
    .selectOption({ label: "Keine Fehler" });
  await expect(page.getByRole("tab", { name: "Fehler (0)" })).toBeVisible();
});
