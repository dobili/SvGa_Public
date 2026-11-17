/**
 * Datensicherung mit Partien und verdienten Stücken (Vortest der offenen Testpunkte,
 * 17.11.2026): Die Rückfrage nennt die Zahl der Partien (N2465); nach dem Einspielen auf einem
 * zweiten Gerät kommt keine Gratulation zu alten Ringen oder Abzeichen (N2495); nach Mitternacht
 * tragen Sicherung und PGN den neuen Tag (N2467, Ortszeit Berlin).
 */
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { eintrag, spielePartienEin } from "./auswertungpartie";
import { oeffneEinstellungsseite, oeffneProfil, starteImBrowser } from "./hilfen";
import { gesehenFuer, setzeDaten } from "./zustand";

/** So lange darf eine (unerwünschte) Gratulation nach dem Laden erscheinen (ms). */
const FEIER_FRIST_MS = 2500;
const HOECHSTENS_FEIERN = 6;

/** Alle Übungen der Kapitel als gelöst (füllt Ringe, die eine Gratulation auslösen). */
function geloesteUebungen(kapitel: readonly number[]) {
  const ergebnis: Record<string, unknown> = {};
  for (const k of kapitel) {
    const datei = new URL(`../../public/daten/de/a1/kap0${k}.json`, import.meta.url);
    const daten = JSON.parse(readFileSync(datei, "utf-8")) as { uebungen: { id: string }[] };
    for (const u of daten.uebungen) {
      ergebnis[u.id] = { kapitel: k, versuche: 1, geloest: true, zuletzt: "2026-11-10T09:00:00Z" };
    }
  }
  return ergebnis;
}

/**
 * Schließt Gratulationen und Abzeichen-Meldungen auf dem ersten Gerät. Wichtig: Erst eine
 * gezeigte Meldung trägt das Datum in „verdient“ ein (speicher/verdient.ts), und nur das reist mit
 * der Sicherung; ein Leser hat die Meldung auf dem ersten Gerät ja gesehen.
 */
async function schliesseFeiern(seite: Page): Promise<void> {
  const feiern = [seite.getByTestId("ringfeier"), seite.getByTestId("abzeichenmeldung")];
  for (let i = 0; i < HOECHSTENS_FEIERN; i++) {
    await seite.waitForTimeout(FEIER_FRIST_MS);
    const offen = (await Promise.all(feiern.map((f) => f.count()))).findIndex((n) => n > 0);
    if (offen < 0) return;
    await feiern[offen]?.getByRole("button", { name: "Weiter" }).first().click();
  }
}

test("Sicherung: Rückfrage nennt die Partien, auf dem zweiten Gerät keine alten Gratulationen (N2465, N2495)", async ({
  page,
  browser,
}) => {
  await starteImBrowser(page, { abzeichenMeldung: true });
  await spielePartienEin(page, [eintrag()]);
  await setzeDaten(page, {
    fortschritt: {
      gesehen: gesehenFuer([0, 1]),
      uebungen: geloesteUebungen([0, 1]),
      trainer: {},
      warum: {},
      eingeschaetzt: {},
    },
  });
  await schliesseFeiern(page);
  await oeffneEinstellungsseite(page, "Deine Daten");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Daten sichern (Datei)" }).click(),
  ]);
  const datei = await download.path();
  // Zweites Gerät, diesmal mit Abzeichen-Meldungen wie bei einem echten Leser.
  const anderes = await browser.newContext({ ...test.info().project.use });
  const zweite = await anderes.newPage();
  await starteImBrowser(zweite, { abzeichenMeldung: true });
  await oeffneEinstellungsseite(zweite, "Deine Daten");
  await zweite.getByTestId("sicherung-datei").setInputFiles(datei);
  const frage = zweite.getByRole("alertdialog", { name: "Sicherung einspielen" });
  await expect(frage).toContainText("Partien: 1");
  await frage.getByRole("button", { name: "Ja, Daten ersetzen" }).click();
  await expect(zweite.getByText("Sicherung eingespielt.")).toBeVisible();
  await zweite.reload();
  await oeffneProfil(zweite);
  await zweite.waitForTimeout(FEIER_FRIST_MS);
  await expect(zweite.getByTestId("ringfeier")).toHaveCount(0);
  await expect(zweite.getByTestId("abzeichenmeldung")).toHaveCount(0);
  await anderes.close();
});

test.describe("Ortszeit Berlin", () => {
  test.use({ timezoneId: "Europe/Berlin" });

  test("Nach Mitternacht: Sicherung und PGN tragen den neuen Tag (N2467)", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-11-18T00:30:00+01:00") });
    await starteImBrowser(page);
    // Die Partie begann um 0:20 Uhr Ortszeit, in UTC noch am 17.
    const partie = eintrag();
    await spielePartienEin(page, [
      { ...partie, partie: { ...partie.partie, begonnen: "2026-11-17T23:20:00.000Z" } },
    ]);
    await oeffneEinstellungsseite(page, "Deine Daten");
    const [sicherung] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Daten sichern (Datei)" }).click(),
    ]);
    expect(sicherung.suggestedFilename()).toBe("schach-von-grund-auf-sicherung-2026-11-18.json");
    await oeffneProfil(page);
    await page
      .locator(".partienliste li.partieeintrag")
      .first()
      .locator(".partiezeile-oeffnen")
      .click();
    await page.getByTestId("partieabschluss").getByRole("button", { name: "Teilen" }).click();
    const [pgn] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "PGN als Datei sichern" }).click(),
    ]);
    const text = readFileSync(await pgn.path(), "utf-8");
    expect(text).toContain('[Date "2026.11.18"]');
  });
});
