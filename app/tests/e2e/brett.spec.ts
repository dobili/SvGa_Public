/**
 * Oberflächentests für Brett und Bedienung (Paket P2): Zuganimation (R37), Ergebnis auf dem
 * Brett (R38), Startanimation (R39), Wechsel der Spalten mit der Fenstergröße (R40).
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

async function beginnePartie(seite: Page): Promise<void> {
  await seite.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await seite.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(seite.getByRole("heading", { name: "Partie gegen die Engine" })).toBeVisible();
}

/** Merkt sich auf der Seite jeden Zug, dessen Figur über das Brett glitt („e2e4“). */
async function beobachteAnimation(seite: Page): Promise<void> {
  await seite.evaluate(() => {
    const fenster = window as unknown as { geglitten: string[] };
    fenster.geglitten = [];
    new MutationObserver(() => {
      for (const element of document.querySelectorAll("[data-testid='zuganimation']")) {
        const zug = element.getAttribute("data-zug") ?? "";
        if (!fenster.geglitten.includes(zug)) fenster.geglitten.push(zug);
      }
    }).observe(document.body, { childList: true, subtree: true });
  });
}

async function geglitten(seite: Page): Promise<string[]> {
  return seite.evaluate(() => (window as unknown as { geglitten: string[] }).geglitten);
}

test("Zuganimation (R37): ein Zug per Tipp gleitet, der Zug der Engine auch", async ({ page }) => {
  await starteImBrowser(page);
  await beginnePartie(page);
  await beobachteAnimation(page);
  await page.getByRole("button", { name: /^e2, Bauer/ }).click();
  await page.getByRole("button", { name: "e4", exact: true }).click();
  await expect(page.getByTestId("partiezuege")).toContainText("1. e4");
  await expect(page.getByTestId("partiezuege").getByRole("button")).toHaveCount(2, {
    timeout: 20_000,
  });
  await expect.poll(() => geglitten(page), { timeout: 20_000 }).toHaveLength(2);
  expect((await geglitten(page))[0]).toBe("e2e4");
});

test("Zuganimation (R37): nach Ziehen per Wischen gleitet der eigene Zug nicht", async ({
  page,
}) => {
  await starteImBrowser(page);
  await beginnePartie(page);
  await beobachteAnimation(page);
  const start = await page.getByRole("button", { name: /^g1, Springer/ }).boundingBox();
  const ziel = await page.getByRole("button", { name: "f3", exact: true }).boundingBox();
  if (!start || !ziel) throw new Error("Felder nicht sichtbar");
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(ziel.x + ziel.width / 2, ziel.y + ziel.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByTestId("partiezuege")).toContainText("1. Sf3");
  expect(await geglitten(page)).not.toContain("g1f3");
});

test("Zuganimation (R37): in den Einstellungen abgeschaltet gleitet nichts", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await page.getByRole("tab", { name: "Brett" }).click();
  const schalter = page.getByRole("radiogroup", { name: "Züge gleiten über das Brett" });
  await expect(schalter.getByRole("radio", { name: "an" })).toHaveAttribute("aria-checked", "true");
  await schalter.getByRole("radio", { name: "aus" }).click();
  await beginnePartie(page);
  await beobachteAnimation(page);
  await page.getByRole("button", { name: /^d2, Bauer/ }).click();
  await page.getByRole("button", { name: "d4", exact: true }).click();
  await expect(page.getByTestId("partiezuege")).toContainText("1. d4");
  expect(await geglitten(page)).toEqual([]);
});

test("Ergebnis auf dem Brett (R38): erscheint beim Matt, verschwindet, die Karte bleibt", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByText("Eigene Stellung eingeben (FEN)").click();
  await page
    .getByLabel("Stellung als FEN")
    .fill("rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2");
  await page.getByRole("button", { name: "Stellung übernehmen" }).click();
  for (const phase of ["Eröffnung", "Mittelspiel", "Endspiel"]) {
    await page.getByLabel(new RegExp(`^${phase}:`)).fill("8");
  }
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await page.getByRole("button", { name: /^g2, Bauer/ }).click();
  await page.getByRole("button", { name: "g4", exact: true }).click();
  const blende = page.getByTestId("ergebnisblende");
  await expect(blende).toContainText("Verloren", { timeout: 30_000 });
  await expect(blende).toContainText("Matt");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "test-results/bilder/ergebnisblende.png" });
  await expect(blende).toHaveCount(0, { timeout: 5_000 });
  await expect(page.getByTestId("partieende")).toContainText("Matt. Die Engine hat gewonnen.");
  // Eine schon beendete Partie neu öffnen zeigt die Blende nicht noch einmal.
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.locator(".partienliste li.partieeintrag").first().getByRole("button").first().click();
  await expect(page.getByTestId("partieende")).toBeVisible();
  await expect(blende).toHaveCount(0);
});

test("Startanimation (R39): goldener Springer beim Start, Tipp überspringt, nicht beim Neuladen", async ({
  page,
}) => {
  await starteImBrowser(page, { startanimation: true });
  const start = page.getByTestId("startanimation");
  await expect(start).toBeVisible();
  await expect(start).toHaveAccessibleName("Startbild überspringen");
  await start.click();
  await expect(start).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(start).toHaveCount(0);
});

test("Fenstergröße (R40): zwei Spalten ab 5 : 4, eine Spalte darunter, live beim Ändern", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  const spalten = () =>
    page.evaluate(
      () =>
        getComputedStyle(document.querySelector(".brettbereich")?.parentElement ?? document.body)
          .display,
    );
  await expect.poll(spalten).toBe("grid");
  // Schmaler, aber noch quer (900 × 800): jetzt schon eine Spalte, ohne Neuladen.
  await page.setViewportSize({ width: 900, height: 800 });
  await expect.poll(spalten).not.toBe("grid");
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect.poll(spalten).toBe("grid");
  await expect(page.getByRole("heading", { name: "Abb. 1.26" })).toBeVisible();
});
