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
  // Seit 31.10.2026 (Entwurf H2): die Eröffnungen als Baum ihrer ersten Züge, je eine Karte.
  await expect(page.getByTestId("steckbrief")).toHaveCount(13);
  await expect(page.locator(".baum-wurzel .baum-zug")).toHaveText(["1. e4", "1. d4"]);
  // Ein Tipp öffnet den vollständigen Steckbrief; seit 0.3.9 (Paket F) mit Diagramm der
  // Schlussstellung der Hauptvariante aus dem Buch.
  await page.getByTestId("steckbrief").filter({ hasText: "Spanische Partie" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Spanische Partie" })).toBeVisible();
  await expect(page.getByText("1. e4 e5 2. Sf3 Sc6 3. Lb5")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Schlussstellung der Hauptvariante (Abb. 2.11)" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Steckbriefe", exact: true }).click();
  // Die Fallenchecks haben eine eigene Seite.
  await page.getByRole("button", { name: /^Fallenchecks/ }).click();
  await expect(page.getByTestId("fallencheck")).toHaveCount(14);
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
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("radio", { name: "Eigene Bots" }).click();
  await expect(page.getByRole("radio", { name: /Bauklotz/ }).locator("img")).toHaveAttribute(
    "src",
    /^data:image\/svg\+xml/,
  );
});
