/**
 * Bildschirmfotos der neuen Auswertung (Entwurf F2 „Zeitleiste der Partie“, 31.10.2026) in
 * Handybreite, dunkel und hell. Eingespielt wird eine fertig ausgewertete Partie gegen Derya mit
 * den Zügen der Opernpartie (1858); Werte und beste Züge sind für das Bild erfunden, damit ein
 * Fehler (8. Sc3?), ein Patzer (12. O-O-O??) und drei absichtliche Fehler der Engine vorkommen.
 * Ohne Engine: Die App liest die Werte aus dem Speicher. Die Bilder landen in test-results/bilder/
 * für den Bericht an den Autor; dazu prüft der Test die wichtigsten Teile der Seite.
 */
import { expect, test } from "@playwright/test";
import { oeffnePartie } from "./auswertungpartie";
import { starteImBrowser } from "./hilfen";

for (const schema of ["dunkel", "hell"] as const) {
  test(`Auswertung neu: Bilder der Zeitleiste (${schema})`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await starteImBrowser(page);
    await oeffnePartie(page, schema);
    await expect(page.getByTestId("partieende")).toContainText("Gewonnen");
    await expect(page.getByTestId("partieende")).toContainText("im 17. Zug");
    const zeitleiste = page.getByTestId("zeitleiste");
    await expect(zeitleiste.getByTestId("moment-abweichung")).toContainText("8. Sc3?");
    await expect(zeitleiste.getByTestId("moment-abweichung")).toContainText("Besser war 8. Dxb7");
    await expect(zeitleiste.getByTestId("moment-fehler")).toContainText("12. O-O-O??");
    await expect(zeitleiste.getByTestId("moment-engine")).toHaveCount(3);
    await expect(zeitleiste.getByTestId("moment-engine").nth(1)).toContainText(
      "Du hast es gesehen und genutzt.",
    );
    await expect(zeitleiste.getByTestId("moment-ende")).toContainText("Matt");
    // „Deine Züge“ mit der Originalgrafik: 17 eigene Züge, also Balken mit Zonen.
    await expect(page.getByTestId("zugklasse-patzer").locator(".zugklasse-spur")).toBeVisible();
    await page.screenshot({ path: `test-results/bilder/auswertung-${schema}.png`, fullPage: true });
    // Befunde der Vorprüfung (1.11.2026): Auf der Seite des Bots heißt die Karte nach ihm, und
    // unter 9... b5 steht kein „Besser war 9... b5“ (der beste Zug war der gespielte). Seit Q12-3
    // (1.11.2026) bekommt 9... b5 als bester Zug auch kein „??“ mehr, obwohl die Gewinnchance fällt.
    await expect(page.getByTestId("zugklassen")).toContainText("Deine Züge");
    const seiten = page.getByTestId("in-zahlen").getByRole("radiogroup", { name: "Seite" });
    await seiten.getByRole("radio", { name: "Schwarz (Derya)" }).click();
    await expect(page.getByTestId("zugklassen")).toContainText("Züge von Derya");
    await expect(zeitleiste).toContainText("9... b5");
    await expect(zeitleiste).not.toContainText("9... b5?");
    await expect(zeitleiste).not.toContainText("Besser war 9... b5");
    await seiten.getByRole("radio", { name: "Weiß (du)" }).click();
    await expect(page.getByTestId("zugklassen")).toContainText("Deine Züge");
    await page.getByTestId("partieabschluss").getByRole("button", { name: "Teilen" }).click();
    await expect(page.getByTestId("teilen-blatt")).toBeVisible();
    await page.screenshot({ path: `test-results/bilder/auswertung-teilen-${schema}.png` });
    await page.getByTestId("teilen-blatt").getByRole("button", { name: "Schließen" }).click();
    // Ein Moment springt aufs Brett: Merken öffnet dort ein Blatt.
    await zeitleiste
      .getByTestId("moment-fehler")
      .getByRole("button", { name: "Zur Stellung" })
      .click();
    await page.getByTestId("merken-schalter").click();
    await expect(page.getByTestId("merken-blatt")).toBeVisible();
    await page.screenshot({ path: `test-results/bilder/auswertung-merken-${schema}.png` });
  });
}
