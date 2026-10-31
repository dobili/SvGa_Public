/**
 * Oberflächentests zu den Wünschen des Autors vom 19.10.2026 (0.2.99): Steckbriefe und Werkzeuge
 * in Nachschlagen, Porträt für eigene Bots, „Spielen“ in der Startleiste der Seite „Eigene Bots“.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";
import { oeffneSpielen, oeffneSpielseite, startknopf } from "./spielenhilfen";

test("Nachschlagen: Steckbriefe mit Fallencheck und Werkzeuge des Buches", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Steckbriefe/ }).click();
  await expect(page.getByTestId("steckbrief")).toHaveCount(13);
  // Seit 0.3.9 (Paket F): Diagramm der Schlussstellung der Hauptvariante aus dem Buch.
  const spanisch = page.getByTestId("steckbrief").filter({ hasText: "Spanische Partie" });
  await spanisch.locator("summary").click();
  await expect(
    spanisch.getByRole("button", { name: "Schlussstellung der Hauptvariante (Abb. 2.11)" }),
  ).toBeVisible();
  const falle = page.getByTestId("fallencheck").filter({ hasText: "Klammerfalle" });
  await falle.locator("summary").click();
  await expect(falle).toContainText("Wer tappt hinein?");
  // Der Stopp-Moment als Diagramm (seit 0.3.9), ein Tipp öffnet die Abbildung.
  await falle.getByTestId("stellungsbild").click();
  await expect(page.getByRole("heading", { name: "Abb. 4.2" })).toBeVisible();
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Werkzeuge des Buches/ }).click();
  await page.locator(".werkzeugeintrag summary", { hasText: "Röntgen" }).first().click();
  await expect(page.getByText(/Regel: Kapitel 1, Schach-Röntgen-Regel/)).toBeVisible();
  // Seit 0.3.9 (Paket F): Bildschirmfoto des Werkzeugs, geladen, mit Knopf zum Ausprobieren.
  const bild = page.getByRole("img", { name: /das Werkzeug „Röntgen“ an Abb\. 1\.23/ });
  await expect(bild).toBeVisible();
  await expect
    .poll(() => bild.evaluate((el) => (el as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "An Abb. 1.23 ausprobieren" }).click();
  await expect(page.getByRole("heading", { name: "Abb. 1.23" })).toBeVisible();
});

test("Eigener Bot mit Porträt; „Spielen“ bleibt in der Startleiste im Bild", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneSpielen(page);
  // Seit „Spielen neu“ (J3) eine eigene Seite mit fester Startleiste (DS40).
  await oeffneSpielseite(page, "eigene");
  const beginnen = startknopf(page);
  await expect(beginnen).toBeInViewport();
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
  await oeffneSpielen(page);
  await oeffneSpielseite(page, "eigene");
  await page.getByRole("button", { name: "Neuen Gegner anlegen" }).click();
  await page.getByLabel("Name").fill("Bauklotz");
  const klappe = page.getByTestId("portraetklappe");
  await klappe.locator("summary").click();
  await klappe.getByRole("radio", { name: "Selbst gestalten" }).click();
  await klappe.getByRole("radio", { name: "Vollbart", exact: true }).click();
  await expect(klappe.locator("summary img")).toHaveAttribute("src", /^data:image\/svg\+xml/);
  await page.getByRole("button", { name: "Gegner speichern" }).click();
  await page.getByRole("radio", { name: /Bauklotz/ }).click();
  await expect(page.getByTestId("gegner-sprechblase").locator("img")).toHaveAttribute(
    "src",
    /^data:image\/svg\+xml/,
  );
  // Übersteht das Neuladen.
  await page.reload();
  await oeffneSpielen(page);
  await oeffneSpielseite(page, "eigene");
  await expect(page.getByRole("radio", { name: /Bauklotz/ }).locator("img")).toHaveAttribute(
    "src",
    /^data:image\/svg\+xml/,
  );
});
