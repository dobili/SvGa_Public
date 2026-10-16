/**
 * Oberflächentests für das Spiel gegen die Engine (AP 11): Partie beginnen, ziehen, Antwort der
 * Engine, Rücknahme, Fortsetzen nach dem Neuladen, Start an einer Abbildung mit Schwarz,
 * ein Zug, der ein Matt erlaubt, wird ohne Rückfrage gespielt (seit 0.2.32), Ergebnis und
 * Rücknahme nach dem Matt.
 */
import { expect, type Page } from "@playwright/test";
import { test } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

/** Die Engine rechnet im Browser; der erste Start lädt die WASM-Datei. */
const ENGINE_FRIST = 30_000;

async function ziehe(seite: Page, von: RegExp, nach: string): Promise<void> {
  await seite.getByRole("button", { name: von }).click();
  await seite.getByRole("button", { name: nach, exact: true }).click();
}

async function warteAufLeser(seite: Page): Promise<void> {
  await expect(seite.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
    timeout: ENGINE_FRIST,
  });
}

test("Partie aus der Grundstellung: Engine antwortet, Rücknahme, Fortsetzen nach Neuladen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await expect(page.getByRole("heading", { name: "Spielen" })).toBeVisible();
  await page.getByRole("radio", { name: "5 + 3" }).click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByRole("heading", { name: "Partie gegen die Engine" })).toBeVisible();
  await expect(page.getByText("Stufe 1 · Einsteiger · du spielst Weiß")).toBeVisible();
  await expect(page.getByTestId("uhr-white")).toContainText("5:00");
  await ziehe(page, /^e2, Bauer/, "e4");
  await expect(page.getByTestId("partiezuege")).toContainText("1. e4");
  await warteAufLeser(page);
  await expect(page.getByTestId("partiezuege").getByRole("button")).toHaveCount(2);
  await page.getByRole("button", { name: "Zurücknehmen" }).click();
  await expect(page.getByTestId("partiezuege")).toHaveText("Noch keine Züge.");
  await ziehe(page, /^d2, Bauer/, "d4");
  await warteAufLeser(page);
  await page.screenshot({ path: "test-results/bilder/partie.png", fullPage: true });
  await page.reload();
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await expect(page.getByTestId("laufende-partie")).toBeVisible();
  await page.getByRole("button", { name: "Weiterspielen" }).click();
  await expect(page.getByTestId("partiezuege")).toContainText("1. d4");
  await expect(page.getByTestId("partiezuege").getByRole("button")).toHaveCount(2);
});

test("Abb. 1.26: gegen die Engine mit Schwarz, ruhige Ansicht, Aufgeben", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.getByRole("button", { name: "Gegen die Engine spielen" }).click();
  await expect(page.getByRole("heading", { name: "Aus der Stellung von Abb. 1.26" })).toBeVisible();
  await page.getByRole("radio", { name: "Schwarz" }).click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await warteAufLeser(page);
  await expect(page.getByTestId("partiezuege")).toContainText("6.");
  await page.getByRole("button", { name: "Ruhige Ansicht" }).click();
  await expect(page.getByRole("button", { name: "Aufgeben" })).toHaveCount(0);
  await expect(page.getByTestId("spielhinweis")).toHaveCount(0);
  await page.getByRole("button", { name: "Ruhige Ansicht" }).click();
  await page.getByRole("button", { name: "Aufgeben" }).click();
  await page.getByRole("button", { name: "Ja, aufgeben" }).click();
  await expect(page.getByTestId("partieende")).toContainText("Du hast aufgegeben.");
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await expect(page.getByText("Deine letzten Partien")).toBeVisible();
  await expect(page.getByTestId("laufende-partie")).toHaveCount(0);
});

test("2. g4?? erlaubt Matt ohne Rückfrage, Auswertung, nach dem Matt zurücknehmen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByText("Eigene Stellung eingeben (FEN)").click();
  await page
    .getByLabel("Stellung als FEN")
    .fill("rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2");
  await page.getByRole("button", { name: "Stellung übernehmen" }).click();
  await page.getByRole("radio", { name: "8 · Experte" }).click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  // Seit 0.2.32 ohne Rückfrage (Wunsch des Autors): Der Zug wird sofort gespielt.
  await ziehe(page, /^g2, Bauer/, "g4");
  await expect(page.getByTestId("partieende")).toContainText("Matt. Die Engine hat gewonnen.", {
    timeout: ENGINE_FRIST,
  });
  const auswertung = page.getByTestId("auswertung");
  await expect(auswertung).toContainText("Erste klare Abweichung: 2. g4??", {
    timeout: ENGINE_FRIST,
  });
  await expect(page.getByTestId("partiezuege")).toContainText("2. g4??");
  await auswertung.getByRole("button", { name: "Zur Stellung" }).click();
  await expect(page.getByRole("button", { name: "2. g4??" })).not.toHaveAttribute("aria-current");
  await auswertung.getByRole("button", { name: "PGN kopieren" }).click();
  await expect(auswertung).toContainText(/PGN/);
  await page.screenshot({ path: "test-results/bilder/auswertung.png", fullPage: true });
  await page.getByRole("button", { name: "Zurücknehmen" }).click();
  await expect(page.getByTestId("partieende")).toHaveCount(0);
  await expect(page.getByTestId("partiezuege")).toHaveText("Noch keine Züge.");
});

test("Werkzeuge in der Partie (0.2.33): Röntgen, W1–W7, Zählen am Brett, Bündel, Ziehen bleibt", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  const werkzeuge = page.getByRole("group", { name: "Werkzeuge am Brett" });
  await werkzeuge.getByRole("button", { name: "Röntgen" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toBeVisible();
  // Röntgen zeigt nur an: Der Zug geht weiter.
  await ziehe(page, /^e2, Bauer/, "e4");
  await warteAufLeser(page);
  await werkzeuge.getByRole("button", { name: "W1–W7" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toBeVisible();
  // Zählen: Ein Tipp zählt das Feld, statt zu ziehen.
  await werkzeuge.getByRole("button", { name: "Zählen" }).click();
  await expect(page.getByText("Tippe ein Feld an")).toBeVisible();
  await page.getByRole("button", { name: /^e4, Bauer/ }).click();
  await expect(page.getByTestId("werkzeugkarte")).toBeVisible();
  await expect(page.getByTestId("partiezuege").getByRole("button")).toHaveCount(2);
  // Abwählen: wieder ziehen.
  await werkzeuge.getByRole("button", { name: "Zählen" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toHaveCount(0);
  // Bündel unter dem Brett, mit Reitern; sie zeigen nur an, gezogen wird weiter.
  await page.getByRole("toolbar").getByRole("button", { name: "Denkroutine" }).click();
  await page.getByRole("tab", { name: "Phase" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toContainText("Eröffnung");
  await ziehe(page, /^d2, Bauer/, "d4");
  await expect(page.getByTestId("partiezuege")).toContainText("2. d4");
});
