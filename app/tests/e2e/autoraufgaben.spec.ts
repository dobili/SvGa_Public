/**
 * Oberflächentests der Aufgabenseite des Autors (seit 0.2.75): drei Sekunden auf „Profil“
 * öffnen sie, ein kurzer Tipp nicht; Haken und Notiz landen im Text für den Chat; ein Link
 * öffnet seinen Bildschirm, „Zurück“ führt mit erhaltenem Stand zurück. Die Punkte ändern sich
 * mit jeder Version der Aufgabendatei; der Test nimmt deshalb den ersten Punkt, den es gibt.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

const profilKnopf = (page: Page) =>
  page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Profil", exact: true });

/** Die Adresse /app/#aufgaben öffnet die Seite beim Start der App (am Rechner). */
async function oeffneUeberAdresse(page: Page): Promise<void> {
  await page.goto("/app/#aufgaben");
  await page.reload();
}

test("Langer Druck auf „Profil“ öffnet die Aufgabenseite, ein kurzer Tipp das Profil", async ({
  page,
}) => {
  await page.clock.install();
  await starteImBrowser(page);
  await profilKnopf(page).click();
  await expect(page.getByTestId("autor-aufgaben")).toHaveCount(0);
  await profilKnopf(page).hover();
  await page.mouse.down();
  await page.clock.runFor(3100);
  await page.mouse.up();
  await page.clock.resume();
  await expect(page.getByRole("heading", { name: "Aufgaben des Autors" })).toBeVisible();
});

test("Abhaken, Notiz, Link und zurück; der Text für den Chat enthält beides", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneUeberAdresse(page);
  await expect(page.getByRole("heading", { name: "Aufgaben des Autors" })).toBeVisible();
  // Der neueste Abschnitt ist beim ersten Öffnen aufgeklappt.
  const erster = page.locator(".aufgabenabschnitt[open] .aufgabenpunkt").first();
  await expect(erster).toBeVisible();
  const id = ((await erster.getAttribute("data-testid")) ?? "").replace("aufgabe-", "");
  await erster.getByRole("checkbox", { name: `${id} erledigt` }).check();
  await erster.getByRole("button", { name: "Notiz" }).click();
  await erster.getByRole("textbox", { name: `Notiz zu ${id}` }).fill("Pfeil fehlt");
  await page.getByText("Text für den Chat ansehen").click();
  const text = page.getByTestId("autor-text");
  await expect(text).toContainText(`${id} ok: Pfeil fehlt`);
  // Ein Link im Abschnitt öffnet seinen Bildschirm; zurück ist der Haken noch da.
  const link = page.locator(".aufgabenabschnitt[open] .aufgabenlink").first();
  if ((await link.count()) > 0) {
    await link.click();
    await expect(page.getByTestId("autor-aufgaben")).toHaveCount(0);
    // Der Knopf über der Leiste führt zurück (iPhone ohne Zurück-Taste), ebenso die Zurück-Taste.
    await page.getByRole("button", { name: "‹ Zurück zu den Aufgaben" }).click();
    await expect(page.getByTestId("autor-aufgaben")).toBeVisible();
    await expect(page.getByRole("button", { name: "‹ Zurück zu den Aufgaben" })).toHaveCount(0);
    await link.click();
    await page.goBack();
    await expect(page.getByTestId("autor-aufgaben")).toBeVisible();
  } else {
    await oeffneUeberAdresse(page);
  }
  await expect(page.getByTestId(`aufgabe-${id}`).getByRole("checkbox")).toBeChecked();
});

test("„Zurück zu den Aufgaben“ führt zum zuletzt angetippten Punkt, nicht an den Anfang (N307)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneUeberAdresse(page);
  // Ein Abschnitt weit unten (von hinten der erste mit Link), damit die Seite beim Zurückkommen
  // scrollen muss. Zugeklappte Abschnitte zeigen ihre Punkte erst nach dem Aufklappen.
  const abschnitte = page.locator(".aufgabenabschnitt");
  await expect(abschnitte.first()).toBeVisible();
  let nummer = (await abschnitte.count()) - 1;
  for (; nummer > 0; nummer--) {
    const a = abschnitte.nth(nummer);
    if ((await a.getAttribute("open")) === null) await a.locator("summary").click();
    await expect(a).toHaveAttribute("open", "");
    // Nur Links in Punkten zählen: Erläuterungen ohne Haken (etwa „schon umgesetzt“) haben
    // auch Links, aber keinen Punkt, zu dem die Seite zurückkehren könnte.
    if ((await a.locator(".aufgabenpunkt .aufgabenlink").count()) > 0) break;
  }
  const abschnitt = abschnitte.nth(nummer);
  const link = abschnitt.locator(".aufgabenpunkt .aufgabenlink").last();
  const punkt = link.locator("xpath=ancestor::*[contains(@class, 'aufgabenpunkt')][1]");
  const id = ((await punkt.getAttribute("data-testid")) ?? "").replace("aufgabe-", "");
  await link.click();
  await expect(page.getByTestId("autor-aufgaben")).toHaveCount(0);
  await page.getByRole("button", { name: "‹ Zurück zu den Aufgaben" }).click();
  await expect(page.getByTestId(`aufgabe-${id}`)).toBeInViewport();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test("Orden testen: Ring zur Probe voll, Gratulation mit Orden, Profil und Startanimation", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneUeberAdresse(page);
  const probe = page.getByTestId("orden-probe");
  await probe.locator("summary").click();
  await probe
    .getByRole("button", { name: "Übungen gelöst: auf 100 % setzen", exact: true })
    .click();
  // Die Gratulation kommt sofort, mit dem Orden des Rings.
  const feier = page.getByTestId("ringfeier");
  await expect(feier.getByRole("img", { name: "Orden: Übungen gelöst" })).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/orden-feier.png" });
  await feier.getByRole("button", { name: "Weiter" }).click();
  await expect(
    probe.getByRole("button", { name: "Übungen gelöst: auf 100 % setzen", exact: true }),
  ).toBeDisabled();
  // Die Startanimation zeigt den Orden als Stück des Tages (beim ersten Start gilt nichts als neu).
  // Die Hilfe merkt sich vor jedem Laden, dass die Animation schon lief; das hier hebt es auf.
  await page.addInitScript(() => window.sessionStorage.removeItem("svga.startanimation.sitzung"));
  await page.reload();
  const stueck = page.getByTestId("startstueck");
  await expect(stueck.locator('[data-ordenkunst="uebungen"]')).toBeAttached();
  await expect(stueck).toContainText("Aus deiner Sammlung");
  await page.screenshot({ path: "test-results/bilder/orden-startanimation.png" });
  await page.getByTestId("startanimation").click();
  await expect(stueck).toHaveCount(0);
  // Probe beenden: der Ring zählt wieder echt (Aufgabenseite neu öffnen, die Animation wegtippen).
  await page.goto("/app/#aufgaben");
  await page.reload();
  await page.getByTestId("startanimation").click();
  await probe.locator("summary").click();
  await probe.getByRole("button", { name: "Probe beenden" }).click();
  await expect(
    probe.getByRole("button", { name: "Übungen gelöst: auf 100 % setzen", exact: true }),
  ).toBeEnabled();
});
