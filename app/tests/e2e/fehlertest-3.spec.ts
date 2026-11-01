/**
 * Oberflächentests zu den Fehlern aus dem dritten großen Fehlertest (f3, 01.11.2026): geteilte
 * Links bei offener App, Startwahl und Touren mit der Leiste unten, Zurück-Taste über der
 * Startwahl, „Los geht's“ aus dem Profil, Maia ohne Netz, voller Gerätespeicher, Fokus und Esc
 * der Gratulationen. Jeder Test hält einen behobenen Fehler fest.
 */
import { expect, test, type Page } from "@playwright/test";
import {
  ladeMitSprung,
  oeffneAbbildung,
  oeffneEinstellungen,
  oeffneEinstellungsseite,
  oeffneProfil,
  starteImBrowser,
} from "./hilfen";

/** Breite eines kleinen Handys. */
const HANDY = { width: 360, height: 800 };

/** Der Bereich, den die Leiste unten als aktiv zeigt. */
function aktiverBereich(page: Page) {
  return page.locator(".leiste [aria-current='page']");
}

/** Der gesicherte Navigationsstapel (Merker svga.stapel) als Liste der Bildschirme. */
async function stapel(page: Page): Promise<string[]> {
  const text = await page.evaluate(() => window.localStorage.getItem("svga.stapel"));
  const roh = JSON.parse(text ?? "{}") as { stapel?: { ansichten?: { bildschirm: string }[] } };
  return (roh.stapel?.ansichten ?? []).map((a) => a.bildschirm);
}

test("geteilter Link bei offener App: Die Herausforderung öffnet ohne Neuladen", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  // Nur der Teil hinter „#“ ändert sich: Der Browser lädt nicht neu (zweiter Link im selben Tab).
  await page.evaluate(() => {
    window.location.hash = "#aufgabe-taktik-l-1Vybh";
  });
  const ansicht = page.getByTestId("herausforderung");
  await expect(ansicht.getByText("Jemand hat dir diese Aufgabe geschickt.")).toBeVisible();
  await expect(page).toHaveURL(/\/app\/$/);
  // Wie beim Start aus dem Link: „Zurück“ führt ins Training, wie es der Knopf sagt.
  await ansicht.getByRole("button", { name: "Training" }).click();
  await expect(page.getByRole("heading", { name: "Training", level: 1 })).toBeVisible();
});

test("Startwahl aus den Einstellungen: der Weg „spielen“ wechselt in den Bereich Spielen", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Hilfe" }).click();
  await page.getByRole("button", { name: "Rundgang durch die App" }).click();
  await page.getByRole("button", { name: "Ich will spielen und Partien auswerten" }).click();
  await expect(page.getByTestId("tour")).toBeVisible();
  await expect(aktiverBereich(page)).toHaveAccessibleName("Spielen");
  expect(await stapel(page)).toEqual(["spielen"]);
});

test("Startwahl „Ich lese das Buch“ legt kein zweites Buch auf den Stapel", async ({ page }) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page, { tourAngebot: true });
  await page.getByRole("button", { name: "Ich lese das Buch" }).click();
  await expect(page.getByTestId("tour")).toBeVisible();
  expect(await stapel(page)).toEqual(["buch"]);
});

test("Zurück-Taste bei offener Startwahl schließt sie wie „Später“", async ({ page }) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Hilfe" }).click();
  await page.getByRole("button", { name: "Rundgang durch die App" }).click();
  await expect(page.getByTestId("tour-angebot")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Profil", level: 1 })).toBeVisible();
  await expect(page.getByTestId("tour-angebot")).toHaveCount(0);
});

test("„Los geht's“ im Profil zu „Erste Partie“: Bereich Spielen, Leiste passend", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneProfil(page);
  await page.getByTestId("abzeichen-erstePartie").getByRole("button").click();
  await page.getByTestId("infofenster").getByRole("button", { name: "Los geht's" }).click();
  await expect(page.getByRole("heading", { name: "Spielen" })).toBeVisible();
  await expect(aktiverBereich(page)).toHaveAccessibleName("Spielen");
});

test("Maia laden ohne Netz: ein klarer Satz statt „Failed to fetch“", async ({ page, context }) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneEinstellungsseite(page, "Bots und Wertung");
  await context.setOffline(true);
  const wahl = page.getByTestId("maia-wahl");
  await wahl.getByRole("button", { name: /^Maia laden/ }).click();
  await expect(wahl.getByRole("alert")).toHaveText(
    /^Ohne Internetverbindung lässt sich Maia nicht laden\./,
  );
  await expect(wahl).not.toContainText("Failed to fetch");
  await context.setOffline(false);
});

/** Verweilzeit, nach der eine Abbildung als angesehen zählt (wie speicher.spec.ts). */
const VERWEILZEIT_MS = 31_000;

test("voller Gerätespeicher: eigene Meldung, kein Absturz, nichts geht verloren", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  // Die Datenbank meldet „voll“, solange window.voll gilt (wie ein Browser bei vollem Speicher).
  await page.addInitScript(() => {
    const fenster = window as unknown as { voll: boolean };
    fenster.voll = false;
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...werte: Parameters<typeof put>) {
      if (fenster.voll) throw new DOMException("Der Speicher ist voll", "QuotaExceededError");
      return put.apply(this, werte);
    };
  });
  await page.clock.install();
  await starteImBrowser(page);
  await page.evaluate(() => ((window as unknown as { voll: boolean }).voll = true));
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.clock.runFor(VERWEILZEIT_MS);
  const hinweis = page.locator(".speicher-hinweis");
  await expect(hinweis).toContainText("Der Speicher dieses Geräts ist voll");
  await expect(page.getByTestId("absturzseite")).toHaveCount(0);
  // Wieder Platz: Das nächste Speichern schreibt alles nach, der Hinweis geht.
  await page.evaluate(() => ((window as unknown as { voll: boolean }).voll = false));
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Buch", exact: true })
    .click();
  await oeffneAbbildung(page, "1.27", "1.27");
  await page.clock.runFor(VERWEILZEIT_MS);
  await expect(hinweis).toHaveCount(0);
  await page.reload();
  await oeffneProfil(page);
  await expect(page.getByTestId("ich-abbildungen")).toHaveText(/^2 von \d+$/);
});

test("Gratulation zum vollen Ring: Fokus auf „Weiter“, Tab bleibt in der Karte, Esc schließt", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await starteImBrowser(page);
  await ladeMitSprung(page, "/app/#aufgaben");
  const probe = page.getByTestId("orden-probe");
  await probe.locator("summary").click();
  const voll = probe.getByRole("button", { name: "Übungen gelöst: auf 100 % setzen", exact: true });
  await voll.click();
  const feier = page.getByRole("dialog", { name: "Ring voll, herzlichen Glückwunsch!" });
  await expect(feier.getByRole("button", { name: "Weiter" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(feier.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("ringfeier")).toHaveCount(0);
  // Der Probeknopf ist danach gesperrt; der Fokus kann nicht zu ihm zurück.
  await expect(voll).toBeDisabled();
  await probe.getByRole("button", { name: "Probe beenden" }).click();
});
