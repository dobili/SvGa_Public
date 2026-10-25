/**
 * Oberflächentests zu den Wünschen des Autors vom 19.10.2026 (0.2.99): Steckbriefe und Werkzeuge
 * in Nachschlagen, Porträt für eigene Bots, Spielhilfen über „Partie beginnen“.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

test("Nachschlagen: Steckbriefe mit Fallencheck und Werkzeuge des Buches", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Steckbriefe/ }).click();
  await expect(page.getByTestId("steckbrief")).toHaveCount(13);
  const falle = page.getByTestId("fallencheck").filter({ hasText: "Klammerfalle" });
  await falle.locator("summary").click();
  await expect(falle).toContainText("Wer tappt hinein?");
  await falle.getByRole("button", { name: "Zum Stopp-Moment (Abb. 4.2)" }).click();
  await expect(page.getByRole("heading", { name: "Abb. 4.2" })).toBeVisible();
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Werkzeuge des Buches/ }).click();
  await page.locator(".werkzeugeintrag summary", { hasText: "Röntgen" }).first().click();
  await expect(page.getByText(/Regel: Kapitel 1, Schach-Röntgen-Regel/)).toBeVisible();
});

test("Eigener Bot mit Porträt; Spielhilfen stehen über „Partie beginnen“", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  const hilfen = page.getByRole("checkbox", { name: /Gewertete Partie/ });
  const beginnen = page.getByRole("button", { name: "Partie beginnen" });
  // Seit 0.2.129 (DS40) klebt „Partie beginnen“ unten im Bild; an seinem Platz (ganz nach unten
  // gescrollt) steht es unter den Einstellungen.
  await expect(beginnen).toBeInViewport();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const [yHilfen, yBeginnen] = await Promise.all([hilfen.boundingBox(), beginnen.boundingBox()]);
  expect(yHilfen?.y ?? 0).toBeLessThan(yBeginnen?.y ?? 0);
  await page.getByRole("radio", { name: "Eigene Bots" }).click();
  await page.getByRole("button", { name: "Neuen Gegner anlegen" }).click();
  await page.getByLabel("Name").fill("Tante Erna");
  // Seit 0.2.140 eine Klappe mit derselben Porträtwahl wie im Profil (Auswählen, Selbst
  // gestalten, Kein Bild); die Vorschau steht in der Zusammenfassung.
  const klappe = page.getByTestId("portraetklappe");
  await klappe.locator("summary").click();
  await klappe.getByRole("radio", { name: "Auswählen" }).click();
  await expect(
    page.getByRole("radiogroup", { name: "Bild wählen oder gestalten" }).locator("img"),
  ).toHaveCount(30);
  await page.getByTitle("Ältere Frau mit Dutt und Brille").click();
  await expect(klappe.locator("summary img")).toHaveAttribute("src", /gegner\/wahl-25\.svg$/);
  await page.getByRole("button", { name: "Gegner speichern" }).click();
  await page.getByRole("radio", { name: /Tante Erna/ }).click();
  const blase = page.getByTestId("gegner-sprechblase");
  await expect(blase.locator("img")).toHaveAttribute("src", /gegner\/wahl-25\.svg$/);
  // R28: In der Partie steht der Bot als Titel; sein Porträt seit 0.2.124 darunter im Untertitel
  // (Wunsch des Autors, 24.10.2026), daneben sein Satz.
  await beginnen.click();
  await expect(page.getByRole("heading", { name: "gegen Tante Erna" })).toBeVisible();
  const gegnerzeile = page.getByTestId("partie-gegnerzeile");
  await expect(gegnerzeile.locator("img")).toHaveAttribute("src", /gegner\/wahl-25\.svg$/);
  await expect(gegnerzeile).toContainText("Dein eigener Gegner");
});

test("Eigener Bot mit selbst gebautem Porträt (Baukasten, 0.2.140)", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("radio", { name: "Eigene Bots" }).click();
  await page.getByRole("button", { name: "Neuen Gegner anlegen" }).click();
  await page.getByLabel("Name").fill("Bauklotz");
  const klappe = page.getByTestId("portraetklappe");
  await klappe.locator("summary").click();
  await klappe.getByRole("radio", { name: "Selbst gestalten" }).click();
  await klappe.getByLabel("Bart").selectOption({ label: "Vollbart" });
  await expect(klappe.locator("summary img")).toHaveAttribute("src", /^data:image\/svg\+xml/);
  await page.getByRole("button", { name: "Gegner speichern" }).click();
  await page.getByRole("radio", { name: /Bauklotz/ }).click();
  await expect(page.getByTestId("gegner-sprechblase").locator("img")).toHaveAttribute(
    "src",
    /^data:image\/svg\+xml/,
  );
  // Übersteht das Neuladen.
  await page.reload();
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("radio", { name: "Eigene Bots" }).click();
  await expect(page.getByRole("radio", { name: /Bauklotz/ }).locator("img")).toHaveAttribute(
    "src",
    /^data:image\/svg\+xml/,
  );
});
