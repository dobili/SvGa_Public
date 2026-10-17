/**
 * Oberflächentests der ersten Trainer (AP 13 Teil 2): Koordinaten (Feld finden, Zug aufschreiben,
 * Gangarten), Zähltrainer (Bilanz, hängende Figuren), Schach-Röntgen-Trainer. Die Aufgaben sind
 * zufällig; die Tests lesen deshalb den Auftrag oder prüfen nur den Ablauf.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

async function oeffneTrainer(page: Page, kennung: string): Promise<void> {
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Training" })
    .click();
  await page.getByTestId(`trainer-${kennung}`).getByRole("button", { name: "Trainieren" }).click();
  await expect(page.getByTestId("trainer")).toBeVisible();
}

const feld = (page: Page, name: string) =>
  page.getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

test("Feld finden: sechzehn Felder aus beiden Perspektiven, Ergebnis mit Zeit", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await page.getByRole("button", { name: /Feld finden/ }).click();
  const auftrag = page.getByTestId("feld-auftrag");
  for (let i = 0; i < 16; i += 1) {
    await expect(page.getByText(`Aufgabe ${i + 1} von 16`)).toBeVisible();
    const text = (await auftrag.textContent()) ?? "";
    const gesucht = text.replace("Tippe auf ", "").trim();
    if (i === 8) await page.screenshot({ path: "test-results/bilder/trainer-felder.png" });
    await feld(page, gesucht).click();
  }
  const ende = page.getByTestId("runde-ende");
  await expect(ende).toContainText("16 von 16 Aufgaben richtig");
  await expect(ende).toContainText("Sekunden");
  await ende.getByRole("button", { name: "Andere Übung" }).click();
  await expect(page.getByRole("button", { name: /Gangarten/ })).toBeVisible();
});

test("Zug aufschreiben: falsche Schreibweise, das Buch schreibt den Zug", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await page.getByRole("button", { name: /Zug aufschreiben/ }).click();
  await page.getByRole("textbox", { name: "Zug in Notation" }).fill("Qa1");
  await page.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.getByTestId("trainer")).toContainText("Das Buch schreibt");
});

test("Gangarten: Prüfen ohne Tipp zeigt die Zielfelder, Weiter zur zweiten Aufgabe", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await page.getByRole("button", { name: /Gangarten/ }).click();
  await page.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.getByTestId("trainer")).toContainText("Zielfelder");
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByText("Aufgabe 2 von 8")).toBeVisible();
});

test("Zähltrainer: Bilanz zählen zeigt die Rechnung der App", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "zaehlen");
  await page.getByRole("button", { name: /Bilanz zählen/ }).click();
  const runde = page.getByTestId("trainerrunde");
  await runde
    .getByRole("group", { name: "Angreifer", exact: true })
    .getByRole("button", { name: "1", exact: true })
    .click();
  await runde
    .getByRole("group", { name: "Verteidiger" })
    .getByRole("button", { name: "1", exact: true })
    .click();
  await runde.getByRole("button", { name: "lohnt nicht" }).click();
  await runde.getByRole("button", { name: "Prüfen" }).click();
  await expect(page.getByTestId("zaehl-rechnung")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/trainer-zaehlen.png", fullPage: true });
});

test("Schach-Röntgen-Trainer: drei Schritte, dann Weiter", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "roentgen");
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Schritt 1 von 3");
  for (const naechster of [true, true, false]) {
    await runde.getByRole("button", { name: "Prüfen" }).click();
    await expect(runde.getByRole("status")).toBeVisible();
    if (naechster) await runde.getByRole("button", { name: "Nächster Schritt" }).click();
  }
  await page.screenshot({ path: "test-results/bilder/trainer-roentgen.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 5");
});

test("Taktiktrainer: Thema und Stufe wählen, Hilfen, Lösung zeigen, Motiv benennen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "taktik");
  const wahl = page.getByTestId("taktik-wahl");
  await wahl.getByRole("button", { name: /^Spieß/ }).click();
  await wahl.getByRole("button", { name: "2", exact: true }).click();
  await wahl.getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 8");
  await runde.getByRole("button", { name: "Hinweis 1" }).click();
  await expect(runde).toContainText("Warnsignal:");
  await runde.getByRole("button", { name: "Hinweis 2" }).click();
  await expect(page.getByTestId("taktik-motiv")).toContainText("Spieß");
  await runde.getByRole("button", { name: "Lösung zeigen" }).click();
  await expect(runde).toContainText("Lösung:");
  const benennen = page.getByTestId("motiv-benennen");
  await benennen.getByRole("button", { name: "Spieß" }).click();
  await expect(benennen).toContainText("Richtig!");
  await page.screenshot({ path: "test-results/bilder/trainer-taktik.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 8");
});

test("Falle oder Köder: Warnsignale prüfen, entscheiden, Auflösung", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "falle");
  await page.getByTestId("falle-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Falle oder Geschenk?");
  await runde.getByRole("button", { name: /Warnsignale prüfen/ }).click();
  await expect(page.getByTestId("falle-warnsignale")).toBeVisible();
  await runde.getByRole("button", { name: "Nicht nehmen" }).click();
  await expect(runde).toContainText(/Eine Falle|Ein Geschenk/);
  await expect(runde).toContainText("Fortsetzung laut Engine:");
  await page.screenshot({ path: "test-results/bilder/trainer-falle.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 8");
});

test("Strukturerkenner: schwache Bauern prüfen, Plan wählen", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "struktur");
  await page.getByTestId("struktur-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Schritt 1 von 2");
  await runde.getByRole("button", { name: "Prüfen" }).click();
  await expect(runde).toContainText("Schritt 2 von 2");
  await runde.locator(".plan-satz").first().click();
  await expect(runde).toContainText("Struktur:");
  await page.screenshot({ path: "test-results/bilder/trainer-struktur.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 8");
});

test("Wiederholung (U9): falsch gelöste Taktikaufgabe kommt nach einem Tag wieder", async ({
  page,
}) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneTrainer(page, "taktik");
  await expect(page.getByTestId("trainer-wiederholung")).toHaveCount(0);
  await page.getByTestId("taktik-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await runde.getByRole("button", { name: "Hinweis 1" }).click();
  await runde.getByRole("button", { name: "Hinweis 2" }).click();
  await runde.getByRole("button", { name: "Lösung zeigen" }).click();
  await expect(runde).toContainText("Lösung:");
  const training = page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Training" });
  await training.click();
  await expect(page.getByTestId("faellig")).toContainText("Als Nächstes am");
  await page.clock.fastForward("48:00:00");
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Buch" })
    .click();
  await training.click();
  await page
    .getByTestId("faellig")
    .getByRole("button", { name: /Taktiktrainer: 1 fällig/ })
    .click();
  await page.getByTestId("trainer-wiederholung").getByRole("button").click();
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von 1");
});

test("Zielbilanz-Übung: Tabelle für beide Seiten ausfüllen, App zeigt ihre Wertung", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "zielbilanz");
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 5");
  const pruefen = runde.getByRole("button", { name: "Prüfen" });
  await expect(pruefen).toBeDisabled();
  for (const seite of ["white", "black"]) {
    const tabelle = page.getByTestId(`zielbilanz-${seite}`);
    for (const ziel of ["Zentrum", "Entwicklung", "Königssicherheit"]) {
      await tabelle
        .getByRole("group", { name: ziel })
        .getByRole("button", { name: "ja", exact: true })
        .click();
    }
  }
  await pruefen.click();
  await expect(runde.getByText(/^App: (ja|teils|nein)$/)).toHaveCount(6);
  await expect(page.getByTestId("zielbilanz-begruendung")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/trainer-zielbilanz.png", fullPage: true });
  await runde.getByRole("button", { name: "Weiter" }).click();
  await expect(runde).toContainText("Aufgabe 2 von 5");
});
