/**
 * Oberflächentest zu Paket 9: feste Eröffnungen eigener Bots. Im Gegnereditor die Klappe
 * „Eröffnungen“ mit Haken (Buch und nach Spielstärke), Schnellwahl im Variantenbaum, Regler
 * „Abweichung“ und Satz in der Beschreibung; im Spielfenster der Vorrang des Bots (globale Wahl
 * ausgegraut, Haken zum Überschreiben) und eine Partie, in der der Bot seiner Eröffnung folgt.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";
import {
  oeffneEroeffnungswahl,
  oeffneSpielen,
  oeffneSpielseite,
  schliessePartieEinstellen,
  startknopf,
} from "./spielenhilfen";

/** So lange darf der erste Zug des Bots dauern (Engine im Browser). */
const ENGINE_FRIST = 30_000;

test("Eigener Bot mit festen Eröffnungen: Editor, Vorrang im Spielfenster, Partie", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneSpielen(page);
  await oeffneSpielseite(page, "eigene");
  const karte = page.getByTestId("eigene-gegner");
  await karte.getByRole("button", { name: "Neuen Gegner anlegen" }).click();
  await page.getByLabel("Name").fill("Erna");
  const klappe = page.getByTestId("bot-eroeffnungen");
  await klappe.locator(":scope > summary").click();
  await expect(klappe).toContainText("Noch keine feste Eröffnung.");
  // Eröffnungen nach Spielstärke mit Haken, Schnellwahl im Variantenbaum
  const staerke = klappe.getByTestId("staerkewahl");
  await staerke.locator(":scope > summary").click();
  const italienisch = staerke.getByRole("button", { name: /^Italienische Partie/ });
  await italienisch.click();
  await expect(italienisch).toHaveAttribute("aria-pressed", "true");
  const zeile = staerke.locator("li", {
    has: page.getByRole("button", { name: /^Italienische Partie/ }),
  });
  await zeile.getByTestId("variantenbaum").locator("summary").first().click();
  await zeile.getByRole("button", { name: "Die häufigsten 3" }).click();
  await expect(klappe.locator(":scope > summary")).toHaveText("Eröffnungen (4)");
  await zeile.getByRole("button", { name: "Die häufigsten 5" }).click();
  await expect(klappe.locator(":scope > summary")).toHaveText("Eröffnungen (6)");
  // Einzelhaken: ein zweiter Tipp nimmt die Eröffnung wieder heraus
  await italienisch.click();
  await expect(italienisch).toHaveAttribute("aria-pressed", "false");
  await klappe.getByRole("button", { name: "Alle entfernen" }).click();
  await expect(klappe.locator(":scope > summary")).toHaveText("Eröffnungen (0)");
  // Nur das London-System, Abweichung 0 %: Der Bot eröffnet sicher mit 1. d4 und 2. Lf4.
  await staerke.getByRole("button", { name: /^London-System/ }).click();
  await expect(klappe.getByTestId("boteroeffnungen-gewaehlt")).toContainText("London-System");
  await expect(klappe.getByLabel("Abweichung: 0 %")).toHaveValue("0");
  await expect(page.getByTestId("bot-beschreibung")).toContainText("Eröffnet gern: London-System.");
  await karte.getByRole("button", { name: "Gegner speichern" }).click();
  await page.getByRole("radio", { name: "Erna" }).click();
  // Blatt „Partie einstellen“: Die globale Wahl ist ausgegraut, der Haken gibt sie frei
  await oeffneEroeffnungswahl(page);
  const vorrang = page.getByTestId("bot-eroeffnung-vorrang");
  await expect(vorrang).toContainText("Erna hat feste Eröffnungen: London-System.");
  await expect(page.locator("#eroeffnung")).toBeDisabled();
  const haken = vorrang.getByRole("checkbox", { name: "Eröffnung des Bots überschreiben" });
  await haken.check();
  await expect(page.locator("#eroeffnung")).toBeEnabled();
  await haken.uncheck();
  await expect(page.locator("#eroeffnung")).toBeDisabled();
  // Partie mit Schwarz: Der Bot folgt dem London-System
  await page.getByRole("button", { name: "Zurück zu den Einstellungen" }).click();
  await page.getByRole("radio", { name: "Schwarz" }).click();
  await schliessePartieEinstellen(page);
  await startknopf(page).click();
  const zuege = page.getByTestId("partiezuege");
  await expect(zuege).toContainText("1. d4", { timeout: ENGINE_FRIST });
});
